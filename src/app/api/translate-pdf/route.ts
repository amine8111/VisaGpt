import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const text = formData.get('text') as string
    const targetLang = formData.get('targetLang') as string || 'en'

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    let translatedText = text
    
    try {
      const encodedText = encodeURIComponent(text.substring(0, 5000))
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodedText}`,
        { signal: AbortSignal.timeout(10000) }
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data[0] && data[0].length > 0) {
          translatedText = data[0].map((item: any) => item[0]).join('')
        }
      }
    } catch (e) {
      console.log('Translation failed, returning original text:', e)
    }

    const newPdfDoc = await PDFDocument.create()
    const font = await newPdfDoc.embedFont(StandardFonts.Helvetica)
    
    const maxWidth = 500
    const fontSize = 12
    const lineHeight = 15
    const margin = 50
    
    const words = translatedText.split(/\s+/)
    let lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word
      const width = font.widthOfTextAtSize(testLine, fontSize)
      
      if (width > maxWidth) {
        if (currentLine) lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) lines.push(currentLine)

    const pageHeight = 800
    const linesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight)
    
    for (let i = 0; i < lines.length; i += linesPerPage) {
      const pageLines = lines.slice(i, i + linesPerPage)
      const page = newPdfDoc.addPage([600, pageHeight])
      
      page.drawText(pageLines.join('\n'), {
        x: margin,
        y: pageHeight - margin,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        lineHeight: lineHeight,
      })
    }

    const pdfBytes = await newPdfDoc.save()
    
    return new NextResponse(pdfBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="translated_${targetLang}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('PDF translation error:', error)
    return NextResponse.json({ error: 'Failed to translate: ' + error.message }, { status: 500 })
  }
}
