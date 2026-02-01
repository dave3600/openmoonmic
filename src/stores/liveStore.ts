import { create } from 'zustand';
import { LiveSession, PeerConnection } from '../types';

interface LiveState {
  currentSession: LiveSession | null;
  isLive: boolean;
  linkedUsers: string[];
  peerConnections: Map<string, PeerConnection>;
  audioUrl: string | null;
  audioVolume: number;
  audioOnly: boolean;
  setCurrentSession: (session: LiveSession | null) => void;
  setIsLive: (isLive: boolean) => void;
  setLinkedUsers: (users: string[]) => void;
  addPeerConnection: (peerId: string, connection: PeerConnection) => void;
  removePeerConnection: (peerId: string) => void;
  setAudioUrl: (url: string | null) => void;
  setAudioVolume: (volume: number) => void;
  setAudioOnly: (audioOnly: boolean) => void;
  reset: () => void;
}

export const useLiveStore = create<LiveState>((set) => ({
  currentSession: null,
  isLive: false,
  linkedUsers: [],
  peerConnections: new Map(),
  audioUrl: null,
  audioVolume: 1.0,
  audioOnly: false,
  setCurrentSession: (session) => set({ currentSession: session }),
  setIsLive: (isLive) => set({ isLive }),
  setLinkedUsers: (users) => set({ linkedUsers: users }),
  addPeerConnection: (peerId, connection) =>
    set((state) => {
      const newMap = new Map(state.peerConnections);
      newMap.set(peerId, connection);
      return { peerConnections: newMap };
    }),
  removePeerConnection: (peerId) =>
    set((state) => {
      const newMap = new Map(state.peerConnections);
      newMap.delete(peerId);
      return { peerConnections: newMap };
    }),
  setAudioUrl: (url) => set({ audioUrl: url }),
  setAudioVolume: (volume) => set({ audioVolume: volume }),
  setAudioOnly: (audioOnly) => set({ audioOnly }),
  reset: () =>
    set({
      currentSession: null,
      isLive: false,
      linkedUsers: [],
      peerConnections: new Map(),
      audioUrl: null,
      audioVolume: 1.0,
      audioOnly: false,
    }),
}));
