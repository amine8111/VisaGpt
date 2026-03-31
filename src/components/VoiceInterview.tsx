'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, MicOff, Volume2, VolumeX, Play, Pause,
  SkipForward, RotateCcw, CheckCircle, AlertCircle,
  Brain, MessageSquare, Star, TrendingUp
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  question: string
  questionAr: string
  questionFr: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  tips: string[]
  tipsAr: string[]
  tipsFr: string[]
  sampleAnswer: string
  sampleAnswerAr: string
  sampleAnswerFr: string
}

const interviewQuestions: Question[] = [
  {
    id: 'q1',
    question: 'Why do you want to visit [Country]?',
    questionAr: 'لماذا تريد زيارة [الدولة]؟',
    questionFr: 'Pourquoi voulez-vous visiter [Pays]?',
    difficulty: 'easy',
    category: 'Purpose',
    tips: [
      'Be specific about your plans',
      'Mention attractions or business purposes',
      'Show genuine interest in the culture',
    ],
    tipsAr: [
      'كن محدداً بشأن خططك',
      'اذكر الأماكن الجذابة أو أغراض العمل',
      'أظهر اهتماماً حقيقياً بالثقافة',
    ],
    tipsFr: [
      'Soyez précis sur vos plans',
      'Mentionnez les attractions ou motifs professionnels',
      'Montrez un véritable intérêt pour la culture',
    ],
    sampleAnswer: 'I want to visit France to explore its rich cultural heritage, visit famous museums like the Louvre, and experience the diverse cuisine. I have been planning this trip for over a year and have researched extensively.',
    sampleAnswerAr: 'أريد زيارة فرنسا لاستكشاف تراثها الثقافي الغني، وزيارة المتاحف الشهيرة مثل اللوفر، وتجربة المأكولات المتنوعة. كنت أخطط لهذه الرحلة منذ أكثر من عام.',
    sampleAnswerFr: 'Je veux visiter la France pour explorer son riche patrimoine culturel, visiter des musées famosos comme le Louvre, et découvrir la cuisine diversifiée.',
  },
  {
    id: 'q2',
    question: 'How long do you plan to stay?',
    questionAr: 'كم من الوقت تخطط للبقاء؟',
    questionFr: 'Combien de temps prévoyez-vous de rester?',
    difficulty: 'easy',
    category: 'Duration',
    tips: [
      'Give a specific timeframe',
      'Match with your booking dates',
      'Explain why this duration is necessary',
    ],
    tipsAr: [
      'أعط timeframe محدد',
      'تطابق مع تواريخ حجزك',
      'اشرح لماذا هذه المدة ضرورية',
    ],
    tipsFr: [
      'Donnez un délai précis',
      'Correspondez aux dates de réservation',
      'Expliquez pourquoi cette durée est nécessaire',
    ],
    sampleAnswer: 'I plan to stay for 15 days, from June 1st to June 15th. This timeframe allows me to visit Paris, Lyon, and the French Riviera while maintaining a comfortable pace.',
    sampleAnswerAr: 'أخطط للبقاء لمدة 15 يوماً، من 1 يونيو إلى 15 يونيو. تتيح لي هذه المدة زيارة باريس وليون والريفيرا الفرنسية.',
    sampleAnswerFr: 'Je prévois de rester 15 jours, du 1er au 15 juin. Cela me permet de visiter Paris, Lyon et la Côte d\'Azur.',
  },
  {
    id: 'q3',
    question: 'Do you have relatives or friends in [Country]?',
    questionAr: 'هل لديك أقارب أو أصدقاء في [الدولة]؟',
    questionFr: 'Avez-vous des parents ou amis dans [Pays]?',
    difficulty: 'medium',
    category: 'Ties',
    tips: [
      'If yes, explain their status',
      'Emphasize your strong ties to Algeria',
      'Mention planned visits, not plans to stay',
    ],
    tipsAr: [
      'إذا نعم، اشرح وضعهم',
      'شدد على روابطك القوية بالجزائر',
      'اذكر الزيارات المخططة وليس خطط البقاء',
    ],
    tipsFr: [
      'Si oui, expliquez leur statut',
      'Mettez en avant vos liens forts avec l\'Algérie',
      'Mentionnez les visites prévues, pas l\'intention de rester',
    ],
    sampleAnswer: 'I have a cousin who lives in Paris, but I will be staying at a hotel and visiting them for dinner twice during my trip. My primary purpose is tourism, and I have strong ties to Algeria including my job, family, and property.',
    sampleAnswerAr: 'لدي ابن عم يقيم في باريس، لكنني سأقيم في فندق وزيارته للعشاء مرتين فقط. غرضي الأساسي هو السياحة، ولدي روابط قوية بالجزائر.',
    sampleAnswerFr: 'J\'ai un cousin qui vit à Paris, mais je logerai à l\'hôtel et leur rendrai visite deux fois. Mon objectif principal est le tourisme.',
  },
  {
    id: 'q4',
    question: 'What is your current occupation?',
    questionAr: 'ما هو عملك الحالي؟',
    questionFr: 'Quelle est votre occupation actuelle?',
    difficulty: 'easy',
    category: 'Employment',
    tips: [
      'Be specific about your role',
      'Mention company stability',
      'Show you have professional commitments in Algeria',
    ],
    tipsAr: [
      'كن محدداً حول دورك',
      'اذكر استقرار شركتك',
      'أظهر أنك ملتزم مهنياً في الجزائر',
    ],
    tipsFr: [
      'Soyez précis sur votre rôle',
      'Mentionnez la stabilité de votre entreprise',
      'Montrez votre engagement professionnel en Algérie',
    ],
    sampleAnswer: 'I work as a Software Engineer at Sonatrach, one of the largest oil companies in Algeria. I have been with them for 5 years on a permanent contract, which demonstrates my professional stability.',
    sampleAnswerAr: 'أعمل كمهندس برمجيات في سوناطراك، واحدة من أكبر شركات النفط في الجزائر. أنا معهم منذ 5 سنوات بعقد دائم.',
    sampleAnswerFr: 'Je travaille comme ingénieur logiciel chez Sonatrach, l\'une des plus grandes sociétés pétrolières d\'Algérie. J\'y suis depuis 5 ans.',
  },
  {
    id: 'q5',
    question: 'Can you afford this trip? How much will it cost?',
    questionAr: 'هل يمكنك تحمل تكلفة هذه الرحلة؟ كم ستكلف؟',
    questionFr: 'Pouvez-vous vous permettre ce voyage? Combien va-t-il coûter?',
    difficulty: 'medium',
    category: 'Finance',
    tips: [
      'Know your estimated budget',
      'Show bank balance meets requirements',
      'Explain your savings are genuine',
    ],
    tipsAr: [
      'اعرف ميزانيتك المقدرة',
      'أظهر أن رصيدك يلبي المتطلبات',
      'اشرح أن مدخراتك حقيقية',
    ],
    tipsFr: [
      'Connaissez votre budget estimé',
      'Montrez que votre solde répond aux exigences',
      'Expliquez que vos économies sont réelles',
    ],
    sampleAnswer: 'Yes, I can afford this trip. My estimated budget is 250,000 DZD (approximately 1,800 EUR). This includes flights, accommodation, daily expenses, and travel insurance. I have been saving specifically for this trip over the past 8 months.',
    sampleAnswerAr: 'نعم، يمكنني تحمل تكلفة هذه الرحلة. ميزانيتي المقدرة 250,000 دج. تشمل الطيران والإقامة والمصروفات اليومية وتأمين السفر.',
    sampleAnswerFr: 'Oui, je peux me permettre ce voyage. Mon budget estimé est de 250 000 DZD, incluant vols, hébergement, dépenses quotidiennes et assurance.',
  },
  {
    id: 'q6',
    question: 'What will you do after you return?',
    questionAr: 'ماذا ستفعل بعد العودة؟',
    questionFr: 'Que ferez-vous après votre retour?',
    difficulty: 'hard',
    category: 'Ties',
    tips: [
      'Emphasize career and family commitments',
      'Mention property or investments in Algeria',
      'Show no intention to overstay',
    ],
    tipsAr: [
      'شدد على الالتزامات المهنية والعائلية',
      'اذكر الممتلكات أو الاستثمارات في الجزائر',
      'أظهر عدم نية البقاء',
    ],
    tipsFr: [
      'Mettez en avant les engagements professionnels et familiaux',
      'Mentionnez les biens ou investissements en Algérie',
      'Montrez qu\'il n\'est pas dans vos intentions de rester',
    ],
    sampleAnswer: 'After returning, I will resume my position at Sonatrach where I have an important project starting in July. I also have my apartment and family here. I have absolutely no intention of staying abroad as everything I value is in Algeria.',
    sampleAnswerAr: 'بعد العودة، سأستأنف عملي في سوناطراك حيث لدي مشروع مهم في يوليو. لدي أيضاً شقتي وعائلتي هنا.',
    sampleAnswerFr: 'Après mon retour, je reprendrai mon poste chez Sonatrach où j\'ai un projet important en juillet. J\'ai mon appartement et ma famille ici.',
  },
]

