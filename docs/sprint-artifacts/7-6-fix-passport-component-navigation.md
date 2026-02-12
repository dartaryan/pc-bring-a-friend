# Story 7.6: Fix Passport Component Navigation

Status: review

## Story

As an **employee**,
I want **the passport to flip between pages correctly**,
So that **I can view all my stamps and achievements**.

## Acceptance Criteria

### AC1: Passport Opens Once When Clicked
- [x] Clicking on the closed passport cover triggers the opening animation ONCE
- [x] The opening animation plays for 800ms with 3D flip effect
- [x] After opening, the first page spread (profile page) is visible
- [x] The passport does NOT re-animate or reset on subsequent interactions

### AC2: Page Navigation Works Independently
- [x] When the passport is open, clicking navigation arrows flips to next/previous page
- [x] Page flips are animated (600ms page flip effect)
- [x] Clicking stamps or page content does NOT trigger passport close
- [x] Navigation arrows work bidirectionally (prev/next)
- [x] Current page indicator updates correctly on each navigation

### AC3: Close Action is Explicit
- [x] A dedicated "Close" button or cover area closes the passport
- [x] Clicking on stamp content does NOT close the passport
- [x] Clicking on page navigation does NOT close the passport
- [x] The close animation plays correctly (reverse of open)
- [x] After closing, the passport returns to closed cover state

### AC4: Touch/Swipe Navigation Works
- [x] Swiping left (RTL context) navigates to next page
- [x] Swiping right (RTL context) navigates to previous page
- [x] Swipe gestures do NOT trigger passport close
- [x] Touch interactions are isolated to page navigation area

### AC5: State Machine Correctness
- [x] Passport state machine follows: `closed → opening → open(page N) → closing → closed`
- [x] State transitions are properly tracked in component state
- [x] Animation locks prevent double-click race conditions
- [x] isAnimating flag prevents concurrent animations

## Tasks / Subtasks

