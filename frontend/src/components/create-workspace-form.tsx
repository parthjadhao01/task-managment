"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import DottedSeparator from './dotted-separator'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'

interface CreateWorkSpaceForm {
    onCancel?: () => void
}

const createWorkSpaceSchema = z.object({
    name: z.string()
})

export default function WorkSpaceForm({ onCancel }: CreateWorkSpaceForm) {

    const form = useForm<z.infer<typeof createWorkSpaceSchema>>({
        resolver: zodResolver(createWorkSpaceSchema),
        defaultValues: {
            name: "",
        }
    })

    const onSubmit = async (value: z.infer<typeof createWorkSpaceSchema>) => {
        try {
            if (!value.name) {
                toast.error("Workspace Name is required")
            }
            const token = await localStorage.getItem("token")
            const res = await axios.post("http://localhost:8000/workspace/create-workspace", value,{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            console.log(res)
            toast.success("Workspace Created")
        } catch (error) {
            toast.error("Something Went Wrong")
        }
    }

    return (
        <Card className='w-full h-full border-none shadow-none'>
            <CardHeader className='flex p-7'>
                <CardTitle className='text-xl font-bold'>
                    Create a new workspace
                </CardTitle>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex flex-col gap-y-4'>
                        <FormField
                            name='name'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Workspace Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            required
                                            placeholder='Enter Workspace Name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        <DottedSeparator className='py-7' />
                        <div className='flex items-center justify-between'>
                            <Button variant="outline" size="lg" type="button">Cancel</Button>
                            <Button size="lg" type="submit">Created</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
