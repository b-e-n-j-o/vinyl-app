import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link' // Ajoutez cet import en haut du fichier


const VinylFeed = () => {
  const [sharedVinyls, setSharedVinyls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchSharedVinyls = async () => {
      try {
        // Changement de l'endpoint ici
        const response = await fetch('/api/feed')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        console.log('Données reçues du feed:', data)
        setSharedVinyls(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSharedVinyls()
  }, [])


  const VinylCard = ({ share }) => {
    return (
      <Link 
        href={`/vinyl/${share.vinyl.discogsId}`} 
        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
      >
        {/* Image Container */}
        <div className="w-full aspect-square relative">
          {share.vinyl.imageUrl ? (
            <img 
              src={share.vinyl.imageUrl} 
              alt={share.vinyl.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
  
        {/* Info Container */}
        <div className="p-4">
          {/* User info row */}
          <div className="flex items-center gap-2 mb-2">
            <img src={share.user.image} alt="" className="w-6 h-6 rounded-full" />
            <span className="text-sm font-medium text-gray-600">{share.user.name}</span>
          </div>
  
          {/* Vinyl info */}
          <h3 className="text-lg font-semibold mb-1 truncate">{share.vinyl.title}</h3>
          <p className="text-sm text-purple-600 mb-1">{share.vinyl.artist}</p>
          <p className="text-xs text-gray-500 mb-2">{share.vinyl.genres}</p>
  
          {/* Comment with subtle background */}
          <p className="text-sm italic bg-gray-50 p-2 rounded-md mb-2">"{share.comment}"</p>
  
          {/* Date */}
          <time className="text-xs text-gray-400">{new Date(share.createdAt).toLocaleDateString()}</time>
        </div>
      </Link>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-100 h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="space-y-6">
        {sharedVinyls.map((share) => (
          <VinylCard key={share.id} share={share} />
        ))}
      </div>
    </div>
  )
}

export default VinylFeed