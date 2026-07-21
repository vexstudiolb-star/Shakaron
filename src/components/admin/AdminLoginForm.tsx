"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = { needsSetup?: boolean; allowlistConfigured?: boolean };

export function AdminLoginForm({ needsSetup = false, allowlistConfigured = true }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof body.error === "string" ? body.error : "Login failed");
        setLoading(false);
        return;
      }

      // Full navigation so auth cookies are applied before the protected layout runs
      window.location.assign("/admin");
    } catch {
      setError("Could not connect. Check your Supabase keys in .env.local / Vercel.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl text-gold">Shakaron Admin</h1>
          <p className="mt-2 text-sm text-cream/50">Sign in with your owner account</p>
        </div>

        {!allowlistConfigured ? (
          <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            Set <code className="text-amber-100">ADMIN_ALLOWED_EMAILS</code> to your login email
            in <code className="text-amber-100">.env.local</code> (and Vercel), then restart.
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gold/20 bg-charcoal/80 p-6">
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-cream/50">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gold/20 bg-charcoal px-3 py-3 text-cream outline-none focus:border-gold/50"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-cream/50">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gold/20 bg-charcoal px-3 py-3 text-cream outline-none focus:border-gold/50"
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 font-medium text-charcoal disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-cream/30">
          {needsSetup ? (
            <span className="text-amber-400/80">
              Add Supabase keys to env, then create a user in Supabase Auth.
            </span>
          ) : (
            <>Use the same email you added to ADMIN_ALLOWED_EMAILS.</>
          )}
        </p>
      </div>
    </div>
  );
}
