'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ProfileButton() {
  const { data: session } = useSession()

  return (
    <Link 
      href={session ? "/profile" : "/auth"}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      {session ? "Mon Profil" : "Se connecter"}
    </Link>
  )
}