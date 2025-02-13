import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // On compte le nombre d'utilisateurs pour tester la connexion
        const userCount = await prisma.user.count();
        
        // Si ça fonctionne, on renvoie un message de succès
        return NextResponse.json({ 
            success: true, 
            userCount 
        });
    } catch (error) {
        // En cas d'erreur, on log et on renvoie un message d'erreur
        console.error('Database test error:', error);
        
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}