import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HabitForm } from './components/habits/HabitForm';
import { Modal } from './components/ui/Modal';
import { Habit, ViewMode } from './types';
import { getHabits, saveHabits, toggleHabitCompletion } from './services/habitService';
import { Trash2, Archive, Activity } from 'lucide-react';
import { Button } from './components/ui/Button';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

  useEffect(() => {
    // Load data
    const data = getHabits();
    setHabits(data);
  }, []);

  const handleToggle = (id: string, date: string) => {
    const updated = toggleHabitCompletion(habits, id, date);
    setHabits(updated);
    saveHabits(updated);
  };

  const handleAddHabit = (habit: Habit) => {
    let updated;
    if (editingHabit) {
        updated = habits.map(h => h.id === habit.id ? habit : h);
    } else {
        updated = [...habits, habit];
    }
    setHabits(updated);
    saveHabits(updated);
    setIsModalOpen(false);
    setEditingHabit(undefined);
  };

  const handleDeleteHabit = (id: string) => {
      if (confirm('Are you sure you want to delete this habit?')) {
          const updated = habits.filter(h => h.id !== id);
          setHabits(updated);
          saveHabits(updated);
          setIsModalOpen(false); // Close modal if editing
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

  // Simple Habits List View for "My Habits" page
  const HabitsList = () => (
      <div className="space-y-6">
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
        <Dashboard habits={habits} onToggle={handleToggle} onEdit={openEditModal} />
      )}
      {currentView === 'habits' && (
        <HabitsList />
      )}
      {currentView === 'analytics' && (
        <AnalyticsPage habits={habits} />
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

export default App;
