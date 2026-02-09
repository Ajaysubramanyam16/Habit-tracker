import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Habit } from '../../types';

interface FocusTimerProps {
    habits: Habit[];
    onComplete: (habitId: string) => void;
    onClose: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ habits, onComplete, onClose }) => {
    const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '');
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setIsFinished(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
        setIsFinished(false);
    };

    const handleFinish = () => {
        if (selectedHabitId) {
            onComplete(selectedHabitId);
        }
        onClose();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = 1 - (timeLeft / (25 * 60));

    return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="text-violet-600" /> Focus Session
            </h2>

            {!isActive && !isFinished && timeLeft === 25 * 60 && (
                <div className="mb-8 w-full">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Select Focus Protocol</label>
                    <select 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                        value={selectedHabitId}
                        onChange={(e) => setSelectedHabitId(e.target.value)}
                    >
                        {habits.map(h => (
                            <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                {/* Circular Progress */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="120" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                    <circle 
                        cx="128" cy="128" r="120" 
                        stroke="#7c3aed" strokeWidth="8" fill="none" 
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress)}
                        className="transition-all duration-1000 linear"
                    />
                </svg>
                <div className="text-6xl font-mono font-bold text-gray-800 tabular-nums relative z-10">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex gap-4">
                {!isFinished ? (
                    <>
                        <Button 
                            onClick={toggleTimer} 
                            size="lg"
                            className={`w-32 ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-violet-600 hover:bg-violet-700'}`}
                        >
                            {isActive ? <><Pause size={20} className="mr-2"/> Pause</> : <><Play size={20} className="mr-2"/> Start</>}
                        </Button>
                        <Button variant="secondary" size="lg" onClick={resetTimer} disabled={timeLeft === 25 * 60}>
                            <Square size={20} />
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleFinish} className="w-full bg-emerald-600 hover:bg-emerald-700 animate-pulse">
                        <CheckCircle size={20} className="mr-2" /> Complete Session
                    </Button>
                )}
            </div>
            
            {isActive && (
                <p className="mt-6 text-sm text-gray-500 italic">"Focus is the key to all high performance."</p>
            )}
        </div>
    );
};