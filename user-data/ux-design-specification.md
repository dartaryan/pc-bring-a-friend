---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - ux-design-request.md
  - styles.css (existing PassportCard design system)
  - index.html (existing PassportCard project reference)
workflowType: 'ux-design'
lastStep: 7
project_name: 'PassportCard Refer'
user_name: 'Ben.akiva'
date: '2025-12-10'
status: 'Complete'
---

# UX Design Specification: PassportCard Refer

**Project:** PassportCard Refer - Employee Referral Gamification Platform  
**Author:** Sally (UX Designer) for Ben.akiva  
**Date:** December 10, 2025  
**Version:** 1.0

---

## Executive Summary

PassportCard Refer transforms the traditional employee referral process into an engaging, passport-themed journey. Employees collect digital "stamps" in their personal passport as they progress through referral milestones – from initial submission to successful hire and beyond.

**Design Vision:** Premium, tactile, collectible – like holding a real passport that tells the story of your professional impact.

**Key Design Principles:**
1. **Tangible Delight** – Digital interactions that feel physical and rewarding
2. **Progress Visibility** – Always show how close you are to the next achievement
3. **Brand Harmony** – Extend PassportCard's warm, trustworthy aesthetic
4. **RTL-First** – Built from the ground up for Hebrew speakers

---

## Table of Contents

