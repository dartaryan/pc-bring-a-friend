# Story 5.1: Referral List with Filters

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to see all my submitted referrals with their status,
**So that** I can track each referral's progress.

## Acceptance Criteria

### AC1: Page Load and Heading
**Given** I navigate to `#referrals`
**When** the page loads
**Then** I see a "📋 ההפניות שלי" (My Referrals) heading
**And** the page renders with proper RTL layout
**And** the navigation shows referrals tab as active

### AC2: Tab Filter Navigation
**Given** I am on the referrals page
**When** I view the tab filters
**Then** I see tabs: "הכל" (All), "בתהליך" (In Progress), "גויסו ✓" (Hired), "נדחו" (Rejected)
**And** "הכל" is selected by default
**And** each tab shows a count of referrals in that status

### AC3: Tab Filter - All
**Given** I have submitted referrals
**When** "הכל" tab is active
**Then** all my referrals are displayed regardless of status
**And** referrals are sorted newest first (by submission date)

### AC4: Tab Filter - In Progress
**Given** I click the "בתהליך" (In Progress) tab
**When** the filter is applied
**Then** only referrals with status "הוגש", "בבדיקה", "בראיון", or "הצעה" are displayed
**And** the tab becomes visually highlighted
**And** the count updates to show filtered count

### AC5: Tab Filter - Hired
**Given** I click the "גויסו ✓" (Hired) tab
**When** the filter is applied
**Then** only referrals with status "גויס" are displayed
**And** the tab shows green styling for success state

### AC6: Tab Filter - Rejected
**Given** I click the "נדחו" (Rejected) tab
**When** the filter is applied
**Then** only referrals with status "נדחה" or "לא נבחר" are displayed
**And** the tab shows muted/gray styling

### AC7: Referral Card Content
**Given** I have submitted referrals
**When** I view the referral cards
**Then** each card shows:
  - Candidate name with avatar/initial (first letter)
  - Position title they were referred for
  - Date submitted (Hebrew format, e.g., "10 דצמבר 2025")
  - Current status badge (color-coded)
  - Brief progress indicator (horizontal pipeline mini-view)

