import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import DottedSeparator from './dotted-separator'
import Navigation from './navigation'
import WorkSpaceSwitcher from './workspace-switcher'

export default function Sidebar() {
  return (
    <aside className='h-full bg-neutral-100 p-4 w-full'>
      <Link href="/" className='flex items-center gap-2 font-bold text-2xl'>
        <Image alt='logo' src="/logo.svg" width={40} height={40}></Image>
        TaskManager
      </Link>
      <DottedSeparator className='my-4' />
      <WorkSpaceSwitcher />
      <DottedSeparator className='my-4' />
      <Navigation />
    </aside>
  )
}
