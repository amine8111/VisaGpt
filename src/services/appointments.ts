import api from './api';
import { PaginatedResponse } from './api';

export type VisaType = 'tourist' | 'business' | 'student' | 'work' | 'family' | 'transit';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'flagged';

export interface ApplicationData {
  passportNumber?: string;
  purpose?: string;
  duration?: string;
  destination?: string;
  entryType?: string;
}

export interface FraudFlag {
  type: string;
  reason: string;
  timestamp: string;
}

export interface Appointment {
  _id: string;
  appointmentId: string;
  userId: string;
  agentId?: string;
  visaType: VisaType;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  qrCode?: string;
  isReservedByAgent: boolean;
  isPublic: boolean;
  documents: any[];
  fraudFlags: FraudFlag[];
  priorityScore: number;
  confirmationSent: boolean;
  applicationData: ApplicationData;
  createdAt: string;
  updatedAt: string;
}

export interface BookAppointmentData {
  visaType: VisaType;
  appointmentDate: string;
  appointmentTime: string;
  passportNumber?: string;
  purpose?: string;
  duration?: string;
  destination?: string;
  entryType?: string;
}

export interface MembershipInfo {
  tier: 'free' | 'gold' | 'premium';
  appointmentsThisMonth: number;
  remainingBookings: 'available' | 'limit_reached';
}

export interface BookAppointmentResponse {
  message: string;
  appointment: Appointment;
  membershipInfo: MembershipInfo;
}

export interface Slot {
  _id: string;
  date: string;
  time: string;
  totalSlots: number;
  agentReservedPercent: number;
  agentReservedSlots: number;
  publicSlots: number;
  agentBooked: number;
  publicBooked: number;
  isActive: boolean;
  availableAgentSlots?: number;
  availablePublicSlots?: number;
}

export const appointmentAPI = {
  book: async (data: BookAppointmentData): Promise<BookAppointmentResponse> => {
    const response = await api.post<BookAppointmentResponse>('/appointments/book', data);
    return response.data;
  },

  getMyAppointments: async (): Promise<{ appointments: Appointment[] }> => {
    const response = await api.get<{ appointments: Appointment[] }>('/appointments/my-appointments');
    return response.data;
  },

  getAppointment: async (id: string): Promise<{ appointment: Appointment }> => {
    const response = await api.get<{ appointment: Appointment }>(`/appointments/${id}`);
    return response.data;
  },

  cancel: async (id: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/appointments/cancel/${id}`);
    return response.data;
  },

  getAll: async (params?: {
    status?: AppointmentStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>('/appointments', { params });
    return response.data;
  },
};
