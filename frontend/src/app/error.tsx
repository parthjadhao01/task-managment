"use client"
import { Button } from '@/components/ui/button'
import { AlertTriangleIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Error() {
    return (
        <div className='h-screen flex items-center justify-center'>
            <AlertTriangleIcon />
            <p className='text-sm text-muted-foreground'>Something went wrong</p>
            <Button variant="secondary" asChild>
                <Link href="/">
                    Back to home
                </Link>
            </Button>
        </div>
    )
}
