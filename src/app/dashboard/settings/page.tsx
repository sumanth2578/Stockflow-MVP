"use client";

import { useState, useEffect } from "react";
import { Save, Building2, BellRing, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orgData, setOrgData] = useState({
    name: "",
    defaultLowStockThreshold: 5
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch("/api/organization/details");
        if (res.ok) {
          const data = await res.json();
          setOrgData({
            name: data.name,
            defaultLowStockThreshold: data.defaultLowStockThreshold
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgData),
      });
      if (res.ok) {
        alert("Settings saved successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-slate-900" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Organization Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Configure your organization's global preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white rounded border border-slate-200 shadow-sm divide-y divide-slate-100">
          <div className="p-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2 mb-6">
              <Building2 size={16} className="text-slate-400" />
              General Details
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Organization Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-900 text-sm text-slate-900 transition-all font-medium"
                  value={orgData.name}
                  onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2 mb-6">
              <BellRing size={16} className="text-slate-400" />
              Inventory Logic
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Default Low Stock Threshold</label>
                <p className="text-xs text-slate-400 mb-3">Fallback threshold used when a product-specific alert level isn't set.</p>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-900 text-sm text-slate-900 transition-all font-bold max-w-[120px]"
                  value={orgData.defaultLowStockThreshold}
                  onChange={(e) => setOrgData({ ...orgData, defaultLowStockThreshold: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 px-8 py-2.5 rounded text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-50 min-w-[160px]"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving Changes..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
