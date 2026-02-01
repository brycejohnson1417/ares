import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { REVIEW_ROLE_LABELS, REVIEW_ROLE_HINTS, REVIEW_ROLES, type ReviewRole } from "@/lib/review";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewForm } from "@/components/review-form";
import { CompilePanel } from "@/components/compile-panel";
import { SealPanel } from "@/components/seal-panel";

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const task = db
    .prepare(
      "select id, threadId, title, brief, status, priority, createdAt, updatedAt from tasks where id = ?"
    )
    .get(id) as
    | {
        id: string;
        threadId: string;
        title: string;
        brief: string;
        status: string;
        priority: number;
        createdAt: string;
        updatedAt: string;
      }
    | undefined;

  if (!task) return notFound();

  const reviews = db
    .prepare(
      "select id, role, content, createdAt from reviews where taskId = ? order by createdAt asc"
    )
    .all(id) as { id: string; role: string; content: string; createdAt: string }[];

  const artifacts = db
    .prepare(
      "select id, kind, title, body, createdAt from artifacts where taskId = ? order by createdAt desc limit 20"
    )
    .all(id) as { id: string; kind: string; title: string; body: string; createdAt: string }[];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{task.title}</h1>
              <Badge variant="outline">{task.threadId}</Badge>
              <Badge variant="secondary">{task.status}</Badge>
            </div>
            {task.brief ? (
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{task.brief}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="review">
            <TabsList>
              <TabsTrigger value="review">Peer review</TabsTrigger>
              <TabsTrigger value="compile">Compile</TabsTrigger>
              <TabsTrigger value="seals">State seals</TabsTrigger>
              <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
            </TabsList>

            <TabsContent value="review" className="mt-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {reviews.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No reviews yet.</div>
                    ) : null}
                    {reviews.map((r) => (
                      <div key={r.id} className="rounded-md border bg-background p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {REVIEW_ROLE_LABELS[r.role as ReviewRole] || r.role}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(r.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                          {r.content}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Add review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReviewForm taskId={task.id} roles={REVIEW_ROLES as unknown as ReviewRole[]} />
                    <div className="mt-4 space-y-2">
                      {REVIEW_ROLES.map((role) => (
                        <div key={role} className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{REVIEW_ROLE_LABELS[role]}</span>: {REVIEW_ROLE_HINTS[role]}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compile" className="mt-4">
              <CompilePanel taskId={task.id} artifacts={artifacts.filter((a) => a.kind === "compile")} />
            </TabsContent>

            <TabsContent value="seals" className="mt-4">
              <SealPanel taskId={task.id} seals={artifacts.filter((a) => a.kind === "seal")} />
            </TabsContent>

            <TabsContent value="artifacts" className="mt-4">
              <div className="grid gap-3">
                {artifacts.map((a) => (
                  <Card key={a.id}>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>{a.title}</span>
                        <span className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{a.body}</pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
