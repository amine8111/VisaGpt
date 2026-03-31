'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { 
  MessageSquare, Send, User, Bot, Volume2, RotateCcw, 
  CheckCircle, XCircle, Star, Lightbulb, Target, Award,
  Mic, MicOff, ChevronRight, Sparkles, Brain, TrendingUp
} from 'lucide-react'
import { useVisaStore } from '@/store/visaStore'
import { getQuestionsForVisaType, type InterviewQuestion, type AnswerEvaluation } from '@/lib/ai'
import { cn } from '@/lib/utils'
import { useLanguage } from './LanguageProvider'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  question?: InterviewQuestion | null
  evaluation?: AnswerEvaluation
}

const simulateEvaluation = (questionId: string, answer: string): AnswerEvaluation => {
  const answerLength = answer.length
  const hasKeywords = ['because', 'since', 'will', 'plan', 'purpose', 'travel', 'return', 'because', 'reason', 'why'].some(
    k => answer.toLowerCase().includes(k)
  )
  
  let score = 50
  if (answerLength > 50) score += 20
  if (answerLength > 100) score += 15
  if (hasKeywords) score += 15
  
  score = Math.min(100, Math.max(0, score))
  
  let overallAssessment: AnswerEvaluation['overallAssessment']
  if (score >= 80) overallAssessment = 'excellent'
  else if (score >= 60) overallAssessment = 'good'
  else if (score >= 40) overallAssessment = 'average'
  else overallAssessment = 'poor'
  
  return {
    score,
    overallAssessment,
    feedback: score >= 60 ? 'Good answer! You addressed the question well.' : 'Try to be more specific and provide concrete details.',
    pointsCovered: ['Clear explanation', 'Relevant details'],
    pointsMissing: score < 60 ? ['Be more specific about your plans', 'Mention return plans'] : [],
    redFlags: score < 40 ? ['Answer too short', 'Lacks detail'] : [],
    suggestions: score >= 80 ? [] : ['Add more details about your purpose', 'Include your return plans'],
    confidence: 85
  }
}

