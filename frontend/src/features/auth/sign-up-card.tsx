

import DottedSeparator from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    email: z.string(),
    name: z.string().min(3, "Name must be at least 3 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default function SignUpCard() {

    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            name: "",
            password: ""
        }
    })

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("http://localhost:8000/auth/register")
            const token = response.data.token
            localStorage.setItem("token",token)
            router.push("/(dashbord)")
        } catch (error) {
            console.log(error)
            alert("Something went wrong")
        }
    }

    return (
        <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
            <CardHeader className='flex items-center text-center p-7'>
                <CardTitle className='text-2xl'>Create Your New Account</CardTitle>
                <CardDescription>
                    By signing up , you agree to our {" "}
                    <Link href={"/privacy"} className='text-blue-500'>
                        privacy policy
                    </Link>{" "}
                    and{" "}
                    <Link href={"/terms"} className='text-blue-500'>
                        terms of use
                    </Link>
                    .
                </CardDescription>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            required
                                            type='text'
                                            placeholder='Enter Your Name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />     
                        
                        <FormField
                            name="email"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            required
                                            type='email'
                                            placeholder='Enter Your Email'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                       <FormField
                        name='password'
                        control={form.control}
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                        required
                                        type='password'
                                        placeholder='Enter Your Password'
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                       />
                        <Button disabled={false} size="lg" className='w-full'>Signup</Button>
                    </form>
                </Form>
            </CardContent>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent>
                <Button variant="outline" className='w-full my-2' size="lg">
                    <FcGoogle className='mr-2 size-5' />
                    Signup With Google
                </Button>
                <Button variant="outline" className='w-full my-2' size="lg">
                    <FaGithub className='mr-2 size-5' />
                    Signup With Github
                </Button>
            </CardContent>
        </Card>

    )
}