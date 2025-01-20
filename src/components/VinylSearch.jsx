'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'

export default function VinylSearch() {
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

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

  const handleSearch = async () => {
    if (!search.trim()) return
    setShowSuggestions(false)
    
    try {
      const response = await fetch(
        `https://api.discogs.com/database/search?q=${search}&type=release`,
        {
          headers: {
            'Authorization': `Discogs token=${process.env.NEXT_PUBLIC_DISCOGS_TOKEN}`,
            'User-Agent': 'VinylCollectionApp/1.0'
          }
        }
      )
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion.title)
    setSuggestions([])
    setShowSuggestions(false)
    setResults([suggestion])
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Pink Floyd - The Moon"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-white border 
                     border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 
                     focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 
                     text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full p-3 text-left hover:bg-gray-50 cursor-pointer border-b 
                           border-gray-100 last:border-0 transition-colors"
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
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((vinyl) => (
          <Link 
            href={`/vinyl/${vinyl.id}`}
            key={vinyl.id}
          >
            <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow 
                          cursor-pointer group">
              <div className="flex items-start gap-4">
                {vinyl.thumb && (
                  <img 
                    src={vinyl.thumb}
                    alt={vinyl.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 
                               group-hover:text-purple-600 transition-colors">
                    {vinyl.title}
                  </h2>
                  <div className="text-base text-gray-700">
                    {vinyl.year && (
                      <p className="font-medium">
                        Année : <span className="text-gray-900">{vinyl.year}</span>
                      </p>
                    )}
                    {vinyl.label && (
                      <p className="font-medium">
                        Label : <span className="text-gray-900">
                          {Array.isArray(vinyl.label) ? vinyl.label[0] : vinyl.label}
                        </span>
                      </p>
                    )}
                    {vinyl.genre && (
                      <p className="font-medium">
                        Genre : <span className="text-gray-900">{vinyl.genre.join(', ')}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}