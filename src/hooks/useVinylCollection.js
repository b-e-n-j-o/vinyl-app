'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useVinylCollection(vinylId) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isAdding, setIsAdding] = useState(false)
  const [isInCollection, setIsInCollection] = useState(false)
  const [isCheckingCollection, setIsCheckingCollection] = useState(true)
  const [collectionDetails, setCollectionDetails] = useState(null)

  useEffect(() => {
    const checkCollection = async () => {
      // Ne vérifier que si l'utilisateur est connecté et qu'on a un vinylId
      if (status !== 'authenticated' || !vinylId) {
        setIsCheckingCollection(false)
        return
      }

      try {
        const response = await fetch(`/api/vinyl/check/${vinylId}`)
        
        if (!response.ok) {
          throw new Error('Erreur lors de la vérification')
        }
        
        const data = await response.json()
        setIsInCollection(data.inCollection)
        setCollectionDetails(data.details)
      } catch (error) {
        console.error('Erreur de vérification:', error)
        setIsInCollection(false)
      } finally {
        setIsCheckingCollection(false)
      }
    }
  
    checkCollection()
  }, [vinylId, status])

  const handleAddToCollection = async (vinylData) => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch('/api/vinyl/addToCollection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vinylData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'ajout à la collection')
      }

      setIsInCollection(true)
      router.refresh() // Rafraîchir la page pour mettre à jour l'UI
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
      throw error
    } finally {
      setIsAdding(false)
    }
  }

  return {
    isAdding,
    isInCollection,
    isCheckingCollection,
    collectionDetails,
    handleAddToCollection
  }
}