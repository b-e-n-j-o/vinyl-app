// src/app/api/users/update-genres/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { genres } = await request.json();

    // Mettre à jour les genres de l'utilisateur
    await prisma.user.update({
      where: { id: session.user.id },
      data: { musicGenres: genres }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update genres error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des genres' },
      { status: 500 }
    );
  }
}