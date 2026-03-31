'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, Lock, CheckCircle, AlertCircle,
  Star, Crown, Sparkles, Zap, Shield,
  ChevronRight, ArrowLeft, Smartphone, Building2,
  Loader2, Check
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface Plan {
  id: string
  name: string
  nameAr: string
  nameFr: string
  price: number
  originalPrice?: number
  features: string[]
  featuresAr: string[]
  featuresFr: string[]
  icon: any
  color: string
  recommended?: boolean
  billing: 'monthly' | 'yearly'
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    nameAr: 'مجاني',
    nameFr: 'Gratuit',
    price: 0,
    features: [
      '1 Visa Assessment',
      'Basic Document Tips',
      'Community Access',
      'Limited AI Features',
    ],
    featuresAr: [
      'تقييم تأشيرة واحد',
      'نصائح وثائق أساسية',
      'وصول للمجتمع',
      'ميزات AI محدودة',
    ],
    featuresFr: [
      '1 Évaluation de visa',
      'Conseils documents de base',
      'Accès communauté',
      'Fonctionnalités IA limitées',
    ],
    icon: Zap,
    color: 'emerald',
    billing: 'monthly',
  },
  {
    id: 'gold',
    name: 'Gold',
    nameAr: 'ذهبي',
    nameFr: 'Or',
    price: 5000,
    originalPrice: 7500,
    features: [
      'Unlimited Assessments',
      'AI Document Scanner',
      'Interview Simulator',
      'Priority Support',
      'Bank Statement Analysis',
      '3 Months Access',
    ],
    featuresAr: [
      'تقييمات غير محدودة',
      'ماسح وثائق AI',
      'محاكي المقابلة',
      'دعم أولوي',
      'تحليل كشف الحساب',
      'وصول 3 أشهر',
    ],
    featuresFr: [
      'Évaluations illimitées',
      'Scanner de documents IA',
      'Simulateur d\'entretien',
      'Support prioritaire',
      'Analyse de relevé',
      'Accès 3 mois',
    ],
    icon: Star,
    color: 'amber',
    recommended: true,
    billing: 'monthly',
  },
  {
    id: 'premium',
    name: 'Premium',
    nameAr: 'بريميوم',
    nameFr: 'Premium',
    price: 15000,
    features: [
      'Everything in Gold',
      'Human Expert Review',
      'Personal Visa Advisor',
      'Appointment Booking',
      'Full Document Generator',
      'Priority Slot Monitoring',
      '12 Months Access',
    ],
    featuresAr: [
      'كل شيء في الذهبي',
      'مراجعة خبير بشري',
      'مستشار تأشيرة شخصي',
      'حجز المواعيد',
      'مولد الوثائق الكامل',
      'مراقبة الأولوية',
      'وصول 12 شهر',
    ],
    featuresFr: [
      'Tout dans Or',
      'Revue expert humain',
      'Conseiller visa personnel',
      'Réservation de RDV',
      'Générateur de documents',
      'Surveillance prioritaire',
      'Accès 12 mois',
    ],
    icon: Crown,
    color: 'purple',
    billing: 'monthly',
  },
]

