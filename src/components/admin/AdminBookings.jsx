import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/backendClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Calendar, Clock, Users, MessageCircle, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  Completed: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => adminApi.bookings.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.bookings.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.bookings.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  const filtered = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 h-10 border-slate-200 bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings ({bookings.length})</SelectItem>
            {['Pending','Confirmed','Completed','Cancelled'].map(s => (
              <SelectItem key={s} value={s}>{s} ({bookings.filter(b => b.status === s).length})</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-slate-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-lexend font-bold text-[#0F172A]">{booking.customer_name}</h3>
                    <Badge className={`${STATUS_COLORS[booking.status || 'Pending']} border text-xs`}>
                      {booking.status || 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-xs">
                    {booking.created_date && format(new Date(booking.created_date), 'dd MMM yyyy, h:mm a')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={booking.status || 'Pending'}
                    onValueChange={(val) => updateMutation.mutate({ id: booking.id, data: { status: val } })}
                  >
                    <SelectTrigger className="w-36 h-9 text-xs border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Pending','Confirmed','Completed','Cancelled'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {booking.phone && (
                    <a href={`https://wa.me/91${booking.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white gap-1.5 h-9">
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </Button>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this booking?')) deleteMutation.mutate(booking.id);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-sm">
                {booking.phone && <InfoRow icon={Phone} text={booking.phone} />}
                {booking.email && <InfoRow icon={Mail} text={booking.email} />}
                {booking.service_type && <InfoRow icon={User} text={booking.service_type} />}
                {booking.vehicle_or_package && <InfoRow icon={MapPin} text={booking.vehicle_or_package} />}
                {booking.pickup_location && <InfoRow icon={MapPin} text={`${booking.pickup_location}${booking.drop_location ? ' → ' + booking.drop_location : ''}`} />}
                {booking.travel_date && <InfoRow icon={Calendar} text={booking.travel_date} />}
                {booking.travel_time && <InfoRow icon={Clock} text={booking.travel_time} />}
                {booking.passengers && <InfoRow icon={Users} text={`${booking.passengers} passengers`} />}
              </div>

              {booking.notes && (
                <p className="mt-3 text-sm text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-100">
                  {booking.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}