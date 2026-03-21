export interface VisaProfile {
  age: number;
  nationality: string;
  employmentType: 'cdi' | 'cdd' | 'self-employed' | 'student' | 'unemployed' | 'retired';
  monthlyIncome: number;
  bankBalance: number;
  averageMonthlyBalance: number;
  yearsEmployed: number;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  children: number;
  hasProperty: boolean;
  hasVehicle: boolean;
  schengenCount: number;
  previousStamps: string[];
  visaRefusals: number;
  overstayHistory: boolean;
  hasCNAS: boolean;
  hasSponsor: boolean;
  sponsorIncome: number;
  targetCountry: string;
  purposeOfVisit: string;
  durationOfStay: string;
  entryType: 'single' | 'multiple' | '';
  plannedTravelDate: string;
  plannedReturnDate: string;
  hasBookings: boolean;
  hasInsurance: boolean;
  hasInvitationLetter: boolean;
}

export interface CountryConfig {
  name: string;
  flag: string;
  code: string;
  minDailyEUR: number;
  minMonthlyEUR: number;
  baseMod: number;
  difficulty: 'easy' | 'medium' | 'hard';
  processingDays: number;
  requiredDocs: string[];
  minBankBalanceEUR: number;
}

export interface AssessmentResult {
  mainScore: number;
  targetCountry: string;
  countryCode: string;
  overallVerdict: 'strong' | 'moderate' | 'weak' | 'very_weak';
  confidenceLevel: 'low' | 'medium' | 'high';
  estimatedApprovalChance: number;
  estimatedProcessingDays: number;
  factors: FactorScore[];
  strengths: string[];
  weaknesses: string[];
  missingDocuments: string[];
  warnings: string[];
  advice: Advice[];
  alternatives: AlternativeCountry[];
  officerSummary: string;
  whatIfHints: WhatIfHint[];
  interviewReadiness: number;
  recommendedWaitTime?: string;
}

export interface FactorScore {
  category: string;
  score: number;
  verdict: 'good' | 'average' | 'poor' | 'critical';
  factors: string[];
  weight: number;
}

export interface Advice {
  id: number;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  estimatedImprovement: number;
}

export interface AlternativeCountry {
  country: string;
  flag: string;
  code: string;
  score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  reasons: string[];
}

export interface WhatIfHint {
  variable: string;
  current: string;
  suggested: string;
  impact: string;
  estimatedImprovement: number;
}

