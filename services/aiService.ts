import { GoogleGenAI } from "@google/genai";
import { Habit } from '../types';

export const getAIInsight = async (habits: Habit[]): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Please configure your API Key to receive personalized AI coaching.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
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
