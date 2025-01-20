// components/FollowStats.jsx
'use client'

import { useState, useEffect } from 'react'

export default function FollowStats({ userId }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/follow/stats/${userId}`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching follow stats:', error)
      }
    }

    fetchStats()
  }, [userId])

  if (!stats) return null

  return (
    <div className="flex gap-4 text-sm text-gray-600">
      <span>{stats.followersCount} abonnés</span>
      <span>{stats.followingCount} abonnements</span>
    </div>
  )
}