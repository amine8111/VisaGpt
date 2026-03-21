'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { 
  MessageCircle, Send, Bot, User, Languages, Loader2,
  Star, ThumbsUp, ThumbsDown, Volume2, Copy, RefreshCw,
  ChevronDown, ChevronUp, Check, AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  contentAr: string
  timestamp: Date
  rating?: 'up' | 'down'
}

interface QuickQuestion {
  question: string
  questionEn: string
  answer: string
  answerAr: string
}

const quickQuestions: QuickQuestion[] = [
  { 
    question: 'ما هي متطلبات التأشيرة الفرنسية؟',
    questionEn: 'What are French visa requirements?',
    answer: 'French visa requirements: valid passport (6+ months), photo, 3-month bank statement, travel insurance (30,000 EUR), hotel booking, round-trip flight, cover letter, employment certificate.',
    answerAr: 'متطلبات تأشيرة فرنسا: جواز سفر (6+ أشهر)، صورة، كشف حساب 3 أشهر، تأمين (30,000€)، حجز فندق، طيران ذهاب وإياب، خطاب غلاف، شهادة عمل.'
  },
  { 
    question: 'كيف أحسب الرصيد المطلوب؟',
    questionEn: 'How to calculate required balance?',
    answer: 'Rule: 65 EUR x number of days. Example: 15 days = 975 EUR. Add 20% safety margin. Your account should show regular deposits, not sudden large amounts.',
    answerAr: 'القاعدة: 65 يورو × عدد الأيام. مثال: 15 يوم = 975 يورو. أضف هامش 20%. أظهر إيداعات منتظمة، ليس مبالغ مفاجئة.'
  },
  { 
    question: 'هل يمكنني العمل بتأشيرة شنغن؟',
    questionEn: 'Can I work with Schengen visa?',
    answer: 'No, a tourist Schengen visa does not allow work. You need a separate work visa from that country.',
    answerAr: 'لا، تأشيرة شنغن السياحية لا تسمح بالعمل. تحتاج تأشيرة عمل منفصلة.'
  },
  { 
    question: 'كم تستغرق معالجة الطلب؟',
    questionEn: 'How long does processing take?',
    answer: 'France: 10-15 days, Germany: 15-20 days, Spain: 7-15 days, Italy: 15-20 days. May be longer during peak season (June-August) and holidays.',
    answerAr: 'فرنسا: 10-15 يوم، ألمانيا: 15-20 يوم، إسبانيا: 7-15 يوم، إيطاليا: 15-20 يوم. قد تطول في موسم الذروة والأعياد.'
  },
  { 
    question: 'ما الفرق بين CDI و CDD؟',
    questionEn: 'Difference between CDI and CDD?',
    answer: 'CDI = permanent contract (best). CDD = fixed-term contract. CDI gives more points in visa assessment.',
    answerAr: 'CDI = عقد دائم (أفضل). CDD = عقد محدد المدة. CDI يعطي نقاط أكثر في التقييم.'
  },
  { 
    question: 'هل أحتاج حجز فندق فعلي؟',
    questionEn: 'Do I need actual hotel booking?',
    answer: 'Yes, you need confirmed hotel booking. Non-refundable booking is stronger, but refundable booking is also accepted.',
    answerAr: 'نعم، تحتاج حجز فندق مؤكد. الحجز غير القابل للإلغاء أقوى، لكن القابل للإلغاء مقبول.'
  },
]

const culturalTips = [
  {
    title: 'نصائح للمقابلة',
    titleEn: 'Interview Tips',
    tips: [
      'كن صادقاً ومباشراً في إجاباتك',
      'أظهر روابط قوية مع الجزائر',
      'تحدث بوضوح وببطء',
      'ارتدي ملابس رسمية محتشمة',
      'لا تتوتر إذا سألوا أسئلة صعبة'
    ],
    tipsAr: [
      'كن صادقاً ومباشراً في إجاباتك',
      'أظهر روابط قوية مع الجزائر',
      'تحدث بوضوح وببطء',
      'ارتدي ملابس رسمية محتشمة',
      'لا تتوتر إذا سألوا أسئلة صعبة'
    ]
  },
  {
    title: 'أخطاء شائعة',
    titleEn: 'Common Mistakes',
    tips: [
      'لا تكذب أبداً عن سفرك السابق',
      'لا تبالغ في描述 خططك',
      'لا تقول أنك ستسافر بمفردك إذا كنت ستلتقي بشخص',
      'لا تنسَ ذكرالتزاماتك في الجزائر'
    ],
    tipsAr: [
      'لا تكذب أبداً عن سفرك السابق',
      'لا تبالغ في وصف خططك',
      'لا تقول أنك ستسافر بمفردك إذا كنت ستجتمع بشخص',
      'لا تنسَ ذكر التزاماتك في الجزائر'
    ]
  }
]

