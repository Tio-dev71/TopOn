import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'REVIEWER' | 'ADVERTISER' | 'ADMIN';
  isVerified: boolean;
  profile?: {
    fullName?: string;
    avatarUrl?: string;
    companyName?: string;
  };
  reviewerProfile?: any;
  advertiserProfile?: any;
  wallet?: { balance: number; currency: string };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      setAuth: (user, accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        set({ user, accessToken });
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null });
      },

      fetchMe: async () => {
        try {
          set({ isLoading: true });
          const { data } = await api.get('/auth/me');
          set({ user: data.data });
        } catch {
          get().clearAuth();
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'topon-auth',
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
