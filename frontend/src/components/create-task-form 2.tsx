"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import DatePicker from "./date-picker";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import DottedSeparator from "./dotted-separator";

import useWorkspaceId from "@/hooks/useWorkSpaceId";

// ✅ Schema
const createTaskSchema = z.object({
  workspaceId: z.string(),
  name: z.string().min(1, "Task name is required"),
  status: z.enum(["Backlog", "Todo", "Doing", "Done"]),
  dueDate: z.date(),
  assignedId: z.string().min(1, "Please select a member"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Please select a project"),
});

// ✅ Props Interface
interface CreateTaskFormProps {
  onCancel?: () => void;
  projects: {
    _id: string;
    workspaceId: string;
    name: string;
  }[];
  members: {
    _id: string;
    userId: {
      _id: string;
      username: string;
      email: string;
    };
    workspaceId: string;
    role: string;
  }[];
}

export default function CreateTaskForm({
  onCancel,
  projects,
  members,
}: CreateTaskFormProps) {
  const workspaceId = useWorkspaceId();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId,
      name: "",
      status: "Todo",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createTaskSchema>) => {
    try {
      const token = localStorage.getItem("token");
      const payload = { ...values, workspaceId };

      const res = await axios.post("http://localhost:8000/task/create-task", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Task Created Successfully");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating task");
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Create a Task</CardTitle>
        <CardDescription>Add task details below</CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
            {/* 🟩 Task Name */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🟩 Due Date */}
            <FormField
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🟩 Assign To */}
            <FormField
              name="assignedId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assign To</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member._id} value={member._id}>
                          <div className="flex items-center gap-x-2">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-blue-500 text-white font-semibold">
                                {member.userId.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{member.userId.username}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🟩 Status */}
            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Backlog", "Todo", "Doing", "Done"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🟩 Project */}
            <FormField
              name="projectId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Project</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          <div className="flex items-center gap-x-2">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-green-500 text-white font-semibold">
                                {project.name[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p>{project.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DottedSeparator className="py-7" />

            {/* 🟩 Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="lg"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button size="lg" type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
