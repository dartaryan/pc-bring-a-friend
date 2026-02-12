# Story 4.1: Position List View

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to see all open positions in a list,
**So that** I can find roles to refer my contacts for.

## Acceptance Criteria

### AC1: Positions Page Load
**Given** I navigate to `#positions`
**When** the page loads
**Then** I see a "💼 משרות פתוחות" (Open Positions) heading
**And** I see a scrollable list of position cards

### AC2: Position Card Content
**Given** the mock data includes 8-12 positions
**When** I view the list
**Then** each position card shows:
  - Job title (Hebrew)
  - Department name
  - Location (e.g., "תל אביב")
  - Bonus points amount (e.g., "+500 לגיוס מוצלח")
  - "הפנה מועמד" (Refer Candidate) button
**And** cards have a colored right border accent (RTL)

### AC3: Hot Position Badge
**Given** a position is marked as "hot"
**When** I view that card
**Then** I see a "🔥 חם!" (Hot!) badge
**And** the card has additional visual emphasis

### AC4: Campaign Position Badge
**Given** a position is part of an active campaign
**When** I view that card
**Then** I see a campaign badge (e.g., "🎁 x2 נקודות!")
**And** the bonus shows the multiplied amount

### AC5: Refer Button Action
**Given** I click "הפנה מועמד" on a position card
**When** the action triggers
**Then** I am taken to the referral submission flow for that position

### AC6: Card Click Action
**Given** I click anywhere else on a position card (not the refer button)
**When** the action triggers
**Then** the position details modal opens

### AC7: Loading State
**Given** the list is loading
**When** data is being fetched
**Then** I see skeleton/loading placeholders
**And** the page doesn't jump when content loads

### AC8: Responsive Layout
**Given** I view the positions page
**When** on mobile (< 600px)
**Then** cards display as single column full-width
**When** on tablet (600-1023px)
**Then** cards display as 2-column grid
**When** on desktop (≥ 1024px)
**Then** cards display as 3-column grid

### AC9: Empty State
**Given** there are no positions available
**When** the list loads
**Then** I see an empty state message
**And** I see a "בקרוב..." (Coming soon) or similar message

### AC10: Accessibility
**Given** I use a keyboard or screen reader
**When** navigating the positions list
**Then** I can tab through all position cards
**And** each card announces its content correctly
**And** buttons have clear focus indicators
**And** touch targets are minimum 44×44px

## Tasks / Subtasks

