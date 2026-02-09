import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProjectsDashboard } from './pages/ProjectsDashboard';
import { ProjectBoard } from './pages/ProjectBoard';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { CommunityPage } from './pages/CommunityPage';
import { SettingsPage } from './pages/SettingsPage';
import { HabitForm } from './components/habits/HabitForm';
import { ReflectionModal } from './components/habits/ReflectionModal';
import { FocusTimer } from './components/tools/FocusTimer';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { AchievementModal } from './components/ui/AchievementModal';
import { Habit, ViewMode, Project, JournalEntry, Badge } from './types';
import { getHabits, saveHabits, toggleHabitCompletion, addJournalEntry } from './services/habitService';
import { addXp, saveUser } from './services/authService';
import { checkBadges } from './services/gamificationService';
import { Trash2, Activity } from 'lucide-react';

function AppContent() {
  const { user, isLoading, refreshUser } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'habit' | 'reflection' | 'focus'>('habit');
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  
  // Gamification State
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  
  // Project State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (user?.id) {
        const data = getHabits();
        const userHabits = data.map(h => {
             if (!h.userId) return { ...h, userId: user.id };
             return h;
        }).filter(h => h.userId === user.id);
        
        setHabits(userHabits.length > 0 ? userHabits : data.filter(h => !h.userId));
    }
  }, [user?.id]);

  const handleToggle = (id: string, date: string) => {
    if (!user) return;
    
    const wasCompleted = habits.find(h => h.id === id)?.logs[date];
    const updated = toggleHabitCompletion(habits, id, date);
    setHabits(updated);
    saveToStorage(updated);
    
    // Gamification Logic: +10 XP for completion
    if (!wasCompleted) {
        const { user: updatedUser } = addXp(10);
        
        // Check for new badges
        const newBadges = checkBadges(updatedUser, updated);
        if (newBadges.length > 0) {
            updatedUser.badges = [...updatedUser.badges, ...newBadges];
            saveUser(updatedUser);
            setUnlockedBadges(newBadges); // Trigger Modal
        }
        
        refreshUser(); 
    }
  };
  
  const saveToStorage = (updatedHabits: Habit[]) => {
      const allHabits = getHabits();
      const merged = allHabits.map(h => {
          const updatedHabit = updatedHabits.find(u => u.id === h.id);
          return updatedHabit || h;
      });
      saveHabits(merged);
  }

  const handleAddHabit = (habit: Habit) => {
    let updated;
    if (editingHabit) {
        updated = habits.map(h => h.id === habit.id ? habit : h);
    } else {
        updated = [...habits, habit];
    }
    setHabits(updated);
    saveToStorage(updated);
    
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

  const handleJournalEntry = (entry: JournalEntry) => {
      if (editingHabit && user) {
          const todayStr = new Date().toISOString().split('T')[0];
          const updated = addJournalEntry(habits, editingHabit.id, todayStr, entry);
          setHabits(updated);
          saveToStorage(updated);
          
          // Also mark as done if reflected?
          if (!editingHabit.logs[todayStr]) {
              handleToggle(editingHabit.id, todayStr);
          } else {
              addXp(5); // Bonus for reflecting
              refreshUser();
          }
      }
      setIsModalOpen(false);
  };
  
  const handleFocusComplete = (habitId: string) => {
      if (!user) return;
      const todayStr = new Date().toISOString().split('T')[0];
      const habit = habits.find(h => h.id === habitId);
      if (habit && !habit.logs[todayStr]) {
          handleToggle(habitId, todayStr);
      } else {
          // Just give XP if already checked
           addXp(50);
           refreshUser();
      }
  };

  const openAddModal = () => {
      setEditingHabit(undefined);
      setModalType('habit');
      setIsModalOpen(true);
  };

  const openEditModal = (habit: Habit) => {
      setEditingHabit(habit);
      setModalType('habit');
      setIsModalOpen(true);
  };
  
  const openReflectionModal = (habit: Habit) => {
      setEditingHabit(habit);
      setModalType('reflection');
      setIsModalOpen(true);
  };

  const openFocusModal = () => {
      setModalType('focus');
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
        <Dashboard 
            user={user} 
            habits={habits} 
            onToggle={handleToggle} 
            onEdit={openEditModal}
            onOpenFocus={openFocusModal}
            onReflect={openReflectionModal}
        />
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
      {currentView === 'community' && (
        <CommunityPage />
      )}
      {currentView === 'ai-assistant' && (
        <AIAssistantPage habits={habits} />
      )}
      {currentView === 'settings' && (
        <SettingsPage user={user} />
      )}

      {/* Global Modals */}
      <AchievementModal 
          badges={unlockedBadges} 
          onClose={() => setUnlockedBadges([])} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
            modalType === 'focus' ? 'Focus Session' :
            modalType === 'reflection' ? 'Reflection' :
            editingHabit ? "Edit Habit" : "Create New Habit"
        }
      >
        {modalType === 'habit' && (
            <>
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
            </>
        )}

        {modalType === 'reflection' && editingHabit && (
            <ReflectionModal 
                habitName={editingHabit.name} 
                onSubmit={handleJournalEntry}
                onCancel={() => setIsModalOpen(false)}
            />
        )}

        {modalType === 'focus' && (
            <FocusTimer 
                habits={habits.filter(h => !h.archived)} 
                onComplete={handleFocusComplete}
                onClose={() => setIsModalOpen(false)}
            />
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