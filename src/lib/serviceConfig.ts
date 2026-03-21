export type ServiceTier = 'free' | 'gold' | 'premium';

export interface ServiceFeature {
  id: string;
  name: string;
  nameEn: string;
  nameFr: string;
  description: string;
  descriptionEn: string;
  descriptionFr: string;
  icon: string;
  available: boolean;
  requiresTier: ServiceTier;
  action?: () => void;
}

export interface Milestone {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  targetDate: Date;
  completed: boolean;
  notified: boolean;
  notificationType: ('sms' | 'email' | 'whatsapp')[];
}

export interface Document {
  id: string;
  name: string;
  nameAr: string;
  type: 'passport' | 'photo' | 'bank_statement' | 'employment_letter' | 'insurance' | 'hotel_booking' | 'flight_ticket' | 'invitation' | 'other';
  file?: File;
  url?: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface ProfileData {
  fullName: string;
  fullNameAr?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: 'Algeria';
  passportNumber: string;
  passportExpiry: string;
  address: string;
  city: string;
  profession: string;
  employer: string;
  employerAddress: string;
  monthlyIncome: number;
  bankBalance: number;
  employmentType: 'cdi' | 'cdd' | 'self-employed' | 'student' | 'unemployed';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  children: number;
  hasProperty: boolean;
  hasVehicle: boolean;
  targetCountry: string;
  visaType: 'tourist' | 'business' | 'student' | 'work' | 'family';
  plannedTravelDate: string;
  plannedReturnDate: string;
}

export interface LetterData {
  type: 'cover' | 'employer' | 'invitation';
  recipientName: string;
  recipientAddress: string;
  embassyName: string;
  purpose: string;
  duration: string;
  accommodationAddress: string;
  sponsorName?: string;
  sponsorRelationship?: string;
  sponsorIncome?: number;
}

export const SERVICE_TIERS = {
  free: {
    name: 'مجاني',
    nameEn: 'Free',
    color: '#22c55e',
    price: 0,
    features: [
      {
        id: 'checklist',
        name: 'قائمة الوثائق',
        nameEn: 'Document Checklist',
        nameFr: 'Liste des Documents',
        description: 'تحقق من قائمة الوثائق المطلوبة لرحلتك',
        descriptionEn: 'Check required documents for your trip',
        descriptionFr: 'Vérifiez les documents requis pour votre voyage',
        icon: '📋',
        tier: 'free' as ServiceTier,
      },
      {
        id: 'basic-assessment',
        name: 'تقييم أولي',
        nameEn: 'Basic Assessment',
        nameFr: 'Évaluation de Base',
        description: 'احصل على تقييم أولي لاحتمالية حصولك على التأشيرة',
        descriptionEn: 'Get initial assessment of your visa chances',
        descriptionFr: "Obtenez une évaluation initiale de vos chances de visa",
        icon: '📊',
        tier: 'free' as ServiceTier,
      },
      {
        id: 'profile',
        name: 'الملف الشخصي',
        nameEn: 'Profile',
        nameFr: 'Profil',
        description: 'احتفظ بمعلوماتك الشخصية بشكل آمن',
        descriptionEn: 'Keep your personal information secure',
        descriptionFr: 'Gardez vos informations personnelles en sécurité',
        icon: '👤',
        tier: 'free' as ServiceTier,
      },
      {
        id: 'visa-atlas',
        name: 'أطلس التأشيرات',
        nameEn: 'Visa Atlas',
        nameFr: 'Atlas des Visas',
        description: 'خريطة تفاعلية للدول بدون تأشيرة',
        descriptionEn: 'Interactive map of visa-free countries',
        descriptionFr: 'Carte interactive des pays sans visa',
        icon: '🗺️',
        tier: 'free' as ServiceTier,
      },
    ],
  },
  gold: {
    name: 'ذهبي',
    nameEn: 'Gold',
    color: '#eab308',
    price: 5000,
    pricePeriod: 'شهرياً',
    features: [
      {
        id: 'pro-assessment',
        name: 'تقييم احترافي',
        nameEn: 'Pro Assessment',
        nameFr: 'Évaluation Professionnelle',
        description: 'تقييم شامل مع نصائح ذكية وتحليل تفصيلي',
        descriptionEn: 'Full analysis with AI-powered advice and detailed scoring',
        descriptionFr: 'Analyse complète avec conseils IA et notation détaillée',
        icon: '🎯',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'rejection-analyzer',
        name: 'محلل الرفض',
        nameEn: 'Rejection Analyzer',
        nameFr: "Analyseur de Refus",
        description: 'حلل خطاب الرفض واكتشف أسباب الرفض وكيفية الإصلاح',
        descriptionEn: 'Analyze rejection letter to find causes and solutions',
        descriptionFr: 'Analysez la lettre de refus pour trouver les causes',
        icon: '🔍',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'advice',
        name: 'نصائح ذكية',
        nameEn: 'Smart Advice',
        nameFr: 'Conseils Intelligents',
        description: 'احصل على نصائح مخصصة مع تتبع للإنجازات',
        descriptionEn: 'Get personalized advice with milestone tracking',
        descriptionFr: "Obtenez des conseils personnalisés avec suivi",
        icon: '💡',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'savings-plan',
        name: 'خطة التوفير',
        nameEn: 'Legal Savings Plan',
        nameFr: "Plan d'Épargne",
        description: 'ابنِ رصيدك البنكي بطريقة قانونية',
        descriptionEn: 'Build bank balance legally over 3-6 months',
        descriptionFr: 'Construisez votre solde légalement',
        icon: '💰',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'schengen-form',
        name: 'استمارة شنغن',
        nameEn: 'Schengen Form',
        nameFr: 'Formulaire Schengen',
        description: 'تعبئة تلقائية لاستمارة شنغن',
        descriptionEn: 'Auto-fill Schengen application form',
        descriptionFr: "Remplissage automatique du formulaire Schengen",
        icon: '📝',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'document-organizer',
        name: 'تنظيم الوثائق',
        nameEn: 'Document Organizer',
        nameFr: 'Organisateur de Documents',
        description: 'ارفع وثائقك واحصل على ملف PDF واحد',
        descriptionEn: 'Upload documents, get single PDF file',
        descriptionFr: 'Téléchargez vos documents, obtenez un PDF',
        icon: '📁',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'financial-planner',
        name: 'المخطط المالي',
        nameEn: 'Financial Planner',
        nameFr: 'Planificateur Financier',
        description: 'احسب المبلغ المطلوب حسب متطلبات الاتحاد الأوروبي',
        descriptionEn: 'Calculate required amount based on EU requirements',
        descriptionFr: 'Calculez le montant requis selon les exigences UE',
        icon: '💰',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'letter-generator',
        name: 'مولد الخطابات',
        nameEn: 'Letter Generator',
        nameFr: 'Générateur de Lettres',
        description: 'أنشئ خطاب الغلاف والتوظيف والدعوة',
        descriptionEn: 'Generate Cover, Employer & Invitation letters',
        descriptionFr: 'Générez lettres de motivation, employeur et invitation',
        icon: '✉️',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'simulator',
        name: 'المحاكي',
        nameEn: 'What-If Simulator',
        nameFr: 'Simulateur',
        description: 'جرب تغيير المتغيرات لرؤية تأثيرها',
        descriptionEn: 'Change variables to see their impact',
        descriptionFr: 'Essayez de changer les variables pour voir leur impact',
        icon: '🔄',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'document-inspector',
        name: 'مفتش الوثائق',
        nameEn: 'AI Document Inspector',
        nameFr: "Inspecteur IA",
        description: 'فحص سريع للوثائق قبل التقديم',
        descriptionEn: 'Scan PDFs for errors before submission',
        descriptionFr: 'Vérifiez les erreurs avant de soumettre',
        icon: '🔎',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'insurance-claim',
        name: 'مساعد المطالبات',
        nameEn: 'Insurance Claim Assistant',
        nameFr: "Assistant Sinistre",
        description: 'ساعدك في تقديم مطالبات التأمين',
        descriptionEn: 'Help with insurance claims after travel',
        descriptionFr: "Aide pour les réclamations d'assurance",
        icon: '📋',
        tier: 'gold' as ServiceTier,
      },
      {
        id: 'chat-coach',
        name: 'مدرب الدردشة',
        nameEn: 'Bilingual Chat Coach',
        nameFr: 'Coach de Chat Bilingue',
        description: 'إجابة على أسئلتك بالعربية والفرنسية',
        descriptionEn: 'Chat support in Arabic and French',
        descriptionFr: "Support de chat en arabe et français",
        icon: '💬',
        tier: 'gold' as ServiceTier,
      },
    ],
  },
  premium: {
    name: 'بريميوم',
    nameEn: 'Premium',
    color: '#a855f7',
    price: 15000,
    pricePeriod: 'شهرياً',
    badge: 'Office Access',
    features: [
      {
        id: 'translation-normal',
        name: 'ترجمة عادية',
        nameEn: 'Normal Translation',
        nameFr: 'Traduction Normale',
        description: 'ترجمة فورية للوثائق',
        descriptionEn: 'Instant document translation',
        descriptionFr: 'Traduction instantanée de documents',
        icon: '🌍',
        tier: 'premium' as ServiceTier,
      },
      {
        id: 'translation-official',
        name: 'ترجمة رسمية',
        nameEn: 'Official Translation',
        nameFr: 'Traduction Officielle',
        description: 'ترجمة معتمدة خلال 48 ساعة',
        descriptionEn: 'Certified translation within 48 hours',
        descriptionFr: 'Traduction certifiée sous 48 heures',
        icon: '📜',
        tier: 'premium' as ServiceTier,
      },
      {
        id: 'insurance',
        name: 'تأمين سفر',
        nameEn: 'Travel Insurance',
        nameFr: "Assurance Voyage",
        description: 'شراء تأمين سفر عبر التطبيق',
        descriptionEn: 'Purchase travel insurance through app',
        descriptionFr: "Acheter une assurance voyage via l'application",
        icon: '🛡️',
        tier: 'premium' as ServiceTier,
      },
      {
        id: 'photo',
        name: 'صورة جواز',
        nameEn: 'Passport Photo',
        nameFr: "Photo d'Identité",
        description: 'التقط صورة جواز احترافية',
        descriptionEn: 'Take professional passport photo',
        descriptionFr: "Prenez une photo d'identité professionnelle",
        icon: '📷',
        tier: 'premium' as ServiceTier,
      },
      {
        id: 'agent-booking',
        name: 'حجز موعد وكيل',
        nameEn: 'Agent Booking',
        nameFr: "Réservation d'Agent",
        description: 'احجز موعد اجتماع مع أحد الوكلاء',
        descriptionEn: 'Book meeting appointment with an agent',
        descriptionFr: 'Réservez un rendez-vous avec un agent',
        icon: '🤝',
        tier: 'premium' as ServiceTier,
      },
      {
        id: 'recours',
        name: 'مولد الطعون',
        nameEn: 'Recours Generator',
        nameFr: 'Générateur de Recours',
        description: 'أنشئ وثائق الطعن عند الرفض',
        descriptionEn: 'Generate appeal documents on refusal',
        descriptionFr: 'Générez des documents de recours',
        icon: '⚖️',
        tier: 'premium' as ServiceTier,
      },
    ],
  },
};

export const PAY_AS_YOU_GO = {
  name: 'Pay As You Go',
  nameAr: 'ادفع حسب الحاجة',
  nameFr: 'Paiement à la Demande',
  tagline: 'No subscription needed',
  taglineAr: 'بدون اشتراك',
  taglineFr: "Sans abonnement",
  services: [
    {
      id: 'translation-normal',
      name: 'Normal Translation',
      nameAr: 'ترجمة عادية',
      nameFr: 'Traduction Normale',
      description: 'Instant AI-powered translation',
      descriptionAr: 'ترجمة فورية بالذكاء الاصطناعي',
      descriptionFr: 'Traduction instantanée par IA',
      price: 800,
      unit: '/page',
      unitAr: '/صفحة',
      unitFr: '/page',
      icon: '🌍',
    },
    {
      id: 'translation-official',
      name: 'Official Translation',
      nameAr: 'ترجمة رسمية',
      nameFr: 'Traduction Officielle',
      description: 'Certified translation within 48 hours',
      descriptionAr: 'ترجمة معتمدة خلال 48 ساعة',
      descriptionFr: 'Traduction certifiée sous 48 heures',
      price: 2500,
      unit: '/page',
      unitAr: '/صفحة',
      unitFr: '/page',
      icon: '📜',
    },
    {
      id: 'agent-booking',
      name: 'Agent Booking',
      nameAr: 'حجز موعد وكيل',
      nameFr: "Réservation d'Agent",
      description: 'Book appointment with our office',
      descriptionAr: 'احجز موعد مع مكتبنا',
      descriptionFr: 'Réservez un rendez-vous avec notre bureau',
      price: 3000,
      unit: '/session',
      unitAr: '/جلسة',
      unitFr: '/session',
      icon: '🤝',
    },
    {
      id: 'photo',
      name: 'Passport Photo',
      nameAr: 'صورة جواز',
      nameFr: "Photo d'Identité",
      description: 'Professional passport photo (4 copies)',
      descriptionAr: 'صورة جواز احترافية (4 نسخ)',
      descriptionFr: "Photo d'identité professionnelle (4 copies)",
      price: 500,
      unit: '',
      unitAr: '',
      unitFr: '',
      icon: '📷',
    },
    {
      id: 'recours',
      name: 'Recours Generator',
      nameAr: 'مولد الطعون',
      nameFr: 'Générateur de Recours',
      description: 'Generate appeal documents for rejection',
      descriptionAr: 'أنشئ وثائق الطعن عند الرفض',
      descriptionFr: 'Générez des documents de recours',
      price: 5000,
      unit: '(one-time)',
      unitAr: '(مرة واحدة)',
      unitFr: '(une fois)',
      icon: '⚖️',
    },
    {
      id: 'insurance',
      name: 'Travel Insurance',
      nameAr: 'تأمين سفر',
      nameFr: "Assurance Voyage",
      description: 'Market rate + 10% service fee',
      descriptionAr: 'سعر السوق + 10% رسوم خدمة',
      descriptionFr: 'Tarif marché + 10% frais de service',
      price: 0,
      priceNote: 'Market rate + 10%',
      priceNoteAr: 'سعر السوق + 10%',
      priceNoteFr: 'Tarif marché + 10%',
      unit: '',
      unitAr: '',
      unitFr: '',
      icon: '🛡️',
      isQuote: true,
    },
  ],
};

export const COUNTRY_REQUIREMENTS = {
  France: {
    minDailyEUR: 65,
    nameAr: 'فرنسا',
    flag: '🇫🇷',
    processingDays: 15,
    requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
  },
  Germany: {
    minDailyEUR: 65,
    nameAr: 'ألمانيا',
    flag: '🇩🇪',
    processingDays: 20,
    requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter'],
  },
  Spain: {
    minDailyEUR: 65,
    nameAr: 'إسبانيا',
    flag: '🇪🇸',
    processingDays: 10,
    requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
  },
  Italy: {
    minDailyEUR: 65,
    nameAr: 'إيطاليا',
    flag: '🇮🇹',
    processingDays: 15,
    requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
  },
  Portugal: {
    minDailyEUR: 65,
    nameAr: 'البرتغال',
    flag: '🇵🇹',
    processingDays: 10,
    requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
  },
  Belgium: {
    minDailyEUR: 65,
    nameAr: 'بلجيكا',
    flag: '🇧🇪',
    processingDays: 15,
    requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance'],
  },
  Netherlands: {
    minDailyEUR: 65,
    nameAr: 'هولندا',
    flag: '🇳🇱',
    processingDays: 20,
    requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'employment_letter'],
  },
  UK: {
    minDailyEUR: 100,
    nameAr: 'المملكة المتحدة',
    flag: '🇬🇧',
    processingDays: 21,
    requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'english_test'],
  },
  USA: {
    minDailyEUR: 150,
    nameAr: 'الولايات المتحدة',
    flag: '🇺🇸',
    processingDays: 30,
    requiredDocs: ['passport', 'photo', 'ds160', 'travel_itinerary', 'financial_proof', 'insurance', 'interview'],
  },
  Canada: {
    minDailyEUR: 100,
    nameAr: 'كندا',
    flag: '🇨🇦',
    processingDays: 28,
    requiredDocs: ['passport', 'photo', 'travel_itinerary', 'accommodation', 'financial_proof', 'insurance', 'biometrics'],
  },
};

