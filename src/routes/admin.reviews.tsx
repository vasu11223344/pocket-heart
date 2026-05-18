import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
  subscribeReviews,
  type Review,
} from "@/integrations/pocketbase/services";
import { Check, Star, Trash2, X, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/reviews")({
  component: ReviewsAdmin,
});

function ReviewsAdmin() {
  const [items, setItems] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const load = async () => {
    try {
      setItems(await listAllReviews());
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
    const unsub = subscribeReviews(() => load());
    return () => unsub();
  }, []);

  const filtered = items.filter((r) =>
    filter === "all" ? true : filter === "approved" ? r.approved : !r.approved,
  );

  const approve = async (id: string) => {
    await approveReview(id);
    load();
  };
  const reject = async (id: string) => {
    await rejectReview(id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    await deleteReview(id);
    load();
  };

  const pendingCount = items.filter((r) => !r.approved).length;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-display text-4xl">Customer Reviews</h1>
          <p className="mt-2 text-muted-foreground">
            {pendingCount > 0 ? `${pendingCount} pending review${pendingCount > 1 ? "s" : ""} awaiting approval.` : "All caught up."}
          </p>
        </div>
        <div className="flex gap-2 rounded-full border border-border p-1">
          {(["pending", "approved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
              {f === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 inline-grid place-items-center h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">No reviews to show.</p>
        )}
        {filtered.map((r) => (
          <article key={r.id} className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {r.customer_photo ? (
                  <img src={r.customer_photo} alt={r.customer_name} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-primary/20 grid place-items-center text-primary font-semibold">
                    {r.customer_name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-semibold truncate">{r.customer_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.location || "—"}</div>
                </div>
              </div>
              {r.approved ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary text-[10px] px-2.5 py-1 font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-500 text-[10px] px-2.5 py-1 font-semibold">
                  <Clock className="h-3 w-3" /> Pending
                </span>
              )}
            </div>

            <div className="mt-3 flex text-primary">
              {[...Array(r.rating)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm text-foreground/90">"{r.review_message}"</p>
            <div className="mt-2 text-[10px] text-muted-foreground">
              {r.created_at && new Date(r.created_at).toLocaleString()}
            </div>

            <div className="mt-4 flex gap-2">
              {!r.approved ? (
                <button
                  onClick={() => approve(r.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground py-2 text-xs font-semibold"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
              ) : (
                <button
                  onClick={() => reject(r.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-border py-2 text-xs hover:bg-surface"
                >
                  <X className="h-3.5 w-3.5" /> Unapprove
                </button>
              )}
              <button
                onClick={() => remove(r.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                aria-label="Delete review"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
