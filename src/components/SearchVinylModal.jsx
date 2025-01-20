// components/SearchVinylModal.jsx
'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchVinylModal({ isOpen, onClose, onVinylAdded }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Réutilisation de la logique de recherche
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (search.trim().length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `https://api.discogs.com/database/search?q=${search}&type=release&per_page=5`,
          {
            headers: {
              'Authorization': `Discogs token=${process.env.NEXT_PUBLIC_DISCOGS_TOKEN}`,
              'User-Agent': 'VinylCollectionApp/1.0'
            }
          }
        )
        const data = await response.json()
        setSuggestions(data.results || [])
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setIsLoading(false)
      }
    }, 400)

    return () => clearTimeout(delaySearch)
  }, [search])

  const handleVinylSelect = async (vinyl) => {
    router.push(`/vinyl/${vinyl.id}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg text-[#6F4E37] font-semibold">Rechercher un vinyle</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 text-[#6F4E37] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="p-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Tapez le nom de votre vinyle"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 bg-white border 
                       border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6F4E37] 
                       focus:border-transparent"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#6F4E37]"></div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-4 right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleVinylSelect(suggestion)}
                  disabled={isAdding}
                  className="w-full p-3 text-left hover:bg-gray-50 cursor-pointer border-b 
                           border-gray-100 last:border-0 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {suggestion.thumb && (
                      <img 
                        src={suggestion.thumb}
                        alt={suggestion.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{suggestion.title}</p>
                      <p className="text-sm text-gray-500">
                        {suggestion.year && `${suggestion.year} • `}
                        {suggestion.genre && suggestion.genre.join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[#6F4E37] text-sm font-medium">
                    {isAdding ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6F4E37]"></div>
                    ) : (
                      'Ajouter'
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}