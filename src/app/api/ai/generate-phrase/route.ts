import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
    try {
        const { albumTitle } = await req.json();

        const prompt = `Genera una frase de exactamente 3 palabras en español que evoque la esencia de una fotografía dentro de un álbum titulado "${albumTitle}". 
        La frase debe ser poética, minimalista y sofisticada (estilo Fine-Art).
        Solo responde con las 3 palabras, sin puntuación extra.`;

        const result = await model.generateContent(prompt);
        const phrase = result.response.text().trim();

        return NextResponse.json({ phrase });
    } catch (error) {
        console.error("AI Phrase API Error:", error);
        return NextResponse.json({ phrase: "Legado, Arte, Vida" }, { status: 500 });
    }
}