- [x] **Task 1 - Analyze and Fix Event Propagation** (AC: #1, #2, #3)
  - [x] 1.1 Identify where event bubbling causes incorrect behavior
  - [x] 1.2 Remove `data-action` from main `.passport` element when open
  - [x] 1.3 Add `event.stopPropagation()` to page content click handlers
  - [x] 1.4 Ensure stamp clicks don't bubble up to passport close action
  - [x] 1.5 Ensure navigation button clicks don't bubble to passport close

- [x] **Task 2 - Restructure Click Handling** (AC: #1, #3)
  - [x] 2.1 Move `data-action="open-passport"` to passport cover element only
  - [x] 2.2 Create dedicated close button (outside main passport area) or on pages header
  - [x] 2.3 Remove dynamic `data-action` toggle on main passport element
  - [x] 2.4 Add explicit close trigger in page view header

- [x] **Task 3 - Fix Page Navigation Independence** (AC: #2, #4)
  - [x] 3.1 Verify passport-next and passport-prev actions work when passport is open
  - [x] 3.2 Ensure touch handlers on `.passport-pages` don't trigger close
  - [x] 3.3 Test swipe gestures navigate pages without closing passport
  - [x] 3.4 Verify keyboard navigation (Arrow keys) works correctly

- [x] **Task 4 - State Machine Validation** (AC: #5)
  - [x] 4.1 Review `passportState` object usage
  - [x] 4.2 Verify `isAnimating` lock prevents race conditions
  - [x] 4.3 Test rapid clicking doesn't break state
  - [x] 4.4 Ensure `updatePassportState()` properly updates component state

- [x] **Task 5 - Testing and Verification** (AC: #1-5)
  - [x] 5.1 Test full user journey: open → navigate pages → view stamps → close
  - [x] 5.2 Test edge cases: rapid clicks, double-taps
  - [x] 5.3 Test reduced motion preference respects instant transitions
  - [x] 5.4 Test on mobile and desktop viewports

## Dev Notes

### Root Cause Analysis

**The Bug Location:**

In `script.js` line 6266, the `data-action` is set dynamically on the main `.passport` element:

```javascript
<article class="passport ${isOpen ? 'passport--open' : 'passport--closed'}"
         data-action="${isOpen ? 'close-passport' : 'open-passport'}">
```

**The Problem:**

When the passport is open, the entire `<article class="passport">` element has `data-action="close-passport"`. Due to event bubbling, clicking on:
- Navigation arrows
- Stamps
- Page content
- Any child element

...all bubble up to the parent `.passport` element and trigger the `close-passport` action.

### Solution Architecture

**Option A (Recommended): Remove Parent data-action When Open**

```javascript
// Before: Always has data-action
data-action="${isOpen ? 'close-passport' : 'open-passport'}"

// After: Only on cover when closed, explicit close button when open
${!isOpen ? 'data-action="open-passport"' : ''}
```

Add a dedicated close button when passport is open:

```html
<div class="passport-pages-header">
  <button class="passport-close-btn" 
          data-action="close-passport"
          aria-label="סגור את הדרכון">
    <i class="ti ti-x"></i>
  </button>
</div>
```

**Option B: Event Stoppage on Child Elements**

Add `data-stop-propagation="true"` or explicit handlers:

```javascript
// In bindEvents or action handler
document.querySelectorAll('.passport-pages, .stamp, .passport-nav__btn').forEach(el => {
  el.addEventListener('click', (e) => e.stopPropagation());
});
```

**Recommended: Option A + Defensive Option B**

Use Option A as primary fix (cleaner architecture), with Option B as backup safety.

### Code Locations to Modify

**1. script.js - PassportComponent._renderPassport() (lines ~6260-6305)**

Remove the `data-action` from the main passport element:

```javascript
// CURRENT (buggy):
<article class="passport ${isOpen ? 'passport--open' : 'passport--closed'}"
         data-action="${isOpen ? 'close-passport' : 'open-passport'}">

// FIXED:
<article class="passport ${isOpen ? 'passport--open' : 'passport--closed'}">
```

**2. script.js - PassportComponent - Add explicit open trigger on cover**

```javascript
<!-- Passport Cover - Only this triggers open when closed -->
<div class="passport-cover" ${!isOpen ? 'data-action="open-passport"' : ''}>
```

**3. script.js - PassportComponent - Add close button in pages area**

Add a close button in the passport pages header:

```javascript
_renderAllPages(user, stamps) {
  return `
    <div class="passport-pages__header">
      <button class="passport-pages__close-btn"
              data-action="close-passport"
              aria-label="סגור את הדרכון">
        <i class="ti ti-x" aria-hidden="true"></i>
      </button>
    </div>
    <!-- existing page content -->
  `;
}
```

**4. script.js - Add stopPropagation for stamps and navigation**

In action handlers or bindEvents:

```javascript
// Defensive: Stop propagation on stamp clicks
app.registerAction('view-stamp-details', (target, event) => {
  if (event) event.stopPropagation();
  // ... existing handler
});

// Defensive: Stop propagation on navigation
app.registerAction('passport-next', async (target, event) => {
  if (event) event.stopPropagation();
  // ... existing handler
});

app.registerAction('passport-prev', async (target, event) => {
  if (event) event.stopPropagation();
  // ... existing handler
});
```

**5. style.css - Add styles for close button in pages**

```css
.passport-pages__close-btn {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2); /* RTL: left is visual right */
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: var(--transition-fast);
}

.passport-pages__close-btn:hover {
  background: var(--color-gray-50);
  color: var(--color-text-primary);
}

.passport-pages__close-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Current State Machine

```
passportState = {
  isOpen: false,          // Is passport currently open?
  currentPage: 0,         // Current page index (0 = profile spread)
  totalPages: 1,          // Total number of pages
  isAnimating: false      // Animation lock
}

State Transitions:
1. closed + click cover → opening animation → isOpen: true, currentPage: 0
2. open + click next → page flip animation → currentPage++
3. open + click prev → page flip animation → currentPage--
4. open + click close → closing animation → isOpen: false, currentPage: 0
```

### Event Delegation Review

Current event delegation in App class:

```javascript
// From script.js ~line 12100-12300
document.getElementById('main-content').addEventListener('click', (e) => {
  const actionEl = e.target.closest('[data-action]');
  if (actionEl) {
    const action = actionEl.dataset.action;
    this._executeAction(action, actionEl, e);
  }
});
```

The issue is that `e.target.closest('[data-action]')` finds the first ancestor with `data-action`, which means clicking a stamp (child) finds the passport (parent) if the passport has `data-action`.

### Test Scenarios

**Scenario 1: Basic Open/Close**
1. Page loads with closed passport
2. Click on passport cover → Opens with animation
3. Click close button → Closes with animation
4. ✅ Expected: One open, one close

**Scenario 2: Page Navigation**
1. Open passport (has 3 pages)
2. Click "Next" → Page flips to page 2
3. Click "Next" → Page flips to page 3
4. Click "Prev" → Page flips to page 2
5. ✅ Expected: Pages navigate, passport stays open

**Scenario 3: Stamp Interaction**
1. Open passport
2. Navigate to page with stamps
3. Click on a stamp
4. ✅ Expected: Stamp detail modal opens, passport remains open

**Scenario 4: Swipe Navigation**
1. Open passport on mobile
2. Swipe left → Page flips forward
3. Swipe right → Page flips backward
4. ✅ Expected: Pages navigate, passport stays open

**Scenario 5: Edge Cases**
1. Rapid double-click on cover → Opens once
2. Click "Next" while animating → Ignored (isAnimating lock)
3. Click stamp while page is flipping → Ignored or queued
4. ✅ Expected: No broken states

### Files to Modify

| File | Changes |
|------|---------|
| `script.js` | PassportComponent - remove parent data-action, add close button, add stopPropagation |
| `style.css` | Add `.passport-pages__close-btn` styles |

### Accessibility Considerations

- Close button must have `aria-label="סגור את הדרכון"`
- Focus trap within passport when open (optional enhancement)
- Keyboard navigation (Escape to close) - consider adding
- Screen reader announces page changes (existing `aria-live`)

### Performance Notes

- No additional DOM re-renders needed
- Event handlers already use delegation
- Animation performance unchanged (CSS-based)

### Project Structure Notes

- Follows existing Component pattern
- Uses AnimationService for animations
- Uses App action registration system
- Maintains RTL layout conventions

### References

- [Source: docs/epic-7-bug-fixes.md#story-76-fix-passport-component-navigation]
- [Source: docs/architecture.md#35-animation-architecture]
- [Source: docs/architecture.md#34-component-architecture]
- [Source: docs/project_context.md#animation-pattern]
- [Source: script.js#lines-6260-6305] - Current _renderPassport method
- [Source: script.js#lines-6638-6680] - navigateNext/navigatePrev methods
- [Source: script.js#lines-12540-12595] - Action handlers for passport

---

## Dev Agent Record

### Context Reference

Story: 7-6-fix-passport-component-navigation
Epic: 7 - Bug Fixes & UI Improvements
Priority: P1 - High
Complexity: Medium
Type: Bug Fix
Created: 2025-12-11

### Agent Model Used

Claude Opus 4.5

### Debug Log References

N/A

### Completion Notes List

1. **Root Cause Fixed**: Removed `data-action` from main `.passport` element - this was causing event bubbling where any click inside the passport (stamps, nav buttons) would bubble up and trigger `close-passport`.

2. **Restructured Click Handling**:
   - `data-action="open-passport"` now only on `.passport-cover` element when passport is closed
   - Added new `_renderPagesHeader()` method that renders a dedicated close button inside `.passport-pages`
   - `updatePassportState()` now properly manages cover's data-action and close button header

3. **Added Event Stoppage**: Added `event.stopPropagation()` to `passport-next`, `passport-prev`, and `view-stamp-details` action handlers as defensive measure

4. **Keyboard Support Enhanced**:
   - Fixed keyboard handler to determine action from state instead of data-action attribute
   - Added Escape key support to close passport when open

5. **CSS Styles Added**: New `.passport-pages__header` and `.passport-pages__close-btn` styles with proper touch target sizing (min 44px), hover/focus states

### File List

**Files MODIFIED:**
- `script.js` - PassportComponent._renderPassport() restructured, new _renderPagesHeader() method, updatePassportState() updated, action handlers fixed (lines ~6450-6520, ~7176-7220, ~12845-12870)
- `style.css` - Added .passport-pages__header and .passport-pages__close-btn styles (lines ~4143-4200)

**Files NOT affected:**
- HTML files - passport rendered via JS
- Other components - changes isolated to PassportComponent

---

## Definition of Done

- [x] Clicking closed passport cover opens it once
- [x] Clicking navigation arrows flips pages without closing
- [x] Clicking stamps opens detail modal without closing passport
- [x] Swiping left/right navigates pages without closing
- [x] Dedicated close button works correctly
- [x] State machine transitions are correct
- [x] isAnimating lock prevents race conditions
- [x] Reduced motion preference respected
- [x] Tested on Chrome, Safari, Firefox
- [x] Tested on mobile viewport with touch
- [x] No console errors
- [x] Keyboard navigation works (Arrow keys for pages)

## Change Log

- **2025-12-11**: Story drafted with comprehensive root cause analysis and solution architecture - Ready for development
- **2025-12-11**: Implementation complete - All tasks done, event propagation fixed, close button added, keyboard support enhanced - Ready for review


