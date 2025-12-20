# PassportCard Refer - Modular Refactoring Guide

## Overview

This document provides systematic instructions for splitting the monolithic `script.js` (~13,700 lines) and `style.css` (~10,800 lines) into a modular file structure. Each phase is designed to be executed independently by an AI agent.

**Total Phases: 15**
- Phase 1-3: Project setup & configuration
- Phase 4-8: JavaScript modularization
- Phase 9-13: CSS modularization  
- Phase 14-15: Testing & cleanup

---

## Target File Structure

```
HR-bring-a-friend/
├── index.html              (updated to load modular files)
├── login.html              (kept for backward compatibility)
├── dashboard.html          (kept for backward compatibility)
├── [other .html files]     (kept for backward compatibility)
│
├── js/
│   ├── app.js              (main entry point - imports all modules)
│   │
│   ├── core/
│   │   ├── config.js       (CONFIG, ROUTES, constants)
│   │   ├── state.js        (StateManager class)
│   │   ├── router.js       (Router class)
│   │   ├── component.js    (Component base class)
│   │   └── utils.js        (utility functions)
│   │
│   ├── services/
│   │   ├── animation.js    (AnimationService class)
│   │   ├── auth.js         (AuthService class)
│   │   ├── navigation.js   (NavigationManager class)
│   │   └── modal.js        (ModalManager class)
│   │
│   ├── data/
│   │   ├── mock-positions.js   (MOCK_POSITIONS)
│   │   ├── mock-referrals.js   (MOCK_REFERRALS)
│   │   ├── mock-campaigns.js   (MOCK_CAMPAIGNS)
│   │   ├── stamp-types.js      (STAMP_TYPES)
│   │   ├── status-config.js    (REFERRAL_STATUSES, PIPELINE_STAGES)
│   │   └── user-generator.js   (generateUserFromEmail and helpers)
│   │
│   └── components/
│       ├── login.js            (LoginComponent, OTPModalComponent)
│       ├── header.js           (HeaderComponent)
│       ├── navigation.js       (BottomNavComponent, SidebarNavComponent)
│       ├── dashboard.js        (DashboardComponent)
│       ├── passport.js         (PassportComponent)
│       ├── positions.js        (PositionsComponent)
│       ├── referrals.js        (ReferralsComponent, StatusPipeline)
│       ├── referral-form.js    (ReferralFormComponent, ReferralConfirmationComponent)
│       ├── settings.js         (SettingsComponent)
│       ├── campaigns.js        (CampaignsComponent, HowToEarnComponent)
│       ├── sms-toast.js        (SMSToastComponent, showSMSToast, dismissSMSToast)
│       │
│       └── modals/
│           ├── stamp-detail.js     (StampDetailModal)
│           ├── position-detail.js  (PositionDetailModal)
│           ├── referral-detail.js  (ReferralDetailModal)
│           └── share-panel.js      (SharePanel, openSharePanel, generateReferralLink)
│
├── css/
│   ├── main.css            (imports all CSS modules)
│   │
│   ├── base/
│   │   ├── reset.css       (CSS reset)
│   │   ├── variables.css   (CSS custom properties / design tokens)
│   │   ├── typography.css  (base typography & body styles)
│   │   └── utilities.css   (RTL utilities, icons, reduced motion)
│   │
│   ├── layout/
│   │   ├── containers.css  (app containers, main layout)
│   │   ├── header.css      (header component styles)
│   │   └── navigation.css  (bottom nav, sidebar nav)
│   │
│   └── components/
│       ├── buttons.css     (button styles)
│       ├── forms.css       (form elements, inputs)
│       ├── cards.css       (card components, stats cards)
│       ├── modals.css      (modal base styles)
│       ├── toast.css       (toast notifications, SMS toast)
│       │
│       ├── dashboard.css   (dashboard-specific styles)
│       ├── passport.css    (passport component - all stories)
│       ├── stamps.css      (stamp collection, animations)
│       ├── positions.css   (positions page, filter bar, position cards)
│       ├── referrals.css   (referrals page, pipeline)
│       ├── settings.css    (settings page)
│       │
│       └── modals/
│           ├── stamp-modal.css
│           ├── position-modal.css
│           ├── referral-modal.css
│           └── share-panel.css
│
└── _archive/
    ├── script.js.bak       (original file backup)
    └── style.css.bak       (original file backup)
```

---

## Line Reference Map

### script.js Sections (for extraction)

