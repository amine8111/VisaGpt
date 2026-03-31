'use client'

import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useVisaStore } from '@/store/visaStore'
import { NeonBackground } from '@/components/Background'
import { BottomNav, FloatingAIButton } from '@/components/BottomNav'
import { LandingPage } from '@/components/LandingPage'
import { MultiStepForm } from '@/components/MultiStepForm'
import { DocumentUpload } from '@/components/DocumentUpload'
import { AIProcessing } from '@/components/AIProcessing'
import { ResultsDashboard } from '@/components/ResultsDashboard'
import { WhatIfSimulator } from '@/components/WhatIfSimulator'
import { AppointmentTracker } from '@/components/AppointmentTracker'
import { InterviewChatbot } from '@/components/InterviewChatbot'
import { DocumentTemplates } from '@/components/DocumentTemplates'
import { TranslationHub } from '@/components/TranslationHub'
import { FinancialAnalyzer } from '@/components/FinancialAnalyzer'
import { SimMarketplace } from '@/components/SimMarketplace'
import { VisaStatusTracker } from '@/components/VisaStatusTracker'
import { TripCostCalculator } from '@/components/TripCostCalculator'
import { PackingListGenerator } from '@/components/PackingListGenerator'
import { EmbassyLocator } from '@/components/EmbassyLocator'
import { HotelBooking } from '@/components/HotelBooking'
import { FlightSearch } from '@/components/FlightSearch'
import { ServicesHub } from '@/components/ServicesHub'
import { CommunityScreen } from '@/components/CommunityScreen'
import { VisaFreeMap } from '@/components/VisaFreeMap'
import { DocumentScanner } from '@/components/DocumentScanner'
import { FamilyManager } from '@/components/FamilyManager'
import { AuthScreen } from '@/components/AuthScreen'
import { Dashboard } from '@/components/Dashboard'
import { Header } from '@/components/Header'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLanguage } from '@/components/LanguageProvider'
import { Checklist } from '@/components/Checklist'
import { AdviceEngine } from '@/components/AdviceEngine'
import { DocumentOrganizer } from '@/components/DocumentOrganizer'
import { LetterGenerator } from '@/components/LetterGenerator'
import { FinancialPlanner } from '@/components/FinancialPlanner'
import SchengenFormOfficial from '@/components/SchengenFormOfficial'
import { PhotoCapture } from '@/components/PhotoCapture'
import { AgentBooking } from '@/components/AgentBooking'
import { InsurancePurchase } from '@/components/InsurancePurchase'
import { RecoursGenerator } from '@/components/RecoursGenerator'
import { UpgradePage } from '@/components/UpgradePage'
import { RejectionAnalyzer } from '@/components/RejectionAnalyzer'
import { VisaAtlas } from '@/components/VisaAtlas'
import { EVisaHub } from '@/components/EVisaHub'
import { VisaFormFiller } from '@/components/VisaFormFiller'
import { AIDocumentGenerator } from '@/components/AIDocumentGenerator'
import { SuccessStories } from '@/components/SuccessStories'
import { NotificationCenter } from '@/components/NotificationCenter'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ProgressTracker } from '@/components/ProgressTracker'
import { VoiceInterview } from '@/components/VoiceInterview'
import { VisaDeadlineReminders } from '@/components/VisaDeadlineReminders'
import { ShareResults } from '@/components/ShareResults'
import { BookmarkCountries } from '@/components/BookmarkCountries'
import { QuickStatsDashboard } from '@/components/QuickStatsDashboard'
import { PaymentIntegration } from '@/components/PaymentIntegration'
import { InsuranceClaimAssistant } from '@/components/InsuranceClaimAssistant'
import { LegalSavingsPlan } from '@/components/LegalSavingsPlan'
import { DocumentInspector } from '@/components/DocumentInspector'
import { BilingualChatCoach } from '@/components/BilingualChatCoach'
import { SlotMonitor } from '@/components/SlotMonitor'
import { ProfileSetup } from '@/components/ProfileSetup'
import { ProAssessment } from '@/components/ProAssessment'
import { ProfilePage } from '@/components/ProfilePage'
import { WelcomeCarousel } from '@/components/WelcomeCarousel'

function DynamicLayout({ children, skipAnimate = false }: { children: React.ReactNode; skipAnimate?: boolean }) {
  const { dir } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main 
      className="min-h-screen bg-background text-white relative overflow-hidden" 
      dir={dir}
      lang={dir === 'rtl' ? 'ar' : 'en'}
    >
      <div className="absolute top-4 left-4 sm:left-6 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <LanguageSwitcher />
        </div>
      </div>
      <NeonBackground />
      <Header />
      <FloatingAIButton />
      {skipAnimate ? children : (
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      )}
      <BottomNav />
    </main>
  )
}

