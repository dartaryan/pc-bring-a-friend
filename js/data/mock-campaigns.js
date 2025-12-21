/**
 * PassportCard Refer - Mock Campaigns
 * Active campaigns with bonus multipliers, eligibility, and countdown data
 */

/* ============================================================================
   MOCK DATA - Campaigns (Story 5.4)
   ============================================================================
   Active campaigns with bonus multipliers, eligibility, and countdown data
   
   Campaign dates updated for demo on Dec 21-24, 2025
   ========================================================================== */

export const MOCK_CAMPAIGNS = [
  {
    id: 'camp-001',
    title: 'מבצע גיוס מפתחים',
    description: 'נקודות כפולות על הפניות למשרות פיתוח!',
    multiplier: 2,
    icon: '💻',
    startDate: '2025-12-15T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    eligibleDepartments: ['פיתוח', 'DevOps', 'QA'],
    eligiblePositionIds: [],
    accentColor: '#6C5CE7',
    isActive: true
  },
  {
    id: 'camp-002',
    title: 'בונוס סיום שנה',
    description: 'הפניה מוצלחת = x2.5 נקודות! מבצע מיוחד',
    multiplier: 2.5,
    icon: '🎁',
    startDate: '2025-12-20T00:00:00Z',
    endDate: '2025-12-28T23:59:59Z',
    eligibleDepartments: [],
    eligiblePositionIds: [],
    accentColor: '#00B894',
    isActive: true
  },
  {
    id: 'camp-003',
    title: 'מרתון הפניות חג',
    description: 'כל הפניה שווה x1.5 נקודות! זמן מוגבל מאוד',
    multiplier: 1.5,
    icon: '🏃',
    startDate: '2025-12-22T00:00:00Z',
    endDate: '2025-12-25T23:59:59Z',
    eligibleDepartments: [],
    eligiblePositionIds: [],
    accentColor: '#E10514',
    isActive: true
  },
  {
    id: 'camp-004',
    title: 'Flash! הפניות הייטק',
    description: 'בונוס מיוחד על משרות טכנולוגיה - 48 שעות בלבד!',
    multiplier: 3,
    icon: '⚡',
    startDate: '2025-12-21T00:00:00Z',
    endDate: '2025-12-23T23:59:59Z',
    eligibleDepartments: ['פיתוח', 'DevOps', 'Data', 'Product'],
    eligiblePositionIds: [],
    accentColor: '#F39C12',
    isActive: true
  },
  {
    id: 'camp-005',
    title: 'שבוע שירות לקוחות',
    description: 'נקודות כפולות על הפניות לשירות ותפעול',
    multiplier: 2,
    icon: '📞',
    startDate: '2025-12-21T00:00:00Z',
    endDate: '2025-12-27T23:59:59Z',
    eligibleDepartments: ['שירות לקוחות', 'תפעול', 'תמיכה'],
    eligiblePositionIds: [],
    accentColor: '#0984E3',
    isActive: true
  },
  {
    id: 'camp-006',
    title: 'New Year Special',
    description: 'קמפיין סילבסטר! הכפילו את הנקודות שלכם',
    multiplier: 2,
    icon: '🎉',
    startDate: '2025-12-29T00:00:00Z',
    endDate: '2026-01-02T23:59:59Z',
    eligibleDepartments: [],
    eligiblePositionIds: [],
    accentColor: '#9B59B6',
    isActive: true
  }
];
