import React, { useState } from 'react';
import AdminBookings from './AdminBookings';
import AdminFleet from './AdminFleet';
import AdminPackages from './AdminPackage';
import AdminMessages from './AdminMessage';
import AdminAnalytics from './AdminAnalytics';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, Car, Bus, MapPin, MessageCircle, LogOut, BarChart2, BookOpen } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: BookOpen },
  { id: 'cars', label: 'Cars', icon: Car },
  { id: 'buses', label: 'Buses', icon: Bus },
  { id: 'packages', label: 'Packages', icon: MapPin },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/10">
          <h2 className="font-lexend text-xl font-bold text-white">Admin Panel</h2>
          <p className="text-slate-400 text-xs mt-1">Jyothu Travels & Tourism</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${activeTab === id
                  ? 'bg-amber-500 text-[#0F172A]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => logout('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-lexend text-xl font-bold text-[#0F172A]">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <div className="text-xs text-slate-400">Admin</div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && <AdminAnalytics />}
          {activeTab === 'bookings' && <AdminBookings />}
          {activeTab === 'cars' && <AdminFleet entityName="Car" label="Cars" />}
          {activeTab === 'buses' && <AdminFleet entityName="Bus" label="Buses" />}
          {activeTab === 'packages' && <AdminPackages />}
          {activeTab === 'messages' && <AdminMessages />}
        </main>
      </div>
    </div>
  );
}