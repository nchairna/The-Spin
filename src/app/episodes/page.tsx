'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import { useYouTube } from '@/hooks/useYouTube';
import { YouTubeVideo } from '@/types/youtube';

export default function EpisodesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<YouTubeVideo | null>(null);
  
  // Fetch YouTube data
  const { data: youtubeData, loading, error } = useYouTube({ maxResults: 50 });
  
  const episodes = youtubeData?.videos ?? [];

  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    episodes.forEach((episode) => {
      if (episode.category) {
        categorySet.add(episode.category);
      }
    });

    return ['All', ...Array.from(categorySet).sort()];
  }, [episodes]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  const filteredEpisodes = episodes.filter((episode) => {
    const matchesCategory = selectedCategory === "All" || episode.category === selectedCategory;
    const matchesSearch =
      episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="episodes" activeSection="episodes" />
      
      <main className="px-4 py-16 sm:px-6 lg:px-8 pt-32">
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
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-eb-garamond text-lg">
                Loading the latest episodes...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-500 font-eb-garamond text-lg">
                Unable to load YouTube episodes right now. Showing recent highlights instead.
              </p>
            </div>
          )}

          {!loading && !error && episodes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-eb-garamond text-lg">
                No episodes available yet. Check back soon!
              </p>
            </div>
          )}

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
                    {episode.thumbnailUrl ? (
                      <Image
                        src={episode.thumbnailUrl}
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
                      {episode.category || 'Podcast'}
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
                      {new Date(episode.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {!loading && episodes.length > 0 && filteredEpisodes.length === 0 && (
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
                {selectedEpisode.thumbnailUrl ? (
                  <Image 
                    src={selectedEpisode.thumbnailUrl} 
                    alt={selectedEpisode.title} 
                    fill 
                    className="object-cover" 
                  />
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
