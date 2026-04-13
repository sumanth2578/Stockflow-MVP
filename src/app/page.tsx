import Link from "next/link";
import { Package2, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 h-16 flex items-center border-b border-slate-100 sticky top-0 bg-white z-50">
        <Link className="flex items-center gap-2" href="/">
          <div className="bg-slate-900 p-1.5 rounded text-white">
            <Package2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">StockFlow</span>
        </Link>
        <nav className="ml-auto flex items-center gap-8">
          <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors" href="/auth/signin">
            Sign In
          </Link>
          <Link className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors" href="/auth/signup">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center bg-slate-50/30">
        {/* Simplified Hero Section matching PRD Objective */}
        <section className="w-full py-20 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center max-w-2xl mx-auto">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                StockFlow MVP v0.1
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Multi-tenant Inventory Management
              </h1>
              <p className="text-base text-slate-500 max-w-[500px] leading-relaxed">
                The simplest-possible way to sign up, manage products with SKUs, and monitor stock levels across your organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded bg-slate-900 px-10 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Create Account
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center rounded border border-slate-200 bg-white px-10 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © 2026 StockFlow MVP
          </p>
          <nav className="flex gap-6">
            <Link className="text-xs text-slate-400 hover:text-slate-900 transition-colors" href="#">
              Help Center
            </Link>
            <Link className="text-xs text-slate-400 hover:text-slate-900 transition-colors" href="#">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
