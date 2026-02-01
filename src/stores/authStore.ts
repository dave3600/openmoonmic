import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';

interface AuthState {
  user: FirebaseUser | null;
  userData: User | null;
  userId: string | null;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserData: (userData: User | null) => void;
  setUserId: (userId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  userId: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setUserId: (userId) => set({ userId }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, userData: null, userId: null, isLoading: false }),
}));
