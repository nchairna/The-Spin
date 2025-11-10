'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  currentPage?: string;
  activeSection?: string;
}

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  isExternal?: boolean;
}

const scrollWithOffset = (selector: string) => {
  const element = document.querySelector(selector);
  if (element) {
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const additionalOffset = 24;
    const totalOffset = headerHeight + additionalOffset;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - totalOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

const NavLink = ({ href, isActive, children, isExternal = false }: NavLinkProps) => {
  const baseClasses = "font-poppins text-base font-medium tracking-wide transition-colors duration-200";
  const activeClasses = "text-[#C72B1B]";
  const inactiveClasses = "text-gray-900 hover:text-[#C72B1B]";
  
  const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  
  const handleClick = (e: React.MouseEvent) => {
    if (!isExternal && href.startsWith('#')) {
      e.preventDefault();
      scrollWithOffset(href);
    }
  };
  
  if (isExternal) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }
  
  return (
    <a href={href} className={classes} onClick={handleClick}>
      {children}
    </a>
  );
};

const MobileNavLink = ({ href, isActive, children, isExternal = false }: NavLinkProps) => {
  const baseClasses = "block px-3 py-3 rounded-md transition-all duration-200 font-poppins text-base font-medium";
  const activeClasses = "text-[#C72B1B] bg-gray-50";
  const inactiveClasses = "text-gray-900 hover:text-[#C72B1B] hover:bg-gray-50";
  
  const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  
  const handleClick = (e: React.MouseEvent) => {
    if (!isExternal && href.startsWith('#')) {
      e.preventDefault();
      scrollWithOffset(href);
    }
  };
  
  return (
    <a 
      href={href} 
      className={classes}
      onClick={handleClick}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
};

const Logo = () => (
  <Link href="/" className="flex items-center justify-center logo-animate">
    <Image 
      src="/assets/The Spin Logo.png" 
      alt="The Spin Podcast Logo" 
      width={48}
      height={48}
      className="lg:h-12 h-12 w-auto"
      priority
    />
  </Link>
);

const HamburgerButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-gray-900 hover:text-[#C72B1B] focus:outline-none focus:text-[#C72B1B] transition-colors duration-200"
    aria-label="Toggle navigation menu"
    aria-expanded={isOpen}
  >
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
);

export default function Navbar({ currentPage = 'home', activeSection = 'home' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Add scroll listener to handle visibility and border
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      setIsScrolled(currentScrollY > 10);

      const threshold = 120;
      const isScrollingDown = currentScrollY > lastScrollY;
      const isScrollingUp = currentScrollY < lastScrollY;

      if (isMenuOpen) {
        setIsHidden(false);
      } else if (isScrollingDown && currentScrollY > threshold) {
        setIsHidden(true);
      } else if (isScrollingUp) {
        setIsHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Ensure navbar is visible when menu state changes
  useEffect(() => {
    if (isMenuOpen) {
      setIsHidden(false);
    }
  }, [isMenuOpen]);

  const isHomePage = currentPage === 'home';
  const navigationItems = [
    { href: isHomePage ? '#home-section' : '/#home-section', label: 'Home', page: 'home' },
    { href: '/episodes', label: 'Episodes', page: 'episodes' },
    { href: isHomePage ? '#contact-section' : '/#contact-section', label: 'Contact', page: 'contact' },
    { href: 'https://thespinpodcast.substack.com/', label: 'Blog', page: 'blog', isExternal: true },
  ];

  return (
    <header
      className={`bg-white fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'border-b border-gray-100 shadow-sm' : 'border-b border-transparent'
      } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Fixed Social Media Icons - Top Right of Navbar (Desktop Only) */}
      <div className="hidden lg:flex absolute top-4 right-4 lg:top-10 lg:right-8 space-x-6 z-10 items-center">
        {/* YouTube Icon */}
        <a 
          href="https://www.youtube.com/channel/UC5P-kAk5xkw2Ek6ZdQ-g2DA" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C72B1B] hover:scale-110 transition-transform duration-200"
          aria-label="YouTube"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        
        {/* Spotify Icon */}
        <a 
          href="https://open.spotify.com/episode/5fdnAohpE8Yz7rKKm9xcii?si=5a0a3c8a956c4e51" 
          className="text-[#C72B1B] hover:scale-110 transition-transform duration-200"
          aria-label="Spotify"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </a>
      </div>

      <nav className="w-full px-4 py-4 sm:py-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="flex flex-col items-center h-12 lg:h-14">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center w-full">
            {/* Left Navigation Links */}
            <div className="flex items-center space-x-12 mr-16">
              <NavLink
                href={navigationItems[0].href}
                isActive={activeSection === navigationItems[0].page}
                isExternal={navigationItems[0].isExternal}
              >
                {navigationItems[0].label}
              </NavLink>
              <NavLink
                href={navigationItems[1].href}
                isActive={activeSection === navigationItems[1].page}
                isExternal={navigationItems[1].isExternal}
              >
                {navigationItems[1].label}
              </NavLink>
            </div>
            
            {/* Center Logo */}
            <Logo />
            
            {/* Right Navigation Links */}
            <div className="flex items-center space-x-12 ml-16">
              <NavLink
                href={navigationItems[2].href}
                isActive={activeSection === navigationItems[2].page}
                isExternal={navigationItems[2].isExternal}
              >
                {navigationItems[2].label}
              </NavLink>
              <NavLink
                href={navigationItems[3].href}
                isActive={activeSection === navigationItems[3].page}
                isExternal={navigationItems[3].isExternal}
              >
                {navigationItems[3].label}
              </NavLink>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center w-full relative">
            {/* Hamburger Menu Button */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
            </div>
            
            {/* Mobile Logo */}
            <div className="flex items-center justify-center w-full">
              <Logo />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mobile-menu-enter">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigationItems.map((item) => (
                <MobileNavLink
                  key={item.page}
                  href={item.href}
                  isActive={activeSection === item.page}
                  isExternal={item.isExternal}
                >
                  {item.isExternal ? item.label : item.label === 'Home' ? 'Home' : item.label === 'Episodes' ? 'Episodes' : item.label === 'Contact' ? 'Contact Us' : item.label}
                </MobileNavLink>
              ))}
              
              {/* Mobile Social Media Icons */}
              <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-100">
                {/* YouTube Icon */}
                <a 
                  href="https://www.youtube.com/channel/UC5P-kAk5xkw2Ek6ZdQ-g2DA" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C72B1B] hover:scale-110 transition-transform duration-200"
                  aria-label="YouTube"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                
                {/* Spotify Icon */}
                <a 
                  href="https://open.spotify.com/episode/5fdnAohpE8Yz7rKKm9xcii?si=5a0a3c8a956c4e51" 
                  className="text-[#C72B1B] hover:scale-110 transition-transform duration-200"
                  aria-label="Spotify"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