export function PaymentIntegration() {
  const { t, language } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'edahabia' | 'cib' | 'cash'>('card')
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  })

  const getPlanName = (plan: Plan) => {
    if (language === 'ar') return plan.nameAr
    if (language === 'fr') return plan.nameFr
    return plan.name
  }

  const getFeatures = (plan: Plan) => {
    if (language === 'ar') return plan.featuresAr
    if (language === 'fr') return plan.featuresFr
    return plan.features
  }

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'VISA50') {
      setCouponApplied(true)
      setCouponDiscount(50)
    } else if (couponCode.toUpperCase() === 'NEWUSER') {
      setCouponApplied(true)
      setCouponDiscount(20)
    }
  }

  const calculateTotal = () => {
    if (!selectedPlan) return 0
    let total = selectedPlan.price
    if (couponApplied && selectedPlan.id !== 'free') {
      total = total * (1 - couponDiscount / 100)
    }
    return Math.round(total)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsProcessing(false)
    setShowSuccess(true)
    setShowCheckout(false)
  }

  const Icon = selectedPlan?.icon || Star

  if (showSuccess) {
    return (
      <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
          >
            <CheckCircle className="text-emerald-400" size={48} />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-2"
          >
            {language === 'ar' ? 'تم الدفع بنجاح!' : language === 'fr' ? 'Paiement réussi!' : 'Payment Successful!'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-center mb-6"
          >
            {language === 'ar' 
              ? `مرحباً بك في ${getPlanName(selectedPlan!)}! استمتع بميزاتك الجديدة`
              : language === 'fr'
              ? `Bienvenue dans ${getPlanName(selectedPlan!)}! Profitez de vos nouvelles fonctionnalités`
              : `Welcome to ${getPlanName(selectedPlan!)}! Enjoy your new features`
            }
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 w-full"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center',
                selectedPlan?.color === 'amber' && 'bg-amber-400/20',
                selectedPlan?.color === 'purple' && 'bg-neon-purple/20',
                selectedPlan?.color === 'emerald' && 'bg-emerald-400/20',
              )}>
                <Icon size={28} className={
                  selectedPlan?.color === 'amber' ? 'text-amber-400' :
                  selectedPlan?.color === 'purple' ? 'text-neon-purple' :
                  'text-emerald-400'
                } />
              </div>
              <div>
                <p className="font-bold">{getPlanName(selectedPlan!)}</p>
                <p className="text-sm text-white/50">
                  {language === 'ar' ? 'فعّال الآن' : language === 'fr' ? 'Actif maintenant' : 'Active now'}
                </p>
              </div>
            </div>
            
            <button className="w-full btn-primary py-3">
              {language === 'ar' ? 'ابدأ الآن' : language === 'fr' ? 'Commencer' : 'Get Started'}
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (showCheckout && selectedPlan) {
    return (
      <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setShowCheckout(false)}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-4"
          >
            <ArrowLeft size={18} />
            {language === 'ar' ? 'العودة' : language === 'fr' ? 'Retour' : 'Back'}
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-elevated p-6 mb-6"
          >
            <h2 className="text-xl font-bold mb-4">
              {language === 'ar' ? 'الدفع' : language === 'fr' ? 'Paiement' : 'Checkout'}
            </h2>

            {/* Order Summary */}
            <div className="bg-black/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">{getPlanName(selectedPlan)}</span>
                <span className="font-bold">{selectedPlan.price.toLocaleString()} DZD</span>
              </div>
              {couponApplied && (
                <div className="flex items-center justify-between text-emerald-400 text-sm">
                  <span>Coupon ({couponCode.toUpperCase()})</span>
                  <span>-{couponDiscount}%</span>
                </div>
              )}
              <div className="border-t border-white/10 mt-2 pt-2 flex items-center justify-between">
                <span className="font-bold">{language === 'ar' ? 'الإجمالي' : language === 'fr' ? 'Total' : 'Total'}</span>
                <span className="text-xl font-black text-neon-cyan">{calculateTotal().toLocaleString()} DZD</span>
              </div>
            </div>

            {/* Coupon */}
            {!couponApplied && selectedPlan.id !== 'free' && (
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={language === 'ar' ? 'كود الخصم' : language === 'fr' ? 'Code promo' : 'Coupon code'}
                  className="input-field flex-1"
                />
                <button onClick={applyCoupon} className="btn-secondary px-4">
                  {language === 'ar' ? 'تطبيق' : language === 'fr' ? 'Appliquer' : 'Apply'}
                </button>
              </div>
            )}

            {/* Payment Method */}
            <h3 className="font-bold mb-3">
              {language === 'ar' ? 'طريقة الدفع' : language === 'fr' ? 'Méthode de paiement' : 'Payment Method'}
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  'p-3 rounded-xl border transition-colors flex items-center gap-2',
                  paymentMethod === 'card' ? 'border-neon-cyan bg-neon-cyan/10' : 'border-white/10'
                )}
              >
                <CreditCard size={18} className={paymentMethod === 'card' ? 'text-neon-cyan' : 'text-white/50'} />
                <span className="text-sm">{language === 'ar' ? 'بطاقة' : language === 'fr' ? 'Carte' : 'Card'}</span>
              </button>
              <button
                onClick={() => setPaymentMethod('edahabia')}
                className={cn(
                  'p-3 rounded-xl border transition-colors flex items-center gap-2',
                  paymentMethod === 'edahabia' ? 'border-neon-cyan bg-neon-cyan/10' : 'border-white/10'
                )}
              >
                <Smartphone size={18} className={paymentMethod === 'edahabia' ? 'text-neon-cyan' : 'text-white/50'} />
                <span className="text-sm">Edahabia</span>
              </button>
              <button
                onClick={() => setPaymentMethod('cib')}
                className={cn(
                  'p-3 rounded-xl border transition-colors flex items-center gap-2',
                  paymentMethod === 'cib' ? 'border-neon-cyan bg-neon-cyan/10' : 'border-white/10'
                )}
              >
                <Building2 size={18} className={paymentMethod === 'cib' ? 'text-neon-cyan' : 'text-white/50'} />
                <span className="text-sm">CIB</span>
              </button>
              <button
                onClick={() => setPaymentMethod('cash')}
                className={cn(
                  'p-3 rounded-xl border transition-colors flex items-center gap-2',
                  paymentMethod === 'cash' ? 'border-neon-cyan bg-neon-cyan/10' : 'border-white/10'
                )}
              >
                <CreditCard size={18} className={paymentMethod === 'cash' ? 'text-neon-cyan' : 'text-white/50'} />
                <span className="text-sm">{language === 'ar' ? 'نقداً' : language === 'fr' ? 'Espèces' : 'Cash'}</span>
              </button>
            </div>

            {/* Card Details (if card selected) */}
            {paymentMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 mb-6"
              >
                <div>
                  <label className="text-sm text-white/70 mb-1 block">{language === 'ar' ? 'رقم البطاقة' : language === 'fr' ? 'Numéro de carte' : 'Card Number'}</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                    className="input-field"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">{language === 'ar' ? 'تاريخ الانتهاء' : language === 'fr' ? 'Expiration' : 'Expiry'}</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                      className="input-field"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">CVC</label>
                    <input
                      type="text"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))}
                      className="input-field"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">{language === 'ar' ? 'اسم البطاقة' : language === 'fr' ? 'Nom sur carte' : 'Card Name'}</label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="JOHN DOE"
                  />
                </div>
              </motion.div>
            )}

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
              <Lock size={14} />
              <span>
                {language === 'ar' 
                  ? 'معاملاتك آمنة ومشفرة' 
                  : language === 'fr' 
                  ? 'Vos transactions sont sécurisées et chiffrées' 
                  : 'Your transactions are secure and encrypted'}
              </span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full neon-button py-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {language === 'ar' ? 'جارٍ المعالجة...' : language === 'fr' ? 'Traitement...' : 'Processing...'}
                </>
              ) : (
                <>
                  <Shield size={20} />
                  {language === 'ar' ? 'ادفع الآن' : language === 'fr' ? 'Payer maintenant' : 'Pay Now'} ({calculateTotal().toLocaleString()} DZD)
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 pt-20 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-4">
            <Crown className="text-neon-purple" size={20} />
            <span className="text-neon-purple text-sm font-medium">
              {language === 'ar' ? 'ترقيتك' : language === 'fr' ? 'Votre Upgrade' : 'Your Upgrade'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {language === 'ar' ? 'اختر خطتك' : language === 'fr' ? 'Choisissez votre Plan' : 'Choose Your Plan'}
            </span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' 
              ? 'افتح ميزات متميزة لتعزيز فرصك' 
              : language === 'fr' 
              ? 'Débloquez des fonctionnalités premium pour améliorer vos chances' 
              : 'Unlock premium features to boost your chances'}
          </p>
        </motion.div>

        {/* Plans */}
        <div className="space-y-4 mb-6">
          {plans.map((plan, index) => {
            const PlanIcon = plan.icon
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => { setSelectedPlan(plan); if (plan.id !== 'free') setShowCheckout(true) }}
                className={cn(
                  'glass-card-hover p-4 cursor-pointer relative transition-all',
                  plan.recommended && 'border-neon-cyan/50 bg-neon-cyan/5',
                )}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-neon-cyan text-black text-xs font-bold rounded-full">
                    {language === 'ar' ? 'الأكثر شعبية' : language === 'fr' ? 'Populaire' : 'Recommended'}
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center',
                    plan.color === 'amber' && 'bg-amber-400/20',
                    plan.color === 'purple' && 'bg-neon-purple/20',
                    plan.color === 'emerald' && 'bg-emerald-400/20',
                  )}>
                    <PlanIcon size={28} className={
                      plan.color === 'amber' ? 'text-amber-400' :
                      plan.color === 'purple' ? 'text-neon-purple' :
                      'text-emerald-400'
                    } />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg">{getPlanName(plan)}</h3>
                      <div className="text-right">
                        {plan.originalPrice && (
                          <span className="text-sm text-white/30 line-through mr-2">
                            {plan.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="font-black text-neon-cyan">
                          {plan.price === 0 ? (language === 'ar' ? 'مجاني' : language === 'fr' ? 'Gratuit' : 'Free') : `${plan.price.toLocaleString()} DZD`}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-1 mt-3">
                      {getFeatures(plan).slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {plan.id !== 'free' && (
                      <button className="mt-4 text-sm text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1">
                        {language === 'ar' ? 'اشترك الآن' : language === 'fr' ? "S'abonner" : 'Subscribe Now'}
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4"
        >
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="text-neon-cyan" size={18} />
            {language === 'ar' ? 'أسئلة شائعة' : language === 'fr' ? 'FAQ' : 'FAQ'}
          </h3>
          <div className="space-y-3 text-sm text-white/70">
            <div>
              <p className="font-medium text-white mb-1">{language === 'ar' ? 'هل يمكنني الإلغاء؟' : language === 'fr' ? 'Puis-je annuler?' : 'Can I cancel?'}</p>
              <p>
                {language === 'ar' 
                  ? 'نعم، يمكنك الإلغاء في أي وقت. لن يتم خصم أي مبلغ إضافي.'
                  : language === 'fr'
                  ? 'Oui, vous pouvez annuler à tout moment. Aucun frais supplémentaire ne sera prélevé.'
                  : 'Yes, you can cancel anytime. No additional charges will be made.'}
              </p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">{language === 'ar' ? 'ما هي طرق الدفع؟' : language === 'fr' ? 'Quels modes de paiement?' : 'What payment methods?'}</p>
              <p>
                {language === 'ar' 
                  ? 'نقبل البطاقات البنكية، CIB، Edahabia، والدفع النقدي.'
                  : language === 'fr'
                  ? 'Nous acceptons les cartes bancaires, CIB, Edahabia et les espèces.'
                  : 'We accept bank cards, CIB, Edahabia, and cash.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentIntegration
