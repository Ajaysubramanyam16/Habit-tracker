import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, BarChart2, Folder, Sparkles, Menu, X, LogOut, Plus, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import { ViewMode } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  onAddHabit: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, onAddHabit }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'My Habits', icon: CheckSquare },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">L</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Lumina</span>
        </div>
      </div>

      <div className="px-4 py-2">
        <Button 
            onClick={() => {
                onAddHabit();
                setIsMobileMenuOpen(false);
            }} 
            className="w-full justify-center shadow-indigo-200 shadow-md"
        >
            <Plus size={18} className="mr-2" /> New Habit
        </Button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id as ViewMode);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-9 h-9 rounded-full bg-slate-200"
                />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                <button onClick={signOut} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed h-full z-20">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">L</div>
            <span className="font-bold text-slate-800">Lumina</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-0 z-20 md:hidden bg-white pt-16"
            >
                <SidebarContent />
            </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto h-full">
            {children}
        </div>
      </main>
    </div>
  );
};
