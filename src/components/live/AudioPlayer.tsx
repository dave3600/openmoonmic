import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useState, useRef } from 'react';

export const AudioPlayer = () => {
  const {
    source,
    isPlaying,
    loadYouTubeVideo,
    loadAudioFile,
    play,
    pause,
    setVolume,
    audioVolume,
    audioRef,
  } = useAudioPlayer();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleYouTubeLoad = () => {
    // Extract video ID from URL
    const match = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (match && match[1]) {
      loadYouTubeVideo(match[1]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      loadAudioFile(file);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Background Audio</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">YouTube URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleYouTubeLoad}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Load
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Audio File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700"
          >
            Select Audio File
          </button>
        </div>
      </div>

      {source && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <button
              onClick={isPlaying ? pause : play}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Volume: {Math.round(audioVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioVolume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div id="youtube-player" className="hidden" />
          {source === 'file' && (
            <audio ref={audioRef} className="w-full" />
          )}
        </div>
      )}
    </div>
  );
};
