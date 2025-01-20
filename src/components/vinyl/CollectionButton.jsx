// src/components/vinyl/CollectionButton.jsx
'use client'
import { Disc } from 'lucide-react'

export default function CollectionButton({ 
  isCheckingCollection, 
  isInCollection, 
  isAdding, 
  onAddToCollection,
  disabled
}) {
  if (isCheckingCollection) {
    return (
      <div className="w-full flex justify-center py-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#421C10]"></div>
      </div>
    )
  }

  if (isInCollection || disabled) {
    return (
      <button 
        disabled
        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg cursor-not-allowed"
      >
        <Disc className="w-4 h-4 mr-2" />
        Dans ma collection
      </button>
    )
  }

  return (
    <button 
      onClick={() => {
        if (!isInCollection && !disabled) {
          onAddToCollection()
        }
      }}
      disabled={isAdding || disabled}
      className="w-full flex items-center justify-center px-4 py-2 bg-[#421C10] text-white rounded-lg hover:bg-[#2a1208] transition-colors disabled:opacity-50"
    >
      {isAdding ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        <>
          <Disc className="w-4 h-4 mr-2" />
          Ajouter à ma collection
        </>
      )}
    </button>
  )
}