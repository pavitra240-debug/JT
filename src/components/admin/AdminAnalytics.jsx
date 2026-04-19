import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { BookOpen, CheckCircle, Clock, XCircle } from 'lucide-react';
import { adminApi } from '@/api/backendClient';

export default function AdminAnalytics() {
  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => adminApi.bookings.list(),
  });

  // Build last 6 months chart data
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const monthBookings = bookings.filter(b => {
      if (!b.created_date) return false;
      try {
        return isWithinInterval(parseISO(b.created_date), { start, end });
      } catch { return false; }
    });
    return {
      month: format(month, 'MMM yy'),
      total: monthBookings.length,
      confirmed: monthBookings.filter(b => b.status === 'Confirmed').length,
      completed: monthBookings.filter(b => b.status === 'Completed').length,
    };
  });

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: BookOpen, color: 'bg-slate-100 text-slate-700' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'Confirmed').length, icon: CheckCircle, color: 'bg-blue-50 text-blue-700' },
    { label: 'Completed', value: bookings.filter(b => b.status === 'Completed').length, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, icon: Clock, color: 'bg-amber-50 text-amber-700' },
    { label: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length, icon: XCircle, color: 'bg-red-50 text-red-700' },
  ];

  // Service type breakdown
  const serviceBreakdown = ['Car Rental', 'Bus/Tempo Traveller', 'Travel Package'].map(type => ({
    name: type,
    count: bookings.filter(b => b.service_type === type).length,
  }));

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${color} rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold font-lexend">{value}</p>
              <Icon className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-xs font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Monthly bookings chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-lexend font-bold text-[#0F172A] mb-6">Monthly Bookings (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Bar dataKey="total" name="Total" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            <Bar dataKey="confirmed" name="Confirmed" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Service breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-lexend font-bold text-[#0F172A] mb-6">Bookings by Service Type</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={serviceBreakdown} layout="vertical" barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={130} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
            <Bar dataKey="count" name="Bookings" fill="#0F172A" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}