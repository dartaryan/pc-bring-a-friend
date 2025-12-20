/**
 * PassportCard Refer - Mock Positions
 * Sample position data with departments, locations, bonuses, and campaigns
 */

/* ============================================================================
   MOCK DATA - Positions (Story 4.1)
   ============================================================================
   Sample position data with departments, locations, bonuses, and campaigns
   ========================================================================== */

export const MOCK_POSITIONS = [
  {
    id: 'pos-001',
    title: 'מפתח/ת Full Stack',
    titleEn: 'Full Stack Developer',
    department: 'פיתוח',
    departmentEn: 'Development',
    location: 'תל אביב',
    type: 'full-time',
    description: 'אנחנו מחפשים מפתח/ת Full Stack מנוסה להצטרף לצוות הפיתוח שלנו. עבודה עם טכנולוגיות מתקדמות בסביבה דינמית.',
    requirements: [
      '3+ שנות ניסיון בפיתוח Full Stack',
      'ידע ב-JavaScript, React, Node.js',
      'ניסיון עם מסדי נתונים SQL ו-NoSQL',
      'יכולת עבודה בצוות ותקשורת מעולה'
    ],
    bonus: 500,
    isHot: true,
    campaign: null,
    postedDate: '2025-12-01'
  },
  {
    id: 'pos-002',
    title: 'מעצב/ת UX/UI',
    titleEn: 'UX/UI Designer',
    department: 'מוצר',
    departmentEn: 'Product',
    location: 'תל אביב',
    type: 'full-time',
    description: 'מחפשים מעצב/ת UX/UI יצירתי/ת עם חשיבה ממוקדת משתמש. הזדמנות להשפיע על מוצרים שמשרתים אלפי משתמשים.',
    requirements: [
      '2+ שנות ניסיון בעיצוב UX/UI',
      'שליטה ב-Figma',
      'הבנה של עקרונות עיצוב ונגישות',
      'פורטפוליו מרשים'
    ],
    bonus: 500,
    isHot: false,
    campaign: {
      id: 'camp-001',
      name: 'קמפיין מעצבים',
      multiplier: 2,
      endDate: '2025-12-31'
    },
    postedDate: '2025-12-05'
  },
  {
    id: 'pos-003',
    title: 'מנהל/ת שיווק דיגיטלי',
    titleEn: 'Digital Marketing Manager',
    department: 'שיווק',
    departmentEn: 'Marketing',
    location: 'רמת גן',
    type: 'full-time',
    description: 'אנחנו מחפשים מנהל/ת שיווק דיגיטלי להוביל את הפעילות השיווקית שלנו. תפקיד אסטרטגי עם השפעה רחבה.',
    requirements: [
      '4+ שנות ניסיון בשיווק דיגיטלי',
      'ניסיון עם Google Ads, Facebook Ads',
      'ניתוח נתונים ואופטימיזציה',
      'אנגלית ברמה גבוהה'
    ],
    bonus: 500,
    isHot: true,
    campaign: null,
    postedDate: '2025-12-03'
  },
  {
    id: 'pos-004',
    title: 'אנליסט/ית נתונים',
    titleEn: 'Data Analyst',
    department: 'כספים',
    departmentEn: 'Finance',
    location: 'תל אביב',
    type: 'full-time',
    description: 'הצטרפו לצוות הכספים שלנו כאנליסט/ית נתונים. תפקיד מרכזי בקבלת החלטות מבוססות נתונים.',
    requirements: [
      '2+ שנות ניסיון באנליזה',
      'שליטה ב-Excel, SQL',
      'ניסיון עם כלי BI',
      'יכולת הצגה והסברה'
    ],
    bonus: 450,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-07'
  },
  {
    id: 'pos-005',
    title: 'מגייס/ת טכנולוגי/ת',
    titleEn: 'Tech Recruiter',
    department: 'HR',
    departmentEn: 'HR',
    location: 'תל אביב',
    type: 'full-time',
    description: 'מחפשים מגייס/ת עם רקע טכנולוגי להצטרף לצוות ה-HR. תפקיד מגוון עם אפשרויות התפתחות.',
    requirements: [
      '2+ שנות ניסיון בגיוס',
      'הבנה בסיסית בטכנולוגיה',
      'יחסי אנוש מעולים',
      'יצירתיות בחיפוש מועמדים'
    ],
    bonus: 400,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-08'
  },
  {
    id: 'pos-006',
    title: 'מפתח/ת Backend',
    titleEn: 'Backend Developer',
    department: 'פיתוח',
    departmentEn: 'Development',
    location: 'תל אביב',
    type: 'full-time',
    description: 'מחפשים מפתח/ת Backend להצטרף לצוות. עבודה עם מערכות בקנה מידה גדול.',
    requirements: [
      '3+ שנות ניסיון בפיתוח Backend',
      'ידע ב-Node.js או Python',
      'ניסיון עם AWS/GCP',
      'הבנה של ארכיטקטורת מיקרו-סרביסים'
    ],
    bonus: 500,
    isHot: true,
    campaign: null,
    postedDate: '2025-12-02'
  },
  {
    id: 'pos-007',
    title: 'מנהל/ת מוצר',
    titleEn: 'Product Manager',
    department: 'מוצר',
    departmentEn: 'Product',
    location: 'רמת גן',
    type: 'full-time',
    description: 'מחפשים PM מנוסה להוביל מוצרים מאפס עד להשקה. תפקיד עם השפעה משמעותית.',
    requirements: [
      '3+ שנות ניסיון כ-PM',
      'רקע טכני - יתרון',
      'יכולת ניתוח שוק ומתחרים',
      'ניסיון בעבודה Agile'
    ],
    bonus: 550,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-04'
  },
  {
    id: 'pos-008',
    title: 'נציג/ת שירות לקוחות',
    titleEn: 'Customer Service Representative',
    department: 'שירות',
    departmentEn: 'Service',
    location: 'תל אביב',
    type: 'part-time',
    description: 'הצטרפו לצוות שירות הלקוחות שלנו. משרה חלקית עם גמישות בשעות.',
    requirements: [
      'ניסיון בשירות לקוחות - יתרון',
      'סבלנות ויכולת הקשבה',
      'יכולת עבודה בצוות',
      'זמינות למשמרות'
    ],
    bonus: 300,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-09'
  },
  {
    id: 'pos-009',
    title: 'מהנדס/ת DevOps',
    titleEn: 'DevOps Engineer',
    department: 'פיתוח',
    departmentEn: 'Development',
    location: 'תל אביב',
    type: 'full-time',
    description: 'מחפשים מהנדס/ת DevOps לשיפור תהליכי הפיתוח וההטמעה שלנו.',
    requirements: [
      '3+ שנות ניסיון ב-DevOps',
      'ניסיון עם Kubernetes, Docker',
      'ידע ב-CI/CD pipelines',
      'ניסיון עם תשתיות ענן'
    ],
    bonus: 500,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-06'
  },
  {
    id: 'pos-010',
    title: 'מנהל/ת פיננסי',
    titleEn: 'Finance Manager',
    department: 'כספים',
    departmentEn: 'Finance',
    location: 'רמת גן',
    type: 'full-time',
    description: 'תפקיד ניהולי בכיר במחלקת הכספים. אחריות על תכנון וניהול תקציב.',
    requirements: [
      '5+ שנות ניסיון בכספים',
      'רו״ח - יתרון',
      'ניסיון ניהולי',
      'שליטה ב-Excel מתקדם'
    ],
    bonus: 600,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-01'
  },
  {
    id: 'pos-011',
    title: 'מפתח/ת Frontend',
    titleEn: 'Frontend Developer',
    department: 'פיתוח',
    departmentEn: 'Development',
    location: 'חיפה',
    type: 'full-time',
    description: 'מחפשים מפתח/ת Frontend מנוסה עם אהבה לחוויית משתמש מעולה. הזדמנות לעבוד על מוצרים חדשניים.',
    requirements: [
      '3+ שנות ניסיון בפיתוח Frontend',
      'שליטה ב-React/Vue/Angular',
      'ניסיון עם TypeScript',
      'הבנה של עקרונות UX ונגישות'
    ],
    bonus: 500,
    isHot: false,
    campaign: {
      id: 'camp-001',
      name: 'מבצע גיוס מפתחים',
      multiplier: 2,
      endDate: '2025-12-31'
    },
    postedDate: '2025-12-10'
  },
  {
    id: 'pos-012',
    title: 'מנהל/ת מדיה חברתית',
    titleEn: 'Social Media Manager',
    department: 'שיווק',
    departmentEn: 'Marketing',
    location: 'באר שבע',
    type: 'full-time',
    description: 'הובלת הנוכחות שלנו ברשתות החברתיות. יצירת תוכן מעניין ובניית קהילה.',
    requirements: [
      '2+ שנות ניסיון בניהול מדיה חברתית',
      'יצירתיות וכתיבה מעולה',
      'ניסיון עם כלי ניתוח וניהול',
      'הבנה של טרנדים בדיגיטל'
    ],
    bonus: 400,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-09'
  }
];
