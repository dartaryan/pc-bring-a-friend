# Story 3.1: Passport Cover Design

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to see a beautiful passport cover with my information,
**So that** I feel the passport is personalized and premium.

## Acceptance Criteria

### AC1: Passport Container Display
**Given** I navigate to `#passport`
**When** the page loads
**Then** I see a closed passport book centered on screen
**And** the passport has aspect ratio 3:4 (like a real passport)

### AC2: Passport Cover Visual Design
**Given** I view the passport cover
**When** I look at the design
**Then** I see a deep navy background (#1A1A2E) with subtle leather texture
**And** I see a gold (#C9A961) inner border/frame with rounded corners
**And** I see the PassportCard logo in gold centered at top

### AC3: Passport Cover Content
**Given** I view the passport cover content
**When** I read the text
**Then** I see "דרכון הפניות" (Referral Passport) as the title
**And** I see "REFERRAL PASSPORT" in English subtitle
**And** I see my full name in Hebrew at the bottom
**And** I see a passport number (e.g., "מספר: REF-2025-001")

### AC4: Mobile Responsive Size
**Given** I am on mobile
**When** I view the passport
**Then** the passport width is ~280px (responsive)
**And** there is a shadow effect creating depth (shadow-passport)

### AC5: Desktop Responsive Size
**Given** I am on desktop
**When** I view the passport
**Then** the passport width is ~360-400px
**And** the passport is centered with generous margins

### AC6: Summary Stats Below Passport
**Given** I view below the passport
**When** I see the summary
**Then** I see "X חותמות | Y נקודות" (stamps count | points)
**And** I see a CTA button "פתח את הדרכון" (Open the Passport)

### AC7: Touch Targets
**Given** I am on a touch device
**When** I view the passport and CTA
**Then** the CTA button meets 44×44px minimum touch target

### AC8: Accessibility
**Given** I use a screen reader
**When** I navigate to the passport view
**Then** the passport cover has semantic structure with headings
**And** the CTA button has descriptive aria-label
**And** focus indicator is visible on interactive elements

## Tasks / Subtasks

- [x] Task 1: Create PassportComponent class structure (AC: #1)
  - [x] Create PassportComponent extending Component base class
  - [x] Implement template() returning passport container HTML
  - [x] Register route 'passport' in Router
  - [x] Set up component mounting and state subscription

- [x] Task 2: Implement passport cover HTML structure (AC: #2, #3)
  - [x] Create `.passport` container with 3:4 aspect ratio
  - [x] Create `.passport-cover` with gold inner border
  - [x] Add PassportCard logo SVG in gold
  - [x] Add title, subtitle, user name, and passport number

- [x] Task 3: Generate passport number (AC: #3)
  - [x] Add `generatePassportNumber()` utility function
  - [x] Format: `REF-YYYY-XXX` where YYYY is join year, XXX is seeded sequence
  - [x] Store passport number with user data

- [x] Task 4: Add passport summary section (AC: #6)
  - [x] Render stamps count from user data
  - [x] Render points total from user data
  - [x] Add CTA button "פתח את הדרכון"
  - [x] Use `data-action="open-passport"` attribute

- [x] Task 5: Create CSS for passport cover (AC: #2, #4, #5)
  - [x] Style `.passport` container with aspect-ratio: 3/4
  - [x] Apply gradient background (`--gradient-passport-cover`)
  - [x] Add leather texture overlay effect
  - [x] Add gold inner border with `--passport-cover-accent`
  - [x] Apply `--shadow-passport` for depth

- [x] Task 6: Create CSS for passport cover content (AC: #3)
  - [x] Style logo placement and gold color
  - [x] Style title typography (Hebrew + English)
  - [x] Style separator lines
  - [x] Style user name and passport number at bottom

- [x] Task 7: Add responsive styles (AC: #4, #5)
  - [x] Mobile: max-width 280px, centered
  - [x] Tablet: max-width 320px
  - [x] Desktop: max-width 360-400px, generous margins

- [x] Task 8: Style summary and CTA section (AC: #6, #7)
  - [x] Style stats display (stamps | points)
  - [x] Style CTA button with minimum 44px height
  - [x] Add hover/active states

- [x] Task 9: Add accessibility attributes (AC: #8)
  - [x] Add semantic headings (h1 for page, h2 for sections)
  - [x] Add aria-label to CTA button
  - [x] Ensure focus indicators are visible

- [x] Task 10: Register action handler for passport open (AC: #6)
  - [x] Register `open-passport` action
  - [x] For now, set state flag `passportOpen: true` (animation in Story 3.2)
  - [x] Console log for verification until animation implemented

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**PassportComponent Class Structure:**

```javascript
// ============================================
// COMPONENTS - Passport
// ============================================

/**
 * PassportComponent - Displays the passport cover and manages passport state
 * First component in Epic 3 - establishes passport rendering patterns
 */
class PassportComponent extends Component {
  constructor(props) {
    super(props);
    this.passportState = {
      isOpen: false,
      currentPage: 0
    };
  }
  
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return this._renderLoading();
    
    return `
      <div class="app-layout">
        <div class="header-container"></div>
        <nav class="bottom-nav-container"></nav>
        <main class="passport-view page-content">
          ${this._renderPassportClosed(user)}
        </main>
      </div>
    `;
  }
  
  /**
   * Renders the closed passport cover
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderPassportClosed(user) {
    const passportNumber = this._getPassportNumber(user);
    const stamps = stateManager.getState('stamps') || [];
    const points = user.points || 0;
    
    return `
      <section class="passport-container" aria-label="הדרכון שלי">
        <article class="passport passport--closed">
          <div class="passport-cover">
            <div class="passport-cover__border">
              <div class="passport-cover__content">
                ${this._renderPassportLogo()}
                
                <div class="passport-cover__divider"></div>
                
                <div class="passport-cover__title">
                  <h1 class="passport-cover__title-he">דרכון הפניות</h1>
                  <p class="passport-cover__title-en">REFERRAL PASSPORT</p>
                </div>
                
                <div class="passport-cover__divider"></div>
                
                <div class="passport-cover__user">
                  <p class="passport-cover__name">${user.firstName} ${user.lastName}</p>
                  <p class="passport-cover__number">מספר: ${passportNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
        
        <div class="passport-summary">
          <p class="passport-summary__stats">
            <span class="passport-summary__stamps">${stamps.length} חותמות</span>
            <span class="passport-summary__separator">|</span>
            <span class="passport-summary__points">${points.toLocaleString()} נקודות</span>
          </p>
          
          <button 
            class="btn btn--primary passport-summary__cta"
            data-action="open-passport"
            aria-label="פתח את הדרכון שלי"
          >
            <i class="ti ti-book-2" aria-hidden="true"></i>
            פתח את הדרכון
          </button>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders PassportCard logo in gold
   * @returns {string} SVG logo HTML
   */
  _renderPassportLogo() {
    // Use simplified PassportCard logo in gold
    return `
      <div class="passport-cover__logo" aria-label="PassportCard">
        <svg viewBox="0 0 120 40" class="passport-logo" aria-hidden="true">
          <text x="60" y="28" text-anchor="middle" 
                font-family="Rubik, sans-serif" 
                font-weight="700" 
                font-size="16"
                fill="currentColor">
            PassportCard
          </text>
        </svg>
      </div>
    `;
  }
  
  /**
   * Gets or generates passport number for user
   * @param {Object} user - User object
   * @returns {string} Passport number (e.g., "REF-2025-001")
   */
  _getPassportNumber(user) {
    if (user.passportNumber) return user.passportNumber;
    
    // Generate from user ID
    const idNum = user.id.replace('usr-', '').padStart(3, '0');
    const year = new Date().getFullYear();
    return `REF-${year}-${idNum}`;
  }
  
  /**
   * Renders loading state
   * @returns {string} HTML string
   */
  _renderLoading() {
    return `
      <div class="app-layout">
        <div class="header-container"></div>
        <nav class="bottom-nav-container"></nav>
        <main class="passport-view page-content">
          <div class="loading-state">
            <div class="spinner" aria-label="טוען..."></div>
          </div>
        </main>
      </div>
    `;
  }
  
  mount() {
    this.bindEvents();
    
    // Subscribe to user changes
    this.subscribe('currentUser', this._handleUserChange.bind(this));
    this.subscribe('stamps', this._handleStampsChange.bind(this));
    
    // Render header and navigation
    this._renderLayout();
  }
  
  unmount() {
    super.unmount();
  }
  
  /**
   * Renders header and bottom nav
   */
  _renderLayout() {
    const headerContainer = this.element?.querySelector('.header-container');
    const navContainer = this.element?.querySelector('.bottom-nav-container');
    
    if (headerContainer) {
      headerContainer.innerHTML = headerComponent.render();
    }
    if (navContainer) {
      navContainer.innerHTML = bottomNavComponent.render();
    }
  }
  
  _handleUserChange(newUser) {
    // Re-render if user data changes
    if (this.element) {
      this.element.innerHTML = this.template();
      this._renderLayout();
    }
  }
  
  _handleStampsChange(newStamps) {
    // Update stamps count display
    const stampsEl = this.element?.querySelector('.passport-summary__stamps');
    if (stampsEl) {
      stampsEl.textContent = `${newStamps.length} חותמות`;
    }
  }
}
```

**Register Action Handler:**

```javascript
// Add to app initialization / action handlers section
app.registerAction('open-passport', (target) => {
  // For Story 3.1, just log - animation implemented in Story 3.2
  console.log('Passport open requested');
  
  // Set state for animation (will be used by AnimationService in Story 3.2)
  stateManager.setState({
    passportOpen: true
  });
  
  // Placeholder: In Story 3.2, this will trigger animationService.animatePassportOpen()
});
```

**Update Router to Include Passport Route:**

```javascript
// Ensure passport route is registered
const routes = {
  'auth': LoginComponent,
  'dashboard': DashboardComponent,
  'passport': PassportComponent,  // Add this
  'positions': PositionsComponent,
  'referrals': ReferralsComponent,
  'settings': SettingsComponent
};
```

### CSS Styles (Add to style.css - Passport section)

```css
/* =========================================================================
   PASSPORT - Cover Design (Story 3.1)
   ========================================================================= */

/* Passport View Container */
.passport-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 140px); /* Account for header + nav */
  padding: var(--space-5);
}

/* Passport Container - Centers passport and summary */
.passport-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

/* Passport Book */
.passport {
  --passport-width: 280px;
  width: var(--passport-width);
  aspect-ratio: 3 / 4;
  position: relative;
  perspective: 1000px;
}

/* Passport Cover */
.passport-cover {
  width: 100%;
  height: 100%;
  background: var(--gradient-passport-cover, linear-gradient(145deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%));
  border-radius: var(--radius-passport, 8px);
  box-shadow: var(--shadow-passport, 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 5px 15px rgba(0, 0, 0, 0.2),
    inset 0 0 20px rgba(0, 0, 0, 0.1));
  position: relative;
  overflow: hidden;
  
  /* Leather texture effect */
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
    linear-gradient(145deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
}

/* Gold Inner Border */
.passport-cover__border {
  position: absolute;
  inset: 12px;
  border: 2px solid var(--passport-cover-accent, #C9A961);
  border-radius: calc(var(--radius-passport, 8px) - 4px);
  opacity: 0.7;
}

/* Passport Cover Content */
.passport-cover__content {
  position: absolute;
  inset: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) 0;
  color: var(--passport-cover-accent, #C9A961);
}

/* Logo */
.passport-cover__logo {
  width: 100%;
  max-width: 160px;
}

.passport-logo {
  width: 100%;
  height: auto;
  color: var(--passport-cover-accent, #C9A961);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Divider Lines */
.passport-cover__divider {
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--passport-cover-accent, #C9A961) 20%, 
    var(--passport-cover-accent, #C9A961) 80%, 
    transparent);
  opacity: 0.5;
}

/* Title Section */
.passport-cover__title {
  text-align: center;
}

.passport-cover__title-he {
  font-family: var(--font-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  letter-spacing: 0.05em;
  margin: 0 0 var(--space-1);
  color: var(--passport-cover-accent, #C9A961);
}

.passport-cover__title-en {
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0;
  color: var(--passport-cover-accent, #C9A961);
  opacity: 0.8;
}

/* User Info at Bottom */
.passport-cover__user {
  text-align: center;
}

.passport-cover__name {
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin: 0 0 var(--space-2);
  color: var(--passport-cover-accent, #C9A961);
}

.passport-cover__number {
  font-family: var(--font-mono, 'Consolas', monospace);
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  margin: 0;
  color: var(--passport-cover-accent, #C9A961);
  opacity: 0.7;
  direction: ltr;
  unicode-bidi: isolate;
}

/* =========================================================================
   PASSPORT SUMMARY
   ========================================================================= */

.passport-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
}

.passport-summary__stats {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
}

.passport-summary__stamps,
.passport-summary__points {
  font-weight: var(--font-medium);
}

.passport-summary__separator {
  color: var(--text-muted);
  opacity: 0.5;
}

.passport-summary__points {
  direction: ltr;
  unicode-bidi: isolate;
}

.passport-summary__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 48px;
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
}

.passport-summary__cta .ti {
  font-size: 1.25rem;
}

/* =========================================================================
   RESPONSIVE - Tablet and Desktop
   ========================================================================= */

/* Tablet */
@media (min-width: 600px) {
  .passport {
    --passport-width: 320px;
  }
  
  .passport-cover__content {
    inset: 28px;
    padding: var(--space-5) 0;
  }
  
  .passport-cover__title-he {
    font-size: var(--text-2xl);
  }
  
  .passport-cover__name {
    font-size: var(--text-xl);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .passport-view {
    padding: var(--space-7);
  }
  
  .passport {
    --passport-width: 360px;
  }
  
  .passport-cover__content {
    inset: 32px;
    padding: var(--space-6) 0;
  }
  
  .passport-cover__logo {
    max-width: 180px;
  }
  
  .passport-cover__title-he {
    font-size: 1.75rem;
  }
  
  .passport-summary {
    gap: var(--space-5);
  }
  
  .passport-summary__stats {
    font-size: var(--text-lg);
  }
}

/* Wide Desktop */
@media (min-width: 1440px) {
  .passport {
    --passport-width: 400px;
  }
}

/* =========================================================================
   LOADING STATE
   ========================================================================= */

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .passport-cover {
    transition: none;
  }
  
  .passport-summary__cta:hover {
    transform: none;
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--gradient-passport-cover` | `linear-gradient(145deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)` | Passport cover background |
| `--passport-cover-accent` | `#C9A961` | Gold text, borders, logo |
| `--shadow-passport` | Complex shadow | 3D book effect |
| `--radius-passport` | `8px` | Realistic passport corner |
| `--font-primary` | `'Rubik', sans-serif` | All passport text |
| `--font-mono` | `'Consolas', monospace` | Passport number |

### Passport Number Format

| Part | Format | Example |
|------|--------|---------|
| Prefix | `REF-` | REF- |
| Year | `YYYY` | 2025 |
| Sequence | `XXX` (padded) | 001 |
| **Full** | `REF-YYYY-XXX` | **REF-2025-001** |

### RTL/Hebrew Considerations

1. **Hebrew title** ("דרכון הפניות") - Right-to-left, centered
2. **English subtitle** - Left-to-right, uppercase, centered
3. **Passport number** - Uses `direction: ltr; unicode-bidi: isolate;` for proper number display
4. **Points in summary** - LTR for numeric formatting

### Accessibility Requirements

1. **Semantic structure:**
   - `<article class="passport">` for the passport book
   - `<h1>` for the Hebrew passport title
   - `aria-label` on passport container section

2. **Button accessibility:**
   - CTA button has descriptive `aria-label`
   - Minimum 44×44px touch target (48px used)
   - Clear focus indicator on button

3. **Screen reader:**
   - Logo has `aria-label="PassportCard"`
   - Decorative SVGs have `aria-hidden="true"`

### Integration Points

**Dependencies from Previous Epics:**
- `Component` base class (Epic 1, Story 1.1)
- `stateManager` with `currentUser`, `stamps` (Epic 1, Story 1.4)
- `Router` navigation (Epic 1, Story 1.5)
- `HeaderComponent` and `BottomNavComponent` (Epic 1, Story 1.5)
- CSS variables and base styles (Epic 1, Story 1.1)
- Action registration pattern (Epic 1)

**Prepares for:**
- Story 3.2: Passport Opening Animation (will animate from closed to open)
- Story 3.3: Passport Pages Navigation
- Story 3.4: Stamp Collection Display

**Files to Modify:**
- `script.js` - Add PassportComponent class, register route, register action (~150 lines)
- `style.css` - Add passport cover styles (~200 lines)

### Testing Scenarios

1. **Basic Display:**
   - Navigate to #passport → See closed passport centered on screen
   - Passport has 3:4 aspect ratio
   - All text renders correctly (Hebrew + English)

2. **User Data:**
   - User name appears at bottom of cover
   - Passport number generated correctly
   - Stamps count from state
   - Points from user data

3. **Responsive:**
   - Mobile: ~280px width
   - Tablet: ~320px width
   - Desktop: ~360-400px width
   - All sizes maintain 3:4 ratio

4. **CTA Button:**
   - Button visible below passport
   - Click triggers `open-passport` action
   - Action logs to console (animation in Story 3.2)

5. **Accessibility:**
   - Tab focuses CTA button
   - Screen reader announces passport section
   - Focus ring visible on button

### Previous Story Patterns (From Epic 2)

From Dashboard stories:
- `_renderLayout()` pattern for header/nav
- State subscription pattern
- Section-based render methods
- BEM CSS naming consistent

### Project Context Quick Reference

**Naming Conventions:**
- CSS classes: BEM-kebab (`passport-cover__title`, `passport--closed`)
- JS methods: camelCase with underscore for private (`_renderPassportClosed`)
- Data attributes: kebab-case (`data-action="open-passport"`)
- Routes: lowercase (`passport`)

**State Management:**
- Always use `stateManager.setState()` - never mutate directly
- Subscribe to changes with `this.subscribe()`

**Events:**
- Use `data-action` for complex logic
- Register handlers with `app.registerAction()`

### References

- [Source: docs/architecture.md#4-implementation-patterns] - Naming conventions
- [Source: docs/architecture.md#5.4-component-hierarchy] - PassportComponent structure
- [Source: docs/epics.md#story-31] - Original acceptance criteria
- [Source: user-data/ux-design-specification.md#3.1-passport-cover-design] - Visual specifications
- [Source: user-data/ux-design-specification.md#3.3-stamp-designs] - Color palette reference
- [Source: docs/project_context.md] - Implementation rules and patterns

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete - Epic 3, Story 3.1)
- user-data/ux-design-specification.md (complete - Passport sections)
- docs/project_context.md (complete)
- docs/sprint-artifacts/2-4-quick-actions-campaign-banner.md (previous story patterns)

### Agent Model Used

Claude Opus 4.5 (via Cursor)

### Debug Log References

- All tasks completed without errors
- No linter issues detected

### Completion Notes List

- ✅ Created PassportComponent class extending Component base class
- ✅ Implemented complete passport cover HTML structure with 3:4 aspect ratio
- ✅ Added gold inner border, logo, titles (Hebrew/English), user name and passport number
- ✅ Implemented _getPassportNumber() utility generating REF-YYYY-XXX format
- ✅ Added passport summary section with stamps count and points display
- ✅ Created CTA button "פתח את הדרכון" with data-action="open-passport"
- ✅ Styled passport cover with gradient background, leather texture effect, and shadow
- ✅ Added responsive styles for mobile (280px), tablet (320px), desktop (360-400px)
- ✅ CTA button has 48px min-height (exceeds 44px touch target requirement)
- ✅ Semantic HTML structure with h1 for title, aria-labels for accessibility
- ✅ Registered PassportComponent in app initialization
- ✅ Registered 'open-passport' action handler with console log and state update
- ✅ Reduced motion support for accessibility

### File List

Files modified:
- `script.js` - Added PassportComponent class (~180 lines), registered component, registered 'open-passport' action handler
- `style.css` - Added passport cover component styles (~240 lines) including responsive breakpoints

No new files created.

Depends on from previous epics:
- Component base class (Story 1.1)
- StateManager with currentUser, stamps (Story 1.4)
- Router with route registration (Story 1.5)
- HeaderComponent and BottomNavComponent (Story 1.5)
- CSS variables and design tokens (Story 1.1)
- Action registration pattern (Epic 1)
- App layout structure with .header-container, .bottom-nav-container (Epic 1)

