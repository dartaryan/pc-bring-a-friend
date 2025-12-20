/**
 * PassportCard Refer - Stamp Types
 * Configuration for all 8 stamp types with colors, shapes, icons, and points
 */

/* ============================================================================
   STAMP TYPES (Story 3.4)
   ============================================================================
   Configuration for all 8 stamp types with colors, shapes, icons, and points
   ========================================================================== */

export const STAMP_TYPES = {
  submitted: {
    id: 'submitted',
    label: 'קו״ח הוגש',
    labelEn: 'Resume Submitted',
    icon: 'file-text',
    color: '#0984E3',
    shape: 'circle',
    points: 50,
    description: 'הגשת קורות חיים של מועמד פוטנציאלי. צעד ראשון חשוב בתהליך ההפניה!'
  },
  interview: {
    id: 'interview',
    label: 'ראיון נקבע',
    labelEn: 'Interview Scheduled',
    icon: 'calendar-event',
    color: '#F39C12',
    shape: 'rectangle',
    points: 100,
    description: 'המועמד שהפנית התקדם לשלב הראיון. סימן מצוין לאיכות ההפניה!'
  },
  hired: {
    id: 'hired',
    label: 'גיוס מוצלח!',
    labelEn: 'Candidate Hired',
    icon: 'check',
    color: '#00B894',
    shape: 'star',
    points: 500,
    description: 'מזל טוב! המועמד שהפנית התקבל לעבודה. הפניה מוצלחת במיוחד!'
  },
  milestone3m: {
    id: 'milestone3m',
    label: '3 חודשים',
    labelEn: '3-Month Milestone',
    icon: 'medal',
    color: '#95A5A6',
    shape: 'badge',
    points: 200,
    description: 'המועמד שהפנית השלים 3 חודשי עבודה בחברה. בונוס על הפניה איכותית!'
  },
  milestone6m: {
    id: 'milestone6m',
    label: '6 חודשים',
    labelEn: '6-Month Milestone',
    icon: 'trophy',
    color: '#F1C40F',
    shape: 'badge',
    points: 400,
    description: 'המועמד שהפנית השלים חצי שנה! זו הפניה מושלמת שבונה את הצוות.'
  },
  campaign: {
    id: 'campaign',
    label: 'קמפיין מיוחד',
    labelEn: 'Special Campaign',
    icon: 'bolt',
    color: '#6C5CE7',
    shape: 'diamond',
    points: 75,
    description: 'הפנית במסגרת קמפיין מיוחד והרווחת בונוס נוסף!'
  },
  streak: {
    id: 'streak',
    label: 'רצף הפניות',
    labelEn: 'Referral Streak',
    icon: 'flame',
    color: '#E10514',
    shape: 'flame',
    points: 75,
    description: 'הפנית 3 מועמדים או יותר ברצף! הלהבה שלך בוערת!'
  },
  first: {
    id: 'first',
    label: 'הפניה ראשונה',
    labelEn: 'First Referral',
    icon: 'heart',
    color: '#FD79A8',
    shape: 'heart',
    points: 100,
    description: 'ההפניה הראשונה שלך! תודה שאתה משתתף בתוכנית ההפניות!'
  }
};
