// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { IssueType, IssuePriority } from "../types";

// const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY 

// // Initialize Gemini Client
// const genAI = new GoogleGenerativeAI(apiKey);

// /**
//  * Analyzes the complaint text and optional image to suggest categorization and priority.
//  */
// export const analyzeComplaint = async (description, imageBase64) => {
//   if (!apiKey) {
//     console.warn("API Key is missing. Returning default values.");
//     return {
//       suggestedType: IssueType.OTHER,
//       suggestedPriority: IssuePriority.MEDIUM,
//       technicalSummary: "AI analysis unavailable (Missing Key)."
//     };
//   }

//   try {
//     const prompt = `
//       You are a facility management AI assistant. 
//       Analyze the following complaint description and image (if provided).
      
//       Tasks:
//       1. Categorize the issue into one of: Electricity, Water, Cleanliness, or Other.
//       2. Assign a priority level: Low, Medium, High, or Critical based on urgency and safety.
//       3. Write a 1-sentence technical summary for the maintenance worker.

//       Description: "${description}"
//     `;

//     // Use the Gemini 3 Flash Preview model for all analyses
//     const modelName = imageBase64 ? 'gemini-2.5-flash' : 'gemini-2.5-flash';
    
//     const parts = [{ text: prompt }];
    
//     if (imageBase64) {
//       // Remove data URL prefix if present for clean base64
//       const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
//       parts.push({
//         inlineData: {
//           mimeType: 'image/jpeg',
//           data: cleanBase64
//         }
//       });
//     }

//     const generationConfig = {
//       responseMimeType: "application/json",
//       responseSchema: {
//         type: "object",
//         properties: {
//           suggestedType: { 
//             type: "string", 
//             enum: Object.values(IssueType),
//             description: "The category of the issue"
//           },
//           suggestedPriority: { 
//             type: "string", 
//             enum: Object.values(IssuePriority),
//             description: "The priority level of the issue"
//           },
//           technicalSummary: { 
//             type: "string",
//             description: "A brief technical summary for maintenance workers"
//           },
//         },
//         required: ["suggestedType", "suggestedPriority", "technicalSummary"]
//       }
//     };

//     const model = genAI.getGenerativeModel({ 
//       model: modelName,
//       generationConfig 
//     });

//     const result = await model.generateContent(parts);

//     const response = result.response;
//     const jsonText = response.text();
//     if (!jsonText) throw new Error("Empty response from AI");

//     const parsedResult = JSON.parse(jsonText);
//     return parsedResult;

//   } catch (error) {
//     console.error("Gemini Analysis Error:", error);
//     // Fallback
//     return {
//       suggestedType: IssueType.OTHER,
//       suggestedPriority: IssuePriority.MEDIUM,
//       technicalSummary: "Could not analyze automatically."
//     };
//   }
// };
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
      model: "gemini-2.5-pro",
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
