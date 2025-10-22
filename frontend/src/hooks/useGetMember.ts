"use client"
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface members {
    _id: string,
    userId: {
        _id: string,
        username: string,
        email: string,
    },
    workspaceId: string,
    role: string
}

export default function useGetMember(workspaceId: string) {
    const [members, setMembers] = useState<members[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMember = useCallback(async () => {
        try {
            setLoading(true);
            const token = await localStorage.getItem("token")
            if (!token) {
                setMembers([])
                setLoading(false)
                return
            }

            const response = await axios.get(`http://localhost:8000/member/get-members/${workspaceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = response.data
            console.log(data)
            console.log(response)
            setMembers(data)
        } catch (err: any) {
            console.error("Error fetching Members", err)
            setError(err.response?.data?.message || "Failed to load Members")
            setMembers([])
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchMember()
    }, [fetchMember])

    const refreshMember = () => fetchMember()

    return { members, loading, error, refreshMember }

}