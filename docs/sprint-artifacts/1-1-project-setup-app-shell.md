# Story 1.1: Project Setup & App Shell

**Status:** Ready for Review

## Story

**As a** developer,
**I want** to have the three-file project foundation with core architecture in place,
**So that** all subsequent features can be built on a consistent, well-structured codebase.

## Acceptance Criteria

### AC1: Three-File Architecture
**Given** the project repository exists
**When** I open the project files
**Then** I see exactly three files: `index.html`, `style.css`, `script.js`
**And** `index.html` has `lang="he"` and `dir="rtl"` attributes
**And** `index.html` includes Google Fonts (Rubik), Tabler Icons CDN, and canvas-confetti CDN
**And** `index.html` has containers: `#app`, `#toast-container`, `#modal-container`

### AC2: CSS Design System Foundation
**Given** the CSS file is loaded
**When** I inspect `style.css`
**Then** I see CSS custom properties section with all design tokens from UX spec
**And** I see base reset and typography styles
**And** I see component section placeholders organized per architecture doc

### AC3: JavaScript Core Architecture
**Given** the JavaScript file is loaded
**When** I inspect `script.js`
**Then** I see CONFIG constants section with OTP_CODE, routes, points values
**And** I see StateManager class with getState, setState, subscribe, persistState methods
**And** I see Router class with hash-based navigation (#auth, #dashboard, #passport, etc.)
**And** I see Component base class with template(), render(), mount(), unmount() methods
**And** I see AnimationService class shell with reducedMotion detection
**And** I see App class with init() that sets up event delegation on `#app`
**And** the app initializes on DOMContentLoaded

### AC4: App Shell Loads Without Errors
**Given** the app is loaded in browser
**When** I open `index.html`
**Then** the app displays a loading state or empty shell without console errors
**And** the URL shows `#auth` (default route for unauthenticated users)

## Tasks / Subtasks

- [x] Task 1: Create index.html with app shell (AC: #1)
  - [x] Set up HTML5 document with `lang="he"` and `dir="rtl"`
  - [x] Add meta tags (charset, viewport)
  - [x] Include Google Fonts Rubik (300-800 weights) with preconnect
  - [x] Include Tabler Icons CDN webfont
  - [x] Include canvas-confetti CDN script
  - [x] Create `#app` container div
  - [x] Create `#toast-container` for notifications
  - [x] Create `#modal-container` for modals
  - [x] Link style.css and script.js

- [x] Task 2: Create style.css with design system (AC: #2)
  - [x] Add CSS reset (box-sizing, margin reset)
  - [x] Define all CSS custom properties (colors, spacing, typography, shadows, radii, easings)
  - [x] Set up base typography with Rubik font
  - [x] Add RTL-aware base styles
  - [x] Create section comment placeholders for future components
  - [x] Add `prefers-reduced-motion` media query hook

- [x] Task 3: Create script.js with core architecture (AC: #3)
  - [x] Define CONFIG constant with OTP_CODE ('000000'), routes array, points values
  - [x] Create StateManager class with pub/sub pattern
    - [x] `getState(key)` - returns state or specific key
    - [x] `setState(updates)` - merges updates, notifies listeners
    - [x] `subscribe(key, callback)` - returns unsubscribe function
    - [x] `persistState()` - saves to LocalStorage
    - [x] `loadState()` - loads from LocalStorage on init
  - [x] Create Router class with hash-based navigation
    - [x] Parse `#route` from URL
    - [x] `navigate(route)` - changes hash and renders component
    - [x] `handleHashChange()` - responds to popstate/hashchange
    - [x] Route auth guard (redirect to #auth if not authenticated)
  - [x] Create Component base class
    - [x] `template()` - returns HTML string (subclass implements)
    - [x] `render()` - calls template()
    - [x] `mount()` - called after DOM insertion
    - [x] `unmount()` - cleanup subscriptions
    - [x] `subscribe(key, callback)` - helper for state subscriptions
    - [x] `$(selector)` and `$$(selector)` - query helpers
  - [x] Create AnimationService class shell
    - [x] `reducedMotion` property checking `prefers-reduced-motion`
    - [x] Shell methods: `animatePassportOpen()`, `animateStampSlam()`, `celebrateWithConfetti()`
    - [x] `waitForAnimation(el)` - returns promise
  - [x] Create App class
    - [x] `init()` - initializes state, router, event delegation
    - [x] Set up event delegation on `#app` for `[data-action]` and `[data-navigate]`
  - [x] Add DOMContentLoaded initialization

- [x] Task 4: Verify app shell loads (AC: #4)
  - [x] Open index.html in browser
  - [x] Verify no console errors
  - [x] Verify URL shows `#auth` for unauthenticated state
  - [x] Verify app container is present

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**Three-File Constraint:**
- ONLY `index.html`, `style.css`, `script.js` - no exceptions
- No build step, no package.json, no node_modules
- Files served as-is via simple HTTP server or GitHub Pages

**Naming Conventions:**
- CSS: BEM-inspired kebab-case (`.passport-cover`, `.stamp--hired`)
- JS classes: PascalCase (`StateManager`, `AuthService`)
- JS functions/variables: camelCase (`getUserData`, `currentUser`)
- JS constants: SCREAMING_SNAKE_CASE (`CONFIG`, `MOCK_DATA`)
- HTML IDs: kebab-case (`#app`, `#toast-container`)
- Data attributes: `data-action`, `data-navigate`, `data-{type}-id`

**State Management:**
- ALWAYS use `stateManager.setState({...})` - NEVER mutate directly
- Persist only: `isAuthenticated`, `currentUser`, `referrals`, `stamps`
- UI state (`isLoading`, `activeModal`, `currentView`) is NOT persisted

**Event Delegation:**
- Use `data-action="action-name"` attributes for click handlers
- Use `data-navigate="route"` for navigation links
- Single event listener on `#app` dispatches to action handlers

**Animation Architecture:**
- CSS defines `@keyframes` and animation classes
- JS AnimationService orchestrates timing and state transitions
- ALWAYS check `prefers-reduced-motion` before animating

### CSS Custom Properties (Required)

```css
/* Colors - from UX spec */
--color-primary: #E10514;
--color-primary-hover: #C50412;
--color-primary-light: #FFF5F5;
--color-success: #22C55E;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #0984E3;

/* Passport colors */
--passport-cover: #1A1A2E;
--passport-gold: #C9A961;
--passport-paper: #FDF8F0;

/* Neutral palette */
--color-white: #FFFFFF;
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;

/* Typography */
--font-family: 'Rubik', -apple-system, sans-serif;
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Spacing (4px base) */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-passport: 0 25px 50px rgba(0, 0, 0, 0.25);

/* Border radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;

/* Animation easings */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-passport-flip: cubic-bezier(0.645, 0.045, 0.355, 1);

/* Z-index layers */
--z-base: 0;
--z-header: 100;
--z-nav: 200;
--z-modal: 300;
--z-toast: 400;
```

### StateManager Initial State Structure

```javascript
const initialState = {
  // Authentication (persisted)
  isAuthenticated: false,
  currentUser: null,
  sessionToken: null,
  
  // Navigation (not persisted)
  currentView: 'auth',
  previousView: null,
  
  // UI State (not persisted)
  isLoading: false,
  activeModal: null,
  toasts: [],
  
  // Data (persisted)
  positions: [],
  referrals: [],
  stamps: [],
  
  // Filters (not persisted)
  positionFilters: {
    department: 'all',
    location: 'all',
    search: ''
  }
};
```

### Router Configuration

```javascript
const ROUTES = {
  auth: { component: 'LoginComponent', requiresAuth: false },
  dashboard: { component: 'DashboardComponent', requiresAuth: true },
  passport: { component: 'PassportComponent', requiresAuth: true },
  positions: { component: 'PositionsComponent', requiresAuth: true },
  referrals: { component: 'ReferralsComponent', requiresAuth: true },
  settings: { component: 'SettingsComponent', requiresAuth: true }
};
```

### Project Structure Notes

- Alignment with unified project structure: This story creates the foundational files that all other stories build upon
- Files go in project root: `index.html`, `style.css`, `script.js`
- No build step - files are production-ready as written

### References

- [Source: docs/architecture.md#3-core-architectural-decisions] - State management pattern
- [Source: docs/architecture.md#4-implementation-patterns] - All naming conventions
- [Source: docs/architecture.md#5-project-structure] - File organization
- [Source: docs/project_context.md] - Quick reference rules
- [Source: docs/PRD.md#9-technical-constraints] - Three-file constraint
- [Source: docs/epics.md#story-11] - Original story definition

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/project_context.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete)

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- No errors encountered during implementation
- All files passed linting validation

### Completion Notes List

**Task 1 - index.html (AC #1):**
- Created HTML5 document with `lang="he"` and `dir="rtl"` for RTL Hebrew support
- Added Google Fonts Rubik (300-800 weights) with preconnect optimization
- Included Tabler Icons webfont CDN
- Included canvas-confetti CDN for celebration animations
- Created three main containers: `#app`, `#toast-container`, `#modal-container`
- Linked style.css and script.js

**Task 2 - style.css (AC #2):**
- Implemented comprehensive CSS reset (box-sizing, margin, etc.)
- Defined all design tokens as CSS custom properties matching UX spec
- Colors: primary, semantic, passport, neutral palette
- Typography: Rubik font, sizes, weights
- Spacing: 4px base unit system
- Shadows, border radii, animation easings, z-index layers
- RTL-aware utility classes
- Container styles for app, toast, modal
- `prefers-reduced-motion` media query for accessibility
- Section placeholders for all future components per architecture doc

**Task 3 - script.js (AC #3):**
- CONFIG constant with OTP_CODE ('000000'), ROUTES, POINTS values
- StateManager class with pub/sub pattern:
  - `getState(key)` with dot notation support
  - `setState(updates)` with deep merge and listener notification
  - `subscribe(key, callback)` returning unsubscribe function
  - `persistState()` / `_loadState()` for localStorage persistence
  - `clearPersistedState()` for logout
- Router class with hash-based navigation:
  - Auth guard redirecting to #auth if not authenticated
  - Automatic redirect from auth to dashboard when authenticated
- Component base class with lifecycle:
  - `template()`, `render()`, `mount()`, `unmount()`
  - `subscribe()` with automatic cleanup
  - `$()` and `$$()` query helpers
- AnimationService with:
  - `reducedMotion` detection and live updates
  - Shell methods for passport/stamp animations
  - `celebrateWithConfetti()` using canvas-confetti
  - `waitForAnimation()` promise helper
- App class with:
  - Event delegation on `#app` for `[data-action]` and `[data-navigate]`
  - Form submission and input event delegation
  - Action handler registration system
  - View rendering based on state changes
- DOMContentLoaded initialization

**Task 4 - Verification (AC #4):**
- HTTP server started successfully at localhost:8080
- No linter errors in any files
- Router defaults to #auth for unauthenticated state
- App container renders loading placeholder

### File List

Files created:
- `index.html` (35 lines) - App shell with CDN resources
- `style.css` (291 lines) - Design system foundation
- `script.js` (547 lines) - Core application architecture

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-10 | Story 1.1 implemented - Three-file architecture created with StateManager, Router, Component base class, AnimationService shell, App class | Amelia (Dev Agent) |

