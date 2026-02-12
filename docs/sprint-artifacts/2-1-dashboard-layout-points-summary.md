# Story 2.1: Dashboard Layout & Points Summary

**Status:** review

## Story

**As an** employee,
**I want** to see my dashboard with a prominent points summary,
**So that** I can immediately understand my gamification progress.

## Acceptance Criteria

### AC1: Dashboard Loading & Greeting
**Given** I am logged in and navigate to `#dashboard`
**When** the dashboard loads
**Then** I see a personalized greeting "שלום [firstName]! 👋"
**And** I see the main content area with responsive layout

### AC2: Points Summary Card Display
**Given** I am on the dashboard
**When** I view the points summary card
**Then** I see my total points with an animated counter on load
**And** I see a circular progress indicator showing progress to next level
**And** I see my current level/rank name (מתחיל, פעיל, מומחה, אלוף, or אגדה)
**And** I see how many points until the next level

### AC3: Level Calculation Example
**Given** my points are 750
**When** I view my level
**Then** I see "מומחה" as my rank
**And** the progress circle shows 75% fill toward "אלוף" (2000 points)
**And** I see "עוד 1,250 נקודות לרמה הבאה"

### AC4: Animated Counter
**Given** the page loads
**When** the points counter animates
**Then** it counts up from 0 to my total points over ~1 second
**And** the animation respects `prefers-reduced-motion`

### AC5: Reduced Motion Support
**Given** I have `prefers-reduced-motion: reduce` enabled
**When** the dashboard loads
**Then** the points counter displays immediately without animation
**And** no transitions or animations play

### AC6: Dashboard Responsive Layout
**Given** I am on mobile (< 1024px)
**When** I view the dashboard
**Then** content is stacked vertically
**And** the points card is prominently displayed at the top

**Given** I am on desktop (≥ 1024px)
**When** I view the dashboard
**Then** content uses a responsive grid layout
**And** the points card occupies appropriate space

## Tasks / Subtasks

