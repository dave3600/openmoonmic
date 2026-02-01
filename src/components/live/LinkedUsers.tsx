import { useLiveStore } from '../../stores/liveStore';
import { VolumeControl } from './VolumeControl';
import { useState } from 'react';

interface LinkedUsersProps {
  onUnlink?: (userId: string) => void;
}

export const LinkedUsers = ({ onUnlink }: LinkedUsersProps) => {
  const { linkedUsers } = useLiveStore();
  const [volumes, setVolumes] = useState<Record<string, number>>(
    linkedUsers.reduce((acc, userId) => ({ ...acc, [userId]: 1.0 }), {})
  );

  const handleVolumeChange = (userId: string, volume: number) => {
    setVolumes((prev) => ({ ...prev, [userId]: volume }));
  };

  if (linkedUsers.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 text-center text-gray-400">
        No linked users. Start linking with others on the globe!
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Linked Users ({linkedUsers.length})</h3>
      
      <div className="space-y-3">
        {linkedUsers.map((userId) => (
          <div key={userId} className="flex items-center justify-between gap-4">
            <VolumeControl
              userId={userId}
              volume={volumes[userId] || 1.0}
              onVolumeChange={(vol) => handleVolumeChange(userId, vol)}
            />
            {onUnlink && (
              <button
                onClick={() => onUnlink(userId)}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
              >
                Unlink
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
