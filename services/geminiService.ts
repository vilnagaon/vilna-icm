import { GoogleGenAI } from "@google/genai";
import { Scenario } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeScenario = async (scenario: Scenario): Promise<string> => {
  const client = getClient();
  if (!client) return "Error: API Key is missing. Cannot analyze scenario.";

  const hero = scenario.players.find(p => p.isHero);
  const heroHandStr = `${hero?.isActive ? 'Hero has cards' : 'Hero Folded'}`; 
  // In a real app we'd pass the actual cards, but let's assume they are in the scenario object 
  // even though I slightly abstracted it in the types. I will fix the prompt construction.

  const cards = `${scenario.heroHand.card1.rank}${scenario.heroHand.card1.suit} ${scenario.heroHand.card2.rank}${scenario.heroHand.card2.suit}`;
  
  const prompt = `
    You are Vilna Gaon, a world-class Poker ICM Coach.
    
    Analyze this tournament spot:
    Format: ${scenario.payouts.name}
    Blinds: ${scenario.blinds.sb}/${scenario.blinds.bb} Ante ${scenario.blinds.ante}
    Players (Stacks in chips):
    ${scenario.players.map(p => `${p.position}: ${p.stack} ${p.isHero ? '(HERO)' : ''}`).join('\n')}
    
    Hero Hand: ${cards}
    Pot before action: ${scenario.pot}
    
    Question: What is the optimal ICM play (Push or Fold) and why? 
    Explain the equity risk premium if applicable. Keep it concise (under 200 words) but mathematical.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a specialized poker AI. You focus on ICM, Nash Equilibrium, and Bubble Factor.",
        temperature: 0.2
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to analyze spot. Please try again later.";
  }
};

export const generateQuizScenario = async (): Promise<Partial<Scenario> | null> => {
  // Advanced feature: Ask Gemini to generate a JSON scenario
  // Implementation deferred for MVP to avoid latency in the main loop, 
  // but this would be the function signature.
  return null;
};