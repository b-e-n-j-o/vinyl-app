// GenreFilter.js
import React, { useEffect, useState } from 'react'
import styles from '../styles/GenreFilter.module.css'

// Configuration des genres disponibles
const AVAILABLE_GENRES = [
  { id: 'all', label: 'Tous les genres' },
  { id: 'rock', label: 'Rock' },
  { id: 'house', label: 'House' },
  { id: 'pop', label: 'Pop' }
]

const GenreFilter = ({ 
  initialGenre = 'all', 
  onGenreChange, 
  isLoading,
  className = '' 
}) => {
  const [selectedGenre, setSelectedGenre] = useState(initialGenre)
  const [isChangingGenre, setIsChangingGenre] = useState(false)

  // Effet pour animation du select au chargement
  useEffect(() => {
    const select = document.querySelector(`.${styles.genreFilter} select`)
    if (select) {
      select.style.opacity = '0'
      setTimeout(() => {
        select.style.opacity = '1'
        select.style.transform = 'translateY(0)'
      }, 300)
    }
  }, [])

  // Gestionnaire de changement avec feedback visuel
  const handleChange = async (e) => {
    const newGenre = e.target.value
    if (newGenre === selectedGenre) return

    const select = e.target
    select.classList.add(styles.changing)
    
    setIsChangingGenre(true)
    setSelectedGenre(newGenre)
    
    try {
      // Appeler le callback parent
      if (onGenreChange) {
        await onGenreChange(newGenre)
      }
    } finally {
      setIsChangingGenre(false)
      // Retirer la classe d'animation après un délai
      setTimeout(() => {
        select.classList.remove(styles.changing)
      }, 300)
    }
  }

  return (
    <div className={`${styles.genreFilter} ${className}`}>
      <select 
        value={selectedGenre}
        onChange={handleChange}
        disabled={isLoading}
        className={`
          px-4 py-2 rounded-lg
          bg-white/90 backdrop-blur-sm
          border border-gray-300
          shadow-sm
          text-gray-700 font-medium
          transition-all duration-200
          transform translate-y-4
          hover:border-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isLoading ? styles.loading : ''}
        `}
      >
        {AVAILABLE_GENRES.map(genre => (
          <option 
            key={genre.id} 
            value={genre.id}
            className="py-1"
          >
            {genre.label}
          </option>
        ))}
      </select>
      
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </div>
  )
}

export default GenreFilter