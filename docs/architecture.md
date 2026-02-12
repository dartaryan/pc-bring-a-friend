---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2025-12-10'
inputDocuments:
  - docs/PRD.md
  - ux-design-specification.md
  - user-data/user-brief.md
  - docs/PROJECT-BRIEF.md
workflowType: 'architecture'
lastStep: 0
project_name: 'HR - Bring a friend'
user_name: 'Ben.akiva'
date: '2025-12-10'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## 1. Project Context Analysis

### 1.1 Requirements Overview

**Project:** PassportCard Refer (Internal codename: "Stamps")  
**Type:** Web Application (Single-Page Application)  
**Platform:** Mobile-first responsive web  
**Purpose:** Demo/prototype + competition entry with production-ready architecture

### 1.2 Functional Requirements Summary

| Category | Requirements | Complexity |
|----------|-------------|------------|
| **Authentication** | Email login, OTP verification (mock), session management | Low |
| **Passport Experience** | Cover animation, page flip, stamp collection, celebrations | High |
| **Dashboard** | Points summary, stats cards, activity feed, quick actions | Medium |
| **Open Positions** | Position listing, filters, search, details modal | Medium |
| **Referral Submission** | Share links, upload resume, candidate form, confirmation | Medium |
| **Referral Tracking** | Status list, timeline visualization, detail view | Medium |
| **Gamification** | Points system, levels, campaigns, achievements | Medium |
| **Navigation** | Bottom nav (mobile), sidebar (desktop), header | Low |

**Total: ~32 functional requirements across 8 feature areas**

### 1.3 Non-Functional Requirements

| Requirement | Target | Impact |
|-------------|--------|--------|
| Initial Load | < 2 seconds | Bundle size constraint |
| Time to Interactive | < 2.5 seconds | Code splitting awareness |
| Animation Performance | 60fps | GPU-optimized CSS |
| Bundle Size | < 500KB uncompressed | No heavy dependencies |
| Touch Targets | 44×44px minimum | Component sizing |
| RTL Support | Hebrew-first | CSS logical properties |
| Accessibility | WCAG 2.1 AA | Semantic HTML, ARIA |
| Reduced Motion | Supported | Conditional animations |

### 1.4 Technical Constraints

**Hard Constraints (Non-negotiable):**

| Constraint | Rationale |
|------------|-----------|
| Three files only | `index.html`, `style.css`, `script.js` - Demo elegance |
| No frameworks | Pure vanilla JavaScript ES6+ |
| No build step | Files served as-is |
| Mock data only | Client-side with LocalStorage |
| Static hosting | GitHub Pages |

**Allowed External Resources:**
- Google Fonts (Rubik family)
- Tabler Icons CDN
- Canvas Confetti library (optional)

### 1.5 Cross-Cutting Concerns

| Concern | Affected Areas | Priority |
|---------|----------------|----------|
| RTL Layout | All components, animations, navigation | Critical |
| State Management | Auth, user, referrals, stamps, UI | Critical |
| Animation System | Passport, stamps, celebrations, micro-interactions | High |
| Mock Data Generation | User profiles, positions, referrals, stamps | High |
| Responsive Design | All screens across breakpoints | High |
| Session Persistence | LocalStorage management | Medium |
| Error Handling | Graceful degradation | Medium |

### 1.6 Scale Assessment

| Indicator | Assessment |
|-----------|------------|
| Project Complexity | **Medium** - Complex UI/animations, simple data model |
| Technical Domain | **Frontend SPA** - Pure client-side |
| Integration Complexity | **None** - Fully self-contained |
| Real-time Features | **None** - All mock/static |
| Estimated Code Size | ~2,500-3,500 lines JavaScript |

### 1.7 Architecture Focus Areas

Given the unique constraints, this architecture document will define:

1. **Code Organization** - Structuring thousands of lines in a single file
2. **State Management** - Pub/sub pattern for reactive updates
3. **Component System** - Base class with lifecycle methods
4. **Routing System** - Hash-based client-side routing
5. **Animation Architecture** - Centralized, performant animation service
6. **Mock Data Strategy** - Realistic data generation
7. **Performance Patterns** - Optimization techniques for constraints

---

## 2. Starter Template Evaluation

### 2.1 Assessment

Traditional starter templates (create-react-app, Vite, Next.js, etc.) are **not applicable** due to the project's intentional constraints:

- Three-file architecture requirement
- No build step requirement
- No framework requirement
- Static GitHub Pages hosting

This is a deliberate architectural choice to demonstrate technical elegance with vanilla JavaScript.

### 2.2 Manual Foundation

**Project Structure:**

```
passportcard-refer/
├── index.html     # Semantic HTML5, app shell, all screen templates
├── style.css      # Design system, components, animations (~1,500 lines)
├── script.js      # All application logic (~3,000 lines)
└── README.md      # Documentation and setup instructions
```

**External Dependencies (CDN only):**

| Resource | Version | Purpose |
|----------|---------|---------|
| Google Fonts | Rubik (300-800) | Hebrew-optimized typography |
| Tabler Icons | Latest | Icon library |
| Canvas Confetti | 1.6.0 | Celebration effects (optional) |

### 2.3 Technical Foundation Decisions

