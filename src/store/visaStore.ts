import { create } from 'zustand'
import {
  authAPI,
  appointmentAPI,
  membershipAPI,
  eligibilityAPI,
  type User,
  type Appointment,
  type MyMembership,
} from '@/services'
import {
  assessVisa,
  simulateScoreChange,
  getQuestionsForVisaType,
  evaluateAnswer,
  analyzeDocument,
  analyzeDocumentBundle,
  analyzeRisk,
  type VisaProfile,
  type AssessmentResult,
  type InterviewQuestion,
  type AnswerEvaluation,
  type DocumentCheck,
  type RiskAnalysisResult,
} from '@/lib/ai'

export interface Advice {
  id: number
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  impact: string
  estimatedImprovement?: number
}

export interface FactorAnalysis {
  category: string
  score: number
  verdict: 'good' | 'average' | 'poor' | 'critical'
  factors: string[]
}

export interface UserProfile {
  // Personal Info
  age: number | null
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  placeOfBirth: string
  nationality: string
  
  // Passport Details
  passportNumber: string
  passportIssueDate: string
  passportExpiryDate: string
  passportIssuingAuthority: string
  
  // Marital & Family
  maritalStatus: string | null
  children: number
  
  // Employment
  profession: string
  employmentType: string
  employerName: string
  employerAddress: string
  employerPhone: string
  jobTitle: string
  yearsEmployed: number
  
  // Financial
  monthlyIncome: number | null
  bankBalance: number | null
  averageMonthlyBalance: number | null
  hasCNAS: boolean
  hasProperty: boolean
  hasVehicle: boolean
  
  // Travel History
  schengenCount: number
  previousStamps: string[]
  visaRefusals: number
  overstayHistory: boolean
  
  // Trip Details
  targetCountry: string
  purposeOfVisit: string
  durationOfStay: string
  entryType: 'single' | 'multiple' | ''
  plannedTravelDate: string
  plannedReturnDate: string
  hasBookings: boolean
  hasInsurance: boolean
  hasInvitationLetter: boolean
  hasSponsor: boolean
  sponsorIncome: number | null
  
  // Files
  passport: File | null
  bankStatement: File | null
  employmentProof: File | null
  
  // Profile completion
  isProfileComplete: boolean
}

interface VisaStore {
  currentStep: number
  userProfile: UserProfile
  results: AssessmentResult | null
  isAnalyzing: boolean
  language: 'ar' | 'en' | 'fr'
  activeNav: string
  user: User | null
  membership: MyMembership | null
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
  interviewQuestions: InterviewQuestion[]
  currentQuestionIndex: number
  interviewAnswers: Record<string, AnswerEvaluation>
  documents: DocumentCheck[]
  riskAnalysis: RiskAnalysisResult | null
  previewTier: 'gold' | 'premium' | null
  setPreviewTier: (tier: 'gold' | 'premium' | null) => void
  selectedTier: 'free' | 'gold' | 'premium'
  setSelectedTier: (tier: 'free' | 'gold' | 'premium') => void
  setCurrentStep: (step: number) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  setResults: (results: AssessmentResult) => void
  setIsAnalyzing: (analyzing: boolean) => void
  setLanguage: (lang: 'ar' | 'fr') => void
  setActiveNav: (nav: string) => void
  resetForm: () => void
  resetAssessment: () => void
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; fullName: string; phone: string }) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
  fetchMembership: () => Promise<void>
  fetchAppointments: () => Promise<void>
  bookAppointment: (data: {
    visaType: string
    appointmentDate: string
    appointmentTime: string
    passportNumber?: string
    purpose?: string
    duration?: string
    destination?: string
    entryType?: string
  }) => Promise<Appointment>
  runAssessment: () => Promise<AssessmentResult>
  checkEligibility: (data: any) => Promise<any>
  upgradeMembership: (tier: 'gold' | 'premium', durationMonths?: number) => Promise<void>
  simulateChange: (newBankBalance?: number, newMonthlyIncome?: number, newSchengenCount?: number) => number
  startInterview: (visaType: string, country: string) => void
  answerQuestion: (questionId: string, answer: string) => AnswerEvaluation
  nextQuestion: () => void
  analyzeDocument: (type: DocumentType, content: any) => void
  analyzeBundle: () => { overallValid: boolean; confidence: number; missingDocuments: string[]; recommendations: string[] }
  runRiskAnalysis: () => void
  setError: (error: string | null) => void
}

