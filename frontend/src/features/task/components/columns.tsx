"use client"

import React from 'react'
import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreVerticalIcon } from 'lucide-react';
import { format } from "date-fns";
import { Badge } from '@/components/ui/badge';
import TaskAction from './taskAction';

interface Task {
    _id: string
    name: string
    workspaceId: string
    projectId: {
        _id: string
        workspaceId: string
        name: string
    },
    assignedId: {
        _id: string
        userId: {
            _id: string
            username: string
            email: string
        },
        workspaceId: string
        role: string
    }
    dueDate: Date,
    description: string,
    status: ["Backlog", "Todo", "Doing", "Done"],

}


export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                >
                    Task Name
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name = row.original.name
            return <p className='line-clamp-1'>{name}</p>
        }
    },
    {
        accessorKey: "projectId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                >
                    Project
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const project = row?.original?.projectId
            return <p className='line-clamp-1'>{project?.name}</p>
        }
    },
    {
        accessorKey: "dueDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                >
                    dueDate
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const assigned = row.original.dueDate
            return <p className='line-clamp-1'>{format(assigned, "PPP")}</p>
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                >
                    dueDate
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.original.status
            return <Badge className='line-clamp-1 w-[100px]'>{status}</Badge>
        }
    },
    {
        id: "Action",
        cell: ({ row }) => {
            const id = row.original._id
            const projectId = row.original.projectId._id
            return (
                <TaskAction id={id} projectId={projectId}>
                    <Button variant="ghost" className='size-8 p-0'>
                        <MoreVerticalIcon/>
                    </Button>
                </TaskAction>
            )
        }
    },

]
