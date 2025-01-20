// app/store/[id]/page.js
import StorePageClient from './StorePageClient';
import { notFound } from 'next/navigation';

export default async function StorePage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const storeId = resolvedParams.id;
  
  if (!storeId) {
    notFound();
  }
  
  return <StorePageClient storeId={storeId} />;
}