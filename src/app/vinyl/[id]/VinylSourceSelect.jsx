'use client'
import { useState, useEffect } from 'react'
import { Store, Library, Menu } from 'lucide-react'

export default function VinylSourceSelect({ onSourceChange, initialSource = 'STORE' }) {
  const [sourceType, setSourceType] = useState(initialSource)
  const [storeId, setStoreId] = useState(null)
  const [customSource, setCustomSource] = useState('')
  const [stores, setStores] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores')
        const data = await response.json()
        setStores(data)
      } catch (error) {
        console.error('Erreur lors du chargement des magasins:', error)
      }
      setIsLoading(false)
    }

    fetchStores()
  }, [])

  useEffect(() => {
    const source = {
      sourceType,
      storeId: sourceType === 'STORE' ? storeId : null,
      customSource: sourceType === 'OTHER' ? customSource : null
    }
    console.log('Envoi de la source:', source)
    onSourceChange(source)
  }, [sourceType, storeId, customSource, onSourceChange])

  const handleStoreChange = (e) => {
    const newStoreId = e.target.value
    console.log('Magasin sélectionné:', newStoreId)
    setStoreId(newStoreId || null)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[#421C10]">D'où vient ce vinyle ?</h3>
      
      <div className="space-y-2">
        <label className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer border 
          ${sourceType === 'STORE' 
            ? 'bg-[#421C10] text-white border-transparent' 
            : 'bg-white text-[#421C10] border-gray-200 hover:bg-gray-50'}`}
        >
          <input
            type="radio"
            name="source"
            value="STORE"
            checked={sourceType === 'STORE'}
            onChange={(e) => setSourceType(e.target.value)}
            className="hidden"
          />
          <Store className="w-4 h-4" />
          <span>Magasin de disques</span>
        </label>

        <label className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer border
          ${sourceType === 'COLLECTION'
            ? 'bg-[#421C10] text-white border-transparent'
            : 'bg-white text-[#421C10] border-gray-200 hover:bg-gray-50'}`}
        >
          <input
            type="radio"
            name="source"
            value="COLLECTION"
            checked={sourceType === 'COLLECTION'}
            onChange={(e) => setSourceType(e.target.value)}
            className="hidden"
          />
          <Library className="w-4 h-4" />
          <span>Collection personnelle</span>
        </label>

        <label className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer border
          ${sourceType === 'OTHER'
            ? 'bg-[#421C10] text-white border-transparent'
            : 'bg-white text-[#421C10] border-gray-200 hover:bg-gray-50'}`}
        >
          <input
            type="radio"
            name="source"
            value="OTHER"
            checked={sourceType === 'OTHER'}
            onChange={(e) => setSourceType(e.target.value)}
            className="hidden"
          />
          <Menu className="w-4 h-4" />
          <span>Autre source</span>
        </label>
      </div>

      {sourceType === 'STORE' && (
        <select
          value={storeId || ''}
          onChange={handleStoreChange}
          className="w-full p-3 rounded-lg border border-gray-200 
                    focus:ring-2 focus:ring-[#421C10] focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">Sélectionner un magasin</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name} - {store.city}
            </option>
          ))}
        </select>
      )}

      {sourceType === 'OTHER' && (
        <input
          type="text"
          value={customSource}
          onChange={(e) => setCustomSource(e.target.value)}
          placeholder="D'où vient ce vinyle ? (ex: Don d'un ami)"
          className="w-full p-3 rounded-lg border border-gray-200 
                    focus:ring-2 focus:ring-[#421C10] focus:border-transparent"
        />
      )}
    </div>
  )
}