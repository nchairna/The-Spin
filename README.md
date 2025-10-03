# The Spin Podcast

A modern podcast website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach with beautiful animations
- **Interactive Carousel**: 3D rotating carousel for episode previews
- **Episode Management**: Full episodes page with search and filtering
- **Contact Form**: Integrated contact form with validation
- **Performance Optimized**: Static generation with optimized images
- **SEO Ready**: Meta tags and structured data

## Tech Stack

- **Framework**: Next.js 15.4.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Custom fonts (EB Garamond, Outfit, Poppins)
- **Icons**: Custom SVG icons and social media icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd the-spin
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Build for Production

```bash
npm run build
```

### Static Export (Recommended)

The app is configured for static export, making it deployable to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

```bash
npm run build
# Output will be in the 'out' directory
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_YOUTUBE_URL=https://www.youtube.com/channel/UC5P-kAk5xkw2Ek6ZdQ-g2DA
NEXT_PUBLIC_SPOTIFY_URL=your-spotify-url
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── episodes/          # Episodes page
├── components/            # Reusable components
│   ├── Carousel.tsx      # 3D carousel component
│   ├── EpisodesGrid.tsx  # Episodes grid
│   ├── Navbar.tsx        # Navigation
│   └── TextCylinder.tsx  # Text animation
└── public/               # Static assets
    ├── assets/           # Images and icons
    └── fonts/            # Custom fonts
```

## Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-rendered pages for maximum performance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For questions or support, contact the development team.