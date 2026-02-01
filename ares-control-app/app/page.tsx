"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CreateTaskButton } from "@/components/create-task";
import { Kanban } from "@/components/kanban";
import { LiveFeed } from "@/components/live-feed";

export default function Home() {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">Ares Control</h1>
              <Badge variant="secondary">private</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Truth-first cognition engine. Threaded. Auditable. Replayable.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CreateTaskButton onCreated={() => setRefreshToken((x) => x + 1)} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_420px]">
          <div>
            <Kanban refreshToken={refreshToken} />
          </div>
          <div>
            <LiveFeed refreshToken={refreshToken} />
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          Next: peer-review protocol UI + deterministic compiler artifacts + compaction state seals.
        </div>
      </div>
    </main>
  );
}
