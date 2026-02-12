---
project_name: 'PassportCard Refer'
user_name: 'Ben.akiva'
date: '2025-12-10'
status: 'complete'
---

# Project Context for AI Agents

_Critical rules and patterns that AI agents must follow when implementing code. Read this BEFORE writing any code._

---

## Technology Stack

| Technology | Version | Notes |
|------------|---------|-------|
| **HTML5** | Latest | Semantic elements, RTL dir="rtl" |
| **CSS3** | Latest | Custom properties, no preprocessors |
| **JavaScript** | ES6+ | Vanilla only, no transpilation |
| **Google Fonts** | Rubik 300-800 | Hebrew-optimized |
| **Tabler Icons** | Latest CDN | Via webfont |
| **Canvas Confetti** | 1.6.0 | Optional celebrations |

**Hard Constraints:**
- THREE FILES ONLY: `index.html`, `style.css`, `script.js`
- NO frameworks (React, Vue, etc.)
- NO build step (Webpack, Vite, etc.)
- NO package.json or node_modules
- Static hosting on GitHub Pages

---

## Critical Implementation Rules

### HTML Rules

```html
<!-- ALWAYS start with RTL -->
<!DOCTYPE html>
<html lang="he" dir="rtl">

<!-- ALWAYS use semantic elements -->
<main>, <section>, <header>, <nav>, <article>

<!-- ALWAYS use data attributes for JS hooks -->
<button data-action="submit-referral">  <!-- Actions -->
<a data-navigate="dashboard">           <!-- Navigation -->
<div data-position-id="pos-001">        <!-- Data refs -->
```

### CSS Naming Rules

| Element | Convention | Example |
|---------|------------|---------|
| Classes | BEM kebab-case | `.passport-cover`, `.stamp--hired` |
| Modifiers | Double-dash | `.btn--primary`, `.modal--visible` |
| State | Double-dash | `.passport--open`, `.btn--loading` |
| Variables | kebab-case | `--color-primary`, `--space-4` |
| Keyframes | camelCase | `@keyframes passportOpen` |

```css
/* ✅ CORRECT */
.passport-cover { }
.passport-cover--open { }
.stamp--hired { }

/* ❌ WRONG */
.passportCover { }
.passport_cover { }
.PassportCover { }
```

### JavaScript Naming Rules

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `StateManager`, `AuthService` |
| Functions | camelCase | `getUserData()`, `handleSubmit()` |
| Constants | SCREAMING_SNAKE | `CONFIG`, `MOCK_DATA` |
| Variables | camelCase | `currentUser`, `isLoading` |
| Event handlers | handle prefix | `handleClick()` |
| Private methods | underscore prefix | `_validateEmail()` |

```javascript
// ✅ CORRECT
class AuthService { }
const CONFIG = { };
function getUserData() { }

// ❌ WRONG
class authService { }
const config = { };
function get_user_data() { }
```

### Mock Data ID Rules

ALWAYS use type-prefixed IDs:

| Entity | Prefix | Example |
|--------|--------|---------|
| User | `usr-` | `usr-001` |
| Position | `pos-` | `pos-001` |
| Referral | `ref-` | `ref-001` |
| Stamp | `stmp-` | `stmp-001` |
| Campaign | `camp-` | `camp-001` |

---

## Code Patterns

### Component Structure

```javascript
class ExampleComponent extends Component {
  // 1. Constructor
  constructor(props) {
    super(props);
  }
  
  // 2. Template (returns HTML string)
  template() {
    return `<section class="example">...</section>`;
  }
  
  // 3. Sub-render methods (alphabetical)
  renderContent() { }
  renderHeader() { }
  
  // 4. Lifecycle
  mount() { this.bindEvents(); }
  unmount() { super.unmount(); }
  
  // 5. Event handlers (handle prefix)
  handleClick(e) { }
  
  // 6. Private methods (underscore)
  _calculate() { }
}
```

### State Management Pattern

```javascript
// ✅ ALWAYS use setState - NEVER mutate directly
stateManager.setState({ isLoading: true });
stateManager.setState({ 
  currentUser: user,
  isAuthenticated: true 
});

// ❌ NEVER do this
stateManager.state.isLoading = true;
```

### Animation Pattern

```javascript
// ✅ ALWAYS use AnimationService
await animationService.animatePassportOpen(element);
await animationService.animateStampSlam(stampEl);

// ❌ NEVER manipulate animation classes directly
element.classList.add('passport--opening');
```

