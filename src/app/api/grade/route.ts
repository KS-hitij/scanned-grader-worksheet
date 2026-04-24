import { NextRequest, NextResponse } from "next/server";
import { gradeAnswerSheet } from "@/lib/agent";
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const answerKeyFile = formData.get("studentAnswerKey") as File;
        if (!answerKeyFile) {
            return NextResponse.json({ success: false, message: "No answer key file uploaded." }, { status: 400 });
        }
        console.log("Received answer key file for grading");

        const result = await gradeAnswerSheet(answerKeyFile);
        return NextResponse.json({ success: true, message: "Answer key uploaded and graded successfully.", result });
    } catch (error) {
        console.error("Error uploading answer key:", error);
        return NextResponse.json({ success: false, message: "Failed to upload answer key." }, { status: 500 });
    }
}