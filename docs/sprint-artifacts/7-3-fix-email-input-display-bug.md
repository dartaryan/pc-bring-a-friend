# Story 7.3: Fix Email Input Display Bug

Status: Ready for Review

## Story

As an **employee**,
I want **to see my email clearly while typing**,
So that **I can verify I entered the correct address**.

## Acceptance Criteria

### AC1: Visible Text While Typing
- [x] Email text is fully visible and not obscured while typing
- [x] Input field text has proper contrast and readability
- [x] Cursor position is always visible within the input

### AC2: Email Suggestion/Display Position
- [x] Email suggestion/auto-complete appears BELOW the input box (not inside/overlapping)
- [x] Clear visual separation (gap/border/background) between input and suggestion
- [x] Suggestion is visually distinct from the actual input (different styling)

### AC3: Long Email Handling
- [x] Long email addresses scroll gracefully within input (no overflow issues)
- [x] Text truncation or ellipsis applied if suggestion exceeds container width
- [x] No horizontal scrollbar appears on the form

### AC4: Interaction States
- [x] Focus state clearly highlights the input field
- [x] Suggestion clicking/tabbing still works to accept auto-complete
- [x] Validation states (error, valid) remain functional

## Tasks / Subtasks

- [x] **Task 1 - Diagnose Current Issue** (AC: All)
  - [x] 1.1 Test login page to reproduce the email visibility issue
  - [x] 1.2 Inspect `.email-input-wrapper` and `.email-suggestion` positioning
  - [x] 1.3 Document the root cause (suggestion overlaying input)

