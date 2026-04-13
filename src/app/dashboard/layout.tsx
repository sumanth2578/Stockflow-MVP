import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from 'next/link';
import { 
  Package, 
  Settings, 
  Package2,
  LayoutDashboard
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-50 border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-slate-900 p-1.5 rounded text-white">
            <Package2 size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">StockFlow</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded transition-colors group"
          >
            <LayoutDashboard size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            Dashboard
          </Link>
          <Link 
            href="/dashboard/products" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded transition-colors group"
          >
            <Package size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            Inventory
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded transition-colors group"
          >
            <Settings size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logged in as</span>
            <span className="text-sm font-bold text-slate-900">{session.user?.email}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-slate-900 rounded h-8 w-8 flex items-center justify-center text-xs font-bold text-white">
               {session.user?.email?.[0].toUpperCase()}
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
