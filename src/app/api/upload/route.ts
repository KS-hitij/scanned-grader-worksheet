import { NextRequest, NextResponse } from "next/server";
import { uploadAnswerKey } from "@/lib/rag";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const answerKeyFile = formData.get("answerKey") as File;
        if (!answerKeyFile) {
            return NextResponse.json({ success: false, message: "No answer key file uploaded." }, { status: 400 });
        }
        await uploadAnswerKey(answerKeyFile);
        return NextResponse.json({ success: true, message: "Answer key uploaded successfully." });
    } catch (error) {
        console.error("Error uploading answer key:", error);
        return NextResponse.json({ success: false, message: "Failed to upload answer key." }, { status: 500 });
    }
}