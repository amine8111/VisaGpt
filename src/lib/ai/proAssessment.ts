import { VisaProfile, COUNTRY_CONFIGS, VISA_PURPOSE_MULTIPLIERS } from './visaAssessment'

export interface ProAdvice {
  id: number
  category: 'critical' | 'high' | 'medium' | 'low'
  title: string
  titleAr: string
  titleFr: string
  description: string
  descriptionAr: string
  descriptionFr: string
  action: string
  actionAr: string
  actionFr: string
  timeline: string
  timelineAr: string
  timelineFr: string
  estimatedImprovement: number
  documents?: string[]
  documentsAr?: string[]
  documentsFr?: string[]
}

export interface ProApplicationField {
  name: string
  nameAr: string
  nameFr: string
  value: any
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'average' | 'poor' | 'critical' | 'missing'
  feedback: string
  feedbackAr: string
  feedbackFr: string
  suggestion: string
  suggestionAr: string
  suggestionFr: string
}

export interface ProAssessmentResult {
  overallScore: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F'
  gradeDescription: string
  gradeColor: string
  confidenceLevel: 'high' | 'medium' | 'low'
  fields: ProApplicationField[]
  aiAdvice: ProAdvice[]
  missingDocuments: string[]
  timeline: ProTimelineItem[]
  riskFlags: ProRiskFlag[]
  successProbability: number
  interviewQuestions: ProInterviewQuestion[]
  countrySpecificTips: string[]
  countrySpecificTipsAr: string[]
  personalizedPlan: ProPersonalizedPlan
}

export interface ProTimelineItem {
  week: number
  title: string
  titleAr: string
  titleFr: string
  description: string
  descriptionAr: string
  descriptionFr: string
  completed: boolean
  critical: boolean
}

export interface ProRiskFlag {
  type: 'critical' | 'high' | 'medium' | 'low'
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  mitigation: string
  mitigationAr: string
}

export interface ProInterviewQuestion {
  question: string
  questionAr: string
  goodAnswer: string
  goodAnswerAr: string
  goodAnswerFr: string
  tips: string[]
  tipsAr: string[]
}

export interface ProPersonalizedPlan {
  title: string
  titleAr: string
  duration: string
  durationAr: string
  steps: ProPlanStep[]
}

export interface ProPlanStep {
  week: number
  title: string
  titleAr: string
  actions: string[]
  actionsAr: string[]
  target: string
  targetAr: string
}

const DZD_EUR = 145

const EMPLOYMENT_SCORES = {
  'cdi': { score: 100, desc: 'CDI (Permanent Contract)', descAr: 'عقد دائم', descFr: 'CDI (Contrat Permanent)' },
  'cdd': { score: 70, desc: 'CDD (Fixed-term)', descAr: 'عقد مؤقت', descFr: 'CDD (Durée Déterminée)' },
  'self-employed': { score: 75, desc: 'Self-employed', descAr: 'عمل حر', descFr: 'Travail Indépendant' },
  'student': { score: 65, desc: 'Student', descAr: 'طالب', descFr: 'Étudiant' },
  'retired': { score: 60, desc: 'Retired', descAr: 'متقاعد', descFr: 'Retraité' },
  'unemployed': { score: 20, desc: 'Unemployed', descAr: 'غير موظف', descFr: 'Sans Emploi' },
}

const DURATION_DAYS: Record<string, number> = {
  'less than week': 5,
  '1-2 weeks': 14,
  '1-3 months': 60,
  '3-6 months': 120,
  'more than 6 months': 180,
}

