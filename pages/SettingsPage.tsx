import React from 'react';
import { User } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Download, User as UserIcon, Shield, Bell } from 'lucide-react';
import { getHabits } from '../services/habitService';
import { getProjects } from '../services/projectService';

interface SettingsPageProps {
    user: User;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
    
    const handleExport = () => {
        const data = {
            user: user,
            habits: getHabits(),
            projects: getProjects(),
            exportDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lumina-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
             <div>
                <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500">Manage your profile and preferences.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
                        <p className="text-sm text-gray-500">Update your personal details.</p>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Display Name" defaultValue={user.name} />
                        <Input label="Email Address" defaultValue={user.email} disabled />
                    </div>
                    <div className="flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Data & Privacy</h2>
                        <p className="text-sm text-gray-500">Control your data.</p>
                    </div>
                </div>
                <div className="p-8 space-y-4">
                     <p className="text-sm text-gray-600">
                         You can export all your habit history, projects, and journal entries as a JSON file.
                     </p>
                     <Button variant="outline" onClick={handleExport}>
                         <Download size={16} className="mr-2" /> Export My Data
                     </Button>
                </div>
            </div>
            
             <div className="text-center text-xs text-gray-400 py-4">
                 Lumina Habits v1.2.0 • High Performance System
             </div>
        </div>
    );
};