### Event Delegation Pattern

```javascript
// Use data-action attributes, handle in App
document.getElementById('app').addEventListener('click', (e) => {
  if (e.target.matches('[data-action]')) {
    const action = e.target.dataset.action;
    handleAction(action, e.target);
  }
});
```

---

## RTL/Hebrew Rules

### Always Use Logical Properties

```css
/* ✅ CORRECT - Works for RTL */
margin-inline-start: 16px;
padding-inline-end: 8px;
border-inline-start: 2px solid red;

/* ❌ WRONG - Breaks in RTL */
margin-left: 16px;
padding-right: 8px;
border-left: 2px solid red;
```

### Numbers Stay LTR

```css
.numeric,
.phone-number,
.points-value,
.otp-input {
  direction: ltr;
  unicode-bidi: isolate;
}
```

### Passport Animations Direction

```css
/* Opens LEFT (for RTL users) */
.passport-cover {
  transform-origin: left center;
}
```

---

## Anti-Patterns (NEVER Do These)

### ❌ Direct State Mutation
```javascript
// WRONG
stateManager.state.user = newUser;
```

### ❌ Inline Event Handlers
```html
<!-- WRONG -->
<button onclick="handleClick()">
```

### ❌ Direct Animation Manipulation
```javascript
// WRONG
el.classList.add('animate');
el.style.animation = 'fade 1s';
```

### ❌ Generic IDs
```javascript
// WRONG
{ id: '1' }
{ id: 'abc123' }
// RIGHT
{ id: 'usr-001' }
```

### ❌ Mixed Naming Styles
```javascript
// WRONG
class auth_Service { }
const UserData = {};
function get_user_data() { }
```

### ❌ Framework Patterns
```javascript
// WRONG - No frameworks allowed
import React from 'react';
const [state, setState] = useState();
```

---

## File Organization

### script.js Sections (in order)

1. CONSTANTS & CONFIGURATION
2. MOCK DATA
3. UTILITY FUNCTIONS
4. MODELS (User, Position, Referral, Stamp)
5. SERVICES (Auth, Data, Storage, Animation)
6. STATE MANAGEMENT
7. ROUTER
8. BASE COMPONENT
9. COMPONENTS - Authentication
10. COMPONENTS - Passport
11. COMPONENTS - Main App (Dashboard, Positions, Referrals)
12. COMPONENTS - Shared (Modal, Toast, Navigation)
13. ACTION HANDLERS
14. APP INITIALIZATION

### style.css Sections (in order)

1. CSS Reset & Base
2. CSS Custom Properties (ALL design tokens)
3. Typography
4. Layout
5. Components (Buttons, Cards, Forms, etc.)
6. Passport (Cover, Pages, Stamps)
7. Screens (Login, Dashboard, Positions, etc.)
8. Animations (@keyframes)
9. Utilities
10. Responsive (Tablet, Desktop)
11. Accessibility (Reduced Motion)

---

## Route Names

| Screen | Route | URL |
|--------|-------|-----|
| Login | `auth` | `#auth` |
| Passport | `passport` | `#passport` |
| Dashboard | `dashboard` | `#dashboard` |
| Positions | `positions` | `#positions` |
| Referrals | `referrals` | `#referrals` |
| Settings | `settings` | `#settings` |

```javascript
// ✅ CORRECT
router.navigate('dashboard');

// ❌ WRONG
router.navigate('#dashboard');
router.navigate('Dashboard');
```

---

## Authentication (Mock)

- Email format: `firstname.lastname@passportcard.co.il`
- OTP code: Always `000000`
- Session stored in LocalStorage
- User data generated from email (seeded random)

---

## Quick Reference

### Must-Follow Checklist

- [ ] HTML has `lang="he" dir="rtl"`
- [ ] CSS uses kebab-case class names
- [ ] JS uses camelCase functions, PascalCase classes
- [ ] IDs use type prefixes (`usr-`, `pos-`, etc.)
- [ ] State updates via `stateManager.setState()`
- [ ] Animations via `AnimationService`
- [ ] Events via `data-action` attributes
- [ ] Routes are lowercase
- [ ] Numbers have `direction: ltr`

---

**Reference:** See `docs/architecture.md` for complete architectural decisions and patterns.

