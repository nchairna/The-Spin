# YouTube API Integration Setup Guide

## Step-by-Step Setup

### 1. Environment Variables
Create a `.env.local` file in your project root with:

```env
# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here

# Optional: Playlist ID if you want to fetch from a specific playlist
YOUTUBE_PLAYLIST_ID=your_playlist_id_here
```

### 2. Get Your YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key to your `.env.local` file

### 3. Get Your Channel ID
1. Go to your YouTube channel
2. Look at the URL: `https://www.youtube.com/channel/YOUR_CHANNEL_ID`
3. Copy the channel ID to your `.env.local` file

### 4. Optional: Get Playlist ID (if using specific playlist)
1. Go to your YouTube playlist
2. Look at the URL: `https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID`
3. Copy the playlist ID to your `.env.local` file

## How It Works

### Secure Architecture
- **API Key Protection**: Your YouTube API key is stored server-side only
- **Rate Limiting**: Built-in protection against API quota exhaustion
- **Error Handling**: Graceful fallbacks to static content

### Data Flow
1. Components call `useYouTube()` hook
2. Hook makes request to `/api/youtube` route
3. API route fetches data from YouTube API v3
4. Data is transformed and returned to components
5. Components display YouTube videos with fallback to static episodes

### Features Added
- **Real YouTube Videos**: Fetches your latest videos automatically
- **Thumbnails**: High-quality thumbnails from YouTube
- **Click to Play**: Direct links to YouTube videos
- **Duration**: Video duration in readable format
- **View Counts**: Formatted view counts (1.2M, 1.5K, etc.)
- **Fallback Support**: Falls back to static episodes if API fails

## Testing

1. Add your API credentials to `.env.local`
2. Run `npm run dev`
3. Check browser console for any errors
4. Verify videos appear in carousel and episodes page

## Troubleshooting

### Common Issues
- **API Key Invalid**: Check your API key in Google Cloud Console
- **Channel ID Wrong**: Verify your channel ID in the URL
- **Quota Exceeded**: YouTube API has daily limits
- **CORS Errors**: API calls are server-side, no CORS issues

### Debug Mode
Add `console.log` statements in:
- `src/hooks/useYouTube.ts` - Check data fetching
- `src/app/api/youtube/route.ts` - Check API responses
- `src/lib/youtube-api.ts` - Check YouTube API calls

## Security Notes
- Never commit `.env.local` to version control
- API key is only used server-side
- Rate limiting prevents quota exhaustion
- Error handling prevents crashes