export function generateProAssessment(profile: VisaProfile): ProAssessmentResult {
  const country = COUNTRY_CONFIGS[profile.targetCountry] || COUNTRY_CONFIGS['France']
  const fields: ProApplicationField[] = []
  const aiAdvice: ProAdvice[] = []
  const missingDocuments: string[] = []
  const riskFlags: ProRiskFlag[] = []
  let id = 1
  let totalScore = 0
  let maxScore = 0

  const durationDays = DURATION_DAYS[profile.durationOfStay] || 14
  const requiredAmount = country.minDailyEUR * durationDays * 1.2
  const balanceEUR = (profile.bankBalance || 0) / DZD_EUR
  const incomeEUR = (profile.monthlyIncome || 0) / DZD_EUR
  const balanceRatio = balanceEUR / requiredAmount

  const empData = EMPLOYMENT_SCORES[profile.employmentType] || EMPLOYMENT_SCORES['unemployed']

  // 1. Passport Validity
  maxScore += 15
  const passportScore = profile.age ? 15 : 0
  totalScore += passportScore
  fields.push({
    name: 'Passport Validity',
    nameAr: 'صلاحية جواز السفر',
    nameFr: 'Validité du Passeport',
    value: profile.age ? 'Valid' : 'Not provided',
    score: passportScore,
    maxScore: 15,
    status: profile.age ? 'good' : 'missing',
    feedback: profile.age ? 'Passport information provided' : 'Please provide passport details',
    feedbackAr: profile.age ? 'تم تقديم معلومات جواز السفر' : 'يرجى تقديم تفاصيل جواز السفر',
    feedbackFr: profile.age ? 'Informations passeport fournies' : 'Veuillez fournir les détails du passeport',
    suggestion: 'Ensure passport is valid for at least 6 months beyond your trip',
    suggestionAr: 'تأكد من أن جواز السفر صالح لمدة 6 أشهر على الأقل بعد رحلتك',
    suggestionFr: 'Assurez-vous que le passeport est valide 6 mois après votre voyage',
  })

  // 2. Financial Proof - Bank Balance
  maxScore += 25
  let bankScore = 0
  let bankStatus: ProApplicationField['status'] = 'critical'
  if (balanceRatio >= 2.5) { bankScore = 25; bankStatus = 'excellent' }
  else if (balanceRatio >= 1.8) { bankScore = 22; bankStatus = 'good' }
  else if (balanceRatio >= 1.2) { bankScore = 18; bankStatus = 'average' }
  else if (balanceRatio >= 1.0) { bankScore = 12; bankStatus = 'poor' }
  else if (balanceRatio >= 0.8) { bankScore = 8; bankStatus = 'critical' }
  else { bankScore = 3; bankStatus = 'critical' }
  totalScore += bankScore

  fields.push({
    name: 'Bank Balance',
    nameAr: 'الرصيد البنكي',
    nameFr: 'Solde Bancaire',
    value: `${(profile.bankBalance || 0).toLocaleString()} DZD (${balanceEUR.toFixed(0)} EUR)`,
    score: bankScore,
    maxScore: 25,
    status: bankStatus,
    feedback: balanceRatio >= 1.2 ? 'Sufficient funds for your trip' : `Shortfall: ${(requiredAmount - balanceEUR).toFixed(0)} EUR`,
    feedbackAr: balanceRatio >= 1.2 ? 'أموال كافية لرحلتك' : `النقص: ${(requiredAmount - balanceEUR).toFixed(0)} يورو`,
    feedbackFr: balanceRatio >= 1.2 ? 'Fonds suffisants pour votre voyage' : `Manque: ${(requiredAmount - balanceEUR).toFixed(0)} EUR`,
    suggestion: balanceRatio >= 1.2 ? 'Great! Maintain this balance' : `Add ${Math.max(0, (requiredAmount * 1.2 - balanceEUR) * DZD_EUR).toLocaleString()} DZD to meet requirements`,
    suggestionAr: balanceRatio >= 1.2 ? 'ممتاز! حافظ على هذا الرصيد' : `أضف ${Math.max(0, (requiredAmount * 1.2 - balanceEUR) * DZD_EUR).toLocaleString()} دج لتلبية المتطلبات`,
    suggestionFr: balanceRatio >= 1.2 ? 'Excellent! Maintenez ce solde' : `Ajoutez ${Math.max(0, (requiredAmount * 1.2 - balanceEUR) * DZD_EUR).toLocaleString()} DZD pour meet les exigences`,
  })

  // 3. Income Stability
  maxScore += 20
  let incomeScore = 0
  let incomeStatus: ProApplicationField['status'] = 'average'
  if (incomeEUR >= 1380) { incomeScore = 20; incomeStatus = 'excellent' }
  else if (incomeEUR >= 1035) { incomeScore = 17; incomeStatus = 'good' }
  else if (incomeEUR >= 690) { incomeScore = 14; incomeStatus = 'average' }
  else if (incomeEUR >= 415) { incomeScore = 10; incomeStatus = 'poor' }
  else { incomeScore = 5; incomeStatus = 'poor' }
  totalScore += incomeScore

  fields.push({
    name: 'Monthly Income',
    nameAr: 'الدخل الشهري',
    nameFr: 'Revenu Mensuel',
    value: `${(profile.monthlyIncome || 0).toLocaleString()} DZD (${incomeEUR.toFixed(0)} EUR)`,
    score: incomeScore,
    maxScore: 20,
    status: incomeStatus,
    feedback: `${empData.desc} - ${incomeStatus === 'excellent' ? 'Strong' : incomeStatus === 'good' ? 'Good' : 'Could be improved'}`,
    feedbackAr: `${empData.descAr} - ${incomeStatus === 'excellent' ? 'قوي' : incomeStatus === 'good' ? 'جيد' : 'يمكن التحسين'}`,
    feedbackFr: `${empData.descFr} - ${incomeStatus === 'excellent' ? 'Fort' : incomeStatus === 'good' ? 'Bon' : 'À améliorer'}`,
    suggestion: incomeStatus === 'excellent' ? 'Excellent income documentation' : `Consider ${profile.employmentType === 'cdi' ? 'showing 3+ months of salary slips' : 'getting stable employment'}`,
    suggestionAr: incomeStatus === 'excellent' ? 'وثائق دخل ممتازة' : `فكر في ${profile.employmentType === 'cdi' ? 'إظهار 3+ أشهر من كشوف المرتبات' : 'الحصول على وظيفة مستقرة'}`,
    suggestionFr: incomeStatus === 'excellent' ? 'Excellente documentation' : `Considérez ${profile.employmentType === 'cdi' ? 'montrer 3+ mois de fiches de paie' : "d'obtenir un emploi stable"}`,
  })

  // 4. Employment
  maxScore += 15
  const employmentScore = empData.score * 0.15
  totalScore += employmentScore
  fields.push({
    name: 'Employment Status',
    nameAr: 'الحالة الوظيفية',
    nameFr: "Situation d'Emploi",
    value: empData.desc,
    score: employmentScore,
    maxScore: 15,
    status: empData.score >= 80 ? 'excellent' : empData.score >= 60 ? 'average' : 'poor',
    feedback: empData.score >= 80 ? 'Strong employment ties' : 'Employment could be stronger',
    feedbackAr: empData.score >= 80 ? 'روابط وظيفية قوية' : 'الوظيفة يمكن أن تكون أقوى',
    feedbackFr: empData.score >= 80 ? 'Liens solides' : "L'emploi pourrait être plus fort",
    suggestion: empData.score >= 80 ? 'Include employer letter with leave approval' : 'CDI with 1+ year tenure is best',
    suggestionAr: empData.score >= 80 ? 'أرفق خطاب صاحب العمل مع موافقة الإجازة' : 'CDI مع سنة + هو الأفضل',
    suggestionFr: empData.score >= 80 ? 'Joindre lettre avec approbation congé' : 'CDI avec 1+ an est préférable',
  })

  // 5. Travel History
  maxScore += 15
  let travelScore = 50
  if (profile.overstayHistory) { travelScore = 5; riskFlags.push({ type: 'critical', title: 'Overstay History', titleAr: 'تاريخ التجاوز', description: 'Previous Schengen overstay', descriptionAr: 'تجاوز سابق لمنطقة شنغن', mitigation: 'Must show changed circumstances', mitigationAr: 'يجب إظهار ظروف متغيرة' }) }
  if (profile.visaRefusals > 0) { travelScore -= profile.visaRefusals * 15 }
  if (profile.schengenCount >= 3) travelScore = Math.min(100, travelScore + 40)
  else if (profile.schengenCount >= 1) travelScore = Math.min(100, travelScore + 20)
  travelScore = Math.max(0, travelScore)
  const travelFieldScore = (travelScore / 100) * 15
  totalScore += travelFieldScore

  fields.push({
    name: 'Schengen History',
    nameAr: 'تاريخ شنغن',
    nameFr: 'Historique Schengen',
    value: `${profile.schengenCount || 0} previous visas`,
    score: travelFieldScore,
    maxScore: 15,
    status: profile.schengenCount >= 2 ? 'excellent' : profile.schengenCount >= 1 ? 'good' : profile.schengenCount === 0 ? 'average' : 'poor',
    feedback: profile.overstayHistory ? 'Critical: Previous overstay' : profile.schengenCount >= 2 ? 'Excellent history' : profile.schengenCount === 0 ? 'First-time applicant' : 'Good history',
    feedbackAr: profile.overstayHistory ? 'حرج: تجاوز سابق' : profile.schengenCount >= 2 ? 'سجل ممتاز' : profile.schengenCount === 0 ? 'أول طلب' : 'سجل جيد',
    feedbackFr: profile.overstayHistory ? 'Critique: Séjour précédent' : profile.schengenCount >= 2 ? 'Excellent historique' : profile.schengenCount === 0 ? 'Premier demandeur' : 'Bon historique',
    suggestion: profile.schengenCount === 0 ? 'Build history with Turkey/Georgia first' : 'Include all previous visa copies',
    suggestionAr: profile.schengenCount === 0 ? 'ابنِ سجلاً مع تركيا/جورجيا أولاً' : 'أدرج جميع نسخ التأشيرات السابقة',
    suggestionFr: profile.schengenCount === 0 ? 'Construisez historique avec Turquie/Géorgie' : 'Incluez tous les visas précédents',
  })

  // 6. Insurance
  maxScore += 10
  const insuranceScore = profile.hasInsurance ? 10 : 0
  totalScore += insuranceScore
  if (!profile.hasInsurance) missingDocuments.push('Travel Insurance (€30,000+ coverage)')

  fields.push({
    name: 'Travel Insurance',
    nameAr: 'تأمين السفر',
    nameFr: "Assurance Voyage",
    value: profile.hasInsurance ? 'Covered' : 'Not provided',
    score: insuranceScore,
    maxScore: 10,
    status: profile.hasInsurance ? 'excellent' : 'missing',
    feedback: profile.hasInsurance ? 'Insurance meets requirements' : 'Missing - Required for Schengen',
    feedbackAr: profile.hasInsurance ? 'التأمين يلبي المتطلبات' : 'مفقود - مطلوب لشنغن',
    feedbackFr: profile.hasInsurance ? "L'assurance répond aux exigences" : 'Manquant - Requis pour Schengen',
    suggestion: profile.hasInsurance ? 'Ensure coverage is €30,000+ for medical' : 'Purchase Schengen-compliant insurance immediately',
    suggestionAr: profile.hasInsurance ? 'تأكد من أن التغطية 30,000+ يورو طبي' : 'اشترِ تأمين متوافق مع شنغن فوراً',
    suggestionFr: profile.hasInsurance ? 'Assurez couverture €30,000+ médical' : "Achetez assurance conforme immédiatement",
  })

  // 7. Bookings
  maxScore += 10
  const bookingScore = profile.hasBookings ? 8 : profile.hasInvitationLetter ? 10 : 0
  totalScore += bookingScore
  if (!profile.hasBookings && !profile.hasInvitationLetter) missingDocuments.push('Flight/Accommodation Bookings')

  fields.push({
    name: 'Travel Arrangements',
    nameAr: 'ترتيبات السفر',
    nameFr: 'Arrangements de Voyage',
    value: profile.hasBookings ? 'Booked' : profile.hasInvitationLetter ? 'Invitation Letter' : 'Not provided',
    score: bookingScore,
    maxScore: 10,
    status: profile.hasBookings ? 'good' : profile.hasInvitationLetter ? 'excellent' : 'missing',
    feedback: profile.hasBookings ? 'Clear travel plans' : 'No concrete plans shown',
    feedbackAr: profile.hasBookings ? 'خطط سفر واضحة' : 'لم يتم إظهار خطط ملموسة',
    feedbackFr: profile.hasBookings ? 'Plans de voyage clairs' : 'Pas de plans concrets',
    suggestion: profile.hasBookings ? 'Ensure bookings are refundable' : 'Get refundable bookings or invitation letter',
    suggestionAr: profile.hasBookings ? 'تأكد من أن الحجوزات قابلة للاسترداد' : 'احصل على حجوزات قابلة للاسترداد أو خطاب دعوة',
    suggestionFr: profile.hasBookings ? 'Assurez-reservations refundables' : 'Obtenez réservations ou lettre invitation',
  })

  // 8. Ties to Home Country
  maxScore += 10
  let tiesScore = 0
  if (profile.maritalStatus === 'married') tiesScore += 4
  tiesScore += Math.min(3, (profile.children || 0) * 1)
  if (profile.hasProperty) tiesScore += 2
  if (profile.hasVehicle) tiesScore += 1
  if (profile.yearsEmployed && profile.yearsEmployed >= 2) tiesScore += 2
  totalScore += tiesScore

  fields.push({
    name: 'Ties to Algeria',
    nameAr: 'الروابط مع الجزائر',
    nameFr: "Liens avec l'Algérie",
    value: `${tiesScore}/10 points`,
    score: tiesScore,
    maxScore: 10,
    status: tiesScore >= 7 ? 'excellent' : tiesScore >= 5 ? 'good' : tiesScore >= 3 ? 'average' : 'poor',
    feedback: tiesScore >= 7 ? 'Strong ties demonstrated' : 'Ties could be stronger',
    feedbackAr: tiesScore >= 7 ? 'تم إظهار روابط قوية' : 'الروابط يمكن أن تكون أقوى',
    feedbackFr: tiesScore >= 7 ? 'Liens forts démontrés' : "Les liens pourraient être plus forts",
    suggestion: 'Include family documents, property deeds, employment contract',
    suggestionAr: 'أدرج وثائق الأسرة وعقود الملكية وعقد العمل',
    suggestionFr: 'Incluez documents familiaux, titres propriété, contrat travail',
  })

  // Calculate overall score and grade
  const overallScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  let grade: ProAssessmentResult['grade']
  let gradeDesc: string
  let gradeColor: string

  if (overallScore >= 90) { grade = 'A+'; gradeDesc = 'Excellent - High approval probability'; gradeColor = '#22c55e' }
  else if (overallScore >= 80) { grade = 'A'; gradeDesc = 'Very Good - Strong application'; gradeColor = '#22c55e' }
  else if (overallScore >= 70) { grade = 'B+'; gradeDesc = 'Good - Likely approval'; gradeColor = '#84cc16' }
  else if (overallScore >= 60) { grade = 'B'; gradeDesc = 'Average - Possible approval'; gradeColor = '#eab308' }
  else if (overallScore >= 50) { grade = 'C'; gradeDesc = 'Below Average - Borderline'; gradeColor = '#f97316' }
  else if (overallScore >= 35) { grade = 'D'; gradeDesc = 'Weak - High refusal risk'; gradeColor = '#ef4444' }
  else { grade = 'F'; gradeDesc = 'Very Weak - Not recommended'; gradeColor = '#dc2626' }

  // Generate AI Advice
  if (overallScore < 70) {
    aiAdvice.push({
      id: id++,
      category: 'critical',
      title: 'Financial Insufficiency',
      titleAr: 'عدم كفاية مالية',
      titleFr: "Insuffisance Financière",
      description: `Your bank balance is ${(balanceRatio * 100).toFixed(0)}% of required amount. Schengen requires 120% of daily rate × stay duration as safety buffer.`,
      descriptionAr: `رصيدك البنكي هو ${(balanceRatio * 100).toFixed(0)}% من المبلغ المطلوب. تتطلب شنغن 120% من المعدل اليومي × مدة الإقامة كهامش أمان.`,
      descriptionFr: `Votre solde est ${(balanceRatio * 100).toFixed(0)}% du montant requis. Schengen exige 120% du taux journalier × durée comme tampon.`,
      action: 'Increase bank balance and maintain for 3+ months',
      actionAr: 'زيادة الرصيد البنكي والحفاظ عليه لمدة 3+ أشهر',
      actionFr: "Augmenter le solde et maintenir 3+ mois",
      timeline: '3-6 months',
      timelineAr: '3-6 أشهر',
      timelineFr: '3-6 mois',
      estimatedImprovement: 25,
      documents: ['Bank statements', 'Salary slips'],
      documentsAr: ['كشوف حساب بنكي', 'كشوف مرتبات'],
      documentsFr: ['Relevés bancaires', 'Bulletins de paie'],
    })
  }

  if (profile.employmentType === 'unemployed' || profile.employmentType === 'student') {
    aiAdvice.push({
      id: id++,
      category: 'high',
      title: 'Employment Sponsorship',
      titleAr: 'رعاية التوظيف',
      titleFr: "Parrainage d'Emploi",
      description: `${profile.employmentType === 'unemployed' ? 'Unemployed' : 'Student'} applicants face higher scrutiny. A sponsor or strong financial proof is essential.`,
      descriptionAr: `المتقدمون ${profile.employmentType === 'unemployed' ? 'غير الموظفين' : 'الطلاب'} يواجهون تدقيقاً أعلى. الرعاية أو إثبات مالي قوي ضروري.`,
      descriptionFr: `${profile.employmentType === 'unemployed' ? 'Sans emploi' : 'Étudiants'} font face à un examen plus approfondi. Un parrain ou preuve financière forte est essentiel.`,
      action: 'Consider adding a financial sponsor (family member)',
      actionAr: 'فكر في إضافة راعٍ مالي (فرد من العائلة)',
      actionFr: "Envisagez d'ajouter un sponsor (membre de la famille)",
      timeline: 'Before application',
      timelineAr: 'قبل التقديم',
      timelineFr: 'Avant la candidature',
      estimatedImprovement: 20,
      documents: ['Sponsor declaration', 'Sponsor ID', 'Sponsor bank statements'],
      documentsAr: ['إعلان الراعي', 'هوية الراعي', 'كشوف حساب الراعي البنكية'],
      documentsFr: ['Déclaration sponsor', 'ID sponsor', 'Relevés sponsor'],
    })
  }

  if (profile.schengenCount === 0) {
    aiAdvice.push({
      id: id++,
      category: 'high',
      title: 'Build Travel History',
      titleAr: 'بناء سجل السفر',
      titleFr: 'Construire Historique de Voyage',
      description: 'First-time Schengen applicants face more scrutiny. Building travel history with easier destinations helps significantly.',
      descriptionAr: 'المتقدمون لأول مرة لشنغن يواجهون تدقيقاً أكثر. بناء سجل السفر مع وجهات أسهل يساعد كثيراً.',
      descriptionFr: 'Les primo-demandeurs Schengen font face à plus de scrutiny. Construire historique avec destinations plus faciles aide.',
      action: 'Apply for Turkey, Georgia, or Morocco visa first',
      actionAr: 'قدم على تأشيرة تركيا أو جورجيا أو المغرب أولاً',
      actionFr: 'Postulez pour Turquie, Géorgie ou Maroc en premier',
      timeline: '3-6 months before Schengen',
      timelineAr: '3-6 أشهر قبل شنغن',
      timelineFr: '3-6 mois avant Schengen',
      estimatedImprovement: 20,
      documents: ['Previous passport with stamps'],
      documentsAr: ['جواز السفر السابق مع التأشيرات'],
      documentsFr: ['Passeport précédent avec tampons'],
    })
  }

  if (!profile.hasInsurance) {
    aiAdvice.push({
      id: id++,
      category: 'critical',
      title: 'Travel Insurance Required',
      titleAr: 'تأمين السفر مطلوب',
      titleFr: "Assurance Voyage Requise",
      description: 'Schengen visa requires insurance with minimum €30,000 coverage for medical emergencies and repatriation.',
      descriptionAr: 'تأشيرة شنغن تتطلب تأميناً بحد أدنى 30,000 يورو لتغطية الطوارئ الطبية والترحيل.',
      descriptionFr: "Le visa Schengen nécessite assurance minimum €30,000 pour urgences médicales et rapatriement.",
      action: 'Purchase Schengen-compliant travel insurance',
      actionAr: 'شراء تأمين سفر متوافق مع شنغن',
      actionFr: "Acheter assurance conforme Schengen",
      timeline: 'Before application',
      timelineAr: 'قبل التقديم',
      timelineFr: 'Avant la candidature',
      estimatedImprovement: 10,
      documents: ['Insurance certificate'],
      documentsAr: ['شهادة التأمين'],
      documentsFr: ["Certificat d'assurance"],
    })
  }

  if (profile.visaRefusals > 0) {
    aiAdvice.push({
      id: id++,
      category: 'critical',
      title: 'Previous Refusal',
      titleAr: 'رفض سابق',
      titleFr: 'Refus Précédent',
      description: `You have ${profile.visaRefusals} previous refusal(s). Address the reason for refusal and show significant improvements.`,
      descriptionAr: `لديك ${profile.visaRefusals} رفض(ة) سابق(ة). عالج سبب الرفض وأظهر تحسينات كبيرة.`,
      descriptionFr: `Vous avez ${profile.visaRefusals} refus précédent(s). Abordez la raison et montrez des améliorations.`,
      action: 'Wait 6+ months, address refusal reasons',
      actionAr: 'انتظر 6+ أشهر، عالج أسباب الرفض',
      actionFr: 'Attendez 6+ mois, abordez les raisons du refus',
      timeline: `${profile.visaRefusals >= 2 ? '6-12' : '3-6'} months`,
      timelineAr: `${profile.visaRefusals >= 2 ? '6-12' : '3-6'} أشهر`,
      timelineFr: `${profile.visaRefusals >= 2 ? '6-12' : '3-6'} mois`,
      estimatedImprovement: 30,
    })
  }

  // Country-specific tips
  const countryTips: Record<string, { tips: string[], tipsAr: string[] }> = {
    'France': {
      tips: ['French language skills are valued', 'Apply at your nearest consulate', 'Family reunion has higher scrutiny'],
      tipsAr: ['مهارات اللغة الفرنسية قيمة', 'قدم في أقرب قنصلية', 'لم شمل الأسرة لديه تدقيق أعلى'],
    },
    'Germany': {
      tips: ['Very strict on financial docs', 'Detailed itinerary required', 'Business visas more favorable'],
      tipsAr: ['صارم جداً في الوثائق المالية', 'برنامج مفصل مطلوب', 'تأشيرات العمل أكثر ملاءمة'],
    },
    'Spain': {
      tips: ['More lenient for coastal tourism', 'Faster processing', 'Repeat travelers preferred'],
      tipsAr: ['أكثر تساهلاً للسياحة الساحلية', 'معالجة أسرع', 'المسافرون المتكررون مفضلون'],
    },
    'Italy': {
      tips: ['Family ties highly valued', 'Southern Italy less scrutiny', 'Include Italian family documents'],
      tipsAr: ['الروابط العائلية قيمة جداً', 'جنوب إيطاليا تدقيق أقل', 'أدرج وثائق العائلة الإيطالية'],
    },
  }

  // Interview questions
  const interviewQuestions: ProInterviewQuestion[] = [
    {
      question: 'Why do you want to visit [Country]?',
      questionAr: 'لماذا تريد زيارة [البلد]؟',
      goodAnswer: 'State specific purpose (tourism, business meeting, family visit) with details about places/activities planned',
      goodAnswerAr: 'اذكر الغرض المحدد (سياحة، اجتماع عمل، زيارة عائلة) مع تفاصيل الأماكن/الأنشطة المخطط لها',
      goodAnswerFr: 'État précis du but (tourisme, réunion, famille) avec détails des lieux/activités',
      tips: ['Be specific', 'Match your application', 'Show genuine interest'],
      tipsAr: ['كن محدداً', 'طابق طلبك', 'أظهر اهتماماً حقيقياً'],
    },
    {
      question: 'How will you finance this trip?',
      questionAr: 'كيف ستدفع تكاليف هذه الرحلة؟',
      goodAnswer: 'Explain your income source and savings. If sponsored, clarify the sponsor\'s relationship and ability',
      goodAnswerAr: 'اشرح مصدر دخلك ومدخراتك. إذا كان برعاية، وضّح علاقة الراعي وقدرته',
      goodAnswerFr: 'Expliquez votre revenu et économies. Si sponsorisé, clarifiez la relation',
      tips: ['Match bank statements', 'Be consistent', 'Have documentation ready'],
      tipsAr: ['طابق كشوف الحساب', 'كن متسقاً', 'احصل على الوثائق جاهزة'],
    },
    {
      question: 'What ties you to Algeria?',
      questionAr: 'ما الذي يربطك بالجزائر؟',
      goodAnswer: 'List family, employment, property, ongoing commitments. Show strong reasons to return',
      goodAnswerAr: 'اذكر العائلة، العمل، الملكية، الالتزامات الجارية. أظهر أسباب قوية للعودة',
      goodAnswerFr: 'Listez famille, emploi, propriété, engagements. Montrez raisons de retour',
      tips: ['Be honest', 'Show multiple ties', 'Have proof ready'],
      tipsAr: ['كن صادقاً', 'أظهر روابط متعددة', 'احصل على الإثبات جاهزاً'],
    },
  ]

  // Timeline
  const timeline: ProTimelineItem[] = []
  if (overallScore < 70) {
    timeline.push({ week: 1, title: 'Financial Planning', titleAr: 'التخطيط المالي', titleFr: 'Planification', description: 'Open savings account, start regular deposits', descriptionAr: 'فتح حساب ادخار، البدء في الإيداعات المنتظمة', descriptionFr: 'Ouvrir compte épargne, commencer dépôts', completed: false, critical: true })
    timeline.push({ week: 4, title: 'Document Collection', titleAr: 'جمع الوثائق', titleFr: 'Collection', description: 'Gather employment letter, bank statements', descriptionAr: 'جمع خطاب العمل، كشوف الحساب', descriptionFr: 'Rassembler lettre, relevés', completed: false, critical: false })
    timeline.push({ week: 8, title: 'Travel Insurance', titleAr: 'تأمين السفر', titleFr: 'Assurance', description: 'Purchase Schengen-compliant insurance', descriptionAr: 'شراء تأمين متوافق مع شنغن', descriptionFr: "Acheter assurance conforme", completed: false, critical: true })
    timeline.push({ week: 12, title: 'Bookings & Application', titleAr: 'الحجوزات والتقديم', titleFr: 'Réservations', description: 'Book flights/hotel, submit application', descriptionAr: 'حجز الطيران/الفندق، تقديم الطلب', descriptionFr: 'Réserver vol/hôtel, soumettre demande', completed: false, critical: true })
  } else {
    timeline.push({ week: 1, title: 'Final Document Check', titleAr: 'التحقق النهائي', titleFr: 'Vérification', description: 'Ensure all documents are ready and consistent', descriptionAr: 'تأكد من جاهزية جميع الوثائق واتساقها', descriptionFr: 'Assurez tous docs prêts et cohérents', completed: false, critical: false })
    timeline.push({ week: 2, title: 'Book Appointments', titleAr: 'حجز المواعيد', titleFr: 'Rendez-vous', description: 'Schedule biometric appointment', descriptionAr: 'جدولة موعد أخذ البصمات', descriptionFr: 'Planifier rendez-vous biométrie', completed: false, critical: true })
  }

  // Personalized plan
  const personalizedPlan: ProPersonalizedPlan = {
    title: 'Your 90-Day Action Plan',
    titleAr: 'خطة العمل لمدة 90 يوماً',
    duration: `${overallScore >= 70 ? '2' : '12'} weeks`,
    durationAr: `${overallScore >= 70 ? '2' : '12'} أسبوع`,
    steps: overallScore >= 70 ? [
      { week: 1, title: 'Week 1: Final Review', titleAr: 'الأسبوع 1: المراجعة النهائية', actions: ['Review all documents', 'Book appointment', 'Purchase insurance'], actionsAr: ['مراجعة جميع الوثائق', 'حجز موعد', 'شراء تأمين'], target: 'Application ready', targetAr: 'الطلب جاهز' },
      { week: 2, title: 'Week 2: Submit', titleAr: 'الأسبوع 2: التقديم', actions: ['Submit application', 'Pay fees', 'Schedule biometrics'], actionsAr: ['تقديم الطلب', 'دفع الرسوم', 'جدولة البصمات'], target: 'Application submitted', targetAr: 'تم تقديم الطلب' },
    ] : [
      { week: 1, title: 'Week 1-4: Build Financial Proof', titleAr: 'الأسبوع 1-4: بناء الإثبات المالي', actions: ['Open dedicated account', 'Deposit target amount', 'Get employer letter'], actionsAr: ['فتح حساب مخصص', 'إيداع المبلغ المستهدف', 'الحصول على خطاب العمل'], target: '€5,000+ balance', targetAr: 'رصيد 5,000+ يورو' },
      { week: 2, title: 'Week 5-8: Gather Documents', titleAr: 'الأسبوع 5-8: جمع الوثائق', actions: ['Collect bank statements', 'Get employment docs', 'Purchase insurance'], actionsAr: ['جمع كشوف الحساب', 'الحصول على وثائق العمل', 'شراء التأمين'], target: 'Complete document folder', targetAr: 'مجلد وثائق كامل' },
      { week: 3, title: 'Week 9-12: Apply', titleAr: 'الأسبوع 9-12: التقديم', actions: ['Book appointments', 'Submit application', 'Track status'], actionsAr: ['حجز المواعيد', 'تقديم الطلب', 'تتبع الحالة'], target: 'Application submitted', targetAr: 'تم تقديم الطلب' },
    ],
  }

  return {
    overallScore,
    grade,
    gradeDescription: gradeDesc,
    gradeColor,
    confidenceLevel: profile.bankBalance && profile.monthlyIncome && profile.employmentType ? 'high' : 'medium',
    fields,
    aiAdvice,
    missingDocuments,
    timeline,
    riskFlags,
    successProbability: overallScore,
    interviewQuestions,
    countrySpecificTips: countryTips[profile.targetCountry]?.tips || ['Strong application', 'Submit complete documentation'],
    countrySpecificTipsAr: countryTips[profile.targetCountry]?.tipsAr || ['طلب قوي', 'قدم وثائق كاملة'],
    personalizedPlan,
  }
}

export default { generateProAssessment }
