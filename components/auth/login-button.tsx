"use client";
import React from 'react'
import {useRouter} from 'next/navigation'

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
};

const LoginButton = ({
    children,
    mode = "redirect",
    asChild = false,
}: LoginButtonProps) => {
    const router = useRouter();
    const handleClick = () => {
        console.log("Login button clicked");
        router.push("/login");
    }
  return (
    <span className='hover:cursor-pointer' onClick={handleClick}>{children}</span>
  )
}

export default LoginButton