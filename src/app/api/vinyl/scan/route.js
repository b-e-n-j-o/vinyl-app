import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import OpenAI from 'openai';

// Configurez vos clients API
const visionClient = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_VISION_CREDENTIALS_PATH,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convertir le blob en buffer pour Google Vision
    const buffer = Buffer.from(await image.arrayBuffer());

    // OCR avec Google Vision
    const [result] = await visionClient.textDetection({
      image: { content: buffer }
    });

    const ocrText = result.fullTextAnnotation?.text || '';

    // Extraction via OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: process.env.SYSTEM_PROMPT // Votre prompt système
        },
        { 
          role: "user", 
          content: ocrText 
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const metadata = JSON.parse(completion.choices[0].message.content);

    // Recherche Discogs
    const searchQuery = `${metadata.artist} ${metadata.title}`.trim();
    const discogsUrl = `https://api.discogs.com/database/search?q=${encodeURIComponent(searchQuery)}&type=release&per_page=5`;
    
    const discogsResponse = await fetch(discogsUrl, {
      headers: {
        'Authorization': `Discogs token=${process.env.DISCOGS_TOKEN}`,
        'User-Agent': 'VinylCollectionApp/1.0'
      }
    });

    const discogsData = await discogsResponse.json();

    return NextResponse.json({
      ...metadata,
      discogs_matches: discogsData.results || []
    });

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Scan processing failed' },
      { status: 500 }
    );
  }
}