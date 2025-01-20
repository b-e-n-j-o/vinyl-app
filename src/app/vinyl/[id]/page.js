'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import YouTube from 'react-youtube'

// Components
import VinylImage from '../../../components/vinyl/VinylImage'
import VinylHeader from '../../../components/vinyl/VinylHeader'
import GenresStyles from '../../../components/vinyl/GenresStyles'
import Tracklist from '../../../components/vinyl/Tracklist'
import VinylInfo from '../../../components/vinyl/VinylInfo'
import VinylStats from '../../../components/vinyl/VinylStats'
import VinylShares from '../../../components/vinyl/VinylShares'
import { AddToCollectionModal } from './AddToCollectionModal'

// Hooks
import { useYoutubeVideo } from '../../../hooks/useYoutubeVideo'
import { useVinylCollection } from '../../../hooks/useVinylCollection'

export default function VinylDetails() {
  const params = useParams()
  const [vinyl, setVinyl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [shares, setShares] = useState([])
  const vinylId = params?.id

  const { youtubeVideoId, fetchYoutubeVideo } = useYoutubeVideo()
  const { 
    isAdding, 
    isInCollection, 
    isCheckingCollection,
    collectionDetails, 
    handleAddToCollection 
  } = useVinylCollection(vinylId)

  useEffect(() => {
    const checkVinyl = async () => {
      if (!vinylId) return;

      try {
        const response = await fetch(`/api/vinyl/check/${vinylId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la vérification');
        }
        const data = await response.json();
        setShares(data.shares || []);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    checkVinyl();
  }, [vinylId]);

  useEffect(() => {
    const fetchVinylDetails = async () => {
      if (!vinylId) return

      try {
        const response = await fetch(
          `https://api.discogs.com/releases/${vinylId}`,
          {
            headers: {
              'Authorization': `Discogs token=${process.env.NEXT_PUBLIC_DISCOGS_TOKEN}`,
              'User-Agent': 'VinylCollectionApp/1.0'
            }
          }
        )
        if (!response.ok) {
          throw new Error('Failed to fetch vinyl details')
        }
        const data = await response.json()
        setVinyl(data)
        
        // Rechercher le premier morceau s'il existe
        if (data.tracklist?.length > 0) {
          fetchYoutubeVideo(data.tracklist[0].title, data.artists?.[0]?.name)
        } else {
          // Sinon, rechercher avec le titre de l'album
          fetchYoutubeVideo(data.title, data.artists?.[0]?.name)
        }
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }

    fetchVinylDetails()
  }, [vinylId, fetchYoutubeVideo])

  const handleTrackClick = (trackTitle) => {
    if (vinyl?.artists?.[0]?.name) {
      fetchYoutubeVideo(trackTitle, vinyl.artists[0].name)
    }
  }

  const handleAddToCollectionWrapper = async (vinylWithSource) => {
    if (isInCollection) {
      alert("Ce vinyle est déjà dans votre collection !")
      return
    }
  
    try {
      // Préparation des données selon la nouvelle structure
      const vinylData = {
        vinyl: {
          title: vinyl.title,
          artist: vinyl.artists?.[0]?.name || "Various",
          imageUrl: vinyl.images?.[0]?.uri || "",
          year: vinyl.year || null,
          genres: Array.isArray(vinyl.genres) ? vinyl.genres.join(', ') : vinyl.genres || '',
          label: vinyl.labels?.[0]?.name || "",
          discogsId: vinyl.id.toString()
        },
        sourceType: vinylWithSource.sourceType,
        storeId: vinylWithSource.storeId,
        customSource: vinylWithSource.customSource,
        comment: vinylWithSource.comment || `Ajouté à ma collection`
      }

      await handleAddToCollection(vinylData)
      setIsAddModalOpen(false)
      alert('Vinyle ajouté à votre collection avec succès !')
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
      alert(error.message || 'Une erreur est survenue lors de l\'ajout à la collection')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!vinyl) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/search" className="text-gray-600 hover:text-gray-900 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la recherche
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Image et Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <VinylImage 
                imageUrl={vinyl.images?.[0]?.uri} 
                title={vinyl.title} 
              />

              <button
                onClick={() => !isInCollection && setIsAddModalOpen(true)}
                disabled={isInCollection || isCheckingCollection || isAdding}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center
                  ${isInCollection 
                    ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                    : isAdding
                    ? 'bg-gray-400 text-white cursor-wait'
                    : 'bg-[#421C10] text-white hover:bg-opacity-90'}`}
              >
                {isCheckingCollection ? 'Vérification...' : 
                 isAdding ? 'Ajout en cours...' :
                 isInCollection ? 'Déjà dans votre collection' : 
                 'Ajouter à ma collection'}
              </button>

              <a 
                href={vinyl.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-2 bg-[#421C10] text-white rounded-lg hover:bg-[#2d1309] transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Voir sur Discogs
              </a>

              {youtubeVideoId && (
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h2 className="font-medium text-gray-900 mb-4">Prévisualisation</h2>
                  <div className="relative pt-[56.25%]">
                    <YouTube 
                      videoId={youtubeVideoId} 
                      className="absolute top-0 left-0 w-full h-full"
                      opts={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite - Informations */}
          <div className="lg:col-span-2 space-y-6">
            <VinylHeader
              title={vinyl.title}
              artists={vinyl.artists}
              year={vinyl.year}
              formatQuantity={vinyl.format_quantity}
              formatName={vinyl.formats?.[0]?.name}
            />

            <GenresStyles
              genres={vinyl.genres}
              styles={vinyl.styles}
            />

            <Tracklist
              tracks={vinyl.tracklist}
              onTrackClick={handleTrackClick}
            />

            <VinylInfo
              labels={vinyl.labels}
              formats={vinyl.formats}
            />

            <VinylStats
              community={vinyl.community}
              marketData={vinyl.marketData}
            />

            <VinylShares shares={shares} />
          </div>
        </div>

        <AddToCollectionModal
          vinyl={vinyl}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddToCollectionWrapper}
        />
      </main>
    </div>
  )
}