"use client"
import useCreateWorkspace from "@/hooks/useCreateWorkspace";
import WorkSpaceForm from "./create-workspace-form";
import ResponsiveModal from "./responsive-modal";

import React from 'react'

export default function CreateWorkSpaceModel() {
    const {isOpen,setIsOpen} = useCreateWorkspace();

    // todo use redux for this open close state managment
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <WorkSpaceForm/>
    </ResponsiveModal>
  )
}
