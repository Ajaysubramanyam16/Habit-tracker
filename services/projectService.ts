import { Project, Task, User, TaskStatus, ActivityLogEntry } from '../types';

const STORAGE_KEY_PROJECTS = 'lumina_projects';

const simpleId = () => Math.random().toString(36).substr(2, 9);

export const getProjects = (): Project[] => {
  const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
  if (!data) {
    // Seed default project
    const seed: Project[] = [{
      id: 'proj_1',
      name: 'Website Redesign',
      description: 'Overhaul the main landing page with new branding.',
      members: [],
      ownerId: '1',
      tasks: [
        { id: 't1', title: 'Design System', status: 'done', priority: 'high', description: 'Create tokens.' },
        { id: 't2', title: 'Hero Component', status: 'in-progress', priority: 'high', description: 'Implement new hero.' },
        { id: 't3', title: 'Mobile Responsiveness', status: 'todo', priority: 'medium', description: 'Check iOS.' },
      ],
      activityLog: [
        { id: 'l1', userId: 'system', userName: 'System', action: 'Project created', timestamp: new Date().toISOString() }
      ]
    }];
    saveProjects(seed);
    return seed;
  }
  return JSON.parse(data);
};

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
};

export const createProject = (name: string, description: string, owner: User): Project => {
  const projects = getProjects();
  const newProject: Project = {
    id: simpleId(),
    name,
    description,
    members: [owner],
    ownerId: owner.id,
    tasks: [],
    activityLog: [{
      id: simpleId(),
      userId: owner.id,
      userName: owner.name,
      action: 'created the project',
      timestamp: new Date().toISOString()
    }]
  };
  saveProjects([...projects, newProject]);
  return newProject;
};

export const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus, user: User) => {
  const projects = getProjects();
  const updated = projects.map(p => {
    if (p.id !== projectId) return p;
    
    const task = p.tasks.find(t => t.id === taskId);
    const oldStatus = task?.status;
    
    return {
      ...p,
      tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t),
      activityLog: [
        {
           id: simpleId(),
           userId: user.id,
           userName: user.name,
           action: `moved "${task?.title}" from ${oldStatus} to ${status}`,
           timestamp: new Date().toISOString()
        },
        ...p.activityLog
      ]
    };
  });
  saveProjects(updated);
  return updated;
};

export const addTask = (projectId: string, task: Task, user: User) => {
    const projects = getProjects();
    const updated = projects.map(p => {
        if (p.id !== projectId) return p;
        return {
            ...p,
            tasks: [...p.tasks, task],
            activityLog: [{
                id: simpleId(),
                userId: user.id,
                userName: user.name,
                action: `added task "${task.title}"`,
                timestamp: new Date().toISOString()
             }, ...p.activityLog]
        };
    });
    saveProjects(updated);
    return updated;
};

export const addMember = (projectId: string, userToAdd: User, invitedBy: User): Project[] => {
    const projects = getProjects();
    const updated = projects.map(p => {
        if (p.id !== projectId) return p;
        if (p.members.some(m => m.id === userToAdd.id)) return p; // Already member
        
        return {
            ...p,
            members: [...p.members, userToAdd],
            activityLog: [{
                id: simpleId(),
                userId: invitedBy.id,
                userName: invitedBy.name,
                action: `invited ${userToAdd.name}`,
                timestamp: new Date().toISOString()
            }, ...p.activityLog]
        };
    });
    saveProjects(updated);
    return updated;
}
