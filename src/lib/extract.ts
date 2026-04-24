import { GoogleGenAI } from "@google/genai";

interface ExtractedQuestion {
    question: string;
    student_answer: string;
}

export async function extractQuestionsFromImage(imageBase64: string): Promise<ExtractedQuestion[]> {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || "",
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        inlineData: {
                            data: imageBase64,
                            mimeType: "image/png",
                        },
                    },
                    {
                        text: `You are an OCR and question extraction system. Analyze this scanned answer sheet image and extract all questions and the corresponding student answers.

Return ONLY a valid JSON array with the following structure:
[
    {
        "question": "the question text",
        "student_answer": "the student's answer"
    }
]

Rules:
- Extract the exact question text as written
- Extract the exact student answer as written
- Return only the JSON array, no additional text or markdown
- If you cannot read something clearly, leave it as an empty string in the JSON (e.g., "question": "", "student_answer": "")
- Preserve formatting and special characters`,
                    },
                ],
            },
        ],
    });

    // Extract text content from response
    if (!response.text) {
        throw new Error("No text response from Gemini API");
    }

    // Extract JSON from response (handles markdown code blocks)
    const text = response.text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
        throw new Error("Could not parse JSON array from Gemini response");
    }

    const extractedData = JSON.parse(jsonMatch[0]) as ExtractedQuestion[];
    return extractedData;
}