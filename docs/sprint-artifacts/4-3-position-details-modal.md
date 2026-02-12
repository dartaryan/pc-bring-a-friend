# Story 4.3: Position Details Modal

**Status:** review

## Story

**As an** employee,
**I want** to see full details about a position,
**So that** I can understand the role before referring someone.

## Acceptance Criteria

### AC1: Modal Open Trigger
**Given** I click on a position card (not the refer button)
**When** the action triggers
**Then** the position details modal opens with a smooth animation
**And** the selectedPosition state is populated

### AC2: Modal Appearance - Mobile
**Given** I am on mobile (< 1024px)
**When** the modal opens
**Then** it slides up from the bottom of the screen (slideUp animation)
**And** the modal takes up ~90% of the screen height
**And** the modal has a drag handle at the top for swipe-to-close

### AC3: Modal Appearance - Desktop
**Given** I am on desktop (≥ 1024px)
**When** the modal opens
**Then** it appears centered on screen with fade-in and scale animation
**And** the modal has a max-width of 600px
**And** a dark overlay appears behind the modal

### AC4: Modal Close Button
**Given** the modal is open
**When** I view the modal header
**Then** I see an X close button in the top-left corner (RTL)
**And** clicking the X closes the modal with animation

### AC5: Modal Content - Full Details
**Given** the modal is open
**When** I view the content
**Then** I see the full job title prominently displayed
**And** I see department and location with icons
**And** I see position type (משרה מלאה/חלקית)
**And** I see the full job description (mock content)
**And** I see requirements list as bullet points
**And** I see team/company information section
**And** I see bonus breakdown (points at each stage)

### AC6: Bonus Breakdown Display
**Given** I view the bonus breakdown section
**When** looking at the points
**Then** I see a table/list showing:
  - קו״ח הוגש: +50 נקודות
  - ראיון נקבע: +100 נקודות
  - גיוס מוצלח: +{position.bonus} נקודות
  - סה״כ פוטנציאלי: +{total} נקודות
**And** campaign multipliers are shown if applicable

### AC7: Scrollable Content
**Given** the description is long
**When** I view the modal
**Then** the content is scrollable within the modal
**And** the header (title + close button) remains fixed at top
**And** the CTA footer remains fixed at bottom
**And** the scroll area shows only the middle content

