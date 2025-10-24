"use client";
import EditProjectForm from "@/components/edit-project-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSpecificProject, deleteProject } from "@/store/slices/projectSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SettingPageProps {
  params: {
    projectId: string;
    workspaceId: string;
  };
}

export default function SettingsPage({ params }: SettingPageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentProject, loading } = useAppSelector((state) => state.project);

  useEffect(() => {
    if (params.projectId) {
      dispatch(fetchSpecificProject(params.projectId));
    }
  }, [dispatch, params.projectId]);

  const handleDelete = async () => {
    if (!currentProject) return;

    const confirmed = confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const resultAction = await dispatch(deleteProject(currentProject._id));

      if (deleteProject.fulfilled.match(resultAction)) {
        toast.success("Project deleted successfully");
        router.push(`/workspaces/${params.workspaceId}`);
      } else {
        toast.error(resultAction.payload as string || "Failed to delete project");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-xl">
      <Card>
        <EditProjectForm name={currentProject.name} projectId={currentProject._id} />
      </Card>
      <Card className="p-5 my-5">
        <h1 className="font-bold">Danger Zone</h1>
        <p className="text-muted-foreground">
          Deleting the project is irreversible and will remove associated data
        </p>
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="lg"
            className="my-3"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Project"}
          </Button>
        </div>
      </Card>
    </div>
  );
}