import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { logoutAdmin } from "@/integrations/pocketbase/services";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, FolderKanban, Settings, Inbox, LogOut, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (location.pathname === "/admin/login") return;
    if (!user) navigate({ to: "/admin/login" });
  }, [user, loading, location.pathname, navigate]);

  if (location.pathname === "/admin/login") return <Outlet />;

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <h1 className="text-3xl font-semibold">Not authorized</h1>
          <p className="mt-2 text-muted-foreground">Your account doesn't have admin access.</p>
          <button
            onClick={() => {
              logoutAdmin();
              navigate({ to: "/" });
            }}
            className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-2 text-sm"
          >
            Sign out
          </button>
          <div className="mt-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
          </div>
        </div>
      </div>
    );
  }

  const links: Array<{ to: "/admin" | "/admin/submissions" | "/admin/projects" | "/admin/gallery" | "/admin/reviews" | "/admin/testimonials" | "/admin/settings"; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/submissions", label: "Submissions", icon: Inbox },
    { to: "/admin/projects", label: "Projects", icon: FolderKanban },
    { to: "/admin/gallery", label: "Gallery", icon: FolderKanban },
    { to: "/admin/reviews", label: "Reviews", icon: Inbox },
    { to: "/admin/testimonials", label: "Legacy Reviews", icon: Inbox },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <aside className="lg:w-64 lg:min-h-screen border-b lg:border-b-0 lg:border-r border-border bg-surface px-5 py-6 flex flex-col gap-6">
        <Link to="/"><Logo /></Link>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-card" }}
              className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap"
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            logoutAdmin();
            navigate({ to: "/" });
          }}
          className="mt-auto flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowUpRight className="h-4 w-4" /> Back to site
        </Link>
      </aside>
      <main className="flex-1 p-6 lg:p-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
