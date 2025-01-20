// src/lib/utils/user-preferences.js
/**
 * Calcule les genres les plus fréquents dans la collection d'un utilisateur
 * @param {Array} vinyls - Liste des vinyles de la collection
 * @param {number} limit - Nombre de genres à retourner
 * @returns {Array} Les genres les plus fréquents
 */
export function getMostFrequentGenres(vinyls, limit = 3) {
    // Créer un compteur pour chaque genre
    const genreCounts = vinyls.reduce((counts, vinyl) => {
      // Comme les genres sont stockés en string, on les divise
      const genres = vinyl.genres.split(',').map(g => g.trim());
      
      genres.forEach(genre => {
        counts[genre] = (counts[genre] || 0) + 1;
      });
      
      return counts;
    }, {});
  
    // Convertir en array et trier par fréquence
    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a) // Trier par compte décroissant
      .slice(0, limit) // Prendre les N premiers
      .map(([genre]) => genre); // Ne garder que les noms des genres
  }
  
  /**
   * Met à jour les genres préférés d'un utilisateur dans la base de données
   * @param {string} userId - ID de l'utilisateur
   * @param {Array} vinyls - Collection de vinyles
   */
// src/lib/utils/user-preferences.js
export async function updateUserPreferredGenres(prisma, userId, vinyls) {
  const preferredGenres = getMostFrequentGenres(vinyls);
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      musicGenres: preferredGenres.join(',')  // Joindre les genres avec des virgules
    }
  });
  
  return preferredGenres;
}

// Ajoutons une fonction utilitaire pour convertir la chaîne en tableau
export function parseUserGenres(musicGenres) {
  if (!musicGenres) return [];
  return musicGenres.split(',').map(genre => genre.trim());
}