const initialProfile: UserProfile = {
  // Personal Info
  age: null,
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  placeOfBirth: '',
  nationality: 'Algeria',
  
  // Passport Details
  passportNumber: '',
  passportIssueDate: '',
  passportExpiryDate: '',
  passportIssuingAuthority: '',
  
  // Marital & Family
  maritalStatus: null,
  children: 0,
  
  // Employment
  profession: '',
  employmentType: '',
  employerName: '',
  employerAddress: '',
  employerPhone: '',
  jobTitle: '',
  yearsEmployed: 0,
  
  // Financial
  monthlyIncome: null,
  bankBalance: null,
  averageMonthlyBalance: null,
  hasCNAS: false,
  hasProperty: false,
  hasVehicle: false,
  
  // Travel History
  schengenCount: 0,
  previousStamps: [],
  visaRefusals: 0,
  overstayHistory: false,
  
  // Trip Details
  targetCountry: '',
  purposeOfVisit: '',
  durationOfStay: '',
  entryType: '',
  plannedTravelDate: '',
  plannedReturnDate: '',
  hasBookings: false,
  hasInsurance: false,
  hasInvitationLetter: false,
  hasSponsor: false,
  sponsorIncome: null,
  
  // Files
  passport: null,
  bankStatement: null,
  employmentProof: null,
  
  // Profile completion
  isProfileComplete: false,
}

