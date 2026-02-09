import React, { useState, useEffect } from 'react';
import { Project, User } from '../types';
import { getProjects, createProject } from '../services/projectService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Plus, Folder, Clock, MoreVertical } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Projects</h1>
        <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
            <motion.div 
                key={project.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded shadow-sm border border-gray-200 cursor-pointer overflow-hidden flex flex-col h-48 relative group hover:shadow-md transition-shadow"
                onClick={() => onSelectProject(project)}
            >
                <div className="h-1 bg-violet-500 w-full"></div>
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="text-base font-bold text-gray-800 group-hover:text-violet-600 transition-colors line-clamp-1">{project.name}</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{project.description}</p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            <Clock size={12} />
                            <span>{project.tasks.length} tasks</span>
                        </div>
                        <div className="flex -space-x-1.5">
                             {project.members.slice(0,3).map((m, i) => (
                                 <img 
                                    key={i} 
                                    src={m.avatar} 
                                    className="w-6 h-6 rounded-full border border-white"
                                    title={m.name}
                                 />
                             ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project">
        <form onSubmit={handleCreate} className="space-y-4">
            <Input 
                label="Project Name" 
                value={newProjectName} 
                onChange={e => setNewProjectName(e.target.value)} 
                required
            />
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                    className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm"
                    rows={3}
                    value={newProjectDesc}
                    onChange={e => setNewProjectDesc(e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};