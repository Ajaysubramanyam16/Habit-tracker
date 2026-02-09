import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, BarChart2, Folder, Sparkles, Menu, X, LogOut, Plus, Users, Settings } from 'lucide-react';
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
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'analytics', label: 'Reporting', icon: BarChart2 },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'ai-assistant', label: 'Discuss AI', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Odoo-like Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 rounded bg-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-sm mr-3">L</div>
        <span className="text-xl font-bold text-gray-800">Lumina</span>
      </div>

      <div className="p-4">
        <Button 
            onClick={() => {
                onAddHabit();
                setIsMobileMenuOpen(false);
            }} 
            className="w-full justify-start shadow-none bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100 hover:border-violet-200"
            variant="secondary"
        >
            <Plus size={18} className="mr-2" /> New
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 py-2 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Apps</div>
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-gray-100 text-violet-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-violet-600' : 'text-gray-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-gray-100">
             {/* Gamification Bar */}
             <div className="mb-3">
                 <div className="flex justify-between text-xs mb-1">
                     <span className="font-bold text-gray-700">Lvl {user.level || 1}</span>
                     <span className="text-gray-500">{user.xp || 0} XP</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" 
                        style={{ width: `${Math.min(((user.xp || 0) % 100), 100)}%` }} 
                     />
                 </div>
             </div>

            <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 cursor-pointer transition-colors group">
                <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border border-gray-200"
                />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">Pro Plan</p>
                </div>
                <button onClick={signOut} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <LogOut size={16} />
                </button>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex text-sm">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed h-full z-20 shadow-[1px_0_20px_0_rgba(0,0,0,0.05)]">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-violet-600 flex items-center justify-center text-white font-bold">L</div>
            <span className="font-bold text-gray-800 text-lg">Lumina</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
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
                transition={{ type: "tween", duration: 0.2 }}
                className="fixed inset-0 z-20 md:hidden bg-white pt-16"
            >
                <SidebarContent />
            </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 pt-24 md:pt-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto h-full">
            {children}
        </div>
      </main>
    </div>
  );
};