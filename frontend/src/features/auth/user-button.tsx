"use client"
import DottedSeparator from '@/components/dotted-separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import useProfile from '@/hooks/useProfile'
import { Loader, LogOut } from 'lucide-react'
import React from 'react'


export default function UserButton() {
    const { user, loading, error } = useProfile()


    if (loading || user === null) {
        return (
            <div className='size-10 rounded-full flex items-center justify-center bg-neutral-200  border border-neutral-300'>
                <Loader className='size-4 animated-spin text-muted-foreground'></Loader>
            </div>
        )
    }

    const fallbackInitial = user.username
        ? user.username.charAt(0).toUpperCase()
        : user.email?.charAt(0)?.toUpperCase() ?? "U";
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <Avatar className='size-10 hover:opacity-75 transition border border-neutral-300'>
                    <AvatarFallback className='bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center'>
                        {fallbackInitial}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' side="bottom" className='w-60' sideOffset={10}>
                <div className='flex flex-col items-center justify-center gap-2 px-2.5 py-4'>
                    <Avatar className='size-[52px]  transition border border-neutral-300'>
                        <AvatarFallback className='bg-neutral-200  text-xl font-medium text-neutral-500 flex items-center justify-center'>
                            {fallbackInitial}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col justify-center items-center'> 
                        <p className='text-sm font-medium text-neutral-900'>
                            {user.username || "User"}
                        </p>
                        <p className='text-xs text-neutral-500'>
                            {user.email}
                        </p>
                    </div>
                    <DottedSeparator/>
                    <DropdownMenuItem
                        onClick={()=>{
                            localStorage.removeItem("token")
                            window.location.reload()
                        }} 
                        className='h-10 flex items-center justify-center text-amber-700 cursor-pointer'>
                        <LogOut/> Logout
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
