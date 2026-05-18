import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps } from "react";

type Variant = "primary" | "outline" | "dark";

interface Props {
  to?: string;
  search?: any;
  href?: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90",
  outline:
    "bg-transparent text-foreground border border-border hover:bg-surface",
  dark:
    "bg-foreground text-background hover:opacity-90",
};

export function ArrowButton({ to, search, href, variant = "primary", children, className = "" }: Props) {
  const inner = (
    <span className={`group inline-flex items-center gap-2 rounded-full pl-6 pr-1.5 py-1.5 text-sm font-medium transition ${styles[variant]} ${className}`}>
      {children}
      <span className="grid h-9 w-9 place-items-center rounded-full bg-background/15 transition group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </span>
  );
  if (to) return <Link to={to as any} search={search}>{inner}</Link>;
  return <a href={href}>{inner}</a>;
}
