import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

export default function AdminLogin() {
  const { login, isLoadingAuth } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="font-lexend text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-slate-400 text-sm">
            This area is restricted to authorized administrators only.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-6">
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-amber-200 text-sm text-left">
              Sign in with your <strong>admin credentials</strong> to access the dashboard.
            </p>
          </div>

          <form
            className="space-y-4 text-left"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await login({ email: form.email, password: form.password });
                window.location.href = '/jyothu-control-panel';
              } catch (err) {
                if (err?.message === 'already_logged_in') toast.error('Admin is already logged in. Please logout first.');
                else toast.error('Login failed. Please check your credentials.');
              }
            }}
          >
            <div>
              <Label className="text-xs font-medium text-slate-200">Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 h-11 bg-white/10 border-white/10 text-white placeholder:text-slate-500"
                placeholder="admin@example.com"
                type="email"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-200">Password</Label>
              <Input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 h-11 bg-white/10 border-white/10 text-white placeholder:text-slate-500"
                placeholder="••••••••"
                type="password"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-bold text-base rounded-xl gap-3"
            >
              Sign In
            </Button>
          </form>

          <p className="text-slate-500 text-xs">
            Only the registered admin account will be granted access. Regular users will be denied.
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Jyothu Travels and Tourism · Admin Portal
        </p>
      </div>
    </div>
  );
}