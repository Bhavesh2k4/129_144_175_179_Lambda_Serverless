import LoginForm from '@/components/auth/login-form'
import Image from 'next/image'
import React from 'react'
import Logo from "@/public/Logo.svg"
import Link from 'next/link'
import RegisterForm from '@/components/auth/register-form'

const RegisterPage = () => {
  return (
    <div>
        <Link href="/">
        <Image src={Logo} width={100} height={100} alt="logo" className='mx-auto rounded-2xl pb-4' />
        </Link>
        <RegisterForm />
    </div>
  )
}

export default RegisterPage