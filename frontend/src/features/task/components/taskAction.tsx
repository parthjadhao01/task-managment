import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuItem,
 } from "@/components/ui/dropdown-menu";
import { ExternalLink, ExternalLinkIcon, Pencil, TrashIcon } from "lucide-react";

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
                <DropdownMenuItem 
                    onClick={()=>{}}
                    className="font-medium p-[10px]"
                    >
                    <Pencil className="size-4 mr-2 stroke-2"/>
                    Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={()=>{}}
                    className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
                    >
                    <TrashIcon className="size-4 mr-2 stroke-2"/>
                    Edit Task
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     </div>
   )
 }
 