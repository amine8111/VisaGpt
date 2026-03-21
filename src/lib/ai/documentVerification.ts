export interface DocumentCheck {
  type: DocumentType;
  isValid: boolean;
  extractedData: ExtractedData;
  issues: Issue[];
  warnings: string[];
  suggestions: string[];
  confidence: number;
  verified: boolean;
}

export type DocumentType = 'passport' | 'bank_statement' | 'employment_letter' | 'hotel_booking' | 'flight_ticket' | 'insurance' | 'invitation_letter' | 'photo';

export interface ExtractedData {
  name?: string;
  passportNumber?: string;
  expiryDate?: string;
  nationality?: string;
  dateOfBirth?: string;
  dates?: string[];
  amounts?: number[];
  companyName?: string;
  jobTitle?: string;
  hotelName?: string;
  hotelAddress?: string;
  flightNumber?: string;
  insuranceProvider?: string;
  coverageAmount?: number;
  returnDate?: string;
}

export interface Issue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  messageAr: string;
}

export interface FraudIndicator {
  type: 'high_risk' | 'medium_risk' | 'low_risk' | 'verified';
  score: number;
  reasons: string[];
  recommendations: string[];
}

const DOCUMENT_REQUIREMENTS: Record<DocumentType, {
  required: string[];
  maxAge: Record<string, number>;
  patterns: RegExp[];
  validation: (doc: DocumentCheck) => Issue[];
}> = {
  passport: {
    required: ['photo', 'machine_readable_zone', 'expiry_date'],
    maxAge: { days: 1825 },
    patterns: [
      /^[A-Z]{1,2}[0-9]{6,9}$/,
      /^[A-Z]{2}[0-9]{7}$/,
    ],
    validation: (doc) => {
      const issues: Issue[] = [];
      
      if (!doc.extractedData.passportNumber) {
        issues.push({
          severity: 'error',
          code: 'MISSING_PASSPORT_NUMBER',
          message: 'Passport number not found or invalid',
          messageAr: 'رقم الجواز غير موجود أو غير صالح',
        });
      }
      
      if (doc.extractedData.expiryDate) {
        const expiry = new Date(doc.extractedData.expiryDate);
        const now = new Date();
        if (expiry < now) {
          issues.push({
            severity: 'error',
            code: 'PASSPORT_EXPIRED',
            message: 'Passport has expired',
            messageAr: 'جواز السفر منتهي الصلاحية',
          });
        } else {
          const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntilExpiry < 180) {
            issues.push({
              severity: 'warning',
              code: 'PASSPORT_EXPIRING_SOON',
              message: `Passport expires in ${daysUntilExpiry} days. Most countries require 6 months validity.`,
              messageAr: `جواز السفر ينتهي خلال ${daysUntilExpiry} يوم. معظم الدول تتطلب صلاحية 6 أشهر.`,
            });
          }
        }
      }
      
      return issues;
    },
  },
  
  bank_statement: {
    required: ['account_holder', 'dates', 'amounts', 'bank_name'],
    maxAge: { days: 90 },
    patterns: [],
    validation: (doc) => {
      const issues: Issue[] = [];
      const amounts = doc.extractedData.amounts || [];
      
      if (amounts.length === 0) {
        issues.push({
          severity: 'error',
          code: 'NO_TRANSACTIONS',
          message: 'No transaction data found',
          messageAr: 'لم يتم العثور على بيانات معاملات',
        });
      }
      
      const balance = amounts[amounts.length - 1] || 0;
      if (balance < 1000) {
        issues.push({
          severity: 'warning',
          code: 'LOW_BALANCE',
          message: 'Current balance appears low for visa purposes',
          messageAr: 'الرصيد الحالي يبدو منخفضاً لأغراض التأشيرة',
        });
      }
      
      const avgBalance = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const balanceVariation = Math.abs(balance - avgBalance) / avgBalance;
      
      if (balanceVariation > 0.5) {
        issues.push({
          severity: 'warning',
          code: 'SUDDEN_BALANCE_CHANGE',
          message: 'Sudden large change in balance detected - may raise questions',
          messageAr: 'تم اكتشاف تغيير مفاجئ كبير في الرصيد - قد يثير تساؤلات',
        });
      }
      
      return issues;
    },
  },
  
  employment_letter: {
    required: ['company_name', 'employee_name', 'job_title', 'employment_date', 'salary'],
    maxAge: { days: 30 },
    patterns: [],
    validation: (doc) => {
      const issues: Issue[] = [];
      
      if (!doc.extractedData.companyName) {
        issues.push({
          severity: 'error',
          code: 'MISSING_COMPANY',
          message: 'Company name not found',
          messageAr: 'اسم الشركة غير موجود',
        });
      }
      
      if (!doc.extractedData.jobTitle) {
        issues.push({
          severity: 'warning',
          code: 'MISSING_JOB_TITLE',
          message: 'Job title not clearly specified',
          messageAr: 'المسمى الوظيفي غير محدد بوضوح',
        });
      }
      
      return issues;
    },
  },
  
  hotel_booking: {
    required: ['hotel_name', 'check_in', 'check_out', 'guest_name'],
    maxAge: { days: 0 },
    patterns: [],
    validation: (doc) => {
      const issues: Issue[] = [];
      const dates = doc.extractedData.dates || [];
      
      if (dates.length < 2) {
        issues.push({
          severity: 'error',
          code: 'MISSING_DATES',
          message: 'Check-in or check-out dates missing',
          messageAr: 'تاريخ الوصول أو المغادرة مفقود',
        });
      } else {
        const checkIn = new Date(dates[0]);
        const now = new Date();
        if (checkIn < now) {
          issues.push({
            severity: 'error',
            code: 'PAST_BOOKING',
            message: 'Booking date is in the past',
            messageAr: 'تاريخ الحجز في الماضي',
          });
        }
      }
      
      return issues;
    },
  },
  
  flight_ticket: {
    required: ['flight_number', 'departure_date', 'return_date', 'passenger_name'],
    maxAge: { days: 0 },
    patterns: [/^[A-Z]{2}[0-9]{3,4}$/],
    validation: (doc) => {
      const issues: Issue[] = [];
      
      if (!doc.extractedData.returnDate) {
        issues.push({
          severity: 'warning',
          code: 'ONE_WAY_TICKET',
          message: 'Only one-way ticket detected. Round-trip is often preferred.',
          messageAr: 'تم اكتشاف تذكرة ذهاب فقط. الرحلة الذهاب والإياب مفضلة غالباً.',
        });
      }
      
      return issues;
    },
  },
  
  insurance: {
    required: ['provider', 'coverage_start', 'coverage_end', 'coverage_amount'],
    maxAge: { days: 0 },
    patterns: [],
    validation: (doc) => {
      const issues: Issue[] = [];
      
      if (!doc.extractedData.coverageAmount) {
        issues.push({
          severity: 'warning',
          code: 'UNKNOWN_COVERAGE',
          message: 'Coverage amount not clearly stated',
          messageAr: 'مبلغ التغطية غير محدد بوضوح',
        });
      } else if (doc.extractedData.coverageAmount < 30000) {
        issues.push({
          severity: 'warning',
          code: 'LOW_COVERAGE',
          message: 'Coverage amount may be below Schengen minimum (€30,000)',
          messageAr: 'قد يكون مبلغ التغطية أقل من الحد الأدنى شنغن (30,000 يورو)',
        });
      }
      
      return issues;
    },
  },
  
  invitation_letter: {
    required: ['inviter_name', 'invitee_name', 'invitation_date', 'relationship', 'address'],
    maxAge: { days: 90 },
    patterns: [],
    validation: (doc) => {
      const issues: Issue[] = [];
      
      if (!doc.extractedData.name) {
        issues.push({
          severity: 'error',
          code: 'MISSING_INVITER',
          message: 'Inviter information missing',
          messageAr: 'معلومات الداعي مفقودة',
        });
      }
      
      return issues;
    },
  },
  
  photo: {
    required: ['face_detected', 'background', 'size', 'format'],
    maxAge: { days: 0 },
    patterns: [],
    validation: (doc) => {
      const issues: Issue[] = [];
      
      const hasFace = doc.extractedData.name !== undefined;
      
      if (!hasFace) {
        issues.push({
          severity: 'error',
          code: 'NO_FACE_DETECTED',
          message: 'No face detected in photo or photo is invalid',
          messageAr: 'لم يتم اكتشاف وجه في الصورة أو الصورة غير صالحة',
        });
      }
      
      return issues;
    },
  },
};

