// app/api/follow/stats/[userId]/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const userId = params.userId

    const [followersCount, followingCount] = await Promise.all([
      prisma.follows.count({
        where: {
          followingId: userId,
        },
      }),
      prisma.follows.count({
        where: {
          followerId: userId,
        },
      }),
    ])

    return NextResponse.json({
      followersCount,
      followingCount,
    })
  } catch (error) {
    console.error('Error getting follow stats:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}