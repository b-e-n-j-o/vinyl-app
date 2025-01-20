// src/components/users/UserDiscoverySearch.jsx
'use client';

import React, { useState } from 'react';
import { UserSearchResults } from "./UserSearchResults";

const CITIES = ['Bruxelles', 'Paris', 'Montréal'];
const MUSIC_GENRES = [
  'Blues',
  'Brass & Military',
  'Children\'s', 
  'Classical',
  'Electronic',
  'Folk, World, & Country',
  'Funk / Soul',
  'Hip-Hop',
  'Jazz',
  'Latin',
  'Non-Music',
  'Pop',
  'Reggae',
  'Rock',
  'Stage & Screen'
];

export function UserDiscoverySearch() {
  const [searchMode, setSearchMode] = useState('username');
  const [searchQuery, setSearchQuery] = useState('');

  const searchModes = [
    { id: 'username', icon: '👤', label: 'Par pseudo' },
    { id: 'music', icon: '🎵', label: 'Par genre musical' },
    { id: 'city', icon: '🏢', label: 'Par ville' }
  ];

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const renderSearchInput = () => {
    if (searchMode === 'city') {
      return (
        <select 
          className="w-full p-2 border rounded-lg bg-white"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        >
          <option value="">Sélectionner une ville</option>
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      );
    }

    if (searchMode === 'music') {
      return (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un genre musical..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg"
            />
            <span className="absolute left-3 top-2.5">🔍</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {MUSIC_GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => handleSearch(genre)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 
                         rounded-full transition-colors text-gray-800"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 pl-10 border rounded-lg"
        />
        <span className="absolute left-3 top-2.5">🔍</span>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="space-y-6">
        {/* Search modes */}
        <div className="flex flex-wrap gap-2">
          {searchModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setSearchMode(mode.id);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                ${searchMode === mode.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          {renderSearchInput()}
        </div>

        {/* Results */}
        <UserSearchResults 
          mode={searchMode} 
          query={searchQuery}
        />
      </div>
    </div>
  );
}