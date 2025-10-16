"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const path = usePathname()

    return (
        <main className='bg-neutral-100 min-h-screen'>
            <div className='mx-auto max-w-screen-2xl p-4'>
                <nav className='flex justify-between items-center'>
                    <Image
                        src="logo.svg"
                        height={40}
                        width={40}
                        alt='logo'
                    ></Image>
                    <Button asChild variant="secondary">
                        <Link href={path==="/sign-in" ? "/sign-up" : "sign-in"}>
                            {path==="/sign-in" ? "Sign up" : "Login"}
                        </Link>
                    </Button>
                </nav>
                <div className='flex flex-col items-center justify-center pt-4 md:pt-14'>
                    {children}
                </div>
            </div>
        </main>
    )
}
