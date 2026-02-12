# Bug Backlog - HR Bring-a-Friend Application

> **Created:** 2025-12-11  
> **Status:** Triage Complete - Ready for Sprint Planning  
> **Total Bugs:** 9 (including refactoring item)

---

## Overview

This document contains a prioritized list of bugs and improvements identified for the HR Bring-a-Friend application. Each bug is documented with sufficient detail for development agents to implement fixes.

---

## Priority Matrix

| Priority | Bugs |
|----------|------|
| **P0 - Critical** | #0 (HTML Split), #7 (Responsiveness) |
| **P1 - High** | #3 (Email Display), #6 (Passport Navigation) |
| **P2 - Medium** | #1 (Login UX), #4 (OTP Simulation), #5 (Color Consistency) |
| **P3 - Low** | #2 (Logos), #8 (Emojis → Icons) |

---

## Bug Details

### BUG-0: Split HTML into Separate Pages (Refactoring)

**Priority:** P0 - Critical  
**Complexity:** High  
**Affected Files:** `index.html`, `script.js`, `style.css`  
**Type:** Architecture/Refactoring

#### Description
The single `index.html` file has grown too large and needs to be split into separate page files for better maintainability and performance.

#### Current State
- All views/screens are contained in one HTML file
- File size is affecting maintainability
- Difficult to navigate and modify

#### Expected Behavior
- Separate HTML files for each major view/page
- Shared components extracted appropriately
- Clean navigation between pages
- Maintain current functionality

#### Acceptance Criteria
- [ ] Login page in separate file
- [ ] Dashboard in separate file
- [ ] Referral form in separate file
- [ ] Position listings in separate file
- [ ] All navigation works correctly
- [ ] No functionality regression

#### Technical Notes
Consider using a simple routing solution or keeping views as separate HTML files with shared CSS/JS.

---

### BUG-1: Login Page UX Improvements

**Priority:** P2 - Medium  
**Complexity:** Medium  
**Affected Files:** `index.html`, `style.css`, `script.js`  
**Type:** UI/UX Enhancement

#### Description
The login page lacks engagement and uses an inappropriate red background color.

#### Current State
- Red background color
- No animations
- Static, uninviting design

#### Expected Behavior
- White background (or appropriate brand color)
- Smooth entrance animations
- More engaging and welcoming user experience
- Professional yet friendly appearance

#### Acceptance Criteria
- [ ] Background changed to white/appropriate color
- [ ] Entrance animations added (fade-in, slide-up, etc.)
- [ ] Form elements have subtle hover/focus animations
- [ ] Overall design feels more engaging
- [ ] Respects `prefers-reduced-motion` setting

---

### BUG-2: Missing PassportCard Logos

**Priority:** P3 - Low  
**Complexity:** Low  
**Affected Files:** `index.html`, `style.css`  
**Type:** Branding/UI

#### Description
PassportCard company logos are missing throughout the application.

#### Current State
- Logo placeholders or missing logos in various locations

#### Expected Behavior
- PassportCard logo appears in header/navigation
- Logo appears on login page
- Logo appears in footer (if applicable)
- Consistent logo sizing and placement

#### Acceptance Criteria
- [ ] Logo added to header
- [ ] Logo added to login page
- [ ] Logo properly sized and positioned
- [ ] Logo has appropriate alt text for accessibility

#### Assets Required
- PassportCard logo file (SVG preferred)

---

### BUG-3: Email Input Display Bug

**Priority:** P1 - High  
**Complexity:** Low  
**Affected Files:** `style.css`, `script.js`  
**Type:** Bug Fix

#### Description
When typing an email address in the email input component, the displayed email text obscures or hides the input. The display should be positioned below the input box, not inside it.

#### Current State
- Email display appears inside/over the input field
- Text becomes hidden or hard to read while typing

#### Expected Behavior
- Email input field works normally while typing
- Any email display/confirmation appears below the input box
- Clear visual separation between input and display

