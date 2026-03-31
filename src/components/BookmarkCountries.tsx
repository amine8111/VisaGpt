'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bookmark, BookmarkCheck, Star, Globe, MapPin,
  Clock, DollarSign, ChevronRight, Search, Filter,
  Trash2, Plus, X, ExternalLink, Plane
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { cn } from '@/lib/utils'

interface SavedCountry {
  id: string
  country: string
  countryAr: string
  countryFr: string
  flag: string
  visaType: string
  visaTypeAr: string
  visaTypeFr: string
  savedAt: string
  notes: string
  notesAr: string
  notesFr: string
  priority: 'high' | 'medium' | 'low'
  budget: number
  targetDate?: string
  targetDateAr?: string
  targetDateFr?: string
  website?: string
}

const sampleSaved: SavedCountry[] = [
  {
    id: 'saved-1',
    country: 'France',
    countryAr: 'فرنسا',
    countryFr: 'France',
    flag: '🇫🇷',
    visaType: 'Schengen',
    visaTypeAr: 'شنغن',
    visaTypeFr: 'Schengen',
    savedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    notes: 'Dream destination. Need to save more money.',
    notesAr: 'الوجهة المثالية. أحتاج لتوفير المزيد من المال.',
    notesFr: 'Destination de rêve. Besoin d\'épargner plus.',
    priority: 'high',
    budget: 150000,
    targetDate: new Date(Date.now() + 90 * 86400000).toISOString(),
    targetDateAr: new Date(Date.now() + 90 * 86400000).toLocaleDateString('ar-DZ'),
    targetDateFr: new Date(Date.now() + 90 * 86400000).toLocaleDateString('fr-FR'),
    website: 'https://fr.tlscontact.com',
  },
  {
    id: 'saved-2',
    country: 'Turkey',
    countryAr: 'تركيا',
    countryFr: 'Turquie',
    flag: '🇹🇷',
    visaType: 'E-Visa',
    visaTypeAr: 'تأشيرة إلكترونية',
    visaTypeFr: 'E-Visa',
    savedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    notes: 'Easy e-visa process. Plan for summer.',
    notesAr: 'عملية تأشيرة إلكترونية سهلة. مخطط للصيف.',
    notesFr: 'Processus e-visa facile. Plan pour l\'été.',
    priority: 'medium',
    budget: 50000,
    website: 'https://www.evisa.gov.tr',
  },
  {
    id: 'saved-3',
    country: 'United Kingdom',
    countryAr: 'المملكة المتحدة',
    countryFr: 'Royaume-Uni',
    flag: '🇬🇧',
    visaType: 'Tourist',
    visaTypeAr: 'سياحة',
    visaTypeFr: 'Touriste',
    savedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    notes: 'Higher rejection rate. Need strong profile.',
    notesAr: 'نسبة رفض أعلى. أحتاج ملف قوي.',
    notesFr: 'Taux de refus plus élevé. Besoin d\'un profil solide.',
    priority: 'low',
    budget: 200000,
  },
]

