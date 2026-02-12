# Story 5.5: How to Earn More Section

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to understand how the points system works,
**So that** I can optimize my referrals and maximize rewards.

## Acceptance Criteria

### AC1: Section Location and Access
**Given** I am logged in and on the dashboard (`#dashboard`)
**When** I look at the quick actions area
**Then** I see a "איך להרוויח עוד?" (How to Earn More?) link/button
**And** clicking it opens a dedicated "How to Earn" section (via slide-up modal or dedicated view)

### AC2: Section Heading and Structure
**Given** I access the "How to Earn" section
**When** the content loads
**Then** I see a "🎯 איך להרוויח עוד נקודות" (How to Earn More Points) heading
**And** the section has three main areas: Points Breakdown, Active Campaigns, and Tips
**And** the layout is visually organized and scannable

### AC3: Points Breakdown Table
**Given** I view the points breakdown section
**When** I look at the table/list
**Then** I see ALL earning opportunities with points values:
  - קו״ח הוגש: +50 נקודות (Resume Submitted)
  - ראיון נקבע: +100 נקודות (Interview Scheduled)
  - גיוס מוצלח: +500 נקודות (Successful Hire)
  - 3 חודשי עבודה: +200 נקודות (3-Month Milestone)
  - 6 חודשי עבודה: +400 נקודות (6-Month Milestone)
  - הפניה ראשונה (בונוס): +100 נקודות (First Referral Bonus)
  - רצף הפניות (3+): +75 נקודות לכל הפניה (Referral Streak)
**And** each row has the stamp icon/emoji associated with it
**And** points values are displayed LTR (direction: ltr; unicode-bidi: isolate)

### AC4: Points Breakdown Visual Design
**Given** I view the points breakdown list
**When** I look at each earning opportunity row
**Then** each row shows: stamp icon/emoji, Hebrew label, points badge
**And** the stamp icon matches the STAMP_TYPES constant color
**And** the points badge has gold/accent styling
**And** rows are visually distinct and easy to scan

### AC5: Active Campaigns Section
**Given** there are active campaigns in the system
**When** I view the "קמפיינים מיוחדים" (Special Campaigns) section
**Then** I see a list of current active campaigns
**And** each campaign shows: icon, title, multiplier badge (e.g., "x2")
**And** each campaign row is clickable/tappable

### AC6: Campaign Links
**Given** I click on a campaign in the "How to Earn" section
**When** the action triggers
**Then** I navigate to `#positions` with that campaign's filter applied
**And** only campaign-eligible positions are shown

### AC7: No Active Campaigns State
**Given** there are no active campaigns
**When** I view the campaigns section
**Then** I see "אין קמפיינים פעילים כרגע" (No active campaigns currently)
**And** I see "עקבו אחר עדכונים בדשבורד" (Follow updates on the dashboard)
**And** the section is styled with reduced prominence

### AC8: Tips Section
**Given** I view the tips section
**When** I read the content
**Then** I see a "💡 טיפים להצלחה" (Tips for Success) heading
**And** I see the following tips in Hebrew:
  - "הפנו מועמדים שאתם מכירים אישית" (Refer candidates you know personally)
  - "ודאו שקורות החיים מעודכנים" (Make sure resumes are up-to-date)
  - "עקבו אחרי ההפניות שלכם" (Track your referrals)
  - "נצלו קמפיינים מיוחדים" (Take advantage of special campaigns)
**And** each tip has an icon (checkmark or bullet)

### AC9: Primary CTA - View Open Positions
**Given** I am viewing the "How to Earn" section
**When** I look at the CTAs at the bottom
**Then** I see a prominent "צפה במשרות פתוחות" (View Open Positions) button
**And** it uses primary button styling (btn--primary)
**And** clicking it navigates to `#positions`

### AC10: Secondary CTA - View Active Campaigns
**Given** there are active campaigns
**When** I look at the CTAs
**Then** I see a "צפה בקמפיינים פעילים" (View Active Campaigns) link/button
**And** clicking it scrolls to or navigates to the campaigns section on dashboard

