// src/components/vinyl/VinylShares.jsx
import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import SourceBadge from './SourceBadge';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Utiliser une locale fixe pour éviter les différences serveur/client
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // Assure la cohérence serveur/client
  }).format(date);
};

export default function VinylShares({ shares }) {
  if (!shares?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Partages</h2>
        <p className="text-gray-500">Ce vinyle n'a pas encore été partagé</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Partagé par</h2>
      <div className="space-y-4">
        {shares.map((share) => (
          <div 
            key={share.id} 
            className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              {share.user.image ? (
                <img
                  src={share.user.image}
                  alt={share.user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User className="w-5 h-5 text-gray-500" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link 
                  href={`/users/${share.user.id}`}
                  className="font-medium text-gray-900 hover:text-[#421C10]"
                >
                  {share.user.name}
                </Link>
                <SourceBadge 
                  sourceType={share.sourceType}
                  store={share.store}
                  customSource={share.customSource}
                />
              </div>
              
              {share.comment && (
                <p className="text-sm text-gray-600 mt-1">
                  {share.comment}
                </p>
              )}
              
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <span>{formatDate(share.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}