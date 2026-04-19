import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function Admin() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Only allow admin role
  if (!isAuthenticated || user?.role !== 'admin') {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}