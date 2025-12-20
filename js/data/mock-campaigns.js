/**
 * PassportCard Refer - Mock Campaigns
 * Active campaigns with bonus multipliers, eligibility, and countdown data
 */

/* ============================================================================
   MOCK DATA - Campaigns (Story 5.4)
   ============================================================================
   Active campaigns with bonus multipliers, eligibility, and countdown data
   ========================================================================== */

export const MOCK_CAMPAIGNS = [
  {
    id: 'camp-001',
    title: 'מבצע גיוס מפתחים',
    description: 'נקודות כפולות על הפניות למשרות פיתוח!',
    multiplier: 2,
    icon: '💻',
    startDate: '2025-12-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    eligibleDepartments: ['פיתוח', 'DevOps', 'QA'],
    eligiblePositionIds: [],
    accentColor: '#6C5CE7',
    isActive: true
  },
  {
    id: 'camp-002',
    title: 'שבוע HR מיוחד',
    description: 'בונוס 1.5 על כל הפניה למשאבי אנוש',
    multiplier: 1.5,
    icon: 'users',
    startDate: '2025-12-08T00:00:00Z',
    endDate: '2025-12-15T23:59:59Z',
    eligibleDepartments: ['HR', 'משאבי אנוש'],
    eligiblePositionIds: [],
    accentColor: '#00B894',
    isActive: true
  },
  {
    id: 'camp-003',
    title: 'מרתון הפניות סוף שנה',
    description: 'כל הפניה שווה x1.5 נקודות! זמן מוגבל',
    multiplier: 1.5,
    icon: '🏃',
    startDate: '2025-12-24T00:00:00Z',
    endDate: '2025-12-26T23:59:59Z',
    eligibleDepartments: [],
    eligiblePositionIds: [],
    accentColor: '#E10514',
    isActive: true
  }
];
