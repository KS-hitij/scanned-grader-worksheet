import { ChromaClient } from "chromadb";
import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";
import { PDFParse } from "pdf-parse";

let client: ChromaClient | null = null;
let collection: any = null;

async function initializeClient() {
    if (!client) {
        client = new ChromaClient({
            ssl: false,
            host: "localhost",
            port: 8000,
            headers: {}
        });
    }
    return client;
}

async function initializeCollection() {
    if (!collection) {
        const chromaClient = await initializeClient();
        collection = await chromaClient.getOrCreateCollection({
            name: "scanned-worker-grader-collection",
            embeddingFunction: new GoogleGeminiEmbeddingFunction({
                apiKey: process.env.GEMINI_API_KEY || "",
                modelName: "gemini-embedding-001"
            }),
            metadata: {
                description: "A collection for storing scanned answers and their embeddings for the grader application.",
                created: new Date().toISOString()
            }
        });
    }
    return collection;
}

export async function uploadAnswerKey(answerKey: File): Promise<void> {
    const pdfData = await answerKey.arrayBuffer();
    const parsed = new PDFParse({
        data: pdfData
    });
    const col = await initializeCollection();
    const result = (await parsed.getText());

    console.log("text from pdf: ", result);
    const text = result.text;

    // Normalize whitespace so PDF line-breaks don't matter
    const normalized = text.replace(/\s+/g, " ").trim();

    const pattern = /Question (\d+):\s*(.*?)\s*Answer \1:\s*(.*?)(?=\s*Question \d+:|$)/g;
    const matches = [...normalized.matchAll(pattern)];

    if (matches.length === 0) {
        throw new Error("No Q&A pairs found in PDF. Check the file format.");
    }

    for (const match of matches) {
        const questionNum = match[1];
        const questionText = match[2].trim();
        const answerText = match[3].trim();

        console.log("question:", questionText);
        console.log("answer:", answerText);

        if (!questionText || !answerText) {
            console.warn(`Skipping empty pair for question ${questionNum}`);
            continue;
        }

        await col.add({
            ids: [`answer_key_q${questionNum}`],
            documents: [questionText],
            metadatas: [{ type: "answer_key", question: questionNum, answer: answerText }]
        });
    }
}

export async function queryAnswerKey(question: string) {
    const col = await initializeCollection();
    const results = await col.query({
        queryTexts: [question],
        nResults: 1
    });
    console.log(results);
    return results.metadatas[0][0].answer;
}