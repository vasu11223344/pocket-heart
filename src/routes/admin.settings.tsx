import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getSettings,
  updateSettings,
  type SiteSettings,
} from "@/integrations/pocketbase/services";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then((data) => setS(data)).catch(() => setS(null));
  }, []);

  const save = async () => {
    if (!s) return;
    setSaving(true);
    try {
      const updated = await updateSettings(s);
      setS(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!s) return <p className="text-muted-foreground">Loading…</p>;

  const upd = (k: keyof SiteSettings, v: string) => setS({ ...s, [k]: v });

  return (
    <div>
      <h1 className="text-display text-4xl">Site settings</h1>
      <p className="mt-2 text-muted-foreground">Edit hero text, contact info, and WhatsApp number.</p>

      <div className="mt-8 space-y-8 max-w-2xl">
        <Group title="Hero">
          <F label="Eyebrow"><input value={s.hero_eyebrow} onChange={(e) => upd("hero_eyebrow", e.target.value)} className={inp} /></F>
          <F label="Title (big text)"><input value={s.hero_title} onChange={(e) => upd("hero_title", e.target.value)} className={inp} /></F>
          <F label="Subtitle"><input value={s.hero_subtitle} onChange={(e) => upd("hero_subtitle", e.target.value)} className={inp} /></F>
          <F label="About heading"><textarea rows={3} value={s.about_heading} onChange={(e) => upd("about_heading", e.target.value)} className={ta} /></F>
        </Group>

        <Group title="Contact & Locations">
          <F label="Primary phone"><input value={s.contact_phone} onChange={(e) => upd("contact_phone", e.target.value)} className={inp} /></F>
          <F label="Secondary phone"><input value={s.phone_secondary} onChange={(e) => upd("phone_secondary", e.target.value)} className={inp} /></F>
          <F label="Tertiary phone"><input value={s.phone_tertiary} onChange={(e) => upd("phone_tertiary", e.target.value)} className={inp} /></F>
          <F label="Email"><input value={s.contact_email} onChange={(e) => upd("contact_email", e.target.value)} className={inp} /></F>
          <F label="Head office address"><textarea rows={2} value={s.address_head_office} onChange={(e) => upd("address_head_office", e.target.value)} className={ta} /></F>
          <F label="Branch office address"><textarea rows={2} value={s.address_branch_office} onChange={(e) => upd("address_branch_office", e.target.value)} className={ta} /></F>
          <F label="Branches list" hint="Pipe-separated, e.g. Prakasam | Bapatla | Palanadu"><input value={s.branches_list} onChange={(e) => upd("branches_list", e.target.value)} className={inp} /></F>
          <F label="Map embed URL"><input value={s.map_embed_url} onChange={(e) => upd("map_embed_url", e.target.value)} className={inp} /></F>
          <F label="WhatsApp number" hint="Country code + number, no + or spaces. e.g. 919876543210"><input value={s.whatsapp_number} onChange={(e) => upd("whatsapp_number", e.target.value)} className={inp} /></F>
        </Group>

        <Group title="Loan & Warranty">
          <F label="Loan / subsidy info"><textarea rows={3} value={s.loan_info} onChange={(e) => upd("loan_info", e.target.value)} className={ta} /></F>
          <F label="Warranty (years)"><input type="number" value={s.warranty_years} onChange={(e) => setS({ ...s, warranty_years: parseInt(e.target.value) || 25 })} className={inp} /></F>
        </Group>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button onClick={save} disabled={saving} className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold disabled:opacity-50">
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && <span className="text-sm text-primary">Saved!</span>}
        </div>
      </div>
    </div>
  );
}

const inp = "w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm";
const ta = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}
