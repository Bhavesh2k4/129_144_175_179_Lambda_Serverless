"use client";
import React, { useState } from 'react'
import { CardWrapper } from './card-wrapper'
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import * as z from 'zod'
import { ResetSchema } from "@/schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import FormError from '@/components/auth/form-error';
import FormSuccess from '@/components/auth/form-success';
import { useTransition } from 'react';
import { reset } from '@/actions/reset';
const ResetForm = () => {
    const[error, setError] = useState<string | undefined>()
    const[success, setSuccess] = useState<string | undefined>()

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            reset(values)
            .then((response) => {
                setError(response?.error)
                setSuccess(response?.success)
            })
        })
    }

  return (
    <div>
        <CardWrapper headerLabel="Forgot your password? 🔐" backButtonLabel='Back to Login?' backButtonHref='/login'>
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
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button type="submit" size="lg" className='w-full hover:cursor-pointer' disabled={isPending}>
                        Send Reset Email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    </div>
  )
}

export default ResetForm