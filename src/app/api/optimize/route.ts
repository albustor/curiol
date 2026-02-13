import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");
    const width = parseInt(searchParams.get("w") || "2560");
    const quality = parseInt(searchParams.get("q") || "82");

    if (!imageUrl) {
        return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Failed to fetch image");

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const format = searchParams.get("format") || "webp";

        // Curiol Image Engine Processing (Fine Art Optimized)
        let sharpInstance = sharp(buffer)
            .resize({
                width: width,
                withoutEnlargement: true,
                fit: "inside"
            });

        if (format === "webp") {
            sharpInstance = sharpInstance.webp({ quality, effort: 6 });
        } else {
            sharpInstance = sharpInstance.jpeg({ quality, progressive: true, mozjpeg: true });
        }

        const optimizedBuffer = await sharpInstance.toBuffer();

        return new NextResponse(optimizedBuffer as any, {
            headers: {
                "Content-Type": `image/${format === 'webp' ? 'webp' : 'jpeg'}`,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Optimization Engine Error:", error);
        return NextResponse.json({ error: "Optimization failed" }, { status: 500 });
    }
}
