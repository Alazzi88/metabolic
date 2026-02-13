
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
    بصفتك خبير تغذية علاجية للأمراض الاستقلابية، قم بكتابة طريقة تحضير مفصلة باللغة العربية بناءً على المعطيات التالية:
    المرض: ${patient.disease}
    الوزن: ${patient.weightKg} كجم
    
    المكونات المحسوبة:
    1. ${formulaNames.standard}: ${result.recipe.standardG.toFixed(1)} جرام
    2. ${formulaNames.special}: ${result.recipe.specialG.toFixed(1)} جرام
    3. ${formulaNames.modular}: ${result.recipe.modularG.toFixed(1)} جرام
    4. كمية الماء المطلوبة: ${result.recipe.totalVolume.toFixed(0)} مل
    
    المخرجات الغذائية:
    - إجمالي السعرات: ${result.actuals.kcal.toFixed(0)} كيلو كالوري
    - إجمالي البروتين: ${result.actuals.protein.toFixed(1)} جرام
    
    المطلوب:
    1. خطوات التحضير الدقيقة (التعقيم، درجة حرارة الماء، الخلط).
    2. نصائح للأم حول كيفية المراقبة.
    3. تنبيه طبي مهم.
    اجعل الأسلوب مهني وواضح جداً للأمهات.
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
    return "عذراً، حدث خطأ أثناء توليد دليل التحضير. يرجى مراجعة الحسابات يدوياً.";
  }
};
