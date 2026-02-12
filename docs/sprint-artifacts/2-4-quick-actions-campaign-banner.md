# Story 2.4: Quick Actions & Campaign Banner

**Status:** Ready for Review

## Story

**As an** employee,
**I want** quick access to key actions and see active campaigns,
**So that** I can easily submit referrals and take advantage of bonuses.

## Acceptance Criteria

### AC1: Quick Actions Section Display
**Given** I am on the dashboard
**When** I view the quick actions section
**Then** I see primary CTA buttons prominently displayed
**And** I see "הפנה מועמד" (Refer Someone) as the primary/largest button
**And** I see "צפה במשרות" (View Positions) button
**And** I see "הדרכון שלי" (My Passport) button

### AC2: Navigation - Refer Candidate
**Given** I click "הפנה מועמד"
**When** the action triggers
**Then** I am navigated to `#positions` to select a position to refer for

### AC3: Navigation - View Positions
**Given** I click "צפה במשרות"
**When** the action triggers
**Then** I am navigated to `#positions`

### AC4: Navigation - My Passport
**Given** I click "הדרכון שלי"
**When** the action triggers
**Then** I am navigated to `#passport`

### AC5: Campaign Banner Display
**Given** there is an active campaign
**When** I view the campaign banner
**Then** I see an eye-catching banner/card with campaign name
**And** I see the bonus description (e.g., "🔥 נקודות כפולות למפתחים!")
**And** I see a countdown timer or end date
**And** I see a "הפנה עכשיו" (Refer Now) CTA

### AC6: Campaign Banner Navigation
**Given** I click on the campaign banner CTA
**When** the action triggers
**Then** I am navigated to `#positions` filtered by campaign-eligible positions

### AC7: No Active Campaigns State
**Given** there are no active campaigns
**When** the dashboard loads
**Then** the campaign banner section is hidden or shows a placeholder

### AC8: Accessibility
**Given** I use keyboard navigation
**When** I tab through quick actions and campaign banner
**Then** all buttons are focusable and show focus indicator
**And** I can activate them with Enter or Space

### AC9: Touch Targets
**Given** I am on a mobile device
**When** I view the quick actions
**Then** all buttons have minimum touch target of 44×44px

## Tasks / Subtasks