1. [Design System Specifications](#1-design-system-specifications)
2. [Visual Concepts & Style Direction](#2-visual-concepts--style-direction)
3. [Passport Theme Design](#3-passport-theme-design)
4. [Component Library](#4-component-library)
5. [Animation & Motion Guidelines](#5-animation--motion-guidelines)
6. [Screen-by-Screen Designs](#6-screen-by-screen-designs)
7. [RTL Considerations](#7-rtl-considerations)
8. [Responsive Design](#8-responsive-design)
9. [Assets & Resources](#9-assets--resources)
10. [Implementation Notes](#10-implementation-notes)

---

## 1. Design System Specifications

### 1.1 Color Palette

#### Primary Brand Colors (PassportCard DNA)

| Token | Purpose | Hex Code | Preview |
|-------|---------|----------|---------|
| `--color-primary` | PassportCard signature red | `#E10514` | 🔴 |
| `--color-primary-hover` | Hover state | `#C50412` | |
| `--color-primary-light` | Light tint (8% opacity) | `rgba(225, 5, 20, 0.08)` | |
| `--color-primary-dark` | Dark accent | `#8B1419` | |

#### Passport Theme Colors (New)

| Token | Purpose | Hex Code | Preview |
|-------|---------|----------|---------|
| `--passport-cover` | Passport cover burgundy | `#1A1A2E` | 🟣 Deep Navy |
| `--passport-cover-accent` | Gold embossing | `#C9A961` | 🟡 |
| `--passport-page` | Inner page cream | `#FDF8F0` | 📄 |
| `--passport-page-aged` | Aged paper effect | `#F5EEE0` | |
| `--stamp-ink-red` | Red stamp ink | `#D63031` | |
| `--stamp-ink-blue` | Blue stamp ink | `#0984E3` | |
| `--stamp-ink-green` | Green stamp ink | `#00B894` | |
| `--stamp-ink-gold` | Gold achievement | `#F1C40F` | ⭐ |
| `--stamp-ink-purple` | Special/VIP | `#6C5CE7` | |

#### Achievement/Gamification Colors

| Token | Purpose | Hex Code |
|-------|---------|----------|
| `--color-accent-gold` | Achievement gold | `#F1C40F` |
| `--color-accent-gold-dark` | Gold shadow | `#D4A906` |
| `--color-accent-bronze` | Bronze tier | `#CD7F32` |
| `--color-accent-silver` | Silver tier | `#C0C0C0` |
| `--color-points` | Points display | `#E10514` |

#### Semantic Colors

| Token | Purpose | Hex Code |
|-------|---------|----------|
| `--color-success` | Success states | `#22C55E` |
| `--color-warning` | Warning states | `#F59E0B` |
| `--color-error` | Error states | `#EF4444` |
| `--color-info` | Info states | `#3B82F6` |

#### Background Colors

| Token | Purpose | Hex Code |
|-------|---------|----------|
| `--bg-page` | Main page background | `#F8F6F3` |
| `--bg-card` | Card backgrounds | `#FFFFFF` |
| `--bg-cream` | Secondary background | `#F0EDE8` |
| `--bg-light` | Light sections | `#FAF8F5` |
| `--bg-section` | Section dividers | `#EFEBE6` |

#### Text Colors

| Token | Purpose | Hex Code |
|-------|---------|----------|
| `--text-primary` | Main text | `#1A1A1A` |
| `--text-secondary` | Secondary text | `#3D3D3D` |
| `--text-muted` | Muted/helper text | `#6B6B6B` |
| `--text-light` | Disabled/placeholder | `#9A9A9A` |
| `--text-on-primary` | Text on red | `#FFFFFF` |

#### Gradient Definitions

```css
/* Primary brand gradient */
--gradient-primary: linear-gradient(328deg, #E10514 0%, #A2191C 100%);

/* Passport cover gradient - luxurious deep navy */
--gradient-passport-cover: linear-gradient(145deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);

/* Passport page - subtle paper texture */
--gradient-passport-page: linear-gradient(180deg, #FDF8F0 0%, #F5EEE0 100%);

/* Gold achievement shimmer */
--gradient-gold: linear-gradient(135deg, #F1C40F 0%, #FFE066 50%, #D4A906 100%);

/* Celebration burst */
--gradient-celebration: radial-gradient(circle, #FFE066 0%, #F1C40F 40%, transparent 70%);

/* Success completion */
--gradient-success: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);

/* Hero section gradient */
--gradient-hero: linear-gradient(328deg, #E10514 0%, #A2191C 100%);
```

---

### 1.2 Typography

#### Font Families

```css
/* Primary font - Hebrew optimized */
--font-primary: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Display font for passport stamps - hand-stamped feel */
--font-stamp: 'Rubik', sans-serif; /* Bold weight with letter-spacing */

/* Monospace for codes/numbers */
--font-mono: 'Consolas', 'Monaco', 'Courier New', monospace;
```

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

#### Typography Scale

| Element | Font Family | Weight | Size | Line Height | Letter Spacing |
|---------|-------------|--------|------|-------------|----------------|
| **H1** (Page titles) | Rubik | 700 | 2.5rem (40px) | 1.2 | -0.02em |
| **H2** (Section titles) | Rubik | 700 | 1.75rem (28px) | 1.3 | -0.01em |
| **H3** (Card titles) | Rubik | 600 | 1.25rem (20px) | 1.4 | 0 |
| **H4** (Subsections) | Rubik | 600 | 1.125rem (18px) | 1.4 | 0 |
| **Body** | Rubik | 400 | 1rem (16px) | 1.6 | 0 |
| **Body Small** | Rubik | 400 | 0.875rem (14px) | 1.5 | 0 |
| **Caption** | Rubik | 400 | 0.75rem (12px) | 1.4 | 0.02em |
| **Button** | Rubik | 600 | 0.9rem (14.4px) | 1 | 0.01em |
| **Input** | Rubik | 400 | 1rem (16px) | 1.5 | 0 |
| **Stamp Text** | Rubik | 800 | 0.875rem | 1 | 0.05em |

#### Typography CSS Variables

```css
/* Font sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */

/* Font weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

---

### 1.3 Spacing System

```css
/* 4px base unit scale */
--space-1: 4px;    /* Micro spacing */
--space-2: 8px;    /* Tight spacing */
--space-3: 12px;   /* Compact spacing */
--space-4: 16px;   /* Base spacing */
--space-5: 24px;   /* Comfortable spacing */
--space-6: 32px;   /* Spacious */
--space-7: 48px;   /* Section spacing */
--space-8: 64px;   /* Large section spacing */
--space-9: 96px;   /* Hero/major sections */
--space-10: 128px; /* Full page sections */
```

---

### 1.4 Border Radius

```css
--radius-xs: 4px;      /* Small tags, badges */
--radius-sm: 8px;      /* Buttons, small cards */
--radius-md: 12px;     /* Standard cards */
--radius-lg: 16px;     /* Large cards, modals */
--radius-xl: 24px;     /* Hero sections */
--radius-2xl: 32px;    /* Passport corners */
--radius-full: 9999px; /* Pills, avatars, circular */

/* Passport-specific */
--radius-passport: 8px;  /* Realistic passport corner */
--radius-stamp: 4px;     /* Stamp edges (slightly rough) */
```

---

### 1.5 Shadows

```css
/* Elevation system */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.07), 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.08), 0 10px 10px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.15);

/* Primary colored shadow */
--shadow-primary: 0 4px 14px rgba(225, 5, 20, 0.25);
--shadow-primary-hover: 0 6px 20px rgba(225, 5, 20, 0.35);

/* Gold achievement glow */
--shadow-gold: 0 4px 20px rgba(241, 196, 15, 0.4);

/* Passport shadow - realistic book shadow */
--shadow-passport: 
  0 10px 30px rgba(0, 0, 0, 0.3),
  0 5px 15px rgba(0, 0, 0, 0.2),
  inset 0 0 20px rgba(0, 0, 0, 0.1);

/* Stamp emboss effect */
--shadow-stamp-emboss: 
  inset 0 2px 4px rgba(0, 0, 0, 0.2),
  0 1px 0 rgba(255, 255, 255, 0.5);
```

---

### 1.6 Breakpoints

| Name | Min Width | Max Width | Usage |
|------|-----------|-----------|-------|
| **Mobile** | 0px | 599px | Default styles, single column |
| **Tablet** | 600px | 1023px | Two columns, adjusted spacing |
| **Desktop** | 1024px | 1439px | Full layout, sidebar visible |
| **Wide** | 1440px+ | — | Max-width containers |

```css
/* Media query variables (for reference) */
--breakpoint-sm: 600px;
--breakpoint-md: 900px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1440px;

/* Container max-widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1400px;
```

---

### 1.7 Z-Index Scale

```css
--z-dropdown: 100;
--z-sticky: 200;
--z-modal-backdrop: 300;
--z-modal: 400;
--z-toast: 500;
--z-tooltip: 600;
--z-celebration: 9999;
```

---

### 1.8 Transitions

```css
/* Duration */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
--duration-passport: 800ms;

/* Easing functions */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-passport-flip: cubic-bezier(0.645, 0.045, 0.355, 1);

/* Common transitions */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-transform: transform 200ms ease;
--transition-colors: color 150ms ease, background-color 150ms ease, border-color 150ms ease;
```

---

## 2. Visual Concepts & Style Direction

### 2.1 Overall Aesthetic

**Visual Style:** Premium Corporate Gamification
- Clean, modern interface with playful gamification elements
- Luxurious passport metaphor executed with attention to tactile details
- Professional enough for enterprise, delightful enough to engage

**Mood/Feel:**
- **Trustworthy** – PassportCard brand consistency
- **Exciting** – Achievement unlocks, progress visualization
- **Collectible** – Each stamp feels valuable and earned
- **Premium** – High-quality textures, animations, transitions

**Design Influences:**
- Apple Wallet card interactions
- Duolingo achievement systems
- Physical passport design details
- Travel app aesthetics (Airbnb, booking.com)
- Premium loyalty program interfaces

### 2.2 Visual Language

**Key Visual Elements:**
1. **Passport Book** – Central metaphor, always visible
2. **Stamps** – Unique, collectible achievements
3. **Progress Indicators** – Circular progress, milestone paths
4. **Cards** – Clean, elevated surfaces for content
5. **Red Accents** – PassportCard brand throughout

**Texture & Material:**
- Passport cover: Deep navy leather with gold embossing
- Pages: Slightly textured paper effect
- Stamps: Ink bleed effect, slightly rotated placements
- Cards: Clean white with subtle shadows

---

## 3. Passport Theme Design

### 3.1 Passport Cover Design

**Style:** Stylized Premium (not photo-realistic, but tactile)

**Visual Specifications:**

```
┌─────────────────────────────────────┐
│  ╭─────────────────────────────╮    │
│  │                             │    │
│  │     [PassportCard Logo]     │    │
│  │         in Gold             │    │
│  │                             │    │
│  │    ═══════════════════      │    │
│  │                             │    │
│  │       דרכון הפניות          │    │
│  │    REFERRAL PASSPORT        │    │
│  │                             │    │
│  │    ═══════════════════      │    │
│  │                             │    │
│  │      [Employee Name]        │    │
│  │                             │    │
│  │    מספר: REF-2025-001       │    │
│  │                             │    │
│  ╰─────────────────────────────╯    │
└─────────────────────────────────────┘
```

**Cover CSS:**
```css
.passport-cover {
  background: var(--gradient-passport-cover);
  border-radius: var(--radius-passport);
  box-shadow: var(--shadow-passport);
  aspect-ratio: 3/4;
  position: relative;
  
  /* Leather texture overlay */
  background-image: 
    url('data:image/svg+xml,...'), /* Subtle grain pattern */
    var(--gradient-passport-cover);
    
  /* Gold border emboss */
  border: 2px solid transparent;
  background-clip: padding-box;
  
  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid var(--passport-cover-accent);
    border-radius: calc(var(--radius-passport) - 4px);
    opacity: 0.6;
  }
}

.passport-logo {
  color: var(--passport-cover-accent);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
```

**Dimensions:**
- Mobile: 280px × 373px (3:4 ratio)
- Tablet: 320px × 427px
- Desktop: 360px × 480px

### 3.2 Passport Pages Design

**Page Structure:**

```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ Page 1: Profile & Stats         │ │
│ │ ─────────────────────────────── │ │
│ │ [Photo]  Name: יוסי כהן         │ │
│ │          מחלקה: פיתוח           │ │
│ │          הצטרפות: 2023          │ │
│ │ ─────────────────────────────── │ │
│ │ Total Points: 1,250 ⭐          │ │
│ │ Referrals: 8 | Hired: 3         │ │
│ │ ─────────────────────────────── │ │
│ │ [Watermark: PassportCard Logo]  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Page Background:**
```css
.passport-page {
  background: var(--gradient-passport-page);
  position: relative;
  
  /* Paper texture */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('data:image/svg+xml,...'); /* Paper grain */
    opacity: 0.3;
  }
  
  /* Watermark */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('passportcard-watermark.svg') center/50% no-repeat;
    opacity: 0.05;
  }
  
  /* Page edge shadow */
  box-shadow: 
    inset -4px 0 8px rgba(0,0,0,0.1),
    inset 0 0 20px rgba(0,0,0,0.05);
}
```

**Decorative Elements:**
- Subtle dotted border pattern around edges
- Page numbers in bottom corner (RTL: bottom-left)
- Security pattern watermark (PassportCard logo at 5% opacity)
- Aged paper gradient from top to bottom

### 3.3 Stamp Designs

Each stamp type has a unique visual identity:

#### Stamp Design System

| Stamp Type | Shape | Primary Color | Icon | Hebrew Text | Points |
|------------|-------|---------------|------|-------------|--------|
| **Resume Submitted** | Circle | Blue `#0984E3` | 📄 Document | קו"ח הוגש | +50 |
| **Interview Scheduled** | Rectangle | Orange `#F39C12` | 📅 Calendar | ראיון נקבע | +100 |
| **Candidate Hired** | Star burst | Green `#00B894` | ✓ Checkmark | גיוס מוצלח! | +500 |
| **3-Month Milestone** | Badge | Silver `#95A5A6` | 🏅 Medal | 3 חודשים | +200 |
| **6-Month Milestone** | Badge | Gold `#F1C40F` | 🏆 Trophy | 6 חודשים | +400 |
| **Special Campaign** | Diamond | Purple `#6C5CE7` | ⚡ Lightning | קמפיין מיוחד | +150 |
| **Referral Streak** | Flame | Red `#E10514` | 🔥 Fire | רצף הפניות | +75/each |
| **First Referral** | Heart | Pink `#FD79A8` | 💖 Heart | הפניה ראשונה | +100 |

#### Stamp Visual Style

```css
.stamp {
  /* Base stamp styling */
  position: relative;
  transform: rotate(var(--stamp-rotation, -3deg));
  
  /* Ink effect */
  color: var(--stamp-color);
  opacity: 0.85;
  
  /* Worn/pressed look */
  filter: 
    url(#roughPaper) /* SVG filter for rough edges */
    drop-shadow(2px 2px 0 rgba(0,0,0,0.1));
    
  /* Animation on placement */
  animation: stampPress 0.3s var(--ease-bounce);
}

/* Each stamp slightly rotated for authenticity */
.stamp:nth-child(odd) { --stamp-rotation: -5deg; }
.stamp:nth-child(even) { --stamp-rotation: 3deg; }
.stamp:nth-child(3n) { --stamp-rotation: -2deg; }

@keyframes stampPress {
  0% { transform: rotate(var(--stamp-rotation)) scale(1.5); opacity: 0; }
  50% { transform: rotate(var(--stamp-rotation)) scale(0.95); }
  100% { transform: rotate(var(--stamp-rotation)) scale(1); opacity: 0.85; }
}
```

#### Sample Stamp SVG Structure

```html
<svg class="stamp stamp--hired" viewBox="0 0 120 120">
  <!-- Outer border with rough edges -->
  <circle cx="60" cy="60" r="55" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="4"
    stroke-dasharray="8 4" />
  
  <!-- Inner circle -->
  <circle cx="60" cy="60" r="45" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" />
  
  <!-- Icon -->
  <path d="..." fill="currentColor" /> <!-- Checkmark -->
  
  <!-- Text curve - top -->
  <text>
    <textPath href="#curve-top">גיוס מוצלח!</textPath>
  </text>
  
  <!-- Date - bottom -->
  <text y="90" text-anchor="middle">
    <tspan x="60">דצמבר 2025</tspan>
  </text>
  
  <!-- Points badge -->
  <g class="points-badge">
    <circle cx="95" cy="25" r="18" fill="#F1C40F" />
    <text x="95" y="30" fill="#1A1A1A">+500</text>
  </g>
</svg>
```

---

## 4. Component Library

### 4.1 Buttons

#### Primary Button
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  padding: var(--space-3) var(--space-5);
  min-height: 44px;
  
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: white;
  
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-full);
  
  box-shadow: var(--shadow-primary);
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-primary-hover);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}
```

#### Secondary Button
```css
.btn-secondary {
  padding: var(--space-3) var(--space-5);
  min-height: 44px;
  
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  
  background: var(--bg-cream);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  
  &:hover {
    background: var(--border-color);
  }
}
```

#### Ghost Button
```css
.btn-ghost {
  padding: var(--space-3) var(--space-5);
  
  color: var(--color-primary);
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-full);
  
  &:hover {
    background: var(--color-primary-light);
  }
}
```

#### Icon Button
```css
.btn-icon {
  width: 44px;
  height: 44px;
  padding: 0;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  border-radius: var(--radius-md);
  
  &:hover {
    background: var(--bg-cream);
  }
}
```

### 4.2 Cards

#### Standard Card
```css
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  
  box-shadow: var(--shadow-md);
  border: 1px solid transparent;
  
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
}
```

#### Position Card (Job Listing)
```css
.position-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  
  display: grid;
  gap: var(--space-3);
  
  border-right: 4px solid var(--color-primary);
  
  &:hover {
    border-right-color: var(--color-primary-hover);
    box-shadow: var(--shadow-lg);
  }
}
```

#### Stats Card
```css
.stats-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  text-align: center;
  
  .stats-value {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--color-primary);
  }
  
  .stats-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
}
```

### 4.3 Form Inputs

#### Text Input
```css
.input {
  width: 100%;
  padding: var(--space-4);
  
  font-family: var(--font-primary);
  font-size: var(--text-base);
  color: var(--text-primary);
  
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  
  transition: var(--transition-base);
  
  &::placeholder {
    color: var(--text-light);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px var(--color-primary-light);
  }
  
  &:invalid,
  &.error {
    border-color: var(--color-error);
    
    &:focus {
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }
  }
}
```

#### File Upload Zone
```css
.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-7);
  
  text-align: center;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover,
  &.dragover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }
  
  .upload-icon {
    font-size: 48px;
    color: var(--color-primary);
    margin-bottom: var(--space-4);
  }
}
```

#### OTP Input (6-digit)
```css
.otp-container {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  direction: ltr; /* Numbers always LTR */
}

