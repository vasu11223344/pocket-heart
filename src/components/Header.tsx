import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/calculator", label: "Calculator" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/"><Logo /></Link>

        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-border bg-surface/60 backdrop-blur-md px-2 py-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              inactiveProps={{ className: "text-foreground/80 hover:text-foreground" }}
              className="rounded-full px-4 py-2 text-sm font-medium transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 rounded-full bg-foreground text-background pl-5 pr-1 py-1">
          <Link to="/contact" className="text-sm font-medium">Get Quote</Link>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden grid h-11 w-11 place-items-center rounded-full bg-surface border border-border" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden mx-auto mt-4 max-w-7xl rounded-3xl border border-border bg-surface/95 backdrop-blur-xl p-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-full px-5 py-3 text-sm font-medium hover:bg-background">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
