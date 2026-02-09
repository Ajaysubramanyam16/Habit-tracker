import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { JournalEntry } from '../../types';
import { Smile, Meh, Frown } from 'lucide-react';

interface ReflectionModalProps {
    habitName: string;
    onSubmit: (entry: JournalEntry) => void;
    onCancel: () => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ habitName, onSubmit, onCancel }) => {
    const [note, setNote] = useState('');
    const [mood, setMood] = useState<'great' | 'neutral' | 'difficult'>('great');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            note,
            mood,
            timestamp: new Date().toISOString()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Log Activity for <span className="font-bold text-violet-600">{habitName}</span></h3>
                <p className="text-sm text-gray-500">Take a moment to reflect on your progress.</p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">How did it feel?</label>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => setMood('great')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all w-24 ${mood === 'great' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-200 text-gray-500'}`}
                    >
                        <Smile size={32} />
                        <span className="text-xs font-bold">Great</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMood('neutral')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all w-24 ${mood === 'neutral' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200 text-gray-500'}`}
                    >
                        <Meh size={32} />
                        <span className="text-xs font-bold">Neutral</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMood('difficult')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all w-24 ${mood === 'difficult' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-200 text-gray-500'}`}
                    >
                        <Frown size={32} />
                        <span className="text-xs font-bold">Hard</span>
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none text-sm"
                    rows={3}
                    placeholder="What went well? What was challenging?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Skip</Button>
                <Button type="submit">Save Entry</Button>
            </div>
        </form>
    );
};