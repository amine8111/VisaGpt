export interface InterviewQuestion {
  id: string;
  question: string;
  questionAr: string;
  category: 'motivations' | 'financial' | 'travel_plan' | 'family' | 'professional' | 'cultural';
  difficulty: 'easy' | 'medium' | 'hard';
  context: string;
  expectedPoints: string[];
  redFlags: string[];
  followUps: string[];
}

export interface AnswerEvaluation {
  score: number;
  feedback: string;
  suggestions: string[];
  pointsCovered: string[];
  pointsMissing: string[];
  redFlags: string[];
  confidence: number;
  overallAssessment: 'excellent' | 'good' | 'average' | 'poor';
}

export interface InterviewSession {
  visaType: string;
  country: string;
  questions: string[];
  answers: Record<string, string>;
  evaluations: Record<string, AnswerEvaluation>;
  totalScore: number;
  completedAt?: Date;
}

const VISA_QUESTIONS: Record<string, InterviewQuestion[]> = {
  Schengen: [
    {
      id: 's1',
      question: 'Why do you want to travel to France/Schengen area?',
      questionAr: 'لماذا تريد السفر إلى فرنسا/منطقة شنغن؟',
      category: 'motivations',
      difficulty: 'easy',
      context: 'First impression question - be specific about purpose',
      expectedPoints: ['specific reason', 'dates', 'connection to purpose'],
      redFlags: ['vague answer', 'mentions of work', 'overstaying intentions'],
      followUps: ['What will you do there specifically?', 'How long exactly?']
    },
    {
      id: 's2',
      question: 'How long do you plan to stay?',
      questionAr: 'كم من الوقت تخطط للإقامة؟',
      category: 'travel_plan',
      difficulty: 'easy',
      context: 'Match with your application - be consistent',
      expectedPoints: ['exact duration', 'return ticket evidence', 'ties to home'],
      redFlags: ['flexible/unknown duration', 'contradiction with application'],
      followUps: ['When exactly are you leaving?', 'When do you return?']
    },
    {
      id: 's3',
      question: 'Where will you stay during your visit?',
      questionAr: 'أين ستقيم خلال زيارتك؟',
      category: 'travel_plan',
      difficulty: 'easy',
      context: 'Have booking details ready',
      expectedPoints: ['specific address', 'booking confirmation', 'hotel name'],
      redFlags: ['unknown location', 'staying with unknown person'],
      followUps: ['Hotel name?', 'Who booked it?', 'How much did it cost?']
    },
    {
      id: 's4',
      question: 'Who will finance this trip?',
      questionAr: 'من سيمولّل هذه الرحلة؟',
      category: 'financial',
      difficulty: 'medium',
      context: 'Be honest about funding source',
      expectedPoints: ['specific source', 'proof availability', 'sufficient funds'],
      redFlags: ['unclear source', 'large amount from unknown'],
      followUps: ['How much savings do you have?', 'What is your monthly income?']
    },
    {
      id: 's5',
      question: 'Do you have family members in the Schengen area?',
      questionAr: 'هل لديك أفراد عائلة في منطقة شنغن؟',
      category: 'family',
      difficulty: 'medium',
      context: 'Common question - be truthful',
      expectedPoints: ['honest answer', 'no illegal intentions', 'clear relationship'],
      redFlags: ['undisclosed family', 'family with immigration issues'],
      followUps: ['What is their status?', 'When did they arrive?']
    },
    {
      id: 's6',
      question: 'What is your current employment?',
      questionAr: 'ما هو عملك الحالي؟',
      category: 'professional',
      difficulty: 'easy',
      context: 'Show stability and ties to home country',
      expectedPoints: ['job title', 'company name', 'leave permission', 'returning intention'],
      redFlags: ['resigned recently', 'no leave letter', 'low salary'],
      followUps: ['Can you provide employment letter?', 'How long have you worked there?']
    },
    {
      id: 's7',
      question: 'Have you traveled to Schengen area before?',
      questionAr: 'هل سافرت إلى منطقة شنغن من قبل؟',
      category: 'travel_plan',
      difficulty: 'easy',
      context: 'If yes, be ready to discuss',
      expectedPoints: ['honest about past travel', 'compliance evidence'],
      redFlags: ['undisclosed travel', 'overstay history'],
      followUps: ['When was that?', 'Did you return on time?']
    },
    {
      id: 's8',
      question: 'Why should we grant you a visa?',
      questionAr: 'لماذا يجب أنمنحك تأشيرة؟',
      category: 'motivations',
      difficulty: 'hard',
      context: 'Confidence question - show genuine intent',
      expectedPoints: ['strong ties', 'genuine purpose', 'financial capability', 'compliance history'],
      redFlags: ['weak arguments', 'desperation signs'],
      followUps: ['What guarantees your return?', 'What ties you to your country?']
    },
  ],
  USA: [
    {
      id: 'u1',
      question: 'What is the purpose of your trip to the United States?',
      questionAr: 'ما هو الغرض من رحلتك إلى الولايات المتحدة؟',
      category: 'motivations',
      difficulty: 'easy',
      context: 'Be specific and confident',
      expectedPoints: ['specific purpose', 'genuine intent', 'clear timeline'],
      redFlags: ['vague tourism', 'potential work', 'unclear return'],
      followUps: ['What will you do there specifically?', 'Who invited you?']
    },
    {
      id: 'u2',
      question: 'Who will pay for your trip?',
      questionAr: 'من سيمولّل رحلتك؟',
      category: 'financial',
      difficulty: 'medium',
      context: 'Show financial capability',
      expectedPoints: ['funding source', 'bank statements', 'sponsor letter if applicable'],
      redFlags: ['unclear funds', 'large unexplained amounts'],
      followUps: ['How much money do you have?', 'Can you show your bank balance?']
    },
    {
      id: 'u3',
      question: 'What will you do in the United States?',
      questionAr: 'ماذا ستفعل في الولايات المتحدة؟',
      category: 'travel_plan',
      difficulty: 'easy',
      context: 'Detailed itinerary helps',
      expectedPoints: ['specific activities', 'meeting people', 'locations'],
      redFlags: ['working remotely', 'unclear plans'],
      followUps: ['Do you have hotel bookings?', 'Do you have return ticket?']
    },
    {
      id: 'u4',
      question: 'Do you have family or friends in the US?',
      questionAr: 'هل لديك عائلة أو أصدقاء في الولايات المتحدة؟',
      category: 'family',
      difficulty: 'medium',
      context: 'Be honest - they will check',
      expectedPoints: ['honest disclosure', 'their status', 'your relationship'],
      redFlags: ['undisclosed relatives', 'illegal immigrants'],
      followUps: ['What is their immigration status?', 'When did they go?']
    },
    {
      id: 'u5',
      question: 'Have you ever been to the United States before?',
      questionAr: 'هل زرت الولايات المتحدة من قبل؟',
      category: 'travel_plan',
      difficulty: 'easy',
      context: 'Past compliance is important',
      expectedPoints: ['honest answer', 'proof of return', 'visa type used'],
      redFlags: ['overstayed', 'undisclosed visits'],
      followUps: ['When were you there?', 'How long did you stay?']
    },
    {
      id: 'u6',
      question: 'What ties you to your home country?',
      questionAr: 'ما الذييربطك ببلدك؟',
      category: 'cultural',
      difficulty: 'hard',
      context: 'CRUCIAL - prove strong ties',
      expectedPoints: ['employment', 'family', 'property', 'business', 'future plans'],
      redFlags: ['weak ties', 'no plans to return', 'seeking better life'],
      followUps: ['What will you do when you return?', 'Do you own property?']
    },
    {
      id: 'u7',
      question: 'How do you afford this trip?',
      questionAr: 'كيف يمكنك تحمل تكلفة هذه الرحلة؟',
      category: 'financial',
      difficulty: 'medium',
      context: 'Show realistic financial picture',
      expectedPoints: ['savings', 'income', 'spending plan', 'budget'],
      redFlags: ['credit cards as main source', 'borrowed money'],
      followUps: ['What is your monthly income?', 'Do you have savings?']
    },
    {
      id: 'u8',
      question: 'Why did you not apply for a tourist visa in your home country?',
      questionAr: 'لماذا لم تتقدم بطلب تأشيرة سياحية في بلدك؟',
      category: 'cultural',
      difficulty: 'hard',
      context: 'Sometimes asked if applying from different country',
      expectedPoints: ['legitimate reason', 'current residence proof', 'no circumventing'],
      redFlags: ['trying to avoid scrutiny', 'no legal status'],
      followUps: ['How long have you been here?', 'What is your status?']
    },
  ],
  UK: [
    {
      id: 'uk1',
      question: 'Why do you want to visit the United Kingdom?',
      questionAr: 'لماذا تريد زيارة المملكة المتحدة؟',
      category: 'motivations',
      difficulty: 'easy',
      context: 'Be specific about purpose',
      expectedPoints: ['specific reason', 'personal connection', 'benefits'],
      redFlags: ['work intentions', 'vague tourism'],
      followUps: ['What specifically attracts you?', 'Have you been before?']
    },
    {
      id: 'uk2',
      question: 'How long will you be staying in the UK?',
      questionAr: 'كم ستقيم في المملكة المتحدة؟',
      category: 'travel_plan',
      difficulty: 'easy',
      context: 'Match your application exactly',
      expectedPoints: ['exact dates', 'return plans', 'accommodation'],
      redFlags: ['exceeding allowed stay', 'uncertain dates'],
      followUps: ['When do you leave?', 'When do you return?']
    },
    {
      id: 'uk3',
      question: 'What is your employment situation?',
      questionAr: 'ما هو وضعك الوظيفي؟',
      category: 'professional',
      difficulty: 'medium',
      context: 'Shows ties to home',
      expectedPoints: ['job confirmation', 'leave permission', 'returning job'],
      redFlags: ['recent resignation', 'no ties', 'unemployed'],
      followUps: ['Can you show employment letter?', 'How long employed?']
    },
    {
      id: 'uk4',
      question: 'Can you afford this trip? How?',
      questionAr: 'هل يمكنك تحمل تكلفة هذه الرحلة؟ كيف؟',
      category: 'financial',
      difficulty: 'medium',
      context: 'Financial capability proof',
      expectedPoints: ['income source', 'savings', 'sponsor if any'],
      redFlags: ['insufficient funds', 'unclear source'],
      followUps: ['Monthly income?', 'Bank balance?']
    },
    {
      id: 'uk5',
      question: 'Where will you be staying?',
      questionAr: 'أين ستقيم؟',
      category: 'travel_plan',
      difficulty: 'easy',
      context: 'Have details ready',
      expectedPoints: ['address', 'booking proof', 'host details if applicable'],
      redFlags: ['unknown location', 'no accommodation'],
      followUps: ['Hotel name?', 'Address?']
    },
  ],
};