export function InterviewChatbot() {
  const { t, language } = useLanguage()
  const { userProfile } = useVisaStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastEvaluation, setLastEvaluation] = useState<AnswerEvaluation | null>(null)
  const [sessionScore, setSessionScore] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startNewInterview = () => {
    const profile = userProfile || { targetCountry: 'France' }
    const visaType = profile.targetCountry.includes('US') || profile.targetCountry.includes('USA') ? 'USA' :
                    profile.targetCountry.includes('UK') ? 'UK' : 'Schengen'
    const newQuestions = getQuestionsForVisaType(visaType, 5)
    setQuestions(newQuestions)
    setCurrentQuestion(0)
    setLastEvaluation(null)
    setShowFeedback(false)
    setSessionScore(0)
    
    const visaLabel = visaType === 'USA' ? t('usa') : visaType === 'UK' ? t('uk') : t('schengen')
    
    if (newQuestions.length > 0) {
      setMessages([
        {
          id: 0,
          role: 'assistant',
          content: `${language === 'ar' ? 'مرحباً! سأكون محاورك.' : language === 'fr' ? 'Bonjour! Je serai votre interviewer.' : 'Hello! I will be your interviewer.'}\n\n${t('letsStartInterview', { visaType: visaLabel })}`,
          question: newQuestions[0],
        },
      ])
    }
  }

  const profile = userProfile || { targetCountry: 'France' }
  const currentQ = questions[currentQuestion]

  const handleSend = () => {
    if (!input.trim() || !currentQ) return

    const evaluation = simulateEvaluation(currentQ.id, input)
    setLastEvaluation(evaluation)
    setShowFeedback(true)
    setSessionScore(prev => prev + evaluation.score)

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
      const prefix = language === 'ar' ? '' : ''
      
      if (evaluation.overallAssessment === 'excellent') {
        feedback = `${language === 'ar' ? '✨ ممتاز! ' : language === 'fr' ? '✨ Excellent! ' : '✨ Excellent! '}${evaluation.feedback}`
      } else if (evaluation.overallAssessment === 'good') {
        feedback = `${language === 'ar' ? '👍 جيد! ' : language === 'fr' ? '👍 Bien! ' : '👍 Good! '}${evaluation.feedback}`
      } else if (evaluation.overallAssessment === 'average') {
        feedback = `${language === 'ar' ? '💡 متوسط. ' : language === 'fr' ? '💡 Moyen. ' : '💡 Average. '}${evaluation.feedback}`
      } else {
        feedback = `${language === 'ar' ? '📝 يحتاج تحسين. ' : language === 'fr' ? '📝 À améliorer. ' : '📝 Needs improvement. '}${evaluation.feedback}`
      }

      if (evaluation.suggestions.length > 0) {
        feedback += '\n\n' + evaluation.suggestions.map(s => `• ${s}`).join('\n')
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
    }, 1200)
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
        content: t('nextQuestionLabel'),
        question: nextQ,
      }])
    } else {
      const finalScore = Math.round(sessionScore / questions.length)
      setMessages((prev) => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: `${t('interviewCompleted')}\n\n${language === 'ar' ? 'درجتك النهائية:' : language === 'fr' ? 'Votre score final:' : 'Your final score:'} ${finalScore}%`,
        question: null,
      }])
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'hard': return { bg: 'bg-red-500/20', text: 'text-red-400', label: t('hardInterview') }
      case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: t('mediumInterview') }
      case 'easy': return { bg: 'bg-green-500/20', text: 'text-green-400', label: t('easyInterview') }
      default: return { bg: 'bg-white/10', text: 'text-white/70', label: difficulty }
    }
  }

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10 flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-magenta/20 to-purple-500/20 flex items-center justify-center">
            <Brain className="text-neon-magenta animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              <span className="gradient-text">{t('interviewSimulator')}</span>
            </h2>
            <p className="text-sm text-white/60">{t('interviewSimulatorDesc')}</p>
          </div>
        </div>
        
        {/* Session Progress */}
        {questions.length > 0 && (
          <div className="flex items-center gap-4 mt-4 glass-card p-3">
            <div className="flex items-center gap-2">
              <Target className="text-neon-cyan" size={16} />
              <span className="text-sm">{language === 'ar' ? 'السؤال' : language === 'fr' ? 'Question' : 'Question'} {currentQuestion + 1}/{questions.length}</span>
            </div>
            <div className="flex-1 progress-bar">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" size={16} />
              <span className="text-sm font-bold text-yellow-400">
                {Math.round(sessionScore / (currentQuestion || 1))}%
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Feedback Panel */}
      <AnimatePresence>
        {lastEvaluation && showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className={cn(
              'mb-4 rounded-2xl border overflow-hidden',
              lastEvaluation.overallAssessment === 'excellent' && 'bg-emerald-500/10 border-emerald-500/30',
              lastEvaluation.overallAssessment === 'good' && 'bg-blue-500/10 border-blue-500/30',
              lastEvaluation.overallAssessment === 'average' && 'bg-yellow-500/10 border-yellow-500/30',
              lastEvaluation.overallAssessment === 'poor' && 'bg-red-500/10 border-red-500/30'
            )}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {lastEvaluation.overallAssessment === 'excellent' && <Award className="text-emerald-400" size={20} />}
                  {lastEvaluation.overallAssessment === 'good' && <TrendingUp className="text-blue-400" size={20} />}
                  {lastEvaluation.overallAssessment === 'average' && <Lightbulb className="text-yellow-400" size={20} />}
                  {lastEvaluation.overallAssessment === 'poor' && <MessageSquare className="text-red-400" size={20} />}
                  <span className="font-bold">{t('answerEvaluation')}</span>
                </div>
                <motion.span 
                  className={cn(
                    'text-2xl font-black',
                    lastEvaluation.score >= 80 && 'text-emerald-400',
                    lastEvaluation.score >= 60 && lastEvaluation.score < 80 && 'text-blue-400',
                    lastEvaluation.score >= 40 && lastEvaluation.score < 60 && 'text-yellow-400',
                    lastEvaluation.score < 40 && 'text-red-400'
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  {lastEvaluation.score}%
                </motion.span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lastEvaluation.score}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={cn(
                    'h-full rounded-full',
                    lastEvaluation.score >= 80 && 'bg-gradient-to-r from-emerald-400 to-green-400',
                    lastEvaluation.score >= 60 && lastEvaluation.score < 80 && 'bg-gradient-to-r from-blue-400 to-cyan-400',
                    lastEvaluation.score >= 40 && lastEvaluation.score < 60 && 'bg-gradient-to-r from-yellow-400 to-orange-400',
                    lastEvaluation.score < 40 && 'bg-gradient-to-r from-red-400 to-pink-400'
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {lastEvaluation.pointsMissing.length > 0 && (
                  <div className="bg-yellow-500/10 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="text-yellow-400" size={14} />
                      <span className="text-sm font-medium text-yellow-400">{t('missingPoints')}</span>
                    </div>
                    <ul className="text-xs text-white/70 space-y-1">
                      {lastEvaluation.pointsMissing.map((point, i) => (
                        <li key={i}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {lastEvaluation.redFlags.length > 0 && (
                  <div className="bg-red-500/10 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="text-red-400" size={14} />
                      <span className="text-sm font-medium text-red-400">{t('warningsInterview')}</span>
                    </div>
                    <ul className="text-xs text-white/70 space-y-1">
                      {lastEvaluation.redFlags.map((flag, i) => (
                        <li key={i}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 relative">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={cn(
                  'max-w-[85%] p-4 rounded-2xl',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-neon-cyan/20 to-blue-500/20 rounded-tr-sm border border-neon-cyan/30'
                    : 'glass-card rounded-tl-sm'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.role === 'assistant' ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple/40 to-pink-500/40 flex items-center justify-center">
                        <Bot className="text-white" size={16} />
                      </div>
                      <span className="text-xs text-white/50">{t('interviewer')}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-magenta/40 to-orange-500/40 flex items-center justify-center">
                        <User className="text-white" size={16} />
                      </div>
                      <span className="text-xs text-white/50">{t('you')}</span>
                    </>
                  )}
                </div>
                
                {/* Question */}
                {message.question && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      'p-4 rounded-xl mb-3',
                      getDifficultyColor(message.question.difficulty).bg
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className={cn('size-4', getDifficultyColor(message.question.difficulty).text)} />
                      <span className={cn('text-xs font-medium', getDifficultyColor(message.question.difficulty).text)}>
                        {getDifficultyColor(message.question.difficulty).label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {language === 'ar' ? message.question.questionAr : message.question.question}
                    </p>
                  </motion.div>
                )}
                
                {/* Answer/Feedback */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <div className="glass-card p-4 rounded-2xl rounded-tl-sm">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-3 h-3 bg-neon-cyan rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-elevated p-4"
      >
        {questions.length === 0 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startNewInterview}
            className="btn-primary w-full py-4 flex items-center justify-center gap-3"
          >
            <Sparkles className="size-5" />
            {t('startInterview')}
          </motion.button>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('typeAnswer')}
                className="input-field flex-1"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!currentQ || isTyping || !input.trim()}
                className="btn-primary px-4 disabled:opacity-50"
              >
                <Send size={20} />
              </motion.button>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-white/50">
                {t('questionNumber', { 
                  current: (currentQuestion + 1).toString(), 
                  total: questions.length.toString() 
                })}
              </span>
              <div className="flex gap-3">
                {showFeedback && (
                  <button
                    onClick={nextQuestion}
                    className="text-sm text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1"
                  >
                    {t('nextQuestion')}
                    <ChevronRight size={16} />
                  </button>
                )}
                <button
                  onClick={startNewInterview}
                  className="text-sm text-neon-magenta hover:text-neon-magenta/80 flex items-center gap-1"
                >
                  <RotateCcw size={14} />
                  {t('retry')}
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
