/**
 * PassportCard Refer - Passport Component
 * Displays the passport cover with user information and summary stats
 * Implements: Story 3.1 - Passport Cover Design
 */

import { Component } from '../core/component.js';
import { CONFIG } from '../core/config.js';
import { STAMP_TYPES } from '../data/stamp-types.js';

// These will be set by app.js after initialization
let stateManager = null;
let animationService = null;

/**
 * Initialize module with app dependencies
 * @param {Object} deps - Dependencies object
 */
export function initPassportModule(deps) {
  stateManager = deps.stateManager;
  animationService = deps.animationService;
}

/**
 * PassportComponent - Displays the passport cover and manages passport state
 * First component in Epic 3 - establishes passport rendering patterns
 */
export class PassportComponent extends Component {
  constructor() {
    super();
    this.passportState = {
      isOpen: false,
      currentPage: 0,     // Desktop: spread index. Mobile: individual page index
      totalPages: 1,      // Desktop: total spreads. Mobile: total individual pages
      mobilePageInSpread: 0, // 0 = right page (profile), 1 = left page (stamps) - for mobile within spread 0
      isAnimating: false  // Prevent double navigation
    };
    this.touchStartX = 0;
    this.touchEndX = 0;
    // Cache mobile check
    this._isMobileCache = null;
    this._resizeHandler = this._handleResize.bind(this);
  }
  
  /**
   * Check if current viewport is mobile (< 768px)
   * @returns {boolean}
   */
  _isMobile() {
    if (this._isMobileCache === null || typeof window !== 'undefined') {
      this._isMobileCache = window.innerWidth < 768;
    }
    return this._isMobileCache;
  }
  
  /**
   * Handle window resize - update mobile state
   */
  _handleResize() {
    const wasMobile = this._isMobileCache;
    this._isMobileCache = window.innerWidth < 768;
    
    // If viewport changed between mobile/desktop, re-render
    if (wasMobile !== this._isMobileCache && this.passportState.isOpen) {
      this._updatePageDisplay();
    }
  }
  
  /**
   * Stamps per page constant
   */
  static get STAMPS_PER_PAGE() {
    return 6;
  }
  
  /**
   * Minimum number of stamp pages to show (for future stamps feature)
   */
  static get MIN_STAMP_PAGES() {
    return 3; // Show at least 3 stamp pages (18 stamp slots total)
  }

  /**
   * Calculates total passport pages based on stamps
   * @param {Array} stamps - User's stamps array
   * @param {boolean} forMobile - If true, calculate for mobile (individual pages)
   * @returns {number} Total number of pages/spreads
   */
  _calculateTotalPages(stamps, forMobile = false) {
    const stampCount = stamps ? stamps.length : 0;
    const actualStampPages = Math.ceil(stampCount / PassportComponent.STAMPS_PER_PAGE) || 1;
    
    // Always show at least MIN_STAMP_PAGES for future stamps
    const totalStampPages = Math.max(actualStampPages, PassportComponent.MIN_STAMP_PAGES);
    
    if (forMobile) {
      // Mobile: 1 profile + totalStampPages individual pages
      return 1 + totalStampPages;
    }
    
    // Desktop: 1 profile spread + ceiling of stamp spreads (2 pages per spread)
    return 1 + Math.ceil(totalStampPages / 2);
  }
  
  /**
   * Gets the total number of pages for current viewport
   * @param {Array} stamps - User's stamps array
   * @returns {number} Total pages appropriate for current viewport
   */
  _getTotalPagesForViewport(stamps) {
    return this._calculateTotalPages(stamps, this._isMobile());
  }
  