function HomeContent() {
  const router = useRouter()
  const { activeNav, currentStep, isAnalyzing, user, fetchUser, userProfile, setActiveNav } = useVisaStore()
  const [isChecking, setIsChecking] = useState(true)
  const [showWelcomeCarousel, setShowWelcomeCarousel] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth...')
      await fetchUser()
      console.log('Auth check complete')
      setIsChecking(false)
      
      // Check if user has seen welcome carousel
      const hasSeenCarousel = localStorage.getItem('visagpt_seen_welcome')
      if (!hasSeenCarousel) {
        setShowWelcomeCarousel(true)
      }
    }
    checkAuth()
  }, [fetchUser])

  const handleCarouselComplete = () => {
    localStorage.setItem('visagpt_seen_welcome', 'true')
    setShowWelcomeCarousel(false)
  }

  useEffect(() => {
    console.log('isChecking:', isChecking, 'user:', user, 'profileComplete:', userProfile.isProfileComplete)
    if (!isChecking && !user) {
      console.log('Redirecting to /auth')
      router.replace('/auth')
    }
  }, [isChecking, user, router])

  const renderContent = () => {
    console.log('renderContent:', { activeNav, isProfileComplete: userProfile.isProfileComplete, user: !!user })
    
    if (isAnalyzing) {
      return <AIProcessing />
    }

    if (user && !userProfile.isProfileComplete && activeNav !== 'profile-setup' && activeNav !== 'home') {
      console.log('Showing ProfileSetup')
      return <ProfileSetup />
    }

    if (activeNav === 'photo') {
      console.log('🔥 PHOTO NAV DETECTED - rendering PhotoCapture')
    }

    switch (activeNav) {
      case 'home':
        return user ? <Dashboard /> : null
      case 'landing':
        return user ? <Dashboard /> : <LandingPage />
      case 'calculator':
        if (currentStep === 4) {
          return <DocumentUpload />
        }
        return <MultiStepForm />
      case 'results':
        return <ResultsDashboard />
      case 'whatif':
        return <WhatIfSimulator />
      case 'services':
        return <ServicesHub />
      case 'radar':
        return <AppointmentTracker />
      case 'chatbot':
        return <InterviewChatbot />
      case 'templates':
        return <DocumentTemplates />
      case 'translate':
        return <TranslationHub />
      case 'community':
        return <CommunityScreen />
      case 'visafree':
        return <VisaFreeMap />
      case 'scanner':
        return <DocumentScanner />
      case 'family':
        return <FamilyManager />
      case 'profile-setup':
        return <ProfileSetup />
      case 'profile':
        return <ProfilePage />
      case 'auth':
        return <AuthScreen />

      case 'checklist':
        return <Checklist />
      case 'advice':
        return <AdviceEngine />
      case 'schengen-form':
        return <SchengenFormOfficial />
      case 'documents':
        return <DocumentOrganizer />
      case 'financial':
        return <FinancialPlanner />
      case 'letters':
        return <LetterGenerator />
      case 'insurance':
        return <InsurancePurchase />
      case 'photo':
        console.log('=== PHOTO CASE REACHED ===');
        return <PhotoCapture />;
      case 'booking':
        return <AgentBooking />
      case 'recours':
        return <RecoursGenerator />
      case 'upgrade':
        return <UpgradePage />
      case 'rejection-analyzer':
        return <RejectionAnalyzer />
      case 'visa-atlas':
        return <VisaAtlas />
      case 'evisa-hub':
        return <EVisaHub />
      case 'form-filler':
        return <VisaFormFiller />
      case 'doc-generator':
        return <AIDocumentGenerator />
      case 'success-stories':
        return <SuccessStories />
      case 'notifications':
        return <NotificationCenter />
      case 'theme':
        return <ThemeToggle />
      case 'progress':
        return <ProgressTracker />
      case 'voice-interview':
        return <VoiceInterview />
      case 'deadline-reminders':
        return <VisaDeadlineReminders />
      case 'share-results':
        return <ShareResults />
      case 'bookmarks':
        return <BookmarkCountries />
      case 'stats':
        return <QuickStatsDashboard />
      case 'payment':
        return <PaymentIntegration />
      case 'insurance-claim':
        return <InsuranceClaimAssistant />
      case 'savings-plan':
        return <LegalSavingsPlan />
      case 'document-inspector':
        return <DocumentInspector />
      case 'chat-coach':
        return <BilingualChatCoach />
      case 'slot-monitor':
        return <SlotMonitor />
      case 'pro-assessment':
        return <ProAssessment />
      case 'financial-analyzer':
        return <FinancialAnalyzer />
      case 'sim-marketplace':
        return <SimMarketplace />
      case 'visa-status':
        return <VisaStatusTracker />
      case 'trip-cost':
        return <TripCostCalculator />
      case 'packing-list':
        return <PackingListGenerator />
      case 'embassy-locator':
        return <EmbassyLocator />
      case 'hotel-booking':
        return <HotelBooking />
      case 'flight-search':
        return <FlightSearch />
      default:
        return user ? <Dashboard /> : <LandingPage />
    }
  }

  return (
    <>
      <DynamicLayout skipAnimate={activeNav === 'photo'}>
        {activeNav === 'photo' ? (
          <div className="min-h-screen bg-[#0a051a]">
            {renderContent()}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        )}
      </DynamicLayout>

      {/* Welcome Carousel */}
      <AnimatePresence>
        {showWelcomeCarousel && (
          <WelcomeCarousel onComplete={handleCarouselComplete} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function Home() {
  return <HomeContent />
}
