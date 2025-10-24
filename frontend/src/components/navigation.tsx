"use client"
import useWorkspaceId from '@/hooks/useWorkSpaceId';
import { cn } from '@/lib/utils';
import { Settings, UserIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { GoHome, GoHomeFill,GoCheckCircle,GoCheckCircleFill} from "react-icons/go";

const routes = [
    {
        label : "Home",
        href : "/",
        icon : GoHome,
        activeIcon : GoHomeFill
    },
    {
        label : "My Tasks",
        href : "/tasks",
        icon : GoCheckCircle,
        activeIcon : GoCheckCircleFill
    },
    {
        label : "Settings",
        href : "/settings",
        icon : Settings,
        activeIcon : Settings
    },
    {
        label : "Member",
        href : "/role",
        icon : UserIcon,
        activeIcon : UserIcon
    }
]

export default function Navigation() {
  const workspaceId = useWorkspaceId()
  return (
    <ul className='flex flex-col '>
        {routes.map((item)=>{
            const isActive = false
            const IconComponent = isActive ? item.activeIcon : item.icon
            const finalhref = `/workspaces/${workspaceId}/${item.href}`
            return(
                <Link key={item.href} href={finalhref}>
                    <div className={cn("flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                        isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                    )}>
                        <IconComponent className="w-5 h-5 text-neutral-500"/>
                        {item.label}
                    </div>
                </Link>
            )
        })}
    </ul>
  )
}
