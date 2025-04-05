import LoginButton from '@/components/auth/login-button'
import { Button } from '@/components/ui/button'
import React from 'react'

const Home = () => {
  return (
    <main className='flex items-center justify-center flex-col h-full'>
      <div className='space-y-6 text-center'>
        <h1 className='text-4xl font-bold'>Auth 🔐</h1>
        <p className='text-lg'>Authentication with Next.js</p>
        <div>
          <LoginButton>
          <Button variant="default" size="lg" className='hover:cursor-pointer'>Sign In</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}

export default Home 