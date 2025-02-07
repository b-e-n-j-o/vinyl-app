'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

// Ajout du style de carte minimaliste
const mapStyle = [
  {
    "featureType": "all",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#ffffff"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "weight": "0.7"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "weight": "0.5"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "weight": "0.5"
      }
    ]
  }
];

const AVAILABLE_CITIES = [
  'Bruxelles',
  'Paris',
  'Montréal',
];

const CITY_COORDINATES = {
  'Bruxelles': { latitude: 50.8503, longitude: 4.3517 },
  'Montréal': { latitude: 45.526076, longitude: -73.588149 },
  'Paris': { latitude: 48.8566, longitude: 2.3522 }
};

const StoreMap = dynamic(
  () => import('./OpenLayersMap'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-full w-full">
        <div className="h-32 w-32 rounded-full bg-[#6F4E37]"></div>
      </div>
    ),
    ssr: false
  }
);

const StoresMapPage = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Bruxelles');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [centerCoordinates, setCenterCoordinates] = useState(CITY_COORDINATES['Bruxelles']);
  const [mapSettings] = useState({
    zoom: {
      overview: 13,
      detail: 16,
      transitionDuration: 500,
      transitionEasing: 'ease-out'
    }
  });
  const [hoveredStore, setHoveredStore] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores');
        const data = await response.json();
        
        const formattedData = data.map(store => ({
          ...store,
          openingHours: Array.isArray(store.openingHours)
            ? store.openingHours
            : typeof store.openingHours === 'string'
              ? JSON.parse(store.openingHours.replace(/'/g, '"'))
              : []
        }));
        
        setStores(formattedData);
      } catch (error) {
        console.error('Erreur:', error);
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

  const updateCenterCoordinates = (store) => {
    if (store) {
      setCenterCoordinates({ 
        latitude: store.latitude, 
        longitude: store.longitude 
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF2E2]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#6F4E37]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#FAF2E2]">
      {/* En-tête avec titre et recherche */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-[#6F4E37] flex items-center gap-2">
            Découvrez les Disquaires à
            <div className="relative inline-block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="py-1 px-4 text-4xl font-bold border rounded-lg focus:ring-2 flex items-center gap-2 bg-white/50"
              >
                <span>{selectedCity}</span>
                <ChevronDown className="h-6 w-6" />
              </button>
              {dropdownOpen && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border min-w-[200px] z-50">
                  <ul className="py-1">
                    {AVAILABLE_CITIES.map((city) => (
                      <li
                        key={city}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[#6F4E37]"
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
          
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#6F4E37]" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un magasin..."
              className="w-full pl-10 pr-4 py-3 border border-[#6F4E37] rounded-lg bg-white/50 focus:bg-white focus:ring-2 focus:ring-[#6F4E37] transition-colors text-[#6F4E37] placeholder-[#6F4E37]/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="flex flex-1">
        <section className="fixed left-8 right-[50%] top-[calc(16rem+32px)] bottom-8 bg-gray-100 rounded-xl overflow-hidden mr-4">
          <StoreMap 
            stores={filteredStores}
            selectedStore={selectedStore}
            hoveredStore={hoveredStore}
            onStoreSelect={setSelectedStore}
            onStoreHover={setHoveredStore}
            centerCoordinates={centerCoordinates}
            zoomLevel={zoomLevel}
            mapStyle={mapStyle}
            transitionDuration={mapSettings.zoom.transitionDuration}
            transitionEasing={mapSettings.zoom.transitionEasing}
            showAllPoints={true}
            keepPointsVisible={true}
          />
        </section>
        
        <section 
          className="fixed left-[50%] right-8 top-[calc(16rem+32px)] bottom-8 overflow-auto bg-white scroll-smooth overscroll-behavior-y-contain rounded-xl ml-4"
          style={{
            scrollBehavior: 'smooth',
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div>
            {filteredStores.map((store, index) => (
              <Link
                key={store.id}
                href={`/store/${store.id}`}
                className={`block p-8 border-b border-gray-200 last:border-b-0 hover:bg-[#6F4E37] group opacity-0 animate-fadeIn scroll-snap-align-start scroll-snap-stop-always transition-all duration-300 ease-out`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
                onMouseEnter={() => {
                  setSelectedStore(store);
                  setHoveredStore(store);
                  updateCenterCoordinates(store);
                }}
                onMouseLeave={() => {
                  setSelectedStore(null);
                  setHoveredStore(null);
                }}
              >
                <h3 className="text-3xl font-normal text-[#6F4E37] group-hover:text-[#FAF2E2] transition-colors duration-500 ease-out">{store.name}</h3>
              </Link>
            ))}
            {filteredStores.length === 0 && (
              <div className="p-8 text-center text-[#6F4E37]">
                Aucun magasin trouvé {selectedCity ? `à ${selectedCity}` : ''}.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StoresMapPage;