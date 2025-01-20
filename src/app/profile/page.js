// app/profile/page.js
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/auth"
import prisma from '@/lib/prisma'
import ProfileContent from "./ProfileContent"
import Navbar from "../../components/Navbar"
import { redirect } from "next/navigation"
import { getMostFrequentGenres } from "../../lib/utils/user-preferences"
import { analyzePurchaseHistory } from "../../lib/utils/city-suggestions"

// Composant d'erreur séparé
function ErrorDisplay() {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-sm text-red-700">
          Une erreur est survenue lors du chargement de votre profil.
        </p>
      </div>
    </div>
  )
}

// Composant de chargement séparé
function LoadingDisplay() {
  return (
    <div className="container mx-auto p-4">
      <p>Chargement...</p>
    </div>
  )
}

// Fonction pour normaliser les vinyles
function normalizeVinyles(vinyles) {
  return vinyles.map(vinyl => ({
    ...vinyl,
    StoreVinyl: (vinyl.StoreVinyl || []).map(store => ({
      ...store,
      RecordStore: {
        ...store.RecordStore,
        city: store.RecordStore?.city || "Non précisée",
        name: store.RecordStore?.name || "Non précisé"
      }
    }))
  }))
}

export default async function ProfilePage() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      redirect("/auth/signin")
    }

    // Récupération des VinylPosted avec leurs relations
    const vinyles = await prisma.vinylPosted.findMany({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        store: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Adaptation de la normalisation pour VinylPosted
    const normalizedVinyles = vinyles.map(vinyl => ({
      ...vinyl,
      // Conversion des données pour maintenir la compatibilité
      StoreVinyl: vinyl.store ? [{
        RecordStore: {
          name: vinyl.store.name,
          city: vinyl.store.city || "Non précisée"
        }
      }] : []
    }))

    // Analyse des genres préférés (pas besoin de modification si la structure des genres est la même)
    const topGenres = getMostFrequentGenres(normalizedVinyles)
    
    // Analyse des suggestions de ville basée sur les stores
    const cityAnalysis = analyzePurchaseHistory(normalizedVinyles)

    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        city: true,
        musicGenres: true
      }
    })

    // Mise à jour des genres musicaux si nécessaire
    if (topGenres.length > 0 && (!userData.musicGenres || userData.musicGenres === '')) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { musicGenres: topGenres.join(',') }
      })
      userData.musicGenres = topGenres.join(',')
    }

    const citySuggestion = cityAnalysis ? {
      suggestedCity: cityAnalysis.suggestedCity,
      confidence: cityAnalysis.confidence,
      totalPurchases: normalizedVinyles.length,
      cityStats: cityAnalysis.stats || {}
    } : null

    return (
      <>
        <Navbar />
        <ProfileContent 
          session={session}
          vinyles={normalizedVinyles}
          userData={{
            ...userData,
            musicGenres: userData.musicGenres ? userData.musicGenres.split(',') : []
          }}
          citySuggestion={citySuggestion}
          topGenres={topGenres}
        />
      </>
    )

  } catch (error) {
    console.error("Error:", error.stack)
    return (
      <>
        <Navbar />
        <ErrorDisplay />
      </>
    )
  }
}