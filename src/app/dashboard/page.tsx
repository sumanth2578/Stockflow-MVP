import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Package, 
  AlertCircle, 
  TrendingUp,
  ChevronRight
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;

  // Fetch summary data
  const products = await prisma.product.findMany({
    where: { organizationId },
  });

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  const totalProducts = products.length;
  const totalUnits = products.reduce((acc: number, p: any) => acc + p.quantity, 0);
  
  const lowStockItems = products.filter((p: any) => {
    const threshold = p.lowStockThreshold ?? org?.defaultLowStockThreshold ?? 5;
    return p.quantity <= threshold;
  });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 mt-1">Real-time inventory metrics for {org?.name}.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/products" className="bg-white p-6 rounded border border-slate-200 shadow-sm hover:border-slate-900 transition-colors group">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-900 transition-colors">
                 <Package size={16} />
                 <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{totalProducts}</p>
          </div>
        </Link>

        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
               <TrendingUp size={16} />
               <span className="text-xs font-bold uppercase tracking-wider">Total Units</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{totalUnits}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
               <AlertCircle size={16} />
               <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
            </div>
            <p className={`text-3xl font-extrabold ${lowStockItems.length > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {lowStockItems.length}
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock Items Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            Low Stock Alerts
          </h3>
          {lowStockItems.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 rounded text-red-700 uppercase">
              Action Required
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                    All stock levels are currently healthy.
                  </td>
                </tr>
              ) : (
                lowStockItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{item.sku}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex text-[10px] font-bold text-red-600 uppercase">
                        Critically Low
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
