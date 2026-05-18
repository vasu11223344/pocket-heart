import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial,
} from "@/integrations/pocketbase/services";
import { Eye, EyeOff, Plus, Star, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsAdmin,
});

const empty: Partial<Testimonial> = { name: "", location: "", rating: 5, message: "", published: true, sort_order: 0 };

function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  const load = async () => {
    try {
      setItems(await listTestimonials());
    } catch {
      setItems([]);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.name || !editing?.message) return;
    if (editing.id) {
      await updateTestimonial(editing.id, editing);
    } else {
      await createTestimonial(editing);
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await deleteTestimonial(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-display text-4xl">Reviews</h1>
          <p className="mt-2 text-muted-foreground">Customer testimonials shown on the homepage.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold">
          <Plus className="h-4 w-4" /> New review
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <article key={t.id} className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.location}</div>
              </div>
              {t.published ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="mt-2 flex text-primary">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{t.message}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditing(t)} className="flex-1 rounded-full border border-border py-2 text-xs hover:bg-surface">Edit</button>
              <button onClick={() => remove(t.id)} className="rounded-full border border-border p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold">{editing.id ? "Edit review" : "New review"}</h2>
            <div className="mt-5 space-y-4">
              <F label="Customer name"><input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inp} /></F>
              <F label="Location"><input value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className={inp} /></F>
              <F label="Rating">
                <select value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) })} className={inp}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} star{n>1?"s":""}</option>)}
                </select>
              </F>
              <F label="Message"><textarea rows={4} value={editing.message || ""} onChange={(e) => setEditing({ ...editing, message: e.target.value })} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" /></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Sort order"><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className={inp} /></F>
                <label className="flex items-center gap-2 mt-7">
                  <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                  <span className="text-sm">Published</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border py-3 text-sm">Cancel</button>
              <button onClick={save} className="flex-1 rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-sm font-medium block mb-1.5">{label}</label>{children}</div>;
}