export function analyzeDocument(type: DocumentType, content: any): DocumentCheck {
  const requirements = DOCUMENT_REQUIREMENTS[type];
  
  const extractedData: ExtractedData = extractData(type, content);
  
  const issues = requirements.validation({
    type,
    isValid: true,
    extractedData,
    issues: [],
    warnings: [],
    suggestions: [],
    confidence: 0,
    verified: false,
  });
  
  const missingRequired = requirements.required.filter(req => {
    const reqMap: Record<string, keyof ExtractedData> = {
      'photo': 'name',
      'machine_readable_zone': 'passportNumber',
      'expiry_date': 'expiryDate',
      'account_holder': 'name',
      'dates': 'dates',
      'amounts': 'amounts',
      'bank_name': 'companyName',
      'company_name': 'companyName',
      'employee_name': 'name',
      'job_title': 'jobTitle',
      'employment_date': 'dates',
      'salary': 'amounts',
      'hotel_name': 'hotelName',
      'check_in': 'dates',
      'check_out': 'dates',
      'guest_name': 'name',
      'flight_number': 'flightNumber',
      'departure_date': 'dates',
      'return_date': 'dates',
      'passenger_name': 'name',
      'provider': 'insuranceProvider',
      'coverage_start': 'dates',
      'coverage_end': 'dates',
      'coverage_amount': 'amounts',
      'inviter_name': 'name',
      'invitee_name': 'name',
      'invitation_date': 'dates',
      'relationship': 'name',
      'address': 'hotelAddress',
      'face_detected': 'name',
      'background': 'name',
      'size': 'name',
      'format': 'name',
    };
    return !extractedData[reqMap[req]];
  });
  
  missingRequired.forEach(req => {
    issues.push({
      severity: 'error',
      code: `MISSING_${req.toUpperCase()}`,
      message: `Required element "${req}" not found`,
      messageAr: `العنصر المطلوب "${req}" غير موجود`,
    });
  });
  
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  if (issues.some(i => i.severity === 'error')) {
    suggestions.push('Fix all errors before submitting');
  }
  
  const confidence = calculateConfidence(type, extractedData, issues);
  const isValid = !issues.some(i => i.severity === 'error');
  
  return {
    type,
    isValid,
    extractedData,
    issues,
    warnings,
    suggestions,
    confidence,
    verified: isValid && confidence > 70,
  };
}

