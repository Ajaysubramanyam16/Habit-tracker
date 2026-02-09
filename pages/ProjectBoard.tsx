import React, { useState } from 'react';
import { Project, User, TaskStatus, Task } from '../types';
import { updateTaskStatus, addTask, addMember } from '../services/projectService';
import { findUserByEmail } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ChevronLeft, Plus, MoreHorizontal, Sparkles, UserPlus, Settings } from 'lucide-react';
import { analyzeProject } from '../services/aiService';

interface ProjectBoardProps {
  project: Project;
  user: User;
  onBack: () => void;
  onUpdate: (updatedProject: Project) => void;
}

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ project, user, onBack, onUpdate }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low'|'medium'|'high'>('medium');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'searching' | 'success' | 'error'>('idle');
  const [inviteMessage, setInviteMessage] = useState('');

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updated = updateTaskStatus(project.id, taskId, newStatus, user);
    const p = updated.find(p => p.id === project.id);
    if (p) onUpdate(p);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    
    const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTaskTitle,
        status: 'todo',
        priority: newTaskPriority,
        assignee: user
    };

    const updated = addTask(project.id, newTask, user);
    const p = updated.find(p => p.id === project.id);
    if (p) onUpdate(p);
    
    setIsTaskModalOpen(false);
    setNewTaskTitle('');
  };

  const handleAnalyze = async () => {
      setAnalyzing(true);
      const result = await analyzeProject(project);
      setAiAnalysis(result);
      setAnalyzing(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
      e.preventDefault();
      setInviteStatus('searching');
      try {
          const foundUser = await findUserByEmail(inviteEmail);
          
          if (foundUser) {
              const updatedList = addMember(project.id, foundUser, user);
              const p = updatedList.find(pr => pr.id === project.id);
              if (p) {
                  onUpdate(p);
                  setInviteStatus('success');
                  setInviteMessage(`Added ${foundUser.name}`);
                  setTimeout(() => {
                      setIsInviteModalOpen(false);
                      setInviteEmail('');
                      setInviteStatus('idle');
                      setInviteMessage('');
                  }, 1500);
              }
          } else {
              setInviteStatus('error');
              setInviteMessage('User not found');
          }
      } catch (err) {
          setInviteStatus('error');
          setInviteMessage('Error connecting');
      }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-500">
                <ChevronLeft size={20} />
            </Button>
            <div>
                <h1 className="text-lg font-bold text-gray-800">{project.name}</h1>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{project.members.length} Members</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <button onClick={() => setIsInviteModalOpen(true)} className="text-violet-600 hover:underline flex items-center gap-1">
                        <UserPlus size={12} /> Invite
                    </button>
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" onClick={handleAnalyze} isLoading={analyzing}>
                <Sparkles size={16} className="mr-2" /> AI
            </Button>
            <Button onClick={() => setIsTaskModalOpen(true)}>
                <Plus size={16} className="mr-2" /> New Task
            </Button>
            <Button variant="ghost" className="px-2">
                <Settings size={18} />
            </Button>
        </div>
      </div>

      {aiAnalysis && (
          <div className="mb-6 bg-blue-50 p-4 rounded border border-blue-100 text-blue-900 text-sm relative">
              <button onClick={() => setAiAnalysis(null)} className="absolute top-2 right-2 text-blue-400 hover:text-blue-700">×</button>
              <div className="whitespace-pre-line">{aiAnalysis}</div>
          </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
            {COLUMNS.map(col => {
                const tasks = project.tasks.filter(t => t.status === col.id);
                return (
                    <div key={col.id} className="w-80 flex flex-col h-full bg-gray-100 rounded border border-gray-200">
                        {/* Column Header */}
                        <div className="p-3 flex justify-between items-center font-bold text-gray-700 text-sm border-b border-gray-200 bg-gray-50 rounded-t">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                {col.label}
                            </div>
                            <span className="text-xs font-normal text-gray-500 bg-white border px-1.5 rounded">{tasks.length}</span>
                        </div>

                        {/* Drop Zone */}
                        <div className="p-2 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                            {tasks.map(task => (
                                <div key={task.id} className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
                                        {task.assignee && (
                                            <img src={task.assignee.avatar} className="w-5 h-5 rounded-full" title={task.assignee.name} />
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-2">
                                        <div className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                                            task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 
                                            task.priority === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                            'bg-gray-50 text-gray-500 border-gray-100'
                                        }`}>
                                            {task.priority} priority
                                        </div>
                                    </div>

                                    {/* Simplified Actions */}
                                    <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {col.id !== 'todo' && (
                                            <button 
                                                onClick={() => handleStatusChange(task.id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) - 1].id)}
                                                className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                            >
                                                ←
                                            </button>
                                        )}
                                        {col.id !== 'done' && (
                                            <button 
                                                onClick={() => handleStatusChange(task.id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) + 1].id)}
                                                className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                            >
                                                →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="New Task">
          <form onSubmit={handleAddTask} className="space-y-4">
              <Input 
                label="Task Title" 
                value={newTaskTitle} 
                onChange={e => setNewTaskTitle(e.target.value)} 
                required 
              />
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                  <select 
                    className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm"
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                  >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                  </select>
              </div>
              <div className="flex justify-end pt-2">
                  <Button type="submit">Add</Button>
              </div>
          </form>
      </Modal>

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite User">
          <form onSubmit={handleInvite} className="space-y-4">
            <Input 
                label="Email" 
                type="email"
                value={inviteEmail} 
                onChange={e => setInviteEmail(e.target.value)} 
                required 
            />
            {inviteMessage && (
                <div className={`text-sm ${inviteStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {inviteMessage}
                </div>
            )}
            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={inviteStatus === 'searching'}>Invite</Button>
            </div>
          </form>
      </Modal>
    </div>
  );
};