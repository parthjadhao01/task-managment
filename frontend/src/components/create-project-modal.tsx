"use client"
// import useCreateProjectfrom "@/hooks/useCreateProject";
import ResponsiveModal from "./responsive-modal";

import React from 'react'
import CreateProjectForm from "./create-project-form";
import useCreateProject from "@/hooks/useCreateProject";

export default function CreateProjectModel() {
const {isOpen,setIsOpen} = useCreateProject();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <CreateProjectForm/>
    </ResponsiveModal>
  )
}
