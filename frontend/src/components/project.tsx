"use client"
import useCreateProject from '@/hooks/useCreateProject';
import useGetProject from '@/hooks/useGetProject';
import useGetWorkSpace from '@/hooks/useGetProject';
import useWorkspaceId from '@/hooks/useWorkSpaceId';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import { RiAddCircleFill } from "react-icons/ri";


export default function Projects() {
    const projectId = null
    const pathname = usePathname()
    const workspaceId = useWorkspaceId()
    const { project, loading } = useGetProject(workspaceId);
    const { open } = useCreateProject()



    return (
        <div className='flex flex-col gap-y-2'>
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Projects</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer" />
            </div>
            <div>
                {project.map((project) => {
                    const href = `/workspaces/${workspaceId}/project/${project._id}`
                    const isActive = pathname === `/workspace/${workspaceId}/project/${projectId}`
                    return (
                        <Link href={href} key={project._id}>
                            <div className={cn("flex items-center rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500"
                                , isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                            )}>
                                
                                    <div className='p-2'>
                                        <Avatar className={cn("size-20")}>
                                        <AvatarFallback className={cn(` p-2 m-1 bg-blue-500 text-white font-semibold text-sm uppercase rounded-md`)}>
                                            {project.name[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    </div>
                                    <span className='text-sm'>
                                        {project.name}
                                    </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