export function BookmarkCountries() {
  const { t, language } = useLanguage()
  const [savedCountries, setSavedCountries] = useState<SavedCountry[]>(sampleSaved)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCountry, setNewCountry] = useState<Partial<SavedCountry>>({
    country: '',
    countryAr: '',
    countryFr: '',
    flag: '',
    visaType: '',
    visaTypeAr: '',
    visaTypeFr: '',
    priority: 'medium',
    budget: 0,
    notes: '',
    notesAr: '',
    notesFr: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('visagpt_bookmarks')
    if (saved) {
      setSavedCountries(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('visagpt_bookmarks', JSON.stringify(savedCountries))
  }, [savedCountries])

  const getCountry = (c: SavedCountry) => {
    if (language === 'ar') return c.countryAr
    if (language === 'fr') return c.countryFr
    return c.country
  }

  const getVisaType = (c: SavedCountry) => {
    if (language === 'ar') return c.visaTypeAr
    if (language === 'fr') return c.visaTypeFr
    return c.visaType
  }

  const getNotes = (c: SavedCountry) => {
    if (language === 'ar') return c.notesAr || c.notes
    if (language === 'fr') return c.notesFr || c.notes
    return c.notes
  }

  const getDate = (c: SavedCountry) => {
    if (language === 'ar') return c.targetDateAr || new Date(c.targetDate || '').toLocaleDateString('ar-DZ')
    if (language === 'fr') return c.targetDateFr || new Date(c.targetDate || '').toLocaleDateString('fr-FR')
    return c.targetDate ? new Date(c.targetDate).toLocaleDateString() : ''
  }

  const getDaysUntil = (date?: string) => {
    if (!date) return null
    const now = new Date()
    const target = new Date(date)
    return Math.ceil((target.getTime() - now.getTime()) / 86400000)
  }

  const removeBookmark = (id: string) => {
    setSavedCountries(prev => prev.filter(c => c.id !== id))
  }

  const addBookmark = () => {
    if (!newCountry.country) return

    const bookmark: SavedCountry = {
      id: `saved-${Date.now()}`,
      country: newCountry.country,
      countryAr: newCountry.countryAr || newCountry.country,
      countryFr: newCountry.countryFr || newCountry.country,
      flag: newCountry.flag || '🏳️',
      visaType: newCountry.visaType || 'Tourist',
      visaTypeAr: newCountry.visaTypeAr || newCountry.visaType || 'سياحة',
      visaTypeFr: newCountry.visaTypeFr || newCountry.visaType || 'Touriste',
      savedAt: new Date().toISOString(),
      notes: newCountry.notes || '',
      notesAr: newCountry.notesAr || newCountry.notes || '',
      notesFr: newCountry.notesFr || newCountry.notes || '',
      priority: newCountry.priority as SavedCountry['priority'] || 'medium',
      budget: newCountry.budget || 0,
      targetDate: newCountry.targetDate ? new Date(newCountry.targetDate).toISOString() : undefined,
    }

    setSavedCountries(prev => [bookmark, ...prev])
    setShowAddForm(false)
    setNewCountry({
      country: '',
      countryAr: '',
      countryFr: '',
      flag: '',
      visaType: '',
      visaTypeAr: '',
      visaTypeFr: '',
      priority: 'medium',
      budget: 0,
      notes: '',
      notesAr: '',
      notesFr: '',
    })
  }

  const filteredCountries = savedCountries.filter(c => {
    const matchesSearch = 
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.countryAr.includes(searchQuery) ||
      c.countryFr.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === 'all' || c.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const stats = {
    total: savedCountries.length,
    highPriority: savedCountries.filter(c => c.priority === 'high').length,
    totalBudget: savedCountries.reduce((acc, c) => acc + c.budget, 0),
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
            <BookmarkCheck className="text-neon-purple" size={20} />
            <span className="text-neon-purple text-sm font-medium">
              {language === 'ar' ? 'وجهات محفوظة' : language === 'fr' ? 'Destinations Sauvegardées' : 'Saved Destinations'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {language === 'ar' ? 'بلدي المفضل' : language === 'fr' ? 'Mes Favoris' : 'My Favorites'}
            </span>
          </h1>
          <p className="text-white/60">
            {language === 'ar' 
              ? 'احفظ وجهاتك المفضلة وتتبع تقدمك' 
              : language === 'fr' 
              ? 'Sauvegardez vos destinations préférées et suivez vos progrès' 
              : 'Save your favorite destinations and track progress'}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="glass-card p-4 text-center">
            <Globe className="mx-auto mb-2 text-neon-cyan" size={20} />
            <p className="text-xl font-bold">{stats.total}</p>
            <p className="text-xs text-white/50">{language === 'ar' ? 'بلدان' : language === 'fr' ? 'pays' : 'Countries'}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Star className="mx-auto mb-2 text-amber-400" size={20} />
            <p className="text-xl font-bold">{stats.highPriority}</p>
            <p className="text-xs text-white/50">{language === 'ar' ? 'أولوية عالية' : language === 'fr' ? 'Haute priorité' : 'High Priority'}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <DollarSign className="mx-auto mb-2 text-emerald-400" size={20} />
            <p className="text-xl font-bold">{Math.round(stats.totalBudget / 1000)}K</p>
            <p className="text-xs text-white/50">DZD</p>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
              placeholder={language === 'ar' ? 'البحث...' : language === 'fr' ? 'Rechercher...' : 'Search...'}
            />
          </div>
          <button
            onClick={() => setFilterPriority(filterPriority === 'all' ? 'high' : filterPriority === 'high' ? 'medium' : filterPriority === 'medium' ? 'low' : 'all')}
            className={cn(
              'px-4 rounded-xl transition-colors',
              filterPriority !== 'all' ? 'bg-neon-cyan/20 text-neon-cyan' : 'glass-card'
            )}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Priority Filter Labels */}
        {filterPriority !== 'all' && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-white/50">
              {language === 'ar' ? 'تصفية:' : language === 'fr' ? 'Filtre:' : 'Filter:'}
            </span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              filterPriority === 'high' && 'bg-red-500/20 text-red-400',
              filterPriority === 'medium' && 'bg-amber-500/20 text-amber-400',
              filterPriority === 'low' && 'bg-white/10 text-white/50'
            )}>
              {filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}
            </span>
            <button onClick={() => setFilterPriority('all')} className="text-xs text-neon-cyan">
              {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Effacer' : 'Clear'}
            </button>
          </div>
        )}

        {/* Saved Countries List */}
        <div className="space-y-3 mb-6">
          {filteredCountries.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Bookmark className="mx-auto mb-3 text-white/20" size={48} />
              <p className="text-white/50">
                {savedCountries.length === 0 
                  ? (language === 'ar' ? 'لا توجد وجهات محفوظة' : language === 'fr' ? 'Aucune destination sauvegardée' : 'No saved destinations')
                  : (language === 'ar' ? 'لا توجد نتائج' : language === 'fr' ? 'Aucun résultat' : 'No results')
                }
              </p>
            </div>
          ) : (
            filteredCountries.map((country, index) => {
              const daysUntil = getDaysUntil(country.targetDate)
              return (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card-hover p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-3xl">
                      {country.flag}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold flex items-center gap-2">
                            {getCountry(country)}
                            <span className={cn(
                              'w-2 h-2 rounded-full',
                              country.priority === 'high' && 'bg-red-400',
                              country.priority === 'medium' && 'bg-amber-400',
                              country.priority === 'low' && 'bg-white/30'
                            )} />
                          </h3>
                          <p className="text-sm text-neon-cyan">{getVisaType(country)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => removeBookmark(country.id)}
                            className="p-2 text-white/30 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {getNotes(country) && (
                        <p className="text-xs text-white/50 mt-2 line-clamp-2">{getNotes(country)}</p>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        {country.budget > 0 && (
                          <div className="flex items-center gap-1 text-xs text-white/50">
                            <DollarSign size={12} />
                            <span>{country.budget.toLocaleString()} DZD</span>
                          </div>
                        )}
                        {daysUntil !== null && daysUntil >= 0 && (
                          <div className="flex items-center gap-1 text-xs text-white/50">
                            <Clock size={12} />
                            <span>{daysUntil}d</span>
                          </div>
                        )}
                        {country.website && (
                          <a
                            href={country.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-neon-cyan hover:text-neon-cyan/80"
                          >
                            <ExternalLink size={12} />
                            <span>{language === 'ar' ? 'الموقع' : language === 'fr' ? 'Site' : 'Website'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Add Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full neon-button flex items-center justify-center gap-2 mb-4"
        >
          <Plus size={20} />
          {language === 'ar' ? 'إضافة وجهة' : language === 'fr' ? 'Ajouter une destination' : 'Add Destination'}
        </motion.button>

        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card-elevated p-4 mb-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">
                  {language === 'ar' ? 'وجهة جديدة' : language === 'fr' ? 'Nouvelle Destination' : 'New Destination'}
                </h4>
                <button onClick={() => setShowAddForm(false)}>
                  <X size={20} className="text-white/50" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">
                    {language === 'ar' ? 'البلد' : language === 'fr' ? 'Pays' : 'Country'}
                  </label>
                  <input
                    type="text"
                    value={newCountry.country}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, country: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., Germany"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-1 block">
                    {language === 'ar' ? 'نوع التأشيرة' : language === 'fr' ? 'Type de visa' : 'Visa Type'}
                  </label>
                  <input
                    type="text"
                    value={newCountry.visaType}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, visaType: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., Schengen"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">
                      {language === 'ar' ? 'الميزانية (DZD)' : language === 'fr' ? 'Budget (DZD)' : 'Budget (DZD)'}
                    </label>
                    <input
                      type="number"
                      value={newCountry.budget || ''}
                      onChange={(e) => setNewCountry(prev => ({ ...prev, budget: Number(e.target.value) }))}
                      className="input-field"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">
                      {language === 'ar' ? 'الأولوية' : language === 'fr' ? 'Priorité' : 'Priority'}
                    </label>
                    <select
                      value={newCountry.priority}
                      onChange={(e) => setNewCountry(prev => ({ ...prev, priority: e.target.value as SavedCountry['priority'] }))}
                      className="input-field"
                    >
                      <option value="high">{language === 'ar' ? 'عالية' : language === 'fr' ? 'Haute' : 'High'}</option>
                      <option value="medium">{language === 'ar' ? 'متوسطة' : language === 'fr' ? 'Moyenne' : 'Medium'}</option>
                      <option value="low">{language === 'ar' ? 'منخفضة' : language === 'fr' ? 'Basse' : 'Low'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-1 block">
                    {language === 'ar' ? 'ملاحظات' : language === 'fr' ? 'Notes' : 'Notes'}
                  </label>
                  <textarea
                    value={newCountry.notes}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-field h-20 resize-none"
                    placeholder={language === 'ar' ? 'أضف ملاحظات...' : language === 'fr' ? 'Ajouter des notes...' : 'Add notes...'}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary flex-1"
                  >
                    {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
                  </button>
                  <button
                    onClick={addBookmark}
                    disabled={!newCountry.country}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {language === 'ar' ? 'حفظ' : language === 'fr' ? 'Sauvegarder' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="text-neon-cyan" size={18} />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'تصفح الوجهات' : language === 'fr' ? 'Explorer Destinations' : 'Explore Destinations'}
              </span>
            </div>
            <ChevronRight className="text-white/30" size={18} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookmarkCountries
