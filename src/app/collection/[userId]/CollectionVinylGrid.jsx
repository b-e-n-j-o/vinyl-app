// app/collection/components/CollectionVinylGrid.jsx
'use client'

import { motion } from 'framer-motion'
import VinylCard from '../../profile/VinylCard' // Composant VinylCard général

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

export default function CollectionVinylGrid({ vinyles = [] }) {
  if (vinyles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-[#050517]">
          Cette collection est vide
        </h3>
        <p className="mt-2 text-[#421C10]">
          Cet utilisateur n'a pas encore ajouté de vinyles.
        </p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
      >
        {vinyles.map((vinyl) => (
          <motion.div 
            key={vinyl.id} 
            variants={item}
            className="h-full"
          >
            <VinylCard 
              vinyl={vinyl} 
              sharesCount={vinyl._count?.shares || 0}
              isPublicView={true}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}