const DZD_EUR = 145;
const DZD_USD = 135;

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  'France': {
    name: 'France', flag: '🇫🇷', code: 'FR',
    minDailyEUR: 120, minMonthlyEUR: 1200, baseMod: -5, difficulty: 'medium',
    processingDays: 15, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 4320
  },
  'Germany': {
    name: 'Germany', flag: '🇩🇪', code: 'DE',
    minDailyEUR: 75, minMonthlyEUR: 1100, baseMod: -10, difficulty: 'hard',
    processingDays: 20, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter'],
    minBankBalanceEUR: 2700
  },
  'Spain': {
    name: 'Spain', flag: '🇪🇸', code: 'ES',
    minDailyEUR: 100, minMonthlyEUR: 900, baseMod: 10, difficulty: 'easy',
    processingDays: 10, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 3600
  },
  'Italy': {
    name: 'Italy', flag: '🇮🇹', code: 'IT',
    minDailyEUR: 95, minMonthlyEUR: 1000, baseMod: 8, difficulty: 'medium',
    processingDays: 15, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 3420
  },
  'Portugal': {
    name: 'Portugal', flag: '🇵🇹', code: 'PT',
    minDailyEUR: 100, minMonthlyEUR: 800, baseMod: 15, difficulty: 'easy',
    processingDays: 10, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 3600
  },
  'Belgium': {
    name: 'Belgium', flag: '🇧🇪', code: 'BE',
    minDailyEUR: 95, minMonthlyEUR: 950, baseMod: -15, difficulty: 'hard',
    processingDays: 15, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 3420
  },
  'Netherlands': {
    name: 'Netherlands', flag: '🇳🇱', code: 'NL',
    minDailyEUR: 85, minMonthlyEUR: 1000, baseMod: -8, difficulty: 'hard',
    processingDays: 20, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter'],
    minBankBalanceEUR: 3060
  },
  'Lithuania': {
    name: 'Lithuania', flag: '🇱🇹', code: 'LT',
    minDailyEUR: 60, minMonthlyEUR: 600, baseMod: 20, difficulty: 'easy',
    processingDays: 7, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 2160
  },
  'Estonia': {
    name: 'Estonia', flag: '🇪🇪', code: 'EE',
    minDailyEUR: 60, minMonthlyEUR: 600, baseMod: 18, difficulty: 'easy',
    processingDays: 7, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 2160
  },
  'Finland': {
    name: 'Finland', flag: '🇫🇮', code: 'FI',
    minDailyEUR: 100, minMonthlyEUR: 700, baseMod: 15, difficulty: 'easy',
    processingDays: 10, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 3600
  },
  'Greece': {
    name: 'Greece', flag: '🇬🇷', code: 'GR',
    minDailyEUR: 70, minMonthlyEUR: 800, baseMod: 12, difficulty: 'easy',
    processingDays: 10, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 2520
  },
  'Switzerland': {
    name: 'Switzerland', flag: '🇨🇭', code: 'CH',
    minDailyEUR: 150, minMonthlyEUR: 3000, baseMod: 5, difficulty: 'medium',
    processingDays: 10, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 5400
  },
  'Romania': {
    name: 'Romania', flag: '🇷🇴', code: 'RO',
    minDailyEUR: 60, minMonthlyEUR: 600, baseMod: 18, difficulty: 'easy',
    processingDays: 14, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
    minBankBalanceEUR: 2160
  },
  'UK': {
    name: 'United Kingdom', flag: '🇬🇧', code: 'GB',
    minDailyEUR: 150, minMonthlyEUR: 3000, baseMod: -20, difficulty: 'hard',
    processingDays: 21, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'english_test'],
    minBankBalanceEUR: 9000
  },
  'USA': {
    name: 'United States', flag: '🇺🇸', code: 'US',
    minDailyEUR: 200, minMonthlyEUR: 4500, baseMod: -25, difficulty: 'hard',
    processingDays: 30, requiredDocs: ['passport', 'photo', 'ds160', 'travel_itinerary', 'financial_proof', 'insurance', 'interview'],
    minBankBalanceEUR: 13500
  },
  'Canada': {
    name: 'Canada', flag: '🇨🇦', code: 'CA',
    minDailyEUR: 150, minMonthlyEUR: 3000, baseMod: -15, difficulty: 'hard',
    processingDays: 28, requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'biometrics'],
    minBankBalanceEUR: 9000
  },
  'Turkey': {
    name: 'Turkey', flag: '🇹🇷', code: 'TR',
    minDailyEUR: 50, minMonthlyEUR: 500, baseMod: 25, difficulty: 'easy',
    processingDays: 7, requiredDocs: ['passport', 'photo'],
    minBankBalanceEUR: 450
  },
  'UAE': {
    name: 'UAE', flag: '🇦🇪', code: 'AE',
    minDailyEUR: 100, minMonthlyEUR: 2000, baseMod: 15, difficulty: 'easy',
    processingDays: 5, requiredDocs: ['passport', 'photo', 'hotel_booking'],
    minBankBalanceEUR: 6000
  },
  'Georgia': {
    name: 'Georgia', flag: '🇬🇪', code: 'GE',
    minDailyEUR: 50, minMonthlyEUR: 300, baseMod: 30, difficulty: 'easy',
    processingDays: 3, requiredDocs: ['passport', 'photo'],
    minBankBalanceEUR: 270
  },
  'Morocco': {
    name: 'Morocco', flag: '🇲🇦', code: 'MA',
    minDailyEUR: 30, minMonthlyEUR: 400, baseMod: 35, difficulty: 'easy',
    processingDays: 5, requiredDocs: ['passport', 'photo', 'hotel_booking'],
    minBankBalanceEUR: 360
  },
  'Malaysia': {
    name: 'Malaysia', flag: '🇲🇾', code: 'MY',
    minDailyEUR: 40, minMonthlyEUR: 500, baseMod: 30, difficulty: 'easy',
    processingDays: 5, requiredDocs: ['passport', 'photo', 'hotel_booking', 'ticket'],
    minBankBalanceEUR: 450
  },
};

export const VISA_PURPOSE_MULTIPLIERS: Record<string, { score: number; docs: string[] }> = {
  'tourism': { score: 0, docs: ['travel_itinerary', 'hotel_booking'] },
  'business': { score: 15, docs: ['invitation_letter', 'company_docs', 'travel_itinerary'] },
  'study': { score: 10, docs: ['enrollment_letter', 'financial_guarantee'] },
  'family': { score: 20, docs: ['invitation_letter', 'family_bond_proof'] },
  'medical': { score: 15, docs: ['medical_invitation', 'financial_guarantee'] },
  'transit': { score: -10, docs: ['ticket', 'visa_dest_country'] },
};

