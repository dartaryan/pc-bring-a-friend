# Story 3.2: Passport Opening Animation

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to see an engaging animation when opening my passport,
**So that** the experience feels delightful and tactile.

## Acceptance Criteria

### AC1: Click/Tap Triggers Animation
**Given** the passport is closed
**When** I click/tap on the passport cover OR the "פתח את הדרכון" button
**Then** the passport cover begins to open with a 3D flip animation
**And** the animation duration is 800ms
**And** the easing is `ease-passport-flip` (cubic-bezier(0.645, 0.045, 0.355, 1))

### AC2: 3D Flip Effect
**Given** the animation is running
**When** I observe the flip
**Then** the cover rotates from 0 to ~160 degrees around the LEFT edge (RTL)
**And** a 3D perspective effect is visible (perspective: 1000px)
**And** the back of the cover reveals the first page

### AC3: Animation Completion
**Given** the animation completes
**When** the passport is fully open
**Then** I see a two-page spread (left page visible, right page visible)
**And** Page 1 (right side in RTL) shows my profile information
**And** the passport state changes to "open"
**And** the CTA button changes to "סגור" (Close)

### AC4: Reduced Motion Support
**Given** I have `prefers-reduced-motion: reduce` enabled
**When** I open the passport
**Then** the animation is skipped or reduced to a simple fade
**And** the passport transitions immediately to open state

### AC5: Close Passport Animation
**Given** I want to close the passport
**When** I click a "סגור" (Close) button or click the cover area
**Then** the cover animates closed (reverse of opening)
**And** I return to the closed passport view
**And** the CTA button returns to "פתח את הדרכון"

### AC6: Page 1 Profile Content
**Given** the passport is open
**When** I view Page 1 (right side in RTL)
**Then** I see my avatar/initial circle
**And** I see my full name
**And** I see my department
**And** I see "מאז: [join date]" (member since)
**And** I see total points
**And** I see total referrals count

### AC7: Touch and Keyboard Accessibility
**Given** I use keyboard navigation
**When** I focus on the passport or CTA button and press Enter/Space
**Then** the animation triggers correctly
**And** focus moves appropriately after animation

### AC8: Animation Performance
**Given** the animation runs
**When** I observe the frame rate
**Then** the animation maintains 60fps
**And** no visible jank or stuttering occurs
**And** GPU-accelerated properties are used

## Tasks / Subtasks

- [x] Task 1: Add CSS animation keyframes (AC: #1, #2)
  - [x] Create `@keyframes passportOpen` for cover flip (0 → 160 degrees)
  - [x] Create `@keyframes passportClose` for reverse animation
  - [x] Define `--ease-passport-flip` custom easing
  - [x] Add `perspective: 1000px` to passport container

- [x] Task 2: Add CSS states for passport (AC: #1, #3)
  - [x] Add `.passport--opening` class with animation
  - [x] Add `.passport--open` class for open state
  - [x] Add `.passport--closing` class for close animation
  - [x] Style cover backface visibility

- [x] Task 3: Create passport pages structure (AC: #3, #6)
  - [x] Add `.passport-pages` container behind cover
  - [x] Add `.passport-page--profile` for Page 1
  - [x] Add `.passport-page--stamps` for Page 2 (placeholder)
  - [x] Style two-page spread layout

- [x] Task 4: Add profile page content (AC: #6)
  - [x] Create `_renderProfilePage()` method in PassportComponent
  - [x] Render avatar with user initial
  - [x] Render user name and department
  - [x] Render join date (formatted in Hebrew)
  - [x] Render total points and referrals count

- [x] Task 5: Implement AnimationService methods (AC: #1, #2, #8)
  - [x] Add `animatePassportOpen(passportEl)` method
  - [x] Add `animatePassportClose(passportEl)` method
  - [x] Use `waitForAnimation()` for async completion
  - [x] Ensure GPU acceleration with transform/opacity

- [x] Task 6: Add reduced motion support (AC: #4)
  - [x] Check `this.reducedMotion` before animating
  - [x] Add instant state change for reduced motion
  - [x] Add CSS `@media (prefers-reduced-motion: reduce)` rules

- [x] Task 7: Update PassportComponent for open/close (AC: #1, #3, #5)
  - [x] Update template to include pages structure
  - [x] Add `passportOpen` state to component
  - [x] Handle `open-passport` action to trigger animation
  - [x] Handle `close-passport` action for reverse
  - [x] Update CTA button text based on state

- [x] Task 8: Register action handlers (AC: #1, #5)
  - [x] Update `open-passport` action to use AnimationService
  - [x] Register `close-passport` action handler
  - [x] Update state after animation completes

- [x] Task 9: Add keyboard accessibility (AC: #7)
  - [x] Ensure passport cover is focusable (tabindex)
  - [x] Add keyboard event handlers (Enter/Space)
  - [x] Manage focus after animation

- [x] Task 10: Style responsive adjustments (AC: #8)
  - [x] Adjust perspective for mobile/desktop
  - [x] Test animation performance across sizes
  - [x] Optimize for 60fps

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**AnimationService Extension:**

```javascript
// ============================================
// SERVICES - Animation (extend existing)
// ============================================

class AnimationService {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Listen for changes to motion preference
    window.matchMedia('(prefers-reduced-motion: reduce)')
      .addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
      });
  }
  
  /**
   * Animates passport opening with 3D flip effect
   * @param {HTMLElement} passportEl - The passport container element
   * @returns {Promise<void>} Resolves when animation completes
   */
  async animatePassportOpen(passportEl) {
    if (!passportEl) return;
    
    // Skip animation for reduced motion preference
    if (this.reducedMotion) {
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
    await this.waitForAnimation(coverEl, 'passportOpen');
    
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
    if (this.reducedMotion) {
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
    await this.waitForAnimation(coverEl, 'passportClose');
    
    // Set final state
    passportEl.classList.remove('passport--closing');
    passportEl.classList.add('passport--closed');
  }
  
  /**
   * Waits for a CSS animation to complete
   * @param {HTMLElement} el - Element being animated
   * @param {string} animationName - Optional specific animation name to wait for
   * @returns {Promise<void>}
   */
  waitForAnimation(el, animationName) {
    return new Promise(resolve => {
      const handleAnimationEnd = (e) => {
        // If animation name specified, only resolve for that animation
        if (animationName && e.animationName !== animationName) return;
        
        el.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };
      
      el.addEventListener('animationend', handleAnimationEnd);
      
      // Fallback timeout in case animation doesn't fire
      setTimeout(() => {
        el.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      }, 1000); // 800ms animation + 200ms buffer
    });
  }
  
  // ... existing methods (celebrateWithConfetti, etc.)
}
```

**PassportComponent Update:**

```javascript
// ============================================
// COMPONENTS - Passport (update existing)
// ============================================

class PassportComponent extends Component {
  constructor(props) {
    super(props);
    this.passportState = {
      isOpen: false,
      currentPage: 0
    };
  }
  
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return this._renderLoading();
    
    return `
      <div class="app-layout">
        <div class="header-container"></div>
        <nav class="bottom-nav-container"></nav>
        <main class="passport-view page-content">
          ${this._renderPassport(user)}
        </main>
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
    
    return `
      <section class="passport-container" aria-label="הדרכון שלי">
        <article class="passport ${isOpen ? 'passport--open' : 'passport--closed'}"
                 tabindex="0"
                 role="button"
                 aria-label="${isOpen ? 'סגור את הדרכון' : 'פתח את הדרכון'}"
                 data-action="${isOpen ? 'close-passport' : 'open-passport'}">
          
          <!-- Passport Pages (behind cover) -->
          <div class="passport-pages">
            <!-- Page 1: Profile (Right side in RTL) -->
            <div class="passport-page passport-page--profile">
              ${this._renderProfilePage(user)}
            </div>
            
            <!-- Page 2: First Stamps Page (Left side in RTL) -->
            <div class="passport-page passport-page--stamps">
              ${this._renderStampsPagePlaceholder(stamps)}
            </div>
          </div>
          
          <!-- Passport Cover (on top, flips open) -->
          <div class="passport-cover">
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
        
        <div class="passport-summary">
          <p class="passport-summary__stats">
            <span class="passport-summary__stamps">${stamps.length} חותמות</span>
            <span class="passport-summary__separator">|</span>
            <span class="passport-summary__points">${points.toLocaleString()} נקודות</span>
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
      </section>
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
            <span class="profile-page__stat-value">${user.points?.toLocaleString() || 0}</span>
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
   * Renders placeholder for stamps page (full implementation in Story 3.4)
   * @param {Array} stamps - User's stamps array
   * @returns {string} HTML string
   */
  _renderStampsPagePlaceholder(stamps) {
    return `
      <div class="stamps-page stamps-page--placeholder">
        <p class="stamps-page__title">החותמות שלי</p>
        <p class="stamps-page__count">${stamps.length} חותמות נאספו</p>
        <p class="stamps-page__hint">המשך הפניות כדי לאסוף עוד!</p>
      </div>
    `;
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
      <div class="passport-cover__logo" aria-label="PassportCard">
        <svg viewBox="0 0 120 40" class="passport-logo" aria-hidden="true">
          <text x="60" y="28" text-anchor="middle" 
                font-family="Rubik, sans-serif" 
                font-weight="700" 
                font-size="16"
                fill="currentColor">
            PassportCard
          </text>
        </svg>
      </div>
    `;
  }
  
  /**
   * Gets or generates passport number for user
   * @param {Object} user - User object
   * @returns {string} Passport number (e.g., "REF-2025-001")
   */
  _getPassportNumber(user) {
    if (user.passportNumber) return user.passportNumber;
    
    const idNum = user.id.replace('usr-', '').padStart(3, '0');
    const year = new Date().getFullYear();
    return `REF-${year}-${idNum}`;
  }
  
  _renderLoading() {
    return `
      <div class="app-layout">
        <div class="header-container"></div>
        <nav class="bottom-nav-container"></nav>
        <main class="passport-view page-content">
          <div class="loading-state">
            <div class="spinner" aria-label="טוען..."></div>
          </div>
        </main>
      </div>
    `;
  }
  
  mount() {
    this.bindEvents();
    this.subscribe('currentUser', this._handleUserChange.bind(this));
    this.subscribe('stamps', this._handleStampsChange.bind(this));
    this._renderLayout();
    
    // Add keyboard handler for passport
    const passport = this.element?.querySelector('.passport');
    if (passport) {
      passport.addEventListener('keydown', this._handlePassportKeydown.bind(this));
    }
  }
  
  unmount() {
    const passport = this.element?.querySelector('.passport');
    if (passport) {
      passport.removeEventListener('keydown', this._handlePassportKeydown);
    }
    super.unmount();
  }
  
  /**
   * Handles keyboard interaction with passport
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handlePassportKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const action = e.currentTarget.dataset.action;
      if (action) {
        app.handleAction(action, e.currentTarget);
      }
    }
  }
  
  _renderLayout() {
    const headerContainer = this.element?.querySelector('.header-container');
    const navContainer = this.element?.querySelector('.bottom-nav-container');
    
    if (headerContainer) {
      headerContainer.innerHTML = headerComponent.render();
    }
    if (navContainer) {
      navContainer.innerHTML = bottomNavComponent.render();
    }
  }
  
  _handleUserChange(newUser) {
    if (this.element) {
      this.element.innerHTML = this.template();
      this._renderLayout();
    }
  }
  
  _handleStampsChange(newStamps) {
    const stampsEl = this.element?.querySelector('.passport-summary__stamps');
    if (stampsEl) {
      stampsEl.textContent = `${newStamps.length} חותמות`;
    }
  }
  
  /**
   * Updates component after animation state changes
   */
  updatePassportState(isOpen) {
    this.passportState.isOpen = isOpen;
    
    // Update CTA button and passport aria
    const cta = this.element?.querySelector('.passport-summary__cta');
    const passport = this.element?.querySelector('.passport');
    
    if (cta) {
      cta.dataset.action = isOpen ? 'close-passport' : 'open-passport';
      cta.setAttribute('aria-label', isOpen ? 'סגור את הדרכון שלי' : 'פתח את הדרכון שלי');
      cta.innerHTML = `
        <i class="ti ti-${isOpen ? 'x' : 'book-2'}" aria-hidden="true"></i>
        ${isOpen ? 'סגור' : 'פתח את הדרכון'}
      `;
    }
    
    if (passport) {
      passport.dataset.action = isOpen ? 'close-passport' : 'open-passport';
      passport.setAttribute('aria-label', isOpen ? 'סגור את הדרכון' : 'פתח את הדרכון');
    }
  }
}
```

**Action Handlers Update:**

```javascript
// ============================================
// ACTION HANDLERS (update existing)
// ============================================

// Open passport action
app.registerAction('open-passport', async (target) => {
  const passportEl = document.querySelector('.passport');
  if (!passportEl || passportEl.classList.contains('passport--opening')) return;
  
  // Use AnimationService for the animation
  await animationService.animatePassportOpen(passportEl);
  
  // Update state
  stateManager.setState({ passportOpen: true });
  
  // Update component state
  const passportComponent = app.getCurrentComponent();
  if (passportComponent && passportComponent.updatePassportState) {
    passportComponent.updatePassportState(true);
  }
});

// Close passport action
app.registerAction('close-passport', async (target) => {
  const passportEl = document.querySelector('.passport');
  if (!passportEl || passportEl.classList.contains('passport--closing')) return;
  
  // Use AnimationService for the animation
  await animationService.animatePassportClose(passportEl);
  
  // Update state
  stateManager.setState({ passportOpen: false });
  
  // Update component state
  const passportComponent = app.getCurrentComponent();
  if (passportComponent && passportComponent.updatePassportState) {
    passportComponent.updatePassportState(false);
  }
});
```

### CSS Styles (Add to style.css - Passport Animation section)

```css
/* =========================================================================
   PASSPORT - Opening Animation (Story 3.2)
   ========================================================================= */

/* Custom Easing */
:root {
  --ease-passport-flip: cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* Passport Book Container - 3D Context */
.passport {
  --passport-width: 280px;
  width: var(--passport-width);
  aspect-ratio: 3 / 4;
  position: relative;
  perspective: 1000px;
  cursor: pointer;
}

.passport:focus {
  outline: 3px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: var(--radius-passport, 8px);
}

/* Passport Pages - Behind Cover */
.passport-pages {
  position: absolute;
  inset: 0;
  display: flex;
  border-radius: var(--radius-passport, 8px);
  overflow: hidden;
  background: var(--passport-page-bg, linear-gradient(145deg, #FDF8F0 0%, #F5EEE0 100%));
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.05),
    0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Individual Page */
.passport-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  position: relative;
  
  /* Paper texture */
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.03'/%3E%3C/svg%3E");
}

/* Page 1: Profile (Right side in RTL layout) */
.passport-page--profile {
  order: 2; /* Right side in RTL */
  border-inline-start: 1px solid rgba(0, 0, 0, 0.05);
}

/* Page 2: Stamps (Left side in RTL layout) */
.passport-page--stamps {
  order: 1; /* Left side in RTL */
}

/* Passport Cover - 3D Flip */
.passport-cover {
  position: absolute;
  inset: 0;
  background: var(--gradient-passport-cover, linear-gradient(145deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%));
  border-radius: var(--radius-passport, 8px);
  box-shadow: var(--shadow-passport, 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 5px 15px rgba(0, 0, 0, 0.2),
    inset 0 0 20px rgba(0, 0, 0, 0.1));
  
  /* 3D Transform Setup */
  transform-origin: left center; /* Opens from left (RTL) */
  transform-style: preserve-3d;
  backface-visibility: hidden;
  
  /* Leather texture */
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
    linear-gradient(145deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
    
  /* Smooth transition for non-animated state changes */
  transition: transform 0.3s ease;
}

/* =========================================================================
   PASSPORT STATES
   ========================================================================= */

/* Closed State (default) */
.passport--closed .passport-cover {
  transform: rotateY(0deg);
}

.passport--closed .passport-pages {
  opacity: 0;
  pointer-events: none;
}

/* Opening Animation */
@keyframes passportOpen {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(-160deg);
  }
}

.passport--opening .passport-cover {
  animation: passportOpen 800ms var(--ease-passport-flip) forwards;
}

.passport--opening .passport-pages {
  opacity: 1;
  pointer-events: auto;
}

/* Open State */
.passport--open .passport-cover {
  transform: rotateY(-160deg);
}

.passport--open .passport-pages {
  opacity: 1;
  pointer-events: auto;
}

/* Closing Animation */
@keyframes passportClose {
  0% {
    transform: rotateY(-160deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

.passport--closing .passport-cover {
  animation: passportClose 800ms var(--ease-passport-flip) forwards;
}

.passport--closing .passport-pages {
  opacity: 1;
}

/* =========================================================================
   PROFILE PAGE STYLES (Page 1)
   ========================================================================= */

.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  text-align: center;
  color: var(--passport-page-text, #2D3436);
}

.profile-page__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.profile-page__avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gradient-primary, linear-gradient(135deg, #E10514 0%, #C50412 100%));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(225, 5, 20, 0.3);
}

.profile-page__initial {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: white;
  text-transform: uppercase;
}

.profile-page__name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin: 0;
  color: var(--passport-page-text, #2D3436);
}

.profile-page__department {
  font-size: var(--text-sm);
  color: var(--passport-page-muted, #636E72);
  margin: 0;
}

.profile-page__divider {
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 0, 0, 0.1) 20%, 
    rgba(0, 0, 0, 0.1) 80%, 
    transparent);
}

.profile-page__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.profile-page__since {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--passport-page-muted, #636E72);
  margin: 0;
}

.profile-page__since .ti {
  font-size: 1rem;
}

.profile-page__stats {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  width: 100%;
}

.profile-page__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.profile-page__stat-value {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  direction: ltr;
  unicode-bidi: isolate;
}

.profile-page__stat-label {
  font-size: var(--text-xs);
  color: var(--passport-page-muted, #636E72);
}

/* =========================================================================
   STAMPS PAGE PLACEHOLDER (Page 2)
   ========================================================================= */

.stamps-page--placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--passport-page-muted, #636E72);
}

.stamps-page__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin: 0 0 var(--space-2);
  color: var(--passport-page-text, #2D3436);
}

.stamps-page__count {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  margin: 0;
  color: var(--color-primary);
}

.stamps-page__hint {
  font-size: var(--text-sm);
  margin: var(--space-2) 0 0;
  opacity: 0.7;
}

/* =========================================================================
   RESPONSIVE - Tablet and Desktop (Passport Animation)
   ========================================================================= */

/* Tablet */
@media (min-width: 600px) {
  .passport {
    --passport-width: 320px;
  }
  
  .passport-page {
    padding: var(--space-5);
  }
  
  .profile-page__avatar {
    width: 70px;
    height: 70px;
  }
  
  .profile-page__initial {
    font-size: var(--text-3xl);
  }
  
  .profile-page__name {
    font-size: var(--text-xl);
  }
  
  .profile-page__stats {
    gap: var(--space-6);
  }
  
  .profile-page__stat-value {
    font-size: var(--text-2xl);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .passport {
    --passport-width: 360px;
  }
  
  .passport-page {
    padding: var(--space-6);
  }
  
  .profile-page__avatar {
    width: 80px;
    height: 80px;
  }
  
  .profile-page__stats {
    gap: var(--space-8);
  }
}

/* Wide Desktop */
@media (min-width: 1440px) {
  .passport {
    --passport-width: 400px;
  }
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .passport-cover {
    transition: none;
  }
  
  .passport--opening .passport-cover,
  .passport--closing .passport-cover {
    animation: none;
  }
  
  .passport--opening .passport-cover {
    transform: rotateY(-160deg);
  }
  
  .passport--closing .passport-cover {
    transform: rotateY(0deg);
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-passport-flip` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | Cover flip easing |
| `--passport-page-bg` | `linear-gradient(145deg, #FDF8F0 0%, #F5EEE0 100%)` | Page background |
| `--passport-page-text` | `#2D3436` | Page text color |
| `--passport-page-muted` | `#636E72` | Secondary page text |
| Animation duration | `800ms` | Open/close animation |
| Rotation angle | `-160deg` | Cover flip angle (RTL) |
| Perspective | `1000px` | 3D depth effect |

### RTL/Animation Considerations

1. **Transform Origin:** `left center` - cover opens from LEFT edge for RTL users
2. **Rotation Direction:** Negative rotation (`-160deg`) opens cover away from user
3. **Page Order:** In RTL, Page 1 (profile) is on RIGHT, Page 2 (stamps) is on LEFT
4. **Number Direction:** Stats use `direction: ltr` for proper number display

### Accessibility Requirements

1. **Keyboard Navigation:**
   - Passport is focusable with `tabindex="0"`
   - Enter/Space triggers open/close
   - Clear focus indicator

2. **ARIA Attributes:**
   - `role="button"` on passport element
   - Dynamic `aria-label` changes with state
   - Decorative elements have `aria-hidden="true"`

3. **Reduced Motion:**
   - Instant state change when `prefers-reduced-motion: reduce`
   - No animation, just final state applied

### Integration Points

**Dependencies from Story 3.1:**
- PassportComponent base structure
- `.passport` container with aspect ratio
- `.passport-cover` styling
- `.passport-summary` with CTA
- `open-passport` action registration
- CSS variables for passport design

**Extends:**
- `AnimationService` with `animatePassportOpen()` and `animatePassportClose()`
- `PassportComponent` with pages structure and profile content

**Prepares for:**
- Story 3.3: Passport Pages Navigation (swipe/arrows)
- Story 3.4: Stamp Collection Display
- Story 3.5: Stamp Details Modal & Celebrations

**Files to Modify:**
- `script.js` - Extend AnimationService, update PassportComponent, add action handlers (~200 lines)
- `style.css` - Add animation keyframes, page styles, states (~250 lines)

### Testing Scenarios

1. **Open Animation:**
   - Click passport cover → Cover flips open with 3D effect
   - Click CTA button → Same animation triggers
   - Animation is 800ms with smooth easing
   - 60fps maintained (check DevTools Performance)

2. **Close Animation:**
   - Click "סגור" CTA → Cover flips closed
   - Click open passport → Cover flips closed
   - Animation reverses smoothly

3. **Profile Page Content:**
   - User initial displayed in avatar
   - Name and department visible
   - Join date formatted in Hebrew
   - Stats show points, referrals, stamps

4. **Reduced Motion:**
   - Enable `prefers-reduced-motion: reduce` in OS/browser
   - Open/close should be instant (no animation)
   - State changes correctly

5. **Keyboard Accessibility:**
   - Tab to focus passport
   - Press Enter/Space to toggle open/close
   - Focus indicator visible

6. **Responsive:**
   - Mobile: ~280px passport, animation works
   - Tablet: ~320px, larger profile
   - Desktop: ~360-400px, all animations smooth

### Previous Story Patterns (From Story 3.1)

- `_renderPassport()` pattern (updated from `_renderPassportClosed`)
- `_getPassportNumber()` utility
- `_renderLayout()` for header/nav
- State subscriptions
- BEM CSS naming

### References

- [Source: docs/architecture.md#3.5-animation-architecture] - AnimationService patterns
- [Source: docs/architecture.md#4.8-animation-patterns] - CSS animation states
- [Source: docs/epics.md#story-32] - Original acceptance criteria
- [Source: docs/PRD.md#fr-pass-002] - Passport opening animation requirements
- [Source: docs/project_context.md] - Implementation rules and patterns
- [Source: docs/sprint-artifacts/3-1-passport-cover-design.md] - Previous story patterns

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete - Epic 3, Story 3.2)
- docs/project_context.md (complete)
- docs/sprint-artifacts/3-1-passport-cover-design.md (previous story patterns)

### Agent Model Used

Claude Opus 4.5 (via Cursor)

### Debug Log References

No errors encountered during implementation.

### Completion Notes List

**Implementation Summary (2025-12-10):**

1. **CSS Animation System (Tasks 1-2):**
   - Added `@keyframes passportOpen` and `@keyframes passportClose` for 3D cover flip animation
   - Implemented state classes: `.passport--closed`, `.passport--opening`, `.passport--open`, `.passport--closing`
   - Cover rotates from 0 to -160 degrees (RTL direction) with 800ms duration
   - Used `--ease-passport-flip` cubic-bezier for smooth easing
   - Added `perspective: 1000px` for 3D depth effect

2. **Passport Pages Structure (Tasks 3-4):**
   - Created `.passport-pages` container positioned behind cover
   - Page 1 (Profile): Avatar with initial, name, department, join date, points/referrals/stamps stats
   - Page 2 (Stamps): Placeholder for Story 3.4 implementation
   - Pages use paper texture background and proper RTL ordering

3. **AnimationService Extension (Task 5):**
   - Implemented `animatePassportOpen(passportEl)` with async/await pattern
   - Implemented `animatePassportClose(passportEl)` for reverse animation
   - Added `waitForAnimationByName()` for specific animation tracking
   - GPU acceleration via CSS transform properties

4. **Reduced Motion Support (Task 6):**
   - AnimationService checks `_reducedMotion` before animating
   - Instant state change when reduced motion preferred
   - CSS `@media (prefers-reduced-motion: reduce)` rules disable all animations

5. **PassportComponent Updates (Task 7):**
   - Renamed `_renderPassportClosed()` to `_renderPassport()` with full pages
   - Added `_renderProfilePage()` and `_renderStampsPagePlaceholder()` methods
   - Added `_formatJoinDate()` for Hebrew month formatting
   - Added `updatePassportState()` for dynamic UI updates

6. **Action Handlers (Task 8):**
   - Updated `open-passport` action to use AnimationService
   - Registered `close-passport` action handler
   - Both handlers update state after animation completes

7. **Keyboard Accessibility (Task 9):**
   - Passport element has `tabindex="0"` and `role="button"`
   - Enter/Space keys trigger open/close action
   - Focus indicator styled with outline

8. **Responsive Styles (Task 10):**
   - Mobile: 280px passport width
   - Tablet (600px+): 320px passport, larger profile elements
   - Desktop (1024px+): 360px passport, more spacing
   - Animation performance optimized with GPU-accelerated transforms

### File List

**Modified Files:**
- `script.js` - Extended AnimationService (animatePassportOpen, animatePassportClose, waitForAnimationByName), updated PassportComponent (template with pages, profile rendering, keyboard handlers, state updates), added App.getComponent(), updated action handlers (~220 lines added/modified)
- `style.css` - Added animation keyframes, passport state classes, page styles, profile page styles, stamps placeholder styles, responsive adjustments, reduced motion support (~280 lines added)
- `docs/sprint-artifacts/sprint-status.yaml` - Updated story status to in-progress → review

**No new files created.**

Depends on from Story 3.1:
- PassportComponent class structure
- `.passport` container styling
- `.passport-cover` design
- `.passport-summary` CTA section
- `open-passport` action registered (updated)
- CSS variables for passport design

Prepares for:
- Story 3.3: Passport Pages Navigation (swipe between pages)
- Story 3.4: Stamp Collection Display (stamp grid on pages)
- Story 3.5: Stamp Details Modal & Celebrations

