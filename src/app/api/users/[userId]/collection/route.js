// app/api/users/[userId]/collection/route.js
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../../../auth/[...nextauth]/auth"
import prisma from '@/lib/prisma'

export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extraction sécurisée de l'userId depuis le contexte
    const userId = context.params?.userId
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Vérifie si l'utilisateur suit la personne dont il veut voir la collection
    const isFollowing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        }
      }
    })

    // Si ce n'est pas sa propre collection et qu'il ne suit pas l'utilisateur
    if (session.user.id !== userId && !isFollowing) {
      return NextResponse.json({ error: 'Must follow user to see collection' }, { status: 403 })
    }

    const collection = await prisma.vinylPost.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error("Error in collection route:", error)
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 })
  }
}