export function getQuestionsForVisaType(visaType: string, count: number = 5): InterviewQuestion[] {
  const questions = VISA_QUESTIONS[visaType] || VISA_QUESTIONS['Schengen'];
  
  const easyQuestions = questions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = questions.filter(q => q.difficulty === 'medium');
  const hardQuestions = questions.filter(q => q.difficulty === 'hard');
  
  const selected: InterviewQuestion[] = [];
  
  selected.push(...shuffleArray(easyQuestions).slice(0, 2));
  selected.push(...shuffleArray(mediumQuestions).slice(0, 2));
  selected.push(...shuffleArray(hardQuestions).slice(0, 1));
  
  return shuffleArray(selected).slice(0, count);
}

export function evaluateAnswer(question: InterviewQuestion, answer: string, lang: 'ar' | 'en' = 'en'): AnswerEvaluation {
  const normalizedAnswer = answer.toLowerCase().trim();
  const words = normalizedAnswer.split(/\s+/);
  
  let score = 0;
  const pointsCovered: string[] = [];
  const pointsMissing: string[] = [];
  const suggestions: string[] = [];
  const redFlags: string[] = [];
  
  for (const point of question.expectedPoints) {
    const keywords = generateKeywords(point);
    const found = keywords.some(kw => normalizedAnswer.includes(kw.toLowerCase()));
    
    if (found) {
      score += 25;
      pointsCovered.push(point);
    } else {
      pointsMissing.push(point);
      suggestions.push(`Include information about: ${point}`);
    }
  }
  
  for (const flag of question.redFlags) {
    const flagKeywords = generateKeywords(flag);
    const found = flagKeywords.some(kw => normalizedAnswer.includes(kw.toLowerCase()));
    
    if (found) {
      score = Math.max(0, score - 20);
      redFlags.push(flag);
    }
  }
  
  if (answer.length < 20) {
    score = Math.max(0, score - 15);
    suggestions.push('Provide more detailed answer');
  }
  
  if (words.length < 5) {
    suggestions.push('Expand your answer with more details');
  }
  
  const hasContradiction = checkForContradictions(question, normalizedAnswer);
  if (hasContradiction) {
    score = Math.max(0, score - 25);
    redFlags.push('Contradictory information');
  }
  
  const confidence = calculateConfidence(answer, question);
  
  score = Math.min(100, Math.max(0, score));
  
  const overallAssessment: AnswerEvaluation['overallAssessment'] = 
    score >= 80 ? 'excellent' :
    score >= 60 ? 'good' :
    score >= 40 ? 'average' : 'poor';
  
  const feedback = generateFeedback(question, answer, score, lang);
  
  return {
    score,
    feedback,
    suggestions,
    pointsCovered,
    pointsMissing,
    redFlags,
    confidence,
    overallAssessment,
  };
}