.otp-input {
  width: 48px;
  height: 56px;
  
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  text-align: center;
  
  background: var(--bg-light);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  
  &:focus {
    border-color: var(--color-primary);
    background: var(--bg-card);
  }
  
  &.filled {
    background: var(--color-primary-light);
    border-color: var(--color-primary);
  }
}
```

### 4.4 Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  
  padding: var(--space-1) var(--space-3);
  
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  border-radius: var(--radius-full);
}

/* Status variants */
.badge--submitted {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-info);
}

.badge--review {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.badge--interview {
  background: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
}

.badge--hired {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success);
}

.badge--rejected {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}
```

### 4.5 Navigation Components

#### Tab Navigation
```css
.tabs {
  display: flex;
  gap: var(--space-1);
  background: var(--bg-cream);
  padding: var(--space-1);
  border-radius: var(--radius-full);
}

.tab {
  padding: var(--space-3) var(--space-5);
  
  font-weight: var(--font-medium);
  color: var(--text-muted);
  
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    color: var(--text-primary);
  }
  
  &.active {
    background: var(--bg-card);
    color: var(--color-primary);
    box-shadow: var(--shadow-sm);
  }
}
```

#### Bottom Navigation (Mobile)
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  
  display: flex;
  justify-content: space-around;
  
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  padding: var(--space-2) var(--space-4);
  padding-bottom: env(safe-area-inset-bottom, var(--space-2));
  
  z-index: var(--z-sticky);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  
  padding: var(--space-2);
  min-width: 64px;
  
  font-size: var(--text-xs);
  color: var(--text-muted);
  
  &.active {
    color: var(--color-primary);
  }
  
  .nav-icon {
    font-size: 24px;
  }
}
```

### 4.6 Progress Indicators

#### Circular Progress (Points)
```css
.progress-ring {
  --progress: 0;
  --size: 120px;
  --stroke-width: 8px;
  
  width: var(--size);
  height: var(--size);
  
  .progress-ring__circle {
    stroke: var(--color-primary);
    stroke-width: var(--stroke-width);
    stroke-linecap: round;
    fill: none;
    
    stroke-dasharray: calc(3.14159 * (var(--size) - var(--stroke-width)));
    stroke-dashoffset: calc(3.14159 * (var(--size) - var(--stroke-width)) * (1 - var(--progress)));
    
    transform: rotate(-90deg);
    transform-origin: center;
    transition: stroke-dashoffset 0.5s ease;
  }
  
  .progress-ring__bg {
    stroke: var(--bg-cream);
  }
}
```

#### Linear Progress Bar
```css
.progress-bar {
  height: 8px;
  background: var(--bg-cream);
  border-radius: var(--radius-full);
  overflow: hidden;
  
  .progress-bar__fill {
    height: 100%;
    background: var(--gradient-primary);
    border-radius: var(--radius-full);
    transition: width 0.5s ease;
  }
}
```

#### Milestone Path
```css
.milestone-path {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  
  /* Connecting line */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 24px;
    right: 24px;
    height: 4px;
    background: var(--bg-cream);
    transform: translateY(-50%);
  }
}