- [x] Task 1: Create PositionsComponent (AC: #1, #7)
  - [x] Create PositionsComponent class extending Component base
  - [x] Implement template() with page heading and container
  - [x] Add loading state with skeleton placeholders
  - [x] Register route in Router

- [x] Task 2: Create position mock data (AC: #2, #3, #4)
  - [x] Add MOCK_POSITIONS constant with 8-12 positions
  - [x] Include department, location, bonus, description fields
  - [x] Mark 2-3 positions as "hot"
  - [x] Mark 1-2 positions with campaign multipliers
  - [x] Use realistic Hebrew titles and departments

- [x] Task 3: Create PositionCard component (AC: #2)
  - [x] Create PositionCard class or render method
  - [x] Display job title, department, location, bonus
  - [x] Add colored border accent (RTL-aware)
  - [x] Add "הפנה מועמד" button with data-action

- [x] Task 4: Add badge styling (AC: #3, #4)
  - [x] Style "hot" badge with fire icon
  - [x] Style campaign badge with multiplier
  - [x] Add visual emphasis for hot positions

- [x] Task 5: Wire button and card actions (AC: #5, #6)
  - [x] Register `refer-position` action handler
  - [x] Register `view-position-details` action handler
  - [x] Navigate to referral form on refer button click
  - [x] Open modal on card click (Story 4.3)

- [x] Task 6: Add responsive styles (AC: #8)
  - [x] Mobile: single column layout
  - [x] Tablet: 2-column grid
  - [x] Desktop: 3-column grid

- [x] Task 7: Add empty state (AC: #9)
  - [x] Create empty state template
  - [x] Style empty state message

- [x] Task 8: Add accessibility features (AC: #10)
  - [x] Add proper ARIA labels
  - [x] Ensure focus indicators visible
  - [x] Verify 44px minimum touch targets
  - [x] Test with keyboard navigation

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**Mock Position Data Structure:**

```javascript
// ============================================
// MOCK DATA - Positions (add to existing MOCK_DATA)
// ============================================

const MOCK_POSITIONS = [
  {
    id: 'pos-001',
    title: 'מפתח/ת Full Stack',
    titleEn: 'Full Stack Developer',
    department: 'פיתוח',
    departmentEn: 'Development',
    location: 'תל אביב',
    type: 'full-time',
    description: 'אנחנו מחפשים מפתח/ת Full Stack מנוסה להצטרף לצוות הפיתוח שלנו. עבודה עם טכנולוגיות מתקדמות בסביבה דינמית.',
    requirements: [
      '3+ שנות ניסיון בפיתוח Full Stack',
      'ידע ב-JavaScript, React, Node.js',
      'ניסיון עם מסדי נתונים SQL ו-NoSQL',
      'יכולת עבודה בצוות ותקשורת מעולה'
    ],
    bonus: 500,
    isHot: true,
    campaign: null,
    postedDate: '2025-12-01'
  },
  {
    id: 'pos-002',
    title: 'מעצב/ת UX/UI',
    titleEn: 'UX/UI Designer',
    department: 'מוצר',
    departmentEn: 'Product',
    location: 'תל אביב',
    type: 'full-time',
    description: 'מחפשים מעצב/ת UX/UI יצירתי/ת עם חשיבה ממוקדת משתמש. הזדמנות להשפיע על מוצרים שמשרתים אלפי משתמשים.',
    requirements: [
      '2+ שנות ניסיון בעיצוב UX/UI',
      'שליטה ב-Figma',
      'הבנה של עקרונות עיצוב ונגישות',
      'פורטפוליו מרשים'
    ],
    bonus: 500,
    isHot: false,
    campaign: {
      id: 'camp-001',
      name: 'קמפיין מעצבים',
      multiplier: 2,
      endDate: '2025-12-31'
    },
    postedDate: '2025-12-05'
  },
  {
    id: 'pos-003',
    title: 'מנהל/ת שיווק דיגיטלי',
    titleEn: 'Digital Marketing Manager',
    department: 'שיווק',
    departmentEn: 'Marketing',
    location: 'רמת גן',
    type: 'full-time',
    description: 'אנחנו מחפשים מנהל/ת שיווק דיגיטלי להוביל את הפעילות השיווקית שלנו. תפקיד אסטרטגי עם השפעה רחבה.',
    requirements: [
      '4+ שנות ניסיון בשיווק דיגיטלי',
      'ניסיון עם Google Ads, Facebook Ads',
      'ניתוח נתונים ואופטימיזציה',
      'אנגלית ברמה גבוהה'
    ],
    bonus: 500,
    isHot: true,
    campaign: null,
    postedDate: '2025-12-03'
  },
  {
    id: 'pos-004',
    title: 'אנליסט/ית נתונים',
    titleEn: 'Data Analyst',
    department: 'כספים',
    departmentEn: 'Finance',
    location: 'תל אביב',
    type: 'full-time',
    description: 'הצטרפו לצוות הכספים שלנו כאנליסט/ית נתונים. תפקיד מרכזי בקבלת החלטות מבוססות נתונים.',
    requirements: [
      '2+ שנות ניסיון באנליזה',
      'שליטה ב-Excel, SQL',
      'ניסיון עם כלי BI',
      'יכולת הצגה והסברה'
    ],
    bonus: 450,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-07'
  },
  {
    id: 'pos-005',
    title: 'מגייס/ת טכנולוגי/ת',
    titleEn: 'Tech Recruiter',
    department: 'HR',
    departmentEn: 'HR',
    location: 'תל אביב',
    type: 'full-time',
    description: 'מחפשים מגייס/ת עם רקע טכנולוגי להצטרף לצוות ה-HR. תפקיד מגוון עם אפשרויות התפתחות.',
    requirements: [
      '2+ שנות ניסיון בגיוס',
      'הבנה בסיסית בטכנולוגיה',
      'יחסי אנוש מעולים',
      'יצירתיות בחיפוש מועמדים'
    ],
    bonus: 400,
    isHot: false,
    campaign: {
      id: 'camp-002',
      name: 'בונוס HR',
      multiplier: 1.5,
      endDate: '2025-12-20'
    },
    postedDate: '2025-12-08'
  },
  {
    id: 'pos-006',
    title: 'מפתח/ת Backend',
    titleEn: 'Backend Developer',
    department: 'פיתוח',
    departmentEn: 'Development',
    location: 'תל אביב',
    type: 'full-time',
    description: 'מחפשים מפתח/ת Backend להצטרף לצוות. עבודה עם מערכות בקנה מידה גדול.',
    requirements: [
      '3+ שנות ניסיון בפיתוח Backend',
      'ידע ב-Node.js או Python',
      'ניסיון עם AWS/GCP',
      'הבנה של ארכיטקטורת מיקרו-סרביסים'
    ],
    bonus: 500,
    isHot: true,
    campaign: null,
    postedDate: '2025-12-02'
  },
  {
    id: 'pos-007',
    title: 'מנהל/ת מוצר',
    titleEn: 'Product Manager',
    department: 'מוצר',
    departmentEn: 'Product',
    location: 'רמת גן',
    type: 'full-time',
    description: 'מחפשים PM מנוסה להוביל מוצרים מאפס עד להשקה. תפקיד עם השפעה משמעותית.',
    requirements: [
      '3+ שנות ניסיון כ-PM',
      'רקע טכני - יתרון',
      'יכולת ניתוח שוק ומתחרים',
      'ניסיון בעבודה Agile'
    ],
    bonus: 550,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-04'
  },
  {
    id: 'pos-008',
    title: 'נציג/ת שירות לקוחות',
    titleEn: 'Customer Service Representative',
    department: 'שירות',
    departmentEn: 'Service',
    location: 'תל אביב',
    type: 'part-time',
    description: 'הצטרפו לצוות שירות הלקוחות שלנו. משרה חלקית עם גמישות בשעות.',
    requirements: [
      'ניסיון בשירות לקוחות - יתרון',
      'סבלנות ויכולת הקשבה',
      'יכולת עבודה בצוות',
      'זמינות למשמרות'
    ],
    bonus: 300,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-09'
  },
  {
    id: 'pos-009',
    title: 'מהנדס/ת DevOps',
    titleEn: 'DevOps Engineer',
    department: 'פיתוח',
    departmentEn: 'Development',
    location: 'תל אביב',
    type: 'full-time',
    description: 'מחפשים מהנדס/ת DevOps לשיפור תהליכי הפיתוח וההטמעה שלנו.',
    requirements: [
      '3+ שנות ניסיון ב-DevOps',
      'ניסיון עם Kubernetes, Docker',
      'ידע ב-CI/CD pipelines',
      'ניסיון עם תשתיות ענן'
    ],
    bonus: 500,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-06'
  },
  {
    id: 'pos-010',
    title: 'מנהל/ת פיננסי',
    titleEn: 'Finance Manager',
    department: 'כספים',
    departmentEn: 'Finance',
    location: 'רמת גן',
    type: 'full-time',
    description: 'תפקיד ניהולי בכיר במחלקת הכספים. אחריות על תכנון וניהול תקציב.',
    requirements: [
      '5+ שנות ניסיון בכספים',
      'רו״ח - יתרון',
      'ניסיון ניהולי',
      'שליטה ב-Excel מתקדם'
    ],
    bonus: 600,
    isHot: false,
    campaign: null,
    postedDate: '2025-12-01'
  }
];
```

**PositionsComponent:**

```javascript
// ============================================
// COMPONENTS - Positions (new)
// ============================================

class PositionsComponent extends Component {
  constructor(props) {
    super(props);
    this.positions = [];
    this.isLoading = true;
  }
  
  template() {
    return `
      <main class="positions-page">
        <header class="positions-header">
          <h1 class="positions-title">💼 משרות פתוחות</h1>
          <p class="positions-subtitle">מצאו משרה מתאימה והפנו מועמדים מהרשת שלכם</p>
        </header>
        
        <div class="positions-list" id="positions-list">
          ${this.isLoading ? this._renderSkeletons() : this._renderPositions()}
        </div>
      </main>
    `;
  }
  
  /**
   * Renders skeleton placeholders during loading
   * @returns {string} HTML string
   */
  _renderSkeletons() {
    const skeletons = Array(6).fill(0).map(() => `
      <div class="position-card position-card--skeleton" aria-hidden="true">
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text skeleton--short"></div>
        <div class="skeleton skeleton--button"></div>
      </div>
    `).join('');
    
    return skeletons;
  }
  
  /**
   * Renders position cards or empty state
   * @returns {string} HTML string
   */
  _renderPositions() {
    if (this.positions.length === 0) {
      return this._renderEmptyState();
    }
    
    return this.positions.map(position => this._renderPositionCard(position)).join('');
  }
  
  /**
   * Renders a single position card
   * @param {Object} position - Position data
   * @returns {string} HTML string
   */
  _renderPositionCard(position) {
    const effectiveBonus = position.campaign 
      ? Math.round(position.bonus * position.campaign.multiplier) 
      : position.bonus;
    
    return `
      <article class="position-card ${position.isHot ? 'position-card--hot' : ''}"
               data-action="view-position-details"
               data-position-id="${position.id}"
               tabindex="0"
               role="button"
               aria-label="${position.title} - ${position.department}">
        
        <div class="position-card__badges">
          ${position.isHot ? `
            <span class="badge badge--hot" aria-label="משרה חמה">
              🔥 חם!
            </span>
          ` : ''}
          ${position.campaign ? `
            <span class="badge badge--campaign" aria-label="קמפיין פעיל">
              🎁 x${position.campaign.multiplier} נקודות!
            </span>
          ` : ''}
        </div>
        
        <div class="position-card__content">
          <h2 class="position-card__title">${position.title}</h2>
          
          <div class="position-card__meta">
            <span class="position-card__department">
              <i class="ti ti-building" aria-hidden="true"></i>
              ${position.department}
            </span>
            <span class="position-card__location">
              <i class="ti ti-map-pin" aria-hidden="true"></i>
              ${position.location}
            </span>
            ${position.type === 'part-time' ? `
              <span class="position-card__type">
                <i class="ti ti-clock" aria-hidden="true"></i>
                חלקית
              </span>
            ` : ''}
          </div>
          
          <div class="position-card__bonus">
            <span class="position-card__bonus-icon" aria-hidden="true">💰</span>
            <span class="position-card__bonus-text">
              +${effectiveBonus} לגיוס מוצלח
            </span>
          </div>
        </div>
        
        <div class="position-card__actions">
          <button class="btn btn--primary btn--sm position-card__refer-btn"
                  data-action="refer-position"
                  data-position-id="${position.id}"
                  onclick="event.stopPropagation()">
            <i class="ti ti-user-plus" aria-hidden="true"></i>
            הפנה מועמד
          </button>
        </div>
      </article>
    `;
  }
  
  /**
   * Renders empty state when no positions available
   * @returns {string} HTML string
   */
  _renderEmptyState() {
    return `
      <div class="positions-empty">
        <div class="positions-empty__icon" aria-hidden="true">
          <i class="ti ti-briefcase-off"></i>
        </div>
        <h2 class="positions-empty__title">אין משרות פתוחות כרגע</h2>
        <p class="positions-empty__text">בקרוב נוסיף משרות חדשות. חזרו בקרוב!</p>
      </div>
    `;
  }
  
  /**
   * Loads positions from DataService/mock data
   */
  async _loadPositions() {
    this.isLoading = true;
    this._updateList();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Load positions from mock data
    this.positions = MOCK_POSITIONS;
    this.isLoading = false;
    
    this._updateList();
  }
  
  /**
   * Updates the positions list in DOM
   */
  _updateList() {
    const listEl = document.getElementById('positions-list');
    if (listEl) {
      listEl.innerHTML = this.isLoading ? this._renderSkeletons() : this._renderPositions();
    }
  }
  
  mount() {
    this._loadPositions();
    this.bindEvents();
  }
  
  bindEvents() {
    // Handle card keyboard interaction
    const container = document.getElementById('positions-list');
    if (container) {
      container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const card = e.target.closest('.position-card');
          if (card && !e.target.matches('button')) {
            e.preventDefault();
            const positionId = card.dataset.positionId;
            if (positionId) {
              this._openPositionDetails(positionId);
            }
          }
        }
      });
    }
  }
  
  /**
   * Opens position details modal
   * @param {string} positionId - Position ID
   */
  _openPositionDetails(positionId) {
    const position = this.positions.find(p => p.id === positionId);
    if (position) {
      stateManager.setState({
        selectedPosition: position,
        activeModal: 'position-details'
      });
      // Modal will be implemented in Story 4.3
    }
  }
  
  unmount() {
    super.unmount();
  }
}
```

**Action Handlers:**

```javascript
// ============================================
// ACTION HANDLERS - Positions (add to existing)
// ============================================

// Open position details modal
app.registerAction('view-position-details', (target) => {
  const positionId = target.dataset.positionId || target.closest('[data-position-id]')?.dataset.positionId;
  if (!positionId) return;
  
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  if (position) {
    stateManager.setState({
      selectedPosition: position,
      activeModal: 'position-details'
    });
    // Position detail modal will be implemented in Story 4.3
    // For now, just log
    console.log('Position selected:', position.title);
  }
});

// Navigate to referral form
app.registerAction('refer-position', (target) => {
  const positionId = target.dataset.positionId;
  if (!positionId) return;
  
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  if (position) {
    stateManager.setState({
      referringPosition: position
    });
    // Navigate to referral form (Story 4.5)
    router.navigate('refer', { positionId });
  }
});
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   POSITIONS PAGE (Story 4.1)
   ========================================================================= */

/* Page Layout */
.positions-page {
  padding: var(--space-4);
  padding-bottom: calc(var(--space-4) + 80px); /* Space for bottom nav */
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.positions-header {
  margin-bottom: var(--space-6);
  text-align: center;
}

.positions-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
}

.positions-subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
}

/* Positions List - Grid */
.positions-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

/* Tablet: 2 columns */
@media (min-width: 600px) {
  .positions-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .positions-list {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .positions-page {
    padding: var(--space-6);
    padding-bottom: var(--space-6);
  }
}

/* =========================================================================
   POSITION CARD
   ========================================================================= */

.position-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  border-inline-start: 4px solid var(--color-primary);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  position: relative;
}

.position-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.position-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Hot Position */
.position-card--hot {
  border-inline-start-color: #F39C12;
  background: linear-gradient(
    135deg,
    var(--color-surface) 0%,
    rgba(243, 156, 18, 0.05) 100%
  );
}

/* Badges Container */
.position-card__badges {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
}

/* Badge Styles */
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.badge--hot {
  background: linear-gradient(135deg, #F39C12 0%, #E67E22 100%);
  color: white;
}

.badge--campaign {
  background: linear-gradient(135deg, #6C5CE7 0%, #A66EFC 100%);
  color: white;
}

/* Card Content */
.position-card__content {
  flex: 1;
  padding-top: var(--space-6); /* Space for badges */
}

.position-card__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
  line-height: 1.3;
}

.position-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.position-card__department,
.position-card__location,
.position-card__type {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.position-card__meta .ti {
  font-size: 1rem;
  color: var(--color-primary);
}

/* Bonus Display */
.position-card__bonus {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: linear-gradient(135deg, rgba(241, 196, 15, 0.15) 0%, rgba(241, 196, 15, 0.05) 100%);
  border-radius: var(--radius-md);
  border: 1px solid rgba(241, 196, 15, 0.3);
}

.position-card__bonus-icon {
  font-size: 1rem;
}

.position-card__bonus-text {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: #B7950B;
  direction: ltr;
  unicode-bidi: isolate;
}

/* Card Actions */
.position-card__actions {
  display: flex;
  justify-content: flex-start;
}

.position-card__refer-btn {
  min-width: 44px;
  min-height: 44px;
}

/* =========================================================================
   SKELETON LOADING
   ========================================================================= */

.position-card--skeleton {
  cursor: default;
  pointer-events: none;
  border-inline-start-color: var(--color-surface-secondary);
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-secondary) 25%,
    var(--color-surface-hover) 50%,
    var(--color-surface-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

.skeleton--title {
  height: 24px;
  width: 70%;
  margin-bottom: var(--space-3);
}

.skeleton--text {
  height: 16px;
  width: 100%;
  margin-bottom: var(--space-2);
}

.skeleton--text.skeleton--short {
  width: 50%;
}

.skeleton--button {
  height: 40px;
  width: 120px;
  margin-top: var(--space-3);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* =========================================================================
   EMPTY STATE
   ========================================================================= */

.positions-empty {
  grid-column: 1 / -1; /* Span all columns */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-4);
  text-align: center;
}

.positions-empty__icon {
  font-size: 4rem;
  color: var(--text-muted);
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.positions-empty__title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
}

.positions-empty__text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .position-card {
    transition: none;
  }
  
  .skeleton {
    animation: none;
    background: var(--color-surface-secondary);
  }
}
```

### Router Registration

```javascript
// ============================================
// ROUTER - Add positions route (update existing)
// ============================================

const ROUTES = {
  auth: LoginComponent,
  passport: PassportComponent,
  dashboard: DashboardComponent,
  positions: PositionsComponent,  // ← Add this
  referrals: ReferralsComponent,
  settings: SettingsComponent
};
```

### State Keys Used

| Key | Type | Description |
|-----|------|-------------|
| `selectedPosition` | Object | Currently selected position for modal |
| `referringPosition` | Object | Position being referred for |
| `activeModal` | String | 'position-details' when modal open |

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#E10514` | Card border, icons |
| `--shadow-sm` | `0 1px 3px...` | Card default shadow |
| `--shadow-md` | `0 4px 6px...` | Card hover shadow |
| `--radius-lg` | `16px` | Card corners |
| Card transition | `200ms` | Hover effect |
| Skeleton animation | `1500ms` | Shimmer cycle |

### Dependencies

**From Previous Stories:**
- Component base class (Story 1.1)
- Router with navigate method (Story 1.1)
- StateManager (Story 1.1)
- Action handler pattern (Story 1.1)
- Button styles (.btn, .btn--primary) (Story 1.2)
- Navigation structure (Story 1.5)

**Creates Foundation For:**
- Story 4.2: Position Filters & Search
- Story 4.3: Position Details Modal
- Story 4.4: Share Referral Link
- Story 4.5: Referral Form

### Integration Points

**Files to Modify:**
- `script.js` - Add MOCK_POSITIONS, PositionsComponent, action handlers (~350 lines)
- `style.css` - Add positions page, card, skeleton, empty state styles (~250 lines)

**No new files created.**

### Testing Scenarios

1. **Page Load:**
   - Navigate to `#positions` → Shows loading skeletons
   - After ~300ms → Shows position cards
   - Page heading visible

2. **Card Content:**
   - Each card shows title, department, location
   - Bonus amount displayed correctly
   - "הפנה מועמד" button visible

3. **Hot Badge:**
   - Positions with `isHot: true` show fire badge
   - Card has orange border and subtle gradient

4. **Campaign Badge:**
   - Positions with campaign show multiplier badge
   - Bonus shows calculated multiplied amount

5. **Card Interaction:**
   - Click card body → Opens details modal (Story 4.3)
   - Click refer button → Navigates to referral form (Story 4.5)

6. **Keyboard Navigation:**
   - Tab through cards → Focus indicator visible
   - Enter on card → Opens details modal
   - Tab to button → Can activate with Enter/Space

7. **Responsive Layout:**
   - Mobile (< 600px) → Single column
   - Tablet (600-1023px) → Two columns
   - Desktop (≥ 1024px) → Three columns

8. **Empty State:**
   - Set MOCK_POSITIONS = [] → Shows empty message
   - Icon and text visible

9. **Accessibility:**
   - Cards have proper ARIA labels
   - Focus indicators visible
   - 44px minimum touch targets

### Project Structure Notes

- Follows three-file architecture (all code in script.js, style.css)
- Uses existing component lifecycle pattern
- Mock data stored in constants section
- Action handlers registered in app initialization

### References

- [Source: docs/architecture.md#5.4] - Component hierarchy
- [Source: docs/architecture.md#4.2] - CSS naming patterns
- [Source: docs/architecture.md#4.9] - Mock data ID patterns
- [Source: docs/epics.md#story-41] - Original acceptance criteria
- [Source: docs/PRD.md#64] - Position list requirements (FR-POS-001)
- [Source: docs/project_context.md] - Implementation rules

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/epics.md (complete - Epic 4, Story 4.1)
- docs/PRD.md (FR-POS-001 requirements)
- docs/project_context.md (implementation rules)
- docs/sprint-status.yaml (current status)

### Agent Model Used

Claude Opus 4.5 (Developer - Amelia)

### Debug Log References

None - no issues encountered.

### Completion Notes List

- ✅ Implemented MOCK_POSITIONS with 10 positions covering all departments, locations, and types
- ✅ Created PositionsComponent class extending Component base with all lifecycle methods
- ✅ Implemented _renderPositionCard() with RTL-aware styling and badges for hot/campaign positions
- ✅ Added skeleton loading with shimmer animation during data load (300ms simulated delay)
- ✅ Wired action handlers: `view-position-details` and `refer-position` with state management
- ✅ Added responsive CSS grid: 1-col mobile, 2-col tablet (600px+), 3-col desktop (1024px+)
- ✅ Empty state renders when positions array is empty
- ✅ Full accessibility: ARIA labels, role="list/listitem", tabindex, 44px touch targets, focus indicators
- ✅ Keyboard navigation: Enter/Space on cards opens details
- ✅ Reduced motion support for all animations

### File List

Files modified:
- `script.js` - Added MOCK_POSITIONS constant (~180 lines), PositionsComponent class (~230 lines), action handlers (~30 lines)
- `style.css` - Added positions page layout, position card styles, skeleton loading, empty state, responsive grid (~280 lines)

No new files created.

Creates foundation for:
- Story 4.2: Position Filters & Search (extends PositionsComponent)
- Story 4.3: Position Details Modal (uses selectedPosition state)
- Story 4.4: Share Referral Link (uses position data)
- Story 4.5: Referral Form (uses referringPosition state)

