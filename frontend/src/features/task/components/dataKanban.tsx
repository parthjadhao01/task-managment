"use client"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import React, { useEffect, useState, useCallback } from 'react'
import KanbanColumnHeader from "./KanbanColumnHeader";
import KanbanCard from "./KanbanCard";

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

    const onDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) {
            return
        }

        const { source, destination } = result
        const sourceStatus = source.droppableId as Status
        const destinationStatus = destination.droppableId as Status

        setTask((prevTasks) => {
            const newTasks = { ...prevTasks }
            
            // Get the source column and remove the task
            const sourceColumn = [...newTasks[sourceStatus]]
            const [movedTask] = sourceColumn.splice(source.index, 1)

            if (!movedTask) {
                console.error("No task found at source index")
                return prevTasks
            }

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
    }, [])

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                    return (
                        <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md">
                            <KanbanColumnHeader board={board} taskCount={task[board].length} />
                            <Droppable droppableId={board}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-[200px] py-1.5"
                                    >
                                        {task[board].map((task, index) => (
                                            <Draggable
                                                key={task._id}
                                                draggableId={task._id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                        ref={provided.innerRef}
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
        </DragDropContext>
    )
}