export const useVisaStore = create<VisaStore>((set, get) => ({
  currentStep: 0,
  userProfile: initialProfile,
  results: null,
  isAnalyzing: false,
  language: 'en',
  activeNav: 'home',
  user: null,
  membership: null,
  appointments: [],
  isLoading: false,
  error: null,
  interviewQuestions: [],
  currentQuestionIndex: 0,
  interviewAnswers: {},
  documents: [],
  riskAnalysis: null,
  previewTier: null as 'gold' | 'premium' | null,
  setPreviewTier: (tier) => set((state) => ({
    previewTier: tier,
    selectedTier: tier ?? state.selectedTier,
  })),
  selectedTier: 'free' as 'free' | 'gold' | 'premium',
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  setCurrentStep: (step) => set({ currentStep: step }),
  updateProfile: (updates) => set((state) => {
    const newProfile = { ...state.userProfile, ...updates }
    console.log('[STORE] updateProfile called:', Object.keys(updates))
    console.log('[STORE] newProfile:', JSON.stringify(newProfile, null, 2))
    return { userProfile: newProfile }
  }),
  setResults: (results) => {
    console.log('[STORE] setResults called:', results)
    return set({ results })
  },
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setLanguage: (language) => set({ language }),
  setActiveNav: (activeNav) => set({ activeNav }),
  resetForm: () => set({ currentStep: 0, results: null, isAnalyzing: false }),
  resetAssessment: () => set({ currentStep: 0, results: null, isAnalyzing: false }),
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Store: Starting login...');
      const response = await authAPI.login({ email, password });
      console.log('Store: Login response:', response);
      set({ user: response.user, isLoading: false });
      console.log('Store: User set in state');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed. Please check your credentials.';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Store: Starting registration...');
      const response = await authAPI.register(data);
      console.log('Store: Registration response:', response);
      set({ user: response.user, isLoading: false });
      console.log('Store: User set in state');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed. Please try again.';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authAPI.logout();
    set({ user: null, membership: null, appointments: [] });
  },

  fetchUser: async () => {
    try {
      const { user } = await authAPI.getMe();
      set({ user });
    } catch (error) {
      set({ user: authAPI.getCurrentUser() });
    }
  },

  fetchMembership: async () => {
    try {
      const membership = await membershipAPI.getMyMembership();
      set({ membership });
    } catch (error) {
      console.error('Failed to fetch membership:', error);
    }
  },

  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { appointments } = await appointmentAPI.getMyAppointments();
      set({ appointments, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch appointments', isLoading: false });
    }
  },

  bookAppointment: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const typedData = {
        ...data,
        visaType: data.visaType as 'tourist' | 'business' | 'student' | 'work' | 'family' | 'transit',
      };
      const response = await appointmentAPI.book(typedData);
      await get().fetchAppointments();
      await get().fetchMembership();
      set({ isLoading: false });
      return response.appointment;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Booking failed', isLoading: false });
      throw error;
    }
  },

  runAssessment: async () => {
    const { userProfile } = get();
    console.log('[STORE] runAssessment called')
    console.log('[STORE] userProfile from store:', JSON.stringify({
      age: userProfile.age,
      employmentType: userProfile.employmentType,
      monthlyIncome: userProfile.monthlyIncome,
      bankBalance: userProfile.bankBalance,
      targetCountry: userProfile.targetCountry,
      purposeOfVisit: userProfile.purposeOfVisit,
      durationOfStay: userProfile.durationOfStay
    }, null, 2))
    set({ isAnalyzing: true, error: null });
    
    try {
      const aiProfile: VisaProfile = {
        age: userProfile.age || 30,
        nationality: 'Algeria',
        employmentType: (userProfile.employmentType as 'cdi' | 'cdd' | 'self-employed' | 'student' | 'unemployed' | 'retired') || 'cdi',
        monthlyIncome: userProfile.monthlyIncome || 0,
        bankBalance: userProfile.bankBalance || 0,
        averageMonthlyBalance: userProfile.averageMonthlyBalance || 0,
        yearsEmployed: userProfile.yearsEmployed,
        maritalStatus: (userProfile.maritalStatus as 'single' | 'married' | 'divorced' | 'widowed') || 'single',
        children: userProfile.children,
        hasProperty: userProfile.hasProperty,
        hasVehicle: userProfile.hasVehicle,
        schengenCount: userProfile.schengenCount,
        previousStamps: userProfile.previousStamps,
        visaRefusals: userProfile.visaRefusals,
        overstayHistory: userProfile.overstayHistory,
        hasCNAS: userProfile.hasCNAS,
        hasSponsor: userProfile.hasSponsor,
        sponsorIncome: userProfile.sponsorIncome || 0,
        targetCountry: userProfile.targetCountry || 'France',
        purposeOfVisit: userProfile.purposeOfVisit || 'tourism',
        durationOfStay: userProfile.durationOfStay,
        entryType: (userProfile.entryType as 'single' | 'multiple') || '',
        plannedTravelDate: userProfile.plannedTravelDate || '',
        plannedReturnDate: userProfile.plannedReturnDate || '',
        hasBookings: userProfile.hasBookings,
        hasInsurance: userProfile.hasInsurance,
        hasInvitationLetter: userProfile.hasInvitationLetter,
      };
      
      const result = assessVisa(aiProfile);
      set({ results: result, isAnalyzing: false });
      return result;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Assessment failed', isAnalyzing: false });
      const aiProfile: VisaProfile = {
        age: userProfile.age || 30,
        nationality: 'Algeria',
        employmentType: (userProfile.employmentType as 'cdi' | 'cdd' | 'self-employed' | 'student' | 'unemployed' | 'retired') || 'cdi',
        monthlyIncome: userProfile.monthlyIncome || 0,
        bankBalance: userProfile.bankBalance || 0,
        averageMonthlyBalance: userProfile.averageMonthlyBalance || 0,
        yearsEmployed: userProfile.yearsEmployed,
        maritalStatus: (userProfile.maritalStatus as 'single' | 'married' | 'divorced' | 'widowed') || 'single',
        children: userProfile.children,
        hasProperty: userProfile.hasProperty,
        hasVehicle: userProfile.hasVehicle,
        schengenCount: userProfile.schengenCount,
        previousStamps: userProfile.previousStamps,
        visaRefusals: userProfile.visaRefusals,
        overstayHistory: userProfile.overstayHistory,
        hasCNAS: userProfile.hasCNAS,
        hasSponsor: userProfile.hasSponsor,
        sponsorIncome: userProfile.sponsorIncome || 0,
        targetCountry: userProfile.targetCountry || 'France',
        purposeOfVisit: userProfile.purposeOfVisit || 'tourism',
        durationOfStay: userProfile.durationOfStay,
        entryType: (userProfile.entryType as 'single' | 'multiple') || '',
        plannedTravelDate: userProfile.plannedTravelDate || '',
        plannedReturnDate: userProfile.plannedReturnDate || '',
        hasBookings: userProfile.hasBookings,
        hasInsurance: userProfile.hasInsurance,
        hasInvitationLetter: userProfile.hasInvitationLetter,
      };
      const result = assessVisa(aiProfile);
      set({ results: result, isAnalyzing: false });
      return result;
    }
  },

  checkEligibility: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await eligibilityAPI.checkEligibility(data);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Eligibility check failed', isLoading: false });
      throw error;
    }
  },

  upgradeMembership: async (tier, durationMonths = 1) => {
    set({ isLoading: true, error: null });
    try {
      await membershipAPI.upgrade(tier, durationMonths);
      await get().fetchMembership();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Upgrade failed', isLoading: false });
      throw error;
    }
  },

  simulateChange: (newBankBalance, newMonthlyIncome, newSchengenCount) => {
    const { userProfile } = get();
    return simulateScoreChange(
      {
        age: userProfile.age || 30,
        nationality: 'Algeria',
        employmentType: (userProfile.employmentType as 'cdi' | 'cdd' | 'self-employed' | 'student' | 'unemployed' | 'retired') || 'cdi',
        monthlyIncome: userProfile.monthlyIncome || 0,
        bankBalance: userProfile.bankBalance || 0,
        averageMonthlyBalance: userProfile.averageMonthlyBalance || 0,
        yearsEmployed: userProfile.yearsEmployed,
        maritalStatus: (userProfile.maritalStatus as 'single' | 'married' | 'divorced' | 'widowed') || 'single',
        children: userProfile.children,
        hasProperty: userProfile.hasProperty,
        hasVehicle: userProfile.hasVehicle,
        schengenCount: userProfile.schengenCount,
        previousStamps: userProfile.previousStamps,
        visaRefusals: userProfile.visaRefusals,
        overstayHistory: userProfile.overstayHistory,
        hasCNAS: userProfile.hasCNAS,
        hasSponsor: userProfile.hasSponsor,
        sponsorIncome: userProfile.sponsorIncome || 0,
        targetCountry: userProfile.targetCountry || 'France',
        purposeOfVisit: userProfile.purposeOfVisit,
        durationOfStay: userProfile.durationOfStay,
        entryType: (userProfile.entryType as 'single' | 'multiple') || '',
        plannedTravelDate: userProfile.plannedTravelDate || '',
        plannedReturnDate: userProfile.plannedReturnDate || '',
        hasBookings: userProfile.hasBookings,
        hasInsurance: userProfile.hasInsurance,
        hasInvitationLetter: userProfile.hasInvitationLetter,
      },
      newBankBalance,
      newMonthlyIncome,
      newSchengenCount
    );
  },

  startInterview: (visaType, country) => {
    const questions = getQuestionsForVisaType(visaType, 5);
    set({ 
      interviewQuestions: questions, 
      currentQuestionIndex: 0, 
      interviewAnswers: {} 
    });
  },

  answerQuestion: (questionId, answer) => {
    const { interviewQuestions, interviewAnswers } = get();
    const question = interviewQuestions.find(q => q.id === questionId);
    if (!question) {
      return { score: 0, feedback: 'Question not found', suggestions: [], pointsCovered: [], pointsMissing: [], redFlags: [], confidence: 0, overallAssessment: 'poor' as const };
    }
    
    const lang: 'ar' | 'en' = get().language === 'fr' ? 'en' : (get().language as 'ar' | 'en');
    const evaluation = evaluateAnswer(question, answer, lang);
    
    set({ 
      interviewAnswers: { ...interviewAnswers, [questionId]: evaluation } 
    });
    
    return evaluation;
  },

  nextQuestion: () => {
    const { currentQuestionIndex, interviewQuestions } = get();
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  analyzeDocument: (type, content) => {
    const { documents } = get();
    const result = analyzeDocument(type as any, content);
    set({ documents: [...documents, result] });
  },

  analyzeBundle: () => {
    const { documents } = get();
    return analyzeDocumentBundle(documents);
  },

  runRiskAnalysis: () => {
    const { userProfile } = get();
    const riskProfile = {
      nationality: 'Algeria',
      age: userProfile.age || 30,
      employmentType: userProfile.employmentType,
      visaRefusals: userProfile.visaRefusals,
      overstayHistory: userProfile.overstayHistory,
      travelHistory: userProfile.previousStamps,
    };
    const result = analyzeRisk(riskProfile);
    set({ riskAnalysis: result });
  },

  setError: (error) => set({ error }),
}))

