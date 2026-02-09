import React, { useState, useEffect } from 'react';
import { Project, User } from '../types';
import { getProjects, createProject } from '../services/projectService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Plus, Folder, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectsDashboardProps {
  user: User;
  onSelectProject: (project: Project) => void;
}

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({ user, onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
    const p = createProject(newProjectName, newProjectDesc, user);
    setProjects([...projects, p]);
    setIsModalOpen(false);
    setNewProjectName('');
    setNewProjectDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
            <p className="text-slate-500">Collaborate and manage your work.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
            <motion.div 
                key={project.id}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer group"
                onClick={() => onSelectProject(project)}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Folder size={24} />
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {project.tasks.length} tasks
                    </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{project.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{project.description}</p>
                
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <Users size={14} /> {project.members.length} members
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} /> Updated recently
                    </div>
                </div>
            </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4">
            <Input 
                label="Project Name" 
                value={newProjectName} 
                onChange={e => setNewProjectName(e.target.value)} 
                placeholder="e.g. Website Redesign"
                required
            />
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows={3}
                    value={newProjectDesc}
                    onChange={e => setNewProjectDesc(e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Project</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};
