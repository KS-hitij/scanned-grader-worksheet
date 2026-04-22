import { createAgent, tool } from "langchain";
import { queryAnswerKey } from "./rag";
import * as z from "zod";

const query = tool(async (question: string) => {
    const answer = await queryAnswerKey(question);
    return answer;
}, {
    name: "query",
    description: "Query the answer key for a specific question to get the correct answer.",
    schema: z.string()
});
const agent = createAgent({
    model: "google-genai:gemini-2.5-flash-lite",
    systemPrompt: "You are a helpful assistant for grading scanned answer sheets. You will be given the student's answersheet containing both the question text and the student's answer, and you need to first extract the question and the student's answer using the extract tool. Pass the image to extract tool and the all the questions with their answers will be returned in an array. After that one by one pass each question to query tool and it will return the correct answer for the question.Then, determine if the answer is correct based on the provided answer by the query tool. The answer key contains the correct answers for each question. Your task is to compare the student's answer with the correct answer and provide a score (1 for correct, 0 for incorrect) along with an explanation."
});