| Category | Decision | Rationale |
|----------|----------|-----------|
| **Language** | JavaScript ES6+ | Browser-native, no transpilation needed |
| **Styling** | CSS3 + Custom Properties | Native, performant, no preprocessor |
| **Routing** | Hash-based client-side | `#dashboard`, `#passport` - works with static hosting |
| **State Management** | Custom pub/sub StateManager | Reactive updates without framework |
| **Components** | Class-based with lifecycle | `render()`, `mount()`, `unmount()` methods |
| **Storage** | LocalStorage wrapper | JSON serialization for persistence |
| **Animations** | CSS + AnimationService class | 60fps performance target |
| **Icons** | Tabler Icons CDN | No bundling, extensive icon set |
| **Fonts** | Google Fonts CDN | No local hosting required |

### 2.4 HTML Structure Pattern

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PassportCard Refer</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>
  <div id="app"></div>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

### 2.5 Initialization Command

Since no CLI generator is used, project setup is manual:

```bash
# Create project directory
mkdir passportcard-refer
cd passportcard-refer

# Create files
touch index.html style.css script.js README.md

# Initialize git (optional)
git init

# Serve locally for development
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js (npx)
npx serve

# Option 3: VS Code Live Server extension
```

**Note:** Project structure creation should be the first implementation task

---

## 3. Core Architectural Decisions

### 3.1 Decision Priority Analysis

**Critical Decisions (Required for Implementation):**
- State management pattern
- Component lifecycle approach
- Code organization strategy

**Important Decisions (Shape Quality):**
- Animation architecture
- Mock data strategy
- Error handling approach

**Deferred Decisions (Post-MVP):**
- Real authentication integration
- Backend API patterns
- Database schema

### 3.2 State Management

**Pattern:** Simple Pub/Sub StateManager

**Implementation:**

```javascript
class StateManager {
  constructor() {
    this.state = { ...initialState };
    this.listeners = new Map();
  }
  
  getState(key) {
    return key ? this.state[key] : { ...this.state };
  }
  
  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    this.notifyListeners(prevState);
    this.persistState();
  }
  
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }
  
  notifyListeners(prevState) {
    this.listeners.forEach((callbacks, key) => {
      if (prevState[key] !== this.state[key]) {
        callbacks.forEach(cb => cb(this.state[key], prevState[key]));
      }
    });
  }
  
  persistState() {
    const persistable = {
      currentUser: this.state.currentUser,
      isAuthenticated: this.state.isAuthenticated,
      referrals: this.state.referrals,
      stamps: this.state.stamps
    };
    localStorage.setItem('appState', JSON.stringify(persistable));
  }
  
  loadState() {
    try {
      const saved = localStorage.getItem('appState');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
  }
}

const stateManager = new StateManager();
```

**State Structure:**

| State Key | Type | Persisted | Description |
|-----------|------|-----------|-------------|
| `isAuthenticated` | boolean | ✅ | Login status |
| `currentUser` | User | ✅ | User profile object |
| `sessionToken` | string | ✅ | Mock session token |
| `currentView` | string | ❌ | Active route |
| `previousView` | string | ❌ | Previous route |
| `isLoading` | boolean | ❌ | Global loading state |
| `activeModal` | string | ❌ | Current modal ID |
| `toasts` | array | ❌ | Toast notifications |
| `positions` | array | ✅ | Open positions |
| `referrals` | array | ✅ | User's referrals |
| `stamps` | array | ✅ | User's stamps |
| `positionFilters` | object | ❌ | Active filters |

### 3.3 Code Organization

**Pattern:** Section-based with clear delimiters

**File Structure (script.js):**

```javascript
// ============================================
// CONSTANTS & CONFIGURATION
// ============================================
const CONFIG = { ... };
const MOCK_DATA = { ... };

// ============================================
// UTILITY FUNCTIONS
// ============================================
function generateUUID() { ... }
function formatDate(date) { ... }
function debounce(fn, ms) { ... }
function seededRandom(seed) { ... }

// ============================================
// MODELS
// ============================================
class User { ... }
class Position { ... }
class Referral { ... }
class Stamp { ... }

// ============================================
// SERVICES
// ============================================
class AuthService { ... }
class DataService { ... }
class StorageService { ... }
class AnimationService { ... }

// ============================================
// STATE MANAGEMENT
// ============================================
class StateManager { ... }
const stateManager = new StateManager();

// ============================================
// ROUTER
// ============================================
class Router { ... }
const router = new Router();

// ============================================
// BASE COMPONENT
// ============================================
class Component { ... }

// ============================================
// COMPONENTS - Authentication
// ============================================
class LoginComponent extends Component { ... }
class OTPModalComponent extends Component { ... }

// ============================================
// COMPONENTS - Passport
// ============================================
class PassportComponent extends Component { ... }
class StampComponent extends Component { ... }

// ============================================
// COMPONENTS - Main App
// ============================================
class DashboardComponent extends Component { ... }
class PositionsComponent extends Component { ... }
class ReferralsComponent extends Component { ... }
class ReferralFormComponent extends Component { ... }

// ============================================
// COMPONENTS - Shared
// ============================================
class ModalComponent extends Component { ... }
class ToastComponent extends Component { ... }
class NavigationComponent extends Component { ... }

// ============================================
// APP INITIALIZATION
// ============================================
class App { ... }

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
```

### 3.4 Component Architecture

**Base Component Pattern:**

