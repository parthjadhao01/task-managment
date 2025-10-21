interface CreateTaskFormWrapperProps {
    onCancel?: () => void
}

import useGetMember from '@/hooks/useGetMember'
import useGetProject from '@/hooks/useGetProject'
import useWorkspaceId from '@/hooks/useWorkSpaceId'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader } from 'lucide-react'
import CreateTaskForm from '@/components/create-task-form'

export default function CreateTaskFormWrapper({ onCancel }: CreateTaskFormWrapperProps) {
    const workspaceId = useWorkspaceId()
    const { project, loading: projectLoading } = useGetProject(workspaceId)
    const { members, loading: memeberLoading } = useGetMember(workspaceId);


    const isLoading = projectLoading || memeberLoading

    if (isLoading) {
        return (
            <Card className='w-full h-[714px] border-none shadow-none'>
                <CardContent className='flex items-center justify-center h-full'>
                    <Loader className='size-5 animate-spin text-muted-foreground' />
                </CardContent>
            </Card>
        )
    }


    return (
        <div>
            <CreateTaskForm projects={project} members={members}/>
        </div>
    )
}


