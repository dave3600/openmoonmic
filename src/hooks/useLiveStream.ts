import { useEffect, useState, useCallback } from 'react';
import { useLiveStore } from '../stores/liveStore';
import { useAuthStore } from '../stores/authStore';
import {
  createLiveSession,
  endLiveSession,
  subscribeToLiveSession,
  linkUserToSession,
  unlinkUserFromSession,
  setLiveUser,
  removeLiveUser,
} from '../services/firebase/realtime';
import { getUserMedia, stopMediaStream } from '../services/webrtc/mediaStream';

export const useLiveStream = () => {
  const { userId } = useAuthStore();
  const {
    currentSession,
    isLive,
    linkedUsers,
    setCurrentSession,
    setIsLive,
    setLinkedUsers,
    audioOnly,
  } = useLiveStore();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startLive = useCallback(async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      // Get user media
      const stream = await getUserMedia(true, !audioOnly);
      setLocalStream(stream);

      // Create session
      const sessionId = `session_${userId}_${Date.now()}`;
      await createLiveSession(sessionId, userId);

      // Set user as live
      // Generate random lat/lng for demo (in production, use actual location or user preference)
      const lat = (Math.random() - 0.5) * 180;
      const lng = (Math.random() - 0.5) * 360;
      await setLiveUser(userId, sessionId, lat, lng, 'live', audioOnly);

      setIsLive(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to start live stream');
      console.error('Error starting live stream:', err);
    }
  }, [userId, audioOnly, setIsLive]);

  const stopLive = useCallback(async () => {
    if (currentSession) {
      await endLiveSession(currentSession.sessionId);
    }

    if (userId) {
      await removeLiveUser(userId);
    }

    if (localStream) {
      stopMediaStream(localStream);
      setLocalStream(null);
    }

    setIsLive(false);
    setCurrentSession(null);
    setLinkedUsers([]);
  }, [currentSession, userId, localStream, setIsLive, setCurrentSession, setLinkedUsers]);

  const linkUser = useCallback(
    async (targetUserId: string) => {
      if (currentSession) {
        await linkUserToSession(currentSession.sessionId, targetUserId);
        setLinkedUsers([...linkedUsers, targetUserId]);
      }
    },
    [currentSession, linkedUsers, setLinkedUsers]
  );

  const unlinkUser = useCallback(
    async (targetUserId: string) => {
      if (currentSession) {
        await unlinkUserFromSession(currentSession.sessionId, targetUserId);
        setLinkedUsers(linkedUsers.filter((id) => id !== targetUserId));
      }
    },
    [currentSession, linkedUsers, setLinkedUsers]
  );

  // Subscribe to session updates
  useEffect(() => {
    if (!currentSession) return;

    const unsubscribe = subscribeToLiveSession(
      currentSession.sessionId,
      (session) => {
        if (session) {
          setCurrentSession(session);
          setLinkedUsers(session.linkedUsers);
        }
      }
    );

    return unsubscribe;
  }, [currentSession?.sessionId, setCurrentSession, setLinkedUsers]);

  return {
    isLive,
    localStream,
    currentSession,
    linkedUsers,
    error,
    startLive,
    stopLive,
    linkUser,
    unlinkUser,
  };
};