```javascript
class Component {
  constructor(props = {}) {
    this.props = props;
    this.element = null;
    this.subscriptions = [];
  }
  
  // Subclasses implement this
  template() {
    throw new Error('template() must be implemented');
  }
  
  // Returns HTML string
  render() {
    return this.template();
  }
  
  // Called after element is in DOM
  mount() {
    this.bindEvents();
  }
  
  // Called before element is removed
  unmount() {
    this.subscriptions.forEach(unsub => unsub());
    this.subscriptions = [];
  }
  
  // Subscribe to state changes
  subscribe(key, callback) {
    const unsub = stateManager.subscribe(key, callback);
    this.subscriptions.push(unsub);
  }
  
  // Event binding - override in subclass
  bindEvents() {}
  
  // Query within component
  $(selector) {
    return this.element?.querySelector(selector);
  }
  
  $$(selector) {
    return this.element?.querySelectorAll(selector);
  }
}
```

**Event Delegation Pattern:**

```javascript
// In App initialization
document.getElementById('app').addEventListener('click', (e) => {
  // Handle button clicks
  if (e.target.matches('[data-action]')) {
    const action = e.target.dataset.action;
    handleAction(action, e.target);
  }
  
  // Handle navigation
  if (e.target.matches('[data-navigate]')) {
    const route = e.target.dataset.navigate;
    router.navigate(route);
  }
});
```

### 3.5 Animation Architecture

**Hybrid Approach:** CSS defines animations, JS orchestrates timing

**CSS Animations (style.css):**

```css
/* Passport animations */
@keyframes passportOpen {
  0% { transform: perspective(1000px) rotateY(0deg); }
  100% { transform: perspective(1000px) rotateY(-160deg); }
}

@keyframes pageFlip {
  0% { transform: perspective(1000px) rotateY(0deg); }
  100% { transform: perspective(1000px) rotateY(-180deg); }
}

@keyframes stampSlam {
  0% { transform: scale(2) rotate(var(--stamp-rotation)); opacity: 0; }
  40% { transform: scale(0.9) rotate(var(--stamp-rotation)); opacity: 1; }
  100% { transform: scale(1) rotate(var(--stamp-rotation)); opacity: 0.85; }
}

/* Trigger classes */
.passport--opening .passport-cover {
  animation: passportOpen 800ms var(--ease-passport-flip) forwards;
}

.stamp--new {
  animation: stampSlam 500ms var(--ease-bounce) forwards;
}
```

**AnimationService (script.js):**

```javascript
class AnimationService {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  async animatePassportOpen(passportEl) {
    if (this.reducedMotion) {
      passportEl.classList.add('passport--open');
      return;
    }
    
    passportEl.classList.add('passport--opening');
    await this.waitForAnimation(passportEl.querySelector('.passport-cover'));
    passportEl.classList.remove('passport--opening');
    passportEl.classList.add('passport--open');
  }
  
  async animateStampSlam(stampEl) {
    if (this.reducedMotion) {
      stampEl.classList.add('stamp--visible');
      return;
    }
    
    stampEl.classList.add('stamp--new');
    await this.waitForAnimation(stampEl);
    stampEl.classList.remove('stamp--new');
    stampEl.classList.add('stamp--visible');
  }
  
  celebrateWithConfetti() {
    if (this.reducedMotion || typeof confetti === 'undefined') return;
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E10514', '#F1C40F', '#22C55E', '#0984E3']
    });
  }
  
  waitForAnimation(el) {
    return new Promise(resolve => {
      el.addEventListener('animationend', resolve, { once: true });
    });
  }
}
```

### 3.6 Error Handling

**Strategy:** Silent degradation with console logging

```javascript
// Global error handler
window.onerror = (msg, url, line, col, error) => {
  console.error('App Error:', { msg, url, line, col, error });
  return true; // Prevent default error handling
};

// Promise rejection handler
window.onunhandledrejection = (event) => {
  console.error('Unhandled Promise:', event.reason);
  event.preventDefault();
};

// Service-level try-catch
class DataService {
  async getPositions() {
    try {
      // ... logic
    } catch (error) {
      console.warn('Failed to get positions:', error);
      return []; // Return safe default
    }
  }
}
```

### 3.7 Mock Data Strategy

**Approach:** Seeded random generation based on user email

```javascript
// Seeded random number generator
function seededRandom(seed) {
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  let state = Math.abs(hash);
  return function() {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// Generate user data from email
function generateUserFromEmail(email) {
  const random = seededRandom(email);
  const [name] = email.split('@');
  const [firstName, lastName] = name.split('.');
  
  return {
    id: `usr-${Math.floor(random() * 10000)}`,
    email: email,
    firstName: hebrewName(firstName),
    lastName: hebrewName(lastName),
    department: DEPARTMENTS[Math.floor(random() * DEPARTMENTS.length)],
    points: Math.floor(random() * 5000),
    joinDate: generatePastDate(random),
    stamps: generateStamps(random),
    referrals: generateReferrals(random)
  };
}
```

**Benefits:**
- Same email always produces same user data
- Demo feels realistic and consistent
- No external API dependencies

### 3.8 Decision Impact Analysis

**Implementation Sequence:**

