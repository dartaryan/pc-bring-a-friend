# Story 5.3: Referral Detail Modal

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to see detailed information about a specific referral,
**So that** I can track its full history, timeline, and expected rewards.

## Acceptance Criteria

### AC1: Modal Trigger from Referral Card
**Given** I am on the `#referrals` page
**When** I click on a referral card
**Then** the referral detail modal opens
**And** the modal contains all details for the selected referral

### AC2: Modal Slide-Up on Mobile
**Given** I am on mobile (< 1024px)
**When** the referral detail modal opens
**Then** it slides up from the bottom of the screen
**And** the animation duration is ~300ms
**And** the modal takes up most of the screen height
**And** a dark overlay appears behind the modal

### AC3: Modal Centered on Desktop
**Given** I am on desktop (≥ 1024px)
**When** the referral detail modal opens
**Then** it appears centered on screen
**And** a fade-in animation plays
**And** a dark overlay appears behind the modal
**And** the modal has a maximum width (~600px)

### AC4: Modal Header Content
**Given** the referral detail modal is open
**When** I view the header
**Then** I see the candidate name prominently displayed
**And** I see the position title they were referred for
**And** I see a close (X) button in the top corner
**And** the header has appropriate visual weight

### AC5: Status Pipeline Display (Full Size)
**Given** the referral detail modal is open
**When** I view the status visualization
**Then** I see the full-size StatusPipeline component (from Story 5.2)
**And** the pipeline shows all 5 stages with labels
**And** completed stages show green checkmarks
**And** current stage is highlighted and may pulse
**And** future stages are grayed out

### AC6: Vertical Timeline Section
**Given** the referral detail modal is open
**When** I view the timeline section
**Then** I see a "ציר זמן" (Timeline) heading
**And** I see a vertical timeline of all status changes
**And** each entry shows:
  - Status name with appropriate icon
  - Date of status change (Hebrew format)
  - Points earned at that stage (if any)
**And** the timeline is in chronological order (oldest at top, newest at bottom)

### AC7: Timeline Entry Styling
**Given** the timeline is displayed
**When** I view individual entries
**Then** completed entries have green left border/indicator
**And** the current/latest entry is highlighted
**And** points badges show "+X נקודות" in gold styling
**And** entries without points show just the status and date

### AC8: Points Breakdown Section
**Given** the referral detail modal is open
**When** I view the points section
**Then** I see a "נקודות" (Points) heading
**And** I see "נקודות שהושגו" (Points Earned): total earned for this referral
**And** I see breakdown by stage (e.g., "הגשה: +50", "ראיון: +100")
**And** I see "נקודות פוטנציאליות" (Potential Points): what's still earnable

### AC9: Points Display for Hired Referrals
**Given** the referral was successfully hired
**When** I view the points breakdown
**Then** all hiring milestone points are shown as earned
**And** I see pending milestone bonuses with expected dates:
  - "בונוס 3 חודשים: +200 נקודות (צפוי: [date])"
  - "בונוס 6 חודשים: +400 נקודות (צפוי: [date])"
**And** milestone dates are calculated from hire date

### AC10: Points Display for In-Progress Referrals
**Given** the referral is still in progress
**When** I view the points breakdown
**Then** earned points show stages completed
**And** potential points show remaining stages
**And** expected bonuses show with "אם יגויס" (if hired) note

### AC11: Points Display for Rejected Referrals
**Given** the referral was rejected
**When** I view the points breakdown
**Then** only earned points up to rejection are shown
**And** potential points section shows "0" or is hidden
**And** no milestone bonuses are displayed

### AC12: Close Modal - X Button
**Given** the referral detail modal is open
**When** I click the X button
**Then** the modal closes with animation
**And** I return to the referrals list
**And** the selectedReferral state is cleared

### AC13: Close Modal - Overlay Click
**Given** the referral detail modal is open
**When** I click outside the modal (on the overlay)
**Then** the modal closes with animation
**And** I return to the referrals list

