import { LiveUser } from '../../types';
import { LATENCY_THRESHOLDS } from '../../utils/constants';

interface UserTileProps {
  user: LiveUser;
  onClick?: () => void;
}

export const UserTile = ({ user, onClick }: UserTileProps) => {
  const getStatusColor = () => {
    if (user.status === 'live') return 'bg-green-500';
    if (user.status === 'linking') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getLatencyColor = () => {
    if (!user.latency) return 'text-gray-400';
    if (user.latency < LATENCY_THRESHOLDS.low) return 'text-green-400';
    if (user.latency < LATENCY_THRESHOLDS.medium) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Generate 3-frame GIF representation based on latency
  const getFrameIndex = () => {
    if (!user.latency) return 0;
    if (user.latency < LATENCY_THRESHOLDS.low) return 0;
    if (user.latency < LATENCY_THRESHOLDS.medium) return 1;
    return 2;
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-900 rounded-lg p-3 cursor-pointer hover:bg-gray-800 transition-colors border border-gray-700 min-w-[120px]"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        <span className="text-sm font-medium truncate">{user.userId}</span>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Frame {getFrameIndex() + 1}/3</span>
        {user.latency && (
          <span className={getLatencyColor()}>
            {user.latency}ms
          </span>
        )}
      </div>

      {user.audioOnly && (
        <div className="mt-1 text-xs text-blue-400">Audio Only</div>
      )}
    </div>
  );
};
