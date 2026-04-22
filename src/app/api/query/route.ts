import { NextRequest, NextResponse } from "next/server";
import { queryAnswerKey } from "@/lib/rag";

export async function POST(request: NextRequest) {
    try {
        const { question } = await request.json();
        if (!question) {
            return NextResponse.json({ success: false, message: "No question provided." }, { status: 400 });
        }
        const results = await queryAnswerKey(question);
        return NextResponse.json({ success: true, answer: results });
    } catch (error) {
        console.error("Error processing query:", error);
        return NextResponse.json({ success: false, message: "Failed to process query." }, { status: 500 });
    }
}