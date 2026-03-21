import api from './api';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'applicant' | 'agent' | 'admin';
  isVerified: boolean;
  faceVerified: boolean;
  nationality?: string;
  dateOfBirth?: string;
  passportNumber?: string;
  profileImage?: string;
  membership: {
    tier: 'free' | 'gold' | 'premium';
    startDate?: string;
    expiryDate?: string;
    appointmentsThisMonth: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role?: 'applicant' | 'agent' | 'admin';
  nationality?: string;
  dateOfBirth?: string;
  passportNumber?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

const DEMO_MODE = true;

const mockUser: User = {
  _id: 'demo-user-001',
  email: 'demo@visagpt.dz',
  fullName: 'مستخدم تجريبي',
  phone: '0555123456',
  role: 'applicant',
  isVerified: true,
  faceVerified: false,
  nationality: 'Algeria',
  membership: {
    tier: 'premium',
    startDate: new Date().toISOString(),
    appointmentsThisMonth: 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function generateToken(): string {
  return 'demo-token-' + Math.random().toString(36).substring(2);
}

export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (data.email === 'demo@visagpt.dz' && data.password === 'demo123') {
      const token = generateToken();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { message: 'Login successful (Demo)', token, user: mockUser };
    }
    
    const storedUsers = JSON.parse(localStorage.getItem('demoUsers') || '{}');
    const storedUser = storedUsers[data.email];
    
    if (storedUser && storedUser.password === data.password) {
      const { password, ...user } = storedUser;
      const token = generateToken();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { message: 'Login successful (Demo)', token, user };
    }
    
    throw new Error('Invalid credentials. Please check your email and password.');
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUsers = JSON.parse(localStorage.getItem('demoUsers') || '{}');
    
    if (storedUsers[data.email]) {
      throw new Error('This email is already registered. Please login instead.');
    }
    
    const newUser: User = {
      _id: 'user-' + Date.now(),
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: 'applicant',
      isVerified: false,
      faceVerified: false,
      nationality: 'Algeria',
      membership: {
        tier: 'free',
        startDate: new Date().toISOString(),
        appointmentsThisMonth: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    storedUsers[data.email] = { ...newUser, password: data.password };
    localStorage.setItem('demoUsers', JSON.stringify(storedUsers));
    
    const token = generateToken();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return { message: 'Registration successful (Demo)', token, user: newUser };
  },

  getMe: async (): Promise<{ user: User }> => {
    const user = authAPI.getCurrentUser();
    if (user) return { user };
    throw new Error('Not authenticated');
  },

  updateProfile: async (data: Partial<User>): Promise<{ message: string; user: User }> => {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const updatedUser = { ...currentUser, ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return { message: 'Profile updated', user: updatedUser };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },
};
