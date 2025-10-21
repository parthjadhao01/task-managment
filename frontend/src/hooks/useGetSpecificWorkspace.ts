"use client"
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface workspaces {
    _id : string,
    name : string,
    userId : string
    inviteCode : string
}

interface useGetSpecificWorkSpace{
    id : string
}

export default function useGetSpecificWorkSpace(id : string) {
    const [workspaces, setWorkspaces] = useState<workspaces | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWorkspaces = useCallback(async () => {
        try {
            setLoading(true);
            const token = await localStorage.getItem("token")
            if (!token) {
                setLoading(false)
                return
            }

            const response = await axios.get(`http://localhost:8000/workspace/get-workspaces/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = response.data
            setWorkspaces(data)
        } catch (err: any) {
            console.error("Error fetching Workspaces", err)
            setError(err.response?.data?.message || "Failed to load Workspaces")
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchWorkspaces()
    }, [fetchWorkspaces])

    const refreshWorkspace = () => fetchWorkspaces()

    return { workspaces, loading, error, refreshWorkspace }

}