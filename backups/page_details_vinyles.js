'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import YouTube from 'react-youtube'
import { ArrowLeft, Disc, Play, Calendar, Clock, Tag, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function VinylDetails() {
  const router = useRouter()
  const { data: session } = useSession()
  const params = useParams()
  const [vinyl, setVinyl] = useState(null)
  const [youtubeVideoId, setYoutubeVideoId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isInCollection, setIsInCollection] = useState(false)
  const [isCheckingCollection, setIsCheckingCollection] = useState(true)
  const vinylId = params?.id

  const handleAddToCollection = async () => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch('/api/vinyl-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discogsId: vinyl.id.toString(),
          title: vinyl.title,
          artist: vinyl.artists?.[0]?.name || '',
          imageUrl: vinyl.images?.[0]?.uri || '',
          year: vinyl.year,
          genre: vinyl.genres || [],
          label: vinyl.labels?.[0]?.name || ''
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout à la collection')
      }

      router.push('/profile')
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    const checkCollection = async () => {
      if (!session?.user) {
        setIsCheckingCollection(false)
        return
      }
  
      try {
        console.log('Vérification pour le vinyle:', vinylId)
        const response = await fetch(`/api/vinyl-posts?discogsId=${vinylId}`)
        
        if (!response.ok) {
          throw new Error('Erreur lors de la vérification')
        }
        
        const data = await response.json()
        console.log('Réponse de l\'API:', data)
        setIsInCollection(data.exists)
      } catch (error) {
        console.error('Erreur lors de la vérification:', error)
      } finally {
        setIsCheckingCollection(false)
      }
    }
  
    checkCollection()
  }, [session, vinylId])

  const fetchYoutubeVideo = async (title, artist) => {
    try {
      // Fonction de nettoyage des chaînes
      const cleanString = (str) => {
        return str
          ?.trim()
          // Enlever les chiffres entre parenthèses: "(3)" -> ""
          .replace(/\s*\(\d+\)\s*/g, '')
          // Enlever les parenthèses vides
          .replace(/\(\s*\)/g, '')
          // Enlever les espaces multiples
          .replace(/\s+/g, ' ')
          // Enlever les espaces au début et à la fin
          .trim()
          .toLowerCase();
      };
  
      // Nettoyer l'artiste et le titre
      const cleanTitle = cleanString(title);
      const cleanArtist = cleanString(artist);
      const query = `${cleanArtist} - ${cleanTitle}`;
      console.log('Recherche YouTube après nettoyage:', query);
  
      const youtubeResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` + 
        `part=snippet` +
        `&q=${encodeURIComponent(query)}` +
        `&type=video` +
        `&videoCategoryId=10` +
        `&maxResults=3` +
        `&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
  
      const youtubeData = await youtubeResponse.json();
      
      if (youtubeData.items && youtubeData.items.length > 0) {
        const videoIds = youtubeData.items.map(item => item.id.videoId).join(',');
        const videoDetailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        
        const videoDetails = await videoDetailsResponse.json();
        
        // Calculer un score pour chaque vidéo
        const scoredVideos = videoDetails.items
          .filter(video => {
            const duration = parseDuration(video.contentDetails.duration);
            return duration > 61; // Filtrer les Shorts
          })
          .filter(video => {
            // Vérifier si le titre original complet est dans le titre de la vidéo
            const videoTitle = video.snippet.title.toLowerCase();
            return videoTitle.includes(cleanTitle);
          })
          .map(video => {
            const videoTitle = video.snippet.title.toLowerCase();
            let score = 0;
            
            // Diviser le titre de la vidéo en mots
            const videoWords = videoTitle.split(/\s+/);
            const titleWords = cleanTitle.split(/\s+/);
            const artistWords = cleanArtist.split(/\s+/);
            
            // Score pour le titre
            const titleMatchCount = titleWords.filter(word => videoWords.includes(word)).length;
            const titleScore = (titleMatchCount / titleWords.length) * 50;
            score += titleScore;
            
            // Score pour l'artiste
            const artistMatchCount = artistWords.filter(word => videoWords.includes(word)).length;
            const artistScore = (artistMatchCount / artistWords.length) * 50;
            score += artistScore;
            
            // Bonus pour l'ordre exact des mots
            const exactTitlePattern = new RegExp(`\\b${cleanTitle}\\b`);
            const exactArtistPattern = new RegExp(`\\b${cleanArtist}\\b`);
            
            if (exactTitlePattern.test(videoTitle)) score += 20;
            if (exactArtistPattern.test(videoTitle)) score += 20;
            
            // Bonus pour le format exact "artiste - titre"
            const exactPattern = new RegExp(`\\b${cleanArtist}\\s*-\\s*${cleanTitle}\\b`);
            if (exactPattern.test(videoTitle)) score += 30;

            console.log(`Titre: ${video.snippet.title} | Score: ${score}`);
            
            return {
              video,
              score,
            };
          })
          .sort((a, b) => b.score - a.score);
  
        if (scoredVideos.length > 0) {
          const bestMatch = scoredVideos[0];
          console.log('Meilleure correspondance:', {
            titre: bestMatch.video.snippet.title,
            score: bestMatch.score,
            id: bestMatch.video.id
          });
          setYoutubeVideoId(bestMatch.video.id);
        } else {
          setYoutubeVideoId(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch YouTube video:', error);
    }
  };
  
  const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || 0) * 3600;
    const minutes = parseInt(match[2] || 0) * 60;
    const seconds = parseInt(match[3] || 0);
    return hours + minutes + seconds;
  };

  useEffect(() => {
    let isMounted = true

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
        if (isMounted) {
          setVinyl(data)
          // Rechercher le premier morceau de l'album s'il existe
          if (data.tracklist && data.tracklist.length > 0) {
            fetchYoutubeVideo(data.tracklist[0].title, data.artists?.[0]?.name)
          } else {
            // Sinon, rechercher avec le titre de l'album
            fetchYoutubeVideo(data.title, data.artists?.[0]?.name)
          }
          setIsLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message)
          setIsLoading(false)
        }
      }
    }

    fetchVinylDetails()

    return () => {
      isMounted = false
    }
  }, [vinylId])

  const handleTrackClick = (trackTitle) => {
    if (vinyl?.artists?.[0]?.name) {
      fetchYoutubeVideo(trackTitle, vinyl.artists[0].name)
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
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la recherche
          </Link>
        </div>
      </div>
    )
  }

  if (!vinyl) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à la recherche
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Image et Player */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Image */}
              <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
                {vinyl.images?.[0]?.uri ? (
                  <img 
                    src={vinyl.images[0].uri}
                    alt={vinyl.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Disc className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Bouton Collection */}
              {isCheckingCollection ? (
                <div className="w-full flex justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                </div>
              ) : isInCollection ? (
                <button 
                  disabled
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg cursor-default"
                >
                  <Disc className="w-4 h-4 mr-2" />
                  Dans ma collection
                </button>
              ) : (
                <button 
                  onClick={handleAddToCollection}
                  disabled={isAdding}
                  className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isAdding ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Disc className="w-4 h-4 mr-2" />
                      Ajouter à ma collection
                    </>
                  )}
                </button>
              )}

              {/* Lien Discogs */}
              <a 
                href={vinyl.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Voir sur Discogs
              </a>

              {/* YouTube Player */}
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

          {/* Colonne centrale - Informations */}
          <div className="lg:col-span-2 space-y-6">
            {/* En-tête */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vinyl.title}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
                {vinyl.artists?.map((artist, index) => (
                  <span key={index} className="font-medium">
                    {artist.name}
                  </span>
                ))}
                {vinyl.year && (
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {vinyl.year}
                  </span>
                )}
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {vinyl.format_quantity} × {vinyl.formats?.[0]?.name || 'Vinyl'}
                </span>
              </div>
            </div>

            {/* Genres et Styles */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Genres & Styles
              </h2>
              <div className="flex flex-wrap gap-2">
                {vinyl.genres?.map((genre, index) => (
                  <span 
                    key={`genre-${index}`}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
                {vinyl.styles?.map((style, index) => (
                  <span 
                    key={`style-${index}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>

            {/* Tracklist */}
            {vinyl.tracklist && vinyl.tracklist.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracklist</h2>
                <div className="space-y-2">
                  {vinyl.tracklist.map((track, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer group"
                      onClick={() => handleTrackClick(track.title)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 w-8">{track.position || index + 1}</span>
                        <span className="text-gray-900">{track.title}</span>
                        <Play className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {track.duration && (
                        <span className="text-gray-500 text-sm">{track.duration}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Labels et Crédits */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Labels</h3>
                  {vinyl.labels?.map((label, index) => (
                    <div key={index} className="text-gray-600">
                      {label.name} {label.catno && `(${label.catno})`}
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Format</h3>
                  <div className="text-gray-600">
                    {vinyl.formats?.[0]?.descriptions?.join(', ')}
                    {vinyl.formats?.[0]?.text && `, ${vinyl.formats[0].text}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <div className="p-6 text-center border-r border-b md:border-b-0">
                  <div className="text-2xl font-bold text-gray-900">
                    {vinyl.community?.have || 0}
                  </div>
                  <div className="text-sm text-gray-500">Collections</div>
                </div>
                <div className="p-6 text-center border-b md:border-b-0 md:border-r">
                  <div className="text-2xl font-bold text-gray-900">
                    {vinyl.community?.want || 0}
                  </div>
                  <div className="text-sm text-gray-500">Wishlist</div>
                </div>
                <div className="p-6 text-center border-r">
                  <div className="text-2xl font-bold text-gray-900">
                    {vinyl.community?.rating?.average 
                      ? `${vinyl.community.rating.average.toFixed(2)}/5` 
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Note</div>
                </div>
                <div className="p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {vinyl.marketData?.lowest_price
                      ? `${vinyl.marketData.lowest_price.toFixed(2)} €`
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Prix moyen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}