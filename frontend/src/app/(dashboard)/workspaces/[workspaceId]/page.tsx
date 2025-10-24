"use client"
export const dynamic = "force-dynamic" // ✅ prevents Next.js static generation errors

import React from "react"
import useGetTask from "@/hooks/useGetTask"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]

export default function DashboardPage() {
  const { workspaceId } = useParams() as { workspaceId: string }

  // Fetch tasks using custom hook
  const { tasks, loading, error } = useGetTask({ workspaceId })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-blue-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-red-500">
        Failed to load tasks: {error}
      </div>
    )
  }

  // ====== DATA ANALYTICS ======
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }))

  const totalTasks = tasks.length
  const assignedTasks = tasks.filter((t) => t.assignedId).length
  const uniqueProjects = new Set(tasks.map((t) => t.projectId)).size

  return (
    <div className="p-8 bg-white min-h-screen text-blue-900">

      {/* ======= STATS CARDS ======= */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-10">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="font-bold text-sm">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-muted-foreground">{totalTasks}</p>
          </CardContent>
        </Card>

        <Card className=" border-blue-100">
          <CardHeader> 
            <CardTitle className="font-bold text-sm">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-muted-foreground">2</p>
          </CardContent>
        </Card>
      </div>

      {/* ======= PIE CHART ======= */}
      <Card className="border-blue-100 p-2">
        <CardHeader>
          <CardTitle className="">Task Distribution by Status</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[350px]">
          {pieData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-blue-400">No tasks found in this workspace</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
