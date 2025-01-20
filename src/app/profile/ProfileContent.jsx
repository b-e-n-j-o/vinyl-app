'use client'

import { useState, useMemo } from 'react'
import { Plus, Disc, Tag, Store, Library, Info, ArrowDownAZ, MapPin, Music } from 'lucide-react'
import SearchVinylModal from "../../components/SearchVinylModal"
import VinylGrid from "./VinylGrid"
import StoresVisitedDialog from "./StoresVisitedDialog"

export default function ProfileContent({ 
  session, 
  vinyles = [],
  userData,
  citySuggestion 
}) {
 const [isModalOpen, setIsModalOpen] = useState(false)
 const [isStoresDialogOpen, setIsStoresDialogOpen] = useState(false)
 const [selectedSource, setSelectedSource] = useState('all')
 const [sortBy, setSortBy] = useState('date')
 const [isEditingCity, setIsEditingCity] = useState(false)

 // Calculs mémorisés pour les statistiques et les données
 const {
   genres,
   stats,
   uniqueStores,
   sortedAndFilteredVinyles,
   topGenres
 } = useMemo(() => {
   // Extraire tous les genres uniques
   const genres = Array.from(
     new Set(vinyles.flatMap(v => v.genres.split(',').map(g => g.trim())))
   )

   // Calculer les genres les plus fréquents
   const genreCounts = {};
   vinyles.forEach(vinyl => {
     const vinylGenres = vinyl.genres.split(',').map(g => g.trim());
     vinylGenres.forEach(genre => {
       genreCounts[genre] = (genreCounts[genre] || 0) + 1;
     });
   });

   const topGenres = Object.entries(genreCounts)
     .sort(([,a], [,b]) => b - a)
     .slice(0, 3)
     .map(([genre]) => genre);

   // Récupérer les magasins uniques
   const uniqueStores = Array.from(
     new Set(vinyles.filter(v => v.store).map(v => v.store))
   )

   // Calculer les statistiques
   const stats = {
     storeCount: vinyles.filter(v => v.sourceType === 'STORE').length,
     collectionCount: vinyles.filter(v => v.sourceType === 'COLLECTION').length,
     storesVisited: uniqueStores.length
   }

   // Filtrer puis trier les vinyles
   const filteredVinyles = selectedSource === 'all'
     ? vinyles
     : vinyles.filter(vinyl => vinyl.sourceType === selectedSource)

   const sortedVinyles = [...filteredVinyles].sort((a, b) => {
     switch (sortBy) {
       case 'artist':
         return a.artist.localeCompare(b.artist)
       case 'title':
         return a.title.localeCompare(b.title)
       default:
         return new Date(b.createdAt) - new Date(a.createdAt)
     }
   })

   return {
     genres,
     stats,
     uniqueStores,
     sortedAndFilteredVinyles: sortedVinyles,
     topGenres
   }
 }, [vinyles, selectedSource, sortBy])

 // Gestion du changement de ville
 const handleCityChange = async (newCity) => {
   try {
     const response = await fetch('/api/users/update-city', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ city: newCity })
     });

     if (!response.ok) throw new Error('Failed to update city');
     
     // Recharger la page pour refléter les changements
     window.location.reload();
   } catch (error) {
     console.error('Error updating city:', error);
   }
 };

 return (
   <div className="min-h-screen bg-[#FAF2E2] pt-16">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* En-tête du profil */}
       <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="flex items-center space-x-4">
             {session.user?.image ? (
               <img 
                 src={session.user.image} 
                 alt={session.user.name || "Profile"}
                 className="h-16 w-16 rounded-full border-2 border-[#EFC88B]"
               />
             ) : (
               <div className="h-16 w-16 rounded-full bg-[#FAF2E2] flex items-center justify-center">
                 <span className="text-2xl text-[#421C10]">
                   {session.user?.name?.charAt(0) || '?'}
                 </span>
               </div>
             )}
             <div>
               <h1 className="text-xl font-bold text-[#421C10]">
                 {session.user?.name || 'Collectionneur'}
               </h1>
               <div className="flex flex-col gap-1">
                 <div className="flex items-center text-sm text-[#421C10]">
                   <Disc className="w-4 h-4 mr-1" />
                   <span>{vinyles.length} vinyles</span>
                 </div>
                 <div className="flex items-center text-sm text-[#421C10]">
                   <MapPin className="w-4 h-4 mr-1" />
                   <span>{userData?.city || 'Paris'}</span>
                   {!isEditingCity && (
                     <button 
                       onClick={() => setIsEditingCity(true)}
                       className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                     >
                       Modifier
                     </button>
                   )}
                 </div>
               </div>
             </div>
           </div>
           
           <button
             onClick={() => setIsModalOpen(true)}
             className="inline-flex items-center px-4 py-2 bg-[#421C10] text-[#F4E3B2] 
                      hover:bg-[#050517] transition-colors duration-200 rounded-lg
                      text-sm font-medium shadow-sm"
           >
             <Plus className="w-5 h-5 mr-1" />
             Ajouter un vinyle
           </button>
         </div>

         {/* Modal de modification de ville */}
         {isEditingCity && (
           <div className="mt-4 p-4 bg-gray-50 rounded-lg">
             <h3 className="text-sm font-medium text-[#421C10] mb-2">Choisir une ville</h3>
             <div className="flex gap-2">
               {['Paris', 'Bruxelles', 'Montréal'].map(city => (
                 <button
                   key={city}
                   onClick={() => {
                     handleCityChange(city);
                     setIsEditingCity(false);
                   }}
                   className={`px-3 py-1 rounded-full text-sm ${
                     userData?.city === city
                       ? 'bg-[#421C10] text-[#F4E3B2]'
                       : 'bg-white text-[#421C10] border border-[#421C10]'
                   }`}
                 >
                   {city}
                 </button>
               ))}
             </div>
           </div>
         )}

         {/* Suggestion de ville */}
         {citySuggestion && citySuggestion.suggestedCity !== userData?.city && (
           <div className="mt-4 p-4 bg-blue-50 rounded-lg">
             <p className="text-sm text-blue-800">
               On dirait que vous achetez souvent à {citySuggestion.suggestedCity} 
               ({citySuggestion.confidence}% de vos achats)
             </p>
             <button
               onClick={() => handleCityChange(citySuggestion.suggestedCity)}
               className="mt-2 text-sm text-blue-600 hover:text-blue-800"
             >
               Définir comme ville principale
             </button>
           </div>
         )}

         {/* Statistiques détaillées */}
         <div className="mt-6 flex flex-wrap gap-4">
           <div className="flex items-center">
             <Store className="w-4 h-4 mr-1 text-[#421C10]" />
             <span className="text-sm text-[#421C10]">
               {stats.storeCount} trouvés en magasin
             </span>
           </div>
           <div className="flex items-center">
             <Library className="w-4 h-4 mr-1 text-[#421C10]" />
             <span className="text-sm text-[#421C10]">
               {stats.collectionCount} de collection
             </span>
           </div>
           {stats.storesVisited > 0 && (
             <button
               onClick={() => setIsStoresDialogOpen(true)}
               className="flex items-center text-sm text-[#421C10] hover:bg-[#FAF2E2] px-2 py-1 rounded-lg transition-colors"
             >
               <span>{stats.storesVisited} magasin{stats.storesVisited > 1 ? 's' : ''} visité{stats.storesVisited > 1 ? 's' : ''}</span>
             </button>
           )}
         </div>

         {/* Genres préférés */}
         {topGenres.length > 0 && (
           <div className="mt-6 flex flex-wrap gap-2 items-center">
             <Music className="w-4 h-4 text-[#421C10]" />
             <span className="text-sm text-[#421C10]">Genres préférés :</span>
             {topGenres.map(genre => (
               <span
                 key={genre}
                 className="px-3 py-1 bg-[#FAF2E2] text-[#421C10] rounded-full text-sm"
               >
                 {genre}
               </span>
             ))}
           </div>
         )}

         {/* Tous les genres */}
         {genres.length > 0 && (
           <div className="mt-6 flex flex-wrap gap-2 items-center">
             <Tag className="w-4 h-4 text-[#421C10]" />
             {genres.map(genre => (
               <span
                 key={genre}
                 className="px-3 py-1 bg-[#FAF2E2] text-[#421C10] rounded-full text-sm"
               >
                 {genre}
               </span>
             ))}
           </div>
         )}
       </div>

       {/* Barre de filtres et tri */}
       <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
         {/* Filtres par source */}
         <div className="flex flex-wrap gap-2">
           <button
             onClick={() => setSelectedSource('all')}
             className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
               selectedSource === 'all'
                 ? 'bg-[#421C10] text-[#F4E3B2]'
                 : 'bg-white text-[#421C10]'
             }`}
           >
             <Disc className="w-4 h-4" />
             <span>Tous</span>
           </button>
           <button
             onClick={() => setSelectedSource('STORE')}
             className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
               selectedSource === 'STORE'
                 ? 'bg-[#421C10] text-[#F4E3B2]'
                 : 'bg-white text-[#421C10]'
             }`}
           >
             <Store className="w-4 h-4" />
             <span>Magasins</span>
           </button>
           <button
             onClick={() => setSelectedSource('COLLECTION')}
             className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
               selectedSource === 'COLLECTION'
                 ? 'bg-[#421C10] text-[#F4E3B2]'
                 : 'bg-white text-[#421C10]'
             }`}
           >
             <Library className="w-4 h-4" />
             <span>Collection</span>
           </button>
         </div>

         {/* Sélecteur de tri */}
         <div className="flex items-center space-x-2">
           <ArrowDownAZ className="w-4 h-4 text-[#421C10]" />
           <select
             value={sortBy}
             onChange={(e) => setSortBy(e.target.value)}
             className="bg-white text-[#421C10] rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-[#421C10]"
           >
             <option value="date">Les plus récents</option>
             <option value="artist">Par artiste</option>
             <option value="title">Par titre</option>
           </select>
         </div>
       </div>

       {/* Grille de vinyles */}
       <VinylGrid vinyles={sortedAndFilteredVinyles} selectedSource={selectedSource} />

       {/* Dialog des magasins visités */}
       <StoresVisitedDialog
         stores={uniqueStores}
         vinyles={vinyles}
         isOpen={isStoresDialogOpen}
         onClose={() => setIsStoresDialogOpen(false)}
       />

       {/* Search Modal */}
       <div 
         className={`
           fixed inset-0 z-50
           transition-all duration-300 ease-in-out
           backdrop-blur-sm bg-black/30
           ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
         `}
       >
         <SearchVinylModal 
           isOpen={isModalOpen}
           onClose={() => setIsModalOpen(false)}
           onVinylAdded={() => window.location.reload()}
         />
       </div>
     </div>
   </div>
 )
}