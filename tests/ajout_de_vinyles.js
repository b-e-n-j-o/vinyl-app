// scripts/seedVinyls.js
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config() 

const prisma = new PrismaClient()

const DISCOGS_TOKEN = process.env.NEXT_PUBLIC_DISCOGS_TOKEN
const USER_ID = 'cm4nf2x3b00003qyur6zxbv0r' // L'ID de l'utilisateur qui va partager

// Liste des vinyles à ajouter (vous pouvez la modifier)
const vinylsToAdd = [
  // Rock Classique
  "Pink Floyd - Dark Side of the Moon",
  "The Beatles - Abbey Road",
  "Led Zeppelin - IV",
  "Fleetwood Mac - Rumours",
  "Queen - A Night at the Opera",
  "The Rolling Stones - Exile on Main St.",
  "David Bowie - The Rise and Fall of Ziggy Stardust",
  "The Doors - Morrison Hotel",
  "Eagles - Hotel California",
  "Bruce Springsteen - Born to Run",

  // Jazz
  "Miles Davis - Kind of Blue",
  "John Coltrane - A Love Supreme",
  "Dave Brubeck - Time Out",
  "Charles Mingus - Mingus Ah Um",
  "Herbie Hancock - Head Hunters",

  // Soul/Funk/Disco
  "Marvin Gaye - What's Going On",
  "Michael Jackson - Thriller",
  "Prince - Purple Rain",
  "Stevie Wonder - Songs in the Key of Life",
  "Earth Wind & Fire - That's the Way of the World",

  // Hip-Hop/Rap
  "Kendrick Lamar - To Pimp a Butterfly",
  "Nas - Illmatic",
  "Dr. Dre - The Chronic",
  "A Tribe Called Quest - The Low End Theory",
  "Wu-Tang Clan - Enter the Wu-Tang (36 Chambers)",

  // Électronique/Dance
  "Daft Punk - Random Access Memories",
  "Kraftwerk - Trans Europe Express",
  "The Chemical Brothers - Dig Your Own Hole",
  "Massive Attack - Blue Lines",
  "Aphex Twin - Selected Ambient Works 85-92",

  // Pop Moderne
  "Adele - 21",
  "Lana Del Rey - Born to Die",
  "Arctic Monkeys - AM",
  "Tame Impala - Currents",
  "The Weeknd - After Hours",

  // Alternative/Indie
  "Radiohead - OK Computer",
  "The Strokes - Is This It",
  "Arcade Fire - Funeral",
  "The White Stripes - Elephant",
  "LCD Soundsystem - Sound of Silver",

  // Metal
  "Metallica - Master of Puppets",
  "Black Sabbath - Paranoid",
  "Iron Maiden - The Number of the Beast",
  "Tool - Lateralus",
  "System of a Down - Toxicity",

  // Musique Française
  "Daft Punk - Discovery",
  "Air - Moon Safari",
  "Justice - Cross",
  "Phoenix - Wolfgang Amadeus Phoenix",
  "M83 - Hurry Up, We're Dreaming"
]

// Fonction pour rechercher un vinyle sur Discogs
async function searchVinylOnDiscogs(title) {
  console.log(`🔍 Recherche du vinyle: ${title}`)
  try {
    const response = await axios.get(`https://api.discogs.com/database/search`, {
      params: {
        q: title,
        type: 'release',
        format: 'vinyl',
        token: DISCOGS_TOKEN
      },
      headers: {
        'User-Agent': 'VinylShareApp/1.0'
      }
    })

    if (response.data.results.length === 0) {
      console.log(`Aucun résultat pour: ${title}`)
      return null
    }

    // Récupérer les détails du premier résultat
    const details = await axios.get(`https://api.discogs.com/releases/${response.data.results[0].id}`, {
      headers: {
        'User-Agent': 'VinylShareApp/1.0',
        'Authorization': `Discogs token=${DISCOGS_TOKEN}`
      }
    })

    console.log(`✅ Détails récupérés pour: ${title}`)
    return details.data
  } catch (error) {
    console.error(`Erreur lors de la recherche de ${title}:`, error.message)
    return null
  }
}

// Fonction pour ajouter un vinyle et le partager
async function addAndShareVinyl(vinylData) {
  console.log(`➕ Ajout du vinyle: ${vinylData.title}`)
  try {
    // 1. Créer le VinylPost
    const vinylPost = await prisma.vinylPost.create({
      data: {
        title: vinylData.title,
        artist: vinylData.artists.map(a => a.name).join(', '),
        imageUrl: vinylData.images?.[0]?.uri,
        year: parseInt(vinylData.year),
        genres: vinylData.genres.join(', '),
        label: vinylData.labels?.[0]?.name,
        discogsId: vinylData.id.toString(),
        userId: USER_ID
      }
    })

    console.log(`✅ Vinyle ajouté: ${vinylPost.title}`)

    // 2. Créer le VinylShare
    const share = await prisma.vinylShare.create({
      data: {
        comment: `Je viens d'ajouter ${vinylPost.title} à ma collection !`,
        vinylId: vinylPost.id,
        userId: USER_ID
      }
    })

    console.log(`📢 Vinyle partagé: ${vinylPost.title}`)
    return { vinylPost, share }

  } catch (error) {
    console.error(`Erreur lors de l'ajout de ${vinylData.title}:`, error)
    return null
  }
}

// Fonction principale
async function seedVinyls() {
  console.log('🚀 Début du seeding...')

  for (const vinylTitle of vinylsToAdd) {
    console.log(`\n📀 Traitement de: ${vinylTitle}`)
    const vinylData = await searchVinylOnDiscogs(vinylTitle)
    
    if (vinylData) {
      await addAndShareVinyl(vinylData)
      // Attendre 3 secondes entre chaque requête pour respecter les limites de l'API
      console.log(`⏳ Attente de 3 secondes avant la prochaine requête...`)
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  console.log('\n✨ Seeding terminé !')
}

// Exécution
seedVinyls()
  .catch(console.error)
  .finally(async () => {
    console.log('🔌 Déconnexion de Prisma...')
    await prisma.$disconnect()
    console.log('✅ Déconnecté de Prisma')
  })