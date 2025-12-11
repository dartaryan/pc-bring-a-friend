/* ============================================================================
   PassportCard Refer - Core Application Architecture
   ============================================================================
   A three-file architecture: index.html | style.css | script.js
   RTL-first Hebrew application
   ========================================================================== */

'use strict';

/* ============================================================================
   ERROR HANDLING - Story 6.5 AC7
   ============================================================================
   Global error handlers to prevent console errors and app crashes
   ========================================================================== */

/**
 * Global error handler - prevents uncaught errors from crashing the app
 * @param {string} msg - Error message
 * @param {string} url - Script URL where error occurred
 * @param {number} lineNo - Line number
 * @param {number} columnNo - Column number
 * @param {Error} error - Error object
 * @returns {boolean} True to prevent default error handling
 */
window.onerror = function(msg, url, lineNo, columnNo, error) {
  // Log for debugging but don't expose to user
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('App handled error:', { 
      message: msg, 
      url: url, 
      line: lineNo, 
      column: columnNo,
      stack: error?.stack 
    });
  }
  
  // Check for critical errors that require recovery
  if (msg && (msg.includes('localStorage') || msg.includes('QuotaExceeded'))) {
    // Storage error - clear old data
    try {
      localStorage.removeItem('passportcard_refer_state');
    } catch (e) { /* ignore */ }
  }
  
  // Prevent default error handling (no console error shown)
  return true;
};

/**
 * Unhandled Promise rejection handler
 * @param {PromiseRejectionEvent} event - Rejection event
 */
window.onunhandledrejection = function(event) {
  // Log for debugging
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('Unhandled promise rejection:', event.reason);
  }
  
  // Prevent default handling
  event.preventDefault();
};

/**
 * Safe localStorage wrapper with quota handling (Story 6.5 AC7)
 * Handles QuotaExceededError by clearing old data
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} True if successful
 */
function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      // Clear old data and retry
      try {
        // Remove old entries to make space
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k !== key && k.startsWith('passportcard_')) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        
        // Retry storage
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e2) {
        console.warn('Storage quota exceeded, using session only');
        return false;
      }
    }
    console.warn('Storage error:', e);
    return false;
  }
}

/**
 * Safe localStorage retrieval with corruption recovery (Story 6.5 AC7)
 * @param {string} key - Storage key
 * @returns {*} Parsed value or null
 */
function safeGetStorage(key) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate it's an object
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('State corrupted, clearing:', e);
    try {
      localStorage.removeItem(key);
    } catch (removeError) { /* ignore */ }
  }
  return null;
}

/* ============================================================================
   ICON UTILITY - Story 7.8
   ============================================================================
   Consistent icon rendering using Tabler Icons
   ========================================================================== */

/**
 * Renders a Tabler icon element consistently across the application
 * @param {string} iconName - Tabler icon name (without 'ti-' prefix)
 * @param {Object} options - Optional configuration
 * @param {string} options.className - Additional CSS classes
 * @param {string} options.ariaLabel - Accessible label for meaningful icons
 * @param {boolean} options.ariaHidden - Whether icon is decorative (default: true)
 * @param {string} options.size - Size class: 'sm', 'md', 'lg', 'xl'
 * @returns {string} HTML string for the icon element
 */
function renderIcon(iconName, options = {}) {
  const { 
    className = '', 
    ariaLabel = '', 
    ariaHidden = true,
    size = ''
  } = options;
  
  const sizeClass = size ? `icon--${size}` : '';
  const classes = ['ti', `ti-${iconName}`, sizeClass, className]
    .filter(Boolean)
    .join(' ');
  
  const ariaAttr = ariaHidden 
    ? 'aria-hidden="true"' 
    : `aria-label="${ariaLabel}" role="img"`;
  
  return `<i class="${classes}" ${ariaAttr}></i>`;
}

/**
 * CSS celebration fallback when confetti library fails (Story 6.5 AC7)
 * Creates floating icon particles using pure CSS animations
 */
function showCSSCelebration() {
  const container = document.createElement('div');
  container.className = 'css-celebration';
  container.setAttribute('aria-hidden', 'true');
  
  // Use Tabler icons instead of emojis for consistent cross-browser rendering
  const celebrationIcons = ['confetti', 'star-filled', 'sparkles', 'stars', 'meteor', 'party-popper'];
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'css-celebration__particle';
    const iconName = celebrationIcons[Math.floor(Math.random() * celebrationIcons.length)];
    particle.innerHTML = `<i class="ti ti-${iconName}"></i>`;
    particle.style.setProperty('--x', `${Math.random() * 100}vw`);
    particle.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    particle.style.setProperty('--duration', `${1 + Math.random() * 1}s`);
    container.appendChild(particle);
  }
  
  document.body.appendChild(container);
  
  // Remove after animation
  setTimeout(() => {
    container.remove();
  }, 3000);
}

/**
 * Safe confetti wrapper with fallback (Story 6.5 AC7)
 * Falls back to CSS animation if confetti library fails
 * @param {Object} options - Confetti options
 */
function safeCelebrate(options = {}) {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show static celebration for accessibility
    const toast = document.createElement('div');
    toast.className = 'celebration-toast';
    toast.innerHTML = `${renderIcon('confetti')} מזל טוב!`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
    return;
  }
  
  // Try confetti library
  if (typeof confetti !== 'undefined') {
    try {
      confetti({
        particleCount: options.particleCount || 100,
        spread: options.spread || 70,
        origin: options.origin || { y: 0.6 },
        colors: options.colors || ['#E10514', '#F1C40F', '#22C55E', '#0984E3', '#6C5CE7'],
        ...options
      });
      return;
    } catch (e) {
      console.warn('Confetti failed, using fallback:', e);
    }
  }
  
  // Fallback to CSS celebration
  showCSSCelebration();
}

/**
 * Development QA helper - validates app state (Story 6.5)
 * Can be called from console: runQACheck()
 * @returns {Object} Results with passed and failed checks
 */
function runQACheck() {
  const results = {
    passed: [],
    failed: [],
    timestamp: new Date().toISOString()
  };
  
  // Check 1: State manager exists
  if (typeof stateManager !== 'undefined') {
    results.passed.push('StateManager exists');
  } else {
    results.failed.push('StateManager not found');
  }
  
  // Check 2: Router exists
  if (typeof router !== 'undefined') {
    results.passed.push('Router exists');
  } else {
    results.failed.push('Router not found');
  }
  
  // Check 3: All routes are valid
  const routes = ['auth', 'dashboard', 'passport', 'positions', 'referrals', 'settings'];
  routes.forEach(route => {
    if (CONFIG.ROUTES[route]) {
      results.passed.push(`Route "${route}" defined`);
    } else {
      results.failed.push(`Route "${route}" missing`);
    }
  });
  
  // Check 4: Mock data exists
  if (MOCK_POSITIONS && MOCK_POSITIONS.length >= 8) {
    results.passed.push(`MOCK_POSITIONS has ${MOCK_POSITIONS.length} items`);
  } else {
    results.failed.push('MOCK_POSITIONS missing or insufficient');
  }
  
  if (MOCK_CAMPAIGNS && MOCK_CAMPAIGNS.length >= 1) {
    results.passed.push(`MOCK_CAMPAIGNS has ${MOCK_CAMPAIGNS.length} items`);
  } else {
    results.failed.push('MOCK_CAMPAIGNS missing');
  }
  
  // Check 5: Stamp types defined
  if (STAMP_TYPES && Object.keys(STAMP_TYPES).length >= 8) {
    results.passed.push(`STAMP_TYPES has ${Object.keys(STAMP_TYPES).length} types`);
  } else {
    results.failed.push('STAMP_TYPES missing or incomplete');
  }
  
  // Check 6: User generation works
  try {
    const testUser = generateUserFromEmail('test.user@passportcard.co.il');
    if (testUser && testUser.firstName && testUser.stamps && testUser.referrals) {
      results.passed.push('User generation works');
    } else {
      results.failed.push('User generation incomplete');
    }
  } catch (e) {
    results.failed.push(`User generation error: ${e.message}`);
  }
  
  // Report to console
  console.group('🧪 QA Check Results');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.warn('Failures:', results.failed);
  }
  console.groupEnd();
  
  return results;
}

// Expose QA helper globally for console access
window.runQACheck = runQACheck;

/* ============================================================================
   CONFIGURATION
   ========================================================================== */

const CONFIG = {
  // Demo OTP code for authentication
  OTP_CODE: '000000',
  
  // PassportCard logo assets (Story 7.2)
  LOGOS: {
    // Standard logo for light backgrounds
    STANDARD: 'https://www.passportcard.co.il/wp-content/uploads/2023/07/logo.svg',
    // White logo for dark/red backgrounds
    WHITE: 'https://www.passportcard.co.il/wp-content/uploads/2023/07/logo-m.svg'
  },
  
  // Application routes with page mapping for multi-page architecture
  ROUTES: {
    auth: { component: 'LoginComponent', requiresAuth: false, page: 'login' },
    dashboard: { component: 'DashboardComponent', requiresAuth: true, page: 'dashboard' },
    passport: { component: 'PassportComponent', requiresAuth: true, page: 'passport' },
    positions: { component: 'PositionsComponent', requiresAuth: true, page: 'positions' },
    refer: { component: 'ReferralFormComponent', requiresAuth: true, page: 'positions' },
    'referral-confirmation': { component: 'ReferralConfirmationComponent', requiresAuth: true, page: 'positions' },
    referrals: { component: 'ReferralsComponent', requiresAuth: true, page: 'referrals' },
    settings: { component: 'SettingsComponent', requiresAuth: true, page: 'settings' }
  },
  
  // Page to default route mapping (for multi-page navigation)
  PAGE_ROUTES: {
    'login': 'auth',
    'dashboard': 'dashboard',
    'passport': 'passport',
    'positions': 'positions',
    'referrals': 'referrals',
    'settings': 'settings',
    'index': 'auth'  // Entry point defaults to auth
  },
  
  // Default route for unauthenticated users
  DEFAULT_ROUTE: 'auth',
  
  // Default route for authenticated users
  AUTH_DEFAULT_ROUTE: 'dashboard',
  
  // Points values for gamification
  POINTS: {
    REFERRAL_SUBMITTED: 50,
    REFERRAL_INTERVIEWED: 100,
    REFERRAL_HIRED: 500,
    CAMPAIGN_BONUS: 200
  },
  
  // LocalStorage key for state persistence
  STORAGE_KEY: 'passportcard_refer_state',
  
  // Keys to persist in LocalStorage
  PERSIST_KEYS: ['isAuthenticated', 'currentUser', 'referrals', 'stamps', 'sessionToken', 'activities']
};

/* ============================================================================
   ACTIVITY TYPES
   ========================================================================== */

const ACTIVITY_TYPES = {
  REFERRAL_SUBMITTED: 'referral_submitted',
  STATUS_CHANGE: 'status_change',
  STAMP_EARNED: 'stamp_earned',
  POINTS_EARNED: 'points_earned',
  MILESTONE_REACHED: 'milestone_reached'
};

/* ============================================================================
   STAMP TYPES (Story 3.4)
   ============================================================================
   Configuration for all 8 stamp types with colors, shapes, icons, and points
   ========================================================================== */

const STAMP_TYPES = {
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

/* ============================================================================
   REFERRAL STATUS CONFIGURATION (Story 5.1)
   ============================================================================
   Full status configuration for referral filtering and display
   ========================================================================== */

const REFERRAL_STATUS_CONFIG = {
  submitted: { 
    hebrew: 'הוגש', 
    icon: 'mail', 
    color: '#0984E3',
    filterGroup: 'in-progress'
  },
  review: { 
    hebrew: 'בבדיקה', 
    icon: 'eye', 
    color: '#F39C12',
    filterGroup: 'in-progress'
  },
  interview: { 
    hebrew: 'בראיון', 
    icon: 'phone-call', 
    color: '#6C5CE7',
    filterGroup: 'in-progress'
  },
  offer: { 
    hebrew: 'הצעה', 
    icon: 'file-description', 
    color: '#00B894',
    filterGroup: 'in-progress'
  },
  hired: { 
    hebrew: 'גויס!', 
    icon: 'confetti', 
    color: '#22C55E',
    filterGroup: 'hired'
  },
  rejected: { 
    hebrew: 'לא נבחר', 
    icon: 'x', 
    color: '#95A5A6',
    filterGroup: 'rejected'
  }
};

/* ============================================================================
   CONSTANTS - Pipeline Stages (Story 5.2)
   ============================================================================
   Configuration for the visual pipeline showing referral progress
   ========================================================================== */

const PIPELINE_STAGES = [
  { 
    key: 'submitted', 
    label: 'הוגש',
    labelShort: 'הוגש',
    icon: 'ti-send'
  },
  { 
    key: 'review', 
    label: 'בדיקה',
    labelShort: 'בדיקה',
    icon: 'ti-eye'
  },
  { 
    key: 'interview', 
    label: 'ראיון',
    labelShort: 'ראיון',
    icon: 'ti-phone'
  },
  { 
    key: 'offer', 
    label: 'הצעה',
    labelShort: 'הצעה',
    icon: 'ti-file-text'
  },
  { 
    key: 'hired', 
    label: 'גיוס',
    labelShort: 'גויס',
    icon: 'ti-confetti'
  }
];

// Stage index lookup for quick access
const STAGE_INDEX = PIPELINE_STAGES.reduce((acc, stage, index) => {
  acc[stage.key] = index;
  return acc;
}, {});

/* ============================================================================
   MOCK DATA - Referrals (Story 5.1)
   ============================================================================
   Sample referral data for demo purposes
   ========================================================================== */

const MOCK_REFERRALS = [
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

/* ============================================================================
   MOCK DATA - Positions (Story 4.1)
   ============================================================================
   Sample position data with departments, locations, bonuses, and campaigns
   ========================================================================== */

const MOCK_POSITIONS = [
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

/* ============================================================================
   MOCK DATA - Campaigns (Story 5.4)
   ============================================================================
   Active campaigns with bonus multipliers, eligibility, and countdown data
   ========================================================================== */

const MOCK_CAMPAIGNS = [
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

/* ============================================================================
   STATE MANAGER
   ============================================================================
   Centralized state management with pub/sub pattern and localStorage persistence
   ========================================================================== */

class StateManager {
  constructor() {
    this._state = this._getInitialState();
    this._listeners = new Map();
    this._loadState();
  }
  
  /**
   * Returns the initial state structure
   * @returns {Object} Initial state object
   */
  _getInitialState() {
    return {
      // Authentication (persisted)
      isAuthenticated: false,
      currentUser: null,
      sessionToken: null,
      
      // Navigation (not persisted)
      currentView: 'auth',
      previousView: null,
      
      // UI State (not persisted)
      isLoading: false,
      activeModal: null,
      toasts: [],
      
      // Data (persisted)
      positions: [],
      referrals: [],
      stamps: [],
      activities: [],
      
      // Filters (not persisted)
      positionFilters: {
        department: 'all',
        location: 'all',
        search: ''
      },
      
      // Referral list state (Story 5.1)
      referralFilter: 'all',
      selectedReferral: null
    };
  }
  
  /**
   * Gets state value(s)
   * @param {string} [key] - Specific key to retrieve, or undefined for full state
   * @returns {*} The state value(s)
   */
  getState(key) {
    if (key === undefined) {
      return { ...this._state };
    }
    
    // Support dot notation for nested keys
    if (key.includes('.')) {
      return key.split('.').reduce((obj, k) => obj?.[k], this._state);
    }
    
    return this._state[key];
  }
  
  /**
   * Updates state and notifies listeners
   * @param {Object} updates - Key-value pairs to update
   */
  setState(updates) {
    const previousState = { ...this._state };
    
    // Merge updates into state
    Object.keys(updates).forEach(key => {
      const value = updates[key];
      // Only deep merge plain objects (not class instances, arrays, or null)
      const isPlainObject = value !== null && 
                            typeof value === 'object' && 
                            !Array.isArray(value) && 
                            value.constructor === Object;
      
      if (isPlainObject && this._state[key] && typeof this._state[key] === 'object') {
        // Deep merge for plain objects only
        this._state[key] = { ...this._state[key], ...value };
      } else {
        // Direct assignment for primitives, arrays, null, and class instances
        this._state[key] = value;
      }
    });
    
    // Notify listeners for changed keys
    Object.keys(updates).forEach(key => {
      if (this._listeners.has(key)) {
        const callbacks = this._listeners.get(key);
        callbacks.forEach(callback => {
          try {
            callback(this._state[key], previousState[key]);
          } catch (error) {
            console.error(`StateManager: Error in listener for "${key}"`, error);
          }
        });
      }
    });
    
    // Notify wildcard listeners
    if (this._listeners.has('*')) {
      this._listeners.get('*').forEach(callback => {
        try {
          callback(this._state, previousState);
        } catch (error) {
          console.error('StateManager: Error in wildcard listener', error);
        }
      });
    }
    
    // Persist relevant keys
    this.persistState();
  }
  
  /**
   * Subscribes to state changes
   * @param {string} key - State key to watch (or '*' for all changes)
   * @param {Function} callback - Called with (newValue, oldValue)
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    
    this._listeners.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this._listeners.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this._listeners.delete(key);
        }
      }
    };
  }
  
  /**
   * Persists specified state keys to localStorage (debounced for performance)
   * Uses lazy initialization since debounce is defined later in the file
   */
  persistState() {
    // Lazy initialize debounced persist function
    if (!this._debouncedPersist) {
      this._debouncedPersist = this._createDebouncedPersist();
    }
    this._debouncedPersist();
  }
  
  /**
   * Creates debounced persist function (100ms debounce for batching rapid updates)
   * @private
   */
  _createDebouncedPersist() {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this._persistStateImmediate();
      }, 100);
    };
  }
  
  /**
   * Immediately persists state to localStorage (called by debounced function)
   * @private
   */
  _persistStateImmediate() {
    try {
      const stateToPersist = {};
      CONFIG.PERSIST_KEYS.forEach(key => {
        stateToPersist[key] = this._state[key];
      });
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (error) {
      console.warn('StateManager: Failed to persist state', error);
    }
  }
  
  /**
   * Loads persisted state from localStorage
   */
  _loadState() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!stored) return;
      
      const parsed = JSON.parse(stored);
      
      // Only restore persisted keys
      CONFIG.PERSIST_KEYS.forEach(key => {
        if (parsed.hasOwnProperty(key)) {
          this._state[key] = parsed[key];
        }
      });
      
      // Validate the restored session
      if (!this._validateSession()) {
        console.warn('StateManager: Invalid session detected, clearing...');
        this._clearSession();
      }
    } catch (error) {
      console.warn('StateManager: Failed to load state, clearing session:', error);
      this._clearSession();
    }
  }
  
  /**
   * Validates the current session state
   * @returns {boolean} True if session is valid
   */
  _validateSession() {
    const state = this._state;
    
    // If not marked as authenticated, no validation needed
    if (!state.isAuthenticated) {
      return true; // Not authenticated is a valid state
    }
    
    // Validate session token exists
    if (!state.sessionToken) {
      console.warn('Session validation failed: missing sessionToken');
      return false;
    }
    
    // Validate user object structure
    if (!state.currentUser || 
        !state.currentUser.id || 
        !state.currentUser.email || 
        !state.currentUser.fullName) {
      console.warn('Session validation failed: invalid user object');
      return false;
    }
    
    return true;
  }
  
  /**
   * Clears all session-related state
   */
  _clearSession() {
    // Reset auth-related state
    this._state.isAuthenticated = false;
    this._state.currentUser = null;
    this._state.sessionToken = null;
    this._state.referrals = [];
    this._state.stamps = [];
    this._state.pendingEmail = null;
    
    // Clear localStorage
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (error) {
      console.warn('StateManager: Failed to clear localStorage', error);
    }
  }
  
  /**
   * Clears all persisted state (for logout)
   */
  clearPersistedState() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      // Reset persisted keys to initial values
      const initial = this._getInitialState();
      const updates = {};
      CONFIG.PERSIST_KEYS.forEach(key => {
        updates[key] = initial[key];
      });
      this.setState(updates);
    } catch (error) {
      console.warn('StateManager: Failed to clear persisted state', error);
    }
  }
}

// Global state manager instance
const stateManager = new StateManager();

/* ============================================================================
   ROUTER
   ============================================================================
   Hash-based routing with authentication guards
   ========================================================================== */

class Router {
  constructor() {
    this._routes = CONFIG.ROUTES;
    this._currentRoute = null;
    this._currentPage = this._detectCurrentPage();
    this._init();
  }
  
  /**
   * Detects the current page from data-page attribute or URL
   * @returns {string} Current page name
   */
  _detectCurrentPage() {
    // First try data-page attribute on body
    const bodyPage = document.body?.dataset?.page;
    if (bodyPage) {
      return bodyPage;
    }
    
    // Fallback to URL path parsing
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '') || 'index';
  }
  
  /**
   * Gets the page HTML file for a route
   * @param {string} routeName - Route name
   * @returns {string} Page filename (without .html)
   */
  _getPageForRoute(routeName) {
    const routeConfig = this._routes[routeName];
    return routeConfig?.page || 'index';
  }
  
  /**
   * Initializes the router
   */
  _init() {
    // Listen to hash changes
    window.addEventListener('hashchange', () => this._handleHashChange());
    
    // Handle initial route
    this._handleHashChange();
  }
  
  /**
   * Gets the current route from URL hash
   * @returns {string} Route name
   */
  _parseHash() {
    const hash = window.location.hash.slice(1);
    
    // If no hash, get default route for current page
    if (!hash) {
      const pageRoute = CONFIG.PAGE_ROUTES[this._currentPage];
      return pageRoute || CONFIG.DEFAULT_ROUTE;
    }
    
    return hash.split('?')[0]; // Remove query params if any
  }
  
  /**
   * Checks authentication state and determines redirect if needed
   * @param {string} routeName - Requested route
   * @returns {string} Target route (may differ from routeName if redirect needed)
   */
  _checkAuth(routeName) {
    const routeConfig = this._routes[routeName];
    const isAuthenticated = stateManager.getState('isAuthenticated');
    
    // Protected route accessed without auth
    if (routeConfig && routeConfig.requiresAuth && !isAuthenticated) {
      console.log(`Route guard: redirecting unauthenticated user from ${routeName} to auth`);
      return 'auth';
    }
    
    // Auth route accessed while authenticated
    if (routeName === 'auth' && isAuthenticated) {
      console.log('Route guard: redirecting authenticated user from auth to dashboard');
      return CONFIG.AUTH_DEFAULT_ROUTE;
    }
    
    return routeName; // No redirect needed
  }
  
  /**
   * Handles hash change events
   */
  _handleHashChange() {
    const route = this._parseHash();
    
    // Check if route exists
    if (!this._routes[route]) {
      this.navigate(CONFIG.DEFAULT_ROUTE, { replace: true });
      return;
    }
    
    // Apply route guards (auth checks)
    const targetRoute = this._checkAuth(route);
    
    if (targetRoute !== route) {
      // Route was redirected by guard - navigate to target
      this.navigate(targetRoute, { replace: true });
      return;
    }
    
    // Check if route requires page navigation
    const targetPage = this._getPageForRoute(targetRoute);
    if (targetPage !== this._currentPage && this._currentPage !== 'index') {
      // Need to navigate to different page
      this._navigateToPage(targetPage, targetRoute);
      return;
    }
    
    // Same page navigation - update state
    const previousView = stateManager.getState('currentView');
    this._currentRoute = targetRoute;
    
    stateManager.setState({
      currentView: targetRoute,
      previousView: previousView
    });
  }
  
  /**
   * Navigates to a different HTML page
   * @param {string} page - Target page name
   * @param {string} route - Route to set on target page
   */
  _navigateToPage(page, route) {
    // Build URL with hash for the route
    const pageUrl = `${page}.html#${route}`;
    window.location.href = pageUrl;
  }
  
  /**
   * Navigates to a route with route guards applied
   * Handles cross-page navigation automatically
   * @param {string} route - Route name
   * @param {Object} [options] - Navigation options
   */
  navigate(route, options = {}) {
    const { replace = false } = options;
    
    // Check if route exists
    if (!this._routes[route]) {
      console.warn(`Router: Unknown route "${route}", redirecting to default`);
      route = CONFIG.DEFAULT_ROUTE;
    }
    
    // Check if we need to go to a different page
    const targetPage = this._getPageForRoute(route);
    
    if (targetPage !== this._currentPage && this._currentPage !== 'index') {
      // Cross-page navigation
      this._navigateToPage(targetPage, route);
      return;
    }
    
    // Same page navigation - use hash
    if (replace) {
      window.location.replace(`#${route}`);
    } else {
      window.location.hash = route;
    }
  }
  
  /**
   * Gets current route name
   * @returns {string} Current route
   */
  getCurrentRoute() {
    return this._currentRoute || this._parseHash();
  }
  
  /**
   * Gets route configuration
   * @param {string} route - Route name
   * @returns {Object|null} Route config or null
   */
  getRouteConfig(route) {
    return this._routes[route] || null;
  }
  
  /**
   * Gets current page name
   * @returns {string} Current page
   */
  getCurrentPage() {
    return this._currentPage;
  }
}

// Global router instance
const router = new Router();

/* ============================================================================
   COMPONENT BASE CLASS
   ============================================================================
   Base class for all UI components with lifecycle methods
   ========================================================================== */

class Component {
  constructor(props = {}) {
    this.props = props;
    this._subscriptions = [];
    this._mounted = false;
    this._element = null;
  }
  
  /**
   * Returns the HTML template string
   * Must be implemented by subclasses
   * @returns {string} HTML string
   */
  template() {
    return '';
  }
  
  /**
   * Renders the component and returns HTML
   * @returns {string} Rendered HTML
   */
  render() {
    return this.template();
  }
  
  /**
   * Called after component is inserted into DOM
   * Override to add event listeners or fetch data
   */
  mount() {
    this._mounted = true;
  }
  
  /**
   * Called before component is removed from DOM
   * Cleans up subscriptions and event listeners
   */
  unmount() {
    this._mounted = false;
    
    // Unsubscribe all state listeners
    this._subscriptions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Component: Error unsubscribing', error);
      }
    });
    this._subscriptions = [];
  }
  
  /**
   * Subscribes to state changes with automatic cleanup
   * @param {string} key - State key to watch
   * @param {Function} callback - Called on change
   */
  subscribe(key, callback) {
    const unsubscribe = stateManager.subscribe(key, callback);
    this._subscriptions.push(unsubscribe);
    return unsubscribe;
  }
  
  /**
   * Query selector helper scoped to component
   * @param {string} selector - CSS selector
   * @returns {Element|null} Matching element
   */
  $(selector) {
    const container = document.getElementById('main-content');
    return container?.querySelector(selector) || null;
  }
  
  /**
   * Query selector all helper scoped to component
   * @param {string} selector - CSS selector
   * @returns {NodeList} Matching elements
   */
  $$(selector) {
    const container = document.getElementById('main-content');
    return container?.querySelectorAll(selector) || [];
  }
  
  /**
   * Sets the component's root element reference
   * @param {Element} element - DOM element
   */
  setElement(element) {
    this._element = element;
  }
  
  /**
   * Gets the component's root element
   * @returns {Element|null} DOM element
   */
  getElement() {
    return this._element;
  }
  
  /**
   * Checks if component is currently mounted
   * @returns {boolean} Mounted status
   */
  isMounted() {
    return this._mounted;
  }
}

/* ============================================================================
   ANIMATION SERVICE
   ============================================================================
   Manages animations with reduced-motion support
   ========================================================================== */

class AnimationService {
  constructor() {
    this._reducedMotion = this._checkReducedMotion();
    this._setupMotionListener();
  }
  
  /**
   * Checks if user prefers reduced motion
   * @returns {boolean} True if reduced motion preferred
   */
  _checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Sets up listener for motion preference changes
   */
  _setupMotionListener() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this._reducedMotion = e.matches;
    });
  }
  
  /**
   * Gets current reduced motion preference
   * @returns {boolean} True if reduced motion preferred
   */
  get reducedMotion() {
    return this._reducedMotion;
  }
  
  /**
   * Animates passport opening with 3D flip effect
   * @param {HTMLElement} passportEl - The passport container element
   * @returns {Promise<void>} Resolves when animation completes
   */
  async animatePassportOpen(passportEl) {
    if (!passportEl) return;
    
    // Skip animation for reduced motion preference
    if (this._reducedMotion) {
      passportEl.classList.remove('passport--closed');
      passportEl.classList.add('passport--open');
      return;
    }
    
    // Get the cover element
    const coverEl = passportEl.querySelector('.passport-cover');
    if (!coverEl) return;
    
    // Start opening animation
    passportEl.classList.remove('passport--closed');
    passportEl.classList.add('passport--opening');
    
    // Wait for animation to complete
    await this.waitForAnimationByName(coverEl, 'passportOpen');
    
    // Set final state
    passportEl.classList.remove('passport--opening');
    passportEl.classList.add('passport--open');
  }
  
  /**
   * Animates passport closing with reverse 3D flip
   * @param {HTMLElement} passportEl - The passport container element
   * @returns {Promise<void>} Resolves when animation completes
   */
  async animatePassportClose(passportEl) {
    if (!passportEl) return;
    
    // Skip animation for reduced motion preference
    if (this._reducedMotion) {
      passportEl.classList.remove('passport--open');
      passportEl.classList.add('passport--closed');
      return;
    }
    
    const coverEl = passportEl.querySelector('.passport-cover');
    if (!coverEl) return;
    
    // Start closing animation
    passportEl.classList.remove('passport--open');
    passportEl.classList.add('passport--closing');
    
    // Wait for animation to complete
    await this.waitForAnimationByName(coverEl, 'passportClose');
    
    // Set final state
    passportEl.classList.remove('passport--closing');
    passportEl.classList.add('passport--closed');
  }
  
  /**
   * Waits for a specific CSS animation to complete
   * @param {HTMLElement} el - Element being animated
   * @param {string} animationName - Specific animation name to wait for
   * @returns {Promise<void>}
   */
  waitForAnimationByName(el, animationName) {
    return new Promise(resolve => {
      const handleAnimationEnd = (e) => {
        // Only resolve for the specified animation
        if (animationName && e.animationName !== animationName) return;
        
        el.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };
      
      el.addEventListener('animationend', handleAnimationEnd);
      
      // Fallback timeout in case animation doesn't fire (800ms animation + 200ms buffer)
      setTimeout(() => {
        el.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      }, 1000);
    });
  }
  
  /**
   * Animates stamp slam effect (drops in with bounce)
   * @param {HTMLElement} stampEl - The stamp element
   * @returns {Promise<void>}
   */
  async animateStampSlam(stampEl) {
    if (!stampEl) return;
    
    // Announce to screen readers
    this.announceToScreenReader('חותמת חדשה נוספה לדרכון!');
    
    // Skip animation for reduced motion
    if (this._reducedMotion) {
      stampEl.classList.remove('stamp--new');
      stampEl.classList.add('stamp--visible');
      return;
    }
    
    // Ensure stamp has animation class
    if (!stampEl.classList.contains('stamp--new')) {
      stampEl.classList.add('stamp--new');
    }
    
    // Wait for animation to complete
    await this.waitForAnimationByName(stampEl, 'stampSlam');
    
    // Set final state
    stampEl.classList.remove('stamp--new');
    stampEl.classList.add('stamp--visible');
  }
  
  /**
   * Animates page flip to next page
   * @param {HTMLElement} pagesEl - The passport-pages container
   * @returns {Promise<void>}
   */
  async animatePageFlipNext(pagesEl) {
    if (!pagesEl) return;
    
    if (this._reducedMotion) {
      // Instant transition for reduced motion
      return;
    }
    
    pagesEl.classList.add('passport-pages--flipping-next');
    await this.waitForAnimationByName(pagesEl, 'pageFlipNext');
    pagesEl.classList.remove('passport-pages--flipping-next');
  }
  
  /**
   * Animates page flip to previous page
   * @param {HTMLElement} pagesEl - The passport-pages container
   * @returns {Promise<void>}
   */
  async animatePageFlipPrev(pagesEl) {
    if (!pagesEl) return;
    
    if (this._reducedMotion) {
      return;
    }
    
    pagesEl.classList.add('passport-pages--flipping-prev');
    await this.waitForAnimationByName(pagesEl, 'pageFlipPrev');
    pagesEl.classList.remove('passport-pages--flipping-prev');
  }
  
  /**
   * Triggers confetti celebration
   * @param {Object} options - Confetti configuration
   * @returns {Promise} Resolves when animation completes
   */
  async celebrateWithConfetti(options = {}) {
    if (this._reducedMotion) {
      return Promise.resolve();
    }
    
    // Check if confetti library is loaded
    if (typeof confetti !== 'function') {
      console.warn('AnimationService: confetti library not loaded');
      return Promise.resolve();
    }
    
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    };
    
    try {
      await confetti({ ...defaults, ...options });
    } catch (error) {
      console.warn('AnimationService: confetti error', error);
    }
  }
  
  /**
   * Waits for CSS animation/transition to complete
   * @param {Element} element - Animated element
   * @returns {Promise} Resolves when animation ends
   */
  waitForAnimation(element) {
    return new Promise(resolve => {
      if (!element || this._reducedMotion) {
        resolve();
        return;
      }
      
      const handleEnd = () => {
        element.removeEventListener('animationend', handleEnd);
        element.removeEventListener('transitionend', handleEnd);
        resolve();
      };
      
      element.addEventListener('animationend', handleEnd, { once: true });
      element.addEventListener('transitionend', handleEnd, { once: true });
      
      // Fallback timeout (3s max)
      setTimeout(resolve, 3000);
    });
  }
  
  /**
   * Animates a number counter from 0 to target
   * @param {Element} element - Element to update with count
   * @param {number} target - Target number
   * @param {number} duration - Animation duration in ms (default 1000)
   */
  animateCounter(element, target, duration = 1000) {
    if (this._reducedMotion || !element) {
      // Show final value immediately
      element.textContent = target.toLocaleString('he-IL');
      return;
    }
    
    const start = performance.now();
    const startValue = 0;
    
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      const currentValue = Math.round(startValue + (target - startValue) * easedProgress);
      element.textContent = currentValue.toLocaleString('he-IL');
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // =========================================================================
  // CELEBRATION METHODS (Story 3.5)
  // =========================================================================

  /**
   * Checks if confetti library is available
   * @returns {boolean}
   */
  _hasConfetti() {
    return typeof confetti === 'function';
  }

  /**
   * Fires celebration confetti for hired stamp
   * Uses PassportCard brand colors
   */
  celebrateHiredStamp() {
    // Announce to screen readers
    this.announceToScreenReader('מזל טוב! גיוס מוצלח!');
    
    if (this._reducedMotion) {
      this._showStaticCelebration('מזל טוב! גיוס מוצלח!');
      return;
    }

    if (!this._hasConfetti()) {
      this._showFallbackCelebration('hired');
      return;
    }

    // Brand colors confetti
    const colors = ['#E10514', '#F1C40F', '#22C55E', '#0984E3'];

    // Main burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });

    // Side bursts for extra celebration
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
    }, 200);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      if (typeof confetti.reset === 'function') {
        confetti.reset();
      }
    }, 3000);
  }

  /**
   * Fires celebration for first referral stamp
   * Uses hearts and special pink particles
   */
  celebrateFirstReferral() {
    // Announce to screen readers
    this.announceToScreenReader('ברכות על ההפניה הראשונה!');
    
    if (this._reducedMotion) {
      this._showStaticCelebration('ברכות על ההפניה הראשונה!');
      return;
    }

    if (!this._hasConfetti()) {
      this._showFallbackCelebration('first');
      return;
    }

    // Pink/red heart celebration
    const heartColors = ['#FD79A8', '#E10514', '#FF6B81', '#F1C40F'];

    // Heart-shaped confetti burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: heartColors,
      shapes: ['circle', 'circle', 'square'],
      scalar: 1.2
    });

    // Show congratulatory message
    this._showCelebrationMessage('ברכות על ההפניה הראשונה!');

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      if (typeof confetti.reset === 'function') {
        confetti.reset();
      }
    }, 3000);
  }

  /**
   * Generic celebration for other achievements
   * @param {string} stampType - Type of stamp earned
   */
  celebrateAchievement(stampType) {
    // Announce to screen readers
    const config = STAMP_TYPES[stampType];
    const srMessage = config ? `${config.label}! הישג חדש נוסף!` : 'הישג חדש!';
    this.announceToScreenReader(srMessage);
    
    if (this._reducedMotion) {
      const message = config ? `${config.label}!` : 'הישג חדש!';
      this._showStaticCelebration(message);
      return;
    }

    if (!this._hasConfetti()) {
      this._showFallbackCelebration(stampType);
      return;
    }

    // Get stamp color for themed celebration (config already declared above)
    const stampColor = config?.color || '#E10514';

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: [stampColor, '#F1C40F', '#ffffff']
    });

    setTimeout(() => {
      if (typeof confetti.reset === 'function') {
        confetti.reset();
      }
    }, 2500);
  }

  /**
   * Shows static celebration message (for reduced motion)
   * @param {string} message - Celebration message
   */
  _showStaticCelebration(message) {
    this._showToast(message, 'success', 3000);
  }

  /**
   * Shows fallback CSS-based celebration when confetti unavailable
   * @param {string} stampType - Type of stamp
   */
  _showFallbackCelebration(stampType) {
    const config = STAMP_TYPES[stampType] || {};
    const message = config.label ? `${config.label}!` : 'הישג חדש!';

    // Show special toast with animation
    this._showAnimatedToast(message, config.color || '#00B894');
  }

  /**
   * Shows celebration message overlay
   * @param {string} message - Message to display
   */
  _showCelebrationMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'celebration-message';
    messageEl.innerHTML = `<span class="celebration-message__text">${message}</span>`;
    messageEl.setAttribute('role', 'alert');
    messageEl.setAttribute('aria-live', 'polite');

    document.body.appendChild(messageEl);

    // Animate in
    requestAnimationFrame(() => {
      messageEl.classList.add('celebration-message--visible');
    });

    // Remove after animation
    setTimeout(() => {
      messageEl.classList.remove('celebration-message--visible');
      setTimeout(() => {
        messageEl.remove();
      }, 500);
    }, 2500);
  }

  /**
   * Shows toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, info, warning, error)
   * @param {number} duration - Duration in ms
   */
  _showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <i class="ti ti-${type === 'success' ? 'check' : type === 'error' ? 'x' : 'info-circle'} toast__icon"></i>
      <span class="toast__message">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('toast--visible');
    });

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  /**
   * Shows animated toast with custom color
   * @param {string} message - Toast message
   * @param {string} color - Accent color
   */
  _showAnimatedToast(message, color) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast toast--celebration';
    toast.style.setProperty('--celebration-color', color);
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast__message">${message}</span>
      <span class="toast__sparkle" aria-hidden="true">${renderIcon('sparkles')}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('toast--visible');
    });

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Dismisses any active celebration
   */
  dismissCelebration() {
    // Reset confetti if available
    if (this._hasConfetti() && typeof confetti.reset === 'function') {
      confetti.reset();
    }

    // Remove any celebration messages
    const messages = document.querySelectorAll('.celebration-message');
    messages.forEach(msg => msg.remove());
  }

  // =========================================================================
  // ACCESSIBILITY METHODS (Story 6.3)
  // =========================================================================

  /**
   * Announces message to screen readers using live region
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' (default) or 'assertive'
   */
  announceToScreenReader(message, priority = 'polite') {
    const announcer = document.getElementById('sr-announcer');
    if (!announcer) {
      console.warn('AnimationService: sr-announcer element not found');
      return;
    }

    // Set priority level
    announcer.setAttribute('aria-live', priority);
    
    // Clear previous announcement
    announcer.textContent = '';
    
    // Small delay to ensure screen reader picks up the change
    requestAnimationFrame(() => {
      announcer.textContent = message;
    });
  }

  /**
   * Announces page navigation to screen readers
   * @param {string} pageName - Name of the page navigated to
   */
  announcePageChange(pageName) {
    const pageNames = {
      'dashboard': 'דף הבית',
      'passport': 'הדרכון שלי',
      'positions': 'משרות פתוחות',
      'referrals': 'ההפניות שלי',
      'settings': 'הגדרות',
      'refer': 'טופס הפניה'
    };
    
    const hebrewName = pageNames[pageName] || pageName;
    this.announceToScreenReader(`עברת לעמוד ${hebrewName}`);
  }

  /**
   * Announces form validation error to screen readers
   * @param {string} fieldName - Name of the field with error
   * @param {string} errorMessage - Error message
   */
  announceValidationError(fieldName, errorMessage) {
    this.announceToScreenReader(`שגיאה בשדה ${fieldName}: ${errorMessage}`, 'assertive');
  }

  /**
   * Announces success message to screen readers
   * @param {string} message - Success message
   */
  announceSuccess(message) {
    this.announceToScreenReader(message, 'polite');
  }
}

// Global animation service instance
const animationService = new AnimationService();

/* ============================================================================
   NAVIGATION MANAGER
   ============================================================================
   Orchestrates navigation components based on auth state and viewport
   ========================================================================== */

class NavigationManager {
  constructor() {
    this._headerComponent = null;
    this._bottomNavComponent = null;
    this._sidebarNavComponent = null;
    this._isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    this._mediaQuery = window.matchMedia('(min-width: 1024px)');
    this._boundMediaHandler = null;
  }
  
  /**
   * Initializes the navigation manager
   */
  init() {
    // Listen for auth state changes
    stateManager.subscribe('isAuthenticated', (isAuth) => {
      this._updateNavigation(isAuth);
    });
    
    // Listen for viewport changes
    this._boundMediaHandler = (e) => {
      this._isDesktop = e.matches;
      if (stateManager.getState('isAuthenticated')) {
        this._renderNavigation();
      }
    };
    this._mediaQuery.addEventListener('change', this._boundMediaHandler);
    
    // Initial render if authenticated
    if (stateManager.getState('isAuthenticated')) {
      this._renderNavigation();
    }
  }
  
  /**
   * Updates navigation based on authentication state
   * @param {boolean} isAuthenticated - Whether user is authenticated
   */
  _updateNavigation(isAuthenticated) {
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('nav-container');
    
    if (isAuthenticated) {
      this._renderNavigation();
    } else {
      // Clear navigation when logged out
      this._unmountComponents();
      if (headerContainer) headerContainer.innerHTML = '';
      if (navContainer) navContainer.innerHTML = '';
      document.body.classList.remove('has-nav', 'has-sidebar');
    }
  }
  
  /**
   * Renders the appropriate navigation components
   */
  _renderNavigation() {
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('nav-container');
    
    // Unmount existing components
    this._unmountComponents();
    
    // Render header
    this._headerComponent = new HeaderComponent();
    if (headerContainer) {
      headerContainer.innerHTML = this._headerComponent.render();
      this._headerComponent.setElement(headerContainer.firstElementChild);
      this._headerComponent.mount();
    }
    
    // Render appropriate nav based on viewport
    if (this._isDesktop) {
      document.body.classList.add('has-sidebar');
      document.body.classList.remove('has-nav');
      
      this._sidebarNavComponent = new SidebarNavComponent();
      this._bottomNavComponent = null;
      
      if (navContainer) {
        navContainer.innerHTML = this._sidebarNavComponent.render();
        this._sidebarNavComponent.setElement(navContainer.firstElementChild);
        this._sidebarNavComponent.mount();
      }
    } else {
      document.body.classList.add('has-nav');
      document.body.classList.remove('has-sidebar');
      
      this._bottomNavComponent = new BottomNavComponent();
      this._sidebarNavComponent = null;
      
      if (navContainer) {
        navContainer.innerHTML = this._bottomNavComponent.render();
        this._bottomNavComponent.setElement(navContainer.firstElementChild);
        this._bottomNavComponent.mount();
      }
    }
  }
  
  /**
   * Unmounts all navigation components
   */
  _unmountComponents() {
    if (this._headerComponent) {
      this._headerComponent.unmount();
      this._headerComponent = null;
    }
    if (this._bottomNavComponent) {
      this._bottomNavComponent.unmount();
      this._bottomNavComponent = null;
    }
    if (this._sidebarNavComponent) {
      this._sidebarNavComponent.unmount();
      this._sidebarNavComponent = null;
    }
  }
  
  /**
   * Gets the current header component instance
   * @returns {HeaderComponent|null}
   */
  getHeaderComponent() {
    return this._headerComponent;
  }
}

// Global navigation manager instance
const navigationManager = new NavigationManager();

/* ============================================================================
   AUTH SERVICE
   ============================================================================
   Authentication service for session management
   ========================================================================== */

class AuthService {
  /**
   * Clears all session data and redirects to login
   */
  static logout() {
    // Clear state
    stateManager.setState({
      isAuthenticated: false,
      currentUser: null,
      sessionToken: null,
      referrals: [],
      stamps: [],
      pendingEmail: null,
      activeModal: null
    });
    
    // Clear localStorage
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (error) {
      console.warn('AuthService: Failed to clear localStorage', error);
    }
    
    // Show logout toast (optional per AC)
    if (typeof app !== 'undefined' && app.showToast) {
      app.showToast('התנתקת בהצלחה', 'success');
    }
    
    // Navigate to auth - use direct redirect for multi-page architecture (Story 7.0)
    // Small delay to allow toast to show before page redirect
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 300);
  }
  
  /**
   * Checks if current session is valid
   * @returns {boolean} True if authenticated with valid session
   */
  static isAuthenticated() {
    return stateManager.getState('isAuthenticated') === true && 
           stateManager.getState('sessionToken') !== null;
  }
}

/* ============================================================================
   COMPONENTS - AUTHENTICATION
   ============================================================================
   Login, OTP, and session-related components
   ========================================================================== */

/**
 * LoginComponent - Email login form with auto-suggestion and validation
 * Implements: AC1 (Login Screen Display), AC7 (Accessibility)
 */
class LoginComponent extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      emailSuggestion: '@passportcard.co.il',
      isValid: false,
      errorMessage: '',
      isSubmitting: false,
      showSuggestion: false
    };
    this._boundHandleInput = this._handleEmailInput.bind(this);
    this._boundHandleKeydown = this._handleKeydown.bind(this);
  }

  /**
   * Returns the login screen HTML template
   * @returns {string} HTML string
   */
  template() {
    const { isValid, errorMessage, isSubmitting, email, showSuggestion } = this.state;
    
    const inputClasses = [
      'form-input',
      isValid ? 'input--valid' : '',
      errorMessage ? 'input--error' : ''
    ].filter(Boolean).join(' ');

    const buttonClasses = [
      'btn',
      'btn--primary',
      'btn--full',
      isSubmitting ? 'btn--loading' : ''
    ].filter(Boolean).join(' ');

    const buttonDisabled = !isValid || isSubmitting ? 'disabled' : '';
    const inputDisabled = isSubmitting ? 'disabled' : '';

    return `
      <div class="login-screen">
        <div class="login-hero">
          <div class="login-logo" role="img" aria-label="PassportCard">
            <img src="${CONFIG.LOGOS.WHITE}" alt="" aria-hidden="true" class="login-logo__img" />
          </div>
          <h1 class="login-title">ברוכים הבאים ל-PassportCard Refer</h1>
          <p class="login-subtitle">מערכת ההפניות שלך</p>
        </div>
        
        <form class="login-form" data-action="submit-login">
          <div class="form-group">
            <label for="email-input" class="form-label">אימייל חברה</label>
            <div class="email-input-wrapper">
              <input 
                type="text" 
                id="email-input"
                class="${inputClasses}"
                placeholder="firstname.lastname@passportcard.co.il"
                aria-label="הזינו את כתובת האימייל שלכם"
                aria-describedby="email-error email-suggestion-hint"
                aria-invalid="${errorMessage ? 'true' : 'false'}"
                autocomplete="email"
                autocapitalize="off"
                autocorrect="off"
                spellcheck="false"
                value="${email}"
                ${inputDisabled}
              >
              <div 
                class="email-suggestion ${showSuggestion && email && !email.includes('@') ? 'email-suggestion--visible' : ''}" 
                id="email-suggestion-hint"
                role="button"
                tabindex="${showSuggestion && email && !email.includes('@') ? '0' : '-1'}"
                aria-label="לחץ להשלמת האימייל"
              >
                <span class="email-suggestion__hint">לחץ Tab להשלמה:</span>
                <span class="email-suggestion__text">${email}@passportcard.co.il</span>
              </div>
            </div>
            <div id="email-error" class="form-error" aria-live="polite" role="alert">
              ${errorMessage}
            </div>
          </div>
          
          <button 
            type="submit" 
            class="${buttonClasses}"
            ${buttonDisabled}
            aria-busy="${isSubmitting}"
          >
            ${isSubmitting ? '<span class="spinner" aria-hidden="true"></span> שולח...' : 'שלח קוד אימות'}
          </button>
        </form>
      </div>
    `;
  }

  /**
   * Called after component is mounted to DOM
   */
  mount() {
    super.mount();
    this._bindEvents();
    // Focus email input on mount
    const emailInput = this.$('#email-input');
    if (emailInput) {
      emailInput.focus();
    }
  }

  /**
   * Called before component is removed from DOM
   */
  unmount() {
    this._unbindEvents();
    super.unmount();
  }

  /**
   * Binds event listeners for the component
   */
  _bindEvents() {
    const emailInput = this.$('#email-input');
    if (emailInput) {
      emailInput.addEventListener('input', this._boundHandleInput);
      emailInput.addEventListener('keydown', this._boundHandleKeydown);
    }
    
    // Bind click and keyboard on suggestion
    const suggestion = this.$('.email-suggestion');
    if (suggestion) {
      suggestion.addEventListener('click', this._handleSuggestionClick.bind(this));
      suggestion.addEventListener('keydown', this._handleSuggestionKeydown.bind(this));
    }
  }

  /**
   * Unbinds event listeners
   */
  _unbindEvents() {
    const emailInput = this.$('#email-input');
    if (emailInput) {
      emailInput.removeEventListener('input', this._boundHandleInput);
      emailInput.removeEventListener('keydown', this._boundHandleKeydown);
    }
  }

  /**
   * Handles click on email suggestion to accept it
   */
  _handleSuggestionClick() {
    this._acceptSuggestion();
  }

  /**
   * Handles keyboard activation on email suggestion (Enter/Space)
   * @param {KeyboardEvent} e - Keydown event
   */
  _handleSuggestionKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._acceptSuggestion();
    }
  }

  /**
   * Accepts the email suggestion and updates the input
   */
  _acceptSuggestion() {
    if (this.state.showSuggestion && !this.state.email.includes('@') && this.state.email.length > 0) {
      const fullEmail = this.state.email + '@passportcard.co.il';
      this._updateEmailState(fullEmail);
      const emailInput = this.$('#email-input');
      if (emailInput) {
        emailInput.value = fullEmail;
        emailInput.focus();
      }
    }
  }

  /**
   * Handles email input changes
   * @param {Event} e - Input event
   */
  _handleEmailInput(e) {
    const value = e.target.value.trim().toLowerCase();
    this._updateEmailState(value);
  }

  /**
   * Handles keydown events on email input
   * @param {KeyboardEvent} e - Keydown event
   */
  _handleKeydown(e) {
    // Tab to accept suggestion
    if (e.key === 'Tab' && this.state.showSuggestion && !this.state.email.includes('@')) {
      e.preventDefault();
      const fullEmail = this.state.email + '@passportcard.co.il';
      this._updateEmailState(fullEmail);
      // Update input value directly
      const emailInput = this.$('#email-input');
      if (emailInput) {
        emailInput.value = fullEmail;
      }
    }
  }

  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  _validateEmail(email) {
    const fullEmail = email.includes('@') ? email : `${email}@passportcard.co.il`;
    const pattern = /^[a-zA-Z]+\.[a-zA-Z]+@passportcard\.co\.il$/;
    return pattern.test(fullEmail);
  }

  /**
   * Updates component state based on email value
   * @param {string} value - Current email value
   */
  _updateEmailState(value) {
    const isValid = value.length > 0 && this._validateEmail(value);
    let errorMessage = '';

    // Show error when:
    // 1. User has typed something AND
    // 2. Email is not valid AND
    // 3. User has attempted to complete the email (has @ or .) OR typed more than 3 characters
    const hasAttemptedCompletion = value.includes('@') || value.includes('.');
    const hasTypedEnough = value.length > 3;
    
    if (value.length > 0 && !isValid && (hasAttemptedCompletion || hasTypedEnough)) {
      errorMessage = 'פורמט אימייל לא תקין';
    }

    // Show suggestion when typing without @
    const showSuggestion = value.length > 0 && !value.includes('@');

    this.state = {
      ...this.state,
      email: value,
      isValid,
      errorMessage,
      showSuggestion
    };

    this._rerender();
  }

  /**
   * Re-renders the component by updating the DOM
   */
  _rerender() {
    const appContainer = document.getElementById('main-content');
    if (appContainer) {
      const currentEmail = this.state.email;
      const cursorPosition = this.$('#email-input')?.selectionStart || currentEmail.length;
      
      appContainer.innerHTML = this.template();
      
      // Restore focus and cursor position
      const emailInput = this.$('#email-input');
      if (emailInput && !this.state.isSubmitting) {
        emailInput.focus();
        emailInput.setSelectionRange(cursorPosition, cursorPosition);
      }
      
      // Rebind events after re-render
      this._bindEvents();
    }
  }

  /**
   * Handles form submission
   * @param {Event} e - Submit event
   */
  handleSubmit(e) {
    if (e) e.preventDefault();
    
    if (!this.state.isValid || this.state.isSubmitting) return;

    const fullEmail = this.state.email.includes('@')
      ? this.state.email
      : `${this.state.email}@passportcard.co.il`;

    this.state.isSubmitting = true;
    this._rerender();

    // Store email for OTP step
    stateManager.setState({ pendingEmail: fullEmail });

    // Trigger OTP modal after delay
    setTimeout(() => {
      stateManager.setState({ activeModal: 'otp' });
    }, 300);
  }
}

/* ============================================================================
   COMPONENTS - SHARED
   ============================================================================
   Header, navigation, and other shared components
   ========================================================================== */

/**
 * BottomNavComponent - Mobile bottom navigation bar
 * Implements: AC1 (Mobile Bottom Navigation Bar), AC4, AC5, AC8
 */
class BottomNavComponent extends Component {
  constructor() {
    super();
    this._navItems = [
      { route: 'dashboard', icon: 'ti-chart-dots-2', label: 'דשבורד' },
      { route: 'passport', icon: 'ti-book', label: 'הדרכון שלי' },
      { route: 'positions', icon: 'ti-briefcase', label: 'משרות' },
      { route: 'referrals', icon: 'ti-users', label: 'ההפניות שלי' },
      { route: 'settings', icon: 'ti-settings', label: 'הגדרות' }
    ];
  }
  
  /**
   * Returns the bottom navigation HTML template
   * @returns {string} HTML string
   */
  template() {
    const currentView = stateManager.getState('currentView');
    
    return `
      <nav class="bottom-nav" aria-label="ניווט ראשי">
        ${this._navItems.map(item => `
          <button 
            class="bottom-nav__item ${currentView === item.route ? 'bottom-nav__item--active' : ''}"
            data-navigate="${item.route}"
            aria-current="${currentView === item.route ? 'page' : 'false'}"
            aria-label="${item.label}"
          >
            <i class="ti ${item.icon} bottom-nav__icon"></i>
            <span class="bottom-nav__label">${item.label}</span>
          </button>
        `).join('')}
      </nav>
    `;
  }
  
  /**
   * Called after component is mounted
   */
  mount() {
    super.mount();
    // Subscribe to route changes for re-render
    this.subscribe('currentView', () => {
      this._updateActiveState();
    });
  }
  
  /**
   * Updates the active state of navigation items
   */
  _updateActiveState() {
    const currentView = stateManager.getState('currentView');
    const navContainer = document.getElementById('nav-container');
    const items = navContainer?.querySelectorAll('.bottom-nav__item') || [];
    
    items.forEach(item => {
      const route = item.dataset.navigate;
      const isActive = route === currentView;
      
      item.classList.toggle('bottom-nav__item--active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
}

/**
 * SidebarNavComponent - Desktop sidebar navigation
 * Implements: AC2 (Desktop Sidebar Navigation), AC4, AC5, AC8
 */
class SidebarNavComponent extends Component {
  constructor() {
    super();
    this._navItems = [
      { route: 'dashboard', icon: 'ti-chart-dots-2', label: 'דשבורד' },
      { route: 'passport', icon: 'ti-book', label: 'הדרכון שלי' },
      { route: 'positions', icon: 'ti-briefcase', label: 'משרות' },
      { route: 'referrals', icon: 'ti-users', label: 'ההפניות שלי' },
      { route: 'settings', icon: 'ti-settings', label: 'הגדרות' }
    ];
  }
  
  /**
   * Returns the sidebar navigation HTML template
   * @returns {string} HTML string
   */
  template() {
    const currentView = stateManager.getState('currentView');
    const user = stateManager.getState('currentUser');
    
    return `
      <aside class="sidebar-nav" aria-label="ניווט ראשי">
        <div class="sidebar-nav__brand">
          <div class="sidebar-nav__logo" data-navigate="dashboard" role="button" tabindex="0" aria-label="PassportCard - לדשבורד">
            <img src="${CONFIG.LOGOS.STANDARD}" alt="" aria-hidden="true" class="sidebar-nav__logo-img" />
          </div>
        </div>
        
        <nav class="sidebar-nav__menu">
          ${this._navItems.map(item => `
            <button 
              class="sidebar-nav__item ${currentView === item.route ? 'sidebar-nav__item--active' : ''}"
              data-navigate="${item.route}"
              aria-current="${currentView === item.route ? 'page' : 'false'}"
            >
              <i class="ti ${item.icon} sidebar-nav__icon"></i>
              <span class="sidebar-nav__label">${item.label}</span>
            </button>
          `).join('')}
        </nav>
        
        ${user ? `
          <div class="sidebar-nav__user">
            <div class="sidebar-nav__user-avatar">${user.avatarInitial || user.fullName[0]}</div>
            <div class="sidebar-nav__user-info">
              <span class="sidebar-nav__user-name">${user.fullName}</span>
              <span class="sidebar-nav__user-dept">${user.department}</span>
            </div>
          </div>
        ` : ''}
      </aside>
    `;
  }
  
  /**
   * Called after component is mounted
   */
  mount() {
    super.mount();
    this.subscribe('currentView', () => {
      this._updateActiveState();
    });
  }
  
  /**
   * Updates the active state of navigation items
   */
  _updateActiveState() {
    const currentView = stateManager.getState('currentView');
    const navContainer = document.getElementById('nav-container');
    const items = navContainer?.querySelectorAll('.sidebar-nav__item') || [];
    
    items.forEach(item => {
      const route = item.dataset.navigate;
      const isActive = route === currentView;
      
      item.classList.toggle('sidebar-nav__item--active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
}

/**
 * HeaderComponent - App header with user dropdown menu
 * Implements: AC3 (Header Component), AC9 (Logo Navigation)
 */
class HeaderComponent extends Component {
  constructor() {
    super();
    this._menuOpen = false;
    this._boundClickHandler = null;
    this._pageTitles = {
      dashboard: 'דשבורד',
      passport: 'הדרכון שלי',
      positions: 'משרות פתוחות',
      referrals: 'ההפניות שלי',
      settings: 'הגדרות'
    };
  }
  
  /**
   * Returns the header HTML template
   * @returns {string} HTML string
   */
  template() {
    const user = stateManager.getState('currentUser');
    const currentView = stateManager.getState('currentView');
    
    if (!user) return '';
    
    return `
      <header class="header">
        <div class="header__logo" data-navigate="dashboard" role="button" tabindex="0" aria-label="PassportCard - חזור לדשבורד">
          <img src="${CONFIG.LOGOS.WHITE}" alt="" aria-hidden="true" class="header__logo-img" />
        </div>
        
        <h1 class="header__title">${this._pageTitles[currentView] || ''}</h1>
        
        <div class="header__user">
          <button 
            class="header__user-btn" 
            data-action="toggle-user-menu"
            aria-expanded="${this._menuOpen}"
            aria-haspopup="true"
            aria-label="תפריט משתמש"
          >
            <span class="header__avatar">${user.avatarInitial || user.fullName[0]}</span>
            <i class="ti ti-chevron-down header__chevron ${this._menuOpen ? 'header__chevron--open' : ''}"></i>
          </button>
          
          ${this._menuOpen ? this._renderDropdown(user) : ''}
        </div>
      </header>
    `;
  }
  
  /**
   * Renders the dropdown menu
   * @param {Object} user - User object
   * @returns {string} HTML string for dropdown
   */
  _renderDropdown(user) {
    return `
      <div class="header__dropdown" role="menu">
        <div class="header__dropdown-info">
          <span class="header__dropdown-name">${user.fullName}</span>
          <span class="header__dropdown-email" dir="ltr">${user.email}</span>
        </div>
        <hr class="header__dropdown-divider">
        <button 
          class="header__dropdown-item header__dropdown-item--danger" 
          data-action="logout"
          role="menuitem"
        >
          <i class="ti ti-logout"></i>
          התנתק
        </button>
      </div>
    `;
  }
  
  /**
   * Gets the current page title based on view
   * @returns {string} Page title in Hebrew
   */
  _getPageTitle() {
    return this._pageTitles[stateManager.getState('currentView')] || '';
  }
  
  /**
   * Called after component is mounted
   */
  mount() {
    super.mount();
    // Subscribe to view changes to update title
    this.subscribe('currentView', () => {
      this._updateTitle();
    });
    
    // Close dropdown when clicking outside
    this._boundClickHandler = this._handleOutsideClick.bind(this);
    document.addEventListener('click', this._boundClickHandler);
  }
  
  /**
   * Called before component is unmounted
   */
  unmount() {
    if (this._boundClickHandler) {
      document.removeEventListener('click', this._boundClickHandler);
      this._boundClickHandler = null;
    }
    super.unmount();
  }
  
  /**
   * Updates the page title based on current view
   */
  _updateTitle() {
    const currentView = stateManager.getState('currentView');
    const titleEl = document.querySelector('.header__title');
    if (titleEl) {
      titleEl.textContent = this._pageTitles[currentView] || '';
    }
  }
  
  /**
   * Handles clicks outside the dropdown to close it
   * @param {Event} e - Click event
   */
  _handleOutsideClick(e) {
    if (this._menuOpen && !e.target.closest('.header__user')) {
      this._menuOpen = false;
      this._updateDropdown();
    }
  }
  
  /**
   * Toggles the user dropdown menu
   */
  toggleMenu() {
    this._menuOpen = !this._menuOpen;
    this._updateDropdown();
  }
  
  /**
   * Updates the dropdown visibility
   */
  _updateDropdown() {
    const userContainer = document.querySelector('.header__user');
    const btn = document.querySelector('.header__user-btn');
    const existingDropdown = document.querySelector('.header__dropdown');
    
    if (btn) {
      btn.setAttribute('aria-expanded', this._menuOpen.toString());
      const chevron = btn.querySelector('.header__chevron');
      if (chevron) {
        chevron.classList.toggle('header__chevron--open', this._menuOpen);
      }
    }
    
    if (this._menuOpen && !existingDropdown) {
      const user = stateManager.getState('currentUser');
      if (user && userContainer) {
        const dropdownHTML = this._renderDropdown(user);
        userContainer.insertAdjacentHTML('beforeend', dropdownHTML);
      }
    } else if (!this._menuOpen && existingDropdown) {
      existingDropdown.remove();
    }
  }
}

/* ============================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

/**
 * Creates a debounced version of a function
 * @param {Function} fn - Function to debounce
 * @param {number} ms - Delay in milliseconds
 * @returns {Function} Debounced function with cancel method
 */
function debounce(fn, ms) {
  let timeoutId;
  const debounced = function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
}

/**
 * Seeded random number generator for deterministic user generation
 * @param {string} seed - Seed string (typically email)
 * @returns {Function} Random number generator function returning 0-1
 */
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  let state = Math.abs(hash) || 1;
  return function() {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Generate a simulated Israeli mobile phone number from a seed (Story 7.4 AC#1, AC#5)
 * Same email always produces identical phone number (deterministic)
 * @param {string} seed - User's email or name for deterministic generation
 * @returns {string} Phone number in format '05X-XXX-XXXX'
 */
function generatePhoneNumber(seed) {
  const random = seededRandom(seed);
  
  // Israeli mobile prefixes: 050, 052, 053, 054, 055, 058
  const prefixes = ['050', '052', '053', '054', '055', '058'];
  const prefix = prefixes[Math.floor(random() * prefixes.length)];
  
  // Generate remaining 7 digits
  const digits = [];
  for (let i = 0; i < 7; i++) {
    digits.push(Math.floor(random() * 10));
  }
  
  // Format as 05X-XXX-XXXX
  return `${prefix}-${digits.slice(0, 3).join('')}-${digits.slice(3).join('')}`;
}

/**
 * Mask a phone number for privacy display (Story 7.4 AC#1)
 * Shows only first 2 digits and last 2 digits
 * @param {string} phone - Full phone number '052-123-4567'
 * @returns {string} Masked phone '05*-***-**67'
 */
function maskPhoneNumber(phone) {
  // Keep prefix (05), mask middle, show last 2 digits
  const parts = phone.split('-');
  if (parts.length !== 3) return phone;
  
  const prefix = parts[0].substring(0, 2) + '*';  // '05*'
  const middle = '***';
  const lastPart = '**' + parts[2].slice(-2);     // '**67'
  
  return `${prefix}-${middle}-${lastPart}`;
}

// ============================================
// MOCK DATA - Story 6.5 Enhanced User Generation
// ============================================

/**
 * Hebrew first names for realistic data generation (Story 6.5)
 * Expanded with gender support for more authentic Hebrew names
 */
const HEBREW_FIRST_NAMES_MALE = ['יוסי', 'דוד', 'משה', 'אבי', 'דני', 'גלעד', 'עידן', 'רועי', 'נועם', 'איתי', 'גיא', 'עומר', 'רון', 'אלון', 'טל', 'יובל'];
const HEBREW_FIRST_NAMES_FEMALE = ['דנה', 'מירי', 'יעל', 'שירה', 'נועה', 'רחל', 'תמר', 'ליאת', 'מאיה', 'הילה', 'מיכל', 'ענת', 'אורית', 'שרון', 'טל', 'גלית'];

// Combined for backwards compatibility
const HEBREW_FIRST_NAMES = [...HEBREW_FIRST_NAMES_MALE, ...HEBREW_FIRST_NAMES_FEMALE];

/**
 * Hebrew last names for realistic data generation (Story 6.5)
 */
const HEBREW_LAST_NAMES = ['כהן', 'לוי', 'מזרחי', 'פרץ', 'ביטון', 'דהן', 'אברהם', 'פרידמן', 'שלום', 'גולן', 'אלון', 'בן דוד', 'יוסף', 'חיים', 'רוזנברג', 'שפירא'];

/**
 * English to Hebrew name mapping for email-based generation (Story 6.5)
 * Maps common English first names to Hebrew equivalents
 */
const ENGLISH_TO_HEBREW_NAMES = {
  // Male names
  'yossi': 'יוסי', 'yosi': 'יוסי', 'joseph': 'יוסף', 'joe': 'יוסי',
  'david': 'דוד', 'dudi': 'דוד', 'dave': 'דוד',
  'moshe': 'משה', 'moses': 'משה', 'moishe': 'משה',
  'avi': 'אבי', 'avraham': 'אברהם', 'abraham': 'אברהם',
  'danny': 'דני', 'dan': 'דן', 'daniel': 'דניאל',
  'gilad': 'גלעד', 'guy': 'גיא', 'idan': 'עידן',
  'roi': 'רועי', 'roey': 'רועי', 'noam': 'נועם',
  'itay': 'איתי', 'etay': 'איתי', 'omer': 'עומר', 'omar': 'עומר',
  'ron': 'רון', 'alon': 'אלון', 'tal': 'טל', 'yuval': 'יובל',
  'ben': 'בן', 'eyal': 'אייל', 'eran': 'ערן', 'oren': 'אורן',
  'shai': 'שי', 'shay': 'שי', 'lior': 'ליאור', 'oren': 'אורן',
  'michael': 'מיכאל', 'mike': 'מיכאל', 'max': 'מקס',
  // Female names
  'dana': 'דנה', 'miri': 'מירי', 'miriam': 'מרים',
  'yael': 'יעל', 'shira': 'שירה', 'noa': 'נועה', 'noah': 'נועה',
  'rachel': 'רחל', 'tamar': 'תמר', 'liat': 'ליאת',
  'maya': 'מאיה', 'hila': 'הילה', 'michal': 'מיכל',
  'anat': 'ענת', 'orit': 'אורית', 'sharon': 'שרון',
  'galit': 'גלית', 'hadas': 'הדס', 'ayala': 'איילה',
  'adi': 'עדי', 'mor': 'מור', 'orly': 'אורלי', 'nirit': 'נירית',
  'sarah': 'שרה', 'sara': 'שרה', 'rivka': 'רבקה', 'rebecca': 'רבקה'
};

/**
 * English to Hebrew surname mapping (Story 6.5)
 */
const ENGLISH_TO_HEBREW_SURNAMES = {
  'cohen': 'כהן', 'kohen': 'כהן', 'koen': 'כהן',
  'levi': 'לוי', 'levy': 'לוי', 'levin': 'לוין',
  'mizrachi': 'מזרחי', 'mizrahi': 'מזרחי',
  'peretz': 'פרץ', 'perez': 'פרץ',
  'biton': 'ביטון', 'bitton': 'ביטון',
  'dahan': 'דהן', 'dhan': 'דהן',
  'abraham': 'אברהם', 'abrahami': 'אברהמי',
  'friedman': 'פרידמן', 'freedman': 'פרידמן',
  'shalom': 'שלום', 'shlomo': 'שלמה',
  'golan': 'גולן', 'alon': 'אלון',
  'ben-david': 'בן דוד', 'bendavid': 'בן דוד',
  'yosef': 'יוסף', 'joseph': 'יוסף',
  'chaim': 'חיים', 'haim': 'חיים', 'hayim': 'חיים',
  'rosenberg': 'רוזנברג', 'shapira': 'שפירא', 'shapiro': 'שפירא',
  'israeli': 'ישראלי', 'goldberg': 'גולדברג', 'green': 'גרין',
  'akiva': 'עקיבא', 'david': 'דוד'
};

/**
 * Departments with full structure (Story 6.5)
 */
const DEPARTMENT_DATA = [
  { id: 'dev', name: 'פיתוח', nameEn: 'Development' },
  { id: 'product', name: 'מוצר', nameEn: 'Product' },
  { id: 'marketing', name: 'שיווק', nameEn: 'Marketing' },
  { id: 'hr', name: 'משאבי אנוש', nameEn: 'HR' },
  { id: 'finance', name: 'כספים', nameEn: 'Finance' },
  { id: 'operations', name: 'תפעול', nameEn: 'Operations' }
];

// Simple department names array for backwards compatibility
const DEPARTMENTS = DEPARTMENT_DATA.map(d => d.name);

/**
 * Relationship options for referral form (Story 6.5)
 */
const RELATIONSHIP_OPTIONS = [
  { id: 'friend', name: 'חבר/ה קרוב/ה' },
  { id: 'colleague', name: 'קולגה מעבודה קודמת' },
  { id: 'professional', name: 'מכר/ה מקצועי/ת' },
  { id: 'other', name: 'אחר' }
];

/**
 * Gets Hebrew first name from English email part (Story 6.5)
 * @param {string} englishName - English name from email
 * @param {Function} random - Seeded random function
 * @returns {string} Hebrew first name
 */
function getHebrewFirstName(englishName, random) {
  const normalized = englishName.toLowerCase().replace(/[^a-z]/g, '');
  
  // Try direct mapping
  if (ENGLISH_TO_HEBREW_NAMES[normalized]) {
    return ENGLISH_TO_HEBREW_NAMES[normalized];
  }
  
  // Determine likely gender from name patterns
  const femalePatterns = /a$|ah$|it$|li$|ie$|y$/i;
  const isFemale = femalePatterns.test(normalized);
  
  // Fall back to random selection based on gender
  const names = isFemale ? HEBREW_FIRST_NAMES_FEMALE : HEBREW_FIRST_NAMES_MALE;
  return names[Math.floor(random() * names.length)];
}

/**
 * Gets Hebrew surname from English email part (Story 6.5)
 * @param {string} englishSurname - English surname from email
 * @param {Function} random - Seeded random function
 * @returns {string} Hebrew surname
 */
function getHebrewSurname(englishSurname, random) {
  const normalized = englishSurname.toLowerCase().replace(/[^a-z-]/g, '');
  
  // Try direct mapping
  if (ENGLISH_TO_HEBREW_SURNAMES[normalized]) {
    return ENGLISH_TO_HEBREW_SURNAMES[normalized];
  }
  
  // Fall back to random selection
  return HEBREW_LAST_NAMES[Math.floor(random() * HEBREW_LAST_NAMES.length)];
}

/**
 * Generates join date in the past 1-3 years (Story 6.5 AC1)
 * @param {Function} random - Seeded random function
 * @returns {string} ISO date string
 */
function generateJoinDate(random) {
  const now = new Date();
  const threeYearsAgo = new Date(now);
  threeYearsAgo.setFullYear(now.getFullYear() - 3);
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  // Random date between 1-3 years ago
  const range = oneYearAgo.getTime() - threeYearsAgo.getTime();
  const randomTime = threeYearsAgo.getTime() + (random() * range);
  return new Date(randomTime).toISOString().split('T')[0];
}

/**
 * Calculates months since a date (Story 6.5)
 * @param {string} dateStr - ISO date string
 * @returns {number} Number of months
 */
function getMonthsSince(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
  return Math.max(0, months);
}

/**
 * Calculates user level based on points (Story 6.5)
 * @param {number} points - Total points
 * @returns {Object} Level info with level number, name, next threshold, and progress
 */
function calculateLevelInfo(points) {
  if (points >= 5000) return { level: 5, name: 'אגדה', next: null, progress: 100 };
  if (points >= 2000) return { level: 4, name: 'אלוף', next: 5000, progress: ((points - 2000) / 3000) * 100 };
  if (points >= 750) return { level: 3, name: 'מומחה', next: 2000, progress: ((points - 750) / 1250) * 100 };
  if (points >= 250) return { level: 2, name: 'פעיל', next: 750, progress: ((points - 250) / 500) * 100 };
  return { level: 1, name: 'מתחיל', next: 250, progress: (points / 250) * 100 };
}

/**
 * Generates mock referrals array with proper position linking (Story 6.5 AC3)
 * @param {Function} random - Seeded random function
 * @param {number} count - Number of referrals to generate (3-8)
 * @param {string} joinDate - User's join date to bound referral dates
 * @returns {Array} Mock referrals with timelines
 */
function generateMockReferrals(random, count, joinDate) {
  const CANDIDATE_FIRST_NAMES = [...HEBREW_FIRST_NAMES_MALE, ...HEBREW_FIRST_NAMES_FEMALE];
  const CANDIDATE_LAST_NAMES = [...HEBREW_LAST_NAMES];
  const RELATIONSHIPS = ['חבר/ה קרוב/ה', 'קולגה מעבודה קודמת', 'מכר/ה מקצועי/ת', 'אחר'];
  
  const referrals = [];
  const usedPositionIds = new Set();
  
  // Status distribution to ensure variety (AC3 requirements)
  // At least 1 each of: submitted, review, interview, hired
  // rejected only if 5+ referrals
  const statusDistribution = [];
  if (count >= 1) statusDistribution.push('submitted');
  if (count >= 2) statusDistribution.push('review');
  if (count >= 3) statusDistribution.push('interview');
  if (count >= 4) statusDistribution.push('hired');
  if (count >= 5) statusDistribution.push('rejected');
  
  // Fill remaining slots with weighted random statuses
  while (statusDistribution.length < count) {
    const r = random();
    if (r < 0.25) statusDistribution.push('submitted');
    else if (r < 0.45) statusDistribution.push('review');
    else if (r < 0.65) statusDistribution.push('interview');
    else if (r < 0.80) statusDistribution.push('offer');
    else if (r < 0.92) statusDistribution.push('hired');
    else statusDistribution.push('rejected');
  }
  
  // Shuffle the status distribution
  for (let i = statusDistribution.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [statusDistribution[i], statusDistribution[j]] = [statusDistribution[j], statusDistribution[i]];
  }
  
  const joinDateObj = new Date(joinDate);
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const firstName = CANDIDATE_FIRST_NAMES[Math.floor(random() * CANDIDATE_FIRST_NAMES.length)];
    const lastName = CANDIDATE_LAST_NAMES[Math.floor(random() * CANDIDATE_LAST_NAMES.length)];
    const status = statusDistribution[i];
    
    // Pick a position from MOCK_POSITIONS (avoid duplicates when possible)
    let positionIndex;
    const availableIndices = [];
    for (let p = 0; p < MOCK_POSITIONS.length; p++) {
      if (!usedPositionIds.has(p)) availableIndices.push(p);
    }
    if (availableIndices.length > 0) {
      positionIndex = availableIndices[Math.floor(random() * availableIndices.length)];
      usedPositionIds.add(positionIndex);
    } else {
      positionIndex = Math.floor(random() * MOCK_POSITIONS.length);
    }
    const position = MOCK_POSITIONS[positionIndex];
    
    // Generate submission date: between join date and now
    const maxDaysAgo = Math.floor((now - joinDateObj) / (1000 * 60 * 60 * 24));
    const daysAgo = Math.floor(random() * Math.min(maxDaysAgo, 365));
    const submittedDate = new Date(now);
    submittedDate.setDate(submittedDate.getDate() - daysAgo);
    
    // Generate progressive timeline based on status
    const timeline = generateReferralTimeline(submittedDate, status, random);
    
    // Calculate points earned from timeline
    let pointsEarned = 0;
    timeline.forEach(entry => { pointsEarned += entry.points || 0; });
    
    // Calculate potential points (what can still be earned)
    let potentialPoints = 0;
    if (status !== 'hired' && status !== 'rejected') {
      const remaining = ['submitted', 'review', 'interview', 'offer', 'hired'];
      const currentIdx = remaining.indexOf(status);
      if (currentIdx < remaining.length - 1) {
        // Sum of remaining stages
        potentialPoints = 500; // Hired bonus still available
        if (status === 'submitted' || status === 'review') potentialPoints += 100; // Interview bonus
      }
    }
    
    const referralId = `ref-${(1000 + i).toString().padStart(4, '0')}`;
    
    const referral = {
      id: referralId,
      candidateName: `${firstName} ${lastName}`,
      candidateEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      candidatePhone: `05${Math.floor(random() * 10)}-${Math.floor(random() * 9000000 + 1000000)}`,
      relationship: RELATIONSHIPS[Math.floor(random() * RELATIONSHIPS.length)],
      positionId: position.id,
      positionTitle: position.title,
      positionDepartment: position.department,
      status: status,
      submittedAt: submittedDate.toISOString(),
      updatedAt: timeline[timeline.length - 1]?.date ? 
        new Date(timeline[timeline.length - 1].date).toISOString() : 
        submittedDate.toISOString(),
      timeline: timeline,
      pointsEarned: pointsEarned,
      potentialPoints: potentialPoints,
      // For backwards compatibility
      position: position.title,
      submittedDate: submittedDate.toISOString().split('T')[0],
      points: pointsEarned
    };
    
    // Add milestones for hired referrals
    if (status === 'hired' && timeline.length > 0) {
      const hiredEntry = timeline.find(t => t.status === 'hired');
      if (hiredEntry) {
        const hiredDate = new Date(hiredEntry.date);
        const threeMonths = new Date(hiredDate);
        threeMonths.setMonth(threeMonths.getMonth() + 3);
        const sixMonths = new Date(hiredDate);
        sixMonths.setMonth(sixMonths.getMonth() + 6);
        referral.milestones = {
          threeMonth: threeMonths.toISOString().split('T')[0],
          sixMonth: sixMonths.toISOString().split('T')[0]
        };
      }
    }
    
    // Add rejection reason for rejected referrals
    if (status === 'rejected') {
      const reasons = [
        'לא עמד בדרישות הניסיון הטכני',
        'לא התאים לתרבות הארגונית',
        'המשרה אוישה על ידי מועמד אחר',
        'ביטל את המועמדות'
      ];
      referral.rejectionReason = reasons[Math.floor(random() * reasons.length)];
    }
    
    referrals.push(referral);
  }
  
  // Sort by submission date (newest first)
  referrals.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  
  return referrals;
}

/**
 * Generates a progressive timeline for a referral (Story 6.5 AC3)
 * Timeline dates are 3-14 days apart
 * @param {Date} submittedDate - Initial submission date
 * @param {string} finalStatus - Current/final status
 * @param {Function} random - Seeded random function
 * @returns {Array} Timeline entries with status, date, and points
 */
function generateReferralTimeline(submittedDate, finalStatus, random) {
  const statusOrder = ['submitted', 'review', 'interview', 'offer', 'hired'];
  const statusPoints = { submitted: 50, review: 0, interview: 100, offer: 0, hired: 500 };
  
  const timeline = [];
  let currentDate = new Date(submittedDate);
  
  // Always add submitted
  timeline.push({
    status: 'submitted',
    date: currentDate.toISOString().split('T')[0],
    points: statusPoints.submitted
  });
  
  if (finalStatus === 'rejected') {
    // For rejected: submitted -> review -> rejected
    currentDate.setDate(currentDate.getDate() + Math.floor(random() * 11) + 3); // 3-14 days
    timeline.push({
      status: 'review',
      date: currentDate.toISOString().split('T')[0],
      points: 0
    });
    currentDate.setDate(currentDate.getDate() + Math.floor(random() * 11) + 3);
    timeline.push({
      status: 'rejected',
      date: currentDate.toISOString().split('T')[0],
      points: 0
    });
    return timeline;
  }
  
  // Build timeline up to final status
  const finalIdx = statusOrder.indexOf(finalStatus);
  
  for (let i = 1; i <= finalIdx; i++) {
    const status = statusOrder[i];
    currentDate.setDate(currentDate.getDate() + Math.floor(random() * 11) + 3); // 3-14 days apart
    
    timeline.push({
      status: status,
      date: currentDate.toISOString().split('T')[0],
      points: statusPoints[status] || 0
    });
  }
  
  return timeline;
}

/**
 * Generates mock stamps based on referral history (Story 6.5 AC4)
 * @param {Function} random - Seeded random function
 * @param {Array} referrals - User's referrals array
 * @param {string} joinDate - User's join date
 * @returns {Array} Array of stamp objects
 */
function generateMockStamps(random, referrals, joinDate) {
  const stamps = [];
  const now = new Date();
  const joinDateObj = new Date(joinDate);
  let stampIdCounter = 1;
  
  // Helper to create stamp
  const createStamp = (type, date, referralId = null, extraPoints = 0) => {
    const config = STAMP_TYPES[type];
    if (!config) return null;
    
    return {
      id: `stamp-${stampIdCounter++}`,
      type: type,
      label: config.label,
      points: config.points + extraPoints,
      earnedDate: date,
      referralId: referralId,
      color: config.color,
      shape: config.shape,
      icon: config.icon,
      isNew: false
    };
  };
  
  // 1. First Referral stamp (exactly 1, AC4)
  if (referrals.length > 0) {
    // Find earliest referral
    const sortedReferrals = [...referrals].sort((a, b) => 
      new Date(a.submittedAt) - new Date(b.submittedAt)
    );
    const firstReferral = sortedReferrals[0];
    const firstStamp = createStamp('first', firstReferral.submittedAt, firstReferral.id);
    if (firstStamp) stamps.push(firstStamp);
  }
  
  // 2. Generate stamps from referrals
  referrals.forEach(referral => {
    // Submitted stamp for each referral
    const submittedStamp = createStamp('submitted', referral.submittedAt, referral.id);
    if (submittedStamp) stamps.push(submittedStamp);
    
    // Interview stamp if reached interview stage
    const interviewEntry = referral.timeline?.find(t => t.status === 'interview');
    if (interviewEntry) {
      const interviewStamp = createStamp('interview', interviewEntry.date, referral.id);
      if (interviewStamp) stamps.push(interviewStamp);
    }
    
    // Hired stamp if hired
    const hiredEntry = referral.timeline?.find(t => t.status === 'hired');
    if (hiredEntry) {
      const hiredStamp = createStamp('hired', hiredEntry.date, referral.id);
      if (hiredStamp) stamps.push(hiredStamp);
      
      // Milestone stamps for hired referrals
      if (referral.milestones) {
        // 3-month milestone
        const threeMonthDate = new Date(referral.milestones.threeMonth);
        if (threeMonthDate <= now) {
          const milestone3Stamp = createStamp('milestone3m', referral.milestones.threeMonth, referral.id);
          if (milestone3Stamp) stamps.push(milestone3Stamp);
        }
        
        // 6-month milestone
        const sixMonthDate = new Date(referral.milestones.sixMonth);
        if (sixMonthDate <= now) {
          const milestone6Stamp = createStamp('milestone6m', referral.milestones.sixMonth, referral.id);
          if (milestone6Stamp) stamps.push(milestone6Stamp);
        }
      }
    }
  });
  
  // 3. Campaign stamps (0-2, random for users with tenure)
  const tenureMonths = getMonthsSince(joinDate);
  if (tenureMonths >= 6 && random() > 0.4) {
    // Add 1-2 campaign stamps for longer-tenure users
    const campaignCount = random() > 0.5 ? 2 : 1;
    for (let i = 0; i < campaignCount; i++) {
      // Random date between join and now
      const randomDays = Math.floor(random() * Math.min(tenureMonths * 30, 365));
      const campaignDate = new Date(now);
      campaignDate.setDate(campaignDate.getDate() - randomDays);
      
      const campaignStamp = createStamp('campaign', campaignDate.toISOString());
      if (campaignStamp) stamps.push(campaignStamp);
    }
  }
  
  // 4. Streak stamp (0-1, for active users)
  const submittedCount = referrals.filter(r => 
    new Date(r.submittedAt) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  if (submittedCount >= 3 && random() > 0.3) {
    // Recent streak - add streak stamp
    const streakDate = new Date(now);
    streakDate.setDate(streakDate.getDate() - Math.floor(random() * 14));
    const streakStamp = createStamp('streak', streakDate.toISOString());
    if (streakStamp) stamps.push(streakStamp);
  }
  
  // Sort stamps by date (newest first)
  stamps.sort((a, b) => new Date(b.earnedDate) - new Date(a.earnedDate));
  
  // Ensure we have 5-15 stamps (AC4)
  // If too few, we can add more submitted stamps for variety
  // If too many, we'll trim (but our generation should be balanced)
  
  return stamps;
}

/**
 * Gets the days offset from submission for each status
 * @param {string} status - Referral status
 * @param {Function} random - Seeded random function
 * @returns {number} Days offset
 */
function getStatusDaysOffset(status, random) {
  const offsets = {
    'submitted': 0,
    'review': Math.floor(random() * 7) + 3,        // 3-10 days
    'interview': Math.floor(random() * 14) + 10,   // 10-24 days
    'offer': Math.floor(random() * 21) + 24,       // 24-45 days
    'hired': Math.floor(random() * 30) + 45,       // 45-75 days
    'rejected': Math.floor(random() * 21) + 14     // 14-35 days
  };
  return offsets[status] || 0;
}

/**
 * Generates activity items from referrals array
 * @param {Array} referrals - User's referrals
 * @param {Function} random - Seeded random function
 * @returns {Array} Activity items sorted by timestamp (newest first)
 */
function generateActivitiesFromReferrals(referrals, random) {
  const activities = [];
  
  const STATUS_TO_ACTIVITY = {
    'submitted': {
      type: ACTIVITY_TYPES.REFERRAL_SUBMITTED,
      descTemplate: '{{name}} הוגש/ה למשרת {{position}}',
      points: 50,
      icon: 'ti-send',
      iconColor: 'primary'
    },
    'review': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} נמצא/ת בבדיקה',
      points: 0,
      icon: 'ti-eye',
      iconColor: 'info'
    },
    'interview': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} עבר/ה לשלב ראיון',
      points: 100,
      icon: 'ti-calendar-event',
      iconColor: 'warning'
    },
    'offer': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} קיבל/ה הצעת עבודה',
      points: 0,
      icon: 'ti-file-text',
      iconColor: 'info'
    },
    'hired': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} גויס/ה בהצלחה!',
      points: 500,
      icon: 'ti-trophy',
      iconColor: 'success'
    },
    'rejected': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} לא נבחר/ה להמשך',
      points: 0,
      icon: 'ti-x',
      iconColor: 'error'
    }
  };
  
  referrals.forEach(referral => {
    const config = STATUS_TO_ACTIVITY[referral.status];
    if (!config) return;
    
    // Create activity for current status
    const description = config.descTemplate
      .replace('{{name}}', referral.candidateName)
      .replace('{{position}}', referral.position);
    
    // Generate timestamp relative to submitted date
    const statusDate = new Date(referral.submittedDate);
    const daysOffset = getStatusDaysOffset(referral.status, random);
    statusDate.setDate(statusDate.getDate() + daysOffset);
    
    activities.push({
      id: `act-${referral.id}-${referral.status}`,
      type: config.type,
      description: description,
      points: config.points,
      timestamp: statusDate.toISOString(),
      referralId: referral.id,
      icon: config.icon,
      iconColor: config.iconColor
    });
    
    // Add points activity if points > 0
    if (config.points > 0) {
      activities.push({
        id: `act-${referral.id}-points-${referral.status}`,
        type: ACTIVITY_TYPES.POINTS_EARNED,
        description: `הרווחת ${config.points} נקודות`,
        points: config.points,
        timestamp: new Date(statusDate.getTime() + 1000).toISOString(), // 1 second after
        referralId: referral.id,
        icon: 'ti-star',
        iconColor: 'primary'
      });
    }
  });
  
  // Sort by timestamp descending (newest first)
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return activities;
}

/**
 * Formats a timestamp as a relative time string in Hebrew
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Relative time in Hebrew (e.g., "לפני 2 שעות")
 */
function formatRelativeTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffSeconds < 60) {
    return 'עכשיו';
  }
  
  if (diffMinutes < 60) {
    if (diffMinutes === 1) return 'לפני דקה';
    if (diffMinutes === 2) return 'לפני 2 דקות';
    return `לפני ${diffMinutes} דקות`;
  }
  
  if (diffHours < 24) {
    if (diffHours === 1) return 'לפני שעה';
    if (diffHours === 2) return 'לפני שעתיים';
    return `לפני ${diffHours} שעות`;
  }
  
  if (diffDays === 1) {
    return 'אתמול';
  }
  
  if (diffDays === 2) {
    return 'לפני יומיים';
  }
  
  if (diffDays < 7) {
    return `לפני ${diffDays} ימים`;
  }
  
  if (diffWeeks === 1) {
    return 'לפני שבוע';
  }
  
  if (diffWeeks < 4) {
    return `לפני ${diffWeeks} שבועות`;
  }
  
  if (diffMonths === 1) {
    return 'לפני חודש';
  }
  
  if (diffMonths < 12) {
    return `לפני ${diffMonths} חודשים`;
  }
  
  // Fallback to date format for older items
  return date.toLocaleDateString('he-IL', { 
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Generates mock campaign data with dynamic dates (Story 6.5 AC5)
 * @param {Function} random - Seeded random function
 * @returns {Array} Array of campaign objects with valid date ranges
 */
function generateMockCampaigns(random) {
  const now = new Date();
  
  /**
   * Campaign templates with dynamic date generation
   * End dates are 7-30 days in the future as per AC5
   */
  const campaignTemplates = [
    {
      id: 'camp-001',
      name: 'סופר בולס מפתחים!',
      description: 'נקודות כפולות על כל הפניה לתפקידי פיתוח! הזדמנות מוגבלת בזמן.',
      multiplier: 2,
      eligibleDepartments: ['פיתוח'],
      eligiblePositionIds: ['pos-001', 'pos-006', 'pos-009', 'pos-011'],
      badgeColor: 'primary',
      icon: 'ti-code',
      badgeText: '<i class="ti ti-gift" aria-hidden="true"></i> x2 נקודות!',
      accentColor: '#6C5CE7'
    },
    {
      id: 'camp-002',
      name: '🚀 מבצע שיווק!',
      description: 'בונוס x1.5 על כל הפניה למשרות שיווק. הזמן רץ!',
      multiplier: 1.5,
      eligibleDepartments: ['שיווק'],
      eligiblePositionIds: ['pos-003', 'pos-012'],
      badgeColor: 'success',
      icon: 'ti-speakerphone',
      badgeText: '<i class="ti ti-bolt" aria-hidden="true"></i> x1.5 נקודות!',
      accentColor: '#00B894'
    },
    {
      id: 'camp-003',
      name: 'שבוע הבונוסים',
      description: 'כל הפניה שווה בונוס! לא משנה לאיזו משרה.',
      multiplier: 1.5,
      eligibleDepartments: [], // All departments
      eligiblePositionIds: [], // All positions
      badgeColor: 'warning',
      icon: 'ti-stars',
      badgeText: '<i class="ti ti-sparkles" aria-hidden="true"></i> בונוס מיוחד!',
      accentColor: '#F39C12'
    }
  ];
  
  // Generate campaigns with dynamic dates
  const campaigns = campaignTemplates.map(template => {
    // Start date: 5-15 days ago
    const startDaysAgo = Math.floor(random() * 10) + 5;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - startDaysAgo);
    startDate.setHours(0, 0, 0, 0);
    
    // End date: 7-30 days in the future (AC5 requirement)
    const endDaysFromNow = Math.floor(random() * 23) + 7;
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + endDaysFromNow);
    endDate.setHours(23, 59, 59, 999);
    
    return {
      ...template,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
      // Helper for countdown display
      daysRemaining: endDaysFromNow,
      // Helper for eligible position count
      positionCount: template.eligiblePositionIds.length || MOCK_POSITIONS.length
    };
  });
  
  // Always return at least 1 campaign, sometimes 2 (AC5)
  const numActive = random() > 0.3 ? 2 : 1;
  
  // Shuffle and return the selected campaigns
  const shuffled = campaigns.sort(() => random() - 0.5);
  return shuffled.slice(0, numActive);
}

/**
 * Generates a complete user object from email using seeded random (Story 6.5 AC1)
 * Same email always produces identical user data (deterministic)
 * @param {string} email - User email (e.g., firstname.lastname@passportcard.co.il)
 * @returns {Object} Generated user object with referrals, stamps, activities
 */
function generateUserFromEmail(email) {
  const random = seededRandom(email);
  
  // Parse email to extract name parts
  const [namePart] = email.split('@');
  const nameParts = namePart.split('.');
  const englishFirstName = nameParts[0] || '';
  const englishLastName = nameParts[1] || nameParts[0];
  
  // Generate Hebrew name from email parts (AC1)
  const hebrewFirstName = getHebrewFirstName(englishFirstName, random);
  const hebrewLastName = getHebrewSurname(englishLastName, random);
  
  // Generate join date: 1-3 years ago (AC1)
  const joinDate = generateJoinDate(random);
  const tenureMonths = getMonthsSince(joinDate);
  
  // Generate department (AC1)
  const department = DEPARTMENTS[Math.floor(random() * DEPARTMENTS.length)];
  
  // Generate mock referrals (3-8 per user, AC1)
  const referralCount = Math.floor(random() * 6) + 3;
  const referrals = generateMockReferrals(random, referralCount, joinDate);
  
  // Generate stamps from referral history (5-15 stamps, AC1)
  const stamps = generateMockStamps(random, referrals, joinDate);
  
  // Calculate total points from stamps (AC1 - points come from stamps)
  const totalPoints = stamps.reduce((sum, stamp) => sum + (stamp.points || 0), 0);
  
  // Get level info based on calculated points
  const levelInfo = calculateLevelInfo(totalPoints);
  
  // Generate activities from referrals
  const activities = generateActivitiesFromReferrals(referrals, random);
  
  // Generate campaigns (Story 2.4)
  const campaigns = generateMockCampaigns(random);
  
  // Generate user ID (deterministic from email)
  const userId = `usr-${Math.floor(random() * 10000).toString().padStart(4, '0')}`;
  
  return {
    id: userId,
    email: email,
    firstName: hebrewFirstName,
    lastName: hebrewLastName,
    fullName: `${hebrewFirstName} ${hebrewLastName}`,
    department: department,
    points: totalPoints,
    level: levelInfo.name,
    levelInfo: levelInfo,
    joinDate: joinDate,
    avatarInitial: hebrewFirstName[0],
    referrals: referrals,
    stamps: stamps,
    activities: activities,
    campaigns: campaigns,
    preferences: {
      notifications: true
    }
  };
}

/**
 * OTPModalComponent - OTP verification modal with 6-digit input
 * Implements: AC1-AC9 (OTP Modal functionality)
 */
class OTPModalComponent extends Component {
  constructor() {
    super();
    this._otpValues = ['', '', '', '', '', ''];
    this._isVerifying = false;
    this._hasError = false;
    this._errorMessage = '';
    this._resendCountdown = 0;
    this._resendTimer = null;
    this._isSuccess = false;
    this._boundKeyHandler = null;
  }

  /**
   * Returns the OTP modal HTML template
   * @returns {string} HTML string
   */
  template() {
    const email = stateManager.getState('pendingEmail') || '';
    const maskedEmail = this._maskEmail(email);
    // Story 7.4: Generate deterministic phone number from email
    const phoneNumber = generatePhoneNumber(email);
    const maskedPhone = maskPhoneNumber(phoneNumber);

    return `
      <div class="otp-modal-overlay" data-action="close-otp-overlay">
        <div class="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">
          <button class="otp-modal__close" data-action="close-otp" aria-label="סגור">
            <i class="ti ti-x"></i>
          </button>
          
          <div class="otp-modal__header">
            <div class="otp-modal__icon ${this._isSuccess ? 'otp-modal__icon--success' : ''}">
              <i class="ti ${this._isSuccess ? 'ti-check otp-success-icon' : 'ti-device-mobile'}"></i>
            </div>
            <h2 id="otp-title" class="otp-modal__title">${this._isSuccess ? 'אימות הצליח!' : 'אימות קוד'}</h2>
            <p class="otp-modal__subtitle">
              ${this._isSuccess 
                ? 'מעביר אותך לדשבורד...' 
                : `קוד אימות נשלח לנייד שלך`}
            </p>
            ${!this._isSuccess ? `
            <p class="otp-modal__phone" dir="ltr">${maskedPhone}</p>
            ` : ''}
          </div>
          
          ${!this._isSuccess ? `
          <div class="otp-inputs ${this._hasError ? 'otp-inputs--error' : ''}" dir="ltr">
            ${this._renderOTPInputs()}
          </div>
          
          <div class="otp-error" aria-live="polite" role="alert">
            ${this._errorMessage}
          </div>
          
          <button 
            type="button"
            class="btn btn--primary btn--full otp-verify-btn ${this._isVerifying ? 'btn--loading' : ''}"
            data-action="verify-otp"
            ${!this._isOTPComplete() || this._isVerifying ? 'disabled' : ''}
          >
            ${this._isVerifying 
              ? '<span class="spinner" aria-hidden="true"></span> מאמת...' 
              : 'אימות'}
          </button>
          
          <div class="otp-resend">
            ${this._resendCountdown > 0 
              ? `<span class="otp-resend--disabled">שלח שוב (${this._resendCountdown})</span>`
              : '<a href="#" data-action="resend-otp" class="otp-resend__link">שלח שוב</a>'}
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Renders the 6 OTP input boxes
   * @returns {string} HTML string for inputs
   */
  _renderOTPInputs() {
    return this._otpValues.map((value, index) => `
      <input
        type="text"
        inputmode="numeric"
        pattern="[0-9]"
        maxlength="1"
        class="otp-input ${this._isSuccess ? 'otp-input--success' : ''}"
        data-index="${index}"
        data-otp-input="true"
        value="${value}"
        aria-label="ספרה ${index + 1} מתוך 6"
        autocomplete="one-time-code"
        ${this._isVerifying ? 'disabled' : ''}
      >
    `).join('');
  }

  /**
   * Masks email for display (e.g., y***@passportcard...)
   * @param {string} email - Full email
   * @returns {string} Masked email
   */
  _maskEmail(email) {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    const firstChar = localPart[0];
    return `${firstChar}***@${domain.substring(0, 12)}...`;
  }

  /**
   * Checks if all 6 OTP digits are entered
   * @returns {boolean} True if complete
   */
  _isOTPComplete() {
    return this._otpValues.every(v => v !== '');
  }

  /**
   * Called after component is mounted to DOM
   */
  mount() {
    super.mount();
    this._setupInputHandlers();
    this._focusFirstInput();
    this._startResendCountdown();
    this._setupKeyboardHandlers();
  }

  /**
   * Called before component is removed from DOM
   */
  unmount() {
    if (this._resendTimer) {
      clearInterval(this._resendTimer);
      this._resendTimer = null;
    }
    if (this._boundKeyHandler) {
      document.removeEventListener('keydown', this._boundKeyHandler);
      this._boundKeyHandler = null;
    }
    super.unmount();
  }

  /**
   * Sets up input handlers for OTP boxes
   */
  _setupInputHandlers() {
    const inputs = this._getOTPInputs();
    
    inputs.forEach((input, index) => {
      // Handle input
      input.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length > 0) {
          this._otpValues[index] = value[0];
          e.target.value = value[0];
          
          // Auto-advance to next
          if (index < 5) {
            inputs[index + 1].focus();
          }
        } else {
          this._otpValues[index] = '';
        }
        
        this._updateVerifyButton();
      });
      
      // Handle keydown for backspace navigation
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          this._otpValues[index - 1] = '';
          inputs[index - 1].value = '';
          inputs[index - 1].focus();
        }
      });
      
      // Handle paste
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData)
          .getData('text')
          .replace(/[^0-9]/g, '')
          .slice(0, 6);
        
        if (pastedData.length === 6) {
          pastedData.split('').forEach((digit, i) => {
            this._otpValues[i] = digit;
            if (inputs[i]) {
              inputs[i].value = digit;
            }
          });
          inputs[5].focus();
          this._updateVerifyButton();
        }
      });
    });
  }

  /**
   * Gets all OTP input elements
   * @returns {NodeList} OTP input elements
   */
  _getOTPInputs() {
    const modalContainer = document.getElementById('modal-container');
    return modalContainer?.querySelectorAll('.otp-input') || [];
  }

  /**
   * Gets a single element from modal container
   * @param {string} selector - CSS selector
   * @returns {Element|null} Element or null
   */
  _$(selector) {
    const modalContainer = document.getElementById('modal-container');
    return modalContainer?.querySelector(selector) || null;
  }

  /**
   * Focuses the first OTP input
   */
  _focusFirstInput() {
    const firstInput = this._$('.otp-input[data-index="0"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  /**
   * Updates verify button disabled state
   */
  _updateVerifyButton() {
    const verifyBtn = this._$('.otp-verify-btn');
    if (verifyBtn) {
      verifyBtn.disabled = !this._isOTPComplete() || this._isVerifying;
    }
  }

  /**
   * Starts the resend countdown timer (45 seconds)
   */
  _startResendCountdown() {
    this._resendCountdown = 45;
    this._updateResendDisplay();
    
    this._resendTimer = setInterval(() => {
      this._resendCountdown--;
      this._updateResendDisplay();
      
      if (this._resendCountdown <= 0) {
        clearInterval(this._resendTimer);
        this._resendTimer = null;
      }
    }, 1000);
  }

  /**
   * Updates the resend link display
   */
  _updateResendDisplay() {
    const resendContainer = this._$('.otp-resend');
    if (resendContainer) {
      resendContainer.innerHTML = this._resendCountdown > 0
        ? `<span class="otp-resend--disabled">שלח שוב (${this._resendCountdown})</span>`
        : '<a href="#" data-action="resend-otp" class="otp-resend__link">שלח שוב</a>';
    }
  }

  /**
   * Sets up keyboard handlers (ESC to close, Tab trap)
   */
  _setupKeyboardHandlers() {
    this._boundKeyHandler = this._handleKeydown.bind(this);
    document.addEventListener('keydown', this._boundKeyHandler);
  }

  /**
   * Handles keydown events
   * @param {KeyboardEvent} e - Keydown event
   */
  _handleKeydown(e) {
    // ESC to close
    if (e.key === 'Escape') {
      this._closeModal();
      return;
    }
    
    // Tab focus trap
    if (e.key === 'Tab') {
      const modalContainer = document.getElementById('modal-container');
      const focusableElements = modalContainer?.querySelectorAll(
        'button:not([disabled]), input:not([disabled])'
      ) || [];
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Verifies the entered OTP code
   */
  async verifyOTP() {
    if (!this._isOTPComplete() || this._isVerifying) return;
    
    this._isVerifying = true;
    this._hasError = false;
    this._errorMessage = '';
    this._updateUI();
    
    // Simulate verification delay (1.5-2 seconds)
    const delay = 1500 + Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const enteredOTP = this._otpValues.join('');
    
    if (enteredOTP === CONFIG.OTP_CODE) {
      await this._handleSuccess();
    } else {
      this._handleError();
    }
  }

  /**
   * Handles successful OTP verification
   */
  async _handleSuccess() {
    // Show success state
    this._isSuccess = true;
    this._isVerifying = false;
    this._updateUI();
    
    // Generate user from email
    const email = stateManager.getState('pendingEmail');
    const user = generateUserFromEmail(email);
    
    // Update state - include referrals, stamps, activities, and campaigns from generated user (Story 6.5)
    stateManager.setState({
      currentUser: user,
      isAuthenticated: true,
      sessionToken: `session_${Date.now()}`,
      referrals: user.referrals,
      stamps: user.stamps,
      activities: user.activities,
      campaigns: user.campaigns,
      pendingEmail: null
    });
    
    // Brief delay to show success, then redirect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Close modal and navigate
    stateManager.setState({ activeModal: null });
    router.navigate('passport');
  }

  /**
   * Handles incorrect OTP entry
   */
  _handleError() {
    this._isVerifying = false;
    this._hasError = true;
    this._errorMessage = 'קוד שגוי, נסה שוב';
    this._updateUI();
    
    // Remove error state after animation
    setTimeout(() => {
      this._hasError = false;
      // Clear inputs
      this._otpValues = ['', '', '', '', '', ''];
      this._updateUI();
      this._focusFirstInput();
    }, 400);
  }

  /**
   * Handles resend OTP action
   */
  handleResend() {
    if (this._resendCountdown > 0) return;
    
    // Restart countdown
    this._startResendCountdown();
    
    // In a real app, this would trigger OTP resend API
    console.log('OTP resent to:', stateManager.getState('pendingEmail'));
  }

  /**
   * Closes the OTP modal
   */
  _closeModal() {
    // Clear the modal but preserve pendingEmail for retry
    stateManager.setState({ activeModal: null });
  }

  /**
   * Re-renders the modal UI
   */
  _updateUI() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.innerHTML = this.template();
      
      if (!this._isSuccess) {
        this._setupInputHandlers();
        
        // Restore OTP values in inputs
        const inputs = this._getOTPInputs();
        this._otpValues.forEach((value, index) => {
          if (inputs[index]) {
            inputs[index].value = value;
          }
        });
      }
    }
  }
}

/* ============================================================================
   SMS TOAST COMPONENT (Story 7.4)
   ============================================================================
   Top-positioned toast notification that simulates receiving an SMS with OTP code.
   Slides down from top, auto-dismisses after 10 seconds, respects reduced motion.
   ========================================================================== */

/**
 * SMSToastComponent - SMS-style notification showing OTP code (Story 7.4 AC#2)
 * Displays a top-positioned toast that looks like a phone SMS notification
 */
class SMSToastComponent extends Component {
  constructor(props = {}) {
    super(props);
    this.otpCode = props.otpCode || CONFIG.OTP_CODE;
    this.autoCloseDelay = props.autoCloseDelay || 10000;
    this._dismissTimer = null;
    this._animationTimer = null;
  }

  /**
   * Returns the SMS toast HTML template
   * @returns {string} HTML string
   */
  template() {
    return `
      <div class="sms-toast sms-toast--entering" role="alert" aria-live="polite">
        <div class="sms-toast__icon">
          <i class="ti ti-message-2" aria-hidden="true"></i>
        </div>
        <div class="sms-toast__content">
          <p class="sms-toast__title">קוד אימות נשלח</p>
          <p class="sms-toast__code sms-toast__code--pulse" dir="ltr">${this.otpCode}</p>
        </div>
        <button class="sms-toast__close" data-action="close-sms-toast" aria-label="סגור הודעה">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }

  /**
   * Mount lifecycle - starts auto-dismiss timer
   */
  mount() {
    super.mount();
    
    // Remove entering class after animation completes
    this._animationTimer = setTimeout(() => {
      const toast = this.element?.querySelector('.sms-toast');
      if (toast) {
        toast.classList.remove('sms-toast--entering');
      }
    }, 300);
    
    // Start auto-dismiss timer
    this._dismissTimer = setTimeout(() => {
      this.dismiss();
    }, this.autoCloseDelay);
  }

  /**
   * Unmount lifecycle - clears timers
   */
  unmount() {
    if (this._dismissTimer) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }
    if (this._animationTimer) {
      clearTimeout(this._animationTimer);
      this._animationTimer = null;
    }
    super.unmount();
  }

  /**
   * Dismiss the toast with slide-up animation
   */
  dismiss() {
    const toast = this.element?.querySelector('.sms-toast');
    if (toast) {
      toast.classList.add('sms-toast--leaving');
      
      // Wait for animation, then remove from DOM
      setTimeout(() => {
        if (this.element) {
          this.element.remove();
        }
      }, 200);
    }
    
    // Clear timers
    if (this._dismissTimer) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }
  }
}

// Global reference for SMS toast instance
let _currentSMSToast = null;

/**
 * Shows the SMS toast notification (Story 7.4 AC#2)
 * Creates toast container if needed and mounts the component
 */
function showSMSToast() {
  // Remove existing toast if present
  if (_currentSMSToast) {
    _currentSMSToast.dismiss();
    _currentSMSToast = null;
  }
  
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('sms-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'sms-toast-container';
    document.body.appendChild(toastContainer);
    
    // Add event delegation for toast actions
    toastContainer.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (target && target.dataset.action === 'close-sms-toast') {
        e.preventDefault();
        dismissSMSToast();
      }
    });
  }
  
  // Create and mount the SMS toast
  _currentSMSToast = new SMSToastComponent({
    otpCode: CONFIG.OTP_CODE,
    autoCloseDelay: 10000
  });
  
  toastContainer.innerHTML = _currentSMSToast.render();
  _currentSMSToast.element = toastContainer.firstElementChild?.parentElement || toastContainer;
  _currentSMSToast.mount();
}

/**
 * Dismisses the current SMS toast if visible
 */
function dismissSMSToast() {
  if (_currentSMSToast) {
    _currentSMSToast.dismiss();
    _currentSMSToast = null;
  }
}

/* ============================================================================
   COMPONENTS - MAIN APP
   ============================================================================
   Dashboard, Passport, Positions, Referrals, Settings components
   ========================================================================== */

/* ============================================================================
   HOW TO EARN COMPONENT (Story 5.5)
   ============================================================================
   Modal showing points breakdown, active campaigns, and tips for earning more
   ========================================================================== */

/**
 * HowToEarnComponent - How to Earn More Points modal
 * Implements: AC1-AC18 (How to Earn More Section)
 */
class HowToEarnComponent extends Component {
  constructor(props) {
    super(props);
    this.campaigns = [];
    this._focusTrapHandler = null;
    this._escapeHandler = null;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    return `
      <div class="how-to-earn" role="dialog" aria-modal="true" aria-labelledby="how-to-earn-heading">
        <div class="how-to-earn__backdrop" data-action="close-how-to-earn"></div>
        <div class="how-to-earn__content">
          <header class="how-to-earn__header">
            <h2 class="how-to-earn__title" id="how-to-earn-heading">
              <span class="how-to-earn__icon">${renderIcon('target')}</span>
              איך להרוויח עוד נקודות
            </h2>
            <button class="how-to-earn__close" 
                    data-action="close-how-to-earn"
                    aria-label="סגור">
              <i class="ti ti-x" aria-hidden="true"></i>
            </button>
          </header>
          
          <div class="how-to-earn__body">
            ${this._renderPointsBreakdown()}
            ${this._renderCampaignsSection()}
            ${this._renderTipsSection()}
          </div>
          
          <footer class="how-to-earn__footer">
            ${this._renderCTAs()}
          </footer>
        </div>
      </div>
    `;
  }
  
  /**
   * Renders points breakdown section
   * @returns {string} HTML string
   */
  _renderPointsBreakdown() {
    return `
      <section class="how-to-earn__section" aria-labelledby="points-breakdown-heading">
        <h3 class="how-to-earn__section-title" id="points-breakdown-heading">
          <span class="how-to-earn__section-icon">${renderIcon('coins')}</span>
          נקודות לפי פעולה
        </h3>
        <ul class="points-breakdown" role="list">
          ${this._renderEarningOpportunities()}
        </ul>
      </section>
    `;
  }
  
  /**
   * Renders individual earning opportunity rows
   * @returns {string} HTML string
   */
  _renderEarningOpportunities() {
    // Order: submission flow first, then bonuses
    const opportunities = [
      { type: 'submitted', label: 'קו״ח הוגש', pointsLabel: '+50 נקודות' },
      { type: 'interview', label: 'ראיון נקבע', pointsLabel: '+100 נקודות' },
      { type: 'hired', label: 'גיוס מוצלח!', pointsLabel: '+500 נקודות' },
      { type: 'milestone3m', label: '3 חודשי עבודה', pointsLabel: '+200 נקודות' },
      { type: 'milestone6m', label: '6 חודשי עבודה', pointsLabel: '+400 נקודות' },
      { type: 'first', label: 'הפניה ראשונה (בונוס)', pointsLabel: '+100 נקודות' },
      { type: 'streak', label: 'רצף הפניות (3+)', pointsLabel: '+75 לכל הפניה' }
    ];
    
    return opportunities.map(opp => {
      const stampType = STAMP_TYPES[opp.type];
      return `
        <li class="points-breakdown__item" role="listitem">
          <span class="points-breakdown__icon" style="--stamp-color: ${stampType.color}">
            ${renderIcon(stampType.icon)}
          </span>
          <span class="points-breakdown__label">${opp.label}</span>
          <span class="points-breakdown__points">${opp.pointsLabel}</span>
        </li>
      `;
    }).join('');
  }
  
  /**
   * Renders campaigns section
   * @returns {string} HTML string
   */
  _renderCampaignsSection() {
    this.campaigns = this._getActiveCampaigns();
    
    return `
      <section class="how-to-earn__section" aria-labelledby="campaigns-section-heading">
        <h3 class="how-to-earn__section-title" id="campaigns-section-heading">
          <span class="how-to-earn__section-icon">${renderIcon('bolt')}</span>
          קמפיינים מיוחדים
        </h3>
        ${this.campaigns.length > 0 
          ? this._renderCampaignsList()
          : this._renderNoCampaigns()}
      </section>
    `;
  }
  
  /**
   * Gets active campaigns from mock data
   * @returns {Array} Active campaigns
   */
  _getActiveCampaigns() {
    const now = new Date();
    return MOCK_CAMPAIGNS.filter(campaign => {
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      return campaign.isActive && now >= start && now <= end;
    });
  }
  
  /**
   * Renders campaigns list
   * @returns {string} HTML string
   */
  _renderCampaignsList() {
    return `
      <ul class="campaigns-list" role="list">
        ${this.campaigns.map(campaign => `
          <li class="campaigns-list__item" 
              role="listitem"
              tabindex="0"
              data-action="view-campaign-positions-from-earn"
              data-campaign-id="${campaign.id}">
            <span class="campaigns-list__icon">${campaign.icon}</span>
            <span class="campaigns-list__title">${this._escapeHtml(campaign.title)}</span>
            <span class="campaigns-list__multiplier" style="--campaign-color: ${campaign.accentColor}">
              x${campaign.multiplier}
            </span>
            <i class="ti ti-chevron-left campaigns-list__arrow" aria-hidden="true"></i>
          </li>
        `).join('')}
      </ul>
    `;
  }
  
  /**
   * Renders empty campaigns state
   * @returns {string} HTML string
   */
  _renderNoCampaigns() {
    return `
      <div class="campaigns-empty-state">
        <p class="campaigns-empty-state__text">אין קמפיינים פעילים כרגע</p>
        <p class="campaigns-empty-state__subtext">עקבו אחר עדכונים בדשבורד</p>
      </div>
    `;
  }
  
  /**
   * Renders tips section
   * @returns {string} HTML string
   */
  _renderTipsSection() {
    const tips = [
      'הפנו מועמדים שאתם מכירים אישית',
      'ודאו שקורות החיים מעודכנים',
      'עקבו אחרי ההפניות שלכם',
      'נצלו קמפיינים מיוחדים'
    ];
    
    return `
      <section class="how-to-earn__section" aria-labelledby="tips-section-heading">
        <h3 class="how-to-earn__section-title" id="tips-section-heading">
          <span class="how-to-earn__section-icon">${renderIcon('bulb')}</span>
          טיפים להצלחה
        </h3>
        <ul class="tips-list" role="list">
          ${tips.map(tip => `
            <li class="tips-list__item" role="listitem">
              <i class="ti ti-check tips-list__check" aria-hidden="true"></i>
              <span class="tips-list__text">${tip}</span>
            </li>
          `).join('')}
        </ul>
      </section>
    `;
  }
  
  /**
   * Renders CTAs
   * @returns {string} HTML string
   */
  _renderCTAs() {
    return `
      <div class="how-to-earn__ctas">
        <button class="btn btn--primary btn--lg how-to-earn__cta-primary"
                data-action="navigate-to-positions-from-earn">
          צפה במשרות פתוחות
          <i class="ti ti-arrow-left" aria-hidden="true"></i>
        </button>
        ${this.campaigns.length > 0 ? `
          <button class="btn btn--ghost how-to-earn__cta-secondary"
                  data-action="navigate-to-campaigns">
            צפה בקמפיינים פעילים
          </button>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Escapes HTML entities for security
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  /**
   * Lifecycle: Mount component
   */
  mount() {
    // Trap focus within modal
    this._trapFocus();
    
    // Bind keyboard events
    this._bindKeyboardEvents();
    
    // Bind campaign item keyboard events
    this._bindCampaignKeyboard();
  }
  
  /**
   * Traps focus within the modal
   */
  _trapFocus() {
    const modal = document.querySelector('.how-to-earn__content');
    if (!modal) return;
    
    const focusableEls = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableEls.length === 0) return;
    
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    
    // Focus first element
    firstEl.focus();
    
    // Store reference for cleanup
    this._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    
    document.addEventListener('keydown', this._focusTrapHandler);
  }
  
  /**
   * Binds keyboard event handlers
   */
  _bindKeyboardEvents() {
    this._escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this._closeModal();
      }
    };
    
    document.addEventListener('keydown', this._escapeHandler);
  }
  
  /**
   * Binds keyboard events for campaign items
   */
  _bindCampaignKeyboard() {
    document.querySelectorAll('.campaigns-list__item').forEach(item => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }
  
  /**
   * Closes the modal
   */
  _closeModal() {
    const modal = document.querySelector('.how-to-earn');
    if (!modal) return;
    
    modal.classList.remove('how-to-earn--open');
    modal.classList.add('how-to-earn--closing');
    
    // Check reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) {
      modal.remove();
    } else {
      setTimeout(() => {
        modal.remove();
      }, 300); // Match CSS transition duration
    }
  }
  
  /**
   * Lifecycle: Unmount component
   */
  unmount() {
    // Remove event listeners
    if (this._focusTrapHandler) {
      document.removeEventListener('keydown', this._focusTrapHandler);
    }
    if (this._escapeHandler) {
      document.removeEventListener('keydown', this._escapeHandler);
    }
    
    super.unmount();
  }
}

/* ============================================================================
   CAMPAIGNS COMPONENT (Story 5.4)
   ============================================================================
   Active campaigns section with countdown timers and campaign cards
   ========================================================================== */

/**
 * CampaignsComponent - Active campaigns section with countdown timers
 * Implements: AC1-AC21 (Active Campaigns Section)
 */
class CampaignsComponent extends Component {
  constructor(props) {
    super(props);
    this.campaigns = [];
    this.countdownInterval = null;
  }
  
  /**
   * Main template for campaigns section
   * @returns {string} HTML string
   */
  template() {
    return `
      <section class="campaigns-section" aria-labelledby="campaigns-heading">
        <header class="campaigns-section__header">
          <h2 class="campaigns-section__title" id="campaigns-heading">
            <span class="campaigns-section__icon">${renderIcon('target')}</span>
            קמפיינים פעילים
          </h2>
        </header>
        <div class="campaigns-section__content">
          ${this.campaigns.length > 0 
            ? this._renderCampaignCards()
            : this._renderEmptyState()}
        </div>
      </section>
    `;
  }
  
  /**
   * Renders all campaign cards
   * @returns {string} HTML string
   */
  _renderCampaignCards() {
    // Sort by end date (soonest first)
    const sorted = [...this.campaigns].sort((a, b) => 
      new Date(a.endDate) - new Date(b.endDate)
    );
    
    return `
      <div class="campaigns-scroll" role="list">
        ${sorted.map(campaign => this._renderCampaignCard(campaign)).join('')}
      </div>
    `;
  }
  
  /**
   * Renders a single campaign card
   * @param {Object} campaign - Campaign data
   * @returns {string} HTML string
   */
  _renderCampaignCard(campaign) {
    const countdown = this._calculateCountdown(campaign.endDate);
    const urgencyClass = this._getUrgencyClass(countdown);
    
    return `
      <article class="campaign-card" 
               role="listitem"
               data-campaign-id="${campaign.id}"
               style="--campaign-accent: ${campaign.accentColor}"
               tabindex="0"
               data-action="view-campaign-positions">
        <div class="campaign-card__badge">
          <span class="campaign-card__multiplier">x${campaign.multiplier}</span>
        </div>
        
        <div class="campaign-card__icon">${campaign.icon}</div>
        
        <h3 class="campaign-card__title">${this._escapeHtml(campaign.title)}</h3>
        
        <p class="campaign-card__description">
          ${this._escapeHtml(campaign.description)}
        </p>
        
        <div class="campaign-card__eligibility">
          ${this._renderEligibility(campaign)}
        </div>
        
        <div class="campaign-card__countdown ${urgencyClass}" 
             data-countdown="${campaign.endDate}"
             aria-label="זמן נותר: ${countdown.display}">
          <i class="ti ti-clock" aria-hidden="true"></i>
          <span class="campaign-card__countdown-text">${countdown.display}</span>
        </div>
        
        <button class="campaign-card__cta btn btn--primary btn--sm"
                data-action="view-campaign-positions"
                data-campaign-id="${campaign.id}">
          הפנה עכשיו
          <i class="ti ti-arrow-left" aria-hidden="true"></i>
        </button>
      </article>
    `;
  }
  
  /**
   * Renders eligibility info
   * @param {Object} campaign - Campaign data
   * @returns {string} HTML string
   */
  _renderEligibility(campaign) {
    if (!campaign.eligibleDepartments || campaign.eligibleDepartments.length === 0) {
      return '<span class="campaign-card__eligibility-text">כל המשרות</span>';
    }
    
    const departments = campaign.eligibleDepartments.slice(0, 2);
    const more = campaign.eligibleDepartments.length > 2 
      ? ` +${campaign.eligibleDepartments.length - 2}` 
      : '';
    
    return `
      <span class="campaign-card__eligibility-text">
        ${departments.join(', ')}${more}
      </span>
    `;
  }
  
  /**
   * Calculates countdown display
   * @param {string} endDate - ISO date string
   * @returns {Object} Countdown info with display string and values
   */
  _calculateCountdown(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) {
      return { display: 'הסתיים', days: 0, hours: 0, minutes: 0, isExpired: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    let display;
    
    if (days > 0) {
      // More than 24 hours
      display = `${days} ימים, ${hours} שעות`;
    } else if (hours > 0) {
      // Less than 24 hours but more than 1 hour
      display = `${hours}:${String(minutes).padStart(2, '0')}`;
    } else {
      // Less than 1 hour
      display = `${minutes} דקות`;
    }
    
    return { display, days, hours, minutes, isExpired: false };
  }
  
  /**
   * Gets urgency CSS class based on countdown
   * @param {Object} countdown - Countdown object
   * @returns {string} CSS class
   */
  _getUrgencyClass(countdown) {
    if (countdown.isExpired) return 'campaign-card__countdown--expired';
    if (countdown.days === 0 && countdown.hours === 0) return 'campaign-card__countdown--critical';
    if (countdown.days === 0) return 'campaign-card__countdown--urgent';
    return '';
  }
  
  /**
   * Renders empty state when no campaigns active
   * @returns {string} HTML string
   */
  _renderEmptyState() {
    return `
      <div class="campaigns-empty">
        <div class="campaigns-empty__icon">${renderIcon('calendar-event', { size: 'xl' })}</div>
        <p class="campaigns-empty__text">אין קמפיינים פעילים כרגע</p>
        <p class="campaigns-empty__subtext">בקרוב...</p>
      </div>
    `;
  }
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  /**
   * Starts countdown timer interval
   */
  _startCountdownTimer() {
    // Update every minute
    this.countdownInterval = setInterval(() => {
      this._updateCountdowns();
    }, 60000);
  }
  
  /**
   * Updates all countdown displays
   */
  _updateCountdowns() {
    const countdownEls = document.querySelectorAll('[data-countdown]');
    countdownEls.forEach(el => {
      const endDate = el.dataset.countdown;
      const countdown = this._calculateCountdown(endDate);
      const textEl = el.querySelector('.campaign-card__countdown-text');
      
      if (textEl) {
        textEl.textContent = countdown.display;
      }
      
      // Update urgency class
      el.className = `campaign-card__countdown ${this._getUrgencyClass(countdown)}`;
    });
  }
  
  /**
   * Gets active campaigns from mock data
   * @returns {Array} Active campaigns
   */
  _getActiveCampaigns() {
    const now = new Date();
    return MOCK_CAMPAIGNS.filter(campaign => {
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      return campaign.isActive && now >= start && now <= end;
    });
  }
  
  /**
   * Lifecycle: Mount component
   */
  mount() {
    // Get active campaigns
    this.campaigns = this._getActiveCampaigns();
    
    // Subscribe to campaign state changes
    this.subscribe('activeCampaigns', (campaigns) => {
      if (campaigns) {
        this.campaigns = campaigns;
        this.render();
      }
    });
    
    // Start countdown timer
    this._startCountdownTimer();
    
    // Bind keyboard events for campaign cards
    this._bindKeyboardEvents();
  }
  
  /**
   * Bind keyboard event handlers
   */
  _bindKeyboardEvents() {
    this._keydownHandler = (e) => {
      if (e.target.matches('.campaign-card') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
      }
    };
    document.addEventListener('keydown', this._keydownHandler);
  }
  
  /**
   * Lifecycle: Unmount component
   */
  unmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
    }
    super.unmount();
  }
}

/**
 * DashboardComponent - Main dashboard with points summary and stats cards
 * Implements: AC1-AC6 (Dashboard Layout & Points Summary)
 * Implements: Story 2.2 (Stats Cards)
 */
class DashboardComponent extends Component {
  constructor() {
    super();
    this._animationTriggered = false;
  }
  
  /**
   * Returns the dashboard HTML template
   * @returns {string} HTML string
   */
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return this._renderLoading();
    
    const { firstName, points } = user;
    const levelInfo = this._calculateLevel(points);
    
    return `
      <div class="app-layout">
        <main class="dashboard page-content">
          <section class="dashboard__greeting">
            <h1 class="dashboard__title">שלום ${firstName}! ${renderIcon('hand-stop')}</h1>
          </section>
          
          <section class="dashboard__stats">
            ${this._renderPointsSummary(points, levelInfo)}
          </section>
          
          ${this._renderStatsCards()}
          
          ${this._renderQuickActions()}
          
          ${this._renderCampaignsSection()}
          
          ${this._renderActivityFeed()}
        </main>
      </div>
    `;
  }
  
  /**
   * Renders the stats cards section
   * @returns {string} HTML string for stats cards
   */
  _renderStatsCards() {
    const referrals = stateManager.getState('referrals') || [];
    const stats = this._calculateStats(referrals);
    const trends = this._calculateTrends(stats);
    
    const cards = [
      {
        id: 'total',
        icon: 'ti-users',
        label: 'סה״כ הפניות',
        count: stats.total,
        trend: trends.total,
        filter: 'all',
        color: 'primary'
      },
      {
        id: 'in-progress',
        icon: 'ti-clock',
        label: 'בתהליך',
        count: stats.inProgress,
        trend: trends.inProgress,
        filter: 'in-progress',
        color: 'warning'
      },
      {
        id: 'hired',
        icon: 'ti-trophy',
        label: 'גיוסים מוצלחים',
        count: stats.hired,
        trend: trends.hired,
        filter: 'hired',
        color: 'success'
      }
    ];
    
    return `
      <section class="dashboard__cards" aria-label="סטטיסטיקות הפניות">
        <div class="stats-cards">
          ${cards.map(card => this._renderStatCard(card)).join('')}
        </div>
      </section>
    `;
  }
  
  /**
   * Renders a single stat card
   * @param {Object} card - Card configuration
   * @returns {string} HTML string
   */
  _renderStatCard(card) {
    const trendHTML = card.trend !== 0 ? `
      <span class="stat-card__trend stat-card__trend--${card.trend > 0 ? 'up' : 'down'}">
        <i class="ti ${card.trend > 0 ? 'ti-trending-up' : 'ti-trending-down'}"></i>
        <span class="stat-card__trend-value">${Math.abs(card.trend)}</span>
      </span>
    ` : '';
    
    return `
      <article 
        class="stat-card stat-card--${card.color}"
        data-action="navigate-referrals"
        data-filter="${card.filter}"
        role="button"
        tabindex="0"
        aria-label="${card.label}: ${card.count}. לחץ לצפייה"
      >
        <div class="stat-card__icon">
          <i class="ti ${card.icon}"></i>
        </div>
        <div class="stat-card__content">
          <span class="stat-card__count" dir="ltr">${card.count.toLocaleString('he-IL')}</span>
          <span class="stat-card__label">${card.label}</span>
        </div>
        ${trendHTML}
      </article>
    `;
  }
  
  /**
   * Calculates stats from referrals array
   * @param {Array} referrals - User's referrals
   * @returns {Object} Stats object with total, inProgress, hired counts
   */
  _calculateStats(referrals) {
    return {
      total: referrals.length,
      inProgress: referrals.filter(r => 
        ['submitted', 'review', 'interview', 'offer'].includes(r.status)
      ).length,
      hired: referrals.filter(r => r.status === 'hired').length
    };
  }
  
  /**
   * Renders the activity feed section
   * @returns {string} HTML string for activity feed
   */
  _renderActivityFeed() {
    const activities = stateManager.getState('activities') || [];
    const displayActivities = activities.slice(0, 10); // Max 10 items
    
    if (displayActivities.length === 0) {
      return this._renderEmptyActivity();
    }
    
    return `
      <section class="dashboard__activity" aria-label="פעילות אחרונה">
        <header class="activity-feed__header">
          <h2 class="activity-feed__title">
            <i class="ti ti-activity"></i>
            פעילות אחרונה
          </h2>
        </header>
        
        <ul class="activity-feed" role="list">
          ${displayActivities.map(activity => this._renderActivityItem(activity)).join('')}
        </ul>
      </section>
    `;
  }

  /**
   * Renders a single activity item
   * @param {Object} activity - Activity data
   * @returns {string} HTML string
   */
  _renderActivityItem(activity) {
    const relativeTime = formatRelativeTime(activity.timestamp);
    const pointsBadge = activity.points > 0 ? `
      <span class="activity-item__points">+${activity.points}</span>
    ` : '';
    
    const navigable = activity.referralId ? `
      data-action="navigate-referral-detail"
      data-referral-id="${activity.referralId}"
      role="button"
      tabindex="0"
    ` : '';
    
    return `
      <li 
        class="activity-item activity-item--${activity.iconColor}"
        ${navigable}
        aria-label="${activity.description}. ${activity.points > 0 ? `הרווחת ${activity.points} נקודות.` : ''} ${relativeTime}"
      >
        <div class="activity-item__icon" aria-hidden="true">
          <i class="ti ${activity.icon}"></i>
        </div>
        
        <div class="activity-item__content">
          <p class="activity-item__description">${activity.description}</p>
          <span class="activity-item__time">${relativeTime}</span>
        </div>
        
        ${pointsBadge}
        
        ${activity.referralId ? `
          <i class="ti ti-chevron-left activity-item__arrow" aria-hidden="true"></i>
        ` : ''}
      </li>
    `;
  }

  /**
   * Renders empty state for activity feed
   * @returns {string} HTML string
   */
  _renderEmptyActivity() {
    return `
      <section class="dashboard__activity" aria-label="פעילות אחרונה">
        <header class="activity-feed__header">
          <h2 class="activity-feed__title">
            <i class="ti ti-activity"></i>
            פעילות אחרונה
          </h2>
        </header>
        
        <div class="activity-feed--empty">
          <div class="activity-feed__empty-icon" aria-hidden="true">
            <i class="ti ti-inbox"></i>
          </div>
          <p class="activity-feed__empty-text">עדיין אין פעילות</p>
          <p class="activity-feed__empty-subtext">הפנה את החבר הראשון שלך כדי להתחיל לצבור נקודות!</p>
          <button 
            class="btn btn--primary"
            data-navigate="positions"
            aria-label="הפנה מועמד"
          >
            <i class="ti ti-user-plus"></i>
            הפנה מועמד
          </button>
        </div>
      </section>
    `;
  }

  /**
   * Renders the quick actions section (Story 2.4)
   * @returns {string} HTML string for quick actions
   */
  _renderQuickActions() {
    const actions = [
      {
        id: 'refer',
        icon: 'ti-user-plus',
        label: 'הפנה מועמד',
        route: 'positions',
        primary: true,
        description: 'הפנה חבר למשרה פתוחה'
      },
      {
        id: 'positions',
        icon: 'ti-briefcase',
        label: 'צפה במשרות',
        route: 'positions',
        primary: false,
        description: 'ראה את כל המשרות הפתוחות'
      },
      {
        id: 'passport',
        icon: 'ti-book',
        label: 'הדרכון שלי',
        route: 'passport',
        primary: false,
        description: 'צפה בחותמות ובנקודות שלך'
      }
    ];
    
    return `
      <section class="dashboard__actions" aria-label="פעולות מהירות">
        <header class="quick-actions__header">
          <h2 class="quick-actions__title">
            <i class="ti ti-rocket"></i>
            פעולות מהירות
          </h2>
        </header>
        
        <div class="quick-actions">
          ${actions.map(action => this._renderQuickActionButton(action)).join('')}
        </div>
        
        <div class="quick-actions__link">
          <button class="btn btn--ghost btn--sm" data-action="open-how-to-earn">
            <i class="ti ti-help-circle" aria-hidden="true"></i>
            איך להרוויח עוד?
          </button>
        </div>
      </section>
    `;
  }

  /**
   * Renders a single quick action button
   * @param {Object} action - Action configuration
   * @returns {string} HTML string
   */
  _renderQuickActionButton(action) {
    const buttonClass = action.primary 
      ? 'quick-action-btn quick-action-btn--primary' 
      : 'quick-action-btn quick-action-btn--secondary';
    
    return `
      <button 
        class="${buttonClass}"
        data-navigate="${action.route}"
        aria-label="${action.description}"
      >
        <span class="quick-action-btn__icon">
          <i class="ti ${action.icon}"></i>
        </span>
        <span class="quick-action-btn__label">${action.label}</span>
      </button>
    `;
  }

  /**
   * Renders the campaigns section using CampaignsComponent (Story 5.4)
   * @returns {string} HTML string for campaigns section
   */
  _renderCampaignsSection() {
    // Create and render the CampaignsComponent
    const campaignsComponent = new CampaignsComponent();
    campaignsComponent.campaigns = campaignsComponent._getActiveCampaigns();
    return campaignsComponent.template();
  }

  /**
   * Renders the campaign banner section (Story 2.4) - Legacy, kept for reference
   * @returns {string} HTML string for campaign banner
   */
  _renderCampaignBanner() {
    const campaigns = stateManager.getState('campaigns') || [];
    const activeCampaigns = campaigns.filter(c => this._isCampaignActive(c));
    
    if (activeCampaigns.length === 0) {
      return this._renderNoCampaignState();
    }
    
    // Show the most recent/relevant active campaign
    const campaign = activeCampaigns[0];
    const countdown = this._formatCountdown(campaign.endDate);
    const isUrgent = this._isUrgent(campaign.endDate);
    
    return `
      <section class="dashboard__campaign" aria-label="קמפיין פעיל">
        <article class="campaign-banner ${isUrgent ? 'campaign-banner--urgent' : ''}">
          <div class="campaign-banner__background" aria-hidden="true">
            <div class="campaign-banner__glow"></div>
          </div>
          
          <div class="campaign-banner__content">
            <div class="campaign-banner__badge">
              <span class="campaign-badge">
                <i class="ti ti-flame"></i>
                ${campaign.multiplier}x נקודות
              </span>
            </div>
            
            <h3 class="campaign-banner__title">${campaign.name}</h3>
            <p class="campaign-banner__description">${campaign.description}</p>
            
            <div class="campaign-banner__countdown ${isUrgent ? 'campaign-countdown--urgent' : ''}">
              <i class="ti ti-clock"></i>
              <span class="campaign-countdown__text">${countdown}</span>
            </div>
            
            <button 
              class="btn btn--accent campaign-banner__cta"
              data-action="navigate-campaign-positions"
              data-campaign-id="${campaign.id}"
              aria-label="הפנה עכשיו לקמפיין ${campaign.name}"
            >
              <i class="ti ti-user-plus"></i>
              הפנה עכשיו
            </button>
          </div>
          
          <div class="campaign-banner__visual" aria-hidden="true">
            <i class="ti ti-award"></i>
          </div>
        </article>
      </section>
    `;
  }

  /**
   * Renders state when no campaigns are active
   * @returns {string} HTML string
   */
  _renderNoCampaignState() {
    return `
      <section class="dashboard__campaign dashboard__campaign--empty" aria-label="קמפיינים">
        <div class="campaign-placeholder">
          <i class="ti ti-sparkles" aria-hidden="true"></i>
          <p class="campaign-placeholder__text">קמפיינים חדשים בקרוב...</p>
        </div>
      </section>
    `;
  }

  /**
   * Checks if a campaign is currently active
   * @param {Object} campaign - Campaign object
   * @returns {boolean} True if active
   */
  _isCampaignActive(campaign) {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    return now >= startDate && now <= endDate;
  }

  /**
   * Checks if campaign end date is urgent (< 24 hours)
   * @param {string} endDate - ISO date string
   * @returns {boolean} True if urgent
   */
  _isUrgent(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const hoursRemaining = (end - now) / (1000 * 60 * 60);
    return hoursRemaining > 0 && hoursRemaining < 24;
  }

  /**
   * Formats countdown to campaign end
   * @param {string} endDate - ISO date string
   * @returns {string} Formatted countdown in Hebrew
   */
  _formatCountdown(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end - now;
    
    if (diffMs <= 0) {
      return 'הסתיים';
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      if (diffDays === 1) {
        return 'נותר יום אחד';
      }
      if (diffDays === 2) {
        return 'נותרו יומיים';
      }
      return `נותרו ${diffDays} ימים`;
    }
    
    if (diffHours > 0) {
      if (diffHours === 1) {
        return 'נותרה שעה אחת!';
      }
      if (diffHours === 2) {
        return 'נותרו שעתיים!';
      }
      return `נותרו ${diffHours} שעות!`;
    }
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `נותרו ${diffMinutes} דקות!`;
  }

  /**
   * Calculates trends by comparing to stored previous stats
   * @param {Object} currentStats - Current stats
   * @returns {Object} Trends object (positive = increase, negative = decrease)
   */
  _calculateTrends(currentStats) {
    const STATS_STORAGE_KEY = 'passportcard_refer_prev_stats';
    let prevStats = { total: 0, inProgress: 0, hired: 0 };
    
    try {
      const stored = localStorage.getItem(STATS_STORAGE_KEY);
      if (stored) {
        prevStats = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load previous stats');
    }
    
    // Store current stats for next comparison
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(currentStats));
    } catch (e) {
      console.warn('Failed to store current stats');
    }
    
    return {
      total: currentStats.total - prevStats.total,
      inProgress: currentStats.inProgress - prevStats.inProgress,
      hired: currentStats.hired - prevStats.hired
    };
  }
  
  /**
   * Renders loading state while user data loads
   * @returns {string} HTML string
   */
  _renderLoading() {
    return `
      <div class="app-layout">
        <main class="dashboard page-content">
          <div class="dashboard__loading">
            <span class="spinner"></span>
            <p>טוען...</p>
          </div>
        </main>
      </div>
    `;
  }
  
  /**
   * Renders the points summary card
   * @param {number} points - User's total points
   * @param {Object} levelInfo - Level calculation result
   * @returns {string} HTML string
   */
  _renderPointsSummary(points, levelInfo) {
    const { level, nextLevel, pointsToNext, progressPercent } = levelInfo;
    
    return `
      <article class="points-card" aria-label="סיכום נקודות">
        <div class="points-card__header">
          <h2 class="points-card__title">הנקודות שלי</h2>
        </div>
        
        <div class="points-card__body">
          <div class="points-card__progress">
            ${this._renderProgressCircle(progressPercent, level)}
          </div>
          
          <div class="points-card__details">
            <div class="points-card__total">
              <span class="points-value" data-target="${points}">0</span>
              <span class="points-label">נקודות</span>
            </div>
            
            <div class="points-card__level">
              <span class="level-badge level-badge--${this._getLevelClass(level)}">${level}</span>
            </div>
            
            ${nextLevel ? `
              <div class="points-card__next">
                <span class="points-next-text">עוד <strong class="points-value--inline" dir="ltr">${pointsToNext.toLocaleString('he-IL')}</strong> נקודות לרמה הבאה</span>
              </div>
            ` : `
              <div class="points-card__next points-card__next--max">
                <span class="points-next-text">${renderIcon('trophy')} הגעת לרמה הגבוהה ביותר!</span>
              </div>
            `}
          </div>
        </div>
      </article>
    `;
  }
  
  /**
   * Renders the SVG circular progress indicator
   * @param {number} percent - Progress percentage (0-100)
   * @param {string} level - Current level name
   * @returns {string} HTML string for SVG
   */
  _renderProgressCircle(percent, level) {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    
    return `
      <svg class="progress-circle" viewBox="0 0 100 100" aria-hidden="true">
        <circle 
          class="progress-circle__bg"
          cx="50" cy="50" r="${radius}"
          fill="none"
          stroke-width="8"
        />
        <circle 
          class="progress-circle__fill"
          cx="50" cy="50" r="${radius}"
          fill="none"
          stroke-width="8"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" class="progress-circle__text" text-anchor="middle" dominant-baseline="middle">
          ${Math.round(percent)}%
        </text>
      </svg>
    `;
  }
  
  /**
   * Calculates level information based on points
   * @param {number} points - User's total points
   * @returns {Object} Level info with level, nextLevel, pointsToNext, progressPercent
   */
  _calculateLevel(points) {
    const LEVELS = [
      { name: 'מתחיל', min: 0, max: 249 },
      { name: 'פעיל', min: 250, max: 749 },
      { name: 'מומחה', min: 750, max: 1999 },
      { name: 'אלוף', min: 2000, max: 4999 },
      { name: 'אגדה', min: 5000, max: Infinity }
    ];
    
    let currentIndex = LEVELS.findIndex(l => points >= l.min && points <= l.max);
    if (currentIndex === -1) currentIndex = 0;
    
    const currentLevel = LEVELS[currentIndex];
    const nextLevel = LEVELS[currentIndex + 1] || null;
    
    let progressPercent = 100;
    let pointsToNext = 0;
    
    if (nextLevel) {
      const levelRange = nextLevel.min - currentLevel.min;
      const pointsIntoLevel = points - currentLevel.min;
      progressPercent = Math.min((pointsIntoLevel / levelRange) * 100, 100);
      pointsToNext = nextLevel.min - points;
    }
    
    return {
      level: currentLevel.name,
      nextLevel: nextLevel?.name || null,
      pointsToNext,
      progressPercent
    };
  }
  
  /**
   * Maps Hebrew level name to CSS class
   * @param {string} level - Hebrew level name
   * @returns {string} CSS class name
   */
  _getLevelClass(level) {
    const classes = {
      'מתחיל': 'beginner',
      'פעיל': 'active',
      'מומחה': 'expert',
      'אלוף': 'champion',
      'אגדה': 'legend'
    };
    return classes[level] || 'beginner';
  }
  
  /**
   * Called after component is mounted to DOM
   */
  mount() {
    super.mount();
    
    // Trigger counter animation after mount
    if (!this._animationTriggered) {
      this._animationTriggered = true;
      this._animatePointsCounter();
    }
    
    // Subscribe to user changes for updates
    this.subscribe('currentUser', () => {
      this._refresh();
    });
    
    // Add keyboard navigation for stat cards
    this._setupStatCardKeyboard();
    
    // Add keyboard navigation for activity items
    this._setupActivityKeyboard();
    
    // Setup campaigns section (Story 5.4)
    this._setupCampaignsKeyboard();
    this._startCampaignCountdownTimer();
  }
  
  /**
   * Sets up keyboard navigation for campaign cards (Story 5.4)
   */
  _setupCampaignsKeyboard() {
    const cards = this.$$('.campaign-card');
    cards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }
  
  /**
   * Starts countdown timer for campaign cards (Story 5.4)
   */
  _startCampaignCountdownTimer() {
    // Update every minute
    this._campaignCountdownInterval = setInterval(() => {
      this._updateCampaignCountdowns();
    }, 60000);
  }
  
  /**
   * Updates all campaign countdown displays (Story 5.4)
   */
  _updateCampaignCountdowns() {
    const countdownEls = document.querySelectorAll('[data-countdown]');
    countdownEls.forEach(el => {
      const endDate = el.dataset.countdown;
      const countdown = this._calculateCampaignCountdown(endDate);
      const textEl = el.querySelector('.campaign-card__countdown-text');
      
      if (textEl) {
        textEl.textContent = countdown.display;
      }
      
      // Update urgency class
      const urgencyClass = this._getCampaignUrgencyClass(countdown);
      el.className = `campaign-card__countdown ${urgencyClass}`;
    });
  }
  
  /**
   * Calculates countdown for campaign (Story 5.4)
   * @param {string} endDate - ISO date string
   * @returns {Object} Countdown info
   */
  _calculateCampaignCountdown(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) {
      return { display: 'הסתיים', days: 0, hours: 0, minutes: 0, isExpired: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    let display;
    if (days > 0) {
      display = `${days} ימים, ${hours} שעות`;
    } else if (hours > 0) {
      display = `${hours}:${String(minutes).padStart(2, '0')}`;
    } else {
      display = `${minutes} דקות`;
    }
    
    return { display, days, hours, minutes, isExpired: false };
  }
  
  /**
   * Gets urgency CSS class based on countdown (Story 5.4)
   * @param {Object} countdown - Countdown object
   * @returns {string} CSS class
   */
  _getCampaignUrgencyClass(countdown) {
    if (countdown.isExpired) return 'campaign-card__countdown--expired';
    if (countdown.days === 0 && countdown.hours === 0) return 'campaign-card__countdown--critical';
    if (countdown.days === 0) return 'campaign-card__countdown--urgent';
    return '';
  }
  
  /**
   * Sets up keyboard navigation for stat cards
   */
  _setupStatCardKeyboard() {
    const cards = this.$$('.stat-card');
    cards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }
  
  /**
   * Sets up keyboard navigation for activity items
   */
  _setupActivityKeyboard() {
    const items = this.$$('.activity-item[role="button"]');
    items.forEach(item => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }
  
  /**
   * Triggers the points counter animation
   */
  _animatePointsCounter() {
    const pointsEl = this.$('.points-value[data-target]');
    if (!pointsEl) return;
    
    const target = parseInt(pointsEl.dataset.target, 10);
    animationService.animateCounter(pointsEl, target);
  }
  
  /**
   * Refreshes the dashboard when user data changes
   */
  _refresh() {
    const appContainer = document.getElementById('main-content');
    if (appContainer && this.isMounted()) {
      appContainer.innerHTML = this.template();
      this._animatePointsCounter();
      this._setupStatCardKeyboard();
      this._setupActivityKeyboard();
      this._setupCampaignsKeyboard();
    }
  }
  
  /**
   * Cleanup when component unmounts (Story 5.4)
   */
  unmount() {
    // Clear campaign countdown interval
    if (this._campaignCountdownInterval) {
      clearInterval(this._campaignCountdownInterval);
      this._campaignCountdownInterval = null;
    }
    super.unmount();
  }
}

/**
 * SettingsComponent - User settings with logout functionality
 * Implements: AC7 (Logout button in Settings)
 */
class SettingsComponent extends Component {
  /**
   * Returns the settings screen HTML template
   * @returns {string} HTML string
   */
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return this._renderNoUser();
    
    return `
      <main class="settings-page" role="main">
        <div class="settings-container">
          ${this._renderProfileSection(user)}
          ${this._renderGamificationSummary(user)}
          ${this._renderNotificationSection()}
          ${this._renderAccountSection()}
          ${this._renderAboutSection()}
          ${this._renderFooter()}
        </div>
      </main>
    `;
  }
  
  /**
   * Renders profile section with user info
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderProfileSection(user) {
    return `
      <section class="settings-section" aria-labelledby="profile-heading">
        <h2 class="settings-section__title" id="profile-heading">
          <i class="ti ti-user" aria-hidden="true"></i>
          פרטי פרופיל
        </h2>
        <div class="settings-card settings-card--profile">
          <div class="settings-profile">
            <div class="settings-profile__avatar" aria-hidden="true">
              ${user.avatarInitial || user.fullName?.charAt(0) || '?'}
            </div>
            <div class="settings-profile__info">
              <h3 class="settings-profile__name">${this._escapeHtml(user.fullName)}</h3>
              <p class="settings-profile__department">${this._escapeHtml(user.department)}</p>
            </div>
          </div>
          
          <div class="settings-fields">
            <div class="settings-field">
              <span class="settings-field__label" id="field-email-label">אימייל</span>
              <span class="settings-field__value settings-field__value--ltr" 
                    aria-labelledby="field-email-label">
                ${this._escapeHtml(user.email)}
              </span>
            </div>
            
            <div class="settings-field">
              <span class="settings-field__label" id="field-dept-label">מחלקה</span>
              <span class="settings-field__value" aria-labelledby="field-dept-label">
                ${this._escapeHtml(user.department)}
              </span>
            </div>
            
            <div class="settings-field">
              <span class="settings-field__label" id="field-id-label">מזהה עובד</span>
              <span class="settings-field__value settings-field__value--ltr" 
                    aria-labelledby="field-id-label">
                ${this._escapeHtml(user.id)}
              </span>
            </div>
            
            <div class="settings-field">
              <span class="settings-field__label" id="field-join-label">תאריך הצטרפות</span>
              <span class="settings-field__value" aria-labelledby="field-join-label">
                ${this._formatJoinDate(user.joinDate)}
              </span>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders gamification summary section
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderGamificationSummary(user) {
    const stamps = stateManager.getState('stamps') || [];
    const referrals = stateManager.getState('referrals') || [];
    const levelInfo = this._getLevelInfo(user.points || 0);
    
    return `
      <section class="settings-section" aria-labelledby="stats-heading">
        <h2 class="settings-section__title" id="stats-heading">
          <i class="ti ti-trophy" aria-hidden="true"></i>
          סיכום פעילות
        </h2>
        <div class="settings-card">
          <div class="settings-stats">
            <div class="settings-stat">
              <span class="settings-stat__value settings-stat__value--gold">
                ${this._formatNumber(user.points || 0)}
              </span>
              <span class="settings-stat__label">נקודות</span>
            </div>
            
            <div class="settings-stat">
              <span class="settings-stat__value">${levelInfo.name}</span>
              <span class="settings-stat__label">רמה</span>
            </div>
            
            <div class="settings-stat">
              <span class="settings-stat__value">${referrals.length}</span>
              <span class="settings-stat__label">הפניות</span>
            </div>
            
            <div class="settings-stat">
              <span class="settings-stat__value">${stamps.length}</span>
              <span class="settings-stat__label">חותמות</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders notification preferences section
   * @returns {string} HTML string
   */
  _renderNotificationSection() {
    const emailNotifications = stateManager.getState('emailNotifications') !== false;
    
    return `
      <section class="settings-section" aria-labelledby="notifications-heading">
        <h2 class="settings-section__title" id="notifications-heading">
          <i class="ti ti-bell" aria-hidden="true"></i>
          העדפות התראות
        </h2>
        <div class="settings-card">
          <div class="settings-toggle">
            <div class="settings-toggle__content">
              <label class="settings-toggle__label" for="email-notifications-toggle">
                התראות באימייל
              </label>
              <span class="settings-toggle__hint">
                קבל עדכונים על סטטוס ההפניות שלך
              </span>
            </div>
            <button 
              id="email-notifications-toggle"
              class="toggle ${emailNotifications ? 'toggle--on' : ''}"
              data-action="toggle-notifications"
              role="switch"
              aria-checked="${emailNotifications}"
              aria-describedby="toggle-hint"
            >
              <span class="toggle__track"></span>
              <span class="toggle__thumb"></span>
            </button>
          </div>
          <p class="settings-hint" id="toggle-hint">
            במצב דמו, התראות לא נשלחות בפועל
          </p>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders account/logout section
   * @returns {string} HTML string
   */
  _renderAccountSection() {
    return `
      <section class="settings-section" aria-labelledby="account-heading">
        <h2 class="settings-section__title" id="account-heading">
          <i class="ti ti-logout" aria-hidden="true"></i>
          חשבון
        </h2>
        <div class="settings-card settings-card--danger">
          <p class="settings-card__description">
            התנתקות תסגור את החיבור לחשבונך. תוכל להתחבר מחדש בכל עת עם אימייל וקוד חד-פעמי.
          </p>
          <button 
            class="btn btn--danger btn--full"
            data-action="logout"
            aria-label="התנתק מהמערכת"
          >
            <i class="ti ti-logout" aria-hidden="true"></i>
            התנתק
          </button>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders about/info section
   * @returns {string} HTML string
   */
  _renderAboutSection() {
    return `
      <section class="settings-section" aria-labelledby="about-heading">
        <h2 class="settings-section__title" id="about-heading">
          <i class="ti ti-info-circle" aria-hidden="true"></i>
          אודות
        </h2>
        <div class="settings-card">
          <div class="settings-about">
            <div class="settings-about__logo" role="img" aria-label="PassportCard Refer v1.0">
              <img src="${CONFIG.LOGOS.STANDARD}" alt="" aria-hidden="true" class="settings-about__logo-img" />
              <span class="settings-about__version">Refer v1.0</span>
            </div>
            <p class="settings-about__description">
              מערכת הפניות עובדים של PassportCard. הפנו חברים לעבודה והרוויחו נקודות וחותמות!
            </p>
            <div class="settings-about__links">
              <button 
                class="btn btn--text btn--sm"
                data-action="show-how-it-works"
                aria-label="איך זה עובד"
              >
                <i class="ti ti-help" aria-hidden="true"></i>
                איך זה עובד?
              </button>
              <button 
                class="btn btn--text btn--sm"
                data-action="show-contact-hr"
                aria-label="צור קשר עם HR"
              >
                <i class="ti ti-mail" aria-hidden="true"></i>
                צור קשר עם HR
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders footer with demo disclaimer
   * @returns {string} HTML string
   */
  _renderFooter() {
    return `
      <footer class="settings-footer">
        <p class="settings-disclaimer">
          <i class="ti ti-info-circle" aria-hidden="true"></i>
          <span>זו גרסת דמו - הנתונים אינם אמיתיים</span>
        </p>
        <p class="settings-copyright">
          © ${new Date().getFullYear()} PassportCard. כל הזכויות שמורות.
        </p>
      </footer>
    `;
  }
  
  /**
   * Renders no user state
   * @returns {string} HTML string
   */
  _renderNoUser() {
    return `
      <div class="settings-error">
        <p>אנא התחבר כדי לצפות בהגדרות</p>
        <button class="btn btn--primary" data-navigate="auth">
          התחברות
        </button>
      </div>
    `;
  }
  
  // ========================
  // UTILITY METHODS
  // ========================
  
  /**
   * Gets level info based on points
   * @param {number} points - User's total points
   * @returns {Object} Level info with name and threshold
   */
  _getLevelInfo(points) {
    const levels = [
      { name: 'מתחיל', threshold: 0 },
      { name: 'פעיל', threshold: 250 },
      { name: 'מומחה', threshold: 750 },
      { name: 'אלוף', threshold: 2000 },
      { name: 'אגדה', threshold: 5000 }
    ];
    
    let currentLevel = levels[0];
    for (const level of levels) {
      if (points >= level.threshold) {
        currentLevel = level;
      }
    }
    return currentLevel;
  }
  
  /**
   * Formats number with thousands separator
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return num.toLocaleString('he-IL');
  }
  
  /**
   * Formats join date
   * @param {string|Date} date - Join date
   * @returns {string} Formatted date in Hebrew
   */
  _formatJoinDate(date) {
    if (!date) return '---';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('he-IL', { 
        year: 'numeric', 
        month: 'long'
      });
    } catch (e) {
      return date.toString();
    }
  }
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

/* ============================================================================
   PASSPORT COMPONENT
   ============================================================================
   Displays the passport cover with user information and summary stats
   Implements: Story 3.1 - Passport Cover Design
   ========================================================================== */

/**
 * PassportComponent - Displays the passport cover and manages passport state
 * First component in Epic 3 - establishes passport rendering patterns
 */
class PassportComponent extends Component {
  constructor() {
    super();
    this.passportState = {
      isOpen: false,
      currentPage: 0,     // 0 = profile spread, 1+ = stamp pages
      totalPages: 1,
      isAnimating: false  // Prevent double navigation
    };
    this.touchStartX = 0;
    this.touchEndX = 0;
  }
  
  /**
   * Stamps per page constant
   */
  static get STAMPS_PER_PAGE() {
    return 6;
  }
  
  /**
   * Calculates total passport pages based on stamps
   * Page 0: Profile page (always exists)
   * Pages 1+: Stamp pages (6 stamps each)
   * @param {Array} stamps - User's stamps array
   * @returns {number} Total number of page spreads
   */
  _calculateTotalPages(stamps) {
    if (!stamps || stamps.length === 0) return 1; // Just profile page
    const stampPages = Math.ceil(stamps.length / PassportComponent.STAMPS_PER_PAGE);
    return 1 + Math.ceil(stampPages / 2); // Profile spread + stamp spreads (2 pages per spread)
  }
  
  /**
   * Returns the passport page HTML template
   * @returns {string} HTML string
   */
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return this._renderLoading();
    
    // Note: #main-content already has app-layout class, so we don't wrap again
    return `
      <div class="passport-view page-content">
        ${this._renderPassport(user)}
      </div>
    `;
  }
  
  /**
   * Renders the complete passport (cover + pages)
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderPassport(user) {
    const passportNumber = this._getPassportNumber(user);
    const stamps = stateManager.getState('stamps') || [];
    const points = user.points || 0;
    const isOpen = this.passportState.isOpen;
    const currentPage = this.passportState.currentPage;
    const totalPages = this._calculateTotalPages(stamps);
    
    // Update state
    this.passportState.totalPages = totalPages;
    
    // FIX Story 7.6: Remove data-action from main passport element when open
    // to prevent event bubbling from stamps/navigation triggering close
    return `
      <section class="passport-container" aria-label="הדרכון שלי">
        <article class="passport ${isOpen ? 'passport--open' : 'passport--closed'}"
                 tabindex="0"
                 role="region"
                 aria-label="${isOpen ? 'דרכון פתוח' : 'דרכון סגור'}">
          
          <!-- Passport Pages (behind cover) -->
          <div class="passport-pages" 
               data-current-page="${currentPage}"
               aria-live="polite">
            ${isOpen ? this._renderPagesHeader() : ''}
            ${this._renderAllPages(user, stamps)}
          </div>
          
          <!-- Passport Cover (on top, flips open) - only cover triggers open when closed -->
          <div class="passport-cover" ${!isOpen ? 'data-action="open-passport"' : ''}>
            <div class="passport-cover__border">
              <div class="passport-cover__content">
                ${this._renderPassportLogo()}
                
                <div class="passport-cover__divider"></div>
                
                <div class="passport-cover__title">
                  <h1 class="passport-cover__title-he">דרכון הפניות</h1>
                  <p class="passport-cover__title-en">REFERRAL PASSPORT</p>
                </div>
                
                <div class="passport-cover__divider"></div>
                
                <div class="passport-cover__user">
                  <p class="passport-cover__name">${user.firstName} ${user.lastName}</p>
                  <p class="passport-cover__number">מספר: ${passportNumber}</p>
                </div>
              </div>
            </div>
          </div>
          
          ${isOpen ? this._renderNavigationArrows() : ''}
        </article>
        
        ${this._renderPassportSummary(stamps, points)}
        ${isOpen && totalPages > 1 ? this._renderPageIndicator() : ''}
      </section>
    `;
  }
  
  /**
   * Renders the pages header with close button (Story 7.6)
   * @returns {string} HTML string
   */
  _renderPagesHeader() {
    return `
      <div class="passport-pages__header">
        <button class="passport-pages__close-btn"
                data-action="close-passport"
                aria-label="סגור את הדרכון">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }
  
  /**
   * Renders passport summary section
   * @param {Array} stamps - User's stamps array
   * @param {number} points - User's points
   * @returns {string} HTML string
   */
  _renderPassportSummary(stamps, points) {
    const isOpen = this.passportState.isOpen;
    
    return `
      <div class="passport-summary">
        <p class="passport-summary__stats">
          <span class="passport-summary__stamps">${stamps.length} חותמות</span>
          <span class="passport-summary__separator">|</span>
          <span class="passport-summary__points">${points.toLocaleString('he-IL')} נקודות</span>
        </p>
        
        <button 
          class="btn btn--primary passport-summary__cta"
          data-action="${isOpen ? 'close-passport' : 'open-passport'}"
          aria-label="${isOpen ? 'סגור את הדרכון שלי' : 'פתח את הדרכון שלי'}"
        >
          <i class="ti ti-${isOpen ? 'x' : 'book-2'}" aria-hidden="true"></i>
          ${isOpen ? 'סגור' : 'פתח את הדרכון'}
        </button>
      </div>
    `;
  }
  
  /**
   * Renders all passport pages in page spreads
   * @param {Object} user - Current user object
   * @param {Array} stamps - User's stamps array
   * @returns {string} HTML string
   */
  _renderAllPages(user, stamps) {
    const currentPage = this.passportState.currentPage;
    const sortedStamps = this._sortStampsByDate(stamps);
    const pages = [];
    
    // Page spread 0: Profile (right in RTL) + First stamps (left in RTL)
    pages.push(`
      <div class="passport-spread ${currentPage === 0 ? 'passport-spread--active' : ''}" data-spread="0">
        <div class="passport-page passport-page--stamps">
          ${this._renderStampsPage(0, sortedStamps)}
        </div>
        <div class="passport-page passport-page--profile">
          ${this._renderProfilePage(user)}
        </div>
      </div>
    `);
    
    // Additional stamp page spreads
    const totalSpreads = this.passportState.totalPages;
    for (let i = 1; i < totalSpreads; i++) {
      const leftPageIdx = i * 2;
      const rightPageIdx = i * 2 - 1;
      
      pages.push(`
        <div class="passport-spread ${currentPage === i ? 'passport-spread--active' : ''}" data-spread="${i}">
          <div class="passport-page passport-page--stamps">
            ${this._renderStampsPage(leftPageIdx, sortedStamps)}
          </div>
          <div class="passport-page passport-page--stamps">
            ${this._renderStampsPage(rightPageIdx, sortedStamps)}
          </div>
        </div>
      `);
    }
    
    return pages.join('');
  }
  
  /**
   * Renders a single stamps page with actual stamp content
   * @param {number} pageIndex - Index within stamps array (0-based)
   * @param {Array} stamps - All user stamps (should be pre-sorted)
   * @returns {string} HTML string
   */
  _renderStampsPage(pageIndex, stamps) {
    const STAMPS_PER_PAGE = PassportComponent.STAMPS_PER_PAGE;
    const startIdx = pageIndex * STAMPS_PER_PAGE;
    const pageStamps = stamps.slice(startIdx, startIdx + STAMPS_PER_PAGE);
    
    if (pageStamps.length === 0) {
      return `
        <div class="stamps-page stamps-page--empty">
          <p class="stamps-page__empty-text">עוד אין חותמות בעמוד זה</p>
          <p class="stamps-page__empty-hint">המשך להפנות כדי לאסוף עוד!</p>
        </div>
      `;
    }
    
    // Calculate empty slots for this page
    const emptySlots = STAMPS_PER_PAGE - pageStamps.length;
    const placeholderTypes = this._getPlaceholderTypes(stamps, emptySlots);
    
    return `
      <div class="stamps-page">
        <div class="stamps-grid">
          ${pageStamps.map(stamp => this._renderStamp(stamp)).join('')}
          ${placeholderTypes.map(type => this._renderStampPlaceholder(type)).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * Renders a single stamp with full design
   * @param {Object} stamp - Stamp data object
   * @returns {string} HTML string
   */
  _renderStamp(stamp) {
    const config = STAMP_TYPES[stamp.type] || STAMP_TYPES.submitted;
    const rotation = this._getStampRotation(stamp.id);
    const formattedDate = this._formatStampDate(stamp.earnedDate);
    const isNew = stamp.isNew;
    
    return `
      <button class="stamp stamp--${config.shape} stamp--${stamp.type} ${isNew ? 'stamp--new' : ''}"
              style="--stamp-rotation: ${rotation}deg; --stamp-color: ${config.color}"
              data-action="view-stamp-details"
              data-stamp-id="${stamp.id}"
              role="button"
              aria-label="${config.label}, ${formattedDate}, +${config.points} נקודות"
              tabindex="0">
        <div class="stamp__shape">
          <div class="stamp__inner">
            <span class="stamp__icon" aria-hidden="true">
              <i class="ti ti-${config.icon}"></i>
            </span>
            <span class="stamp__label">${config.label}</span>
            <span class="stamp__points">+${config.points}</span>
          </div>
        </div>
        <span class="stamp__date">${formattedDate}</span>
      </button>
    `;
  }
  
  /**
   * Renders a placeholder for unearned stamp
   * @param {string} stampType - Type key from STAMP_TYPES
   * @returns {string} HTML string
   */
  _renderStampPlaceholder(stampType) {
    const config = STAMP_TYPES[stampType];
    if (!config) return '';
    
    return `
      <div class="stamp stamp--placeholder stamp--${config.shape}"
           style="--stamp-color: ${config.color}"
           aria-hidden="true">
        <div class="stamp__shape">
          <div class="stamp__inner">
            <span class="stamp__icon">
              <i class="ti ti-${config.icon}"></i>
            </span>
            <span class="stamp__label">${config.label}</span>
          </div>
        </div>
        <span class="stamp__hint">הפנה כדי להרוויח</span>
      </div>
    `;
  }
  
  /**
   * Gets deterministic rotation for stamp based on ID
   * @param {string} stampId - Stamp ID
   * @returns {number} Rotation in degrees (-5 to +5)
   */
  _getStampRotation(stampId) {
    // Use stamp ID to generate consistent rotation
    const hash = stampId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return (Math.abs(hash) % 11) - 5; // -5 to +5 degrees
  }
  
  /**
   * Formats stamp date in Hebrew
   * @param {Date|string} date - Earned date
   * @returns {string}
   */
  _formatStampDate(date) {
    const months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  
  /**
   * Gets placeholder stamp types that user hasn't earned yet
   * @param {Array} stamps - User's earned stamps
   * @param {number} count - Number of placeholders needed
   * @returns {Array} Array of stamp type keys
   */
  _getPlaceholderTypes(stamps, count) {
    if (count <= 0) return [];
    
    const earnedTypes = new Set(stamps.map(s => s.type));
    const unearnedTypes = Object.keys(STAMP_TYPES).filter(type => !earnedTypes.has(type));
    
    // Return up to 'count' unearned types, or repeat if needed
    const placeholders = [];
    for (let i = 0; i < count && i < unearnedTypes.length; i++) {
      placeholders.push(unearnedTypes[i]);
    }
    return placeholders;
  }
  
  /**
   * Sorts stamps by earned date (newest first)
   * @param {Array} stamps - Unsorted stamps
   * @returns {Array} Sorted stamps
   */
  _sortStampsByDate(stamps) {
    return [...stamps].sort((a, b) => {
      const dateA = new Date(a.earnedDate);
      const dateB = new Date(b.earnedDate);
      return dateB - dateA; // Newest first
    });
  }
  
  /**
   * Renders navigation arrows for page navigation
   * Story 7.6: Always show navigation UI when passport is open
   * @returns {string} HTML string
   */
  _renderNavigationArrows() {
    const { currentPage, totalPages } = this.passportState;
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage >= totalPages - 1;
    const hasMultiplePages = totalPages > 1;
    
    return `
      <div class="passport-nav">
        <button class="passport-nav__btn passport-nav__btn--prev ${!hasMultiplePages || isFirstPage ? 'passport-nav__btn--disabled' : ''}"
                data-action="passport-prev"
                aria-label="עמוד קודם"
                ${!hasMultiplePages || isFirstPage ? 'disabled' : ''}>
          <i class="ti ti-chevron-right" aria-hidden="true"></i>
          <span class="passport-nav__text">הקודם</span>
        </button>
        
        <button class="passport-nav__btn passport-nav__btn--next ${!hasMultiplePages || isLastPage ? 'passport-nav__btn--disabled' : ''}"
                data-action="passport-next"
                aria-label="עמוד הבא"
                ${!hasMultiplePages || isLastPage ? 'disabled' : ''}>
          <span class="passport-nav__text">הבא</span>
          <i class="ti ti-chevron-left" aria-hidden="true"></i>
        </button>
      </div>
      ${hasMultiplePages ? this._renderSwipeHint() : ''}
    `;
  }
  
  /**
   * Renders swipe hint for mobile users (Story 7.6)
   * @returns {string} HTML string
   */
  _renderSwipeHint() {
    return `
      <div class="passport-swipe-hint" aria-hidden="true">
        <i class="ti ti-arrows-left-right"></i>
        <span>החלק לניווט</span>
      </div>
    `;
  }
  
  /**
   * Renders page indicator with dots
   * @returns {string} HTML string
   */
  _renderPageIndicator() {
    const { currentPage, totalPages } = this.passportState;
    
    const dots = Array.from({ length: totalPages }, (_, i) => `
      <span class="page-indicator__dot ${i === currentPage ? 'page-indicator__dot--active' : ''}"
            aria-label="עמוד ${i + 1}"></span>
    `).join('');
    
    return `
      <div class="page-indicator" aria-label="מיקום בדרכון">
        <span class="page-indicator__text">עמוד ${currentPage + 1} מתוך ${totalPages}</span>
        <div class="page-indicator__dots">
          ${dots}
        </div>
      </div>
    `;
  }
  
  /**
   * Renders Page 1: Profile information
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderProfilePage(user) {
    const stamps = stateManager.getState('stamps') || [];
    const referrals = stateManager.getState('referrals') || [];
    const joinDate = this._formatJoinDate(user.joinDate);
    const initial = user.firstName ? user.firstName.charAt(0) : '?';
    
    return `
      <div class="profile-page">
        <div class="profile-page__header">
          <div class="profile-page__avatar" aria-hidden="true">
            <span class="profile-page__initial">${initial}</span>
          </div>
          <h2 class="profile-page__name">${user.firstName} ${user.lastName}</h2>
          <p class="profile-page__department">${user.department || 'עובד PassportCard'}</p>
        </div>
        
        <div class="profile-page__divider"></div>
        
        <div class="profile-page__info">
          <p class="profile-page__since">
            <i class="ti ti-calendar" aria-hidden="true"></i>
            <span>מאז: ${joinDate}</span>
          </p>
        </div>
        
        <div class="profile-page__stats">
          <div class="profile-page__stat">
            <span class="profile-page__stat-value">${user.points?.toLocaleString('he-IL') || 0}</span>
            <span class="profile-page__stat-label">נקודות</span>
          </div>
          <div class="profile-page__stat">
            <span class="profile-page__stat-value">${referrals.length}</span>
            <span class="profile-page__stat-label">הפניות</span>
          </div>
          <div class="profile-page__stat">
            <span class="profile-page__stat-value">${stamps.length}</span>
            <span class="profile-page__stat-label">חותמות</span>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Navigates to next page
   * @returns {Promise<void>}
   */
  async navigateNext() {
    const { currentPage, totalPages, isAnimating } = this.passportState;
    if (isAnimating || currentPage >= totalPages - 1) return;
    
    this.passportState.isAnimating = true;
    
    const pagesEl = document.querySelector('.passport-pages');
    await animationService.animatePageFlipNext(pagesEl);
    
    this.passportState.currentPage++;
    this.passportState.isAnimating = false;
    this._updatePageDisplay();
  }
  
  /**
   * Navigates to previous page
   * @returns {Promise<void>}
   */
  async navigatePrev() {
    const { currentPage, isAnimating } = this.passportState;
    if (isAnimating || currentPage <= 0) return;
    
    this.passportState.isAnimating = true;
    
    const pagesEl = document.querySelector('.passport-pages');
    await animationService.animatePageFlipPrev(pagesEl);
    
    this.passportState.currentPage--;
    this.passportState.isAnimating = false;
    this._updatePageDisplay();
  }
  
  /**
   * Updates page display after navigation
   */
  _updatePageDisplay() {
    const { currentPage, totalPages } = this.passportState;
    
    // Update spread visibility
    document.querySelectorAll('.passport-spread').forEach((spread, i) => {
      spread.classList.toggle('passport-spread--active', i === currentPage);
    });
    
    // Update page indicator text
    const indicator = document.querySelector('.page-indicator__text');
    if (indicator) {
      indicator.textContent = `עמוד ${currentPage + 1} מתוך ${totalPages}`;
    }
    
    // Update dots
    document.querySelectorAll('.page-indicator__dot').forEach((dot, i) => {
      dot.classList.toggle('page-indicator__dot--active', i === currentPage);
    });
    
    // Update navigation buttons
    this._updateNavigationButtons();
  }
  
  /**
   * Updates navigation button states
   */
  _updateNavigationButtons() {
    const { currentPage, totalPages } = this.passportState;
    const prevBtn = document.querySelector('.passport-nav__btn--prev');
    const nextBtn = document.querySelector('.passport-nav__btn--next');
    
    if (prevBtn) {
      prevBtn.disabled = currentPage === 0;
      prevBtn.classList.toggle('passport-nav__btn--disabled', currentPage === 0);
    }
    
    if (nextBtn) {
      nextBtn.disabled = currentPage >= totalPages - 1;
      nextBtn.classList.toggle('passport-nav__btn--disabled', currentPage >= totalPages - 1);
    }
  }
  
  /**
   * Formats join date in Hebrew
   * @param {string|Date} date - Join date
   * @returns {string} Formatted date (e.g., "ינואר 2024")
   */
  _formatJoinDate(date) {
    if (!date) return 'לא ידוע';
    
    const months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  
  /**
   * Renders PassportCard logo in gold
   * @returns {string} SVG logo HTML
   */
  _renderPassportLogo() {
    return `
      <div class="passport-cover__logo" role="img" aria-label="PassportCard">
        <img src="${CONFIG.LOGOS.WHITE}" alt="" aria-hidden="true" class="passport-cover__logo-img" />
      </div>
    `;
  }
  
  /**
   * Gets or generates passport number for user
   * Format: REF-YYYY-XXX where YYYY is join year, XXX is seeded sequence
   * @param {Object} user - User object
   * @returns {string} Passport number (e.g., "REF-2025-001")
   */
  _getPassportNumber(user) {
    if (user.passportNumber) return user.passportNumber;
    
    // Generate from user ID - extract numeric portion and pad
    const idNum = user.id.replace(/\D/g, '').padStart(3, '0').slice(-3);
    const year = new Date().getFullYear();
    return `REF-${year}-${idNum}`;
  }
  
  /**
   * Renders loading state
   * @returns {string} HTML string
   */
  _renderLoading() {
    return `
      <div class="app-layout">
        <main class="passport-view page-content">
          <div class="loading-state">
            <div class="spinner" aria-label="טוען..."></div>
          </div>
        </main>
      </div>
    `;
  }
  
  /**
   * Mounts the component and sets up subscriptions
   */
  mount() {
    super.mount();
    
    // Subscribe to user changes
    this.subscribe('currentUser', this._handleUserChange.bind(this));
    this.subscribe('stamps', this._handleStampsChange.bind(this));
    
    // Set up keyboard handler for passport after render
    this._setupKeyboardHandlers();
    
    // Set up touch/swipe handlers
    this._setupTouchHandlers();
    
    // Trigger stamp slam animations for new stamps
    this._animateNewStamps();
    
    // Check for new stamps and trigger celebrations (Story 3.5)
    this._checkForNewStampCelebrations();
  }
  
  /**
   * Checks for newly earned stamps and triggers appropriate celebrations (Story 3.5)
   */
  _checkForNewStampCelebrations() {
    const stamps = stateManager.getState('stamps') || [];
    const newStamps = stamps.filter(s => s.isNew);
    
    if (newStamps.length === 0) return;
    
    // Priority: hired > first > others
    const hiredStamp = newStamps.find(s => s.type === 'hired');
    const firstStamp = newStamps.find(s => s.type === 'first');
    
    // Delay celebration to allow page to render and stamp slam to start
    setTimeout(() => {
      if (hiredStamp) {
        animationService.celebrateHiredStamp();
      } else if (firstStamp) {
        animationService.celebrateFirstReferral();
      } else if (newStamps.length > 0) {
        // Celebrate first new stamp of other types
        animationService.celebrateAchievement(newStamps[0].type);
      }
    }, 800);
  }
  
  /**
   * Animates newly earned stamps with slam effect
   */
  async _animateNewStamps() {
    // Wait for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newStamps = document.querySelectorAll('.stamp--new');
    if (!newStamps || newStamps.length === 0) return;
    
    for (const stampEl of newStamps) {
      await animationService.animateStampSlam(stampEl);
      
      // Mark as no longer new in state
      const stampId = stampEl.dataset.stampId;
      this._markStampAsViewed(stampId);
    }
  }
  
  /**
   * Marks stamp as viewed (removes isNew flag)
   * @param {string} stampId - Stamp ID
   */
  _markStampAsViewed(stampId) {
    const stamps = stateManager.getState('stamps') || [];
    const updatedStamps = stamps.map(s => 
      s.id === stampId ? { ...s, isNew: false } : s
    );
    stateManager.setState({ stamps: updatedStamps });
  }
  
  /**
   * Sets up touch/swipe handlers for mobile navigation
   */
  _setupTouchHandlers() {
    setTimeout(() => {
      const pagesEl = document.querySelector('.passport-pages');
      if (pagesEl) {
        pagesEl.addEventListener('touchstart', this._handleTouchStart.bind(this), { passive: true });
        pagesEl.addEventListener('touchend', this._handleTouchEnd.bind(this), { passive: true });
      }
    }, 0);
  }
  
  /**
   * Handles touch start event
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }
  
  /**
   * Handles touch end event
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this._handleSwipe();
  }
  
  /**
   * Handles swipe gesture for page navigation
   */
  _handleSwipe() {
    if (!this.passportState.isOpen) return;
    
    const swipeDistance = this.touchEndX - this.touchStartX;
    const minSwipeDistance = 50;
    
    // RTL: swipe left (negative) = next, swipe right (positive) = prev
    if (swipeDistance < -minSwipeDistance) {
      this.navigateNext();
    } else if (swipeDistance > minSwipeDistance) {
      this.navigatePrev();
    }
  }
  
  /**
   * Sets up keyboard handlers for passport element
   */
  _setupKeyboardHandlers() {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const passport = document.querySelector('.passport');
      if (passport) {
        passport.addEventListener('keydown', this._handlePassportKeydown.bind(this));
      }
    }, 0);
  }
  
  /**
   * Handles keyboard interaction with passport
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handlePassportKeydown(e) {
    // Handle Enter/Space for open/close
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // FIX Story 7.6: Determine action based on state, not data-action attribute
      const action = this.passportState.isOpen ? 'close-passport' : 'open-passport';
      
      // Trigger the action through the app
      const event = new CustomEvent('passport-action', { detail: { action } });
      document.dispatchEvent(event);
      
      // Also directly trigger via app if available
      if (typeof app !== 'undefined' && app._handleAction) {
        app._handleAction(action, e.currentTarget, e);
      }
      return;
    }
    
    // FIX Story 7.6: Handle Escape key to close passport
    if (e.key === 'Escape' && this.passportState.isOpen) {
      e.preventDefault();
      if (typeof app !== 'undefined' && app._handleAction) {
        app._handleAction('close-passport', e.currentTarget, e);
      }
      return;
    }
    
    // Handle arrow keys for page navigation when passport is open
    if (!this.passportState.isOpen) return;
    
    // RTL context: Left arrow = next (visual right), Right arrow = prev (visual left)
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.navigateNext();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.navigatePrev();
    }
  }
  
  /**
   * Updates component after animation state changes
   * @param {boolean} isOpen - Whether passport is now open
   */
  updatePassportState(isOpen) {
    this.passportState.isOpen = isOpen;
    
    // Update CTA button and passport aria
    const cta = document.querySelector('.passport-summary__cta');
    const passport = document.querySelector('.passport');
    const cover = document.querySelector('.passport-cover');
    const pagesHeader = document.querySelector('.passport-pages__header');
    const navContainer = document.querySelector('.passport-nav');
    
    if (cta) {
      cta.dataset.action = isOpen ? 'close-passport' : 'open-passport';
      cta.setAttribute('aria-label', isOpen ? 'סגור את הדרכון שלי' : 'פתח את הדרכון שלי');
      cta.innerHTML = `
        <i class="ti ti-${isOpen ? 'x' : 'book-2'}" aria-hidden="true"></i>
        ${isOpen ? 'סגור' : 'פתח את הדרכון'}
      `;
    }
    
    if (passport) {
      // FIX Story 7.6: Don't set data-action on main passport element
      // Only update aria-label
      passport.setAttribute('aria-label', isOpen ? 'דרכון פתוח' : 'דרכון סגור');
    }
    
    // FIX Story 7.6: Update cover data-action based on state
    if (cover) {
      if (isOpen) {
        cover.removeAttribute('data-action');
      } else {
        cover.dataset.action = 'open-passport';
      }
    }
    
    // FIX Story 7.6: Add/remove close button header when state changes
    const pagesContainer = document.querySelector('.passport-pages');
    if (pagesContainer) {
      if (isOpen && !pagesHeader) {
        // Add close button header
        pagesContainer.insertAdjacentHTML('afterbegin', this._renderPagesHeader());
      } else if (!isOpen && pagesHeader) {
        // Remove close button header
        pagesHeader.remove();
      }
    }
    
    // FIX Story 7.6: Add/remove navigation arrows when state changes
    if (passport) {
      if (isOpen && !navContainer) {
        // Add navigation arrows and swipe hint
        passport.insertAdjacentHTML('beforeend', this._renderNavigationArrows());
      } else if (!isOpen && navContainer) {
        // Remove navigation arrows
        navContainer.remove();
        const swipeHint = document.querySelector('.passport-swipe-hint');
        if (swipeHint) swipeHint.remove();
      }
    }
    
    // Update page indicator if needed
    if (isOpen) {
      this._updatePageIndicator();
    }
  }
  
  /**
   * Updates the page indicator display
   */
  _updatePageIndicator() {
    const { currentPage, totalPages } = this.passportState;
    const indicatorContainer = document.querySelector('.passport-container');
    let indicator = document.querySelector('.page-indicator');
    
    if (totalPages > 1) {
      const indicatorHtml = this._renderPageIndicator();
      if (!indicator && indicatorContainer) {
        indicatorContainer.insertAdjacentHTML('beforeend', indicatorHtml);
      } else if (indicator) {
        indicator.outerHTML = indicatorHtml;
      }
    } else if (indicator) {
      indicator.remove();
    }
  }
  
  /**
   * Handles user data changes - re-renders component
   * @param {Object} newUser - Updated user object
   */
  _handleUserChange(newUser) {
    if (this.element && newUser) {
      const appContainer = document.getElementById('main-content');
      if (appContainer && this.isMounted()) {
        appContainer.innerHTML = this.template();
        this._setupKeyboardHandlers();
        this._setupTouchHandlers();
      }
    }
  }
  
  /**
   * Handles stamps data changes - updates stamps count display
   * @param {Array} newStamps - Updated stamps array
   */
  _handleStampsChange(newStamps) {
    const stampsEl = document.querySelector('.passport-summary__stamps');
    if (stampsEl && newStamps) {
      stampsEl.textContent = `${newStamps.length} חותמות`;
    }
    
    // Also update stamps page if visible
    const stampsCountEl = document.querySelector('.stamps-page__count');
    if (stampsCountEl && newStamps) {
      stampsCountEl.textContent = `${newStamps.length} חותמות נאספו`;
    }
  }
}

/* ============================================================================
   POSITIONS COMPONENT (Story 4.1)
   ============================================================================
   Displays list of open positions with filtering and actions
   ========================================================================== */

class PositionsComponent extends Component {
  constructor(props) {
    super(props);
    this.positions = [];
    this.filteredPositions = [];
    this.isLoading = true;
    
    // Initialize filter state from StateManager
    this.filters = stateManager.getState('positionFilters') || {
      search: '',
      department: 'all',
      location: 'all'
    };
    
    // Create debounced search handler
    this._debouncedSearch = debounce(this._handleSearchChange.bind(this), 300);
  }
  
  /**
   * Main template for positions page
   * @returns {string} HTML string
   */
  template() {
    return `
      <div class="app-layout">
        <main class="positions-page" role="main">
          <header class="positions-header">
            <h1 class="positions-title">${renderIcon('briefcase')} משרות פתוחות</h1>
            <p class="positions-subtitle">מצאו משרה מתאימה והפנו מועמדים מהרשת שלכם</p>
          </header>
          
          ${this._renderCampaignFilterIndicator()}
          
          ${this._renderFilterBar()}
          
          <div class="positions-results-count" aria-live="polite">
            ${this._renderResultsCount()}
          </div>
          
          <div class="positions-list" id="positions-list" role="list" aria-label="רשימת משרות פתוחות">
            ${this.isLoading ? this._renderSkeletons() : this._renderPositions()}
          </div>
        </main>
      </div>
    `;
  }
  
  /**
   * Renders campaign filter indicator when a campaign filter is active
   * @returns {string} HTML string
   */
  _renderCampaignFilterIndicator() {
    const campaignId = stateManager.getState('campaignFilter');
    if (!campaignId) return '';
    
    const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
    if (!campaign) return '';
    
    return `
      <div class="positions-filter-indicator">
        <span class="positions-filter-indicator__icon">${campaign.icon}</span>
        <span class="positions-filter-indicator__text">
          מציג משרות מקמפיין: ${campaign.title}
        </span>
        <span class="positions-filter-indicator__multiplier">x${campaign.multiplier} נקודות!</span>
        <button class="positions-filter-indicator__clear"
                data-action="clear-campaign-filter"
                aria-label="נקה סינון קמפיין">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }
  
  /**
   * Renders the filter bar with search and dropdowns
   * @returns {string} HTML string
   */
  _renderFilterBar() {
    const departments = this._getUniqueDepartments();
    const locations = this._getUniqueLocations();
    const hasActiveFilters = this._hasActiveFilters();
    
    return `
      <div class="filter-bar" role="search" aria-label="סינון משרות">
        <div class="filter-bar__search">
          <i class="ti ti-search filter-bar__search-icon" aria-hidden="true"></i>
          <input
            type="text"
            id="position-search"
            class="filter-bar__search-input"
            placeholder="🔍 חיפוש משרה..."
            value="${this._escapeHtml(this.filters.search)}"
            aria-label="חיפוש משרות"
          />
          ${this.filters.search ? `
            <button
              class="filter-bar__clear-search"
              data-action="clear-position-search"
              aria-label="נקה חיפוש"
            >
              <i class="ti ti-x" aria-hidden="true"></i>
            </button>
          ` : ''}
        </div>
        
        <div class="filter-bar__dropdowns">
          <div class="filter-bar__select-wrapper">
            <label for="department-filter" class="visually-hidden">סינון לפי מחלקה</label>
            <select
              id="department-filter"
              class="filter-bar__select"
              aria-label="סינון לפי מחלקה"
            >
              <option value="all">כל המחלקות</option>
              ${departments.map(dept => `
                <option value="${this._escapeHtml(dept)}" ${this.filters.department === dept ? 'selected' : ''}>
                  ${this._escapeHtml(dept)}
                </option>
              `).join('')}
            </select>
          </div>
          
          <div class="filter-bar__select-wrapper">
            <label for="location-filter" class="visually-hidden">סינון לפי מיקום</label>
            <select
              id="location-filter"
              class="filter-bar__select"
              aria-label="סינון לפי מיקום"
            >
              <option value="all">כל המיקומים</option>
              ${locations.map(loc => `
                <option value="${this._escapeHtml(loc)}" ${this.filters.location === loc ? 'selected' : ''}>
                  ${this._escapeHtml(loc)}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
        
        ${hasActiveFilters ? `
          <button
            class="filter-bar__clear-all btn btn--ghost btn--sm"
            data-action="clear-all-position-filters"
            aria-label="נקה את כל הסינונים"
          >
            <i class="ti ti-filter-off" aria-hidden="true"></i>
            נקה הכל
          </button>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Gets unique departments from positions
   * @returns {string[]} Array of unique department names
   */
  _getUniqueDepartments() {
    const depts = new Set(MOCK_POSITIONS.map(p => p.department));
    return Array.from(depts).sort();
  }
  
  /**
   * Gets unique locations from positions
   * @returns {string[]} Array of unique location names
   */
  _getUniqueLocations() {
    const locs = new Set(MOCK_POSITIONS.map(p => p.location));
    return Array.from(locs).sort();
  }
  
  /**
   * Checks if any filters are active
   * @returns {boolean} True if filters are active
   */
  _hasActiveFilters() {
    const hasCampaignFilter = !!stateManager.getState('campaignFilter');
    return (
      this.filters.search.trim() !== '' ||
      this.filters.department !== 'all' ||
      this.filters.location !== 'all' ||
      hasCampaignFilter
    );
  }
  
  /**
   * Renders the results count
   * @returns {string} HTML string
   */
  _renderResultsCount() {
    if (this.isLoading) return '';
    
    const total = this.positions.length;
    const filtered = this.filteredPositions.length;
    
    if (!this._hasActiveFilters()) {
      return `<span class="results-count">מציג ${total} משרות</span>`;
    }
    
    return `<span class="results-count">מציג ${filtered} מתוך ${total} משרות</span>`;
  }
  
  /**
   * Filters positions based on current filter state
   */
  _filterPositions() {
    let filtered = [...this.positions];
    
    // Filter by campaign (Story 5.4)
    const campaignId = stateManager.getState('campaignFilter');
    if (campaignId) {
      const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
      if (campaign) {
        filtered = filtered.filter(position => {
          // If no department restrictions, all positions eligible
          if (!campaign.eligibleDepartments || campaign.eligibleDepartments.length === 0) {
            return true;
          }
          // Check if position's department is eligible
          if (campaign.eligibleDepartments.includes(position.department)) {
            return true;
          }
          // Check specific position IDs
          if (campaign.eligiblePositionIds && campaign.eligiblePositionIds.includes(position.id)) {
            return true;
          }
          return false;
        });
      }
    }
    
    // Filter by search term (title Hebrew + English)
    if (this.filters.search.trim()) {
      const searchLower = this.filters.search.trim().toLowerCase();
      filtered = filtered.filter(position =>
        position.title.toLowerCase().includes(searchLower) ||
        position.titleEn.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by department
    if (this.filters.department !== 'all') {
      filtered = filtered.filter(position =>
        position.department === this.filters.department
      );
    }
    
    // Filter by location
    if (this.filters.location !== 'all') {
      filtered = filtered.filter(position =>
        position.location === this.filters.location
      );
    }
    
    this.filteredPositions = filtered;
  }
  
  /**
   * Gets campaign for a position (if any active)
   * @param {Object} position - Position object
   * @returns {Object|null} Campaign or null
   */
  _getCampaignForPosition(position) {
    const now = new Date();
    return MOCK_CAMPAIGNS.find(campaign => {
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      if (!campaign.isActive || now < start || now > end) return false;
      
      // If no department restrictions, all positions eligible
      if (!campaign.eligibleDepartments || campaign.eligibleDepartments.length === 0) {
        return true;
      }
      // Check if position's department is eligible
      if (campaign.eligibleDepartments.includes(position.department)) {
        return true;
      }
      // Check specific position IDs
      if (campaign.eligiblePositionIds && campaign.eligiblePositionIds.includes(position.id)) {
        return true;
      }
      return false;
    }) || null;
  }
  
  /**
   * Calculates points with campaign multiplier
   * @param {number} basePoints - Base points
   * @param {Object|null} campaign - Campaign object
   * @returns {Object} Points info { base, multiplier, total, hasCampaign }
   */
  _calculatePointsWithCampaign(basePoints, campaign) {
    const multiplier = campaign ? campaign.multiplier : 1;
    return {
      base: basePoints,
      multiplier: multiplier,
      total: Math.floor(basePoints * multiplier),
      hasCampaign: campaign !== null
    };
  }
  
  /**
   * Highlights matching text in a string
   * @param {string} text - Original text
   * @param {string} searchTerm - Term to highlight
   * @returns {string} HTML string with highlights
   */
  _highlightMatch(text, searchTerm) {
    if (!searchTerm.trim()) return this._escapeHtml(text);
    
    const escapedText = this._escapeHtml(text);
    const escapedTerm = this._escapeHtml(searchTerm.trim());
    const regex = new RegExp(`(${this._escapeRegex(escapedTerm)})`, 'gi');
    
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  }
  
  /**
   * Escapes special regex characters
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  /**
   * Renders skeleton placeholders during loading
   * @returns {string} HTML string
   */
  _renderSkeletons() {
    const skeletons = Array(6).fill(0).map(() => `
      <div class="position-card position-card--skeleton" aria-hidden="true">
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text skeleton--short"></div>
        <div class="skeleton skeleton--button"></div>
      </div>
    `).join('');
    
    return skeletons;
  }
  
  /**
   * Renders positions or appropriate empty state
   * @returns {string} HTML string
   */
  _renderPositions() {
    this._filterPositions();
    
    if (this.filteredPositions.length === 0) {
      if (this._hasActiveFilters()) {
        return this._renderNoSearchResults();
      }
      return this._renderEmptyState();
    }
    
    return this.filteredPositions.map(position => 
      this._renderPositionCard(position)
    ).join('');
  }
  
  /**
   * Renders a single position card with optional search highlighting
   * @param {Object} position - Position data
   * @returns {string} HTML string
   */
  _renderPositionCard(position) {
    // Check for active campaign from MOCK_CAMPAIGNS (Story 5.4)
    const activeCampaign = this._getCampaignForPosition(position);
    const pointsInfo = this._calculatePointsWithCampaign(position.bonus, activeCampaign);
    
    // Apply search highlighting to title if search is active
    const displayTitle = this.filters.search.trim()
      ? this._highlightMatch(position.title, this.filters.search)
      : this._escapeHtml(position.title);
    
    return `
      <article class="position-card ${position.isHot ? 'position-card--hot' : ''}"
               data-action="view-position-details"
               data-position-id="${position.id}"
               tabindex="0"
               role="listitem"
               aria-label="${this._escapeHtml(position.title)} - ${this._escapeHtml(position.department)}">
        
        <div class="position-card__badges">
          ${position.isHot ? `
            <span class="badge badge--hot" aria-label="משרה חמה">
              ${renderIcon('flame')} חם!
            </span>
          ` : ''}
          ${activeCampaign ? `
            <span class="badge badge--campaign" 
                  style="--badge-color: ${activeCampaign.accentColor}"
                  aria-label="קמפיין פעיל: ${activeCampaign.title}"
                  title="${activeCampaign.title}">
              ${renderIcon('gift')} x${activeCampaign.multiplier} נקודות!
            </span>
          ` : ''}
        </div>
        
        <div class="position-card__content">
          <h2 class="position-card__title">${displayTitle}</h2>
          
          <div class="position-card__meta">
            <span class="position-card__department">
              <i class="ti ti-building" aria-hidden="true"></i>
              ${this._escapeHtml(position.department)}
            </span>
            <span class="position-card__location">
              <i class="ti ti-map-pin" aria-hidden="true"></i>
              ${this._escapeHtml(position.location)}
            </span>
            ${position.type === 'part-time' ? `
              <span class="position-card__type">
                <i class="ti ti-clock" aria-hidden="true"></i>
                חלקית
              </span>
            ` : ''}
          </div>
          
          <div class="position-card__bonus">
            <span class="position-card__bonus-icon">${renderIcon('coins')}</span>
            ${pointsInfo.hasCampaign ? `
              <span class="position-card__bonus-text points-with-multiplier">
                <span class="points-with-multiplier__base">${pointsInfo.base}</span>
                <span class="points-with-multiplier__multiplier">x${pointsInfo.multiplier}</span>
                <span class="points-with-multiplier__total">= ${pointsInfo.total}</span>
              </span>
            ` : `
              <span class="position-card__bonus-text">
                +${pointsInfo.base} לגיוס מוצלח
              </span>
            `}
          </div>
        </div>
        
        <div class="position-card__actions">
          <button class="btn btn--primary btn--sm position-card__refer-btn"
                  data-action="refer-position"
                  data-position-id="${position.id}"
                  aria-label="הפנה מועמד למשרת ${this._escapeHtml(position.title)}">
            <i class="ti ti-user-plus" aria-hidden="true"></i>
            הפנה מועמד
          </button>
        </div>
      </article>
    `;
  }
  
  /**
   * Renders empty state when no positions available
   * @returns {string} HTML string
   */
  _renderEmptyState() {
    return `
      <div class="positions-empty" role="status">
        <div class="positions-empty__icon" aria-hidden="true">
          <i class="ti ti-briefcase-off"></i>
        </div>
        <h2 class="positions-empty__title">אין משרות פתוחות כרגע</h2>
        <p class="positions-empty__text">בקרוב נוסיף משרות חדשות. חזרו בקרוב!</p>
      </div>
    `;
  }
  
  /**
   * Renders no results state when filters return empty
   * @returns {string} HTML string
   */
  _renderNoSearchResults() {
    const filters = [];
    if (this.filters.search.trim()) {
      filters.push(`"${this._escapeHtml(this.filters.search)}"`);
    }
    if (this.filters.department !== 'all') {
      filters.push(this._escapeHtml(this.filters.department));
    }
    if (this.filters.location !== 'all') {
      filters.push(this._escapeHtml(this.filters.location));
    }
    
    const filterText = filters.join(', ');
    
    return `
      <div class="positions-empty positions-empty--filtered" role="status">
        <div class="positions-empty__icon" aria-hidden="true">
          <i class="ti ti-search-off"></i>
        </div>
        <h2 class="positions-empty__title">לא נמצאו משרות</h2>
        <p class="positions-empty__text">
          לא נמצאו משרות התואמות לחיפוש: ${filterText}
        </p>
        <button
          class="btn btn--secondary positions-empty__clear-btn"
          data-action="clear-all-position-filters"
        >
          <i class="ti ti-filter-off" aria-hidden="true"></i>
          נקה חיפוש
        </button>
      </div>
    `;
  }
  
  /**
   * Handles search input changes (called after debounce)
   * @param {string} value - Search input value
   */
  _handleSearchChange(value) {
    this.filters.search = value;
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Handles department filter changes
   * @param {string} value - Selected department
   */
  _handleDepartmentChange(value) {
    this.filters.department = value;
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Handles location filter changes
   * @param {string} value - Selected location
   */
  _handleLocationChange(value) {
    this.filters.location = value;
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Clears only the search filter
   */
  clearSearch() {
    const searchInput = document.getElementById('position-search');
    if (searchInput) {
      searchInput.value = '';
    }
    this.filters.search = '';
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Clears all filters
   */
  clearAllFilters() {
    const searchInput = document.getElementById('position-search');
    const deptSelect = document.getElementById('department-filter');
    const locSelect = document.getElementById('location-filter');
    
    if (searchInput) searchInput.value = '';
    if (deptSelect) deptSelect.value = 'all';
    if (locSelect) locSelect.value = 'all';
    
    this.filters = {
      search: '',
      department: 'all',
      location: 'all'
    };
    
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Persists filter state to StateManager
   */
  _persistFilters() {
    stateManager.setState({
      positionFilters: { ...this.filters }
    });
  }
  
  /**
   * Updates UI after filter changes
   */
  _updateUI() {
    // Update results count
    const countEl = document.querySelector('.positions-results-count');
    if (countEl) {
      countEl.innerHTML = this._renderResultsCount();
    }
    
    // Update positions list
    const listEl = document.getElementById('positions-list');
    if (listEl) {
      listEl.innerHTML = this._renderPositions();
    }
    
    // Update filter bar (for clear buttons visibility)
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
      filterBar.outerHTML = this._renderFilterBar();
      this._bindFilterEvents();
    }
  }
  
  /**
   * Binds filter-specific events
   */
  _bindFilterEvents() {
    // Search input with debounce
    const searchInput = document.getElementById('position-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this._debouncedSearch(e.target.value);
      });
      
      // Also handle Enter key for immediate search
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this._handleSearchChange(e.target.value);
        }
      });
    }
    
    // Department dropdown
    const deptSelect = document.getElementById('department-filter');
    if (deptSelect) {
      deptSelect.addEventListener('change', (e) => {
        this._handleDepartmentChange(e.target.value);
      });
    }
    
    // Location dropdown
    const locSelect = document.getElementById('location-filter');
    if (locSelect) {
      locSelect.addEventListener('change', (e) => {
        this._handleLocationChange(e.target.value);
      });
    }
  }
  
  /**
   * Loads positions from mock data
   * @returns {Promise<void>}
   */
  async _loadPositions() {
    this.isLoading = true;
    this._updateList();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Load positions from mock data
    this.positions = MOCK_POSITIONS;
    
    // Restore filters from state
    const storedFilters = stateManager.getState('positionFilters');
    if (storedFilters) {
      this.filters = { ...storedFilters };
    }
    
    this.isLoading = false;
    this._filterPositions();
    
    // Re-render entire component to show filter bar with correct values
    const app = document.getElementById('main-content');
    if (app) {
      app.innerHTML = this.template();
      this.mount();
    }
  }
  
  /**
   * Updates the positions list in DOM
   */
  _updateList() {
    const listEl = document.getElementById('positions-list');
    if (listEl) {
      listEl.innerHTML = this.isLoading ? this._renderSkeletons() : this._renderPositions();
    }
  }
  
  /**
   * Mounts component and loads data
   */
  mount() {
    super.mount();
    this._bindFilterEvents();
    this._setupEventHandlers();
    
    // Only load if not already loaded
    if (this.positions.length === 0) {
      this._loadPositions();
    }
  }
  
  /**
   * Sets up event handlers for card interactions
   */
  _setupEventHandlers() {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const container = document.getElementById('positions-list');
      if (container) {
        // Handle card keyboard interaction
        container.addEventListener('keydown', this._handleCardKeydown.bind(this));
        
        // Handle card click (for non-button areas)
        container.addEventListener('click', this._handleCardClick.bind(this));
      }
    }, 0);
  }
  
  /**
   * Handles keydown events on position cards
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handleCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.position-card');
      if (card && !e.target.matches('button')) {
        e.preventDefault();
        const positionId = card.dataset.positionId;
        if (positionId) {
          this._openPositionDetails(positionId);
        }
      }
    }
  }
  
  /**
   * Handles click events on position cards (but not buttons)
   * @param {MouseEvent} e - Mouse event
   */
  _handleCardClick(e) {
    // Let buttons handle their own clicks via data-action
    if (e.target.matches('button') || e.target.closest('button')) {
      return;
    }
    
    const card = e.target.closest('.position-card');
    if (card && !card.classList.contains('position-card--skeleton')) {
      const positionId = card.dataset.positionId;
      if (positionId) {
        this._openPositionDetails(positionId);
      }
    }
  }
  
  /**
   * Opens position details modal
   * @param {string} positionId - Position ID
   */
  _openPositionDetails(positionId) {
    const position = this.positions.find(p => p.id === positionId);
    if (position) {
      stateManager.setState({
        selectedPosition: position,
        activeModal: 'position-details'
      });
      // Modal will be implemented in Story 4.3
      console.log('Position selected:', position.title);
    }
  }
  
  /**
   * Cleanup when component unmounts
   */
  unmount() {
    // Clean up debounce timer
    if (this._debouncedSearch && this._debouncedSearch.cancel) {
      this._debouncedSearch.cancel();
    }
    super.unmount();
  }
}

/* ============================================================================
   REFERRAL FORM COMPONENT (Story 4.5)
   ============================================================================
   Form for submitting candidate referrals with resume upload
   ========================================================================== */

class ReferralFormComponent extends Component {
  constructor(props) {
    super(props);
    this.position = null;
    this.formData = {
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      relationship: '',
      notes: ''
    };
    this.errors = {};
    this.touched = {};
    this.uploadedFile = null;
    this.isSubmitting = false;
    
    // Bind methods
    this._handleInput = this._handleInput.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleDragOver = this._handleDragOver.bind(this);
    this._handleDragLeave = this._handleDragLeave.bind(this);
    this._handleDrop = this._handleDrop.bind(this);
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    // Get position from state or props
    this.position = stateManager.getState('referringPosition') || 
                    MOCK_POSITIONS.find(p => p.id === this.props.positionId);
    
    if (!this.position) {
      return `
        <div class="app-layout">
          <main class="referral-form-error">
            <i class="ti ti-alert-circle" style="font-size: 3rem; color: var(--text-muted);" aria-hidden="true"></i>
            <p>לא נמצאה משרה להפניה</p>
            <button class="btn btn--primary" data-action="navigate-positions">
              <i class="ti ti-arrow-right" aria-hidden="true"></i>
              חזרה למשרות
            </button>
          </main>
        </div>
      `;
    }
    
    // Store instance in state for action handlers
    stateManager.setState({ referralFormInstance: this });
    
    return `
      <div class="app-layout">
        <main class="referral-form" id="referral-form">
          ${this._renderHeader()}
          
          <form class="referral-form__form" novalidate>
            ${this._renderPositionSummary()}
            ${this._renderFormFields()}
            ${this._renderUploadZone()}
            ${this._renderSubmitSection()}
          </form>
        </main>
      </div>
    `;
  }
  
  /**
   * Renders page header with back button
   * @returns {string} HTML string
   */
  _renderHeader() {
    return `
      <header class="referral-form__header">
        <button class="referral-form__back-btn"
                type="button"
                data-action="back-from-referral"
                aria-label="חזרה">
          <i class="ti ti-arrow-right" aria-hidden="true"></i>
        </button>
        <h1 class="referral-form__title">הפניית מועמד</h1>
      </header>
    `;
  }
  
  /**
   * Renders position summary card
   * @returns {string} HTML string
   */
  _renderPositionSummary() {
    const p = this.position;
    const multiplier = p.campaign?.multiplier || 1;
    const basePoints = 50 + 100 + (p.bonus || 0);
    const totalPoints = Math.round(basePoints * multiplier);
    
    return `
      <div class="referral-form__position-card">
        <div class="referral-form__position-info">
          <h2 class="referral-form__position-title">${this._escapeHtml(p.title)}</h2>
          <p class="referral-form__position-meta">
            <span><i class="ti ti-building" aria-hidden="true"></i> ${this._escapeHtml(p.department)}</span>
            <span><i class="ti ti-map-pin" aria-hidden="true"></i> ${this._escapeHtml(p.location)}</span>
          </p>
        </div>
        <div class="referral-form__position-bonus">
          <span class="referral-form__bonus-label">בונוס פוטנציאלי</span>
          <span class="referral-form__bonus-value">+${totalPoints} נקודות</span>
        </div>
      </div>
    `;
  }
  
  /**
   * Renders all form fields
   * @returns {string} HTML string
   */
  _renderFormFields() {
    return `
      <div class="referral-form__fields">
        ${this._renderTextField('candidateName', 'שם מלא של המועמד', 'text', true)}
        ${this._renderTextField('candidateEmail', 'אימייל', 'email', true)}
        ${this._renderTextField('candidatePhone', 'טלפון', 'tel', false, 'לדוגמה: 050-1234567')}
        ${this._renderSelectField()}
        ${this._renderTextareaField()}
      </div>
    `;
  }
  
  /**
   * Renders a text input field
   * @param {string} name - Field name
   * @param {string} label - Field label
   * @param {string} type - Input type
   * @param {boolean} required - Is required
   * @param {string} placeholder - Placeholder text
   * @returns {string} HTML string
   */
  _renderTextField(name, label, type, required, placeholder = '') {
    const value = this.formData[name] || '';
    const error = this.errors[name];
    const touched = this.touched[name];
    const isValid = touched && !error && value;
    
    const inputId = `referral-${name}`;
    const errorId = `${inputId}-error`;
    
    return `
      <div class="form-field ${error ? 'form-field--error' : ''} ${isValid ? 'form-field--valid' : ''}">
        <label for="${inputId}" class="form-field__label">
          ${label}
          ${required ? '<span class="form-field__required" aria-hidden="true">*</span>' : ''}
        </label>
        <div class="form-field__input-wrapper">
          <input type="${type}"
                 id="${inputId}"
                 name="${name}"
                 class="form-field__input"
                 value="${this._escapeHtml(value)}"
                 ${placeholder ? `placeholder="${placeholder}"` : ''}
                 ${required ? 'aria-required="true"' : ''}
                 ${error ? `aria-describedby="${errorId}" aria-invalid="true"` : ''}
                 data-field="${name}">
          ${isValid ? '<i class="ti ti-check form-field__icon form-field__icon--valid" aria-hidden="true"></i>' : ''}
          ${error ? '<i class="ti ti-alert-circle form-field__icon form-field__icon--error" aria-hidden="true"></i>' : ''}
        </div>
        ${error ? `<p id="${errorId}" class="form-field__error" role="alert">${error}</p>` : ''}
      </div>
    `;
  }
  
  /**
   * Renders relationship select field
   * @returns {string} HTML string
   */
  _renderSelectField() {
    const value = this.formData.relationship || '';
    const error = this.errors.relationship;
    const touched = this.touched.relationship;
    const isValid = touched && !error && value;
    
    const options = [
      { value: '', label: 'בחר/י...' },
      { value: 'close-friend', label: 'חבר/ה קרוב/ה' },
      { value: 'former-colleague', label: 'קולגה מעבודה קודמת' },
      { value: 'professional', label: 'מכר/ה מקצועי/ת' },
      { value: 'other', label: 'אחר' }
    ];
    
    return `
      <div class="form-field ${error ? 'form-field--error' : ''} ${isValid ? 'form-field--valid' : ''}">
        <label for="referral-relationship" class="form-field__label">
          איך את/ה מכיר/ה את המועמד?
          <span class="form-field__required" aria-hidden="true">*</span>
        </label>
        <div class="form-field__input-wrapper">
          <select id="referral-relationship"
                  name="relationship"
                  class="form-field__input form-field__input--select"
                  aria-required="true"
                  ${error ? 'aria-describedby="referral-relationship-error" aria-invalid="true"' : ''}
                  data-field="relationship">
            ${options.map(opt => `
              <option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>
                ${opt.label}
              </option>
            `).join('')}
          </select>
          <i class="ti ti-chevron-down form-field__select-icon" aria-hidden="true"></i>
        </div>
        ${error ? `<p id="referral-relationship-error" class="form-field__error" role="alert">${error}</p>` : ''}
      </div>
    `;
  }
  
  /**
   * Renders notes textarea with character counter
   * @returns {string} HTML string
   */
  _renderTextareaField() {
    const value = this.formData.notes || '';
    const charCount = value.length;
    const maxChars = 500;
    const isNearLimit = charCount >= 450;
    
    return `
      <div class="form-field">
        <label for="referral-notes" class="form-field__label">
          הערות נוספות
          <span class="form-field__optional">(אופציונלי)</span>
        </label>
        <textarea id="referral-notes"
                  name="notes"
                  class="form-field__input form-field__input--textarea"
                  rows="3"
                  maxlength="${maxChars}"
                  data-field="notes">${this._escapeHtml(value)}</textarea>
        <p class="form-field__counter ${isNearLimit ? 'form-field__counter--warning' : ''}" aria-live="polite">
          <span class="form-field__counter-current">${charCount}</span>/${maxChars}
        </p>
      </div>
    `;
  }
  
  /**
   * Renders file upload zone
   * @returns {string} HTML string
   */
  _renderUploadZone() {
    if (this.uploadedFile) {
      return this._renderFilePreview();
    }
    
    return `
      <div class="upload-zone" id="upload-zone" role="region" aria-label="העלאת קורות חיים">
        <input type="file"
               id="resume-input"
               class="upload-zone__input"
               accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
               aria-label="בחר קובץ קורות חיים">
        
        <div class="upload-zone__content">
          <i class="ti ti-file-upload upload-zone__icon" aria-hidden="true"></i>
          <p class="upload-zone__text">
            <span class="upload-zone__text-primary">${renderIcon('file-text')} גררו קובץ לכאן או לחצו לבחירה</span>
          </p>
          <p class="upload-zone__formats">PDF, DOC, DOCX</p>
          <p class="upload-zone__size">עד 5MB</p>
        </div>
        
        <div class="upload-zone__hover-content" aria-hidden="true">
          <i class="ti ti-file-download upload-zone__icon" aria-hidden="true"></i>
          <p class="upload-zone__text">שחררו כדי להעלות</p>
        </div>
      </div>
      
      <div id="upload-error" class="upload-zone__error" role="alert" aria-live="assertive"></div>
    `;
  }
  
  /**
   * Renders uploaded file preview
   * @returns {string} HTML string
   */
  _renderFilePreview() {
    const file = this.uploadedFile;
    const sizeStr = this._formatFileSize(file.size);
    const icon = file.name.toLowerCase().endsWith('.pdf') ? 'ti-file-type-pdf' : 'ti-file-type-doc';
    
    return `
      <div class="file-preview" id="file-preview" role="region" aria-label="קובץ שהועלה">
        <div class="file-preview__icon">
          <i class="ti ${icon}" aria-hidden="true"></i>
        </div>
        <div class="file-preview__info">
          <p class="file-preview__name">${this._escapeHtml(file.name)}</p>
          <p class="file-preview__size">${sizeStr}</p>
        </div>
        <button type="button"
                class="file-preview__remove"
                data-action="remove-resume"
                aria-label="הסר קובץ">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }
  
  /**
   * Renders submit section
   * @returns {string} HTML string
   */
  _renderSubmitSection() {
    const isValid = this._isFormValid();
    const isFirstReferral = this._isFirstReferral();
    const points = isFirstReferral ? 150 : 50;
    
    return `
      <div class="referral-form__submit-section">
        <p class="referral-form__points-hint">
          ${isFirstReferral ? `${renderIcon('confetti')} הפניה ראשונה! ` : ''}
          <strong>+${points} נקודות</strong> יתווספו לחשבונך
        </p>
        
        <button type="submit"
                class="btn btn--primary btn--lg btn--full referral-form__submit-btn"
                ${!isValid || this.isSubmitting ? 'disabled' : ''}
                data-action="submit-referral">
          ${this.isSubmitting ? `
            <span class="btn__spinner" aria-hidden="true"></span>
            שולח...
          ` : `
            📤 שליחת ההפניה
          `}
        </button>
      </div>
    `;
  }
  
  // ========================
  // VALIDATION METHODS
  // ========================
  
  /**
   * Validates a single field
   * @param {string} field - Field name
   * @param {string} value - Field value
   * @returns {string|null} Error message or null
   */
  _validateField(field, value) {
    switch (field) {
      case 'candidateName':
        if (!value || value.trim().length < 2) {
          return 'נא להזין שם מלא';
        }
        return null;
        
      case 'candidateEmail':
        if (!value) {
          return 'נא להזין כתובת אימייל';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'נא להזין כתובת אימייל תקינה';
        }
        return null;
        
      case 'candidatePhone':
        if (!value) return null; // Optional field
        // Israeli phone patterns
        const phoneRegex = /^(\+972|972|0)?([23489]|5[0-9]|7[0-9])[0-9]{7}$/;
        const cleaned = value.replace(/[-\s]/g, '');
        if (!phoneRegex.test(cleaned)) {
          return 'נא להזין מספר טלפון תקין';
        }
        return null;
        
      case 'relationship':
        if (!value) {
          return 'נא לבחור את סוג ההיכרות';
        }
        return null;
        
      default:
        return null;
    }
  }
  
  /**
   * Validates all required fields
   * @returns {boolean} True if form is valid
   */
  _isFormValid() {
    const requiredFields = ['candidateName', 'candidateEmail', 'relationship'];
    
    for (const field of requiredFields) {
      const error = this._validateField(field, this.formData[field]);
      if (error) return false;
    }
    
    // Phone validation if provided
    if (this.formData.candidatePhone) {
      const phoneError = this._validateField('candidatePhone', this.formData.candidatePhone);
      if (phoneError) return false;
    }
    
    return true;
  }
  
  /**
   * Validates all fields and updates errors
   */
  _validateAllFields() {
    const fields = ['candidateName', 'candidateEmail', 'candidatePhone', 'relationship'];
    
    this.errors = {};
    fields.forEach(field => {
      const error = this._validateField(field, this.formData[field]);
      if (error) {
        this.errors[field] = error;
      }
    });
  }
  
  // ========================
  // FILE HANDLING METHODS
  // ========================
  
  /**
   * Validates uploaded file
   * @param {File} file - File to validate
   * @returns {string|null} Error message or null
   */
  _validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    
    // Check file type
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      return 'פורמט לא נתמך. נא להעלות PDF, DOC או DOCX';
    }
    
    // Check file size
    if (file.size > maxSize) {
      return 'הקובץ גדול מדי. גודל מקסימלי: 5MB';
    }
    
    return null;
  }
  
  /**
   * Handles file selection/drop
   * @param {File} file - Selected file
   */
  _handleFile(file) {
    const error = this._validateFile(file);
    const errorEl = document.getElementById('upload-error');
    
    if (error) {
      if (errorEl) {
        errorEl.textContent = error;
        errorEl.style.display = 'block';
      }
      return;
    }
    
    // Clear any previous error
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
    
    this.uploadedFile = file;
    this._updateUploadZone();
    this._updateSubmitButtonState();
  }
  
  /**
   * Updates upload zone display
   */
  _updateUploadZone() {
    const uploadZone = document.getElementById('upload-zone');
    const filePreview = document.getElementById('file-preview');
    const targetEl = uploadZone || filePreview;
    
    if (!targetEl) return;
    
    // Create new content
    const newContent = this.uploadedFile ? this._renderFilePreview() : this._renderUploadZoneOnly();
    
    // Replace element
    const temp = document.createElement('div');
    temp.innerHTML = newContent;
    targetEl.replaceWith(temp.firstElementChild);
    
    // Rebind upload zone events if restored
    if (!this.uploadedFile) {
      this._bindUploadZoneEvents();
    }
  }
  
  /**
   * Renders just the upload zone without error container
   * @returns {string} HTML string
   */
  _renderUploadZoneOnly() {
    return `
      <div class="upload-zone" id="upload-zone" role="region" aria-label="העלאת קורות חיים">
        <input type="file"
               id="resume-input"
               class="upload-zone__input"
               accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
               aria-label="בחר קובץ קורות חיים">
        
        <div class="upload-zone__content">
          <i class="ti ti-file-upload upload-zone__icon" aria-hidden="true"></i>
          <p class="upload-zone__text">
            <span class="upload-zone__text-primary">${renderIcon('file-text')} גררו קובץ לכאן או לחצו לבחירה</span>
          </p>
          <p class="upload-zone__formats">PDF, DOC, DOCX</p>
          <p class="upload-zone__size">עד 5MB</p>
        </div>
        
        <div class="upload-zone__hover-content" aria-hidden="true">
          <i class="ti ti-file-download upload-zone__icon" aria-hidden="true"></i>
          <p class="upload-zone__text">שחררו כדי להעלות</p>
        </div>
      </div>
    `;
  }
  
  /**
   * Formats file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size string
   */
  _formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  
  // ========================
  // SUBMISSION METHODS
  // ========================
  
  /**
   * Checks if this is user's first referral
   * @returns {boolean}
   */
  _isFirstReferral() {
    const referrals = stateManager.getState('referrals') || [];
    return referrals.length === 0;
  }
  
  /**
   * Handles form submission
   */
  async handleSubmit() {
    if (!this._isFormValid() || this.isSubmitting) return;
    
    this.isSubmitting = true;
    this._updateSubmitButton();
    this._disableFormFields();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const currentUser = stateManager.getState('currentUser');
    const referrals = stateManager.getState('referrals') || [];
    const stamps = stateManager.getState('stamps') || [];
    const isFirstReferral = referrals.length === 0;
    
    // Create new referral
    const newReferral = {
      id: `ref-${Date.now()}`,
      positionId: this.position.id,
      positionTitle: this.position.title,
      candidateName: this.formData.candidateName,
      candidateEmail: this.formData.candidateEmail,
      candidatePhone: this.formData.candidatePhone || null,
      relationship: this.formData.relationship,
      notes: this.formData.notes || null,
      resumeFileName: this.uploadedFile?.name || null,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'submitted',
          date: new Date().toISOString(),
          points: 50
        }
      ],
      pointsEarned: 50
    };
    
    // Create submission stamp
    const submissionStamp = {
      id: `stmp-${Date.now()}`,
      type: 'submitted',
      title: 'קו״ח הוגש',
      points: 50,
      earnedAt: new Date().toISOString(),
      referralId: newReferral.id,
      positionTitle: this.position.title
    };
    
    const newStamps = [...stamps, submissionStamp];
    let pointsAdded = 50;
    const earnedStampsArray = [submissionStamp];
    
    // First referral bonus
    if (isFirstReferral) {
      const firstReferralStamp = {
        id: `stmp-${Date.now()}-first`,
        type: 'first-referral',
        title: 'הפניה ראשונה',
        points: 100,
        earnedAt: new Date().toISOString(),
        referralId: newReferral.id
      };
      newStamps.push(firstReferralStamp);
      pointsAdded += 100;
      earnedStampsArray.push(firstReferralStamp);
    }
    
    // Update state
    stateManager.setState({
      referrals: [...referrals, newReferral],
      stamps: newStamps,
      currentUser: {
        ...currentUser,
        points: (currentUser?.points || 0) + pointsAdded
      },
      lastSubmittedReferral: newReferral,
      pointsEarnedFromSubmission: pointsAdded,
      earnedStamps: earnedStampsArray,
      referringPosition: null, // Clear after submission
      referralFormInstance: null
    });
    
    // Show success message
    app.showToast('ההפניה נשלחה בהצלחה!', 'success');
    
    // Navigate to confirmation (Story 4.6)
    router.navigate('referral-confirmation');
  }
  
  /**
   * Updates submit button state
   */
  _updateSubmitButton() {
    const btn = document.querySelector('.referral-form__submit-btn');
    if (!btn) return;
    
    if (this.isSubmitting) {
      btn.disabled = true;
      btn.innerHTML = `
        <span class="btn__spinner" aria-hidden="true"></span>
        שולח...
      `;
    }
  }
  
  /**
   * Disables all form fields during submission
   */
  _disableFormFields() {
    const form = document.querySelector('.referral-form__form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
      input.disabled = true;
    });
  }
  
  // ========================
  // UTILITY METHODS
  // ========================
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  // ========================
  // EVENT HANDLERS
  // ========================
  
  /**
   * Handles input changes
   * @param {Event} e - Input event
   */
  _handleInput(e) {
    const field = e.target.dataset.field;
    if (!field) return;
    
    this.formData[field] = e.target.value;
    
    // Update character counter for notes
    if (field === 'notes') {
      this._updateCharCounter();
    }
    
    // Validate on input if field has been touched
    if (this.touched[field]) {
      this.errors[field] = this._validateField(field, this.formData[field]);
      this._updateFieldState(field);
    }
    
    // Update submit button
    this._updateSubmitButtonState();
  }
  
  /**
   * Handles field blur
   * @param {Event} e - Blur event
   */
  _handleBlur(e) {
    const field = e.target.dataset.field;
    if (!field) return;
    
    this.touched[field] = true;
    this.errors[field] = this._validateField(field, this.formData[field]);
    this._updateFieldState(field);
    this._updateSubmitButtonState();
  }
  
  /**
   * Updates individual field visual state
   * @param {string} field - Field name
   */
  _updateFieldState(field) {
    const container = document.querySelector(`[data-field="${field}"]`)?.closest('.form-field');
    if (!container) return;
    
    const error = this.errors[field];
    const value = this.formData[field];
    const isValid = !error && value;
    
    container.classList.toggle('form-field--error', !!error);
    container.classList.toggle('form-field--valid', isValid);
    
    // Update icons
    const wrapper = container.querySelector('.form-field__input-wrapper');
    if (wrapper) {
      // Remove existing icons
      wrapper.querySelectorAll('.form-field__icon').forEach(icon => icon.remove());
      
      // Add appropriate icon
      if (isValid) {
        wrapper.insertAdjacentHTML('beforeend', '<i class="ti ti-check form-field__icon form-field__icon--valid" aria-hidden="true"></i>');
      } else if (error) {
        wrapper.insertAdjacentHTML('beforeend', '<i class="ti ti-alert-circle form-field__icon form-field__icon--error" aria-hidden="true"></i>');
      }
    }
    
    // Update error message
    const existingError = container.querySelector('.form-field__error');
    const inputEl = container.querySelector(`[data-field="${field}"]`);
    const errorId = `referral-${field}-error`;
    
    if (error && !existingError) {
      const errorP = document.createElement('p');
      errorP.id = errorId;
      errorP.className = 'form-field__error';
      errorP.role = 'alert';
      errorP.textContent = error;
      container.appendChild(errorP);
      if (inputEl) {
        inputEl.setAttribute('aria-describedby', errorId);
        inputEl.setAttribute('aria-invalid', 'true');
      }
    } else if (!error && existingError) {
      existingError.remove();
      if (inputEl) {
        inputEl.removeAttribute('aria-describedby');
        inputEl.removeAttribute('aria-invalid');
      }
    } else if (error && existingError) {
      existingError.textContent = error;
    }
  }
  
  /**
   * Updates character counter for notes
   */
  _updateCharCounter() {
    const counter = document.querySelector('.form-field__counter-current');
    const counterContainer = document.querySelector('.form-field__counter');
    if (!counter || !counterContainer) return;
    
    const count = (this.formData.notes || '').length;
    counter.textContent = count;
    counterContainer.classList.toggle('form-field__counter--warning', count >= 450);
  }
  
  /**
   * Updates submit button enabled/disabled state
   */
  _updateSubmitButtonState() {
    const btn = document.querySelector('.referral-form__submit-btn');
    if (!btn || this.isSubmitting) return;
    
    btn.disabled = !this._isFormValid();
  }
  
  /**
   * Handles dragover event
   * @param {DragEvent} e - Drag event
   */
  _handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('upload-zone');
    if (zone) {
      zone.classList.add('upload-zone--hover');
    }
  }
  
  /**
   * Handles dragleave event
   * @param {DragEvent} e - Drag event
   */
  _handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('upload-zone');
    if (zone && !zone.contains(e.relatedTarget)) {
      zone.classList.remove('upload-zone--hover');
    }
  }
  
  /**
   * Handles file drop
   * @param {DragEvent} e - Drop event
   */
  _handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const zone = document.getElementById('upload-zone');
    if (zone) {
      zone.classList.remove('upload-zone--hover');
    }
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this._handleFile(files[0]);
    }
  }
  
  /**
   * Checks if form has any data entered
   * @returns {boolean}
   */
  hasFormData() {
    return !!(
      this.formData.candidateName ||
      this.formData.candidateEmail ||
      this.formData.candidatePhone ||
      this.formData.relationship ||
      this.formData.notes ||
      this.uploadedFile
    );
  }
  
  // ========================
  // LIFECYCLE
  // ========================
  
  /**
   * Binds event listeners for upload zone
   */
  _bindUploadZoneEvents() {
    const zone = document.getElementById('upload-zone');
    if (!zone) return;
    
    zone.addEventListener('dragover', this._handleDragOver);
    zone.addEventListener('dragleave', this._handleDragLeave);
    zone.addEventListener('drop', this._handleDrop);
    
    // Click to browse
    zone.addEventListener('click', () => {
      const input = document.getElementById('resume-input');
      if (input) input.click();
    });
    
    // File input change
    const fileInput = document.getElementById('resume-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          this._handleFile(files[0]);
        }
      });
    }
  }
  
  /**
   * Binds event listeners after mount
   */
  bindEvents() {
    const form = document.querySelector('.referral-form__form');
    if (!form) return;
    
    // Form field events (using event delegation)
    form.addEventListener('input', this._handleInput);
    form.addEventListener('blur', this._handleBlur, true);
    form.addEventListener('change', this._handleBlur); // For select
    
    // Prevent form default submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
    
    // Bind upload zone events
    this._bindUploadZoneEvents();
  }
  
  mount() {
    super.mount();
    this.bindEvents();
  }
  
  unmount() {
    // Clear instance from state
    stateManager.setState({ referralFormInstance: null });
    super.unmount();
  }
}

/* ============================================================================
   REFERRAL CONFIRMATION COMPONENT (Story 4.6)
   ============================================================================
   Success screen after referral submission with stamps, points, and celebration
   ========================================================================== */

class ReferralConfirmationComponent extends Component {
  constructor(props) {
    super(props);
    this.referral = null;
    this.pointsEarned = 0;
    this.earnedStamps = [];
    this.isFirstReferral = false;
    this.animationStarted = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    // Get submission data from state
    this.referral = stateManager.getState('lastSubmittedReferral');
    this.pointsEarned = stateManager.getState('pointsEarnedFromSubmission') || 50;
    this.earnedStamps = stateManager.getState('earnedStamps') || [];
    this.isFirstReferral = this.pointsEarned >= 150;
    
    if (!this.referral) {
      // No submission data, show error state
      return `
        <div class="app-layout">
          <main class="confirmation-error">
            <i class="ti ti-alert-circle" style="font-size: 3rem; color: var(--text-muted);" aria-hidden="true"></i>
            <p>אין נתוני הפניה להציג</p>
            <button class="btn btn--primary" data-action="navigate-dashboard">
              <i class="ti ti-arrow-right" aria-hidden="true"></i>
              חזרה לדשבורד
            </button>
          </main>
        </div>
      `;
    }
    
    return `
      <div class="app-layout">
        <main class="confirmation" id="confirmation-screen" role="main">
          <div class="confirmation__content">
            ${this._renderSuccessHeader()}
            ${this._renderReferralInfo()}
            ${this._renderStampSection()}
            ${this._renderPointsSection()}
            ${this._renderCTAs()}
          </div>
          
          <!-- Hidden announcement for screen readers -->
          <div class="visually-hidden" aria-live="assertive" id="confirmation-announcement">
            ההפניה נשלחה בהצלחה! ${this.isFirstReferral ? 'זו ההפניה הראשונה שלך!' : ''} 
            הרווחת ${this.pointsEarned} נקודות.
          </div>
        </main>
      </div>
    `;
  }
  
  /**
   * Renders success header with celebration message
   * @returns {string} HTML string
   */
  _renderSuccessHeader() {
    const firstReferralMessage = this.isFirstReferral 
      ? `<p class="confirmation__first-badge">${renderIcon('star-filled')} הפניה ראשונה - מעולה!</p>`
      : '';
    
    return `
      <header class="confirmation__header">
        <div class="confirmation__success-icon" aria-hidden="true">
          <span class="confirmation__checkmark">${renderIcon('check', { size: 'xl' })}</span>
        </div>
        
        <h1 class="confirmation__title" id="confirmation-title" tabindex="-1">
          ${renderIcon('confetti')} ההפניה נשלחה בהצלחה!
        </h1>
        
        ${firstReferralMessage}
      </header>
    `;
  }
  
  /**
   * Renders referral information summary
   * @returns {string} HTML string
   */
  _renderReferralInfo() {
    return `
      <section class="confirmation__referral-info" aria-label="פרטי ההפניה">
        <div class="confirmation__referral-card">
          <div class="confirmation__referral-avatar" aria-hidden="true">
            ${this._getInitials(this.referral.candidateName)}
          </div>
          <div class="confirmation__referral-details">
            <p class="confirmation__candidate-name">
              ${this._escapeHtml(this.referral.candidateName)}
            </p>
            <p class="confirmation__position-title">
              <i class="ti ti-briefcase" aria-hidden="true"></i>
              ${this._escapeHtml(this.referral.positionTitle)}
            </p>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders earned stamps section
   * @returns {string} HTML string
   */
  _renderStampSection() {
    if (this.earnedStamps.length === 0) {
      return '';
    }
    
    const stampsHtml = this.earnedStamps.map((stamp, index) => {
      const animationDelay = this.reducedMotion ? 0 : index * 300;
      return this._renderStamp(stamp, animationDelay);
    }).join('');
    
    return `
      <section class="confirmation__stamps" aria-label="חותמות שהושגו">
        <h2 class="confirmation__section-title">חותמות חדשות!</h2>
        <div class="confirmation__stamps-grid">
          ${stampsHtml}
        </div>
      </section>
    `;
  }
  
  /**
   * Renders individual stamp
   * @param {Object} stamp - Stamp data
   * @param {number} delay - Animation delay in ms
   * @returns {string} HTML string
   */
  _renderStamp(stamp, delay) {
    const stampType = stamp.type || 'submitted';
    const stampConfig = STAMP_TYPES[stampType] || STAMP_TYPES.submitted;
    const animationClass = this.reducedMotion ? 'confirmation__stamp--visible' : 'confirmation__stamp--animate';
    
    return `
      <div class="confirmation__stamp ${animationClass}"
           style="--animation-delay: ${delay}ms; --stamp-color: ${stampConfig.color};"
           role="img"
           aria-label="${stamp.title}: +${stamp.points} נקודות">
        <div class="confirmation__stamp-inner">
          <span class="confirmation__stamp-icon" aria-hidden="true">
            ${renderIcon(stampConfig.icon)}
          </span>
          <span class="confirmation__stamp-title">${stamp.title}</span>
          <span class="confirmation__stamp-points">+${stamp.points}</span>
        </div>
      </div>
    `;
  }
  
  /**
   * Renders points earned section with animated counter
   * @returns {string} HTML string
   */
  _renderPointsSection() {
    const displayValue = this.reducedMotion ? this.pointsEarned : 0;
    
    return `
      <section class="confirmation__points" aria-label="נקודות שהושגו">
        <div class="confirmation__points-display">
          <span class="confirmation__points-label">נקודות שהושגו</span>
          <span class="confirmation__points-value" id="points-counter" data-target="${this.pointsEarned}">
            +${displayValue}
          </span>
        </div>
        
        <p class="confirmation__points-message">
          ${this.isFirstReferral 
            ? `${renderIcon('confetti')} כולל בונוס הפניה ראשונה!` 
            : 'הנקודות נוספו לחשבונך'}
        </p>
      </section>
    `;
  }
  
  /**
   * Renders CTA buttons
   * @returns {string} HTML string
   */
  _renderCTAs() {
    return `
      <section class="confirmation__ctas">
        <button class="btn btn--primary btn--lg confirmation__cta-primary"
                data-action="view-passport-from-confirmation"
                aria-label="צפה בדרכון שלי">
          <i class="ti ti-book" aria-hidden="true"></i>
          צפה בדרכון
        </button>
        
        <button class="btn btn--secondary btn--lg confirmation__cta-secondary"
                data-action="refer-another"
                aria-label="הפנה מועמד נוסף">
          <i class="ti ti-user-plus" aria-hidden="true"></i>
          הפנה עוד
        </button>
        
        <button class="btn btn--text confirmation__share-btn"
                data-action="share-referral-success"
                aria-label="שתף הצלחה">
          <i class="ti ti-share" aria-hidden="true"></i>
          שתף את ההצלחה שלך
        </button>
      </section>
    `;
  }
  
  // ========================
  // ANIMATION METHODS
  // ========================
  
  /**
   * Starts all animations and celebrations
   */
  startCelebrations() {
    if (this.animationStarted) return;
    this.animationStarted = true;
    
    if (this.reducedMotion) {
      // Just announce to screen reader
      this._announceSuccess();
      return;
    }
    
    // Fire confetti
    this._fireConfetti();
    
    // Animate points counter
    this._animatePointsCounter();
    
    // Trigger stamp animations
    this._animateStamps();
  }
  
  /**
   * Fires confetti celebration
   */
  _fireConfetti() {
    // Check if confetti library is available
    if (typeof confetti !== 'function') {
      console.warn('Confetti library not loaded, skipping celebration');
      this._showFallbackCelebration();
      return;
    }
    
    const colors = ['#E10514', '#F1C40F', '#22C55E', '#0984E3'];
    
    try {
      if (this.isFirstReferral) {
        // Enhanced celebration for first referral
        // First burst
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: colors
        });
        
        // Side bursts
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });
        }, 500);
        
        // Stars for first referral
        setTimeout(() => {
          confetti({
            particleCount: 30,
            spread: 120,
            shapes: ['star'],
            colors: ['#FD79A8', '#E10514', '#F1C40F'],
            origin: { y: 0.6 }
          });
        }, 1000);
        
      } else {
        // Standard celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors
        });
      }
    } catch (err) {
      console.warn('Confetti failed:', err);
      this._showFallbackCelebration();
    }
  }
  
  /**
   * Shows fallback celebration when confetti unavailable
   */
  _showFallbackCelebration() {
    // Add a CSS-based celebration class
    const screen = document.getElementById('confirmation-screen');
    if (screen) {
      screen.classList.add('confirmation--fallback-celebration');
    }
    
    // Show toast as alternative
    if (app && typeof app.showToast === 'function') {
      app.showToast(this.isFirstReferral ? 'כל הכבוד על ההפניה הראשונה!' : 'ההפניה נשלחה!', 'success');
    }
  }
  
  /**
   * Animates the points counter from 0 to target
   */
  _animatePointsCounter() {
    const counter = document.getElementById('points-counter');
    if (!counter) return;
    
    const target = parseInt(counter.dataset.target) || this.pointsEarned;
    const duration = 1000; // 1 second
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * easeOut);
      
      counter.textContent = `+${current}`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * Triggers stamp animations
   */
  _animateStamps() {
    const stamps = document.querySelectorAll('.confirmation__stamp');
    
    stamps.forEach((stamp, index) => {
      const delay = index * 300;
      
      setTimeout(() => {
        stamp.classList.remove('confirmation__stamp--animate');
        stamp.classList.add('confirmation__stamp--slam');
        
        // After slam animation, set to visible
        setTimeout(() => {
          stamp.classList.remove('confirmation__stamp--slam');
          stamp.classList.add('confirmation__stamp--visible');
        }, 500);
      }, delay);
    });
  }
  
  /**
   * Announces success to screen readers
   */
  _announceSuccess() {
    const announcement = document.getElementById('confirmation-announcement');
    if (announcement) {
      // Force announcement by toggling content
      const text = announcement.textContent;
      announcement.textContent = '';
      setTimeout(() => {
        announcement.textContent = text;
      }, 100);
    }
  }
  
  // ========================
  // UTILITY METHODS
  // ========================
  
  /**
   * Gets initials from name
   * @param {string} name - Full name
   * @returns {string} Initials
   */
  _getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
    return name.charAt(0);
  }
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  // ========================
  // LIFECYCLE
  // ========================
  
  /**
   * Called after component is mounted to DOM
   */
  mount() {
    super.mount();
    
    // Focus on title for accessibility
    const title = document.getElementById('confirmation-title');
    if (title) {
      title.focus();
    }
    
    // Start celebrations after a brief delay for page render
    setTimeout(() => {
      this.startCelebrations();
    }, 300);
  }
  
  /**
   * Called before component is removed
   */
  unmount() {
    // Clean up submission state when leaving
    stateManager.setState({
      lastSubmittedReferral: null,
      pointsEarnedFromSubmission: null,
      earnedStamps: null
    });
    
    super.unmount();
  }
}

/* ============================================================================
   STATUS PIPELINE COMPONENT (Story 5.2)
   ============================================================================
   Reusable pipeline visualization component for referral progress.
   Supports 'mini' (for cards) and 'full' (for modals) size variants.
   ========================================================================== */

/**
 * StatusPipeline - Reusable pipeline visualization component
 * 
 * @param {Object} props
 * @param {string} props.status - Current referral status
 * @param {string} props.size - 'mini' | 'full' (default: 'mini')
 * @param {boolean} props.isRejected - Whether the referral was rejected
 * @param {number} props.rejectionStage - Stage index where rejection occurred
 */
class StatusPipeline {
  constructor(props = {}) {
    this.status = props.status || 'submitted';
    this.size = props.size || 'mini';
    this.isRejected = props.isRejected || this.status === 'rejected';
    this.rejectionStage = props.rejectionStage;
  }
  
  /**
   * Main render method
   * @returns {string} HTML string
   */
  render() {
    const currentIndex = this._getCurrentStageIndex();
    const stages = PIPELINE_STAGES;
    const sizeClass = `status-pipeline--${this.size}`;
    
    // Calculate progress percentage for accessibility
    const progressText = this.isRejected 
      ? `נדחה בשלב ${currentIndex + 1} מתוך ${stages.length}` 
      : `שלב ${currentIndex + 1} מתוך ${stages.length}, ${stages[currentIndex]?.label || stages[0].label}`;
    
    return `
      <div class="status-pipeline ${sizeClass} ${this.isRejected ? 'status-pipeline--rejected' : ''}"
           role="progressbar"
           aria-valuenow="${currentIndex + 1}"
           aria-valuemin="1"
           aria-valuemax="${stages.length}"
           aria-label="${progressText}"
           aria-valuetext="${progressText}">
        <div class="status-pipeline__track">
          ${stages.map((stage, index) => this._renderStage(stage, index, currentIndex)).join('')}
        </div>
        ${this.size === 'full' ? this._renderLabels(stages, currentIndex) : ''}
      </div>
    `;
  }
  
  /**
   * Gets the current stage index from status
   * @returns {number} Stage index
   */
  _getCurrentStageIndex() {
    // If rejected, find where in the pipeline it stopped
    if (this.isRejected && this.rejectionStage !== undefined) {
      return Math.min(this.rejectionStage, PIPELINE_STAGES.length - 1);
    }
    
    // Handle rejected status - default to review if no specific stage
    if (this.status === 'rejected') {
      return 1; // Default rejection after review
    }
    
    const index = STAGE_INDEX[this.status];
    return index !== undefined ? index : 0;
  }
  
  /**
   * Renders a single pipeline stage
   * @param {Object} stage - Stage configuration
   * @param {number} index - Stage index
   * @param {number} currentIndex - Current progress index
   * @returns {string} HTML string
   */
  _renderStage(stage, index, currentIndex) {
    const stateClass = this._getStageStateClass(index, currentIndex);
    const isFirst = index === 0;
    
    // Determine icon to display
    let iconHtml;
    if (this.isRejected && index === currentIndex) {
      iconHtml = '<i class="ti ti-x" aria-hidden="true"></i>';
    } else if (index < currentIndex || (index === currentIndex && this.status === 'hired')) {
      iconHtml = '<i class="ti ti-check" aria-hidden="true"></i>';
    } else if (this.size === 'full' && index === currentIndex && !this.isRejected) {
      iconHtml = `<i class="ti ${stage.icon}" aria-hidden="true"></i>`;
    } else {
      iconHtml = '';
    }
    
    return `
      ${!isFirst ? this._renderConnector(index, currentIndex) : ''}
      <div class="status-pipeline__stage ${stateClass}"
           ${index === currentIndex ? 'aria-current="step"' : ''}>
        <div class="status-pipeline__circle">
          ${iconHtml}
        </div>
      </div>
    `;
  }
  
  /**
   * Gets the CSS class for stage state
   * @param {number} index - Stage index
   * @param {number} currentIndex - Current progress index
   * @returns {string} CSS class
   */
  _getStageStateClass(index, currentIndex) {
    if (this.isRejected) {
      if (index < currentIndex) {
        return 'status-pipeline__stage--completed';
      } else if (index === currentIndex) {
        return 'status-pipeline__stage--rejected';
      }
      return 'status-pipeline__stage--pending';
    }
    
    if (index < currentIndex) {
      return 'status-pipeline__stage--completed';
    } else if (index === currentIndex) {
      return 'status-pipeline__stage--current';
    }
    return 'status-pipeline__stage--pending';
  }
  
  /**
   * Renders connector line between stages
   * @param {number} index - Stage index (after connector)
   * @param {number} currentIndex - Current progress index
   * @returns {string} HTML string
   */
  _renderConnector(index, currentIndex) {
    let connectorClass = 'status-pipeline__connector';
    
    if (index <= currentIndex) {
      connectorClass += ' status-pipeline__connector--completed';
    }
    
    return `<div class="${connectorClass}" aria-hidden="true"></div>`;
  }
  
  /**
   * Renders stage labels for full size variant
   * @param {Array} stages - Pipeline stages
   * @param {number} currentIndex - Current progress index
   * @returns {string} HTML string
   */
  _renderLabels(stages, currentIndex) {
    return `
      <div class="status-pipeline__labels" aria-hidden="true">
        ${stages.map((stage, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex || (this.status === 'hired' && index === currentIndex);
          const isRejectedStage = this.isRejected && index === currentIndex;
          
          let labelClass = 'status-pipeline__label';
          if (isActive) labelClass += ' status-pipeline__label--active';
          if (isCompleted) labelClass += ' status-pipeline__label--completed';
          if (isRejectedStage) labelClass += ' status-pipeline__label--rejected';
          
          return `<span class="${labelClass}">${stage.label}</span>`;
        }).join('')}
      </div>
    `;
  }
}

/**
 * Helper function to render pipeline in templates
 * @param {Object} referral - Referral object with status
 * @param {string} size - 'mini' | 'full'
 * @returns {string} HTML string
 */
function renderStatusPipeline(referral, size = 'mini') {
  // Handle both referral object and plain status string
  const status = typeof referral === 'string' ? referral : referral.status;
  const isRejected = status === 'rejected';
  
  // Determine rejection stage from timeline if available
  let rejectionStage;
  if (isRejected && referral.timeline) {
    // Find the last non-rejected stage to determine where rejection occurred
    const timeline = referral.timeline.filter(t => t.status !== 'rejected');
    const lastStage = timeline[timeline.length - 1];
    if (lastStage && STAGE_INDEX[lastStage.status] !== undefined) {
      rejectionStage = STAGE_INDEX[lastStage.status] + 1;
    }
  }
  
  // For rejected referrals, use the stage before rejection for display
  const displayStatus = isRejected 
    ? (referral.timeline?.[referral.timeline.length - 2]?.status || 'review') 
    : status;
  
  const pipeline = new StatusPipeline({
    status: displayStatus,
    size: size,
    isRejected: isRejected,
    rejectionStage: rejectionStage
  });
  
  return pipeline.render();
}

/* ============================================================================
   REFERRALS COMPONENT (Story 5.1)
   ============================================================================
   Displays user's referrals with filtering capability
   ========================================================================== */

class ReferralsComponent extends Component {
  constructor(props) {
    super(props);
    this.referrals = [];
    this.filter = 'all';
    this.isLoading = true;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    return `
      <div class="app-layout">
        <main class="referrals-page" id="referrals-page" role="main">
          ${this._renderHeader()}
          ${this._renderTabFilters()}
          ${this._renderContent()}
        </main>
      </div>
    `;
  }
  
  /**
   * Renders page header
   * @returns {string} HTML string
   */
  _renderHeader() {
    return `
      <header class="referrals-header">
        <h1 class="referrals-header__title">${renderIcon('clipboard-list')} ההפניות שלי</h1>
      </header>
    `;
  }
  
  /**
   * Renders tab filter navigation
   * @returns {string} HTML string
   */
  _renderTabFilters() {
    if (this.isLoading) {
      return `
        <nav class="referral-tabs" role="tablist" aria-label="סינון הפניות">
          <div class="referral-tab skeleton skeleton--tab"></div>
          <div class="referral-tab skeleton skeleton--tab"></div>
          <div class="referral-tab skeleton skeleton--tab"></div>
          <div class="referral-tab skeleton skeleton--tab"></div>
        </nav>
      `;
    }
    
    const counts = this._calculateFilterCounts();
    const tabs = [
      { key: 'all', label: 'הכל', count: counts.all },
      { key: 'in-progress', label: 'בתהליך', count: counts.inProgress },
      { key: 'hired', label: 'גויסו', icon: 'check', count: counts.hired, className: 'referral-tab--success' },
      { key: 'rejected', label: 'נדחו', count: counts.rejected, className: 'referral-tab--muted' }
    ];
    
    return `
      <nav class="referral-tabs" role="tablist" aria-label="סינון הפניות">
        ${tabs.map(tab => `
          <button class="referral-tab ${this.filter === tab.key ? 'referral-tab--active' : ''} ${tab.className || ''}"
                  role="tab"
                  aria-selected="${this.filter === tab.key}"
                  data-action="filter-referrals"
                  data-filter="${tab.key}">
            <span class="referral-tab__label">${tab.label}${tab.icon ? ` ${renderIcon(tab.icon)}` : ''}</span>
            <span class="referral-tab__count">${tab.count}</span>
          </button>
        `).join('')}
      </nav>
    `;
  }
  
  /**
   * Calculates counts for each filter tab
   * @returns {Object} Filter counts
   */
  _calculateFilterCounts() {
    const referrals = this.referrals || [];
    return {
      all: referrals.length,
      inProgress: referrals.filter(r => 
        ['submitted', 'review', 'interview', 'offer'].includes(r.status)
      ).length,
      hired: referrals.filter(r => r.status === 'hired').length,
      rejected: referrals.filter(r => r.status === 'rejected').length
    };
  }
  
  /**
   * Renders main content area (list or empty state)
   * @returns {string} HTML string
   */
  _renderContent() {
    if (this.isLoading) {
      return `
        <div class="referral-list" role="list" aria-label="רשימת הפניות">
          ${this._renderSkeletons()}
        </div>
      `;
    }
    
    if (this.referrals.length === 0) {
      return this._renderEmptyState('no-referrals');
    }
    
    const filteredReferrals = this._getFilteredReferrals();
    
    if (filteredReferrals.length === 0) {
      return this._renderEmptyState('no-results');
    }
    
    return `
      <div class="referral-list" role="list" aria-label="רשימת הפניות">
        ${filteredReferrals.map(referral => this._renderReferralCard(referral)).join('')}
      </div>
    `;
  }
  
  /**
   * Renders skeleton loading cards
   * @returns {string} HTML string
   */
  _renderSkeletons() {
    return Array(3).fill(0).map(() => `
      <article class="referral-card referral-card--skeleton">
        <div class="referral-card__avatar skeleton skeleton--avatar"></div>
        <div class="referral-card__content">
          <div class="skeleton skeleton--text" style="width: 60%"></div>
          <div class="skeleton skeleton--text-sm" style="width: 80%"></div>
          <div class="skeleton skeleton--text-sm" style="width: 40%"></div>
        </div>
        <div class="referral-card__status">
          <div class="skeleton skeleton--badge"></div>
        </div>
      </article>
    `).join('');
  }
  
  /**
   * Gets filtered referrals based on active filter
   * @returns {Array} Filtered referrals
   */
  _getFilteredReferrals() {
    const referrals = this.referrals || [];
    
    // Sort by submission date (newest first)
    const sorted = [...referrals].sort((a, b) => 
      new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    
    switch (this.filter) {
      case 'in-progress':
        return sorted.filter(r => 
          ['submitted', 'review', 'interview', 'offer'].includes(r.status)
        );
      case 'hired':
        return sorted.filter(r => r.status === 'hired');
      case 'rejected':
        return sorted.filter(r => r.status === 'rejected');
      default:
        return sorted;
    }
  }
  
  /**
   * Renders a single referral card
   * @param {Object} referral - Referral data
   * @returns {string} HTML string
   */
  _renderReferralCard(referral) {
    const statusInfo = REFERRAL_STATUS_CONFIG[referral.status] || REFERRAL_STATUS_CONFIG.submitted;
    const initials = this._getInitials(referral.candidateName);
    const formattedDate = this._formatHebrewDate(referral.submittedAt);
    
    return `
      <article class="referral-card referral-card--${referral.status}"
               role="listitem"
               data-action="view-referral-details"
               data-referral-id="${referral.id}"
               tabindex="0"
               aria-label="הפניה של ${this._escapeHtml(referral.candidateName)} למשרת ${this._escapeHtml(referral.positionTitle)}">
        
        <div class="referral-card__avatar" 
             style="--avatar-color: ${statusInfo.color}"
             aria-hidden="true">
          ${initials}
        </div>
        
        <div class="referral-card__content">
          <h3 class="referral-card__candidate-name">
            ${this._escapeHtml(referral.candidateName)}
          </h3>
          <p class="referral-card__position">
            ${this._escapeHtml(referral.positionTitle)}
          </p>
          <p class="referral-card__date">
            <i class="ti ti-calendar" aria-hidden="true"></i>
            ${formattedDate}
          </p>
        </div>
        
        <div class="referral-card__status">
          ${this._renderStatusBadge(referral.status)}
          ${renderStatusPipeline(referral, 'mini')}
        </div>
        
        <i class="ti ti-chevron-left referral-card__chevron" aria-hidden="true"></i>
      </article>
    `;
  }
  
  /**
   * Renders status badge
   * @param {string} status - Referral status
   * @returns {string} HTML string
   */
  _renderStatusBadge(status) {
    const statusInfo = REFERRAL_STATUS_CONFIG[status] || REFERRAL_STATUS_CONFIG.submitted;
    
    return `
      <span class="referral-badge referral-badge--${status}"
            style="--badge-color: ${statusInfo.color}"
            role="status">
        ${renderIcon(statusInfo.icon)}
        <span>${statusInfo.hebrew}</span>
      </span>
    `;
  }
  
  // Note: _renderMiniPipeline() removed - replaced by StatusPipeline component (Story 5.2)
  
  /**
   * Renders empty state
   * @param {string} type - 'no-referrals' or 'no-results'
   * @returns {string} HTML string
   */
  _renderEmptyState(type) {
    if (type === 'no-referrals') {
      return `
        <div class="empty-state">
          <div class="empty-state__icon">
            <i class="ti ti-users-group" aria-hidden="true"></i>
          </div>
          <h2 class="empty-state__title">עדיין לא הפנית אף מועמד</h2>
          <p class="empty-state__description">
            התחל להפנות חברים ולצבור נקודות וחותמות בדרכון שלך!
          </p>
          <button class="btn btn--primary btn--lg"
                  data-action="navigate-positions">
            <i class="ti ti-user-plus" aria-hidden="true"></i>
            הפנה את המועמד הראשון שלך
          </button>
        </div>
      `;
    }
    
    // No filter results
    const filterMessages = {
      'in-progress': 'אין הפניות בתהליך כרגע',
      'hired': 'אין גיוסים מוצלחים עדיין',
      'rejected': 'אין הפניות שנדחו'
    };
    
    return `
      <div class="empty-state empty-state--filter">
        <div class="empty-state__icon empty-state__icon--small">
          <i class="ti ti-filter-off" aria-hidden="true"></i>
        </div>
        <p class="empty-state__description">
          ${filterMessages[this.filter] || 'אין תוצאות'}
        </p>
        <button class="btn btn--secondary"
                data-action="filter-referrals"
                data-filter="all">
          צפה בכל ההפניות
        </button>
      </div>
    `;
  }
  
  /**
   * Gets initials from name
   * @param {string} name - Full name
   * @returns {string} Initials (1-2 characters)
   */
  _getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0);
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0));
  }
  
  /**
   * Formats date in Hebrew
   * @param {string} dateStr - ISO date string
   * @returns {string} Hebrew formatted date
   */
  _formatHebrewDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  /**
   * Re-renders component
   */
  _rerender() {
    const container = document.getElementById('referrals-page');
    if (container) {
      const parent = container.parentElement;
      if (parent) {
        parent.innerHTML = this.template();
        this._bindCardEvents();
      }
    }
  }
  
  /**
   * Binds keyboard events to cards for accessibility
   */
  _bindCardEvents() {
    const cards = document.querySelectorAll('.referral-card:not(.referral-card--skeleton)');
    cards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }
  
  /**
   * Loads referrals data
   */
  _loadReferrals() {
    // Get referrals from state or use mock data
    let referrals = stateManager.getState('referrals') || [];
    
    // If no referrals in state, use mock data for demo
    if (referrals.length === 0) {
      referrals = MOCK_REFERRALS;
      stateManager.setState({ referrals: MOCK_REFERRALS });
    }
    
    this.referrals = referrals;
  }
  
  /**
   * Lifecycle: Mount component
   */
  mount() {
    super.mount();
    
    // Simulate loading delay for UX
    this.isLoading = true;
    
    // Load filter from state
    this.filter = stateManager.getState('referralFilter') || 'all';
    
    // Subscribe to state changes
    this.subscribe('referrals', (referrals) => {
      this.referrals = referrals || [];
      if (!this.isLoading) {
        this._rerender();
      }
    });
    
    this.subscribe('referralFilter', (filter) => {
      this.filter = filter || 'all';
      if (!this.isLoading) {
        this._rerender();
      }
    });
    
    // Load data and finish loading
    setTimeout(() => {
      this._loadReferrals();
      this.isLoading = false;
      this._rerender();
    }, 500);
  }
  
  /**
   * Lifecycle: Unmount component
   */
  unmount() {
    super.unmount();
  }
}

/* ============================================================================
   MOBILE SAFARI VIEWPORT HEIGHT FIX (Story 6.4)
   ============================================================================
   Fixes the iOS Safari 100vh issue where the address bar area is included
   in the viewport height calculation, causing content to be cut off.
   ========================================================================== */

/**
 * Sets CSS custom property for actual viewport height
 * This fixes the iOS Safari 100vh issue
 */
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Initializes viewport height fix with event listeners
 */
function initViewportHeightFix() {
  // Set initial value
  setViewportHeight();
  
  // Update on resize
  window.addEventListener('resize', setViewportHeight);
  
  // Update on orientation change (with delay for Safari to update dimensions)
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
  });
}

// Initialize viewport height fix immediately
initViewportHeightFix();

/* ============================================================================
   APP CLASS
   ============================================================================
   Main application controller
   ========================================================================== */

class App {
  constructor() {
    this._components = new Map();
    this._currentComponent = null;
  }
  
  /**
   * Initializes the application
   */
  init() {
    // Set up event delegation
    this._setupEventDelegation();
    
    // Initialize navigation manager
    navigationManager.init();
    
    // Subscribe to view changes
    stateManager.subscribe('currentView', (view) => {
      this._renderView(view);
    });
    
    // Initial render
    this._renderView(stateManager.getState('currentView'));
  }
  
  /**
   * Sets up event delegation on app, header, and nav containers
   */
  _setupEventDelegation() {
    const appContainer = document.getElementById('main-content');
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('nav-container');
    
    if (!appContainer) {
      console.error('App: #main-content container not found');
      return;
    }
    
    // Common click handler
    const handleClick = (event) => {
      const target = event.target.closest('[data-action], [data-navigate]');
      
      if (!target) return;
      
      // Handle navigation
      const navigateTo = target.dataset.navigate;
      if (navigateTo) {
        event.preventDefault();
        router.navigate(navigateTo);
        return;
      }
      
      // Handle actions
      const action = target.dataset.action;
      if (action) {
        event.preventDefault();
        this._handleAction(action, target, event);
      }
    };
    
    // Click event delegation on all containers
    appContainer.addEventListener('click', handleClick);
    
    if (headerContainer) {
      headerContainer.addEventListener('click', handleClick);
    }
    
    if (navContainer) {
      navContainer.addEventListener('click', handleClick);
      
      // Handle keyboard navigation on nav items
      navContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          const target = event.target.closest('[data-navigate]');
          if (target) {
            event.preventDefault();
            router.navigate(target.dataset.navigate);
          }
        }
      });
    }
    
    // Form submission delegation
    appContainer.addEventListener('submit', (event) => {
      const form = event.target;
      const action = form.dataset.action;
      
      if (action) {
        event.preventDefault();
        this._handleAction(action, form, event);
      }
    });
    
    // Input event delegation (for real-time validation, search, etc.)
    appContainer.addEventListener('input', (event) => {
      const target = event.target;
      const action = target.dataset.inputAction;
      
      if (action) {
        this._handleAction(action, target, event);
      }
    });
  }
  
  /**
   * Handles delegated actions
   * @param {string} action - Action name
   * @param {Element} target - Trigger element
   * @param {Event} event - Original event
   */
  _handleAction(action, target, event) {
    // Action handlers will be registered by components
    // This is a placeholder for the action dispatch system
    const handlers = this._actionHandlers || {};
    
    if (handlers[action]) {
      handlers[action](target, event);
    } else {
      console.warn(`App: No handler for action "${action}"`);
    }
  }
  
  /**
   * Registers an action handler
   * @param {string} action - Action name
   * @param {Function} handler - Handler function
   */
  registerAction(action, handler) {
    if (!this._actionHandlers) {
      this._actionHandlers = {};
    }
    this._actionHandlers[action] = handler;
  }
  
  /**
   * Unregisters an action handler
   * @param {string} action - Action name
   */
  unregisterAction(action) {
    if (this._actionHandlers) {
      delete this._actionHandlers[action];
    }
  }
  
  /**
   * Renders the view for a route
   * @param {string} view - View/route name
   */
  _renderView(view) {
    const appContainer = document.getElementById('main-content');
    
    if (!appContainer) {
      console.error('App: #main-content container not found');
      return;
    }
    
    // Unmount current component
    if (this._currentComponent) {
      this._currentComponent.unmount();
      this._currentComponent = null;
    }
    
    // Get component class for route
    const routeConfig = CONFIG.ROUTES[view];
    
    if (!routeConfig) {
      console.error(`App: No route config for "${view}"`);
      appContainer.innerHTML = '<div class="error">Page not found</div>';
      return;
    }
    
    // For now, render a placeholder - components will be implemented in later stories
    const componentName = routeConfig.component;
    const ComponentClass = this._components.get(componentName);
    
    if (ComponentClass) {
      this._currentComponent = new ComponentClass();
      appContainer.innerHTML = this._currentComponent.render();
      this._currentComponent.mount();
      
      // Announce page change to screen readers (Story 6.3 - Accessibility)
      animationService.announcePageChange(view);
    } else {
      // Placeholder for unimplemented components
      appContainer.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--space-4);
          text-align: center;
        ">
          <i class="ti ti-loader" style="font-size: 3rem; color: var(--color-gray-400);"></i>
          <p style="margin-top: var(--space-4); color: var(--color-gray-500);">
            טוען...
          </p>
        </div>
      `;
    }
  }
  
  /**
   * Registers a component class
   * @param {string} name - Component name
   * @param {Function} ComponentClass - Component constructor
   */
  registerComponent(name, ComponentClass) {
    this._components.set(name, ComponentClass);
  }
  
  /**
   * Gets the current component instance by name
   * @param {string} name - Component name to find
   * @returns {Component|null} The current component if it matches, null otherwise
   */
  getComponent(name) {
    // Check if current component matches the requested name
    if (this._currentComponent && this._currentComponent.constructor === this._components.get(name)) {
      return this._currentComponent;
    }
    return null;
  }
  
  /**
   * Shows a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in ms (default 3000)
   */
  showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const icons = {
      success: 'ti-check',
      error: 'ti-x',
      warning: 'ti-alert-triangle',
      info: 'ti-info-circle'
    };
    
    toast.innerHTML = `
      <i class="ti ${icons[type] || icons.info} toast__icon"></i>
      <span class="toast__message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast--visible');
    });
    
    // Auto-remove after duration
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      }, { once: true });
      // Fallback removal
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

// Global app instance
const app = new App();

/* ============================================================================
   STAMP DETAIL MODAL (Story 3.5)
   ============================================================================
   Modal for displaying stamp details with celebration effects
   ========================================================================== */

class StampDetailModal extends Component {
  constructor() {
    super();
    this._stamp = null;
    this._previousActiveElement = null;
    this._boundKeyHandler = null;
  }

  /**
   * Returns the stamp detail modal HTML template
   * @returns {string} HTML string
   */
  template() {
    const stamp = this._stamp;
    if (!stamp) return '';

    const config = STAMP_TYPES[stamp.type] || STAMP_TYPES.submitted;
    const formattedDate = this._formatStampDate(stamp.earnedDate);

    return `
      <div class="modal-overlay modal--stamp-detail"
           data-action="close-stamp-modal-overlay"
           role="dialog"
           aria-modal="true"
           aria-labelledby="stamp-modal-title"
           aria-describedby="stamp-modal-desc">
        <div class="modal-content stamp-modal" onclick="event.stopPropagation()">
          <button class="modal-close"
                  data-action="close-stamp-modal"
                  aria-label="סגור">
            <i class="ti ti-x" aria-hidden="true"></i>
          </button>
          
          <div class="stamp-modal__stamp">
            ${this._renderEnlargedStamp(stamp, config)}
          </div>
          
          <div class="stamp-modal__details">
            <h2 id="stamp-modal-title" class="stamp-modal__title">
              ${renderIcon(config.icon)} ${config.label}
            </h2>
            
            <div class="stamp-modal__points">
              <span class="stamp-modal__points-value">+${config.points}</span>
              <span class="stamp-modal__points-label">נקודות</span>
            </div>
            
            <p id="stamp-modal-desc" class="stamp-modal__description">
              ${config.description || ''}
            </p>
            
            <div class="stamp-modal__meta">
              <div class="stamp-modal__meta-item">
                <i class="ti ti-calendar" aria-hidden="true"></i>
                <span>נצבר: ${formattedDate}</span>
              </div>
              ${stamp.candidateName ? `
                <div class="stamp-modal__meta-item">
                  <i class="ti ti-user" aria-hidden="true"></i>
                  <span>מועמד: ${stamp.candidateName}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renders enlarged stamp for modal display
   * @param {Object} stamp - Stamp data
   * @param {Object} config - Stamp type config
   * @returns {string} HTML string
   */
  _renderEnlargedStamp(stamp, config) {
    return `
      <div class="stamp stamp--large stamp--${config.shape} stamp--${stamp.type}"
           style="--stamp-color: ${config.color}; --stamp-rotation: 0deg"
           aria-hidden="true">
        <div class="stamp__shape">
          <div class="stamp__inner">
            <span class="stamp__icon">
              <i class="ti ti-${config.icon}"></i>
            </span>
            <span class="stamp__label">${config.label}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Formats stamp date in Hebrew
   * @param {Date|string} date - Earned date
   * @returns {string}
   */
  _formatStampDate(date) {
    const months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  /**
   * Opens modal with stamp data
   * @param {Object} stamp - Stamp to display
   */
  open(stamp) {
    this._stamp = stamp;
    this._previousActiveElement = document.activeElement;

    const container = document.getElementById('modal-container');
    if (!container) return;

    container.classList.add('active');
    container.innerHTML = this.render();
    this._element = container.querySelector('.modal--stamp-detail');

    // Animate in
    requestAnimationFrame(() => {
      this._element?.classList.add('modal--visible');
    });

    // Set up keyboard handling
    this._boundKeyHandler = this._handleKeydown.bind(this);
    document.addEventListener('keydown', this._boundKeyHandler);

    // Trap focus
    this._trapFocus();

    this.mount();
  }

  /**
   * Closes the modal
   */
  close() {
    if (!this._element) return;

    this._element.classList.remove('modal--visible');
    this._element.classList.add('modal--closing');

    // Wait for animation
    setTimeout(() => {
      const container = document.getElementById('modal-container');
      if (container) {
        container.classList.remove('active');
        container.innerHTML = '';
      }

      // Return focus
      if (this._previousActiveElement) {
        this._previousActiveElement.focus();
      }

      // Clear state
      stateManager.setState({
        selectedStamp: null,
        activeModal: null
      });
    }, 300);

    // Remove keydown listener
    if (this._boundKeyHandler) {
      document.removeEventListener('keydown', this._boundKeyHandler);
      this._boundKeyHandler = null;
    }

    this.unmount();
  }

  /**
   * Handles keydown for Escape to close and Tab trapping
   * @param {KeyboardEvent} e
   */
  _handleKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }

    // Tab trapping
    if (e.key === 'Tab') {
      this._handleTabKey(e);
    }
  }

  /**
   * Traps focus within modal
   */
  _trapFocus() {
    const focusableElements = this._element?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  /**
   * Handles Tab key for focus trapping
   * @param {KeyboardEvent} e
   */
  _handleTabKey(e) {
    const focusableElements = this._element?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Component mount lifecycle
   */
  mount() {
    super.mount();
    // Handle swipe down on mobile
    this._setupSwipeToClose();
  }

  /**
   * Sets up swipe-to-close gesture
   */
  _setupSwipeToClose() {
    const content = this._element?.querySelector('.modal-content');
    if (!content) return;

    let startY = 0;
    let currentY = 0;

    content.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    content.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // Only track downward swipes
      if (deltaY > 0) {
        content.style.transform = `translateY(${deltaY}px)`;
      }
    }, { passive: true });

    content.addEventListener('touchend', () => {
      const deltaY = currentY - startY;

      if (deltaY > 100) {
        // Close if swiped down enough
        this.close();
      } else {
        // Reset position
        content.style.transform = '';
      }

      startY = 0;
      currentY = 0;
    }, { passive: true });
  }

  /**
   * Component unmount lifecycle
   */
  unmount() {
    super.unmount();
  }
}

// Global stamp detail modal instance
const stampDetailModal = new StampDetailModal();

/* ============================================================================
   POSITION DETAIL MODAL (Story 4.3)
   ============================================================================
   Displays full position details in a modal with sharing and referral actions
   ========================================================================== */

class PositionDetailModal extends Component {
  constructor() {
    super();
    this._position = null;
    this._previousActiveElement = null;
    this._boundKeyHandler = null;
    this._boundOverlayClick = null;
    
    // Touch tracking for swipe-to-close
    this._touchStartY = 0;
    this._touchCurrentY = 0;
    this._isDragging = false;
    this._boundTouchStart = null;
    this._boundTouchMove = null;
    this._boundTouchEnd = null;
  }

  /**
   * Returns the position detail modal HTML template
   * @returns {string} HTML string
   */
  template() {
    const position = this._position;
    if (!position) return '';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return `
      <div class="modal-overlay modal--position-detail ${reducedMotion ? 'modal--no-animation' : ''}"
           data-action="close-position-modal-overlay"
           role="dialog"
           aria-modal="true"
           aria-labelledby="position-modal-title">
        
        <div class="position-detail-modal" onclick="event.stopPropagation()">
          <!-- Drag Handle (Mobile) -->
          <div class="modal__drag-handle" aria-hidden="true">
            <span class="modal__drag-bar"></span>
          </div>
          
          ${this._renderHeader()}
          
          <div class="modal__content">
            ${this._renderDetails()}
          </div>
          
          ${this._renderFooter()}
        </div>
      </div>
    `;
  }

  /**
   * Renders modal header with title, close, and share buttons
   * @returns {string} HTML string
   */
  _renderHeader() {
    const position = this._position;
    
    return `
      <header class="modal__header">
        <button class="modal__close-btn"
                data-action="close-position-modal"
                aria-label="סגור חלון">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
        
        <h2 class="modal__title" id="position-modal-title">
          ${this._escapeHtml(position.title)}
        </h2>
        
        <div class="modal__header-actions">
          <button class="modal__share-btn"
                  data-action="share-position-modal"
                  data-position-id="${position.id}"
                  aria-label="שתף משרה"
                  aria-haspopup="true">
            <i class="ti ti-share" aria-hidden="true"></i>
          </button>
        </div>
      </header>
    `;
  }

  /**
   * Renders full position details content
   * @returns {string} HTML string
   */
  _renderDetails() {
    return `
      <div class="position-detail">
        ${this._renderMetaInfo()}
        ${this._renderBadges()}
        ${this._renderDescription()}
        ${this._renderRequirements()}
        ${this._renderTeamInfo()}
        ${this._renderBonusBreakdown()}
      </div>
    `;
  }

  /**
   * Renders position meta information (department, location, type)
   * @returns {string} HTML string
   */
  _renderMetaInfo() {
    const position = this._position;
    const typeLabel = position.type === 'full-time' ? 'משרה מלאה' : 'משרה חלקית';
    
    return `
      <div class="position-detail__meta">
        <div class="position-detail__meta-item">
          <i class="ti ti-building" aria-hidden="true"></i>
          <span>${this._escapeHtml(position.department)}</span>
        </div>
        <div class="position-detail__meta-item">
          <i class="ti ti-map-pin" aria-hidden="true"></i>
          <span>${this._escapeHtml(position.location)}</span>
        </div>
        <div class="position-detail__meta-item">
          <i class="ti ti-clock" aria-hidden="true"></i>
          <span>${typeLabel}</span>
        </div>
      </div>
    `;
  }

  /**
   * Renders badges (hot, campaign)
   * @returns {string} HTML string
   */
  _renderBadges() {
    const position = this._position;
    
    if (!position.isHot && !position.campaign) {
      return '';
    }
    
    return `
      <div class="position-detail__badges">
        ${position.isHot ? `
          <span class="badge badge--hot badge--lg">
            ${renderIcon('flame')} משרה חמה - דרושים בדחיפות!
          </span>
        ` : ''}
        ${position.campaign ? `
          <span class="badge badge--campaign badge--lg">
            ${renderIcon('gift')} קמפיין ${this._escapeHtml(position.campaign.name)} - x${position.campaign.multiplier} נקודות!
          </span>
        ` : ''}
      </div>
    `;
  }

  /**
   * Renders job description section
   * @returns {string} HTML string
   */
  _renderDescription() {
    return `
      <section class="position-detail__section">
        <h3 class="position-detail__section-title">
          <i class="ti ti-file-description" aria-hidden="true"></i>
          תיאור המשרה
        </h3>
        <p class="position-detail__description">
          ${this._escapeHtml(this._position.description)}
        </p>
      </section>
    `;
  }

  /**
   * Renders requirements list
   * @returns {string} HTML string
   */
  _renderRequirements() {
    const requirements = this._position.requirements || [];
    
    if (requirements.length === 0) {
      return '';
    }
    
    return `
      <section class="position-detail__section">
        <h3 class="position-detail__section-title">
          <i class="ti ti-list-check" aria-hidden="true"></i>
          דרישות התפקיד
        </h3>
        <ul class="position-detail__requirements">
          ${requirements.map(req => `
            <li class="position-detail__requirement">
              <i class="ti ti-check" aria-hidden="true"></i>
              <span>${this._escapeHtml(req)}</span>
            </li>
          `).join('')}
        </ul>
      </section>
    `;
  }

  /**
   * Renders team/company info section
   * @returns {string} HTML string
   */
  _renderTeamInfo() {
    const position = this._position;
    
    return `
      <section class="position-detail__section">
        <h3 class="position-detail__section-title">
          <i class="ti ti-users" aria-hidden="true"></i>
          על הצוות
        </h3>
        <p class="position-detail__team-info">
          הצטרפו למחלקת ${this._escapeHtml(position.department)} של PassportCard!
          אנחנו צוות דינמי ומקצועי שמחפש אנשים מוכשרים להצטרף אלינו.
          סביבת עבודה מעולה, אפשרויות קידום, והזדמנות להשפיע.
        </p>
      </section>
    `;
  }

  /**
   * Renders bonus breakdown table
   * @returns {string} HTML string
   */
  _renderBonusBreakdown() {
    const position = this._position;
    const multiplier = position.campaign?.multiplier || 1;
    
    const stages = [
      { label: 'קו״ח הוגש', basePoints: 50, icon: 'file-text' },
      { label: 'ראיון נקבע', basePoints: 100, icon: 'calendar-event' },
      { label: 'גיוס מוצלח!', basePoints: position.bonus, icon: 'confetti' }
    ];
    
    const totalBase = stages.reduce((sum, s) => sum + s.basePoints, 0);
    const totalWithMultiplier = Math.round(totalBase * multiplier);
    
    return `
      <section class="position-detail__section position-detail__section--bonus">
        <h3 class="position-detail__section-title">
          <i class="ti ti-coins" aria-hidden="true"></i>
          פירוט בונוסים
        </h3>
        
        <div class="bonus-breakdown">
          ${stages.map(stage => {
            const points = Math.round(stage.basePoints * multiplier);
            return `
              <div class="bonus-breakdown__row">
                <span class="bonus-breakdown__icon">${renderIcon(stage.icon)}</span>
                <span class="bonus-breakdown__label">${stage.label}</span>
                <span class="bonus-breakdown__points ${multiplier > 1 ? 'bonus-breakdown__points--multiplied' : ''}">
                  +${points}
                  ${multiplier > 1 ? `<span class="bonus-breakdown__multiplier">(x${multiplier})</span>` : ''}
                </span>
              </div>
            `;
          }).join('')}
          
          <div class="bonus-breakdown__divider"></div>
          
          <div class="bonus-breakdown__row bonus-breakdown__row--total">
            <span class="bonus-breakdown__icon">${renderIcon('coins')}</span>
            <span class="bonus-breakdown__label">סה״כ פוטנציאלי</span>
            <span class="bonus-breakdown__points bonus-breakdown__points--total">
              +${totalWithMultiplier} נקודות
            </span>
          </div>
        </div>
        
        ${multiplier > 1 ? `
          <p class="bonus-breakdown__campaign-note">
            ${renderIcon('target')} קמפיין "${this._escapeHtml(position.campaign.name)}" פעיל - נקודות כפולות!
          </p>
        ` : ''}
      </section>
    `;
  }

  /**
   * Renders fixed footer with CTA
   * @returns {string} HTML string
   */
  _renderFooter() {
    const position = this._position;
    const multiplier = position.campaign?.multiplier || 1;
    const totalPoints = Math.round((50 + 100 + position.bonus) * multiplier);
    
    return `
      <footer class="modal__footer">
        <div class="modal__footer-info">
          <span class="modal__footer-bonus">עד +${totalPoints} נקודות</span>
        </div>
        <button class="btn btn--primary btn--lg modal__cta"
                data-action="refer-from-modal"
                data-position-id="${position.id}">
          <i class="ti ti-user-plus" aria-hidden="true"></i>
          הפנה עכשיו
        </button>
      </footer>
    `;
  }

  /**
   * Escapes HTML entities for security
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Opens the modal with animation
   * @param {Object} position - Position data to display
   */
  open(position) {
    if (!position) return;
    
    this._position = position;
    this._previousActiveElement = document.activeElement;
    
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    // Render modal to container
    container.innerHTML = this.template();
    container.classList.add('active');
    
    // Prevent body scroll
    document.body.classList.add('modal-open');
    
    // Add event listeners
    this._bindEvents();
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      const overlay = container.querySelector('.modal--position-detail');
      if (overlay) {
        overlay.classList.add('modal--visible');
        
        // Focus on close button for accessibility
        const closeBtn = overlay.querySelector('.modal__close-btn');
        if (closeBtn) {
          closeBtn.focus();
        }
      }
    });
  }

  /**
   * Closes the modal with animation
   */
  close() {
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    const overlay = container.querySelector('.modal--position-detail');
    if (overlay) {
      overlay.classList.remove('modal--visible');
      overlay.classList.add('modal--closing');
    }
    
    // Wait for animation to complete
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationDuration = reducedMotion ? 0 : 300;
    
    setTimeout(() => {
      // Clean up
      this._unbindEvents();
      container.innerHTML = '';
      container.classList.remove('active');
      
      // Restore body scroll
      document.body.classList.remove('modal-open');
      
      // Restore focus
      if (this._previousActiveElement) {
        this._previousActiveElement.focus();
        this._previousActiveElement = null;
      }
      
      // Reset state
      this._position = null;
      
      // Update app state
      stateManager.setState({
        activeModal: null,
        selectedPosition: null
      });
    }, animationDuration);
  }

  /**
   * Binds modal-specific event listeners
   */
  _bindEvents() {
    // Escape key handler
    this._boundKeyHandler = this._handleKeyDown.bind(this);
    document.addEventListener('keydown', this._boundKeyHandler);
    
    // Touch events for swipe-to-close (mobile)
    const modal = document.querySelector('.position-detail-modal');
    if (modal) {
      this._boundTouchStart = this._handleTouchStart.bind(this);
      this._boundTouchMove = this._handleTouchMove.bind(this);
      this._boundTouchEnd = this._handleTouchEnd.bind(this);
      
      modal.addEventListener('touchstart', this._boundTouchStart, { passive: true });
      modal.addEventListener('touchmove', this._boundTouchMove, { passive: false });
      modal.addEventListener('touchend', this._boundTouchEnd);
    }
  }

  /**
   * Unbinds modal-specific event listeners
   */
  _unbindEvents() {
    if (this._boundKeyHandler) {
      document.removeEventListener('keydown', this._boundKeyHandler);
      this._boundKeyHandler = null;
    }
    
    const modal = document.querySelector('.position-detail-modal');
    if (modal) {
      if (this._boundTouchStart) {
        modal.removeEventListener('touchstart', this._boundTouchStart);
      }
      if (this._boundTouchMove) {
        modal.removeEventListener('touchmove', this._boundTouchMove);
      }
      if (this._boundTouchEnd) {
        modal.removeEventListener('touchend', this._boundTouchEnd);
      }
    }
    
    this._boundTouchStart = null;
    this._boundTouchMove = null;
    this._boundTouchEnd = null;
  }

  /**
   * Handles keydown events for modal
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handleKeyDown(e) {
    // Escape key closes modal
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }
    
    // Focus trap with Tab key
    if (e.key === 'Tab') {
      this._handleFocusTrap(e);
    }
  }

  /**
   * Traps focus within modal
   * @param {KeyboardEvent} e - Tab key event
   */
  _handleFocusTrap(e) {
    const modal = document.querySelector('.position-detail-modal');
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      // Shift + Tab: moving backward
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab: moving forward
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  /**
   * Handles touch start for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchStart(e) {
    // Only track touch on drag handle or header area
    const target = e.target;
    const modal = document.querySelector('.position-detail-modal');
    const dragHandle = modal?.querySelector('.modal__drag-handle');
    const header = modal?.querySelector('.modal__header');
    
    if (target === dragHandle || dragHandle?.contains(target) || 
        target === header || header?.contains(target)) {
      this._touchStartY = e.touches[0].clientY;
      this._isDragging = true;
    }
  }

  /**
   * Handles touch move for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchMove(e) {
    if (!this._isDragging) return;
    
    this._touchCurrentY = e.touches[0].clientY;
    const deltaY = this._touchCurrentY - this._touchStartY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      const modal = document.querySelector('.position-detail-modal');
      if (modal) {
        modal.style.transform = `translateY(${deltaY}px)`;
        e.preventDefault();
      }
    }
  }

  /**
   * Handles touch end for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchEnd(e) {
    if (!this._isDragging) return;
    
    const deltaY = this._touchCurrentY - this._touchStartY;
    const threshold = 100; // Minimum swipe distance to close
    
    const modal = document.querySelector('.position-detail-modal');
    
    if (deltaY > threshold) {
      // Close modal
      this.close();
    } else {
      // Reset position
      if (modal) {
        modal.style.transform = '';
      }
    }
    
    this._isDragging = false;
    this._touchStartY = 0;
    this._touchCurrentY = 0;
  }

  /**
   * Shares the position via Web Share API or clipboard
   * @param {string} positionId - Position ID to share
   */
  async sharePosition(positionId) {
    const position = MOCK_POSITIONS.find(p => p.id === positionId);
    if (!position) return;
    
    // Generate share URL
    const currentUser = stateManager.getState('currentUser');
    const userId = currentUser?.id || 'user';
    const shareUrl = `${window.location.origin}${window.location.pathname}?ref=${userId}&pos=${positionId}`;
    const shareText = `משרה מעולה ב-PassportCard: ${position.title}`;
    
    // Try Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: position.title,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or not supported, fall through to clipboard
        if (err.name === 'AbortError') return;
        console.warn('Share failed:', err);
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      app.showToast('הקישור הועתק!', 'success');
    } catch (err) {
      console.error('Copy failed:', err);
      app.showToast('שגיאה בהעתקה', 'error');
    }
  }

  /**
   * Component unmount lifecycle
   */
  unmount() {
    this._unbindEvents();
    super.unmount();
  }
}

// Global position detail modal instance
const positionDetailModal = new PositionDetailModal();

/* ============================================================================
   REFERRAL DETAIL MODAL (Story 5.3)
   ============================================================================
   Displays detailed referral information with timeline and points breakdown
   ========================================================================== */

class ReferralDetailModal extends Component {
  constructor() {
    super();
    this._referral = null;
    this._previousActiveElement = null;
    this._boundKeyHandler = null;
    
    // Touch tracking for swipe-to-close
    this._touchStartY = 0;
    this._touchCurrentY = 0;
    this._isDragging = false;
    this._boundTouchStart = null;
    this._boundTouchMove = null;
    this._boundTouchEnd = null;
  }

  /**
   * Returns the referral detail modal HTML template
   * @returns {string} HTML string
   */
  template() {
    const referral = this._referral;
    if (!referral) return '';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return `
      <div class="modal-overlay modal--referral-detail ${reducedMotion ? 'modal--no-animation' : ''}"
           data-action="close-referral-modal-overlay"
           role="dialog"
           aria-modal="true"
           aria-labelledby="referral-modal-title">
        
        <div class="referral-detail-modal" onclick="event.stopPropagation()">
          <!-- Drag Handle (Mobile) -->
          <div class="modal__drag-handle" aria-hidden="true">
            <span class="modal__drag-bar"></span>
          </div>
          
          ${this._renderHeader()}
          
          <div class="modal__content referral-detail-modal__content">
            ${this._renderStatusPipeline()}
            ${this._renderTimeline()}
            ${this._renderPointsBreakdown()}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renders modal header with candidate info and close button
   * @returns {string} HTML string
   */
  _renderHeader() {
    const referral = this._referral;
    const initials = this._getInitials(referral.candidateName);
    const statusInfo = REFERRAL_STATUS_CONFIG[referral.status] || REFERRAL_STATUS_CONFIG.submitted;
    
    return `
      <header class="referral-detail-modal__header">
        <div class="referral-detail-modal__candidate">
          <div class="referral-detail-modal__avatar" style="--avatar-color: ${statusInfo.color}">
            ${initials}
          </div>
          <div class="referral-detail-modal__info">
            <h2 class="referral-detail-modal__name" id="referral-modal-title">
              ${this._escapeHtml(referral.candidateName)}
            </h2>
            <p class="referral-detail-modal__position">
              ${this._escapeHtml(referral.positionTitle)}
            </p>
          </div>
        </div>
        <button class="referral-detail-modal__close"
                data-action="close-referral-modal"
                aria-label="סגור">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </header>
    `;
  }

  /**
   * Renders full-size status pipeline
   * @returns {string} HTML string
   */
  _renderStatusPipeline() {
    return `
      <section class="referral-detail-modal__section">
        <h3 class="referral-detail-modal__section-title">
          <i class="ti ti-progress" aria-hidden="true"></i>
          סטטוס ההפניה
        </h3>
        ${renderStatusPipeline(this._referral, 'full')}
      </section>
    `;
  }

  /**
   * Renders vertical timeline section
   * @returns {string} HTML string
   */
  _renderTimeline() {
    const timeline = this._referral.timeline || [];
    
    // Ensure at least submission entry exists
    if (timeline.length === 0) {
      const submissionTimeline = [{
        status: 'submitted',
        date: this._referral.submittedAt || new Date().toISOString(),
        points: 50
      }];
      return this._renderTimelineContent(submissionTimeline);
    }
    
    return this._renderTimelineContent(timeline);
  }

  /**
   * Renders timeline content
   * @param {Array} timeline - Timeline entries
   * @returns {string} HTML string
   */
  _renderTimelineContent(timeline) {
    return `
      <section class="referral-detail-modal__section">
        <h3 class="referral-detail-modal__section-title">
          <i class="ti ti-history" aria-hidden="true"></i>
          ציר זמן
        </h3>
        <div class="referral-timeline">
          ${timeline.map((entry, index) => this._renderTimelineEntry(entry, index, timeline.length)).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Renders a single timeline entry
   * @param {Object} entry - Timeline entry
   * @param {number} index - Entry index
   * @param {number} total - Total entries
   * @returns {string} HTML string
   */
  _renderTimelineEntry(entry, index, total) {
    const statusInfo = REFERRAL_STATUS_CONFIG[entry.status] || REFERRAL_STATUS_CONFIG.submitted;
    const isLatest = index === total - 1;
    const isRejected = entry.status === 'rejected';
    const formattedDate = this._formatHebrewDate(entry.date);
    
    let entryClass = 'referral-timeline__entry';
    if (isLatest) entryClass += ' referral-timeline__entry--current';
    if (isRejected) entryClass += ' referral-timeline__entry--rejected';
    
    return `
      <div class="${entryClass}">
        <div class="referral-timeline__marker" style="--marker-color: ${statusInfo.color}">
          <i class="ti ${this._getStatusIcon(entry.status)}" aria-hidden="true"></i>
        </div>
        <div class="referral-timeline__content">
          <div class="referral-timeline__status">
            <span class="referral-timeline__status-text">${statusInfo.hebrew}</span>
            ${entry.points > 0 ? `
              <span class="referral-timeline__points">+${entry.points} נקודות</span>
            ` : ''}
          </div>
          <time class="referral-timeline__date">${formattedDate}</time>
        </div>
      </div>
    `;
  }

  /**
   * Gets icon class for status
   * @param {string} status - Status key
   * @returns {string} Tabler icon class
   */
  _getStatusIcon(status) {
    const icons = {
      submitted: 'ti-send',
      review: 'ti-eye',
      interview: 'ti-phone',
      offer: 'ti-file-text',
      hired: 'ti-confetti',
      rejected: 'ti-x'
    };
    return icons[status] || 'ti-circle';
  }

  /**
   * Renders points breakdown section
   * @returns {string} HTML string
   */
  _renderPointsBreakdown() {
    const isHired = this._referral.status === 'hired';
    const isRejected = this._referral.status === 'rejected';
    
    return `
      <section class="referral-detail-modal__section">
        <h3 class="referral-detail-modal__section-title">
          <i class="ti ti-trophy" aria-hidden="true"></i>
          נקודות
        </h3>
        
        <div class="points-breakdown">
          <!-- Points Earned -->
          <div class="points-breakdown__row points-breakdown__row--total">
            <span class="points-breakdown__label">נקודות שהושגו</span>
            <span class="points-breakdown__value points-breakdown__value--earned">
              ${this._formatNumber(this._referral.pointsEarned || 0)}
            </span>
          </div>
          
          <!-- Stage Breakdown -->
          <div class="points-breakdown__details">
            ${this._renderStageBreakdown()}
          </div>
          
          ${!isRejected ? `
            <!-- Potential Points -->
            <div class="points-breakdown__row points-breakdown__row--potential">
              <span class="points-breakdown__label">נקודות פוטנציאליות</span>
              <span class="points-breakdown__value points-breakdown__value--potential">
                ${this._formatNumber(this._referral.potentialPoints || 0)}
              </span>
            </div>
          ` : ''}
          
          ${isHired ? this._renderMilestones() : ''}
          ${!isHired && !isRejected ? this._renderPotentialMilestones() : ''}
        </div>
      </section>
    `;
  }

  /**
   * Renders breakdown by stage
   * @returns {string} HTML string
   */
  _renderStageBreakdown() {
    const timeline = this._referral.timeline || [];
    const earnedStages = timeline.filter(t => t.points > 0);
    
    if (earnedStages.length === 0) {
      return '';
    }
    
    return earnedStages.map(entry => {
      const statusInfo = REFERRAL_STATUS_CONFIG[entry.status] || {};
      return `
        <div class="points-breakdown__stage">
          <span>${statusInfo.hebrew || entry.status}</span>
          <span>+${entry.points}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Renders milestone bonuses for hired referrals
   * @returns {string} HTML string
   */
  _renderMilestones() {
    const milestones = this._referral.milestones || {};
    const today = new Date();
    
    const milestoneData = [
      { 
        key: 'threeMonth', 
        label: 'בונוס 3 חודשים', 
        points: 200,
        date: milestones.threeMonth 
      },
      { 
        key: 'sixMonth', 
        label: 'בונוס 6 חודשים', 
        points: 400,
        date: milestones.sixMonth 
      }
    ];
    
    return `
      <div class="points-breakdown__milestones">
        <h4 class="points-breakdown__milestones-title">
          <i class="ti ti-calendar-event" aria-hidden="true"></i>
          בונוסים צפויים
        </h4>
        ${milestoneData.map(m => {
          const milestoneDate = m.date ? new Date(m.date) : null;
          const isPast = milestoneDate && milestoneDate < today;
          const formattedDate = m.date ? this._formatHebrewDate(m.date) : 'לא ידוע';
          
          return `
            <div class="points-breakdown__milestone ${isPast ? 'points-breakdown__milestone--earned' : ''}">
              <span class="points-breakdown__milestone-label">
                ${m.label}: +${m.points} נקודות
              </span>
              <span class="points-breakdown__milestone-date">
                ${isPast ? `${renderIcon('check')} הושג` : `צפוי: ${formattedDate}`}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Renders potential milestones for in-progress referrals
   * @returns {string} HTML string
   */
  _renderPotentialMilestones() {
    return `
      <div class="points-breakdown__milestones points-breakdown__milestones--potential">
        <h4 class="points-breakdown__milestones-title">
          <i class="ti ti-sparkles" aria-hidden="true"></i>
          אם יגויס
        </h4>
        <div class="points-breakdown__milestone">
          <span>בונוס גיוס: +500 נקודות</span>
        </div>
        <div class="points-breakdown__milestone">
          <span>בונוס 3 חודשים: +200 נקודות</span>
        </div>
        <div class="points-breakdown__milestone">
          <span>בונוס 6 חודשים: +400 נקודות</span>
        </div>
      </div>
    `;
  }

  /**
   * Gets initials from name
   * @param {string} name - Full name
   * @returns {string} Initials
   */
  _getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0);
    }
    return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
  }

  /**
   * Formats date in Hebrew
   * @param {string} dateStr - Date string
   * @returns {string} Hebrew formatted date
   */
  _formatHebrewDate(dateStr) {
    if (!dateStr) return 'לא ידוע';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'לא ידוע';
    
    const day = date.getDate();
    const months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  /**
   * Formats number with locale
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return new Intl.NumberFormat('he-IL').format(num || 0);
  }

  /**
   * Escapes HTML entities for security
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Opens the modal with animation
   * @param {Object} referral - Referral data to display
   */
  open(referral) {
    if (!referral) return;
    
    this._referral = referral;
    this._previousActiveElement = document.activeElement;
    
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    // Render modal to container
    container.innerHTML = this.template();
    container.classList.add('active');
    
    // Prevent body scroll
    document.body.classList.add('modal-open');
    
    // Add event listeners
    this._bindEvents();
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      const overlay = container.querySelector('.modal--referral-detail');
      if (overlay) {
        overlay.classList.add('modal--visible');
        
        // Focus on close button for accessibility
        const closeBtn = overlay.querySelector('.referral-detail-modal__close');
        if (closeBtn) {
          closeBtn.focus();
        }
      }
    });
  }

  /**
   * Closes the modal with animation
   */
  close() {
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    const overlay = container.querySelector('.modal--referral-detail');
    if (overlay) {
      overlay.classList.remove('modal--visible');
      overlay.classList.add('modal--closing');
    }
    
    // Wait for animation to complete
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationDuration = reducedMotion ? 0 : 300;
    
    setTimeout(() => {
      // Clean up
      this._unbindEvents();
      container.innerHTML = '';
      container.classList.remove('active');
      
      // Restore body scroll
      document.body.classList.remove('modal-open');
      
      // Restore focus
      if (this._previousActiveElement) {
        this._previousActiveElement.focus();
        this._previousActiveElement = null;
      }
      
      // Reset state
      this._referral = null;
      
      // Update app state
      stateManager.setState({
        activeModal: null,
        selectedReferral: null
      });
    }, animationDuration);
  }

  /**
   * Binds modal-specific event listeners
   */
  _bindEvents() {
    // Escape key handler
    this._boundKeyHandler = this._handleKeyDown.bind(this);
    document.addEventListener('keydown', this._boundKeyHandler);
    
    // Touch events for swipe-to-close (mobile)
    const modal = document.querySelector('.referral-detail-modal');
    if (modal) {
      this._boundTouchStart = this._handleTouchStart.bind(this);
      this._boundTouchMove = this._handleTouchMove.bind(this);
      this._boundTouchEnd = this._handleTouchEnd.bind(this);
      
      modal.addEventListener('touchstart', this._boundTouchStart, { passive: true });
      modal.addEventListener('touchmove', this._boundTouchMove, { passive: false });
      modal.addEventListener('touchend', this._boundTouchEnd);
    }
  }

  /**
   * Unbinds modal-specific event listeners
   */
  _unbindEvents() {
    if (this._boundKeyHandler) {
      document.removeEventListener('keydown', this._boundKeyHandler);
      this._boundKeyHandler = null;
    }
    
    const modal = document.querySelector('.referral-detail-modal');
    if (modal) {
      if (this._boundTouchStart) {
        modal.removeEventListener('touchstart', this._boundTouchStart);
      }
      if (this._boundTouchMove) {
        modal.removeEventListener('touchmove', this._boundTouchMove);
      }
      if (this._boundTouchEnd) {
        modal.removeEventListener('touchend', this._boundTouchEnd);
      }
    }
    
    this._boundTouchStart = null;
    this._boundTouchMove = null;
    this._boundTouchEnd = null;
  }

  /**
   * Handles keydown events for modal
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handleKeyDown(e) {
    // Escape key closes modal
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }
    
    // Focus trap with Tab key
    if (e.key === 'Tab') {
      this._handleFocusTrap(e);
    }
  }

  /**
   * Traps focus within modal
   * @param {KeyboardEvent} e - Tab key event
   */
  _handleFocusTrap(e) {
    const modal = document.querySelector('.referral-detail-modal');
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      // Shift + Tab: moving backward
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab: moving forward
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  /**
   * Handles touch start for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchStart(e) {
    // Only track touch on drag handle or header area
    const target = e.target;
    const modal = document.querySelector('.referral-detail-modal');
    const dragHandle = modal?.querySelector('.modal__drag-handle');
    const header = modal?.querySelector('.referral-detail-modal__header');
    
    if (target === dragHandle || dragHandle?.contains(target) || 
        target === header || header?.contains(target)) {
      this._touchStartY = e.touches[0].clientY;
      this._isDragging = true;
    }
  }

  /**
   * Handles touch move for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchMove(e) {
    if (!this._isDragging) return;
    
    this._touchCurrentY = e.touches[0].clientY;
    const deltaY = this._touchCurrentY - this._touchStartY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      const modal = document.querySelector('.referral-detail-modal');
      if (modal) {
        modal.style.transform = `translateY(${deltaY}px)`;
        e.preventDefault();
      }
    }
  }

  /**
   * Handles touch end for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchEnd(e) {
    if (!this._isDragging) return;
    
    const deltaY = this._touchCurrentY - this._touchStartY;
    const threshold = 100; // Minimum swipe distance to close
    
    const modal = document.querySelector('.referral-detail-modal');
    
    if (deltaY > threshold) {
      // Close modal
      this.close();
    } else {
      // Reset position
      if (modal) {
        modal.style.transform = '';
      }
    }
    
    this._isDragging = false;
    this._touchStartY = 0;
    this._touchCurrentY = 0;
  }

  /**
   * Component unmount lifecycle
   */
  unmount() {
    this._unbindEvents();
    super.unmount();
  }
}

// Global referral detail modal instance
const referralDetailModal = new ReferralDetailModal();

/* ============================================================================
   SHARE PANEL COMPONENT (Story 4.4)
   ============================================================================
   Panel for sharing referral links via copy, WhatsApp, email, or native share
   ========================================================================== */

class SharePanel extends Component {
  constructor(props) {
    super(props);
    this.position = props.position || null;
    this.referralLink = '';
    this.isCopied = false;
    this.copyTimeout = null;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    if (!this.position) return '';
    
    this.referralLink = this._generateReferralLink();
    
    return `
      <div class="share-panel-overlay share-panel-overlay--visible" 
           data-action="close-share-panel-overlay"
           role="presentation">
        <div class="share-panel" 
             id="share-panel" 
             role="dialog" 
             aria-labelledby="share-panel-title"
             aria-modal="true">
          <header class="share-panel__header">
            <h3 class="share-panel__title" id="share-panel-title">
              <i class="ti ti-share" aria-hidden="true"></i>
              שתף קישור הפניה
            </h3>
            <button class="share-panel__close"
                    data-action="close-share-panel"
                    aria-label="סגור פאנל שיתוף">
              <i class="ti ti-x" aria-hidden="true"></i>
            </button>
          </header>
          
          <div class="share-panel__content">
            <p class="share-panel__position">
              משרה: <strong>${this._escapeHtml(this.position.title)}</strong>
            </p>
            
            ${this._renderLinkField()}
            ${this._renderShareButtons()}
            ${this._renderNativeShare()}
          </div>
          
          <footer class="share-panel__footer">
            <button class="btn btn--secondary btn--full"
                    data-action="continue-to-referral"
                    data-position-id="${this.position.id}">
              המשך להפניה
              <i class="ti ti-arrow-left" aria-hidden="true"></i>
            </button>
          </footer>
        </div>
      </div>
    `;
  }
  
  /**
   * Renders the link display field with copy button
   * @returns {string} HTML string
   */
  _renderLinkField() {
    return `
      <div class="share-panel__link-field">
        <label for="referral-link-input" class="visually-hidden">קישור הפניה</label>
        <input type="text"
               id="referral-link-input"
               class="share-panel__link-input"
               value="${this._escapeHtml(this.referralLink)}"
               readonly
               dir="ltr"
               aria-describedby="link-copy-status">
        
        <button class="share-panel__copy-btn ${this.isCopied ? 'share-panel__copy-btn--copied' : ''}"
                data-action="copy-referral-link"
                aria-label="העתק קישור"
                aria-describedby="link-copy-status">
          <i class="ti ${this.isCopied ? 'ti-check' : 'ti-copy'}" aria-hidden="true"></i>
          <span>${this.isCopied ? 'הועתק!' : 'העתק'}</span>
        </button>
        
        <span id="link-copy-status" class="visually-hidden" aria-live="polite">
          ${this.isCopied ? 'הקישור הועתק ללוח' : ''}
        </span>
      </div>
    `;
  }
  
  /**
   * Renders WhatsApp and Email share buttons
   * @returns {string} HTML string
   */
  _renderShareButtons() {
    const whatsappUrl = this._getWhatsAppUrl();
    const emailUrl = this._getEmailUrl();
    
    return `
      <div class="share-panel__buttons">
        <a href="${whatsappUrl}"
           class="share-panel__btn share-panel__btn--whatsapp"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="שתף בוואטסאפ">
          <i class="ti ti-brand-whatsapp" aria-hidden="true"></i>
          <span>WhatsApp</span>
        </a>
        
        <a href="${emailUrl}"
           class="share-panel__btn share-panel__btn--email"
           aria-label="שתף באימייל">
          <i class="ti ti-mail" aria-hidden="true"></i>
          <span>אימייל</span>
        </a>
      </div>
    `;
  }
  
  /**
   * Renders native share button if supported
   * @returns {string} HTML string
   */
  _renderNativeShare() {
    // Only show if Web Share API is supported
    if (typeof navigator !== 'undefined' && navigator.share) {
      return `
        <div class="share-panel__native">
          <button class="btn btn--outline-primary btn--full"
                  data-action="native-share-referral"
                  data-position-id="${this.position.id}">
            <i class="ti ti-share" aria-hidden="true"></i>
            שתף באפליקציה אחרת...
          </button>
        </div>
      `;
    }
    
    return '';
  }
  
  /**
   * Generates unique referral link
   * @returns {string} Referral URL
   */
  _generateReferralLink() {
    const currentUser = stateManager.getState('currentUser');
    const userId = currentUser?.id || 'unknown';
    const positionId = this.position.id;
    
    // Use current origin + pathname for base URL
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    
    // Add referral tracking params
    return `${baseUrl}?ref=${userId}&pos=${positionId}`;
  }
  
  /**
   * Generates WhatsApp share URL
   * @returns {string} WhatsApp intent URL
   */
  _getWhatsAppUrl() {
    const message = this._getShareMessage();
    const encoded = encodeURIComponent(message);
    return `https://wa.me/?text=${encoded}`;
  }
  
  /**
   * Generates email mailto URL
   * @returns {string} mailto URL
   */
  _getEmailUrl() {
    const subject = `הזדמנות קריירה ב-PassportCard - ${this.position.title}`;
    const body = this._getEmailBody();
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
  }
  
  /**
   * Generates share message for WhatsApp
   * @returns {string} Share message
   */
  _getShareMessage() {
    return `היי!\n\nיש משרה מעולה ב-PassportCard:\n${this.position.title}\n\nאשמח להמליץ עליך!\n\n${this.referralLink}`;
  }
  
  /**
   * Generates email body
   * @returns {string} Email body text
   */
  _getEmailBody() {
    return `שלום,

רציתי לשתף איתך הזדמנות קריירה מעניינת ב-PassportCard:

${this.position.title}
מחלקה: ${this.position.department}
מיקום: ${this.position.location}

אני חושב/ת שאת/ה יכול/ה להתאים למשרה הזו ואשמח להמליץ עליך!

להגשת מועמדות דרך ההמלצה שלי:
${this.referralLink}

בהצלחה!`;
  }
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  /**
   * Handles copy to clipboard
   */
  async handleCopyLink() {
    try {
      await navigator.clipboard.writeText(this.referralLink);
      
      // Update copied state
      this.isCopied = true;
      this._updateCopyButton();
      
      // Show toast
      app.showToast('הועתק!', 'success');
      
      // Reset after 2 seconds
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }
      this.copyTimeout = setTimeout(() => {
        this.isCopied = false;
        this._updateCopyButton();
      }, 2000);
      
    } catch (err) {
      console.error('Copy failed:', err);
      app.showToast('שגיאה בהעתקה', 'error');
    }
  }
  
  /**
   * Updates copy button visual state
   */
  _updateCopyButton() {
    const btn = document.querySelector('.share-panel__copy-btn');
    const icon = btn?.querySelector('.ti');
    const text = btn?.querySelector('span');
    const status = document.getElementById('link-copy-status');
    
    if (btn && icon && text) {
      btn.classList.toggle('share-panel__copy-btn--copied', this.isCopied);
      icon.className = `ti ${this.isCopied ? 'ti-check' : 'ti-copy'}`;
      text.textContent = this.isCopied ? 'הועתק!' : 'העתק';
    }
    
    if (status) {
      status.textContent = this.isCopied ? 'הקישור הועתק ללוח' : '';
    }
  }
  
  /**
   * Handles native share
   */
  async handleNativeShare() {
    if (!navigator.share) return;
    
    try {
      await navigator.share({
        title: this.position.title,
        text: `משרה מעולה ב-PassportCard: ${this.position.title}`,
        url: this.referralLink
      });
    } catch (err) {
      // User cancelled share - not an error
      if (err.name !== 'AbortError') {
        console.warn('Share failed:', err);
      }
    }
  }
  
  /**
   * Closes the share panel
   */
  close() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
    
    // Clear instance from state
    stateManager.setState({
      sharePanelInstance: null,
      sharePanel: null
    });
    
    // Remove from DOM
    const container = document.getElementById('modal-container');
    const overlay = container?.querySelector('.share-panel-overlay');
    if (overlay) {
      overlay.classList.remove('share-panel-overlay--visible');
      setTimeout(() => {
        if (container.contains(overlay)) {
          container.removeChild(overlay);
        }
      }, 200);
    }
  }
  
  /**
   * Opens the share panel
   */
  open() {
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    // Store instance in state
    stateManager.setState({
      sharePanelInstance: this,
      sharePanel: this.position.id
    });
    
    // Render to container
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template();
    container.appendChild(wrapper.firstElementChild);
    
    this._element = container.querySelector('.share-panel');
    this.mount();
    
    // Focus the panel for accessibility
    setTimeout(() => {
      const firstButton = this._element?.querySelector('button, [href]');
      firstButton?.focus();
    }, 100);
  }
  
  /**
   * Bind events
   */
  bindEvents() {
    // Event delegation handled by ModalManager/App
  }
  
  // Lifecycle methods
  mount() {
    this._mounted = true;
    this.bindEvents();
  }
  
  unmount() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
    this._mounted = false;
  }
}

/**
 * Opens the share panel for a position
 * @param {string} positionId - Position ID to share
 */
function openSharePanel(positionId) {
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  if (!position) return;
  
  // Close any existing share panel
  const existingInstance = stateManager.getState('sharePanelInstance');
  if (existingInstance) {
    existingInstance.close();
  }
  
  // Create and open new share panel
  const sharePanel = new SharePanel({ position });
  sharePanel.open();
}

/**
 * Generates a unique referral link for a position
 * @param {string} positionId - Position ID (e.g., 'pos-001')
 * @param {string} [userId] - User ID, defaults to current user
 * @returns {string} Complete referral URL
 */
function generateReferralLink(positionId, userId = null) {
  const currentUser = stateManager.getState('currentUser');
  const uid = userId || currentUser?.id || 'unknown';
  
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?ref=${uid}&pos=${positionId}`;
}

/* ============================================================================
   MODAL MANAGER
   ============================================================================
   Handles modal rendering and lifecycle
   ========================================================================== */

class ModalManager {
  constructor() {
    this._currentModal = null;
    this._modalContainer = null;
  }

  /**
   * Initializes the modal manager
   */
  init() {
    this._modalContainer = document.getElementById('modal-container');
    
    // Subscribe to activeModal state changes
    stateManager.subscribe('activeModal', (modalName) => {
      this._handleModalChange(modalName);
    });
    
    // Set up event delegation for modal container
    if (this._modalContainer) {
      this._modalContainer.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (target) {
          e.preventDefault();
          this._handleAction(target.dataset.action, target, e);
        }
      });
    }
  }

  /**
   * Handles modal state changes
   * @param {string|null} modalName - Name of modal to show, or null to close
   */
  _handleModalChange(modalName) {
    // Unmount current modal if exists
    if (this._currentModal) {
      this._currentModal.unmount();
      this._currentModal = null;
    }

    if (!this._modalContainer) return;

    if (modalName === 'otp') {
      // Show OTP modal
      this._modalContainer.classList.add('active');
      this._currentModal = new OTPModalComponent();
      this._modalContainer.innerHTML = this._currentModal.render();
      this._currentModal.mount();
      
      // Story 7.4: Trigger SMS toast 500ms after modal opens (simulating SMS delivery)
      setTimeout(() => {
        showSMSToast();
      }, 500);
    } else if (modalName === 'stamp-details') {
      // Show stamp detail modal (Story 3.5)
      const stamp = stateManager.getState('selectedStamp');
      if (stamp) {
        this._currentModal = stampDetailModal;
        stampDetailModal.open(stamp);
      }
    } else if (modalName === 'position-details') {
      // Show position detail modal (Story 4.3)
      const position = stateManager.getState('selectedPosition');
      if (position) {
        this._currentModal = positionDetailModal;
        positionDetailModal.open(position);
      }
    } else if (modalName === 'referral-details') {
      // Show referral detail modal (Story 5.3)
      const referral = stateManager.getState('selectedReferral');
      if (referral) {
        this._currentModal = referralDetailModal;
        referralDetailModal.open(referral);
      }
    } else {
      // Hide modal container
      this._modalContainer.classList.remove('active');
      this._modalContainer.innerHTML = '';
    }
  }

  /**
   * Handles modal actions via event delegation
   * @param {string} action - Action name
   * @param {Element} target - Trigger element
   * @param {Event} event - Original event
   */
  _handleAction(action, target, event) {
    switch (action) {
      case 'verify-otp':
        if (this._currentModal instanceof OTPModalComponent) {
          this._currentModal.verifyOTP();
        }
        break;
        
      case 'resend-otp':
        if (this._currentModal instanceof OTPModalComponent) {
          this._currentModal.handleResend();
          // Story 7.4: Show SMS toast again when resending
          setTimeout(() => {
            showSMSToast();
          }, 500);
        }
        break;
      
      // Story 7.4: SMS Toast dismiss action
      case 'close-sms-toast':
        dismissSMSToast();
        break;
        
      case 'close-otp':
        stateManager.setState({ activeModal: null });
        break;
        
      case 'close-otp-overlay':
        // Only close if clicking directly on overlay, not modal content
        if (event.target === target) {
          stateManager.setState({ activeModal: null });
        }
        break;
        
      // Stamp Detail Modal actions (Story 3.5)
      case 'close-stamp-modal':
        if (this._currentModal === stampDetailModal) {
          stampDetailModal.close();
        }
        break;
        
      case 'close-stamp-modal-overlay':
        // Only close if clicking directly on overlay, not modal content
        if (event.target === target && this._currentModal === stampDetailModal) {
          stampDetailModal.close();
        }
        break;
        
      // Position Detail Modal actions (Story 4.3)
      case 'close-position-modal':
        if (this._currentModal === positionDetailModal) {
          positionDetailModal.close();
        }
        break;
        
      case 'close-position-modal-overlay':
        // Only close if clicking directly on overlay, not modal content
        if (event.target === target && this._currentModal === positionDetailModal) {
          positionDetailModal.close();
        }
        break;
        
      case 'share-position-modal':
        if (this._currentModal === positionDetailModal) {
          const positionId = target.dataset.positionId;
          if (positionId) {
            // Open share panel instead of direct share (Story 4.4)
            openSharePanel(positionId);
          }
        }
        break;
        
      case 'refer-from-modal':
        if (this._currentModal === positionDetailModal) {
          const positionId = target.dataset.positionId;
          if (positionId) {
            const position = MOCK_POSITIONS.find(p => p.id === positionId);
            if (position) {
              // Close modal first
              positionDetailModal.close();
              
              // Set referral state
              stateManager.setState({
                referringPosition: position
              });
              
              // Navigate to referral form (Story 4.5)
              router.navigate('refer');
            }
          }
        }
        break;
        
      // Referral Detail Modal actions (Story 5.3)
      case 'close-referral-modal':
        if (this._currentModal === referralDetailModal) {
          referralDetailModal.close();
        }
        break;
        
      case 'close-referral-modal-overlay':
        // Only close if clicking directly on overlay, not modal content
        if (event.target === target && this._currentModal === referralDetailModal) {
          referralDetailModal.close();
        }
        break;
        
      default:
        console.warn(`ModalManager: Unknown action "${action}"`);
    }
  }
}

// Global modal manager instance
const modalManager = new ModalManager();

/* ============================================================================
   INITIALIZATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Multi-page entry point handler (Story 7.0)
  // If on index.html, redirect to appropriate page based on auth state
  const currentPage = document.body?.dataset?.page || 'index';
  
  if (currentPage === 'index') {
    // State is loaded by StateManager constructor
    const isAuthenticated = stateManager.getState('isAuthenticated');
    
    // Validate session if authenticated
    if (isAuthenticated && !stateManager._validateSession()) {
      console.log('Invalid session on entry, clearing...');
      stateManager._clearSession();
    }
    
    // Redirect to appropriate page
    const targetPage = stateManager.getState('isAuthenticated') ? 'dashboard' : 'login';
    const hash = window.location.hash.slice(1);
    
    // If hash specifies a valid route, respect it (for bookmarked URLs)
    if (hash && CONFIG.ROUTES[hash]) {
      const routeConfig = CONFIG.ROUTES[hash];
      const routePage = routeConfig.page;
      
      // Check auth requirements
      if (routeConfig.requiresAuth && !stateManager.getState('isAuthenticated')) {
        // Needs auth but not logged in - go to login
        window.location.replace('login.html');
        return;
      } else if (!routeConfig.requiresAuth && hash === 'auth' && stateManager.getState('isAuthenticated')) {
        // Already authenticated, skip login
        window.location.replace('dashboard.html');
        return;
      } else {
        // Navigate to the route's page
        window.location.replace(`${routePage}.html#${hash}`);
        return;
      }
    }
    
    // No valid hash - go to default page
    window.location.replace(`${targetPage}.html`);
    return;
  }
  
  // State is already loaded and validated by StateManager constructor
  // Validate session state before app renders
  if (stateManager.getState('isAuthenticated')) {
    if (!stateManager._validateSession()) {
      console.log('Invalid session detected during initialization, clearing...');
      stateManager._clearSession();
    }
  }
  
  // Register components
  app.registerComponent('LoginComponent', LoginComponent);
  app.registerComponent('DashboardComponent', DashboardComponent);
  app.registerComponent('SettingsComponent', SettingsComponent);
  app.registerComponent('PassportComponent', PassportComponent);
  app.registerComponent('PositionsComponent', PositionsComponent);
  app.registerComponent('ReferralFormComponent', ReferralFormComponent);
  app.registerComponent('ReferralConfirmationComponent', ReferralConfirmationComponent);
  app.registerComponent('ReferralsComponent', ReferralsComponent);
  
  // Register action handlers
  app.registerAction('submit-login', (target, event) => {
    if (app._currentComponent && app._currentComponent instanceof LoginComponent) {
      app._currentComponent.handleSubmit(event);
    }
  });
  
  // Register logout action handler
  app.registerAction('logout', () => {
    AuthService.logout();
  });
  
  // Register toggle user menu action handler
  app.registerAction('toggle-user-menu', () => {
    const headerComponent = navigationManager.getHeaderComponent();
    if (headerComponent) {
      headerComponent.toggleMenu();
    }
  });
  
  // Register toggle notifications action handler
  app.registerAction('toggle-notifications', (target) => {
    const current = stateManager.getState('emailNotifications') !== false;
    stateManager.setState({ emailNotifications: !current });
    
    // Update toggle UI
    target.classList.toggle('toggle--on', !current);
    target.setAttribute('aria-checked', String(!current));
    
    app.showToast('ההגדרות נשמרו', 'success');
  });
  
  // Register show-how-it-works action handler (Story 6.1 - Settings About)
  app.registerAction('show-how-it-works', () => {
    app.showToast('בקרוב - מדריך שימוש מלא', 'info');
  });
  
  // Register show-contact-hr action handler (Story 6.1 - Settings About)
  app.registerAction('show-contact-hr', () => {
    app.showToast('ליצירת קשר: hr@passportcard.co.il', 'info');
  });
  
  // Register navigate-referrals action handler (Story 2.2 - Stats Cards)
  app.registerAction('navigate-referrals', (target) => {
    const filter = target.dataset.filter || 'all';
    
    // Store filter in state for ReferralsComponent to read
    stateManager.setState({
      positionFilters: {
        ...stateManager.getState('positionFilters'),
        referralFilter: filter
      }
    });
    
    router.navigate('referrals');
  });
  
  // Register navigate-referral-detail action handler (Story 2.3 - Activity Feed)
  app.registerAction('navigate-referral-detail', (target) => {
    const referralId = target.dataset.referralId;
    
    if (referralId) {
      // Store selected referral for detail view
      stateManager.setState({
        selectedReferralId: referralId
      });
      
      router.navigate('referrals');
    }
  });
  
  // Register navigate-campaign-positions action handler (Story 2.4 - Campaign Banner)
  app.registerAction('navigate-campaign-positions', (target) => {
    const campaignId = target.dataset.campaignId;
    
    if (campaignId) {
      // Use MOCK_CAMPAIGNS directly (Story 5.4)
      const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
      
      if (campaign) {
        // Store campaign filter for positions page
        stateManager.setState({
          campaignFilter: campaignId,
          positionFilters: {
            ...stateManager.getState('positionFilters'),
            campaignId: campaignId,
            eligibleDepartments: campaign.eligibleDepartments || [],
            eligiblePositionIds: campaign.eligiblePositionIds || []
          }
        });
      }
    }
    
    router.navigate('positions');
  });
  
  // Register view-campaign-positions action handler (Story 5.4 - Campaigns Section)
  app.registerAction('view-campaign-positions', (target) => {
    const campaignId = target.dataset.campaignId || 
                       target.closest('[data-campaign-id]')?.dataset.campaignId;
    
    if (campaignId) {
      const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
      
      if (campaign) {
        // Store campaign filter for positions page
        stateManager.setState({
          campaignFilter: campaignId,
          positionFilters: {
            ...stateManager.getState('positionFilters'),
            campaignId: campaignId,
            eligibleDepartments: campaign.eligibleDepartments || [],
            eligiblePositionIds: campaign.eligiblePositionIds || []
          }
        });
      }
    }
    
    router.navigate('positions');
  });
  
  // Register clear-campaign-filter action handler (Story 5.4)
  app.registerAction('clear-campaign-filter', () => {
    stateManager.setState({
      campaignFilter: null,
      positionFilters: {
        ...stateManager.getState('positionFilters'),
        campaignId: null,
        eligibleDepartments: [],
        eligiblePositionIds: []
      }
    });
    
    // Re-render positions if on positions page
    if (router.getCurrentRoute() === 'positions') {
      const positionsComponent = app.currentComponent;
      if (positionsComponent && positionsComponent._filterPositions) {
        positionsComponent._filterPositions();
        positionsComponent.render();
      }
    }
  });
  
  // Register open-passport action handler (Story 3.1 - Passport Cover Design)
  // Open passport action - triggers 3D flip animation
  app.registerAction('open-passport', async (target) => {
    const passportEl = document.querySelector('.passport');
    if (!passportEl || passportEl.classList.contains('passport--opening')) return;
    
    // Use AnimationService for the animation
    await animationService.animatePassportOpen(passportEl);
    
    // Update state
    stateManager.setState({ passportOpen: true });
    
    // Update component state
    const passportComponent = app.getComponent('passport');
    if (passportComponent && passportComponent.updatePassportState) {
      passportComponent.updatePassportState(true);
    }
  });
  
  // Close passport action - triggers reverse 3D flip animation
  app.registerAction('close-passport', async (target) => {
    const passportEl = document.querySelector('.passport');
    if (!passportEl || passportEl.classList.contains('passport--closing')) return;
    
    // Use AnimationService for the animation
    await animationService.animatePassportClose(passportEl);
    
    // Update state
    stateManager.setState({ passportOpen: false });
    
    // Update component state
    const passportComponent = app.getComponent('passport');
    if (passportComponent && passportComponent.updatePassportState) {
      passportComponent.updatePassportState(false);
    }
  });
  
  // Passport page navigation - Next page (Story 3.3)
  // FIX Story 7.6: Added event parameter and stopPropagation to prevent bubbling
  app.registerAction('passport-next', async (target, event) => {
    if (event) event.stopPropagation();
    const passportComponent = app.getComponent('passport');
    if (passportComponent && passportComponent.navigateNext) {
      await passportComponent.navigateNext();
    }
  });
  
  // Passport page navigation - Previous page (Story 3.3)
  // FIX Story 7.6: Added event parameter and stopPropagation to prevent bubbling
  app.registerAction('passport-prev', async (target, event) => {
    if (event) event.stopPropagation();
    const passportComponent = app.getComponent('passport');
    if (passportComponent && passportComponent.navigatePrev) {
      await passportComponent.navigatePrev();
    }
  });
  
  // View stamp details - Opens stamp detail modal (Story 3.4, 3.5)
  // FIX Story 7.6: Added event parameter and stopPropagation to prevent bubbling
  app.registerAction('view-stamp-details', (target, event) => {
    if (event) event.stopPropagation();
    const stampId = target.dataset.stampId;
    if (!stampId) return;
    
    // Get stamp data
    const stamps = stateManager.getState('stamps') || [];
    const stamp = stamps.find(s => s.id === stampId);
    
    if (stamp) {
      // Store selected stamp in state and trigger modal
      stateManager.setState({
        selectedStamp: stamp,
        activeModal: 'stamp-details'
      });
    }
  });
  
  // Dismiss celebration - stops confetti and removes messages (Story 3.5)
  app.registerAction('dismiss-celebration', () => {
    animationService.dismissCelebration();
  });
  
  // Open position details modal (Story 4.1, implemented in Story 4.3)
  app.registerAction('view-position-details', (target) => {
    const positionId = target.dataset.positionId || target.closest('[data-position-id]')?.dataset.positionId;
    if (!positionId) return;
    
    const position = MOCK_POSITIONS.find(p => p.id === positionId);
    if (position) {
      stateManager.setState({
        selectedPosition: position,
        activeModal: 'position-details'
      });
      // Modal opens via ModalManager subscription to activeModal state
    }
  });
  
  // Navigate to referral form for a position (Story 4.1)
  app.registerAction('refer-position', (target) => {
    const positionId = target.dataset.positionId;
    if (!positionId) return;
    
    const position = MOCK_POSITIONS.find(p => p.id === positionId);
    if (position) {
      stateManager.setState({
        referringPosition: position
      });
      // Navigate to referral form (Story 4.5)
      router.navigate('refer');
    }
  });
  
  // Clear position search (Story 4.2)
  app.registerAction('clear-position-search', () => {
    const component = app.currentComponent;
    if (component && typeof component.clearSearch === 'function') {
      component.clearSearch();
    }
  });
  
  // Clear all position filters (Story 4.2)
  app.registerAction('clear-all-position-filters', () => {
    const component = app.currentComponent;
    if (component && typeof component.clearAllFilters === 'function') {
      component.clearAllFilters();
    }
  });
  
  // ============================================
  // ACTION HANDLERS - Share Panel (Story 4.4)
  // ============================================
  
  // Open share panel for a position
  app.registerAction('open-share-panel', (target) => {
    const positionId = target.dataset.positionId;
    if (!positionId) return;
    
    openSharePanel(positionId);
  });
  
  // Copy referral link to clipboard
  app.registerAction('copy-referral-link', async () => {
    const sharePanel = stateManager.getState('sharePanelInstance');
    if (sharePanel) {
      await sharePanel.handleCopyLink();
    }
  });
  
  // Native share via Web Share API
  app.registerAction('native-share-referral', async () => {
    const sharePanel = stateManager.getState('sharePanelInstance');
    if (sharePanel) {
      await sharePanel.handleNativeShare();
    }
  });
  
  // Close share panel
  app.registerAction('close-share-panel', () => {
    const sharePanel = stateManager.getState('sharePanelInstance');
    if (sharePanel) {
      sharePanel.close();
    }
  });
  
  // Close share panel when clicking overlay
  app.registerAction('close-share-panel-overlay', (target, event) => {
    // Only close if clicking directly on overlay, not panel content
    if (event.target === target || event.target.classList.contains('share-panel-overlay')) {
      const sharePanel = stateManager.getState('sharePanelInstance');
      if (sharePanel) {
        sharePanel.close();
      }
    }
  });
  
  // Continue to referral form after sharing
  app.registerAction('continue-to-referral', (target) => {
    const positionId = target.dataset.positionId;
    if (!positionId) return;
    
    // Close share panel
    const sharePanel = stateManager.getState('sharePanelInstance');
    if (sharePanel) {
      sharePanel.close();
    }
    
    // Set referral state
    const position = MOCK_POSITIONS.find(p => p.id === positionId);
    if (position) {
      stateManager.setState({
        referringPosition: position
      });
      
      // Navigate to referral form (Story 4.5)
      router.navigate('refer');
    }
  });
  
  // ============================================
  // ACTION HANDLERS - Referral Form (Story 4.5)
  // ============================================
  
  // Submit referral form
  app.registerAction('submit-referral', async () => {
    const formComponent = stateManager.getState('referralFormInstance');
    if (formComponent) {
      await formComponent.handleSubmit();
    }
  });
  
  // Remove uploaded resume
  app.registerAction('remove-resume', () => {
    const formComponent = stateManager.getState('referralFormInstance');
    if (formComponent) {
      formComponent.uploadedFile = null;
      formComponent._updateUploadZone();
      formComponent._updateSubmitButtonState();
    }
  });
  
  // Back from referral form
  app.registerAction('back-from-referral', () => {
    const formComponent = stateManager.getState('referralFormInstance');
    const hasData = formComponent && formComponent.hasFormData();
    
    if (hasData) {
      // Show confirmation dialog
      const confirmed = window.confirm('האם לבטל את ההפניה?');
      if (!confirmed) return;
    }
    
    // Clear state and navigate back
    stateManager.setState({
      referringPosition: null,
      referralFormInstance: null
    });
    router.navigate('positions');
  });
  
  // Navigate to positions (fallback)
  app.registerAction('navigate-positions', () => {
    stateManager.setState({
      referringPosition: null,
      referralFormInstance: null
    });
    router.navigate('positions');
  });
  
  // ============================================
  // ACTION HANDLERS - Referral Confirmation (Story 4.6)
  // ============================================
  
  // Navigate to passport from confirmation
  app.registerAction('view-passport-from-confirmation', () => {
    // Set flag to highlight new stamps
    stateManager.setState({
      highlightNewStamps: true
    });
    
    router.navigate('passport');
  });
  
  // Refer another candidate
  app.registerAction('refer-another', () => {
    // Clear referral-specific state
    stateManager.setState({
      referringPosition: null,
      lastSubmittedReferral: null,
      pointsEarnedFromSubmission: null,
      earnedStamps: null
    });
    
    router.navigate('positions');
  });
  
  // Share referral success
  app.registerAction('share-referral-success', async () => {
    const currentUser = stateManager.getState('currentUser');
    const userName = currentUser?.firstName || 'מישהו';
    
    const shareText = `${userName} הפנה/ה מועמד/ת חדש/ה ל-PassportCard!\n\nגם אתם יכולים להרוויח נקודות על ידי הפניית חברים.`;
    
    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'הפניה מוצלחת!',
          text: shareText
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share failed:', err);
        }
      }
    }
    
    // Fallback: copy generic message
    try {
      await navigator.clipboard.writeText(shareText);
      app.showToast('הועתק!', 'success');
    } catch (err) {
      console.error('Copy failed:', err);
      app.showToast('שגיאה בהעתקה', 'error');
    }
  });
  
  // Navigate to dashboard (error fallback)
  app.registerAction('navigate-dashboard', () => {
    router.navigate('dashboard');
  });
  
  // ============================================
  // ACTION HANDLERS - How to Earn (Story 5.5)
  // ============================================
  
  // Store reference to HowToEarnComponent instance for cleanup
  let howToEarnInstance = null;
  
  // Open How to Earn modal
  app.registerAction('open-how-to-earn', () => {
    // Clean up previous instance if exists
    if (howToEarnInstance) {
      howToEarnInstance.unmount();
      howToEarnInstance = null;
    }
    
    howToEarnInstance = new HowToEarnComponent();
    const html = howToEarnInstance.render();
    
    // Insert into modal container
    const container = document.getElementById('modal-container');
    container.innerHTML = html;
    
    // Trigger open animation
    requestAnimationFrame(() => {
      const modal = container.querySelector('.how-to-earn');
      if (modal) {
        modal.classList.add('how-to-earn--open');
      }
    });
    
    // Mount component (focus trap, keyboard handling)
    howToEarnInstance.mount();
  });
  
  // Close How to Earn modal
  app.registerAction('close-how-to-earn', () => {
    const modal = document.querySelector('.how-to-earn');
    if (!modal) return;
    
    modal.classList.remove('how-to-earn--open');
    modal.classList.add('how-to-earn--closing');
    
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const cleanup = () => {
      modal.remove();
      if (howToEarnInstance) {
        howToEarnInstance.unmount();
        howToEarnInstance = null;
      }
    };
    
    if (reducedMotion) {
      cleanup();
    } else {
      setTimeout(cleanup, 300);
    }
  });
  
  // Navigate to positions from How to Earn
  app.registerAction('navigate-to-positions-from-earn', () => {
    // Close modal first
    const modal = document.querySelector('.how-to-earn');
    if (modal) {
      modal.remove();
      if (howToEarnInstance) {
        howToEarnInstance.unmount();
        howToEarnInstance = null;
      }
    }
    
    // Navigate to positions
    router.navigate('positions');
  });
  
  // Navigate to campaigns section on dashboard
  app.registerAction('navigate-to-campaigns', () => {
    // Close modal first
    const modal = document.querySelector('.how-to-earn');
    if (modal) {
      modal.remove();
      if (howToEarnInstance) {
        howToEarnInstance.unmount();
        howToEarnInstance = null;
      }
    }
    
    // Navigate to dashboard
    router.navigate('dashboard');
    
    // Scroll to campaigns section after navigation
    requestAnimationFrame(() => {
      setTimeout(() => {
        const campaignsSection = document.querySelector('.campaigns-section');
        if (campaignsSection) {
          campaignsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    });
  });
  
  // View campaign positions from How to Earn modal
  app.registerAction('view-campaign-positions-from-earn', (target) => {
    const campaignId = target.dataset.campaignId || 
                       target.closest('[data-campaign-id]')?.dataset.campaignId;
    if (!campaignId) return;
    
    // Close modal first
    const modal = document.querySelector('.how-to-earn');
    if (modal) {
      modal.remove();
      if (howToEarnInstance) {
        howToEarnInstance.unmount();
        howToEarnInstance = null;
      }
    }
    
    // Set campaign filter in state
    stateManager.setState({ activeCampaignFilter: campaignId });
    
    // Navigate to positions with campaign filter
    router.navigate('positions');
  });
  
  // ============================================
  // ACTION HANDLERS - Referrals (Story 5.1)
  // ============================================
  
  // Filter referrals by tab
  app.registerAction('filter-referrals', (target) => {
    const filter = target.dataset.filter;
    if (filter) {
      stateManager.setState({ referralFilter: filter });
    }
  });
  
  // View referral details (opens modal - Story 5.3)
  app.registerAction('view-referral-details', (target) => {
    const referralId = target.dataset.referralId || 
                       target.closest('[data-referral-id]')?.dataset.referralId;
    if (!referralId) return;
    
    const referrals = stateManager.getState('referrals') || [];
    const referral = referrals.find(r => r.id === referralId);
    
    if (referral) {
      stateManager.setState({
        selectedReferral: referral,
        activeModal: 'referral-details'
      });
      // Modal will open via state subscription (Story 5.3)
    }
  });
  
  // Initialize the app
  app.init();
  
  // Initialize modal manager
  modalManager.init();
});

