'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { signIn } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuTimeline = useRef(null);
  const overlayRef = useRef(null);
  const menuLinksRef = useRef(null);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialisation de la timeline GSAP
  useEffect(() => {
    if (overlayRef.current && menuLinksRef.current) {
      // Réinitialiser les styles
      gsap.set(overlayRef.current, { display: 'none', opacity: 0 });

      // Créer la nouvelle timeline
      menuTimeline.current = gsap.timeline({ paused: true })
        .to(overlayRef.current, {
          duration: 0.5,
          opacity: 1,
          display: 'block',
          ease: 'power2.inOut'
        });

      if (!isMenuOpen) {
        menuTimeline.current.progress(0).pause();
      } else {
        menuTimeline.current.progress(1).pause();
      }
    }

    return () => {
      if (menuTimeline.current) {
        menuTimeline.current.kill();
      }
    };
  }, []); // Ne s'exécute qu'une fois au montage

  // Gestion de l'animation du menu
  useEffect(() => {
    if (!menuTimeline.current) return;

    if (isMenuOpen) {
      menuTimeline.current.play();
    } else {
      menuTimeline.current.reverse();
    }
  }, [isMenuOpen]);

  const handleNavigation = async (path) => {
    setIsMenuOpen(false);
    menuTimeline.current.reverse();
    setTimeout(() => {
      router.push(path);
    }, 500); // Attendre la fin de l'animation
  };

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    menuTimeline.current.reverse();
    setTimeout(async () => {
      await signOut({ callbackUrl: '/' });
    }, 500);
  };

  return (
    <div className="fixed w-full z-50">
      <nav 
        className={`flex justify-between items-center px-8 py-6 transition-all duration-300 ${
          isScrolled ? 'bg-transparent backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <Link href="/" className="text-2xl font-bold text-[#6F4E37] hover:opacity-80 transition-opacity">
          DIGS
        </Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-amber-900 font-bold hover:opacity-80 transition-opacity cursor-pointer z-50 relative"
        >
          {isMenuOpen ? (
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-[#6F4E37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      <div 
        ref={overlayRef} 
        className="fixed inset-0 bg-[#FAF2E2] text-[#6F4E37] pt-24 px-8"
        style={{ display: 'none', opacity: 0 }}
      >
        <div ref={menuLinksRef} className="flex flex-col space-y-6">
          <button 
            onClick={() => handleNavigation('/feed')}
            className="text-2xl hover:underline text-left transition-all duration-300 cursor-pointer"
          >
            DIGS
          </button>

          <button 
            onClick={() => handleNavigation('/store')}
            className="text-2xl hover:underline text-left transition-all duration-300 cursor-pointer"
          >
            Shops
          </button>

          <button 
            onClick={() => handleNavigation('/scan')}
            className="text-2xl hover:underline text-left transition-all duration-300 cursor-pointer"
          >
            Scan
          </button>

          {session ? (
            <>
              <button 
                onClick={() => handleNavigation('/profile')}
                className="text-2xl hover:underline text-left transition-all duration-300 cursor-pointer"
              >
                Ma collection
              </button>
              <button
                onClick={handleSignOut}
                className="text-2xl hover:underline text-left transition-all duration-300 cursor-pointer"
              >
                Se déconnecter
              </button>
            </>
          ) : (
          <button 
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="text-2xl hover:underline text-left transition-all duration-300 cursor-pointer"
          >
            Se connecter
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;