### AC11: Close/Dismiss Action
**Given** the "How to Earn" section is displayed as a modal or overlay
**When** I want to close it
**Then** I can click an X button, tap outside the modal, or swipe down (mobile)
**And** the section closes with a smooth animation
**And** I return to my previous view

### AC12: Responsive Layout - Mobile
**Given** I am on mobile (< 600px)
**When** I view the "How to Earn" section
**Then** it displays as a full-screen slide-up modal
**And** content is scrollable
**And** close button is easily accessible
**And** touch targets are minimum 44×44px

### AC13: Responsive Layout - Desktop
**Given** I am on desktop (≥ 1024px)
**When** I view the "How to Earn" section
**Then** it displays as a centered modal or side panel
**And** the width is constrained (max-width: 600px)
**And** there is adequate padding and spacing

### AC14: Accessibility - Screen Reader
**Given** I use a screen reader
**When** I navigate the "How to Earn" section
**Then** the heading is properly announced
**And** the points table is readable (each row is announced correctly)
**And** the tips list is announced as a list
**And** CTAs are properly labeled

### AC15: Accessibility - Keyboard Navigation
**Given** I navigate using keyboard
**When** I tab through the section
**Then** I can focus on all interactive elements
**And** close button is focusable and functional
**And** campaign rows are focusable and activatable with Enter/Space
**And** focus order is logical (RTL-aware)
**And** focus indicators are clearly visible

### AC16: Reduced Motion Support
**Given** I have prefers-reduced-motion: reduce enabled
**When** the "How to Earn" section opens/closes
**Then** animations are minimal or instant
**And** functionality is preserved

### AC17: State Integration
**Given** the "How to Earn" section is displayed
**When** I interact with it
**Then** campaign data comes from `dataService.getActiveCampaigns()`
**And** points values come from STAMP_TYPES constant
**And** campaign clicks properly set state via `stateManager.setState()`
**And** navigation happens via `router.navigate()`

### AC18: Link from Dashboard Quick Actions
**Given** I am on the dashboard
**When** I view the quick actions section (Story 2.4)
**Then** I see a link or button to access "How to Earn" information
**And** the link is styled appropriately (secondary/link styling)
**And** it's clearly labeled "איך להרוויח?"

## Tasks / Subtasks

