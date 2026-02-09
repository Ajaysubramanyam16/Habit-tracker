import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Send, Bot, User as UserIcon, MessageSquare } from 'lucide-react';
import { chatWithAI } from '../services/aiService';
import { ChatMessage, Habit } from '../types';
import { getProjects } from '../services/projectService';

interface AIAssistantPageProps {
    habits: Habit[];
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ habits }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', role: 'model', text: "Hello! I'm Lumina. How can I help you today?", timestamp: new Date() }
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

    const projects = getProjects();
    const activeHabits = habits.filter(h => !h.archived).map(h => h.name).join(', ');
    const projectList = projects.map(p => p.name).join(', ');

    const contextIntro = `
    Context:
    Habits: ${activeHabits}
    Projects: ${projectList}
    User Query: ${userMsg.text}
    `;

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
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                <MessageSquare size={20} />
            </div>
            <div>
                <h2 className="font-bold text-gray-800">Discuss</h2>
                <p className="text-xs text-gray-500">AI Assistant Channel</p>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                        msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-violet-600 text-white'
                    }`}>
                        {msg.role === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`max-w-[70%] p-3 text-sm rounded-lg shadow-sm border ${
                        msg.role === 'user' 
                            ? 'bg-violet-50 border-violet-100 text-gray-800' 
                            : 'bg-white border-gray-200 text-gray-700'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center">
                        <Bot size={14} />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-400 text-sm italic">
                        Typing...
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSend} className="flex gap-2">
                <input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm transition-colors"
                />
                <Button 
                    type="submit" 
                    className="rounded w-12 px-0 bg-violet-600 hover:bg-violet-700"
                    disabled={!inputValue.trim() || isLoading}
                >
                    <Send size={16} />
                </Button>
            </form>
        </div>
    </div>
  );
};