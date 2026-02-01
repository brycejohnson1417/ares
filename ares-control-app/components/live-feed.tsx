"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type EventRow = {
  id: number;
  ts: string;
  type: string;
  message: string;
  taskId?: string;
};

export function LiveFeed({ refreshToken }: { refreshToken: number }) {
  const [events, setEvents] = useState<EventRow[]>([]);

  async function load() {
    const res = await fetch("/api/events", { cache: "no-store" });
    const json = await res.json();
    setEvents(json.events || []);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="text-sm font-medium">Live feed</div>
        <Badge variant="secondary">{events.length}</Badge>
      </div>
      <ScrollArea className="h-[420px]">
        <div className="space-y-2 p-4">
          {events.map((e) => (
            <div key={e.id} className="rounded-md border bg-background p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-medium">{e.type}</div>
                <div className="text-[10px] text-muted-foreground">{new Date(e.ts).toLocaleString()}</div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">{e.message}</div>
            </div>
          ))}
          {events.length === 0 ? (
            <div className="text-xs text-muted-foreground">No events yet.</div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
