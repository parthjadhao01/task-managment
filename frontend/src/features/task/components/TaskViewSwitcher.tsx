"use client"
import DottedSeparator from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useCreateTask from '@/hooks/useCreateTask'
import { PlusIcon } from 'lucide-react'
import React from 'react'

export default function TaskViewSwitcher() {
    const {open} = useCreateTask();

    return (
        <Tabs className='flex-1 w-full border  rounded-lg'>
            <div className='h-full flex flex-col overflow-auto p-4'>
                <div className='flex flex-col gap-y-2 lg:flex-row justify-between items-center'>
                    <TabsList className='w-full lg:w-auto'>
                        <TabsTrigger value="table" className='h-8 w-full lg:w-auto'>
                            Table
                        </TabsTrigger>
                        <TabsTrigger value="kanban" className='h-8 w-full lg:w-auto'>
                            Kanban
                        </TabsTrigger>
                    </TabsList>
                    <Button onClick={open} className='w-full lg:w-auto'>
                        <PlusIcon className='size-4 mr-2' />
                        New
                    </Button>
                </div>

                <DottedSeparator className='my-4' />
                {/* Add Fillter */}
                <>
                    <TabsContent value='table' className='mt-0'>
                        Data Table
                    </TabsContent>
                    <TabsContent value='kanban' className='mt-0'>
                        Data Kanban
                    </TabsContent>
                </>
                <DottedSeparator className='my-4' />
            </div>
        </Tabs>
    )
}
