import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { tmpdir } from 'os';
import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

const BUCKET = 'cc-project-lambda';
const REGION = 'ap-south-1';

const s3 = new S3Client({ region: REGION });

export async function GET(req: NextRequest) {
  try {
    console.log('[1] Start function execution route');

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

    const runtime = func.runtime.toLowerCase();
    const extension = runtime.includes('node') ? '.js' : '.py';
    const dockerImage = runtime.includes('node') ? 'node:18' : 'python:3.9';
    const entryFile = `${handler.split('.')[0]}${extension}`;
    const s3Key = func.s3Key;

    console.log('[3] Fetching function code from S3:', s3Key);
    const s3Res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: s3Key }));
    const code = await s3Res.Body?.transformToString();
    if (!code) throw new Error('Could not read function file from S3');
    console.log('[3.1] Code fetched from S3 successfully');

    const tempId = uuidv4();
    const tempPath = path.join(tmpdir(), tempId);
    await fs.mkdir(tempPath);
    const codeFile = path.join(tempPath, entryFile);
    await fs.writeFile(codeFile, code);
    console.log('[4] Code written to temp path:', codeFile);

    const timeoutMs = (func.timeout ?? 30) * 1000;
    const memoryLimitMb = func.memory ?? 128;
    const start = Date.now(); // Track duration

    const containerCmd = [
      'docker', 'run', '--rm',
      '--memory', `${memoryLimitMb}m`,
      '--memory-swap', `${memoryLimitMb}m`,
      '-v', `${tempPath}:/app`,
      '-w', '/app',
      dockerImage,
      runtime.includes('node') ? 'node' : 'python3',
      entryFile,
      ...Object.values(queryParams),
    ];
    console.log('[5] Running Docker command:', containerCmd.join(' '));

    const stdout: string[] = [];
    const stderr: string[] = [];
    let didTimeout = false;

    const statusCode = await new Promise<number>((resolve, reject) => {
      const proc = spawn(containerCmd[0], containerCmd.slice(1));

      const timeout = setTimeout(() => {
        const msg = `[!] Docker timed out after ${timeoutMs / 1000}s`;
        console.warn(msg);
        stderr.push(msg + '\n');
        didTimeout = true;
        proc.kill('SIGKILL');
      }, timeoutMs);

      proc.stdout.on('data', (data) => {
        const msg = data.toString();
        stdout.push(msg);
        console.log('[stdout]', msg);
      });

      proc.stderr.on('data', (data) => {
        const msg = data.toString();
        stderr.push(msg);
        console.error('[stderr]', msg);
      });

      proc.on('close', (code) => {
        clearTimeout(timeout);
        console.log(`[6] Docker process exited with code ${code}`);
        resolve(didTimeout ? 124 : (code ?? 1));
      });

      proc.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    await fs.rm(tempPath, { recursive: true, force: true });
    console.log('[7] Temp files cleaned up');

    return NextResponse.json({
      status: statusCode,
      stdout: stdout.join('').trim(),
      stderr: stderr.join('').trim(),
      timeout: didTimeout,
      durationMs: Date.now() - start,
    });

  } catch (err: any) {
    console.error('[Function Docker Exec Error]', err);
    return NextResponse.json({ error: err.message || 'Internal Error' }, { status: 500 });
  }
}
