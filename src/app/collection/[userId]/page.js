// app/collection/[userId]/page.js
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/auth"
import prisma from "../../../../src/lib/prisma"
import Navbar from "../../../components/Navbar"
import { notFound } from "next/navigation"
import CollectionContent from "./CollectionContent"

export default async function CollectionPage(props) {
  try {
    // On attend que les params soient disponibles
    const { userId } = await props.params
    
    // On attend la session
    const session = await getServerSession(authOptions)

    // Récupération de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { 
        id: String(userId)
      }
    })

    // Si l'utilisateur n'existe pas
    if (!user) {
      notFound()
    }

    // Récupération des vinyles
    const vinyles = await prisma.vinylPost.findMany({
      where: {
        userId: String(userId)
      },
      include: {
        _count: {
          select: {
            shares: true
          }
        },
        shares: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return (
      <>
        <Navbar />
        <CollectionContent 
          collectionOwner={user}
          vinyles={vinyles}
          visitorSession={session}
        />
      </>
    )
  } catch (error) {
    console.error("Erreur dans CollectionPage:", error)
    throw error
  }
}