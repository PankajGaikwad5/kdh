'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent choice is already made
    const consentChoice = localStorage.getItem('cookieConsent');
    if (!consentChoice) {
      // Delay showing the banner slightly for a premium, polished entry feel
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    
    // Dynamically trigger Google Analytics consent if gtag is available
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);

    // Block Google Analytics consent if gtag is available
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-[100] transition-all duration-700 ease-out transform translate-y-0 opacity-100">
      <div className="bg-black/80 backdrop-blur-md border border-white/10 p-5 rounded-lg shadow-2xl text-white font-sans flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-zinc-100 mb-1">
            Cookie Consent
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            We use cookies to analyze site traffic and improve your browsing experience. Our tools, including Google Analytics and Google Search Console, process standard user data to help us build a better website. Learn more by reading our{' '}
            <Link 
              href="/privacy-policy" 
              className="underline text-white hover:text-zinc-300 transition-colors"
            >
              Privacy Policy
            </Link>.
          </p>
        </div>
        <div className="flex items-center gap-3 justify-end text-xs tracking-wider">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-all duration-300 font-light border border-transparent hover:border-zinc-800 rounded-none uppercase"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 bg-white text-black hover:bg-zinc-800 hover:text-white transition-all duration-300 font-medium rounded-none uppercase border border-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
