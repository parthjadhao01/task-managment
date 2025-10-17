"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface user {
  email : string,
  username : string
}

export default function useProfile() {
  const [user, setUser] = useState<user | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const token = await localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

    // todo : Base API   
      const res = await axios.get("http://localhost:8000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user || res.data);
    } catch (err : any) {
      console.error("Error fetching user:", err);
      setError(err.response?.data?.message || "Failed to load user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = () => fetchUser();

  return { user, loading, error, refreshUser };
}
