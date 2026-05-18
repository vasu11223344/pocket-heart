import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin } from "@/integrations/pocketbase/services";
import { SectionTag } from "@/components/SectionTag";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 pt-36 pb-24 min-h-screen">
      <div className="mx-auto max-w-md">
        <SectionTag>Admin</SectionTag>
        <h1 className="mt-6 text-display text-4xl">Sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Use your PocketBase superuser credentials.
        </p>

        <form onSubmit={handle} className="mt-8 space-y-4 rounded-3xl border border-border bg-card p-6">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={loading} type="submit" className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold disabled:opacity-50">
            {loading ? "Loading…" : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}
