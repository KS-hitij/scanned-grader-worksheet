import { createAgent, tool } from "langchain";


const agent = createAgent({
    model: "google-genai:gemini-2.5-flash-lite",
});