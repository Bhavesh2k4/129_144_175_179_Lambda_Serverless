import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { tmpdir } from 'os';
import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

const BUCKET = 'cc-project-dheeraj';
const REGION = 'ap-south-1';

const s3 = new S3Client({ region: REGION });

export async function GET(req: NextRequest) {
  try {
    console.log('[1] Start Nanos function execution');

    const pathname = req.nextUrl.pathname;
    const parts = pathname.split('/');
    const userId = parts[3];
    const handler = parts[4];

    console.log(`[1.1] Extracted userId=${userId}, handler=${handler}`);

    const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries());

    console.log('[2] Looking for function in DB...');
    const func = await db.function.findFirst({
      where: {
        userId,
        handler: handler.toLowerCase(),
      },
    });

    if (!func) {
      console.warn('[2.1] Function not found in DB');
      return NextResponse.json({ error: 'Function not found' }, { status: 404 });
    }

    const runtime = func.runtime.toLowerCase(); // nodejs / python
    const extension = runtime.includes('node') ? '.js' : '.py';
    const entryFile = `${handler.split('.')[0]}${extension}`;
    const s3Key = func.s3Key;

    console.log('[3] Fetching function code from S3:', s3Key);
    const s3Res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: s3Key }));
    const code = await s3Res.Body?.transformToString();
    if (!code) throw new Error('Could not read function file from S3');
    console.log('[3.1] Code fetched from S3');

    const tempId = uuidv4();
    const tempPath = path.join(tmpdir(), tempId);
    await fs.mkdir(tempPath);

    const codeFile = path.join(tempPath, entryFile);
    await fs.writeFile(codeFile, code);
    console.log('[4] Code written to:', codeFile);

    const opsArgs = [
      'pkg', 'load',
      runtime.includes('node') ? 'eyberg/node:20.5.0' : 'eyberg/python:3.10.6',
      '-n',
      '-a', entryFile,
    ];

    // Pass CLI args
    for (const val of Object.values(queryParams)) {
      opsArgs.push('-a', val);
    }

    console.log('[5] Running OPS command:', opsArgs.join(' '));

    const stdout: string[] = [];
    const stderr: string[] = [];

    const start = Date.now();
    const timeoutMs = (func.timeout ?? 30) * 1000;
    let didTimeout = false;

    const statusCode = await new Promise<number>((resolve, reject) => {
      const proc = spawn('ops', opsArgs, { cwd: tempPath });

      const timeout = setTimeout(() => {
        didTimeout = true;
        const msg = `[!] Nanos timed out after ${timeoutMs / 1000}s`;
        console.warn(msg);
        stderr.push(msg);
        proc.kill('SIGKILL');
      }, timeoutMs);

      proc.stdout.on('data', (data) => {
        stdout.push(data.toString());
      });

      proc.stderr.on('data', (data) => {
        stderr.push(data.toString());
      });

      proc.on('close', (code) => {
        clearTimeout(timeout);
        console.log(`[6] OPS exited with code ${code}`);
        resolve(code ?? 1);
      });

      proc.on('error', (err) => {
        clearTimeout(timeout);
        console.error('[OPS spawn error]', err);
        reject(err);
      });
    });

    await fs.rm(tempPath, { recursive: true, force: true });
    console.log('[7] Temp files cleaned up');

    const durationMs = Date.now() - start;

    return NextResponse.json({
      status: statusCode,
      stdout: stdout.join('').trim().split('\n').pop(),
      stderr: stderr.join('').trim(),
      timeout: didTimeout,
      durationMs,
    });
  } catch (err: any) {
    console.error('[Function Nanos Exec Error]', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
