// bulk-add-vinyls.js
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuration du chemin pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chargement des variables d'environnement
dotenv.config({ path: join(__dirname, '../.env') });

const prisma = new PrismaClient();

const vinyls = [
    {
      vinyl: {
        title: "Kind of Blue",
        artist: "Miles Davis",
        imageUrl: "https://i.discogs.com/...", // URL de l'image Discogs
        year: 1959,
        genres: "Jazz",
        label: "Columbia",
        discogsId: "3379869"
      },
      comment: "Album jazz classique",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Rumours",
        artist: "Fleetwood Mac",
        imageUrl: "https://i.discogs.com/...",
        year: 1977,
        genres: "Rock",
        label: "Warner Bros. Records",
        discogsId: "344644"
      },
      comment: "En très bon état",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Purple Rain",
        artist: "Prince",
        imageUrl: "https://i.discogs.com/...",
        year: 1984,
        genres: "Funk, Rock, Pop",
        label: "Warner Bros. Records",
        discogsId: "252902"
      },
      comment: "Original pressing",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Thriller",
        artist: "Michael Jackson",
        imageUrl: "https://i.discogs.com/...",
        year: 1982,
        genres: "Pop, Funk, Soul",
        label: "Epic",
        discogsId: "125334"
      },
      comment: "Album mythique",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "The Dark Side of the Moon",
        artist: "Pink Floyd",
        imageUrl: "https://i.discogs.com/...",
        year: 1973,
        genres: "Progressive Rock",
        label: "Harvest",
        discogsId: "1873013"
      },
      comment: "Réédition 180g",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Blue Train",
        artist: "John Coltrane",
        imageUrl: "https://i.discogs.com/...",
        year: 1957,
        genres: "Jazz",
        label: "Blue Note",
        discogsId: "1428379"
      },
      comment: "Pressage japonais",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Abbey Road",
        artist: "The Beatles",
        imageUrl: "https://i.discogs.com/...",
        year: 1969,
        genres: "Rock",
        label: "Apple Records",
        discogsId: "2607424"
      },
      comment: "Première édition UK",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Nevermind",
        artist: "Nirvana",
        imageUrl: "https://i.discogs.com/...",
        year: 1991,
        genres: "Grunge, Alternative Rock",
        label: "DGC",
        discogsId: "1741222"
      },
      comment: "Réédition anniversaire",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "What's Going On",
        artist: "Marvin Gaye",
        imageUrl: "https://i.discogs.com/...",
        year: 1971,
        genres: "Soul, Funk",
        label: "Tamla",
        discogsId: "1872525"
      },
      comment: "État proche du neuf",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Innervisions",
        artist: "Stevie Wonder",
        imageUrl: "https://i.discogs.com/...",
        year: 1973,
        genres: "Soul, Funk",
        label: "Tamla",
        discogsId: "1124946"
      },
      comment: "Pochette un peu usée",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "London Calling",
        artist: "The Clash",
        imageUrl: "https://i.discogs.com/...",
        year: 1979,
        genres: "Punk Rock",
        label: "CBS",
        discogsId: "1813571"
      },
      comment: "Double album complet",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "A Love Supreme",
        artist: "John Coltrane",
        imageUrl: "https://i.discogs.com/...",
        year: 1965,
        genres: "Jazz",
        label: "Impulse!",
        discogsId: "1133259"
      },
      comment: "Chef-d'œuvre du jazz",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Discovery",
        artist: "Daft Punk",
        imageUrl: "https://i.discogs.com/U-Jf5h8F5-qlWqoRtfIhcH-j8nZEWxdYxQFXRqQzmagc/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE1NzE4/LTE2NDg5MjE0ODkt/NTQyMi5qcGVn.jpeg",
        year: 2001,
        genres: "Electronic,House",
        label: "Virgin",
        discogsId: "15718"
      },
      comment: "Incroyable album de house music",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Random Access Memories",
        artist: "Daft Punk",
        imageUrl: "https://i.discogs.com/ZmThm4rj3z_V6QzYE9OZBWRuLX6l_I8-AAQbz3_8Fy8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ1NzAz/NjYtMTM2ODUxOTEy/Ny02NTUzLmpwZWc.jpeg",
        year: 2013,
        genres: "Electronic,Disco,Funk",
        label: "Columbia",
        discogsId: "4570366"
      },
      comment: "Une production impeccable",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "OK Computer",
        artist: "Radiohead",
        imageUrl: "https://i.discogs.com/PBinAjTXWKFkxKqFhHz4DZUx8_Ge7OUBXnB7Kc1-_Yk/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzOTkz/NDQtMTQ4NzE4ODY3/NC05NzU1LmpwZWc.jpeg",
        year: 1997,
        genres: "Alternative Rock,Art Rock",
        label: "Parlophone",
        discogsId: "1399344"
      },
      comment: "Un album visionnaire",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Homework",
        artist: "Daft Punk",
        imageUrl: "https://i.discogs.com/ot-2_HxzVQqLp3tzVSAKP6S9n9DDOJ5e_mw-pl9Qu0M/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEyOTE4/MS0xNjQ4OTIxNDg5/LTY4NzguanBlZw.jpeg",
        year: 1997,
        genres: "Electronic,House",
        label: "Virgin",
        discogsId: "3934"
      },
      comment: "Les débuts légendaires des Daft Punk",
      sourceType: "COLLECTION"
    },
    {
      vinyl: {
        title: "Exile on Main St.",
        artist: "The Rolling Stones",
        imageUrl: "https://i.discogs.com/Qw4nZVXbpRKQWJOKrNYDAGZr9SfuKOEEHHLhGfd_Xtw/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk5OTQy/MS0xNjM4ODEyMDY5/LTc1NzIuanBlZw.jpeg",
        year: 1972,
        genres: "Rock,Blues Rock",
        label: "Rolling Stones Records",
        discogsId: "999421"
      },
      comment: "Du rock'n'roll brut",
      sourceType: "COLLECTION"
    }
    // Ajoutez autant de vinyles que vous voulez...
  ];
  
  async function addVinylsToDB() {
    console.log(`Début de l'ajout de ${vinyls.length} vinyles...`);
    const failures = [];
    const successes = [];
  
    try {
      const user = await prisma.user.findFirst();
      
      if (!user) {
        throw new Error("Aucun utilisateur trouvé dans la base de données");
      }
  
      console.log("Utilisateur trouvé:", user.email);
  
      for (const vinylData of vinyls) {
        try {
          const result = await prisma.vinylPosted.create({
            data: {
              userId: user.id,
              ...vinylData.vinyl,
              comment: vinylData.comment,
              sourceType: vinylData.sourceType,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
  
          successes.push(result);
          console.log(`✅ Ajouté avec succès: ${vinylData.vinyl.title} - ${vinylData.vinyl.artist}`);
          
          await new Promise(resolve => setTimeout(resolve, 100));
  
        } catch (error) {
          console.error(`❌ Échec pour ${vinylData.vinyl.title}:`, error.message);
          failures.push({
            vinyl: vinylData.vinyl.title,
            error: error.message
          });
        }
      }
    } catch (error) {
      console.error("Erreur générale:", error);
    } finally {
      await prisma.$disconnect();
    }
  
    console.log('\n📊 Rapport final:');
    console.log(`Total traité: ${vinyls.length}`);
    console.log(`✅ Succès: ${successes.length}`);
    console.log(`❌ Échecs: ${failures.length}`);
    
    if (failures.length > 0) {
      console.log('\nDétail des échecs:');
      failures.forEach(f => {
        console.log(`- ${f.vinyl}: ${f.error}`);
      });
    }
  }
  
  // Exécuter le script
  addVinylsToDB().catch(console.error);