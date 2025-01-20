// ShareVinylModal.jsx
'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import VinylSourceSelect from './VinylSourceSelect'

export function ShareVinylModal({ vinyl, isOpen, onClose, onShare }) {
  const [comment, setComment] = useState('')
  const [source, setSource] = useState({
    sourceType: 'COLLECTION',
    storeId: null,
    customSource: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  // ShareVinylModal.jsx
const handleSubmit = async () => {
  const vinylId = typeof vinyl.discogsId === 'string' ? vinyl.discogsId : String(vinyl.id)

  if (!vinylId) {
    setError('Information du vinyle manquante')
    return
  }

  try {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/vinyl/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vinylId,
        comment: comment.trim(),
        sourceType: source.sourceType,
        storeId: source.sourceType === 'STORE' ? source.storeId : null,
        customSource: source.sourceType === 'OTHER' ? source.customSource?.trim() : null
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || `Erreur serveur (${response.status})`)
    }

    const data = await response.json()
    console.log('Partage réussi:', data)
    
    onClose()
    if (onShare) onShare(data.data)

  } catch (error) {
    console.error('Erreur détaillée:', error)
    setError(error.message)
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        <div className="relative bg-white w-full max-w-lg mx-auto rounded-xl shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#421C10]">
                Partager ce vinyle
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez vos impressions..."
              className="w-full p-3 rounded-lg border border-gray-200 mb-6 h-32 focus:ring-2 focus:ring-[#421C10] focus:border-transparent"
            />

            <VinylSourceSelect 
              onSourceChange={setSource}
              initialSource={source.sourceType}
            />

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !comment.trim()}
                className="px-4 py-2 bg-[#421C10] text-white rounded-lg hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Partage en cours...</span>
                  </>
                ) : (
                  <span>Partager</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
