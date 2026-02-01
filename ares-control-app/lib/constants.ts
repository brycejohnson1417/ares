export const TASK_STATUSES = ["inbox", "assigned", "in_progress", "review", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  inbox: "Inbox",
  assigned: "Assigned",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};
