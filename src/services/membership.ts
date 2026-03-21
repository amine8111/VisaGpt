import api from './api';

export type MembershipTier = 'free' | 'gold' | 'premium';

export interface MembershipPlan {
  name: string;
  price: number;
  features: string[];
  appointmentLimit: number;
  priorityScore: number;
  hasPrioritySlots: boolean;
  hasFaceToFace: boolean;
  hasExpressProcessing: boolean;
  hasVipSupport: boolean;
}

export interface MembershipPlans {
  free: MembershipPlan;
  gold: MembershipPlan;
  premium: MembershipPlan;
}

export interface Meeting {
  _id: string;
  meetingId: string;
  userId: string;
  agentId?: string;
  meetingDate: string;
  meetingTime: string;
  location: string;
  meetingType: 'document_check' | 'interview' | 'general';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  documentsToBring: {
    name: string;
    verified: boolean;
  }[];
  verificationStatus?: 'pending' | 'verified' | 'issues_found';
  issuesFound?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MyMembership {
  tier: MembershipTier;
  startDate?: string;
  expiryDate?: string;
  isActive: boolean;
  appointmentsThisMonth: number;
  limit: number;
  plan: MembershipPlan;
}

const DEMO_MODE = true;

const defaultPlan: MembershipPlan = {
  name: 'Free',
  price: 0,
  features: ['Document checklist', 'Basic assessment'],
  appointmentLimit: 1,
  priorityScore: 0,
  hasPrioritySlots: false,
  hasFaceToFace: false,
  hasExpressProcessing: false,
  hasVipSupport: false,
};

const plans: MembershipPlans = {
  free: defaultPlan,
  gold: {
    name: 'Gold',
    price: 5000,
    features: ['Detailed assessment', 'Smart advice', 'Schengen form', 'Document organizer', 'Financial planner', 'Letter generator'],
    appointmentLimit: 3,
    priorityScore: 50,
    hasPrioritySlots: true,
    hasFaceToFace: false,
    hasExpressProcessing: true,
    hasVipSupport: false,
  },
  premium: {
    name: 'Premium',
    price: 15000,
    features: ['All Gold features', 'Translation', 'Insurance', 'Photo capture', 'Agent booking', 'Recours generator'],
    appointmentLimit: 10,
    priorityScore: 100,
    hasPrioritySlots: true,
    hasFaceToFace: true,
    hasExpressProcessing: true,
    hasVipSupport: true,
  },
};

export const membershipAPI = {
  getPlans: async (): Promise<{ plans: MembershipPlans }> => {
    if (DEMO_MODE) {
      return { plans };
    }
    const response = await api.get<{ plans: MembershipPlans }>('/membership/plans');
    return response.data;
  },

  getMyMembership: async (): Promise<MyMembership> => {
    if (DEMO_MODE) {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Not authenticated');
      const user = JSON.parse(userStr);
      const tier: MembershipTier = user.membership?.tier || 'free';
      return {
        tier,
        startDate: user.membership?.startDate || new Date().toISOString(),
        isActive: true,
        appointmentsThisMonth: 0,
        limit: plans[tier].appointmentLimit,
        plan: plans[tier],
      };
    }
    const response = await api.get<MyMembership>('/membership/my-membership');
    return response.data;
  },

  upgrade: async (tier: 'gold' | 'premium', durationMonths: number = 1): Promise<{
    message: string;
    membership: {
      tier: MembershipTier;
      startDate: string;
      expiryDate: string;
      plan: MembershipPlan;
    };
  }> => {
    if (DEMO_MODE) {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Not authenticated');
      const user = JSON.parse(userStr);
      
      const startDate = new Date();
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
      
      user.membership = {
        tier,
        startDate: startDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        appointmentsThisMonth: 0,
      };
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        message: 'Membership upgraded (Demo)',
        membership: {
          tier,
          startDate: startDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          plan: plans[tier as MembershipTier],
        },
      };
    }
    const response = await api.post('/membership/upgrade', { tier, durationMonths });
    return response.data;
  },

  bookMeeting: async (data: {
    meetingDate: string;
    meetingTime: string;
    meetingType?: 'document_check' | 'interview' | 'general';
    notes?: string;
  }): Promise<{ message: string; meeting: Meeting }> => {
    if (DEMO_MODE) {
      return {
        message: 'Meeting booked (Demo)',
        meeting: {
          _id: 'meeting-' + Date.now(),
          meetingId: 'MTG-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          userId: 'demo-user',
          meetingDate: data.meetingDate,
          meetingTime: data.meetingTime,
          location: 'Algiers Office',
          meetingType: data.meetingType || 'general',
          status: 'scheduled',
          documentsToBring: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }
    const response = await api.post<{ message: string; meeting: Meeting }>('/membership/book-meeting', data);
    return response.data;
  },

  getMyMeetings: async (): Promise<{ meetings: Meeting[] }> => {
    if (DEMO_MODE) {
      return { meetings: [] };
    }
    const response = await api.get<{ meetings: Meeting[] }>('/membership/my-meetings');
    return response.data;
  },

  getMeeting: async (id: string): Promise<{ meeting: Meeting }> => {
    if (DEMO_MODE) {
      throw new Error('Meeting not found');
    }
    const response = await api.get<{ meeting: Meeting }>(`/membership/meeting/${id}`);
    return response.data;
  },

  cancelMeeting: async (id: string): Promise<{ message: string }> => {
    if (DEMO_MODE) {
      return { message: 'Meeting cancelled (Demo)' };
    }
    const response = await api.put<{ message: string }>(`/membership/meeting/${id}/cancel`);
    return response.data;
  },
};