1. Set up HTML structure with app container
2. Create CSS design system (variables, base styles)
3. Implement StateManager and Router
4. Create Component base class
5. Build AuthService and authentication flow
6. Build core components (Dashboard, Positions, Referrals)
7. Implement PassportComponent with animations
8. Add AnimationService and celebrations
9. Polish and testing

**Cross-Component Dependencies:**

```
StateManager ← All Components (subscription)
     ↓
Router ← Navigation, Components (route changes)
     ↓
AnimationService ← PassportComponent, StampComponent
     ↓
DataService ← PositionsComponent, ReferralsComponent
```

---

## 4. Implementation Patterns & Consistency Rules

### 4.1 Pattern Categories Overview

**Critical Conflict Points Identified:** 8 areas where AI agents could make inconsistent choices

These patterns ensure any AI agent working on this codebase produces compatible, consistent code.

### 4.2 CSS Naming Patterns

**Class Naming Convention:** BEM-inspired kebab-case

| Element | Convention | Example |
|---------|------------|---------|
| Block | kebab-case | `.passport`, `.dashboard`, `.stamp` |
| Element | double-underscore | `.passport__cover`, `.stamp__icon` |
| Modifier | double-dash | `.passport--open`, `.stamp--hired` |
| State | double-dash | `.btn--loading`, `.modal--visible` |
| JS Hook | `js-` prefix | `.js-passport-trigger` |

```css
/* ✅ Correct */
.passport-cover { }
.passport-cover--open { }
.stamp { }
.stamp--hired { }
.btn { }
.btn--primary { }
.btn--loading { }

/* ❌ Incorrect */
.passportCover { }
.PassportCover { }
.passport_cover { }
```

**CSS Variable Naming:** kebab-case with category prefix

```css
/* Colors */
--color-primary: #E10514;
--color-primary-hover: #C50412;

/* Spacing */
--space-1: 4px;
--space-2: 8px;

/* Typography */
--text-sm: 0.875rem;
--font-bold: 700;

/* Shadows */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);

/* Radius */
--radius-md: 12px;

/* Animation */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 4.3 JavaScript Naming Patterns

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `StateManager`, `AuthService` |
| Functions | camelCase | `getUserData()`, `handleSubmit()` |
| Constants | SCREAMING_SNAKE | `CONFIG`, `MOCK_DATA`, `STAMP_TYPES` |
| Variables | camelCase | `currentUser`, `isLoading` |
| Private methods | underscore prefix | `_validateEmail()` |
| Event handlers | `handle` prefix | `handleClick()`, `handleSubmit()` |

```javascript
// ✅ Correct
class AuthService { }
const CONFIG = { OTP_CODE: '000000' };
function getUserData() { }
let currentUser = null;
_validateEmail(email) { }

// ❌ Incorrect
class authService { }
const config = { };
function get_user_data() { }
let current_user = null;
```

### 4.4 HTML/DOM Patterns

**ID Naming:** kebab-case
```html
<div id="app"></div>
<div id="passport-container"></div>
<div id="referral-form"></div>
```

**Data Attributes:** kebab-case with semantic naming
```html
<!-- Actions - verb-noun format -->
<button data-action="submit-referral">Submit</button>
<button data-action="open-passport">Open</button>
<button data-action="close-modal">Close</button>

<!-- Navigation - route name -->
<a data-navigate="dashboard">Dashboard</a>
<a data-navigate="positions">Positions</a>

<!-- Data references - type-id format -->
<div data-position-id="pos-001"></div>
<div data-referral-id="ref-001"></div>
<div data-stamp-type="hired"></div>
```

### 4.5 Component Structure Pattern

**Standard Component Layout:**

```javascript
class ExampleComponent extends Component {
  // 1. Constructor
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  // 2. Main template
  template() {
    return `
      <section class="example" id="example">
        ${this.renderHeader()}
        ${this.renderContent()}
      </section>
    `;
  }
  
  // 3. Sub-render methods (alphabetical)
  renderContent() { }
  renderHeader() { }
  
  // 4. Lifecycle methods
  mount() {
    this.bindEvents();
    this.subscribe('stateKey', this.handleStateChange.bind(this));
  }
  
  unmount() {
    super.unmount();
  }
  
  // 5. Event handlers (handle prefix)
  handleClick(e) { }
  handleStateChange(newValue) { }
  
  // 6. Private methods (underscore prefix)
  _calculateTotal() { }
  _formatData() { }
}
```

### 4.6 State Management Patterns

**State Key Naming:** camelCase, descriptive

```javascript
const initialState = {
  // Authentication
  isAuthenticated: false,
  currentUser: null,
  sessionToken: null,
  
  // Navigation
  currentView: 'auth',
  previousView: null,
  
  // UI State
  isLoading: false,
  activeModal: null,
  toasts: [],
  
  // Data
  positions: [],
  referrals: [],
  stamps: [],
  
  // Filters
  positionFilters: {
    department: 'all',
    location: 'all',
    search: ''
  }
};
```

**State Update Pattern:** Always use setState, never mutate

```javascript
// ✅ Correct
stateManager.setState({ isLoading: true });
stateManager.setState({ 
  currentUser: user,
  isAuthenticated: true 
});

