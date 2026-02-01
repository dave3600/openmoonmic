import { useLiveStream } from '../../hooks/useLiveStream';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useLatencyMonitor } from '../../hooks/useLatencyMonitor';
import { useAuthStore } from '../../stores/authStore';
import { useLiveStore } from '../../stores/liveStore';
import { AudioPlayer } from './AudioPlayer';
import { LinkedUsers } from './LinkedUsers';
import { RecordButton } from './RecordButton';
import { useState, useEffect, useRef } from 'react';

export const LiveSession = () => {
  const { userId } = useAuthStore();
  const { audioOnly, setAudioOnly } = useLiveStore();
  const {
    isLive,
    localStream,
    currentSession,
    linkedUsers,
    startLive,
    stopLive,
    linkUser,
    unlinkUser,
  } = useLiveStream();
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const { connections } = useWebRTC({
    sessionId: currentSession?.sessionId || '',
    userId: userId || '',
    localStream: localStream || undefined,
    peerUserIds: linkedUsers,
    onRemoteStream: (peerId, stream) => {
      setRemoteStreams((prev) => {
        const newMap = new Map(prev);
        newMap.set(peerId, stream);
        return newMap;
      });
    },
  });

  // Monitor latency for GIF frame updates
  useLatencyMonitor();

  // Attach remote streams to video elements
  useEffect(() => {
    remoteStreams.forEach((stream, peerId) => {
      const video = videoRefs.current.get(peerId);
      if (video) {
        video.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  const handleStartLive = async () => {
    await startLive();
  };

  const handleStopLive = async () => {
    await stopLive();
  };

  const handleUnlink = async (targetUserId: string) => {
    await unlinkUser(targetUserId);
    setRemoteStreams((prev) => {
      const newMap = new Map(prev);
      newMap.delete(targetUserId);
      return newMap;
    });
  };

  if (!isLive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Go Live</h2>
          <p className="text-gray-400">Start a live session and connect with other users</p>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={audioOnly}
              onChange={(e) => setAudioOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Audio Only Mode</span>
          </label>
        </div>

        <button
          onClick={handleStartLive}
          className="px-8 py-4 bg-red-600 rounded-lg font-semibold hover:bg-red-700 text-lg"
        >
          Start Live Session
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Session</h2>
        <button
          onClick={handleStopLive}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          End Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Stream</h3>
            {localStream && (
              <video
                ref={(el) => {
                  if (el) {
                    el.srcObject = localStream;
                    el.play();
                  }
                }}
                autoPlay
                muted
                playsInline
                className="w-full rounded"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
              <div key={peerId} className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">{peerId}</h4>
                <video
                  ref={(el) => {
                    if (el) {
                      videoRefs.current.set(peerId, el);
                      el.srcObject = stream;
                      el.play();
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <AudioPlayer />
          <LinkedUsers onUnlink={handleUnlink} />
          <RecordButton />
        </div>
      </div>
    </div>
  );
};
