export interface RiskProfile {
  passportNumber?: string;
  email?: string;
  phone?: string;
  ipAddress?: string;
  nationality?: string;
  age?: number;
  employmentType?: string;
  previousAppointments?: number;
  failedAppointments?: number;
  accountAge?: number;
  travelHistory?: string[];
  visaRefusals?: number;
  overstayHistory?: boolean;
}

export interface RiskAnalysisResult {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  factors: RiskFactor[];
  flags: RiskFlag[];
  recommendations: string[];
  shouldBlock: boolean;
  blockReasons: string[];
  confidenceLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface RiskFactor {
  category: string;
  score: number;
  weight: number;
  description: string;
  isNegative: boolean;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface RiskFlag {
  type: 'duplicate' | 'suspicious' | 'pattern' | 'history' | 'behavior';
  severity: 'low' | 'medium' | 'high' | 'critical';
  code: string;
  message: string;
  messageAr: string;
  detected: boolean;
  evidence?: string[];
}

export interface FraudPattern {
  name: string;
  description: string;
  indicators: string[];
  severity: 'low' | 'medium' | 'high';
  detectionWeight: number;
}

const FRAUD_PATTERNS: FraudPattern[] = [
  {
    name: 'Rush Application',
    description: 'Applications submitted immediately after account creation',
    indicators: ['account_age_days', 'time_since_signup'],
    severity: 'medium',
    detectionWeight: 15,
  },
  {
    name: 'Geographic Anomaly',
    description: 'IP location differs significantly from stated location',
    indicators: ['ip_country', 'stated_country'],
    severity: 'high',
    detectionWeight: 25,
  },
  {
    name: 'Document Reuse',
    description: 'Same passport/national ID used by multiple accounts',
    indicators: ['passport_hash', 'id_hash'],
    severity: 'high',
    detectionWeight: 30,
  },
  {
    name: 'Velocity Pattern',
    description: 'Unusual number of applications in short time',
    indicators: ['appointments_this_week', 'appointments_this_month'],
    severity: 'medium',
    detectionWeight: 20,
  },
  {
    name: 'Payment Velocity',
    description: 'Multiple failed payment attempts',
    indicators: ['failed_payments', 'payment_attempts'],
    severity: 'low',
    detectionWeight: 10,
  },
  {
    name: 'Device Fingerprint',
    description: 'Multiple accounts from same device',
    indicators: ['device_id', 'browser_fingerprint'],
    severity: 'medium',
    detectionWeight: 20,
  },
];

export function analyzeRisk(profile: RiskProfile): RiskAnalysisResult {
  const factors: RiskFactor[] = [];
  const flags: RiskFlag[] = [];
  const recommendations: string[] = [];
  const blockReasons: string[] = [];
  
  let totalRiskScore = 0;
  let totalWeight = 0;
  
  if (profile.nationality) {
    const riskCountries = getRiskCountries();
    const isHighRisk = riskCountries.some(r => 
      profile.nationality?.toLowerCase().includes(r.toLowerCase())
    );
    
    const score = isHighRisk ? 40 : 0;
    factors.push({
      category: 'Nationality Risk',
      score,
      weight: 15,
      description: isHighRisk 
        ? `${profile.nationality} is in higher risk category`
        : `${profile.nationality} has standard processing`,
      isNegative: isHighRisk,
      trend: 'stable',
    });
    totalRiskScore += score * 15;
    totalWeight += 15;
  }
  
  if (profile.accountAge !== undefined) {
    let score = 0;
    if (profile.accountAge < 1) score = 40;
    else if (profile.accountAge < 7) score = 25;
    else if (profile.accountAge < 30) score = 10;
    
    factors.push({
      category: 'Account Age',
      score,
      weight: 10,
      description: score > 0 
        ? `Account is ${profile.accountAge} days old - very new`
        : `Account age is acceptable`,
      isNegative: score > 0,
      trend: 'stable',
    });
    totalRiskScore += score * 10;
    totalWeight += 10;
    
    if (profile.accountAge < 1) {
      flags.push({
        type: 'pattern',
        severity: 'medium',
        code: 'NEW_ACCOUNT_RISK',
        message: 'Very new account making application',
        messageAr: 'حساب جديد جداً يقدم طلب',
        detected: true,
        evidence: [`Account age: ${profile.accountAge} days`],
      });
    }
  }
  
  if (profile.visaRefusals !== undefined && profile.visaRefusals > 0) {
    const score = Math.min(50, profile.visaRefusals * 20);
    factors.push({
      category: 'Previous Refusals',
      score,
      weight: 25,
      description: `${profile.visaRefusals} previous refusal(s)`,
      isNegative: true,
      trend: 'worsening',
    });
    totalRiskScore += score * 25;
    totalWeight += 25;
    
    if (profile.visaRefusals >= 2) {
      flags.push({
        type: 'history',
        severity: 'high',
        code: 'MULTIPLE_REFUSALS',
        message: 'Multiple visa refusals on record',
        messageAr: 'رفض تأشيرات متعددة مسجلة',
        detected: true,
        evidence: [`Refusal count: ${profile.visaRefusals}`],
      });
      blockReasons.push('Multiple previous visa refusals');
    }
  }
  
  if (profile.overstayHistory) {
    factors.push({
      category: 'Immigration History',
      score: 60,
      weight: 30,
      description: 'Previous overstay or immigration violation',
      isNegative: true,
      trend: 'worsening',
    });
    totalRiskScore += 60 * 30;
    totalWeight += 30;
    
    flags.push({
      type: 'history',
      severity: 'critical',
      code: 'OVERSTAY_HISTORY',
      message: 'Previous overstay or immigration violation detected',
      messageAr: 'تم اكتشاف تجاوز إقامة أو انتهاك هجرة سابق',
      detected: true,
    });
    blockReasons.push('Previous immigration violation');
  }
  
  if (profile.previousAppointments !== undefined && profile.failedAppointments !== undefined) {
    const failureRate = profile.previousAppointments > 0 
      ? profile.failedAppointments / profile.previousAppointments 
      : 0;
    
    let score = 0;
    if (failureRate >= 0.5) score = 50;
    else if (failureRate >= 0.3) score = 30;
    else if (failureRate > 0) score = 15;
    
    factors.push({
      category: 'Appointment History',
      score,
      weight: 15,
      description: `${profile.failedAppointments}/${profile.previousAppointments} failed appointments`,
      isNegative: score > 0,
      trend: failureRate > 0.3 ? 'worsening' : 'stable',
    });
    totalRiskScore += score * 15;
    totalWeight += 15;
    
    if (failureRate >= 0.5) {
      flags.push({
        type: 'behavior',
        severity: 'high',
        code: 'HIGH_FAILURE_RATE',
        message: 'High rate of cancelled/no-show appointments',
        messageAr: 'معدل عالي من المواعيد الملغاة/الغياب',
        detected: true,
        evidence: [`Failure rate: ${(failureRate * 100).toFixed(1)}%`],
      });
    }
  }
  
  if (profile.travelHistory !== undefined) {
    const valuableStamps = profile.travelHistory?.filter(s => 
      ['USA', 'UK', 'Canada', 'Australia', 'Japan', 'Schengen'].includes(s)
    ).length || 0;
    
    let score = 0;
    if (valuableStamps >= 3) score = -20;
    else if (valuableStamps >= 1) score = -10;
    
    factors.push({
      category: 'Travel History',
      score: Math.abs(score),
      weight: 10,
      description: score < 0 
        ? `${valuableStamps} valuable previous visas`
        : 'Limited travel history',
      isNegative: score > 0,
      trend: 'improving',
    });
    totalRiskScore += Math.abs(score) * 10 * (score > 0 ? 1 : -1);
    totalWeight += 10;
  }
  
  if (profile.email) {
    const emailRisk = analyzeEmail(profile.email);
    if (emailRisk > 0) {
      factors.push({
        category: 'Email Analysis',
        score: emailRisk,
        weight: 5,
        description: 'Email shows potential risk indicators',
        isNegative: true,
        trend: 'stable',
      });
      totalRiskScore += emailRisk * 5;
      totalWeight += 5;
    }
  }
  
  const normalizedRiskScore = totalWeight > 0 
    ? Math.round(totalRiskScore / totalWeight) 
    : 20;
  
  const clampedScore = Math.min(100, Math.max(0, normalizedRiskScore));
  
  let overallRisk: RiskAnalysisResult['overallRisk'];
  if (clampedScore >= 75) overallRisk = 'critical';
  else if (clampedScore >= 50) overallRisk = 'high';
  else if (clampedScore >= 25) overallRisk = 'medium';
  else overallRisk = 'low';
  
  const shouldBlock = blockReasons.length > 0 && clampedScore >= 50;
  
  const confidenceLevel: RiskAnalysisResult['confidenceLevel'] = 
    Object.keys(profile).length >= 5 ? 'high' :
    Object.keys(profile).length >= 3 ? 'medium' : 'low';
  
  if (clampedScore >= 50) {
    recommendations.push('Additional verification may be required');
  }
  if (clampedScore >= 75) {
    recommendations.push('Manual review strongly recommended');
  }
  if (!profile.travelHistory || profile.travelHistory.length === 0) {
    recommendations.push('Strongly recommended to provide travel history documentation');
  }
  if (profile.accountAge && profile.accountAge < 7) {
    recommendations.push('Consider waiting a few days before submitting application');
  }
  
  return {
    overallRisk,
    riskScore: clampedScore,
    factors,
    flags,
    recommendations,
    shouldBlock,
    blockReasons,
    confidenceLevel,
    lastUpdated: new Date().toISOString(),
  };
}

function getRiskCountries(): string[] {
  return [
    'Afghanistan', 'Iran', 'Iraq', 'Syria', 'Somalia', 'Nigeria', 
    'Pakistan', 'North Korea', 'Cuba', 'Venezuela',
    'Yemen', 'Libya', 'Sudan', 'Eritrea',
  ];
}

function analyzeEmail(email: string): number {
  let risk = 0;
  
  const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const emailDomain = email.split('@')[1]?.toLowerCase();
  
  if (emailDomain && freeEmailProviders.includes(emailDomain)) {
    risk += 10;
  }
  
  const suspiciousPatterns = ['test', 'temp', 'fake', 'disposable', 'throwaway'];
  const emailLocal = email.split('@')[0]?.toLowerCase();
  
  if (suspiciousPatterns.some(p => emailLocal?.includes(p))) {
    risk += 25;
  }
  
  if (/^\d+$/.test(emailLocal || '')) {
    risk += 15;
  }
  
  return Math.min(40, risk);
}

export function checkDuplicatePatterns(
  currentData: { passportNumber?: string; email?: string; phone?: string; ipAddress?: string },
  existingData: Array<{ passportNumber?: string; email?: string; phone?: string; ipAddress?: string }>
): RiskFlag[] {
  const flags: RiskFlag[] = [];
  
  for (const existing of existingData) {
    if (currentData.passportNumber && existing.passportNumber === currentData.passportNumber) {
      flags.push({
        type: 'duplicate',
        severity: 'critical',
        code: 'PASSPORT_ALREADY_USED',
        message: 'This passport number has been used in another application',
        messageAr: 'تم استخدام رقم جواز السفر هذا في طلب آخر',
        detected: true,
      });
    }
    
    if (currentData.email && existing.email === currentData.email) {
      flags.push({
        type: 'duplicate',
        severity: 'high',
        code: 'EMAIL_ALREADY_USED',
        message: 'This email has been used in another application',
        messageAr: 'تم استخدام هذا البريد الإلكتروني في طلب آخر',
        detected: true,
      });
    }
    
    if (currentData.phone && existing.phone === currentData.phone) {
      flags.push({
        type: 'duplicate',
        severity: 'medium',
        code: 'PHONE_ALREADY_USED',
        message: 'This phone number has been used in another application',
        messageAr: 'تم استخدام رقم الهاتف هذا في طلب آخر',
        detected: true,
      });
    }
    
    if (currentData.ipAddress && existing.ipAddress === currentData.ipAddress) {
      flags.push({
        type: 'suspicious',
        severity: 'medium',
        code: 'SAME_IP_ADDRESS',
        message: 'Same IP address detected as another application',
        messageAr: 'تم اكتشاف نفس عنوان IP كطلب آخر',
        detected: true,
      });
    }
  }
  
  return flags;
}

export function getRiskColor(score: number): string {
  if (score >= 75) return '#ef4444';
  if (score >= 50) return '#f97316';
  if (score >= 25) return '#eab308';
  return '#22c55e';
}

export function getRiskLabel(score: number, lang: 'ar' | 'en' = 'en'): string {
  if (lang === 'ar') {
    if (score >= 75) return 'خطر حرج';
    if (score >= 50) return 'خطر عالي';
    if (score >= 25) return 'خطر متوسط';
    return 'خطر منخفض';
  }
  
  if (score >= 75) return 'Critical Risk';
  if (score >= 50) return 'High Risk';
  if (score >= 25) return 'Medium Risk';
  return 'Low Risk';
}

export default {
  analyzeRisk,
  checkDuplicatePatterns,
  getRiskColor,
  getRiskLabel,
  FRAUD_PATTERNS,
};
