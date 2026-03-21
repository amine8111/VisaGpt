import api from './api';

export interface FaceVerificationResponse {
  verified: boolean;
  confidence: string;
  timestamp: string;
  verificationId: string;
}

export interface LivenessResponse {
  isLive: boolean;
  confidence: string;
  message: string;
}

export interface RiskAnalysisResponse {
  riskLevel: 'high' | 'medium' | 'low';
  riskScore: number;
  flags: {
    flagged: boolean;
    reason?: string;
    type: string;
    count?: number;
  }[];
  shouldBlock: boolean;
}

export interface SmartAllocationResponse {
  priorityScore: number;
  suggestedTimeSlot: 'morning' | 'afternoon';
  processingTier: 'express' | 'standard';
}

export const aiAPI = {
  verifyFace: async (passportImage: string, selfieImage: string): Promise<FaceVerificationResponse> => {
    const response = await api.post<FaceVerificationResponse>('/ai/verify-face', {
      passportImage,
      selfieImage,
    });
    return response.data;
  },

  checkLiveness: async (selfieImage: string): Promise<LivenessResponse> => {
    const response = await api.post<LivenessResponse>('/ai/check-liveness', {
      selfieImage,
    });
    return response.data;
  },

  analyzeRisk: async (data: {
    passportNumber?: string;
    email?: string;
    ipAddress?: string;
  }): Promise<RiskAnalysisResponse> => {
    const response = await api.post<RiskAnalysisResponse>('/ai/analyze-risk', data);
    return response.data;
  },

  getSmartAllocation: async (params: {
    visaType?: string;
    travelHistory?: 'extensive' | 'moderate' | 'none';
    urgency?: 'high' | 'medium' | 'low';
  }): Promise<SmartAllocationResponse> => {
    const response = await api.get<SmartAllocationResponse>('/ai/smart-allocation', { params });
    return response.data;
  },
};
