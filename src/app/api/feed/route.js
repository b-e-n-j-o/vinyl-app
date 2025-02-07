// app/api/feed/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const skip = (page - 1) * limit

    // On récupère d'abord le total des VinylPosted
    const totalPosts = await prisma.vinylPosted.count()

    if (skip >= totalPosts) {
      // Si on dépasse le nombre total, retourner une page vide
      return NextResponse.json({
        items: [],
        pagination: {
          total: totalPosts,
          page,
          pageSize: limit,
          hasMore: false
        }
      })
    }

    const posts = await prisma.vinylPosted.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        store: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // S'assurer que tous les champs sont sérialisables
    const serializedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      artist: post.artist,
      imageUrl: post.imageUrl,
      year: post.year,
      genres: post.genres,
      label: post.label,
      discogsId: post.discogsId,
      comment: post.comment || '',
      sourceType: post.sourceType,
      customSource: post.customSource,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      user: {
        id: post.user.id,
        name: post.user.name || 'Anonymous',
        image: post.user.image || null
      },
      store: post.store ? {
        id: post.store.id,
        name: post.store.name
      } : null
    }))

    return NextResponse.json({
      items: serializedPosts,
      pagination: {
        total: totalPosts,
        page,
        pageSize: limit,
        hasMore: skip + posts.length < totalPosts
      }
    })

  } catch (error) {
    console.error('Error in feed route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}