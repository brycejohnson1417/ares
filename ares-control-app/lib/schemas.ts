import { z } from "zod";
import { TASK_STATUSES } from "@/lib/constants";

export const TaskStatusSchema = z.enum(TASK_STATUSES as unknown as [string, ...string[]]);

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(140),
  brief: z.string().max(8000).optional().default(""),
  status: TaskStatusSchema.optional().default("inbox"),
  priority: z.number().int().min(0).max(4).optional().default(2),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(140).optional(),
  brief: z.string().max(8000).optional(),
  status: TaskStatusSchema.optional(),
  priority: z.number().int().min(0).max(4).optional(),
});