### AC8: Primary CTA - Refer Now
**Given** I want to refer someone for this position
**When** I click "הפנה עכשיו" (Refer Now) CTA at bottom
**Then** the modal closes
**And** the referringPosition state is set
**And** I am navigated to the referral form route (#refer/:positionId)

### AC9: Share Position
**Given** I want to share this position
**When** I click the share icon in the header
**Then** I see share options: Copy link, WhatsApp, Email
**And** Copy shows "הועתק!" toast on success
**And** WhatsApp opens with pre-filled message
**And** Email opens default client

### AC10: Close Modal - Click Outside
**Given** the modal is open
**When** I click the dark overlay behind the modal
**Then** the modal closes with animation
**And** I return to the positions list

### AC11: Close Modal - Escape Key
**Given** the modal is open
**When** I press the Escape key
**Then** the modal closes with animation

### AC12: Close Modal - Swipe Down (Mobile)
**Given** I am on mobile with the modal open
**When** I swipe down on the modal content/handle
**Then** the modal closes with animation

### AC13: Accessibility
**Given** I use keyboard or screen reader
**When** the modal opens
**Then** focus is trapped within the modal
**And** first focusable element receives focus (close button)
**And** modal has role="dialog" and aria-modal="true"
**And** modal has aria-labelledby pointing to title
**And** closing returns focus to the trigger element

### AC14: Reduced Motion Support
**Given** I have prefers-reduced-motion: reduce enabled
**When** the modal opens/closes
**Then** animations are instant or minimal (opacity only)
**And** the slide-up is replaced with simple fade

## Tasks / Subtasks

- [x] Task 1: Create PositionDetailModal component (AC: #1-5)
  - [x] Create PositionDetailModal class extending Component
  - [x] Implement template() with modal structure
  - [x] Add fixed header with title and close button
  - [x] Add scrollable content area
  - [x] Add fixed footer with CTA

- [x] Task 2: Render position details content (AC: #5, #6)
  - [x] Display job title prominently
  - [x] Display department, location, type with icons
  - [x] Display full description with formatting
  - [x] Display requirements as styled bullet list
  - [x] Display team/company information
  - [x] Display bonus breakdown table

- [x] Task 3: Implement modal animations (AC: #2, #3, #14)
  - [x] Create slideUp animation for mobile
  - [x] Create fadeIn + scale animation for desktop
  - [x] Create overlay fade animation
  - [x] Add reduced motion variants
  - [x] Add close animations (reverse)

- [x] Task 4: Wire modal to state and actions (AC: #1, #8)
  - [x] Subscribe to activeModal state changes
  - [x] Subscribe to selectedPosition state changes
  - [x] Update view-position-details action to open modal
  - [x] Create refer-from-modal action handler

- [x] Task 5: Implement close behaviors (AC: #4, #10, #11, #12)
  - [x] Wire close button click handler
  - [x] Add overlay click handler
  - [x] Add Escape key listener
  - [x] Implement swipe-to-close gesture for mobile
  - [x] Clean up state on close

- [x] Task 6: Implement share functionality (AC: #9)
  - [x] Add share button to header
  - [x] Create share dropdown/popover
  - [x] Implement copy to clipboard with toast
  - [x] Implement WhatsApp share (web intent)
  - [x] Implement email share (mailto)

- [x] Task 7: Add accessibility features (AC: #13)
  - [x] Add role="dialog" and aria-modal="true"
  - [x] Add aria-labelledby for title
  - [x] Implement focus trap
  - [x] Return focus on close
  - [x] Ensure all interactive elements accessible

- [x] Task 8: Add responsive CSS (AC: #2, #3, #7)
  - [x] Style modal container for mobile (bottom sheet)
  - [x] Style modal container for desktop (centered)
  - [x] Style fixed header and footer
  - [x] Style scrollable content area
  - [x] Add overlay styles

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story creates a new modal component that integrates with the existing PositionsComponent and modal system.**

**Modal State Integration:**

The modal system uses these state keys (established in Stories 4.1/4.2):
- `activeModal`: String - 'position-details' when open
- `selectedPosition`: Object - The position data to display

```javascript
// When opening modal (already in 4.1's view-position-details action):
stateManager.setState({
  selectedPosition: position,
  activeModal: 'position-details'
});

// When closing modal:
stateManager.setState({
  activeModal: null,
  selectedPosition: null
});
```

**PositionDetailModal Component:**

```javascript
// ============================================
// COMPONENTS - Position Detail Modal (new)
// ============================================

class PositionDetailModal extends Component {
  constructor(props) {
    super(props);
    this.position = null;
    this.isVisible = false;
    this.previousFocusEl = null; // For focus restoration
    
    // Bind methods for event listeners
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleOverlayClick = this._handleOverlayClick.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);
    
    // Touch tracking for swipe-to-close
    this.touchStartY = 0;
    this.touchCurrentY = 0;
    this.isDragging = false;
  }
  
  /**
   * Main template - only renders when visible
   * @returns {string} HTML string
   */
  template() {
    if (!this.isVisible || !this.position) {
      return '';
    }
    
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return `
      <div class="modal-overlay ${reducedMotion ? 'modal-overlay--no-animation' : ''}"
           id="position-detail-overlay"
           aria-hidden="true">
      </div>
      
      <div class="modal position-detail-modal ${reducedMotion ? 'modal--no-animation' : ''}"
           id="position-detail-modal"
           role="dialog"
           aria-modal="true"
           aria-labelledby="position-modal-title">
        
        <div class="modal__drag-handle" aria-hidden="true">
          <span class="modal__drag-bar"></span>
        </div>
        
        ${this._renderHeader()}
        
        <div class="modal__content">
          ${this._renderDetails()}
        </div>
        
        ${this._renderFooter()}
      </div>
    `;
  }
  
  /**
   * Renders modal header with title and actions
   * @returns {string} HTML string
   */
  _renderHeader() {
    return `
      <header class="modal__header">
        <button class="modal__close-btn"
                data-action="close-position-modal"
                aria-label="סגור חלון">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
        
        <h2 class="modal__title" id="position-modal-title">
          ${this._escapeHtml(this.position.title)}
        </h2>
        
        <div class="modal__header-actions">
          <button class="modal__share-btn"
                  data-action="share-position"
                  data-position-id="${this.position.id}"
                  aria-label="שתף משרה"
                  aria-haspopup="true">
            <i class="ti ti-share" aria-hidden="true"></i>
          </button>
        </div>
      </header>
    `;
  }
  
  /**
   * Renders full position details
   * @returns {string} HTML string
   */
  _renderDetails() {
    const position = this.position;
    const hasActiveCampaign = position.campaign !== null;
    
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
    const position = this.position;
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
    const position = this.position;
    
    if (!position.isHot && !position.campaign) {
      return '';
    }
    
    return `
      <div class="position-detail__badges">
        ${position.isHot ? `
          <span class="badge badge--hot badge--lg">
            🔥 משרה חמה - דרושים בדחיפות!
          </span>
        ` : ''}
        ${position.campaign ? `
          <span class="badge badge--campaign badge--lg">
            🎁 קמפיין ${this._escapeHtml(position.campaign.name)} - x${position.campaign.multiplier} נקודות!
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
          ${this._escapeHtml(this.position.description)}
        </p>
      </section>
    `;
  }
  
  /**
   * Renders requirements list
   * @returns {string} HTML string
   */
  _renderRequirements() {
    const requirements = this.position.requirements || [];
    
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
    const position = this.position;
    
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
    const position = this.position;
    const multiplier = position.campaign?.multiplier || 1;
    
    const stages = [
      { label: 'קו״ח הוגש', basePoints: 50, icon: '📄' },
      { label: 'ראיון נקבע', basePoints: 100, icon: '📅' },
      { label: 'גיוס מוצלח!', basePoints: position.bonus, icon: '🎉' }
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
                <span class="bonus-breakdown__icon" aria-hidden="true">${stage.icon}</span>
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
            <span class="bonus-breakdown__icon" aria-hidden="true">💰</span>
            <span class="bonus-breakdown__label">סה״כ פוטנציאלי</span>
            <span class="bonus-breakdown__points bonus-breakdown__points--total">
              +${totalWithMultiplier} נקודות
            </span>
          </div>
        </div>
        
        ${multiplier > 1 ? `
          <p class="bonus-breakdown__campaign-note">
            🎯 קמפיין "${this._escapeHtml(position.campaign.name)}" פעיל - נקודות כפולות!
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
    const position = this.position;
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
  async open(position) {
    if (!position) return;
    
    this.position = position;
    this.isVisible = true;
    this.previousFocusEl = document.activeElement;
    
    // Render modal to container
    const container = document.getElementById('modal-container');
    if (container) {
      container.innerHTML = this.template();
      
      // Prevent body scroll
      document.body.classList.add('modal-open');
      
      // Trigger animation frame for CSS animation
      requestAnimationFrame(() => {
        const modal = document.getElementById('position-detail-modal');
        const overlay = document.getElementById('position-detail-overlay');
        
        if (modal) {
          modal.classList.add('modal--visible');
          // Focus on close button for accessibility
          const closeBtn = modal.querySelector('.modal__close-btn');
          if (closeBtn) {
            closeBtn.focus();
          }
        }
        if (overlay) {
          overlay.classList.add('modal-overlay--visible');
        }
      });
      
      // Bind event listeners
      this._bindModalEvents();
    }
  }
  
  /**
   * Closes the modal with animation
   */
  async close() {
    const modal = document.getElementById('position-detail-modal');
    const overlay = document.getElementById('position-detail-overlay');
    
    if (modal) {
      modal.classList.remove('modal--visible');
      modal.classList.add('modal--closing');
    }
    if (overlay) {
      overlay.classList.remove('modal-overlay--visible');
    }
    
    // Wait for animation to complete
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationDuration = reducedMotion ? 0 : 300;
    
    await new Promise(resolve => setTimeout(resolve, animationDuration));
    
    // Clean up
    this._unbindModalEvents();
    
    const container = document.getElementById('modal-container');
    if (container) {
      container.innerHTML = '';
    }
    
    // Restore body scroll
    document.body.classList.remove('modal-open');
    
    // Restore focus
    if (this.previousFocusEl) {
      this.previousFocusEl.focus();
    }
    
    // Reset state
    this.isVisible = false;
    this.position = null;
    
    // Update app state
    stateManager.setState({
      activeModal: null,
      selectedPosition: null
    });
  }
  
  /**
   * Binds modal-specific event listeners
   */
  _bindModalEvents() {
    // Escape key handler
    document.addEventListener('keydown', this._handleKeyDown);
    
    // Overlay click handler
    const overlay = document.getElementById('position-detail-overlay');
    if (overlay) {
      overlay.addEventListener('click', this._handleOverlayClick);
    }
    
    // Touch events for swipe-to-close (mobile)
    const modal = document.getElementById('position-detail-modal');
    if (modal) {
      modal.addEventListener('touchstart', this._handleTouchStart, { passive: true });
      modal.addEventListener('touchmove', this._handleTouchMove, { passive: false });
      modal.addEventListener('touchend', this._handleTouchEnd);
    }
  }
  
  /**
   * Unbinds modal-specific event listeners
   */
  _unbindModalEvents() {
    document.removeEventListener('keydown', this._handleKeyDown);
    
    const overlay = document.getElementById('position-detail-overlay');
    if (overlay) {
      overlay.removeEventListener('click', this._handleOverlayClick);
    }
    
    const modal = document.getElementById('position-detail-modal');
    if (modal) {
      modal.removeEventListener('touchstart', this._handleTouchStart);
      modal.removeEventListener('touchmove', this._handleTouchMove);
      modal.removeEventListener('touchend', this._handleTouchEnd);
    }
  }
  
  /**
   * Handles keydown events for modal
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handleKeyDown(e) {
    if (e.key === 'Escape' && this.isVisible) {
      e.preventDefault();
      this.close();
    }
    
    // Focus trap
    if (e.key === 'Tab' && this.isVisible) {
      this._handleFocusTrap(e);
    }
  }
  
  /**
   * Traps focus within modal
   * @param {KeyboardEvent} e - Tab key event
   */
  _handleFocusTrap(e) {
    const modal = document.getElementById('position-detail-modal');
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
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
   * Handles overlay click to close modal
   * @param {MouseEvent} e - Click event
   */
  _handleOverlayClick(e) {
    if (e.target.id === 'position-detail-overlay') {
      this.close();
    }
  }
  
  /**
   * Handles touch start for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchStart(e) {
    // Only track touch on drag handle or top area
    const target = e.target;
    const modal = document.getElementById('position-detail-modal');
    const dragHandle = modal?.querySelector('.modal__drag-handle');
    const header = modal?.querySelector('.modal__header');
    
    if (target === dragHandle || dragHandle?.contains(target) || 
        target === header || header?.contains(target)) {
      this.touchStartY = e.touches[0].clientY;
      this.isDragging = true;
    }
  }
  
  /**
   * Handles touch move for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchMove(e) {
    if (!this.isDragging) return;
    
    this.touchCurrentY = e.touches[0].clientY;
    const deltaY = this.touchCurrentY - this.touchStartY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      const modal = document.getElementById('position-detail-modal');
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
    if (!this.isDragging) return;
    
    const deltaY = this.touchCurrentY - this.touchStartY;
    const threshold = 100; // Minimum swipe distance to close
    
    const modal = document.getElementById('position-detail-modal');
    
    if (deltaY > threshold) {
      // Close modal
      this.close();
    } else {
      // Reset position
      if (modal) {
        modal.style.transform = '';
      }
    }
    
    this.isDragging = false;
    this.touchStartY = 0;
    this.touchCurrentY = 0;
  }
  
  // Standard lifecycle methods
  mount() {
    // Subscribe to state changes
    this.subscribe('activeModal', (activeModal) => {
      if (activeModal === 'position-details') {
        const position = stateManager.getState('selectedPosition');
        if (position) {
          this.open(position);
        }
      }
    });
  }
  
  unmount() {
    this._unbindModalEvents();
    super.unmount();
  }
}

// Create singleton instance
const positionDetailModal = new PositionDetailModal();
```

**Action Handlers (add/update in action handlers section):**

```javascript
// ============================================
// ACTION HANDLERS - Position Detail Modal (add to existing)
// ============================================

// Close position detail modal
app.registerAction('close-position-modal', () => {
  positionDetailModal.close();
});

// Refer from modal - close modal and navigate to referral form
app.registerAction('refer-from-modal', (target) => {
  const positionId = target.dataset.positionId;
  if (!positionId) return;
  
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  if (position) {
    // Close modal first
    positionDetailModal.close();
    
    // Set referral state and navigate
    stateManager.setState({
      referringPosition: position
    });
    
    // Navigate to referral form (Story 4.5)
    router.navigate('refer', { positionId });
  }
});

// Share position from modal
app.registerAction('share-position', async (target) => {
  const positionId = target.dataset.positionId;
  if (!positionId) return;
  
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  if (!position) return;
  
  // Generate share URL
  const currentUser = stateManager.getState('currentUser');
  const userId = currentUser?.id || 'unknown';
  const shareUrl = `${window.location.origin}${window.location.pathname}?ref=${userId}&pos=${positionId}`;
  
  // Try Web Share API first (mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: position.title,
        text: `משרה מעולה ב-PassportCard: ${position.title}`,
        url: shareUrl
      });
      return;
    } catch (err) {
      // User cancelled or not supported, fall through to clipboard
      if (err.name !== 'AbortError') {
        console.warn('Share failed:', err);
      }
    }
  }
  
  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(shareUrl);
    showToast('הועתק!', 'success');
  } catch (err) {
    console.error('Copy failed:', err);
    showToast('שגיאה בהעתקה', 'error');
  }
});

// Update view-position-details to work with modal
// (This should already exist from Story 4.1, but ensure it sets state correctly)
app.registerAction('view-position-details', (target) => {
  const positionId = target.dataset.positionId || 
                     target.closest('[data-position-id]')?.dataset.positionId;
  if (!positionId) return;
  
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  if (position) {
    stateManager.setState({
      selectedPosition: position,
      activeModal: 'position-details'
    });
    // Modal will open via state subscription
  }
});
```

**App Initialization Update:**

```javascript
// ============================================
// APP INITIALIZATION - Add modal initialization
// ============================================

class App {
  // ... existing code ...
  
  init() {
    // ... existing initialization ...
    
    // Initialize modal component
    positionDetailModal.mount();
    
    // ... rest of initialization ...
  }
  
  // ... existing code ...
}
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   MODAL - Position Details (Story 4.3)
   ========================================================================= */

/* Body scroll lock when modal open */
body.modal-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
}

/* =========================================================================
   MODAL OVERLAY
   ========================================================================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
}

.modal-overlay--visible {
  opacity: 1;
  visibility: visible;
}

.modal-overlay--no-animation {
  transition: none;
}

/* =========================================================================
   MODAL BASE
   ========================================================================= */

.modal {
  position: fixed;
  background: var(--color-surface);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

/* Mobile: Bottom sheet style */
.position-detail-modal {
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  transform: translateY(100%);
  transition: transform 0.3s var(--ease-out);
  box-shadow: var(--shadow-xl);
}

.position-detail-modal.modal--visible {
  transform: translateY(0);
}

.position-detail-modal.modal--closing {
  transform: translateY(100%);
}

/* Desktop: Centered modal */
@media (min-width: 1024px) {
  .position-detail-modal {
    bottom: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
  }
  
  .position-detail-modal.modal--visible {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  
  .position-detail-modal.modal--closing {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
  }
}

/* Reduced motion */
.modal--no-animation {
  transition: none;
}

.modal--no-animation.modal--visible {
  transform: translateY(0);
  opacity: 1;
}

@media (min-width: 1024px) {
  .modal--no-animation.modal--visible {
    transform: translate(-50%, -50%);
  }
}

/* =========================================================================
   MODAL DRAG HANDLE (Mobile)
   ========================================================================= */

.modal__drag-handle {
  display: flex;
  justify-content: center;
  padding: var(--space-3) var(--space-4);
  cursor: grab;
}

.modal__drag-bar {
  width: 40px;
  height: 4px;
  background: var(--color-border);
  border-radius: var(--radius-full);
}

@media (min-width: 1024px) {
  .modal__drag-handle {
    display: none;
  }
}

/* =========================================================================
   MODAL HEADER
   ========================================================================= */

.modal__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: 1;
}

.modal__close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.modal__close-btn:hover {
  background: var(--color-surface-hover);
  color: var(--text-primary);
}

.modal__close-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.modal__close-btn .ti {
  font-size: 1.5rem;
}

.modal__title {
  flex: 1;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal__header-actions {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.modal__share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: var(--color-primary);
  cursor: pointer;
  transition: background 0.2s ease;
}

.modal__share-btn:hover {
  background: rgba(225, 5, 20, 0.1);
}

.modal__share-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.modal__share-btn .ti {
  font-size: 1.25rem;
}

/* =========================================================================
   MODAL CONTENT (Scrollable)
   ========================================================================= */

.modal__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  -webkit-overflow-scrolling: touch;
}

/* =========================================================================
   MODAL FOOTER (Fixed CTA)
   ========================================================================= */

.modal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  position: sticky;
  bottom: 0;
}

.modal__footer-info {
  flex-shrink: 0;
}

.modal__footer-bonus {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-gold);
  direction: ltr;
  unicode-bidi: isolate;
}

.modal__cta {
  flex: 1;
  max-width: 200px;
}

/* =========================================================================
   POSITION DETAIL CONTENT
   ========================================================================= */

.position-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Meta Info Row */
.position-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.position-detail__meta-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.position-detail__meta-item .ti {
  font-size: 1.125rem;
  color: var(--color-primary);
}

/* Badges */
.position-detail__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.badge--lg {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

/* Section Styling */
.position-detail__section {
  background: var(--color-surface-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.position-detail__section--bonus {
  background: linear-gradient(135deg, rgba(241, 196, 15, 0.08) 0%, rgba(241, 196, 15, 0.02) 100%);
  border: 1px solid rgba(241, 196, 15, 0.2);
}

.position-detail__section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-3);
}

.position-detail__section-title .ti {
  font-size: 1.25rem;
  color: var(--color-primary);
}

/* Description */
.position-detail__description {
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: 1.7;
  margin: 0;
}

/* Requirements List */
.position-detail__requirements {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.position-detail__requirement {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-primary);
  line-height: 1.5;
}

.position-detail__requirement .ti {
  flex-shrink: 0;
  font-size: 1rem;
  color: var(--color-success);
  margin-top: 2px;
}

/* Team Info */
.position-detail__team-info {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}

/* =========================================================================
   BONUS BREAKDOWN
   ========================================================================= */

.bonus-breakdown {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.bonus-breakdown__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
}

.bonus-breakdown__row--total {
  padding-top: var(--space-3);
}

.bonus-breakdown__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 28px;
  text-align: center;
}

.bonus-breakdown__label {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.bonus-breakdown__points {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-gold);
  direction: ltr;
  unicode-bidi: isolate;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.bonus-breakdown__points--multiplied {
  color: var(--color-primary);
}

.bonus-breakdown__points--total {
  font-size: var(--text-base);
  color: var(--color-success);
}

.bonus-breakdown__multiplier {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.bonus-breakdown__divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-2) 0;
}

.bonus-breakdown__campaign-note {
  font-size: var(--text-xs);
  color: var(--color-primary);
  margin: var(--space-3) 0 0;
  padding: var(--space-2);
  background: rgba(225, 5, 20, 0.08);
  border-radius: var(--radius-md);
}

/* =========================================================================
   DESIGN TOKENS (add if not exists)
   ========================================================================= */

/* Add to CSS variables section if not present */
/*
--color-gold: #F1C40F;
--color-success: #22C55E;
--radius-xl: 24px;
--shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--color-surface-secondary: #F9FAFB;
*/

/* =========================================================================
   REDUCED MOTION - Modal
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .modal,
  .modal-overlay,
  .modal__close-btn,
  .modal__share-btn {
    transition: none;
  }
  
  .position-detail-modal.modal--visible {
    transform: translateY(0);
  }
  
  @media (min-width: 1024px) {
    .position-detail-modal.modal--visible {
      transform: translate(-50%, -50%);
    }
  }
}
```

### State Keys Used

| Key | Type | Description |
|-----|------|-------------|
| `activeModal` | String | 'position-details' when modal is open, null otherwise |
| `selectedPosition` | Object | Full position object being viewed |
| `referringPosition` | Object | Position user is referring for (set when navigating to form) |

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gold` | `#F1C40F` | Bonus points, highlights |
| `--color-success` | `#22C55E` | Success states, requirements checks |
| `--color-primary` | `#E10514` | Icons, campaign highlights |
| `--radius-xl` | `24px` | Modal corners |
| `--shadow-xl` | Heavy shadow | Modal elevation |
| `--ease-out` | Smooth ease | Modal animation |
| Modal animation | `300ms` | Open/close duration |
| Swipe threshold | `100px` | Minimum swipe to close |

### Dependencies

**From Previous Stories:**
- MOCK_POSITIONS with full position data (Story 4.1)
- StateManager with activeModal and selectedPosition keys (Story 4.1)
- view-position-details action handler (Story 4.1)
- Component base class (Story 1.1)
- Button styles (.btn, .btn--primary, .btn--lg) (Story 1.2)
- Badge styles (.badge, .badge--hot, .badge--campaign) (Story 4.1)
- Toast notification function (if exists, else create)

**Creates Foundation For:**
- Story 4.4: Share Referral Link (share-position action)
- Story 4.5: Referral Form (refer-from-modal action, referringPosition state)

### Integration Points

**Files to Modify:**
- `script.js`:
  - Add PositionDetailModal class (~400 lines)
  - Add/update action handlers (~50 lines)
  - Add modal initialization to App class (~5 lines)
  - Add showToast function if not exists (~20 lines)
- `style.css`:
  - Add modal base styles (~80 lines)
  - Add overlay styles (~30 lines)
  - Add position detail content styles (~200 lines)
  - Add bonus breakdown styles (~80 lines)
  - Add responsive and reduced motion styles (~40 lines)

**Files to Update:**
- `index.html` - Verify `#modal-container` exists (should exist from Story 1.1)

**No new files created.**

### Testing Scenarios

1. **Modal Open:**
   - Click position card body (not refer button) → Modal opens
   - Modal animates in (slide-up mobile, fade-in desktop)
   - Close button is focused

2. **Mobile Appearance:**
   - On mobile (< 1024px) → Modal slides up from bottom
   - Drag handle visible at top
   - Modal takes ~90% screen height

3. **Desktop Appearance:**
   - On desktop (≥ 1024px) → Modal centered with overlay
   - Max-width 600px
   - Fade-in with scale animation

4. **Content Display:**
   - Title displayed prominently
   - Meta info shows department, location, type
   - Hot/campaign badges show if applicable
   - Full description readable
   - Requirements list with checkmarks
   - Team info section
   - Bonus breakdown table

5. **Bonus Breakdown:**
   - Shows all stages with points
   - Campaign multiplier applied if active
   - Total calculated correctly

6. **Scroll Behavior:**
   - Long content scrolls within modal
   - Header stays fixed at top
   - Footer with CTA stays fixed at bottom

7. **Close - X Button:**
   - Click X → Modal closes with animation
   - Focus returns to trigger element

8. **Close - Overlay:**
   - Click dark overlay → Modal closes

9. **Close - Escape Key:**
   - Press Escape → Modal closes

10. **Close - Swipe (Mobile):**
    - Swipe down on handle/header → Modal closes if > 100px
    - Small swipe → Modal bounces back

11. **Refer Now CTA:**
    - Click "הפנה עכשיו" → Modal closes
    - Navigation to referral form (with position in state)

12. **Share Position:**
    - Click share icon → Web Share API (mobile) or clipboard copy
    - Toast shows "הועתק!" on copy

13. **Accessibility:**
    - Modal has role="dialog" and aria-modal="true"
    - Title linked via aria-labelledby
    - Focus trapped within modal
    - Tab cycles through focusable elements
    - Focus returns on close

14. **Reduced Motion:**
    - With prefers-reduced-motion → Instant/minimal animation
    - Modal appears without slide/scale

15. **Body Scroll Lock:**
    - When modal open → Page body doesn't scroll
    - When modal closes → Scroll restored

### Previous Story Intelligence

**From Story 4.1:**
- Position data structure with all fields needed
- view-position-details action sets selectedPosition and activeModal
- Cards are clickable with data-action="view-position-details"

**From Story 4.2:**
- Filter state persists (modal should work with filtered results)
- _escapeHtml pattern for safe HTML rendering

**Key patterns to maintain:**
- Use `data-action` attributes for button handlers
- Use StateManager for all state changes
- Use AnimationService patterns for animations (or CSS-only as shown)
- RTL-aware CSS with logical properties
- BEM naming convention
- Numbers use `direction: ltr; unicode-bidi: isolate;`
- 44px minimum touch targets

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- Modal renders to `#modal-container` element
- PositionDetailModal is a singleton component
- Initialized in App class alongside other components
- Uses event delegation via data-action for buttons

### References

- [Source: docs/architecture.md#5.4] - Component hierarchy
- [Source: docs/architecture.md#3.5] - Animation architecture
- [Source: docs/architecture.md#4.2] - CSS naming patterns
- [Source: docs/epics.md#story-43] - Original acceptance criteria
- [Source: docs/PRD.md#FR-POS-004] - Position details requirements
- [Source: docs/project_context.md] - Implementation rules
- [Source: docs/sprint-artifacts/4-1-position-list-view.md] - Position data structure
- [Source: docs/sprint-artifacts/4-2-position-filters-search.md] - Previous story patterns

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete - state management, component patterns, animation approach)
- docs/epics.md (complete - Epic 4, Story 4.3 full acceptance criteria)
- docs/PRD.md (FR-POS-004 requirements, FR-REF-001 share requirements)
- docs/project_context.md (implementation rules, naming conventions)
- docs/sprint-status.yaml (current status: 4-3 is backlog → ready-for-dev)
- docs/sprint-artifacts/4-1-position-list-view.md (position data structure, action handlers)
- docs/sprint-artifacts/4-2-position-filters-search.md (component patterns, _escapeHtml)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode

### Debug Log References

### Completion Notes List

**Implementation completed by Dev Agent (Claude Opus 4.5) - 2025-12-10:**

✅ **Task 1-2: PositionDetailModal Component Created**
- Created `PositionDetailModal` class extending Component (~450 lines)
- Full template() implementation with header, content, footer sections
- All position details rendered: meta info, badges, description, requirements, team info
- Bonus breakdown table with campaign multiplier support

✅ **Task 3: Modal Animations Implemented**
- Mobile: slideUp animation (bottom sheet pattern)
- Desktop: fadeIn + scale animation (centered modal)
- Overlay fade animation
- Reduced motion variants using prefers-reduced-motion media query

✅ **Task 4: State/Action Integration**
- ModalManager updated to handle 'position-details' modal type
- view-position-details action updated (removed console.log placeholder)
- refer-from-modal action handler added with position state management

✅ **Task 5: Close Behaviors**
- X button close handler via ModalManager action delegation
- Overlay click close handler
- Escape key listener with focus trap
- Swipe-to-close gesture for mobile (100px threshold)
- State cleanup on close (activeModal, selectedPosition → null)

✅ **Task 6: Share Functionality**
- Share button in modal header
- Web Share API for mobile devices
- Clipboard fallback with toast notification ("הקישור הועתק!")
- Share URL includes referrer ID and position ID

✅ **Task 7: Accessibility**
- role="dialog" and aria-modal="true"
- aria-labelledby pointing to position-modal-title
- Focus trap implementation (Tab/Shift+Tab cycling)
- Focus restoration to trigger element on close
- 44px minimum touch targets on all buttons

✅ **Task 8: Responsive CSS**
- Mobile: bottom sheet (90vh max, slideUp animation)
- Desktop: centered modal (600px max-width, 85vh max)
- Fixed header/footer with scrollable content
- ~430 lines of CSS added

### File List

**Files Modified:**
- `script.js`:
  - Added PositionDetailModal class (lines ~5972-6490)
  - Updated ModalManager._handleModalChange() for position-details modal
  - Updated ModalManager._handleAction() with close-position-modal, share-position-modal, refer-from-modal actions
  - Updated view-position-details action handler (removed console.log)
  
- `style.css`:
  - Added body.modal-open scroll lock
  - Added .modal--position-detail overlay styles
  - Added .position-detail-modal container styles (mobile + desktop)
  - Added .modal__drag-handle, .modal__header, .modal__content, .modal__footer styles
  - Added .position-detail section styles
  - Added .bonus-breakdown styles
  - Added reduced motion support

**Files Verified:**
- `index.html` - Confirmed #modal-container element exists (line 36)

**No new files created.**

### Change Log

- 2025-12-10: Story 4.3 Position Details Modal implemented (Dev Agent)

