export { 
  default as visaAssessment,
  assessVisa,
  simulateScoreChange,
  COUNTRY_CONFIGS,
  VISA_PURPOSE_MULTIPLIERS,
} from './visaAssessment';

export { generateProAssessment } from './proAssessment';
export type {
  ProAssessmentResult,
  ProAdvice,
  ProApplicationField,
  ProTimelineItem,
  ProRiskFlag,
  ProInterviewQuestion,
  ProPersonalizedPlan,
  ProPlanStep,
} from './proAssessment';

export type {
  VisaProfile,
  AssessmentResult,
  FactorScore,
  Advice,
  AlternativeCountry,
  WhatIfHint,
} from './visaAssessment';

export {
  getQuestionsForVisaType,
  evaluateAnswer,
  generateFollowUpQuestion,
} from './interviewCoach';

export type {
  InterviewQuestion,
  AnswerEvaluation,
  InterviewSession,
} from './interviewCoach';

export {
  analyzeDocument,
  analyzeDocumentBundle,
} from './documentVerification';

export type {
  DocumentCheck,
  DocumentType,
  ExtractedData,
  Issue,
} from './documentVerification';

export {
  analyzeRisk,
  checkDuplicatePatterns,
  getRiskColor,
  getRiskLabel,
} from './riskAnalysis';

export type {
  RiskProfile,
  RiskAnalysisResult,
  RiskFactor,
  RiskFlag,
} from './riskAnalysis';
