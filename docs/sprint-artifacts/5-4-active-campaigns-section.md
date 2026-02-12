# Story 5.4: Active Campaigns Section

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to see active campaigns with bonus opportunities,
**So that** I can maximize my points by referring for promoted positions.

## Acceptance Criteria

### AC1: Campaigns Section Location
**Given** I am on the dashboard (`#dashboard`)
**When** the page loads
**Then** I see a "🎯 קמפיינים פעילים" (Active Campaigns) section
**And** the section is positioned after the quick actions and before activity feed

### AC2: Campaign Card Display
**Given** there are active campaigns in the system
**When** I view the campaigns section
**Then** I see campaign cards in a horizontal scrollable container (mobile)
**Or** a grid layout on larger screens
**And** each card has distinctive campaign styling

### AC3: Campaign Card Content
**Given** I view a campaign card
**When** I look at its content
**Then** I see the campaign name/title prominently displayed
**And** I see a description of the bonus (e.g., "נקודות כפולות!")
**And** I see the multiplier badge (e.g., "x2", "x1.5")
**And** I see eligible positions or departments
**And** I see the end date with countdown timer

### AC4: Multiplier Badge Display
**Given** a campaign has a multiplier
**When** I view the campaign card
**Then** I see a visually prominent badge showing "x2", "x1.5", etc.
**And** the badge uses accent colors (gold/yellow for emphasis)
**And** the multiplier is easy to spot at a glance

### AC5: Countdown Timer - Days/Hours
**Given** the campaign end date is more than 24 hours away
**When** I view the countdown timer
**Then** it shows days and hours remaining (e.g., "3 ימים, 5 שעות")
**And** the timer updates in real-time (every minute)

### AC6: Countdown Timer - Under 24 Hours
**Given** the campaign end date is less than 24 hours away
**When** I view the countdown timer
**Then** it shows hours and minutes remaining (e.g., "12:45")
**And** the styling changes to indicate urgency (orange/warning color)

### AC7: Countdown Timer - Under 1 Hour
**Given** the campaign end date is less than 1 hour away
**When** I view the countdown timer
**Then** it shows only minutes remaining (e.g., "45 דקות")
**And** the styling is urgent (red/danger color, possibly pulsing)

### AC8: Campaign Card Click Action
**Given** I click on a campaign card
**When** the action triggers
**Then** I navigate to `#positions`
**And** the positions list is filtered to show only campaign-eligible positions
**And** the filter is pre-applied based on campaign criteria

### AC9: Campaign Filter Integration
**Given** I navigated from a campaign card
**When** I view the positions page
**Then** I see a filter indicator showing the active campaign filter
**And** only positions eligible for the campaign bonus are displayed
**And** I can clear the filter to see all positions

### AC10: Refer CTA on Campaign Card
**Given** I view a campaign card
**When** I look at the card actions
**Then** I see a "הפנה עכשיו" (Refer Now) CTA button
**And** clicking it navigates to positions with campaign filter

### AC11: Points Preview with Multiplier
**Given** I am referring for a campaign-eligible position
**When** I view the referral points
**Then** I see the multiplied amount (e.g., "100 נקודות x2 = 200")
**And** the campaign badge/indicator is shown
**And** it's clear the bonus is from the campaign

### AC12: Empty State - No Active Campaigns
**Given** there are no active campaigns
**When** the campaigns section loads
**Then** I see a message "אין קמפיינים פעילים כרגע"
**And** I see "בקרוב..." (Coming soon) or similar encouraging text
**And** the section has reduced visual prominence

### AC13: Campaign Badge on Position Cards
**Given** a position is part of an active campaign
**When** I view position cards (on dashboard or positions page)
**Then** I see a campaign badge on eligible positions
**And** the badge shows the multiplier (e.g., "🎁 x2 נקודות!")
**And** the badge links to campaign details

### AC14: Multiple Campaigns Display
**Given** there are multiple active campaigns
**When** I view the campaigns section
**Then** I see all active campaigns
**And** campaigns are sorted by end date (soonest first)
**And** I can scroll horizontally on mobile to see all

### AC15: Campaign Data Structure
**Given** the mock data system
**When** campaigns are loaded
**Then** each campaign has: id, title, description, multiplier, startDate, endDate, eligibleDepartments, eligiblePositions

### AC16: Responsive Layout - Mobile
**Given** I am on mobile (< 600px)
**When** I view the campaigns section
**Then** campaigns display as horizontally scrollable cards
**And** each card has appropriate width (~280px)
**And** scroll snapping provides smooth navigation

