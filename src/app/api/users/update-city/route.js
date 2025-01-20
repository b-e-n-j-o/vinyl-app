// src/app/api/users/update-city/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const VALID_CITIES = ['Paris', 'Bruxelles', 'Montréal'];

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { city } = await request.json();

    // Vérifier que la ville est valide
    if (!VALID_CITIES.includes(city)) {
      return NextResponse.json(
        { error: 'Ville non valide' },
        { status: 400 }
      );
    }

    // Mettre à jour la ville de l'utilisateur
    await prisma.user.update({
      where: { id: session.user.id },
      data: { city }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update city error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la ville' },
      { status: 500 }
    );
  }
}