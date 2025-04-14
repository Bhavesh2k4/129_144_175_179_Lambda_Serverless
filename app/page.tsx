import LoginButton from '@/components/auth/login-button'
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import Arch from '@/public/Arch.jpg'
import Logo from '@/public/Logo.svg'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar - Now White */}
      <nav className="p-4 shadow-md rounded-4xl">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image 
              src={Logo} 
              alt="serverless Compute Logo" 
              width={70} 
              height={70} 
              className="rounded-full"
            />
            <span className="text-xl font-bold">Serverless Compute</span>
          </div>
          <LoginButton>
            <Button variant="default" size="sm" className="hover:cursor-pointer">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Serverless Compute</h1>
            <p className="text-xl text-gray-600">A serverless lambda platform with Docker and Nanos execution engines</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p>
                Serverless compute platform that allows users to upload, manage, and execute
                functions on-demand with no infrastructure management required. This project provides a complete solution
                from authentication to function execution using both Docker containers and Nanos unikernels.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Secure Authentication</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Email/Password registration with verification</li>
                    <li>OAuth login via Google and GitHub</li>
                    <li>Password reset functionality</li>
                    <li>Secure session management</li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Function Management</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Upload code in Python or JavaScript</li>
                    <li>Function metadata stored in PostgreSQL</li>
                    <li>Function code stored in AWS S3</li>
                    <li>Custom memory and timeout configurations</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Execution Engines</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Docker-based execution environment</li>
                    <li>Nanos unikernel lightweight virtualization</li>
                    <li>HTTP-based function invocation</li>
                    <li>Output and error capture with metrics</li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">User Interface</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Clean, responsive dashboard</li>
                    <li>Function management portal</li>

                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-xl font-semibold mb-3">API Examples</h3>
                <p className="mb-4">
                  Invoke your functions via HTTP endpoints with optional parameters:
                </p>
                
                <div className="my-4 bg-slate-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <p className="font-semibold mb-1">Docker Execution:</p>
                  <code>http://localhost:3000/api/function/cm9fo7r4k0000i4aigw69jrlm/calc.calculator/docker</code>
                </div>
                
                <div className="my-4 bg-slate-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <p className="font-semibold mb-1">Nanos Execution:</p>
                  <code>http://localhost:3000/api/function/cm9fo7r4k0000i4aigw69jrlm/calc.calculator/nanos</code>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Architecture Diagram</h3>
                <p className="mb-4">
                  Our serverless platform uses a microservices architecture to handle authentication, function storage,
                  and execution:
                </p>
                
                <Image 
                  src={Arch}
                  alt="Architecture Diagram" 
                  width={800} 
                  height={400} 
                  className="rounded-lg shadow-md"
                />
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p>
                Sign up for an account to start creating and deploying serverless functions.
                After logging in, you'll be able to:
              </p>
              <ul className="list-disc pl-5 mt-2 mb-4 space-y-1">
                <li>Create new functions in Python or JavaScript</li>
                <li>Customize memory allocation and timeout settings</li>
                <li>Deploy functions for immediate availability</li>
                <li>Test and monitor your functions from the dashboard</li>
              </ul>
              
              <div className="mt-6 text-center">
                <LoginButton>
                  <Button size="lg" className="hover:cursor-pointer">
                    Get Started Now
                  </Button>
                </LoginButton>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home