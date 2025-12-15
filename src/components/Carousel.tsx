'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useCarousel } from '@/hooks/useCarousel';

// Legacy prop interface kept for backwards compatibility
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CarouselProps {}

export default function Carousel({}: CarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [resizeTimeout, setResizeTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [scrollRotation, setScrollRotation] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch carousel data (from database with YouTube fallback)
  const { data: carouselData } = useCarousel();

  // Define display episode type
  type DisplayEpisode = {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    youtubeUrl?: string;
    isPlaceholder?: boolean;
  };

  const MAX_CARDS = 9;

  const displayEpisodes = useMemo<DisplayEpisode[]>(() => {
    if (!carouselData) {
      // Loading state - show placeholders
      return Array.from({ length: MAX_CARDS }, (_, i) => ({
        id: `placeholder-${i}`,
        title: 'Coming Soon',
        description: 'Stay tuned for upcoming episodes.',
        isPlaceholder: true,
      }));
    }

    if (carouselData.isFromDatabase) {
      // Database mode - use slots configuration
      return carouselData.slots.map((slot, index) => {
        const video = slot.youtubeId ? carouselData.videos.get(slot.youtubeId) : null;

        if (video) {
          return {
            id: video.id,
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            youtubeUrl: video.youtubeUrl,
            isPlaceholder: false,
          };
        }

        return {
          id: `placeholder-${index}`,
          title: 'Coming Soon',
          description: 'Stay tuned for upcoming episodes.',
          isPlaceholder: true,
        };
      });
    } else {
      // Fallback mode - use YouTube videos directly
      const videos = Array.from(carouselData.videos.values()).slice(0, MAX_CARDS);
      const episodesFromVideos: DisplayEpisode[] = videos.map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        youtubeUrl: video.youtubeUrl,
        isPlaceholder: false,
      }));

      // Fill remaining with placeholders
      while (episodesFromVideos.length < MAX_CARDS) {
        episodesFromVideos.push({
          id: `placeholder-${episodesFromVideos.length}`,
          title: 'Coming Soon',
          description: 'Stay tuned for upcoming episodes.',
          isPlaceholder: true,
        });
      }

      return episodesFromVideos;
    }
  }, [carouselData]);

  const cellCount = displayEpisodes.length;

  // Ring geometry - responsive radius based on screen size
  const getRadius = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 780; // Large screens (reduced spacing)
      if (window.innerWidth >= 1024) return 450; // Medium screens (reduced spacing)
      if (window.innerWidth >= 768) return 280;  // Small screens (reduced spacing)
      if (window.innerWidth >= 480) return 310;  // Mobile (reduced spacing)
      return 240; // Small mobile (reduced spacing)
    }
    return 450; // Default (reduced spacing)
  };
  
  const [radius, setRadius] = useState(getRadius());
  const tiltDeg = -16;   // NEGATIVE = view from TOP, positive = from below
  const liftY = -60;   // lift the ring a bit upward (adjusted for bigger scene)

  // Rotate the ring so the next/prev card comes to the front
  const updateRotation = useCallback(() => {
    const theta = 360 / cellCount;
    const angle = -selectedIndex * theta;
    // Combine manual rotation with scroll-based rotation
    const totalRotation = angle + scrollRotation;
    const carousel = document.querySelector('.carousel') as HTMLElement;
    
    if (carousel) {
      carousel.style.transform = 
        `translateY(${liftY}px) rotateX(${tiltDeg}deg) translateZ(-${radius}px) rotateY(${totalRotation}deg)`;
    }

    // Update front-facing card based on total rotation (selectedIndex + scrollRotation)
    const cells = document.querySelectorAll('.carousel__cell');
    cells.forEach(c => c.classList.remove('is-front'));
    
    // Find the card that's closest to 0 degrees (front position)
    let closestIndex = 0;
    let minAngle = Infinity;
    
    displayEpisodes.forEach((_, i) => {
      const cardAngle = (theta * i + totalRotation) % 360;
      // Normalize angle to -180 to 180 range
      const normalizedAngle = ((cardAngle + 180) % 360) - 180;
      const absAngle = Math.abs(normalizedAngle);
      
      if (absAngle < minAngle) {
        minAngle = absAngle;
        closestIndex = i;
      }
    });
    
    const frontCell = document.querySelector(`[data-cell="${closestIndex}"]`);
    if (frontCell) {
      frontCell.classList.add('is-front');
    }

    // Always show episode info - no fade animation
    const episodeInfo = document.querySelector('.carousel-episode-info') as HTMLElement;
    if (episodeInfo) {
      episodeInfo.classList.add('visible');
    }
  }, [selectedIndex, cellCount, scrollRotation, liftY, tiltDeg, radius, displayEpisodes]);

  // Position each cell around the ring
  const layoutRing = useCallback(() => {
    if (cellCount === 0) return;

    const theta = 360 / cellCount;
    displayEpisodes.forEach((_, i) => {
      const angle = theta * i;
      const cellContainer = document.querySelector(`[data-cell="${i}"]`)?.parentElement as HTMLElement;
      const cell = document.querySelector(`[data-cell="${i}"]`) as HTMLElement;
      if (cellContainer && cell) {
        cell.style.setProperty('--angle', `${angle}deg`);
        cell.style.setProperty('--radius', `${radius}px`);
        cellContainer.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
      }
    });
    updateRotation();
  }, [cellCount, radius, updateRotation, displayEpisodes]);

  const goToPrevious = () => {
    setSelectedIndex(prev => prev - 1);
  };

  const goToNext = () => {
    setSelectedIndex(prev => prev + 1);
  };

  const handleCardClick = (episodeId: string) => {
    // Find the episode/video and open YouTube URL
    const episode = displayEpisodes.find(ep => 
      ep.id === episodeId
    );
    
    if (!episode || episode.isPlaceholder) {
      return;
    }

    if (episode.youtubeUrl) {
      // YouTube video - open YouTube URL
      window.open(episode.youtubeUrl, '_blank');
    } else {
      // Fallback for static episodes
      console.log(`Card clicked for episode ${episodeId}`);
    }
  };

  // Touch/Drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - go next
        goToNext();
      } else {
        // Swiped right - go previous
        goToPrevious();
      }
    }
    
    setIsDragging(false);
  };

  // Mouse drag handlers for PC
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // Minimum drag distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Dragged left - go next
        goToNext();
      } else {
        // Dragged right - go previous
        goToPrevious();
      }
    }
    
    setIsDragging(false);
  };

  // Scroll-based rotation handler - based on total page scroll
  const handleScroll = useCallback(() => {
    // Get total page scroll position
    const scrollY = window.scrollY;
    
    // Calculate rotation based on scroll position
    // Adjust this multiplier to control how fast the carousel spins
    const rotationSpeed = 0.5; // Degrees per pixel scrolled
    const rotation = scrollY * rotationSpeed;
    
    setScrollRotation(rotation);
  }, []);

  // Throttled scroll handler for better performance
  const throttledScrollHandler = useCallback(() => {
    let ticking = false;
    
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    layoutRing();
    
    
    // Show text after carousel layout is complete
    const textTimer = setTimeout(() => {
      setIsTextVisible(true);
    }, 800);
    
    return () => {
      clearTimeout(textTimer);
    };
  }, [selectedIndex, cellCount, layoutRing]);

  // Add scroll event listener
  useEffect(() => {
    const scrollHandler = throttledScrollHandler();
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [throttledScrollHandler, updateRotation]);

  // Update rotation when scroll rotation changes
  useEffect(() => {
    updateRotation();
  }, [scrollRotation, selectedIndex, cellCount, radius, updateRotation]);

  // Update radius on window resize with debouncing
  useEffect(() => {
    const handleResize = () => {
      // Clear existing timeout
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      // Set new timeout for debounced resize
      const timeout = setTimeout(() => {
        // Update radius based on new screen size
        setRadius(getRadius());
        
        // Force a re-render and recalculation
        setTimeout(() => {
          layoutRing();
        }, 50);
      }, 150); // Debounce delay
      
      setResizeTimeout(timeout);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, [resizeTimeout, layoutRing]);

  return (
    <div className="carousel-wrapper" ref={carouselRef}>

      {/* Carousel Section */}
      <div className="carousel-section">
        <div 
          className="scene"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ touchAction: 'pan-y', cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="carousel">
            {displayEpisodes.map((episode, index) => (
              <div key={episode.id} className="cell-container">
                <div
                  data-cell={index}
                  className="carousel__cell"
                  onClick={() => handleCardClick(episode.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(episode.id);
                    }
                  }}
                >
                  {episode.thumbnailUrl && (
                    <Image
                      src={episode.thumbnailUrl}
                      alt={episode.title}
                      fill
                      sizes="(max-width: 480px) 260px, (max-width: 768px) 320px, (max-width: 1280px) 360px, 480px"
                      quality={90}
                      priority={index === 0}
                      className="carousel__image"
                      draggable={false}
                    />
                  )}
                </div>
                <div className={`cell-text ${isTextVisible ? 'visible' : ''}`}>
                  <h2 className="episode-title font-eb-garamond">{episode.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation arrows */}
        <button 
          className="nav-arrow nav-arrow-left" 
          onClick={goToPrevious}
          aria-label="Previous episode"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          className="nav-arrow nav-arrow-right" 
          onClick={goToNext}
          aria-label="Next episode"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
