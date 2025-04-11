'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Clock, Server, Terminal, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import Link from 'next/link'

type ServerlessFunction = {
  id: string
  name: string
  description: string
  runtime: string
  handler: string
  timeout: number
  memory: number
  s3Key: string
  userId: string
}

export default function FunctionListPage() {
  const [functions, setFunctions] = useState<ServerlessFunction[]>([])
  const [functionToDelete, setFunctionToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/user/functions')
      .then(res => res.json())
      .then(data => {
        setFunctions(data.functions)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error('Failed to load functions')
        setIsLoading(false)
      })
  }, [])

  const handleDelete = async () => {
    if (!functionToDelete) return
    
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/user/functions/${functionToDelete}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Function deleted successfully')
        setFunctions(prev => prev.filter(fn => fn.id !== functionToDelete))
      } else {
        const error = await res.json()
        toast.error(error.message || 'Failed to delete function')
      }
    } catch (err) {
      toast.error('An error occurred while deleting the function')
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setFunctionToDelete(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setFunctionToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const getExecutionUrl = (fn: ServerlessFunction, type: 'docker' | 'nanos') => {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/function/${fn.userId}/${fn.handler}/${type}`
  }

  // Find the function name for delete dialog
  const functionNameToDelete = functionToDelete 
    ? functions.find(fn => fn.id === functionToDelete)?.name 
    : '';

  // Loading skeleton component
  const LoadingSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="flex flex-col overflow-hidden border-muted">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-5 w-16 bg-muted animate-pulse rounded-full"></div>
            </div>
            <div className="h-4 w-full bg-muted animate-pulse rounded mt-2"></div>
          </CardHeader>
          
          <CardContent className="pb-2 flex-grow">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 border-t bg-muted/20">
            <div className="flex gap-2 w-full">
              <div className="h-8 flex-1 bg-muted animate-pulse rounded"></div>
              <div className="h-8 flex-1 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-10 bg-muted animate-pulse rounded"></div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Functions</h1>
        <Link href="/user/">
          <Button variant="outline" className="hover:cursor-pointer">Dashboard</Button>
        </Link>
      </div>

      {isLoading ? (
        // Show loading skeleton while data is being fetched
        <LoadingSkeletons />
      ) : functions.length === 0 ? (
        // No functions found after loading
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No functions uploaded yet</h3>
          <p className="text-muted-foreground mb-4">Create your first serverless function to get started.</p>
          <Link href="/user/new">
            <Button variant="default" className="hover:cursor-pointer">Create Function</Button>
          </Link>
        </div>
      ) : (
        // Functions loaded successfully
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {functions.map(fn => (
            <Card key={fn.id} className="flex flex-col overflow-hidden border-muted transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{fn.name}</CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    {fn.runtime}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{fn.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2 flex-grow">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{fn.handler}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span>{fn.memory} MB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{fn.timeout}s timeout</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 border-t bg-muted/20">
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(getExecutionUrl(fn, 'docker'))
                      toast.success('Docker URL copied to clipboard')
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" /> Docker
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(getExecutionUrl(fn, 'nanos'))
                      toast.success('Nanos Unikernel URL copied to clipboard')
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" /> Nanos Unikernel
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-10 hover:cursor-pointer"
                    onClick={() => openDeleteDialog(fn.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Improved Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Function</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{functionNameToDelete}</span>?
              This action cannot be undone and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster richColors position="bottom-right" />
    </div>
  )
}