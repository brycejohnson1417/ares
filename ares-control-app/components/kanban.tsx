"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TASK_STATUSES, STATUS_LABELS, type TaskStatus } from "@/lib/constants";
import { toast } from "sonner";

export type Task = {
  id: string;
  threadId: string;
  title: string;
  brief: string;
  status: TaskStatus;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

const LABELS = STATUS_LABELS;

function pri(n: number) {
  if (n <= 1) return "P1";
  if (n === 2) return "P2";
  if (n === 3) return "P3";
  return "P4";
}

export function Kanban({ refreshToken }: { refreshToken: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/tasks", { cache: "no-store" });
    const json = await res.json();
    setTasks(json.tasks || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  const byStatus = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const s of TASK_STATUSES) map[s] = [];
    for (const t of tasks) map[t.status]?.push(t);
    return map;
  }, [tasks]);

  async function setStatus(id: string, status: TaskStatus) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Failed to move task");
      return;
    }
    await load();
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {TASK_STATUSES.map((s) => (
        <Card key={s} className="min-h-[420px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {LABELS[s]}
              <Badge variant="secondary">{byStatus[s].length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[360px] pr-2">
              <div className="space-y-2">
                {byStatus[s].map((t) => (
                  <div key={t.id} className="rounded-md border bg-card p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{t.title}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{t.threadId}</Badge>
                          <Badge variant="secondary" className="text-xs">{pri(t.priority)}</Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7">⋯</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {TASK_STATUSES.filter((x) => x !== t.status).map((x) => (
                            <DropdownMenuItem key={x} onClick={() => setStatus(t.id, x)}>
                              Move → {LABELS[x]}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {t.brief ? (
                      <div className="mt-2 line-clamp-3 text-xs text-muted-foreground whitespace-pre-wrap">
                        {t.brief}
                      </div>
                    ) : null}
                  </div>
                ))}
                {byStatus[s].length === 0 ? (
                  <div className="text-xs text-muted-foreground">Empty</div>
                ) : null}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
