import api from './api';
import { Appointment, Slot, VisaType } from './appointments';
import { User } from './auth';
import { Meeting } from './membership';

export interface DashboardStats {
  totalUsers: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  flaggedAppointments: number;
  todayAppointments: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentAppointments: Appointment[];
  appointmentsByStatus: { status: string; count: number }[];
}

export interface FraudStats {
  total: number;
  byType: Record<string, { count: number; examples: any[] }>;
}

export interface FraudPatternsResponse {
  fraudStats: FraudStats;
  flaggedAppointments: Appointment[];
}

export interface SlotAllocationData {
  date: string;
  time: string;
  agentReservedPercent: number;
}

export interface GenerateSlotsData {
  startDate: string;
  endDate: string;
  slotsPerDay?: number;
  timeSlots: string[];
}

export interface Setting {
  _id: string;
  key: string;
  value: string;
  description?: string;
  category?: string;
}

export interface PaginatedResponse<T> {
  appointments?: T[];
  users?: User[];
  meetings?: Meeting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const adminAPI = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get<DashboardResponse>('/admin/dashboard');
    return response.data;
  },

  getAppointments: async (params?: {
    status?: string;
    flag?: boolean;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>('/admin/appointments', { params });
    return response.data;
  },

  updateAppointmentStatus: async (
    id: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'flagged'
  ): Promise<{ message: string; appointment: Appointment }> => {
    const response = await api.put<{ message: string; appointment: Appointment }>(
      `/admin/appointments/${id}/status`,
      { status }
    );
    return response.data;
  },

  updateSlotAllocation: async (data: SlotAllocationData): Promise<{
    message: string;
    slot: Slot;
  }> => {
    const response = await api.put<{ message: string; slot: Slot }>('/admin/slot-allocation', data);
    return response.data;
  },

  getFraudPatterns: async (): Promise<FraudPatternsResponse> => {
    const response = await api.get<FraudPatternsResponse>('/admin/fraud-patterns');
    return response.data;
  },

  getUsers: async (params?: {
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/admin/users', { params });
    return response.data;
  },

  getSettings: async (): Promise<{ settings: Setting[] }> => {
    const response = await api.get<{ settings: Setting[] }>('/admin/settings');
    return response.data;
  },

  updateSettings: async (data: Partial<Setting>): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>('/admin/settings', data);
    return response.data;
  },

  generateSlots: async (data: GenerateSlotsData): Promise<{ message: string; generated: number }> => {
    const response = await api.post<{ message: string; generated: number }>('/admin/slots/generate', data);
    return response.data;
  },

  getMeetings: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Meeting>> => {
    const response = await api.get<PaginatedResponse<Meeting>>('/admin/meetings', { params });
    return response.data;
  },

  getMeeting: async (id: string): Promise<{ meeting: Meeting }> => {
    const response = await api.get<{ meeting: Meeting }>(`/admin/meetings/meeting/${id}`);
    return response.data;
  },

  updateMeetingStatus: async (
    id: string,
    data: {
      status?: string;
      notes?: string;
      documentsToBring?: any[];
      verificationStatus?: string;
      issuesFound?: string[];
    }
  ): Promise<{ message: string; meeting: Meeting }> => {
    const response = await api.put<{ message: string; meeting: Meeting }>(
      `/admin/meetings/meeting/${id}/status`,
      data
    );
    return response.data;
  },

  assignMeetingAgent: async (id: string, agentId: string): Promise<{
    message: string;
    meeting: Meeting;
  }> => {
    const response = await api.put<{ message: string; meeting: Meeting }>(
      `/admin/meetings/meeting/${id}/assign`,
      { agentId }
    );
    return response.data;
  },

  rescheduleMeeting: async (
    id: string,
    data: { meetingDate: string; meetingTime: string }
  ): Promise<{ message: string; meeting: Meeting }> => {
    const response = await api.put<{ message: string; meeting: Meeting }>(
      `/admin/meetings/meeting/${id}/reschedule`,
      data
    );
    return response.data;
  },
};
