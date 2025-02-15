// app/api/vinyl/share/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth.config'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    console.log('Données reçues:', data)

    // Créer le partage
    const share = await prisma.vinylShare.create({
      data: {
        userId: session.user.id,
        vinylId: data.vinylId,
        comment: data.comment || '',
        sourceType: data.sourceType || 'COLLECTION',
        customSource: data.sourceType === 'OTHER' ? data.customSource : null,
        storeId: data.sourceType === 'STORE' ? data.storeId : null
      },
      include: {
        vinyl: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: share })

  } catch (error) {
    console.error('Erreur détaillée:', error)
    // Correction du format de la réponse d'erreur
    return NextResponse.json({ 
      error: 'Erreur serveur inattendue',
      details: error.message
    }, { 
      status: 500 
    })
  }
}


export async function GET() {
  try {
    console.log('Début récupération des partages')
    const shares = await prisma.vinylShare.findMany({
      include: {
        vinyl: {
          select: {
            id: true,
            discogsId: true,
            title: true,
            artist: true,
            genres: true,
            imageUrl: true,
            year: true,
            label: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    console.log(`${shares.length} partages récupérés`)

    return NextResponse.json({ success: true, data: shares })
  } catch (error) {
    console.error('Erreur récupération partages:', error)
    console.error('Stack trace:', error.stack)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des partages' },
      { status: 500 }
    )
  }
}