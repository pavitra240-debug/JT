import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/backendClient';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminMessages() {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => adminApi.messages.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.messages.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-messages'] }); toast.success('Message deleted'); },
  });

  const handleDelete = (id) => { if (window.confirm('Delete this message?')) deleteMutation.mutate(id); };

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <p className="text-slate-500 text-sm">{messages.length} message{messages.length !== 1 ? 's' : ''}</p>

      {messages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-amber-600" />
                    </div>
                    <h4 className="font-lexend font-bold text-[#0F172A]">{msg.full_name}</h4>
                  </div>
                  <p className="text-slate-400 text-xs ml-10">
                    {msg.created_date && format(new Date(msg.created_date), 'dd MMM yyyy, h:mm a')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {msg.phone && (
                    <a href={`https://wa.me/91${msg.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white gap-1.5 h-8 text-xs rounded-lg">
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </Button>
                    </a>
                  )}
                  {msg.email && (
                    <a href={`mailto:${msg.email}`}>
                      <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs rounded-lg">
                        <Mail className="w-3 h-3" /> Reply
                      </Button>
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="ml-10 space-y-2">
                {msg.subject && (
                  <p className="text-sm font-semibold text-[#0F172A]">{msg.subject}</p>
                )}
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {msg.message}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                  {msg.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> {msg.phone}
                    </span>
                  )}
                  {msg.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> {msg.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}