### AC8: Status Badge - Submitted
**Given** a referral has status "הוגש" (Submitted)
**When** I view its badge
**Then** the badge is blue color (#0984E3)
**And** shows "📩 הוגש"
**And** displays with appropriate contrast

### AC9: Status Badge - Under Review
**Given** a referral has status "בבדיקה" (Under Review)
**When** I view its badge
**Then** the badge is orange/amber color (#F39C12)
**And** shows "👀 בבדיקה"

### AC10: Status Badge - Interview
**Given** a referral has status "בראיון" (Interview)
**When** I view its badge
**Then** the badge is purple color (#6C5CE7)
**And** shows "📞 בראיון"

### AC11: Status Badge - Hired
**Given** a referral has status "גויס" (Hired)
**When** I view its badge
**Then** the badge is green color (#22C55E)
**And** shows "🎉 גויס!"
**And** the card may have subtle celebration styling

### AC12: Status Badge - Rejected
**Given** a referral has status "נדחה" (Rejected)
**When** I view its badge
**Then** the badge is red/gray color
**And** shows "❌ לא נבחר"
**And** the card is slightly muted

### AC13: Empty State - No Referrals
**Given** I have no referrals
**When** the list loads
**Then** I see an empty state with encouraging message
**And** I see an illustration or icon
**And** I see a CTA button "הפנה את המועמד הראשון שלך" to submit first referral
**And** clicking the CTA navigates to `#positions`

### AC14: Empty State - No Filter Results
**Given** I have referrals but none match the selected filter
**When** the filtered list is empty
**Then** I see a filter-specific empty state (e.g., "אין הפניות בתהליך כרגע")
**And** I see a CTA to view all referrals or submit new one

### AC15: Card Click Navigation
**Given** I click on a referral card
**When** the action triggers
**Then** the referral detail modal opens (Story 5.3)
**And** the selectedReferral state is populated
**And** the activeModal state is set to 'referral-details'

### AC16: Accessibility
**Given** I use keyboard or screen reader
**When** navigating the referrals page
**Then** tab filters are keyboard accessible
**And** each tab has proper role="tab" and aria-selected
**And** referral cards are focusable and have descriptive aria-labels
**And** status badges have accessible text alternatives

### AC17: Responsive Layout - Mobile
**Given** I am on mobile (< 600px)
**When** I view the referrals list
**Then** cards are full width with appropriate padding
**And** tab filters are horizontally scrollable if needed
**And** touch targets are minimum 44×44px

### AC18: Responsive Layout - Desktop
**Given** I am on desktop (≥ 1024px)
**When** I view the referrals list
**Then** cards may display in a wider layout
**And** more information may be visible per card
**And** the pipeline indicator is more detailed

### AC19: Loading State
**Given** the referrals data is loading
**When** I view the page
**Then** I see skeleton placeholders for cards
**And** the tab filters show without counts initially
**And** the page doesn't jump when content loads

### AC20: Reduced Motion
**Given** I have prefers-reduced-motion: reduce enabled
**When** I interact with tabs or cards
**Then** animations are instant or minimal
**And** no jarring transitions occur

## Tasks / Subtasks

- [x] Task 1: Create ReferralsComponent class (AC: #1, #16)
  - [x] Create ReferralsComponent extending Component
  - [x] Implement template() with page structure
  - [x] Add proper ARIA landmarks and roles
  - [x] Set up state subscriptions for referrals data

- [x] Task 2: Implement tab filter navigation (AC: #2-6, #16)
  - [x] Create _renderTabFilters() method
  - [x] Implement filter state management (referralFilter key)
  - [x] Add tab click handlers via data-action
  - [x] Calculate and display counts per filter
  - [x] Style active tab state

- [x] Task 3: Implement referral card rendering (AC: #7)
  - [x] Create _renderReferralCard() method
  - [x] Display candidate avatar with initials
  - [x] Display candidate name and position
  - [x] Format and display submission date in Hebrew
  - [x] Include mini progress indicator

- [x] Task 4: Implement status badge system (AC: #8-12)
  - [x] Create _getStatusBadge() helper
  - [x] Define badge colors and icons for all statuses
  - [x] Apply proper color-coded styling
  - [x] Ensure accessible contrast ratios

- [x] Task 5: Implement empty states (AC: #13-14)
  - [x] Create _renderEmptyState() method
  - [x] Handle no referrals case with CTA
  - [x] Handle no filter results case
  - [x] Add appropriate illustrations/icons

- [x] Task 6: Wire card click to referral detail (AC: #15)
  - [x] Add data-action="view-referral-details" to cards
  - [x] Register action handler in App
  - [x] Set selectedReferral and activeModal state
  - [x] Prepare for Story 5.3 modal integration

- [x] Task 7: Add responsive CSS (AC: #17-18)
  - [x] Style mobile layout (< 600px)
  - [x] Style tablet layout (600-1023px)
  - [x] Style desktop layout (≥ 1024px)
  - [x] Make tabs horizontally scrollable on mobile

- [x] Task 8: Add loading and skeleton states (AC: #19)
  - [x] Create skeleton card CSS
  - [x] Show skeletons during initial load
  - [x] Handle loading state transitions

- [x] Task 9: Integrate with navigation and routing (AC: #1)
  - [x] Register 'referrals' route with Router
  - [x] Update bottom nav to highlight correct tab
  - [x] Handle deep linking to filtered views

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story creates the ReferralsComponent - a new main screen component that displays all user referrals with filtering capability.**

**Route Configuration:**

```javascript
// In Router routes configuration
const ROUTES = {
  // ... existing routes
  referrals: ReferralsComponent,
  referral: ReferralDetailComponent  // Future: Story 5.3
};
```

**State Keys Used:**

| Key | Type | Description |
|-----|------|-------------|
| `referrals` | Array | User's referral objects from mock data |
| `referralFilter` | String | Active filter: 'all', 'in-progress', 'hired', 'rejected' |
| `selectedReferral` | Object | Referral being viewed in detail modal |
| `activeModal` | String | 'referral-details' when modal open |

**State Structure for referralFilter:**

```javascript
// In StateManager initial state
const initialState = {
  // ... existing state
  referralFilter: 'all',  // 'all' | 'in-progress' | 'hired' | 'rejected'
  selectedReferral: null
};
```

**Referral Data Structure (from Mock Data):**

```javascript
// Referral object structure (already defined in MOCK_DATA)
const referral = {
  id: 'ref-001',           // Type-prefixed ID
  candidateName: 'דנה לוי', // Hebrew name
  candidateEmail: 'dana@email.com',
  candidatePhone: '050-1234567',
  relationship: 'חבר/ה קרוב/ה',
  positionId: 'pos-001',
  positionTitle: 'מפתח/ת Full Stack', // Denormalized for display
  positionDepartment: 'פיתוח',
  status: 'interview',      // submitted, review, interview, offer, hired, rejected
  statusHebrew: 'בראיון',
  submittedAt: '2025-12-01T10:00:00Z',
  updatedAt: '2025-12-08T14:30:00Z',
  timeline: [
    { status: 'submitted', date: '2025-12-01', points: 50 },
    { status: 'review', date: '2025-12-03', points: 0 },
    { status: 'interview', date: '2025-12-08', points: 100 }
  ],
  pointsEarned: 150,
  potentialPoints: 500
};
```

**Status Mapping:**

```javascript
const REFERRAL_STATUSES = {
  submitted: { 
    hebrew: 'הוגש', 
    icon: '📩', 
    color: '#0984E3',  // Blue
    filterGroup: 'in-progress'
  },
  review: { 
    hebrew: 'בבדיקה', 
    icon: '👀', 
    color: '#F39C12',  // Orange
    filterGroup: 'in-progress'
  },
  interview: { 
    hebrew: 'בראיון', 
    icon: '📞', 
    color: '#6C5CE7',  // Purple
    filterGroup: 'in-progress'
  },
  offer: { 
    hebrew: 'הצעה', 
    icon: '📝', 
    color: '#00B894',  // Teal
    filterGroup: 'in-progress'
  },
  hired: { 
    hebrew: 'גויס!', 
    icon: '🎉', 
    color: '#22C55E',  // Green
    filterGroup: 'hired'
  },
  rejected: { 
    hebrew: 'לא נבחר', 
    icon: '❌', 
    color: '#95A5A6',  // Gray
    filterGroup: 'rejected'
  }
};
```

**ReferralsComponent Implementation:**

```javascript
// ============================================
// COMPONENTS - Referrals (Story 5.1)
// ============================================

class ReferralsComponent extends Component {
  constructor(props) {
    super(props);
    this.referrals = [];
    this.filter = 'all';
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    return `
      <main class="referrals-page" id="referrals-page">
        ${this._renderHeader()}
        ${this._renderTabFilters()}
        ${this._renderContent()}
      </main>
    `;
  }
  
  /**
   * Renders page header
   * @returns {string} HTML string
   */
  _renderHeader() {
    return `
      <header class="page-header">
        <h1 class="page-header__title">📋 ההפניות שלי</h1>
      </header>
    `;
  }
  
  /**
   * Renders tab filter navigation
   * @returns {string} HTML string
   */
  _renderTabFilters() {
    const counts = this._calculateFilterCounts();
    const tabs = [
      { key: 'all', label: 'הכל', count: counts.all },
      { key: 'in-progress', label: 'בתהליך', count: counts.inProgress },
      { key: 'hired', label: 'גויסו ✓', count: counts.hired },
      { key: 'rejected', label: 'נדחו', count: counts.rejected }
    ];
    
    return `
      <nav class="referral-tabs" role="tablist" aria-label="סינון הפניות">
        ${tabs.map(tab => `
          <button class="referral-tab ${this.filter === tab.key ? 'referral-tab--active' : ''}"
                  role="tab"
                  aria-selected="${this.filter === tab.key}"
                  data-action="filter-referrals"
                  data-filter="${tab.key}">
            <span class="referral-tab__label">${tab.label}</span>
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
    const filteredReferrals = this._getFilteredReferrals();
    
    if (this.referrals.length === 0) {
      return this._renderEmptyState('no-referrals');
    }
    
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
    const statusInfo = REFERRAL_STATUSES[referral.status] || REFERRAL_STATUSES.submitted;
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
          ${this._renderMiniPipeline(referral.status)}
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
    const statusInfo = REFERRAL_STATUSES[status] || REFERRAL_STATUSES.submitted;
    
    return `
      <span class="referral-badge referral-badge--${status}"
            style="--badge-color: ${statusInfo.color}">
        <span aria-hidden="true">${statusInfo.icon}</span>
        <span>${statusInfo.hebrew}</span>
      </span>
    `;
  }
  
  /**
   * Renders mini pipeline progress indicator
   * @param {string} status - Current status
   * @returns {string} HTML string
   */
  _renderMiniPipeline(status) {
    const stages = ['submitted', 'review', 'interview', 'offer', 'hired'];
    const currentIndex = stages.indexOf(status);
    const isRejected = status === 'rejected';
    
    return `
      <div class="referral-pipeline-mini" aria-hidden="true">
        ${stages.map((stage, index) => {
          let stageClass = 'referral-pipeline-mini__stage';
          if (isRejected && index <= currentIndex) {
            stageClass += ' referral-pipeline-mini__stage--rejected';
          } else if (index < currentIndex) {
            stageClass += ' referral-pipeline-mini__stage--complete';
          } else if (index === currentIndex) {
            stageClass += ' referral-pipeline-mini__stage--current';
          }
          return `<span class="${stageClass}"></span>`;
        }).join('')}
      </div>
    `;
  }
  
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
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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
   * Lifecycle: Mount component
   */
  mount() {
    // Load initial data
    this.referrals = stateManager.getState('referrals') || [];
    this.filter = stateManager.getState('referralFilter') || 'all';
    
    // Subscribe to state changes
    this.subscribe('referrals', (referrals) => {
      this.referrals = referrals || [];
      this._rerender();
    });
    
    this.subscribe('referralFilter', (filter) => {
      this.filter = filter || 'all';
      this._rerender();
    });
    
    this.bindEvents();
  }
  
  /**
   * Re-renders component
   */
  _rerender() {
    const container = document.getElementById('referrals-page');
    if (container) {
      container.outerHTML = this.template();
      this.bindEvents();
    }
  }
  
  /**
   * Binds event handlers
   */
  bindEvents() {
    // Events handled via global event delegation (data-action)
    // Additional component-specific bindings if needed
    
    // Enable Enter key on cards for accessibility
    const cards = document.querySelectorAll('.referral-card');
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
   * Lifecycle: Unmount component
   */
  unmount() {
    super.unmount();
  }
}
```

**Action Handlers (add to ACTION HANDLERS section):**

```javascript
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

// Navigate to positions from empty state
app.registerAction('navigate-positions', () => {
  router.navigate('positions');
});
```

**Router Registration:**

```javascript
// Add to Router configuration
const ROUTES = {
  auth: LoginComponent,
  passport: PassportComponent,
  dashboard: DashboardComponent,
  positions: PositionsComponent,
  referrals: ReferralsComponent,  // Story 5.1
  settings: SettingsComponent
};
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   REFERRALS PAGE - Story 5.1
   ========================================================================= */

.referrals-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--color-background);
}

/* =========================================================================
   PAGE HEADER
   ========================================================================= */

.page-header {
  padding: var(--space-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.page-header__title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

/* =========================================================================
   TAB FILTERS
   ========================================================================= */

.referral-tabs {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.referral-tabs::-webkit-scrollbar {
  display: none;
}

.referral-tab {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-height: 44px;
}

.referral-tab:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.referral-tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.referral-tab--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.referral-tab--active:hover {
  background: var(--color-primary-hover);
  color: white;
}

.referral-tab__label {
  /* Label text */
}

.referral-tab__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 var(--space-1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  direction: ltr;
  unicode-bidi: isolate;
}

.referral-tab--active .referral-tab__count {
  background: rgba(255, 255, 255, 0.2);
}

/* =========================================================================
   REFERRAL LIST
   ========================================================================= */

.referral-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
}

/* =========================================================================
   REFERRAL CARD
   ========================================================================= */

.referral-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.referral-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.referral-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.referral-card--rejected {
  opacity: 0.7;
}

.referral-card--hired {
  border-inline-start: 3px solid var(--color-success);
}

/* Avatar */
.referral-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--avatar-color, var(--color-primary));
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

/* Content */
.referral-card__content {
  flex: 1;
  min-width: 0;
}

.referral-card__candidate-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.referral-card__position {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.referral-card__date {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: 0;
}

.referral-card__date .ti {
  font-size: 0.875rem;
}

/* Status area */
.referral-card__status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-2);
  flex-shrink: 0;
}

/* Chevron */
.referral-card__chevron {
  color: var(--text-muted);
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* =========================================================================
   REFERRAL BADGE
   ========================================================================= */

.referral-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: color-mix(in srgb, var(--badge-color) 15%, transparent);
  color: var(--badge-color);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  white-space: nowrap;
}

.referral-badge--hired {
  background: rgba(34, 197, 94, 0.15);
  color: var(--color-success);
}

.referral-badge--rejected {
  background: rgba(149, 165, 166, 0.15);
  color: var(--text-muted);
}

/* =========================================================================
   MINI PIPELINE
   ========================================================================= */

.referral-pipeline-mini {
  display: flex;
  align-items: center;
  gap: 2px;
}

.referral-pipeline-mini__stage {
  width: 8px;
  height: 8px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  transition: background 0.2s ease;
}

.referral-pipeline-mini__stage--complete {
  background: var(--color-success);
}

.referral-pipeline-mini__stage--current {
  background: var(--color-primary);
  animation: pulse 2s infinite;
}

.referral-pipeline-mini__stage--rejected {
  background: var(--color-border);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* =========================================================================
   EMPTY STATE
   ========================================================================= */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-8) var(--space-4);
  min-height: 300px;
}

.empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(225, 5, 20, 0.1);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
}

.empty-state__icon .ti {
  font-size: 2.5rem;
}

.empty-state__icon--small {
  width: 60px;
  height: 60px;
}

.empty-state__icon--small .ti {
  font-size: 1.75rem;
}

.empty-state__title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
}

.empty-state__description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0 0 var(--space-4);
  max-width: 300px;
}

.empty-state--filter {
  min-height: 200px;
  padding: var(--space-6) var(--space-4);
}

.empty-state--filter .empty-state__icon {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-muted);
}

/* =========================================================================
   SKELETON LOADING (Story 5.1 Task 8)
   ========================================================================= */

.referral-card--skeleton {
  pointer-events: none;
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-secondary) 25%,
    var(--color-border) 50%,
    var(--color-surface-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton--avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
}

.skeleton--text {
  height: 16px;
  width: 100%;
}

.skeleton--text-sm {
  height: 12px;
  width: 60%;
}

.skeleton--badge {
  height: 24px;
  width: 80px;
  border-radius: var(--radius-full);
}

/* =========================================================================
   RESPONSIVE - Tablet (600px+)
   ========================================================================= */

@media (min-width: 600px) {
  .referral-list {
    padding: var(--space-6);
    gap: var(--space-4);
  }
  
  .referral-card {
    padding: var(--space-5);
  }
  
  .referral-card__avatar {
    width: 56px;
    height: 56px;
    font-size: var(--text-xl);
  }
}

/* =========================================================================
   RESPONSIVE - Desktop (1024px+)
   ========================================================================= */

@media (min-width: 1024px) {
  .referrals-page {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .referral-tabs {
    justify-content: center;
  }
  
  .referral-card {
    gap: var(--space-4);
  }
  
  .referral-card__content {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: var(--space-4);
  }
  
  .referral-card__position,
  .referral-card__date {
    margin: 0;
    white-space: nowrap;
  }
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .referral-card {
    transition: none;
  }
  
  .referral-pipeline-mini__stage--current {
    animation: none;
  }
  
  .skeleton {
    animation: none;
    background: var(--color-surface-secondary);
  }
}
```

### Mock Data - Referrals (ensure exists in MOCK_DATA)

```javascript
// ============================================
// MOCK DATA - Referrals (Story 5.1)
// ============================================

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
```

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- ReferralsComponent renders to `#app` container via Router
- Component uses state subscription for reactive updates
- Events handled via global event delegation with data-action attributes

### References

- [Source: docs/architecture.md#3.2] - State management patterns
- [Source: docs/architecture.md#3.4] - Component architecture
- [Source: docs/architecture.md#4.2] - CSS naming conventions
- [Source: docs/epics.md#story-51] - Original acceptance criteria
- [Source: docs/PRD.md#FR-TRACK-001] - Referral list requirements
- [Source: docs/project_context.md] - Implementation rules and patterns

### Dependencies

**From Previous Stories:**
- StateManager with referrals state key (Story 1.1/1.4)
- Component base class (Story 1.1)
- Router with route registration (Story 1.1/1.5)
- Button styles (.btn, .btn--primary) (Story 1.2)
- Navigation component highlighting current route (Story 1.5)
- MOCK_REFERRALS data structure

**Creates Foundation For:**
- Story 5.2: Status Visualization Pipeline (pipeline mini-view expands)
- Story 5.3: Referral Detail Modal (view-referral-details action)

### Testing Scenarios

1. **Page Load:**
   - Navigate to #referrals → Page loads with heading
   - Tab filters display with counts
   - All referrals visible by default

2. **Tab Filtering:**
   - Click "בתהליך" → Only in-progress referrals shown
   - Click "גויסו ✓" → Only hired referrals shown
   - Click "נדחו" → Only rejected referrals shown
   - Click "הכל" → All referrals restored

3. **Card Display:**
   - Each card shows avatar, name, position, date
   - Status badge has correct color and icon
   - Mini pipeline shows correct progress

4. **Empty States:**
   - No referrals → "הפנה את המועמד הראשון" CTA shown
   - No filter results → "אין הפניות בתהליך" message shown

5. **Card Interaction:**
   - Click card → selectedReferral state set
   - activeModal set to 'referral-details' (for Story 5.3)

6. **Accessibility:**
   - Tabs have role="tab" and aria-selected
   - Cards are keyboard focusable
   - Enter/Space activates focused card

7. **Responsive:**
   - Mobile: Full-width cards, scrollable tabs
   - Desktop: Centered layout, wider cards

8. **Reduced Motion:**
   - Animations disabled or minimal

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete - state management, component patterns, CSS naming)
- docs/epics.md (complete - Epic 5, Story 5.1 full acceptance criteria)
- docs/PRD.md (FR-TRACK-001 requirements)
- docs/project_context.md (implementation rules, naming conventions)
- docs/sprint-artifacts/4-3-position-details-modal.md (component patterns reference)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode

### Debug Log References

- No issues encountered during implementation

### Completion Notes List

- ✅ Implemented ReferralsComponent with full template structure and ARIA landmarks
- ✅ Added REFERRAL_STATUS_CONFIG constant with all 6 status configurations (submitted, review, interview, offer, hired, rejected)
- ✅ Added MOCK_REFERRALS with 6 sample referrals covering all status types
- ✅ Implemented tab filter navigation with counts and keyboard accessibility
- ✅ Implemented referral card rendering with avatar initials, Hebrew date formatting, status badges, and mini pipeline
- ✅ Implemented empty states for both no-referrals and no-filter-results scenarios
- ✅ Added action handlers for filter-referrals and view-referral-details
- ✅ Added comprehensive CSS with skeleton loading states and reduced motion support
- ✅ Added responsive layouts for mobile, tablet, and desktop
- ✅ Registered ReferralsComponent and ReferralConfirmationComponent with App
- ✅ Added referralFilter and selectedReferral to StateManager initial state

### Change Log

- 2025-12-11: Story 5.1 implementation complete - Referrals page with filtering, cards, badges, empty states, and responsive layout

### File List

**Files Modified:**
- `script.js`:
  - Added REFERRAL_STATUS_CONFIG constant (lines ~159-205)
  - Added MOCK_REFERRALS mock data (lines ~210-330)
  - Added referralFilter and selectedReferral to StateManager._getInitialState()
  - Added ReferralsComponent class (~400 lines)
  - Added filter-referrals and view-referral-details action handlers
  - Registered ReferralsComponent and ReferralConfirmationComponent

- `style.css`:
  - Added referrals page header styles
  - Added tab filter styles with active states
  - Added referral card styles with status modifiers
  - Added referral badge styles
  - Added mini pipeline progress indicator styles
  - Added empty state styles
  - Added skeleton loading animation styles
  - Added responsive breakpoints (600px, 1024px)
  - Added reduced motion media query

- `docs/sprint-artifacts/sprint-status.yaml`:
  - Updated 5-1-referral-list-with-filters status to review

**Files Verified:**
- `index.html` - #app container exists ✓