- [x] Task 1: Create Quick Actions section (AC: #1, #9)
  - [x] Add `_renderQuickActions()` method to DashboardComponent
  - [x] Render 3 CTA buttons with proper sizing
  - [x] Add Tabler icons for each button
  - [x] Ensure 44×44px minimum touch targets

- [x] Task 2: Add Quick Actions navigation (AC: #2, #3, #4)
  - [x] Use `data-navigate` attributes for routing
  - [x] "הפנה מועמד" → #positions
  - [x] "צפה במשרות" → #positions
  - [x] "הדרכון שלי" → #passport

- [x] Task 3: Create Campaign Banner component (AC: #5)
  - [x] Add `_renderCampaignBanner()` method
  - [x] Display campaign name and description
  - [x] Show bonus multiplier badge
  - [x] Implement countdown timer display

- [x] Task 4: Add mock campaign data generation (AC: #5, #6, #7)
  - [x] Add `generateMockCampaigns()` function
  - [x] Generate 1-2 active campaigns with dates
  - [x] Store campaigns in StateManager
  - [x] Define campaign-eligible position IDs

- [x] Task 5: Implement countdown timer (AC: #5)
  - [x] Add `_formatCountdown()` utility method
  - [x] Display days/hours remaining
  - [x] Update display every minute
  - [x] Show urgent styling when < 24 hours

- [x] Task 6: Add campaign navigation with filter (AC: #6)
  - [x] Use `data-action="navigate-campaign-positions"`
  - [x] Store campaign filter in state
  - [x] Filter positions by campaign ID

- [x] Task 7: Handle no campaigns state (AC: #7)
  - [x] Hide banner if no active campaigns
  - [x] Or show subtle placeholder

- [x] Task 8: Add CSS styles (AC: #1, #5, #9)
  - [x] Style `.quick-actions` container
  - [x] Style `.quick-action-btn` with variants
  - [x] Style `.campaign-banner` with gradient background
  - [x] Style countdown timer
  - [x] Add responsive breakpoints

- [x] Task 9: Ensure accessibility (AC: #8)
  - [x] All buttons focusable
  - [x] Add aria-labels
  - [x] Keyboard navigation support

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**Add to DashboardComponent - Quick Actions:**

```javascript
/**
 * Renders the quick actions section
 * @returns {string} HTML string for quick actions
 */
_renderQuickActions() {
  const actions = [
    {
      id: 'refer',
      icon: 'ti-user-plus',
      label: 'הפנה מועמד',
      route: 'positions',
      primary: true,
      description: 'הפנה חבר למשרה פתוחה'
    },
    {
      id: 'positions',
      icon: 'ti-briefcase',
      label: 'צפה במשרות',
      route: 'positions',
      primary: false,
      description: 'ראה את כל המשרות הפתוחות'
    },
    {
      id: 'passport',
      icon: 'ti-book',
      label: 'הדרכון שלי',
      route: 'passport',
      primary: false,
      description: 'צפה בחותמות ובנקודות שלך'
    }
  ];
  
  return `
    <section class="dashboard__actions" aria-label="פעולות מהירות">
      <header class="quick-actions__header">
        <h2 class="quick-actions__title">
          <i class="ti ti-rocket"></i>
          פעולות מהירות
        </h2>
      </header>
      
      <div class="quick-actions">
        ${actions.map(action => this._renderQuickActionButton(action)).join('')}
      </div>
    </section>
  `;
}

/**
 * Renders a single quick action button
 * @param {Object} action - Action configuration
 * @returns {string} HTML string
 */
_renderQuickActionButton(action) {
  const buttonClass = action.primary 
    ? 'quick-action-btn quick-action-btn--primary' 
    : 'quick-action-btn quick-action-btn--secondary';
  
  return `
    <button 
      class="${buttonClass}"
      data-navigate="${action.route}"
      aria-label="${action.description}"
    >
      <span class="quick-action-btn__icon">
        <i class="ti ${action.icon}"></i>
      </span>
      <span class="quick-action-btn__label">${action.label}</span>
    </button>
  `;
}
```

**Add to DashboardComponent - Campaign Banner:**

```javascript
/**
 * Renders the campaign banner section
 * @returns {string} HTML string for campaign banner
 */
_renderCampaignBanner() {
  const campaigns = stateManager.getState('campaigns') || [];
  const activeCampaigns = campaigns.filter(c => this._isCampaignActive(c));
  
  if (activeCampaigns.length === 0) {
    return this._renderNoCampaignState();
  }
  
  // Show the most recent/relevant active campaign
  const campaign = activeCampaigns[0];
  const countdown = this._formatCountdown(campaign.endDate);
  const isUrgent = this._isUrgent(campaign.endDate);
  
  return `
    <section class="dashboard__campaign" aria-label="קמפיין פעיל">
      <article class="campaign-banner ${isUrgent ? 'campaign-banner--urgent' : ''}">
        <div class="campaign-banner__background" aria-hidden="true">
          <div class="campaign-banner__glow"></div>
        </div>
        
        <div class="campaign-banner__content">
          <div class="campaign-banner__badge">
            <span class="campaign-badge">
              <i class="ti ti-flame"></i>
              ${campaign.multiplier}x נקודות
            </span>
          </div>
          
          <h3 class="campaign-banner__title">${campaign.name}</h3>
          <p class="campaign-banner__description">${campaign.description}</p>
          
          <div class="campaign-banner__countdown ${isUrgent ? 'campaign-countdown--urgent' : ''}">
            <i class="ti ti-clock"></i>
            <span class="campaign-countdown__text">${countdown}</span>
          </div>
          
          <button 
            class="btn btn--accent campaign-banner__cta"
            data-action="navigate-campaign-positions"
            data-campaign-id="${campaign.id}"
            aria-label="הפנה עכשיו לקמפיין ${campaign.name}"
          >
            <i class="ti ti-user-plus"></i>
            הפנה עכשיו
          </button>
        </div>
        
        <div class="campaign-banner__visual" aria-hidden="true">
          <i class="ti ti-award"></i>
        </div>
      </article>
    </section>
  `;
}

/**
 * Renders state when no campaigns are active
 * @returns {string} HTML string
 */
_renderNoCampaignState() {
  // Option 1: Return empty string to hide section entirely
  // return '';
  
  // Option 2: Show subtle placeholder
  return `
    <section class="dashboard__campaign dashboard__campaign--empty" aria-label="קמפיינים">
      <div class="campaign-placeholder">
        <i class="ti ti-sparkles" aria-hidden="true"></i>
        <p class="campaign-placeholder__text">קמפיינים חדשים בקרוב...</p>
      </div>
    </section>
  `;
}

/**
 * Checks if a campaign is currently active
 * @param {Object} campaign - Campaign object
 * @returns {boolean} True if active
 */
_isCampaignActive(campaign) {
  const now = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  return now >= startDate && now <= endDate;
}

/**
 * Checks if campaign end date is urgent (< 24 hours)
 * @param {string} endDate - ISO date string
 * @returns {boolean} True if urgent
 */
_isUrgent(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const hoursRemaining = (end - now) / (1000 * 60 * 60);
  return hoursRemaining > 0 && hoursRemaining < 24;
}

/**
 * Formats countdown to campaign end
 * @param {string} endDate - ISO date string
 * @returns {string} Formatted countdown in Hebrew
 */
_formatCountdown(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end - now;
  
  if (diffMs <= 0) {
    return 'הסתיים';
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;
  
  if (diffDays > 0) {
    if (diffDays === 1) {
      return `נותר יום אחד`;
    }
    if (diffDays === 2) {
      return `נותרו יומיים`;
    }
    return `נותרו ${diffDays} ימים`;
  }
  
  if (diffHours > 0) {
    if (diffHours === 1) {
      return `נותרה שעה אחת!`;
    }
    if (diffHours === 2) {
      return `נותרו שעתיים!`;
    }
    return `נותרו ${diffHours} שעות!`;
  }
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `נותרו ${diffMinutes} דקות!`;
}
```

**Update DashboardComponent template() to include quick actions and campaign banner:**

```javascript
template() {
  const user = stateManager.getState('currentUser');
  if (!user) return this._renderLoading();
  
  const { firstName, points } = user;
  const levelInfo = this._calculateLevel(points);
  
  return `
    <div class="app-layout">
      <div class="header-container"></div>
      <nav class="bottom-nav-container"></nav>
      <main class="dashboard page-content">
        <section class="dashboard__greeting">
          <h1 class="dashboard__title">שלום ${firstName}! 👋</h1>
        </section>
        
        <section class="dashboard__stats">
          ${this._renderPointsSummary(points, levelInfo)}
        </section>
        
        ${this._renderStatsCards()}
        
        ${this._renderQuickActions()}
        
        ${this._renderCampaignBanner()}
        
        ${this._renderActivityFeed()}
      </main>
    </div>
  `;
}
```

**Generate Mock Campaigns:**

```javascript
// Add to MOCK_DATA section or as separate function

/**
 * Generates mock campaign data
 * @param {Function} random - Seeded random function
 * @returns {Array} Array of campaign objects
 */
function generateMockCampaigns(random) {
  const campaigns = [
    {
      id: 'camp-001',
      name: 'חודש המפתחים',
      description: 'נקודות כפולות על כל הפניה לתפקידי פיתוח!',
      multiplier: 2,
      eligibleDepartments: ['פיתוח', 'DevOps', 'Data'],
      eligiblePositionIds: ['pos-001', 'pos-002', 'pos-003', 'pos-005'],
      startDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 10); // Started 10 days ago
        return d.toISOString();
      })(),
      endDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + Math.floor(random() * 10) + 3); // Ends in 3-13 days
        return d.toISOString();
      })(),
      badgeColor: 'primary',
      icon: 'ti-code'
    },
    {
      id: 'camp-002',
      name: 'בונוס שבועי',
      description: 'הפנו 3 מועמדים השבוע וקבלו 200 נקודות בונוס!',
      multiplier: 1.5,
      eligibleDepartments: [], // All departments
      eligiblePositionIds: [], // All positions
      startDate: (() => {
        const d = new Date();
        // Find start of this week (Sunday)
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d.toISOString();
      })(),
      endDate: (() => {
        const d = new Date();
        // Find end of this week (Saturday 23:59)
        const day = d.getDay();
        d.setDate(d.getDate() + (6 - day));
        d.setHours(23, 59, 59, 999);
        return d.toISOString();
      })(),
      badgeColor: 'warning',
      icon: 'ti-calendar-stats'
    }
  ];
  
  // Randomly select 1 or 2 active campaigns
  const numActive = Math.floor(random() * 2) + 1;
  return campaigns.slice(0, numActive);
}

// Update generateUserFromEmail() to include campaigns
function generateUserFromEmail(email) {
  const random = seededRandom(email);
  
  // ... existing code ...
  
  // Generate campaigns (these are global, not user-specific)
  const campaigns = generateMockCampaigns(random);
  
  return {
    // ... existing user properties ...
    campaigns: campaigns // Add this
  };
}
```

**Update StateManager on login to include campaigns:**

```javascript
// In OTPModalComponent._handleSuccess():
const user = generateUserFromEmail(email);

stateManager.setState({
  currentUser: user,
  isAuthenticated: true,
  sessionToken: `session_${Date.now()}`,
  referrals: user.referrals,
  activities: user.activities,
  campaigns: user.campaigns,  // Add this line
  pendingEmail: null
});
```

**Register Action Handler for Campaign Navigation:**

```javascript
// Add to app initialization
app.registerAction('navigate-campaign-positions', (target) => {
  const campaignId = target.dataset.campaignId;
  
  if (campaignId) {
    const campaigns = stateManager.getState('campaigns') || [];
    const campaign = campaigns.find(c => c.id === campaignId);
    
    if (campaign) {
      // Store campaign filter
      stateManager.setState({
        positionFilters: {
          ...stateManager.getState('positionFilters'),
          campaignId: campaignId,
          eligiblePositionIds: campaign.eligiblePositionIds || []
        }
      });
    }
  }
  
  router.navigate('positions');
});
```

### CSS Styles (Add to style.css - Dashboard section)

```css
/* =========================================================================
   QUICK ACTIONS
   ========================================================================= */

/* Quick Actions Header */
.quick-actions__header {
  margin-bottom: var(--space-4);
}

.quick-actions__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-gray-800);
  margin: 0;
}

.quick-actions__title .ti {
  color: var(--color-primary);
}

/* Quick Actions Container */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Quick Action Button Base */
.quick-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  min-height: 56px;
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: transform 0.15s var(--ease-default),
              box-shadow 0.15s var(--ease-default),
              background-color 0.15s var(--ease-default);
  border: none;
  text-decoration: none;
}

.quick-action-btn:hover {
  transform: translateY(-2px);
}

.quick-action-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.quick-action-btn:active {
  transform: translateY(0);
}

/* Primary Action Button */
.quick-action-btn--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #C50412 100%);
  color: var(--color-white);
  box-shadow: var(--shadow-md), 0 4px 12px rgba(225, 5, 20, 0.3);
  min-height: 64px;
  font-size: var(--text-lg);
}

.quick-action-btn--primary:hover {
  box-shadow: var(--shadow-lg), 0 6px 16px rgba(225, 5, 20, 0.4);
}

.quick-action-btn--primary .quick-action-btn__icon {
  font-size: 1.5rem;
}

/* Secondary Action Button */
.quick-action-btn--secondary {
  background: var(--color-white);
  color: var(--color-gray-700);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
}

.quick-action-btn--secondary:hover {
  background: var(--color-gray-50);
  box-shadow: var(--shadow-md);
}

.quick-action-btn--secondary .quick-action-btn__icon {
  color: var(--color-primary);
}

/* Button Icon */
.quick-action-btn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

/* Button Label */
.quick-action-btn__label {
  white-space: nowrap;
}

/* =========================================================================
   CAMPAIGN BANNER
   ========================================================================= */

/* Campaign Section */
.dashboard__campaign {
  margin-top: var(--space-2);
}

.dashboard__campaign--empty {
  opacity: 0.6;
}

/* Campaign Banner */
.campaign-banner {
  position: relative;
  background: linear-gradient(135deg, #1A1A2E 0%, #16213E 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  overflow: hidden;
  color: var(--color-white);
  box-shadow: var(--shadow-lg);
}

.campaign-banner--urgent {
  animation: campaignPulse 2s ease-in-out infinite;
}

@keyframes campaignPulse {
  0%, 100% { box-shadow: var(--shadow-lg); }
  50% { box-shadow: var(--shadow-lg), 0 0 20px rgba(225, 5, 20, 0.4); }
}

/* Background Effects */
.campaign-banner__background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.campaign-banner__glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(225, 5, 20, 0.3) 0%, transparent 70%);
  animation: campaignGlow 4s ease-in-out infinite;
}

@keyframes campaignGlow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

/* Banner Content */
.campaign-banner__content {
  position: relative;
  z-index: 1;
}

/* Campaign Badge */
.campaign-banner__badge {
  margin-bottom: var(--space-3);
}

.campaign-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: rgba(225, 5, 20, 0.9);
  color: var(--color-white);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.campaign-badge .ti {
  font-size: 1rem;
  animation: flameFlicker 0.5s ease-in-out infinite alternate;
}

@keyframes flameFlicker {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

/* Banner Title */
.campaign-banner__title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin: 0 0 var(--space-2);
  color: var(--color-white);
}

/* Banner Description */
.campaign-banner__description {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 var(--space-4);
  line-height: 1.5;
}

/* Countdown */
.campaign-banner__countdown {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--space-4);
}

.campaign-countdown--urgent {
  color: var(--color-warning);
  font-weight: var(--font-medium);
}

.campaign-countdown--urgent .ti {
  animation: countdownPulse 1s ease-in-out infinite;
}

@keyframes countdownPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Banner CTA */
.campaign-banner__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-white);
  color: var(--color-primary);
  border: none;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: transform 0.15s var(--ease-default),
              box-shadow 0.15s var(--ease-default);
  min-height: 44px;
}

.campaign-banner__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.campaign-banner__cta:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4);
}

/* Banner Visual */
.campaign-banner__visual {
  position: absolute;
  bottom: -20px;
  left: -20px;
  font-size: 120px;
  color: rgba(255, 255, 255, 0.05);
  transform: rotate(-15deg);
}

/* No Campaign Placeholder */
.campaign-placeholder {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-gray-200);
}

.campaign-placeholder .ti {
  font-size: 1.5rem;
  color: var(--color-gray-400);
}

.campaign-placeholder__text {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  margin: 0;
}

/* Responsive - Tablet and up */
@media (min-width: 600px) {
  .quick-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .quick-action-btn--primary {
    flex: 1 1 100%;
  }
  
  .quick-action-btn--secondary {
    flex: 1 1 calc(50% - var(--space-3) / 2);
  }
  
  .campaign-banner {
    padding: var(--space-6);
  }
  
  .campaign-banner__title {
    font-size: var(--text-2xl);
  }
  
  .campaign-banner__description {
    font-size: var(--text-base);
    max-width: 70%;
  }
  
  .campaign-banner__visual {
    font-size: 160px;
    bottom: -30px;
    left: -30px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .quick-actions {
    flex-direction: row;
    gap: var(--space-4);
  }
  
  .quick-action-btn--primary {
    flex: 2;
    min-height: 72px;
  }
  
  .quick-action-btn--secondary {
    flex: 1;
    min-height: 72px;
  }
  
  .campaign-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-6) var(--space-8);
  }
  
  .campaign-banner__content {
    flex: 1;
  }
  
  .campaign-banner__visual {
    position: relative;
    bottom: auto;
    left: auto;
    font-size: 100px;
    opacity: 0.2;
    transform: none;
    margin-inline-start: var(--space-6);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .quick-action-btn {
    transition: none;
  }
  
  .quick-action-btn:hover {
    transform: none;
  }
  
  .campaign-banner--urgent {
    animation: none;
  }
  
  .campaign-banner__glow {
    animation: none;
  }
  
  .campaign-badge .ti {
    animation: none;
  }
  
  .campaign-countdown--urgent .ti {
    animation: none;
  }
  
  @keyframes campaignPulse {
    0%, 100% { box-shadow: var(--shadow-lg); }
  }
}
```

### Campaign Data Structure

```javascript
// Campaign object structure
{
  id: 'camp-001',                           // Type-prefixed ID
  name: 'חודש המפתחים',                      // Hebrew campaign name
  description: 'נקודות כפולות על כל הפניה לתפקידי פיתוח!',
  multiplier: 2,                            // Points multiplier (1.5, 2, etc.)
  eligibleDepartments: ['פיתוח', 'DevOps'],  // Eligible departments (empty = all)
  eligiblePositionIds: ['pos-001', 'pos-002'], // Eligible position IDs (empty = all)
  startDate: '2025-12-01T00:00:00Z',        // ISO date string
  endDate: '2025-12-31T23:59:59Z',          // ISO date string
  badgeColor: 'primary',                     // Badge color variant
  icon: 'ti-code'                           // Tabler icon class
}
```

### State Structure

```javascript
// Campaigns array in state
{
  campaigns: [
    {
      id: 'camp-001',
      name: 'חודש המפתחים',
      description: 'נקודות כפולות על כל הפניה לתפקידי פיתוח!',
      multiplier: 2,
      eligibleDepartments: ['פיתוח', 'DevOps', 'Data'],
      eligiblePositionIds: ['pos-001', 'pos-002', 'pos-003'],
      startDate: '2025-12-01T00:00:00Z',
      endDate: '2025-12-20T23:59:59Z',
      badgeColor: 'primary',
      icon: 'ti-code'
    }
  ],
  
  // Filter state for campaign navigation
  positionFilters: {
    department: 'all',
    location: 'all',
    search: '',
    referralFilter: 'all',
    campaignId: null,               // Active campaign filter
    eligiblePositionIds: []         // Positions eligible for current campaign
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #E10514 | Primary button bg, badge, accents |
| `--color-white` | #FFFFFF | Secondary button bg, text on dark |
| `--color-gray-700` | #374151 | Secondary button text |
| `--color-gray-200` | #E5E7EB | Secondary button border |
| `--color-warning` | #F39C12 | Urgent countdown |
| `--radius-lg` | 12px | Button border-radius |
| `--radius-xl` | 16px | Banner border-radius |
| `--shadow-md` | 0 4px 6px... | Button hover shadow |
| `--shadow-lg` | 0 10px 15px... | Banner shadow |

### Quick Actions Reference

| Action | Icon | Route | Style |
|--------|------|-------|-------|
| הפנה מועמד | ti-user-plus | positions | Primary (gradient) |
| צפה במשרות | ti-briefcase | positions | Secondary |
| הדרכון שלי | ti-book | passport | Secondary |

### RTL/Hebrew Considerations

1. **Button layout:** Flex direction is row on larger screens, icons stay on the right side
2. **Campaign banner:** Visual element positioned on the left (inline-start in RTL)
3. **Numbers in countdown:** Use Hebrew number words when possible (שעתיים, יומיים)
4. **Gradient direction:** 135deg works well for RTL

### Accessibility Requirements

1. **Button semantics:**
   - Use `<button>` elements (not divs)
   - Add `aria-label` with action description
   
2. **Touch targets:**
   - Minimum 44×44px for all interactive elements
   - Primary button larger (56-72px height)
   
3. **Focus indicators:**
   - Visible focus ring on all buttons
   - Uses `--color-primary-light` for focus
   
4. **Keyboard navigation:**
   - Buttons focusable via Tab
   - Enter/Space activates buttons
   
5. **Reduced motion:**
   - Disable animations with `prefers-reduced-motion`
   - Banner pulse, glow, and flame animations disabled

### Integration Points

**Dependencies from Previous Stories:**
- `DashboardComponent` class (Stories 2.1, 2.2, 2.3)
- `stateManager` with `currentUser`, `referrals`, `activities`
- Router navigation (`router.navigate()`)
- Activity feed pattern (Story 2.3)
- CSS variables and base styles

**Extends:**
- `DashboardComponent` - Add `_renderQuickActions()`, `_renderQuickActionButton()`, `_renderCampaignBanner()`, `_renderNoCampaignState()`, `_isCampaignActive()`, `_isUrgent()`, `_formatCountdown()` methods
- `generateUserFromEmail()` - Add `campaigns` generation
- `OTPModalComponent._handleSuccess()` - Store campaigns in state

**New Components:**
- None (integrated into DashboardComponent)

**Files to Modify:**
- `script.js` - Add quick actions and campaign banner methods, campaign generation (~200 lines)
- `style.css` - Add quick actions and campaign banner styles (~250 lines)

### Testing Scenarios

1. **Quick Actions Display:**
   - Dashboard loads → See 3 quick action buttons
   - Primary button (הפנה מועמד) is largest and most prominent
   - Secondary buttons are smaller with white background

2. **Quick Actions Navigation:**
   - Click "הפנה מועמד" → Navigate to #positions
   - Click "צפה במשרות" → Navigate to #positions
   - Click "הדרכון שלי" → Navigate to #passport

3. **Campaign Banner Display:**
   - Active campaign exists → Banner displays with name, description, countdown
   - Multiplier badge shows (e.g., "2x נקודות")
   - CTA button is visible and clickable

4. **Countdown Timer:**
   - Campaign ending in days → Shows "נותרו X ימים"
   - Campaign ending in hours → Shows "נותרו X שעות!" with urgent styling
   - Campaign ending soon → Pulse animation on banner

5. **Campaign Navigation:**
   - Click banner CTA → Navigate to #positions with filter
   - Campaign filter stored in state
   - Positions page shows filtered results (future story)

6. **No Campaigns State:**
   - No active campaigns → Show placeholder or hide section
   - Placeholder shows "קמפיינים חדשים בקרוב..."

7. **Touch Targets:**
   - All buttons at least 44×44px
   - Primary button 56-72px height

8. **Keyboard Navigation:**
   - Tab through buttons → Focus visible
   - Enter/Space activates buttons

9. **Responsive Layout:**
   - Mobile → Buttons stacked vertically
   - Tablet → Primary full width, secondary split
   - Desktop → All buttons in row

### Previous Story Learnings (Stories 2.1, 2.2, 2.3)

From Story 2.1 (Dashboard Layout & Points Summary):
- DashboardComponent renders with section-based layout
- Level calculation logic
- Uses `app-layout` and `page-content` classes

From Story 2.2 (Stats Cards):
- Stats cards use responsive grid
- Mock referrals generation pattern
- Action registration pattern

From Story 2.3 (Activity Feed):
- Activity generation from referrals
- formatRelativeTime() utility
- Empty state pattern with CTA

### Project Context Quick Reference

**Naming Conventions:**
- CSS classes: BEM-kebab (`quick-action-btn__icon`, `campaign-banner--urgent`)
- JS methods: camelCase with underscore for private (`_renderCampaignBanner`)
- Data attributes: kebab-case (`data-campaign-id`)
- IDs: kebab-case with type prefix (`camp-001`)

**State Management:**
- Always use `stateManager.setState()` - never mutate directly
- Subscribe to changes with `this.subscribe()`

**Events:**
- Use `data-navigate` for simple route changes
- Use `data-action` for complex logic
- Register handlers with `app.registerAction()`

### References

- [Source: docs/architecture.md#4-implementation-patterns] - Naming conventions
- [Source: docs/architecture.md#5.4-component-hierarchy] - DashboardComponent structure
- [Source: docs/PRD.md#6.3-dashboard] - FR-DASH-004 Quick Actions, FR-DASH-005 Campaign Banner
- [Source: docs/PRD.md#6.7-gamification] - FR-GAME-003 Active Campaigns
- [Source: docs/epics.md#story-24] - Original acceptance criteria
- [Source: docs/sprint-artifacts/2-3-activity-feed.md] - Previous story patterns
- [Source: user-data/ux-design-specification.md] - Color palette and design tokens

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete)
- docs/sprint-artifacts/2-1-dashboard-layout-points-summary.md (previous story)
- docs/sprint-artifacts/2-2-stats-cards.md (previous story)
- docs/sprint-artifacts/2-3-activity-feed.md (previous story)

### Agent Model Used

Claude Opus 4.5 (via Cursor)

### Debug Log References

None - clean implementation with no issues.

### Completion Notes List

1. **Task 1-2 Complete**: Created `_renderQuickActions()` and `_renderQuickActionButton()` methods. Added 3 quick action buttons (הפנה מועמד, צפה במשרות, הדרכון שלי) with proper sizing (min-height 56px for secondary, 64px for primary), Tabler icons, and `data-navigate` attributes for routing.

2. **Task 3-5 Complete**: Created `_renderCampaignBanner()` method with campaign name, description, multiplier badge, and countdown timer. Added helper methods `_isCampaignActive()`, `_isUrgent()`, and `_formatCountdown()` with Hebrew-aware number formatting (יומיים, שעתיים).

3. **Task 4 Complete**: Created `generateMockCampaigns()` function that generates 1-2 campaigns with:
   - "חודש המפתחים" (2x points for dev positions)
   - "בונוס שבועי" (1.5x for all positions)
   - Dynamic dates based on current time
   - Updated `generateUserFromEmail()` to include campaigns
   - Updated `_handleSuccess()` to store campaigns in state

4. **Task 6 Complete**: Added `navigate-campaign-positions` action handler that stores campaign filter in state (campaignId, eligiblePositionIds) before navigating to positions page.

5. **Task 7 Complete**: Created `_renderNoCampaignState()` method showing placeholder "קמפיינים חדשים בקרוב..." when no active campaigns.

6. **Task 8 Complete**: Added ~280 lines of CSS including:
   - Quick action buttons with primary (gradient) and secondary (white) variants
   - Campaign banner with dark gradient background, glow effect, urgent pulse animation
   - Responsive breakpoints (600px, 1024px) for layout changes
   - Reduced motion support

7. **Task 9 Complete**: Accessibility features:
   - All buttons are native `<button>` elements (focusable by default)
   - `aria-label` attributes with Hebrew descriptions
   - `:focus` and `:focus-visible` styles for keyboard users
   - Min touch targets: 44px (secondary), 56-64px (primary)

### File List

Files modified:
- `script.js` - Added quick actions and campaign banner methods, campaign generation (~200 lines added)
  - `_renderQuickActions()` method in DashboardComponent
  - `_renderQuickActionButton()` method in DashboardComponent
  - `_renderCampaignBanner()` method in DashboardComponent
  - `_renderNoCampaignState()` method in DashboardComponent
  - `_isCampaignActive()` method in DashboardComponent
  - `_isUrgent()` method in DashboardComponent
  - `_formatCountdown()` method in DashboardComponent
  - `generateMockCampaigns()` function
  - Updated `generateUserFromEmail()` to include campaigns
  - Updated `_handleSuccess()` to store campaigns in state
  - Added `navigate-campaign-positions` action handler
- `style.css` - Added quick actions and campaign banner component styles (~280 lines added)
  - Quick Actions section styles
  - Campaign Banner section styles
  - Responsive breakpoints
  - Reduced motion support

No new files created.

Depends on from previous stories:
- DashboardComponent class structure (Stories 2.1, 2.2, 2.3)
- StateManager with currentUser, referrals, activities
- Mock data generation patterns
- Router navigation
- Header and BottomNav rendering pattern
- CSS variables and base component styles
- Action registration pattern

