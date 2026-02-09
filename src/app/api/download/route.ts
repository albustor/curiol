import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const format = searchParams.get('format') || 'orig'; // orig, fb, ig

    if (!imageUrl) {
        return NextResponse.json({ error: 'Falta la URL de la imagen' }, { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let processedBuffer;
        let filename = `curiol-${Date.now()}`;

        if (format === 'fb') {
            processedBuffer = await sharp(buffer)
                .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();
            filename += '-facebook.jpg';
        } else if (format === 'ig') {
            processedBuffer = await sharp(buffer)
                .resize(1080, 1350, { fit: 'cover', position: 'center' })
                .jpeg({ quality: 85 })
                .toBuffer();
            filename += '-instagram.jpg';
        } else if (format === 'optimized') {
            // "Magic" Setting: Long Edge 1350px, quality 85%
            processedBuffer = await sharp(buffer)
                .resize(1350, 1350, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();
            filename += '-optimized.jpg';
        } else {
            // Original
            processedBuffer = buffer;
            filename += '-original.jpg';
        }

        return new NextResponse(new Uint8Array(processedBuffer), {
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Error procesando imagen:', error);
        return NextResponse.json({ error: 'Error procesando la imagen' }, { status: 500 });
    }
}