const EMPLOYMENT_MULTIPLIERS: Record<string, number> = {
  'cdi': 1.0,
  'cdd': 0.70,
  'self-employed': 0.75,
  'student': 0.75,
  'unemployed': 0.40,
  'retired': 0.60,
};

const DURATION_DAYS: Record<string, number> = {
  'أقل من أسبوع': 5, 'أسبوع - أسبوعين': 14, 'شهر - 3 أشهر': 60,
  '3 - 6 أشهر': 120, 'أكثر من 6 أشهر': 180,
  'less than week': 5, '1-2 weeks': 14, '1-3 months': 60,
  '3-6 months': 120, 'more than 6 months': 180,
};

const RISK_PENALTIES = {
  critical: -50,
  high: -30,
  medium: -15,
  low: -5,
};

export function assessVisa(profile: VisaProfile): AssessmentResult {
  const country = COUNTRY_CONFIGS[profile.targetCountry] || COUNTRY_CONFIGS['France'];
  const factors: FactorScore[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missingDocuments: string[] = [];
  const warnings: string[] = [];
  const advice: Advice[] = [];
  let totalScore = 0;
  let id = 1;

  const durationDays = DURATION_DAYS[profile.durationOfStay] || 14;
  const avgBal = profile.averageMonthlyBalance || profile.bankBalance;
  const balanceEUR = avgBal / DZD_EUR;

  const requiredAmount = country.minDailyEUR * durationDays * 1.2;
  const balanceRatio = avgBal > 0 ? balanceEUR / requiredAmount : 0;

  let financialScore = 0;
  let financialSubScores = { bankRatio: 0, incomeStability: 0 };

  if (avgBal <= 0) {
    financialScore = 5;
    weaknesses.push('No bank balance information');
  } else if (balanceRatio >= 2.5) {
    financialScore = 100;
    strengths.push('Excellent bank balance (2.5x+ required)');
  } else if (balanceRatio >= 1.8) {
    financialScore = 90;
    strengths.push('Strong bank balance (1.8x+ required)');
  } else if (balanceRatio >= 1.2) {
    financialScore = 75;
  } else if (balanceRatio >= 1.0) {
    financialScore = 60;
    warnings.push('Bank balance borderline - risk of refusal code 2');
  } else if (balanceRatio >= 0.8) {
    financialScore = 40;
    weaknesses.push('Insufficient bank balance - high risk');
  } else {
    financialScore = 20;
    weaknesses.push('Critical financial insufficiency');
  }
  financialSubScores.bankRatio = financialScore;

  const monthlyIncomeEUR = (profile.monthlyIncome || 0) / DZD_EUR;
  let incomePoints = 0;
  if (monthlyIncomeEUR >= 1380) incomePoints = 100;
  else if (monthlyIncomeEUR >= 1035) incomePoints = 90;
  else if (monthlyIncomeEUR >= 690) incomePoints = 75;
  else if (monthlyIncomeEUR >= 415) incomePoints = 60;
  else incomePoints = 40;

  const empMultiplier = EMPLOYMENT_MULTIPLIERS[profile.employmentType] || 0.5;
  financialSubScores.incomeStability = Math.round(incomePoints * empMultiplier);

  financialScore = Math.round((financialSubScores.bankRatio * 0.6) + (financialSubScores.incomeStability * 0.4));

  factors.push({
    category: 'Financial Capacity',
    score: financialScore,
    verdict: financialScore >= 80 ? 'good' : financialScore >= 60 ? 'average' : financialScore >= 40 ? 'poor' : 'critical',
    factors: [
      `Bank Ratio: ${balanceRatio.toFixed(2)}x required`,
      `Income: ${Math.round(monthlyIncomeEUR)} EUR/month`
    ],
    weight: 35
  });

  let ageScore = 0;
  if (profile.age >= 25 && profile.age <= 45) {
    ageScore = 100;
    strengths.push('Prime working age (25-45)');
  } else if (profile.age >= 18 && profile.age < 25) {
    ageScore = 85;
  } else if (profile.age > 45 && profile.age <= 60) {
    ageScore = 75;
  } else if (profile.age > 60) {
    ageScore = 60;
    weaknesses.push('Retired - requires strong financial proof');
  }
  factors.push({ category: 'Age Profile', score: ageScore, verdict: ageScore >= 80 ? 'good' : 'average', factors: [], weight: 0 });

  let maritalScore = 0;
  if (profile.maritalStatus === 'married') {
    maritalScore = 5;
  } else if (profile.maritalStatus === 'single' && profile.age >= 20 && profile.age <= 35) {
    maritalScore = -10;
    warnings.push('Single male 20-35 - statistical risk group');
  }
  factors.push({ category: 'Marital Status', score: Math.max(0, maritalScore + 100), verdict: 'good', factors: [], weight: 0 });

  let employmentTies = 0;
  if (profile.employmentType === 'cdi') {
    if (profile.yearsEmployed > 3) employmentTies = 100;
    else if (profile.yearsEmployed >= 1) employmentTies = 85;
    else employmentTies = 70;
    strengths.push('CDI (permanent contract) - strong ties');
  } else if (profile.employmentType === 'self-employed') {
    employmentTies = profile.yearsEmployed >= 2 ? 75 : 55;
  } else if (profile.employmentType === 'cdd') {
    employmentTies = 65;
  } else if (profile.employmentType === 'student') {
    employmentTies = 80;
  } else if (profile.employmentType === 'unemployed') {
    employmentTies = 30;
    weaknesses.push('Unemployed - weak return intent');
  } else if (profile.employmentType === 'retired') {
    employmentTies = 50;
  }
  factors.push({ category: 'Employment Ties', score: employmentTies, verdict: employmentTies >= 80 ? 'good' : employmentTies >= 50 ? 'average' : 'poor', factors: [], weight: 25 });

  let familyTies = 0;
  if (profile.maritalStatus === 'married') {
    familyTies += 30;
    familyTies += profile.children * 25;
  }
  if (profile.hasProperty) familyTies += 20;
  if (profile.hasVehicle) familyTies += 5;
  if (profile.hasSponsor) familyTies += 10;

  factors.push({ category: 'Family & Property Ties', score: Math.min(100, familyTies), verdict: familyTies >= 50 ? 'good' : familyTies >= 25 ? 'average' : 'poor', factors: [], weight: 25 });

  let travelComplianceScore = 50;
  if (profile.overstayHistory) {
    travelComplianceScore = 5;
    weaknesses.push('Previous Schengen overstay - CRITICAL');
  }
  if (profile.visaRefusals > 0) {
    travelComplianceScore = Math.max(0, travelComplianceScore - profile.visaRefusals * 20);
    weaknesses.push(`${profile.visaRefusals} previous refusal(s)`);
  }
  if (profile.schengenCount >= 3) {
    travelComplianceScore = Math.min(100, travelComplianceScore + 50);
    strengths.push('Excellent Schengen history (3+ visas)');
  } else if (profile.schengenCount >= 1) {
    travelComplianceScore = Math.min(100, travelComplianceScore + 25);
  }

  const valuableStamps = profile.previousStamps.filter(s =>
    ['USA', 'UK', 'Canada', 'Japan', 'Australia', 'New Zealand', 'UAE', 'Qatar', 'Saudi Arabia'].includes(s)
  ).length;
  const travelPatternScore = valuableStamps > 0 ? Math.min(30, valuableStamps * 15) : 0;

  factors.push({
    category: 'Travel History',
    score: Math.round((travelComplianceScore * 0.7) + (travelPatternScore * 0.3)),
    verdict: travelComplianceScore >= 70 ? 'good' : travelComplianceScore >= 50 ? 'average' : 'poor',
    factors: [
      `Schengen visas: ${profile.schengenCount}`,
      `Valuable stamps: ${valuableStamps}`
    ],
    weight: 20
  });

  let documentScore = 50;
  if (!profile.hasInsurance) {
    documentScore -= 15;
    missingDocuments.push('Travel insurance (€30,000+ coverage)');
  }
  if (!profile.hasBookings) {
    documentScore -= 10;
    warnings.push('No flight/hotel bookings - vague travel plan');
  }
  if (!profile.hasInvitationLetter && ['family', 'business'].includes(profile.purposeOfVisit)) {
    documentScore -= 15;
  }
  if (profile.employmentType !== 'unemployed') {
    documentScore += 10;
  }
  if (profile.hasCNAS) documentScore += 5;

  factors.push({
    category: 'Document Quality',
    score: Math.max(0, Math.min(100, documentScore)),
    verdict: documentScore >= 80 ? 'good' : documentScore >= 60 ? 'average' : 'poor',
    factors: [],
    weight: 12
  });

  const weights = {
    financial: 35,
    roots: 25,
    travel: 20,
    documents: 12,
    demographic: 8
  };

  const categoryScores = {
    financial: financialScore,
    roots: Math.round((employmentTies * 0.6 + familyTies * 0.4)),
    travel: Math.round((travelComplianceScore * 0.7 + travelPatternScore * 0.3)),
    documents: documentScore,
    demographic: Math.round(ageScore * 0.8 + Math.max(0, maritalScore + 100) * 0.2)
  };

  totalScore = Math.round(
    (categoryScores.financial * weights.financial +
     categoryScores.roots * weights.roots +
     categoryScores.travel * weights.travel +
     categoryScores.documents * weights.documents +
     categoryScores.demographic * weights.demographic) / 100
  );

  totalScore += country.baseMod;

  const purposeMultiplier = VISA_PURPOSE_MULTIPLIERS[profile.purposeOfVisit] || VISA_PURPOSE_MULTIPLIERS['tourism'];
  totalScore += purposeMultiplier.score;

  if (profile.overstayHistory) {
    totalScore += RISK_PENALTIES.critical;
    warnings.push('OVERSTAY HISTORY: Critical risk factor (-50)');
  }

  if (profile.visaRefusals > 0) {
    const refusalPenalty = profile.visaRefusals >= 3 ? -40 : -20;
    totalScore += refusalPenalty;
  }

  if (!profile.hasInsurance) {
    totalScore += RISK_PENALTIES.high;
    warnings.push('Missing travel insurance (-30)');
  }

  if (!profile.hasBookings && !profile.hasInvitationLetter) {
    totalScore += RISK_PENALTIES.medium;
    warnings.push('No bookings or invitation (-15)');
  }

  if (profile.employmentType === 'unemployed' && !profile.hasSponsor) {
    totalScore += RISK_PENALTIES.high;
    warnings.push('Unemployed without sponsor (-30)');
  }

  if (balanceRatio < 1.0 && avgBal > 0) {
    totalScore += RISK_PENALTIES.medium;
  }

  if (profile.employmentType === 'unemployed') {
    advice.push({
      id: id++,
      title: 'Employment Status',
      description: 'CDI is the strongest proof of return intent. Consider getting stable employment before applying.',
      priority: 'critical',
      impact: 'Without employment = near-certain refusal',
      estimatedImprovement: 30
    });
  }

  if (balanceRatio < 1.2) {
    const recommended = Math.ceil(requiredAmount * DZD_EUR);
    advice.push({
      id: id++,
      title: 'Strengthen Financial Position',
      description: `Required: ${requiredAmount.toFixed(0)} EUR (${recommended.toLocaleString()} DZD). Add ${Math.max(0, recommended - avgBal).toLocaleString()} DZD to meet the 1.2x safety buffer.`,
      priority: 'critical',
      impact: 'Financial insufficiency is the #1 reason for refusal (21% of rejections)',
      estimatedImprovement: 25
    });
  }

  if (!profile.hasInsurance) {
    advice.push({
      id: id++,
      title: 'Get Travel Insurance',
      description: 'Schengen requires insurance with minimum €30,000 coverage. Must cover medical emergencies, hospitalization, and repatriation.',
      priority: 'critical',
      impact: 'No insurance = automatic grounds for refusal',
      estimatedImprovement: 15
    });
  }

  if (profile.schengenCount === 0) {
    advice.push({
      id: id++,
      title: 'Build Schengen History',
      description: 'Consider getting an easier visa first (Turkey, Georgia, Morocco) to establish travel compliance.',
      priority: 'high',
      impact: 'Previous Schengen usage adds 20-30% to approval chances',
      estimatedImprovement: 25
    });
  }

  if (profile.visaRefusals > 0) {
    const waitTime = profile.visaRefusals >= 2 ? '6-12 months' : '3-6 months';
    advice.push({
      id: id++,
      title: 'Wait After Refusal',
      description: `Wait ${waitTime} before reapplying. Show evidence of changed circumstances (new job, increased savings).`,
      priority: 'critical',
      impact: 'Quick reapplication signals desperation',
      estimatedImprovement: 20
    });
  }

  if (!profile.hasBookings) {
    advice.push({
      id: id++,
      title: 'Book Refundable Travel',
      description: 'Get refundable flight and hotel bookings to show concrete plans. This adds credibility.',
      priority: 'medium',
      impact: 'Vague travel plans raise suspicion',
      estimatedImprovement: 10
    });
  }

  if (profile.employmentType === 'cdi' && profile.yearsEmployed < 1) {
    advice.push({
      id: id++,
      title: 'Build Employment Stability',
      description: 'At least 6-12 months with current employer strengthens your application.',
      priority: 'medium',
      impact: 'Recent job changes indicate instability',
      estimatedImprovement: 15
    });
  }

  if (profile.schengenCount >= 2) {
    strengths.push('Strong Schengen history - repeat traveler');
  }

  if (profile.hasProperty) {
    strengths.push('Property ownership - strong ties to Algeria');
  }

  if (profile.children > 0) {
    strengths.push('Children in Algeria - strong return intent');
  }

  totalScore = Math.min(95, Math.max(5, totalScore));

  const overallVerdict = totalScore >= 85 ? 'strong' : totalScore >= 70 ? 'moderate' : totalScore >= 55 ? 'weak' : 'very_weak';

  const alternatives = generateAlternatives(profile, totalScore, COUNTRY_CONFIGS);

  const officerSummary = generateOfficerSummary(overallVerdict, strengths, weaknesses, totalScore, country);

  const whatIfHints = generateWhatIfHints(profile, avgBal, country, totalScore, requiredAmount);

  const interviewReadiness = calculateInterviewReadiness(profile, totalScore);

  const recommendedWaitTime = profile.visaRefusals > 0
    ? (profile.visaRefusals >= 2 ? '6-12 months' : '3-6 months')
    : undefined;

  const generatedRecommendations = generateImprovementRecommendations(categoryScores, profile, country, requiredAmount);

  const allAdvice = [...advice, ...generatedRecommendations];

  return {
    mainScore: totalScore,
    targetCountry: country.name,
    countryCode: country.code,
    overallVerdict,
    confidenceLevel: avgBal > 0 && profile.employmentType ? 'high' : 'medium',
    estimatedApprovalChance: totalScore,
    estimatedProcessingDays: country.processingDays + (totalScore < 60 ? 10 : 0),
    factors,
    strengths: Array.from(new Set(strengths)),
    weaknesses: Array.from(new Set(weaknesses)),
    missingDocuments: Array.from(new Set(missingDocuments)),
    warnings: Array.from(new Set(warnings)),
    advice: allAdvice.sort((a, b) => {
      const p: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return p[a.priority] - p[b.priority];
    }),
    alternatives,
    officerSummary,
    whatIfHints,
    interviewReadiness,
    recommendedWaitTime,
  };
}

function generateAlternatives(profile: VisaProfile, currentScore: number, configs: Record<string, CountryConfig>): AlternativeCountry[] {
  return Object.entries(configs)
    .filter(([name]) => name !== profile.targetCountry)
    .map(([name, config]) => {
      let adjScore = currentScore + config.baseMod;

      if (profile.schengenCount === 0 && ['Turkey', 'Georgia', 'Morocco', 'Malaysia'].includes(name)) {
        adjScore = Math.min(95, adjScore + 25);
      }

      if (config.difficulty === 'easy') adjScore = Math.min(95, adjScore + 15);
      else if (config.difficulty === 'hard') adjScore = Math.max(5, adjScore - 10);

      const reasons: string[] = [];
      if (config.difficulty === 'easy') reasons.push('Lower requirements');
      if (adjScore > currentScore) reasons.push(`Better approval odds (${adjScore}%)`);
      if (config.processingDays < 15) reasons.push(`Faster processing`);

      return {
        country: config.name,
        flag: config.flag,
        code: config.code,
        score: Math.min(95, Math.max(5, Math.round(adjScore))),
        difficulty: config.difficulty,
        reasons
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function generateOfficerSummary(verdict: string, strengths: string[], weaknesses: string[], score: number, country: CountryConfig): string {
  const strongPoints = strengths.slice(0, 2).join(', ') || 'multiple factors';
  const weakPoints = weaknesses.slice(0, 2).join(', ') || 'various concerns';

  if (verdict === 'strong') {
    return `Strong application with high approval probability. Key strengths: ${strongPoints}. Target: ${country.name}.`;
  } else if (verdict === 'moderate') {
    return `Moderate application. Strengths: ${strongPoints}. Concerns: ${weakPoints}. Consider improvements before applying.`;
  } else {
    return `Weak application with significant risks. Main concerns: ${weakPoints}. Recommend addressing critical issues before reapplication.`;
  }
}

interface CategoryScores {
  financial: number;
  roots: number;
  travel: number;
  documents: number;
  demographic: number;
}

function generateImprovementRecommendations(
  categoryScores: CategoryScores,
  profile: VisaProfile,
  country: CountryConfig,
  requiredAmount: number
): Advice[] {
  const recommendations: Advice[] = [];
  let id = 1;

  const durationDays = DURATION_DAYS[profile.durationOfStay] || 14;
  const minRequired = Math.ceil(requiredAmount * DZD_EUR);

  if (categoryScores.financial < 70) {
    const avgBal = profile.averageMonthlyBalance || profile.bankBalance || 0;
    const needed = Math.max(0, minRequired - avgBal);
    
    recommendations.push({
      id: id++,
      title: 'Increase Bank Balance',
      description: `Add ${needed.toLocaleString()} DZD to reach the required ${minRequired.toLocaleString()} DZD for ${country.name}.`,
      priority: 'critical',
      impact: 'Financial insufficiency is the #1 reason for refusal (21% of rejections)',
      estimatedImprovement: 20
    });

    if (profile.monthlyIncome < 60000) {
      recommendations.push({
        id: id++,
        title: 'Wait for Consistent Income',
        description: 'Show 3+ months of regular salary deposits to demonstrate stable income.',
        priority: 'high',
        impact: 'Income stability strengthens financial proof',
        estimatedImprovement: 15
      });
    }

    if (!profile.hasSponsor) {
      recommendations.push({
        id: id++,
        title: 'Consider Adding Sponsor',
        description: 'A family sponsor (especially EU-based) can strengthen financial requirements.',
        priority: 'medium',
        impact: 'Sponsor income is factored into assessment',
        estimatedImprovement: 10
      });
    }

    if (durationDays > 14) {
      const reducedDays = 14;
      const reducedRequired = country.minDailyEUR * reducedDays * 1.2;
      recommendations.push({
        id: id++,
        title: 'Reduce Trip Duration',
        description: `Consider a shorter trip (${reducedDays} days instead of ${durationDays}) to reduce required funds from ${Math.ceil(requiredAmount).toLocaleString()} to ${Math.ceil(reducedRequired).toLocaleString()} EUR.`,
        priority: 'medium',
        impact: 'Shorter trips require less funds',
        estimatedImprovement: 15
      });
    }
  }

  if (categoryScores.roots < 70) {
    if (!profile.hasProperty) {
      recommendations.push({
        id: id++,
        title: 'Document Property Ownership',
        description: 'If you own property in Algeria, obtain official deed documentation.',
        priority: 'high',
        impact: 'Property ownership is a strong tie to Algeria',
        estimatedImprovement: 15
      });
    }

    if (profile.employmentType === 'cdi' && profile.yearsEmployed < 1) {
      recommendations.push({
        id: id++,
        title: 'Get Leave Approval Letter',
        description: 'Request an employer letter with documented leave approval and return guarantee.',
        priority: 'high',
        impact: 'Shows commitment to return to employment',
        estimatedImprovement: 15
      });
    }

    if (profile.children > 0) {
      recommendations.push({
        id: id++,
        title: 'Document Family Responsibilities',
        description: 'Gather proof of children\'s school enrollment or family obligations in Algeria.',
        priority: 'medium',
        impact: 'Family ties strengthen return intent',
        estimatedImprovement: 10
      });
    }

    if (profile.employmentType === 'self-employed' && profile.yearsEmployed < 3) {
      recommendations.push({
        id: id++,
        title: 'Register Business Officially',
        description: 'Ensure your business is officially registered with tax compliance.',
        priority: 'medium',
        impact: 'Official registration validates self-employment',
        estimatedImprovement: 10
      });
    }
  }

  if (categoryScores.travel < 50) {
    recommendations.push({
      id: id++,
      title: 'Build Travel History First',
      description: 'Apply for easier visas (Turkey, UAE, Georgia) before Schengen to establish compliance.',
      priority: 'critical',
      impact: 'Travel history adds 20-30 points to approval chances',
      estimatedImprovement: 25
    });

    if (profile.visaRefusals > 0) {
      const waitTime = profile.visaRefusals >= 2 ? '6-12 months' : '3-6 months';
      recommendations.push({
        id: id++,
        title: 'Wait After Refusal',
        description: `Wait ${waitTime} before reapplying. Show evidence of changed circumstances.`,
        priority: 'critical',
        impact: 'Quick reapplication signals desperation',
        estimatedImprovement: 20
      });
    }

    recommendations.push({
      id: id++,
      title: 'Consider Alternative Country',
      description: `Countries like Portugal (+15), Spain (+10), or Lithuania (+20) have higher approval rates for Algerians.`,
      priority: 'high',
      impact: 'Country choice affects approval probability',
      estimatedImprovement: 15
    });
  }

  if (categoryScores.documents < 70) {
    if (!profile.hasInsurance) {
      recommendations.push({
        id: id++,
        title: 'Get Travel Insurance',
        description: 'Required: €30,000+ coverage for Schengen. Must include medical emergencies and repatriation.',
        priority: 'critical',
        impact: 'No insurance = automatic refusal grounds',
        estimatedImprovement: 15
      });
    }

    if (!profile.hasBookings) {
      recommendations.push({
        id: id++,
        title: 'Book Refundable Travel',
        description: 'Get refundable flight and hotel bookings to show concrete plans.',
        priority: 'high',
        impact: 'Concrete plans add credibility',
        estimatedImprovement: 10
      });
    }

    recommendations.push({
      id: id++,
      title: 'Prepare Complete Documentation',
      description: 'Ensure all documents are consistent (dates, names, information match across all papers).',
      priority: 'medium',
      impact: 'Document consistency is checked by consular officers',
      estimatedImprovement: 10
    });
  }

  if (categoryScores.demographic < 70) {
    recommendations.push({
      id: id++,
      title: 'Include Explanation Letter',
      description: 'Write a cover letter explaining your circumstances and strong ties to Algeria.',
      priority: 'medium',
      impact: 'Personal explanation can address officer concerns',
      estimatedImprovement: 10
    });

    if (profile.maritalStatus === 'single' && profile.age >= 20 && profile.age <= 35) {
      recommendations.push({
        id: id++,
        title: 'Apply with Family Group',
        description: 'Consider applying with family members to reduce perceived migration risk.',
        priority: 'medium',
        impact: 'Family applications show stronger return intent',
        estimatedImprovement: 15
      });
    }

    if (profile.children > 0) {
      recommendations.push({
        id: id++,
        title: 'Include Children\'s Documents',
        description: 'Submit children\'s birth certificates and school enrollment to demonstrate family obligations.',
        priority: 'medium',
        impact: 'Family obligations are strong return indicators',
        estimatedImprovement: 10
      });
    }
  }

  return recommendations;
}

function generateWhatIfHints(profile: VisaProfile, avgBal: number, country: CountryConfig, currentScore: number, requiredAmount: number): WhatIfHint[] {
  const hints: WhatIfHint[] = [];

  const minRequired = Math.ceil(requiredAmount * DZD_EUR);
  if (avgBal < minRequired || !avgBal) {
    hints.push({
      variable: 'Bank Balance',
      current: avgBal ? `${avgBal.toLocaleString()} DZD` : 'Not provided',
      suggested: `${minRequired.toLocaleString()} DZD`,
      impact: 'Increasing balance to 1.2x required amount adds 15-25 points',
      estimatedImprovement: 20
    });
  }

  if (profile.schengenCount === 0) {
    hints.push({
      variable: 'Schengen History',
      current: 'None',
      suggested: '1 Schengen visa',
      impact: 'Previous Schengen usage adds 20-30 points',
      estimatedImprovement: 25
    });
  }

  if (profile.employmentType !== 'cdi') {
    hints.push({
      variable: 'Employment Type',
      current: profile.employmentType.toUpperCase(),
      suggested: 'CDI (permanent)',
      impact: 'Getting CDI adds 25-35 points',
      estimatedImprovement: 30
    });
  }

  if (!profile.hasInsurance) {
    hints.push({
      variable: 'Travel Insurance',
      current: 'None',
      suggested: '€30,000+ coverage',
      impact: 'Adding insurance adds 10-15 points and removes critical risk',
      estimatedImprovement: 15
    });
  }

  return hints;
}

function calculateInterviewReadiness(profile: VisaProfile, score: number): number {
  let readiness = 50;

  if (profile.hasBookings) readiness += 15;
  if (profile.hasInsurance) readiness += 10;
  if (profile.employmentType === 'cdi') readiness += 15;
  if (profile.schengenCount > 0) readiness += 10;
  if (profile.hasInvitationLetter) readiness += 5;

  readiness = Math.round((readiness + score) / 2);

  return Math.min(100, readiness);
}

export function simulateScoreChange(
  profile: VisaProfile,
  newBankBalance?: number,
  newMonthlyIncome?: number,
  newSchengenCount?: number,
  newEmploymentType?: string
): number {
  const modified = {
    ...profile,
    bankBalance: newBankBalance ?? profile.bankBalance,
    monthlyIncome: newMonthlyIncome ?? profile.monthlyIncome,
    averageMonthlyBalance: newBankBalance ?? profile.averageMonthlyBalance,
    schengenCount: newSchengenCount ?? profile.schengenCount,
    employmentType: (newEmploymentType as any) ?? profile.employmentType,
  };

  const result = assessVisa(modified);
  return result.mainScore;
}

export default {
  assessVisa,
  simulateScoreChange,
  COUNTRY_CONFIGS,
  VISA_PURPOSE_MULTIPLIERS,
};
