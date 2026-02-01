import { useLiveStore } from '../../stores/liveStore';

interface VolumeControlProps {
  userId: string;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl = ({ userId, volume, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 min-w-[100px] truncate">{userId}</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="flex-1"
      />
      <span className="text-sm text-gray-400 w-12 text-right">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
};
