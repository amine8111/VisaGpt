import api from './api';

export type VisaType = 'tourist' | 'business' | 'student' | 'work' | 'family' | 'transit';
export type Eligibility = 'eligible' | 'likely_eligible' | 'review' | 'not_eligible';
export type Verdict = 'good' | 'average' | 'poor' | 'critical';

export interface AssessmentFactor {
  factor: string;
  points: number;
  positive: boolean;
}

export interface VisaCriteria {
  minAge: number;
  maxAge: number;
  maxDuration: number;
  requiredDocs: string[];
}

export interface AssessmentResponse {
  assessmentId: string;
  visaType: VisaType;
  eligibility: Eligibility;
  score: number;
  recommendation: string;
  estimatedProcessingDays: number;
  suggestedMembershipTier: 'free' | 'gold' | 'premium';
  factors: AssessmentFactor[];
  issues: string[];
  recommendations: string[];
  nationalityInfo: {
    adjustment: number;
    note: string;
  };
  criteria: VisaCriteria;
}

export interface AssessmentData {
  visaType: VisaType;
  nationality: string;
  age: number;
  duration: number;
  entryType: 'single' | 'multiple' | 'double';
  hasTravelHistory?: boolean;
  hasPriorVisa?: boolean;
  financialStable?: boolean;
  employmentStatus?: 'employed' | 'self_employed' | 'student' | 'unemployed';
  purpose?: string;
}

export interface CriteriaResponse {
  visaType: VisaType;
  name: string;
  minAge: number;
  maxAge: number;
  requiredDocs: string[];
  maxDuration: number;
  processingDays: number;
  baseScore: number;
}

export interface RequiredDoc {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export const assessmentAPI = {
  runAssessment: async (data: AssessmentData): Promise<AssessmentResponse> => {
    const response = await api.post<AssessmentResponse>('/assessment/assess', data);
    return response.data;
  },

  getCriteria: async (visaType: VisaType): Promise<CriteriaResponse> => {
    const response = await api.get<CriteriaResponse>(`/assessment/criteria/${visaType}`);
    return response.data;
  },

  getRequiredDocs: async (visaType: VisaType): Promise<{ visaType: VisaType; documents: RequiredDoc[] }> => {
    const response = await api.get<{ visaType: VisaType; documents: RequiredDoc[] }>(
      `/assessment/required-docs/${visaType}`
    );
    return response.data;
  },
};
