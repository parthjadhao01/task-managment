import React, { useState } from 'react'
import TaskAction from './taskAction'
import { MoreHorizontalIcon } from 'lucide-react'
import TaskReport from '@/components/task-report'

enum Status {
    Backlog = "Backlog",
    Todo = "Todo",
    Doing = "Doing",
    Done = "Done"
}

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
    status: Status,
    createdAt?: string
    updatedAt?: string
}

interface dataKanbanProps{
    task : Task
}

export default function KanbanCard({task}: dataKanbanProps) {
    const [isReportOpen, setIsReportOpen] = useState(false);

    return (
        <>
            <div className='bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3'>
                <div className='flex items-start justify-between gap-x-2'>
                    <p className='text-sm line-clamp-2'>{task.name}</p>
                    <TaskAction 
                        id={task._id} 
                        projectId={task.projectId._id}
                        task={task}
                        onGenerateReport={() => setIsReportOpen(true)}
                    >
                        <MoreHorizontalIcon className='size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition'/>
                    </TaskAction>
                </div>
            </div>
            
            <TaskReport 
                task={task}
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
            />
        </>
    )
}