#### Acceptance Criteria
- [ ] Email input is fully visible while typing
- [ ] Any email display appears below the input
- [ ] No text overlap or obscuring
- [ ] Works on all screen sizes

#### Technical Notes
Check for any floating label or display element that's positioned incorrectly.

---

### BUG-4: OTP Phone Number Simulation Enhancement

**Priority:** P2 - Medium  
**Complexity:** Medium  
**Affected Files:** `script.js`, `style.css`, `index.html`  
**Type:** Feature Enhancement

#### Description
Enhance the OTP simulation to mimic real SMS verification behavior.

#### Current State
- Basic OTP input exists

#### Expected Behavior

**Part A - Phone Number Display:**
- Display simulated phone number: "05" + 8 random digits
- Optional: Generate number based on user's name (deterministic hash)
- Show masked format: "05X-XXX-XX78" (showing last 2 digits)

**Part B - Toast Notification:**
- After form submission, show toast sliding down from top of screen
- Toast contains the OTP code user needs to enter
- Simulates receiving an SMS message
- Toast should auto-dismiss after ~10 seconds or have close button

#### Acceptance Criteria
- [ ] Phone number displayed in format: 05X-XXX-XXXX
- [ ] Phone number generation is deterministic (optional: based on name)
- [ ] Toast notification slides from top after OTP request
- [ ] Toast displays generated OTP code clearly
- [ ] Toast has appropriate styling (SMS-like appearance)
- [ ] Toast dismisses automatically or manually
- [ ] OTP validation works with displayed code

#### Technical Notes
```javascript
// Example phone generation
function generatePhoneNumber(name) {
  const hash = simpleHash(name);
  return `05${hash.toString().padStart(8, '0').slice(0, 8)}`;
}

// Toast should appear with animation
// Consider using existing toast/notification system if available
```

---

### BUG-5: Dashboard Color Inconsistency

**Priority:** P2 - Medium  
**Complexity:** Medium  
**Affected Files:** `style.css`  
**Type:** UI/Design

#### Description
The dashboard and various pages have inconsistent color schemes. Colors are too loud/aggressive, and each page looks different.

#### Current State
- Inconsistent color usage across pages
- Some colors too vibrant/loud
- Lack of unified design language

#### Expected Behavior
- Consistent color palette across all pages
- Calmer, more professional color scheme
- Unified visual identity
- Clear visual hierarchy

#### Acceptance Criteria
- [ ] Define CSS variables for consistent color palette
- [ ] Apply consistent primary/secondary/accent colors
- [ ] Reduce visual noise from overly bright colors
- [ ] All pages share same design language
- [ ] Dashboard feels cohesive with other pages

#### Design Guidelines
- Use PassportCard brand colors as base
- Limit accent colors
- Ensure sufficient contrast for accessibility
- Consider using tints/shades of same hue family

---

### BUG-6: Passport Component Navigation Broken

**Priority:** P1 - High  
**Complexity:** Medium  
**Affected Files:** `script.js`, `style.css`  
**Type:** Bug Fix

#### Description
The passport component does not paginate correctly. Clicking on it reopens/resets instead of flipping between different pages.

#### Current State
- Clicking passport reopens it from beginning
- Cannot navigate between passport pages
- State resets on each interaction

#### Expected Behavior
- First click opens passport
- Subsequent clicks flip to next page
- Can navigate forward through passport pages
- Optional: ability to go back
- Smooth page-flip animation

#### Acceptance Criteria
- [ ] Passport opens on first click
- [ ] Subsequent clicks flip to next page
- [ ] Page state is maintained
- [ ] Smooth transition animation between pages
- [ ] Clear indication of current page/total pages
- [ ] Reaches end state after all pages viewed

#### Technical Notes
- Check for event handler issues (multiple bindings?)
- Verify state management for current page
- May need to prevent event propagation

---