.milestone {
  position: relative;
  z-index: 1;
  
  width: 48px;
  height: 48px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: var(--bg-card);
  border: 3px solid var(--bg-cream);
  border-radius: 50%;
  
  &.completed {
    background: var(--color-success);
    border-color: var(--color-success);
    color: white;
  }
  
  &.current {
    border-color: var(--color-primary);
    animation: pulse 2s infinite;
  }
}
```

---

## 5. Animation & Motion Guidelines

### 5.1 Passport Animations

#### Opening Animation (Cover to First Page)
```css
@keyframes passportOpen {
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }
  100% {
    transform: perspective(1000px) rotateY(-160deg);
  }
}

.passport--opening .passport-cover {
  animation: passportOpen 0.8s var(--ease-passport-flip) forwards;
  transform-origin: left center; /* RTL: Opens from right to left */
  transform-style: preserve-3d;
}
```

#### Page Flip Animation
```css
@keyframes pageFlip {
  0% {
    transform: perspective(1000px) rotateY(0deg);
    z-index: 2;
  }
  50% {
    z-index: 2;
  }
  51% {
    z-index: 0;
  }
  100% {
    transform: perspective(1000px) rotateY(-180deg);
    z-index: 0;
  }
}

.passport-page--flipping {
  animation: pageFlip 0.6s var(--ease-passport-flip) forwards;
  transform-origin: left center; /* RTL direction */
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
```

#### Page Turn Controls
```
Direction: Right-to-Left (Hebrew RTL)
- Swipe LEFT to go to NEXT page
- Swipe RIGHT to go to PREVIOUS page
- Click right edge for previous
- Click left edge for next
```

### 5.2 Stamp Animations

#### Stamp Placement
```css
@keyframes stampSlam {
  0% {
    opacity: 0;
    transform: scale(2) rotate(calc(var(--stamp-rotation) + 10deg)) translateY(-50px);
  }
  40% {
    opacity: 1;
    transform: scale(0.9) rotate(calc(var(--stamp-rotation) - 3deg)) translateY(5px);
  }
  60% {
    transform: scale(1.05) rotate(calc(var(--stamp-rotation) + 2deg)) translateY(-2px);
  }
  80% {
    transform: scale(0.98) rotate(var(--stamp-rotation)) translateY(1px);
  }
  100% {
    transform: scale(1) rotate(var(--stamp-rotation)) translateY(0);
  }
}

.stamp--new {
  animation: stampSlam 0.5s var(--ease-bounce) forwards;
}
```

#### Stamp Glow (Achievement Earned)
```css
@keyframes stampGlow {
  0%, 100% {
    filter: drop-shadow(0 0 0 transparent);
  }
  50% {
    filter: drop-shadow(0 0 20px var(--stamp-color));
  }
}

.stamp--highlight {
  animation: stampGlow 2s ease-in-out 3;
}
```

### 5.3 Celebration Effects

#### Confetti Burst
```javascript
// Configuration for confetti on major achievements
const confettiConfig = {
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: [
    '#E10514',  // PassportCard red
    '#F1C40F',  // Gold
    '#22C55E',  // Green
    '#0984E3',  // Blue
    '#FDF8F0'   // Cream
  ],
  shapes: ['circle', 'square'],
  duration: 3000
};

// Trigger moments:
// - First referral
// - Successful hire (big celebration)
// - Milestone achievements
// - Streak achievements
```

#### Falling PassportCards (Major Achievement)
```css
@keyframes cardFall {
  0% {
    transform: translateY(-100vh) rotate(var(--start-rotation, -10deg));
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(calc(var(--start-rotation) + 180deg));
    opacity: 0;
  }
}

.falling-card {
  position: fixed;
  animation: cardFall 3s ease-in forwards;
  animation-delay: var(--delay, 0);
  z-index: var(--z-celebration);
}
```

#### Points Counter Animation
```css
@keyframes countUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.points-earned {
  animation: countUp 0.3s ease-out;
  
  .points-value {
    font-variant-numeric: tabular-nums;
  }
}
```

### 5.4 Micro-interactions

#### Button Press
```css
.btn {
  transition: transform 0.1s ease, box-shadow 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
}
```

#### Card Hover Lift
```css
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}
```

#### Loading Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--bg-cream);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

#### Toast Notification
```css
@keyframes toastSlideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes toastSlideOut {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

.toast {
  animation: toastSlideIn 0.3s ease;
  
  &.leaving {
    animation: toastSlideOut 0.3s ease forwards;
  }
}
```

#### Modal Entrance
```css
@keyframes modalBackdropFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-backdrop {
  animation: modalBackdropFade 0.2s ease;
}

.modal {
  animation: modalSlideUp 0.3s ease;
}
```

---

## 6. Screen-by-Screen Designs

### 6.1 Login Screen

**Layout:** Full-screen hero with centered login card

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │        [PassportCard Logo - White]       │   │
│  │                                          │   │
│  │         ברוכים הבאים ל-                  │   │
│  │      PassportCard Refer                  │   │
│  │                                          │   │
│  │   ┌────────────────────────────────┐    │   │
│  │   │  📧  הכנס כתובת מייל            │    │   │
│  │   │     company@passportcard.co.il  │    │   │
│  │   └────────────────────────────────┘    │   │
│  │                                          │   │
│  │   ┌────────────────────────────────┐    │   │
│  │   │         שלח קוד אימות           │    │   │
│  │   └────────────────────────────────┘    │   │
│  │                                          │   │
│  │   רק עובדי PassportCard יכולים          │   │
│  │   להתחבר למערכת                         │   │
│  │                                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────┐                           ┌─────┐     │
│  │ 🌍  │  Floating travel images   │ ✈️  │     │
│  └─────┘                           └─────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Design Notes:**
- Background: Gradient red (brand) with floating travel imagery
- Card: White with generous padding, subtle shadow
- Email validation: `@passportcard.` domain only
- PassportCard logo in white at top

### 6.2 OTP Verification Modal

```
┌─────────────────────────────────────────┐
│                                         │
│          ┌───────────────────┐          │
│          │   📱 קוד אימות    │          │
│          │                   │          │
│          │  שלחנו קוד בן     │          │
│          │  6 ספרות למייל    │          │
│          │  y***@passport... │          │
│          │                   │          │
│          │  ┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐│         │
│          │  │ ││ ││ ││ ││ ││ ││         │
│          │  └─┘└─┘└─┘└─┘└─┘└─┘│         │
│          │                   │          │
│          │  [    אימות    ]  │          │
│          │                   │          │
│          │  לא קיבלת?        │          │
│          │  שלח שוב (0:45)   │          │
│          │                   │          │
│          └───────────────────┘          │
│                                         │
└─────────────────────────────────────────┘
```

**Design Notes:**
- OTP inputs: Large, centered, auto-focus next
- Numbers always LTR (direction: ltr)
- Resend countdown timer
- Success: Green checkmark animation → redirect

### 6.3 Passport View (Main Experience)

**Closed State:**
```
┌─────────────────────────────────────────────────┐
│ [Header: Logo | Dashboard | הדרכון שלי | יציאה] │
├─────────────────────────────────────────────────┤
│                                                 │
│           ╔═══════════════════════╗            │
│           ║                       ║            │
│           ║    [PassportCard]     ║            │
│           ║        Logo           ║            │
│           ║                       ║            │
│           ║   ═══════════════     ║            │
│           ║                       ║            │
│           ║    דרכון הפניות       ║            │
│           ║                       ║            │
│           ║   ═══════════════     ║            │
│           ║                       ║            │
│           ║     יוסי כהן          ║            │
│           ║                       ║            │
│           ╚═══════════════════════╝            │
│                                                 │
│              [  פתח את הדרכון  ]               │
│                                                 │
│           12 חותמות | 1,250 נקודות             │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Open State (Two-Page Spread):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Header: Logo | Dashboard | הדרכון שלי | יציאה]                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────┬───────────────────────┐             │
│  │       Page 2          │       Page 1          │             │
│  │                       │                       │             │
│  │   ┌─────┐  ┌─────┐   │   👤 יוסי כהן         │             │
│  │   │STAMP│  │STAMP│   │   מחלקה: פיתוח        │             │
│  │   │ 1   │  │ 2   │   │   מאז: ינואר 2023    │             │
│  │   └─────┘  └─────┘   │                       │             │
│  │                       │   ━━━━━━━━━━━━━━      │             │
│  │   ┌─────┐            │   נקודות: 1,250 ⭐    │             │
│  │   │STAMP│            │   הפניות: 8           │             │
│  │   │ 3   │            │   גיוסים: 3           │             │
│  │   └─────┘            │   ━━━━━━━━━━━━━━      │             │
│  │                       │                       │             │
│  │              Page 2   │              Page 1   │             │
│  └───────────────────────┴───────────────────────┘             │
│                                                                 │
│           ◄ הקודם                    הבא ►                     │
│                        Page 1-2 of 6                            │
└─────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Tap/click passport cover to open
- Swipe or arrows to navigate pages
- Tap stamp to see details modal
- RTL page navigation (next = swipe left)

