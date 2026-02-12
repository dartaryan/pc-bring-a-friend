# Story 3.5: Stamp Details Modal & Celebrations

**Status:** review

## Story

**As an** employee,
**I want** to tap a stamp for details and see celebrations when I earn achievements,
**So that** I can learn more about each achievement and feel rewarded for my contributions.

## Acceptance Criteria

### AC1: Stamp Detail Modal Trigger
**Given** I see a stamp in my passport
**When** I tap/click on it
**Then** a modal slides up (mobile) or appears centered (desktop)
**And** the modal shows the stamp enlarged

### AC2: Stamp Detail Modal Content
**Given** the stamp detail modal is open
**When** I view the content
**Then** I see the stamp type and full title
**And** I see points earned for this stamp
**And** I see the date earned
**And** I see the related referral/candidate name (if applicable)
**And** I see a brief description of what this achievement represents

### AC3: Modal Close Interactions
**Given** I want to close the modal
**When** I tap the X button OR outside the modal OR swipe down
**Then** the modal closes with a smooth animation
**And** I return to the passport view

### AC4: Hired Stamp Celebration
**Given** I just earned a significant achievement
**When** the passport page loads with a new "גיוס מוצלח!" stamp
**Then** confetti celebration fires automatically
**And** confetti uses brand colors (#E10514, #F1C40F, #22C55E, #0984E3)
**And** the effect lasts ~3 seconds
**And** I can dismiss by tapping anywhere

### AC5: First Referral Special Celebration
**Given** I earned my first referral stamp
**When** the celebration triggers
**Then** confetti fires with hearts/special particles
**And** a congratulatory message appears briefly

### AC6: Reduced Motion Accessibility
**Given** I have `prefers-reduced-motion: reduce`
**When** a celebration would trigger
**Then** the confetti/effects are skipped
**And** I see a static success message instead

### AC7: Graceful Degradation
**Given** canvas-confetti library is not loaded
**When** a celebration triggers
**Then** the app gracefully degrades
**And** a CSS-based celebration or toast appears instead

### AC8: Modal Accessibility
**Given** I use a keyboard or screen reader
**When** the modal opens
**Then** focus is trapped within the modal
**And** I can close with Escape key
**And** ARIA attributes are properly set
**And** screen reader announces modal content

## Tasks / Subtasks

- [x] Task 1: Create StampDetailModal component (AC: #1, #2)
  - [x] Create StampDetailModal class extending Component base
  - [x] Implement modal template with enlarged stamp view
  - [x] Show stamp type, points, date, candidate name, description
  - [x] Add descriptions for each stamp type in STAMP_TYPES

- [x] Task 2: Add modal open/close logic (AC: #1, #3)
  - [x] Update `view-stamp-details` action to open modal
  - [x] Implement `close-stamp-modal` action
  - [x] Handle click outside modal to close
  - [x] Handle swipe down gesture on mobile

- [x] Task 3: Style stamp detail modal (AC: #1, #2)
  - [x] Style modal overlay with backdrop blur
  - [x] Style modal content container
  - [x] Create enlarged stamp display
  - [x] Style stamp details section
  - [x] Mobile: slide-up animation
  - [x] Desktop: centered fade-in

- [x] Task 4: Implement confetti celebrations (AC: #4, #5)
  - [x] Create `celebrateHiredStamp()` method in AnimationService
  - [x] Create `celebrateFirstReferral()` method with hearts
  - [x] Use brand colors for confetti particles
  - [x] Set celebration duration to ~3 seconds

- [x] Task 5: Wire celebration triggers (AC: #4, #5)
  - [x] Check for new 'hired' stamps on passport mount
  - [x] Check for new 'first' stamps on passport mount
  - [x] Trigger appropriate celebration
  - [x] Show congratulatory message overlay

- [x] Task 6: Add graceful degradation (AC: #7)
  - [x] Check if confetti library is available
  - [x] Create CSS-based fallback celebration
  - [x] Show toast message as alternative

- [x] Task 7: Implement reduced motion support (AC: #6)
  - [x] Skip confetti when reduced motion preferred
  - [x] Show static success toast instead
  - [x] Modal transitions reduced/skipped

- [x] Task 8: Add modal accessibility (AC: #8)
  - [x] Add `role="dialog"` and `aria-modal="true"`
  - [x] Add `aria-labelledby` and `aria-describedby`
  - [x] Trap focus within modal
  - [x] Handle Escape key to close
  - [x] Return focus to trigger element on close

- [x] Task 9: Add stamp type descriptions
  - [x] Add `description` field to each STAMP_TYPES entry
  - [x] Hebrew descriptions explaining each achievement
  - [x] Display in modal content

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**STAMP_TYPES Update - Add Descriptions:**

```javascript
// ============================================
// CONSTANTS - Stamp Types (update existing)
// ============================================

const STAMP_TYPES = {
  submitted: {
    id: 'submitted',
    label: 'קו״ח הוגש',
    labelEn: 'Resume Submitted',
    icon: 'file-text',
    emoji: '📄',
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
    emoji: '📅',
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
    emoji: '✓',
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
    emoji: '🏅',
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
    emoji: '🏆',
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
    emoji: '⚡',
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
    emoji: '🔥',
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
    emoji: '💖',
    color: '#FD79A8',
    shape: 'heart',
    points: 100,
    description: 'ההפניה הראשונה שלך! תודה שאתה משתתף בתוכנית ההפניות!'
  }
};
```

**StampDetailModal Component:**

```javascript
// ============================================
// COMPONENTS - Stamp Detail Modal (new component)
// ============================================

class StampDetailModal extends Component {
  constructor(props) {
    super(props);
    this.stamp = null;
    this.previousActiveElement = null;
  }
  
  template() {
    const stamp = this.stamp;
    if (!stamp) return '';
    
    const config = STAMP_TYPES[stamp.type] || STAMP_TYPES.submitted;
    const formattedDate = this._formatStampDate(stamp.earnedDate);
    
    return `
      <div class="modal-overlay modal--stamp-detail" 
           data-action="close-stamp-modal"
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
              ${config.emoji} ${config.label}
            </h2>
            
            <div class="stamp-modal__points">
              <span class="stamp-modal__points-value">+${config.points}</span>
              <span class="stamp-modal__points-label">נקודות</span>
            </div>
            
            <p id="stamp-modal-desc" class="stamp-modal__description">
              ${config.description}
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
    this.stamp = stamp;
    this.previousActiveElement = document.activeElement;
    
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    container.innerHTML = this.render();
    this.element = container.querySelector('.modal--stamp-detail');
    
    // Animate in
    requestAnimationFrame(() => {
      this.element?.classList.add('modal--visible');
    });
    
    // Trap focus
    this._trapFocus();
    
    // Handle Escape key
    this._handleKeydown = this._handleKeydown.bind(this);
    document.addEventListener('keydown', this._handleKeydown);
    
    this.mount();
  }
  
  /**
   * Closes the modal
   */
  close() {
    if (!this.element) return;
    
    this.element.classList.remove('modal--visible');
    this.element.classList.add('modal--closing');
    
    // Wait for animation
    setTimeout(() => {
      const container = document.getElementById('modal-container');
      if (container) {
        container.innerHTML = '';
      }
      
      // Return focus
      if (this.previousActiveElement) {
        this.previousActiveElement.focus();
      }
      
      // Clear state
      stateManager.setState({ 
        selectedStamp: null,
        activeModal: null 
      });
    }, 300);
    
    // Remove keydown listener
    document.removeEventListener('keydown', this._handleKeydown);
    
    this.unmount();
  }
  
  /**
   * Handles keydown for Escape to close
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
    const focusableElements = this.element?.querySelectorAll(
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
    const focusableElements = this.element?.querySelectorAll(
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
  
  mount() {
    // Handle swipe down on mobile
    this._setupSwipeToClose();
  }
  
  /**
   * Sets up swipe-to-close gesture
   */
  _setupSwipeToClose() {
    const content = this.element?.querySelector('.modal-content');
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
  
  unmount() {
    super.unmount();
  }
}

// Create singleton instance
const stampDetailModal = new StampDetailModal();
```

**AnimationService - Celebration Methods:**

```javascript
// ============================================
// SERVICES - Animation (extend existing)
// ============================================

class AnimationService {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Listen for reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });
  }
  
  // ... existing methods from Story 3.2, 3.3, 3.4 ...
  
  /**
   * Checks if confetti library is available
   * @returns {boolean}
   */
  _hasConfetti() {
    return typeof confetti !== 'undefined';
  }
  
  /**
   * Fires celebration confetti for hired stamp
   * Uses PassportCard brand colors
   */
  celebrateHiredStamp() {
    if (this.reducedMotion) {
      this._showStaticCelebration('מזל טוב! גיוס מוצלח! 🎉');
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
      confetti.reset && confetti.reset();
    }, 3000);
  }
  
  /**
   * Fires celebration for first referral stamp
   * Uses hearts and special pink particles
   */
  celebrateFirstReferral() {
    if (this.reducedMotion) {
      this._showStaticCelebration('ברכות על ההפניה הראשונה! 💖');
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
    this._showCelebrationMessage('ברכות על ההפניה הראשונה! 💖');
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      confetti.reset && confetti.reset();
    }, 3000);
  }
  
  /**
   * Generic celebration for other achievements
   * @param {string} stampType - Type of stamp earned
   */
  celebrateAchievement(stampType) {
    if (this.reducedMotion) {
      const config = STAMP_TYPES[stampType];
      const message = config ? `${config.emoji} ${config.label}!` : 'הישג חדש! 🎉';
      this._showStaticCelebration(message);
      return;
    }
    
    if (!this._hasConfetti()) {
      this._showFallbackCelebration(stampType);
      return;
    }
    
    // Get stamp color for themed celebration
    const config = STAMP_TYPES[stampType];
    const stampColor = config?.color || '#E10514';
    
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: [stampColor, '#F1C40F', '#ffffff']
    });
    
    setTimeout(() => {
      confetti.reset && confetti.reset();
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
    const message = config.emoji ? 
      `${config.emoji} ${config.label || 'הישג חדש'}!` : 
      'הישג חדש! 🎉';
    
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
    toast.innerHTML = `<span class="toast__message">${message}</span>`;
    
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
      <span class="toast__sparkle" aria-hidden="true">✨</span>
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
}
```

**PassportComponent - Celebration Triggers:**

```javascript
// ============================================
// COMPONENTS - Passport (extend from Story 3.4)
// ============================================

class PassportComponent extends Component {
  // ... existing code from Stories 3.1-3.4 ...
  
  mount() {
    // ... existing mount code ...
    
    // Check for new stamps and trigger celebrations
    this._checkForNewStampCelebrations();
    
    // Trigger stamp slam animations for new stamps
    this._animateNewStamps();
  }
  
  /**
   * Checks for newly earned stamps and triggers appropriate celebrations
   */
  _checkForNewStampCelebrations() {
    const stamps = stateManager.getState('stamps') || [];
    const newStamps = stamps.filter(s => s.isNew);
    
    if (newStamps.length === 0) return;
    
    // Priority: hired > first > others
    const hiredStamp = newStamps.find(s => s.type === 'hired');
    const firstStamp = newStamps.find(s => s.type === 'first');
    
    // Delay celebration to allow page to render
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
  
  // ... rest of existing PassportComponent code ...
}
```

**Action Handlers Update:**

```javascript
// ============================================
// ACTION HANDLERS (update existing, add new)
// ============================================

// Update existing view-stamp-details action
app.registerAction('view-stamp-details', (target) => {
  const stampId = target.dataset.stampId;
  if (!stampId) return;
  
  // Get stamp data
  const stamps = stateManager.getState('stamps') || [];
  const stamp = stamps.find(s => s.id === stampId);
  
  if (stamp) {
    // Store selected stamp in state
    stateManager.setState({
      selectedStamp: stamp,
      activeModal: 'stamp-details'
    });
    
    // Open modal
    stampDetailModal.open(stamp);
  }
});

// Add close action
app.registerAction('close-stamp-modal', () => {
  stampDetailModal.close();
});

// Handle celebration dismiss (tap anywhere)
app.registerAction('dismiss-celebration', () => {
  if (typeof confetti !== 'undefined' && confetti.reset) {
    confetti.reset();
  }
  
  // Remove any celebration messages
  const messages = document.querySelectorAll('.celebration-message');
  messages.forEach(msg => msg.remove());
});
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   STAMP DETAIL MODAL (Story 3.5)
   ========================================================================= */

/* Modal Overlay */
.modal--stamp-detail {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: var(--z-modal);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.modal--stamp-detail.modal--visible {
  opacity: 1;
  visibility: visible;
}

.modal--stamp-detail.modal--closing {
  opacity: 0;
}

/* Modal Content - Mobile */
.stamp-modal {
  background: var(--color-surface);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  max-height: 85vh;
  width: 100%;
  max-width: 500px;
  padding: var(--space-6);
  padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
  transform: translateY(100%);
  transition: transform 0.3s var(--ease-out);
  overflow-y: auto;
}

.modal--visible .stamp-modal {
  transform: translateY(0);
}

.modal--closing .stamp-modal {
  transform: translateY(100%);
}

/* Desktop: Centered Modal */
@media (min-width: 1024px) {
  .modal--stamp-detail {
    align-items: center;
  }
  
  .stamp-modal {
    border-radius: var(--radius-xl);
    transform: scale(0.95) translateY(20px);
    opacity: 0;
    max-height: 80vh;
  }
  
  .modal--visible .stamp-modal {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  
  .modal--closing .stamp-modal {
    transform: scale(0.95) translateY(20px);
    opacity: 0;
  }
}

/* Close Button */
.stamp-modal .modal-close {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-surface-secondary);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease;
}

.stamp-modal .modal-close:hover {
  background: var(--color-surface-hover);
  color: var(--text-primary);
}

.stamp-modal .modal-close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Stamp Display */
.stamp-modal__stamp {
  display: flex;
  justify-content: center;
  padding: var(--space-8) 0;
}

/* Enlarged Stamp */
.stamp--large .stamp__shape {
  width: 120px;
  height: 120px;
}

.stamp--large .stamp__icon {
  font-size: 2.5rem;
}

.stamp--large .stamp__label {
  font-size: var(--text-sm);
}

/* Modal Details */
.stamp-modal__details {
  text-align: center;
}

.stamp-modal__title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-4);
}

.stamp-modal__points {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-3) var(--space-6);
  background: linear-gradient(135deg, #F1C40F 0%, #F39C12 100%);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
}

.stamp-modal__points-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: #5D4E37;
  direction: ltr;
  unicode-bidi: isolate;
}

.stamp-modal__points-label {
  font-size: var(--text-sm);
  color: #5D4E37;
  opacity: 0.8;
}

.stamp-modal__description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--space-6);
  padding: 0 var(--space-4);
}

/* Meta Information */
.stamp-modal__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--color-surface-secondary);
  border-radius: var(--radius-md);
}

