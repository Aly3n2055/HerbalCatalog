
import { apiClient } from './api';

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<{ success: boolean; user: User; message: string }>('/.netlify/functions/auth-login', credentials);
    if (response.success && response.user) {
      return response.user;
    }
    throw new Error(response.message || 'Login failed');
  },

  // Register new user
  async register(userData: RegisterData): Promise<User> {
    const response = await apiClient.post<{ success: boolean; user: User; message: string }>('/.netlify/functions/auth-register', userData);
    if (response.success && response.user) {
      return response.user;
    }
    throw new Error(response.message || 'Registration failed');
  },

  // Logout user (if session-based)
  async logout(): Promise<void> {
    // For now, just clear local storage - no server call needed
    return Promise.resolve();
  },

  // Get current user session
  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiClient.get<User>('/me');
    } catch (error) {
      return null;
    }
  },
};