### 6.4 Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header: Logo | Dashboard | הדרכון שלי | יציאה]                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  שלום יוסי! 👋                                                  │
│                                                                 │
│  ┌─────────────────┬─────────────────┬─────────────────┐       │
│  │    1,250        │       8         │       3         │       │
│  │    נקודות ⭐    │    הפניות       │    גיוסים       │       │
│  │    [████░░] 75% │    החודש: 2     │    🔥 בדרך!     │       │
│  └─────────────────┴─────────────────┴─────────────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  🎯 הפעילות הבאה שלך                                │       │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │       │
│  │                                                     │       │
│  │  💼 3 משרות פתוחות מתאימות לרשת שלך                │       │
│  │  [  צפה במשרות  ]                                  │       │
│  │                                                     │       │
│  │  📊 ההפניה של דנה בשלב ראיון!                      │       │
│  │  [  צפה בסטטוס  ]                                  │       │
│  │                                                     │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  📣 קמפיינים מיוחדים                                           │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  🔥 קמפיין מפתחים - נקודות כפולות!                 │       │
│  │  עד 31 בדצמבר | +200 נקודות בונוס לכל הפניה        │       │
│  │  [  הפנה עכשיו  ]                                  │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  📈 הפעילות האחרונה                                            │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  ✓ דנה לוי עברה לשלב ראיון           +100    2 ש'  │       │
│  │  ✓ קו"ח של יעל כהן הוגש              +50    אתמול   │       │
│  │  ⭐ חותמת "רצף הפניות" הושגה!        +75    אתמול   │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Open Positions List

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header: Logo | Dashboard | הדרכון שלי | יציאה]                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  💼 משרות פתוחות                                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │ 🔍 חיפוש משרה...                      [מחלקה ▾] │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │ ┃ Senior Full Stack Developer                         │     │
│  │ ┃ מחלקה: פיתוח  |  מיקום: תל אביב  |  🔥 חם!         │     │
│  │ ┃ נקודות: +500 לגיוס מוצלח                            │     │
│  │ ┃                                    [  הפנה מועמד  ] │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │ ┃ Product Manager                                     │     │
│  │ ┃ מחלקה: מוצר  |  מיקום: תל אביב                      │     │
│  │ ┃ נקודות: +500 לגיוס מוצלח                            │     │
│  │ ┃                                    [  הפנה מועמד  ] │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │ ┃ UX Designer                        🎁 קמפיין x2     │     │
│  │ ┃ מחלקה: עיצוב  |  מיקום: תל אביב                     │     │
│  │ ┃ נקודות: +1000 לגיוס מוצלח (כפול!)                   │     │
│  │ ┃                                    [  הפנה מועמד  ] │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
│  מציג 12 משרות                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.6 Referral Submission Form

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header: Logo | ← חזרה למשרות]                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  הפניית מועמד למשרת                                            │
│  Senior Full Stack Developer                                    │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                       │
│                                                                 │
│  שם מלא של המועמד *                                            │
│  ┌──────────────────────────────────────────────────┐          │
│  │                                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  אימייל *                                                       │
│  ┌──────────────────────────────────────────────────┐          │
│  │                                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  טלפון                                                          │
│  ┌──────────────────────────────────────────────────┐          │
│  │                                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  קורות חיים *                                                   │
│  ┌──────────────────────────────────────────────────┐          │
│  │                                                   │          │
│  │           📄 גררו קובץ לכאן                       │          │
│  │              או לחצו לבחירה                       │          │
│  │                                                   │          │
│  │           PDF, DOC, DOCX (עד 5MB)                │          │
│  │                                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  איך את/ה מכיר/ה את המועמד?                                    │
│  ┌──────────────────────────────────────────────────┐          │
│  │ ○ חבר/ה קרוב/ה                                   │          │
│  │ ○ קולגה מעבודה קודמת                             │          │
│  │ ○ מכר/ה מקצועי/ת                                 │          │
│  │ ○ אחר                                            │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  הערות נוספות (אופציונלי)                                       │
│  ┌──────────────────────────────────────────────────┐          │
│  │                                                   │          │
│  │                                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │             📤 שליחת ההפניה                       │          │
│  │        (+50 נקודות יתווספו לחשבונך)              │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Success State:**
```
┌─────────────────────────────────────────┐
│                                         │
│         🎉 ההפניה נשלחה בהצלחה!         │
│                                         │
│       ┌─────────────────────┐          │
│       │    [STAMP IMAGE]    │          │
│       │    קו"ח הוגש        │          │
│       │    +50 נקודות       │          │
│       └─────────────────────┘          │
│                                         │
│    החותמת נוספה לדרכון שלך!             │
│                                         │
│    [  צפה בדרכון  ] [ הפנה עוד ]       │
│                                         │
└─────────────────────────────────────────┘
```