.stamp-modal__meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.stamp-modal__meta-item .ti {
  color: var(--color-primary);
}

/* =========================================================================
   CELEBRATION MESSAGE OVERLAY
   ========================================================================= */

.celebration-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  z-index: calc(var(--z-modal) + 10);
  pointer-events: none;
  opacity: 0;
  transition: transform 0.5s var(--ease-bounce), opacity 0.3s ease;
}

.celebration-message--visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.celebration-message__text {
  display: block;
  padding: var(--space-6) var(--space-8);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(30, 30, 30, 0.95) 100%);
  color: white;
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  text-align: center;
  border-radius: var(--radius-xl);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* =========================================================================
   CELEBRATION TOAST
   ========================================================================= */

.toast--celebration {
  --celebration-color: #00B894;
  
  background: linear-gradient(135deg, 
    var(--celebration-color) 0%, 
    color-mix(in srgb, var(--celebration-color) 80%, black) 100%
  );
  color: white;
  animation: toastCelebration 0.5s var(--ease-bounce);
}

.toast--celebration .toast__sparkle {
  margin-inline-start: var(--space-2);
  animation: sparkle 1s ease-in-out infinite;
}

@keyframes toastCelebration {
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateX(-10%) scale(1.05);
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.7;
  }
}

/* =========================================================================
   TOAST BASE STYLES (if not already defined)
   ========================================================================= */

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast--visible {
  transform: translateX(0);
  opacity: 1;
}

