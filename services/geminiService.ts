
import { GoogleGenAI } from "@google/genai";
import { CalculationInputs, CalculationOutputs } from "../types";

// Fixing incorrect type imports and updating property names to match definitions in types.ts
export const generatePreparationGuide = async (
  patient: CalculationInputs,
  result: CalculationOutputs,
  formulaNames: { standard: string; special: string; modular: string }
) => {
  // Initialize AI client inside the function to ensure the latest API key from the environment is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    You are a metabolic clinical nutrition expert. Write a detailed preparation guide in English based on:
    Disease: ${patient.disease}
    Weight: ${patient.weightKg} kg

    Calculated ingredients:
    1. ${formulaNames.standard}: ${result.recipe.standardG.toFixed(1)} g
    2. ${formulaNames.special}: ${result.recipe.specialG.toFixed(1)} g
    3. ${formulaNames.modular}: ${result.recipe.modularG.toFixed(1)} g
    4. Required water volume: ${result.recipe.totalVolume.toFixed(0)} mL

    Nutrition output:
    - Total calories: ${result.actuals.kcal.toFixed(0)} kcal
    - Total protein: ${result.actuals.protein.toFixed(1)} g

    Required:
    1. Precise preparation steps (sterilization, water temperature, mixing order).
    2. Caregiver monitoring tips.
    3. One important medical caution.
    Keep the style professional and very clear for caregivers.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // The response.text property is used directly as per guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, an error occurred while generating the preparation guide. Please review calculations manually.";
  }
};
