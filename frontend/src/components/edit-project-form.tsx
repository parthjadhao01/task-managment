"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "./ui/card";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProject } from "@/store/slices/projectSlice";

interface EditProjectFormProps {
  name: string;
  projectId: string;
}

const editProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

export default function EditProjectForm({ name, projectId }: EditProjectFormProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.project);

  const form = useForm<z.infer<typeof editProjectSchema>>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: name,
    },
  });

  // Update form when name prop changes
  useEffect(() => {
    form.reset({ name });
  }, [name, form]);

  const onSubmit = async (value: z.infer<typeof editProjectSchema>) => {
    try {
      if (!value.name) {
        toast.error("Project Name is required");
        return;
      }

      const resultAction = await dispatch(
        updateProject({ projectId, name: value.name })
      );

      if (updateProject.fulfilled.match(resultAction)) {
        toast.success("Project Updated Successfully");
      } else {
        toast.error(resultAction.payload as string || "Failed to update project");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change The Project Name</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Change Project Name"
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
            <div className="flex items-center justify-end">
              <Button size="lg" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}