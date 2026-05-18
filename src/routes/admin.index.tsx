import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listSubmissions, listProjects, listAllReviews, listGallery } from "@/integrations/pocketbase/services";
import { Inbox, FolderKanban, Settings, Star, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ submissions: 0, projects: 0, reviews: 0, pendingReviews: 0, gallery: 0 });

  useEffect(() => {
    Promise.all([
      listSubmissions().catch(() => []),
      listProjects().catch(() => []),
      listAllReviews().catch(() => []),
      listGallery().catch(() => []),
    ]).then(([s, p, r, g]) =>
      setCounts({
        submissions: s.length,
        projects: p.length,
        reviews: r.length,
        pendingReviews: r.filter((x) => !x.approved).length,
        gallery: g.length,
      }),
    );
  }, []);

  const cards = [
    { label: "Leads", value: counts.submissions, icon: Inbox, to: "/admin/submissions" },
    { label: "Projects", value: counts.projects, icon: FolderKanban, to: "/admin/projects" },
    { label: "Gallery", value: counts.gallery, icon: ImageIcon, to: "/admin/gallery" },
    { label: "Reviews", value: counts.reviews, icon: Star, to: "/admin/reviews", badge: counts.pendingReviews },
    { label: "Settings", value: "Edit", icon: Settings, to: "/admin/settings" },
  ] as const;

  return (
    <div>
      <h1 className="text-display text-4xl">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Quick overview of your site.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="relative rounded-3xl border border-border bg-card p-6 hover:border-primary transition group">
            <c.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <div className="mt-4 text-3xl font-semibold">{c.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.label}</div>
            {"badge" in c && c.badge > 0 && (
              <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                {c.badge} Pending
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
