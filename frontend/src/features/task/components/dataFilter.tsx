import useGetMember from '@/hooks/useGetMember'
import useGetProject from '@/hooks/useGetProject'
import useWorkspaceId from '@/hooks/useWorkSpaceId'
import React from 'react'
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue, SelectSeparator } from "@/components/ui/select";
import DatePicker from '@/components/date-picker';
import { ListCheckIcon, User } from 'lucide-react';

interface DataFilterProps {
    hideProjectFilter?: boolean
}

export default function DateFilter({ hideProjectFilter }: DataFilterProps) {
    const workspaceId = useWorkspaceId()
    const { project, loading: projectLoading } = useGetProject(workspaceId)
    const { members, loading: memeberLoading } = useGetMember(workspaceId)

    const isLoading = projectLoading || memeberLoading

    if (isLoading) {
        return null
    }

    return (
        <div className='flex flex-col lg:flex-row gap-2'>
            <Select
                defaultValue={undefined}
                onValueChange={() => { }}
            >
                <SelectTrigger className='w-full lg:w-auto h-8'>
                    <div className='flex items-center pr-2'>
                        <ListCheckIcon className='size-4 mr-2'></ListCheckIcon>
                        <SelectValue placeholder="All statues" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>All status</SelectItem>
                    <SelectSeparator />
                    <SelectItem value='Backlog'>Backlog</SelectItem>
                    <SelectSeparator />
                    <SelectItem value='Todo'>Todo</SelectItem>
                    <SelectSeparator />
                    <SelectItem value='Doing'>Doing</SelectItem>
                    <SelectSeparator />
                    <SelectItem value='Done'>Done</SelectItem>
                </SelectContent>
            </Select>
            <Select
                defaultValue={undefined}
                onValueChange={() => { }}
            >
                <SelectTrigger className='w-full lg:w-auto h-8'>
                    <div className='flex items-center pr-2'>
                        <User className='size-4 mr-2'></User>
                        <SelectValue placeholder="All Assigned" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {members.map((members) => (
                        <SelectItem value={members._id} key={members._id}>
                            {members.userId.username}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                defaultValue={undefined}
                onValueChange={() => { }}
            >
                <SelectTrigger className='w-full lg:w-auto h-8'>
                    <div className='flex items-center pr-2'>
                        <User className='size-4 mr-2'></User>
                        <SelectValue placeholder="All Projects" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {project.map((project) => (
                        <SelectItem value={project._id} key={project._id}>
                            {project.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
