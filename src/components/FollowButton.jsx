// components/FollowButton.jsx
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function FollowButton({ collectionOwnerId }) {
  const { data: session, status } = useSession()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!session?.user?.id || !collectionOwnerId) return
      
      try {
        setIsLoading(true)
        console.log('Vérification du statut de follow:', {
          sessionUserId: session.user.id,
          collectionOwnerId
        })

        const response = await fetch(`/api/follow/check/${collectionOwnerId}`)
        const data = await response.json()
        
        console.log('Réponse de l\'API:', data)
        setIsFollowing(data.isFollowing)
      } catch (error) {
        console.error("Erreur vérification follow:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    checkFollowStatus()
  }, [session, collectionOwnerId])

  const handleFollow = async () => {
    try {
      console.log('Click sur le bouton suivre')
      setIsLoading(true)
      setError(null)

      const method = isFollowing ? 'DELETE' : 'POST'
      const body = isFollowing 
        ? { userToUnfollowId: collectionOwnerId }
        : { userToFollowId: collectionOwnerId }

      console.log('Envoi de la requête:', { method, body })

      const response = await fetch('/api/follow', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData)
      }

      const data = await response.json()
      console.log('Réponse de l\'API follow:', data)
      
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("Erreur lors du follow/unfollow:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Ne pas afficher le bouton dans ces cas
  if (!session?.user?.id || session.user.id === collectionOwnerId) {
    return null
  }

  return (
    <div className="relative z-10">
      <button
        onClick={handleFollow}
        disabled={isLoading}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`
          px-4 py-1.5 rounded-full text-sm font-medium
          transition-all duration-500 ease-in-out
          ${isFollowing 
            ? isHovering
              ? 'bg-[#6F4E37] border-[#6F4E37] text-white hover:opacity-90'
              : 'bg-[#FAF2E2] border-[#FAF2E2] text-[#6F4E37]'
            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
          }
        `}
      >
        <span className="transition-all duration-200 ease-in-out">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Chargement
            </span>
          ) : (
            isFollowing ? (
              isHovering ? 'Ne plus suivre' : 'Suivi'
            ) : 'Suivre'
          )}
        </span>
      </button>
      {error && (
        <div className="absolute top-full left-0 mt-2 text-[#6F4E37] text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