export const VISA_TYPES = {
  tourist: {
    name: 'سياحة',
    nameEn: 'Tourist',
    description: 'زيارة سياحية قصيرة',
    descriptionEn: 'Short tourist visit',
  },
  business: {
    name: 'عمل',
    nameEn: 'Business',
    description: 'رحلة عمل أو اجتماعات',
    descriptionEn: 'Business trip or meetings',
  },
  student: {
    name: 'دراسة',
    nameEn: 'Student',
    description: 'تأشيرة طالب',
    descriptionEn: 'Student visa',
  },
  work: {
    name: 'عمل',
    nameEn: 'Work',
    description: 'تأشيرة عمل',
    descriptionEn: 'Work visa',
  },
  family: {
    name: 'عائلة',
    nameEn: 'Family',
    description: 'زيارة عائلية',
    descriptionEn: 'Family visit',
  },
};

export const REQUIRED_DOCUMENTS = {
  passport: {
    name: 'جواز السفر',
    nameEn: 'Passport',
    description: 'جواز سفر ساري المفعول (6 أشهر على الأقل)',
    descriptionEn: 'Valid passport (at least 6 months)',
    required: true,
  },
  photo: {
    name: 'صورة شخصية',
    nameEn: 'Photo',
    description: 'صورتين شخصيتين بخلفية بيضاء',
    descriptionEn: 'Two passport photos with white background',
    required: true,
  },
  travel_itinerary: {
    name: 'برنامج السفر',
    nameEn: 'Travel Itinerary',
    description: 'تفاصيل الرحلة ذهاب وإياب',
    descriptionEn: 'Round-trip travel details',
    required: true,
  },
  accommodation: {
    name: 'الحجز الفندقي',
    nameEn: 'Hotel Booking',
    description: 'تأكيد حجز فندق أو خطاب دعوة',
    descriptionEn: 'Hotel confirmation or invitation letter',
    required: true,
  },
  financial_proof: {
    name: 'إثبات مالي',
    nameEn: 'Financial Proof',
    description: 'كشف حساب بنكي آخر 3 أشهر',
    descriptionEn: 'Bank statement last 3 months',
    required: true,
  },
  insurance: {
    name: 'تأمين صحي',
    nameEn: 'Health Insurance',
    description: 'تأمين سفر يشمل شنغن (30,000€ على الأقل)',
    descriptionEn: 'Travel insurance covering Schengen (min €30,000)',
    required: true,
  },
  employment_letter: {
    name: 'شهادة العمل',
    nameEn: 'Employment Letter',
    description: 'شهادة من صاحب العمل أو سجل تجاري',
    descriptionEn: 'Letter from employer or business registry',
    required: false,
  },
  invitation: {
    name: 'خطاب الدعوة',
    nameEn: 'Invitation Letter',
    description: 'خطاب دعوة من المستضيف',
    descriptionEn: 'Invitation letter from host',
    required: false,
  },
};
