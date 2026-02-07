import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const transactionId = formData.get("transactionId") as string;
        const expectedAmount = formData.get("amount") as string;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let prompt = `Analyze this payment voucher (receipt/screenshot). 
        Verify if the payment is a valid bank transfer or SINPE Móvil deposit.
        Check if the amount matches ${expectedAmount}.
        Confirm if the date is recent.
        Return a JSON object with:
        {
            "isValid": boolean,
            "transactionId": string (extracted from image if possible),
            "amount": number (extracted),
            "date": string (extracted),
            "confidence": number (0-1),
            "reason": string (brief explanation)
        }
        Return ONLY the JSON.`;

        if (transactionId) {
            prompt += ` Also cross-check with the provided ID: ${transactionId}`;
        }

        let result;
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: file.type,
                        data: buffer.toString("base64")
                    }
                }
            ]);
        } else if (transactionId) {
            result = await model.generateContent(prompt + ` (No image provided, verify the ID format if possible)`);
        } else {
            return NextResponse.json({ error: "No payment data provided" }, { status: 400 });
        }

        const text = result.response.text();
        // Extract JSON from the markdown code block if present
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { isValid: false, reason: "Error parsing AI response" };

        return NextResponse.json(data);
    } catch (error) {
        console.error("AI Verification Error:", error);
        return NextResponse.json({ error: "Internal server error during verification" }, { status: 500 });
    }
}
