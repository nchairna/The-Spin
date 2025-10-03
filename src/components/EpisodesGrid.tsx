'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Episode {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  duration: string;
  imageUrl?: string;
}

interface EpisodesGridProps {
  episodes: Episode[];
}

export default function EpisodesGrid({ episodes }: EpisodesGridProps) {
  // Duplicate episodes to create seamless loop - more duplicates for endless scrolling
  const duplicatedEpisodes = [...episodes, ...episodes, ...episodes, ...episodes, ...episodes, ...episodes, ...episodes, ...episodes];
  
  // Refs for animation elements
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastScrollY = useRef(0);

  // Calculate episode width for seamless looping
  const episodeWidth = 256; // w-64 = 256px
  const totalWidth = duplicatedEpisodes.length * episodeWidth;

  // State for manual scroll positions
  const [leftScroll, setLeftScroll] = useState(0);
  const [rightScroll, setRightScroll] = useState(-totalWidth / 2); // Start with cards visible on left

  // Smooth scroll-based animation
  useEffect(() => {
    const animate = () => {
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollY.current;
      
      // Only animate if there's actual scroll movement
      if (Math.abs(scrollDelta) > 0.5) {
        const speed = scrollDelta * 0.3;
        
        setLeftScroll(prev => {
          const newScroll = prev - speed;
          // Reset position when we've scrolled past one full cycle
          return newScroll <= -totalWidth ? newScroll + totalWidth : newScroll;
        });
        
        setRightScroll(prev => {
          const newScroll = prev + speed;
          // Reset position when we've scrolled past one full cycle
          return newScroll >= 0 ? newScroll - totalWidth : newScroll;
        });
        
        lastScrollY.current = scrollY;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [totalWidth]);

  // Handle manual drag/scroll for left container
  const handleLeftScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;
    setLeftScroll(-scrollLeft * 0.3); // Sync with scroll position
  };
  

  // Handle manual drag/scroll for right container
  const handleRightScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;
    setRightScroll(scrollLeft * 0.3); // Sync with scroll position
  };

  return (
    <div className="w-full py-18 lg:py-8" data-episodes-section>
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-5xl lg:text-5xl font-eb-garamond text-gray-900 tracking-wide">
          All of The Spin
        </h2>
        <p className="text-gray-600 font-eb-garamond text-base md:text-lg mt-4 max-w-3xl mx-auto leading-relaxed">
          Explore our complete collection of conversations that blend intellectual rigor with playful curiosity. 
          From technology and startups to mental health and design, discover episodes that challenge conventional thinking.
        </p>
        <a 
          href="/episodes" 
          className="inline-block mt-6 text-sm md:text-base text-[#C72B1B] hover:text-gray-600 underline underline-offset-2 transition-colors duration-200 font-eb-garamond"
        >
          See all episodes
        </a>
      </div>

      {/* First Chain - Moving Left to Right */}
      <div 
        className="relative overflow-x-auto mb-4 lg:mb-8 scrollbar-hide py-2"
        onScroll={handleLeftScroll}
      >
        <div 
          ref={leftContainerRef}
          className="flex space-x-3 sm:space-x-4 md:space-x-6 min-w-max"
          style={{ transform: `translateX(${leftScroll}px)` }}
        >
          {duplicatedEpisodes.map((episode, index) => (
            <div 
              key={`left-${index}`} 
              className="flex-shrink-0 w-40 h-28 sm:w-48 sm:h-32 md:w-56 md:h-36 lg:w-64 lg:h-40 bg-white shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative"
            >
              {/* Episode Thumbnail */}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {episode.imageUrl ? (
                  <Image
                    src={episode.imageUrl}
                    alt={episode.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400 text-4xl"></div>
                  </div>
                )}
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              {/* Gradient Layer Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
              
              {/* Red Hue Overlay - Only visible on hover */}
              <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Episode Title - Centered at Bottom */}
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 px-2 sm:px-3 md:px-4">
                <h3 className="font-eb-garamond text-sm sm:text-base md:text-lg font-medium text-white text-center line-clamp-2">
                  Coming Soon
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Chain - Moving Right to Left */}
      <div 
        className="relative overflow-x-auto scrollbar-hide py-2"
        onScroll={handleRightScroll}
      >
        <div 
          ref={rightContainerRef}
          className="flex space-x-3 sm:space-x-4 md:space-x-6 min-w-max"
          style={{ transform: `translateX(${rightScroll}px)` }}
        >
          {duplicatedEpisodes.map((episode, index) => (
            <div 
              key={`right-${index}`} 
              className="flex-shrink-0 w-40 h-28 sm:w-48 sm:h-32 md:w-56 md:h-36 lg:w-72 lg:h-44 bg-white shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative"
            >
              {/* Episode Thumbnail */}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {episode.imageUrl ? (
                  <Image
                    src={episode.imageUrl}
                    alt={episode.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400 text-4xl"></div>
                  </div>
                )}
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              {/* Gradient Layer Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
              
              {/* Red Hue Overlay - Only visible on hover */}
              <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Episode Title - Centered at Bottom */}
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 px-2 sm:px-3 md:px-4">
                <h3 className="font-eb-garamond text-sm sm:text-base md:text-lg font-medium text-white text-center line-clamp-2">
                  Coming Soon
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