function extractData(type: DocumentType, content: any): ExtractedData {
  if (typeof content === 'string') {
    return parseTextContent(type, content);
  }
  
  if (typeof content === 'object') {
    return content;
  }
  
  return {};
}

function parseTextContent(type: DocumentType, text: string): ExtractedData {
  const data: ExtractedData = {};
  const lowerText = text.toLowerCase();
  
  const datePatterns = [
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g,
    /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/g,
  ];
  
  const allDates: string[] = [];
  datePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) allDates.push(...matches);
  });
  if (allDates.length > 0) data.dates = allDates;
  
  const amountPatterns = [
    /(?:€|EUR|\$|USD|DZD|DA)\s*([\d,]+(?:\.\d{2})?)/gi,
    /([\d,]+(?:\.\d{2})?)\s*(?:€|EUR|\$|USD|DZD|DA)/gi,
  ];
  
  const allAmounts: number[] = [];
  amountPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0) allAmounts.push(amount);
    }
  });
  if (allAmounts.length > 0) data.amounts = allAmounts;
  
  if (type === 'passport') {
    const passportPatterns = [
      /([A-Z]{1,2}[0-9]{6,9})/,
      /Passport\s*(?:No\.?|Number|#)?\s*:?\s*([A-Z0-9]+)/i,
    ];
    
    for (const pattern of passportPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.passportNumber = match[1] || match[2];
        break;
      }
    }
  }
  
  const namePatterns = [
    /(?:Name|Nom|Name)\s*:?\s*([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /(?:Mr\.|Mrs\.|Ms\.)\s+([A-Z][a-z]+ [A-Z][a-z]+)/i,
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.name = match[1];
      break;
    }
  }
  
  return data;
}

function calculateConfidence(type: DocumentType, data: ExtractedData, issues: Issue[]): number {
  let confidence = 50;
  
  const fieldCount = Object.keys(data).length;
  confidence += Math.min(30, fieldCount * 10);
  
  const requiredCount = DOCUMENT_REQUIREMENTS[type].required.length;
  const satisfiedCount = requiredCount - issues.filter(i => i.severity === 'error').length;
  confidence += Math.min(20, (satisfiedCount / requiredCount) * 20);
  
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  confidence -= errorCount * 15;
  confidence -= warningCount * 5;
  
  return Math.min(100, Math.max(0, Math.round(confidence)));
}

export function analyzeDocumentBundle(documents: DocumentCheck[]): {
  overallValid: boolean;
  confidence: number;
  missingDocuments: string[];
  issues: Issue[];
  recommendations: string[];
} {
  const missingDocuments: string[] = [];
  const allIssues: Issue[] = [];
  const recommendations: string[] = [];
  
  const requiredTypes: DocumentType[] = ['passport', 'photo'];
  
  for (const reqType of requiredTypes) {
    const found = documents.find(d => d.type === reqType);
    if (!found) {
      missingDocuments.push(reqType);
    }
  }
  
  documents.forEach(doc => {
    allIssues.push(...doc.issues);
  });
  
  const avgConfidence = documents.reduce((sum, doc) => sum + doc.confidence, 0) / documents.length;
  
  if (missingDocuments.length > 0) {
    recommendations.push('Upload all required documents before submitting');
  }
  
  const highSeverityCount = allIssues.filter(i => i.severity === 'error').length;
  if (highSeverityCount > 0) {
    recommendations.push('Fix all critical errors before submission');
  }
  
  return {
    overallValid: missingDocuments.length === 0 && !allIssues.some(i => i.severity === 'error'),
    confidence: Math.round(avgConfidence),
    missingDocuments,
    issues: allIssues,
    recommendations,
  };
}

export default {
  analyzeDocument,
  analyzeDocumentBundle,
  DOCUMENT_REQUIREMENTS,
};
