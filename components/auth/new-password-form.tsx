"use client";
import React, { useState } from 'react'
import { CardWrapper } from './card-wrapper'
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import * as z from 'zod'
import { NewPasswordSchema } from "@/schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import FormError from '@/components/auth/form-error';
import FormSuccess from '@/components/auth/form-success';
import { useTransition } from 'react';
import { newPassword } from '@/actions/new-password';
import { useSearchParams } from 'next/navigation';
const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token=searchParams.get('token')
    const[error, setError] = useState<string | undefined>()
    const[success, setSuccess] = useState<string | undefined>()

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            newPassword(values,token)
            .then((response) => {
                setError(response?.error)
                setSuccess(response?.success)
            })
        })
    }

  return (
    <div>
        <CardWrapper headerLabel="Enter a New password 🔐" backButtonLabel='Back to Login?' backButtonHref='/login'>
            <Form {...form}>
                <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='space-y-4'>
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="******" {...field} type="password" disabled={isPending}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button type="submit" size="lg" className='w-full hover:cursor-pointer' disabled={isPending}>
                        Reset Password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    </div>
  )
}

export default NewPasswordForm