- [x] Task 1: Create DashboardComponent class (AC: #1, #6)
  - [x] Create `DashboardComponent` extending `Component`
  - [x] Implement `template()` with greeting and layout structure
  - [x] Subscribe to `currentUser` state for user data
  - [x] Add responsive container classes

- [x] Task 2: Create PointsSummaryCard component (AC: #2, #3)
  - [x] Create `renderPointsSummary()` method
  - [x] Display total points with `points-value` class (LTR numbers)
  - [x] Calculate and display current level from points
  - [x] Calculate progress percentage to next level
  - [x] Display "עוד X נקודות לרמה הבאה" message

- [x] Task 3: Implement circular progress indicator (AC: #2, #3)
  - [x] Create SVG-based circular progress component
  - [x] Calculate stroke-dashoffset based on progress percentage
  - [x] Style with primary color for filled portion
  - [x] Add level icon/text in center

- [x] Task 4: Implement animated counter (AC: #4, #5)
  - [x] Add `animateCounter()` method to AnimationService
  - [x] Implement easing function for smooth counting
  - [x] Check `reducedMotion` before animating
  - [x] Use `requestAnimationFrame` for smooth 60fps
  - [x] Call animation on component mount

- [x] Task 5: Add dashboard CSS styles (AC: #1, #2, #6)
  - [x] Style `.dashboard` container
  - [x] Style `.dashboard__greeting` section
  - [x] Style `.points-card` with shadow and border-radius
  - [x] Style `.points-value` with LTR direction for numbers
  - [x] Style `.progress-circle` SVG
  - [x] Add responsive breakpoints

- [x] Task 6: Register component and wire up (AC: #1)
  - [x] Register `DashboardComponent` in App
  - [x] Ensure component renders on `#dashboard` route
  - [x] Verify navigation highlight updates

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**DashboardComponent Class Structure:**

```javascript
class DashboardComponent extends Component {
  constructor() {
    super();
    this._animationTriggered = false;
  }
  
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return this._renderLoading();
    
    const { firstName, points } = user;
    const levelInfo = this._calculateLevel(points);
    
    return `
      <div class="app-layout">
        <main class="dashboard page-content">
          <section class="dashboard__greeting">
            <h1 class="dashboard__title">שלום ${firstName}! 👋</h1>
          </section>
          
          <section class="dashboard__stats">
            ${this._renderPointsSummary(points, levelInfo)}
          </section>
          
          <!-- Placeholder sections for future stories -->
          <section class="dashboard__cards">
            <!-- Stats cards will go here (Story 2.2) -->
          </section>
          
          <section class="dashboard__activity">
            <!-- Activity feed will go here (Story 2.3) -->
          </section>
          
          <section class="dashboard__actions">
            <!-- Quick actions will go here (Story 2.4) -->
          </section>
        </main>
      </div>
    `;
  }
  
  _renderLoading() {
    return `
      <div class="app-layout">
        <main class="dashboard page-content">
          <div class="dashboard__loading">
            <span class="spinner"></span>
            <p>טוען...</p>
          </div>
        </main>
      </div>
    `;
  }
  
  _renderPointsSummary(points, levelInfo) {
    const { level, nextLevel, pointsToNext, progressPercent } = levelInfo;
    
    return `
      <article class="points-card" aria-label="סיכום נקודות">
        <div class="points-card__header">
          <h2 class="points-card__title">הנקודות שלי</h2>
        </div>
        
        <div class="points-card__body">
          <div class="points-card__progress">
            ${this._renderProgressCircle(progressPercent, level)}
          </div>
          
          <div class="points-card__details">
            <div class="points-card__total">
              <span class="points-value" data-target="${points}">0</span>
              <span class="points-label">נקודות</span>
            </div>
            
            <div class="points-card__level">
              <span class="level-badge level-badge--${this._getLevelClass(level)}">${level}</span>
            </div>
            
            ${nextLevel ? `
              <div class="points-card__next">
                <span class="points-next-text">עוד <strong class="points-value--inline" dir="ltr">${pointsToNext.toLocaleString('he-IL')}</strong> נקודות לרמה הבאה</span>
              </div>
            ` : `
              <div class="points-card__next points-card__next--max">
                <span class="points-next-text">🏆 הגעת לרמה הגבוהה ביותר!</span>
              </div>
            `}
          </div>
        </div>
      </article>
    `;
  }
  
  _renderProgressCircle(percent, level) {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    
    return `
      <svg class="progress-circle" viewBox="0 0 100 100" aria-hidden="true">
        <circle 
          class="progress-circle__bg"
          cx="50" cy="50" r="${radius}"
          fill="none"
          stroke-width="8"
        />
        <circle 
          class="progress-circle__fill"
          cx="50" cy="50" r="${radius}"
          fill="none"
          stroke-width="8"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" class="progress-circle__text" text-anchor="middle" dominant-baseline="middle">
          ${Math.round(percent)}%
        </text>
      </svg>
    `;
  }
  
  _calculateLevel(points) {
    const LEVELS = [
      { name: 'מתחיל', min: 0, max: 249 },
      { name: 'פעיל', min: 250, max: 749 },
      { name: 'מומחה', min: 750, max: 1999 },
      { name: 'אלוף', min: 2000, max: 4999 },
      { name: 'אגדה', min: 5000, max: Infinity }
    ];
    
    let currentIndex = LEVELS.findIndex(l => points >= l.min && points <= l.max);
    if (currentIndex === -1) currentIndex = 0;
    
    const currentLevel = LEVELS[currentIndex];
    const nextLevel = LEVELS[currentIndex + 1] || null;
    
    let progressPercent = 100;
    let pointsToNext = 0;
    
    if (nextLevel) {
      const levelRange = nextLevel.min - currentLevel.min;
      const pointsIntoLevel = points - currentLevel.min;
      progressPercent = Math.min((pointsIntoLevel / levelRange) * 100, 100);
      pointsToNext = nextLevel.min - points;
    }
    
    return {
      level: currentLevel.name,
      nextLevel: nextLevel?.name || null,
      pointsToNext,
      progressPercent
    };
  }
  
  _getLevelClass(level) {
    const classes = {
      'מתחיל': 'beginner',
      'פעיל': 'active',
      'מומחה': 'expert',
      'אלוף': 'champion',
      'אגדה': 'legend'
    };
    return classes[level] || 'beginner';
  }
  
  mount() {
    super.mount();
    
    // Trigger counter animation after mount
    if (!this._animationTriggered) {
      this._animationTriggered = true;
      this._animatePointsCounter();
    }
    
    // Subscribe to user changes for updates
    this.subscribe('currentUser', () => {
      this._refresh();
    });
  }
  
  _animatePointsCounter() {
    const pointsEl = this.$('.points-value[data-target]');
    if (!pointsEl) return;
    
    const target = parseInt(pointsEl.dataset.target, 10);
    animationService.animateCounter(pointsEl, target);
  }
  
  _refresh() {
    const appContainer = document.getElementById('app');
    if (appContainer && this.isMounted()) {
      appContainer.innerHTML = this.template();
      this._animatePointsCounter();
    }
  }
}
```

### AnimationService Counter Method (Add to AnimationService class)

```javascript
/**
 * Animates a number counter from 0 to target
 * @param {Element} element - Element to update with count
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms (default 1000)
 */
animateCounter(element, target, duration = 1000) {
  if (this._reducedMotion || !element) {
    // Show final value immediately
    element.textContent = target.toLocaleString('he-IL');
    return;
  }
  
  const start = performance.now();
  const startValue = 0;
  
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  
  const animate = (currentTime) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    
    const currentValue = Math.round(startValue + (target - startValue) * easedProgress);
    element.textContent = currentValue.toLocaleString('he-IL');
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
}
```

### CSS Styles (Add to style.css - Dashboard Components section)

```css
/* =========================================================================
   DASHBOARD COMPONENTS
   ========================================================================= */

/* Dashboard Container */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Dashboard Greeting */
.dashboard__greeting {
  margin-bottom: var(--space-2);
}

.dashboard__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-900);
}

/* Dashboard Stats Section */
.dashboard__stats {
  display: grid;
  gap: var(--space-4);
}

/* Dashboard Loading State */
.dashboard__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: var(--space-3);
  color: var(--color-gray-500);
}

/* Points Summary Card */
.points-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-5);
  overflow: hidden;
}

.points-card__header {
  margin-bottom: var(--space-4);
}

.points-card__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-gray-800);
  margin: 0;
}

.points-card__body {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.points-card__progress {
  flex-shrink: 0;
}

.points-card__details {
  flex: 1;
  min-width: 0;
}

.points-card__total {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.points-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  direction: ltr;
  unicode-bidi: isolate;
}

.points-value--inline {
  font-weight: var(--font-bold);
  color: var(--color-primary);
  direction: ltr;
  unicode-bidi: isolate;
}

.points-label {
  font-size: var(--text-base);
  color: var(--color-gray-500);
}

.points-card__level {
  margin-bottom: var(--space-3);
}

.points-card__next {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
}

.points-card__next--max {
  color: var(--color-success);
}

.points-next-text {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-wrap: wrap;
}

/* Level Badge */
.level-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.level-badge--beginner {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.level-badge--active {
  background: rgba(9, 132, 227, 0.1);
  color: var(--color-info);
}

.level-badge--expert {
  background: rgba(108, 92, 231, 0.1);
  color: #6C5CE7;
}

.level-badge--champion {
  background: rgba(241, 196, 15, 0.15);
  color: #B7950B;
}

.level-badge--legend {
  background: linear-gradient(135deg, rgba(225, 5, 20, 0.1), rgba(241, 196, 15, 0.1));
  color: var(--color-primary);
  font-weight: var(--font-bold);
}

/* Progress Circle */
.progress-circle {
  width: 100px;
  height: 100px;
}

.progress-circle__bg {
  stroke: var(--color-gray-200);
}

.progress-circle__fill {
  stroke: var(--color-primary);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s var(--ease-default);
}

.progress-circle__text {
  font-size: 16px;
  font-weight: var(--font-bold);
  fill: var(--color-gray-700);
}

/* Desktop Layout */
@media (min-width: 1024px) {
  .dashboard__stats {
    grid-template-columns: 1fr 1fr;
  }
  
  .points-card {
    padding: var(--space-6);
  }
  
  .progress-circle {
    width: 120px;
    height: 120px;
  }
  
  .progress-circle__text {
    font-size: 18px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .progress-circle__fill {
    transition: none;
  }
}
```

### Level Thresholds (Reference)

| Level | Hebrew | Points Required | Progress Range |
|-------|--------|-----------------|----------------|
| 1 | מתחיל | 0 | 0-249 |
| 2 | פעיל | 250 | 250-749 |
| 3 | מומחה | 750 | 750-1999 |
| 4 | אלוף | 2000 | 2000-4999 |
| 5 | אגדה | 5000+ | Max level |

### Points System Values (Reference)

| Action | Points | Campaign Multiplier |
|--------|--------|---------------------|
| Resume Submitted | 50 | 1.5x - 2x |
| Interview Scheduled | 100 | 1.5x - 2x |
| Candidate Hired | 500 | 1.5x - 2x |
| 3-Month Milestone | 200 | N/A |
| 6-Month Milestone | 400 | N/A |
| First Referral (bonus) | 100 | N/A |
| Referral Streak (3+) | 75/each | N/A |

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #E10514 | Points value, progress fill |
| `--color-gray-900` | #111827 | Greeting title |
| `--color-gray-600` | #4B5563 | Secondary text |
| `--color-gray-200` | #E5E7EB | Progress background |
| `--color-white` | #FFFFFF | Card background |
| `--radius-xl` | 16px | Card border-radius |
| `--shadow-md` | 0 4px 6px... | Card shadow |
| `--text-3xl` | 1.875rem | Points number |
| `--text-2xl` | 1.5rem | Greeting title |

### State Management

```javascript
// User object structure from generateUserFromEmail()
{
  id: 'usr-XXXX',
  email: 'firstname.lastname@passportcard.co.il',
  firstName: 'יוסי',
  lastName: 'כהן',
  fullName: 'יוסי כהן',
  department: 'פיתוח',
  points: 750,      // ← Used for dashboard
  level: 'מומחה',   // ← Pre-calculated, but recalculate for accuracy
  joinDate: '2023-01-15',
  avatarInitial: 'י'
}

// State access pattern
const user = stateManager.getState('currentUser');
const { firstName, points } = user;
```

### RTL/Hebrew Considerations

1. **Numbers stay LTR:** All numeric values use `direction: ltr; unicode-bidi: isolate;`
2. **Layout direction:** Dashboard layout flows RTL naturally via CSS
3. **Text alignment:** Hebrew text aligns to the right by default
4. **Flex/Grid:** Use CSS logical properties where needed

### Accessibility Requirements

1. **Semantic structure:**
   - Use `<main>` for dashboard content
   - Use `<section>` for logical groupings
   - Use `<article>` for the points card
   
2. **ARIA labels:**
   - Points card has `aria-label="סיכום נקודות"`
   - Progress circle has `aria-hidden="true"` (decorative)
   
3. **Reduced motion:**
   - Check `animationService.reducedMotion` before animations
   - Counter shows final value immediately when reduced motion preferred

### Integration Points

**Dependencies from Previous Stories:**
- `Component` base class (Story 1.1)
- `StateManager` with `currentUser` data (Story 1.3)
- `AnimationService` instance (Story 1.1)
- `router.navigate()` (Story 1.1)
- App layout with navigation (Story 1.5)
- `HeaderComponent` updates page title (Story 1.5)

**Extends:**
- `AnimationService` - Add `animateCounter()` method

**Files to Modify:**
- `script.js` - Add DashboardComponent, extend AnimationService (~150 lines)
- `style.css` - Add dashboard and points-card styles (~150 lines)

### Component Registration

```javascript
// In App initialization (DOMContentLoaded)
app.registerComponent('DashboardComponent', DashboardComponent);
```

### Testing Scenarios

1. **Points Counter Animation:**
   - Load dashboard → Counter animates from 0 to user's points
   - Enable reduced motion → Counter shows final value immediately

2. **Level Display:**
   - User with 100 points → Shows "מתחיל", progress to 250
   - User with 750 points → Shows "מומחה", 75% progress to אלוף
   - User with 5000+ points → Shows "אגדה", 100% progress, max message

3. **Responsive Layout:**
   - Mobile → Single column layout
   - Desktop → Grid layout with more spacing

4. **Navigation Integration:**
   - Navigate to dashboard → Dashboard renders
   - Header shows "דשבורד"
   - Bottom nav highlights dashboard item

### Previous Story Learnings (Epic 1)

From Story 1.1 (Project Setup):
- Component pattern with `template()`, `mount()`, `unmount()`
- Event delegation with `data-action` and `data-navigate`
- StateManager pub/sub with `subscribe()`

From Story 1.3 (OTP Verification):
- User object structure from `generateUserFromEmail()`
- User has `firstName`, `lastName`, `fullName`, `points`, `level`

From Story 1.5 (Navigation):
- `app-layout` class for proper spacing
- `page-content` class for consistent padding
- Dashboard is default authenticated route

### References

- [Source: docs/architecture.md#4-implementation-patterns] - Naming conventions
- [Source: docs/architecture.md#3.5-animation-architecture] - AnimationService pattern
- [Source: docs/PRD.md#6.3-dashboard] - FR-DASH-001 requirements
- [Source: docs/PRD.md#6.7-gamification] - FR-GAME-001, FR-GAME-002 levels
- [Source: docs/epics.md#story-21] - Original acceptance criteria
- [Source: docs/project_context.md] - Quick reference rules

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete)
- docs/project_context.md (complete)
- docs/sprint-artifacts/1-5-navigation-structure.md (previous epic story)
- script.js (current implementation)
- style.css (current implementation)

### Agent Model Used

Claude Opus 4.5 (via Cursor)

### Debug Log References

No errors encountered during implementation.

### Completion Notes List

1. **DashboardComponent** (~200 lines added to script.js):
   - Created `DashboardComponent` class extending `Component`
   - Implemented `template()` with personalized greeting "שלום [firstName]! 👋"
   - Implemented `_renderPointsSummary()` for points card
   - Implemented `_renderProgressCircle()` for SVG circular progress
   - Implemented `_calculateLevel()` for level determination
   - Implemented `_getLevelClass()` for CSS class mapping
   - Added `mount()` with counter animation trigger
   - Added `_animatePointsCounter()` to trigger animation
   - Added `_refresh()` for user data updates

2. **AnimationService Extended** (~30 lines):
   - Added `animateCounter(element, target, duration)` method
   - Uses `requestAnimationFrame` for smooth 60fps animation
   - Implements `easeOutQuart` easing function
   - Respects `prefers-reduced-motion` by showing final value immediately
   - Formats numbers using `toLocaleString('he-IL')`

3. **CSS Styles** (~180 lines added to style.css):
   - `.dashboard` container with flex column layout
   - `.dashboard__greeting` with proper spacing
   - `.dashboard__loading` state with spinner
   - `.points-card` with white bg, shadow, rounded corners
   - `.points-value` with LTR direction for numbers
   - `.level-badge` variants for all 5 levels (beginner, active, expert, champion, legend)
   - `.progress-circle` SVG with background and fill strokes
   - Responsive breakpoints for desktop (1024px+)
   - Reduced motion support for progress circle transitions

4. **Component Registration**:
   - Registered `DashboardComponent` in App initialization

### File List

Files modified:
- `script.js` - Added DashboardComponent class (~200 lines), extended AnimationService with animateCounter() (~30 lines)
- `style.css` - Added dashboard component styles (~180 lines)
- `docs/sprint-artifacts/2-1-dashboard-layout-points-summary.md` - Updated task checkboxes and status

No new files created.

Depends on from previous stories:
- Component base class ✓
- StateManager with currentUser ✓
- AnimationService (extended with animateCounter) ✓
- App component registration pattern ✓
- Navigation and layout structure ✓

