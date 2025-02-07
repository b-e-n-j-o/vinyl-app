import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import OpenAI from 'openai';

// Configuration des clients API
const visionClient = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_VISION_CREDENTIALS_PATH,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt système pour l'extraction des données vinyle
const VINYL_OCR_SYSTEM_PROMPT = `
Tu es un expert en analyse de textes provenant d'OCR de vinyles.
Ta tâche est d'extraire l'artiste et le titre uniquement.

Instructions d'extraction :

1. RÈGLES GÉNÉRALES
- Réponds uniquement au format JSON : {"artist": "...", "title": "..."}
- Ne fournis aucune explication ni commentaire
- Si une information est introuvable, utilise null

2. IDENTIFICATION DE L'ARTISTE
- Cherche dans les premières lignes du texte
- Identifie les noms qui précèdent des mots comme "presents", "featuring", "-"
- Un artiste peut être un groupe ou plusieurs artistes
- Ignore les labels de disques et les noms de producteurs

3. IDENTIFICATION DU TITRE
- Recherche en priorité les textes entre guillemets
- Cherche le texte qui suit immédiatement l'artiste
- Exclure les mentions comme "Club Mix", "Radio Mix"
- Si plusieurs versions/mix, prendre le titre principal sans les variations

4. ÉLÉMENTS À IGNORER
- Numéros de catalogue
- Informations de durée (ex: 8:22)
- Mentions "SIDE", "FACE", "RPM"
- Crédits de production
- Dates et copyrights
- Informations de label
`.trim();

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
          content: VINYL_OCR_SYSTEM_PROMPT
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