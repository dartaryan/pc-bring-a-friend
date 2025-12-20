/**
 * PassportCard Refer - Utility Functions
 * Error handling, icons, and utility helpers
 */

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
export function setupGlobalErrorHandler() {
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
}

/**
 * Unhandled Promise rejection handler
 * @param {PromiseRejectionEvent} event - Rejection event
 */
export function setupUnhandledRejectionHandler() {
  window.onunhandledrejection = function(event) {
    // Log for debugging
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('Unhandled promise rejection:', event.reason);
    }
    
    // Prevent default handling
    event.preventDefault();
  };
}

/**
 * Safe localStorage wrapper with quota handling (Story 6.5 AC7)
 * Handles QuotaExceededError by clearing old data
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} True if successful
 */
export function safeSetStorage(key, value) {
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
export function safeGetStorage(key) {
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
export function renderIcon(iconName, options = {}) {
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
export function showCSSCelebration() {
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
export function safeCelebrate(options = {}) {
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
export function runQACheck() {
  const results = {
    passed: [],
    failed: [],
    timestamp: new Date().toISOString()
  };
  
  // Check 1: State manager exists
  if (typeof window.stateManager !== 'undefined') {
    results.passed.push('StateManager exists');
  } else {
    results.failed.push('StateManager not found');
  }
  
  // Check 2: Router exists
  if (typeof window.router !== 'undefined') {
    results.passed.push('Router exists');
  } else {
    results.failed.push('Router not found');
  }
  
  // Check 3: All routes are valid
  const routes = ['auth', 'dashboard', 'passport', 'positions', 'referrals', 'settings'];
  routes.forEach(route => {
    if (window.CONFIG && window.CONFIG.ROUTES[route]) {
      results.passed.push(`Route "${route}" defined`);
    } else {
      results.failed.push(`Route "${route}" missing`);
    }
  });
  
  // Check 4: Mock data exists
  if (window.MOCK_POSITIONS && window.MOCK_POSITIONS.length >= 8) {
    results.passed.push(`MOCK_POSITIONS has ${window.MOCK_POSITIONS.length} items`);
  } else {
    results.failed.push('MOCK_POSITIONS missing or insufficient');
  }
  
  if (window.MOCK_CAMPAIGNS && window.MOCK_CAMPAIGNS.length >= 1) {
    results.passed.push(`MOCK_CAMPAIGNS has ${window.MOCK_CAMPAIGNS.length} items`);
  } else {
    results.failed.push('MOCK_CAMPAIGNS missing');
  }
  
  // Check 5: Stamp types defined
  if (window.STAMP_TYPES && Object.keys(window.STAMP_TYPES).length >= 8) {
    results.passed.push(`STAMP_TYPES has ${Object.keys(window.STAMP_TYPES).length} types`);
  } else {
    results.failed.push('STAMP_TYPES missing or incomplete');
  }
  
  // Check 6: User generation works
  try {
    const testUser = window.generateUserFromEmail('test.user@passportcard.co.il');
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

/* ============================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

/**
 * Creates a debounced version of a function
 * @param {Function} fn - Function to debounce
 * @param {number} ms - Delay in milliseconds
 * @returns {Function} Debounced function with cancel method
 */
export function debounce(fn, ms) {
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
export function seededRandom(seed) {
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
export function generatePhoneNumber(seed) {
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
export function maskPhoneNumber(phone) {
  // Keep prefix (05), mask middle, show last 2 digits
  const parts = phone.split('-');
  if (parts.length !== 3) return phone;
  
  const prefix = parts[0].substring(0, 2) + '*';  // '05*'
  const middle = '***';
  const lastPart = '**' + parts[2].slice(-2);     // '**67'
  
  return `${prefix}-${middle}-${lastPart}`;
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
export function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Initializes viewport height fix with event listeners
 */
export function initViewportHeightFix() {
  // Set initial value
  setViewportHeight();
  
  // Update on resize
  window.addEventListener('resize', setViewportHeight);
  
  // Update on orientation change (with delay for Safari to update dimensions)
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
  });
}

// Initialize error handlers and viewport fix
export function initUtils() {
  setupGlobalErrorHandler();
  setupUnhandledRejectionHandler();
  initViewportHeightFix();
  
  // Expose QA helper globally for console access
  window.runQACheck = runQACheck;
}
