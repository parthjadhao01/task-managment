"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWorkspaces } from "@/store/slices/workspaceSlice";
import { Loader } from "lucide-react";

export default function DashboardPage() {
  const { workspaces, loading } = useAppSelector((state) => state.workspace);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
      return;
    }

    dispatch(fetchWorkspaces());
  }, [dispatch, router]);

  useEffect(() => {
    if (!loading) {
      if (workspaces.length === 0) {
        router.push("/workspaces/create");
      } else {
        router.push(`/workspaces/${workspaces[0]._id}`);
      }
    }
  }, [loading, router, workspaces]);

  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}