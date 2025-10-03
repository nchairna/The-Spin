'use client';

import Carousel from '@/components/Carousel';
import EpisodesGrid from '@/components/EpisodesGrid';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

// Sample podcast episodes data for carousel
const carouselEpisodes = [
  { id: 1, title: "Our Trailer", description: "Exploring the latest trends in technology" },
  { id: 2, title: "Coming Soon", description: "How artificial intelligence is shaping our world" },
  { id: 3, title: "Coming Soon", description: "Behind the scenes of successful startups" },
  { id: 4, title: "Coming Soon", description: "Modern strategies for online growth" },
  { id: 5, title: "Coming Soon", description: "The new normal of distributed teams" },
  { id: 6, title: "Coming Soon", description: "Understanding cryptocurrency and blockchain" },
  { id: 7, title: "Coming Soon", description: "Wellness in the digital age" },
  { id: 8, title: "Coming Soon", description: "Creating user-centered experiences" },
  { id: 9, title: "Coming Soon", description: "Extracting insights from big data" },
];

// Sample podcast episodes data for grid
const gridEpisodes = [
  { 
    id: 1, 
    title: "The Nava Episode 12", 
    description: "Exploring the latest trends in technology and their impact on modern business", 
    category: "Technology",
    date: "Dec 15, 2024",
    duration: "45 min"
  },
  { 
    id: 2, 
    title: "The Future of AI", 
    description: "How artificial intelligence is shaping our world and what's coming next", 
    category: "AI",
    date: "Dec 12, 2024",
    duration: "52 min"
  },
  { 
    id: 3, 
    title: "Startup Stories", 
    description: "Behind the scenes of successful startups and the lessons learned", 
    category: "Startups",
    date: "Dec 10, 2024",
    duration: "38 min"
  },
  { 
    id: 4, 
    title: "Digital Marketing Mastery", 
    description: "Modern strategies for online growth and customer acquisition", 
    category: "Marketing",
    date: "Dec 8, 2024",
    duration: "41 min"
  },
  { 
    id: 5, 
    title: "Remote Work Revolution", 
    description: "The new normal of distributed teams and remote collaboration", 
    category: "Business",
    date: "Dec 5, 2024",
    duration: "47 min"
  },

];

