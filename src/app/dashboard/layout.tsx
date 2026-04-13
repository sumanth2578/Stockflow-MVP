"use client";

import { useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { 
  Package, 
  Settings, 
  Package2,
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/dashboard/products", icon: Package },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <>
       <div className="p-6 flex items-center gap-2">
          <div className="bg-slate-900 p-1.5 rounded text-white">
            <Package2 size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 uppercase">StockFlow</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors group ${
                  isActive 
                    ? "bg-slate-900 text-white" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <SignOutButton />
        </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-50 border-r border-slate-200 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="fixed inset-y-0 left-0 w-64 bg-white flex flex-col animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-4 md:px-8 bg-white sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 text-slate-600 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged in as</span>
              <span className="text-xs md:text-sm font-bold text-slate-900 truncate max-w-[150px] md:max-w-none">
                {session?.user?.email}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-slate-900 rounded h-8 w-8 flex items-center justify-center text-xs font-bold text-white uppercase">
               {session?.user?.email?.[0]}
             </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
