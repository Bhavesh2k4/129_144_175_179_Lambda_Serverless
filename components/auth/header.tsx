"use client"
import React from 'react'

interface HeaderProps {
  label: string;
}

const Header = ({label}: HeaderProps) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold'>{label}</h1>  
    </div>
  )
}

export default Header;