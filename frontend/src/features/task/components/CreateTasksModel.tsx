"use client"
import CreateTaskForm from "@/components/create-task-form";
import ResponsiveModal from "@/components/responsive-modal";
import useCreateTask from "@/hooks/useCreateTask";


import React from 'react'
import CreateTaskFormWrapper from "./CreateTaskFormWrapper";

export default function CreateTasksModel() {
    const { isOpen, setIsOpen, close } = useCreateTask();

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateTaskFormWrapper onCancel={close} />
        </ResponsiveModal>
    )
}

