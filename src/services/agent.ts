import api from './api';
import { Appointment, Slot, VisaType } from './appointments';
import { User } from './auth';

export interface BulkBookData {
  date: string;
  time: string;
  count: number;
  visaType?: VisaType;
}

export interface BulkBookResponse {
  message: string;
  booked: number;
  appointments: Appointment[];
}

export interface AssignAppointmentData {
  appointmentId: string;
  applicantEmail: string;
}

export const agentAPI = {
  bulkBook: async (data: BulkBookData): Promise<BulkBookResponse> => {
    const response = await api.post<BulkBookResponse>('/agent/bulk-book', data);
    return response.data;
  },

  getSlots: async (date?: string): Promise<{ slots: Slot[] }> => {
    const response = await api.get<{ slots: Slot[] }>('/agent/slots', {
      params: { date },
    });
    return response.data;
  },

  assignAppointment: async (data: AssignAppointmentData): Promise<{
    message: string;
    appointment: Appointment;
  }> => {
    const response = await api.post<{ message: string; appointment: Appointment }>(
      '/agent/assign-appointment',
      data
    );
    return response.data;
  },

  getAppointments: async (params?: {
    status?: string;
    date?: string;
  }): Promise<{ appointments: Appointment[] }> => {
    const response = await api.get<{ appointments: Appointment[] }>('/agent/appointments', {
      params,
    });
    return response.data;
  },

  getClients: async (): Promise<{ clients: User[] }> => {
    const response = await api.get<{ clients: User[] }>('/agent/clients');
    return response.data;
  },
};