### BUG-7: Responsiveness Broken Across Pages

**Priority:** P0 - Critical  
**Complexity:** High  
**Affected Files:** `style.css`, `index.html`  
**Type:** Bug Fix

#### Description
Mobile and tablet responsiveness is broken on almost all pages of the application.

#### Current State
- Layout breaks on mobile devices
- Elements overflow or overlap
- Text and buttons may be too small or too large
- Navigation may not work properly on mobile

#### Expected Behavior
- Fully responsive design from 320px to 1920px+
- Mobile-first approach
- Touch-friendly targets (min 44px)
- Readable text at all sizes
- Proper navigation on mobile (hamburger menu if needed)

#### Acceptance Criteria
- [ ] Login page responsive
- [ ] Dashboard responsive
- [ ] Referral form responsive
- [ ] Position listings responsive
- [ ] Passport component responsive
- [ ] All modals/overlays responsive
- [ ] No horizontal scroll on mobile
- [ ] Touch targets minimum 44px
- [ ] Tested at: 320px, 375px, 768px, 1024px, 1440px

#### Breakpoints to Test
```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Small Desktop */
@media (max-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1440px) { }
```

---

### BUG-8: Replace Emojis with Icons

**Priority:** P3 - Low  
**Complexity:** Low  
**Affected Files:** `index.html`, `script.js`, `style.css`  
**Type:** UI Enhancement

#### Description
Remove all emoji characters from the application and replace them with proper icons.

#### Current State
- Emojis used in various places (buttons, labels, indicators)
- Inconsistent appearance across platforms

#### Expected Behavior
- No emojis anywhere in the application
- All icons use consistent icon library (e.g., Font Awesome, Material Icons, custom SVGs)
- Icons are accessible (proper aria-labels)

#### Acceptance Criteria
- [ ] All emojis identified and listed
- [ ] Each emoji replaced with appropriate icon
- [ ] Icon library integrated (if not already)
- [ ] Icons have proper accessibility attributes
- [ ] Consistent icon sizing and styling

#### Emoji Audit Required
Search codebase for emoji usage:
- Unicode emoji characters
- Emoji shortcodes
- HTML emoji entities

---

## Recommended Implementation Order

Based on dependencies and priorities:

### Phase 1: Foundation (Do First)
1. **BUG-0:** Split HTML into pages (enables parallel work)
2. **BUG-5:** Establish consistent color system (CSS variables)

### Phase 2: Critical Fixes
3. **BUG-7:** Fix responsiveness across all pages
4. **BUG-3:** Fix email input display
5. **BUG-6:** Fix passport navigation

### Phase 3: Enhancements
6. **BUG-1:** Login page UX improvements
7. **BUG-4:** OTP simulation enhancement
8. **BUG-2:** Add PassportCard logos
9. **BUG-8:** Replace emojis with icons

---

## Notes for Developers

1. **Before starting:** Review the architecture doc and understand the current structure
2. **Testing:** Test all changes across multiple screen sizes
3. **Accessibility:** Maintain WCAG compliance with all changes
4. **Performance:** Consider lazy loading if splitting into multiple pages
5. **Coordination:** Some bugs may overlap - coordinate to avoid conflicts

---

## Status Tracking

| Bug ID | Status | Assigned To | Sprint | Notes |
|--------|--------|-------------|--------|-------|
| BUG-0 | 🔴 Open | - | - | |
| BUG-1 | 🔴 Open | - | - | |
| BUG-2 | 🔴 Open | - | - | |
| BUG-3 | 🔴 Open | - | - | |
| BUG-4 | 🔴 Open | - | - | |
| BUG-5 | 🔴 Open | - | - | |
| BUG-6 | 🔴 Open | - | - | |
| BUG-7 | 🔴 Open | - | - | |
| BUG-8 | 🔴 Open | - | - | |

---

*Document generated by BMad Master for BMAD agent consumption*

