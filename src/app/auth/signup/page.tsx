"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Package2 } from "lucide-react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, organizationName }),
      });

      if (res.ok) {
        router.push("/auth/signin?registered=true");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex h-10 w-10 items-center justify-center rounded bg-slate-900 text-white">
            <Package2 size={24} />
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
            Create account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Join StockFlow and start managing your inventory
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded bg-red-50 p-3">
              <div className="text-xs font-semibold text-red-800">{error}</div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Organization Name
              </label>
              <input
                type="text"
                required
                className="block w-full rounded border border-slate-200 bg-white px-3 py-2 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                placeholder="Acme Corp"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                className="block w-full rounded border border-slate-200 bg-white px-3 py-2 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                className="block w-full rounded border border-slate-200 bg-white px-3 py-2 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded bg-slate-900 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus:outline-none disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create organization"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100">
           <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-bold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
