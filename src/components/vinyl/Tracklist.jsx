// src/components/vinyl/Tracklist.jsx
'use client'
import { Play } from 'lucide-react'

export default function Tracklist({ tracks, onTrackClick }) {
  if (!tracks?.length) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracklist</h2>
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div 
            key={index}
            className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer group"
            onClick={() => onTrackClick(track.title)}
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-400 w-8">{track.position || index + 1}</span>
              <span className="text-gray-900">{track.title}</span>
              <Play className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {track.duration && (
              <span className="text-gray-500 text-sm">{track.duration}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
