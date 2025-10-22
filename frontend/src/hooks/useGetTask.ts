"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface Task {
  _id: string;
  name: string;
  workspaceId: string;
  projectId: string;
  assignedId: string;
  dueDate: string;
  description: string;
  status: "Backlog" | "Todo" | "Doing" | "Done";
}

interface UseGetTaskProps {
  workspaceId: string;
  projectId?: string | null;
  status?: "Backlog" | "Todo" | "Doing" | "Done";
  assignedId?: string | null;
  search?: string | null;
  dueDate?: string | null;
}

export default function useGetTask({
  workspaceId,
  projectId,
  status,
  assignedId,
  search,
  dueDate,
}: UseGetTaskProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const body = {
        workspaceId,
        projectId: projectId ?? undefined,
        status: status ?? undefined,
        assignedId: assignedId ?? undefined,
        search: search ?? undefined,
        dueDate: dueDate ?? undefined,
      };

      const response = await axios.post(
        "http://localhost:8000/task/get-tasks",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data.data || []);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, projectId, status, assignedId, search, dueDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refreshTasks: fetchTasks };
}
