'use client';

import { useState, useEffect } from 'react';

interface CarouselProps {
  episodes: Array<{
    id: number;
    title: string;
    description?: string;
  }>;
}

export default function Carousel({ episodes }: CarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [resizeTimeout, setResizeTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const cellCount = episodes.length;

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

  // Position each cell around the ring
  const layoutRing = () => {
    const theta = 360 / cellCount;
    episodes.forEach((_, i) => {
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
  };

  // Rotate the ring so the next/prev card comes to the front
  const updateRotation = () => {
    const theta = 360 / cellCount;
    const angle = -selectedIndex * theta;
    const carousel = document.querySelector('.carousel') as HTMLElement;
    
    if (carousel) {
      carousel.style.transform = 
        `translateY(${liftY}px) rotateX(${tiltDeg}deg) translateZ(-${radius}px) rotateY(${angle}deg)`;
    }

    // Update front-facing card
    const cells = document.querySelectorAll('.carousel__cell');
    cells.forEach(c => c.classList.remove('is-front'));
    const front = ((selectedIndex % cellCount) + cellCount) % cellCount;
    const frontCell = document.querySelector(`[data-cell="${front}"]`);
    if (frontCell) {
      frontCell.classList.add('is-front');
    }

    // Always show episode info - no fade animation
    const episodeInfo = document.querySelector('.carousel-episode-info') as HTMLElement;
    if (episodeInfo) {
      episodeInfo.classList.add('visible');
    }
  };

  const goToPrevious = () => {
    setSelectedIndex(prev => prev - 1);
  };

  const goToNext = () => {
    setSelectedIndex(prev => prev + 1);
  };

  const handleCardClick = (episodeId: number) => {
    // TODO: Add YouTube video URL mapping
    console.log(`Card clicked for episode ${episodeId}`);
    // Example: window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
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

  useEffect(() => {
    layoutRing();
    // Show text after carousel layout is complete
    const timer = setTimeout(() => {
      setIsTextVisible(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [selectedIndex, cellCount]);

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
  }, [resizeTimeout]);

  return (
    <div className="carousel-wrapper">
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
            {episodes.map((episode, index) => (
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
                />
                <div className={`cell-text ${isTextVisible ? 'visible' : ''}`}>
                  <h2 className="episode-title font-outfit">{episode.title}</h2>
                  <button className="learn-more-btn font-outfit">Watch Now</button>
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
