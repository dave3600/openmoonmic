import {
  ref,
  set,
  get,
  onValue,
  off,
  push,
  update,
  remove,
  serverTimestamp,
} from 'firebase/database';
import { realtimeDb } from './config';
import { LiveSession, SignalingData } from '../../types';

const SESSIONS_PATH = 'sessions';
const SIGNALING_PATH = 'signaling';
const LIVE_USERS_PATH = 'liveUsers';

export const createLiveSession = async (
  sessionId: string,
  hostId: string
): Promise<void> => {
  const sessionData: Omit<LiveSession, 'sessionId' | 'createdAt'> & {
    createdAt: any;
  } = {
    hostId,
    linkedUsers: [],
    status: 'live',
    audioVolume: 1.0,
    createdAt: serverTimestamp(),
  };

  await set(ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}`), sessionData);
};

export const updateLiveSession = async (
  sessionId: string,
  updates: Partial<LiveSession>
): Promise<void> => {
  await update(ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}`), updates);
};

export const endLiveSession = async (sessionId: string): Promise<void> => {
  await update(ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}`), {
    status: 'ended',
  });
};

export const linkUserToSession = async (
  sessionId: string,
  userId: string
): Promise<void> => {
  const sessionRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}/linkedUsers`);
  const snapshot = await get(sessionRef);
  const linkedUsers = snapshot.val() || [];
  
  if (!linkedUsers.includes(userId)) {
    await set(sessionRef, [...linkedUsers, userId]);
  }
};

export const unlinkUserFromSession = async (
  sessionId: string,
  userId: string
): Promise<void> => {
  const sessionRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}/linkedUsers`);
  const snapshot = await get(sessionRef);
  const linkedUsers = (snapshot.val() || []).filter((id: string) => id !== userId);
  await set(sessionRef, linkedUsers);
};

export const subscribeToLiveSession = (
  sessionId: string,
  callback: (session: LiveSession | null) => void
): (() => void) => {
  const sessionRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}`);
  
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback({
        sessionId,
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      } as LiveSession);
    } else {
      callback(null);
    }
  });

  return () => off(sessionRef);
};

export const setSignalingData = async (
  sessionId: string,
  userId: string,
  data: Partial<SignalingData>
): Promise<void> => {
  const signalingRef = ref(realtimeDb, `${SIGNALING_PATH}/${sessionId}/${userId}`);
  await update(signalingRef, data);
};

export const subscribeToSignaling = (
  sessionId: string,
  userId: string,
  callback: (data: SignalingData | null) => void
): (() => void) => {
  const signalingRef = ref(realtimeDb, `${SIGNALING_PATH}/${sessionId}/${userId}`);
  
  const unsubscribe = onValue(signalingRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as SignalingData);
    } else {
      callback(null);
    }
  });

  return () => off(signalingRef);
};

export const addIceCandidate = async (
  sessionId: string,
  userId: string,
  candidate: RTCIceCandidateInit
): Promise<void> => {
  const candidatesRef = ref(
    realtimeDb,
    `${SIGNALING_PATH}/${sessionId}/${userId}/iceCandidates`
  );
  const snapshot = await get(candidatesRef);
  const candidates = snapshot.val() || [];
  await set(candidatesRef, [...candidates, candidate]);
};

export const setLiveUser = async (
  userId: string,
  sessionId: string,
  lat: number,
  lng: number,
  status: 'live' | 'linking' | 'idle',
  audioOnly: boolean = false
): Promise<void> => {
  await set(ref(realtimeDb, `${LIVE_USERS_PATH}/${userId}`), {
    userId,
    sessionId,
    lat,
    lng,
    status,
    audioOnly,
    timestamp: serverTimestamp(),
  });
};

export const removeLiveUser = async (userId: string): Promise<void> => {
  await remove(ref(realtimeDb, `${LIVE_USERS_PATH}/${userId}`));
};

export const subscribeToLiveUsers = (
  callback: (users: Record<string, any>) => void
): (() => void) => {
  const liveUsersRef = ref(realtimeDb, LIVE_USERS_PATH);
  
  const unsubscribe = onValue(liveUsersRef, (snapshot) => {
    callback(snapshot.val() || {});
  });

  return () => off(liveUsersRef);
};
