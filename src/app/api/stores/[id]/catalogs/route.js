// src/app/api/stores/[id]/catalogs/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const storeId = params.id;
    console.log('Store ID reçu:', storeId);

    // Vérification que l'ID est valide
    if (!storeId) {
      return NextResponse.json(
        { error: 'ID du magasin manquant' },
        { status: 400 }
      );
    }

    // Vérifier d'abord si le magasin existe
    const store = await prisma.recordStore.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Magasin non trouvé' },
        { status: 404 }
      );
    }

    // Récupération des vinyles partagés
    const sharedVinyls = await prisma.vinylPosted.findMany({
      where: {
        storeId: storeId,
        sourceType: 'STORE'
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Récupération des vinyles en inventaire
    const storeInventory = await prisma.vinylStored.findMany({
      where: {
        storeId: storeId,
        inStock: true
      },
      include: {
        vinyl: {
          select: {
            title: true,
            artist: true,
            imageUrl: true,
            genres: true,
            year: true,
            label: true
          }
        }
      },
      orderBy: {
        addedAt: 'desc'
      }
    });

    // Construction de la réponse
    const response = {
      shared: sharedVinyls.map(vinyl => ({
        id: vinyl.id,
        title: vinyl.title,
        artist: vinyl.artist,
        imageUrl: vinyl.imageUrl,
        genres: vinyl.genres,
        year: vinyl.year,
        comment: vinyl.comment,
        createdAt: vinyl.createdAt,
        user: {
          name: vinyl.user.name,
          image: vinyl.user.image
        }
      })),
      inventory: storeInventory.map(item => ({
        id: item.id,
        vinylId: item.vinylId,
        title: item.vinyl.title,
        artist: item.vinyl.artist,
        imageUrl: item.vinyl.imageUrl,
        price: item.price,
        condition: item.condition,
        genres: item.vinyl.genres,
        year: item.vinyl.year
      }))
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur détaillée:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}