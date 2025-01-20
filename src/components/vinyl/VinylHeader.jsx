// src/components/vinyl/VinylHeader.jsx
'use client'
import { Calendar, Clock } from 'lucide-react'

export default function VinylHeader({ title, artists, year, formatQuantity, formatName }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
        {artists?.map((artist, index) => (
          <span key={index} className="font-medium">
            {artist.name}
          </span>
        ))}
        {year && (
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {year}
          </span>
        )}
        <span className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {formatQuantity} × {formatName || 'Vinyl'}
        </span>
      </div>
    </div>
  )
}