import { create } from 'zustand';
import { LiveUser } from '../types';

interface GlobeState {
  zoom: number;
  autoMode: boolean;
  selectedUserId: string | null;
  liveUsers: Map<string, LiveUser>;
  isMoonView: boolean;
  setZoom: (zoom: number) => void;
  setAutoMode: (auto: boolean) => void;
  setSelectedUserId: (userId: string | null) => void;
  setLiveUsers: (users: Map<string, LiveUser>) => void;
  updateLiveUser: (userId: string, updates: Partial<LiveUser>) => void;
  removeLiveUser: (userId: string) => void;
  setIsMoonView: (isMoonView: boolean) => void;
}

export const useGlobeStore = create<GlobeState>((set, get) => ({
  zoom: 1.0,
  autoMode: false,
  selectedUserId: null,
  liveUsers: new Map(),
  isMoonView: false,
  setZoom: (zoom) => {
    const { GLOBE_CONFIG } = require('../utils/constants');
    set({
      zoom,
      isMoonView: zoom <= GLOBE_CONFIG.moonViewThreshold,
    });
  },
  setAutoMode: (auto) => set({ autoMode: auto }),
  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
  setLiveUsers: (users) => set({ liveUsers: users }),
  updateLiveUser: (userId, updates) =>
    set((state) => {
      const newMap = new Map(state.liveUsers);
      const existing = newMap.get(userId);
      if (existing) {
        newMap.set(userId, { ...existing, ...updates });
      } else {
        newMap.set(userId, { userId, lat: 0, lng: 0, status: 'live', ...updates });
      }
      return { liveUsers: newMap };
    }),
  removeLiveUser: (userId) =>
    set((state) => {
      const newMap = new Map(state.liveUsers);
      newMap.delete(userId);
      return { liveUsers: newMap };
    }),
  setIsMoonView: (isMoonView) => set({ isMoonView }),
}));
