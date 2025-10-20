"use client"
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface project {
    _id : string,
    workspaceId : string,
    name : string
}

export default function useGetSpecificProject(projectId : string) {
    const [project, setProjects] = useState<project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const token = await localStorage.getItem("token")
            if (!token) {
                setProjects(null)
                setLoading(false)
                return
            }

            const response = await axios.get(`http://localhost:8000/project/get-project/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = response.data
            console.log(data)
            console.log(response)
            setProjects(data)
        } catch (err: any) {
            console.error("Error fetching Workspaces", err)
            setError(err.response?.data?.message || "Failed to load Workspaces")
            setProjects(null)
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const refreshProject = () => fetchProjects()

    return { project, loading, error, refreshProject }

}