- [x] Task 1: Add "How to Earn" entry point to DashboardComponent (AC: #1, #18)
  - [x] Add link/button in quick actions area
  - [x] Style as secondary action with icon
  - [x] Set data-action="open-how-to-earn"

- [x] Task 2: Create HowToEarnComponent class (AC: #2)
  - [x] Create class extending Component
  - [x] Implement template() with section structure
  - [x] Add three main content areas (points, campaigns, tips)
  - [x] Include close button and CTAs

- [x] Task 3: Implement points breakdown section (AC: #3, #4)
  - [x] Create _renderPointsBreakdown() method
  - [x] Map STAMP_TYPES to earning opportunities
  - [x] Render icon, label, and points for each
  - [x] Apply proper RTL styling for numbers
  - [x] Use stamp colors for icons

- [x] Task 4: Implement campaigns section (AC: #5, #6, #7)
  - [x] Create _renderCampaignsSection() method
  - [x] Get campaigns from _getActiveCampaigns() method
  - [x] Render campaign cards with icon, title, multiplier
  - [x] Add click handlers for campaign navigation
  - [x] Handle empty state with appropriate messaging

- [x] Task 5: Implement tips section (AC: #8)
  - [x] Create _renderTipsSection() method
  - [x] Display all 4 tips with icons
  - [x] Style as checklist/bullet list
  - [x] Ensure proper Hebrew text rendering

- [x] Task 6: Implement CTAs (AC: #9, #10)
  - [x] Add primary CTA "צפה במשרות פתוחות"
  - [x] Add secondary CTA "צפה בקמפיינים פעילים"
  - [x] Set appropriate data-action attributes
  - [x] Wire up navigation handlers

- [x] Task 7: Implement modal open/close behavior (AC: #11, #12, #13)
  - [x] Add open-how-to-earn action handler
  - [x] Display as slide-up modal (mobile) or centered modal (desktop)
  - [x] Add close-how-to-earn action handler
  - [x] Support X button, outside click, and Escape key
  - [x] Add smooth open/close animations

- [x] Task 8: Add responsive CSS styles (AC: #12, #13)
  - [x] Mobile: full-screen slide-up modal
  - [x] Tablet: centered modal with overlay
  - [x] Desktop: constrained width modal
  - [x] Ensure scrollable content area

- [x] Task 9: Add accessibility features (AC: #14, #15, #16)
  - [x] Add proper ARIA attributes (aria-modal, aria-labelledby)
  - [x] Implement focus trapping within modal
  - [x] Ensure keyboard navigation works
  - [x] Add visible focus indicators
  - [x] Respect reduced motion preferences

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story creates the HowToEarnComponent as a modal that can be triggered from the dashboard. It integrates with existing DataService for campaign data and uses STAMP_TYPES for points information.**

**Three-File Architecture:**
- All code in: `index.html`, `style.css`, `script.js`
- No additional files or build steps

**Component Pattern:**
```javascript
class HowToEarnComponent extends Component {
  constructor(props) {
    super(props);
    this.campaigns = [];
  }
  
  template() { /* Return HTML string */ }
  _renderPointsBreakdown() { /* Points table */ }
  _renderCampaignsSection() { /* Campaigns list */ }
  _renderTipsSection() { /* Tips checklist */ }
  _renderCTAs() { /* Action buttons */ }
  
  mount() { /* Setup, load data */ }
  unmount() { /* Cleanup */ }
  bindEvents() { /* Event handlers */ }
}
```

### Points Data Source (STAMP_TYPES constant)

**CRITICAL:** Points values MUST come from the existing STAMP_TYPES constant in script.js. Map the stamp types to earning opportunity rows:

```javascript
// Earning opportunities mapped from STAMP_TYPES
const EARNING_OPPORTUNITIES = [
  { type: 'submitted', label: 'קו״ח הוגש', points: STAMP_TYPES.submitted.points, icon: STAMP_TYPES.submitted.emoji, color: STAMP_TYPES.submitted.color },
  { type: 'interview', label: 'ראיון נקבע', points: STAMP_TYPES.interview.points, icon: STAMP_TYPES.interview.emoji, color: STAMP_TYPES.interview.color },
  { type: 'hired', label: 'גיוס מוצלח!', points: STAMP_TYPES.hired.points, icon: STAMP_TYPES.hired.emoji, color: STAMP_TYPES.hired.color },
  { type: 'milestone3m', label: '3 חודשי עבודה', points: STAMP_TYPES.milestone3m.points, icon: STAMP_TYPES.milestone3m.emoji, color: STAMP_TYPES.milestone3m.color },
  { type: 'milestone6m', label: '6 חודשי עבודה', points: STAMP_TYPES.milestone6m.points, icon: STAMP_TYPES.milestone6m.emoji, color: STAMP_TYPES.milestone6m.color },
  { type: 'first', label: 'הפניה ראשונה (בונוס)', points: STAMP_TYPES.first.points, icon: STAMP_TYPES.first.emoji, color: STAMP_TYPES.first.color },
  { type: 'streak', label: 'רצף הפניות (3+)', points: STAMP_TYPES.streak.points, icon: STAMP_TYPES.streak.emoji, color: STAMP_TYPES.streak.color }
];
```

### HowToEarnComponent Implementation

```javascript
// ============================================
// COMPONENTS - How to Earn Section (Story 5.5)
// ============================================

class HowToEarnComponent extends Component {
  constructor(props) {
    super(props);
    this.campaigns = [];
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
              <span class="how-to-earn__icon">🎯</span>
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
          <span class="how-to-earn__section-icon">💰</span>
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
            ${stampType.emoji}
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
    this.campaigns = dataService.getActiveCampaigns();
    
    return `
      <section class="how-to-earn__section" aria-labelledby="campaigns-section-heading">
        <h3 class="how-to-earn__section-title" id="campaigns-section-heading">
          <span class="how-to-earn__section-icon">⚡</span>
          קמפיינים מיוחדים
        </h3>
        ${this.campaigns.length > 0 
          ? this._renderCampaignsList()
          : this._renderNoCampaigns()}
      </section>
    `;
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
              data-action="view-campaign-positions"
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
          <span class="how-to-earn__section-icon">💡</span>
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
    
    // Bind events
    this.bindEvents();
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
   * Closes the modal
   */
  _closeModal() {
    const modal = document.querySelector('.how-to-earn');
    if (!modal) return;
    
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
   * Bind event handlers
   */
  bindEvents() {
    // Campaign item click/keyboard
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
```

### Action Handlers

```javascript
// ============================================
// ACTION HANDLERS - How to Earn (Story 5.5)
// ============================================

// Open How to Earn modal
app.registerAction('open-how-to-earn', () => {
  const howToEarn = new HowToEarnComponent();
  const html = howToEarn.render();
  
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
  
  // Mount component
  howToEarn.mount();
});

// Close How to Earn modal
app.registerAction('close-how-to-earn', () => {
  const modal = document.querySelector('.how-to-earn');
  if (!modal) return;
  
  modal.classList.remove('how-to-earn--open');
  modal.classList.add('how-to-earn--closing');
  
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (reducedMotion) {
    modal.remove();
  } else {
    setTimeout(() => modal.remove(), 300);
  }
});

// Navigate to positions from How to Earn
app.registerAction('navigate-to-positions-from-earn', () => {
  // Close modal first
  const modal = document.querySelector('.how-to-earn');
  if (modal) modal.remove();
  
  // Navigate to positions
  router.navigate('positions');
});

// Navigate to campaigns section on dashboard
app.registerAction('navigate-to-campaigns', () => {
  // Close modal first
  const modal = document.querySelector('.how-to-earn');
  if (modal) modal.remove();
  
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
```

### DashboardComponent Update

**Add link to How to Earn in quick actions area:**

```javascript
// In DashboardComponent._renderQuickActions(), add this link:

_renderQuickActions() {
  return `
    <section class="quick-actions">
      <h3 class="quick-actions__title">פעולות מהירות</h3>
      <div class="quick-actions__buttons">
        <button class="btn btn--primary btn--lg" data-action="navigate" data-navigate="positions">
          <i class="ti ti-user-plus" aria-hidden="true"></i>
          הפנה מועמד
        </button>
        <button class="btn btn--secondary" data-action="navigate" data-navigate="positions">
          <i class="ti ti-briefcase" aria-hidden="true"></i>
          צפה במשרות
        </button>
        <button class="btn btn--secondary" data-action="navigate" data-navigate="passport">
          <i class="ti ti-passport" aria-hidden="true"></i>
          הדרכון שלי
        </button>
      </div>
      <!-- ADD THIS LINK -->
      <div class="quick-actions__link">
        <button class="btn btn--ghost btn--sm" data-action="open-how-to-earn">
          <i class="ti ti-help-circle" aria-hidden="true"></i>
          איך להרוויח עוד?
        </button>
      </div>
    </section>
  `;
}
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   HOW TO EARN MODAL - Story 5.5
   ========================================================================= */

.how-to-earn {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.how-to-earn--open {
  pointer-events: auto;
  opacity: 1;
}

.how-to-earn--closing {
  opacity: 0;
}

/* =========================================================================
   BACKDROP
   ========================================================================= */

.how-to-earn__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* =========================================================================
   CONTENT PANEL
   ========================================================================= */

.how-to-earn__content {
  position: relative;
  width: 100%;
  max-height: 90vh;
  background: var(--color-white);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.3s var(--ease-out);
  overflow: hidden;
}

.how-to-earn--open .how-to-earn__content {
  transform: translateY(0);
}

.how-to-earn--closing .how-to-earn__content {
  transform: translateY(100%);
}

/* =========================================================================
   HEADER
   ========================================================================= */

.how-to-earn__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-4) var(--space-3);
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  background: var(--color-white);
  z-index: 1;
}

.how-to-earn__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.how-to-earn__icon {
  font-size: var(--text-xl);
}

.how-to-earn__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-gray-100);
  color: var(--text-secondary);
  transition: background 0.2s ease, color 0.2s ease;
}

.how-to-earn__close:hover {
  background: var(--color-gray-200);
  color: var(--text-primary);
}

.how-to-earn__close:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* =========================================================================
   BODY
   ========================================================================= */

.how-to-earn__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
}

/* =========================================================================
   SECTIONS
   ========================================================================= */

.how-to-earn__section {
  margin-bottom: var(--space-6);
}

.how-to-earn__section:last-child {
  margin-bottom: 0;
}

.how-to-earn__section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-3);
}

.how-to-earn__section-icon {
  font-size: var(--text-lg);
}

/* =========================================================================
   POINTS BREAKDOWN
   ========================================================================= */

.points-breakdown {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.points-breakdown__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  transition: background 0.2s ease;
}

.points-breakdown__item:hover {
  background: var(--color-gray-100);
}

.points-breakdown__icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: color-mix(in srgb, var(--stamp-color, var(--color-primary)) 15%, transparent);
  border-radius: var(--radius-md);
}

.points-breakdown__label {
  flex: 1;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.points-breakdown__points {
  flex-shrink: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  direction: ltr;
  unicode-bidi: isolate;
}

/* =========================================================================
   CAMPAIGNS LIST
   ========================================================================= */

.campaigns-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.campaigns-list__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.campaigns-list__item:hover {
  background: var(--color-gray-100);
  transform: translateX(-2px);
}

.campaigns-list__item:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.campaigns-list__icon {
  font-size: 1.5rem;
}

.campaigns-list__title {
  flex: 1;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.campaigns-list__multiplier {
  flex-shrink: 0;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: white;
  background: linear-gradient(135deg, var(--campaign-color, var(--color-warning)), 
    color-mix(in srgb, var(--campaign-color, var(--color-warning)) 80%, black));
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  direction: ltr;
  unicode-bidi: isolate;
}

.campaigns-list__arrow {
  color: var(--text-muted);
  font-size: 1.25rem;
}

/* =========================================================================
   CAMPAIGNS EMPTY STATE
   ========================================================================= */

.campaigns-empty-state {
  text-align: center;
  padding: var(--space-4);
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
}

.campaigns-empty-state__text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-1);
}

.campaigns-empty-state__subtext {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: 0;
}

/* =========================================================================
   TIPS LIST
   ========================================================================= */

.tips-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.tips-list__item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-2);
}

.tips-list__check {
  flex-shrink: 0;
  color: var(--color-success);
  font-size: 1.125rem;
  margin-top: 1px;
}

.tips-list__text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

/* =========================================================================
   FOOTER & CTAS
   ========================================================================= */

.how-to-earn__footer {
  padding: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-white);
}

.how-to-earn__ctas {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.how-to-earn__cta-primary {
  width: 100%;
  justify-content: center;
}

.how-to-earn__cta-secondary {
  width: 100%;
  justify-content: center;
}

/* =========================================================================
   QUICK ACTIONS LINK (Dashboard)
   ========================================================================= */

.quick-actions__link {
  margin-top: var(--space-3);
  text-align: center;
}

.quick-actions__link .btn--ghost {
  color: var(--text-secondary);
}

.quick-actions__link .btn--ghost:hover {
  color: var(--color-primary);
}

/* =========================================================================
   RESPONSIVE - Tablet (600px+)
   ========================================================================= */

@media (min-width: 600px) {
  .how-to-earn {
    align-items: center;
    padding: var(--space-4);
  }
  
  .how-to-earn__content {
    max-width: 480px;
    max-height: 80vh;
    border-radius: var(--radius-2xl);
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    transition: transform 0.3s var(--ease-out), opacity 0.3s ease;
  }
  
  .how-to-earn--open .how-to-earn__content {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  
  .how-to-earn--closing .how-to-earn__content {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  
  .points-breakdown__item {
    padding: var(--space-3) var(--space-4);
  }
  
  .how-to-earn__ctas {
    flex-direction: row;
  }
  
  .how-to-earn__cta-primary {
    flex: 1;
  }
  
  .how-to-earn__cta-secondary {
    flex: none;
    width: auto;
  }
}

/* =========================================================================
   RESPONSIVE - Desktop (1024px+)
   ========================================================================= */

@media (min-width: 1024px) {
  .how-to-earn__content {
    max-width: 560px;
  }
  
  .how-to-earn__header {
    padding: var(--space-5) var(--space-5) var(--space-4);
  }
  
  .how-to-earn__body {
    padding: var(--space-5);
  }
  
  .how-to-earn__footer {
    padding: var(--space-5);
  }
  
  .how-to-earn__title {
    font-size: var(--text-xl);
  }
  
  .points-breakdown__icon {
    width: 42px;
    height: 42px;
    font-size: 1.5rem;
  }
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .how-to-earn,
  .how-to-earn__content {
    transition: none;
  }
  
  .how-to-earn--open .how-to-earn__content {
    transform: none;
  }
  
  .campaigns-list__item:hover {
    transform: none;
  }
}
```

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- HowToEarnComponent renders into `#modal-container`
- Uses existing DataService for campaigns data
- Uses STAMP_TYPES constant for points values
- DashboardComponent updated with "How to Earn" link

### References

- [Source: docs/architecture.md#3.2] - State management patterns
- [Source: docs/architecture.md#3.4] - Component architecture
- [Source: docs/architecture.md#4.2] - CSS naming conventions (BEM-kebab)
- [Source: docs/architecture.md#4.8] - Animation patterns
- [Source: docs/epics.md#story-55] - Original acceptance criteria (FR-GAME-004)
- [Source: docs/PRD.md#FR-GAME-004] - How to Earn Section requirements
- [Source: script.js#STAMP_TYPES] - Points values and stamp configuration
- [Source: docs/sprint-artifacts/5-4-active-campaigns-section.md] - Campaign integration patterns
- [Source: docs/sprint-artifacts/2-4-quick-actions-campaign-banner.md] - Quick actions structure

### Dependencies

**From Previous Stories:**
- StateManager (Story 1.1)
- Component base class (Story 1.1)
- Router with navigate() method (Story 1.1)
- DashboardComponent with quick actions (Story 2.4)
- DataService.getActiveCampaigns() (Story 5.4)
- STAMP_TYPES constant (Story 1.1)
- MOCK_CAMPAIGNS data (Story 5.4)
- CSS variables for colors, spacing, shadows
- Tabler Icons CDN

**Builds Upon:**
- Story 5.4: Uses getCampaignById() and getActiveCampaigns() methods
- Story 2.4: Adds link to quick actions area
- Story 4.2: Campaign filter integration (view-campaign-positions action)

**Creates Foundation For:**
- Future: Gamification onboarding flow
- Future: Points history detail view

### Testing Scenarios

1. **Modal Open/Close:**
   - Dashboard "How to Earn" link opens modal
   - X button closes modal
   - Backdrop click closes modal
   - Escape key closes modal
   - Animations play correctly (if motion not reduced)

2. **Points Breakdown:**
   - All 7 earning opportunities displayed
   - Icons match STAMP_TYPES colors
   - Points values correct and styled
   - Numbers display LTR

3. **Campaigns Section:**
   - Active campaigns show with icon, title, multiplier
   - Campaign click navigates to filtered positions
   - Empty state displays when no campaigns
   - Campaigns sorted correctly

4. **Tips Section:**
   - All 4 tips displayed with checkmarks
   - Hebrew text renders correctly

5. **CTAs:**
   - Primary CTA navigates to positions
   - Secondary CTA scrolls to campaigns on dashboard
   - Modal closes after navigation

6. **Responsive:**
   - Mobile: Full-screen slide-up modal
   - Tablet: Centered modal with overlay
   - Desktop: Constrained width modal

7. **Accessibility:**
   - Focus trapped in modal
   - Keyboard navigation works
   - Screen reader announces correctly
   - Focus indicators visible

8. **Reduced Motion:**
   - Animations disabled/instant
   - Functionality preserved

9. **State Integration:**
   - Campaigns data from dataService
   - Points from STAMP_TYPES
   - Navigation via router.navigate()

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete - state management, component patterns, CSS naming)
- docs/epics.md (complete - Epic 5, Story 5.5 full acceptance criteria)
- docs/PRD.md (FR-GAME-004 requirements)
- script.js (STAMP_TYPES constant lines 69-158)
- docs/sprint-artifacts/5-4-active-campaigns-section.md (previous story patterns, DataService methods)
- docs/sprint-artifacts/2-4-quick-actions-campaign-banner.md (dashboard quick actions)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode

### Debug Log References

No issues encountered during implementation.

### Completion Notes List

- **Task 1:** Added "איך להרוויח עוד?" button in DashboardComponent._renderQuickActions() with proper styling and data-action="open-how-to-earn"
- **Task 2:** Created HowToEarnComponent class extending Component with full template and lifecycle methods
- **Task 3:** Points breakdown section displays all 7 earning opportunities from STAMP_TYPES with color-coded icons and LTR points display
- **Task 4:** Campaigns section uses _getActiveCampaigns() to filter MOCK_CAMPAIGNS, handles empty state with "אין קמפיינים פעילים כרגע"
- **Task 5:** Tips section renders 4 tips with checkmark icons in Hebrew
- **Task 6:** Primary CTA navigates to positions, secondary CTA scrolls to campaigns on dashboard (conditionally shown)
- **Task 7:** Modal opens with animation, closes via X button, backdrop click, or Escape key
- **Task 8:** Responsive design: mobile slide-up full-screen, tablet/desktop centered modal with max-width
- **Task 9:** Full accessibility: aria-modal, aria-labelledby, focus trapping, keyboard navigation, prefers-reduced-motion support

### File List

**Files Created:**
- None (code goes in existing three files)

**Files Modified:**
- `script.js`:
  - Lines 3352-3641: Added HowToEarnComponent class (~290 lines)
  - Lines 11517-11630: Added action handlers for How to Earn modal (~114 lines)
  - Lines 3938-3944: Updated DashboardComponent._renderQuickActions() with "How to Earn" link (~7 lines)

- `style.css`:
  - Lines 7762-8149: Added complete How to Earn modal styles (~388 lines)
    - Base modal structure and animations
    - Header and close button styles
    - Body and section styles
    - Points breakdown styles with stamp colors
    - Campaigns list styles with multiplier badges
    - Tips list styles with checkmark icons
    - Footer and CTA styles
    - Quick actions link styles for dashboard
    - Responsive breakpoints (600px, 1024px)
    - Reduced motion media query

- `index.html`:
  - No changes needed (modal renders into existing #modal-container)

**Total Actual Lines:**
- JavaScript: ~411 lines added
- CSS: ~388 lines added

### Change Log

- **2025-12-11**: Story 5.5 implementation complete. Added HowToEarnComponent with points breakdown, campaigns section, tips, and CTAs. Full accessibility and responsive design implemented. All 9 tasks/18 ACs satisfied.

