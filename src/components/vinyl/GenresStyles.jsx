// src/components/vinyl/GenresStyles.jsx
'use client'
import { Tag } from 'lucide-react'

export default function GenresStyles({ genres, styles }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Tag className="w-5 h-5 mr-2" />
        Genres & Styles
      </h2>
      <div className="flex flex-wrap gap-2">
        {genres?.map((genre, index) => (
          <span 
            key={`genre-${index}`}
            className="px-3 py-1 bg-[#f3e5ab] text-[#6F4E37] rounded-full text-sm"
          >
            {genre}
          </span>
        ))}
        {styles?.map((style, index) => (
          <span 
            key={`style-${index}`}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {style}
          </span>
        ))}
      </div>
    </div>
  )
}