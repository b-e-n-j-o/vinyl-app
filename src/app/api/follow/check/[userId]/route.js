// app/api/follow/check/[userId]/route.js
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth.config'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Non autorisé",
        debug: {
          hasSession: !!session,
          hasUser: !!session?.user
        }
      }, { status: 401 })
    }

    // Attendre la résolution des paramètres avant de les utiliser
    const params = await context.params
    const userId = params.userId
    
    if (!userId) {
      return NextResponse.json({ 
        error: "ID utilisateur cible manquant"
      }, { 
        status: 400 
      })
    }

    console.log({
      sessionUserId: session.user.id,
      targetUserId: userId
    })

    const follow = await prisma.follows.findFirst({
      where: {
        AND: [
          { followerId: session.user.id },
          { followingId: userId }
        ]
      }
    })

    return NextResponse.json({
      isFollowing: Boolean(follow),
      debug: {
        followerId: session.user.id,
        followingId: userId
      }
    })

  } catch (error) {
    console.error('Error checking follow status:', error)
    return NextResponse.json({ 
      error: error.message
    }, { 
      status: 500 
    })
  }
}