
"use client"
import WorkSpaceForm from '@/components/create-workspace-form'
import UserButton from '@/features/auth/user-button'
import useGetWorkSpace from '@/hooks/useGetWorkSpace'
import useProfile from '@/hooks/useProfile'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'


export default function page() {
  const { workspaces, loading } = useGetWorkSpace()
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/sign-in")
    }

    if (loading) {
      if (workspaces.length === 0) {
        router.push("/workspaces/create")
      } else {
        router.push(`/workspaces/${workspaces[0]._id}`)
      }
    }
  },[loading, router, workspaces])

  return null
}
