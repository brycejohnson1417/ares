import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">Ares Control</h1>
              <Badge variant="secondary">private</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Truth-first cognition engine. Threaded. Auditable. Replayable.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">status</div>
            <div className="text-sm font-medium">online</div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Mission Queue</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Inbox → Assigned → In Progress → Review → Done
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Peer Review</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Producer → Critic → Editor → Verifier → Judge
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Compaction Guard</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              State seals + checkpoints to prevent silent drift.
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Next: auth wall + kanban + thread IDs + deterministic compiler + live feed.
        </div>
      </div>
    </main>
  );
}
