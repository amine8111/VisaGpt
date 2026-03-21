export { default as api } from './api';
export type { ApiResponse, PaginatedResponse } from './api';

export { authAPI } from './auth';
export type { User, LoginData, RegisterData, AuthResponse } from './auth';

export { appointmentAPI } from './appointments';
export type {
  Appointment,
  BookAppointmentData,
  MembershipInfo,
  BookAppointmentResponse,
  Slot,
  VisaType,
  AppointmentStatus,
  ApplicationData,
  FraudFlag,
} from './appointments';

export { assessmentAPI } from './assessment';
export type {
  AssessmentData,
  AssessmentResponse,
  CriteriaResponse,
  RequiredDoc,
  VisaCriteria,
  AssessmentFactor,
  Eligibility,
  Verdict,
} from './assessment';

export { membershipAPI } from './membership';
export type {
  MembershipPlan,
  MembershipPlans,
  MembershipTier,
  Meeting,
  MyMembership,
} from './membership';

export { eligibilityAPI } from './eligibility';
export type {
  EligibilityCheck,
  EligibilityResponse,
  EligibilityData,
  CountryInfo,
  CountryRequirement,
} from './eligibility';

export { agentAPI } from './agent';
export type {
  BulkBookData,
  BulkBookResponse,
  AssignAppointmentData,
} from './agent';

export { adminAPI } from './admin';
export type {
  DashboardStats,
  DashboardResponse,
  FraudStats,
  FraudPatternsResponse,
  SlotAllocationData,
  GenerateSlotsData,
  Setting,
  PaginatedResponse as AdminPaginatedResponse,
} from './admin';

export { aiAPI } from './ai';
export type {
  FaceVerificationResponse,
  LivenessResponse,
  RiskAnalysisResponse,
  SmartAllocationResponse,
} from './ai';
