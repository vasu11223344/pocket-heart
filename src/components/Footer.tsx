import { Link } from "@tanstack/react-router";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { ArrowButton } from "./ArrowButton";
import { useSettings } from "@/hooks/use-settings";

export function Footer() {
  const s = useSettings();
  const phone = s?.contact_phone || "9652847145";
  const phone2 = s?.phone_secondary || "9100864364";
  const email = s?.contact_email || "greensparksolar11@gmail.com";
  const address = s?.address_head_office || "";
  const branches = s?.branches_list || "";

  return (
    <footer className="border-t border-border bg-background px-4 sm:px-8 py-20">
      <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <h2 className="text-display text-5xl md:text-6xl">
            Power Your Home<br />With the Sun
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            PM Surya Ghar subsidy available. We handle the complete loan and subsidy process — residential, commercial, and farm solar with battery storage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ArrowButton to="/contact" variant="primary">Get Free Quote</ArrowButton>
            <ArrowButton to="/calculator" variant="outline">Savings Calculator</ArrowButton>
          </div>
        </div>

        <div className="lg:justify-self-end w-full max-w-md space-y-6">
          <Logo />
          <div className="space-y-4">
            <ContactItem icon={<Phone className="h-5 w-5" />} label="Call Us" value={`${phone} · ${phone2}`} />
            <ContactItem icon={<Mail className="h-5 w-5" />} label="Mail Us" value={email} />
            {address && <ContactItem icon={<MapPin className="h-5 w-5" />} label="Head Office" value={address} />}
          </div>
          {branches && <div className="text-xs text-muted-foreground">Branches: {branches}</div>}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© 2026 <span className="text-primary">Green Spark Solar</span>. All rights reserved.</p>
        <nav className="flex gap-6">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/calculator" className="hover:text-foreground">Calculator</Link>
          <Link to="/admin" className="hover:text-foreground">Admin</Link>
        </nav>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground pl-2 pr-5 py-1.5 text-sm font-medium">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-background/20">
            <ArrowUp className="h-4 w-4" />
          </span>
          Back To Top
        </button>
      </div>
    </footer>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium break-words">{value}</div>
      </div>
    </div>
  );
}
