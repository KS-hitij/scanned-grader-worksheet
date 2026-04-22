import { ChromaClient } from "chromadb";
import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";

const client = new ChromaClient({
    ssl: false,
    host: "localhost",
    port: 8000,
    database: "scanned-worker-grader",
    headers: {}
});

const collection = await client.getOrCreateCollection({
    name: "scanned-worker-grader-collection",
    embeddingFunction: new GoogleGeminiEmbeddingFunction({
        apiKey: process.env.GOOGLE_API_KEY || "",
        modelName: "gemini-embedding-001"
    }),
    metadata: {
        description: "A collection for storing scanned answers and their embeddings for the grader application.",
        created: new Date().toISOString()
    }
});

