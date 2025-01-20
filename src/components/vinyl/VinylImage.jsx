// src/components/vinyl/VinylImage.jsx
'use client'
import { Disc } from 'lucide-react'

export default function VinylImage({ imageUrl, title }) {
  return (
    <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
      {imageUrl ? (
        <img 
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <Disc className="w-20 h-20 text-gray-400" />
        </div>
      )}
    </div>
  )
}