### 6.7 My Referrals (Tracking)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header: Logo | Dashboard | הדרכון שלי | יציאה]                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 ההפניות שלי                                                 │
│                                                                 │
│  [הכל] [בתהליך] [גויסו ✓] [נדחו]                               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  👤 דנה לוי                                           │     │
│  │  Senior Developer | הוגש: 15 בנוב'                    │     │
│  │                                                       │     │
│  │  ○───────●───────○───────○───────○                   │     │
│  │  הוגש   ראיון   מכרז    הצעה   גיוס                  │     │
│  │         ↑                                            │     │
│  │     כאן אנחנו                                        │     │
│  │                                                       │     │
│  │  🏷️ בראיון טכני  |  עודכן: היום                     │     │
│  │                                    [  פרטים נוספים  ]│     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  👤 יעל כהן                                           │     │
│  │  Product Manager | הוגש: 10 בנוב'                     │     │
│  │                                                       │     │
│  │  ●───────○───────○───────○───────○                   │     │
│  │  הוגש   ראיון   מכרז    הצעה   גיוס                  │     │
│  │  ↑                                                    │     │
│  │                                                       │     │
│  │  🏷️ בבדיקה  |  עודכן: אתמול                         │     │
│  │                                    [  פרטים נוספים  ]│     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  👤 מיכאל אברהם                                  ✓   │     │
│  │  Backend Developer | גויס: 1 באוק'                    │     │
│  │                                                       │     │
│  │  ●───────●───────●───────●───────●                   │     │
│  │                                                       │     │
│  │  🏷️ גויס בהצלחה! | +500 נקודות הושגו               │     │
│  │                                    [  פרטים נוספים  ]│     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. RTL (Right-to-Left) Considerations

### 7.1 Base RTL Setup

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
```

```css
html {
  direction: rtl;
}

body {
  font-family: 'Rubik', sans-serif;
  text-align: right;
}
```

### 7.2 Layout Mirroring

| Element | LTR | RTL |
|---------|-----|-----|
| Text alignment | left | right |
| Flexbox start | left | right |
| Border accents | border-left | border-right |
| Margin/Padding | margin-left | margin-right |
| Icons (arrows) | → | ← |
| Progress direction | left→right | right→left |
| Passport page flip | right→left | left→right |

### 7.3 CSS Logical Properties

```css
/* Use logical properties for automatic RTL support */
.card {
  /* Instead of: padding-left: 16px; */
  padding-inline-start: 16px;
  
  /* Instead of: border-left: 4px solid red; */
  border-inline-start: 4px solid var(--color-primary);
  
  /* Instead of: margin-right: auto; */
  margin-inline-end: auto;
}
```

### 7.4 Icon Mirroring Rules

**Mirror These:**
- Navigation arrows (→ ←)
- Back buttons
- Progress indicators
- Send/forward icons
- Logout icons

**Don't Mirror:**
- Checkmarks ✓
- Plus/Minus
- Close X
- Upload/Download
- Search magnifying glass
- Numbers and clocks

```css
/* Icons that should mirror */
.icon--mirror {
  transform: scaleX(-1);
}

