import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import Link from 'next/link'
import styles from '../styles/VinylFeed.module.css'

gsap.registerPlugin(CustomEase)

// Configuration optimisée du chargement progressif
const ITEMS_PER_PAGE = 15        // Chargement par lots de 15
const INITIAL_DISPLAY = 5        // Affichage des 5 premiers
const PRELOAD_THRESHOLD = 5      // Déclencher chargement quand il reste 5 éléments
const CACHE_LIMIT = 50          // Limite du cache pour gérer la mémoire
const SCROLL_THRESHOLD = 500     // Délai minimum entre les scrolls

const logMemoryUsage = (action) => {
  if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
    const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
    const total = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
    console.log(`💾 [${action}] Mémoire: ${used}MB / ${total}MB`)
  }
}

const VinylFeed = () => {
  const [allVinyls, setAllVinyls] = useState([])
  const [displayedVinyls, setDisplayedVinyls] = useState([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)  // Uniquement pour le premier chargement
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false)  // Pour les chargements suivants
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [nextIndex, setNextIndex] = useState(INITIAL_DISPLAY)
  const sliderRef = useRef(null)
  const [previousVinyls, setPreviousVinyls] = useState([])  // Pour stocker l'historique
  const [canGoBack, setCanGoBack] = useState(false)        // Pour gérer l'état du scroll arrière
  const isLoadingRef = useRef(false)

  // Utilitaire de monitoring mémoire
  const getMemoryStats = () => {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      const memory = window.performance.memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        percent: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
      }
    }
    return null
  }

  // Logger d'état amélioré
  const logStatus = (action) => {
    const memStats = getMemoryStats()
    console.group(`🔍 ${action}`)
    console.log(`📦 Cache: ${allVinyls.length} vinyles`)
    console.log(`🎯 Affichés: ${displayedVinyls.length} vinyles`)
    console.log(`📍 Prochain index: ${nextIndex}`)
    console.log(`📄 Page courante: ${currentPage}`)
    if (memStats) {
      console.log(`💾 Mémoire: ${memStats.used}MB / ${memStats.total}MB (${memStats.percent}%)`)
    }
    console.groupEnd()
  }

  // Chargement d'une page de vinyles
  const fetchVinylsPage = async (page) => {
    logMemoryUsage(`Début chargement page ${page}`)
    console.group(`🔄 Chargement page ${page}`)
    try {
      const response = await fetch(`/api/feed?page=${page}&limit=${ITEMS_PER_PAGE}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur de chargement')
      }
      
      const data = await response.json()
      
      // Vérification de la structure des données
      if (!data || !data.items || !Array.isArray(data.items)) {
        throw new Error('Format de données invalide')
      }
      
      return {
        items: data.items,
        hasMore: data.pagination?.hasMore ?? false
      }
    } catch (error) {
      console.error('❌ Erreur:', error instanceof Error ? error.message : 'Erreur inconnue')
      // Retourner un objet structuré même en cas d'erreur
      return {
        items: [],
        hasMore: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    } finally {
      console.groupEnd()
      logMemoryUsage(`Fin chargement page ${page}`)
    }
  }

  // Effet pour le chargement initial uniquement
  useEffect(() => {
    const initializeVinyls = async () => {
      try {
        const { items, hasMore } = await fetchVinylsPage(1)
        
        if (items && items.length > 0) {
          setAllVinyls(items)
          setHasMore(hasMore)
          setDisplayedVinyls(items.slice(0, INITIAL_DISPLAY).reverse())
          logStatus('Initialisation terminée')
        }
      } catch (error) {
        console.error('❌ Erreur d\'initialisation:', error)
      } finally {
        setIsInitialLoading(false)
      }
    }
    
    initializeVinyls()
  }, [])

  // 1. Modifier la fonction de chargement en arrière-plan
  const loadNextPageInBackground = useCallback(async () => {
    // Vérifier si une requête est déjà en cours
    if (isLoadingRef.current || !hasMore || isBackgroundLoading) return
    
    isLoadingRef.current = true
    setIsBackgroundLoading(true)
    
    try {
      const { items, hasMore: moreItems } = await fetchVinylsPage(currentPage + 1)
      
      if (items.length > 0) {
        setAllVinyls(prev => {
          const updatedCache = [...prev, ...items]
          return updatedCache.length > CACHE_LIMIT 
            ? updatedCache.slice(-CACHE_LIMIT) 
            : updatedCache
        })
        setHasMore(moreItems)
        setCurrentPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Erreur de chargement en arrière-plan:', error)
    } finally {
      setIsBackgroundLoading(false)
      // Attendre un peu avant de permettre une nouvelle requête
      setTimeout(() => {
        isLoadingRef.current = false
      }, 2000)
    }
  }, [currentPage, hasMore])

  // 3. Modifier l'effet de vérification du chargement
  useEffect(() => {
    let timeoutId

    const checkAndLoad = () => {
      if (isLoadingRef.current) return
      
      const remainingItems = allVinyls.length - nextIndex
      if (remainingItems <= PRELOAD_THRESHOLD && hasMore && !isBackgroundLoading) {
        timeoutId = setTimeout(loadNextPageInBackground, 2000)
      }
    }

    checkAndLoad()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [nextIndex, hasMore, allVinyls.length])

  // Gestion du texte et des animations
  useEffect(() => {
    if (!isInitialLoading && displayedVinyls.length > 0) {
      CustomEase.create("cubic", "0.83, 0, 0.17, 1")

      const titleElements = document.querySelectorAll(`.${styles.copy} h1`)
      const artistElements = document.querySelectorAll(`.${styles.copy} h2`)

      const handleTextSizing = (element, isTitle) => {
        if (!element) return
        const text = element.innerText
        
        if (!element.querySelector('span')) {
          if (isTitle && text.length > 15) {
            const midPoint = Math.ceil(text.length / 2)
            const lastSpaceBeforeMid = text.lastIndexOf(' ', midPoint)
            const splitPoint = lastSpaceBeforeMid > 0 ? lastSpaceBeforeMid : midPoint
            
            const firstLine = text.substring(0, splitPoint)
            const secondLine = text.substring(splitPoint).trim()
            
            const splitText = (firstLine + '\n' + secondLine).split('').map(char => 
              `<span>${char === ' ' ? '\u00A0\u00A0' : char === '\n' ? '<br/>' : char}</span>`
            ).join('')
            element.innerHTML = splitText
          } else {
            const splitText = text.split('').map(char => 
              `<span>${char === ' ' ? '\u00A0\u00A0' : char}</span>`
            ).join('')
            element.innerHTML = splitText
          }
        }

        if (isTitle) {
          element.style.fontSize = '3vw'
        } else {
          element.style.fontSize = '3.5vw'
        }
      }

      titleElements.forEach(element => handleTextSizing(element, true))
      artistElements.forEach(element => handleTextSizing(element, false))

      initializeCards()
      gsap.set("h1 span, h2 span", { y: -200 })
      gsap.to(`.${styles.slider} .${styles.card}:last-child h1 span`, {
        y: 0,
        duration: 1,
        ease: "cubic",
        stagger: 0.05
      })
      gsap.to(`.${styles.slider} .${styles.card}:last-child h2 span`, {
        y: 0,
        duration: 0.5,
        ease: "cubic",
        stagger: 0.02,
        delay: 0.2
      })
    }
  }, [isInitialLoading, displayedVinyls])

  // Initialisation des cartes
  const initializeCards = () => {
    if (!sliderRef.current) return
    const cards = Array.from(sliderRef.current.querySelectorAll(`.${styles.card}`))
    gsap.to(cards, {
      y: (i) => -15 + 15 * i + '%',
      z: (i) => 15 * i,
      opacity: 1,
      duration: 1,
      ease: "cubic",
      stagger: -0.1
    })
  }

  // Gestion de la transition des cartes modifiée
  const handleCardTransition = () => {
    if (isAnimating || !sliderRef.current || displayedVinyls.length < INITIAL_DISPLAY) return
    setIsAnimating(true)

    // Sauvegarder le vinyle qui sort dans l'historique
    const vinylToSave = displayedVinyls[displayedVinyls.length - 1]
    setPreviousVinyls(prev => [...prev, vinylToSave])
    setCanGoBack(true)

    logMemoryUsage('Début transition carte')
    console.log('🔄 Transition de carte')

    const cards = Array.from(sliderRef.current.querySelectorAll(`.${styles.card}`))
    const lastCard = cards[cards.length - 1]
    const nextCard = cards[cards.length - 2]

    gsap.to(lastCard.querySelectorAll('h1 span, h2 span'), {
      y: 200,
      duration: 0.75,
      ease: "cubic",
      stagger: 0.02
    })

    gsap.to(lastCard, {
      y: '+=150%',
      duration: 0.75,
      ease: "cubic",
      onComplete: () => {
        if (!sliderRef.current) return
        sliderRef.current.prepend(lastCard)

        const newVinyls = [...displayedVinyls]
        newVinyls.pop()

        if (allVinyls[nextIndex]) {
          newVinyls.unshift(allVinyls[nextIndex])
          setNextIndex(prev => prev + 1)
          setDisplayedVinyls(newVinyls)
          logStatus('Après transition')

          initializeCards()
          gsap.set(lastCard.querySelectorAll('h1 span, h2 span'), { y: -200 })
        }

        logMemoryUsage('Fin transition carte')
        setTimeout(() => {
          setIsAnimating(false)
        }, 1000)
      }
    })

    if (nextCard) {
      gsap.to(nextCard.querySelectorAll('h1 span'), {
        y: 0,
        duration: 1,
        ease: "cubic",
        stagger: 0.05,
        delay: 0.2
      })
      gsap.to(nextCard.querySelectorAll('h2 span'), {
        y: 0,
        duration: 0.5,
        ease: "cubic",
        stagger: 0.02,
        delay: 0.3
      })
    }
  }

  // Nouvelle fonction pour gérer le clic sur une carte
  const handleCardClick = (clickedIndex) => {
    if (isAnimating || clickedIndex === displayedVinyls.length - 1) return
    setIsAnimating(true)

    const cards = Array.from(sliderRef.current.querySelectorAll(`.${styles.card}`))
    const clickedCard = cards[clickedIndex]
    const lastCard = cards[cards.length - 1]
    
    // Nombre de cartes à sauter
    const cardsToSkip = displayedVinyls.length - 1 - clickedIndex

    // Animation de sortie pour les cartes entre la carte cliquée et la dernière
    gsap.to(cards.slice(clickedIndex + 1), {
      y: '+=150%',
      opacity: 0,
      duration: 0.5,
      ease: "cubic",
      stagger: 0.1
    })

    // Animation des textes de la dernière carte
    gsap.to(lastCard.querySelectorAll('h1 span, h2 span'), {
      y: 200,
      duration: 0.5,
      ease: "cubic",
      stagger: 0.02
    })

    // Animation de la carte cliquée
    gsap.to(clickedCard.querySelectorAll('h1 span, h2 span'), {
      y: 0,
      duration: 1,
      ease: "cubic",
      stagger: 0.05,
      delay: 0.3
    })

    gsap.to(clickedCard, {
      y: '-15%',
      z: '0',
      duration: 0.75,
      ease: "cubic",
      onComplete: () => {
        // Mettre à jour l'état des vinyles affichés
        const newVinyls = [...displayedVinyls]
        // Retirer les cartes jusqu'à la carte cliquée
        newVinyls.splice(clickedIndex + 1)
        
        // Ajouter de nouvelles cartes depuis le cache
        for (let i = 0; i < cardsToSkip; i++) {
          if (allVinyls[nextIndex + i]) {
            newVinyls.unshift(allVinyls[nextIndex + i])
          }
        }

        setNextIndex(prev => prev + cardsToSkip)
        setDisplayedVinyls(newVinyls)

        // Réinitialiser les positions des cartes
        requestAnimationFrame(() => {
          initializeCards()
          setIsAnimating(false)
        })
      }
    })
  }

  // Ajouter la nouvelle fonction pour revenir en arrière
  const handleBackTransition = () => {
    if (isAnimating || !sliderRef.current || previousVinyls.length === 0) return
    setIsAnimating(true)
    console.log('🔄 Transition arrière')

    const cards = Array.from(sliderRef.current.querySelectorAll(`.${styles.card}`))
    const firstCard = cards[0]

    // Récupérer le dernier vinyle de l'historique
    const previousVinyl = previousVinyls[previousVinyls.length - 1]

    gsap.to(firstCard.querySelectorAll('h1 span, h2 span'), {
      y: -200,
      duration: 0.75,
      ease: "cubic",
      stagger: 0.02
    })

    gsap.to(firstCard, {
      y: '-=150%',
      duration: 0.75,
      ease: "cubic",
      onComplete: () => {
        if (!sliderRef.current) return

        const newVinyls = [...displayedVinyls]
        newVinyls.shift()
        newVinyls.push(previousVinyl)
        
        // Mettre à jour les états
        setDisplayedVinyls(newVinyls)
        setPreviousVinyls(prev => prev.slice(0, -1))
        setNextIndex(prev => prev - 1)
        setCanGoBack(previousVinyls.length > 1)

        initializeCards()
        
        setTimeout(() => {
          setIsAnimating(false)
        }, 1000)
      }
    })
  }

  // Modifier l'effet de scroll pour gérer le scroll dans les deux sens
  useEffect(() => {
    let lastScrollTime = 0

    const handleScroll = (e) => {
      const currentTime = new Date().getTime()
      if (currentTime - lastScrollTime < SCROLL_THRESHOLD) return

      if (e.deltaY < 0) {
        handleCardTransition()
        lastScrollTime = currentTime
      } else if (e.deltaY > 0 && canGoBack) {
        handleBackTransition()
        lastScrollTime = currentTime
      }
    }

    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [isAnimating, displayedVinyls, nextIndex, previousVinyls, canGoBack])

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `le ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
  }

  // Pour le rendu, on n'utilise isInitialLoading que pour le premier chargement
  if (isInitialLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.slider}>
          <div className={styles.card} style={{ opacity: 0.5 }}>
            <div className={styles.copy}>
              <h1>Chargement initial...</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <div className={styles.slider} ref={sliderRef}>
        {displayedVinyls.map((vinyl, index) => (
          <div 
            key={vinyl.id || index} 
            className={styles.card}
            onClick={() => handleCardClick(index)}
          >
            <Link 
              href={`/vinyl/${vinyl.discogsId}`}
              className={styles.vinylLink}
              onClick={(e) => {
                if (index !== displayedVinyls.length - 1) {
                  e.preventDefault()
                }
              }}
            >
              {vinyl.imageUrl ? (
                <img 
                  src={vinyl.imageUrl} 
                  alt={vinyl.title || 'Vinyl cover'}
                />
              ) : (
                <div className="bg-gray-200 aspect-square w-full flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <div className={styles.copy}>
                <h1>{vinyl.title}</h1>
                <h2>{vinyl.artist}</h2>
                <div className={styles.vinylInfo}>
                  <div className={styles.infoCard}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Année</span>
                      <span className={styles.value}>{vinyl.year}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Genre</span>
                      <span className={styles.value}>{vinyl.genres || 'Non spécifié'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Source</span>
                      <span className={styles.value}>
                        {vinyl.sourceType === 'STORE' && vinyl.store && (
                          <span>Magasin : {vinyl.store.name}</span>
                        )}
                        {vinyl.sourceType === 'COLLECTION' && (
                          <span>Collection personnelle</span>
                        )}
                        {vinyl.sourceType === 'OTHER' && vinyl.customSource && (
                          <span>{vinyl.customSource}</span>
                        )}
                        {!vinyl.sourceType && 'Non spécifié'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <div className={styles.shareContainer}>
              <div className={styles.userName}>
                <Link 
                  href={`/collection/${vinyl.userId}`}
                  className={`${styles.userLink} hover:underline cursor-pointer`}
                >
                  {vinyl.user?.name}
                </Link>
                <span className={styles.shareDate}>{formatDate(vinyl.createdAt)}</span>
              </div>
              <p className={styles.comment}>"{vinyl.comment}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VinylFeed