const DZD_EUR = 145

const COUNTRY_DATA: Record<string, any> = {
  'Turkey': { name: 'Turkey', flag: 'TR', minDailyEUR: 50, minMonthlyEUR: 500, baseMod: 25, difficulty: 'easy' },
  'UAE': { name: 'UAE', flag: 'AE', minDailyEUR: 100, minMonthlyEUR: 2000, baseMod: 15, difficulty: 'easy' },
  'Georgia': { name: 'Georgia', flag: 'GE', minDailyEUR: 50, minMonthlyEUR: 300, baseMod: 30, difficulty: 'easy' },
  'Spain': { name: 'Spain', flag: 'ES', minDailyEUR: 65, minMonthlyEUR: 900, baseMod: 8, difficulty: 'easy' },
  'Portugal': { name: 'Portugal', flag: 'PT', minDailyEUR: 65, minMonthlyEUR: 800, baseMod: 12, difficulty: 'easy' },
  'Italy': { name: 'Italy', flag: 'IT', minDailyEUR: 65, minMonthlyEUR: 1000, baseMod: 5, difficulty: 'medium' },
  'Belgium': { name: 'Belgium', flag: 'BE', minDailyEUR: 65, minMonthlyEUR: 950, baseMod: 0, difficulty: 'medium' },
  'France': { name: 'France', flag: 'FR', minDailyEUR: 65, minMonthlyEUR: 1200, baseMod: 0, difficulty: 'medium' },
  'Netherlands': { name: 'Netherlands', flag: 'NL', minDailyEUR: 65, minMonthlyEUR: 1000, baseMod: -3, difficulty: 'hard' },
  'Germany': { name: 'Germany', flag: 'DE', minDailyEUR: 65, minMonthlyEUR: 1100, baseMod: -5, difficulty: 'hard' },
  'UK': { name: 'United Kingdom', flag: 'GB', minDailyEUR: 100, minMonthlyEUR: 3000, baseMod: -15, difficulty: 'hard' },
  'USA': { name: 'United States', flag: 'US', minDailyEUR: 150, minMonthlyEUR: 4500, baseMod: -20, difficulty: 'hard' },
  'Canada': { name: 'Canada', flag: 'CA', minDailyEUR: 100, minMonthlyEUR: 3000, baseMod: -15, difficulty: 'hard' },
}

