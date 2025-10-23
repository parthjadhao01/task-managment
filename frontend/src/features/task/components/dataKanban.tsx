"use client"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import React, { useEffect, useState, useCallback } from 'react'
import KanbanColumnHeader from "./KanbanColumnHeader";
import KanbanCard from "./KanbanCard";
import axios from 'axios';
import { toast } from "sonner";

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
}

enum Status {
    Backlog = "Backlog",
    Todo = "Todo",
    Doing = "Doing",
    Done = "Done"
}

const boards: Status[] = [
    Status.Backlog,
    Status.Todo,
    Status.Doing,
    Status.Done
]

// Status colors with light opacity
const statusColors: Record<Status, { bg: string; border: string; text: string }> = {
    [Status.Backlog]: {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-600"
    },
    [Status.Todo]: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600"
    },
    [Status.Doing]: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-600"
    },
    [Status.Done]: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600"
    }
}

type taskState = {
    [key in Status]: Task[]
}

interface dataKanbanProps {
    data: Task[]
}

export default function DataKanban({ data }: dataKanbanProps) {
    const [task, setTask] = useState<taskState>(() => {
        const initialTask: taskState = {
            [Status.Backlog]: [],
            [Status.Todo]: [],
            [Status.Doing]: [],
            [Status.Done]: [],
        }

        data.forEach((t) => {
            initialTask[t.status].push(t)
        })

        return initialTask
    })

    const [isUpdating, setIsUpdating] = useState(false);

    // Helper function to check if movement is allowed
    const canMoveToStatus = (currentStatus: Status, targetStatus: Status): boolean => {
        const currentIndex = boards.indexOf(currentStatus)
        const targetIndex = boards.indexOf(targetStatus)
        
        // Only allow forward movement or staying in the same column
        return targetIndex >= currentIndex
    }

    // Function to update task status in backend
    const updateTaskStatusInBackend = async (taskId: string, newStatus: Status) => {
        try {
            // Get token from localStorage or your auth context
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/task/${taskId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                }
            );

            if (response.data.success) {
                console.log(`✅ Task status updated to ${newStatus} in backend`);
                return { success: true, data: response.data };
            }
            
            throw new Error(response.data.message || 'Failed to update task status');
        } catch (error: any) {
            console.error('❌ Error updating task status:', error);
            throw error;
        }
    };

    const onDragEnd = useCallback(async (result: DropResult) => {
        if (!result.destination || isUpdating) {
            return
        }

        const { source, destination } = result
        const sourceStatus = source.droppableId as Status
        const destinationStatus = destination.droppableId as Status

        // Prevent backward movement
        if (!canMoveToStatus(sourceStatus, destinationStatus)) {
            console.log(`Cannot move task backward from ${sourceStatus} to ${destinationStatus}`)
            // Optional: Show a toast notification here
            toast.error(`Cannot move task backward from ${sourceStatus} to ${destinationStatus}`)
            return
        }

        // Store previous state for rollback
        const previousTasks = { ...task };
        let movedTaskId: string | null = null;

        // Optimistic UI update
        setTask((prevTasks) => {
            const newTasks = { ...prevTasks }
            
            // Get the source column and remove the task
            const sourceColumn = [...newTasks[sourceStatus]]
            const [movedTask] = sourceColumn.splice(source.index, 1)

            if (!movedTask) {
                console.error("No task found at source index")
                return prevTasks
            }

            movedTaskId = movedTask._id;

            // Update the task's status if moving to a different column
            const updatedTask = sourceStatus !== destinationStatus
                ? { ...movedTask, status: destinationStatus }
                : movedTask
            
            // Update source column
            newTasks[sourceStatus] = sourceColumn
            
            // Add to destination column
            const destColumn = [...newTasks[destinationStatus]]
            destColumn.splice(destination.index, 0, updatedTask)
            newTasks[destinationStatus] = destColumn

            return newTasks
        })

        // Update backend if status changed
        if (sourceStatus !== destinationStatus && movedTaskId) {
            setIsUpdating(true);
            
            try {
                await updateTaskStatusInBackend(movedTaskId, destinationStatus);
                console.log('✅ Task successfully updated in backend');
                // Optional: Show success toast
            } catch (error: any) {
                console.error('❌ Failed to update task in backend, rolling back...');
                // Rollback to previous state
                setTask(previousTasks);
                // Optional: Show error toast
                alert(`Failed to update task: ${error.response?.data?.message || error.message}`);
            } finally {
                setIsUpdating(false);
            }
        }
    }, [task, isUpdating])

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto gap-4 p-4">
                {boards.map((board) => {
                    const colors = statusColors[board]
                    return (
                        <div 
                            key={board} 
                            className={`flex-1 min-w-[280px] ${colors.bg} ${colors.border} border-2 p-3 rounded-lg shadow-sm`}
                        >
                            <KanbanColumnHeader board={board} taskCount={task[board].length} />
                            <Droppable droppableId={board}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`min-h-[200px] py-2 rounded-md transition-colors ${
                                            snapshot.isDraggingOver 
                                                ? 'bg-white/50 ring-2 ring-offset-2 ring-opacity-50 ' + colors.border.replace('border-', 'ring-')
                                                : ''
                                        }`}
                                    >
                                        {task[board].map((task, index) => (
                                            <Draggable
                                                key={task._id}
                                                draggableId={task._id}
                                                index={index}
                                                isDragDisabled={isUpdating}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                        ref={provided.innerRef}
                                                        className={`mb-2 ${
                                                            snapshot.isDragging 
                                                                ? 'opacity-70 rotate-2 scale-105' 
                                                                : 'opacity-100'
                                                        } transition-all ${
                                                            isUpdating ? 'cursor-not-allowed opacity-50' : 'cursor-grab'
                                                        }`}
                                                    >
                                                        <KanbanCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )
                })}
            </div>
            
            {/* Loading overlay when updating */}
            {isUpdating && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-sm font-medium">Updating task...</span>
                        </div>
                    </div>
                </div>
            )}
        </DragDropContext>
    )
}