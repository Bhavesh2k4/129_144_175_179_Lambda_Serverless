"use client"
import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_USER_REDIRECT } from '@/routes'

const Social = () => {
  const onClick = (provider : "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_USER_REDIRECT,
    })
  }
  return (
    <div className='flex items-center w-full  gap-x-2'>
        <Button className='w-1/2 hover:cursor-pointer' size="lg" variant='outline' onClick={() => onClick("google")}>
            <FcGoogle className='w-6 h-6'/>
        </Button>
        <Button className='w-1/2 hover:cursor-pointer' size="lg" variant='outline' onClick={() => onClick("github")}>
            <FaGithub className='w-6 h-6'/>
        </Button>
    </div>
  )
} 

export default Social