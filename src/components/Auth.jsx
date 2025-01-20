// src/components/Auth.tsx (ou .jsx)
'use client'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Auth() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <img
          src={session.user?.image ?? '/default-avatar.png'}
          alt={session.user?.name ?? 'Avatar'}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm text-gray-700">{session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('google')} // Changé de 'github' à 'google'
      className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
    >
      Se connecter
    </button>
  )
}