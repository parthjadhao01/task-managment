"use client";

import React from "react";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation"; // ✅ use router for navigation
import useWorkspaceId from "@/hooks/useWorkSpaceId";
import useGetWorkSpace from "@/hooks/useGetWorkSpace";
import useCreateWorkspace from "@/hooks/useCreateWorkspace";

interface Workspace {
  _id: string;
  name: string;
}

export default function WorkSpaceSwitcher() {
  const router = useRouter(); // ✅ for client-side navigation
  const workspaceId = useWorkspaceId();
  const { workspaces } = useGetWorkSpace();
  const {open} = useCreateWorkspace();


  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`); // ✅ client-side navigation
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer" />
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="Select Workspace" />
        </SelectTrigger>

        <SelectContent>
          {workspaces?.map((workspace: Workspace) => (
            <SelectItem key={workspace._id} value={workspace._id}>
              {workspace.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
