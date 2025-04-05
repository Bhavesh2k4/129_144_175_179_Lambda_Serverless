'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Toaster } from "@/components/ui/sonner"

export default function NewFunctionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const res = await fetch('/api/user/functions/new', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      toast.success('Function uploaded successfully!')
      router.push('/user/functions')
    } else {
        const data = await res.json()
        if (data.error?.includes('Function already exists')) {
          toast.error('Function with this name already exists. Please choose a different name.')
        } else {
          toast.error('Upload failed. Please try again.')
        }
        console.error(data.error)        
    }

    setLoading(false)
  }

  return (
    <>
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Upload New Function</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <Label>Name</Label>
          <Input name="name" required />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea name="description" placeholder="Optional function description" />
        </div>

        <div>
          <Label>Runtime</Label>
          <Select name="runtime" required>
            <SelectTrigger>
              <SelectValue placeholder="Select runtime" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="nodejs">Node.js</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Handler</Label>
          <div className="flex justify-between m-1">
            <p className="text-[8px] text-gray-500 mb-1 leading-relaxed">
              <strong>Example:</strong> Filename: <code>main.py</code><br />
              <code>def run(event, context):</code><br />
              <code>&nbsp;&nbsp;&nbsp;&nbsp;return &#123;</code><br />
              <code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;statusCode&quot;: 200,</code><br />
              <code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;body&quot;: &quot;Hello Python!&quot;</code><br />
              <code>&nbsp;&nbsp;&nbsp;&nbsp;&#125;</code><br />
              Handler: <code>main.run</code>
            </p>

            <p className="text-[8px] text-gray-500 mb-1 leading-relaxed">
              <strong>Example:</strong> Filename: <code>index.js</code><br />
              <code>exports.handler = async (event, context) =&gt; &#123;</code><br />
              <code>&nbsp;&nbsp;return &#123;</code><br />
              <code>&nbsp;&nbsp;&nbsp;&nbsp;statusCode: 200,</code><br />
              <code>&nbsp;&nbsp;&nbsp;&nbsp;body: "Hello from Node.js!"</code><br />
              <code>&nbsp;&nbsp;&#125;;</code><br />
              <code>&#125;;</code><br />
              Handler: <code>index.handler</code>
            </p>
          </div>
          <Input name="handler" placeholder="e.g., main.run" required />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Timeout (sec)</Label>
            <Input name="timeout" type="number" defaultValue={30} required />
          </div>
          <div className="flex-1">
            <Label>Memory (MB)</Label>
            <Input name="memory" type="number" defaultValue={128} required />
          </div>
        </div>

        <div>
          <Label>Upload File</Label>
          <Input type="file" name="functionFile" className='hover:cursor-pointer' required />
        </div>

        <Button type="submit" className="hover:cursor-pointer" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Function'}
        </Button>
      </form>
    </div>
    <Toaster position="top-right" richColors />
    </>
  )
}
