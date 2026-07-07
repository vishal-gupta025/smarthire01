import { create } from 'zustand';
import { User, CandidateProfile, RecruiterProfile } from '../types';
import apiClient from '../api/client';

const decodeToken = (token: string): Partial<User> | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.user_id,
      email: payload.email,
      role: payload.role,
      is_active: true,
      date_joined: new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

interface AuthState {
  user: User | null;
  candidateProfile: CandidateProfile | null;
  recruiterProfile: RecruiterProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profileStatus: 'idle' | 'loading' | 'loaded';

  // Actions
  setUser: (user: User | null) => void;
  setCandidateProfile: (profile: CandidateProfile | null) => void;
  setRecruiterProfile: (profile: RecruiterProfile | null) => void;
  setLoading: (loading: boolean) => void;
  loadProfile: () => Promise<CandidateProfile | RecruiterProfile | null>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  candidateProfile: null,
  recruiterProfile: null,
  isAuthenticated: false,
  isLoading: false,
  profileStatus: 'idle',

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setCandidateProfile: (candidateProfile) =>
    set({ candidateProfile }),

  setRecruiterProfile: (recruiterProfile) =>
    set({ recruiterProfile }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  loadProfile: async () => {
    const { user, profileStatus } = get();

    if (!user || profileStatus === 'loading') {
      return null;
    }

    set({ profileStatus: 'loading' });

    try {
      if (user.role === 'CANDIDATE') {
        const response = await apiClient.getCandidateProfile();
        set({ candidateProfile: response.data, recruiterProfile: null, profileStatus: 'loaded' });
        return response.data;
      }

      if (user.role === 'RECRUITER') {
        const response = await apiClient.getRecruiterProfile();
        set({ recruiterProfile: response.data, candidateProfile: null, profileStatus: 'loaded' });
        return response.data;
      }

      set({ profileStatus: 'loaded' });
      return null;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        set({ profileStatus: 'loaded' });
        return null;
      }

      set({ profileStatus: 'loaded' });
      throw error;
    }
  },

  logout: () =>
    set({
      user: null,
      candidateProfile: null,
      recruiterProfile: null,
      isAuthenticated: false,
      profileStatus: 'idle',
    }),

  hydrate: () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({
        user: null,
        candidateProfile: null,
        recruiterProfile: null,
        isAuthenticated: false,
        profileStatus: 'idle',
      });
      return;
    }

    const user = decodeToken(token);
    set({
      user: user as User | null,
      isAuthenticated: true,
      profileStatus: 'idle',
    });
  },
}));

// UI Store
interface UIState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  theme: 'light',
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),
  setTheme: (theme) =>
    set({ theme }),
}));
