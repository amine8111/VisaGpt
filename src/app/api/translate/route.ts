import { NextRequest, NextResponse } from 'next/server'

const langNames: Record<string, string> = {
  ar: 'Arabic',
  fr: 'French',
  en: 'English',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const text = body?.text?.trim()
    const sourceLang = body?.sourceLang || 'auto'
    const targetLang = body?.targetLang

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or target language' }, { status: 400 })
    }

    // Try Google Translate free API first
    try {
      const encodedText = encodeURIComponent(text)
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`,
        { signal: AbortSignal.timeout(5000) }
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data[0] && data[0].length > 0) {
          const translated = data[0].map((item: any) => item[0]).join('')
          return NextResponse.json({ translated })
        }
      }
    } catch (e) {
      console.log('Google Translate failed:', e)
    }

    // Fallback: Simple word-by-word translation for common words
    const translations: Record<string, Record<string, string>> = {
      'en-ar': { 'hello': 'مرحبا', 'goodbye': 'مع السلامة', 'thank you': 'شكرا', 'welcome': 'أهلاً', 'yes': 'نعم', 'no': 'لا', 'please': 'من فضلك', 'sorry': 'أنا آسف' },
      'ar-en': { 'مرحبا': 'Hello', 'مع السلامة': 'Goodbye', 'شكرا': 'Thank you', 'أهلاً': 'Welcome', 'نعم': 'Yes', 'لا': 'No', 'من فضلك': 'Please', 'أنا آسف': 'Sorry' },
      'fr-ar': { 'hello': 'مرحبا', 'goodbye': 'مع السلامة', 'thank you': 'شكرا', 'bonjour': 'مرحبا', 'merci': 'شكرا', 'au revoir': 'مع السلامة' },
      'ar-fr': { 'مرحبا': 'bonjour', 'مع السلامة': 'au revoir', 'شكرا': 'merci', 'أهلاً': 'Bienvenue' },
      'en-fr': { 'hello': 'bonjour', 'goodbye': 'au revoir', 'thank you': 'merci', 'welcome': 'bienvenue', 'yes': 'oui', 'no': 'non' },
      'fr-en': { 'bonjour': 'hello', 'au revoir': 'goodbye', 'merci': 'thank you', 'bienvenue': 'welcome', 'oui': 'yes', 'non': 'no' },
    }

    const key = `${sourceLang}-${targetLang}`
    let translated = text

    // Check for direct translation
    if (translations[key] && translations[key][text.toLowerCase()]) {
      translated = translations[key][text.toLowerCase()]
    } else {
      // Try finding word in reverse
      const reverseKey = `${targetLang}-${sourceLang}`
      if (translations[reverseKey]) {
        const reverse = translations[reverseKey]
        const found = Object.entries(reverse).find(([k, v]) => v.toLowerCase() === text.toLowerCase())
        if (found) translated = found[0]
      }
    }

    // If still not found, return a placeholder
    if (translated === text) {
      translated = `[Translation: "${text}" from ${langNames[sourceLang] || sourceLang} to ${langNames[targetLang] || targetLang}]`
    }

    return NextResponse.json({ translated, note: 'Free translation' })
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: 'Translation failed. Please try again.' }, { status: 500 })
  }
}
