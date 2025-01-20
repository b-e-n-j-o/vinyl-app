import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

const VinylFeed = () => {
  const [sharedVinyls, setSharedVinyls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const { data: session } = useSession()
  const sliderRef = useRef(null)

  useEffect(() => {
    const fetchSharedVinyls = async () => {
      try {
        const response = await fetch('/api/feed')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        console.log('Données reçues du feed:', data)
        setSharedVinyls(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSharedVinyls()
  }, [])

  useEffect(() => {
    if (!isLoading && sharedVinyls.length > 0) {
      CustomEase.create("cubic", "0.83, 0, 0.17, 1")
      initializeCards()
      
      const spans = document.querySelectorAll('.vinyl-title span')
      gsap.set(spans, { y: -200 })
      if (spans.length) {
        gsap.set(document.querySelectorAll('.card:last-child .vinyl-title span'), { y: 0 })
      }
    }
  }, [isLoading, sharedVinyls])

  const splitTextIntoSpans = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="inline-block">
        {char === ' ' ? '\u00A0\u00A0' : char}
      </span>
    ))
  }

  const initializeCards = () => {
    const cardElements = Array.from(document.querySelectorAll('.card'))
    gsap.to(cardElements, {
      y: (i) => -15 + 15 * i + '%',
      z: (i) => 15 * i,
      opacity: 1,
      duration: 1,
      ease: "cubic",
      stagger: -0.1
    })
  }

  const handleClick = () => {
    if (isAnimating) return
    setIsAnimating(true)

    const slider = sliderRef.current
    const cards = Array.from(slider.querySelectorAll('.card'))
    const lastCard = cards[cards.length - 1]
    const nextCard = cards[cards.length - 2]

    gsap.to(lastCard.querySelectorAll('.vinyl-title span'), {
      y: 200,
      duration: 0.75,
      ease: "cubic"
    })

    gsap.to(lastCard, {
      y: '+=150%',
      duration: 0.75,
      ease: "cubic",
      onComplete: () => {
        slider.prepend(lastCard)
        initializeCards()
        gsap.set(lastCard.querySelectorAll('.vinyl-title span'), { y: -200 })

        setTimeout(() => {
          setIsAnimating(false)
        }, 1000)
      }
    })

    if (nextCard) {
      gsap.to(nextCard.querySelectorAll('.vinyl-title span'), {
        y: 0,
        duration: 1,
        ease: "cubic",
        stagger: 0.05
      })
    }
  }

  const VinylCard = ({ share }) => {
    return (
      <Link 
        href={`/vinyl/${share.vinyl.discogsId}`}
        className="card absolute top-1/2 left-1/2 w-1/2 h-96 rounded-lg overflow-hidden bg-black -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative w-full h-full">
          {/* Image */}
          {share.vinyl.imageUrl ? (
            <img 
              src={share.vinyl.imageUrl} 
              alt={share.vinyl.title}
              className="absolute w-full h-full object-cover opacity-75"
            />
          ) : (
            <div className="absolute w-full h-full flex items-center justify-center bg-gray-800">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {/* Title Overlay */}
          <div className="copy absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <h1 className="relative text-center font-serif text-5xl font-light tracking-tight uppercase text-[#dfe1c8] vinyl-title">
              {splitTextIntoSpans(share.vinyl.title)}
            </h1>
          </div>

          {/* User Info & Details Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <img src={share.user.image} alt="" className="w-6 h-6 rounded-full" />
              <span className="text-sm font-medium">{share.user.name}</span>
            </div>
            <p className="text-sm text-purple-300 mb-1">{share.vinyl.artist}</p>
            <p className="text-xs text-gray-300 mb-2">{share.vinyl.genres}</p>
            <p className="text-sm italic text-gray-200">"{share.comment}"</p>
          </div>
        </div>
      </Link>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#dfe1c8] flex items-center justify-center">
        <div className="space-y-4">
          <div className="w-64 h-64 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-48 h-4 bg-gray-300 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#dfe1c8]">
      <div 
        ref={sliderRef}
        className="absolute top-[15vh] w-screen h-screen overflow-hidden"
        style={{ perspective: '200px', perspectiveOrigin: '50% 100%' }}
        onClick={handleClick}
      >
        {sharedVinyls.map((share) => (
          <VinylCard key={share.id} share={share} />
        ))}
      </div>

      {/* Navigation Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-gray-600">
        <p className="text-sm">Click anywhere to browse through vinyls</p>
      </div>
    </div>
  )
}

export default VinylFeed