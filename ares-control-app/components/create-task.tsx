"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const Schema = z.object({
  title: z.string().min(1, "Required").max(140),
  brief: z.string().max(8000).default(""),
});

export function CreateTaskButton({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  type FormValues = { title: string; brief: string };
  const form = useForm<FormValues>({
    // zodResolver typing can get weird with defaults; runtime is correct.
    resolver: zodResolver(Schema) as any,
    defaultValues: { title: "", brief: "" },
  });

  async function submit(values: z.infer<typeof Schema>) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      toast.error("Failed to create task");
      return;
    }
    toast.success("Task created");
    setOpen(false);
    form.reset();
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What are we doing?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="Constraints, acceptance criteria, context…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
