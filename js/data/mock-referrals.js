/**
 * PassportCard Refer - Mock Referrals
 * Sample referral data for demo purposes
 */

/* ============================================================================
   MOCK DATA - Referrals (Story 5.1)
   ============================================================================
   Sample referral data for demo purposes
   ========================================================================== */

export const MOCK_REFERRALS = [
  {
    id: 'ref-001',
    candidateName: 'דנה לוי',
    candidateEmail: 'dana.levi@email.com',
    candidatePhone: '050-1234567',
    relationship: 'חבר/ה קרוב/ה',
    positionId: 'pos-001',
    positionTitle: 'מפתח/ת Full Stack',
    positionDepartment: 'פיתוח',
    status: 'interview',
    submittedAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-08T14:30:00Z',
    timeline: [
      { status: 'submitted', date: '2025-12-01', points: 50 },
      { status: 'review', date: '2025-12-03', points: 0 },
      { status: 'interview', date: '2025-12-08', points: 100 }
    ],
    pointsEarned: 150,
    potentialPoints: 500
  },
  {
    id: 'ref-002',
    candidateName: 'יוסי כהן',
    candidateEmail: 'yossi.cohen@email.com',
    candidatePhone: '052-9876543',
    relationship: 'קולגה מעבודה קודמת',
    positionId: 'pos-003',
    positionTitle: 'מנהל/ת מוצר',
    positionDepartment: 'מוצר',
    status: 'hired',
    submittedAt: '2025-11-15T09:00:00Z',
    updatedAt: '2025-12-05T16:00:00Z',
    timeline: [
      { status: 'submitted', date: '2025-11-15', points: 50 },
      { status: 'review', date: '2025-11-18', points: 0 },
      { status: 'interview', date: '2025-11-25', points: 100 },
      { status: 'offer', date: '2025-12-01', points: 0 },
      { status: 'hired', date: '2025-12-05', points: 500 }
    ],
    pointsEarned: 650,
    potentialPoints: 0,
    milestones: {
      threeMonth: '2026-03-05',
      sixMonth: '2026-06-05'
    }
  },
  {
    id: 'ref-003',
    candidateName: 'מיכל אברהם',
    candidateEmail: 'michal.a@email.com',
    candidatePhone: '054-5551234',
    relationship: 'מכר/ה מקצועי/ת',
    positionId: 'pos-002',
    positionTitle: 'מעצב/ת UX/UI',
    positionDepartment: 'עיצוב',
    status: 'submitted',
    submittedAt: '2025-12-09T11:30:00Z',
    updatedAt: '2025-12-09T11:30:00Z',
    timeline: [
      { status: 'submitted', date: '2025-12-09', points: 50 }
    ],
    pointsEarned: 50,
    potentialPoints: 600
  },
  {
    id: 'ref-004',
    candidateName: 'אלי ישראלי',
    candidateEmail: 'eli.israeli@email.com',
    candidatePhone: '050-7778899',
    relationship: 'אחר',
    positionId: 'pos-004',
    positionTitle: 'מנתח/ת נתונים',
    positionDepartment: 'BI',
    status: 'rejected',
    submittedAt: '2025-11-20T14:00:00Z',
    updatedAt: '2025-11-28T10:00:00Z',
    timeline: [
      { status: 'submitted', date: '2025-11-20', points: 50 },
      { status: 'review', date: '2025-11-22', points: 0 },
      { status: 'rejected', date: '2025-11-28', points: 0 }
    ],
    pointsEarned: 50,
    potentialPoints: 0,
    rejectionReason: 'לא עמד בדרישות הניסיון הטכני'
  },
  {
    id: 'ref-005',
    candidateName: 'רחל גולדברג',
    candidateEmail: 'rachel.g@email.com',
    candidatePhone: '053-1112233',
    relationship: 'חבר/ה קרוב/ה',
    positionId: 'pos-005',
    positionTitle: 'מנהל/ת שיווק דיגיטלי',
    positionDepartment: 'שיווק',
    status: 'review',
    submittedAt: '2025-12-07T08:00:00Z',
    updatedAt: '2025-12-09T09:00:00Z',
    timeline: [
      { status: 'submitted', date: '2025-12-07', points: 50 },
      { status: 'review', date: '2025-12-09', points: 0 }
    ],
    pointsEarned: 50,
    potentialPoints: 600
  },
  {
    id: 'ref-006',
    candidateName: 'עמית שרון',
    candidateEmail: 'amit.sharon@email.com',
    candidatePhone: '058-4445566',
    relationship: 'קולגה מעבודה קודמת',
    positionId: 'pos-001',
    positionTitle: 'מפתח/ת Full Stack',
    positionDepartment: 'פיתוח',
    status: 'offer',
    submittedAt: '2025-11-10T13:00:00Z',
    updatedAt: '2025-12-08T11:00:00Z',
    timeline: [
      { status: 'submitted', date: '2025-11-10', points: 50 },
      { status: 'review', date: '2025-11-12', points: 0 },
      { status: 'interview', date: '2025-11-20', points: 100 },
      { status: 'offer', date: '2025-12-08', points: 0 }
    ],
    pointsEarned: 150,
    potentialPoints: 500
  }
];
