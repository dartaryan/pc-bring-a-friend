# Project Brief: PassportCard Refer
## Employee Referral Gamification Platform

---

**Version:** 1.0  
**Date:** December 10, 2025  
**Status:** Ready for Implementation 🚀

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [PRD](./PRD.md) | Full product requirements |
| [UX Spec](../ux-design-specification.md) | Complete design system |
| [User Brief](../user-data/user-brief.md) | Original concept |

---

## 1. What We're Building

### The Concept

**PassportCard Refer** transforms employee referrals into a gamified journey where employees collect digital "stamps" in a personal passport. Each referral milestone earns stamps and points, creating an engaging, collectible experience.

### The Metaphor

```
┌─────────────────────────────────────────┐
│                                         │
│    📕 Your Referral Passport            │
│                                         │
│    ┌─────────────────────────────┐     │
│    │  [Stamp]  [Stamp]  [Stamp]  │     │
│    │   קו"ח    ראיון    גיוס!    │     │
│    │   +50     +100     +500     │     │
│    └─────────────────────────────┘     │
│                                         │
│    Total: 1,250 Points ⭐               │
│                                         │
└─────────────────────────────────────────┘
```

### Why It Matters

- **For Employees:** Fun way to help friends join + earn rewards
- **For Company:** Reduce hiring costs, improve quality-of-hire
- **For Demo:** Showcase innovation + technical excellence

---

## 2. Technical Overview

### Stack

```
┌──────────────────────────────────────┐
│         index.html                   │  ← Semantic HTML5
├──────────────────────────────────────┤
│          style.css                   │  ← CSS3 + Custom Properties
├──────────────────────────────────────┤
│         script.js                    │  ← Vanilla ES6+ JavaScript
├──────────────────────────────────────┤
│        LocalStorage                  │  ← Client-side state
├──────────────────────────────────────┤
│       GitHub Pages                   │  ← Static hosting
└──────────────────────────────────────┘
```

### Constraints

| Constraint | Reason |
|------------|--------|
| No frameworks | Demo elegance, show skill |
| Three files only | `index.html`, `style.css`, `script.js` |
| No build step | Simple deployment |
| Mock data | Demo phase, no backend |
| Hebrew RTL | Primary audience |

### Architecture Pattern

```javascript
// MVC-inspired structure in script.js

// ===== MODELS =====
class User { }
class Position { }
class Referral { }
class Stamp { }

// ===== SERVICES =====
class AuthService { }      // Mock authentication
class DataService { }      // Mock API
class StorageService { }   // LocalStorage wrapper
class AnimationService { } // Animation helpers

// ===== STATE =====
class StateManager { }     // Centralized state
const stateManager = new StateManager();

// ===== ROUTER =====
class Router { }           // Hash-based routing
const router = new Router();

// ===== COMPONENTS =====
class Component { }        // Base class
class AuthComponent extends Component { }
class PassportComponent extends Component { }
class DashboardComponent extends Component { }
// ... etc

// ===== INIT =====
class App { }
const app = new App();
app.init();
```

---

## 3. Design System (Quick Reference)

### Colors

```css
/* Primary */
--color-primary: #E10514;        /* PassportCard Red */
--color-primary-hover: #C50412;

/* Passport */
--passport-cover: #1A1A2E;       /* Deep Navy */
--passport-cover-accent: #C9A961; /* Gold */
--passport-page: #FDF8F0;        /* Cream */

/* Stamps */
--stamp-ink-blue: #0984E3;       /* Submitted */
--stamp-ink-orange: #F39C12;     /* Interview */
--stamp-ink-green: #00B894;      /* Hired */
--stamp-ink-gold: #F1C40F;       /* Achievement */

/* Status */
--color-success: #22C55E;
--color-warning: #F59E0B;
--color-error: #EF4444;

/* Backgrounds */
--bg-page: #F8F6F3;
--bg-card: #FFFFFF;
--bg-cream: #F0EDE8;

/* Text */
--text-primary: #1A1A1A;
--text-secondary: #3D3D3D;
--text-muted: #6B6B6B;
```

### Typography

```css
/* Font */
--font-primary: 'Rubik', sans-serif;

/* Sizes */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
```

