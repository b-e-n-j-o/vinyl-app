// app/api/vinyl/addToCollection/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth.config'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    console.log('Source:', {
      type: data.sourceType,
      storeId: data.sourceType === 'STORE' ? data.storeId : undefined,
      customSource: data.sourceType === 'OTHER' ? data.customSource : undefined
    })
    console.log('Commentaire:', data.comment)

    if (!data || !data.vinyl) {
      return NextResponse.json(
        { error: 'Données invalides', receivedData: data },
        { status: 400 }
      )
    }

    const requiredFields = ['title', 'artist', 'discogsId']
    for (const field of requiredFields) {
      if (!data.vinyl[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis`, receivedData: data },
          { status: 400 }
        )
      }
    }

    try {
      const existingVinyl = await prisma.vinylPosted.findFirst({
        where: {
          AND: [
            { userId: session.user.id },
            { discogsId: data.vinyl.discogsId }
          ]
        }
      })

      if (existingVinyl) {
        return NextResponse.json(
          { error: 'Ce vinyle est déjà dans votre collection' },
          { status: 400 }
        )
      }

      const newVinyl = await prisma.vinylPosted.create({
        data: {
          userId: session.user.id,
          title: data.vinyl.title,
          artist: data.vinyl.artist,
          imageUrl: data.vinyl.imageUrl,
          year: data.vinyl.year,
          genres: data.vinyl.genres,
          label: data.vinyl.label,
          discogsId: data.vinyl.discogsId,
          comment: data.comment || null,
          sourceType: data.sourceType || 'COLLECTION',
          storeId: data.sourceType === 'STORE' ? data.storeId : null,
          customSource: data.sourceType === 'OTHER' ? data.customSource : null
        }
      })

      return NextResponse.json({
        success: true,
        data: newVinyl
      })

    } catch (dbError) {
      console.error('Erreur base de données:', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout du vinyle', details: dbError.message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erreur générale:', error)
    return NextResponse.json(
      { 
        error: 'Erreur serveur inattendue',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}