export function performVisaAssessment(profile: UserProfile) {
  const country = COUNTRY_DATA[profile.targetCountry] || COUNTRY_DATA['France']
  
  let score = 50
  const factors: any[] = []
  const warnings: string[] = []
  const strengths: string[] = []
  const weaknesses: string[] = []
  const missingDocs: string[] = []
  const advice: any[] = []
  const whatIfHints: any[] = []

  const avgBal = profile.averageMonthlyBalance || profile.bankBalance || 0
  const minRequired = country.minMonthlyEUR * 3

  let ageScore = 50
  if (profile.age) {
    if (profile.age < 22) { ageScore = 20; weaknesses.push('عمر الشباب عامل خطر') }
    else if (profile.age <= 35) ageScore = 60
    else if (profile.age <= 50) { ageScore = 85; strengths.push('العمر المثالي') }
    else if (profile.age <= 60) ageScore = 70
    else ageScore = 50
  }
  factors.push({ category: 'العمر والموقع', score: ageScore, verdict: ageScore >= 70 ? 'good' : ageScore >= 50 ? 'average' : 'poor', factors: [] })

  let empScore = 30
  if (profile.employmentType === 'cdi') {
    empScore = 95
    strengths.push('CDI (دائم) عامل قوي')
    if (profile.yearsEmployed >= 5) empScore = 100
  } else if (profile.employmentType === 'cdd') {
    empScore = 65
    weaknesses.push('CDD (مؤقت) أقل استقراراً')
  } else if (profile.employmentType === 'self-employed') {
    empScore = 50
    weaknesses.push('العمل الحر أصعب في اثباته')
  } else if (profile.employmentType === 'student') {
    empScore = 25
    if (!profile.hasSponsor) { empScore = 5; weaknesses.push('طالب بدون sponsor = رفض') }
  } else if (profile.employmentType === 'unemployed') {
    empScore = 2
    weaknesses.push('عدم Employment = عامل رفض رئيسي')
    warnings.push('هذا وضع خطير جداً')
  }
  factors.push({ category: 'الEmployment والاستقرار', score: empScore, verdict: empScore >= 70 ? 'good' : empScore >= 50 ? 'average' : empScore >= 25 ? 'poor' : 'critical', factors: [] })

  let finScore = 30
  if (avgBal > 0) {
    const balEUR = avgBal / DZD_EUR
    if (balEUR >= minRequired * 2) { finScore = 95; strengths.push('الرصيد يتجاوز المطلوب') }
    else if (balEUR >= minRequired) { finScore = 75 }
    else if (balEUR >= minRequired * 0.7) { finScore = 45; weaknesses.push('الرصيد أقل من المطلوب') }
    else { finScore = 15; weaknesses.push('الرصيد غير كافٍ'); warnings.push('الرصيد الحالي قد يؤدي للرفض') }
  } else {
    finScore = 5
    weaknesses.push('لا توجد معلومات مالية')
    warnings.push('الوضع المالي غير معروف')
  }
  if (profile.monthlyIncome) {
    const monthlyEUR = profile.monthlyIncome / DZD_EUR
    if (monthlyEUR >= country.minMonthlyEUR) { finScore = Math.min(100, finScore + 10); strengths.push('الراتب يلبي المتطلبات') }
  }
  factors.push({ category: 'القدرة المالية', score: finScore, verdict: finScore >= 70 ? 'good' : finScore >= 50 ? 'average' : finScore >= 25 ? 'poor' : 'critical', factors: [] })
  whatIfHints.push({ variable: 'الرصيد البنكي', current: `${avgBal.toLocaleString()} DZD`, suggested: `${Math.round(minRequired * DZD_EUR).toLocaleString()} DZD`, impact: 'زيادة الرصيد ترفع الدرجة 15-25 نقطة' })

  let travScore = 40
  if (profile.overstayHistory) {
    travScore = 3
    weaknesses.push('تجاوز الإقامة سابقاً')
    warnings.push('تجاوز الإقامة قد يؤدي لحظر')
  }
  if (profile.visaRefusals > 0) {
    travScore = Math.max(0, travScore - profile.visaRefusals * 20)
    weaknesses.push(`${profile.visaRefusals} رفض(ات) سابقة`)
  }
  if (profile.schengenCount >= 3) { travScore = Math.min(100, travScore + 45); strengths.push('سجل شنغن ممتاز') }
  else if (profile.schengenCount >= 1) { travScore = Math.min(100, travScore + 15); strengths.push('سجل شنغن جيد') }
  factors.push({ category: 'تاريخ السفر', score: travScore, verdict: travScore >= 70 ? 'good' : travScore >= 50 ? 'average' : travScore >= 25 ? 'poor' : 'critical', factors: [] })

  let tiesScore = 25
  if (profile.maritalStatus === 'married') { tiesScore += 25; if (profile.children > 0) { tiesScore += 15; strengths.push('عائلة في الجزائر عامل قوي') } }
  else if (profile.maritalStatus === 'single') { tiesScore -= 15; weaknesses.push('العزوبية عامل خطر') }
  if (profile.hasProperty) { tiesScore += 25; strengths.push('الملكية أقوى اثبات للعودة') }
  if (profile.employmentType === 'cdi' && profile.yearsEmployed >= 3) { tiesScore += 20 }
  factors.push({ category: 'الروابط مع الجزائر', score: tiesScore, verdict: tiesScore >= 70 ? 'good' : tiesScore >= 50 ? 'average' : 'poor', factors: [] })

  let docScore = 50
  if (!profile.bankStatement) { docScore -= 25; missingDocs.push('كشف الحساب') }
  if (!profile.employmentProof && profile.employmentType !== 'unemployed') { docScore -= 20; missingDocs.push('شهادة العمل') }
  if (profile.hasInsurance) docScore = Math.min(100, docScore + 10)
  factors.push({ category: 'الوثائق', score: docScore, verdict: docScore >= 70 ? 'good' : docScore >= 50 ? 'average' : 'poor', factors: [] })

  const weights = { age: 10, emp: 25, fin: 30, trav: 20, ties: 25, doc: 15 }
  const scores = { age: ageScore, emp: empScore, fin: finScore, trav: travScore, ties: tiesScore, doc: docScore }
  
  score = Math.round(
    (scores.age * weights.age + scores.emp * weights.emp + scores.fin * weights.fin + 
     scores.trav * weights.trav + scores.ties * weights.ties + scores.doc * weights.doc) / 
    (weights.age + weights.emp + weights.fin + weights.trav + weights.ties + weights.doc)
  )
  
  score += country.baseMod
  score = Math.min(95, Math.max(5, score))

  const overallVerdict = score >= 75 ? 'strong' : score >= 55 ? 'moderate' : score >= 35 ? 'weak' : 'very_weak'

  let id = 1
  for (const doc of missingDocs) {
    advice.push({ id: id++, title: `توفير ${doc}`, description: 'هذه الوثيقة مطلوبة', priority: 'critical', impact: 'بدون الوثيقة = رفض' })
  }
  if (finScore < 50) {
    advice.push({ id: id++, title: 'تقوية الوضع المالي', description: 'الحد الأدنى المطلوب يتجاوز وضعك الحالي', priority: 'critical', impact: 'تحتاج زيادة الرصيد' })
  }
  if (empScore < 50) {
    if (profile.employmentType === 'unemployed') {
      advice.push({ id: id++, title: 'الحصول على Employment', description: 'عدم Employment هو أكبر سبب للرفض', priority: 'critical', impact: 'بدون عمل = رفض شبه مضمون' })
    }
  }
  if (travScore < 40 && profile.schengenCount === 0) {
    advice.push({ id: id++, title: 'بناء سجل سفر', description: 'حاول الحصول على تأشيرة أسهل أولاً', priority: 'high', impact: 'سجل السفر يرفع فرصك' })
  }
  if (profile.visaRefusals > 0) {
    advice.push({ id: id++, title: 'الانتظار بعد الرفض', description: 'انتظر قبل التقديم مجدداً', priority: 'critical', impact: 'التقديم السريع = مخاطرة' })
  }
  if (tiesScore < 50) {
    advice.push({ id: id++, title: 'تقوية الروابط', description: 'قدم اثباتات على وجودك في الجزائر', priority: 'high', impact: 'الروابط القوية = سبب للعودة' })
  }
  if (!profile.hasBookings) {
    advice.push({ id: id++, title: 'حجز فندق وطيران', description: 'احجز قابل للإلغاء', priority: 'medium', impact: 'الحجز يعطي مصداقية' })
  }
  advice.push({ id: id++, title: 'التحضير للمقابلة', description: 'تعلم الإجابة على الأسئلة الأساسية', priority: 'low', impact: 'المقابلة مهمة' })

  const alternatives = Object.keys(COUNTRY_DATA).filter(c => c !== profile.targetCountry).map(c => {
    const req = COUNTRY_DATA[c]
    let adj = score + req.baseMod
    if (profile.schengenCount === 0 && ['Turkey', 'Georgia'].includes(c)) adj = Math.min(95, adj + 20)
    return { country: req.name, flag: req.flag, code: req.flag, score: Math.min(95, Math.max(10, adj)), difficulty: req.difficulty }
  }).sort((a, b) => b.score - a.score).slice(0, 5)

  const officerSummary = overallVerdict === 'strong' 
    ? 'ملف قوي مع فرص قبول عالية.' 
    : overallVerdict === 'moderate' 
    ? 'ملف متوسط يحتاج تحسينات.' 
    : 'ملف ضعيف مع مخاطر عالية.'

  return {
    mainScore: score,
    targetCountry: country.name,
    countryCode: country.flag,
    alternatives,
    advice: advice.sort((a: any, b: any) => {
      const p: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
      return p[a.priority] - p[b.priority]
    }),
    assessment: {
      overallVerdict,
      confidenceLevel: 'medium',
      estimatedApprovalChance: score,
      keyStrengths: strengths,
      keyWeaknesses: weaknesses,
      missingDocuments: missingDocs,
      interviewReadiness: 50,
      recommendedWaitTime: profile.visaRefusals > 0 ? '3-6 أشهر' : null
    },
    factors,
    warnings,
    officerSummary,
    strengths,
    weaknesses,
    whatIfHints
  }
}

export function calculateWhatIfScore(profile: UserProfile, newBankBalance: number, newMonthlyIncome: number): number {
  const modified = { ...profile, bankBalance: newBankBalance, monthlyIncome: newMonthlyIncome, averageMonthlyBalance: newBankBalance }
  return performVisaAssessment(modified).mainScore
}

export const simulateVisaAnalysis = performVisaAssessment
