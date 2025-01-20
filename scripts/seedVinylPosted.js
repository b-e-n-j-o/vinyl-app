import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const storeIds = [
  'cm50aiy6t00043qikszqhtley',
  'cm50aiy80000f3qikmgsdfscc', 
  'cm513hh7u00003q06hg4fpbv4',
  'cm513hh8z00093q060dck9vpt'
]

const albums = [
  {
    title: "Kind Of Blue",
    artist: "Miles Davis",
    year: 1959,
    genres: "Jazz",
    label: "Columbia",
    discogsId: "1186536",
    imageUrl: "https://i.discogs.com/BFxuJmUoGZQQSViWzuF5mZWFr6vGDM9h9R_mHAKYwpA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExODY1/MzY4LTE1MjQxNjY0/NjMtNzQ4OC5qcGVn.jpeg",
    comment: "Un album qui m'a fait découvrir le jazz",
    storeId: storeIds[0]
  },
  {
    title: "Discovery",
    artist: "Daft Punk",
    year: 2001,
    genres: "Electronic,House",
    label: "Virgin",
    discogsId: "15718",
    imageUrl: "https://i.discogs.com/U-Jf5h8F5-qlWqoRtfIhcH-j8nZEWxdYxQFXRqQzmagc/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE1NzE4/LTE2NDg5MjE0ODkt/NTQyMi5qcGVn.jpeg",
    comment: "Incroyable album de house music",
    storeId: storeIds[1]
  },
  {
    title: "Dark Side of the Moon",
    artist: "Pink Floyd",
    year: 1973,
    genres: "Progressive Rock,Psychedelic Rock",
    label: "Harvest",
    discogsId: "1873013",
    imageUrl: "https://i.discogs.com/AN6VvZHCQqGHxqDylXAA_sWpJZDxqRwGh1HpxEZWwbE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE4NzMw/MTMtMTQ3NzQyMzgz/NC01OTY2LmpwZWc.jpeg",
    comment: "Le meilleur album de Pink Floyd selon moi",
    storeId: storeIds[2]
  },
  {
    title: "Nevermind",
    artist: "Nirvana", 
    year: 1991,
    genres: "Grunge,Alternative Rock",
    label: "DGC",
    discogsId: "1834",
    imageUrl: "https://i.discogs.com/Q3Uxd9JDPe8m1VR_K0mh8VHI1CaO1S0v3AkqUtxPR-Y/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM2NzY4/NC0xNjIwNDk4MzI5/LTU0NTIuanBlZw.jpeg",
    comment: "Un classique du rock alternatif",
    storeId: storeIds[3]
  },
  {
    title: "Thriller",
    artist: "Michael Jackson",
    year: 1982,
    genres: "Pop,Funk,Soul",
    label: "Epic",
    discogsId: "145736",
    imageUrl: "https://i.discogs.com/yw5lBv4NrD_5PvJ_F2Ovl8MQgrESNhK8CAVeGwqvLlE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE0NzE4/NjktMTQ4NDc1OTY4/Mi05NzU1LmpwZWc.jpeg",
    comment: "Des tubes indémodables",
    storeId: storeIds[0]
  },
  {
    title: "Abbey Road",
    artist: "The Beatles",
    year: 1969,
    genres: "Rock,Pop Rock",
    label: "Apple Records",
    discogsId: "2607424",
    imageUrl: "https://i.discogs.com/k8OyZBPM5E7XYVn2KoQZGBfm-F0P5yHGjNLRcQ8PB_k/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI2MDc0/MjQtMTY0NDQxMDY3/OS03NzQzLmpwZWc.jpeg",
    comment: "Le chant du cygne des Beatles",
    storeId: storeIds[1]
  },
  {
    title: "Random Access Memories",
    artist: "Daft Punk",
    year: 2013,
    genres: "Electronic,Disco,Funk",
    label: "Columbia",
    discogsId: "4570366",
    imageUrl: "https://i.discogs.com/ZmThm4rj3z_V6QzYE9OZBWRuLX6l_I8-AAQbz3_8Fy8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ1NzAz/NjYtMTM2ODUxOTEy/Ny02NTUzLmpwZWc.jpeg",
    comment: "Une production impeccable",
    storeId: storeIds[2]
  },
  {
    title: "Rumours",
    artist: "Fleetwood Mac",
    year: 1977,
    genres: "Rock,Pop Rock",
    label: "Warner Bros. Records",
    discogsId: "344644",
    imageUrl: "https://i.discogs.com/w0iKV1yK8uGQ0iJV1xqa_nsrgOgVJzqQBWJ0EJq0N0E/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM0NDY0/NC0xNjE4NzU5Mzgy/LTY0NjguanBlZw.jpeg",
    comment: "Des mélodies inoubliables",
    storeId: storeIds[3]
  },
  {
    title: "Purple Rain",
    artist: "Prince",
    year: 1984,
    genres: "Funk,Rock,Pop",
    label: "Warner Bros. Records",
    discogsId: "410850",
    imageUrl: "https://i.discogs.com/YV1PxF-D_f1h_HuvMYJ_OVnwWGQ2k8zyLNbGqHUJN9Y/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ5ODY2/MS0xNjMwNjA0NzQx/LTc1NzIuanBlZw.jpeg",
    comment: "Le génie de Prince à son apogée",
    storeId: storeIds[0]
  },
  {
    title: "OK Computer",
    artist: "Radiohead",
    year: 1997,
    genres: "Alternative Rock,Art Rock",
    label: "Parlophone",
    discogsId: "1399344",
    imageUrl: "https://i.discogs.com/PBinAjTXWKFkxKqFhHz4DZUx8_Ge7OUBXnB7Kc1-_Yk/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzOTkz/NDQtMTQ4NzE4ODY3/NC05NzU1LmpwZWc.jpeg",
    comment: "Un album visionnaire",
    storeId: storeIds[1]
  },
  {
    title: "Blue Train",
    artist: "John Coltrane",
    year: 1958,
    genres: "Jazz,Hard Bop",
    label: "Blue Note",
    discogsId: "1545557",
    imageUrl: "https://i.discogs.com/Ar-ZtfKAYMVGn1Y8K7dCO4QNgqB8n8QQJj9qu7oFiZo/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE1NDU1/NTctMTQwODk3NjAw/OS01NzU5LmpwZWc.jpeg",
    comment: "Du jazz pur et dur",
    storeId: storeIds[2]
  },
  {
    title: "Innervisions",
    artist: "Stevie Wonder",
    year: 1973,
    genres: "Soul,Funk",
    label: "Tamla",
    discogsId: "719849",
    imageUrl: "https://i.discogs.com/yw5lBv4NrD_5PvJ_F2Ovl8MQgrESNhK8CAVeGwqvLlE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE0NzE4/NjktMTQ4NDc1OTY4/Mi05NzU1LmpwZWc.jpeg",
    comment: "La soul dans toute sa splendeur",
    storeId: storeIds[3]
  },
  {
    title: "Homework",
    artist: "Daft Punk",
    year: 1997,
    genres: "Electronic,House",
    label: "Virgin",
    discogsId: "3934",
    imageUrl: "https://i.discogs.com/ot-2_HxzVQqLp3tzVSAKP6S9n9DDOJ5e_mw-pl9Qu0M/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEyOTE4/MS0xNjQ4OTIxNDg5/LTY4NzguanBlZw.jpeg",
    comment: "Les débuts légendaires des Daft Punk",
    storeId: storeIds[0]
  },
  {
    title: "Exile on Main St.",
    artist: "The Rolling Stones",
    year: 1972,
    genres: "Rock,Blues Rock",
    label: "Rolling Stones Records",
    discogsId: "999421",
    imageUrl: "https://i.discogs.com/Qw4nZVXbpRKQWJOKrNYDAGZr9SfuKOEEHHLhGfd_Xtw/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk5OTQy/MS0xNjM4ODEyMDY5/LTc1NzIuanBlZw.jpeg",
    comment: "Du rock'n'roll brut",
    storeId: storeIds[1]
  },
  {
    title: "Remain in Light",
    artist: "Talking Heads",
    year: 1980,
    genres: "New Wave,Art Rock,Funk",
    label: "Sire",
    discogsId: "98852",
    imageUrl: "https://i.discogs.com/Ew0qUNCL8l_qwPHIy7u7ysXYZGNKqsZVQXADLhIKKSE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI5MzY4/MS0xNDk1OTk5NDY5/LTU0ODQuanBlZw.jpeg",
    comment: "Une expérience sonore unique",
    storeId: storeIds[2]
  },
  {
    title: "Illmatic",
    artist: "Nas",
    year: 1994,
    genres: "Hip Hop",
    label: "Columbia",
    discogsId: "240001",
    imageUrl: "https://i.discogs.com/YV1PxF-D_f1h_HuvMYJ_OVnwWGQ2k8zyLNbGqHUJN9Y/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ5ODY2/MS0xNjMwNjA0NzQx/LTc1NzIuanBlZw.jpeg",
    comment: "Le hip-hop dans son essence pure",
    storeId: storeIds[3]
  },
  {
    title: "Harvest",
    artist: "Neil Young",
    year: 1972,
    genres: "Folk Rock,Country Rock",
    label: "Reprise Records",
    discogsId: "371315",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "La folk dans toute sa beauté",
    storeId: storeIds[0]
  },
  {
    title: "Oxygène",
    artist: "Jean-Michel Jarre",
    year: 1976,
    genres: "Electronic,Ambient",
    label: "Les Disques Motors",
    discogsId: "75842",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "Un voyage électronique fascinant",
    storeId: storeIds[1]
  },
  {
    title: "Dummy",
    artist: "Portishead",
    year: 1994,
    genres: "Trip Hop,Electronic",
    label: "Go! Beat",
    discogsId: "5733",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "Une ambiance sombre et envoûtante",
    storeId: storeIds[2]
  },
  {
    title: "Horses",
    artist: "Patti Smith",
    year: 1975,
    genres: "Art Rock,Punk",
    label: "Arista",
    discogsId: "371762",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "La poésie rencontre le punk",
    storeId: storeIds[3]
  },
  {
    title: "Violator",
    artist: "Depeche Mode",
    year: 1990,
    genres: "Electronic,Synth-pop",
    label: "Mute",
    discogsId: "5833",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "La synth-pop à son meilleur",
    storeId: storeIds[0]
  },
  {
    title: "Vespertine",
    artist: "Björk",
    year: 2001,
    genres: "Electronic,Art Pop",
    label: "One Little Indian",
    discogsId: "5773",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "Un chef-d'œuvre expérimental",
    storeId: storeIds[1]
  },
  {
    title: "Endtroducing.....",
    artist: "DJ Shadow",
    year: 1996,
    genres: "Electronic,Hip Hop",
    label: "Mo Wax",
    discogsId: "4703",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "L'art du sampling poussé à l'extrême",
    storeId: storeIds[2]
  },
  {
    title: "Marquee Moon",
    artist: "Television",
    year: 1977,
    genres: "Art Rock,Post-Punk",
    label: "Elektra",
    discogsId: "371774",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "Des guitares qui racontent des histoires",
    storeId: storeIds[3]
  },
  {
    title: "Bitches Brew",
    artist: "Miles Davis",
    year: 1970,
    genres: "Jazz Fusion,Jazz-Rock",
    label: "Columbia",
    discogsId: "371774",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "Une révolution dans le jazz",
    storeId: storeIds[0]
  },
  {
    title: "Loveless",
    artist: "My Bloody Valentine",
    year: 1991,
    genres: "Shoegaze,Alternative Rock",
    label: "Creation",
    discogsId: "371774",
    imageUrl: "https://i.discogs.com/CtKKwb9b8hMH8_iY5SsP8mfqLhPpB2bIo4Ys0cEqHQE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUyODY4/ODktMTM4OTU0NTcy/NC03NzU5LmpwZWc.jpeg",
    comment: "Un mur de son magnifique",
    storeId: storeIds[1]
  }
]

async function seedVinylPosted() {
  try {
    console.log('🌱 Début de la génération des VinylPosted...')

    // Récupérer un utilisateur existant (ou créer un nouveau si nécessaire)
    let user = await prisma.user.findFirst()
    if (!user) {
      console.log('⚠️ Aucun utilisateur trouvé, création d\'un utilisateur test...')
      user = await prisma.user.create({
        data: {
          email: "test@example.com",
          name: "Test User"
        }
      })
    }

    // Créer les VinylPosted
    for (const album of albums) {
      try {
        await prisma.vinylPosted.create({
          data: {
            ...album,
            userId: user.id,
            sourceType: "STORE",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        console.log(`✅ Créé: ${album.title} par ${album.artist}`)
      } catch (error) {
        console.error(`❌ Erreur lors de la création de ${album.title}:`, error)
      }
    }

    console.log('✨ Génération terminée avec succès!')
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedVinylPosted()