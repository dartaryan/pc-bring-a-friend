# Story 3.3: Passport Pages & Navigation

**Status:** review

## Story

**As an** employee,
**I want** to flip through multiple pages of my passport,
**So that** I can see all my stamps organized across pages.

## Acceptance Criteria

### AC1: First Page Spread Display
**Given** the passport is open
**When** I view the first page spread
**Then** Page 1 (right side in RTL) shows my profile and stats:
  - My photo/avatar placeholder
  - My name and department
  - Join date (e.g., "מאז: ינואר 2023")
  - Total points and referral counts
**And** Page 2 (left side in RTL) shows my first set of stamps

### AC2: Stamp Overflow to Multiple Pages
**Given** I have more than 4-6 stamps
**When** stamps overflow
**Then** additional pages are created (4-6 stamps per page)
**And** I can navigate to see more stamps

### AC3: Swipe Navigation (Mobile)
**Given** I am viewing the passport pages
**When** I swipe LEFT on mobile
**Then** I navigate to the NEXT page (RTL navigation)
**And** a page flip animation plays (600ms duration)

### AC4: Swipe Navigation Reverse (Mobile)
**Given** I am viewing the passport pages
**When** I swipe RIGHT on mobile
**Then** I navigate to the PREVIOUS page
**And** a page flip animation plays

### AC5: Arrow Navigation (Desktop)
**Given** I am on desktop or want arrow navigation
**When** I click the navigation arrows
**Then** "◄ הקודם" (Previous) navigates to previous page
**And** "הבא ►" (Next) navigates to next page

### AC6: Page Indicator
**Given** I am navigating pages
**When** I view the page indicator
**Then** I see "עמוד X מתוך Y" (Page X of Y)
**And** dots or numbers indicate current position

### AC7: First/Last Page Boundaries
**Given** I am on the first page
**When** I try to go to previous
**Then** the "Previous" button/swipe is disabled or has no effect

**Given** I am on the last page
**When** I try to go to next
**Then** the "Next" button/swipe is disabled or has no effect

### AC8: Page Paper Texture
**Given** the page has paper texture
**When** I view the background
**Then** I see a cream-colored gradient (#FDF8F0 to #F5EEE0)
**And** there is a subtle paper grain texture
**And** a faint PassportCard watermark (5% opacity) is visible

### AC9: Page Flip Animation Performance
**Given** I navigate between pages
**When** the page flip animation plays
**Then** the animation maintains 60fps
**And** uses GPU-accelerated transforms
**And** respects `prefers-reduced-motion: reduce`

### AC10: Keyboard Navigation
**Given** I use keyboard navigation
**When** I press arrow keys (Left/Right)
**Then** I can navigate between pages
**And** focus is managed appropriately

## Tasks / Subtasks

- [x] Task 1: Update page structure in PassportComponent (AC: #1, #2)
  - [x] Convert placeholder stamps page to dynamic multi-page structure
  - [x] Calculate total pages based on stamps count (4-6 stamps per page)
  - [x] Add `currentPage` and `totalPages` state tracking
  - [x] Implement `_renderStampsPage(pageIndex, stamps)` method

- [x] Task 2: Implement page flip animation CSS (AC: #3, #4, #9)
  - [x] Create `@keyframes pageFlipNext` animation
  - [x] Create `@keyframes pageFlipPrev` animation
  - [x] Duration: 600ms with appropriate easing
  - [x] Use `transform-style: preserve-3d` for 3D effect
  - [x] Ensure GPU acceleration with transform properties

- [x] Task 3: Add swipe detection for mobile (AC: #3, #4)
  - [x] Implement touch event handlers (touchstart, touchmove, touchend)
  - [x] Calculate swipe direction and distance
  - [x] Trigger page navigation on valid swipe (>50px threshold)
  - [x] Account for RTL direction (swipe left = next)

- [x] Task 4: Add navigation arrows (AC: #5)
  - [x] Render previous/next arrow buttons in passport container
  - [x] Position arrows on sides of passport
  - [x] Use `data-action="passport-prev"` and `data-action="passport-next"`
  - [x] Style with 44px minimum touch targets

- [x] Task 5: Implement page indicator (AC: #6)
  - [x] Add page indicator element below passport
  - [x] Show "עמוד X מתוך Y" text
  - [x] Add dot indicators for visual representation
  - [x] Highlight current page dot

- [x] Task 6: Implement navigation boundary logic (AC: #7)
  - [x] Disable/hide prev arrow on first page
  - [x] Disable/hide next arrow on last page
  - [x] Prevent swipe beyond boundaries
  - [x] Add subtle feedback at boundaries

- [x] Task 7: Style paper texture and watermark (AC: #8)
  - [x] Apply cream gradient background to pages
  - [x] Add paper grain texture overlay
  - [x] Create faint PassportCard watermark (5% opacity)
  - [x] Position watermark centered on each page

- [x] Task 8: Extend AnimationService for page flip (AC: #9)
  - [x] Add `animatePageFlipNext(pagesEl)` method
  - [x] Add `animatePageFlipPrev(pagesEl)` method
  - [x] Include reduced motion fallback (instant page change)
  - [x] Return Promise for animation completion

- [x] Task 9: Add keyboard navigation support (AC: #10)
  - [x] Listen for arrow key events on passport
  - [x] Left arrow → previous page (RTL context)
  - [x] Right arrow → next page (RTL context)
  - [x] Manage focus states

- [x] Task 10: Register navigation action handlers
  - [x] Register `passport-prev` action
  - [x] Register `passport-next` action
  - [x] Update component state after navigation
  - [x] Update page indicator display

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**Page Structure Pattern:**

```javascript
// Page calculation constants
const STAMPS_PER_PAGE = 6;

/**
 * Calculates total passport pages based on stamps
 * Page 0: Profile page (always exists)
 * Pages 1+: Stamp pages (4-6 stamps each)
 */
_calculateTotalPages(stamps) {
  if (!stamps || stamps.length === 0) return 1; // Just profile page
  const stampPages = Math.ceil(stamps.length / STAMPS_PER_PAGE);
  return 1 + stampPages; // Profile page + stamp pages
}
```

**PassportComponent Page Navigation Extension:**

```javascript
class PassportComponent extends Component {
  constructor(props) {
    super(props);
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
   * Renders the complete passport with pages navigation
   */
  _renderPassport(user) {
    const stamps = stateManager.getState('stamps') || [];
    const totalPages = this._calculateTotalPages(stamps);
    const isOpen = this.passportState.isOpen;
    const currentPage = this.passportState.currentPage;
    
    this.passportState.totalPages = totalPages;
    
    return `
      <section class="passport-container" aria-label="הדרכון שלי">
        <article class="passport ${isOpen ? 'passport--open' : 'passport--closed'}"
                 tabindex="0"
                 role="region"
                 aria-label="${isOpen ? 'דרכון פתוח' : 'דרכון סגור'}">
          
          <!-- Passport Cover (Story 3.1/3.2) -->
          <div class="passport-cover">
            <!-- ... existing cover content ... -->
          </div>
          
          <!-- Passport Pages Container -->
          <div class="passport-pages" 
               data-current-page="${currentPage}"
               aria-live="polite">
            ${this._renderAllPages(user, stamps)}
          </div>
          
          ${isOpen ? this._renderNavigationArrows() : ''}
        </article>
        
        ${this._renderPassportSummary(stamps, user.points)}
        ${isOpen && totalPages > 1 ? this._renderPageIndicator() : ''}
      </section>
    `;
  }
  
  /**
   * Renders all passport pages
   */
  _renderAllPages(user, stamps) {
    const pages = [];
    
    // Page spread 0: Profile (right) + First stamps (left)
    pages.push(`
      <div class="passport-spread passport-spread--active" data-spread="0">
        <div class="passport-page passport-page--stamps">
          ${this._renderStampsPage(0, stamps)}
        </div>
        <div class="passport-page passport-page--profile">
          ${this._renderProfilePage(user)}
        </div>
      </div>
    `);
    
    // Additional stamp page spreads
    const stampPages = Math.ceil(stamps.length / STAMPS_PER_PAGE);
    for (let i = 1; i < stampPages; i++) {
      pages.push(`
        <div class="passport-spread" data-spread="${i}">
          <div class="passport-page passport-page--stamps">
            ${this._renderStampsPage(i * 2 - 1, stamps)}
          </div>
          <div class="passport-page passport-page--stamps">
            ${this._renderStampsPage(i * 2, stamps)}
          </div>
        </div>
      `);
    }
    
    return pages.join('');
  }
  
  /**
   * Renders a single stamps page
   * @param {number} pageIndex - Index within stamps (0-based)
   * @param {Array} stamps - All stamps
   */
  _renderStampsPage(pageIndex, stamps) {
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
    
    // Placeholder stamp grid - full implementation in Story 3.4
    return `
      <div class="stamps-page">
        <div class="stamps-grid">
          ${pageStamps.map((stamp, i) => `
            <div class="stamp-placeholder" data-stamp-id="${stamp.id}">
              <span class="stamp-placeholder__icon">🎫</span>
              <span class="stamp-placeholder__label">${stamp.type || 'חותמת'}</span>
            </div>
          `).join('')}
        </div>
        <p class="stamps-page__count">${pageStamps.length} חותמות בעמוד</p>
      </div>
    `;
  }
  
  /**
   * Renders navigation arrows
   */
  _renderNavigationArrows() {
    const { currentPage, totalPages } = this.passportState;
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage >= totalPages - 1;
    
    return `
      <div class="passport-nav">
        <button class="passport-nav__btn passport-nav__btn--prev ${isFirstPage ? 'passport-nav__btn--disabled' : ''}"
                data-action="passport-prev"
                aria-label="עמוד קודם"
                ${isFirstPage ? 'disabled' : ''}>
          <i class="ti ti-chevron-right" aria-hidden="true"></i>
          <span class="passport-nav__text">הקודם</span>
        </button>
        
        <button class="passport-nav__btn passport-nav__btn--next ${isLastPage ? 'passport-nav__btn--disabled' : ''}"
                data-action="passport-next"
                aria-label="עמוד הבא"
                ${isLastPage ? 'disabled' : ''}>
          <span class="passport-nav__text">הבא</span>
          <i class="ti ti-chevron-left" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }
  
  /**
   * Renders page indicator
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
   * Navigates to next page
   */
  async navigateNext() {
    const { currentPage, totalPages, isAnimating } = this.passportState;
    if (isAnimating || currentPage >= totalPages - 1) return;
    
    this.passportState.isAnimating = true;
    
    const pagesEl = this.element?.querySelector('.passport-pages');
    await animationService.animatePageFlipNext(pagesEl);
    
    this.passportState.currentPage++;
    this.passportState.isAnimating = false;
    this._updatePageDisplay();
  }
  
  /**
   * Navigates to previous page
   */
  async navigatePrev() {
    const { currentPage, isAnimating } = this.passportState;
    if (isAnimating || currentPage <= 0) return;
    
    this.passportState.isAnimating = true;
    
    const pagesEl = this.element?.querySelector('.passport-pages');
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
    this.element?.querySelectorAll('.passport-spread').forEach((spread, i) => {
      spread.classList.toggle('passport-spread--active', i === currentPage);
    });
    
    // Update page indicator
    const indicator = this.element?.querySelector('.page-indicator__text');
    if (indicator) {
      indicator.textContent = `עמוד ${currentPage + 1} מתוך ${totalPages}`;
    }
    
    // Update dots
    this.element?.querySelectorAll('.page-indicator__dot').forEach((dot, i) => {
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
    const prevBtn = this.element?.querySelector('.passport-nav__btn--prev');
    const nextBtn = this.element?.querySelector('.passport-nav__btn--next');
    
    if (prevBtn) {
      prevBtn.disabled = currentPage === 0;
      prevBtn.classList.toggle('passport-nav__btn--disabled', currentPage === 0);
    }
    
    if (nextBtn) {
      nextBtn.disabled = currentPage >= totalPages - 1;
      nextBtn.classList.toggle('passport-nav__btn--disabled', currentPage >= totalPages - 1);
    }
  }
  
  mount() {
    this.bindEvents();
    this._bindTouchEvents();
    this._bindKeyboardEvents();
    this.subscribe('currentUser', this._handleUserChange.bind(this));
    this.subscribe('stamps', this._handleStampsChange.bind(this));
    this._renderLayout();
  }
  
  /**
   * Binds touch/swipe events for mobile navigation
   */
  _bindTouchEvents() {
    const pagesEl = this.element?.querySelector('.passport-pages');
    if (!pagesEl) return;
    
    pagesEl.addEventListener('touchstart', this._handleTouchStart.bind(this), { passive: true });
    pagesEl.addEventListener('touchend', this._handleTouchEnd.bind(this), { passive: true });
  }
  
  _handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }
  
  _handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this._handleSwipe();
  }
  
  _handleSwipe() {
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
   * Binds keyboard navigation
   */
  _bindKeyboardEvents() {
    const passport = this.element?.querySelector('.passport');
    if (!passport) return;
    
    passport.addEventListener('keydown', this._handleKeydown.bind(this));
  }
  
  _handleKeydown(e) {
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
  
  unmount() {
    const pagesEl = this.element?.querySelector('.passport-pages');
    if (pagesEl) {
      pagesEl.removeEventListener('touchstart', this._handleTouchStart);
      pagesEl.removeEventListener('touchend', this._handleTouchEnd);
    }
    super.unmount();
  }
}
```

**AnimationService Page Flip Extension:**

```javascript
class AnimationService {
  // ... existing methods from Story 3.2 ...
  
  /**
   * Animates page flip to next page
   * @param {HTMLElement} pagesEl - The passport-pages container
   * @returns {Promise<void>}
   */
  async animatePageFlipNext(pagesEl) {
    if (!pagesEl) return;
    
    if (this.reducedMotion) {
      // Instant transition for reduced motion
      return;
    }
    
    pagesEl.classList.add('passport-pages--flipping-next');
    await this.waitForAnimation(pagesEl, 'pageFlipNext');
    pagesEl.classList.remove('passport-pages--flipping-next');
  }
  
  /**
   * Animates page flip to previous page
   * @param {HTMLElement} pagesEl - The passport-pages container
   * @returns {Promise<void>}
   */
  async animatePageFlipPrev(pagesEl) {
    if (!pagesEl) return;
    
    if (this.reducedMotion) {
      return;
    }
    
    pagesEl.classList.add('passport-pages--flipping-prev');
    await this.waitForAnimation(pagesEl, 'pageFlipPrev');
    pagesEl.classList.remove('passport-pages--flipping-prev');
  }
}
```

**Action Handlers:**

```javascript
// Register page navigation actions
app.registerAction('passport-next', async (target) => {
  const passportComponent = app.getCurrentComponent();
  if (passportComponent?.navigateNext) {
    await passportComponent.navigateNext();
  }
});

app.registerAction('passport-prev', async (target) => {
  const passportComponent = app.getCurrentComponent();
  if (passportComponent?.navigatePrev) {
    await passportComponent.navigatePrev();
  }
});
```

### CSS Styles (Add to style.css - Passport Pages section)

```css
/* =========================================================================
   PASSPORT PAGES - Navigation (Story 3.3)
   ========================================================================= */

/* Page Spread Container */
.passport-spread {
  position: absolute;
  inset: 0;
  display: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.passport-spread--active {
  display: flex;
  opacity: 1;
}

/* Page Flip Animations */
@keyframes pageFlipNext {
  0% {
    transform: perspective(1000px) rotateY(0deg);
    transform-origin: left center;
  }
  100% {
    transform: perspective(1000px) rotateY(-180deg);
    transform-origin: left center;
  }
}

@keyframes pageFlipPrev {
  0% {
    transform: perspective(1000px) rotateY(-180deg);
    transform-origin: right center;
  }
  100% {
    transform: perspective(1000px) rotateY(0deg);
    transform-origin: right center;
  }
}

.passport-pages--flipping-next {
  animation: pageFlipNext 600ms var(--ease-passport-flip) forwards;
}

.passport-pages--flipping-prev {
  animation: pageFlipPrev 600ms var(--ease-passport-flip) forwards;
}

/* =========================================================================
   STAMPS PAGE STRUCTURE
   ========================================================================= */

.stamps-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: var(--space-3);
}

.stamps-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  width: 100%;
  flex: 1;
}

/* Stamp Placeholder (full implementation in Story 3.4) */
.stamp-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.03);
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-md);
  padding: var(--space-2);
}

.stamp-placeholder__icon {
  font-size: 2rem;
  opacity: 0.5;
}

.stamp-placeholder__label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: var(--space-1);
}

.stamps-page__count {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin: var(--space-2) 0 0;
}

/* Empty Stamps Page */
.stamps-page--empty {
  justify-content: center;
  text-align: center;
  color: var(--text-muted);
}

.stamps-page__empty-text {
  font-size: var(--text-base);
  margin: 0 0 var(--space-2);
}

.stamps-page__empty-hint {
  font-size: var(--text-sm);
  opacity: 0.7;
  margin: 0;
}

/* =========================================================================
   PAPER TEXTURE & WATERMARK
   ========================================================================= */

.passport-page {
  position: relative;
  background: var(--passport-page-bg, linear-gradient(145deg, #FDF8F0 0%, #F5EEE0 100%));
  
  /* Paper texture overlay */
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.03'/%3E%3C/svg%3E"),
    linear-gradient(145deg, #FDF8F0 0%, #F5EEE0 100%);
}

/* PassportCard Watermark */
.passport-page::after {
  content: 'PassportCard';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-family: var(--font-primary);
  font-size: 2rem;
  font-weight: var(--font-bold);
  color: rgba(0, 0, 0, 0.05);
  pointer-events: none;
  white-space: nowrap;
  z-index: 0;
}

.passport-page > * {
  position: relative;
  z-index: 1;
}

/* =========================================================================
   NAVIGATION ARROWS
   ========================================================================= */

.passport-nav {
  position: absolute;
  top: 50%;
  left: -60px;
  right: -60px;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
}

.passport-nav__btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  min-width: 44px;
  min-height: 44px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.passport-nav__btn:hover:not(:disabled) {
  background: var(--surface-hover);
  box-shadow: var(--shadow-md);
}

.passport-nav__btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.passport-nav__btn--disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.passport-nav__btn .ti {
  font-size: 1.25rem;
}

/* Hide text on mobile, show on desktop */
.passport-nav__text {
  display: none;
}

@media (min-width: 768px) {
  .passport-nav__text {
    display: inline;
  }
  
  .passport-nav {
    left: -80px;
    right: -80px;
  }
}

/* =========================================================================
   PAGE INDICATOR
   ========================================================================= */

.page-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.page-indicator__text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.page-indicator__dots {
  display: flex;
  gap: var(--space-2);
}

.page-indicator__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-light);
  transition: all 0.2s ease;
}

.page-indicator__dot--active {
  background: var(--color-primary);
  transform: scale(1.2);
}

/* =========================================================================
   RESPONSIVE ADJUSTMENTS
   ========================================================================= */

@media (min-width: 600px) {
  .stamps-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }
  
  .passport-page::after {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .stamps-grid {
    gap: var(--space-5);
  }
  
  .passport-page::after {
    font-size: 3rem;
  }
  
  .page-indicator {
    margin-top: var(--space-5);
  }
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .passport-pages--flipping-next,
  .passport-pages--flipping-prev {
    animation: none;
  }
  
  .passport-spread {
    transition: none;
  }
  
  .page-indicator__dot {
    transition: none;
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--passport-page-bg` | `linear-gradient(145deg, #FDF8F0 0%, #F5EEE0 100%)` | Page background |
| `--ease-passport-flip` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | Page flip easing |
| Page flip duration | `600ms` | Navigation animation |
| Stamps per page | `6` (max) | Page overflow threshold |
| Swipe threshold | `50px` | Minimum swipe distance |
| Watermark opacity | `5%` (`0.05`) | PassportCard watermark |

### RTL Navigation Logic

| Gesture (RTL) | Direction | Action |
|---------------|-----------|--------|
| Swipe LEFT | → Visual right | Next page |
| Swipe RIGHT | ← Visual left | Previous page |
| Arrow LEFT key | → Visual right | Next page |
| Arrow RIGHT key | ← Visual left | Previous page |
| Click ← arrow | Previous page | Labeled "הקודם" |
| Click → arrow | Next page | Labeled "הבא" |

### Page Structure Overview

```
Spread 0 (Initial):
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   Stamps Page 0     │   Profile Page      │
│   (Left in RTL)     │   (Right in RTL)    │
│                     │                     │
└─────────────────────┴─────────────────────┘

Spread 1 (After navigation):
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   Stamps Page 2     │   Stamps Page 1     │
│   (Left in RTL)     │   (Right in RTL)    │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

### Integration Points

**Dependencies from Story 3.2:**
- PassportComponent with `isOpen` state
- `.passport-pages` container
- `.passport-page` base styling
- AnimationService with `waitForAnimation()`
- Paper texture CSS

**Extends:**
- PassportComponent with `currentPage`, `totalPages`, navigation methods
- AnimationService with `animatePageFlipNext()`, `animatePageFlipPrev()`

**Prepares for:**
- Story 3.4: Stamp Collection Display (replaces stamp placeholders)
- Story 3.5: Stamp Details Modal & Celebrations

### Testing Scenarios

1. **Page Display:**
   - Open passport → See profile page (right) + stamps page (left)
   - Profile shows correct user data
   - Stamps show placeholder grid

2. **Swipe Navigation (Mobile):**
   - Swipe left → Navigate to next page spread
   - Swipe right → Navigate to previous page spread
   - Animation plays for 600ms
   - Cannot swipe beyond first/last page

3. **Arrow Navigation (Desktop):**
   - Click "הבא" → Navigate to next page
   - Click "הקודם" → Navigate to previous page
   - Arrows disabled at boundaries

4. **Page Indicator:**
   - Shows "עמוד X מתוך Y"
   - Dots highlight current page
   - Updates on navigation

5. **Keyboard Navigation:**
   - Left arrow → Next page (RTL)
   - Right arrow → Previous page (RTL)
   - Only works when passport is open

6. **Paper Texture:**
   - Cream gradient visible
   - Watermark visible at 5% opacity
   - Paper grain texture subtle

7. **Reduced Motion:**
   - Animation skipped, instant page change
   - All functionality works without animation

8. **Performance:**
   - 60fps during page flip
   - No jank or stuttering
   - GPU-accelerated transforms

### Previous Story Patterns (From Story 3.2)

- PassportComponent `passportState` object pattern
- AnimationService async method pattern with `waitForAnimation()`
- CSS animation state classes (`--opening`, `--closing`)
- Keyboard event handling with `_handleKeydown()`
- Touch event binding pattern

### Project Context Quick Reference

**Naming Conventions:**
- CSS: BEM-kebab (`passport-spread--active`, `page-indicator__dot`)
- JS: camelCase methods (`navigateNext`, `_bindTouchEvents`)
- Data attributes: `data-action="passport-next"`, `data-spread="0"`

**State Management:**
- Component local state for `currentPage`, `isAnimating`
- Never directly mutate state objects

**Animation:**
- Always use AnimationService methods
- Check `reducedMotion` before animating
- Return Promise for async completion

### References

- [Source: docs/architecture.md#3.5-animation-architecture] - Animation patterns
- [Source: docs/architecture.md#4.8-animation-patterns] - CSS states
- [Source: docs/epics.md#story-33] - Acceptance criteria
- [Source: docs/project_context.md] - Implementation rules
- [Source: docs/sprint-artifacts/3-2-passport-opening-animation.md] - Previous patterns

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/epics.md (complete - Epic 3, Story 3.3)
- docs/project_context.md (complete)
- docs/sprint-artifacts/3-1-passport-cover-design.md
- docs/sprint-artifacts/3-2-passport-opening-animation.md

### Agent Model Used

Claude Opus 4.5 (Developer Agent - Amelia)

### Debug Log References

None - clean implementation

### Completion Notes List

1. **Task 1-6**: Implemented multi-page structure in PassportComponent
   - Added `_calculateTotalPages()`, `_renderAllPages()`, `_renderStampsPage()` methods
   - Added `_renderNavigationArrows()`, `_renderPageIndicator()`, `_renderPassportSummary()` methods
   - Added `navigateNext()`, `navigatePrev()`, `_updatePageDisplay()`, `_updateNavigationButtons()` methods
   - Added `passportState.totalPages`, `passportState.isAnimating` tracking
   - Added touch/swipe handlers for mobile navigation

2. **Task 7**: Added paper texture and watermark CSS
   - Cream gradient background (#FDF8F0 to #F5EEE0)
   - Paper grain SVG texture overlay
   - PassportCard watermark at 5% opacity, rotated -30deg

3. **Task 8**: Extended AnimationService
   - Added `animatePageFlipNext(pagesEl)` method
   - Added `animatePageFlipPrev(pagesEl)` method
   - Both use `waitForAnimationByName()` for proper completion tracking
   - Reduced motion fallback skips animation

4. **Task 9-10**: Added keyboard navigation and action handlers
   - Arrow keys (Left/Right) navigate pages when passport is open
   - Registered `passport-prev` and `passport-next` action handlers
   - RTL-aware navigation (Left = next, Right = prev)

### File List

Files modified:
- `script.js` - Extended PassportComponent (~250 lines added), extended AnimationService (~30 lines added), added action handlers (~14 lines added)
- `style.css` - Added page navigation styles (~250 lines added)

No new files created.

Dependencies from Story 3.2 (verified working):
- PassportComponent class with `passportState.isOpen`
- `.passport-pages` container HTML structure
- `.passport-page` base CSS styling
- AnimationService with `waitForAnimationByName()`
- Paper texture background CSS

Prepares for:
- Story 3.4: Stamp Collection Display (stamp grid replaces placeholders)
- Story 3.5: Stamp Details Modal & Celebrations