// ❌ Incorrect - Direct mutation
stateManager.state.isLoading = true;
stateManager.state.currentUser = user;
```

### 4.7 Route Patterns

**Route Naming:** lowercase, kebab-case for multi-word

| Screen | Route Name | URL Pattern |
|--------|------------|-------------|
| Login | `auth` | `#auth` |
| Passport | `passport` | `#passport` |
| Dashboard | `dashboard` | `#dashboard` |
| Positions List | `positions` | `#positions` |
| Position Detail | `position` | `#position/:id` |
| Referral Form | `refer` | `#refer/:positionId` |
| My Referrals | `referrals` | `#referrals` |
| Referral Detail | `referral` | `#referral/:id` |
| Settings | `settings` | `#settings` |

```javascript
// ✅ Correct
router.navigate('dashboard');
router.navigate('position', { id: 'pos-001' });

// ❌ Incorrect
router.navigate('Dashboard');
router.navigate('#dashboard');
router.navigate('DASHBOARD');
```

### 4.8 Animation Patterns

**Animation Class States:**

```css
/* Base element */
.passport { }

/* Animation trigger state - applied by JS */
.passport--opening { }

/* Final state - applied after animation */
.passport--open { }

/* Closing state if needed */
.passport--closing { }
```

**Animation Trigger Pattern:**

```javascript
// ✅ Correct - Always use AnimationService
await animationService.animatePassportOpen(element);
await animationService.animateStampSlam(stampEl);
animationService.celebrateWithConfetti();

// ❌ Incorrect - Direct manipulation
element.classList.add('passport--opening');
element.style.animation = 'passportOpen 800ms';
```

### 4.9 Mock Data ID Patterns

**ID Format:** `{type}-{number}`

| Entity | Prefix | Example |
|--------|--------|---------|
| User | `usr-` | `usr-001`, `usr-002` |
| Position | `pos-` | `pos-001`, `pos-002` |
| Referral | `ref-` | `ref-001`, `ref-002` |
| Stamp | `stmp-` | `stmp-001`, `stmp-002` |
| Campaign | `camp-` | `camp-001` |

```javascript
// ✅ Correct
const user = { id: 'usr-001', ... };
const position = { id: 'pos-001', ... };
const referral = { id: 'ref-001', ... };

// ❌ Incorrect
const user = { id: '1', ... };
const user = { id: 'abc123', ... };
const user = { id: 'user_001', ... };
```

### 4.10 Enforcement Checklist

**All AI Agents MUST follow these rules:**

1. ✅ CSS classes: kebab-case with BEM modifiers (`--`, `__`)
2. ✅ CSS variables: kebab-case with category prefix (`--color-`, `--space-`)
3. ✅ JS classes: PascalCase
4. ✅ JS functions/variables: camelCase
5. ✅ JS constants: SCREAMING_SNAKE_CASE
6. ✅ HTML IDs: kebab-case
7. ✅ Data attributes: `data-action`, `data-navigate`, `data-{type}-id`
8. ✅ Routes: lowercase, no hash in navigate calls
9. ✅ State updates: Always via `stateManager.setState()`
10. ✅ Animations: Always via `AnimationService` methods
11. ✅ Mock IDs: Type-prefixed format (`usr-`, `pos-`, etc.)
12. ✅ Event handlers: `handle` prefix (e.g., `handleClick`)
13. ✅ Private methods: underscore prefix (e.g., `_validate`)

### 4.11 Anti-Patterns to Avoid

```javascript
// ❌ NEVER do these:

// Mixed naming styles
class auth_Service { }  // Wrong: underscore in class name
const UserData = {};    // Wrong: PascalCase for variable

// Direct state mutation
stateManager.state.user = newUser;  // Wrong: direct mutation

// Direct animation manipulation
el.classList.add('animate');  // Wrong: bypass AnimationService

// Inconsistent IDs
{ id: 'user1' }   // Wrong: no prefix
{ id: 'USR-001' } // Wrong: uppercase prefix

// Inline event handlers in templates
`<button onclick="handleClick()">` // Wrong: use data-action
```

---

## 5. Project Structure & Boundaries

### 5.1 Complete Project Directory Structure

```
passportcard-refer/
│
├── index.html              # App shell, semantic structure (~100 lines)
├── style.css               # Design system, components, animations (~1,500 lines)
├── script.js               # All application logic (~3,000 lines)
│
├── README.md               # Setup instructions, demo guide
│
└── assets/                 # Optional: local assets
    └── stamps/             # Stamp SVG files (if not inline)
        ├── stamp-submitted.svg
        ├── stamp-interview.svg
        ├── stamp-hired.svg
        ├── stamp-milestone-3m.svg
        ├── stamp-milestone-6m.svg
        ├── stamp-campaign.svg
        ├── stamp-streak.svg
        └── stamp-first.svg
```

### 5.2 File Organization

#### index.html Structure

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PassportCard Refer</title>
  
  <!-- Preconnect for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- External resources -->
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
  
  <!-- App styles -->
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Main app container - components render here -->
  <div id="app"></div>
  
  <!-- Toast notifications container -->
  <div id="toast-container" aria-live="polite"></div>
  
  <!-- Modal overlay container -->
  <div id="modal-container"></div>
  
  <!-- External scripts -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  
  <!-- App script -->
  <script src="script.js"></script>
