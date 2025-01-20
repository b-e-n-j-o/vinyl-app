'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Search, MapPin, Phone, Globe, Star, ChevronDown } from 'lucide-react';
import OpeningHours from './OpeningHours';
import styles from './StorePage.module.css';

const Map = dynamic(() => import('../../components/Map'), {
  loading: () => <div className="h-full w-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#6F4E37]"></div>
  </div>,
  ssr: false
});

const AVAILABLE_CITIES = [
  'Bruxelles',
  'Paris',
  'Montréal',
  // On peut facilement ajouter d'autres villes ici
];

const CITY_COORDINATES = {
  'Bruxelles': { latitude: 50.8503, longitude: 4.3517 },
  'Montréal': { latitude: 45.526076, longitude: -73.588149 },
  'Paris': { latitude: 48.8566, longitude: 2.3522 }
};

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [hoveredStore, setHoveredStore] = useState(null);
  const [cities, setCities] = useState(AVAILABLE_CITIES);
  const [selectedCity, setSelectedCity] = useState('Bruxelles');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        console.log('Début du fetch');
        const response = await fetch('/api/stores');
        console.log('Status de la réponse:', response.status);
        
        const data = await response.json();
        console.log('Données reçues:', data);
        
        if (!Array.isArray(data)) {
          console.error('Les données reçues ne sont pas un tableau:', data);
          setStores([]);
          return;
        }

        const formattedData = data.map(store => ({
          ...store,
          openingHours: Array.isArray(store.openingHours)
            ? store.openingHours
            : typeof store.openingHours === 'string'
              ? JSON.parse(store.openingHours.replace(/'/g, '"'))
              : []
        }));
        
        console.log('Données formatées:', formattedData);
        setStores(formattedData);
      } catch (error) {
        console.error('Erreur complète:', error);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || store.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const renderStoreDetails = () => {
    return (
      <div className="p-6 bg-transparent rounded-lg shadow-lg">
        <button 
          onClick={() => setSelectedStore(null)}
          className="mb-4 px-4 py-2 rounded-lg text-[#6F4E37]"
          style={{ backgroundColor: '#FAF2E2' }}
        >
          ← Retour à la liste
        </button>

        <h2 className="text-2xl font-bold mb-4" style={{ color: '#6F4E37' }}>
          {selectedStore.name}
        </h2>

        <div className="space-y-4" style={{ backgroundColor: 'transparent' }}>
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: '#6F4E37' }} />
            <div style={{ color: '#6F4E37' }}>
              <p>{selectedStore.address}</p>
              <div className="flex space-x-4 mt-1">
                <Link 
                  href={`/store/${selectedStore.id}`}
                  className="inline-block px-4 py-2 bg-[#6F4E37] text-[#FAF2E2] rounded-lg opacity-40 hover:opacity-60 transition-all duration-500"
                >
                  Voir le store →
                </Link>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStore.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                >
                  Voir sur maps →
                </a>
              </div>
            </div>
          </div>

          {selectedStore.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(Math.round(selectedStore.rating))].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2" style={{ color: '#6F4E37' }}>
                  ({selectedStore.reviewCount} avis)
                </span>
              </div>
            </div>
          )}

          {selectedStore.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" style={{ color: '#6F4E37' }} />
              <a href={`tel:${selectedStore.phone}`} className="hover:text-blue-500" style={{ color: '#6F4E37' }}>
                {selectedStore.phone}
              </a>
            </div>
          )}

          {selectedStore.website && (
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" style={{ color: '#6F4E37' }} />
              <a href={selectedStore.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500" style={{ color: '#6F4E37' }}>
                Site web
              </a>
            </div>
          )}

          {selectedStore.openingHours && selectedStore.openingHours.length > 0 && (
            <OpeningHours hours={selectedStore.openingHours} />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#6F4E37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF2E2' }}>
      <div className={`container mx-auto px-4 py-8 ${styles.mainContainer}`}>
        <h1 className={`text-4xl font-bold mb-8 flex items-center gap-2 mt-20 ${styles.pageTitle}`} style={{ color: '#6F4E37' }}>
          Découvrez les Disquaires à
          <div className={`relative ${styles.cityDropdown}`}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="py-1 px-4 border rounded-lg focus:ring-2 flex items-center min-w-[200px] justify-between"
              style={{ 
                borderColor: '#6F4E37',
                backgroundColor: '#FAF2E2',
                color: '#6F4E37'
              }}
            >
              <span className="inline-block text-4xl">
                {selectedCity || 'Sélectionnez une ville'}
              </span>
              <ChevronDown className="h-7 w-7 ml-2" />
            </button>
            {dropdownOpen && (
              <div 
                className="absolute mt-2 w-full rounded-lg shadow-lg bg-white z-50"
                style={{ color: '#6F4E37', minWidth: '200px' }}
              >
                <ul className="py-1">
                  {cities.map((city) => (
                    <li
                      key={city}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-base"
                      onClick={() => {
                        setSelectedCity(city);
                        setDropdownOpen(false);
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </h1>

        <div className={`relative mb-6 ${styles.searchContainer}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5" style={{ color: '#6F4E37' }} />
          </div>
          <input
            type="text"
            placeholder="Rechercher un magasin..."
            className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2"
            style={{ 
              borderColor: '#6F4E37',
              backgroundColor: '#FAF2E2',
              color: '#6F4E37'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={`grid md:grid-cols-3 gap-6 ${styles.mainGrid}`}>
          {/* Liste des magasins */}
          <div className={`md:h-[calc(100vh-300px)] overflow-y-auto space-y-4 pr-4 ${styles.storesList}`}>
            {selectedStore ? (
              renderStoreDetails()
            ) : filteredStores.length === 0 ? (
              <div className="p-6 bg-transparent rounded-lg text-center">
                <p className="text-xl" style={{ color: '#6F4E37' }}>
                  Aucun magasin trouvé {selectedCity ? `à ${selectedCity}` : ''}.
                </p>
              </div>
            ) : (
              filteredStores.map((store) => (
                <div
                  key={store.id}
                  className={`p-4 rounded-lg shadow-md transition-all cursor-pointer transform hover:scale-102 hover:shadow-lg`}
                  style={{
                    backgroundColor: selectedStore?.id === store.id ? '#FAF2E2' : '#FAF2E2',
                    color: selectedStore?.id === store.id ? '#6F4E37' : '#6F4E37',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transition = 'background-color 0.5s, color 0.2s';
                    e.currentTarget.style.backgroundColor = 'rgba(111, 78, 55, 0.2)';
                    e.currentTarget.style.color = '#6F4E37';
                    setHoveredStore({...store, noZoom: true});
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF2E2';
                    e.currentTarget.style.color = '#6F4E37';
                    setHoveredStore(null);
                  }}
                  onClick={() => setSelectedStore(store)}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'inherit' }}>
                    {store.name}
                  </h3>
                  <div className="flex items-start space-x-2 text-inherit">
                    <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                    <p>{store.address}</p>
                  </div>
                  {store.phone && (
                    <div className="flex items-center space-x-2 text-inherit mt-2">
                      <Phone className="h-5 w-5" />
                      <a href={`tel:${store.phone}`} className="hover:opacity-80">
                        {store.phone}
                      </a>
                    </div>
                  )}
                  {store.rating && (
                    <div className="mt-2 flex items-center">
                      {[...Array(Math.round(store.rating))].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-2 text-inherit">
                        ({store.reviewCount} avis)
                      </span>
                    </div>
                  )}
                  <Link 
                    href={`/store/${store.id}`}
                    className="mt-4 inline-block px-4 py-2 bg-[#6F4E37] text-[#FAF2E2] rounded-lg opacity-40 hover:opacity-60 transition-all duration-500"
                  >
                    Voir le store →
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Carte */}
          <div className={`md:col-span-2 h-[calc(100vh-300px)] rounded-lg overflow-hidden shadow-xl relative z-0 ${styles.mapContainer}`}>
            <Map 
              stores={filteredStores} 
              selectedStore={selectedStore || hoveredStore}
              onStoreSelect={setSelectedStore}
              centerCoordinates={CITY_COORDINATES[selectedCity]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}