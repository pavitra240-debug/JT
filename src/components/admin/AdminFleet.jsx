import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/backendClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react';
import { toast } from 'sonner';

const CAR_FIELDS = [
  { key: 'vehicle_name', label: 'Vehicle Name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'text', required: true },
  { key: 'rating', label: 'Rating', type: 'number' },
  { key: 'local_drop_price', label: 'Local Drop Price (₹)', type: 'number' },
  { key: 'local_8h_nonac', label: 'Local 8hr Non-AC (₹)', type: 'number' },
  { key: 'local_8h_ac', label: 'Local 8hr AC (₹)', type: 'number' },
  { key: 'outstation_nonac_per_km', label: 'Outstation Non-AC /km (₹)', type: 'number' },
  { key: 'outstation_ac_per_km', label: 'Outstation AC /km (₹)', type: 'number' },
  { key: 'image_url', label: 'Image URL', type: 'text' },
  { key: 'display_order', label: 'Display Order', type: 'number' },
];

const BUS_FIELDS = [
  { key: 'vehicle_name', label: 'Vehicle Name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'text', required: true },
  { key: 'seating_capacity', label: 'Seating Capacity', type: 'text' },
  { key: 'rating', label: 'Rating', type: 'number' },
  { key: 'local_price', label: 'Local Price (₹)', type: 'number' },
  { key: 'local_ac_price', label: 'Local AC Price (₹)', type: 'number' },
  { key: 'outstation_nonac_per_km', label: 'Outstation Non-AC /km (₹)', type: 'number' },
  { key: 'outstation_ac_per_km', label: 'Outstation AC /km (₹)', type: 'number' },
  { key: 'image_url', label: 'Image URL', type: 'text' },
  { key: 'display_order', label: 'Display Order', type: 'number' },
];

export default function AdminFleet({ entityName, label }) {
  const fields = entityName === 'Car' ? CAR_FIELDS : BUS_FIELDS;
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // null | 'new' | { id, ...data }
  const [form, setForm] = useState({});

  const api = entityName === 'Car' ? adminApi.cars : adminApi.buses;

  const { data: items = [], isLoading } = useQuery({
    queryKey: [entityName],
    queryFn: () => api.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [entityName] }); setEditing(null); toast.success(`${label} added!`); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [entityName] }); setEditing(null); toast.success('Updated!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [entityName] }); toast.success('Deleted!'); },
  });

  const openNew = () => { setForm({}); setEditing('new'); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item); };

  const handleSave = () => {
    if (!form.vehicle_name || !form.category) { toast.error('Name and Category are required'); return; }
    const payload = { ...form };
    fields.forEach(f => {
      if (f.type === 'number' && payload[f.key]) payload[f.key] = Number(payload[f.key]);
    });
    if (editing === 'new') {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate({ id: editing.id, data: payload });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this vehicle?')) deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm">{items.length} vehicles</p>
        <Button onClick={openNew} className="bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-semibold gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Add {label.replace('es', 'e').replace(/s$/, '')}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {editing && (
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-6">
          <h3 className="font-lexend font-bold text-[#0F172A] mb-5">
            {editing === 'new' ? `Add New ${label.replace(/s$/, '')}` : `Edit: ${editing.vehicle_name}`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map(({ key, label: fLabel, type }) => (
              <div key={key}>
                <Label className="text-xs font-medium text-slate-600 mb-1 block">{fLabel}</Label>
                <Input
                  type={type}
                  value={form[key] || ''}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="h-9 text-sm border-slate-200"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-semibold gap-2 rounded-xl">
              <Check className="w-4 h-4" /> Save
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="gap-2 rounded-xl">
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-slate-500 font-medium">Vehicle</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Category</th>
                {entityName === 'Car' ? (
                  <>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">Local Drop</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">8hr Non-AC</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">8hr AC</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">OS Non-AC /km</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">OS AC /km</th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">Capacity</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">Local</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">Local AC</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">OS Non-AC /km</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">OS AC /km</th>
                  </>
                )}
                <th className="text-right px-4 py-3 text-slate-500 font-medium">Rating</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-[#0F172A]">{item.vehicle_name}</td>
                  <td className="px-4 py-4 text-slate-500">{item.category}</td>
                  {entityName === 'Car' ? (
                    <>
                      <td className="px-4 py-4 text-right text-slate-600">₹{item.local_drop_price || '–'}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{item.local_8h_nonac || '–'}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{item.local_8h_ac || '–'}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{item.outstation_nonac_per_km || '–'}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{item.outstation_ac_per_km || '–'}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-4 text-slate-500">{item.seating_capacity}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{item.local_price || '–'}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{item.local_ac_price || '–'}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{item.outstation_nonac_per_km || '–'}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{item.outstation_ac_per_km || '–'}</td>
                    </>
                  )}
                  <td className="px-4 py-4 text-right">
                    {item.rating && (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{item.rating}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}