### AC14: Close Modal - Swipe Down (Mobile)
**Given** I am on mobile and the modal is open
**When** I swipe down on the modal
**Then** the modal closes with slide-down animation
**And** I return to the referrals list

### AC15: Close Modal - Escape Key
**Given** the referral detail modal is open
**When** I press the Escape key
**Then** the modal closes
**And** focus returns to the referral card that opened it

### AC16: Scrollable Content
**Given** the modal content is longer than viewport
**When** viewing on any device
**Then** the modal content is scrollable
**And** the header (candidate name, close button) remains fixed
**And** scroll happens within the modal, not on background

### AC17: Background Scroll Lock
**Given** the referral detail modal is open
**When** I try to scroll the background page
**Then** the background does not scroll
**And** only the modal content scrolls (if needed)

### AC18: Accessibility - Focus Management
**Given** the modal opens
**When** it becomes visible
**Then** focus moves to the modal container or close button
**And** focus is trapped within the modal
**And** tabbing cycles through modal interactive elements only

### AC19: Accessibility - ARIA Attributes
**Given** the modal is rendered
**When** inspecting the markup
**Then** the modal has role="dialog"
**And** aria-modal="true" is set
**And** aria-labelledby references the candidate name heading
**And** the close button has aria-label="סגור"

### AC20: Accessibility - Screen Reader Announcement
**Given** I use a screen reader
**When** the modal opens
**Then** the modal title (candidate name) is announced
**And** the modal content is navigable
**And** closing the modal announces return to list

### AC21: Reduced Motion Support
**Given** I have prefers-reduced-motion: reduce enabled
**When** the modal opens or closes
**Then** animations are instant (no slide/fade)
**And** the modal appears/disappears immediately
**And** the StatusPipeline pulse animation is disabled

### AC22: Empty Timeline Handling
**Given** a referral has minimal timeline data
**When** the modal renders
**Then** at least the submission entry is shown
**And** no errors occur
**And** the layout remains intact

### AC23: State Integration
**Given** the modal is opened via state
**When** selectedReferral and activeModal='referral-details' are set
**Then** the modal renders with the correct referral data
**And** closing clears both state keys

## Tasks / Subtasks

