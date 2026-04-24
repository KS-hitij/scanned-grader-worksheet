import { createAgent, tool } from "langchain";
import { queryAnswerKey, uploadAnswerKey } from "./rag";
import { extractQuestionsFromImage } from "./extract";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import * as z from "zod";

const extract = tool(async (imageBase64: string) => {
    const result = await extractQuestionsFromImage(imageBase64);
    return JSON.stringify(result);
}, {
    name: "extract",
    description: "Extract questions and student answers from a scanned answer sheet image. Takes a base64-encoded image and returns an array of objects with question and student_answer fields.",
    schema: z.object({
        imageBase64: z.string().describe("Base64-encoded image data of the scanned answer sheet")
    })
});

const query = tool(async ({ question, student_answer }: { question: string, student_answer: string }) => {
    const answer = await queryAnswerKey(question);
    return answer;
}, {
    name: "query",
    description: "Query the answer key for a specific question to get the correct answer.",
    schema: z.object({
        question: z.string().describe("The question to search for in the answer key"),
        student_answer: z.string().describe("The student's answer to the question")
    })
});

const upload = tool(async ({ pdfBase64, fileName }: { pdfBase64: string, fileName: string }) => {
    // Convert base64 back to File object
    const binaryString = atob(pdfBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const file = new File([bytes], fileName, { type: "application/pdf" });
    await uploadAnswerKey(file);
    return "Answer key uploaded successfully.";
}, {
    name: "upload",
    description: "Upload a PDF file containing the answer key. The PDF should be formatted with 'Question X:' followed by the question text, and 'Answer X:' followed by the correct answer for each question.",
    schema: z.object({
        pdfBase64: z.string().describe("Base64-encoded PDF file data"),
        fileName: z.string().describe("Name of the PDF file")
    })
});
const model = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",
    apiKey: process.env.GEMINI_API_KEY || "",
});

const agent = createAgent({
    model: model,
    tools: [extract, query, upload],
    systemPrompt: `You are a grading assistant for scanned answer sheets. You have access to three tools: extract, query, and upload.

    When given a student's answer sheet image:
    1. Use the extract tool to extract questions and student answers from the image
    2. For each extracted question, use the query tool to get the correct answer from the answer key
    3. Compare the student's answer with the correct answer
    4. Score each answer (1 for correct, 0 for incorrect) with an explanation
    5. Return results as a structured JSON array with: question, student_answer, correct_answer, score, and explanation

    When given a PDF file:
    - Use the upload tool to upload the answer key PDF

    Always return grading results in valid JSON format. Do not include any additional text or markdown in your response.`,

});


export async function gradeAnswerSheet(image: File) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageBase64 = buffer.toString("base64");

    // Step 1: Extract questions from image
    console.log("Extracting questions from image...");
    const extracted = await extractQuestionsFromImage(imageBase64);

    // Step 2: Pass extracted questions to agent for grading
    const result = await agent.invoke({
        messages: [
            new HumanMessage({
                content: `Grade the following student answers and provide detailed explanations. 
                Here are the extracted questions and student answers:
                ${JSON.stringify(extracted, null, 2)}

                For each question:
                1. Use the query tool to get the correct answer from the answer key
                2. Compare the student's answer with the correct answer
                3. Provide detailed explanation of why the answer is correct or incorrect
                4. Assign a score (1 for correct, 0 for incorrect)

                Return ONLY a valid JSON array with this exact structure for each question:
                [
                {
                    "question": "question text",
                    "student_answer": "student's answer",
                    "correct_answer": "correct answer from key",
                    "score": 1 or 0,
                    "explanation": "detailed explanation of the grading"
                }
                ]

                Do not include any text before or after the JSON array.`,
            }),
        ],
    });


    // Step 3: Extract the final message from agent output
    let gradingOutput = null;

    if (result.messages && result.messages.length > 0) {
        // Get the last message which should contain the grading results
        const lastMessage = result.messages[result.messages.length - 1];
        if (typeof lastMessage.content === "string") {
            gradingOutput = lastMessage.content;
        } else if (Array.isArray(lastMessage.content)) {
            // If content is an array, join text parts
            gradingOutput = lastMessage.content.map((part: any) =>
                typeof part === "string" ? part : part.text || ""
            ).join("");
        }
    }

    if (!gradingOutput) {
        throw new Error("Failed to extract grading output from agent response");
    }

    // Parse JSON from the response
    try {
        const jsonMatch = gradingOutput.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const gradingResults = JSON.parse(jsonMatch[0]);
            return gradingResults;
        } else {
            throw new Error("No JSON found in agent response");
        }
    } catch (error) {
        console.error("Error parsing grading results:", error);
        throw new Error(`Failed to parse agent grading output: ${gradingOutput}`);
    }
}


export async function uploadAnswers(pdf: File) {
    // Convert PDF to base64
    const arrayBuffer = await pdf.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfBase64 = buffer.toString("base64");

    const result = await agent.invoke({
        messages: [{
            role: "user",
            content: `Please upload this answer key PDF. File name: ${pdf.name}. Here's the PDF data: data:application/pdf;base64,${pdfBase64}`
        }]
    });

    return result;
}