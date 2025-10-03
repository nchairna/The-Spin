'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '../../components/Navbar';

interface Episode {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  duration: string;
  imageUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
}

// Sample episodes data
const allEpisodes: Episode[] = [
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
  { 
    id: 6, 
    title: "Blockchain Basics", 
    description: "Understanding cryptocurrency and blockchain technology", 
    category: "Technology",
    date: "Dec 3, 2024",
    duration: "43 min"
  },
  { 
    id: 7, 
    title: "Mental Health in Tech", 
    description: "Wellness in the digital age and maintaining work-life balance", 
    category: "Wellness",
    date: "Nov 30, 2024",
    duration: "39 min"
  },
  { 
    id: 8, 
    title: "Product Design", 
    description: "Creating user-centered experiences and design thinking", 
    category: "Design",
    date: "Nov 28, 2024",
    duration: "44 min"
  },
  { 
    id: 9, 
    title: "Data Science", 
    description: "Extracting insights from big data and machine learning", 
    category: "AI",
    date: "Nov 25, 2024",
    duration: "48 min"
  },
  { 
    id: 10, 
    title: "Sustainable Business", 
    description: "Building environmentally conscious companies", 
    category: "Business",
    date: "Nov 22, 2024",
    duration: "42 min"
  },
  { 
    id: 11, 
    title: "Creative Writing", 
    description: "The art of storytelling and narrative craft", 
    category: "Creative",
    date: "Nov 20, 2024",
    duration: "36 min"
  },
  { 
    id: 12, 
    title: "Social Media Strategy", 
    description: "Building authentic connections in the digital space", 
    category: "Marketing",
    date: "Nov 18, 2024",
    duration: "40 min"
  }
];

const categories = ["All", "Technology", "AI", "Startups", "Marketing", "Business", "Wellness", "Design", "Creative"];

export default function EpisodesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const filteredEpisodes = allEpisodes.filter(episode => {
    const matchesCategory = selectedCategory === "All" || episode.category === selectedCategory;
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="episodes" activeSection="episodes" />
      
      <main className="px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-eb-garamond text-gray-900 tracking-wide mb-6">
            All Episodes
          </h1>
          
          {/* The Spin Icon */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/assets/The spin icon.svg" 
              alt="The Spin Icon" 
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </div>
          
          <p className="text-gray-600 font-eb-garamond text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Dive deep into our complete collection of conversations that blend intellectual rigor with playful curiosity.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto mb-12">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative w-full max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search episodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C72B1B] focus:border-transparent font-eb-garamond text-gray-900"
              />
              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2  font-eb-garamond text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#C72B1B] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Episodes Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((episode) => (
              <div
                key={episode.id}
                className="flex flex-col cursor-pointer group"
                onClick={() => { setSelectedEpisode(episode); setIsModalOpen(true); }}
              >
                {/* Episode Card */}
                <div className="bg-white shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 relative">
                  {/* Episode Thumbnail */}
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
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
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    
                    {/* Red Hue Overlay - Only visible on hover */}
                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                {/* Episode Content - Outside the card */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-outfit text-[#C72B1B] bg-red-50 px-2 py-1 rounded-full">
                      {episode.category}
                    </span>
                    <span className="text-xs font-outfit text-gray-500">
                      {episode.duration}
                    </span>
                  </div>
                  
                  {/* Title and Date on same row */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-eb-garamond text-lg font-medium text-gray-900 line-clamp-1 flex-1 mr-4">
                      {episode.title}
                    </h3>
                    <span className="text-xs font-outfit text-gray-500 whitespace-nowrap">
                      {episode.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredEpisodes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-eb-garamond text-lg">
                No episodes found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>
      {/* Episode Modal */}
      {isModalOpen && selectedEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          {/* Dialog */}
          <div className="relative z-10 w-full max-w-5xl mx-4">
            <div className="bg-white shadow-2xl">
              {/* Large Thumbnail with consistent aspect ratio */}
              <div className="relative w-full pb-[56.25%] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {selectedEpisode.imageUrl ? (
                  <Image src={selectedEpisode.imageUrl} alt={selectedEpisode.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <Image src="/assets/The spin icon.svg" alt="The Spin Icon" width={64} height={64} className="h-16 w-auto opacity-40" />
                  </div>
                )}
                <button
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 flex items-center justify-center font-semibold shadow-sm"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-eb-garamond text-2xl text-gray-900 mr-4 line-clamp-2">{selectedEpisode.title}</h2>
                  <span className="text-sm font-outfit text-gray-600 whitespace-nowrap">{selectedEpisode.duration}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={selectedEpisode.youtubeUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#C72B1B] text-white font-semibold transition-colors duration-200 hover:bg-[#B02518]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    Listen on YouTube
                  </a>
                  <a
                    href={selectedEpisode.spotifyUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-800 font-semibold transition-colors duration-200 hover:border-gray-400"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                    Listen on Spotify
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
