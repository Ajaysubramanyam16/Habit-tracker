import React, { useState } from 'react';
import { Project, User, TaskStatus, Task } from '../types';
import { updateTaskStatus, addTask, addMember } from '../services/projectService';
import { findUserByEmail } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ChevronLeft, Plus, MoreHorizontal, Sparkles, UserPlus, Search } from 'lucide-react';
import { analyzeProject } from '../services/aiService';

interface ProjectBoardProps {
  project: Project;
  user: User;
  onBack: () => void;
  onUpdate: (updatedProject: Project) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-100' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-blue-50' },
  { id: 'review', label: 'Review', color: 'bg-amber-50' },
  { id: 'done', label: 'Done', color: 'bg-emerald-50' },
];

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ project, user, onBack, onUpdate }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low'|'medium'|'high'>('medium');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Invite state
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
          // Mock finding user
          const foundUser = await findUserByEmail(inviteEmail);
          
          if (foundUser) {
              const updatedList = addMember(project.id, foundUser, user);
              const p = updatedList.find(pr => pr.id === project.id);
              if (p) {
                  onUpdate(p);
                  setInviteStatus('success');
                  setInviteMessage(`Successfully added ${foundUser.name}!`);
                  setTimeout(() => {
                      setIsInviteModalOpen(false);
                      setInviteEmail('');
                      setInviteStatus('idle');
                      setInviteMessage('');
                  }, 1500);
              }
          } else {
              setInviteStatus('error');
              setInviteMessage('User not found. Try a different email.');
          }
      } catch (err) {
          setInviteStatus('error');
          setInviteMessage('An error occurred.');
      }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 hover:bg-white hover:shadow-md transition-all">
                <ChevronLeft size={20} />
            </Button>
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-2">
                        {project.members.map((m, i) => (
                            <img 
                                key={i}
                                src={m.avatar} 
                                alt={m.name}
                                title={m.name}
                                className="w-6 h-6 rounded-full border-2 border-slate-50"
                            />
                        ))}
                    </div>
                    <span className="text-sm text-slate-500 font-medium ml-1">{project.members.length} members</span>
                    <button onClick={() => setIsInviteModalOpen(true)} className="ml-2 text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md">
                        <UserPlus size={12} /> Invite
                    </button>
                </div>
            </div>
        </div>
        <div className="flex gap-3">
            <Button variant="secondary" onClick={handleAnalyze} isLoading={analyzing} className="bg-white shadow-sm border-slate-200">
                <Sparkles size={16} className="mr-2 text-indigo-600" /> AI Insights
            </Button>
            <Button onClick={() => setIsTaskModalOpen(true)} className="shadow-lg shadow-indigo-200">
                <Plus size={18} className="mr-2" /> Add Task
            </Button>
        </div>
      </div>

      {aiAnalysis && (
          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm text-slate-800 text-sm whitespace-pre-line relative">
              <button onClick={() => setAiAnalysis(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">×</button>
              <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-indigo-600" />
                  <strong className="text-indigo-900">Project Analysis</strong>
              </div>
              <div className="leading-relaxed">{aiAnalysis}</div>
          </div>
      )}

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-6">
        <div className="flex gap-8 min-w-max h-full">
            {COLUMNS.map(col => {
                const tasks = project.tasks.filter(t => t.status === col.id);
                return (
                    <div key={col.id} className="w-80 flex flex-col h-full bg-slate-100/50 rounded-2xl border border-slate-200/60">
                        <div className="p-4 flex justify-between items-center border-b border-slate-200/60 bg-white/50 rounded-t-2xl backdrop-blur-sm">
                            <span className="font-bold text-slate-700 flex items-center gap-2.5">
                                <div className={`w-2.5 h-2.5 rounded-full ${col.id === 'done' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                {col.label}
                            </span>
                            <span className="text-xs bg-white text-slate-600 px-2.5 py-1 rounded-md font-bold shadow-sm">{tasks.length}</span>
                        </div>
                        <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                            {tasks.map(task => (
                                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-indigo-200 hover:translate-y-[-2px] transition-all duration-200 group cursor-grab active:cursor-grabbing">
                                    <div className="flex justify-between items-start mb-2.5">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                                            task.priority === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                            task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                            'bg-slate-50 text-slate-500 border-slate-100'
                                        }`}>
                                            {task.priority}
                                        </span>
                                        <button className="text-slate-300 hover:text-slate-600">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    <h4 className="font-semibold text-slate-800 text-sm mb-4 leading-snug">{task.title}</h4>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            {task.assignee ? (
                                                <img 
                                                    src={task.assignee.avatar} 
                                                    alt={task.assignee.name}
                                                    title={task.assignee.name}
                                                    className="w-6 h-6 rounded-full border border-slate-100" 
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">?</div>
                                            )}
                                        </div>
                                        
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {col.id !== 'todo' && (
                                                <button 
                                                    onClick={() => handleStatusChange(task.id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) - 1].id)}
                                                    className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded hover:bg-indigo-50 text-slate-400 hover:text-indigo-600"
                                                >
                                                    ←
                                                </button>
                                            )}
                                            {col.id !== 'done' && (
                                                <button 
                                                    onClick={() => handleStatusChange(task.id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) + 1].id)}
                                                    className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded hover:bg-indigo-50 text-slate-400 hover:text-indigo-600"
                                                >
                                                    →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Add Task">
          <form onSubmit={handleAddTask} className="space-y-5">
              <Input 
                label="Task Title" 
                value={newTaskTitle} 
                onChange={e => setNewTaskTitle(e.target.value)} 
                required 
                placeholder="What needs to be done?"
              />
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <div className="grid grid-cols-3 gap-3">
                      {['low', 'medium', 'high'].map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewTaskPriority(p as any)}
                            className={`py-2 px-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                                newTaskPriority === p 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' 
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                              {p}
                          </button>
                      ))}
                  </div>
              </div>
              <div className="flex justify-end pt-3">
                  <Button type="submit" className="w-full">Add Task</Button>
              </div>
          </form>
      </Modal>

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Member">
          <form onSubmit={handleInvite} className="space-y-5">
              <div className="bg-indigo-50 p-4 rounded-xl flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm">
                      <UserPlus size={20} />
                  </div>
                  <div>
                      <h4 className="text-sm font-bold text-indigo-900">Collaborate</h4>
                      <p className="text-xs text-indigo-700 mt-1">Invite team members to assign tasks and track progress together.</p>
                  </div>
              </div>
              
              <div className="relative">
                <Input 
                    label="Email Address" 
                    type="email"
                    value={inviteEmail} 
                    onChange={e => setInviteEmail(e.target.value)} 
                    required 
                    placeholder="colleague@example.com"
                />
                {inviteStatus === 'searching' && (
                    <div className="absolute right-3 top-[34px]">
                        <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                    </div>
                )}
              </div>

              {inviteMessage && (
                  <div className={`text-sm p-3 rounded-lg ${inviteStatus === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {inviteMessage}
                  </div>
              )}

              <div className="flex justify-end pt-2">
                  <Button type="submit" className="w-full" disabled={inviteStatus === 'searching'}>
                      Send Invitation
                  </Button>
              </div>
          </form>
      </Modal>
    </div>
  );
};
