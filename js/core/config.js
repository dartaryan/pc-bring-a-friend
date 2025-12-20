/**
 * PassportCard Refer - Configuration
 * Application configuration, routes, and constants
 */

/* ============================================================================
   CONFIGURATION
   ========================================================================== */

export const CONFIG = {
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

export const ACTIVITY_TYPES = {
  REFERRAL_SUBMITTED: 'referral_submitted',
  STATUS_CHANGE: 'status_change',
  STAMP_EARNED: 'stamp_earned',
  POINTS_EARNED: 'points_earned',
  MILESTONE_REACHED: 'milestone_reached'
};
