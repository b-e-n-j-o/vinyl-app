// src/components/profile/CitySelector.jsx
'use client'

import { useState, useEffect } from 'react';
import { analyzePurchaseHistory } from '@/lib/utils/city-suggestions';

const CITIES = ['Paris', 'Bruxelles', 'Montréal'];

export default function CitySelector({ 
  currentCity, 
  vinylPosts,
  onCityChange 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [citySuggestion, setCitySuggestion] = useState(null);

  useEffect(() => {
    // Analyser l'historique d'achats pour suggestion
    const suggestion = analyzePurchaseHistory(vinylPosts);
    if (suggestion && suggestion.suggestedCity !== currentCity) {
      setCitySuggestion(suggestion);
    }
  }, [vinylPosts, currentCity]);

  const handleCityChange = async (newCity) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/update-city', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: newCity }),
      });

      if (!response.ok) throw new Error('Failed to update city');

      onCityChange?.(newCity);
      setCitySuggestion(null);
    } catch (error) {
      console.error('Error updating city:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <select
          value={currentCity}
          onChange={(e) => handleCityChange(e.target.value)}
          disabled={isLoading}
          className="p-2 border rounded-lg bg-white"
        >
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {isLoading && (
          <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {citySuggestion && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            Suggestion basée sur vos achats : {citySuggestion.suggestedCity} 
            ({citySuggestion.confidence}% de vos achats)
          </p>
          <button
            onClick={() => handleCityChange(citySuggestion.suggestedCity)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Utiliser cette ville
          </button>
        </div>
      )}

      {citySuggestion?.stats && (
        <div className="mt-2 space-y-2">
          {citySuggestion.stats.map(({ city, count, percentage }) => (
            <div key={city} className="flex items-center gap-2">
              <div className="text-sm text-gray-600">{city}:</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">{count} achats</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}