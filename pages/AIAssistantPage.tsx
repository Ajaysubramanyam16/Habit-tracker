import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { chatWithAI } from '../services/aiService';
import { ChatMessage, Habit, Project } from '../types';
import { getHabits } from '../services/habitService';
import { getProjects } from '../services/projectService';

interface AIAssistantPageProps {
    habits: Habit[];
    // We could pass projects here too, or fetch them
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ habits }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', role: 'model', text: "Hello! I'm Lumina. I have access to your habits and projects. How can I help you optimize your routine today?", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'user',
        text: inputValue,
        timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Fetch projects context dynamically
    const projects = getProjects();
    const activeHabits = habits.filter(h => !h.archived).map(h => `${h.name} (${h.streak} day streak)`).join(', ');
    const projectList = projects.map(p => `${p.name} (${p.tasks.length} tasks)`).join(', ');

    const contextIntro = `
    User Context:
    Active Habits: ${activeHabits}
    Current Projects: ${projectList}
    
    User Query: ${userMsg.text}
    `;

    // Format history for API with context injected in the last message
    // In a real app, context would be in system instruction or tiered
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await chatWithAI(contextIntro, history);
    
    const botMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-4 shadow-sm z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Bot size={24} />
            </div>
            <div>
                <h2 className="font-bold text-lg text-slate-800">Lumina Assistant</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Online & Context Aware
                </p>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                        msg.role === 'user' ? 'bg-white border border-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                        {msg.role === 'user' ? <UserIcon size={16} /> : <Sparkles size={16} />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                        <Sparkles size={16} />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex gap-3 relative max-w-4xl mx-auto">
                <input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about your habits, tasks, or just chat..."
                    className="w-full pl-5 pr-14 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 shadow-inner"
                />
                <Button 
                    type="submit" 
                    className="absolute right-2 top-2 bottom-2 rounded-lg w-12 px-0 flex items-center justify-center shadow-md bg-indigo-600 hover:bg-indigo-700"
                    disabled={!inputValue.trim() || isLoading}
                >
                    <Send size={20} />
                </Button>
            </form>
        </div>
    </div>
  );
};
