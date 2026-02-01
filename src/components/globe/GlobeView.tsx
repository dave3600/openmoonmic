import { useEffect, useRef } from 'react';
import Globe from 'globe.gl';
import { useGlobeStore } from '../../stores/globeStore';
import { LiveUser } from '../../types';
import { UserTile } from './UserTile';
import { MoonView } from './MoonView';
import { GLOBE_CONFIG } from '../../utils/constants';

interface GlobeViewProps {
  onUserSelect?: (userId: string) => void;
}

export const GlobeView = ({ onUserSelect }: GlobeViewProps) => {
  const globeEl = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const { liveUsers, zoom, isMoonView, setIsMoonView } = useGlobeStore();

  useEffect(() => {
    if (!globeEl.current) return;

    const globe = Globe()(globeEl.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .showAtmosphere(true)
      .atmosphereColor('#3a3a3a')
      .atmosphereAltitude(0.15);

    globeRef.current = globe;

    return () => {
      if (globeRef.current) {
        globeRef.current._destructor?.();
      }
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;

    const usersArray = Array.from(liveUsers.values());
    
    // Convert users to points on globe
    const points = usersArray.map((user) => ({
      lat: user.lat,
      lng: user.lng,
      size: 0.5,
      color: user.status === 'live' ? '#00ff00' : user.status === 'linking' ? '#ffff00' : '#888888',
      userId: user.userId,
    }));

    globeRef.current.pointsData(points);

    // Handle point click
    globeRef.current.onPointClick((point: any) => {
      if (onUserSelect && point.userId) {
        onUserSelect(point.userId);
      }
    });
  }, [liveUsers, onUserSelect]);

  useEffect(() => {
    if (!globeRef.current) return;

    const currentZoom = Math.max(GLOBE_CONFIG.minZoom, Math.min(zoom, GLOBE_CONFIG.maxZoom));
    globeRef.current.cameraDistance(currentZoom * 200);

    if (currentZoom <= GLOBE_CONFIG.moonViewThreshold) {
      setIsMoonView(true);
    } else {
      setIsMoonView(false);
    }
  }, [zoom, setIsMoonView]);

  if (isMoonView) {
    return <MoonView />;
  }

  return (
    <div className="relative w-full h-full">
      <div ref={globeEl} className="w-full h-full" />
      <div className="absolute top-4 left-4 space-y-2">
        {Array.from(liveUsers.values()).map((user) => (
          <UserTile
            key={user.userId}
            user={user}
            onClick={() => onUserSelect?.(user.userId)}
          />
        ))}
      </div>
    </div>
  );
};
