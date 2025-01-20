// app/store/[id]/StorePageClient.js
'use client'

import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Globe, Star, Share2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import OpeningHours from '../OpeningHours';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../../components/Map'), {
  loading: () => <div className="h-full w-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#6F4E37]"></div>
  </div>,
  ssr: false
});

// Composant carte pour les vinyles partagés
function SharedVinylCard({ vinyl }) {
  const handleVinylClick = async () => {
    try {
      if (!vinyl?.discogsId) {
        console.error('DiscogsID manquant');
        return;
      }

      const response = await fetch(`/api/vinyl/check/${vinyl.discogsId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log('Résultat de la vérification:', data);

      if (data.inCollection) {
        // Afficher un message ou une notification
        console.log('Détails du partage:', data.details);
      } else {
        // Redirection vers la page du vinyle
        window.location.href = `/vinyl/${vinyl.discogsId}`;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
    }
  };

  return (
    <div 
      onClick={handleVinylClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    >
      <img
        src={vinyl.imageUrl || '/placeholder-vinyl.jpg'}
        alt={vinyl.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-[#6F4E37]">{vinyl.title}</h3>
        <p className="text-sm text-gray-600">{vinyl.artist}</p>
        {vinyl.comment && (
          <p className="mt-2 text-sm text-gray-500 italic">"{vinyl.comment}"</p>
        )}
        <div className="mt-2 flex items-center">
          <img
            src={vinyl.user.image || '/placeholder-user.jpg'}
            alt={vinyl.user.name}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600">{vinyl.user.name}</span>
        </div>
      </div>
    </div>
  );
}

// Composant carte pour les vinyles en inventaire
function InventoryVinylCard({ vinyl }) {
  const handleVinylClick = async () => {
    try {
      if (!vinyl?.discogsId) {
        console.error('DiscogsID manquant');
        return;
      }

      const response = await fetch(`/api/vinyl/check/${vinyl.discogsId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log('Résultat de la vérification:', data);

      if (data.inCollection) {
        // Afficher un message ou une notification
        console.log('Détails du partage:', data.details);
      } else {
        // Redirection vers la page du vinyle
        window.location.href = `/vinyl/${vinyl.discogsId}`;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
    }
  };

  return (
    <div 
      onClick={handleVinylClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    >
      <img
        src={vinyl.imageUrl || '/placeholder-vinyl.jpg'}
        alt={vinyl.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-[#6F4E37]">{vinyl.title}</h3>
        <p className="text-sm text-gray-600">{vinyl.artist}</p>
        <div className="mt-2 space-y-1">
          <p className="font-bold text-[#6F4E37]">{vinyl.price}€</p>
          <p className="text-sm text-gray-500">État: {vinyl.condition}</p>
        </div>
      </div>
    </div>
  );
}

export default function StorePageClient({ storeId }) {
  const [store, setStore] = useState(null);
  const [catalogs, setCatalogs] = useState({ shared: [], inventory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('shared');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, catalogsRes] = await Promise.all([
          fetch(`/api/stores/${storeId}`),
          fetch(`/api/stores/${storeId}/catalogs`)
        ]);

        if (!storeRes.ok || !catalogsRes.ok) throw new Error('Erreur de chargement');

        const [storeData, catalogsData] = await Promise.all([
          storeRes.json(),
          catalogsRes.json()
        ]);

        setStore({
          ...storeData,
          openingHours: Array.isArray(storeData.openingHours)
            ? storeData.openingHours
            : typeof storeData.openingHours === 'string'
              ? JSON.parse(storeData.openingHours.replace(/'/g, '"'))
              : []
        });
        setCatalogs(catalogsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchData();
    }
  }, [storeId]);

  if (loading || !store) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#6F4E37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF2E2]">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/stores"
          className="inline-block mb-8 px-4 py-2 rounded-lg text-[#6F4E37] hover:bg-[#6F4E37] hover:text-[#FAF2E2] transition-colors"
        >
          ← Retour aux magasins
        </Link>

        <h1 className="text-4xl font-bold text-[#6F4E37] mb-8">{store.name}</h1>

        {/* Catalogs Section */}
        <div className="mb-12">
          <div className="flex border-b border-[#6F4E37]/20 mb-6">
            <button
              className={`flex items-center px-6 py-3 ${
                activeTab === 'shared' 
                  ? 'border-b-2 border-[#6F4E37] text-[#6F4E37]' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('shared')}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Vinyles partagés
              <span className="ml-2 bg-gray-100 px-2 rounded-full text-sm">
                {catalogs.shared.length}
              </span>
            </button>
            <button
              className={`flex items-center px-6 py-3 ${
                activeTab === 'inventory' 
                  ? 'border-b-2 border-[#6F4E37] text-[#6F4E37]' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('inventory')}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              En vente
              <span className="ml-2 bg-gray-100 px-2 rounded-full text-sm">
                {catalogs.inventory.length}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeTab === 'shared' ? (
              catalogs.shared.length > 0 ? (
                catalogs.shared.map((vinyl) => (
                  <SharedVinylCard key={vinyl.id} vinyl={vinyl} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  Aucun vinyle partagé dans ce magasin pour le moment
                </p>
              )
            ) : (
              catalogs.inventory.length > 0 ? (
                catalogs.inventory.map((vinyl) => (
                  <InventoryVinylCard key={vinyl.id} vinyl={vinyl} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  Aucun vinyle en vente actuellement
                </p>
              )
            )}
          </div>
        </div>

        {/* Store Info and Map */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-1 text-[#6F4E37]" />
                <div className="text-[#6F4E37]">
                  <p>{store.address}</p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm mt-1 inline-block"
                  >
                    Voir sur maps →
                  </a>
                </div>
              </div>

              {store.rating && (
                <div className="flex items-center space-x-2">
                  {[...Array(Math.round(store.rating))].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-[#6F4E37]">({store.reviewCount} avis)</span>
                </div>
              )}

              {store.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-[#6F4E37]" />
                  <a href={`tel:${store.phone}`} className="text-[#6F4E37] hover:text-blue-500">
                    {store.phone}
                  </a>
                </div>
              )}

              {store.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-[#6F4E37]" />
                  <a 
                    href={store.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#6F4E37] hover:text-blue-500"
                  >
                    Site web
                  </a>
                </div>
              )}

              {store.openingHours && store.openingHours.length > 0 && (
                <OpeningHours hours={store.openingHours} />
              )}
            </div>
          </div>

          {/* Map */}
          <div className="h-96 rounded-lg overflow-hidden shadow-xl">
            <Map 
              stores={[store]}
              selectedStore={store}
              centerCoordinates={{ 
                latitude: store.latitude || 50.8503,
                longitude: store.longitude || 4.3517
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}