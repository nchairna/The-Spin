import Carousel from '@/components/Carousel';
import Navbar from '@/components/Navbar';

// Sample podcast episodes data
const episodes = [
  { id: 1, title: "The Nava Episode 12", description: "Exploring the latest trends in technology" },
  { id: 2, title: "The Future of AI", description: "How artificial intelligence is shaping our world" },
  { id: 3, title: "Startup Stories", description: "Behind the scenes of successful startups" },
  { id: 4, title: "Digital Marketing", description: "Modern strategies for online growth" },
  { id: 5, title: "Remote Work Revolution", description: "The new normal of distributed teams" },
  { id: 6, title: "Blockchain Basics", description: "Understanding cryptocurrency and blockchain" },
  { id: 7, title: "Mental Health in Tech", description: "Wellness in the digital age" },
  { id: 8, title: "Product Design", description: "Creating user-centered experiences" },
  { id: 9, title: "Data Science", description: "Extracting insights from big data" },
];

export default function Home() {
  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Navigation Bar */}
      <Navbar currentPage="home" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 sm:py-16 px-4 overflow-hidden">
        <div className="text-center mb-8 sm:mb-12">
    
        </div>
        
        {/* Carousel */}
        <Carousel episodes={episodes} />
      </main>
    </div>
  );
}
