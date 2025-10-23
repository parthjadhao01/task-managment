"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import DottedSeparator from "./dotted-separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import useWorkspaceId from "@/hooks/useWorkSpaceId";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createProject } from "@/store/slices/projectSlice";
import { useRouter } from "next/navigation";
import useCreateProject from "@/hooks/useCreateProject";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

export default function CreateProjectForm({ onCancel }: CreateProjectFormProps) {
  const workspaceId = useWorkspaceId();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.project);
  const { close } = useCreateProject();

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof createProjectSchema>) => {
    try {
      if (!workspaceId) {
        toast.error("Workspace ID is missing");
        return;
      }

      const resultAction = await dispatch(
        createProject({ workspaceId, name: value.name })
      );

      if (createProject.fulfilled.match(resultAction)) {
        toast.success("Project Created Successfully");
        form.reset();
        close();
        
        // Navigate to the new project
        const newProject = resultAction.payload;
        router.push(`/workspaces/${workspaceId}/project/${newProject._id}`);
      } else {
        toast.error(resultAction.payload as string || "Failed to create project");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a Project</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Enter Project Name"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="lg"
                type="button"
                onClick={() => {
                  onCancel?.();
                  close();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button size="lg" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}