.toast--success {
  background: #00B894;
  color: white;
}

.toast--info {
  background: #0984E3;
  color: white;
}

.toast__message {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

/* Toast Container */
#toast-container {
  position: fixed;
  top: var(--space-4);
  left: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: var(--z-toast, 9999);
  pointer-events: none;
}

#toast-container > * {
  pointer-events: auto;
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .modal--stamp-detail,
  .stamp-modal,
  .celebration-message,
  .toast {
    transition: none;
  }
  
  .modal--visible .stamp-modal {
    transform: none;
  }
  
  .celebration-message--visible {
    transform: translate(-50%, -50%);
  }
  
  .toast--celebration {
    animation: none;
  }
  
  .toast--celebration .toast__sparkle {
    animation: none;
  }
  
  .toast--visible {
    transform: translateX(0);
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--z-modal` | `1000` | Modal z-index |
| `--z-toast` | `9999` | Toast z-index |
| `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Bounce easing |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Smooth ease out |
| `--radius-xl` | `20px` | Modal corners |
| Modal animation | `300ms` | Open/close transition |
| Celebration duration | `3000ms` | Confetti auto-dismiss |

### Brand Colors for Confetti

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#E10514` | Main brand accent |
| Gold | `#F1C40F` | Celebration, points |
| Green | `#22C55E` | Success, hired |
| Blue | `#0984E3` | Info, submitted |
| Pink | `#FD79A8` | First referral hearts |

### Integration Points

**Dependencies from Story 3.4:**
- `STAMP_TYPES` constant (to be extended with descriptions)
- `view-stamp-details` action handler (to be updated)
- `selectedStamp` state key
- `activeModal` state key
- Stamp data structure

**Extends:**
- AnimationService with celebration methods
- PassportComponent with celebration triggers
- Action handlers with modal controls

**Uses:**
- canvas-confetti library (CDN, optional)
- Modal container (`#modal-container`)
- Toast container (`#toast-container`)

**Files to Modify:**
- `script.js` - Add StampDetailModal, extend AnimationService, update PassportComponent, update action handlers (~400 lines)
- `style.css` - Add modal styles, celebration styles, toast styles (~250 lines)

### Testing Scenarios

1. **Modal Open (Mobile):**
   - Tap stamp → Modal slides up from bottom
   - Stamp displayed large in modal
   - All details visible (type, points, date, description)

2. **Modal Open (Desktop):**
   - Click stamp → Modal appears centered
   - Fade in with slight scale animation
   - Backdrop blur visible

3. **Modal Content:**
   - Stamp type emoji and title displayed
   - Points badge with gold gradient
   - Description text in Hebrew
   - Date formatted correctly
   - Candidate name shown if applicable

4. **Modal Close - X Button:**
   - Click X → Modal closes smoothly
   - Focus returns to original stamp

5. **Modal Close - Click Outside:**
   - Click backdrop → Modal closes
   - Animation plays correctly

6. **Modal Close - Swipe Down (Mobile):**
   - Swipe modal down → Modal closes
   - Partial swipe returns modal to position

7. **Modal Close - Escape Key:**
   - Press Escape → Modal closes
   - Works with keyboard only

8. **Hired Stamp Celebration:**
   - Add new hired stamp with `isNew: true`
   - Navigate to passport → Confetti fires
   - Brand colors visible in particles
   - Auto-dismisses after 3 seconds

9. **First Referral Celebration:**
   - Add new first stamp with `isNew: true`
   - Navigate to passport → Hearts/pink confetti
   - Congratulatory message appears

10. **Celebration Dismiss:**
    - Tap anywhere during celebration → Confetti stops

11. **Reduced Motion:**
    - Enable `prefers-reduced-motion`
    - Earn stamp → Toast message instead of confetti
    - Modal transitions instant/simple

12. **No Confetti Library:**
    - Remove confetti script
    - Earn stamp → CSS toast animation plays
    - Graceful fallback works

13. **Accessibility:**
    - Tab into modal → Focus trapped
    - Screen reader announces dialog
    - Escape closes modal
    - Focus returns to trigger

### Previous Story Patterns (From Stories 3.1-3.4)

- PassportComponent structure and methods
- AnimationService async pattern with waitForAnimation()
- reducedMotion preference check
- State management via stateManager.setState()
- Action handler registration pattern
- Modal container usage

### Project Context Quick Reference

**Naming Conventions:**
- CSS: BEM-kebab (`stamp-modal__title`, `modal--visible`)
- JS: camelCase methods (`celebrateHiredStamp`, `_showStaticCelebration`)
- Classes: PascalCase (`StampDetailModal`)
- Constants: SCREAMING_SNAKE (`STAMP_TYPES`)

**State Management:**
- `selectedStamp` - Currently selected stamp for modal
- `activeModal` - 'stamp-details' when modal open
- Update via `stateManager.setState()`

**Animation:**
- Use AnimationService for all celebrations
- Check `this.reducedMotion` before animations
- Provide fallback for missing confetti library

### References

- [Source: docs/architecture.md#3.5] - Animation architecture
- [Source: docs/architecture.md#5.4] - Component hierarchy (ModalComponent pattern)
- [Source: docs/epics.md#story-35] - Original acceptance criteria
- [Source: docs/sprint-artifacts/3-4-stamp-collection-display.md] - Stamp types, action handler
- [Source: canvas-confetti docs] - https://www.kirilv.com/canvas-confetti/

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/epics.md (complete - Epic 3, Story 3.5)
- docs/sprint-artifacts/3-4-stamp-collection-display.md (previous story patterns)
- docs/sprint-status.yaml (current status)
- docs/project_context.md (implementation rules)

### Agent Model Used

Claude Opus 4.5 (Developer - Amelia)

### Debug Log References

None required - implementation followed patterns established in prior stories.

### Completion Notes List

1. **STAMP_TYPES Extended** (Task 9): Added Hebrew `description` field to all 8 stamp types
2. **StampDetailModal Component** (Tasks 1-2): New modal component with full lifecycle, accessibility, and swipe-to-close
3. **Modal Integration** (Task 2): Updated ModalManager to handle 'stamp-details' modal type
4. **CSS Styles** (Task 3): ~200 lines of modal, celebration overlay, and toast styles added
5. **AnimationService Extended** (Tasks 4, 6, 7): Added 10 new celebration methods with graceful degradation
6. **PassportComponent Integration** (Task 5): Added `_checkForNewStampCelebrations()` method
7. **Action Handlers** (Task 2, 5): Added close-stamp-modal, close-stamp-modal-overlay, dismiss-celebration

### File List

Files modified:
- `script.js`:
  - Lines 67-155: Extended STAMP_TYPES with description field
  - Lines 920-1140: Added celebration methods to AnimationService
  - Lines 4466-4720: Added StampDetailModal class
  - Lines 4760-4820: Updated ModalManager._handleModalChange and _handleAction
  - Lines 4920-4950: Updated view-stamp-details action, added dismiss-celebration
  - Lines 4300-4350: Added _checkForNewStampCelebrations to PassportComponent.mount()
- `style.css`:
  - Lines 3870-4120: Added stamp modal, celebration message, celebration toast styles

No new files created.

Depends on from Story 3.4:
- STAMP_TYPES constant (extended with descriptions)
- PassportComponent with stamp rendering
- AnimationService base class
- `view-stamp-details` action (updated to trigger modal)
- `selectedStamp` and `activeModal` state keys

Uses:
- canvas-confetti library from CDN (optional, graceful degradation implemented)
- `#modal-container` element from index.html
- `#toast-container` element from index.html

**Completes Epic 3: Passport & Stamps Experience**

