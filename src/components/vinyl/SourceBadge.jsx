// src/components/vinyl/SourceBadge.jsx
import React from 'react';
import { Store, BookMarked, Info } from 'lucide-react';

const SourceBadge = ({ sourceType, store, customSource }) => {
  let icon = <BookMarked className="w-4 h-4" />;
  let label = "Collection";
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-600";

  switch (sourceType) {
    case 'STORE':
      icon = <Store className="w-4 h-4" />;
      label = store ? `${store.name}${store.city ? ` (${store.city})` : ''}` : "Magasin";
      bgColor = "bg-blue-50";
      textColor = "text-blue-600";
      break;
    case 'OTHER':
      icon = <Info className="w-4 h-4" />;
      label = customSource || "Autre";
      bgColor = "bg-purple-50";
      textColor = "text-purple-600";
      break;
    default:
      break;
  }

  return (
    <span 
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      title={store?.name || customSource} 
    >
      {icon}
      {label}
    </span>
  );
};

export default SourceBadge;