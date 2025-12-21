# PassportCard Refer - Bug Fixes & Improvements

## Overview

This document tracks bugs and improvements identified after the modular refactoring. Each item should be addressed independently.

**Created:** 2024-12-20  
**Status:** In Progress

---

## Priority Legend

- 🔴 **Critical** - Blocks core functionality
- 🟡 **Medium** - Affects user experience
- 🟢 **Low** - Polish/enhancement

---

## Bug List

### 1. 🟡 Name Display - Use Real Input Instead of Generated Names

**Current Behavior:**  
When user enters their email (e.g., `ben.akiva@company.com`), the system generates random Hebrew names.

**Expected Behavior:**  
- Parse the email/username input and use it as the display name
- Example: `ben.akiva` → "Ben Akiva שלום!"
- Only generate fake **job titles** for referrals, NOT names
- Capitalize first letter of each name part

**Files to Check:**
- `js/data/user-generator.js` - `generateUserFromEmail()` function
- `js/components/login.js` - Login handling

---

### 2. 🔴 Broken Close Buttons on Modals

**Current Behavior:**  
Close buttons (X) on modal windows do not work. Modals cannot be dismissed.

**Expected Behavior:**  
- All modal close buttons should dismiss the modal
- Click outside modal should also close it (if applicable)

**Affected Modals:**
- [x] Position Detail Modal
- [x] Referral Detail Modal  
- [x] Stamp Detail Modal
- [ ] Share Panel (uses different pattern - already working)
- [ ] OTP Modal (uses different pattern - already working)

**Files to Check:**
- `js/components/modals/*.js`
- `js/services/modal.js` - ModalManager class
- Event delegation in `js/app.js`

---

### 3. 🔴 Share Position Button Not Working

**Current Behavior:**  
The "Share Position" button does nothing when clicked.

**Expected Behavior:**  
- Should open the Share Panel with the position's referral link
- Should allow copying link / sharing via WhatsApp/Email

**Files to Check:**
- `js/components/positions.js` - Share button click handler
- `js/components/modals/share-panel.js` - SharePanel, openSharePanel()

---

### 4. 🟡 Header Logo & Sticky Behavior

**Current Behavior:**  
- Header has wrong/missing PassportCard white logo
- Header scrolls away with content

**Expected Behavior:**  
- Replace with correct white PassportCard logo in header
- Header should be `position: sticky` or `fixed` at top during scroll

**Files to Check:**
- `css/layout/header.css` - Add sticky positioning
- `js/components/header.js` - Logo rendering
- Logo asset file location

---

### 5. 🟡 Remove X Button from Passport

**Current Behavior:**  
Passport has an X close button.

**Expected Behavior:**  
- Remove the X button completely
- Passport opens/closes by clicking on it
- User flips through pages to reach the end, which closes the passport

**Files to Check:**
- `js/components/passport.js` - Remove X button from render()
- Update click handlers for open/close logic

---

### 6. 🟡 Passport Container Width Jump

**Current Behavior:**  
- When passport is closed, the container area is narrow (approximately half width)
- When passport opens, the container expands horizontally causing a visual "jump"
- This looks jarring/unprofessional

**Expected Behavior:**  
- Passport container should have consistent WIDTH whether open or closed
- No horizontal layout shift when opening/closing passport
- Full width space allocated for the 3D passport effect at all times

**Files to Check:**
- `css/components/passport.css` - Container width/min-width
- Possibly `js/components/passport.js` - Dynamic width calculations

---

### 7. 🟢 Passport Navigation Arrows Positioning

**Current Behavior:**  
Page navigation arrows are positioned below or around the passport awkwardly.

**Expected Behavior:**  
- Left arrow on the LEFT side of the passport (same horizontal line)
- Right arrow on the RIGHT side of the passport (same horizontal line)
- Arrows should be vertically centered relative to passport

**Files to Check:**
- `css/components/passport.css` - Navigation arrow positioning
- `js/components/passport.js` - Arrow HTML structure

---

### 8. 🟢 Remove Stats Text Under Passport

**Current Behavior:**  
Text showing "15 stamps | 1,925 points" appears under the passport.

**Expected Behavior:**  
- Remove this stats text completely from under the passport
- Stats can remain visible elsewhere (e.g., dashboard, header)

**Files to Check:**
- `js/components/passport.js` - Remove stats render
- `css/components/passport.css` - Clean up related styles

---

### 9. 🟢 Remove Page Numbers Under Passport

**Current Behavior:**  
Page numbers (e.g., "Page 1 of 4") appear under the passport.

**Expected Behavior:**  
- Remove page number indicator from under passport
- Navigation is intuitive enough without explicit numbers

**Files to Check:**
- `js/components/passport.js` - Remove page indicator render
- `css/components/passport.css` - Clean up related styles

---

## Progress Tracking

| # | Issue | Status | Assignee | Notes |
|---|-------|--------|----------|-------|
| 1 | Name Display | ✅ Fixed | | Uses real email name (capitalized) |
| 2 | Modal Close Buttons | ✅ Fixed | | Removed inline stopPropagation() that blocked event delegation |
| 3 | Share Position Button | ✅ Fixed | | Added modal-container to event delegation + registered share-position-modal action |
| 4 | Header Logo & Sticky | ✅ Fixed | | Bigger logo, sticky container, sidebar toggle button |
| 5 | Remove Passport X Button | ✅ Fixed | | Removed X button, closes via main CTA |
| 6 | Passport Width Jump | skip | | |
| 7 | Arrow Positioning | ✅ Fixed | | Arrows positioned on sides of passport using absolute positioning |
| 8 | Remove Stats Text | ✅ Fixed | | Removed stats paragraph from passport summary |
| 9 | Remove Page Numbers | ✅ Fixed | | Removed page indicator from passport.js and CSS |

---

## Testing Checklist

After fixing each item, verify:

- [ ] Login flow works with real name display
- [ ] All modals can be opened AND closed
- [ ] Share functionality works from positions page
- [ ] Header stays visible on scroll
- [ ] Passport opens/closes smoothly without X button
- [ ] No layout jump when toggling passport
- [x] Navigation arrows are properly positioned
- [x] No stats or page numbers under passport
- [ ] All existing functionality still works

---

## Notes

- Test on mobile viewport as well as desktop
- ES6 modules require HTTP server (`npx serve .`)
- Original files backed up in `_archive/` folder
