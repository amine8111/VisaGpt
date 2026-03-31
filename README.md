# VisaAI - مساعد التأشيرة الذكي 🇩🇿

<div align="center">
  <h1>🌐 VisaAI</h1>
  <p>منصة الذكاء الاصطناعي لمساعدة المتقدمين الجزائريين على التأشيرات</p>
  <p>AI-powered visa assistant for Algerian applicants</p>
</div>

## ✨ الميزات الرئيسية

### 🎯 تحليل التأشيرة بالذكاء الاصطناعي
- **حاسبة فرص التأشيرة** - احسب احتمال الموافقة
- **محاكي "ماذا لو"** - جرّب تغيير المتغيرات وراقب تأثيرها
- **محلل الوثائق** - فحص ذكي لامتثال الوثائق
- **مولّد رسالة الدافع** - خطابات احترافية

### 📋 إدارة الوثائق
- **رفع جواز السفر** - مع التحقق التلقائي
- **كشف الحساب البنكي** - تحليل مالي شامل
- **إثبات العمل** - شهادات التوظيف
- **قارن الوثائق** - كشف التناقضات

### 🎓 خدمات متقدمة
- **محاكي المقابلة** - تدريب على أسئلة القنصلية
- **محاكي ماذا لو** - تحسين فرصك
- **وجهات بدون تأشيرة** - استكشف العالم
- **طلبات العائلة** - إدارة جماعية

### 🌍 خدمات إضافية
- **رادار المواعيد** - تتبع توفر المواعيد
- **نماذج الوثائق** - تحميل قوالب جاهزة
- **مركز الترجمة** - خدمات الترجمة المعتمدة
- **المجتمع** - قصص نجاح ونصائح

## 🚀 التقنيات المستخدمة

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## 🎨 نظام التصميم

- **Theme**: Dark futuristic neon aesthetic
- **Colors**: 
  - Background: #0A051A - #120A2B
  - Neon Cyan: #00E5FF
  - Neon Magenta: #FF007A
- **Font**: Cairo (Arabic)
- **Layout**: RTL (Right-to-Left) default

## 🛠 التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/visa-ai.git
cd visa-ai

# تثبيت الحزم
npm install

# تشغيل في وضع التطوير
npm run dev

# البناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start
```

## 📁 هيكل المشروع

```
visa-ai/
├── src/
│   ├── app/
│   │   ├── globals.css      # الأنماط العامة
│   │   ├── layout.tsx      # تخطيط الجذر
│   │   └── page.tsx         # الصفحة الرئيسية
│   ├── components/
│   │   ├── Background.tsx   # الخلفية المتحركة
│   │   ├── BottomNav.tsx    # شريط التنقل السفلي
│   │   ├── Header.tsx      # الرأس
│   │   ├── Dashboard.tsx    # لوحة التحكم
│   │   ├── LandingPage.tsx  # صفحة الهبوط
│   │   ├── MultiStepForm.tsx # نموذج متعدد الخطوات
│   │   ├── DocumentUpload.tsx # رفع الوثائق
│   │   ├── AIProcessing.tsx  # شاشة التحميل
│   │   ├── ResultsDashboard.tsx # لوحة النتائج
│   │   ├── WhatIfSimulator.tsx # محاكي ماذا لو
│   │   ├── AppointmentTracker.tsx # رادار المواعيد
│   │   ├── InterviewChatbot.tsx # محاكي المقابلة
│   │   ├── DocumentTemplates.tsx # نماذج الوثائق
│   │   ├── TranslationHub.tsx # مركز الترجمة
│   │   ├── ServicesHub.tsx   # مركز الخدمات
│   │   ├── CommunityScreen.tsx # المجتمع
│   │   ├── VisaFreeMap.tsx   # خريطة الوجهات
│   │   ├── DocumentScanner.tsx # فاحص الوثائق
│   │   └── FamilyManager.tsx # إدارة العائلة
│   ├── store/
│   │   └── visaStore.ts     # Zustand store
│   └── lib/
│       └── utils.ts         # دوال مساعدة
├── public/
│   ├── manifest.json        # PWA manifest
│   └── icons/               # أيقونات التطبيق
├── tailwind.config.js       # إعدادات Tailwind
├── tsconfig.json            # إعدادات TypeScript
└── package.json
```

## 🌍 الدول المدعومة

| الدولة | العلم | نوع التأشيرة |
|--------|-------|--------------|
| 🇫🇷 France | شنغن | سياحة/عمل/دراسة |
| 🇪🇸 Spain | شنغن | سياحة/عمل |
| 🇮🇹 Italy | شنغن | سياحة/عمل |
| 🇩🇪 Germany | شنغن | سياحة/عمل |
| 🇬🇧 United Kingdom | UK | زائر |
| 🇺🇸 United States | US | B1/B2 |
| 🇨🇦 Canada | Canada | زائر |
| 🇹🇷 Turkey | Turkey | تأشيرة إلكترونية |
| 🇦🇪 UAE | UAE | تأشيرة إلكترونية |

## 🌐 اللغات المدعومة

- **العربية (AR)** - الافتراضية، RTL
- **Français (FR)** - الفرنسية
- **English (EN)** - الإنجليزية

## ⚠️ إخلاء المسؤولية

**مهم**: هذا التطبيق يوفر تقديرات مولّدة بالذكاء الاصطناعي للأغراض التوجيهية فقط. ليست نصيحة قانونية ولا تضمن الموافقة على التأشيرة. القرارات النهائية تتخذها السفارات والقنصليات.

## 📄 الترخيص

MIT License - راجع ملف LICENSE للتفاصيل.

## 🤝 المساهمة

المساهمات مرحب بها! لا تتردد في إرسال Pull Request.

---

<div align="center">
  <p>صُنع بـ ❤️ للمتقدمين الجزائريين للحصول على التأشيرات</p>
  <p>Built with ❤️ for Algerian visa applicants</p>
</div>
