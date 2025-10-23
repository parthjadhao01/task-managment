"use client";
import useCreateProject from "@/hooks/useCreateProject";
import useWorkspaceId from "@/hooks/useWorkSpaceId";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/slices/projectSlice";

export default function Projects() {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.project);
  const { open } = useCreateProject();

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchProjects(workspaceId));
    }
  }, [dispatch, workspaceId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-neutral-500">Projects</p>
          <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-neutral-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <div>
        {projects.map((project) => {
          const href = `/workspaces/${workspaceId}/project/${project._id}`;
          const isActive = pathname === href;
          
          return (
            <Link href={href} key={project._id}>
              <div
                className={cn(
                  "flex items-center rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500 gap-x-2 p-2",
                  isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                )}
              >
                <Avatar className={cn("size-8")}>
                  <AvatarFallback
                    className={cn(
                      "bg-blue-500 text-white font-semibold text-sm uppercase rounded-md flex items-center justify-center size-8"
                    )}
                  >
                    {project.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{project.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}