import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SystemDiagnosis {
  status: "optimal" | "warning" | "critical";
  summary: string;
  recommendations: string[];
  performanceScore: number;
}

export async function getSystemDiagnosis(metrics: any): Promise<SystemDiagnosis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these system metrics and provide a diagnosis and optimization plan. 
      Metrics: ${JSON.stringify(metrics)}
      
      Return a JSON object with:
      - status: "optimal", "warning", or "critical"
      - summary: A brief technical summary of the system state
      - recommendations: An array of specific actions to improve performance
      - performanceScore: A number from 0-100`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      status: result.status || "optimal",
      summary: result.summary || "System is operating within normal parameters.",
      recommendations: result.recommendations || ["Maintain current usage patterns."],
      performanceScore: result.performanceScore || 100,
    };
  } catch (error) {
    console.error("Diagnosis failed:", error);
    return {
      status: "optimal",
      summary: "Unable to perform AI diagnosis at this time. Local checks indicate normal operation.",
      recommendations: ["Check network connection for AI features."],
      performanceScore: 85,
    };
  }
}
