// src/app/api/vinyl/check/[vinylId]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../../auth/[...nextauth]/auth';
import prisma from '../../../../../../src/lib/prisma'

export async function GET(request, { params }) {
  try {
    // Attendre la résolution des paramètres et de la session
    const vinylId = await Promise.resolve(params.vinylId);
    const session = await getServerSession(authOptions);

    if (!vinylId) {
      console.error('VinylId manquant dans la requête');
      return NextResponse.json(
        { error: 'ID vinyle manquant' }, 
        { status: 400 }
      );
    }

    console.log('Checking vinyl:', vinylId, 'for user:', session?.user?.id);

    const vinylShares = await prisma.vinylPosted.findMany({
      where: {
        discogsId: vinylId,
      },
      select: {
        id: true,
        comment: true,
        sourceType: true,
        storeId: true,
        customSource: true,
        createdAt: true,
        store: {
          select: {
            id: true,
            name: true,
            city: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Trouver le partage de l'utilisateur si connecté
    const userShare = session?.user?.id 
      ? vinylShares.find(share => share.user.id === session.user.id)
      : null;

    return NextResponse.json({
      inCollection: !!userShare,
      details: userShare || null,
      shares: vinylShares,
      checkedId: vinylId // Ajout pour debug
    });

  } catch (error) {
    console.error('Error checking vinyl:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Erreur lors de la vérification', details: error.message },
      { status: 500 }
    );
  }
}