[dir="rtl"] .icon--arrow,
[dir="rtl"] .icon--back,
[dir="rtl"] .icon--forward {
  transform: scaleX(-1);
}
```

### 7.5 Numbers in RTL

Numbers should remain LTR:
```css
.numeric,
.phone-number,
.date,
.otp-input,
.points-value {
  direction: ltr;
  unicode-bidi: isolate;
}

/* OTP inputs specifically */
.otp-container {
  direction: ltr;
  display: flex;
  justify-content: center;
}
```

### 7.6 Passport-Specific RTL

```css
/* Passport opens from right to left in RTL */
.passport-cover {
  transform-origin: left center; /* Opens toward left */
}

/* Pages flip right-to-left */
.passport-page {
  transform-origin: left center;
}

/* Swipe gestures reversed */
/* Swipe LEFT = Next page */
/* Swipe RIGHT = Previous page */
```

---

## 8. Responsive Design

### 8.1 Approach

**Mobile-First Design**
- Base styles are mobile
- Enhance for larger screens with `min-width` queries

### 8.2 Breakpoint Behaviors

#### Mobile (< 600px)
- Single column layout
- Bottom navigation bar
- Passport fills most of screen width
- Collapsible sections
- Touch targets minimum 44×44px
- Full-width buttons

#### Tablet (600px - 1023px)
- Two-column layouts where appropriate
- Sidebar navigation (collapsible)
- Passport at comfortable reading size
- Side-by-side stamp placement

#### Desktop (1024px+)
- Full sidebar navigation
- Multi-column dashboard
- Passport centered with generous margins
- Hover states enabled
- Keyboard shortcuts active

### 8.3 Component Responsive Rules

**Header:**
```css
.header {
  padding: var(--space-4) var(--space-6);
}

@media (max-width: 600px) {
  .header {
    padding: var(--space-3);
  }
  
  .header-title {
    display: none;
  }
}
```

**Navigation:**
```css
/* Desktop: Sidebar */
@media (min-width: 1024px) {
  .nav-sidebar {
    display: block;
    width: 280px;
    position: sticky;
  }
  
  .nav-bottom {
    display: none;
  }
}

/* Mobile: Bottom bar */
@media (max-width: 1023px) {
  .nav-sidebar {
    display: none;
  }
  
  .nav-bottom {
    display: flex;
  }
}
```

**Passport:**
```css
.passport {
  --passport-width: 360px;
}

@media (max-width: 600px) {
  .passport {
    --passport-width: calc(100vw - 48px);
    max-width: 320px;
  }
}

@media (min-width: 1024px) {
  .passport {
    --passport-width: 400px;
  }
}
```

**Touch Targets:**
```css
.btn,
.nav-item,
.card-action {
  min-height: 44px;
  min-width: 44px;
}

