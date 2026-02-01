import { useEffect } from 'react';
import { useGlobeStore } from '../../stores/globeStore';
import { subscribeToLiveUsers } from '../../services/firebase/realtime';
import { LiveUser } from '../../types';
import { GlobeView } from '../globe/GlobeView';
import { GlobeControls } from '../globe/GlobeControls';
import { LinkButton } from './LinkButton';
import { useAuthStore } from '../../stores/authStore';
import { useLiveStore } from '../../stores/liveStore';

export const UserDiscovery = () => {
  const { userId } = useAuthStore();
  const { setLiveUsers, autoMode, selectedUserId, liveUsers, setSelectedUserId } = useGlobeStore();

  useEffect(() => {
    const unsubscribe = subscribeToLiveUsers((users) => {
      const usersMap = new Map<string, LiveUser>();
      
      Object.entries(users).forEach(([key, userData]: [string, any]) => {
        if (key !== userId) {
          usersMap.set(key, {
            userId: key,
            sessionId: userData.sessionId || '',
            lat: userData.lat || 0,
            lng: userData.lng || 0,
            status: userData.status || 'live',
            latency: userData.latency,
            audioOnly: userData.audioOnly || false,
          });
        }
      });

      setLiveUsers(usersMap);
    });

    return unsubscribe;
  }, [userId, setLiveUsers]);

  // Auto-random selection in auto mode
  useEffect(() => {
    if (!autoMode) return;

    const usersArray = Array.from(liveUsers.values());
    
    if (usersArray.length > 0) {
      const randomUser = usersArray[Math.floor(Math.random() * usersArray.length)];
      // Auto-link logic would go here
      setSelectedUserId(randomUser.userId);
    }
  }, [autoMode, liveUsers, setSelectedUserId]);

  const handleUserSelect = (selectedUserId: string) => {
    setSelectedUserId(selectedUserId);
  };

  return (
    <div className="relative w-full h-screen">
      <GlobeView onUserSelect={handleUserSelect} />
      <GlobeControls />
      
      {selectedUserId && (
        <div className="absolute top-4 right-4 bg-gray-900 rounded-lg p-4 border border-gray-700">
          <LinkButton userId={selectedUserId} />
        </div>
      )}
    </div>
  );
};