function generateKeywords(point: string): string[] {
  const keywordMap: Record<string, string[]> = {
    'specific reason': ['visit', 'travel', 'tourism', 'see', 'meet', 'attend', '参加', 'زيارة', 'سفر', 'سياحة'],
    'dates': ['day', 'month', 'week', 'from', 'to', 'until', 'تاريخ', 'يوم', 'اسبوع', 'من', 'إلى'],
    'return ticket': ['return', 'back', 'come back', 'going back', 'تذكرة عودة', 'عودة', 'رجوع'],
    'specific address': ['hotel', 'address', 'street', 'located', 'فنادق', 'عنوان', 'شارع', 'located'],
    'booking confirmation': ['booked', 'reservation', 'confirmed', 'حجز', 'تاكيد', 'confirmed'],
    'job title': ['engineer', 'manager', 'teacher', 'doctor', 'engineer', 'مهندس', 'مدير', 'معلم', 'طبيب'],
    'company name': ['company', 'company', 'establishment', 'شركة', 'مؤسسة', 'company'],
    'leave permission': ['vacation', 'leave', 'holiday', 'permission', 'اذن', 'اجازة', 'permission'],
    'savings': ['savings', 'saved', 'money', 'balance', 'توفير', 'ادخار', 'رصيد', 'money'],
    'family': ['family', 'wife', 'husband', 'children', 'famille', 'famille', 'زوج', 'اطفال', 'عائلة'],
    'property': ['house', 'apartment', 'property', 'own', 'منزل', 'شقة', 'ملكية', 'own'],
    'specific purpose': ['purpose', 'reason', '参加', '参加', 'reason', 'سبب', 'الغرض'],
  };
  
  const lowerPoint = point.toLowerCase();
  return keywordMap[lowerPoint] || [point.toLowerCase()];
}

