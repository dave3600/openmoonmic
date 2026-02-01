import { useState, useRef, useEffect, useCallback } from 'react';
import { useLiveStore } from '../stores/liveStore';

export type AudioSource = 'youtube' | 'file' | null;

export const useAudioPlayer = () => {
  const { audioUrl, audioVolume, setAudioUrl, setAudioVolume } = useLiveStore();
  const [source, setSource] = useState<AudioSource>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);

  const loadYouTubeVideo = useCallback((videoId: string) => {
    setYoutubeVideoId(videoId);
    setSource('youtube');
    setAudioUrl(`https://www.youtube.com/watch?v=${videoId}`);
    
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Wait for YouTube API to load
    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT);
        if (youtubePlayerRef.current) {
          youtubePlayerRef.current.loadVideoById(videoId);
        } else {
          youtubePlayerRef.current = new window.YT.Player('youtube-player', {
            videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              modestbranding: 1,
            },
            events: {
              onReady: () => {
                youtubePlayerRef.current.setVolume(audioVolume * 100);
              },
            },
          });
        }
      }
    }, 100);
  }, [audioVolume, setAudioUrl]);

  const loadAudioFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setSource('file');
    setAudioUrl(url);
    
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume, setAudioUrl]);

  const play = useCallback(() => {
    if (source === 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.playVideo();
      setIsPlaying(true);
    } else if (source === 'file' && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [source]);

  const pause = useCallback(() => {
    if (source === 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.pauseVideo();
      setIsPlaying(false);
    } else if (source === 'file' && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [source]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setAudioVolume(clampedVolume);
    
    if (source === 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.setVolume(clampedVolume * 100);
    } else if (source === 'file' && audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, [source, setAudioVolume]);

  const mute = useCallback(() => {
    setVolume(0);
  }, [setVolume]);

  const unmute = useCallback(() => {
    setVolume(1.0);
  }, [setVolume]);

  // Update volume when it changes
  useEffect(() => {
    if (source === 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.setVolume(audioVolume * 100);
    } else if (source === 'file' && audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume, source]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current && source === 'file') {
        URL.revokeObjectURL(audioRef.current.src);
      }
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }
    };
  }, [source]);

  return {
    source,
    isPlaying,
    youtubeVideoId,
    audioUrl,
    audioVolume,
    loadYouTubeVideo,
    loadAudioFile,
    play,
    pause,
    setVolume,
    mute,
    unmute,
    audioRef,
  };
};

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
