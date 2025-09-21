'use client';

import React, { useState, useEffect } from 'react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    setIsScrolling(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Reset scrolling state after animation completes
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 bg-black border-2 border-cyan-400 rounded-full shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-110 z-50 group ${
            isScrolling ? 'animate-pulse' : ''
          }`}
          aria-label="Scroll to top"
        >
          {/* Cyberpunk Arrow Up Icon */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute inset-0 border border-cyan-400/50 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>

            {/* Arrow with glow effect */}
            <svg
              className="w-4 h-4 text-cyan-400 transform group-hover:scale-110 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))'
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>

            {/* Inner dot for cyberpunk effect */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black border border-cyan-400/50 rounded text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Back to Top
            <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400/50"></div>
          </div>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
