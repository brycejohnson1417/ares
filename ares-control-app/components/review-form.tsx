"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { ReviewRole } from "@/lib/review";

export function ReviewForm({ taskId, roles }: { taskId: string; roles: ReviewRole[] }) {
  const [role, setRole] = useState<ReviewRole>(roles[0]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!content.trim()) return toast.error("Empty");
    setLoading(true);
    const res = await fetch(`/api/tasks/${taskId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, content }),
    });
    setLoading(false);
    if (!res.ok) return toast.error("Failed");
    setContent("");
    toast.success("Review added");
    // hard refresh
    window.location.reload();
  }

  return (
    <div className="space-y-3">
      <Select value={role} onValueChange={(v) => setRole(v as ReviewRole)}>
        <SelectTrigger>
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write the review…" />
      <Button onClick={submit} disabled={loading} className="w-full">
        Add review
      </Button>
    </div>
  );
}
