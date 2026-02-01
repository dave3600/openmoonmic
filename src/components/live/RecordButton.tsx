import { useState, useRef } from 'react';
import { SessionRecorder } from '../../services/recording/mediaRecorder';
import { useLiveStore } from '../../stores/liveStore';

export const RecordButton = () => {
  const { localStream, peerConnections, audioOnly } = useLiveStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<SessionRecorder | null>(null);

  const handleStartRecording = async () => {
    if (!localStream) {
      alert('No local stream available');
      return;
    }

    try {
      const sessionRecorder = new SessionRecorder();
      
      // Combine local stream with remote streams
      const tracks: MediaStreamTrack[] = [...localStream.getTracks()];
      
      // Add remote audio tracks
      peerConnections.forEach((peerConn) => {
        if (peerConn.remoteStream) {
          peerConn.remoteStream.getAudioTracks().forEach((track) => {
            tracks.push(track);
          });
          if (!audioOnly) {
            peerConn.remoteStream.getVideoTracks().forEach((track) => {
              tracks.push(track);
            });
          }
        }
      });

      const combinedStream = new MediaStream(tracks);
      
      await sessionRecorder.startRecording(combinedStream, {
        video: !audioOnly,
        audio: true,
      });

      setRecorder(sessionRecorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    if (!recorder) return;

    try {
      const blob = await recorder.stopRecording();
      recorder.downloadRecording(blob, 'openmoonmic-session');
      recorder.cleanup();
      
      setRecorder(null);
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
      alert('Failed to stop recording');
    }
  };

  return (
    <button
      onClick={isRecording ? handleStopRecording : handleStartRecording}
      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
        isRecording
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {isRecording ? (
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
          Stop Recording
        </span>
      ) : (
        'Start Recording'
      )}
    </button>
  );
};
