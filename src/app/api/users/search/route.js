// src/app/api/users/search/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');
    const query = searchParams.get('query');

    if (!mode || !query) {
      return NextResponse.json(
        { error: 'Paramètres de recherche manquants' },
        { status: 400 }
      );
    }

    let whereClause = {};
    switch (mode) {
      case 'username':
        whereClause = {
          username: {
            contains: query,
            mode: 'insensitive',
          },
        };
        break;

      case 'music':
        whereClause = {
          musicGenres: {
            hasSome: [query],
          },
        };
        break;

      case 'city':
        whereClause = {
          city: query,
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Mode de recherche invalide' },
          { status: 400 }
        );
    }

    // Ajouter la condition pour exclure l'utilisateur actuel
    whereClause = {
      ...whereClause,
      id: {
        not: session.user.id,
      },
    };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        city: true,
        musicGenres: true,
        image: true,
        followers: {
          where: {
            followerId: session.user.id,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
      orderBy: {
        followers: {
          _count: 'desc',
        },
      },
      take: 20,
    });

    // Transformer les données pour le client
    const transformedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      city: user.city,
      musicGenres: user.musicGenres,
      image: user.image,
      isFollowing: user.followers.length > 0,
      followerCount: user._count.followers,
      followingCount: user._count.following,
    }));

    return NextResponse.json(transformedUsers);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}