</body>
</html>
```

#### style.css Section Map (~1,500 lines)

| Section | Lines | Content |
|---------|-------|---------|
| 1. Reset & Base | ~50 | CSS reset, box-sizing, body defaults |
| 2. CSS Variables | ~200 | All design tokens |
| 3. Typography | ~50 | Font styles, headings |
| 4. Layout | ~100 | Containers, grid, flex utilities |
| 5. Buttons | ~100 | All button variants |
| 6. Cards | ~80 | Card components |
| 7. Forms | ~150 | Inputs, textareas, file upload |
| 8. Badges | ~50 | Status badges, tags |
| 9. Navigation | ~100 | Header, bottom nav, sidebar |
| 10. Modals | ~80 | Modal overlay, content |
| 11. Toasts | ~50 | Toast notifications |
| 12. Passport Cover | ~100 | Cover design, gold accents |
| 13. Passport Pages | ~80 | Page layout, paper texture |
| 14. Stamps | ~150 | 8 stamp types, ink effects |
| 15. Login Screen | ~80 | Login layout, hero |
| 16. Dashboard | ~100 | Stats, activity feed |
| 17. Positions | ~80 | Position cards, filters |
| 18. Referrals | ~80 | Referral cards, timeline |
| 19. Referral Form | ~60 | Form layout |
| 20. Animations | ~150 | All @keyframes |
| 21. Utilities | ~50 | Helper classes |
| 22. Tablet Responsive | ~100 | @media min-width: 600px |
| 23. Desktop Responsive | ~100 | @media min-width: 1024px |
| 24. Reduced Motion | ~30 | @media prefers-reduced-motion |

#### script.js Section Map (~3,000 lines)

| Section | Lines | Content |
|---------|-------|---------|
| 1. Constants | ~100 | CONFIG, ROUTES, STAMP_TYPES |
| 2. Mock Data | ~200 | Positions, campaigns, Hebrew names |
| 3. Utilities | ~150 | UUID, dates, debounce, seeded random |
| 4. Models | ~200 | User, Position, Referral, Stamp classes |
| 5. StorageService | ~50 | LocalStorage wrapper |
| 6. AuthService | ~100 | Login, OTP verification |
| 7. DataService | ~150 | Mock API, filtering |
| 8. AnimationService | ~100 | Animation orchestration |
| 9. StateManager | ~150 | Pub/sub state management |
| 10. Router | ~100 | Hash-based routing |
| 11. Base Component | ~80 | Component base class |
| 12. Auth Components | ~200 | Login, OTP modal |
| 13. Passport Components | ~300 | Cover, pages, stamps |
| 14. Dashboard Components | ~200 | Stats, activity, campaigns |
| 15. Position Components | ~200 | List, cards, filters, detail |
| 16. Referral Components | ~250 | List, form, tracking |
| 17. Shared Components | ~200 | Nav, header, modal, toast |
| 18. Settings Components | ~100 | Preferences |
| 19. Action Handlers | ~100 | Event handling |
| 20. App Initialization | ~100 | App class, DOMContentLoaded |

### 5.3 Requirements to Structure Mapping

| Requirement Category | CSS Sections | JS Sections |
|---------------------|--------------|-------------|
| **FR-AUTH** (Authentication) | §15 Login | §6 AuthService, §12 Auth Components |
| **FR-PASS** (Passport) | §12-14 Passport | §13 Passport Components |
| **FR-DASH** (Dashboard) | §16 Dashboard | §14 Dashboard Components |
| **FR-POS** (Positions) | §17 Positions | §15 Position Components |
| **FR-REF** (Submission) | §19 Form | §16 ReferralFormComponent |
| **FR-TRACK** (Tracking) | §18 Referrals | §16 Referral Components |
| **FR-GAME** (Gamification) | §14 Stamps | §4 Stamp Model, §13 Stamps |
| **FR-NAV** (Navigation) | §9 Navigation | §17 NavigationComponent |
| **NFR-PERF** (Performance) | §20-24 | §8 AnimationService |
| **NFR-ACC** (Accessibility) | §24 Reduced Motion | Semantic HTML, ARIA |

### 5.4 Component Hierarchy

```
App
├── Router
│   └── Components (rendered based on route)
│
├── Auth Flow
│   ├── LoginComponent
│   └── OTPModalComponent
│
├── Main App (authenticated)
│   ├── NavigationComponent
│   │   ├── HeaderComponent
│   │   └── BottomNavComponent (mobile)
│   │
│   ├── PassportComponent
│   │   ├── PassportCoverComponent
│   │   ├── PassportPageComponent (multiple)
│   │   │   └── StampComponent (multiple)
│   │   └── StampDetailModalComponent
│   │
│   ├── DashboardComponent
│   │   ├── PointsSummaryComponent
│   │   ├── StatsCardsComponent
│   │   ├── ActivityFeedComponent
│   │   └── CampaignBannerComponent
│   │
│   ├── PositionsComponent
│   │   ├── PositionFiltersComponent
│   │   ├── PositionCardComponent (multiple)
│   │   └── PositionDetailModalComponent
│   │
│   ├── ReferralsComponent
│   │   ├── ReferralCardComponent (multiple)
│   │   └── ReferralDetailModalComponent
│   │
│   ├── ReferralFormComponent
│   │   └── ReferralConfirmationComponent
│   │
│   └── SettingsComponent
│
└── Shared (available globally)
    ├── ModalComponent
    ├── ToastComponent
    └── LoadingSpinnerComponent
