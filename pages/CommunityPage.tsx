import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { getLeaderboard } from '../services/authService';
import { Trophy, Medal, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export const CommunityPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboard().then(data => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="text-yellow-500" fill="currentColor" />;
        if (index === 1) return <Medal className="text-slate-400" fill="currentColor" />;
        if (index === 2) return <Medal className="text-amber-700" fill="currentColor" />;
        return <span className="text-gray-400 font-bold text-lg">#{index + 1}</span>;
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-800">Community Leaderboard</h1>
                <p className="text-gray-500">See how you stack up against other high performers.</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-7">User</div>
                        <div className="col-span-2 text-center">Level</div>
                        <div className="col-span-2 text-right">XP</div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {users.map((u, index) => (
                            <motion.div 
                                key={u.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`grid grid-cols-12 gap-4 p-5 items-center hover:bg-violet-50/30 transition-colors ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}`}
                            >
                                <div className="col-span-1 flex justify-center">
                                    {getRankIcon(index)}
                                </div>
                                <div className="col-span-7 flex items-center gap-4">
                                    <div className="relative">
                                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                                        {index === 0 && <div className="absolute -top-2 -right-2 bg-yellow-400 text-[8px] px-1 rounded-full font-bold">MVP</div>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{u.name}</p>
                                        <p className="text-xs text-gray-500">{u.role === 'admin' ? 'Administrator' : 'Member'}</p>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                                        Lvl {u.level}
                                    </span>
                                </div>
                                <div className="col-span-2 text-right font-mono font-bold text-violet-600">
                                    {u.xp.toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};