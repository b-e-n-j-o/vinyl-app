import { NextResponse, NextRequest } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/auth"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer l'ID du vinyle depuis les paramètres de recherche
    const { searchParams } = new URL(request.url)
    const discogsId = searchParams.get('discogsId')

    if (!discogsId) {
      return NextResponse.json({ error: 'ID du vinyle manquant' }, { status: 400 })
    }

    const vinylPost = await prisma.vinylPost.findFirst({
      where: {
        AND: [
          { userId: session.user.id },
          { discogsId: discogsId }
        ]
      }
    })

    return NextResponse.json({ exists: !!vinylPost })
  } catch (error) {
    console.error('Erreur lors de la vérification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validation des données de source
    if (!data.sourceType || !['STORE', 'COLLECTION', 'OTHER'].includes(data.sourceType)) {
      return NextResponse.json(
        { error: 'Type de source invalide' },
        { status: 400 }
      )
    }

    // Vérification supplémentaire pour les sources spécifiques
    if (data.sourceType === 'STORE' && !data.storeId) {
      return NextResponse.json(
        { error: 'ID du magasin requis pour une source de type STORE' },
        { status: 400 }
      )
    }

    if (data.sourceType === 'OTHER' && !data.customSource) {
      return NextResponse.json(
        { error: 'Description de la source requise pour une source de type OTHER' },
        { status: 400 }
      )
    }

    // Formatage des données pour correspondre au schéma
    const formattedData = {
      discogsId: data.discogsId,
      title: data.title || '',
      artist: data.artist || '',
      imageUrl: data.imageUrl || '',
      year: data.year ? parseInt(data.year) : null,
      genres: Array.isArray(data.genres) ? data.genres.join(',') : '',
      label: data.label || '',
      userId: session.user.id,
      // Ajout des données de source
      sourceType: data.sourceType,
      storeId: data.sourceType === 'STORE' ? data.storeId : null,
      customSource: data.sourceType === 'OTHER' ? data.customSource : null
    }

    // Vérifier si le vinyle existe déjà
    const existingVinyl = await prisma.vinylPost.findFirst({
      where: {
        AND: [
          { userId: session.user.id },
          { discogsId: data.discogsId }
        ]
      }
    })

    if (existingVinyl) {
      return NextResponse.json(
        { error: 'Ce vinyle est déjà dans votre collection' },
        { status: 400 }
      )
    }

    // Vérifier si le magasin existe si sourceType est STORE
    if (data.sourceType === 'STORE') {
      const store = await prisma.recordStore.findUnique({
        where: { id: data.storeId }
      })
      
      if (!store) {
        return NextResponse.json(
          { error: 'Magasin non trouvé' },
          { status: 400 }
        )
      }
    }

    const post = await prisma.vinylPost.create({
      data: formattedData
    })
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Erreur détaillée:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du post' },
      { status: 500 }
    )
  }
}