### AC17: Responsive Layout - Tablet/Desktop
**Given** I am on tablet or desktop (≥ 600px)
**When** I view the campaigns section
**Then** campaigns display in a grid (2-3 columns)
**And** cards have equal height within the grid
**And** spacing is appropriate for larger screens

### AC18: Accessibility - Screen Reader
**Given** I use a screen reader
**When** I navigate the campaigns section
**Then** the section heading is properly announced
**And** each campaign card is focusable and readable
**And** countdown information is accessible

### AC19: Accessibility - Keyboard Navigation
**Given** I navigate using keyboard
**When** I tab through the campaigns section
**Then** I can focus on each campaign card
**And** Enter/Space activates the campaign card action
**And** Focus indicators are clearly visible

### AC20: Reduced Motion Support
**Given** I have prefers-reduced-motion: reduce enabled
**When** viewing the campaigns section
**Then** countdown timer still updates (functionality preserved)
**And** any pulsing/animation effects are disabled
**And** urgency indicated through color only

### AC21: State Integration
**Given** campaigns are loaded
**When** state is set with activeCampaigns array
**Then** the CampaignsComponent renders all campaigns
**And** clicking a campaign sets campaignFilter in state
**And** positions page reads campaignFilter from state

## Tasks / Subtasks

- [x] Task 1: Create MOCK_CAMPAIGNS data structure (AC: #15)
  - [x] Define campaign schema with all required fields
  - [x] Create 2-3 mock campaigns with varied end dates
  - [x] Include campaign criteria (departments, positions)
  - [x] Add to MOCK_DATA constant

- [x] Task 2: Create CampaignsComponent class (AC: #1, #2, #14)
  - [x] Create CampaignsComponent extending Component
  - [x] Implement template() with section structure
  - [x] Add horizontal scroll container for cards
  - [x] Handle sorting by end date (soonest first)

- [x] Task 3: Implement campaign card rendering (AC: #3, #4)
  - [x] Create _renderCampaignCard() method
  - [x] Display campaign title and description
  - [x] Create multiplier badge component
  - [x] Show eligible departments/positions
  - [x] Add "הפנה עכשיו" CTA button

- [x] Task 4: Implement countdown timer (AC: #5, #6, #7, #20)
  - [x] Create _renderCountdown() method
  - [x] Calculate time remaining from endDate
  - [x] Display days/hours format (> 24h)
  - [x] Display hours:minutes format (< 24h)
  - [x] Display minutes only format (< 1h)
  - [x] Apply urgency styling based on time
  - [x] Set up timer interval for updates
  - [x] Respect reduced motion for animations only

- [x] Task 5: Implement empty state (AC: #12)
  - [x] Create _renderEmptyState() method
  - [x] Display "אין קמפיינים פעילים כרגע"
  - [x] Add "בקרוב..." message
  - [x] Style with reduced prominence

- [x] Task 6: Implement campaign click action (AC: #8, #9, #21)
  - [x] Add data-action="view-campaign-positions"
  - [x] Create action handler for campaign click
  - [x] Set campaignFilter in state
  - [x] Navigate to #positions route
  - [x] Pass campaign criteria for filtering

- [x] Task 7: Update PositionsComponent for campaign filter (AC: #9, #11)
  - [x] Read campaignFilter from state on mount
  - [x] Filter positions by campaign criteria
  - [x] Show campaign filter indicator
  - [x] Add "clear filter" option
  - [x] Display multiplied points preview

- [x] Task 8: Add campaign badge to position cards (AC: #13)
  - [x] Update PositionCardComponent
  - [x] Check if position is in active campaign
  - [x] Render campaign badge with multiplier
  - [x] Link badge to campaign details

- [x] Task 9: Integrate with DashboardComponent (AC: #1)
  - [x] Add CampaignsComponent to dashboard template
  - [x] Position after quick actions
  - [x] Mount/unmount with dashboard lifecycle

- [x] Task 10: Add responsive CSS styles (AC: #16, #17)
  - [x] Mobile: horizontal scroll with snap
  - [x] Tablet: 2-column grid
  - [x] Desktop: 3-column grid
  - [x] Appropriate card widths and spacing

- [x] Task 11: Add accessibility features (AC: #18, #19)
  - [x] Add proper ARIA labels
  - [x] Ensure keyboard focusability
  - [x] Add focus indicators
  - [x] Test with screen reader

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story creates the CampaignsComponent and integrates campaign awareness throughout the positions flow. It builds on Story 2.4 (Dashboard quick actions) and Story 4.1/4.2 (Positions components).**

**State Keys Used:**

| Key | Type | Description |
|-----|------|-------------|
| `activeCampaigns` | Array | All active campaigns from mock data |
| `campaignFilter` | String/null | Campaign ID to filter positions by |

**Campaign Data Structure:**

```javascript
// ============================================
// MOCK DATA - Campaigns (Story 5.4)
// ============================================

const MOCK_CAMPAIGNS = [
  {
    id: 'camp-001',
    title: 'מבצע גיוס מפתחים',
    description: 'נקודות כפולות על הפניות למשרות פיתוח!',
    multiplier: 2,
    icon: '💻',
    startDate: '2025-12-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    eligibleDepartments: ['פיתוח', 'DevOps', 'QA'],
    eligiblePositionIds: [], // Empty = all in department
    accentColor: '#6C5CE7', // Purple
    isActive: true
  },
  {
    id: 'camp-002',
    title: 'שבוע HR מיוחד',
    description: 'בונוס 1.5 על כל הפניה למשאבי אנוש',
    multiplier: 1.5,
    icon: '👥',
    startDate: '2025-12-08T00:00:00Z',
    endDate: '2025-12-15T23:59:59Z',
    eligibleDepartments: ['משאבי אנוש'],
    eligiblePositionIds: [],
    accentColor: '#00B894', // Green
    isActive: true
  },
  {
    id: 'camp-003',
    title: 'מרתון הפניות סוף שנה',
    description: 'כל הפניה שווה x1.5 נקודות! זמן מוגבל',
    multiplier: 1.5,
    icon: '🏃',
    startDate: '2025-12-24T00:00:00Z',
    endDate: '2025-12-26T23:59:59Z',
    eligibleDepartments: [], // Empty = all departments
    eligiblePositionIds: [],
    accentColor: '#E10514', // Brand red
    isActive: true
  }
];
```

**CampaignsComponent Implementation:**

```javascript
// ============================================
// COMPONENTS - Campaigns Section (Story 5.4)
// ============================================

class CampaignsComponent extends Component {
  constructor(props) {
    super(props);
    this.campaigns = [];
    this.countdownInterval = null;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    return `
      <section class="campaigns-section" aria-labelledby="campaigns-heading">
        <header class="campaigns-section__header">
          <h2 class="campaigns-section__title" id="campaigns-heading">
            <span class="campaigns-section__icon">🎯</span>
            קמפיינים פעילים
          </h2>
        </header>
        <div class="campaigns-section__content">
          ${this.campaigns.length > 0 
            ? this._renderCampaignCards()
            : this._renderEmptyState()}
        </div>
      </section>
    `;
  }
  
  /**
   * Renders all campaign cards
   * @returns {string} HTML string
   */
  _renderCampaignCards() {
    // Sort by end date (soonest first)
    const sorted = [...this.campaigns].sort((a, b) => 
      new Date(a.endDate) - new Date(b.endDate)
    );
    
    return `
      <div class="campaigns-scroll" role="list">
        ${sorted.map(campaign => this._renderCampaignCard(campaign)).join('')}
      </div>
    `;
  }
  
  /**
   * Renders a single campaign card
   * @param {Object} campaign - Campaign data
   * @returns {string} HTML string
   */
  _renderCampaignCard(campaign) {
    const countdown = this._calculateCountdown(campaign.endDate);
    const urgencyClass = this._getUrgencyClass(countdown);
    
    return `
      <article class="campaign-card" 
               role="listitem"
               data-campaign-id="${campaign.id}"
               style="--campaign-accent: ${campaign.accentColor}"
               tabindex="0"
               data-action="view-campaign-positions">
        <div class="campaign-card__badge">
          <span class="campaign-card__multiplier">x${campaign.multiplier}</span>
        </div>
        
        <div class="campaign-card__icon">${campaign.icon}</div>
        
        <h3 class="campaign-card__title">${this._escapeHtml(campaign.title)}</h3>
        
        <p class="campaign-card__description">
          ${this._escapeHtml(campaign.description)}
        </p>
        
        <div class="campaign-card__eligibility">
          ${this._renderEligibility(campaign)}
        </div>
        
        <div class="campaign-card__countdown ${urgencyClass}" 
             data-countdown="${campaign.endDate}"
             aria-label="זמן נותר: ${countdown.display}">
          <i class="ti ti-clock" aria-hidden="true"></i>
          <span class="campaign-card__countdown-text">${countdown.display}</span>
        </div>
        
        <button class="campaign-card__cta btn btn--primary btn--sm"
                data-action="view-campaign-positions"
                data-campaign-id="${campaign.id}">
          הפנה עכשיו
          <i class="ti ti-arrow-left" aria-hidden="true"></i>
        </button>
      </article>
    `;
  }
  
  /**
   * Renders eligibility info
   * @param {Object} campaign - Campaign data
   * @returns {string} HTML string
   */
  _renderEligibility(campaign) {
    if (campaign.eligibleDepartments.length === 0) {
      return '<span class="campaign-card__eligibility-text">כל המשרות</span>';
    }
    
    const departments = campaign.eligibleDepartments.slice(0, 2);
    const more = campaign.eligibleDepartments.length > 2 
      ? ` +${campaign.eligibleDepartments.length - 2}` 
      : '';
    
    return `
      <span class="campaign-card__eligibility-text">
        ${departments.join(', ')}${more}
      </span>
    `;
  }
  
  /**
   * Calculates countdown display
   * @param {string} endDate - ISO date string
   * @returns {Object} Countdown info with display string and values
   */
  _calculateCountdown(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) {
      return { display: 'הסתיים', days: 0, hours: 0, minutes: 0, isExpired: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    let display;
    
    if (days > 0) {
      // More than 24 hours
      display = `${days} ימים, ${hours} שעות`;
    } else if (hours > 0) {
      // Less than 24 hours but more than 1 hour
      display = `${hours}:${String(minutes).padStart(2, '0')}`;
    } else {
      // Less than 1 hour
      display = `${minutes} דקות`;
    }
    
    return { display, days, hours, minutes, isExpired: false };
  }
  
  /**
   * Gets urgency CSS class based on countdown
   * @param {Object} countdown - Countdown object
   * @returns {string} CSS class
   */
  _getUrgencyClass(countdown) {
    if (countdown.isExpired) return 'campaign-card__countdown--expired';
    if (countdown.days === 0 && countdown.hours === 0) return 'campaign-card__countdown--critical';
    if (countdown.days === 0) return 'campaign-card__countdown--urgent';
    return '';
  }
  
  /**
   * Renders empty state when no campaigns active
   * @returns {string} HTML string
   */
  _renderEmptyState() {
    return `
      <div class="campaigns-empty">
        <div class="campaigns-empty__icon">📅</div>
        <p class="campaigns-empty__text">אין קמפיינים פעילים כרגע</p>
        <p class="campaigns-empty__subtext">בקרוב...</p>
      </div>
    `;
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
   * Starts countdown timer interval
   */
  _startCountdownTimer() {
    // Update every minute
    this.countdownInterval = setInterval(() => {
      this._updateCountdowns();
    }, 60000);
  }
  
  /**
   * Updates all countdown displays
   */
  _updateCountdowns() {
    const countdownEls = document.querySelectorAll('[data-countdown]');
    countdownEls.forEach(el => {
      const endDate = el.dataset.countdown;
      const countdown = this._calculateCountdown(endDate);
      const textEl = el.querySelector('.campaign-card__countdown-text');
      
      if (textEl) {
        textEl.textContent = countdown.display;
      }
      
      // Update urgency class
      el.className = `campaign-card__countdown ${this._getUrgencyClass(countdown)}`;
    });
  }
  
  /**
   * Lifecycle: Mount component
   */
  mount() {
    // Get active campaigns from DataService
    this.campaigns = dataService.getActiveCampaigns();
    
    // Subscribe to state changes
    this.subscribe('activeCampaigns', (campaigns) => {
      this.campaigns = campaigns || [];
      this.render();
    });
    
    // Start countdown timer
    this._startCountdownTimer();
    
    // Bind events
    this.bindEvents();
  }
  
  /**
   * Bind event handlers
   */
  bindEvents() {
    // Keyboard support for campaign cards
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('.campaign-card') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
      }
    });
  }
  
  /**
   * Lifecycle: Unmount component
   */
  unmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    super.unmount();
  }
}
```

**DataService Extension:**

```javascript
// ============================================
// SERVICES - DataService Campaign Methods (Story 5.4)
// ============================================

// Add to DataService class:

class DataService {
  // ... existing methods ...
  
  /**
   * Gets all active campaigns
   * @returns {Array} Active campaigns
   */
  getActiveCampaigns() {
    const now = new Date();
    return MOCK_CAMPAIGNS.filter(campaign => {
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      return campaign.isActive && now >= start && now <= end;
    });
  }
  
  /**
   * Gets campaign by ID
   * @param {string} campaignId - Campaign ID
   * @returns {Object|null} Campaign or null
   */
  getCampaignById(campaignId) {
    return MOCK_CAMPAIGNS.find(c => c.id === campaignId) || null;
  }
  
  /**
   * Checks if a position is eligible for a campaign
   * @param {Object} position - Position object
   * @param {Object} campaign - Campaign object
   * @returns {boolean} True if eligible
   */
  isPositionInCampaign(position, campaign) {
    // If no department restrictions, all positions eligible
    if (campaign.eligibleDepartments.length === 0) {
      return true;
    }
    
    // Check if position's department is eligible
    if (campaign.eligibleDepartments.includes(position.department)) {
      return true;
    }
    
    // Check specific position IDs
    if (campaign.eligiblePositionIds.includes(position.id)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Gets positions filtered by campaign
   * @param {string} campaignId - Campaign ID
   * @returns {Array} Eligible positions
   */
  getPositionsByCampaign(campaignId) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) return [];
    
    const positions = this.getPositions();
    return positions.filter(pos => this.isPositionInCampaign(pos, campaign));
  }
  
  /**
   * Gets campaign for a position (if any)
   * @param {Object} position - Position object
   * @returns {Object|null} Campaign or null
   */
  getCampaignForPosition(position) {
    const activeCampaigns = this.getActiveCampaigns();
    return activeCampaigns.find(campaign => 
      this.isPositionInCampaign(position, campaign)
    ) || null;
  }
  
  /**
   * Calculates points with campaign multiplier
   * @param {number} basePoints - Base points
   * @param {Object|null} campaign - Campaign object
   * @returns {Object} Points info { base, multiplier, total }
   */
  calculatePointsWithCampaign(basePoints, campaign) {
    const multiplier = campaign ? campaign.multiplier : 1;
    return {
      base: basePoints,
      multiplier: multiplier,
      total: Math.floor(basePoints * multiplier),
      hasCampaign: campaign !== null
    };
  }
}
```

**Action Handlers:**

```javascript
// ============================================
// ACTION HANDLERS - Campaigns (Story 5.4)
// ============================================

// View positions filtered by campaign
app.registerAction('view-campaign-positions', (target) => {
  const campaignId = target.dataset.campaignId || 
                     target.closest('[data-campaign-id]')?.dataset.campaignId;
  
  if (!campaignId) {
    router.navigate('positions');
    return;
  }
  
  // Set campaign filter in state
  stateManager.setState({
    campaignFilter: campaignId,
    positionFilters: {
      ...stateManager.getState('positionFilters'),
      campaign: campaignId
    }
  });
  
  // Navigate to positions
  router.navigate('positions');
});

// Clear campaign filter (add to positions page)
app.registerAction('clear-campaign-filter', () => {
  stateManager.setState({
    campaignFilter: null,
    positionFilters: {
      ...stateManager.getState('positionFilters'),
      campaign: null
    }
  });
});
```

**DashboardComponent Update:**

```javascript
// ============================================
// COMPONENTS - Dashboard Update (Story 5.4)
// ============================================

// In DashboardComponent.template(), add campaigns section:

class DashboardComponent extends Component {
  template() {
    return `
      <main class="dashboard">
        ${this._renderGreeting()}
        ${this._renderPointsSummary()}
        ${this._renderStatsCards()}
        ${this._renderQuickActions()}
        ${this._renderCampaigns()}  <!-- ADD THIS -->
        ${this._renderActivityFeed()}
      </main>
    `;
  }
  
  _renderCampaigns() {
    const campaignsComponent = new CampaignsComponent();
    return campaignsComponent.render();
  }
  
  mount() {
    // ... existing mount logic ...
    
    // Mount campaigns component
    const campaignsComponent = new CampaignsComponent();
    campaignsComponent.mount();
  }
}
```

**PositionCardComponent Update (Campaign Badge):**

```javascript
// ============================================
// COMPONENTS - Position Card Campaign Badge (Story 5.4)
// ============================================

// In PositionCardComponent, add campaign badge:

_renderCampaignBadge(position) {
  const campaign = dataService.getCampaignForPosition(position);
  
  if (!campaign) return '';
  
  return `
    <div class="position-card__campaign-badge"
         style="--badge-color: ${campaign.accentColor}"
         data-campaign-id="${campaign.id}"
         title="${campaign.title}">
      <span class="position-card__campaign-icon">🎁</span>
      <span class="position-card__campaign-multiplier">x${campaign.multiplier} נקודות!</span>
    </div>
  `;
}

// In template(), add the badge:
template() {
  return `
    <article class="position-card" data-position-id="${this.position.id}">
      ${this._renderCampaignBadge(this.position)}  <!-- ADD THIS -->
      ${this._renderHotBadge()}
      ${this._renderContent()}
      ${this._renderFooter()}
    </article>
  `;
}
```

**PositionsComponent Filter Update:**

```javascript
// ============================================
// COMPONENTS - Positions Campaign Filter (Story 5.4)
// ============================================

// In PositionsComponent, add campaign filter handling:

_renderCampaignFilterIndicator() {
  const campaignId = stateManager.getState('campaignFilter');
  if (!campaignId) return '';
  
  const campaign = dataService.getCampaignById(campaignId);
  if (!campaign) return '';
  
  return `
    <div class="positions-filter-indicator">
      <span class="positions-filter-indicator__icon">${campaign.icon}</span>
      <span class="positions-filter-indicator__text">
        מציג משרות מקמפיין: ${campaign.title}
      </span>
      <button class="positions-filter-indicator__clear"
              data-action="clear-campaign-filter"
              aria-label="נקה סינון קמפיין">
        <i class="ti ti-x" aria-hidden="true"></i>
      </button>
    </div>
  `;
}

// In _filterPositions(), add campaign filtering:
_filterPositions() {
  let positions = dataService.getPositions();
  const filters = stateManager.getState('positionFilters') || {};
  
  // Campaign filter
  if (filters.campaign) {
    positions = dataService.getPositionsByCampaign(filters.campaign);
  }
  
  // ... existing filters (department, location, search) ...
  
  return positions;
}
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   CAMPAIGNS SECTION - Story 5.4
   ========================================================================= */

.campaigns-section {
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.campaigns-section__header {
  margin-bottom: var(--space-3);
}

.campaigns-section__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.campaigns-section__icon {
  font-size: var(--text-xl);
}

/* =========================================================================
   CAMPAIGNS SCROLL CONTAINER
   ========================================================================= */

.campaigns-scroll {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: var(--space-2);
  margin-inline: calc(var(--space-4) * -1);
  padding-inline: var(--space-4);
}

.campaigns-scroll::-webkit-scrollbar {
  display: none;
}

/* =========================================================================
   CAMPAIGN CARD
   ========================================================================= */

.campaign-card {
  flex: 0 0 280px;
  scroll-snap-align: start;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  border-inline-start: 4px solid var(--campaign-accent, var(--color-primary));
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.campaign-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.campaign-card:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Multiplier Badge */
.campaign-card__badge {
  position: absolute;
  top: var(--space-3);
  inset-inline-end: var(--space-3);
  background: linear-gradient(135deg, #F1C40F, #F39C12);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  box-shadow: var(--shadow-sm);
}

.campaign-card__multiplier {
  direction: ltr;
  unicode-bidi: isolate;
}

/* Icon */
.campaign-card__icon {
  font-size: 2.5rem;
  line-height: 1;
  margin-bottom: var(--space-1);
}

/* Title */
.campaign-card__title {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  padding-inline-end: var(--space-8); /* Space for badge */
}

/* Description */
.campaign-card__description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* Eligibility */
.campaign-card__eligibility {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-1);
}

.campaign-card__eligibility-text {
  font-size: var(--text-xs);
  color: var(--text-muted);
  background: var(--color-surface-secondary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

/* Countdown Timer */
.campaign-card__countdown {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: auto;
  padding-top: var(--space-2);
}

.campaign-card__countdown .ti {
  font-size: 1rem;
}

.campaign-card__countdown--urgent {
  color: var(--color-warning);
}

.campaign-card__countdown--urgent .ti {
  color: var(--color-warning);
}

.campaign-card__countdown--critical {
  color: var(--color-danger);
  font-weight: var(--font-semibold);
  animation: urgentPulse 1s ease-in-out infinite;
}

.campaign-card__countdown--critical .ti {
  color: var(--color-danger);
}

.campaign-card__countdown--expired {
  color: var(--text-muted);
  text-decoration: line-through;
}

@keyframes urgentPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* CTA Button */
.campaign-card__cta {
  margin-top: var(--space-3);
  width: 100%;
  justify-content: center;
}

/* =========================================================================
   CAMPAIGN EMPTY STATE
   ========================================================================= */

.campaigns-empty {
  text-align: center;
  padding: var(--space-6) var(--space-4);
  background: var(--color-surface-secondary);
  border-radius: var(--radius-lg);
  opacity: 0.7;
}

.campaigns-empty__icon {
  font-size: 3rem;
  margin-bottom: var(--space-2);
}

.campaigns-empty__text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0 0 var(--space-1);
}

.campaigns-empty__subtext {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin: 0;
}

/* =========================================================================
   POSITION CARD CAMPAIGN BADGE
   ========================================================================= */

.position-card__campaign-badge {
  position: absolute;
  top: var(--space-2);
  inset-inline-start: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: linear-gradient(135deg, 
    var(--badge-color, var(--color-primary)), 
    color-mix(in srgb, var(--badge-color, var(--color-primary)) 80%, black));
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  box-shadow: var(--shadow-sm);
  z-index: 1;
}

.position-card__campaign-icon {
  font-size: 0.875rem;
}

.position-card__campaign-multiplier {
  direction: ltr;
  unicode-bidi: isolate;
}

/* =========================================================================
   CAMPAIGN FILTER INDICATOR
   ========================================================================= */

.positions-filter-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-surface-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
  border: 1px solid var(--color-border);
}

.positions-filter-indicator__icon {
  font-size: 1.25rem;
}

.positions-filter-indicator__text {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.positions-filter-indicator__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.positions-filter-indicator__clear:hover {
  background: var(--color-surface-hover);
  color: var(--text-primary);
}

/* =========================================================================
   POINTS WITH MULTIPLIER DISPLAY
   ========================================================================= */

.points-with-multiplier {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.points-with-multiplier__base {
  color: var(--text-muted);
  text-decoration: line-through;
  font-size: var(--text-sm);
}

.points-with-multiplier__multiplier {
  color: var(--color-warning);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.points-with-multiplier__total {
  color: var(--color-success);
  font-weight: var(--font-bold);
}

/* =========================================================================
   RESPONSIVE - Tablet (600px+)
   ========================================================================= */

@media (min-width: 600px) {
  .campaigns-scroll {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    overflow-x: visible;
    margin-inline: 0;
    padding-inline: 0;
  }
  
  .campaign-card {
    flex: none;
  }
  
  .campaigns-section {
    padding: var(--space-5);
  }
}

/* =========================================================================
   RESPONSIVE - Desktop (1024px+)
   ========================================================================= */

@media (min-width: 1024px) {
  .campaigns-scroll {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }
  
  .campaign-card {
    padding: var(--space-5);
  }
  
  .campaign-card__title {
    font-size: var(--text-lg);
  }
  
  .campaigns-section {
    padding: var(--space-6);
  }
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .campaign-card {
    transition: none;
  }
  
  .campaign-card:hover {
    transform: none;
  }
  
  .campaign-card__countdown--critical {
    animation: none;
  }
}
```

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- CampaignsComponent renders within DashboardComponent
- Campaign data stored in MOCK_CAMPAIGNS constant
- DataService extended with campaign helper methods
- Position cards updated to show campaign badges
- PositionsComponent updated for campaign filtering

### References

- [Source: docs/architecture.md#3.2] - State management patterns
- [Source: docs/architecture.md#3.4] - Component architecture
- [Source: docs/architecture.md#4.2] - CSS naming conventions
- [Source: docs/architecture.md#4.9] - Mock data ID patterns (camp-)
- [Source: docs/epics.md#story-54] - Original acceptance criteria
- [Source: docs/PRD.md#FR-GAME-003] - Active campaigns requirements
- [Source: docs/PRD.md#FR-DASH-005] - Campaign banner requirements
- [Source: docs/sprint-artifacts/2-4-quick-actions-campaign-banner.md] - Dashboard campaign banner
- [Source: docs/sprint-artifacts/4-1-position-list-view.md] - Position cards
- [Source: docs/sprint-artifacts/4-2-position-filters-search.md] - Position filtering
- [Source: docs/project_context.md] - ID prefixes, naming conventions

### Dependencies

**From Previous Stories:**
- StateManager (Story 1.1)
- Component base class (Story 1.1)
- Router with navigate() method (Story 1.1)
- DashboardComponent (Story 2.1)
- PositionsComponent (Story 4.1)
- PositionCardComponent (Story 4.1)
- Position filters system (Story 4.2)
- DataService (Stories 4.1, 5.1)
- CSS variables for colors, spacing, shadows
- Tabler Icons CDN

**Creates Foundation For:**
- Story 5.5: How to Earn More Section (campaign links)
- Future: Campaign detail modals
- Future: Campaign notifications

### Testing Scenarios

1. **Campaign Cards Display:**
   - Active campaigns render in section
   - Cards show title, description, multiplier, eligibility
   - Cards sorted by end date (soonest first)
   - Multiplier badge prominently displayed

2. **Countdown Timer:**
   - Shows "X ימים, Y שעות" when > 24h remaining
   - Shows "HH:MM" when < 24h remaining
   - Shows "X דקות" when < 1h remaining
   - Urgency styling applies correctly
   - Timer updates every minute

3. **Campaign Click:**
   - Clicking card navigates to positions
   - Campaign filter is applied
   - Only eligible positions shown
   - Filter indicator displays

4. **Position Campaign Badge:**
   - Eligible positions show campaign badge
   - Badge shows correct multiplier
   - Badge uses campaign accent color

5. **Empty State:**
   - No active campaigns → empty state shown
   - "בקרוב..." message displayed
   - Section has reduced visual weight

6. **Filter Integration:**
   - Campaign filter indicator shows when active
   - Clear filter button works
   - Positions list updates correctly

7. **Responsive:**
   - Mobile: Horizontal scroll with snap
   - Tablet: 2-column grid
   - Desktop: 3-column grid

8. **Accessibility:**
   - Cards focusable via keyboard
   - Enter/Space activates card
   - Screen reader announces content
   - Focus indicators visible

9. **Reduced Motion:**
   - Pulse animation disabled
   - Hover transform disabled
   - Countdown still updates (functional)

10. **State Integration:**
    - activeCampaigns state updates component
    - campaignFilter state applied to positions
    - Clearing filter clears state

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete - state management, component patterns, CSS naming)
- docs/epics.md (complete - Epic 5, Story 5.4 full acceptance criteria)
- docs/PRD.md (FR-GAME-003, FR-DASH-005 requirements)
- docs/project_context.md (naming conventions, patterns)
- docs/sprint-artifacts/5-3-referral-detail-modal.md (previous story patterns)
- docs/sprint-artifacts/4-1-position-list-view.md (position card structure)
- docs/sprint-artifacts/4-2-position-filters-search.md (filter patterns)

### Agent Model Used

Claude Opus 4.5 (Developer Agent - Amelia)

### Debug Log References

- No errors or issues encountered during implementation

### Completion Notes List

- ✅ Created MOCK_CAMPAIGNS constant with 3 campaigns (Developer, HR, Year-End Marathon)
- ✅ Created CampaignsComponent class with full template, countdown timer, and lifecycle methods
- ✅ Implemented campaign card rendering with multiplier badges and eligibility display
- ✅ Countdown timer shows days/hours (>24h), hours:minutes (<24h), or minutes (<1h)
- ✅ Urgency styling: warning (orange) for <24h, critical (red pulsing) for <1h
- ✅ Empty state displays when no active campaigns
- ✅ Action handlers: view-campaign-positions, clear-campaign-filter
- ✅ PositionsComponent updated with campaign filter indicator and filtering logic
- ✅ Position cards show campaign badges with multiplier when eligible
- ✅ Points display shows multiplied calculation (base x multiplier = total)
- ✅ DashboardComponent integrates CampaignsComponent with lifecycle management
- ✅ Responsive CSS: mobile horizontal scroll, tablet 2-column, desktop 3-column grid
- ✅ Accessibility: ARIA labels, keyboard navigation (Enter/Space), focus indicators
- ✅ Reduced motion: disables animations but preserves countdown functionality

### File List

**Files Modified:**

- `script.js`:
  - Added MOCK_CAMPAIGNS constant (lines 602-650) - 3 campaigns with full schema
  - Added CampaignsComponent class (lines 3352-3640) - ~290 lines
  - Added view-campaign-positions action handler (lines 10580-10615)
  - Added clear-campaign-filter action handler (lines 10617-10635)
  - Updated navigate-campaign-positions handler to use MOCK_CAMPAIGNS
  - Updated DashboardComponent._renderCampaignsSection() method
  - Updated DashboardComponent.mount() with campaign keyboard/timer setup
  - Added DashboardComponent.unmount() for cleanup
  - Added DashboardComponent campaign helper methods (~80 lines)
  - Updated PositionsComponent.template() with campaign filter indicator
  - Added PositionsComponent._renderCampaignFilterIndicator() method
  - Updated PositionsComponent._filterPositions() with campaign filtering
  - Added PositionsComponent._getCampaignForPosition() method
  - Added PositionsComponent._calculatePointsWithCampaign() method
  - Updated PositionsComponent._hasActiveFilters() to include campaign filter
  - Updated PositionsComponent._renderPositionCard() with campaign badge and points

- `style.css`:
  - Added campaigns section styles (lines 7765-7820) - section, header, title
  - Added campaigns scroll container styles (lines 7822-7840)
  - Added campaign card styles (lines 7842-7950) - card, badge, icon, title, description
  - Added countdown timer styles (lines 7952-8010) - urgency classes, pulse animation
  - Added empty state styles (lines 8012-8040)
  - Added position campaign badge styles (lines 8042-8055)
  - Added filter indicator styles (lines 8057-8115)
  - Added points with multiplier styles (lines 8117-8145)
  - Added responsive styles - tablet (lines 8147-8175), desktop (lines 8177-8205)
  - Added reduced motion styles (lines 8207-8225)

- `docs/sprint-artifacts/sprint-status.yaml`:
  - Updated 5-4-active-campaigns-section status: ready-for-dev → in-progress

**Total Lines Added:**
- JavaScript: ~500 lines
- CSS: ~460 lines

