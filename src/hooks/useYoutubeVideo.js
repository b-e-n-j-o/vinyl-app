// src/hooks/useYoutubeVideo.js
'use client'
import { useState, useCallback } from 'react'

export function useYoutubeVideo() {
  const [youtubeVideoId, setYoutubeVideoId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || 0) * 3600;
    const minutes = parseInt(match[2] || 0) * 60;
    const seconds = parseInt(match[3] || 0);
    return hours + minutes + seconds;
  };

  const fetchYoutubeVideo = useCallback(async (title, artist) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const cleanString = (str) => {
        return str
          ?.trim()
          .replace(/\s*\(\d+\)\s*/g, '')
          .replace(/\(\s*\)/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
      };
  
      const cleanTitle = cleanString(title);
      const cleanArtist = cleanString(artist);
      const query = `${cleanArtist} - ${cleanTitle}`;
      console.log('Recherche YouTube après nettoyage:', query);
  
      const youtubeResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` + 
        `part=snippet` +
        `&q=${encodeURIComponent(query)}` +
        `&type=video` +
        `&videoCategoryId=10` +
        `&maxResults=3` +
        `&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
  
      const youtubeData = await youtubeResponse.json();
      
      if (youtubeData.items && youtubeData.items.length > 0) {
        const videoIds = youtubeData.items.map(item => item.id.videoId).join(',');
        const videoDetailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        
        const videoDetails = await videoDetailsResponse.json();
        
        const scoredVideos = videoDetails.items
          .filter(video => {
            const duration = parseDuration(video.contentDetails.duration);
            return duration > 61;
          })
          .filter(video => {
            const videoTitle = video.snippet.title.toLowerCase();
            return videoTitle.includes(cleanTitle);
          })
          .map(video => {
            const videoTitle = video.snippet.title.toLowerCase();
            let score = 0;
            
            const videoWords = videoTitle.split(/\s+/);
            const titleWords = cleanTitle.split(/\s+/);
            const artistWords = cleanArtist.split(/\s+/);
            
            const titleMatchCount = titleWords.filter(word => videoWords.includes(word)).length;
            const titleScore = (titleMatchCount / titleWords.length) * 50;
            score += titleScore;
            
            const artistMatchCount = artistWords.filter(word => videoWords.includes(word)).length;
            const artistScore = (artistMatchCount / artistWords.length) * 50;
            score += artistScore;
            
            const exactTitlePattern = new RegExp(`\\b${cleanTitle}\\b`);
            const exactArtistPattern = new RegExp(`\\b${cleanArtist}\\b`);
            
            if (exactTitlePattern.test(videoTitle)) score += 20;
            if (exactArtistPattern.test(videoTitle)) score += 20;
            
            const exactPattern = new RegExp(`\\b${cleanArtist}\\s*-\\s*${cleanTitle}\\b`);
            if (exactPattern.test(videoTitle)) score += 30;

            console.log(`Titre: ${video.snippet.title} | Score: ${score}`);
            
            return {
              video,
              score,
            };
          })
          .sort((a, b) => b.score - a.score);
  
        if (scoredVideos.length > 0) {
          const bestMatch = scoredVideos[0];
          console.log('Meilleure correspondance:', {
            titre: bestMatch.video.snippet.title,
            score: bestMatch.score,
            id: bestMatch.video.id
          });
          setYoutubeVideoId(bestMatch.video.id);
        } else {
          setYoutubeVideoId(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch YouTube video:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { youtubeVideoId, fetchYoutubeVideo, isLoading };
}