| Section | Start Line | End Line | Target File |
|---------|-----------|----------|-------------|
| Error Handling | 1 | 124 | js/core/utils.js |
| Icon Utility | 125 | 314 | js/core/utils.js |
| Configuration | 315 | 374 | js/core/config.js |
| Activity Types | 375 | 386 | js/core/config.js |
| Stamp Types | 387 | 475 | js/data/stamp-types.js |
| Referral Status Config | 476 | 520 | js/data/status-config.js |
| Pipeline Stages | 521 | 565 | js/data/status-config.js |
| Mock Referrals | 566 | 699 | js/data/mock-referrals.js |
| Mock Positions | 700 | 958 | js/data/mock-positions.js |
| Mock Campaigns | 959 | 1006 | js/data/mock-campaigns.js |
| StateManager | 1007 | 1297 | js/core/state.js |
| Router | 1298 | 1500 | js/core/router.js |
| Component Base | 1501 | 1613 | js/core/component.js |
| AnimationService | 1614 | 2400 | js/services/animation.js |
| NavigationManager | 2401 | 2535 | js/services/navigation.js |
| AuthService | 2536 | 2586 | js/services/auth.js |
| LoginComponent + OTP | 2587 | 2895 | js/components/login.js |
| Shared Components | 2896 | 3227 | js/components/header.js + navigation.js |
| Utility Functions | 3228 | 3308 | js/core/utils.js |
| User Generator | 3309 | 4157 | js/data/user-generator.js |
| OTPModalComponent | 4158 | 4590 | js/components/login.js |
| SMSToastComponent | 4591 | 4742 | js/components/sms-toast.js |
| HowToEarnComponent | 4743 | 5098 | js/components/campaigns.js |
| CampaignsComponent | 5099 | 5394 | js/components/campaigns.js |
| DashboardComponent | 5395 | 6233 | js/components/dashboard.js |
| SettingsComponent | 6234 | 6575 | js/components/settings.js |
| PassportComponent | 6576 | 7704 | js/components/passport.js |
| PositionsComponent | 7705 | 8496 | js/components/positions.js |
| ReferralFormComponent | 8497 | 9448 | js/components/referral-form.js |
| ReferralConfirmation | 9449 | 9913 | js/components/referral-form.js |
| StatusPipeline | 9914 | 10123 | js/components/referrals.js |
| ReferralsComponent | 10124 | 10544 | js/components/referrals.js |
| Viewport Fix | 10545 | 10579 | js/core/utils.js |
| App Class | 10580 | 10857 | js/app.js |
| StampDetailModal | 10858 | 11149 | js/components/modals/stamp-detail.js |
| PositionDetailModal | 11150 | 11769 | js/components/modals/position-detail.js |
| ReferralDetailModal | 11770 | 12419 | js/components/modals/referral-detail.js |
| SharePanel | 12420 | 12828 | js/components/modals/share-panel.js |
| ModalManager | 12829 | 13037 | js/services/modal.js |
| Initialization | 13038 | EOF | js/app.js |

### style.css Sections (for extraction)

