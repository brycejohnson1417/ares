"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function SealPanel({ taskId, seals }: { taskId: string; seals: any[] }) {
  const [invariants, setInvariants] = useState("");
  const [constraints, setConstraints] = useState("");
  const [openQuestions, setOpenQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  async function seal() {
    setLoading(true);
    const res = await fetch(`/api/tasks/${taskId}/seal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invariants, constraints, openQuestions }),
    });
    setLoading(false);
    if (!res.ok) return toast.error("Seal failed");
    toast.success("Sealed");
    setInvariants("");
    setConstraints("");
    setOpenQuestions("");
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-3">
        <div>
          <div className="mb-1 text-xs font-medium">Invariants</div>
          <Textarea rows={8} value={invariants} onChange={(e) => setInvariants(e.target.value)} placeholder="Facts/assumptions that must remain true" />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium">Constraints</div>
          <Textarea rows={8} value={constraints} onChange={(e) => setConstraints(e.target.value)} placeholder="Active constraints to respect" />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium">Open questions</div>
          <Textarea rows={8} value={openQuestions} onChange={(e) => setOpenQuestions(e.target.value)} placeholder="Decision-critical unknowns" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={seal} disabled={loading}>Create state seal</Button>
      </div>

      {seals.map((a) => (
        <Card key={a.id}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{a.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{a.body}</pre>
          </CardContent>
        </Card>
      ))}

      {seals.length === 0 ? (
        <div className="text-sm text-muted-foreground">No seals yet.</div>
      ) : null}
    </div>
  );
}
