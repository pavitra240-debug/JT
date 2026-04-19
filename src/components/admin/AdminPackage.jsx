import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/backendClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, X, Check, PlusCircle, MinusCircle } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM = {
  package_name: '', tour_type: '', route: '', duration: '',
  image_url: '', rating: '', display_order: '',
  pricing_rows: [{ vehicle_type: '', price_range: '' }],
};

export default function AdminPackages() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: () => adminApi.packages.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminApi.packages.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-packages'] }); setEditing(null); toast.success('Package added!'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.packages.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-packages'] }); setEditing(null); toast.success('Updated!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.packages.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-packages'] }); toast.success('Deleted!'); },
  });

  const openNew = () => { setForm({ ...EMPTY_FORM, pricing_rows: [{ vehicle_type: '', price_range: '' }] }); setEditing('new'); };
  const openEdit = (pkg) => {
    setForm({
      ...pkg,
      pricing_rows: (pkg.pricing_rows && pkg.pricing_rows.length) ? pkg.pricing_rows : [{ vehicle_type: '', price_range: '' }]
    });
    setEditing(pkg);
  };

  const handleSave = () => {
    if (!form.package_name) { toast.error('Package name is required'); return; }
    const payload = {
      ...form,
      rating: form.rating ? Number(form.rating) : undefined,
      display_order: form.display_order ? Number(form.display_order) : undefined,
      pricing_rows: form.pricing_rows.filter(r => r.vehicle_type || r.price_range),
    };
    if (editing === 'new') createMutation.mutate(payload);
    else updateMutation.mutate({ id: editing.id, data: payload });
  };

  const updateRow = (idx, field, value) => {
    const rows = [...form.pricing_rows];
    rows[idx] = { ...rows[idx], [field]: value };
    setForm({ ...form, pricing_rows: rows });
  };

  const addRow = () => setForm({ ...form, pricing_rows: [...form.pricing_rows, { vehicle_type: '', price_range: '' }] });
  const removeRow = (idx) => setForm({ ...form, pricing_rows: form.pricing_rows.filter((_, i) => i !== idx) });

  const handleDelete = (id) => { if (window.confirm('Delete this package?')) deleteMutation.mutate(id); };

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm">{packages.length} packages</p>
        <Button onClick={openNew} className="bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-semibold gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Add Package
        </Button>
      </div>

      {editing && (
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 space-y-5">
          <h3 className="font-lexend font-bold text-[#0F172A]">
            {editing === 'new' ? 'Add New Package' : `Edit: ${editing.package_name}`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'package_name', label: 'Package Name *' },
              { key: 'tour_type', label: 'Tour Type' },
              { key: 'route', label: 'Route' },
              { key: 'duration', label: 'Duration' },
              { key: 'rating', label: 'Rating', type: 'number' },
              { key: 'display_order', label: 'Display Order', type: 'number' },
              { key: 'image_url', label: 'Image URL' },
            ].map(({ key, label, type = 'text' }) => (
              <div key={key}>
                <Label className="text-xs font-medium text-slate-600 mb-1 block">{label}</Label>
                <Input type={type} value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="h-9 text-sm border-slate-200" />
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-semibold text-[#0F172A]">Pricing Rows</Label>
              <button onClick={addRow} className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 text-sm font-medium">
                <PlusCircle className="w-4 h-4" /> Add Row
              </button>
            </div>
            <div className="space-y-2">
              {form.pricing_rows.map((row, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <Input
                    placeholder="Vehicle type (e.g. 4+1 Seater)"
                    value={row.vehicle_type}
                    onChange={(e) => updateRow(idx, 'vehicle_type', e.target.value)}
                    className="h-9 text-sm border-slate-200 flex-1"
                  />
                  <Input
                    placeholder="Price range (e.g. ₹12,000 – ₹18,000)"
                    value={row.price_range}
                    onChange={(e) => updateRow(idx, 'price_range', e.target.value)}
                    className="h-9 text-sm border-slate-200 flex-1"
                  />
                  {form.pricing_rows.length > 1 && (
                    <button onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-semibold gap-2 rounded-xl">
              <Check className="w-4 h-4" /> Save Package
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="gap-2 rounded-xl">
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            {pkg.image_url && (
              <div className="h-40 overflow-hidden">
                <img src={pkg.image_url} alt={pkg.package_name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-lexend font-bold text-[#0F172A] text-sm">{pkg.package_name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{pkg.tour_type} · {pkg.duration}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openEdit(pkg)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {pkg.route && <p className="text-xs text-amber-600 font-medium mb-2">{pkg.route}</p>}
              {pkg.pricing_rows && pkg.pricing_rows.length > 0 && (
                <div className="space-y-1">
                  {pkg.pricing_rows.slice(0, 3).map((row, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
                      <span>{row.vehicle_type}</span>
                      <span className="font-medium text-[#0F172A]">{row.price_range}</span>
                    </div>
                  ))}
                  {pkg.pricing_rows.length > 3 && (
                    <p className="text-xs text-slate-400 text-right">+{pkg.pricing_rows.length - 3} more</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}