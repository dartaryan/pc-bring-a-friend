# Story 2.3: Activity Feed

**Status:** ready-for-dev

## Story

**As an** employee,
**I want** to see my recent referral activity,
**So that** I can stay updated on status changes and points earned.

## Acceptance Criteria

### AC1: Activity Feed Section Display
**Given** I am on the dashboard
**When** I view the activity feed section
**Then** I see a "פעילות אחרונה" (Recent Activity) heading
**And** I see up to 10 activity items in chronological order (newest first)

### AC2: Activity Item Content
**Given** I have activity items
**When** I view an activity item
**Then** I see an icon indicating the activity type
**And** I see a description in Hebrew (e.g., "דנה לוי עברה לשלב ראיון")
**And** I see points earned if applicable (e.g., "+100")
**And** I see a relative timestamp (e.g., "לפני 2 שעות", "אתמול")

### AC3: Activity Type Visual Distinction
**Given** I have activity types
**When** activities are displayed
**Then** referral status updates show with status-colored icon
**And** stamps earned show with stamp icon
**And** new points show with points icon
**And** each type has appropriate visual distinction

### AC4: Empty State
**Given** I have no recent activity
**When** the feed loads
**Then** I see an empty state message
**And** I see a CTA to submit my first referral

### AC5: Activity Item Navigation
**Given** I click on an activity item
**When** it's a referral-related item
**Then** I am navigated to that referral's detail view

### AC6: Responsive Layout
**Given** I am on mobile or desktop
**When** I view the activity feed
**Then** the feed displays appropriately for the screen size
**And** items are easily readable and tappable

### AC7: Accessibility
**Given** I use keyboard navigation or screen reader
**When** I interact with activity items
**Then** items are focusable and navigable
**And** screen readers announce activity content properly

## Tasks / Subtasks

