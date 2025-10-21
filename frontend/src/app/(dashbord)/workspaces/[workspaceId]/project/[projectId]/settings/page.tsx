"use client"
import EditProjectForm from '@/components/edit-project-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import useGetSpecificProject from '@/hooks/useGetSpecificProject'
import React from 'react'

interface SettingPageProps {
    params: {
        projectId: string
    }
}

export default function SettingsPage({
    params
}: SettingPageProps) {
    const { project, loading } = useGetSpecificProject(params.projectId)

    return (
        <div className='w-full lg:max-w-xl'>
            <Card>
                <EditProjectForm name={project?.name || ""} />
            </Card>
            <Card className='p-5 my-5'>
                <h1 className='font-bold'>Danger Zone</h1>
                <p className='text-muted-foreground'>Deleting the project is irreversible and will remove associated data</p>
                <div className='flex justify-end'>
                    <Button variant="destructive" size="lg" className='my-3'>Delete Project</Button>
                </div>
            </Card>
        </div>
    )
}