```

### 5.5 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                        │
│                   (click, submit, swipe)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EVENT DELEGATION                          │
│              document.getElementById('app')                  │
│         Matches: [data-action], [data-navigate]             │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│    handleAction()       │     │    router.navigate()        │
│    handleNavigation()   │     │                             │
└─────────────────────────┘     └─────────────────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│       SERVICES          │     │         ROUTER              │
│  ┌─────────────────┐   │     │  ┌─────────────────────┐   │
│  │ AuthService     │   │     │  │ Update URL hash     │   │
│  │ DataService     │   │     │  │ Render Component    │   │
│  │ AnimationService│   │     │  └─────────────────────┘   │
│  └─────────────────┘   │     │                             │
└─────────────────────────┘     └─────────────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    STATE MANAGER                             │
│              stateManager.setState(updates)                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Notify Listeners                        │   │
│  │         (subscribed components re-render)            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Persist to LocalStorage                 │   │
│  │         (isAuthenticated, user, referrals, stamps)   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DOM UPDATE                                │
│              Component.render() → innerHTML                  │
│              Component.mount() → bindEvents()               │
└─────────────────────────────────────────────────────────────┘
```

### 5.6 Integration Boundaries

| Boundary | Internal | External |
|----------|----------|----------|
| **State** | StateManager | LocalStorage |
| **Routing** | Router | URL hash |
| **Animations** | AnimationService | CSS @keyframes |
| **Celebrations** | AnimationService | canvas-confetti |
| **Icons** | CSS classes | Tabler Icons CDN |
| **Fonts** | CSS | Google Fonts CDN |
| **Data** | DataService | Mock data in memory |

### 5.7 Development Workflow

**Local Development:**

```bash
# Option 1: Python (built-in)
python -m http.server 8000

# Option 2: Node.js
npx serve

# Option 3: VS Code Live Server
# Install extension, right-click index.html → "Open with Live Server"
```

**Deployment (GitHub Pages):**

```bash
# 1. Create repository on GitHub
# 2. Push code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/passportcard-refer.git
git push -u origin main

# 3. Enable GitHub Pages
# Settings → Pages → Source: main branch → Save

# Live at: https://username.github.io/passportcard-refer/
```

---

## 6. Architecture Validation Results

### 6.1 Coherence Validation ✅

**Decision Compatibility:** All architectural decisions are mutually compatible:
- Three-file structure supports all component patterns
- State management integrates cleanly with routing
- Animation architecture works with component lifecycle
- Event delegation pattern supports all user interactions

**Pattern Consistency:** Implementation patterns are consistent:
- CSS: BEM-inspired kebab-case throughout
- JS: camelCase functions, PascalCase classes, SCREAMING_SNAKE constants
- HTML: kebab-case IDs, data-* attributes for actions
- Routes: lowercase, no hash prefix in navigate calls

**Structure Alignment:** Project structure fully supports architecture:
- Single entry point (index.html)
- Centralized styling (style.css)
- All logic in organized sections (script.js)
- Clear section boundaries for maintenance

### 6.2 Requirements Coverage ✅

**Functional Requirements:** 100% coverage

| Category | Architectural Support | Coverage |
|----------|----------------------|----------|
| FR-AUTH | AuthService + Components | ✅ |
| FR-PASS | Passport Components + AnimationService | ✅ |
| FR-DASH | Dashboard Components + StateManager | ✅ |
| FR-POS | Position Components + DataService | ✅ |
| FR-REF | ReferralFormComponent + DataService | ✅ |
| FR-TRACK | Referral Components + StateManager | ✅ |
| FR-GAME | Stamp Model + Points State | ✅ |
| FR-NAV | Router + NavigationComponent | ✅ |
| FR-SET | SettingsComponent | ✅ |

**Non-Functional Requirements:** 100% coverage

| NFR | Architectural Support | Coverage |
|-----|----------------------|----------|
| Performance (< 2s load) | No framework overhead | ✅ |
| Animations (60fps) | CSS + AnimationService | ✅ |
| Bundle Size (< 500KB) | Three files, no deps | ✅ |
| RTL Support | CSS logical properties | ✅ |
| Accessibility | Semantic HTML, ARIA | ✅ |
| Reduced Motion | AnimationService check | ✅ |

### 6.3 Implementation Readiness ✅

**AI Agent Guidance:** Complete

- Every pattern has concrete code examples
- Naming conventions cover all code elements
- Anti-patterns explicitly documented
- Component structure standardized
- Data flow clearly mapped

**Implementation Order:**

1. **Foundation** - Create files, set up HTML shell
2. **Design System** - CSS variables and base styles
3. **Core Logic** - StateManager, Router, Component base
4. **Services** - Auth, Data, Storage, Animation
5. **Auth Flow** - Login, OTP components
6. **Main Screens** - Dashboard, Positions, Referrals
7. **Passport** - Cover, pages, stamps, animations
8. **Polish** - Celebrations, responsiveness, accessibility

### 6.4 Architecture Completeness Checklist

**✅ Project Analysis**
- [x] Project context analyzed
- [x] Requirements mapped to architecture
- [x] Technical constraints identified
- [x] Cross-cutting concerns documented

