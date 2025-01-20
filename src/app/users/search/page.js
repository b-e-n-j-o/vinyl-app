// src/app/users/search/page.js
import { Suspense } from 'react';
import { UserDiscoverySearch } from '@/components/users/UserDiscoverySearch';

export const metadata = {
  title: 'Rechercher des utilisateurs | Vinyl App',
  description: 'Trouvez des collectionneurs de vinyles près de chez vous',
};

export default function SearchPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Découvrir des collectionneurs</h1>
        <p className="text-gray-600 mb-8">
          Trouvez des passionnés de vinyles par pseudo, genre musical, ou ville
        </p>
        
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        }>
          <UserDiscoverySearch />
        </Suspense>
      </div>
    </main>
  );
}