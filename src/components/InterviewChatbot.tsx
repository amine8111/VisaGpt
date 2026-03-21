'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, User, Bot, ChevronRight, Volume2, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { getQuestionsForVisaType, type InterviewQuestion, type AnswerEvaluation } from '@/lib/ai'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  question?: InterviewQuestion | null
  evaluation?: AnswerEvaluation
}

export function InterviewChatbot() {
  const { userProfile, startInterview, answerQuestion } = useVisaStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content: 'مرحباً! أنا محاكي المقابلة الذكي. سأساعدك في التحضير لمقابلة التأشيرة.',
      question: null,
    },
  ])
  const [input, setInput] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastEvaluation, setLastEvaluation] = useState<AnswerEvaluation | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startNewInterview = () => {
    const visaType = profile.targetCountry.includes('US') || profile.targetCountry.includes('USA') ? 'USA' :
                    profile.targetCountry.includes('UK') ? 'UK' : 'Schengen'
    const newQuestions = getQuestionsForVisaType(visaType, 5)
    setQuestions(newQuestions)
    setCurrentQuestion(0)
    setLastEvaluation(null)
    setShowFeedback(false)
    
    if (newQuestions.length > 0) {
      setMessages([
        {
          id: 0,
          role: 'assistant',
          content: `لنبدأ مقابلة ${visaType === 'USA' ? 'الولايات المتحدة' : visaType === 'UK' ? 'المملكة المتحدة' : 'شنغن'}!`,
          question: newQuestions[0],
        },
      ])
    }
  }

  const profile = userProfile || { targetCountry: 'France' }
  const currentQ = questions[currentQuestion]

  const handleSend = () => {
    if (!input.trim() || !currentQ) return

    const evaluation = answerQuestion(currentQ.id, input)
    setLastEvaluation(evaluation)
    setShowFeedback(true)

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      question: currentQ,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let feedback = ''
      if (evaluation.overallAssessment === 'excellent') {
        feedback = 'ممتاز! إجابة واضحة ومقنعة. ' + evaluation.feedback
      } else if (evaluation.overallAssessment === 'good') {
        feedback = 'جيد! ' + evaluation.feedback
      } else if (evaluation.overallAssessment === 'average') {
        feedback = 'متوسط. ' + evaluation.feedback
      } else {
        feedback = 'يحتاج تحسين. ' + evaluation.feedback
      }

      if (evaluation.suggestions.length > 0) {
        feedback += '\n\n' + evaluation.suggestions.join('\n')
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: feedback,
        question: null,
        evaluation,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQ = questions[currentQuestion + 1]
      setCurrentQuestion((prev) => prev + 1)
      setShowFeedback(false)
      setLastEvaluation(null)

      setMessages((prev) => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: 'السؤال التالي:',
        question: nextQ,
      }])
    } else {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: 'لقد أكملت المقابلة! أحسنت العمل. هل تريد إعادة المحاولة؟',
        question: null,
      }])
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-2xl font-bold mb-2 gradient-text">محاكي المقابلة</h2>
        <p className="text-white/60 text-sm">تدرب على أسئلة التأشيرة مع تقييم ذكي</p>
      </motion.div>

      {lastEvaluation && showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'mb-4 p-4 rounded-xl border',
            lastEvaluation.overallAssessment === 'excellent' && 'bg-green-500/10 border-green-500/30',
            lastEvaluation.overallAssessment === 'good' && 'bg-blue-500/10 border-blue-500/30',
            lastEvaluation.overallAssessment === 'average' && 'bg-yellow-500/10 border-yellow-500/30',
            lastEvaluation.overallAssessment === 'poor' && 'bg-red-500/10 border-red-500/30'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">تقييم الإجابة</span>
            <span className={cn(
              'font-bold',
              lastEvaluation.overallAssessment === 'excellent' && 'text-green-400',
              lastEvaluation.overallAssessment === 'good' && 'text-blue-400',
              lastEvaluation.overallAssessment === 'average' && 'text-yellow-400',
              lastEvaluation.overallAssessment === 'poor' && 'text-red-400'
            )}>
              {lastEvaluation.score}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${lastEvaluation.score}%` }}
              className={cn(
                'h-full rounded-full',
                lastEvaluation.score >= 80 && 'bg-green-400',
                lastEvaluation.score >= 60 && lastEvaluation.score < 80 && 'bg-blue-400',
                lastEvaluation.score >= 40 && lastEvaluation.score < 60 && 'bg-yellow-400',
                lastEvaluation.score < 40 && 'bg-red-400'
              )}
            />
          </div>
          {lastEvaluation.pointsMissing.length > 0 && (
            <div className="text-xs text-white/60">
              <span className="text-yellow-400">نقص: </span>
              {lastEvaluation.pointsMissing.join(', ')}
            </div>
          )}
          {lastEvaluation.redFlags.length > 0 && (
            <div className="text-xs text-red-400 mt-1">
              <span className="text-red-400">⚠️ تنبيهات: </span>
              {lastEvaluation.redFlags.join(', ')}
            </div>
          )}
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-white/10 rounded-tr-none'
                    : 'glass-card rounded-tl-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.role === 'assistant' ? (
                    <Bot className="text-neon-cyan" size={16} />
                  ) : (
                    <User className="text-neon-magenta" size={16} />
                  )}
                  <span className="text-xs text-white/50">
                    {message.role === 'assistant' ? 'المحاور' : 'أنت'}
                  </span>
                </div>
                
                {message.question && (
                  <div className="p-3 bg-neon-cyan/10 rounded-xl mb-3 text-sm">
                    <Volume2 className="inline-block ml-2 text-neon-cyan" size={14} />
                    {message.question.questionAr}
                    <div className="text-xs text-white/50 mt-1">
                      {message.question.difficulty === 'hard' ? '🔴 صعب' : 
                       message.question.difficulty === 'medium' ? '🟡 متوسط' : '🟢 سهل'}
                    </div>
                  </div>
                )}
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <div className="glass-card p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-neon-cyan rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-4"
      >
        {questions.length === 0 ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={startNewInterview}
            className="neon-button w-full py-4"
          >
            <RotateCcw className="inline-block ml-2" size={18} />
            ابدأ المقابلة
          </motion.button>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب إجابتك هنا..."
                className="input-field flex-1"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!currentQ || isTyping}
                className="neon-button px-4 disabled:opacity-50"
              >
                <Send size={20} />
              </motion.button>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-white/50">
                السؤال {currentQuestion + 1} من {questions.length}
              </span>
              <div className="flex gap-2">
                {showFeedback && (
                  <button
                    onClick={nextQuestion}
                    className="text-xs text-neon-cyan hover:underline"
                  >
                    السؤال التالي ←
                  </button>
                )}
                <button
                  onClick={startNewInterview}
                  className="text-xs text-neon-magenta hover:underline"
                >
                  إعادة
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
