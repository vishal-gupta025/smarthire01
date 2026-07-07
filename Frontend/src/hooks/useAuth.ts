import { useCallback } from 'react';
import { useAuthStore } from '../store/auth';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { getDashboardRoute, isUserProfileComplete } from '../utils/profile';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout, setLoading, isLoading, loadProfile } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const response = await apiClient.login(email, password);
        const { access, refresh } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // Decode and set user from token
        const tokenPayload = JSON.parse(atob(access.split('.')[1]));
        const userData: any = {
          id: tokenPayload.user_id,
          email: tokenPayload.email,
          role: tokenPayload.role,
          is_active: true,
          date_joined: new Date().toISOString(),
        };

        setUser(userData);
        await loadProfile();

        const state = useAuthStore.getState();
        const profileComplete = isUserProfileComplete(state.user, state.candidateProfile, state.recruiterProfile);
        toast.success('Logged in successfully!');
        return {
          ...userData,
          profileComplete,
          nextRoute: profileComplete ? getDashboardRoute(userData.role) : '/onboarding',
        };
      } catch (error: any) {
        const message = error.response?.data?.detail || 'Login failed';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadProfile, setUser, setLoading]
  );

  const register = useCallback(
    async (email: string, password: string, role: 'candidate' | 'recruiter') => {
      try {
        setLoading(true);
        await apiClient.register(email, password, role);
        toast.success('Registration successful! Please login.');
        return true;
      } catch (error: any) {
        // Attempt to extract meaningful message(s) from backend response
        const data = error.response?.data;
        let message = 'Registration failed';
        if (data) {
          if (typeof data === 'string') {
            message = data;
          } else if (data.message) {
            message = data.message;
          } else if (data.error) {
            message = data.error;
          } else {
            // If validation errors object, join the messages
            try {
              const parts: string[] = [];
              for (const key of Object.keys(data)) {
                const val = data[key];
                if (Array.isArray(val)) {
                  parts.push(`${key}: ${val.join(' ')}`);
                } else if (typeof val === 'string') {
                  parts.push(`${key}: ${val}`);
                }
              }
              if (parts.length) message = parts.join(' | ');
            } catch (e) {
              // fallback
              message = JSON.stringify(data);
            }
          }
        }
        console.error('Registration error:', error.response || error);
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const logoutUser = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiClient.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      logout();
      toast.success('Logged out successfully');
    }
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: logoutUser,
  };
};
