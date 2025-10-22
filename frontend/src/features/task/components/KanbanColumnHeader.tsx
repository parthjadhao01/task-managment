"use client"
enum Status {
    Backlog = "Backlog",
    Todo = "Todo",
    Doing = "Doing",
    Done = "Done"
}
import { Button } from "@/components/ui/button";
import useCreateTask from "@/hooks/useCreateTask";
import {
    Circle,
    CircleCheckIcon,
    CircleDashedIcon,
    CircleDotDashedIcon,
    CircleDotIcon,
    CircleIcon,
    PlusIcon,
} from "lucide-react";

const statusIconMap: Record<Status, React.ReactNode> = {
    [Status.Backlog]: (
        <CircleDashedIcon className="size-[18px] text-pink-400" />
    ),
    [Status.Todo]: (
        <Circle className="size-[18px] text-red-400" />
    ),
    [Status.Doing]: (
        <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
    ),
    [Status.Done]: (
        <CircleCheckIcon className="size-[18px] text-green-400" />
    ),
}


interface KanbanColumnHeaderProps {
    board: Status,
    taskCount: number
}

import React from 'react'

export default function KanbanColumnHeader({ board, taskCount }: KanbanColumnHeaderProps) {
    const icon = statusIconMap[board]
    const {open} = useCreateTask()
    return (
        <div className='px-2 py-1.5 flex items-center justify-between'>
            <div className='flex items-center gap-x-2'>
                {icon}
                <h2 className="text-sm font-medium">
                    {board}
                </h2>
                <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
                    {taskCount}
                </div>
            </div>
            <Button onClick={open} variant="ghost" size="icon" className="size-5">
                <PlusIcon className="size-4 mr-2" />
            </Button>
        </div>
    )
}
