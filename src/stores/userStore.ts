import { create } from 'zustand';
import { UserPreferences } from '../types';

interface UserState {
  preferences: UserPreferences;
  blockedUsers: string[];
  taggedUsers: string[];
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  addBlockedUser: (userId: string) => void;
  removeBlockedUser: (userId: string) => void;
  addTaggedUser: (userId: string) => void;
  removeTaggedUser: (userId: string) => void;
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  audioOnly: false,
  autoLink: false,
  discoveryRadius: 1000,
};

export const useUserStore = create<UserState>((set) => ({
  preferences: defaultPreferences,
  blockedUsers: [],
  taggedUsers: [],
  setPreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),
  addBlockedUser: (userId) =>
    set((state) => ({
      blockedUsers: [...state.blockedUsers, userId],
    })),
  removeBlockedUser: (userId) =>
    set((state) => ({
      blockedUsers: state.blockedUsers.filter((id) => id !== userId),
    })),
  addTaggedUser: (userId) =>
    set((state) => ({
      taggedUsers: [...state.taggedUsers, userId],
    })),
  removeTaggedUser: (userId) =>
    set((state) => ({
      taggedUsers: state.taggedUsers.filter((id) => id !== userId),
    })),
  reset: () =>
    set({
      preferences: defaultPreferences,
      blockedUsers: [],
      taggedUsers: [],
    }),
}));
