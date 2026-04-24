import { NextRequest, NextResponse } from "next/server";
import { extractQuestionsFromImage } from "@/lib/extract";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get("image") as File | null;
        if (!image) {
            return NextResponse.json({ success: false, message: "No image data provided." }, { status: 400 });
        }
        console.log("Received image data for extraction");
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imageBase64 = buffer.toString("base64");
        console.log("Converted image to base64 for extraction");
        const result = await extractQuestionsFromImage(imageBase64);
        return NextResponse.json({ success: true, message: "Questions extracted successfully.", result });
    }
    catch (error) {
        console.error("Error extracting questions from image:", error);
        return NextResponse.json({ success: false, message: "Failed to extract questions from image." }, { status: 500 });
    }
}