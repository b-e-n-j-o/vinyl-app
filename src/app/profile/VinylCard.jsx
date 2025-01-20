'use client'

import { Share2, Disc, Store, Info } from 'lucide-react'
import Link from 'next/link'

export default function VinylCard({ vinyl, sharesCount = 0 }) {
  const getSourceInfo = () => {
    switch (vinyl.sourceType) {
      case 'STORE':
        return {
          icon: <Store className="w-3 h-3" />,
          text: vinyl.store?.name || 'Magasin',
          subtext: vinyl.store?.city
        }
      case 'COLLECTION':
        return {
          text: 'Collection personnelle'
        }
      default:
        return {
          icon: <Info className="w-3 h-3" />,
          text: vinyl.customSource || 'Autre source'
        }
    }
  }

  const sourceInfo = getSourceInfo()

  return (
    <div className="relative group">
      <Link href={`/vinyl/${vinyl.discogsId}`}>
        <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-shadow group-hover:shadow-xl">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-[#FAF2E2]">
            {vinyl.imageUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={vinyl.imageUrl}
                  alt={vinyl.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay gradiant */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Disc className="w-16 h-16 text-[#421C10]" />
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="p-4">
            {/* Titre et Artiste */}
            <div className="mb-2">
              <h3 className="font-semibold text-[#050517] line-clamp-1">{vinyl.title}</h3>
              <p className="text-sm text-[#421C10] line-clamp-1">{vinyl.artist}</p>
            </div>

            {/* Ajout de l'indicateur de source */}
            <div className="mt-2 flex items-center space-x-1 text-xs text-[#421C10]">
              {sourceInfo.icon}
              <span className="font-medium">{sourceInfo.text}</span>
              {sourceInfo.subtext && (
                <span className="text-[#421C10]/60">• {sourceInfo.subtext}</span>
              )}
            </div>

            {/* Infos */}
            <div className="space-y-1 text-xs text-[#421C10]">
              {vinyl.year && (
                <p className="inline-block mr-2">
                  <span className="font-medium">Année:</span> {vinyl.year}
                </p>
              )}
              {vinyl.label && (
                <p className="line-clamp-1">
                  <span className="font-medium">Label:</span> {vinyl.label}
                </p>
              )}
              {vinyl.genres && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {vinyl.genres.split(',').slice(0, 2).map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-[#FAF2E2] text-[#421C10] rounded-full text-xs"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Badge de partages */}
            {sharesCount > 0 && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                <Share2 className="w-3 h-3 text-[#421C10]" />
                <span className="text-xs font-medium text-[#421C10]">{sharesCount}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}