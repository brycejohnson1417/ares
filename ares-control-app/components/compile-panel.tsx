"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function CompilePanel({ taskId, artifacts }: { taskId: string; artifacts: any[] }) {
  const [loading, setLoading] = useState(false);

  async function compile() {
    setLoading(true);
    const res = await fetch(`/api/tasks/${taskId}/compile`, { method: "POST" });
    setLoading(false);
    if (!res.ok) return toast.error("Compile failed");
    toast.success("Compiled");
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Deterministic compile: latest review per role → single artifact.
        </div>
        <Button onClick={compile} disabled={loading}>Compile</Button>
      </div>

      {artifacts.map((a) => (
        <Card key={a.id}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{a.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{a.body}</pre>
          </CardContent>
        </Card>
      ))}

      {artifacts.length === 0 ? (
        <div className="text-sm text-muted-foreground">No compile artifacts yet.</div>
      ) : null}
    </div>
  );
}
