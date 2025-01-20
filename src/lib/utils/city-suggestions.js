// src/lib/utils/city-suggestions.js

/**
 * Analyse les achats pour suggérer une ville principale
 */
export function analyzePurchaseHistory(vinylPosts) {
    // Compter les achats par ville
    const cityCounts = vinylPosts.reduce((counts, post) => {
      if (post.store?.city) {
        counts[post.store.city] = (counts[post.store.city] || 0) + 1;
      }
      return counts;
    }, {});
  
    // Ne garder que les villes valides
    const validCities = ['Paris', 'Bruxelles', 'Montréal'];
    const validCityCounts = Object.entries(cityCounts)
      .filter(([city]) => validCities.includes(city));
  
    // Calculer les pourcentages
    const total = validCityCounts.reduce((sum, [, count]) => sum + count, 0);
    
    if (total === 0) return null;
  
    const cityStats = validCityCounts.map(([city, count]) => ({
      city,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  
    // Trier par nombre d'achats
    cityStats.sort((a, b) => b.count - a.count);
  
    // Retourner la ville principale si elle représente au moins 40% des achats
    if (cityStats[0]?.percentage >= 40) {
      return {
        suggestedCity: cityStats[0].city,
        confidence: cityStats[0].percentage,
        stats: cityStats
      };
    }
  
    return null;
  }