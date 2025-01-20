// src/app/api/stores/[id]/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID du magasin requis' },
        { status: 400 }
      );
    }

    const store = await prisma.recordStore.findUnique({
      where: {
        id: id
      },
      include: {
        inventory: {
          where: {
            inStock: true
          },
          select: {
            id: true,
            price: true,
            condition: true,
            vinyl: {
              select: {
                title: true,
                artist: true,
                imageUrl: true,
              }
            }
          }
        }
      }
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Magasin non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error('Erreur lors de la récupération du magasin:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}