export function VoiceInterview() {
  const { t, language } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionScore, setSessionScore] = useState(0)
  const [responses, setResponses] = useState<{ q: number; rated: boolean; score: number }[]>([])
  const [speechSupported, setSpeechSupported] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [transcript, setTranscript] = useState('')
  
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechSupported(true)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US'
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
        setTranscript(transcript)
      }
      
      recognition.onend = () => {
        setIsListening(false)
        if (transcript.length > 10) {
          rateResponse()
        }
      }
      
      setRecognition(recognition)
    }
  }, [language])

  const getQuestion = (q: Question) => {
    if (language === 'ar') return q.questionAr
    if (language === 'fr') return q.questionFr
    return q.question
  }

  const getTips = (q: Question) => {
    if (language === 'ar') return q.tipsAr
    if (language === 'fr') return q.tipsFr
    return q.tips
  }

  const getSampleAnswer = (q: Question) => {
    if (language === 'ar') return q.sampleAnswerAr
    if (language === 'fr') return q.sampleAnswerFr
    return q.sampleAnswer
  }

  const speakQuestion = (question: Question) => {
    if (!speechSupported) return
    
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(getQuestion(question))
    utterance.lang = language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US'
    utterance.rate = 0.9
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (recognition) {
      setTranscript('')
      recognition.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const rateResponse = () => {
    const baseScore = Math.min(100, 50 + Math.random() * 30)
    const lengthBonus = Math.min(30, transcript.length * 0.5)
    const score = Math.round(baseScore + lengthBonus)
    
    setResponses(prev => [...prev, { q: currentQuestion, rated: true, score }])
    setSessionScore(prev => {
      const allScores = [...responses, { q: currentQuestion, rated: true, score }].map(r => r.score)
      return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setShowAnswer(false)
      setTranscript('')
      speakQuestion(interviewQuestions[currentQuestion + 1])
    }
  }

  const restartSession = () => {
    setCurrentQuestion(0)
    setResponses([])
    setSessionScore(0)
    setTranscript('')
    setShowAnswer(false)
    speakQuestion(interviewQuestions[0])
  }

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case 'easy': return 'text-emerald-400 bg-emerald-400/20'
      case 'medium': return 'text-amber-400 bg-amber-400/20'
      case 'hard': return 'text-red-400 bg-red-400/20'
      default: return ''
    }
  }

  const q = interviewQuestions[currentQuestion]

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 mb-4">
            <Mic className="text-neon-magenta animate-pulse" size={20} />
            <span className="text-neon-magenta text-sm font-medium">
              {language === 'ar' ? 'تدريب صوتي' : language === 'fr' ? 'Entraînement Vocal' : 'Voice Practice'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {language === 'ar' ? 'مقابلة صوتية' : language === 'fr' ? "Entretien Vocal" : 'Voice Interview'}
            </span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' 
              ? 'تدرب على الأسئلة مع التعرف على الصوت' 
              : language === 'fr' 
              ? 'Pratiquez les questions avec reconnaissance vocale' 
              : 'Practice questions with voice recognition'}
          </p>
        </motion.div>

        {/* Session Score */}
        {responses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-ai p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-white/50">{language === 'ar' ? 'درجة الجلسة' : language === 'fr' ? 'Score de session' : 'Session Score'}</p>
                  <p className="text-3xl font-black text-neon-cyan">{sessionScore}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/50">{language === 'ar' ? 'السؤال' : language === 'fr' ? 'Question' : 'Question'} {currentQuestion + 1}/{interviewQuestions.length}</p>
                <div className="flex gap-1 mt-1">
                  {responses.map((r, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full',
                        r.score >= 80 ? 'bg-emerald-400' : r.score >= 60 ? 'bg-amber-400' : 'bg-red-400'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card-elevated p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className={cn('text-xs px-2 py-1 rounded-full', getDifficultyColor(q.difficulty))}>
              {language === 'ar' 
                ? (q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب')
                : language === 'fr'
                ? (q.difficulty === 'easy' ? 'Facile' : q.difficulty === 'medium' ? 'Moyen' : 'Difficile')
                : q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)
              }
            </span>
            <span className="text-xs text-white/50">{q.category}</span>
          </div>

          <h2 className="text-xl font-bold mb-6 text-center">
            {getQuestion(q)}
          </h2>

          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={speechSupported ? (isListening ? stopListening : startListening) : () => {}}
              className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center transition-all',
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-neon-cyan hover:bg-neon-cyan/80'
              )}
            >
              {isListening ? (
                <MicOff size={32} className="text-white" />
              ) : (
                <Mic size={32} className="text-white" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => speakQuestion(q)}
              disabled={isSpeaking}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <Volume2 size={24} className={cn(isSpeaking && 'animate-pulse')} />
            </motion.button>
          </div>

          {isListening && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-neon-cyan mt-4"
            >
              {language === 'ar' ? '...جارٍ الاستماع' : language === 'fr' ? '...En écoute' : '...Listening'}
            </motion.p>
          )}

          {/* Transcript */}
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-white/5 rounded-lg"
            >
              <p className="text-xs text-white/50 mb-1">
                {language === 'ar' ? 'إجابتك:' : language === 'fr' ? 'Votre réponse:' : 'Your answer:'}
              </p>
              <p className="text-sm">{transcript}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 mb-6"
        >
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Brain size={16} className="text-neon-purple" />
            {language === 'ar' ? 'نصائح' : language === 'fr' ? 'Conseils' : 'Tips'}
          </h3>
          <ul className="space-y-2">
            {getTips(q).map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Sample Answer */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full glass-card p-4 text-left mb-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {showAnswer 
                ? (language === 'ar' ? 'إخفاء النموذج' : language === 'fr' ? 'Masquer le modèle' : 'Hide Sample')
                : (language === 'ar' ? 'عرض نموذج الإجابة' : language === 'fr' ? 'Afficher la réponse' : 'Show Sample Answer')
              }
            </span>
            <MessageSquare size={18} className="text-white/50" />
          </div>
        </motion.button>

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="glass-card p-4 mb-6 bg-neon-cyan/5"
          >
            <p className="text-sm text-white/80 leading-relaxed">
              {getSampleAnswer(q)}
            </p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={restartSession}
            className="btn-secondary flex items-center justify-center gap-2 flex-1"
          >
            <RotateCcw size={18} />
            {language === 'ar' ? 'إعادة' : language === 'fr' ? 'Recommencer' : 'Restart'}
          </button>
          <button
            onClick={nextQuestion}
            disabled={currentQuestion >= interviewQuestions.length - 1}
            className="btn-primary flex items-center justify-center gap-2 flex-1 disabled:opacity-50"
          >
            {currentQuestion >= interviewQuestions.length - 1 
              ? (language === 'ar' ? 'اكتمل!' : language === 'fr' ? 'Terminé!' : 'Complete!')
              : (
                <>
                  {language === 'ar' ? 'السؤال التالي' : language === 'fr' ? 'Question suivante' : 'Next Question'}
                  <SkipForward size={18} />
                </>
              )
            }
          </button>
        </div>

        {/* Speech Not Supported Warning */}
        {!speechSupported && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-400 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-amber-400 text-sm">
                  {language === 'ar' ? 'المتصفح لا يدعم التعرف على الصوت' : language === 'fr' ? 'Navigateur ne supporte pas la reconnaissance vocale' : 'Voice recognition not supported in this browser'}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  {language === 'ar' 
                    ? 'استخدم Chrome أو Edge للحصول على تجربة صوتية كاملة'
                    : language === 'fr'
                    ? 'Utilisez Chrome ou Edge pour une expérience vocale complète'
                    : 'Use Chrome or Edge for full voice experience'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VoiceInterview
