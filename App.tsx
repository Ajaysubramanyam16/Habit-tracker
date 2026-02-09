import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProjectsDashboard } from './pages/ProjectsDashboard';
import { ProjectBoard } from './pages/ProjectBoard';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { HabitForm } from './components/habits/HabitForm';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { Habit, ViewMode, Project } from './types';
import { getHabits, saveHabits, toggleHabitCompletion } from './services/habitService';
import { Trash2, Activity } from 'lucide-react';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  
  // Project State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (user) {
        const data = getHabits();
        // In a real app, API returns user specific data. 
        // Here we filter locally or just assign all to the user if they have no ID (legacy/seed data)
        const userHabits = data.map(h => {
             if (!h.userId) return { ...h, userId: user.id };
             return h;
        }).filter(h => h.userId === user.id);
        
        // If it's a new user and no habits, maybe we want to show seeded habits? 
        // For now, let's just show what matches or the seeded list if it matches
        // The getHabits() service already seeds. We just need to ensure the seeded data belongs to the first user or similar.
        // For simplicity in this demo: if the habit has no userId, we assume it belongs to the current user.
        
        setHabits(userHabits.length > 0 ? userHabits : data.filter(h => !h.userId));
    }
  }, [user]);

  const handleToggle = (id: string, date: string) => {
    const updated = toggleHabitCompletion(habits, id, date);
    setHabits(updated);
    
    // We need to save ALL habits back to storage, not just the user's filtered list
    const allHabits = getHabits();
    const merged = allHabits.map(h => {
        const updatedHabit = updated.find(u => u.id === h.id);
        return updatedHabit || h;
    });
    saveHabits(merged);
  };

  const handleAddHabit = (habit: Habit) => {
    let updated;
    if (editingHabit) {
        updated = habits.map(h => h.id === habit.id ? habit : h);
    } else {
        updated = [...habits, habit];
    }
    setHabits(updated);
    
    // Save to storage
    const allHabits = getHabits();
    let finalStorage;
    if (editingHabit) {
         finalStorage = allHabits.map(h => h.id === habit.id ? habit : h);
    } else {
         finalStorage = [...allHabits, habit];
    }
    saveHabits(finalStorage);
    
    setIsModalOpen(false);
    setEditingHabit(undefined);
  };

  const handleDeleteHabit = (id: string) => {
      if (confirm('Are you sure you want to delete this habit?')) {
          const updated = habits.filter(h => h.id !== id);
          setHabits(updated);
          
          const allHabits = getHabits();
          const finalStorage = allHabits.filter(h => h.id !== id);
          saveHabits(finalStorage);
          
          setIsModalOpen(false);
      }
  };

  const openAddModal = () => {
      setEditingHabit(undefined);
      setIsModalOpen(true);
  };

  const openEditModal = (habit: Habit) => {
      setEditingHabit(habit);
      setIsModalOpen(true);
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  // Handle Project View switching
  if (selectedProject) {
      return (
          <div className="min-h-screen bg-slate-50 p-4">
              <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)]">
                <ProjectBoard 
                    project={selectedProject} 
                    user={user}
                    onBack={() => setSelectedProject(null)}
                    onUpdate={(p) => setSelectedProject(p)}
                />
              </div>
          </div>
      )
  }

  const HabitsList = () => (
      <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-800">My Habits</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map(habit => (
                  <div key={habit.id} className="bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: habit.color }}>
                                {habit.name.charAt(0)}
                              </div>
                              <div>
                                  <h3 className="font-bold text-slate-800">{habit.name}</h3>
                                  <span className="text-xs text-slate-500 capitalize">{habit.frequency} • {habit.category}</span>
                              </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(habit)}>Edit</Button>
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-500 bg-slate-50 p-3 rounded-xl">
                          <div className="flex items-center gap-1">
                              <Activity size={16} /> Current Streak
                          </div>
                          <span className="font-bold text-slate-800">{habit.streak} days</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView}
      onAddHabit={openAddModal}
    >
      {currentView === 'dashboard' && (
        <Dashboard user={user} habits={habits} onToggle={handleToggle} onEdit={openEditModal} />
      )}
      {currentView === 'habits' && (
        <HabitsList />
      )}
      {currentView === 'projects' && (
          <ProjectsDashboard user={user} onSelectProject={setSelectedProject} />
      )}
      {currentView === 'analytics' && (
        <AnalyticsPage habits={habits} />
      )}
      {currentView === 'ai-assistant' && (
        <AIAssistantPage habits={habits} />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingHabit ? "Edit Habit" : "Create New Habit"}
      >
        <HabitForm 
            initialData={editingHabit} 
            onSubmit={handleAddHabit} 
            onCancel={() => setIsModalOpen(false)} 
        />
        {editingHabit && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm text-slate-500">Danger Zone</span>
                <Button variant="danger" size="sm" onClick={() => handleDeleteHabit(editingHabit.id)}>
                    <Trash2 size={16} className="mr-2" /> Delete Habit
                </Button>
            </div>
        )}
      </Modal>
    </Layout>
  );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
