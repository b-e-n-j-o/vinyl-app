// app/api/follow/route.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/auth'
import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { userToFollowId } = await request.json()
    
    const follow = await prisma.follows.create({
      data: {
        followerId: session.user.id,
        followingId: userToFollowId,
      },
    })

    return NextResponse.json({ success: true, data: follow })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { userToUnfollowId } = await request.json()

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userToUnfollowId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}