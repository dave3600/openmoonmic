import { useEffect, useCallback } from 'react';
import { useGlobeStore } from '../stores/globeStore';
import { GLOBE_CONFIG } from '../utils/constants';

export const useGlobeNavigation = () => {
  const { zoom, setZoom, setAutoMode, autoMode, setSelectedUserId } = useGlobeStore();

  const zoomIn = useCallback(() => {
    setZoom(Math.min(zoom + 0.1, GLOBE_CONFIG.maxZoom));
  }, [zoom, setZoom]);

  const zoomOut = useCallback(() => {
    setZoom(Math.max(zoom - 0.1, GLOBE_CONFIG.minZoom));
  }, [zoom, setZoom]);

  const setZoomLevel = useCallback(
    (level: number) => {
      setZoom(Math.max(GLOBE_CONFIG.minZoom, Math.min(level, GLOBE_CONFIG.maxZoom)));
    },
    [setZoom]
  );

  const toggleAutoMode = useCallback(() => {
    setAutoMode(!autoMode);
  }, [autoMode, setAutoMode]);

  const selectUser = useCallback(
    (userId: string | null) => {
      setSelectedUserId(userId);
    },
    [setSelectedUserId]
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      } else if (e.key === 'a' || e.key === 'A') {
        toggleAutoMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [zoomIn, zoomOut, toggleAutoMode]);

  return {
    zoom,
    autoMode,
    zoomIn,
    zoomOut,
    setZoomLevel,
    toggleAutoMode,
    selectUser,
  };
};
