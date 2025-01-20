// src/components/vinyl/VinylStats.jsx
'use client'

export default function VinylStats({ community, marketData }) {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-4">
        <div className="p-6 text-center border-r border-b md:border-b-0">
          <div className="text-2xl font-bold text-gray-900">
            {community?.have || 0}
          </div>
          <div className="text-sm text-gray-500">Collections</div>
        </div>
        <div className="p-6 text-center border-b md:border-b-0 md:border-r">
          <div className="text-2xl font-bold text-gray-900">
            {community?.want || 0}
          </div>
          <div className="text-sm text-gray-500">Wishlist</div>
        </div>
        <div className="p-6 text-center border-r">
          <div className="text-2xl font-bold text-gray-900">
            {community?.rating?.average 
              ? `${community.rating.average.toFixed(2)}/5` 
              : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">Note</div>
        </div>
        <div className="p-6 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {marketData?.lowest_price
              ? `${marketData.lowest_price.toFixed(2)} €`
              : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">Prix moyen</div>
        </div>
      </div>
    </div>
  )
}