export default function Home() {
  const [showTitle, setShowTitle] = useState(false);
  const [titleColored, setTitleColored] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  
  
  
  // Contact section states
  const [showContactTitle, setShowContactTitle] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState('');

  // Refs for sections
  const homeRef = useRef<HTMLDivElement>(null);
  const hostCardsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Home section animations
  useEffect(() => {
    // Title appears first
    setTimeout(() => {
      setShowTitle(true);
    }, 300);

    // Title gets colored second
    setTimeout(() => {
      setTitleColored(true);
    }, 800);


    return () => {
      setShowTitle(false);
      setTitleColored(false);
    };
  }, []);


  // Scroll-linked spinning effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      // Calculate dynamic rotation speed (base speed + scroll multiplier)
      const baseSpeed = 1; // Base rotation speed
      const scrollMultiplier = scrollProgress * 5; // Up to 5x faster when fully scrolled
      const dynamicSpeed = baseSpeed + scrollMultiplier;
      
      // Apply the dynamic speed to both the container and counter-rotation
      const spinningContainer = document.querySelector('.animate-spin-slow') as HTMLElement | null;
      const counterSpinningElements = document.querySelectorAll('.animate-counter-spin');
      
      if (spinningContainer) {
        spinningContainer.style.animationDuration = `${20 / dynamicSpeed}s`;
      }
      
      // Apply the same speed to counter-rotation elements to keep text upright
      counterSpinningElements.forEach(element => {
        (element as HTMLElement).style.animationDuration = `${20 / dynamicSpeed}s`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Contact section animations
  useEffect(() => {
    const contactElement = contactRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id === 'contact-section') {
            // Title appears first
            setTimeout(() => {
              setShowContactTitle(true);
            }, 300);


            // Form appears last
            setTimeout(() => {
              setShowContactForm(true);
            }, 900);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (contactElement) {
      observer.observe(contactElement);
    }

    return () => {
      if (contactElement) {
        observer.unobserve(contactElement);
      }
    };
  }, []);

  // Scroll indicator logic
  useEffect(() => {
    const handleScroll = () => {
      // Get the episodes grid section
      const episodesSection = document.querySelector('[data-episodes-section]');
      
      if (episodesSection) {
        const rect = episodesSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Hide indicator when episodes section is visible in viewport
        if (rect.top < windowHeight * 0.8) {
          setShowScrollIndicator(false);
        } else {
          setShowScrollIndicator(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section tracking for navbar
  useEffect(() => {
    const handleScroll = () => {
      const homeSection = homeRef.current;
      const aboutSection = document.getElementById('about-section');
      const contactSection = contactRef.current;

      if (homeSection && aboutSection && contactSection) {
        const aboutTop = aboutSection.offsetTop;
        const contactTop = contactSection.offsetTop;
        const scrollPosition = window.scrollY + 100; // Offset for navbar

        if (scrollPosition >= contactTop) {
          setActiveSection('contact');
        } else if (scrollPosition >= aboutTop) {
          setActiveSection('about');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('Reason:', reason);
    // You can add email sending logic here
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Navigation Bar */}
      <Navbar activeSection={activeSection} />

      {/* Home Section */}
      <section ref={homeRef} id="home-section" className="min-h-screen flex flex-col items-center py-1 pt-10 lg:pt-12 px-4">
        <div className="text-center mb-1 sm:mb-3 px-4">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* New Title */}
            <div className={`text-4xl lg:text-5xl font-eb-garamond text-gray-900 leading-tight mb-10 transition-all duration-700 ease-out ${
              showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              Because big ideas deserve both{' '}
              <span className={`font-bold transition-all duration-700 ease-out ${
                titleColored ? 'text-[#C72B1B]' : 'text-gray-900'
              }`}>rigor</span> and{' '}
              <span className={`font-bold transition-all duration-700 ease-out ${
                titleColored ? 'text-[#C72B1B]' : 'text-gray-900'
              }`}>mischief</span>.
            </div>
          </div>
        </div>
        
        {/* Carousel */}
        <Carousel episodes={carouselEpisodes} />
        
        {/* Episodes Grid */}
        <EpisodesGrid episodes={gridEpisodes} />
      </section>

      {/* About The Spin Section */}
      <section id="about-section" className="pt-5 pb-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[600px] gap-8">
            {/* Mobile: Content First, Desktop: Left Side - Circular Spinning Keywords */}
            <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
              <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]">
                {/* Keywords positioned in a circular path with counter-rotation to keep text upright */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Power</span>
                  </div>
                  <div className="absolute top-[15%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Equity</span>
                  </div>
                  <div className="absolute top-[15%] right-[25%] transform translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Futures</span>
                  </div>
                  <div className="absolute top-[30%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Identity</span>
                  </div>
                  <div className="absolute top-[30%] right-[10%] transform translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Systems</span>
                  </div>
                  <div className="absolute top-[50%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Disruption</span>
                  </div>
                  <div className="absolute top-[50%] right-[10%] transform translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Memory</span>
                  </div>
                  <div className="absolute top-[70%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Agency</span>
                  </div>
                  <div className="absolute top-[70%] right-[25%] transform translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Networks</span>
                  </div>
                  <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-counter-spin">
                    <span className="text-lg lg:text-xl font-eb-garamond italic text-[#C72B1B]">Belonging</span>
                  </div>
                </div>
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Image 
                    src="/assets/The spin icon.svg" 
                    alt="The Spin Icon" 
                    width={96}
                    height={96}
                    className="w-20 h-20 lg:w-24 lg:h-24"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile: Content First, Desktop: Right Side - Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
              <div className="py-2 px-8 max-w-2xl text-center lg:text-left">
                <h2 className="text-4xl lg:text-5xl font-eb-garamond text-gray-900 mb-8">
                  What do we <span className="text-[#C72B1B]">Spin</span>
                </h2>
                <p className="text-gray-700 font-eb-garamond text-lg lg:text-lg xl:text-lg leading-relaxed">
                  We don&apos;t just talk about the future—we <span className="text-[#C72B1B] font-semibold">spin it</span> into something you can actually understand. Where complex tech meets real-world policy, sprinkled with a dash of cultural chaos, and served with a side of sharp wit. We&apos;re not your typical podcast—we&apos;re the ones who make the impossible seem inevitable, the inevitable seem questionable, and the questionable seem downright entertaining.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Host Cards Section */}
      <section ref={hostCardsRef} id="host-cards-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
            <div className="hidden lg:flex items-center justify-between max-w-6xl mx-auto">
            {/* Left Side - Text Content */}
            <div className="flex-1 px-8 text-left max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-eb-garamond text-gray-900 mb-6">
                The voices of<br />
                <span className="text-[#C72B1B]">rigor</span> and <span className="text-[#C72B1B]">mischief</span>
              </h2>
              <p className="text-gray-700 font-eb-garamond text-lg leading-relaxed">
                <span className="text-[#C72B1B] font-semibold">Taha</span> and <span className="text-[#C72B1B] font-semibold">Gina</span> explore how fast-moving technology collides with law, policy, and society—mixing sharp analysis with curiosity and humor. Drawing on global experiences in tech, policy, and international development, they turn complex change into lively, relatable conversations.
              </p>
            </div>
            
            {/* Right Side - Combined Host Image */}
            <div className="flex justify-center">
              <div className="text-center">
                <Image 
                  src="/assets/Taha and Gina.png" 
                  alt="Taha Rashid and Gina Washington" 
                  width={384}
                  height={384}
                  className="w-96 h-auto object-contain transform hover:scale-110 transition-all duration-300 mb-6"
                />
                
                {/* Names and Social Links */}
                <div className="flex justify-center space-x-8">
                  {/* Taha Section */}
                  <div className="text-center">
                    <h3 className="text-xl font-eb-garamond text-gray-900 font-semibold mb-2">Taha Rashid</h3>
                    <div className="flex justify-center space-x-3">
                      <a 
                        href="https://www.instagram.com/taharashid" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C72B1B] transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/taha-rashid" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C72B1B] transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  {/* Gina Section */}
                  <div className="text-center">
                    <h3 className="text-xl font-eb-garamond text-gray-900 font-semibold mb-2">Gina Washington</h3>
                    <div className="flex justify-center space-x-3">
                      <a 
                        href="https://www.instagram.com/ginawashington" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C72B1B] transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/gina-washington" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C72B1B] transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-eb-garamond text-gray-900 mb-6">
                The voices of<br />
                <span className="text-[#C72B1B]">rigor</span> and <span className="text-[#C72B1B]">mischief</span>
              </h2>
              <p className="text-gray-700 font-eb-garamond text-base leading-relaxed max-w-2xl mx-auto">
                <span className="text-[#C72B1B] font-semibold">Taha</span> and <span className="text-[#C72B1B] font-semibold">Gina</span> explore how fast-moving technology collides with law, policy, and society—mixing sharp analysis with curiosity and humor. Drawing on global experiences in tech, policy, and international development, they turn complex change into lively, relatable conversations.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="text-center">
                <Image 
                  src="/assets/Taha and Gina.png" 
                  alt="Taha Rashid and Gina Washington" 
                  width={320}
                  height={320}
                  className="w-80 h-auto object-contain transform hover:scale-110 transition-all duration-300 mb-6"
                />
                
                {/* Names and Social Links */}
                <div className="flex justify-center space-x-6">
                  {/* Taha Section */}
                  <div className="text-center">
                    <h3 className="text-lg font-eb-garamond text-gray-900 font-semibold mb-2">Taha Rashid</h3>
                    <div className="flex justify-center space-x-2">
                      <a 
                        href="https://www.instagram.com/taharashid" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C72B1B] transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/taha-rashid" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C72B1B] transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  {/* Gina Section */}
                  <div className="text-center">
                    <h3 className="text-lg font-eb-garamond text-gray-900 font-semibold mb-2">Gina Washington</h3>
                    <div className="flex justify-center space-x-2">
                      <a 
                        href="https://www.instagram.com/ginawashington" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C72B1B] transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/gina-washington" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#C72B1B] transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact-section" className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto min-h-[calc(100vh-200px)] flex items-center">
          <div className="w-full">
            <h1 className={`text-center text-5xl lg:text-6xl font-eb-garamond text-[#C72B1B] leading-tight mb-8 transition-all duration-700 ease-out ${
              showContactTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              Contact Us
            </h1>
            <form onSubmit={handleContactSubmit} className={`transition-all duration-700 ease-out ${
              showContactForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-lg font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 bg-white focus:ring-2 focus:ring-[#C72B1B] focus:border-transparent transition-all duration-200"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-lg font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 bg-white focus:ring-2 focus:ring-[#C72B1B] focus:border-transparent transition-all duration-200"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white focus:ring-2 focus:ring-[#C72B1B] focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Reason Dropdown */}
                <div>
                  <label htmlFor="reason" className="block text-lg font-medium text-gray-700 mb-2">
                    Reason for reaching out
                  </label>
                  <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white focus:ring-2 focus:ring-[#C72B1B] focus:border-transparent transition-all duration-200"
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="guest_tip">Recommend a guest</option>
                    <option value="episode_feedback">Thoughts on an episode</option>
                    <option value="partnership">Sponsorship or collaboration</option>
                    <option value="topic_idea">Suggest a topic</option>
                    <option value="other">Something else</option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#C72B1B] focus:border-transparent transition-all duration-200 resize-y"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-[#C72B1B] hover:bg-[#B02518] text-white px-8 py-3 font-semibold transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Scroll Indicator - Only visible on lg screens */}
      {showScrollIndicator && (
        <div className="hidden lg:block fixed bottom-8 right-8 z-50">
          <div className="flex items-center space-x-2 scroll-indicator-flicker">
            {/* Text */}
            <div className="text-lg font-outfit text-[#C72B1B] font-medium">
              More episodes
            </div>
            {/* Down Arrow */}
            <div className="scroll-indicator-bounce">
              <svg 
                className="w-5 h-5 text-[#C72B1B]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
