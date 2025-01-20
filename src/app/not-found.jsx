// app/not-found.jsx
import Link from 'next/link'
import { Disc } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <Disc className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-600 mb-6">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white 
                   hover:bg-purple-700 transition-colors duration-200 rounded-lg
                   text-sm font-medium shadow-sm"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}