@media (pointer: coarse) {
  /* Touch device optimizations */
  .btn {
    min-height: 48px;
    padding: var(--space-4) var(--space-6);
  }
}
```

### 8.4 Safe Areas (Mobile)

```css
/* iOS safe area support */
body {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.nav-bottom {
  padding-bottom: calc(var(--space-2) + env(safe-area-inset-bottom, 0));
}

.modal {
  margin: env(safe-area-inset-top, var(--space-6)) var(--space-4);
}
```

---

## 9. Assets & Resources

### 9.1 Logo & Branding

**PassportCard Logo URLs:**
```
Main Logo (Light BG): 
https://www.passportcard.co.il/wp-content/uploads/2023/07/logo.svg

Logo for Dark BG (White): 
https://www.passportcard.co.il/wp-content/uploads/2023/07/logo-m.svg
```

**PassportCard Product Images:**
```
PassportCard Card (Floating):
https://www.passportcard.co.il/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2025/05/pcil-pc-group-378-238.png.webp
```

**Hero/Marketing Images (Travel Theme):**
```
Traveler Image 1 (Portrait):
https://www.passportcard.co.il/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2023/11/passportcard-41-scaled.jpg.webp

Travel Scene 2 (459x333):
https://www.passportcard.co.il/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2023/07/21093_pic_459x333px.jpg.webp

Travel Scene 3 (482x350):
https://www.passportcard.co.il/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2023/07/21093_pic_482x350px.jpg.webp
```

**Background Assets:**
```
Footer Background Pattern (SVG):
https://www.passportcard.co.il/wp-content/themes/passportcard/assets/images/footer-bg.svg
```

### 9.2 Icon Library

**Recommended:** Tabler Icons (already used in PassportCard projects)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
```

**Key Icons Needed:**
| Purpose | Icon Class |
|---------|------------|
| Dashboard | `ti ti-layout-dashboard` |
| Passport | `ti ti-book` |
| Positions | `ti ti-briefcase` |
| Referrals | `ti ti-users` |
| Settings | `ti ti-settings` |
| Logout | `ti ti-logout` |
| Upload | `ti ti-upload` |
| Download | `ti ti-download` |
| Check | `ti ti-check` |
| Star | `ti ti-star` |
| Trophy | `ti ti-trophy` |
| Fire (streak) | `ti ti-flame` |
| Calendar | `ti ti-calendar` |
| Mail | `ti ti-mail` |
| Phone | `ti ti-phone` |
| User | `ti ti-user` |
| Search | `ti ti-search` |
| Filter | `ti ti-filter` |
| Menu | `ti ti-menu-2` |
| Close | `ti ti-x` |
| Arrow Right | `ti ti-arrow-right` |
| Arrow Left | `ti ti-arrow-left` |
| Chevron | `ti ti-chevron-right` |

### 9.3 Fonts

```html
<!-- Google Fonts - Rubik -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### 9.4 Required Custom Assets

| Asset | Format | Description |
|-------|--------|-------------|
| `passport-cover-texture.svg` | SVG | Subtle leather grain pattern |
| `passport-page-texture.svg` | SVG | Paper grain overlay |
| `passport-watermark.svg` | SVG | PassportCard logo at 5% opacity |
| `stamp-*.svg` | SVG | Individual stamp designs (8 types) |
| `confetti-piece.svg` | SVG | Confetti particle shapes |
| `favicon.ico` | ICO | Browser favicon |
| `app-icon-*.png` | PNG | PWA icons (192, 512) |

### 9.5 External Libraries (Optional)

```html
<!-- Confetti effect (optional - can use CSS) -->
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
```

---

## 10. Implementation Notes

### 10.1 Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - No frameworks
- **SVG** - Icons and stamp graphics

### 10.2 CSS Architecture

```
styles/
├── variables.css      /* Design tokens */
├── reset.css          /* CSS reset/normalize */
├── base.css           /* Typography, colors */
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── forms.css
│   ├── modal.css
│   ├── toast.css
│   └── passport.css
├── layouts/
│   ├── header.css
│   ├── navigation.css
│   ├── grid.css
│   └── footer.css
├── pages/
│   ├── login.css
│   ├── dashboard.css
│   ├── passport.css
│   ├── positions.css
│   └── referrals.css
├── utilities.css      /* Utility classes */
└── animations.css     /* Keyframes */
```

### 10.3 Performance Considerations

1. **CSS Variables** for theme consistency and easy dark mode
2. **SVG sprites** for stamps to reduce HTTP requests
3. **CSS animations** preferred over JS where possible
4. **Lazy loading** for stamp images on passport pages
5. **will-change** property for animated elements
6. **transform/opacity** for smooth animations (GPU accelerated)

### 10.4 Accessibility (a11y)

```html
<!-- Semantic structure -->
<main role="main" aria-label="Dashboard">
<nav role="navigation" aria-label="Main navigation">

<!-- Focus management -->
<button aria-pressed="false" aria-label="Toggle passport view">

<!-- Screen reader announcements -->
<div role="status" aria-live="polite" class="sr-only">
  50 points earned!
</div>

<!-- Reduced motion support -->
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 10.5 Dark Mode Support

```css
/* Auto dark mode based on system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-page: #0D0D0D;
    --bg-card: #1A1A1A;
    --text-primary: #F0F0F0;
    /* ... all dark mode variables */
  }
}

/* Manual toggle */
[data-theme="dark"] {
  --bg-page: #0D0D0D;
  /* ... */
}
```

---

## Appendix A: CSS Variables Quick Reference

```css
:root {
  /* === COLORS === */
  /* Primary */
  --color-primary: #E10514;
  --color-primary-hover: #C50412;
  --color-primary-light: rgba(225, 5, 20, 0.08);
  --color-primary-dark: #8B1419;
  
  /* Passport Theme */
  --passport-cover: #1A1A2E;
  --passport-cover-accent: #C9A961;
  --passport-page: #FDF8F0;
  --passport-page-aged: #F5EEE0;
  
  /* Stamps */
  --stamp-ink-red: #D63031;
  --stamp-ink-blue: #0984E3;
  --stamp-ink-green: #00B894;
  --stamp-ink-gold: #F1C40F;
  --stamp-ink-purple: #6C5CE7;
  
  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Backgrounds */
  --bg-page: #F8F6F3;
  --bg-card: #FFFFFF;
  --bg-cream: #F0EDE8;
  --bg-light: #FAF8F5;
  --bg-section: #EFEBE6;
  
  /* Text */
  --text-primary: #1A1A1A;
  --text-secondary: #3D3D3D;
  --text-muted: #6B6B6B;
  --text-light: #9A9A9A;
  
  /* Borders */
  --border-color: #E5E0DA;
  --border-light: #F0EDE8;
  
  /* === GRADIENTS === */
  --gradient-primary: linear-gradient(328deg, #E10514 0%, #A2191C 100%);
  --gradient-passport-cover: linear-gradient(145deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
  --gradient-passport-page: linear-gradient(180deg, #FDF8F0 0%, #F5EEE0 100%);
  --gradient-gold: linear-gradient(135deg, #F1C40F 0%, #FFE066 50%, #D4A906 100%);
  
  /* === TYPOGRAPHY === */
  --font-primary: 'Rubik', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Consolas', 'Monaco', monospace;
  
  /* Font sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  
  /* Font weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  
  /* === SPACING === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  
  /* === BORDERS === */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  --radius-passport: 8px;
  
  /* === SHADOWS === */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.07);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.08);
  --shadow-primary: 0 4px 14px rgba(225, 5, 20, 0.25);
  --shadow-passport: 0 10px 30px rgba(0, 0, 0, 0.3);
  --shadow-gold: 0 4px 20px rgba(241, 196, 15, 0.4);
  
  /* === TRANSITIONS === */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-passport-flip: cubic-bezier(0.645, 0.045, 0.355, 1);
  
  /* === Z-INDEX === */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-celebration: 9999;
}
```

---

## Appendix B: Stamp SVG Templates

### Resume Submitted Stamp

```svg
<svg viewBox="0 0 100 100" class="stamp stamp--submitted">
  <circle cx="50" cy="50" r="45" fill="none" stroke="#0984E3" stroke-width="3" stroke-dasharray="6 3"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="#0984E3" stroke-width="1.5"/>
  <text x="50" y="35" text-anchor="middle" fill="#0984E3" font-size="10" font-weight="800">קו"ח</text>
  <text x="50" y="48" text-anchor="middle" fill="#0984E3" font-size="10" font-weight="800">הוגש</text>
  <path d="M35 60 h30" stroke="#0984E3" stroke-width="2"/>
  <text x="50" y="72" text-anchor="middle" fill="#0984E3" font-size="7">דצמבר 2025</text>
  <circle cx="82" cy="18" r="12" fill="#F1C40F"/>
  <text x="82" y="22" text-anchor="middle" fill="#1A1A1A" font-size="8" font-weight="700">+50</text>
</svg>
```

### Hired Stamp (Star Burst)

```svg
<svg viewBox="0 0 120 120" class="stamp stamp--hired">
  <polygon points="60,5 72,40 110,40 80,62 90,97 60,78 30,97 40,62 10,40 48,40" 
    fill="none" stroke="#00B894" stroke-width="3"/>
  <circle cx="60" cy="58" r="25" fill="none" stroke="#00B894" stroke-width="2"/>
  <path d="M50 58 l8 8 l15 -15" stroke="#00B894" stroke-width="4" fill="none" stroke-linecap="round"/>
  <text x="60" y="95" text-anchor="middle" fill="#00B894" font-size="9" font-weight="800">גיוס מוצלח!</text>
  <circle cx="100" cy="20" r="15" fill="#F1C40F"/>
  <text x="100" y="24" text-anchor="middle" fill="#1A1A1A" font-size="9" font-weight="700">+500</text>
</svg>
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-10 | Sally (UX Designer) | Initial complete specification |

---

**End of UX Design Specification**

*This document provides complete design guidance for implementing PassportCard Refer. All specifications are based on existing PassportCard brand guidelines and optimized for the target Hebrew-speaking audience.*

🎨 **Questions or refinements needed? Let's iterate!**
