import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listSubmissions,
  deleteSubmission,
  type Submission,
} from "@/integrations/pocketbase/services";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/submissions")({
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listSubmissions());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await deleteSubmission(id);
    load();
  };

  return (
    <div>
      <h1 className="text-display text-4xl">Submissions</h1>
      <p className="mt-2 text-muted-foreground">Form submissions from your contact page.</p>

      {loading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No submissions yet.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((s) => (
            <article key={s.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {s.email}
                    {s.phone ? ` · ${s.phone}` : ""} · {new Date(s.created_at).toLocaleString()}
                  </div>
                  <p className="mt-3 text-sm whitespace-pre-wrap">{s.message}</p>
                </div>
                <button onClick={() => remove(s.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
