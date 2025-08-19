'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white navbar-container">
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Logo - Left */}
            <div className="flex items-center logo-animate">
              <img 
                src="/assets/The Spin Logo.png" 
                alt="The Spin Podcast Logo" 
                className="h-28 w-auto"
              />
            </div>
            
            {/* Navigation Links - Center */}
            <div className="flex items-center space-x-12 desktop-nav">
              <a href="#" className="nav-link text-gray-900 font-outfit text-base font-medium tracking-wide">
                About Us
              </a>
              <a href="#" className="nav-link text-gray-900 font-outfit text-base font-medium tracking-wide">
                Your Host
              </a>
              <a href="#" className="nav-link text-gray-900 font-outfit text-base font-medium tracking-wide">
                Contact Us
              </a>
            </div>
            
            {/* Subscribe Button - Right */}
            <div className="flex items-center subscribe-container">
              <a 
                href="https://thespinpodcast.substack.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="subscribe-btn bg-[#C72B1B] hover:bg-[#B02518] text-white px-6 py-3 rounded-lg font-semibold shadow-lg font-outfit text-base tracking-wide"
              >
                Subscribe
              </a>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden flex items-center justify-between w-full">
            {/* Hamburger Menu Button - Left */}
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-900 hover:text-[#C72B1B] focus:outline-none focus:text-[#C72B1B] transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Logo - Center */}
            <div className="flex items-center justify-center flex-1 logo-animate">
              <img 
                src="/assets/The Spin Logo.png" 
                alt="The Spin Podcast Logo" 
                className="h-28 w-auto"
              />
            </div>

            {/* Empty div for balance - Right */}
            <div className="w-6"></div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden ${isMenuOpen ? 'block mobile-menu-enter' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <a href="#" className="nav-link block px-3 py-3 text-gray-900 hover:text-[#C72B1B] hover:bg-gray-50 rounded-md transition-all duration-200 font-outfit text-base font-medium">
              About Us
            </a>
            <a href="#" className="nav-link block px-3 py-3 text-gray-900 hover:text-[#C72B1B] hover:bg-gray-50 rounded-md transition-all duration-200 font-outfit text-base font-medium">
              Your Host
            </a>
            <a href="#" className="nav-link block px-3 py-3 text-gray-900 hover:text-[#C72B1B] hover:bg-gray-50 rounded-md transition-all duration-200 font-outfit text-base font-medium">
              Contact Us
            </a>
            <a 
              href="https://thespinpodcast.substack.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="subscribe-btn block px-3 py-3 bg-[#C72B1B] text-white hover:bg-[#B02518] rounded-md transition-all duration-200 font-outfit font-semibold text-base"
            >
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

