'use client'

import VinylCard from './VinylCard'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function VinylGrid({ vinyles, selectedSource }) {
  if (vinyles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-[#050517]">Votre collection est vide</h3>
        <p className="mt-2 text-[#421C10]">Commencez à ajouter des vinyles à votre collection !</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Grille de vinyles */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
      >
        {vinyles.map((vinyl, index) => (
          <motion.div 
            key={vinyl.id} 
            variants={item}
            className="h-full"
          >
            <VinylCard 
              vinyl={vinyl} 
              sharesCount={vinyl._count?.shares || 0}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll progress indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-[#421C10] text-[#F4E3B2] p-3 rounded-full shadow-lg hover:bg-[#050517] 
                   transition-colors duration-200 opacity-0 translate-y-10 
                   scroll-show:opacity-100 scroll-show:translate-y-0"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      </div>
    </div>
  )
}