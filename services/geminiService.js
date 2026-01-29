
// services/geminiService.js (BACKEND ONLY)

import { GoogleGenAI, Type } from "@google/genai";
import { IssueType, IssuePriority } from "../types.js";

const apiKey = process.env.GEMINI_API_KEY ;
if (!apiKey) throw new Error("GEMINI_API_KEY missing");

const ai = new GoogleGenAI({ apiKey });

export const analyzeComplaint = async (description, imageBase64) => {
  try {
    const parts = [
      {
        text: `
You are a facility management AI assistant.

Tasks:
1. Categorize the issue into: Electricity, Water, Cleanliness, Other.
2. Assign priority: Low, Medium, High, Critical.
3. Write a 1-sentence technical summary.

Complaint:
"${description}"
        `
      }
    ];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(",")[1] || imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedType: {
              type: Type.STRING,
              enum: Object.values(IssueType)
            },
            suggestedPriority: {
              type: Type.STRING,
              enum: Object.values(IssuePriority)
            },
            technicalSummary: {
              type: Type.STRING
            }
          },
          required: [
            "suggestedType",
            "suggestedPriority",
            "technicalSummary"
          ]
        }
      }
    });

    return JSON.parse(response.text);

  } catch (err) {
    console.error("Gemini Analysis Error:", err);
    return {
      suggestedType: IssueType.OTHER,
      suggestedPriority: IssuePriority.MEDIUM,
      technicalSummary: "AI analysis failed."
    };
  }
};
