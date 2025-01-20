// app/collection/[userId]/CollectionContent.jsx
'use client'

import { useEffect } from 'react'
import CollectionVinylGrid from './CollectionVinylGrid'
import FollowButton from '../../../components/FollowButton'
import FollowStats from '../../../components/FollowStats'
import { getMostFrequentGenres } from '@/lib/utils/user-preferences'

export default function CollectionContent({ 
  collectionOwner, 
  vinyles,
  visitorSession
}) {
  useEffect(() => {
    // Mettre à jour les genres automatiquement quand la collection change
    if (vinyles.length > 0 && visitorSession?.user?.id === collectionOwner.id) {
      const topGenres = getMostFrequentGenres(vinyles);
      
      // Mise à jour des genres préférés via API
      fetch('/api/users/update-genres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genres: topGenres })
      });
    }
  }, [vinyles, visitorSession, collectionOwner.id]);

  // Afficher les genres préférés
  const topGenres = getMostFrequentGenres(vinyles);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">
            Collection de {collectionOwner.name}
          </h1>
          
          {/* Affichage des genres préférés */}
          {topGenres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-gray-600">Genres favoris :</span>
              {topGenres.map(genre => (
                <span 
                  key={genre}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {visitorSession && visitorSession.user.id !== collectionOwner.id && (
          <div className="mb-4">
            <FollowButton
              collectionOwnerId={collectionOwner.id}
              currentUserId={visitorSession.user.id}
              className="inline-block px-4 py-2 bg-[#421C10] text-[#F4E3B2] 
                        hover:bg-[#050517] transition-colors duration-200 
                        rounded-lg text-sm font-medium shadow-sm
                        cursor-pointer z-10"
            />
          </div>
        )}
        
        <div className="mt-4">
          <FollowStats userId={collectionOwner.id} />
        </div>
      </div>

      <CollectionVinylGrid vinyles={vinyles} />
    </div>
  )
}