import { GoogleGenAI } from '@google/genai';
import { BudgetEstimate } from '../types/budget';

export async function getBudgetEstimate(destination: string, days: number, apiKey: string): Promise<BudgetEstimate> {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
Generate a travel budget estimate for a trip to ${destination} for ${days} days.
Provide an average daily spending estimate (in the most relevant local/major currency, clearly labeling the currency).
Include a category-based budget breakdown covering at least: Accommodation, Food & Drink, Local Transportation, Activities & Attractions, and Shopping & Miscellaneous.
Include the multi-day total estimated cost (daily average x number of days).

Respond strictly in JSON using the following schema (no markdown, no prose, no code fences):
{
  "destination": "string",
  "days": number,
  "currency": "string",
  "dailyAverage": number,
  "totalEstimated": number,
  "categories": [
    { "name": "Accommodation", "dailyAmount": number, "percentage": number },
    { "name": "Food & Drink", "dailyAmount": number, "percentage": number },
    { "name": "Local Transportation", "dailyAmount": number, "percentage": number },
    { "name": "Activities & Attractions", "dailyAmount": number, "percentage": number },
    { "name": "Shopping & Miscellaneous", "dailyAmount": number, "percentage": number }
  ],
  "notes": "string"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let rawText = response.text || '';
    
    // Strip markdown code fences if the model still includes them despite instructions
    rawText = rawText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    const data: BudgetEstimate = JSON.parse(rawText);
    return data;
  } catch (error) {
    console.error('Failed to parse or fetch Gemini response', error);
    throw new Error('Failed to generate budget estimate. Please check your API key or try again.');
  }
}