function checkForContradictions(question: InterviewQuestion, answer: string): boolean {
  const contradictions = [
    { positive: ['work', 'working', 'job'], negative: ['tourism', 'tourist', 'visit'] },
    { positive: ['month', 'months'], negative: ['week', 'weeks'] },
  ];
  
  for (const contra of contradictions) {
    const hasPositive = contra.positive.some(p => answer.includes(p));
    const hasNegative = contra.negative.some(n => answer.includes(n));
    if (hasPositive && hasNegative) return true;
  }
  
  return false;
}

function calculateConfidence(answer: string, question: InterviewQuestion): number {
  let confidence = 50;
  
  if (answer.length > 100) confidence += 20;
  else if (answer.length > 50) confidence += 10;
  
  const words = answer.split(/\s+/);
  if (words.length > 20) confidence += 15;
  
  const hasQuestionMark = answer.includes('?');
  if (hasQuestionMark) confidence -= 20;
  
  if (question.difficulty === 'hard' && answer.length > 150) confidence += 10;
  
  return Math.min(95, Math.max(5, confidence));
}

function generateFeedback(question: InterviewQuestion, answer: string, score: number, lang: 'ar' | 'en'): string {
  if (lang === 'ar') {
    if (score >= 80) return 'إجابة ممتازة! غطيت جميع النقاط المطلوبة بشكل واضح ومقنع.';
    if (score >= 60) return 'إجابة جيدة. هناك بعض التفاصيل الناقصة لكنها مقبولة.';
    if (score >= 40) return 'إجابة متوسطة. تحتاج لتوضيح المزيد.';
    return 'إجابة ضعيفة. يجب إعادة النظر في الإجابة.';
  }
  
  if (score >= 80) return 'Excellent answer! You covered all the key points clearly and convincingly.';
  if (score >= 60) return 'Good answer. Some details are missing but it\'s acceptable.';
  if (score >= 40) return 'Average answer. You need to provide more clarity.';
  return 'Weak answer. Consider rephrasing your response.';
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateFollowUpQuestion(question: InterviewQuestion, previousAnswer: string): string {
  const contextScore = evaluateAnswer(question, previousAnswer);
  
  const missingPoint = contextScore.pointsMissing[0];
  
  if (missingPoint) {
    const followUpMap: Record<string, { ar: string; en: string }> = {
      'specific reason': { ar: 'ما هو السبب المحدد لرحلتك؟', en: 'What is the specific reason for your trip?' },
      'dates': { ar: 'ما هي التواريخ المحددة لرحلتك؟', en: 'What are the exact dates of your trip?' },
      'return ticket': { ar: 'هل لديك تذكرة عودة؟', en: 'Do you have a return ticket?' },
      'specific address': { ar: 'ما هو العنوان المحدد؟', en: 'What is the exact address?' },
      'booking confirmation': { ar: 'هل لديك تأكيد الحجز؟', en: 'Do you have booking confirmation?' },
      'job title': { ar: 'ما هو عنوان وظيفتك بالتحديد؟', en: 'What is your exact job title?' },
      'company name': { ar: 'ما اسم الشركة؟', en: 'What is the company name?' },
      'leave permission': { ar: 'هل حصلت على إذن من صاحب العمل؟', en: 'Do you have permission from your employer?' },
      'savings': { ar: 'كم توفر لديك؟', en: 'How much savings do you have?' },
      'family': { ar: 'هل لديك عائلة في الخارج؟', en: 'Do you have family abroad?' },
      'property': { ar: 'هل تملك عقاراً؟', en: 'Do you own property?' },
    };
    
    return followUpMap[missingPoint]?.en || question.followUps[0];
  }
  
  return question.followUps[0];
}

export default {
  getQuestionsForVisaType,
  evaluateAnswer,
  generateFollowUpQuestion,
  VISA_QUESTIONS,
};
