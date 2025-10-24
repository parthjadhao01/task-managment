import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuItem,
 } from "@/components/ui/dropdown-menu";
import { ExternalLink, ExternalLinkIcon, Pencil, TrashIcon } from "lucide-react";
import PermissionGuard from "@/components/permission-guard";

 interface TaskActionProps{
    id : string,
    projectId : string,
    children : React.ReactNode
 }

 import React from 'react'
import { FaLess } from "react-icons/fa";
 
 export default function TaskAction({
    id,
    projectId,
    children
 }: TaskActionProps) {
   return (
     <div className="flex justify-end">
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <PermissionGuard resource="tasks" action="update">
                    <DropdownMenuItem 
                        onClick={()=>{}}
                        className="font-medium p-[10px]"
                        >
                        <Pencil className="size-4 mr-2 stroke-2"/>
                        Edit Task
                    </DropdownMenuItem>
                </PermissionGuard>
                <PermissionGuard resource="tasks" action="delete">
                    <DropdownMenuItem 
                        onClick={()=>{}}
                        className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
                        >
                        <TrashIcon className="size-4 mr-2 stroke-2"/>
                        Delete Task
                    </DropdownMenuItem>
                </PermissionGuard>
            </DropdownMenuContent>
        </DropdownMenu>
     </div>
   )
 }