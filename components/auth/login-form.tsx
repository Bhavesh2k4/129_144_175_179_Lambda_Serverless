"use client";
import React, { useState } from 'react'
import { CardWrapper } from './card-wrapper'
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import * as z from 'zod'
import { LoginSchema } from "@/schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import FormError from '@/components/auth/form-error';
import FormSuccess from '@/components/auth/form-success';
import { login } from '@/actions/login';
import { useTransition } from 'react';
const LoginForm = () => {

    const[error, setError] = useState<string | undefined>()
    const[success, setSuccess] = useState<string | undefined>()

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            login(values)
            .then((response) => {
                if (!response) {
                    setError("Something went wrong. Please try again.")
                }
                else if(response.error){
                    setError(response.error)
                }else{
                    setSuccess(response.success)
                }
            })
        })
    }

  return (
    <div>
        <CardWrapper headerLabel="Welcome Back 🔐" backButtonLabel='Don’t have an account?' backButtonHref='/register' showSocial>
            <Form {...form}>
                <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='space-y-4'>
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Bhavesh.oct2k4@gmail.com" {...field} type="email" disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="******" {...field} type="password" disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button type="submit" size="lg" className='w-full hover:cursor-pointer' disabled={isPending}>
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    </div>
  )
}

export default LoginForm