- [ ] Task 1: Create activity data structure and generation (AC: #2, #3)
  - [ ] Define Activity model/type with properties (id, type, description, points, timestamp, referralId)
  - [ ] Add `generateActivityFromReferrals()` function to create activities from referral data
  - [ ] Generate mock activities in user data generation
  - [ ] Store activities in StateManager

- [ ] Task 2: Add `_renderActivityFeed()` method to DashboardComponent (AC: #1, #4)
  - [ ] Create section with "פעילות אחרונה" heading
  - [ ] Render activity items list (max 10)
  - [ ] Implement empty state with CTA

- [ ] Task 3: Create `_renderActivityItem()` method (AC: #2, #3)
  - [ ] Render icon based on activity type
  - [ ] Display description text in Hebrew
  - [ ] Show points badge if applicable
  - [ ] Display relative timestamp
  - [ ] Add data attributes for navigation

- [ ] Task 4: Implement relative timestamp formatter (AC: #2)
  - [ ] Create `formatRelativeTime()` utility function
  - [ ] Support Hebrew relative time strings
  - [ ] Handle various time ranges (minutes, hours, days, weeks)

- [ ] Task 5: Add activity navigation handler (AC: #5)
  - [ ] Register `navigate-referral-detail` action
  - [ ] Navigate to referrals page with selected referral
  - [ ] Store selected referral ID in state

- [ ] Task 6: Add activity feed CSS styles (AC: #1, #3, #6)
  - [ ] Style `.activity-feed` container
  - [ ] Style `.activity-item` with hover/focus states
  - [ ] Style activity icons by type
  - [ ] Style points badge and timestamp
  - [ ] Style empty state
  - [ ] Add responsive adjustments

- [ ] Task 7: Ensure accessibility (AC: #7)
  - [ ] Add `role="list"` to feed container
  - [ ] Add `role="listitem"` to activity items
  - [ ] Make items focusable and keyboard navigable
  - [ ] Add aria-labels for icons

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**Activity Data Structure:**

```javascript
// Activity types enum
const ACTIVITY_TYPES = {
  REFERRAL_SUBMITTED: 'referral_submitted',
  STATUS_CHANGE: 'status_change',
  STAMP_EARNED: 'stamp_earned',
  POINTS_EARNED: 'points_earned',
  MILESTONE_REACHED: 'milestone_reached'
};

// Activity object structure
{
  id: 'act-0001',                    // Type-prefixed ID
  type: 'status_change',              // From ACTIVITY_TYPES
  description: 'דנה לוי עברה לשלב ראיון', // Hebrew description
  points: 100,                        // Points earned (optional, 0 if none)
  timestamp: '2025-12-10T14:30:00Z',  // ISO timestamp
  referralId: 'ref-0001',             // Related referral ID (optional)
  icon: 'ti-calendar-event',          // Tabler icon class
  iconColor: 'warning'                // Color variant: primary, success, warning, info
}
```

**Generate Activities from Referrals:**

```javascript
/**
 * Generates activity items from referrals array
 * @param {Array} referrals - User's referrals
 * @param {Function} random - Seeded random function
 * @returns {Array} Activity items sorted by timestamp (newest first)
 */
function generateActivitiesFromReferrals(referrals, random) {
  const activities = [];
  
  const STATUS_TO_ACTIVITY = {
    'submitted': {
      type: ACTIVITY_TYPES.REFERRAL_SUBMITTED,
      descTemplate: '{{name}} הוגש/ה למשרת {{position}}',
      points: 50,
      icon: 'ti-send',
      iconColor: 'primary'
    },
    'review': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} נמצא/ת בבדיקה',
      points: 0,
      icon: 'ti-eye',
      iconColor: 'info'
    },
    'interview': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} עבר/ה לשלב ראיון',
      points: 100,
      icon: 'ti-calendar-event',
      iconColor: 'warning'
    },
    'offer': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} קיבל/ה הצעת עבודה',
      points: 0,
      icon: 'ti-file-text',
      iconColor: 'info'
    },
    'hired': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '🎉 {{name}} גויס/ה בהצלחה!',
      points: 500,
      icon: 'ti-trophy',
      iconColor: 'success'
    },
    'rejected': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} לא נבחר/ה להמשך',
      points: 0,
      icon: 'ti-x',
      iconColor: 'error'
    }
  };
  
  referrals.forEach(referral => {
    const config = STATUS_TO_ACTIVITY[referral.status];
    if (!config) return;
    
    // Create activity for current status
    const description = config.descTemplate
      .replace('{{name}}', referral.candidateName)
      .replace('{{position}}', referral.position);
    
    // Generate timestamp relative to submitted date
    const statusDate = new Date(referral.submittedDate);
    const daysOffset = getStatusDaysOffset(referral.status, random);
    statusDate.setDate(statusDate.getDate() + daysOffset);
    
    activities.push({
      id: `act-${referral.id}-${referral.status}`,
      type: config.type,
      description: description,
      points: config.points,
      timestamp: statusDate.toISOString(),
      referralId: referral.id,
      icon: config.icon,
      iconColor: config.iconColor
    });
    
    // Add points activity if points > 0
    if (config.points > 0) {
      activities.push({
        id: `act-${referral.id}-points-${referral.status}`,
        type: ACTIVITY_TYPES.POINTS_EARNED,
        description: `הרווחת ${config.points} נקודות`,
        points: config.points,
        timestamp: new Date(statusDate.getTime() + 1000).toISOString(), // 1 second after
        referralId: referral.id,
        icon: 'ti-star',
        iconColor: 'primary'
      });
    }
  });
  
  // Sort by timestamp descending (newest first)
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return activities;
}

/**
 * Gets the days offset from submission for each status
 */
function getStatusDaysOffset(status, random) {
  const offsets = {
    'submitted': 0,
    'review': Math.floor(random() * 7) + 3,        // 3-10 days
    'interview': Math.floor(random() * 14) + 10,   // 10-24 days
    'offer': Math.floor(random() * 21) + 24,       // 24-45 days
    'hired': Math.floor(random() * 30) + 45,       // 45-75 days
    'rejected': Math.floor(random() * 21) + 14     // 14-35 days
  };
  return offsets[status] || 0;
}
```

**Add to DashboardComponent:**

```javascript
// Add these methods to DashboardComponent class

/**
 * Renders the activity feed section
 * @returns {string} HTML string for activity feed
 */
_renderActivityFeed() {
  const activities = stateManager.getState('activities') || [];
  const displayActivities = activities.slice(0, 10); // Max 10 items
  
  if (displayActivities.length === 0) {
    return this._renderEmptyActivity();
  }
  
  return `
    <section class="dashboard__activity" aria-label="פעילות אחרונה">
      <header class="activity-feed__header">
        <h2 class="activity-feed__title">
          <i class="ti ti-activity"></i>
          פעילות אחרונה
        </h2>
      </header>
      
      <ul class="activity-feed" role="list">
        ${displayActivities.map(activity => this._renderActivityItem(activity)).join('')}
      </ul>
    </section>
  `;
}

/**
 * Renders a single activity item
 * @param {Object} activity - Activity data
 * @returns {string} HTML string
 */
_renderActivityItem(activity) {
  const relativeTime = formatRelativeTime(activity.timestamp);
  const pointsBadge = activity.points > 0 ? `
    <span class="activity-item__points">+${activity.points}</span>
  ` : '';
  
  const navigable = activity.referralId ? `
    data-action="navigate-referral-detail"
    data-referral-id="${activity.referralId}"
    role="button"
    tabindex="0"
  ` : '';
  
  return `
    <li 
      class="activity-item activity-item--${activity.iconColor}"
      ${navigable}
      aria-label="${activity.description}. ${activity.points > 0 ? `הרווחת ${activity.points} נקודות.` : ''} ${relativeTime}"
    >
      <div class="activity-item__icon" aria-hidden="true">
        <i class="ti ${activity.icon}"></i>
      </div>
      
      <div class="activity-item__content">
        <p class="activity-item__description">${activity.description}</p>
        <span class="activity-item__time">${relativeTime}</span>
      </div>
      
      ${pointsBadge}
      
      ${activity.referralId ? `
        <i class="ti ti-chevron-left activity-item__arrow" aria-hidden="true"></i>
      ` : ''}
    </li>
  `;
}

/**
 * Renders empty state for activity feed
 * @returns {string} HTML string
 */
_renderEmptyActivity() {
  return `
    <section class="dashboard__activity" aria-label="פעילות אחרונה">
      <header class="activity-feed__header">
        <h2 class="activity-feed__title">
          <i class="ti ti-activity"></i>
          פעילות אחרונה
        </h2>
      </header>
      
      <div class="activity-feed--empty">
        <div class="activity-feed__empty-icon" aria-hidden="true">
          <i class="ti ti-inbox"></i>
        </div>
        <p class="activity-feed__empty-text">עדיין אין פעילות</p>
        <p class="activity-feed__empty-subtext">הפנה את החבר הראשון שלך כדי להתחיל לצבור נקודות!</p>
        <button 
          class="btn btn--primary"
          data-navigate="positions"
          aria-label="הפנה מועמד"
        >
          <i class="ti ti-user-plus"></i>
          הפנה מועמד
        </button>
      </div>
    </section>
  `;
}
```

**Update DashboardComponent template() to include activity feed:**

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
        
        ${this._renderActivityFeed()}
        
        <section class="dashboard__actions">
          <!-- Quick actions will go here (Story 2.4) -->
        </section>
      </main>
    </div>
  `;
}
```

**Relative Time Formatter:**

```javascript
/**
 * Formats a timestamp as a relative time string in Hebrew
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Relative time in Hebrew (e.g., "לפני 2 שעות")
 */
function formatRelativeTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffSeconds < 60) {
    return 'עכשיו';
  }
  
  if (diffMinutes < 60) {
    if (diffMinutes === 1) return 'לפני דקה';
    if (diffMinutes === 2) return 'לפני 2 דקות';
    return `לפני ${diffMinutes} דקות`;
  }
  
  if (diffHours < 24) {
    if (diffHours === 1) return 'לפני שעה';
    if (diffHours === 2) return 'לפני שעתיים';
    return `לפני ${diffHours} שעות`;
  }
  
  if (diffDays === 1) {
    return 'אתמול';
  }
  
  if (diffDays === 2) {
    return 'לפני יומיים';
  }
  
  if (diffDays < 7) {
    return `לפני ${diffDays} ימים`;
  }
  
  if (diffWeeks === 1) {
    return 'לפני שבוע';
  }
  
  if (diffWeeks < 4) {
    return `לפני ${diffWeeks} שבועות`;
  }
  
  if (diffMonths === 1) {
    return 'לפני חודש';
  }
  
  if (diffMonths < 12) {
    return `לפני ${diffMonths} חודשים`;
  }
  
  // Fallback to date format for older items
  return date.toLocaleDateString('he-IL', { 
    day: 'numeric',
    month: 'short'
  });
}
```

**Register Action Handler:**

```javascript
// Add to app initialization
app.registerAction('navigate-referral-detail', (target) => {
  const referralId = target.dataset.referralId;
  
  if (referralId) {
    // Store selected referral for detail view
    stateManager.setState({
      selectedReferralId: referralId
    });
    
    router.navigate('referrals');
  }
});
```

**Keyboard Navigation:**

```javascript
// Add to DashboardComponent mount()
mount() {
  super.mount();
  this._renderHeader();
  this._renderBottomNav();
  
  // Existing code...
  
  // Add keyboard navigation for activity items
  this._setupActivityKeyboard();
}

/**
 * Sets up keyboard navigation for activity items
 */
_setupActivityKeyboard() {
  const items = this.$$('.activity-item[role="button"]');
  items.forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}
```

**Update User Generation to Include Activities:**

```javascript
// In generateUserFromEmail() or after generating referrals
function generateUserFromEmail(email) {
  const random = seededRandom(email);
  
  // ... existing code for user data and referrals ...
  
  // Generate activities from referrals
  const activities = generateActivitiesFromReferrals(referrals, random);
  
  return {
    // ... existing user properties ...
    referrals: referrals,
    activities: activities  // Add this
  };
}

// In OTPModalComponent._handleSuccess():
const user = generateUserFromEmail(email);

stateManager.setState({
  currentUser: user,
  isAuthenticated: true,
  sessionToken: `session_${Date.now()}`,
  referrals: user.referrals,
  activities: user.activities,  // Add this line
  pendingEmail: null
});
```

### CSS Styles (Add to style.css - Dashboard section)

```css
/* =========================================================================
   ACTIVITY FEED
   ========================================================================= */

/* Activity Feed Header */
.activity-feed__header {
  margin-bottom: var(--space-4);
}

.activity-feed__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-gray-800);
  margin: 0;
}

.activity-feed__title .ti {
  color: var(--color-gray-400);
}

/* Activity Feed List */
.activity-feed {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Activity Item */
.activity-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s var(--ease-default), 
              box-shadow 0.15s var(--ease-default);
}

.activity-item[role="button"] {
  cursor: pointer;
}

.activity-item[role="button"]:hover {
  transform: translateX(-2px);
  box-shadow: var(--shadow-md);
}

.activity-item[role="button"]:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.activity-item:active {
  transform: translateX(0);
}

/* Activity Icon */
.activity-item__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

/* Icon Color Variants */
.activity-item--primary .activity-item__icon {
  background: rgba(225, 5, 20, 0.1);
  color: var(--color-primary);
}

.activity-item--success .activity-item__icon {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success);
}

.activity-item--warning .activity-item__icon {
  background: rgba(243, 156, 18, 0.1);
  color: var(--color-warning);
}

.activity-item--info .activity-item__icon {
  background: rgba(9, 132, 227, 0.1);
  color: var(--color-info);
}

.activity-item--error .activity-item__icon {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

/* Activity Content */
.activity-item__content {
  flex: 1;
  min-width: 0;
}

.activity-item__description {
  font-size: var(--text-sm);
  color: var(--color-gray-800);
  margin: 0 0 var(--space-1) 0;
  line-height: 1.4;
}

.activity-item__time {
  font-size: var(--text-xs);
  color: var(--color-gray-400);
}

/* Activity Points Badge */
.activity-item__points {
  flex-shrink: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  background: rgba(225, 5, 20, 0.08);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  direction: ltr;
  unicode-bidi: isolate;
}

/* Activity Arrow */
.activity-item__arrow {
  flex-shrink: 0;
  color: var(--color-gray-300);
  font-size: 1.25rem;
  transition: transform 0.15s var(--ease-default);
}

.activity-item:hover .activity-item__arrow {
  transform: translateX(-4px);
}

/* Empty State */
.activity-feed--empty {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-4);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.activity-feed__empty-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
  font-size: 2rem;
  color: var(--color-gray-400);
}

.activity-feed__empty-text {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--color-gray-700);
  margin: 0 0 var(--space-2);
}

.activity-feed__empty-subtext {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-5);
}

/* Responsive - Tablet and up */
@media (min-width: 600px) {
  .activity-item {
    padding: var(--space-4);
  }
  
  .activity-item__icon {
    width: 44px;
    height: 44px;
  }
  
  .activity-item__description {
    font-size: var(--text-base);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .dashboard__activity {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .activity-feed {
    gap: var(--space-3);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .activity-item {
    transition: none;
  }
  
  .activity-item:hover {
    transform: none;
  }
  
  .activity-item__arrow {
    transition: none;
  }
  
  .activity-item:hover .activity-item__arrow {
    transform: none;
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #E10514 | Points badge, primary icons |
| `--color-success` | #22C55E | Hired status icon |
| `--color-warning` | #F39C12 | Interview status icon |
| `--color-info` | #0984E3 | Review/offer status icon |
| `--color-error` | #EF4444 | Rejected status icon |
| `--color-gray-800` | #1F2937 | Description text |
| `--color-gray-400` | #9CA3AF | Timestamp, secondary text |
| `--radius-lg` | 12px | Item border-radius |
| `--shadow-sm` | 0 1px 2px... | Default item shadow |

### Activity Types Reference

| Type | Icon | Color | Description Template |
|------|------|-------|---------------------|
| referral_submitted | ti-send | primary | {{name}} הוגש/ה למשרת {{position}} |
| status_change (review) | ti-eye | info | {{name}} נמצא/ת בבדיקה |
| status_change (interview) | ti-calendar-event | warning | {{name}} עבר/ה לשלב ראיון |
| status_change (offer) | ti-file-text | info | {{name}} קיבל/ה הצעת עבודה |
| status_change (hired) | ti-trophy | success | 🎉 {{name}} גויס/ה בהצלחה! |
| status_change (rejected) | ti-x | error | {{name}} לא נבחר/ה להמשך |
| points_earned | ti-star | primary | הרווחת {{points}} נקודות |

### Hebrew Relative Time Strings

| Time Range | Hebrew String |
|------------|---------------|
| < 60 seconds | עכשיו |
| 1 minute | לפני דקה |
| 2 minutes | לפני 2 דקות |
| 3-59 minutes | לפני X דקות |
| 1 hour | לפני שעה |
| 2 hours | לפני שעתיים |
| 3-23 hours | לפני X שעות |
| 1 day | אתמול |
| 2 days | לפני יומיים |
| 3-6 days | לפני X ימים |
| 1 week | לפני שבוע |
| 2-3 weeks | לפני X שבועות |
| 1 month | לפני חודש |
| 2+ months | לפני X חודשים |

### State Structure

```javascript
// Activities array structure in state
{
  activities: [
    {
      id: 'act-ref-0001-interview',
      type: 'status_change',
      description: 'דנה לוי עברה לשלב ראיון',
      points: 100,
      timestamp: '2025-12-09T14:30:00Z',
      referralId: 'ref-0001',
      icon: 'ti-calendar-event',
      iconColor: 'warning'
    },
    {
      id: 'act-ref-0001-points-interview',
      type: 'points_earned',
      description: 'הרווחת 100 נקודות',
      points: 100,
      timestamp: '2025-12-09T14:30:01Z',
      referralId: 'ref-0001',
      icon: 'ti-star',
      iconColor: 'primary'
    },
    // ... more activities
  ]
}
```

### RTL/Hebrew Considerations

1. **Arrow direction:** The chevron arrow (ti-chevron-left) points left for RTL navigation
2. **Text alignment:** Hebrew text aligns naturally to the right
3. **Points badge:** Numbers use `direction: ltr; unicode-bidi: isolate;`
4. **Hover transform:** Uses `translateX(-2px)` for RTL (moves toward navigation direction)

### Accessibility Requirements

1. **Semantic structure:**
   - Use `<ul>` with `role="list"` for activity feed
   - Use `<li>` for each activity item
   - Use `<section>` with `aria-label` for container
   
2. **Interactive items:**
   - Add `role="button"` for clickable items
   - Add `tabindex="0"` for keyboard focus
   - Add `aria-label` with full description including points and time
   
3. **Icons:**
   - Add `aria-hidden="true"` to decorative icons
   
4. **Keyboard navigation:**
   - Items focusable via Tab
   - Enter/Space activates the item
   - Visible focus indicator

### Integration Points

**Dependencies from Previous Stories:**
- `DashboardComponent` class (Stories 2.1, 2.2)
- `stateManager` with `currentUser` and `referrals`
- Router navigation (`router.navigate()`)
- Stats cards pattern (Story 2.2)
- Mock referral generation (Story 2.2)

**Extends:**
- `DashboardComponent` - Add `_renderActivityFeed()`, `_renderActivityItem()`, `_renderEmptyActivity()` methods
- `generateUserFromEmail()` - Add `activities` generation
- `OTPModalComponent._handleSuccess()` - Store activities in state

**New Utilities:**
- `formatRelativeTime()` - Hebrew relative time formatter
- `generateActivitiesFromReferrals()` - Activity generator

**Files to Modify:**
- `script.js` - Add activity generation, rendering methods, formatter (~200 lines)
- `style.css` - Add activity feed styles (~150 lines)

### Testing Scenarios

1. **Activity Feed Display:**
   - Dashboard loads → See activity feed with items
   - Activities are sorted by timestamp (newest first)
   - Maximum 10 items shown

2. **Activity Item Content:**
   - Each item shows icon, description, points (if applicable), time
   - Icons have correct colors based on type
   - Points badge shows for point-earning activities

3. **Relative Timestamps:**
   - Recent activity → "עכשיו" or "לפני X דקות"
   - Yesterday → "אתמול"
   - Older → "לפני X ימים/שבועות"

4. **Empty State:**
   - User with no referrals → Empty state with CTA
   - CTA navigates to positions page

5. **Navigation:**
   - Click on activity with referralId → Navigates to referrals
   - Non-referral activities → Not clickable

6. **Accessibility:**
   - Tab navigation works
   - Enter/Space activates items
   - Screen reader announces content

### Previous Story Learnings (Stories 2.1 & 2.2)

From Story 2.1 (Dashboard Layout & Points Summary):
- DashboardComponent renders with section-based layout
- Level calculation logic in `_calculateLevel()`
- Uses `app-layout` and `page-content` classes
- AnimationService for counter animation

From Story 2.2 (Stats Cards):
- Stats cards use responsive grid layout
- Mock referrals generated in `generateMockReferrals()`
- Referrals stored in state during login
- Action registration pattern for navigation
- Keyboard navigation setup pattern

### Project Context Quick Reference

**Naming Conventions:**
- CSS classes: BEM-kebab (`activity-item__icon`, `activity-item--primary`)
- JS methods: camelCase with underscore for private (`_renderActivityFeed`)
- Data attributes: kebab-case (`data-referral-id`)
- IDs: kebab-case with type prefix (`act-0001`)

**State Management:**
- Always use `stateManager.setState()` - never mutate directly
- Subscribe to changes with `this.subscribe()`

**Events:**
- Use `data-action` attributes for event delegation
- Register handlers with `app.registerAction()`

### References

- [Source: docs/architecture.md#4-implementation-patterns] - Naming conventions
- [Source: docs/architecture.md#5.4-component-hierarchy] - DashboardComponent structure
- [Source: docs/PRD.md#6.3-dashboard] - FR-DASH-003 Activity Feed requirement
- [Source: docs/epics.md#story-23] - Original acceptance criteria
- [Source: docs/sprint-artifacts/2-2-stats-cards.md] - Previous story patterns
- [Source: docs/project_context.md] - Quick reference rules

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete)
- docs/project_context.md (complete)
- docs/sprint-artifacts/2-1-dashboard-layout-points-summary.md (previous story)
- docs/sprint-artifacts/2-2-stats-cards.md (previous story)

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

Files to modify:
- `script.js` - Add activity generation, DashboardComponent methods, formatRelativeTime utility, action handler (~200 lines added)
- `style.css` - Add activity feed component styles (~150 lines added)

No new files created.

Depends on from previous stories:
- DashboardComponent class structure (Stories 2.1, 2.2)
- StateManager with currentUser and referrals
- Mock referral generation pattern
- Router navigation
- Header and BottomNav rendering pattern
- CSS variables and base component styles
- Action registration pattern