### Spacing

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
```

### Border Radius

```css
--radius-sm: 8px;     /* Buttons */
--radius-md: 12px;    /* Cards */
--radius-lg: 16px;    /* Modals */
--radius-full: 9999px; /* Pills */
--radius-passport: 8px;
```

### Shadows

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.07);
--shadow-primary: 0 4px 14px rgba(225, 5, 20, 0.25);
--shadow-passport: 0 10px 30px rgba(0, 0, 0, 0.3);
```

---

## 4. Key Screens

### 4.1 Login Screen

```
┌─────────────────────────────────────┐
│                                     │
│      [PassportCard Logo - White]    │
│                                     │
│         ברוכים הבאים ל-             │
│       PassportCard Refer            │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ 📧  name@passportcard.co.il │  │
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │        שלח קוד אימות        │  │
│   └─────────────────────────────┘  │
│                                     │
│   Background: Red gradient          │
│                                     │
└─────────────────────────────────────┘
```

**Key Points:**
- Auto-complete `@passportcard.co.il`
- Any valid `firstname.lastname@` format accepted
- OTP code is always `000000` (mock)

### 4.2 Passport View

```
┌────────────────────────────────────────────────────────────┐
│ [Header: Logo | Navigation | User Menu]                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│         ╔═══════════════════════════════════╗             │
│         ║                                   ║             │
│         ║      [PassportCard Logo]          ║             │
│         ║           Gold                    ║             │
│         ║                                   ║             │
│         ║      ═══════════════════          ║             │
│         ║                                   ║             │
│         ║        דרכון הפניות               ║             │
│         ║                                   ║             │
│         ║      ═══════════════════          ║             │
│         ║                                   ║             │
│         ║         יוסי כהן                  ║             │
│         ║                                   ║             │
│         ╚═══════════════════════════════════╝             │
│                                                            │
│                  [  פתח את הדרכון  ]                       │
│                                                            │
│               12 חותמות | 1,250 נקודות                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Tap passport or button to open
- 800ms 3D flip animation
- Pages swipe left/right (RTL)
- Tap stamp for details modal

### 4.3 Dashboard

```
┌────────────────────────────────────────────────────────────┐
│ [Header]                                                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  שלום יוסי! 👋                                             │
│                                                            │
│  ┌────────────┬────────────┬────────────┐                 │
│  │   1,250    │     8      │     3      │                 │
│  │  נקודות ⭐ │   הפניות   │   גיוסים   │                 │
│  └────────────┴────────────┴────────────┘                 │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │  🎯 הפעילות הבאה שלך                               │   │
│  │                                                    │   │
│  │  💼 3 משרות חדשות מתאימות לרשת שלך                │   │
│  │  [  צפה במשרות  ]                                │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  📣 קמפיין מיוחד                                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │  🔥 נקודות כפולות למפתחים!                        │   │
│  │  עד 31 בדצמבר                                     │   │
│  │  [  הפנה עכשיו  ]                                │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 4.4 Positions List

```
┌────────────────────────────────────────────────────────────┐
│ [Header]                                                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  💼 משרות פתוחות                                          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 🔍 חיפוש...                        [מחלקה ▾]      │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │┃ Senior Full Stack Developer            🔥 חם!     │   │
│  │┃ פיתוח | תל אביב | +500 נקודות                    │   │
│  │┃                              [  הפנה מועמד  ]    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │┃ Product Manager                                   │   │
│  │┃ מוצר | תל אביב | +500 נקודות                     │   │
│  │┃                              [  הפנה מועמד  ]    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │┃ UX Designer                        🎁 x2 נקודות! │   │
│  │┃ עיצוב | תל אביב | +1000 נקודות                   │   │
│  │┃                              [  הפנה מועמד  ]    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 4.5 Referral Form

```
┌────────────────────────────────────────────────────────────┐
│ [← חזרה למשרות]                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  הפניית מועמד למשרת                                       │
│  Senior Full Stack Developer                               │
│                                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                     │
│                                                            │
│  שם מלא של המועמד *                                       │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  אימייל *                                                  │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  טלפון                                                     │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  קורות חיים *                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │            📄 גררו קובץ לכאן                       │   │
│  │               או לחצו לבחירה                       │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  איך את/ה מכיר/ה את המועמד?                               │
│  ┌────────────────────────────────────────────────────┐   │
│  │ ○ חבר/ה קרוב/ה                                    │   │
│  │ ○ קולגה מעבודה קודמת                              │   │
│  │ ○ מכר/ה מקצועי/ת                                  │   │
│  │ ○ אחר                                             │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │              📤 שליחת ההפניה                       │   │
│  │         (+50 נקודות יתווספו לחשבונך)              │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 4.6 My Referrals

