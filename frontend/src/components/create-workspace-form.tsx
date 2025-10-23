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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createWorkspace } from "@/store/slices/workspaceSlice";
import { useRouter } from "next/navigation";
import useCreateWorkspace from "@/hooks/useCreateWorkspace";

interface CreateWorkSpaceForm {
  onCancel?: () => void;
}

const createWorkSpaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
});

export default function WorkSpaceForm({ onCancel }: CreateWorkSpaceForm) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.workspace);
  const { close } = useCreateWorkspace();

  const form = useForm<z.infer<typeof createWorkSpaceSchema>>({
    resolver: zodResolver(createWorkSpaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof createWorkSpaceSchema>) => {
    try {
      const resultAction = await dispatch(createWorkspace(value));

      if (createWorkspace.fulfilled.match(resultAction)) {
        toast.success("Workspace Created Successfully");
        form.reset();
        close();
        
        // Navigate to the new workspace
        const newWorkspace = resultAction.payload;
        router.push(`/workspaces/${newWorkspace._id}`);
      } else {
        toast.error(resultAction.payload as string || "Failed to create workspace");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
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
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Enter Workspace Name"
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