"use client";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import TaskViewSwitcher from '@/features/task/components/TaskViewSwitcher';
import useGetSpecificProject from '@/hooks/useGetSpecificProject';
import { cn } from '@/lib/utils';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface ProjectIdPageProps {
    params: {
        projectId: string;
    };
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
    const router = useRouter();
    const { project, loading } = useGetSpecificProject(params.projectId)


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/sign-in");
        }
    }, [router]);

    // if (project===null) {
    //     throw new Error ("Project not found")
    // }

    return (
        <div className='flex flex-col gap-y-4'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-x-2'>
                    <Avatar className={cn("size-15")}>
                        <AvatarFallback className={cn(` p-2 px-4 m-1 bg-blue-500 text-white font-semibold text-sm uppercase rounded-md`)}>
                            {project?.name[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <p>{project?.name}</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/workspaces/${project?.workspaceId}/project/${project?._id}/settings`}>
                        Edit Project
                        <Edit />
                    </Link>
                </Button>
            </div>
            <TaskViewSwitcher projectId={project?._id}/>
            
        </div>
    );
}