export function BilingualChatCoach() {
  const { t, dir, language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'مرحباً! أنا مدربك الذكي للتأشيرات. يمكنني مساعدتك بالعربية أو الفرنسية. كيف يمكنني مساعدتك اليوم؟',
      contentAr: 'مرحباً! أنا مدربك الذكي للتأشيرات. يمكنني مساعدتك بالعربية أو الفرنسية. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickQuestions, setShowQuickQuestions] = useState(true)
  const [showCulturalTips, setShowCulturalTips] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase()
    
    if (lower.includes('متطلبات') || lower.includes('requirements') || lower.includes('documents') || lower.includes('وثائق')) {
      return 'المتطلبات الأساسية لتأشيرة شنغن تشمل:\n\n• جواز سفر ساري المفعول (6 أشهر على الأقل)\n• صورة شخصية حديثة بخلفية بيضاء\n• كشف حساب بنكي آخر 3 أشهر\n• تأمين سفر (30,000€ minimum)\n• حجز فندق مؤكد\n• تذكرة طيران ذهاب وإياب\n• خطاب غلاف\n• شهادة عمل\n• شهادة الميلاد (للعائلات)'
    }
    
    if (lower.includes('رصيد') || lower.includes('balance') || lower.includes('مال') || lower.includes('financial')) {
      return 'لحساب الرصيد المطلوب:\n\n📊 القاعدة: 65 يورو × عدد الأيام\n\nمثال لزيارة 15 يوم:\n65 × 15 = 975 يورو\n\n💡 نصيحة: أضف هامش 20% للسلامة\nالمطلوب: ~1,200 يورو\n\n📌 يجب أن يظهر الرصيد بانتظام وليس ودائع كبيرة مفاجئة.'
    }
    
    if (lower.includes('وقت') || lower.includes('processing') || lower.includes('مدة') || lower.includes('days')) {
      return 'أوقات المعالجة التقريبية:\n\n🇫🇷 فرنسا: 10-15 يوم\n🇩🇪 ألمانيا: 15-20 يوم\n🇪🇸 إسبانيا: 7-15 يوم\n🇮🇹 إيطاليا: 15-20 يوم\n🇵🇹 البرتغال: 7-10 أيام\n\n⚠️ ملاحظة: الأوقات قد تزيد في موسم الذروة (يونيو-أغسطس) وأثناء الأعياد.'
    }
    
    if (lower.includes('رفض') || lower.includes('refusal') || lower.includes('refused')) {
      return 'أسباب الرفض الشائعة:\n\n❌ عدم كفاية الرصيد\n❌ سجل سفر ضعيف\n❌ روابط ضعيفة مع الجزائر\n❌ الغرض من الرحلة غير واضح\n❌ وثائق ناقصة\n\n💡 نصيحة: استخدم محلل الرفض في القائمة المجانية لمعرفة سبب الرفض المحدد لك.'
    }
    
    if (lower.includes('CDI') || lower.includes('CDD') || lower.includes('عمل') || lower.includes('employment')) {
      return 'أنواع العقود وتأثيرها:\n\n✅ CDI (Contrat à Durée Indéterminée)\n- عقد غير محدد المدة\n- الأفضل للتقييم\n- يعطي نقاط عالية\n\n⚠️ CDD (Contrat à Durée Déterminée)\n- عقد محدد المدة\n- أقل قوة في التقييم\n\n⚠️ Trabajo independiente (عمل حر)\n- صعب الإثبات\n- يحتاج سجل ضريبي قوي'
    }
    
    if (lower.includes('مقابلة') || lower.includes('interview')) {
      return 'نصائح للمقابلة:\n\n✅ 준비:\n- راجع خطاب الغلاف الخاص بك\n- اعرف تفاصيل رحلتك\n- أحضر جميع الوثائق الأصلية\n\n👔 المظهر:\n- ملابس رسمية محتشمة\n- نظافة شخصية\n\n💬 السلوك:\n- كن هادئاً وودوداً\n- أجب بصدق\n- لا تتوتر\n\n❌ لا تفعل:\n- لا تكذب\n- لا تبالغ\n- لا تتوتر'
    }
    
    return 'شكراً لسؤالك! لم أفهم تماماً. هل يمكنك توضيح سؤالك أكثر؟\n\nأو اختر من الأسئلة السريعة أدناه.'
  }

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      contentAr: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setShowQuickQuestions(false)
    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    const response = generateResponse(input)
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      contentAr: response,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleQuickQuestion = (q: typeof quickQuestions[0]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: q.questionEn,
      contentAr: q.question,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    setShowQuickQuestions(false)
    
    setTimeout(() => {
      const response = generateResponse(q.questionEn)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        contentAr: q.answerAr,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10 flex flex-col">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">مدرب الدردشة الذكي</h2>
          <p className="text-white/60 text-sm flex items-center gap-2">
            <Languages size={16} />
            {language === 'ar' ? 'دعم بالعربية والفرنسية' : 'Support in Arabic & French'}
          </p>
        </motion.div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex gap-3',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                message.role === 'assistant' ? 'bg-neon-purple/20' : 'bg-neon-cyan/20'
              )}>
                {message.role === 'assistant' ? (
                  <Bot className="text-neon-purple" size={20} />
                ) : (
                  <User className="text-neon-cyan" size={20} />
                )}
              </div>
              
              <div className={cn(
                'flex-1 max-w-[85%]',
                message.role === 'user' && 'text-left'
              )}>
                <div className={cn(
                  'p-4 rounded-2xl',
                  message.role === 'assistant' 
                    ? 'glass-card rounded-tl-sm' 
                    : 'bg-neon-cyan/20 rounded-tr-sm'
                )}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.role === 'assistant' ? message.content : message.contentAr}
                  </p>
                </div>
                
                <div className={cn(
                  'flex items-center gap-2 mt-1',
                  message.role === 'user' && 'justify-end'
                )}>
                  <span className="text-xs text-white/40">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:bg-white/10 rounded-full"
                        title="نسخ"
                      >
                        <Copy size={12} className="text-white/40" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center">
                <Bot className="text-neon-purple" size={20} />
              </div>
              <div className="glass-card p-4 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-neon-cyan rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-neon-cyan rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-neon-cyan rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {showQuickQuestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <button
              onClick={() => setShowQuickQuestions(!showQuickQuestions)}
              className="flex items-center gap-2 text-sm text-neon-cyan mb-2"
            >
              {showQuickQuestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {language === 'ar' ? 'أسئلة سريعة' : 'Quick Questions'}
            </button>
            
            {showQuickQuestions && (
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 4).map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-2 bg-white/5 rounded-full text-xs text-white/70 hover:bg-white/10 transition-colors"
                  >
                    {q.question}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <button
            onClick={() => setShowCulturalTips(!showCulturalTips)}
            className="flex items-center gap-2 text-sm text-yellow-400 mb-2"
          >
            {showCulturalTips ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            نصائح ثقافية
          </button>
          
          {showCulturalTips && (
            <div className="glass-card p-4 space-y-4">
              {culturalTips.map((tip, i) => (
                <div key={i}>
                  <h4 className="font-bold text-sm mb-2">{tip.title}</h4>
                  <ul className="space-y-1">
                    {tip.tipsAr.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-white/70">
                        <Check size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="glass-card p-3 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Ask your question...'}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              'p-3 rounded-full',
              input.trim() ? 'bg-neon-cyan text-black' : 'bg-white/10 text-white/40'
            )}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default BilingualChatCoach
