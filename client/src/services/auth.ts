
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
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    return apiClient.post<User>('/login', credentials);
  },

  // Register new user
  async register(userData: RegisterData): Promise<User> {
    return apiClient.post<User>('/register', userData);
  },

  // Logout user (if session-based)
  async logout(): Promise<void> {
    return apiClient.post('/logout');
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
