import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SectionTag } from "@/components/SectionTag";
import { submitContact } from "@/lib/contact.functions";
import { useSettings } from "@/hooks/use-settings";
import { motion } from "framer-motion";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    source: (search.source as string) || "contact",
  }),
  head: () => ({
    meta: [
      { title: "Contact — Green Spark Solar" },
      { name: "description", content: "Get a free solar quote. Talk to a Green Spark expert today." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { source } = Route.useSearch();
  const settings = useSettings();
  const submit = useServerFn(submitContact);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading"); setErr("");
    try {
      await submit({ data: { ...form, source } });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "" });
      alert("Message sent successfully!");
    } catch (e) {
      setStatus("error");
      const msg = e instanceof Error ? e.message : "Failed to send";
      setErr(msg);
      alert("Error: " + msg);
    }
  };

  return (
    <div className="px-4 sm:px-8 pt-36 pb-24">
      <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <SectionTag>Contact</SectionTag>
          <h1 className="mt-6 text-display text-5xl md:text-7xl">Let's build your solar future.</h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-md">Tell us about your home or business and we'll send you a tailored quote within 24 hours.</p>
          <div className="mt-10 space-y-4">
            <Item icon={<Phone />} label="Call us" value={settings?.contact_phone || "+1 (555) 123-4567"} />
            <Item icon={<Mail />} label="Email" value={settings?.contact_email || "hello@greenspark.com"} />
            <Item icon={<MapPin />} label="Visit" value={settings?.contact_address || "123 Solar Way, Sunshine City"} />
          </div>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 space-y-5"
        >
          <Field label="Name"><input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} /></Field>
          <Field label="Email"><input required type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} /></Field>
          <Field label="Phone">
            <input 
              required 
              type="tel" 
              inputMode="numeric" 
              pattern="[0-9]{10}" 
              maxLength={10} 
              title="Please enter exactly 10 digits" 
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} 
              className={inp} 
            />
          </Field>
          <div>
            <label className="text-sm font-medium">How can we help?</label>
            <textarea required rows={5} maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your project…" className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={status === "loading"} className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold disabled:opacity-50">
            {status === "loading" ? "Sending…" : "Send Message"}
          </button>
          {status === "ok" && <p className="text-sm text-primary">Thanks! We'll be in touch shortly.</p>}
          {status === "error" && <p className="text-sm text-destructive">{err}</p>}
        </motion.form>
      </div>
    </div>
  );
}

const inp = "w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary";
function Item({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-sm font-medium block mb-2">{label}</label>{children}</div>;
}
