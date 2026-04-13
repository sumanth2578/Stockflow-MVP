"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Loader2,
  Calendar,
  User,
  History
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  quantity: number;
  costPrice: number | null;
  sellingPrice: number | null;
  lowStockThreshold: number | null;
  createdAt: string;
  updatedAt: string;
  lastUpdatedBy: string;
}

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    quantity: 0,
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        description: product.description || "",
        quantity: product.quantity,
        costPrice: product.costPrice?.toString() || "",
        sellingPrice: product.sellingPrice?.toString() || "",
        lowStockThreshold: product.lowStockThreshold?.toString() || ""
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        sku: "",
        description: "",
        quantity: 0,
        costPrice: "",
        sellingPrice: "",
        lowStockThreshold: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct 
      ? `/api/products/${editingProduct.id}` 
      : "/api/products";
    const method = editingProduct ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity.toString()),
          costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
          sellingPrice: formData.sellingPrice ? parseFloat(formData.sellingPrice) : null,
          lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const error = await res.json();
        alert(error.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Inventory Catalog</h2>
          <p className="text-sm text-slate-500">View and manage your product stock levels.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 px-4 py-2.5 rounded text-sm font-bold text-white transition-colors hover:bg-slate-800 w-full sm:w-auto"
        >
          <Plus size={16} />
          Create Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 text-sm transition-all text-slate-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 gap-3">
             <Loader2 size={24} className="animate-spin text-slate-900" />
             <p className="text-xs font-bold uppercase tracking-widest">Loading Inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 p-8 text-center">
            <Package size={32} className="text-slate-200 mb-4" />
            <h3 className="font-bold text-slate-900">No matching products</h3>
            <p className="mt-1 text-sm max-w-[250px]">Refine your search or create a new entry.</p>
            <button 
              onClick={() => handleOpenModal()}
              className="mt-6 text-sm font-bold text-slate-900 hover:underline"
            >
              Add first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SKU</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Quantity</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Low Stock Indicator</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Selling Price</th>
                  <th className="hidden xl:table-cell px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Created At</th>
                  <th className="hidden xl:table-cell px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Updated At</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.map((p: any) => {
                  const isLowStock = p.quantity <= (p.lowStockThreshold ?? 5);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-slate-500 text-[10px] truncate max-w-[150px]">{p.description || "No notes"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200 uppercase tracking-tighter">
                          {p.sku}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-extrabold ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>
                          {p.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          isLowStock 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {isLowStock ? 'Low Stock' : 'Healthy'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-900 font-bold">
                        {p.sellingPrice ? `$${p.sellingPrice.toLocaleString()}` : "-"}
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4 text-slate-400 text-[10px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={10} />
                          {formatDate(p.createdAt)}
                        </div>
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4 text-slate-400 text-[10px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5 justify-between">
                          <div className="flex items-center gap-1.5">
                             <History size={10} />
                             {formatDate(p.updatedAt)}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-300">
                             <User size={10} />
                             <span className="truncate max-w-[60px]">{p.lastUpdatedBy.split('@')[0]}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(p)}
                            className="text-slate-400 hover:text-slate-900 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                             onClick={() => handleDelete(p.id)}
                             className="text-slate-400 hover:text-red-600 transition-colors"
                             title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                {editingProduct ? "Update Stock Entry" : "Create New Stock Entry"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-900 text-sm text-slate-900 placeholder-slate-300 font-bold"
                    placeholder="e.g. Cotton T-Shirt"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">SKU ID *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-900 text-sm font-mono text-slate-900 placeholder-slate-300 uppercase"
                    placeholder="TSH-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Current Stock Level</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-900 text-sm font-extrabold text-slate-900"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-900 text-sm text-slate-900"
                    placeholder="0.00"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-900 text-sm font-bold text-slate-900"
                    placeholder="0.00"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Low Stock Alarm Threshold</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-900 text-sm text-slate-900"
                    placeholder="Alert at e.g. 5 units"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Product Notes / Description</label>
                  <textarea
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-900 text-sm resize-none text-slate-900 placeholder-slate-300"
                    rows={2}
                    placeholder="Optional details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                {editingProduct && (
                  <div className="col-span-2 p-3 bg-slate-50 rounded border border-slate-100 flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                    <span>Last Edit: {formatDate(editingProduct.updatedAt)}</span>
                    <span>By: {editingProduct.lastUpdatedBy}</span>
                  </div>
                )}
              </div>
              <div className="pt-6 flex items-center justify-end gap-3 flex-col sm:flex-row flex-shrink-0">
                 <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-slate-800 transition-colors order-1 sm:order-2 shadow-sm"
                >
                  {editingProduct ? "Save Changes" : "Confirm Entry"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors order-2 sm:order-1"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