- [x] Task 1: Create ReferralDetailModal component class (AC: #1, #22, #23)
  - [x] Create ReferralDetailModalComponent extending Component
  - [x] Accept referral data from state (selectedReferral)
  - [x] Implement template() with modal structure
  - [x] Handle null/missing data gracefully

- [x] Task 2: Implement modal header section (AC: #4)
  - [x] Create _renderHeader() method
  - [x] Display candidate name prominently
  - [x] Display position title
  - [x] Add close button with icon

- [x] Task 3: Integrate StatusPipeline (full size) (AC: #5)
  - [x] Import renderStatusPipeline() helper
  - [x] Render with size='full' parameter
  - [x] Display stage labels below circles
  - [x] Handle all status states

- [x] Task 4: Implement vertical timeline section (AC: #6-7)
  - [x] Create _renderTimeline() method
  - [x] Render each timeline entry with date and status
  - [x] Show points earned per stage
  - [x] Style completed vs current entries
  - [x] Handle chronological ordering

- [x] Task 5: Implement points breakdown section (AC: #8-11)
  - [x] Create _renderPointsBreakdown() method
  - [x] Calculate total earned points
  - [x] Calculate potential remaining points
  - [x] Show milestone bonuses for hired referrals
  - [x] Handle in-progress and rejected states differently

- [x] Task 6: Implement modal open/close behavior (AC: #2-3, #12-15)
  - [x] Create _openModal() method with animation
  - [x] Create _closeModal() method with animation
  - [x] Handle X button click
  - [x] Handle overlay click
  - [x] Handle Escape key
  - [x] Implement swipe-to-close for mobile

- [x] Task 7: Implement scroll and body lock (AC: #16-17)
  - [x] Make content scrollable within modal
  - [x] Keep header fixed during scroll
  - [x] Add body scroll lock when modal open
  - [x] Remove body scroll lock on close

- [x] Task 8: Add accessibility features (AC: #18-20)
  - [x] Set role="dialog" and aria-modal="true"
  - [x] Implement focus trapping
  - [x] Set aria-labelledby for modal title
  - [x] Add aria-label to close button
  - [x] Manage focus on open/close

- [x] Task 9: Add reduced motion support (AC: #21)
  - [x] Check prefers-reduced-motion
  - [x] Skip animations when enabled
  - [x] Ensure instant open/close

- [x] Task 10: Add responsive CSS styles (AC: #2-3)
  - [x] Mobile: slide-up animation, full-width
  - [x] Desktop: centered, max-width, fade-in
  - [x] Tablet: appropriate hybrid

- [x] Task 11: Wire state integration (AC: #23)
  - [x] Subscribe to activeModal state changes
  - [x] Subscribe to selectedReferral state changes
  - [x] Render modal when activeModal='referral-details'
  - [x] Clear state on close

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story creates the ReferralDetailModalComponent - a detailed view modal for referral tracking information. It builds on Story 5.1 (ReferralsComponent) and Story 5.2 (StatusPipeline).**

**State Keys Used:**

| Key | Type | Description |
|-----|------|-------------|
| `selectedReferral` | Object | The referral being viewed in detail |
| `activeModal` | String | 'referral-details' when this modal is open |

**Modal Opening Flow:**

```
User clicks referral card → 
  data-action="view-referral-details" → 
    stateManager.setState({ selectedReferral: referral, activeModal: 'referral-details' }) → 
      ReferralDetailModalComponent renders
```

**Referral Object Structure (from Story 5.1):**

```javascript
const referral = {
  id: 'ref-001',
  candidateName: 'דנה לוי',
  candidateEmail: 'dana@email.com',
  candidatePhone: '050-1234567',
  relationship: 'חבר/ה קרוב/ה',
  positionId: 'pos-001',
  positionTitle: 'מפתח/ת Full Stack',
  positionDepartment: 'פיתוח',
  status: 'interview',  // submitted, review, interview, offer, hired, rejected
  submittedAt: '2025-12-01T10:00:00Z',
  updatedAt: '2025-12-08T14:30:00Z',
  timeline: [
    { status: 'submitted', date: '2025-12-01', points: 50 },
    { status: 'review', date: '2025-12-03', points: 0 },
    { status: 'interview', date: '2025-12-08', points: 100 }
  ],
  pointsEarned: 150,
  potentialPoints: 500,
  // For hired referrals:
  milestones: {
    threeMonth: '2026-03-05',
    sixMonth: '2026-06-05'
  },
  // For rejected referrals:
  rejectionReason: 'לא עמד בדרישות הטכניות'
};
```

**ReferralDetailModalComponent Implementation:**

```javascript
// ============================================
// COMPONENTS - Referral Detail Modal (Story 5.3)
// ============================================

class ReferralDetailModalComponent extends Component {
  constructor(props) {
    super(props);
    this.referral = null;
    this.isOpen = false;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    if (!this.referral) {
      return '';
    }
    
    return `
      <div class="modal-overlay referral-detail-overlay ${this.isOpen ? 'modal-overlay--visible' : ''}"
           data-action="close-referral-modal">
        <div class="referral-detail-modal ${this.isOpen ? 'referral-detail-modal--open' : ''}"
             role="dialog"
             aria-modal="true"
             aria-labelledby="referral-detail-title"
             data-referral-modal>
          ${this._renderHeader()}
          <div class="referral-detail-modal__content">
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
    const initials = this._getInitials(this.referral.candidateName);
    
    return `
      <header class="referral-detail-modal__header">
        <div class="referral-detail-modal__candidate">
          <div class="referral-detail-modal__avatar">
            ${initials}
          </div>
          <div class="referral-detail-modal__info">
            <h2 class="referral-detail-modal__name" id="referral-detail-title">
              ${this._escapeHtml(this.referral.candidateName)}
            </h2>
            <p class="referral-detail-modal__position">
              ${this._escapeHtml(this.referral.positionTitle)}
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
        ${renderStatusPipeline(this.referral, 'full')}
      </section>
    `;
  }
  
  /**
   * Renders vertical timeline section
   * @returns {string} HTML string
   */
  _renderTimeline() {
    const timeline = this.referral.timeline || [];
    
    if (timeline.length === 0) {
      return '';
    }
    
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
    const statusInfo = REFERRAL_STATUSES[entry.status] || REFERRAL_STATUSES.submitted;
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
    const isHired = this.referral.status === 'hired';
    const isRejected = this.referral.status === 'rejected';
    
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
              ${this._formatNumber(this.referral.pointsEarned)}
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
                ${this._formatNumber(this.referral.potentialPoints)}
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
    const timeline = this.referral.timeline || [];
    const earnedStages = timeline.filter(t => t.points > 0);
    
    if (earnedStages.length === 0) {
      return '';
    }
    
    return earnedStages.map(entry => {
      const statusInfo = REFERRAL_STATUSES[entry.status] || {};
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
    const milestones = this.referral.milestones || {};
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
                ${isPast ? '✓ הושג' : `צפוי: ${formattedDate}`}
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
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  
  /**
   * Formats date in Hebrew
   * @param {string} dateStr - Date string
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
   * Formats number with locale
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return new Intl.NumberFormat('he-IL').format(num || 0);
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
   * Opens the modal with animation
   */
  open() {
    this.isOpen = true;
    document.body.classList.add('modal-open');
    this._render();
    
    // Focus trap setup
    requestAnimationFrame(() => {
      const closeBtn = document.querySelector('[data-referral-modal] .referral-detail-modal__close');
      if (closeBtn) closeBtn.focus();
    });
    
    // Add keyboard listener
    this._handleKeydown = this._handleKeydown.bind(this);
    document.addEventListener('keydown', this._handleKeydown);
  }
  
  /**
   * Closes the modal with animation
   */
  close() {
    this.isOpen = false;
    document.body.classList.remove('modal-open');
    
    // Remove keyboard listener
    document.removeEventListener('keydown', this._handleKeydown);
    
    // Clear state
    stateManager.setState({
      selectedReferral: null,
      activeModal: null
    });
    
    this._render();
  }
  
  /**
   * Handles keydown events for accessibility
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handleKeydown(e) {
    if (e.key === 'Escape') {
      this.close();
    }
    
    // Focus trap
    if (e.key === 'Tab') {
      const modal = document.querySelector('[data-referral-modal]');
      if (!modal) return;
      
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusable.length === 0) return;
      
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  
  /**
   * Re-renders the component
   */
  _render() {
    const container = document.getElementById('modal-container');
    if (container) {
      container.innerHTML = this.template();
    }
  }
  
  /**
   * Lifecycle: Mount component
   */
  mount() {
    // Subscribe to state changes
    this.subscribe('selectedReferral', (referral) => {
      this.referral = referral;
      if (referral && stateManager.getState('activeModal') === 'referral-details') {
        this.open();
      }
    });
    
    this.subscribe('activeModal', (modal) => {
      if (modal === 'referral-details' && this.referral) {
        this.open();
      } else if (modal !== 'referral-details' && this.isOpen) {
        this.close();
      }
    });
    
    // Initial state check
    this.referral = stateManager.getState('selectedReferral');
    if (this.referral && stateManager.getState('activeModal') === 'referral-details') {
      this.open();
    }
  }
  
  /**
   * Lifecycle: Unmount component
   */
  unmount() {
    document.removeEventListener('keydown', this._handleKeydown);
    document.body.classList.remove('modal-open');
    super.unmount();
  }
}

// Global instance for modal rendering
const referralDetailModal = new ReferralDetailModalComponent();
```

**Action Handler (update existing from Story 5.1):**

```javascript
// ============================================
// ACTION HANDLERS - Referral Detail Modal (Story 5.3)
// ============================================

// Close referral detail modal
app.registerAction('close-referral-modal', (target) => {
  // Don't close if clicking inside modal content
  if (target.closest('[data-referral-modal]') && !target.matches('[data-action="close-referral-modal"]')) {
    return;
  }
  
  referralDetailModal.close();
});
```

**App Initialization Update:**

```javascript
// In App.init() - mount the modal component
referralDetailModal.mount();
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   REFERRAL DETAIL MODAL - Story 5.3
   ========================================================================= */

/* Modal Overlay */
.referral-detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-overlay, 100);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.referral-detail-overlay--visible {
  opacity: 1;
  visibility: visible;
}

/* Modal Container */
.referral-detail-modal {
  position: fixed;
  background: var(--color-surface);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
  z-index: var(--z-modal, 101);
  
  /* Mobile: slide up from bottom */
  inset-inline: 0;
  bottom: 0;
  transform: translateY(100%);
  transition: transform 0.3s var(--ease-out);
}

.referral-detail-modal--open {
  transform: translateY(0);
}

/* =========================================================================
   MODAL HEADER
   ========================================================================= */

.referral-detail-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: 1;
}

.referral-detail-modal__candidate {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.referral-detail-modal__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.referral-detail-modal__info {
  min-width: 0;
}

.referral-detail-modal__name {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1);
}

.referral-detail-modal__position {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}

.referral-detail-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.referral-detail-modal__close:hover {
  background: var(--color-surface-hover);
  color: var(--text-primary);
}

.referral-detail-modal__close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.referral-detail-modal__close .ti {
  font-size: 1.5rem;
}

/* =========================================================================
   MODAL CONTENT
   ========================================================================= */

.referral-detail-modal__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  -webkit-overflow-scrolling: touch;
}

.referral-detail-modal__section {
  margin-bottom: var(--space-6);
}

.referral-detail-modal__section:last-child {
  margin-bottom: 0;
}

.referral-detail-modal__section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-3);
}

.referral-detail-modal__section-title .ti {
  color: var(--color-primary);
}

/* =========================================================================
   VERTICAL TIMELINE
   ========================================================================= */

.referral-timeline {
  position: relative;
  padding-inline-start: var(--space-8);
}

/* Timeline connector line */
.referral-timeline::before {
  content: '';
  position: absolute;
  inset-inline-start: 15px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--color-border);
}

.referral-timeline__entry {
  position: relative;
  padding-bottom: var(--space-4);
}

.referral-timeline__entry:last-child {
  padding-bottom: 0;
}

.referral-timeline__marker {
  position: absolute;
  inset-inline-start: calc(var(--space-8) * -1 + 4px);
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--color-surface);
  border: 2px solid var(--marker-color, var(--color-border));
  border-radius: var(--radius-full);
  color: var(--marker-color, var(--text-muted));
  z-index: 1;
}

.referral-timeline__marker .ti {
  font-size: 0.75rem;
}

.referral-timeline__entry--current .referral-timeline__marker {
  background: var(--marker-color, var(--color-primary));
  color: white;
}

.referral-timeline__entry--rejected .referral-timeline__marker {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: white;
}

.referral-timeline__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.referral-timeline__status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.referral-timeline__status-text {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.referral-timeline__points {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  background: rgba(249, 196, 15, 0.15);
  color: var(--color-warning);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.referral-timeline__date {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* =========================================================================
   POINTS BREAKDOWN
   ========================================================================= */

.points-breakdown {
  background: var(--color-surface-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.points-breakdown__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
}

.points-breakdown__row--total {
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-2);
}

.points-breakdown__row--potential {
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-2);
}

.points-breakdown__label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.points-breakdown__value {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  direction: ltr;
  unicode-bidi: isolate;
}

.points-breakdown__value--earned {
  color: var(--color-success);
}

.points-breakdown__value--potential {
  color: var(--text-muted);
}

.points-breakdown__details {
  padding: var(--space-2) 0;
}

.points-breakdown__stage {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  padding: var(--space-1) 0;
}

.points-breakdown__stage span:last-child {
  color: var(--color-success);
  direction: ltr;
  unicode-bidi: isolate;
}

/* Milestones */
.points-breakdown__milestones {
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.points-breakdown__milestones--potential {
  opacity: 0.7;
}

.points-breakdown__milestones-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
}

.points-breakdown__milestones-title .ti {
  color: var(--color-warning);
}

.points-breakdown__milestone {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  padding: var(--space-1) 0;
}

.points-breakdown__milestone--earned {
  color: var(--color-success);
}

.points-breakdown__milestone--earned .points-breakdown__milestone-date {
  color: var(--color-success);
}

.points-breakdown__milestone-label {
  flex: 1;
}

.points-breakdown__milestone-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* =========================================================================
   BODY SCROLL LOCK
   ========================================================================= */

body.modal-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
}

/* =========================================================================
   RESPONSIVE - Tablet (600px+)
   ========================================================================= */

@media (min-width: 600px) {
  .referral-detail-modal {
    max-height: 85vh;
  }
  
  .referral-detail-modal__header {
    padding: var(--space-5);
  }
  
  .referral-detail-modal__content {
    padding: var(--space-5);
  }
  
  .referral-detail-modal__avatar {
    width: 64px;
    height: 64px;
    font-size: var(--text-2xl);
  }
  
  .referral-detail-modal__name {
    font-size: var(--text-xl);
  }
}

/* =========================================================================
   RESPONSIVE - Desktop (1024px+)
   ========================================================================= */

@media (min-width: 1024px) {
  .referral-detail-modal {
    /* Desktop: centered modal */
    inset: 50% auto auto 50%;
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
    border-radius: var(--radius-xl);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    transition: transform 0.3s var(--ease-out), opacity 0.3s ease;
  }
  
  .referral-detail-modal--open {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  
  .referral-detail-modal__header {
    padding: var(--space-6);
  }
  
  .referral-detail-modal__content {
    padding: var(--space-6);
  }
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .referral-detail-overlay,
  .referral-detail-modal {
    transition: none;
  }
  
  .referral-detail-modal--open {
    transform: translateY(0);
  }
  
  @media (min-width: 1024px) {
    .referral-detail-modal--open {
      transform: translate(-50%, -50%);
    }
  }
}
```

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- ReferralDetailModalComponent renders to `#modal-container`
- Modal uses existing REFERRAL_STATUSES constant from Story 5.1
- Integrates with StatusPipeline component from Story 5.2
- State-driven via `selectedReferral` and `activeModal`

### References

- [Source: docs/architecture.md#3.2] - State management patterns
- [Source: docs/architecture.md#3.4] - Component architecture
- [Source: docs/architecture.md#4.2] - CSS naming conventions
- [Source: docs/architecture.md#5.4] - Component hierarchy (ModalComponent patterns)
- [Source: docs/epics.md#story-53] - Original acceptance criteria
- [Source: docs/PRD.md#FR-TRACK-003] - Referral detail modal requirements
- [Source: docs/sprint-artifacts/5-1-referral-list-with-filters.md] - ReferralsComponent integration
- [Source: docs/sprint-artifacts/5-2-status-visualization-pipeline.md] - StatusPipeline integration

### Dependencies

**From Previous Stories:**
- StateManager with selectedReferral, activeModal keys (Story 1.1/1.4)
- Component base class (Story 1.1)
- REFERRAL_STATUSES constant (Story 5.1)
- ReferralsComponent with view-referral-details action (Story 5.1)
- StatusPipeline component with full size variant (Story 5.2)
- renderStatusPipeline() helper function (Story 5.2)
- CSS variables for colors, spacing, shadows
- Tabler Icons CDN (ti-x, ti-history, ti-trophy, etc.)
- `#modal-container` element in index.html

**Creates Foundation For:**
- Future modal patterns (reusable modal overlay system)
- Story 5.4: Active Campaigns Section (campaign detail modals)

### Testing Scenarios

1. **Modal Open:**
   - Click referral card → Modal slides up (mobile) or fades in (desktop)
   - Candidate name and position displayed in header
   - Status pipeline shows correct progress
   - Timeline shows all status changes
   - Points breakdown shows accurate calculations

2. **Modal Close:**
   - Click X button → Modal closes
   - Click overlay → Modal closes
   - Press Escape → Modal closes
   - Swipe down (mobile) → Modal closes

3. **Timeline Display:**
   - All timeline entries render with correct dates
   - Points badges show on entries with points > 0
   - Current entry is visually highlighted
   - Rejected entries show red styling

4. **Points Breakdown:**
   - In-progress: Shows earned + potential
   - Hired: Shows earned + milestone bonuses with dates
   - Rejected: Shows only earned, no potential

5. **Milestone Dates:**
   - Hired referral shows 3-month and 6-month bonus dates
   - Past milestones show as earned (✓)
   - Future milestones show expected date

6. **Accessibility:**
   - Focus moves to modal on open
   - Tab cycles within modal only
   - Escape key closes modal
   - ARIA attributes present and correct

7. **Responsive:**
   - Mobile: Slide-up animation, full-width
   - Desktop: Centered, max-width 600px, fade-in

8. **Reduced Motion:**
   - Animations disabled
   - Modal appears/disappears instantly

9. **State Integration:**
   - Opening sets selectedReferral and activeModal
   - Closing clears both state keys
   - State changes trigger proper re-renders

10. **Edge Cases:**
    - Empty timeline → Only submission shown
    - Missing milestones → Section hidden
    - Long content → Scrollable within modal

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete - state management, component patterns, CSS naming)
- docs/epics.md (complete - Epic 5, Story 5.3 full acceptance criteria)
- docs/PRD.md (FR-TRACK-003 requirements)
- docs/sprint-artifacts/5-1-referral-list-with-filters.md (referral data structure, action handlers)
- docs/sprint-artifacts/5-2-status-visualization-pipeline.md (StatusPipeline component)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode

### Debug Log References

No issues encountered during implementation.

### Completion Notes List

- ✅ Created ReferralDetailModal class (~470 lines) extending Component with full modal functionality
- ✅ Implemented modal header with candidate avatar, name, position title, and close button
- ✅ Integrated StatusPipeline component with 'full' size parameter for status visualization
- ✅ Built vertical timeline with chronological entries, status icons, and points badges
- ✅ Created points breakdown section with earned/potential points and milestone bonuses
- ✅ Added modal open/close with slide-up (mobile) and centered fade-in (desktop) animations
- ✅ Implemented swipe-to-close gesture support for mobile devices
- ✅ Added body scroll lock and modal content scrolling
- ✅ Implemented full accessibility: role="dialog", aria-modal, aria-labelledby, focus trap, Escape key
- ✅ Added reduced motion support with instant transitions
- ✅ Created responsive CSS (~450 lines) for mobile, tablet, and desktop breakpoints
- ✅ Integrated with ModalManager for state-driven modal display
- ✅ Added action handlers for close-referral-modal and close-referral-modal-overlay

### Change Log

- 2025-12-11: Implemented Story 5.3 - Referral Detail Modal (all 11 tasks, 23 ACs)

### File List

**Files Modified:**
- `script.js`:
  - Added ReferralDetailModal class (~470 lines) after PositionDetailModal
  - Added referralDetailModal global instance
  - Updated ModalManager._handleModalChange() to handle 'referral-details' modal
  - Added close-referral-modal action handler to ModalManager._handleAction()
  - Added close-referral-modal-overlay action handler to ModalManager._handleAction()

- `style.css`:
  - Added modal overlay styles (.modal--referral-detail)
  - Added modal container styles (.referral-detail-modal)
  - Added header styles (.referral-detail-modal__header, __candidate, __avatar, __info, __name, __position, __close)
  - Added content styles (.referral-detail-modal__content, __section, __section-title)
  - Added timeline styles (.referral-timeline, __entry, __marker, __content, __status, __points, __date)
  - Added points breakdown styles (.points-breakdown, __row, __value, __details, __stage, __milestones, __milestone)
  - Added responsive styles for tablet (600px+) and desktop (1024px+)
  - Added reduced motion styles

**Files Verified:**
- `index.html` - Confirmed #modal-container exists (line 36)

**Total Lines Added:**
- JavaScript: ~485 lines
- CSS: ~450 lines

