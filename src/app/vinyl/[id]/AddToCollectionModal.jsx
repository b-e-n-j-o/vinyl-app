'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import VinylSourceSelect from './VinylSourceSelect'

export function AddToCollectionModal({ vinyl, isOpen, onClose, onAdd }) {
  const [source, setSource] = useState({
    sourceType: 'COLLECTION',
    storeId: null,
    customSource: null,
    comment: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Vérifier que les données nécessaires sont présentes
      if (source.sourceType === 'STORE' && !source.storeId) {
        throw new Error('Veuillez sélectionner un magasin')
      }
      
      if (source.sourceType === 'OTHER' && !source.customSource) {
        throw new Error('Veuillez préciser la source')
      }

      const vinylData = {
        vinyl: {
          title: vinyl.title || '',
          artist: vinyl.artists?.[0]?.name || '',
          imageUrl: vinyl.images?.[0]?.uri || '',
          year: vinyl.year || null,
          genres: vinyl.genres?.join(', ') || '',
          label: vinyl.labels?.[0]?.name || '',
          discogsId: vinyl.id.toString()
        },
        sourceType: source.sourceType,
        storeId: source.sourceType === 'STORE' ? source.storeId : null,
        customSource: source.sourceType === 'OTHER' ? source.customSource : null,
        comment: source.comment || 'Ajouté à ma collection'
      }

      console.log('Source Type:', source.sourceType)
      if (source.sourceType === 'STORE') {
        console.log('Store ID:', source.storeId)
      }
      console.log('Données envoyées:', vinylData)
      
      await onAdd(vinylData)
      onClose()
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
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
                Ajouter à ma collection
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

            <VinylSourceSelect onSourceChange={setSource} />

            <div className="mt-4">
              <label 
                htmlFor="comment" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Commentaire
              </label>
              <textarea
                id="comment"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#421C10] focus:border-transparent"
                placeholder="Ajouter un commentaire (optionnel)"
                value={source.comment}
                onChange={(e) => setSource(prev => ({
                  ...prev,
                  comment: e.target.value
                }))}
              />
            </div>

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
                disabled={isLoading}
                className="px-4 py-2 bg-[#421C10] text-white rounded-lg hover:bg-opacity-90
                         disabled:bg-opacity-50 disabled:cursor-not-allowed
                         flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ajout en cours...</span>
                  </>
                ) : (
                  <span>Ajouter</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}