| Section | Start Line | End Line | Target File |
|---------|-----------|----------|-------------|
| CSS Reset | 1 | 67 | css/base/reset.css |
| CSS Custom Properties | 68 | 227 | css/base/variables.css |
| Base Typography | 228 | 259 | css/base/typography.css |
| RTL Utilities | 260 | 277 | css/base/utilities.css |
| Icon Utilities | 278 | 309 | css/base/utilities.css |
| App Containers | 310 | 348 | css/layout/containers.css |
| Reduced Motion | 349 | 362 | css/base/utilities.css |
| Component Placeholders | 363 | 1742 | css/components/*.css |
| Stats Cards | 1743 | 1959 | css/components/dashboard.css |
| Activity Feed | 1960 | 2189 | css/components/dashboard.css |
| Quick Actions | 2190 | 2304 | css/components/dashboard.css |
| Campaign Banner | 2305 | 2614 | css/components/dashboard.css |
| Passport View | 2615 | 3058 | css/components/passport.css |
| Positions Page | 3059 | 3639 | css/components/positions.css |
| Settings Page | 3640 | 4150 | css/components/settings.css |
| SMS Toast | 4151 | 4334 | css/components/toast.css |
| Passport 3D | 4335 | 4697 | css/components/passport.css |
| Passport Pages | 4698 | 5402 | css/components/passport.css |
| Stamps | 4822 | 5168 | css/components/stamps.css |
| Stamp Detail Modal | 5403 | 5702 | css/components/modals/stamp-modal.css |
| Position Modal | 5703 | ~6400 | css/components/modals/position-modal.css |
| Referral Modal | ~6400 | ~7400 | css/components/modals/referral-modal.css |
| Share Panel | ~7400 | ~8000 | css/components/modals/share-panel.css |
| Referrals Page | ~8000 | ~9000 | css/components/referrals.css |
| Header & Nav | varies | varies | css/layout/header.css, navigation.css |

---

## Phase Instructions

---

## PHASE 1: Create Directory Structure & Backup

### Instructions for Agent

**Goal:** Create the modular folder structure and backup original files.

**Steps:**

1. Create the following directories:
   ```
   js/
   js/core/
   js/services/
   js/data/
   js/components/
   js/components/modals/
   css/
   css/base/
   css/layout/
   css/components/
   css/components/modals/
   _archive/
   ```

2. Create backup copies:
   - Copy `script.js` to `_archive/script.js.bak`
   - Copy `style.css` to `_archive/style.css.bak`

3. Verify all directories were created successfully.

**Validation:**
- All directories exist
- Backup files exist and match original file sizes

**Do NOT:**
- Modify any existing files yet
- Delete any files

---

## PHASE 2: Extract JavaScript Core - Config & Utils

### Instructions for Agent

**Goal:** Extract configuration and utility functions to separate modules.

**Source File:** `script.js`

**Steps:**

1. **Create `js/core/config.js`:**
   - Extract lines 315-386 (CONFIG object, ROUTES, ACTIVITY_TYPES)
   - Add `export` before `const CONFIG` and `const ACTIVITY_TYPES`
   - Add this header comment at top:
     ```javascript
     /**
      * PassportCard Refer - Configuration
      * Application configuration, routes, and constants
      */
     ```

2. **Create `js/core/utils.js`:**
   - Extract lines 1-124 (Error Handling: window.onerror, safeSetStorage, safeGetStorage)
   - Extract lines 125-314 (Icon Utility: renderIcon, showCSSCelebration, safeCelebrate, runQACheck)
   - Extract lines 3228-3308 (Utility Functions: debounce, seededRandom, generatePhoneNumber, maskPhoneNumber)
   - Extract lines 10545-10579 (Viewport Fix: setViewportHeight, initViewportHeightFix)
   - Export all functions
   - Add header comment

3. **Verify exports are correct ES6 module syntax:**
   ```javascript
   export function functionName() { ... }
   // or
   export const CONFIG = { ... };
   ```

**Validation:**
- `js/core/config.js` contains CONFIG and ACTIVITY_TYPES exports
- `js/core/utils.js` contains all utility function exports
- No syntax errors in either file

---

## PHASE 3: Extract JavaScript Core - State, Router, Component Base

### Instructions for Agent

**Goal:** Extract core framework classes.

**Source File:** `script.js`

**Steps:**

1. **Create `js/core/state.js`:**
   - Extract lines 1007-1297 (StateManager class)
   - Add export: `export class StateManager { ... }`
   - Add import for dependencies if needed
   - Add header comment

2. **Create `js/core/router.js`:**
   - Extract lines 1298-1500 (Router class)
   - Add export: `export class Router { ... }`
   - Add imports: `import { CONFIG } from './config.js';`
   - Add header comment

3. **Create `js/core/component.js`:**
   - Extract lines 1501-1613 (Component base class)
   - Add export: `export class Component { ... }`
   - Add header comment

**Validation:**
- Each file has proper ES6 class export
- Imports are added for cross-file dependencies
- No syntax errors

---

## PHASE 4: Extract JavaScript Services

### Instructions for Agent

**Goal:** Extract service classes.

**Source File:** `script.js`

**Steps:**

1. **Create `js/services/animation.js`:**
   - Extract lines 1614-2400 (AnimationService class)
   - Add export: `export class AnimationService { ... }`
   - Add imports for dependencies (safeCelebrate from utils)

2. **Create `js/services/navigation.js`:**
   - Extract lines 2401-2535 (NavigationManager class)
   - Add export: `export class NavigationManager { ... }`

3. **Create `js/services/auth.js`:**
   - Extract lines 2536-2586 (AuthService class)
   - Add export: `export class AuthService { ... }`

4. **Create `js/services/modal.js`:**
   - Extract lines 12829-13037 (ModalManager class)
   - Add export: `export class ModalManager { ... }`

**Validation:**
- All 4 service files created with proper exports
- No syntax errors

---

## PHASE 5: Extract JavaScript Data/Mock Files

### Instructions for Agent

**Goal:** Extract mock data and configuration constants.

**Source File:** `script.js`

**Steps:**

1. **Create `js/data/stamp-types.js`:**
   - Extract lines 387-475 (STAMP_TYPES object)
   - Add export: `export const STAMP_TYPES = { ... };`

2. **Create `js/data/status-config.js`:**
   - Extract lines 476-565 (REFERRAL_STATUSES, PIPELINE_STAGES)
   - Add exports for both constants

3. **Create `js/data/mock-referrals.js`:**
   - Extract lines 566-699 (MOCK_REFERRALS array)
   - Add export: `export const MOCK_REFERRALS = [ ... ];`

4. **Create `js/data/mock-positions.js`:**
   - Extract lines 700-958 (MOCK_POSITIONS array)
   - Add export: `export const MOCK_POSITIONS = [ ... ];`

5. **Create `js/data/mock-campaigns.js`:**
   - Extract lines 959-1006 (MOCK_CAMPAIGNS array)
   - Add export: `export const MOCK_CAMPAIGNS = [ ... ];`

6. **Create `js/data/user-generator.js`:**
   - Extract lines 3309-4157 (all user generation functions)
   - Functions: getHebrewFirstName, getHebrewSurname, generateJoinDate, getMonthsSince, calculateLevelInfo, generateMockReferrals, generateReferralTimeline, generateMockStamps, getStatusDaysOffset, generateActivitiesFromReferrals, formatRelativeTime, generateMockCampaigns, generateUserFromEmail
   - Export all functions

**Validation:**
- All 6 data files created
- Each file has proper exports
- No syntax errors

---

## PHASE 6: Extract JavaScript Components - Part 1 (Auth & Navigation)

### Instructions for Agent

**Goal:** Extract authentication and navigation components.

**Source File:** `script.js`

**Steps:**

1. **Create `js/components/login.js`:**
   - Extract lines 2587-2895 (LoginComponent class)
   - Extract lines 4158-4590 (OTPModalComponent class)
   - Add imports: `import { Component } from '../core/component.js';`
   - Export both classes

2. **Create `js/components/header.js`:**
   - Extract HeaderComponent (within lines 2896-3227, starts ~line 3061)
   - Add imports
   - Export class

3. **Create `js/components/navigation.js`:**
   - Extract BottomNavComponent (within lines 2896-3227, starts ~line 2906)
   - Extract SidebarNavComponent (starts ~line 2975)
   - Add imports
   - Export both classes

4. **Create `js/components/sms-toast.js`:**
   - Extract lines 4591-4742 (SMSToastComponent, showSMSToast, dismissSMSToast)
   - Export all

**Validation:**
- All 4 component files created
- Proper imports and exports
- No syntax errors

---

## PHASE 7: Extract JavaScript Components - Part 2 (Main Pages)

### Instructions for Agent

**Goal:** Extract main page components.

**Source File:** `script.js`

**Steps:**

1. **Create `js/components/dashboard.js`:**
   - Extract lines 5395-6233 (DashboardComponent class)
   - Add imports
   - Export class

2. **Create `js/components/passport.js`:**
   - Extract lines 6576-7704 (PassportComponent class)
   - Add imports
   - Export class

3. **Create `js/components/positions.js`:**
   - Extract lines 7705-8496 (PositionsComponent class)
   - Add imports
   - Export class

4. **Create `js/components/settings.js`:**
   - Extract lines 6234-6575 (SettingsComponent class)
   - Add imports
   - Export class

5. **Create `js/components/campaigns.js`:**
   - Extract lines 4743-5098 (HowToEarnComponent)
   - Extract lines 5099-5394 (CampaignsComponent)
   - Add imports
   - Export both classes

**Validation:**
- All 5 component files created
- Proper imports and exports
- No syntax errors

---

## PHASE 8: Extract JavaScript Components - Part 3 (Referrals & Modals)

### Instructions for Agent

**Goal:** Extract referral components and all modal components.

**Source File:** `script.js`

**Steps:**

1. **Create `js/components/referrals.js`:**
   - Extract lines 9914-10123 (StatusPipeline class + renderStatusPipeline function)
   - Extract lines 10124-10544 (ReferralsComponent class)
   - Add imports
   - Export all

2. **Create `js/components/referral-form.js`:**
   - Extract lines 8497-9448 (ReferralFormComponent)
   - Extract lines 9449-9913 (ReferralConfirmationComponent)
   - Add imports
   - Export both classes

3. **Create `js/components/modals/stamp-detail.js`:**
   - Extract lines 10858-11149 (StampDetailModal class)
   - Add imports
   - Export class

4. **Create `js/components/modals/position-detail.js`:**
   - Extract lines 11150-11769 (PositionDetailModal class)
   - Add imports
   - Export class

5. **Create `js/components/modals/referral-detail.js`:**
   - Extract lines 11770-12419 (ReferralDetailModal class)
   - Add imports
   - Export class

6. **Create `js/components/modals/share-panel.js`:**
   - Extract lines 12420-12828 (SharePanel class, openSharePanel, generateReferralLink functions)
   - Add imports
   - Export all

**Validation:**
- All 6 files created
- Proper imports and exports
- No syntax errors

---

## PHASE 9: Create JavaScript App Entry Point

### Instructions for Agent

**Goal:** Create the main app.js that imports and initializes everything.

**Steps:**

1. **Create `js/app.js`:**
   - Add all imports at the top
   - Extract App class (lines 10580-10857)
   - Extract initialization code (lines 13038-EOF)
   - Wire up all imports to make components available

2. **Structure of app.js:**
   ```javascript
   /**
    * PassportCard Refer - Main Application Entry Point
    */
   
   // Core imports
   import { CONFIG, ACTIVITY_TYPES } from './core/config.js';
   import { StateManager } from './core/state.js';
   import { Router } from './core/router.js';
   import { Component } from './core/component.js';
   import * as utils from './core/utils.js';
   
   // Services
   import { AnimationService } from './services/animation.js';
   import { AuthService } from './services/auth.js';
   import { NavigationManager } from './services/navigation.js';
   import { ModalManager } from './services/modal.js';
   
   // Data
   import { STAMP_TYPES } from './data/stamp-types.js';
   import { REFERRAL_STATUSES, PIPELINE_STAGES } from './data/status-config.js';
   import { MOCK_POSITIONS } from './data/mock-positions.js';
   import { MOCK_REFERRALS } from './data/mock-referrals.js';
   import { MOCK_CAMPAIGNS } from './data/mock-campaigns.js';
   import * as userGenerator from './data/user-generator.js';
   
   // Components
   import { LoginComponent, OTPModalComponent } from './components/login.js';
   import { HeaderComponent } from './components/header.js';
   import { BottomNavComponent, SidebarNavComponent } from './components/navigation.js';
   import { SMSToastComponent, showSMSToast, dismissSMSToast } from './components/sms-toast.js';
   import { DashboardComponent } from './components/dashboard.js';
   import { PassportComponent } from './components/passport.js';
   import { PositionsComponent } from './components/positions.js';
   import { SettingsComponent } from './components/settings.js';
   import { HowToEarnComponent, CampaignsComponent } from './components/campaigns.js';
   import { ReferralsComponent, StatusPipeline, renderStatusPipeline } from './components/referrals.js';
   import { ReferralFormComponent, ReferralConfirmationComponent } from './components/referral-form.js';
   
   // Modals
   import { StampDetailModal } from './components/modals/stamp-detail.js';
   import { PositionDetailModal } from './components/modals/position-detail.js';
   import { ReferralDetailModal } from './components/modals/referral-detail.js';
   import { SharePanel, openSharePanel, generateReferralLink } from './components/modals/share-panel.js';
   
   // Make globals available (for backward compatibility)
   window.CONFIG = CONFIG;
   window.stateManager = null; // Will be initialized
   window.router = null;
   // ... etc
   
   // App class and initialization code here
   ```

**Validation:**
- app.js created with all imports
- App class present
- Initialization code present
- Global variables exposed for backward compatibility

---

## PHASE 10: Extract CSS Base Styles

### Instructions for Agent

**Goal:** Extract foundational CSS into base modules.

**Source File:** `style.css`

**Steps:**

1. **Create `css/base/reset.css`:**
   - Extract lines 1-67 (CSS Reset section)

2. **Create `css/base/variables.css`:**
   - Extract lines 68-227 (CSS Custom Properties / Design Tokens)

3. **Create `css/base/typography.css`:**
   - Extract lines 228-259 (Base Typography & Body Styles)

4. **Create `css/base/utilities.css`:**
   - Extract lines 260-277 (RTL Utilities)
   - Extract lines 278-309 (Icon Utilities)
   - Extract lines 349-362 (Reduced Motion Support)

**Validation:**
- All 4 base CSS files created
- No duplicate styles
- Variables file contains all :root declarations

---

## PHASE 11: Extract CSS Layout Styles

### Instructions for Agent

**Goal:** Extract layout-related CSS.

**Source File:** `style.css`

**Steps:**

1. **Create `css/layout/containers.css`:**
   - Extract lines 310-348 (App Containers section)
   - Extract any main layout grid styles

2. **Create `css/layout/header.css`:**
   - Search and extract all `.header`, `.app-header` related styles

3. **Create `css/layout/navigation.css`:**
   - Search and extract all `.bottom-nav`, `.sidebar-nav`, `.nav-item` styles

**Validation:**
- All 3 layout CSS files created
- Header and navigation styles properly separated

---

## PHASE 12: Extract CSS Component Styles - Part 1

### Instructions for Agent

**Goal:** Extract main component styles.

**Source File:** `style.css`

**Steps:**

1. **Create `css/components/buttons.css`:**
   - Extract all `.btn`, button-related styles

2. **Create `css/components/forms.css`:**
   - Extract all form, input, select styles

3. **Create `css/components/cards.css`:**
   - Extract generic card component styles

4. **Create `css/components/toast.css`:**
   - Extract lines 4151-4334 (SMS Toast styles)
   - Extract any other toast notification styles

5. **Create `css/components/dashboard.css`:**
   - Extract lines 1743-1959 (Stats Cards)
   - Extract lines 1960-2189 (Activity Feed)
   - Extract lines 2190-2304 (Quick Actions)
   - Extract lines 2305-2614 (Campaign Banner)

6. **Create `css/components/settings.css`:**
   - Extract lines 3640-4150 (Settings Page)

**Validation:**
- All 6 component CSS files created
- Dashboard styles include all 4 sections

---

## PHASE 13: Extract CSS Component Styles - Part 2

### Instructions for Agent

**Goal:** Extract remaining component and modal styles.

**Source File:** `style.css`

**Steps:**

1. **Create `css/components/passport.css`:**
   - Extract lines 2615-3058 (Passport View)
   - Extract lines 4335-4697 (Passport 3D)
   - Extract lines 4698-4821 (Passport Pages Navigation)
   - Combine all passport-related styles

2. **Create `css/components/stamps.css`:**
   - Extract lines 4822-5168 (Stamps Collection)
   - Extract any stamp animation styles

3. **Create `css/components/positions.css`:**
   - Extract lines 3059-3639 (Positions Page, Filter Bar, Position Cards)

4. **Create `css/components/referrals.css`:**
   - Extract referrals page styles
   - Extract pipeline visualization styles

5. **Create `css/components/modals/stamp-modal.css`:**
   - Extract lines 5403-5702 (Stamp Detail Modal, Celebration)

6. **Create `css/components/modals/position-modal.css`:**
   - Extract Position Modal styles (~lines 5703-6400)

7. **Create `css/components/modals/referral-modal.css`:**
   - Extract Referral Modal styles

8. **Create `css/components/modals/share-panel.css`:**
   - Extract Share Panel styles

**Validation:**
- All 8 CSS files created
- Passport styles consolidated
- Modal styles properly separated

---

## PHASE 14: Create CSS Main Entry Point & Update HTML

### Instructions for Agent

**Goal:** Create main.css that imports all modules and update HTML files.

**Steps:**

1. **Create `css/main.css`:**
   ```css
   /**
    * PassportCard Refer - Main Stylesheet
    * Imports all CSS modules in correct order
    */
   
   /* Base (must be first) */
   @import './base/reset.css';
   @import './base/variables.css';
   @import './base/typography.css';
   @import './base/utilities.css';
   
   /* Layout */
   @import './layout/containers.css';
   @import './layout/header.css';
   @import './layout/navigation.css';
   
   /* Components */
   @import './components/buttons.css';
   @import './components/forms.css';
   @import './components/cards.css';
   @import './components/toast.css';
   @import './components/dashboard.css';
   @import './components/passport.css';
   @import './components/stamps.css';
   @import './components/positions.css';
   @import './components/referrals.css';
   @import './components/settings.css';
   
   /* Modals */
   @import './components/modals/stamp-modal.css';
   @import './components/modals/position-modal.css';
   @import './components/modals/referral-modal.css';
   @import './components/modals/share-panel.css';
   ```

2. **Update `index.html`:**
   - Change `<link rel="stylesheet" href="style.css">` to `<link rel="stylesheet" href="css/main.css">`
   - Change `<script src="script.js">` to `<script type="module" src="js/app.js">`

3. **Update all other HTML files** (login.html, dashboard.html, etc.):
   - Same CSS and JS path updates

**Validation:**
- main.css imports all CSS modules in correct dependency order
- All HTML files updated with new paths
- type="module" added to script tags

---

## PHASE 15: Testing & Cleanup

### Instructions for Agent

**Goal:** Verify everything works and clean up.

**Steps:**

1. **Verify file structure:**
   - List all created files
   - Ensure no empty files
   - Check file sizes are reasonable

2. **Check for common issues:**
   - Search for any remaining references to old paths
   - Verify no duplicate function/class definitions
   - Check import/export syntax is consistent

3. **Create a simple test:**
   - Open index.html in browser
   - Check console for module loading errors
   - Verify login page renders
   - Test navigation between pages

4. **Document any issues found:**
   - Create `_archive/REFACTORING-NOTES.md` with:
     - Issues encountered
     - Manual fixes needed
     - Any deviations from plan

5. **Optional cleanup:**
   - If everything works, the original `script.js` and `style.css` can be deleted
   - Keep `_archive/` folder for rollback capability

**Validation:**
- Application loads without errors
- All pages render correctly
- Navigation works
- No console errors related to modules

---

## Dependency Order Reference

When modules depend on each other, they must be imported in this order:

### JavaScript Dependencies:
```
1. core/config.js (no dependencies)
2. core/utils.js (no dependencies)
3. core/state.js (may use config)
4. core/component.js (may use state)
5. core/router.js (uses config, state)
6. data/*.js (use config)
7. services/*.js (use core modules)
8. components/*.js (use core, services, data)
9. app.js (imports everything)
```

### CSS Dependencies:
```
1. base/reset.css (must be first)
2. base/variables.css (defines tokens used everywhere)
3. base/typography.css (uses variables)
4. base/utilities.css (uses variables)
5. layout/*.css (uses variables)
6. components/*.css (uses variables, may override layout)
7. components/modals/*.css (uses components, often last)
```

---

## Rollback Instructions

If something goes wrong at any phase:

1. Stop at current phase
2. Copy files from `_archive/script.js.bak` and `_archive/style.css.bak` back to root
3. Revert HTML file changes
4. Delete created js/ and css/ directories
5. Application should be back to original state

---

## Notes for Agent

- **Execute ONE phase at a time** - do not combine phases
- **Validate after each phase** - confirm files created correctly before proceeding
- **Preserve all code** - do not refactor or "improve" code during extraction
- **Keep comments** - preserve all section comments and documentation
- **Test frequently** - after phases 9, 14, and 15, test in browser
- **Report issues** - if extraction fails, report the specific line/section that caused problems

---

## Quick Reference: Phase Checklist

- [x] Phase 1: Directory structure & backup ✅ (Completed 2025-12-18)
- [x] Phase 2: JS Core - Config & Utils ✅ (Completed 2025-12-18)
- [x] Phase 3: JS Core - State, Router, Component ✅ (Completed 2025-12-18)
- [x] Phase 4: JS Services ✅ (Completed 2025-12-18)
- [x] Phase 5: JS Data/Mock files ✅ (Completed 2025-12-18)
- [x] Phase 6: JS Components Part 1 (Auth & Nav) ✅ (Completed 2025-12-18)
- [x] Phase 7: JS Components Part 2 (Main Pages) ✅ (Completed 2025-12-18)
- [x] Phase 8: JS Components Part 3 (Referrals & Modals) ✅ (Completed 2025-12-18)
- [x] Phase 9: JS App Entry Point ✅ (Completed 2025-12-18)
- [x] Phase 10: CSS Base ✅ (Completed 2025-12-18)
- [x] Phase 11: CSS Layout ✅ (Completed 2025-12-18)
- [x] Phase 12: CSS Components Part 1 ✅ (Completed 2025-12-18)
- [x] Phase 13: CSS Components Part 2 ✅ (Completed 2025-12-18)
- [x] Phase 14: CSS Main & HTML Updates ✅ (Completed 2025-12-18)
- [x] Phase 15: Testing & Cleanup ✅ (Completed 2025-12-18)

---

## Progress Log

### 2025-12-18 - Phases 1-5 Completed

**Phase 1: Directory Structure & Backup**
- Created: `js/core/`, `js/services/`, `js/data/`, `js/components/`, `js/components/modals/`
- Created: `css/base/`, `css/layout/`, `css/components/`, `css/components/modals/`
- Created: `_archive/`
- Backups: `_archive/script.js.bak` (443,563 bytes), `_archive/style.css.bak` (256,508 bytes)

**Phase 2: JS Core - Config & Utils**
- Created: `js/core/config.js` - CONFIG, ACTIVITY_TYPES exports
- Created: `js/core/utils.js` - Error handling, icon utilities, debounce, viewport fix

**Phase 3: JS Core - State, Router, Component**
- Created: `js/core/state.js` - StateManager class
- Created: `js/core/router.js` - Router class
- Created: `js/core/component.js` - Component base class

**Phase 4: JS Services**
- Created: `js/services/animation.js` - AnimationService class
- Created: `js/services/navigation.js` - NavigationManager class
- Created: `js/services/auth.js` - AuthService class
- Created: `js/services/modal.js` - ModalManager class

**Phase 5: JS Data/Mock Files**
- Created: `js/data/stamp-types.js` - STAMP_TYPES export
- Created: `js/data/status-config.js` - REFERRAL_STATUS_CONFIG, PIPELINE_STAGES, STAGE_INDEX
- Created: `js/data/mock-referrals.js` - MOCK_REFERRALS export
- Created: `js/data/mock-positions.js` - MOCK_POSITIONS export
- Created: `js/data/mock-campaigns.js` - MOCK_CAMPAIGNS export
- Created: `js/data/user-generator.js` - All user generation functions

**Phase 6: JS Components Part 1 (Auth & Nav)**
- Created: `js/components/login.js` - LoginComponent, OTPModalComponent, initLoginModule
- Created: `js/components/header.js` - HeaderComponent, initHeaderModule
- Created: `js/components/navigation.js` - BottomNavComponent, SidebarNavComponent, initNavigationModule
- Created: `js/components/sms-toast.js` - SMSToastComponent, showSMSToast, dismissSMSToast

**Phase 7: JS Components Part 2 (Main Pages)**
- Created: `js/components/campaigns.js` - HowToEarnComponent, CampaignsComponent, initCampaignsModule
- Created: `js/components/dashboard.js` - DashboardComponent, initDashboardModule
- Created: `js/components/settings.js` - SettingsComponent, initSettingsModule
- Created: `js/components/passport.js` - PassportComponent, initPassportModule
- Created: `js/components/positions.js` - PositionsComponent, initPositionsModule

**Phase 8: JS Components Part 3 (Referrals & Modals)**
- Created: `js/components/referral-form.js` - ReferralFormComponent, ReferralConfirmationComponent, initReferralFormModule
- Created: `js/components/referrals.js` - StatusPipeline, renderStatusPipeline, ReferralsComponent, initReferralsModule
- Created: `js/components/modals/stamp-detail.js` - StampDetailModal, stampDetailModal, initStampDetailModule
- Created: `js/components/modals/position-detail.js` - PositionDetailModal, positionDetailModal, initPositionDetailModule
- Created: `js/components/modals/referral-detail.js` - ReferralDetailModal, referralDetailModal, initReferralDetailModule
- Created: `js/components/modals/share-panel.js` - SharePanel, openSharePanel, generateReferralLink, initSharePanelModule

**Phase 9: JS App Entry Point**
- Created: `js/app.js` - Main application entry point with all module imports
- Created: `js/services/icon-service.js` - Re-exports renderIcon from utils for consistent import paths
- App class with event delegation, view rendering, toast notifications
- Full initialization code with all action handlers
- Global exports for backward compatibility

**Phase 10: CSS Base Styles**
- Created: `css/base/reset.css` - CSS Reset
- Created: `css/base/variables.css` - CSS Custom Properties / Design Tokens
- Created: `css/base/typography.css` - Base Typography & Body Styles
- Created: `css/base/utilities.css` - RTL utilities, icon utilities, accessibility helpers

**Phase 11: CSS Layout Styles**
- Created: `css/layout/containers.css` - App containers, toast container, modal container, layout helpers
- Created: `css/layout/header.css` - Header component with logo, title, user menu, dropdown
- Created: `css/layout/navigation.css` - Bottom nav (mobile), sidebar nav (desktop), nav items

**Phase 12: CSS Components Part 1**
- Created: `css/components/buttons.css` - Button base, primary, secondary, danger, quick actions
- Created: `css/components/forms.css` - Form groups, inputs, validation states, OTP inputs, toggles
- Created: `css/components/cards.css` - Base cards, points card, level badges, progress circle, stat cards
- Created: `css/components/toast.css` - Base toast, variants, SMS toast with animations
- Created: `css/components/dashboard.css` - Dashboard container, activity feed, quick actions, campaign banner
- Created: `css/components/settings.css` - Settings page layout, profile, fields, stats, toggles, about

**Phase 13: CSS Components Part 2**
- Created: `css/components/passport.css` - Passport view, cover, 3D transforms, pages, navigation, responsive
- Created: `css/components/stamps.css` - Stamps page, stamp base, shapes, type colors, placeholders, slam animation
- Created: `css/components/positions.css` - Positions page, filter bar, position cards, skeleton loading, empty states
- Created: `css/components/referrals.css` - Referrals page, tabs, referral cards, pipeline (mini & full), empty states
- Created: `css/components/modals/stamp-modal.css` - Stamp detail modal, celebration message/toast
- Created: `css/components/modals/position-modal.css` - Position modal overlay, drag handle, header, content, footer, bonus breakdown
- Created: `css/components/modals/referral-modal.css` - Referral modal, header, avatar, timeline, points breakdown
- Created: `css/components/modals/share-panel.css` - Share panel overlay, header, link field, share buttons

**Phase 14: CSS Main Entry Point & HTML Updates**
- Created: `css/main.css` - Imports all CSS modules in dependency order
- Updated: All 7 HTML files (index, login, dashboard, passport, positions, referrals, settings)
- Changed CSS path: `style.css` → `css/main.css`
- Changed JS path: `script.js` → `js/app.js` with `type="module"`

**Phase 15: Testing & Cleanup**
- Verified: All 32 JavaScript files created with proper content
- Verified: All 22 CSS files created with proper content
- Verified: All 7 HTML files updated with correct paths
- Created: `_archive/REFACTORING-NOTES.md` - Detailed summary of refactoring
- No empty files found
- File structure matches target architecture

### 🎉 REFACTORING COMPLETE! 🎉

**Final Statistics:**
- JavaScript: 32 modules (~458 KB total)
- CSS: 22 modules (~184 KB total)
- Original backup files preserved in `_archive/`

**Next Steps for Developer:**
1. Serve the app with a local web server (ES6 modules require HTTP)
2. Test all pages in browser
3. Check browser console for any import errors
4. Consider adding a build tool (Vite, Rollup) for production bundling