```
┌────────────────────────────────────────────────────────────┐
│ [Header]                                                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📋 ההפניות שלי                                            │
│                                                            │
│  [הכל] [בתהליך] [גויסו ✓] [נדחו]                          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │  👤 דנה לוי                                        │   │
│  │  Senior Developer | הוגש: 15 בנוב'                 │   │
│  │                                                    │   │
│  │  ○────────●────────○────────○────────○            │   │
│  │  הוגש    ראיון    מכרז    הצעה    גיוס           │   │
│  │          ↑ כאן                                    │   │
│  │                                                    │   │
│  │  🏷️ בראיון טכני                                  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │  👤 מיכאל אברהם                              ✓    │   │
│  │  Backend Developer | גויס: 1 באוק'                 │   │
│  │                                                    │   │
│  │  ●────────●────────●────────●────────●            │   │
│  │                                                    │   │
│  │  🏷️ גויס בהצלחה! +500 נקודות                     │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Stamp System

### Stamp Types

| Stamp | Icon | Color | Points | Trigger |
|-------|------|-------|--------|---------|
| **קו"ח הוגש** | 📄 | Blue `#0984E3` | +50 | Resume submitted |
| **ראיון נקבע** | 📅 | Orange `#F39C12` | +100 | Interview scheduled |
| **גיוס מוצלח!** | ✓ | Green `#00B894` | +500 | Candidate hired |
| **3 חודשים** | 🏅 | Silver `#95A5A6` | +200 | 3-month milestone |
| **6 חודשים** | 🏆 | Gold `#F1C40F` | +400 | 6-month milestone |
| **קמפיין מיוחד** | ⚡ | Purple `#6C5CE7` | +150 | Campaign bonus |
| **רצף הפניות** | 🔥 | Red `#E10514` | +75 | 3+ consecutive referrals |
| **הפניה ראשונה** | 💖 | Pink `#FD79A8` | +100 | First ever referral |

### Stamp Visual Style

```css
.stamp {
  /* Slightly rotated for authenticity */
  transform: rotate(var(--stamp-rotation, -3deg));
  
  /* Ink effect */
  opacity: 0.85;
  
  /* Worn look */
  filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.1));
}

/* Slam animation on placement */
@keyframes stampSlam {
  0% { transform: scale(2) translateY(-50px); opacity: 0; }
  40% { transform: scale(0.9); opacity: 1; }
  100% { transform: scale(1); opacity: 0.85; }
}
```

---

## 6. Animation Guide

### Key Animations

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Passport open | 800ms | `ease-passport-flip` | Click cover |
| Page flip | 600ms | `ease-passport-flip` | Swipe/arrow |
| Stamp slam | 500ms | `ease-bounce` | Achievement earned |
| Confetti | 3000ms | - | Major achievement |
| Card lift | 200ms | `ease` | Hover |
| Modal slide | 300ms | `ease-out` | Open modal |
| Toast | 300ms | `ease` | Show/hide |
| Points counter | 300ms | `ease-out` | Points added |

### CSS Custom Easings

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-passport-flip: cubic-bezier(0.645, 0.045, 0.355, 1);
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. RTL Considerations

