import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from "@/integrations/pocketbase/services";
import { Plus, Trash2, Upload, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/projects")({
  component: ProjectsAdmin,
});

interface DraftProject extends Partial<Project> {
  imageFile?: File | null;
}

const empty: DraftProject = {
  title: "",
  category: "Solar",
  description: "",
  image_url: "",
  year: new Date().getFullYear().toString(),
  sort_order: 0,
  published: true,
  imageFile: null,
};

function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<DraftProject | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setItems(await listProjects());
    } catch {
      setItems([]);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.title) return;
    setSaving(true);
    try {
      if (editing.id) {
        await updateProject(editing.id, editing);
      } else {
        await createProject(editing);
      }
      setEditing(null);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    load();
  };

  const onPickFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setEditing((p) => ({ ...(p ?? empty), imageFile: file, image_url: previewUrl }));
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-display text-4xl">Projects</h1>
          <p className="mt-2 text-muted-foreground">Manage your project gallery.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <article key={p.id} className="rounded-3xl border border-border bg-card overflow-hidden">
            {p.image_url ? (
              <img src={p.image_url} alt={p.title} className="w-full aspect-[4/3] object-cover" />
            ) : (
              <div className="w-full aspect-[4/3] bg-muted grid place-items-center text-xs text-muted-foreground">No image</div>
            )}
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{p.title}</h3>
                {p.published ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{p.category}{p.year ? ` · ${p.year}` : ""}</div>
              {p.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>}
              <div className="mt-4 flex gap-2">
                <button onClick={() => setEditing({ ...p })} className="flex-1 rounded-full border border-border py-2 text-xs hover:bg-surface">Edit</button>
                <button onClick={() => remove(p.id)} className="rounded-full border border-border p-2 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold">{editing.id ? "Edit project" : "New project"}</h2>
            <div className="mt-5 space-y-4">
              <F label="Title"><input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} /></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Category"><input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inp} /></F>
                <F label="Year"><input value={editing.year || ""} onChange={(e) => setEditing({ ...editing, year: e.target.value })} className={inp} /></F>
              </div>
              <F label="Description"><textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" /></F>
              <div>
                {editing.image_url && <img src={editing.image_url} className="rounded-xl w-full aspect-video object-cover mb-2" alt="" />}
                <label className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm cursor-pointer hover:bg-surface">
                  <Upload className="h-4 w-4" />
                  {editing.imageFile ? editing.imageFile.name : "Choose image"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onPickFile(e.target.files[0])} />
                </label>
              </div>
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
              <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
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
