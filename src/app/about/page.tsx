'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';

export default function AboutUs() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showHostTitle, setShowHostTitle] = useState(false);
  const [showHostCards, setShowHostCards] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [titleColored, setTitleColored] = useState(false);
  const hostSectionRef = useRef<HTMLDivElement>(null);

  // Staggered animation for tagline section
  useEffect(() => {
    // Icon appears first
    setTimeout(() => {
      setShowIcon(true);
    }, 500);

    // Border appears second
    setTimeout(() => {
      setShowBorder(true);
    }, 800);

    // Title appears third
    setTimeout(() => {
      setShowTitle(true);
    }, 1100);

    // Title gets colored fourth
    setTimeout(() => {
      setTitleColored(true);
    }, 1500);

    // Description appears last
    setTimeout(() => {
      setShowDescription(true);
    }, 1900);

    return () => {
      setShowIcon(false);
      setShowBorder(false);
      setShowTitle(false);
      setShowDescription(false);
      setTitleColored(false);
    };
  }, []);

  // Scroll-based animation for host cards
  useEffect(() => {
    const handleScroll = () => {
      if (!hostSectionRef.current) return;
      
      const rect = hostSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1) as the section comes into view
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));
      
      setScrollProgress(progress);
      
      // Trigger host section animations when section comes into view
      if (progress > 0.1) {
        setTimeout(() => setShowHostTitle(true), 200);
        setTimeout(() => setShowHostCards(true), 600);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="about" />
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        {/* Tagline Section */}
        <div className="mb-16 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Left column - Spin Icon */}
            <div className={`w-1/3 flex justify-center pr-2 transition-all duration-700 ease-out ${
              showBorder ? 'border-r border-gray-900' : 'border-r border-transparent'
            }`}>
              <img 
                src="/assets/The spin icon.svg" 
                alt="The Spin Icon" 
                className={`h-64 w-auto transition-all duration-700 ease-out ${
                  showIcon ? 'opacity-80' : 'opacity-0'
                }`}
              />
            </div>
            
            {/* Right column - Text Content */}
            <div className="w-2/3 pl-15">
              <div className={`text-4xl lg:text-6xl font-eb-garamond text-gray-900 leading-tight mb-6 transition-all duration-700 ease-out ${
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
              <p className={`text-gray-700 font-eb-garamond italic leading-relaxed text-lg max-w-2xl transition-all duration-700 ease-out ${
                showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                The Spin is about making big ideas accessible—without losing their complexity—and creating space for levity, vulnerability, and fresh perspective. We blend rigorous intellectual depth with humor, relatability, and real talk.
              </p>
            </div>
          </div>
        </div>

                   {/* Host Headshots Section */}
          <div ref={hostSectionRef} className="mt-42 mb-16 max-w-2xl mx-auto">
            <h2 className={`text-3xl lg:text-6xl font-eb-garamond text-gray-900 text-center mb-6 transition-all duration-700 ease-out ${
              showHostTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <span className={`inline-block transition-all duration-500 ease-out ${
                showHostTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`} style={{ transitionDelay: '200ms' }}>Meet Your</span>{' '}
              <span className={`inline-block transition-all duration-500 ease-out ${
                showHostTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`} style={{ transitionDelay: '400ms' }}><span className="text-[#C72B1B]">Hosts</span></span>
            </h2>
            
            <div className={`relative h-96 lg:h-[500px] flex items-center justify-center transition-all duration-1000 ease-out ${
              showHostCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                             {/* Host Card 1 - Gina */}
               <a 
                 href="https://www.linkedin.com/in/gina-washington" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="absolute transition-all duration-700 ease-out"
                 style={{
                   left: scrollProgress > 0.3 ? '10%' : '35%',
                   top: '50%',
                   transform: `translateX(${scrollProgress > 0.3 ? '-50%' : '-50%'}) translateY(-50%) translateY(${scrollProgress > 0.3 ? '0px' : '15px'}) rotate(${scrollProgress > 0.3 ? '0deg' : '-12deg'})`,
                   zIndex: scrollProgress > 0.3 ? 1 : 2
                 }}
               >
                <div className="w-64 h-80 lg:w-80 lg:h-96 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-1000 ease-out cursor-pointer host-card">
                  <img 
                    src="/assets/Headshot_Gina.png" 
                    alt="Gina Washington" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className={`absolute -bottom-21 left-1/2 transform -translate-x-1/2 text-center transition-all duration-500 ease-out ${
                    scrollProgress > 0.35 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <h3 className="text-xl lg:text-2xl font-eb-garamond text-[#C72B1B] whitespace-nowrap">Gina Washington</h3>
                  <p className="text-gray-600 font-eb-garamond text-sm lg:text-base mt-1 whitespace-nowrap">Graduate Student @ UChicago</p>
                </div>
                <div 
                  className={`absolute -bottom-54 left-1/2 transform -translate-x-1/2 w-80 transition-all duration-500 ease-out ${
                    scrollProgress > 0.5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <p className="text-gray-700 font-eb-garamond leading-relaxed text-base">
                    I'm a graduate student at the University of Chicago, originally from Indonesia with stints in Russia and the UK. Across roles in international development, venture capital, and government advisory, I focus on how technology outruns governance—and what that means for the societies we're building.
                  </p>
                </div>
              </a>

                             {/* Host Card 2 - Taha */}
               <a 
                 href="https://www.linkedin.com/in/taha-rashid" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="absolute transition-all duration-700 ease-out"
                 style={{
                   left: scrollProgress > 0.3 ? '85%' : '65%',
                   top: '50%',
                   transform: `translateX(${scrollProgress > 0.3 ? '-50%' : '-50%'}) translateY(-50%) translateY(${scrollProgress > 0.3 ? '0px' : '-15px'}) rotate(${scrollProgress > 0.3 ? '0deg' : '12deg'})`,
                   zIndex: scrollProgress > 0.3 ? 1 : 1
                 }}
               >
                <div className="w-64 h-80 lg:w-80 lg:h-96 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-1000 ease-out cursor-pointer host-card">
                  <img 
                    src="/assets/Headshot_Taha.png" 
                    alt="Taha Rashid" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className={`absolute -bottom-21 left-1/2 transform -translate-x-1/2 text-center transition-all duration-500 ease-out ${
                    scrollProgress > 0.35 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <h3 className="text-xl lg:text-2xl font-eb-garamond text-[#C72B1B] whitespace-nowrap">Taha Rashid</h3>
                  <p className="text-gray-600 font-eb-garamond text-sm lg:text-base mt-1 whitespace-nowrap">Graduate Student @ UChicago</p>
                </div>
                <div 
                  className={`absolute -bottom-54 left-1/2 transform -translate-x-1/2 w-80 transition-all duration-500 ease-out ${
                    scrollProgress > 0.5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <p className="text-gray-700 font-eb-garamond leading-relaxed text-base">
                    I'm a graduate student at the University of Chicago's Harris School of Public Policy, interested in helping governments and nonprofits answer one deceptively simple question: Is this even working? I care about systems, outcomes, and what happens when big promises meet real-world complexity.
                  </p>
                </div>
              </a>
            </div>
            

         </div>
       
        </div>
      </div>
  );
}