### Base Setup

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
```

```css
html { direction: rtl; }
body { text-align: right; }
```

### Key RTL Rules

| Element | LTR | RTL |
|---------|-----|-----|
| Text align | left | right |
| Border accent | border-left | border-right |
| Passport open | right→left | left→right |
| Page flip | right→left | left→right |
| Swipe next | swipe left | swipe left |
| Swipe prev | swipe right | swipe right |
| Arrow icons | → | ← (mirrored) |

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

---

## 8. Mock Data

### User Data (Generated from email)

```javascript
// email: yossi.cohen@passportcard.co.il
const user = {
  id: 'usr-001',
  email: 'yossi.cohen@passportcard.co.il',
  firstName: 'יוסי',
  lastName: 'כהן',
  fullName: 'יוסי כהן',
  department: 'פיתוח',
  joinDate: '2023-01-15',
  points: 1250,
  level: 3,
  stamps: [...],
  referrals: [...]
};
```

### Positions (8-12 items)

```javascript
const positions = [
  {
    id: 'pos-001',
    title: 'Senior Full Stack Developer',
    titleHebrew: 'מפתח/ת Full Stack בכיר/ה',
    department: 'פיתוח',
    location: 'תל אביב',
    type: 'full-time',
    bonusPoints: 500,
    isHot: true,
    campaign: null
  },
  {
    id: 'pos-002',
    title: 'UX Designer',
    titleHebrew: 'מעצב/ת UX',
    department: 'עיצוב',
    location: 'תל אביב',
    type: 'full-time',
    bonusPoints: 500,
    isHot: false,
    campaign: { multiplier: 2, endsAt: '2025-12-31' }
  },
  // ... more positions
];
```

### Referrals (Per user)

```javascript
const referrals = [
  {
    id: 'ref-001',
    candidateName: 'דנה לוי',
    candidateEmail: 'dana@email.com',
    positionId: 'pos-001',
    status: 'interview',
    submittedAt: '2024-11-15',
    timeline: [
      { stage: 'submitted', date: '2024-11-15', points: 50 },
      { stage: 'interview', date: '2024-11-28', points: 100 }
    ]
  },
  {
    id: 'ref-002',
    candidateName: 'מיכאל אברהם',
    status: 'hired',
    timeline: [
      { stage: 'submitted', date: '2024-08-01', points: 50 },
      { stage: 'interview', date: '2024-08-15', points: 100 },
      { stage: 'hired', date: '2024-10-01', points: 500 }
    ]
  },
  // ... more referrals
];
```

---

## 9. Assets Required

### From PassportCard (URLs)

```
Logo (Light BG):
https://www.passportcard.co.il/wp-content/uploads/2023/07/logo.svg

Logo (Dark BG - White):
https://www.passportcard.co.il/wp-content/uploads/2023/07/logo-m.svg
```

### Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Icon Library

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
```

### Confetti (Optional)

```html
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
```

---

## 10. File Structure

```
passportcard-refer/
│
├── index.html           # Main HTML file
├── style.css            # All styles (including animations)
├── script.js            # All JavaScript logic
│
├── assets/              # Optional: local assets
│   └── stamps/          # Stamp SVGs (if not inline)
│
├── docs/                # Documentation
│   ├── PRD.md           # Product Requirements
│   └── PROJECT-BRIEF.md # This file
│
└── README.md            # Setup instructions
```

---

## 11. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] HTML structure with all screens
- [ ] CSS design system (variables, base styles)
- [ ] Router and state manager
- [ ] Component base class

### Phase 2: Authentication (Week 1)
- [ ] Login screen UI
- [ ] OTP modal UI
- [ ] Mock AuthService
- [ ] Session management

### Phase 3: Passport (Week 2)
- [ ] Passport cover design
- [ ] Opening animation
- [ ] Page system with flip
- [ ] Stamp components
- [ ] Stamp detail modal

### Phase 4: Core Features (Week 2-3)
- [ ] Dashboard layout
- [ ] Positions list + filters
- [ ] Referral submission form
- [ ] Referral tracking list

### Phase 5: Polish (Week 3)
- [ ] All animations
- [ ] Celebration effects
- [ ] Responsive testing
- [ ] RTL verification
- [ ] Performance optimization

### Phase 6: Demo Prep (Week 4)
- [ ] Mock data finalization
- [ ] Edge case handling
- [ ] Cross-browser testing
- [ ] Demo script preparation

---

## 12. Success Criteria

### Technical

- [ ] Zero console errors
- [ ] 60fps animations
- [ ] < 2s initial load
- [ ] Works on Chrome, Safari, Firefox, Edge
- [ ] Mobile responsive
- [ ] RTL layout correct

### Functional

- [ ] Complete login flow
- [ ] Passport opens and navigates
- [ ] Can submit referral
- [ ] Can track referrals
- [ ] Points update correctly
- [ ] Stamps appear on achievements

### Demo Ready

- [ ] Compelling mock data
- [ ] All animations polished
- [ ] No dead ends in UI
- [ ] Presentation talking points ready

---

## 13. Contact & Resources

| Resource | Link |
|----------|------|
| UX Design Spec | `ux-design-specification.md` |
| Full PRD | `docs/PRD.md` |
| Original Brief | `user-data/user-brief.md` |

---

**Let's build something amazing! 🚀**

---

*Document Version: 1.0 | December 10, 2025 | Ready for Implementation*