**✅ Technical Foundation**
- [x] Technology stack defined (Vanilla JS, CSS3, HTML5)
- [x] External resources specified (Fonts, Icons, Confetti)
- [x] Development workflow documented
- [x] Deployment approach defined (GitHub Pages)

**✅ Architectural Decisions**
- [x] State management pattern (Pub/sub StateManager)
- [x] Component architecture (Class-based with lifecycle)
- [x] Routing strategy (Hash-based Router)
- [x] Animation architecture (CSS + JS orchestration)
- [x] Error handling approach (Silent with logging)
- [x] Mock data strategy (Seeded random from email)

**✅ Implementation Patterns**
- [x] CSS naming conventions (BEM-kebab)
- [x] JS naming conventions (camelCase/PascalCase/SCREAMING_SNAKE)
- [x] HTML/DOM patterns (data-action, data-navigate)
- [x] Component structure pattern (constructor → template → render methods → lifecycle → handlers)
- [x] State update patterns (Always via setState)
- [x] Animation trigger patterns (Always via AnimationService)
- [x] Mock data ID patterns (type-prefixed: usr-, pos-, ref-, stmp-)

**✅ Project Structure**
- [x] Complete file organization (3 files + README)
- [x] CSS section mapping (~1,500 lines across 24 sections)
- [x] JS section mapping (~3,000 lines across 20 sections)
- [x] Component hierarchy documented
- [x] Data flow architecture defined
- [x] Integration boundaries mapped

### 6.5 Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** **HIGH**

**Key Strengths:**
- Simple, understandable architecture with no hidden complexity
- No external dependencies to version or manage
- Clear patterns prevent AI agent implementation conflicts
- Comprehensive documentation with concrete examples
- Aligns with existing PassportCard brand and UX specification

**Future Considerations (Post-MVP):**
- Real authentication integration (SSO/OAuth)
- Backend API design (Node.js or similar)
- Database schema design
- CI/CD pipeline with testing
- Performance monitoring
- Analytics integration

---

## 7. Architecture Completion Summary

### 7.1 Workflow Completion

| Metric | Value |
|--------|-------|
| **Status** | ✅ COMPLETED |
| **Steps Completed** | 8 of 8 |
| **Date Completed** | December 10, 2025 |
| **Document Location** | `docs/architecture.md` |

### 7.2 Final Architecture Deliverables

**📋 Complete Architecture Document**

- 6 major architectural decisions documented
- Implementation patterns ensuring AI agent consistency
- Complete project structure with file organization
- Requirements to architecture mapping (100% coverage)
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

| Deliverable | Count |
|-------------|-------|
| Architectural Decisions | 6 categories |
| Implementation Patterns | 11 pattern rules |
| CSS Sections Defined | 24 sections |
| JS Sections Defined | 20 sections |
| Components Specified | 20+ components |
| Requirements Covered | 100% |

### 7.3 Implementation Handoff

**For AI Agents:**

This architecture document is your complete guide for implementing PassportCard Refer. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**

```bash
# 1. Create project directory
mkdir passportcard-refer
cd passportcard-refer

# 2. Create the three core files
touch index.html style.css script.js README.md

# 3. Set up index.html with external resources
# 4. Begin CSS design system implementation
# 5. Implement core JS architecture (StateManager, Router)
```

**Development Sequence:**

1. ✅ Set up project files (index.html, style.css, script.js)
2. ✅ Implement CSS design system (variables, base styles)
3. ✅ Build core architecture (StateManager, Router, Component base)
4. ✅ Create services (Auth, Data, Storage, Animation)
5. ✅ Implement authentication flow
6. ✅ Build main screens (Dashboard, Positions, Referrals)
7. ✅ Create passport experience (Cover, Pages, Stamps)
8. ✅ Add polish (Animations, Responsiveness, Accessibility)

### 7.4 Quality Assurance Summary

**✅ Architecture Coherence**
- All decisions work together without conflicts
- Technology choices are compatible (vanilla JS ecosystem)
- Patterns support the architectural decisions
- Structure aligns with all choices

**✅ Requirements Coverage**
- All 9 functional requirement categories supported
- All 6 non-functional requirements addressed
- Cross-cutting concerns (RTL, accessibility) handled
- Integration points defined

**✅ Implementation Readiness**
- Decisions are specific and actionable
- Patterns prevent AI agent conflicts
- Structure is complete and unambiguous
- Code examples provided for all patterns

### 7.5 Project Success Factors

**🎯 Clear Decision Framework**

Every technology choice was made with clear rationale, ensuring consistent architectural direction across all implementation work.

**🔧 Consistency Guarantee**

Implementation patterns and naming conventions ensure that any AI agent working on this codebase will produce compatible, consistent code.

**📋 Complete Coverage**

All project requirements from the PRD and UX specification are architecturally supported with clear mapping to specific code sections.

**🏗️ Elegant Simplicity**

The three-file architecture demonstrates technical excellence while remaining maintainable and understandable.

---

## Document Information

| Field | Value |
|-------|-------|
| **Project** | PassportCard Refer |
| **Document Type** | Architecture Decision Document |
| **Version** | 1.0 |
| **Status** | Complete ✅ |
| **Created** | December 10, 2025 |
| **Author** | Winston (Architect) + Ben.akiva |

---

**Architecture Status:** ✅ **READY FOR IMPLEMENTATION**

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

---

*End of Architecture Document*