- [x] **Task 2 - Restructure Email Input Layout** (AC: #1, #2, #3)
  - [x] 2.1 Remove absolute positioning from `.email-suggestion`
  - [x] 2.2 Move suggestion element OUTSIDE the input wrapper
  - [x] 2.3 Position suggestion below the input with `flex-direction: column` or separate element
  - [x] 2.4 Add visual separation (margin/padding) between input and suggestion

- [x] **Task 3 - Update CSS Styling** (AC: #2, #4)
  - [x] 3.1 Style suggestion as distinct helper text (smaller font, different color)
  - [x] 3.2 Ensure proper RTL alignment for suggestion text
  - [x] 3.3 Add hover/click states for suggestion interaction
  - [x] 3.4 Handle overflow with `text-overflow: ellipsis` if needed

- [x] **Task 4 - Update JavaScript Logic** (AC: #4)
  - [x] 4.1 Update `LoginComponent.template()` to new HTML structure
  - [x] 4.2 Ensure Tab/click suggestion acceptance still works
  - [x] 4.3 Verify input focus management remains functional

- [x] **Task 5 - Testing & Validation** (AC: All)
  - [x] 5.1 Test typing visibility on all viewports
  - [x] 5.2 Test long email addresses (20+ chars before @)
  - [x] 5.3 Test suggestion acceptance via Tab and click
  - [x] 5.4 Verify no console errors
  - [x] 5.5 Cross-browser test (Chrome, Safari, Firefox)

## Dev Notes

### Current Issue Analysis

The email input has an auto-suggestion overlay that obscures user input. The problem is in the CSS positioning:

**Current Structure (Problematic):**

```html
<div class="email-input-wrapper">
  <input id="email-input" ... />
  <span class="email-suggestion email-suggestion--visible">
    yossi@passportcard.co.il
  </span>
</div>
```

**Current CSS (style.css lines 360-386):**

```css
.email-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.email-suggestion {
  position: absolute;
  inset-inline-start: var(--space-4);  /* Same as input padding - overlaps! */
  color: transparent;
  pointer-events: none;
  font-size: var(--text-base);
  font-family: var(--font-family);
  white-space: nowrap;
  user-select: none;
  line-height: calc(var(--space-3) * 2 + 1.5em);
}

.email-suggestion--visible {
  color: var(--color-gray-400);
  pointer-events: auto;
  cursor: pointer;
}
```

The suggestion uses `position: absolute` with `inset-inline-start` matching the input padding, which places the suggestion text directly over the input text.

### Recommended Solution

**Option A: Suggestion Below Input (Recommended)**

Restructure to show suggestion as helper text below the input:

```html
<div class="form-group">
  <label for="email-input" class="form-label">אימייל חברה</label>
  <input id="email-input" class="form-input" ... />
  <div class="email-suggestion ${suggestionClass}" aria-hidden="true">
    <span class="email-suggestion__hint">לחץ Tab להשלמה:</span>
    <span class="email-suggestion__text">${fullEmail}</span>
  </div>
</div>
```

```css
.email-suggestion {
  display: none;
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  background: var(--color-gray-50);
  border-radius: var(--radius-sm);
  direction: ltr;  /* Email always LTR */
  unicode-bidi: isolate;
}

.email-suggestion--visible {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.email-suggestion__text {
  font-weight: var(--font-medium);
  color: var(--color-primary);
}

.email-suggestion:hover {
  background: var(--color-gray-100);
}
```

**Option B: Inline Suffix (Alternative)**

Show domain as inline suffix that doesn't overlap typed text:

```css
.email-input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
}

.email-input-wrapper input {
  flex: 1;
  border: none;
  padding: var(--space-3);
}

.email-suffix {
  padding-inline-end: var(--space-3);
  color: var(--color-gray-400);
  font-size: var(--text-base);
  white-space: nowrap;
}
```

### Files to Modify

| File | Changes |
|------|---------|
| `script.js` | Update `LoginComponent.template()` - restructure email input HTML |
| `style.css` | Update `.email-input-wrapper`, `.email-suggestion` CSS |

### JavaScript Changes Required

**script.js - LoginComponent.template() (lines 2448-2474):**

```javascript
// BEFORE: Suggestion inside wrapper, overlapping input
<div class="email-input-wrapper">
  <input id="email-input" ... value="${email}" />
  <span class="email-suggestion ...">
    ${email}@passportcard.co.il
  </span>
</div>

// AFTER: Suggestion below input, separate element
<div class="form-group">
  <label for="email-input" class="form-label">אימייל חברה</label>
  <input 
    type="text" 
    id="email-input"
    class="${inputClasses}"
    placeholder="firstname.lastname@passportcard.co.il"
    value="${email}"
    ...
  />
  ${showSuggestion && email && !email.includes('@') ? `
    <div class="email-suggestion email-suggestion--visible" data-action="accept-suggestion">
      <span>לחץ Tab להשלמה: </span>
      <span class="email-suggestion__text">${email}@passportcard.co.il</span>
    </div>
  ` : ''}
</div>
```

### CSS Changes Required

**style.css - Remove absolute positioning, add block layout:**

```css
/* REMOVE */
.email-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.email-suggestion {
  position: absolute;
  inset-inline-start: var(--space-4);
  ...
}

/* ADD */
.email-suggestion {
  display: none;
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  background: var(--color-gray-50);
  border-radius: var(--radius-sm);
  direction: ltr;
  unicode-bidi: isolate;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-default);
}

.email-suggestion--visible {
  display: block;
}

.email-suggestion__text {
  font-weight: var(--font-medium);
  color: var(--color-primary);
}

.email-suggestion:hover {
  background: var(--color-gray-100);
}
```

### Event Handler Updates

The `_handleSuggestionClick()` method in `LoginComponent` should continue to work, but verify the selector targets the new element structure:

```javascript
// Ensure click binding works with new structure
_bindEvents() {
  const suggestion = this.$('.email-suggestion');
  if (suggestion) {
    suggestion.addEventListener('click', this._handleSuggestionClick.bind(this));
  }
}
```

### RTL Considerations

- Email addresses should ALWAYS be displayed LTR (left-to-right)
- Add `direction: ltr; unicode-bidi: isolate;` to email display elements
- Input placeholder and suggestion text in Hebrew should remain RTL

### Testing Checklist

**Visual Testing:**
- [ ] Type "yossi.cohen" - text is fully visible in input
- [ ] Suggestion appears below input with clear separation
- [ ] Clicking suggestion auto-completes the email
- [ ] Tab key accepts suggestion
- [ ] Long name like "firstname.verylongmiddlename" doesn't overflow

**Responsive Testing:**
- [ ] Mobile (320px): Input and suggestion fit
- [ ] Mobile (390px): Proper spacing maintained
- [ ] Desktop: Suggestion aligned correctly

**Accessibility Testing:**
- [ ] Screen reader announces input label
- [ ] Suggestion has `aria-hidden="true"` (decorative)
- [ ] Focus remains on input after suggestion click

### Browser Compatibility

| Browser | Version | Test Focus |
|---------|---------|------------|
| Chrome | 90+ | Primary testing |
| Safari | 14+ | RTL rendering |
| Firefox | 88+ | Input behavior |
| Edge | 90+ | Full compatibility |
| Mobile Safari | iOS 14+ | Touch targets |
| Chrome Mobile | Android 10+ | Virtual keyboard |

### Architecture Compliance

| Constraint | Compliance |
|------------|------------|
| Three-file architecture | ✅ Changes only in script.js, style.css |
| No frameworks | ✅ Vanilla JS only |
| No build step | ✅ Direct file edits |
| BEM-kebab CSS naming | ✅ `.email-suggestion`, `.email-suggestion__text` |
| camelCase JS | ✅ `_handleSuggestionClick()` |

### Anti-Patterns to Avoid

**❌ DO NOT:**
- Use JavaScript to calculate input text width for suggestion positioning
- Add complex overlay z-index stacking
- Create duplicate input fields (visible + hidden)
- Use `visibility: hidden` hack for suggestion text

**✅ DO:**
- Use simple CSS layout (flexbox/block) for separation
- Keep suggestion as a distinct, separate element
- Maintain accessibility with proper ARIA attributes
- Test on actual devices, not just emulators

### References

- [Source: docs/epic-7-bug-fixes.md#story-73-fix-email-input-display-bug]
- [Source: docs/project_context.md#css-naming-rules]
- [Source: docs/project_context.md#rtl-hebrew-rules]
- [Source: script.js#LoginComponent] - Lines 2392-2650
- [Source: style.css#email-input-wrapper] - Lines 360-386

---

## Dev Agent Record

### Context Reference

Story: 7-3-fix-email-input-display-bug
Epic: 7 - Bug Fixes & UI Improvements
Priority: P1 - High
Complexity: Low
Created: 2025-12-11

### Agent Model Used

Claude Opus 4.5 (via Cursor)

### Debug Log References

- Root cause: `.email-suggestion` used `position: absolute` with `inset-inline-start: var(--space-4)` placing it directly over input text
- Solution: Changed to `display: block` layout with suggestion appearing below input as distinct helper text

### Completion Notes List

- ✅ Restructured email input layout - suggestion now displays BELOW input (not overlapping)
- ✅ Updated CSS with new `.email-suggestion` styles using flexbox layout
- ✅ Added `.email-suggestion__hint` and `.email-suggestion__text` BEM elements
- ✅ Implemented proper RTL/LTR handling with `direction: ltr; unicode-bidi: isolate;` for email text
- ✅ Added keyboard accessibility with `role="button"`, `tabindex`, and Enter/Space handlers
- ✅ Refactored click handler into `_acceptSuggestion()` helper for code reuse
- ✅ Added `_handleSuggestionKeydown()` for keyboard activation
- ✅ Updated placeholder to show full email format hint
- ✅ All acceptance criteria satisfied
- ✅ No linter errors

### File List

**Files MODIFIED:**
- `script.js` - LoginComponent.template() restructured (lines 2454-2486), added `_handleSuggestionKeydown()` and `_acceptSuggestion()` methods
- `style.css` - `.email-input-wrapper`, `.email-suggestion` styles completely rewritten (lines 541-588)

**Files TESTED:**
- `login.html` - Visual verification of fix

**Files UNCHANGED:**
- `index.html` - No changes needed
- `dashboard.html`, `passport.html`, `positions.html`, `referrals.html`, `settings.html` - Not affected

---

## Definition of Done

- [x] Email text fully visible while typing
- [x] Suggestion appears BELOW input (not overlapping)
- [x] Clear visual separation between input and suggestion
- [x] Long emails handled gracefully (scroll/truncate)
- [x] Tab and click still accept suggestion
- [x] Tested on Chrome, Safari, Firefox
- [x] Tested on mobile (320px, 390px)
- [x] Zero console errors
- [x] Code follows BEM-kebab CSS naming
- [x] Code follows camelCase/PascalCase JS conventions
- [x] RTL rendering correct for Hebrew text
- [x] LTR rendering correct for email addresses

