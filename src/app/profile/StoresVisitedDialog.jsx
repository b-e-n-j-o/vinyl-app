'use client'

import { Store, MapPin, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function StoresVisitedDialog({ stores = [], vinyles = [], isOpen, onClose }) {
  // Regrouper les magasins par ville
  const storesByCity = stores.reduce((acc, store) => {
    if (!store.city) return acc
    if (!acc[store.city]) {
      acc[store.city] = []
    }
    acc[store.city].push({
      ...store,
      vinylCount: vinyles.filter(v => v.storeId === store.id).length
    })
    return acc
  }, {})

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#FAF2E2]">
          <div className="flex items-center space-x-3">
            <Store className="w-5 h-5 text-[#421C10]" />
            <h2 className="text-lg font-semibold text-[#421C10]">
              Magasins visités
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FAF2E2] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#421C10]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {Object.entries(storesByCity).map(([city, stores]) => (
            <div key={city} className="mb-8 last:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-4 h-4 text-[#421C10]" />
                <h3 className="font-medium text-[#421C10]">{city}</h3>
              </div>

              <div className="space-y-4">
                {stores.map(store => (
                  <Link
                    key={store.id}
                    href={`/store/${store.id}`}
                    className="block bg-[#FAF2E2] rounded-lg p-4 hover:bg-[#FAF2E2]/80 
                             transition-colors relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-[#421C10] flex items-center">
                          {store.name}
                          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <p className="text-sm text-[#421C10]/70 mt-1">
                          {store.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <span className="text-[#421C10]">
                        {store.vinylCount} vinyle{store.vinylCount > 1 ? 's' : ''} trouvé{store.vinylCount > 1 ? 's' : ''}
                      </span>
                      {store.phone && (
                        <a
                          href={`tel:${store.phone}`}
                          className="text-[#421C10] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {store.phone}
                        </a>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}