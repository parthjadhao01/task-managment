

import DottedSeparator from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import z from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import axios from "axios";
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default function SignInCard() {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (value : z.infer<typeof formSchema>) => {
        try {
            // TODO : api base url
            const res = await axios.post(`http://localhost:8000/auth/login`, value)
            console.log(res)
            toast.success("Login Successfull")
            const token = res.data.token
            localStorage.setItem("token", res.data.token);
            router.push("/")
        } catch (error) {   
            console.log(error)
            toast.error("Something Went Wrong")
        }
    }

    return (
        <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
            <CardHeader className='flex items-center text-center p-7'>
                <CardTitle className='text-2xl'>Welcome Back</CardTitle>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            required
                                            type='email'
                                            placeholder='Enter Email'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            required
                                            type='password'
                                            placeholder='Enter Password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={false} size="lg" className='w-full'>Sign in</Button>
                    </form>
                </Form>
            </CardContent>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent>
                <Button variant="outline" className='w-full my-2' size="lg">
                    <FcGoogle className='mr-2 size-5' />
                    Login With Google
                </Button>
                <Button variant="outline" className='w-full my-2' size="lg">
                    <FaGithub className='mr-2 size-5' />
                    Login With Github
                </Button>
            </CardContent>
            <div className='px-7'>
                 <DottedSeparator/>
            </div>
            <CardContent className='flex justify-center mt-6'>
                <p className='text-sm'>
                    Don't have an account ?{" "}
                    <Link href="/sign-up" className='text-blue-600 underline'>
                            sign-up
                    </Link>
                </p>
            </CardContent>
        </Card>

    )
}
