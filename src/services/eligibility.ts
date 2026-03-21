import api from './api';

export interface EligibilityCheck {
  item: string;
  status: 'pass' | 'fail' | 'warn' | 'recommend';
  detail: string;
}

export interface CountryRequirement {
  minBankBalance: number;
  minAccountAge: number;
  minMonthlyIncome: number;
  travelInsurance: boolean;
  accommodationProof: boolean;
  englishTest?: boolean;
  interviewRequired?: boolean;
  biometricsRequired?: boolean;
  healthCheck?: boolean;
}

export interface EligibilityResponse {
  eligibilityId: string;
  destination: string;
  visaType: string;
  nationality: string;
  eligibility: 'eligible' | 'likely_eligible' | 'conditional' | 'not_eligible';
  eligibilityLabel: string;
  overallScore: number;
  processingTime: string;
  region: string;
  checks: EligibilityCheck[];
  missingRequirements: string[];
  suggestions: string[];
  recommendedDocs: string[];
}

export interface EligibilityData {
  destination: string;
  visaType: string;
  nationality: string;
  age: number;
  bankBalance: number;
  monthlyIncome: number;
  accountAge?: number;
  employmentStatus?: 'employed' | 'self_employed' | 'student' | 'retired' | 'unemployed';
  hasTravelHistory?: boolean;
  hasPriorRejection?: boolean;
  passportValidity?: number;
}

export interface CountryInfo {
  country: string;
  region?: string;
}

export const eligibilityAPI = {
  checkEligibility: async (data: EligibilityData): Promise<EligibilityResponse> => {
    const response = await api.post<EligibilityResponse>('/eligibility/check', data);
    return response.data;
  },

  getCountries: async (): Promise<{ countries: CountryInfo[] }> => {
    const response = await api.get<{ countries: CountryInfo[] }>('/eligibility/countries');
    return response.data;
  },

  getRequirements: async (country: string): Promise<{
    country: string;
    region: string;
    requirements: CountryRequirement;
  }> => {
    const response = await api.get<{
      country: string;
      region: string;
      requirements: CountryRequirement;
    }>(`/eligibility/requirements/${encodeURIComponent(country)}`);
    return response.data;
  },
};
