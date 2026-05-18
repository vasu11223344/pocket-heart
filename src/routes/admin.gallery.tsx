import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listGallery,
  createGallery,
  updateGallery,
  deleteGallery,
  type GalleryImage,
} from "@/integrations/pocketbase/services";
import { Eye, EyeOff, Plus, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryAdmin,
});

interface DraftGallery extends Partial<GalleryImage> {
  imageFile?: File | null;
}

const empty: DraftGallery = {
  image_url: "",
  caption: "",
  published: true,
  sort_order: 0,
  imageFile: null,
};

function GalleryAdmin() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [editing, setEditing] = useState<DraftGallery | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setItems(await listGallery());
    } catch {
      setItems([]);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const onPickFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setEditing((p) => ({ ...(p ?? empty), imageFile: file, image_url: previewUrl }));
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.id && !editing.imageFile) {
      alert("Please choose an image");
      return;
    }
    setSaving(true);
    try {
      if (editing.id) {
        await updateGallery(editing.id, editing);
      } else {
        await createGallery(editing);
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
    if (!confirm("Delete this image?")) return;
    await deleteGallery(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-display text-4xl">Gallery</h1>
          <p className="mt-2 text-muted-foreground">Photos shown on the home and gallery pages.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold">
          <Plus className="h-4 w-4" /> Upload
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((g) => (
          <article key={g.id} className="rounded-3xl border border-border bg-card overflow-hidden">
            <img src={g.image_url} alt={g.caption || ""} className="w-full aspect-[4/3] object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm truncate">{g.caption || "(no caption)"}</p>
                {g.published ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing({ ...g })} className="flex-1 rounded-full border border-border py-2 text-xs hover:bg-surface">Edit</button>
                <button onClick={() => remove(g.id)} className="rounded-full border border-border p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold">{editing.id ? "Edit image" : "New image"}</h2>
            <div className="mt-5 space-y-4">
              <div>
                {editing.image_url && <img src={editing.image_url} className="rounded-xl w-full aspect-video object-cover mb-2" alt="" />}
                <label className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm cursor-pointer hover:bg-surface">
                  <Upload className="h-4 w-4" />
                  {editing.imageFile ? editing.imageFile.name : "Choose image"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onPickFile(e.target.files[0])} />
                </label>
              </div>
              <F label="Caption"><input value={editing.caption || ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} className={inp} /></F>
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
