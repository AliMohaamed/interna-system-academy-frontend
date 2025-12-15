import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';


/**
 * Interface defining the shape of our Auth Store.
 * We strictly type the State and Actions separately for clarity.
 */
interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
  
  // Helpers (Selectors)
  /**
   * Checks if the currently logged-in user has a specific permission.
   * Uses the populated role > permissions array from the backend.
   */
  hasPermission: (subject: string, action: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // Action: Login or Refresh Token Update
      setAuth: (user, accessToken) => {
        set({ 
          user, 
          accessToken, 
          isAuthenticated: true 
        });
      },

      // Action: Logout
      logout: () => {
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        });
        // Optional: We can manually clear the specific key if needed, 
        // but 'set' to null is usually enough for the UI to react.
      },

      // Helper: Check Permissions (RBAC)
      hasPermission: (subject, action) => {
        const { user } = get();

        // 1. Check if user exists
        if (!user) return false;

        // 2. Check if role and permissions exist (Defensive Programming)
        // Even if TS says it exists, runtime data might be missing if populated incorrectly.
        if (!user.role || !Array.isArray(user.role.permissions)) {
          console.warn('AuthStore: User role or permissions are missing structure.');
          return false;
        }

        // 3. Check for the specific permission
        return user.role.permissions.some(
          (p) => p.subject === subject && p.action === action
        );
      },
    }),
    {
      name: 'codk-auth-storage', // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use LocalStorage
      
      // Optimization: Only persist these fields. 
      // We don't need to persist functions/helpers.
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);