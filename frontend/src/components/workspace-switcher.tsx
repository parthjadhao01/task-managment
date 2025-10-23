"use client";

import React, { useEffect } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation";
import useWorkspaceId from "@/hooks/useWorkSpaceId";
import useCreateWorkspace from "@/hooks/useCreateWorkspace";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWorkspaces, setCurrentWorkspace } from "@/store/slices/workspaceSlice";

export default function WorkSpaceSwitcher() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const workspaceId = useWorkspaceId();
  const { workspaces, loading } = useAppSelector((state) => state.workspace);
  const { open } = useCreateWorkspace();

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const onSelect = (id: string) => {
    const selectedWorkspace = workspaces.find((w) => w._id === id);
    if (selectedWorkspace) {
      dispatch(setCurrentWorkspace(selectedWorkspace));
    }
    router.push(`/workspaces/${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-neutral-500">Workspaces</p>
          <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer animate-pulse" />
        </div>
        <div className="h-10 w-full bg-neutral-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="Select Workspace" />
        </SelectTrigger>

        <SelectContent>
          {workspaces?.map((workspace) => (
            <SelectItem key={workspace._id} value={workspace._id}>
              {workspace.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}