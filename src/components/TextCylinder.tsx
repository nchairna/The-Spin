'use client';

import { useEffect, useRef } from 'react';

interface TextCylinderProps {
  text: string;
  className?: string;
  speed?: number;
  radius?: number;
  fontSize?: string;
}

export default function TextCylinder({ 
  text, 
  className = '', 
  speed = 1,
  radius = 120,
  fontSize = 'text-2xl'
}: TextCylinderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const letters = container.querySelectorAll('.letter');
    const totalLetters = letters.length;
    const angleStep = (2 * Math.PI) / totalLetters;

    // Position each letter in a circle
    letters.forEach((letter, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start from top
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Rotate each letter to face outward from the center
      (letter as HTMLElement).style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${-angle * (180 / Math.PI)}deg)`;
    });

    // Animation loop
    let rotation = 0;
    const animate = () => {
      rotation += speed * 0.5;
      container.style.transform = `rotateY(${rotation}deg)`;
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [radius, speed]);

  return (
    <div className={`flex items-center justify-center perspective-1000 ${className}`}>
      <div 
        ref={containerRef}
        className="relative w-64 h-64 transform-style-preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`letter absolute font-bold text-gray-900 ${fontSize} transform-gpu`}
            style={{
              transformOrigin: '0 0',
              left: '50%',
              top: '50%',
              marginLeft: '-0.5em',
              marginTop: '-0.5em',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
}
