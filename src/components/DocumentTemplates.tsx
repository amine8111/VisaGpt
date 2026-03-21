'use client'

import { motion } from 'framer-motion'
import { FileText, Download, Search, Share2, Eye } from 'lucide-react'
import { documentTemplates } from '@/lib/utils'
import { useState } from 'react'

export function DocumentTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['الكل', 'عائلي', 'تأشيرة', 'عمل', 'مالي', 'سفر']

  const filteredTemplates = documentTemplates.filter((template) => {
    const matchesCategory = selectedCategory === 'الكل' || template.category === selectedCategory
    const matchesSearch = template.name.includes(searchQuery) || template.description.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen px-4 py-6 pb-28 relative z-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 gradient-text">نماذج الوثائق</h2>
          <p className="text-white/60 text-sm">حمّل نماذج جاهزة للوثائق المطلوبة</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-4"
        >
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن نموذج..."
            className="input-field pr-12"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'neon-button'
                  : 'glass-card-hover text-white/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="space-y-3">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-neon-purple/20 rounded-xl">
                  <FileText className="text-neon-purple" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{template.name}</h3>
                  <p className="text-sm text-white/60 mb-2">{template.description}</p>
                  <span className="inline-block px-2 py-1 bg-white/10 rounded-full text-xs text-white/50">
                    {template.category}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 rounded-xl glass-card-hover flex items-center justify-center gap-2 text-sm"
                >
                  <Eye size={16} />
                  معاينة
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 rounded-xl neon-button flex items-center justify-center gap-2 text-sm"
                >
                  <Download size={16} />
                  تحميل
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="mx-auto mb-4 text-white/20" size={48} />
            <p className="text-white/50">لم يتم العثور على نماذج</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