  /**
   * Returns the passport page HTML template
   * @returns {string} HTML string
   */
  template() {
    const user = stateManager?.getState('currentUser');
    if (!user) return this._renderLoading();
    
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
    const stamps = stateManager?.getState('stamps') || [];
    const points = user.points || 0;
    const isOpen = this.passportState.isOpen;
    const currentPage = this.passportState.currentPage;
    const totalPages = this._getTotalPagesForViewport(stamps);
    
    // Update state
    this.passportState.totalPages = totalPages;
    
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
            ${this._renderAllPages(user, stamps)}
          </div>
          
          <!-- Passport Cover (on top, flips open) -->
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
        </article>
        
        ${this._renderPassportSummary(stamps, points)}
        ${this._renderNavigationArrows()}
      </section>
    `;
  }
  
  /**
   * Renders the pages header (X button removed per bug #5)
   * @returns {string} Empty string - close button removed
   */
  _renderPagesHeader() {
    // X button removed - passport closes via main CTA button or by clicking cover
    return '';
  }
  
  /**
   * Renders passport summary section (stats and button removed)
   * Open/close now handled exclusively via navigation arrows
   * @param {Array} stamps - User's stamps array (unused, kept for API compatibility)
   * @param {number} points - User's points (unused, kept for API compatibility)
   * @returns {string} Empty string - no summary section needed
   */
  _renderPassportSummary(stamps, points) {
    // Open/close button removed - passport opens by clicking cover,
    // closes by pressing arrow on last/first page
    return '';
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
    
    // Calculate empty slots for this page
    const emptySlots = STAMPS_PER_PAGE - pageStamps.length;
    
    // For empty pages (future pages), show all placeholders
    if (pageStamps.length === 0) {
      const placeholderTypes = this._getFuturePlaceholderTypes(STAMPS_PER_PAGE);
      return `
        <div class="stamps-page stamps-page--future">
          <div class="stamps-grid">
            ${placeholderTypes.map(type => this._renderStampPlaceholder(type)).join('')}
          </div>
          <p class="stamps-page__future-hint">
            <i class="ti ti-sparkles" aria-hidden="true"></i>
            עמוד לחותמות עתידיות
          </p>
        </div>
      `;
    }
    
    // For pages with some stamps, fill remaining with contextual placeholders
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
   * Gets placeholder types for future empty pages
   * @param {number} count - Number of placeholders needed
   * @returns {Array} Array of stamp type keys
   */
  _getFuturePlaceholderTypes(count) {
    const types = ['submitted', 'interview', 'hired', 'submitted', 'milestone', 'interview'];
    return Array.from({ length: count }, (_, i) => types[i % types.length]);
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
   * Arrows are always enabled when passport is open:
   * - On first page: "prev" arrow closes the passport
   * - On last page: "next" arrow closes the passport
   * @returns {string} HTML string
   */
  _renderNavigationArrows() {
    const { currentPage, isOpen } = this.passportState;
    const stamps = stateManager?.getState('stamps') || [];
    const totalPages = this._getTotalPagesForViewport(stamps);
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage >= totalPages - 1;
    
    // When passport is open, arrows are always enabled (they close the passport at boundaries)
    // When closed, arrows are disabled
    const prevDisabled = !isOpen;
    const nextDisabled = !isOpen;
    
    return `
      <div class="passport-nav">
        <button class="passport-nav__btn passport-nav__btn--prev ${prevDisabled ? 'passport-nav__btn--disabled' : ''}"
                data-action="passport-prev"
                aria-label="${isFirstPage ? 'סגור את הדרכון' : 'עמוד קודם'}"
                ${prevDisabled ? 'disabled' : ''}>
          <i class="ti ti-chevron-right" aria-hidden="true"></i>
          <span class="passport-nav__text">${isFirstPage ? 'סגור' : 'הקודם'}</span>
        </button>
        
        <button class="passport-nav__btn passport-nav__btn--next ${nextDisabled ? 'passport-nav__btn--disabled' : ''}"
                data-action="passport-next"
                aria-label="${isLastPage ? 'סגור את הדרכון' : 'עמוד הבא'}"
                ${nextDisabled ? 'disabled' : ''}>
          <span class="passport-nav__text">${isLastPage ? 'סגור' : 'הבא'}</span>
          <i class="ti ti-chevron-left" aria-hidden="true"></i>
        </button>
      </div>
      ${this._renderSwipeHint()}
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
  
  // Page indicator removed per bug #9 - navigation is intuitive without explicit numbers
  
  /**
   * Renders Page 1: Profile information
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderProfilePage(user) {
    const stamps = stateManager?.getState('stamps') || [];
    const referrals = stateManager?.getState('referrals') || [];
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
    const { currentPage, isAnimating } = this.passportState;
    const stamps = stateManager?.getState('stamps') || [];
    const totalPages = this._getTotalPagesForViewport(stamps);
    
    if (isAnimating || currentPage >= totalPages - 1) return;
    
    this.passportState.isAnimating = true;
    this.passportState.currentPage++;
    
    // For desktop, also animate the page flip
    if (!this._isMobile() && animationService) {
      const pagesEl = document.querySelector('.passport-pages');
      await animationService.animatePageFlipNext(pagesEl);
    }
    
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
    this.passportState.currentPage--;
    
    // For desktop, also animate the page flip
    if (!this._isMobile() && animationService) {
      const pagesEl = document.querySelector('.passport-pages');
      await animationService.animatePageFlipPrev(pagesEl);
    }
    
    this.passportState.isAnimating = false;
    this._updatePageDisplay();
  }
  
  /**
   * Updates page display after navigation
   */
  _updatePageDisplay() {
    const { currentPage } = this.passportState;
    const stamps = stateManager?.getState('stamps') || [];
    const totalPages = this._getTotalPagesForViewport(stamps);
    
    // Update state with correct total
    this.passportState.totalPages = totalPages;
    
    if (this._isMobile()) {
      this._updateMobilePageDisplay();
    } else {
      document.querySelectorAll('.passport-spread').forEach((spread, i) => {
        spread.classList.toggle('passport-spread--active', i === currentPage);
        spread.classList.remove('passport-spread--show-left');
      });
    }
    
    this._updateNavigationButtons();
    
  }
  
  /**
   * Updates mobile page display
   */
  _updateMobilePageDisplay() {
    const { currentPage } = this.passportState;
    const spreads = document.querySelectorAll('.passport-spread');
    
    let spreadIndex = 0;
    let showLeft = false;
    
    if (currentPage === 0) {
      spreadIndex = 0;
      showLeft = false;
    } else if (currentPage === 1) {
      spreadIndex = 0;
      showLeft = true;
    } else {
      const adjustedPage = currentPage - 2;
      spreadIndex = 1 + Math.floor(adjustedPage / 2);
      showLeft = adjustedPage % 2 === 1;
    }
    
    spreads.forEach((spread, i) => {
      spread.classList.toggle('passport-spread--active', i === spreadIndex);
      if (i === spreadIndex) {
        spread.classList.toggle('passport-spread--show-left', showLeft);
      } else {
        spread.classList.remove('passport-spread--show-left');
      }
    });
  }
  
  /**
   * Updates navigation button states
   * Arrows are always enabled when passport is open (they close at boundaries)
   */
  _updateNavigationButtons() {
    const { currentPage, isOpen } = this.passportState;
    const stamps = stateManager?.getState('stamps') || [];
    const totalPages = this._getTotalPagesForViewport(stamps);
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage >= totalPages - 1;
    
    const prevBtn = document.querySelector('.passport-nav__btn--prev');
    const nextBtn = document.querySelector('.passport-nav__btn--next');
    
    // When passport is open, buttons are always enabled
    if (prevBtn) {
      prevBtn.disabled = !isOpen;
      prevBtn.classList.toggle('passport-nav__btn--disabled', !isOpen);
      // Update text based on position
      const textSpan = prevBtn.querySelector('.passport-nav__text');
      if (textSpan) {
        textSpan.textContent = isFirstPage ? 'סגור' : 'הקודם';
      }
      prevBtn.setAttribute('aria-label', isFirstPage ? 'סגור את הדרכון' : 'עמוד קודם');
    }
    
    if (nextBtn) {
      nextBtn.disabled = !isOpen;
      nextBtn.classList.toggle('passport-nav__btn--disabled', !isOpen);
      // Update text based on position
      const textSpan = nextBtn.querySelector('.passport-nav__text');
      if (textSpan) {
        textSpan.textContent = isLastPage ? 'סגור' : 'הבא';
      }
      nextBtn.setAttribute('aria-label', isLastPage ? 'סגור את הדרכון' : 'עמוד הבא');
    }
  }
  
  /**
   * Formats join date in Hebrew
   * @param {string|Date} date - Join date
   * @returns {string} Formatted date
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
   * Renders PassportCard logo
   * @returns {string} HTML string
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
   * @param {Object} user - User object
   * @returns {string} Passport number
   */
  _getPassportNumber(user) {
    if (user.passportNumber) return user.passportNumber;
    
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
   * Mounts the component
   */
  mount() {
    super.mount();
    
    this.subscribe('currentUser', this._handleUserChange.bind(this));
    this.subscribe('stamps', this._handleStampsChange.bind(this));
    
    setTimeout(() => {
      const passportEl = document.querySelector('.passport');
      if (passportEl && animationService) {
        animationService.initializePassport(passportEl);
      }
    }, 0);
    
    this._setupKeyboardHandlers();
    this._setupTouchHandlers();
    window.addEventListener('resize', this._resizeHandler);
    this._animateNewStamps();
    this._checkForNewStampCelebrations();
  }
  
  /**
   * Unmounts the component
   */
  unmount() {
    super.unmount();
    window.removeEventListener('resize', this._resizeHandler);
  }
  
  /**
   * Checks for newly earned stamps and triggers celebrations
   */
  _checkForNewStampCelebrations() {
    const stamps = stateManager?.getState('stamps') || [];
    const newStamps = stamps.filter(s => s.isNew);
    
    if (newStamps.length === 0) return;
    
    const hiredStamp = newStamps.find(s => s.type === 'hired');
    const firstStamp = newStamps.find(s => s.type === 'first');
    
    setTimeout(() => {
      if (animationService) {
        if (hiredStamp) {
          animationService.celebrateHiredStamp();
        } else if (firstStamp) {
          animationService.celebrateFirstReferral();
        } else if (newStamps.length > 0) {
          animationService.celebrateAchievement(newStamps[0].type);
        }
      }
    }, 800);
  }
  
  /**
   * Animates newly earned stamps
   */
  async _animateNewStamps() {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newStamps = document.querySelectorAll('.stamp--new');
    if (!newStamps || newStamps.length === 0) return;
    
    for (const stampEl of newStamps) {
      if (animationService) {
        await animationService.animateStampSlam(stampEl);
      }
      
      const stampId = stampEl.dataset.stampId;
      this._markStampAsViewed(stampId);
    }
  }
  
  /**
   * Marks stamp as viewed
   * @param {string} stampId - Stamp ID
   */
  _markStampAsViewed(stampId) {
    const stamps = stateManager?.getState('stamps') || [];
    const updatedStamps = stamps.map(s => 
      s.id === stampId ? { ...s, isNew: false } : s
    );
    if (stateManager) {
      stateManager.setState({ stamps: updatedStamps });
    }
  }
  
  /**
   * Sets up touch handlers for swipe navigation
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
   * Handles swipe gesture
   */
  _handleSwipe() {
    if (!this.passportState.isOpen) return;
    
    const swipeDistance = this.touchEndX - this.touchStartX;
    const minSwipeDistance = 50;
    
    if (swipeDistance < -minSwipeDistance) {
      this.navigateNext();
    } else if (swipeDistance > minSwipeDistance) {
      this.navigatePrev();
    }
  }
  
  /**
   * Sets up keyboard handlers
   */
  _setupKeyboardHandlers() {
    setTimeout(() => {
      const passport = document.querySelector('.passport');
      if (passport) {
        passport.addEventListener('keydown', this._handlePassportKeydown.bind(this));
      }
    }, 0);
  }
  
  /**
   * Handles keyboard interaction
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handlePassportKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const action = this.passportState.isOpen ? 'close-passport' : 'open-passport';
      
      const event = new CustomEvent('passport-action', { detail: { action } });
      document.dispatchEvent(event);
      
      if (typeof app !== 'undefined' && app._handleAction) {
        app._handleAction(action, e.currentTarget, e);
      }
      return;
    }
    
    if (e.key === 'Escape' && this.passportState.isOpen) {
      e.preventDefault();
      if (typeof app !== 'undefined' && app._handleAction) {
        app._handleAction('close-passport', e.currentTarget, e);
      }
      return;
    }
    
    if (!this.passportState.isOpen) return;
    
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
    
    const passport = document.querySelector('.passport');
    
    if (isOpen) {
      this.passportState.currentPage = 0;
      this.passportState.mobilePageInSpread = 0;
      document.querySelectorAll('.passport-spread').forEach((spread, i) => {
        spread.classList.toggle('passport-spread--active', i === 0);
        spread.classList.remove('passport-spread--show-left');
      });
      
      if (passport) {
        passport.classList.remove('passport--animated');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            passport.classList.add('passport--animated');
          });
        });
      }
    } else {
      if (passport) {
        passport.classList.remove('passport--animated');
      }
    }
    
    const cover = document.querySelector('.passport-cover');
    
    if (passport) {
      passport.setAttribute('aria-label', isOpen ? 'דרכון פתוח' : 'דרכון סגור');
    }
    
    if (cover) {
      if (isOpen) {
        cover.removeAttribute('data-action');
      } else {
        cover.dataset.action = 'open-passport';
      }
    }
    
    this._updateNavigationButtons();
  }
  
  // _updatePageIndicator() removed per bug #9 - page indicator no longer displayed
  
  /**
   * Handles user data changes
   * @param {Object} newUser - Updated user object
   */
  _handleUserChange(newUser) {
    if (this.element && newUser) {
      const appContainer = document.getElementById('main-content');
      if (appContainer && this.isMounted()) {
        appContainer.innerHTML = this.template();
        
        setTimeout(() => {
          const passportEl = document.querySelector('.passport');
          if (passportEl && animationService) {
            animationService.initializePassport(passportEl);
          }
        }, 0);
        
        this._setupKeyboardHandlers();
        this._setupTouchHandlers();
      }
    }
  }
  
  /**
   * Handles stamps data changes
   * Stats text under passport removed per bug #8
   * @param {Array} newStamps - Updated stamps array
   */
  _handleStampsChange(newStamps) {
    // Stats text removed per bug #8 - no need to update .passport-summary__stamps
    
    const stampsCountEl = document.querySelector('.stamps-page__count');
    if (stampsCountEl && newStamps) {
      stampsCountEl.textContent = `${newStamps.length} חותמות נאספו`;
    }
  }
}
