import { GoogleGenAI } from "@google/genai";
import { Habit, Project } from '../types';

// Helper to get client safely
const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    return new GoogleGenAI({ apiKey });
}

export const getAIBriefing = async (habits: Habit[], userName: string): Promise<string> => {
    try {
        const ai = getClient();
        const today = new Date().toISOString().split('T')[0];
        const activeHabits = habits.filter(h => !h.archived);
        const pendingCount = activeHabits.filter(h => !h.logs[today]).length;
        
        // Find best performing habit
        const bestHabit = activeHabits.sort((a,b) => b.streak - a.streak)[0];

        const prompt = `
            User: ${userName}
            Context:
            - Pending Habits Today: ${pendingCount}
            - Best Streak: ${bestHabit ? `${bestHabit.name} (${bestHabit.streak} days)` : 'None'}
            - Total Habits: ${activeHabits.length}
            
            Task: Write a concise (max 3 sentences) morning briefing for the dashboard. 
            Be professional yet motivating. Mention a specific habit if their streak is high.
            Do not use markdown.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text || "Welcome back. Let's make today productive.";
    } catch (error) {
        console.error("AI Error", error);
        return "Ready to conquer the day? Let's check off those habits.";
    }
}

export const getAIInsight = async (habits: Habit[]): Promise<string> => {
  try {
    const ai = getClient();
    
    const habitSummary = habits.map(h => 
      `- ${h.name}: Current Streak ${h.streak}, Best ${h.bestStreak}. Category: ${h.category}.`
    ).join('\n');

    const prompt = `
      You are a motivational habit coach. 
      Analyze the following habit data for a user:
      ${habitSummary}
      
      Provide a short, punchy, and motivating insight or tip (max 2 sentences). 
      Focus on the positive but give a gentle nudge if streaks are low.
      Do not use markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Keep going! Consistency is key.";
  } catch (error) {
    console.error("AI Error", error);
    return "Great job focusing on your goals today!";
  }
};

export const chatWithAI = async (message: string, history: any[] = []): Promise<string> => {
    try {
        const ai = getClient();
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: "You are Lumina, an intelligent productivity assistant. You help users manage habits, projects, and tasks. You are encouraging, concise, and professional."
            },
            history: history
        });
        
        const result = await chat.sendMessage({ message });
        return result.text || "I'm listening.";
    } catch (e) {
        console.error(e);
        return "I'm having trouble connecting right now. Please check your API key.";
    }
};

export const analyzeProject = async (project: Project): Promise<string> => {
    try {
        const ai = getClient();
        const tasks = project.tasks.map(t => `${t.title} (${t.status}, ${t.priority})`).join('\n');
        const prompt = `
            Analyze this project "${project.name}":
            Description: ${project.description}
            
            Tasks:
            ${tasks}
            
            Provide 3 bullet points on how to improve efficiency or what to focus on next. Return plain text.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return response.text || "Keep pushing forward on high priority tasks.";
    } catch (e) {
        return "Unable to analyze project at this moment.";
    }
}