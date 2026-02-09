import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../types';
import { Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementModalProps {
    badges: Badge[];
    onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ badges, onClose }) => {
    useEffect(() => {
        if (badges.length > 0) {
            // Trigger confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#7c3aed', '#fbbf24', '#10b981']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#7c3aed', '#fbbf24', '#10b981']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [badges]);

    if (badges.length === 0) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl shadow-2xl border-4 border-yellow-400 p-8 max-w-sm w-full text-center pointer-events-auto relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300"></div>
                    
                    <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>

                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
                        {badges[0].icon}
                    </div>

                    <h3 className="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-1">Achievement Unlocked</h3>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">{badges[0].name}</h2>
                    <p className="text-gray-600 mb-6">{badges[0].description}</p>

                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
                    >
                        Awesome!
                    </button>
                    
                    {badges.length > 1 && (
                        <p className="text-xs text-gray-400 mt-3">
                            +{badges.length - 1} more unlocked
                        </p>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};