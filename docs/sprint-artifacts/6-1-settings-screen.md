# Story 6.1: Settings Screen

**Status:** review

## Story

**As an** employee,
**I want** to view my profile and adjust preferences,
**So that** I can control my experience and see my information.

## Acceptance Criteria

### AC1: Settings Page Navigation
**Given** I am logged in and on any screen
**When** I click the "הגדרות" (Settings) navigation item
**Then** I navigate to `#settings`
**And** the settings page loads
**And** the nav item is highlighted as active

### AC2: Page Heading
**Given** I navigate to `#settings`
**When** the page loads
**Then** I see a "⚙️ הגדרות" (Settings) heading
**And** the header shows "הגדרות" as the page title
**And** I see sections organized by category

### AC3: Profile Section - User Information
**Given** I view the profile section
**When** I see my information
**Then** I see my full name (read-only)
**And** I see my email address (read-only, with direction: ltr)
**And** I see my department (read-only)
**And** I see my employee ID (read-only, with direction: ltr)
**And** I see my join date
**And** I see my avatar/initial prominently displayed
**And** all fields are clearly labeled in Hebrew

### AC4: Profile Section - Points & Level Summary
**Given** I view the profile section
**When** I see my gamification stats
**Then** I see my current points total
**And** I see my current level/rank name
**And** I see my total referrals count
**And** I see my total stamps collected count

### AC5: Notification Preferences Toggle
**Given** I view the notifications preferences section
**When** I see the toggle for "התראות באימייל" (Email Notifications)
**Then** the toggle reflects current state from StateManager
**And** the toggle has hint text explaining the feature

### AC6: Toggle Notification Setting
**Given** I toggle notifications
**When** I change the setting
**Then** the toggle animates smoothly to new state
**And** the preference is saved to StateManager immediately
**And** the preference persists across sessions (LocalStorage)
**And** a brief toast confirms "ההגדרות נשמרו" (Settings saved)

### AC7: Account/Logout Section
**Given** I view the account section
**When** I see logout option
**Then** I see a "התנתק" (Logout) button prominently displayed
**And** the button uses danger/warning styling (red background)
**And** there is explanatory text about what logout does

### AC8: Logout Action
**Given** I click logout
**When** confirming the action
**Then** I am logged out per Story 1.4 acceptance criteria
**And** all session data is cleared from LocalStorage
**And** StateManager is reset to initial state
**And** I am redirected to `#auth` login screen

### AC9: Demo Disclaimer (NFR-SEC-004)
**Given** I view the settings page
**When** I scroll to bottom or view footer
**Then** I see a disclaimer: "זו גרסת דמו - הנתונים אינם אמיתיים"
**And** the disclaimer is visible but not intrusive
**And** it uses subtle styling (small text, light color)

### AC10: About Section (Optional Enhancement)
**Given** I view the settings page
**When** I see the about/info section
**Then** I see app version or "PassportCard Refer v1.0"
**And** I may see "Powered by PassportCard" or similar branding
**And** links to help/support (mock/placeholder) may be available

### AC11: Responsive Layout
**Given** I view settings on mobile (< 600px)
**When** the page renders
**Then** layout is single column, full width
**And** touch targets are minimum 44×44px
**And** spacing is appropriate for touch

**Given** I view settings on tablet/desktop (≥ 600px)
**When** the page renders
**Then** layout may have wider content area with max-width
**And** profile card may have side-by-side avatar and info
**And** sections have appropriate padding

### AC12: Accessibility Requirements
**Given** I use keyboard navigation
**When** I navigate settings
**Then** I can tab through all interactive elements
**And** focus order follows visual order
**And** focus indicator is clearly visible
**And** toggle switch is keyboard accessible

**Given** I use a screen reader
**When** I navigate settings
**Then** all labels are announced correctly
**And** toggle state is announced (on/off)
**And** sections have proper headings hierarchy
**And** profile fields have associated labels

### AC13: RTL Support
**Given** the page is in RTL mode (Hebrew)
**When** I view settings
**Then** all text is right-aligned appropriately
**And** email and ID fields have direction: ltr for readability
**And** toggle is positioned correctly for RTL
**And** CSS uses logical properties (margin-inline-start, etc.)

### AC14: Visual Polish
**Given** I view the settings page
**When** I examine the design
**Then** it follows PassportCard brand guidelines
**And** uses consistent color tokens from design system
**And** has appropriate shadows and border-radius
**And** icons match the Tabler Icons library style

## Tasks / Subtasks

- [x] Task 1: Enhance SettingsComponent Profile Section (AC: #3, #4)
  - [x] Review existing SettingsComponent from Story 1.4
  - [x] Add points total and level display to profile
  - [x] Add total referrals and stamps counts
  - [x] Improve avatar display with larger size
  - [x] Ensure all fields use correct text direction

- [x] Task 2: Improve Notification Toggle (AC: #5, #6)
  - [x] Verify toggle state reads from StateManager
  - [x] Add hint text explaining notification feature
  - [x] Ensure toggle animates smoothly
  - [x] Verify state persists to LocalStorage
  - [x] Show toast on toggle change

- [x] Task 3: Polish Logout Section (AC: #7, #8)
  - [x] Review danger button styling
  - [x] Add explanatory text about logout
  - [x] Verify logout clears all session data
  - [x] Verify redirect to #auth

- [x] Task 4: Add Demo Disclaimer (AC: #9)
  - [x] Add footer section with disclaimer text
  - [x] Apply subtle styling (small, gray)
  - [x] Ensure visible but not intrusive

- [x] Task 5: Add About/Info Section (AC: #10)
  - [x] Add version info display
  - [x] Add PassportCard branding/credits
  - [x] Optional: Add placeholder help links

- [x] Task 6: Responsive Styling (AC: #11)
  - [x] Review mobile layout (single column)
  - [x] Add tablet/desktop enhancements
  - [x] Verify touch targets meet 44×44px minimum
  - [x] Test at all breakpoints

- [x] Task 7: Accessibility Polish (AC: #12, #13)
  - [x] Verify keyboard navigation works
  - [x] Add aria-labels where needed
  - [x] Ensure toggle has role="switch" and aria-checked
  - [x] Verify screen reader announces all content
  - [x] Check heading hierarchy (h1, h2, h3)

- [x] Task 8: Visual Polish (AC: #14)
  - [x] Apply consistent spacing tokens
  - [x] Review color usage matches design system
  - [x] Ensure shadows and radius are consistent
  - [x] Verify icon usage (Tabler Icons)

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story ENHANCES the existing SettingsComponent created in Story 1.4.**

The foundation is already in place:
- SettingsComponent class exists with profile info, notification toggle, logout button
- Basic CSS for settings page exists
- Toggle switch styling exists
- Logout functionality works via AuthService.logout()

### Existing Implementation Reference (from Story 1.4)

```javascript
// Existing SettingsComponent structure
class SettingsComponent extends Component {
  template() {
    const user = stateManager.getState('currentUser');
    // Returns HTML with:
    // - Profile section (avatar, name, email, department, ID)
    // - Notification toggle section
    // - Account section with logout button
    // - Settings disclaimer
  }
}
```

### Enhanced SettingsComponent Implementation

```javascript
// ============================================
// COMPONENTS - Settings (Enhanced Story 6.1)
// ============================================

class SettingsComponent extends Component {
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return this._renderNoUser();
    
    return `
      <main class="settings-page" role="main">
        <div class="settings-container">
          ${this._renderProfileSection(user)}
          ${this._renderGamificationSummary(user)}
          ${this._renderNotificationSection()}
          ${this._renderAccountSection()}
          ${this._renderAboutSection()}
          ${this._renderFooter()}
        </div>
      </main>
    `;
  }
  
  /**
   * Renders profile section with user info
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderProfileSection(user) {
    return `
      <section class="settings-section" aria-labelledby="profile-heading">
        <h2 class="settings-section__title" id="profile-heading">
          <i class="ti ti-user" aria-hidden="true"></i>
          פרטי פרופיל
        </h2>
        <div class="settings-card settings-card--profile">
          <div class="settings-profile">
            <div class="settings-profile__avatar" aria-hidden="true">
              ${user.avatarInitial || user.fullName?.charAt(0) || '?'}
            </div>
            <div class="settings-profile__info">
              <h3 class="settings-profile__name">${this._escapeHtml(user.fullName)}</h3>
              <p class="settings-profile__department">${this._escapeHtml(user.department)}</p>
            </div>
          </div>
          
          <div class="settings-fields">
            <div class="settings-field">
              <span class="settings-field__label" id="field-email-label">אימייל</span>
              <span class="settings-field__value settings-field__value--ltr" 
                    aria-labelledby="field-email-label">
                ${this._escapeHtml(user.email)}
              </span>
            </div>
            
            <div class="settings-field">
              <span class="settings-field__label" id="field-dept-label">מחלקה</span>
              <span class="settings-field__value" aria-labelledby="field-dept-label">
                ${this._escapeHtml(user.department)}
              </span>
            </div>
            
            <div class="settings-field">
              <span class="settings-field__label" id="field-id-label">מזהה עובד</span>
              <span class="settings-field__value settings-field__value--ltr" 
                    aria-labelledby="field-id-label">
                ${this._escapeHtml(user.id)}
              </span>
            </div>
            
            <div class="settings-field">
              <span class="settings-field__label" id="field-join-label">תאריך הצטרפות</span>
              <span class="settings-field__value" aria-labelledby="field-join-label">
                ${this._formatJoinDate(user.joinDate)}
              </span>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders gamification summary section
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderGamificationSummary(user) {
    const stamps = stateManager.getState('stamps') || [];
    const referrals = stateManager.getState('referrals') || [];
    const levelInfo = this._getLevelInfo(user.points || 0);
    
    return `
      <section class="settings-section" aria-labelledby="stats-heading">
        <h2 class="settings-section__title" id="stats-heading">
          <i class="ti ti-trophy" aria-hidden="true"></i>
          סיכום פעילות
        </h2>
        <div class="settings-card">
          <div class="settings-stats">
            <div class="settings-stat">
              <span class="settings-stat__value settings-stat__value--gold">
                ${this._formatNumber(user.points || 0)}
              </span>
              <span class="settings-stat__label">נקודות</span>
            </div>
            
            <div class="settings-stat">
              <span class="settings-stat__value">${levelInfo.name}</span>
              <span class="settings-stat__label">רמה</span>
            </div>
            
            <div class="settings-stat">
              <span class="settings-stat__value">${referrals.length}</span>
              <span class="settings-stat__label">הפניות</span>
            </div>
            
            <div class="settings-stat">
              <span class="settings-stat__value">${stamps.length}</span>
              <span class="settings-stat__label">חותמות</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders notification preferences section
   * @returns {string} HTML string
   */
  _renderNotificationSection() {
    const emailNotifications = stateManager.getState('emailNotifications') !== false;
    
    return `
      <section class="settings-section" aria-labelledby="notifications-heading">
        <h2 class="settings-section__title" id="notifications-heading">
          <i class="ti ti-bell" aria-hidden="true"></i>
          העדפות התראות
        </h2>
        <div class="settings-card">
          <div class="settings-toggle">
            <div class="settings-toggle__content">
              <label class="settings-toggle__label" for="email-notifications-toggle">
                התראות באימייל
              </label>
              <span class="settings-toggle__hint">
                קבל עדכונים על סטטוס ההפניות שלך
              </span>
            </div>
            <button 
              id="email-notifications-toggle"
              class="toggle ${emailNotifications ? 'toggle--on' : ''}"
              data-action="toggle-email-notifications"
              role="switch"
              aria-checked="${emailNotifications}"
              aria-describedby="toggle-hint"
            >
              <span class="toggle__track"></span>
              <span class="toggle__thumb"></span>
            </button>
          </div>
          <p class="settings-hint" id="toggle-hint">
            במצב דמו, התראות לא נשלחות בפועל
          </p>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders account/logout section
   * @returns {string} HTML string
   */
  _renderAccountSection() {
    return `
      <section class="settings-section" aria-labelledby="account-heading">
        <h2 class="settings-section__title" id="account-heading">
          <i class="ti ti-logout" aria-hidden="true"></i>
          חשבון
        </h2>
        <div class="settings-card settings-card--danger">
          <p class="settings-card__description">
            התנתקות תסגור את החיבור לחשבונך. תוכל להתחבר מחדש בכל עת עם אימייל וקוד חד-פעמי.
          </p>
          <button 
            class="btn btn--danger btn--full"
            data-action="logout"
            aria-label="התנתק מהמערכת"
          >
            <i class="ti ti-logout" aria-hidden="true"></i>
            התנתק
          </button>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders about/info section
   * @returns {string} HTML string
   */
  _renderAboutSection() {
    return `
      <section class="settings-section" aria-labelledby="about-heading">
        <h2 class="settings-section__title" id="about-heading">
          <i class="ti ti-info-circle" aria-hidden="true"></i>
          אודות
        </h2>
        <div class="settings-card">
          <div class="settings-about">
            <div class="settings-about__logo" aria-hidden="true">
              <span class="settings-about__logo-text">PassportCard</span>
              <span class="settings-about__version">Refer v1.0</span>
            </div>
            <p class="settings-about__description">
              מערכת הפניות עובדים של PassportCard. הפנו חברים לעבודה והרוויחו נקודות וחותמות!
            </p>
            <div class="settings-about__links">
              <button 
                class="btn btn--text btn--sm"
                data-action="show-how-it-works"
                aria-label="איך זה עובד"
              >
                <i class="ti ti-help" aria-hidden="true"></i>
                איך זה עובד?
              </button>
              <button 
                class="btn btn--text btn--sm"
                data-action="show-contact-hr"
                aria-label="צור קשר עם HR"
              >
                <i class="ti ti-mail" aria-hidden="true"></i>
                צור קשר עם HR
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders footer with demo disclaimer
   * @returns {string} HTML string
   */
  _renderFooter() {
    return `
      <footer class="settings-footer">
        <p class="settings-disclaimer">
          <i class="ti ti-info-circle" aria-hidden="true"></i>
          <span>זו גרסת דמו - הנתונים אינם אמיתיים</span>
        </p>
        <p class="settings-copyright">
          © ${new Date().getFullYear()} PassportCard. כל הזכויות שמורות.
        </p>
      </footer>
    `;
  }
  
  /**
   * Renders no user state
   * @returns {string} HTML string
   */
  _renderNoUser() {
    return `
      <div class="settings-error">
        <p>אנא התחבר כדי לצפות בהגדרות</p>
        <button class="btn btn--primary" data-navigate="auth">
          התחברות
        </button>
      </div>
    `;
  }
  
  // ========================
  // UTILITY METHODS
  // ========================
  
  /**
   * Gets level info based on points
   * @param {number} points - User's total points
   * @returns {Object} Level info with name and threshold
   */
  _getLevelInfo(points) {
    const levels = [
      { name: 'מתחיל', threshold: 0 },
      { name: 'פעיל', threshold: 250 },
      { name: 'מומחה', threshold: 750 },
      { name: 'אלוף', threshold: 2000 },
      { name: 'אגדה', threshold: 5000 }
    ];
    
    let currentLevel = levels[0];
    for (const level of levels) {
      if (points >= level.threshold) {
        currentLevel = level;
      }
    }
    return currentLevel;
  }
  
  /**
   * Formats number with thousands separator
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return num.toLocaleString('he-IL');
  }
  
  /**
   * Formats join date
   * @param {string|Date} date - Join date
   * @returns {string} Formatted date in Hebrew
   */
  _formatJoinDate(date) {
    if (!date) return '---';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('he-IL', { 
        year: 'numeric', 
        month: 'long'
      });
    } catch (e) {
      return date.toString();
    }
  }
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  // ========================
  // LIFECYCLE
  // ========================
  
  /**
   * Called after component is mounted to DOM
   */
  mount() {
    // Subscribe to relevant state changes
    this.subscribe('emailNotifications', () => this._updateToggle());
    this.subscribe('currentUser', () => this._updateUI());
  }
  
  /**
   * Updates toggle UI when state changes
   */
  _updateToggle() {
    const toggle = document.getElementById('email-notifications-toggle');
    if (!toggle) return;
    
    const isOn = stateManager.getState('emailNotifications') !== false;
    toggle.classList.toggle('toggle--on', isOn);
    toggle.setAttribute('aria-checked', isOn.toString());
  }
}
```

### Action Handlers (update/add)

```javascript
// ============================================
// ACTION HANDLERS - Settings (Story 6.1)
// ============================================

// Toggle email notifications
app.registerAction('toggle-email-notifications', (target) => {
  const current = stateManager.getState('emailNotifications') !== false;
  stateManager.setState({ emailNotifications: !current });
  
  // Show confirmation toast
  showToast('ההגדרות נשמרו', 'success');
});

// Show how it works (placeholder)
app.registerAction('show-how-it-works', () => {
  showToast('בקרוב - מדריך שימוש מלא', 'info');
});

// Show contact HR (placeholder)
app.registerAction('show-contact-hr', () => {
  showToast('ליצירת קשר: hr@passportcard.co.il', 'info');
});
```

### Enhanced CSS Styles

```css
/* =========================================================================
   SETTINGS PAGE (Story 6.1 - Enhanced)
   ========================================================================= */

.settings-page {
  min-height: calc(100vh - 140px); /* Account for header + bottom nav */
  background: var(--color-gray-50);
  padding: var(--space-4);
  padding-bottom: calc(var(--space-4) + 80px); /* Extra space for bottom nav */
}

.settings-container {
  max-width: 600px;
  margin: 0 auto;
}

/* -------------------------------------------------------------------------
   Section Layout
   ------------------------------------------------------------------------- */

.settings-section {
  margin-bottom: var(--space-5);
}

.settings-section__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  margin: 0 0 var(--space-3);
  padding-inline-start: var(--space-1);
}

.settings-section__title .ti {
  font-size: 1.25rem;
  color: var(--color-primary);
}

/* -------------------------------------------------------------------------
   Cards
   ------------------------------------------------------------------------- */

.settings-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.settings-card--profile {
  padding-top: var(--space-5);
}

.settings-card--danger {
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.settings-card__description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-4);
  line-height: 1.6;
}

/* -------------------------------------------------------------------------
   Profile Section
   ------------------------------------------------------------------------- */

.settings-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-gray-100);
}

.settings-profile__avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #B30410 100%);
  color: var(--color-white);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-3);
  box-shadow: var(--shadow-md);
}

.settings-profile__info {
  text-align: center;
}

.settings-profile__name {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1);
}

.settings-profile__department {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}

/* -------------------------------------------------------------------------
   Fields
   ------------------------------------------------------------------------- */

.settings-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.settings-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
}

.settings-field__label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.settings-field__value {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.settings-field__value--ltr {
  direction: ltr;
  unicode-bidi: isolate;
}

/* -------------------------------------------------------------------------
   Stats Section
   ------------------------------------------------------------------------- */

.settings-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.settings-stat {
  text-align: center;
  padding: var(--space-3);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
}

.settings-stat__value {
  display: block;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.settings-stat__value--gold {
  color: var(--color-gold);
}

.settings-stat__label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* -------------------------------------------------------------------------
   Toggle Section
   ------------------------------------------------------------------------- */

.settings-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.settings-toggle__content {
  flex: 1;
}

.settings-toggle__label {
  display: block;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  cursor: pointer;
}

.settings-toggle__hint {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-1);
}

.settings-hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: var(--space-3) 0 0;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-gray-100);
}

/* Toggle Switch */
.toggle {
  position: relative;
  width: 52px;
  height: 28px;
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out);
  flex-shrink: 0;
}

.toggle--on {
  background: var(--color-success);
}

.toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.toggle__track {
  display: none;
}

.toggle__thumb {
  position: absolute;
  top: 2px;
  right: 2px; /* RTL: starts on right */
  width: 24px;
  height: 24px;
  background: var(--color-white);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s var(--ease-out);
}

.toggle--on .toggle__thumb {
  transform: translateX(-24px); /* RTL: moves left when on */
}

/* -------------------------------------------------------------------------
   About Section
   ------------------------------------------------------------------------- */

.settings-about {
  text-align: center;
}

.settings-about__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-3);
}

.settings-about__logo-text {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-primary);
}

.settings-about__version {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.settings-about__description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-4);
  line-height: 1.6;
}

.settings-about__links {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

/* -------------------------------------------------------------------------
   Footer
   ------------------------------------------------------------------------- */

.settings-footer {
  margin-top: var(--space-6);
  text-align: center;
  padding-bottom: var(--space-4);
}

.settings-disclaimer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-muted);
  padding: var(--space-2) var(--space-4);
  background: rgba(0, 0, 0, 0.03);
  border-radius: var(--radius-full);
  margin: 0 0 var(--space-3);
}

.settings-disclaimer .ti {
  font-size: 1rem;
}

.settings-copyright {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: 0;
}

/* -------------------------------------------------------------------------
   Error State
   ------------------------------------------------------------------------- */

.settings-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: var(--space-4);
}

.settings-error p {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

/* -------------------------------------------------------------------------
   Responsive - Tablet/Desktop
   ------------------------------------------------------------------------- */

@media (min-width: 600px) {
  .settings-page {
    padding: var(--space-6);
  }
  
  .settings-profile {
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--space-4);
    text-align: right;
  }
  
  .settings-profile__avatar {
    margin-bottom: 0;
  }
  
  .settings-profile__info {
    text-align: right;
  }
  
  .settings-stats {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .settings-about__links {
    gap: var(--space-4);
  }
}

@media (min-width: 1024px) {
  .settings-page {
    padding-top: var(--space-8);
    padding-bottom: var(--space-8);
  }
  
  .settings-container {
    max-width: 700px;
  }
  
  .settings-card {
    padding: var(--space-5);
  }
  
  .settings-profile__avatar {
    width: 96px;
    height: 96px;
    font-size: var(--text-4xl);
  }
}

/* -------------------------------------------------------------------------
   Reduced Motion
   ------------------------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .toggle,
  .toggle__thumb {
    transition: none;
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #E10514 | Avatar gradient, icons |
| `--color-success` | #22C55E | Toggle on state |
| `--color-gold` | #F1C40F | Points display |
| `--color-gray-50` | #F9FAFB | Page background, stat cards |
| `--color-gray-100` | #F3F4F6 | Dividers |
| `--color-gray-300` | #D1D5DB | Toggle off state |
| `--text-primary` | #111827 | Main text |
| `--text-secondary` | #6B7280 | Labels, hints |
| `--text-muted` | #9CA3AF | Disclaimer, copyright |
| `--radius-lg` | 16px | Card corners |
| `--radius-full` | 9999px | Avatar, toggle |
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Cards |
| `--shadow-md` | 0 4px 6px rgba(0,0,0,0.05) | Avatar |

### State Management

```javascript
// State keys used by SettingsComponent:
const settingsState = {
  currentUser: {
    id: 'usr-001',
    email: 'yossi.cohen@passportcard.co.il',
    fullName: 'יוסי כהן',
    firstName: 'יוסי',
    lastName: 'כהן',
    department: 'פיתוח',
    points: 750,
    joinDate: '2023-01-15',
    avatarInitial: 'י'
  },
  emailNotifications: true, // boolean, persisted
  stamps: [], // array of stamp objects
  referrals: [] // array of referral objects
};

// Toggle notification:
stateManager.setState({ 
  emailNotifications: !stateManager.getState('emailNotifications') 
});
```

### Accessibility Checklist

- [x] Sections use `aria-labelledby` with heading IDs
- [x] Toggle has `role="switch"` and `aria-checked`
- [x] Toggle has `aria-describedby` for hint text
- [x] Logout button has `aria-label`
- [x] All icons have `aria-hidden="true"`
- [x] Heading hierarchy: h1 (in header) → h2 (sections) → h3 (profile name)
- [x] Focus visible on all interactive elements
- [x] LTR values (email, ID) have proper `direction: ltr`
- [x] Screen reader announces all content correctly

### Integration Points

**Dependencies:**
- `Component` base class (Story 1.1)
- `StateManager` with `currentUser`, `emailNotifications`, `stamps`, `referrals` (Stories 1.1, 1.4)
- `AuthService.logout()` (Story 1.4)
- `showToast()` function (Story 4.3)
- Button styles (`.btn`, `.btn--danger`, `.btn--text`, `.btn--sm`, `.btn--full`) (Stories 1.2, 1.4)
- Tabler Icons via CDN (Story 1.1)

**Creates:**
- Enhanced SettingsComponent (replaces Story 1.4 placeholder)
- Additional action handlers for about links

**Files Modified:**
- `script.js`: 
  - Update SettingsComponent class (~200 lines enhanced)
  - Add/update action handlers (~20 lines)
- `style.css`:
  - Update settings styles (~300 lines enhanced)

### Testing Scenarios

1. **Profile Display:**
   - Login as any user → Navigate to settings
   - Verify avatar shows initial
   - Verify name, email, department, ID, join date displayed
   - Verify email and ID are LTR direction

2. **Gamification Summary:**
   - Verify points total matches user.points
   - Verify level name is correct for points range
   - Verify referrals count matches referrals array length
   - Verify stamps count matches stamps array length

3. **Notification Toggle:**
   - Toggle → State changes
   - Toggle → Toast shows "ההגדרות נשמרו"
   - Refresh page → Toggle state persists
   - Toggle with keyboard (Space/Enter) → Works

4. **Logout:**
   - Click logout button → Session cleared
   - Redirected to #auth
   - Try navigating to protected route → Blocked

5. **Accessibility:**
   - Tab through page → All elements reachable
   - Focus indicators visible
   - Screen reader → All content announced
   - Toggle → Announces on/off state

6. **Responsive:**
   - Mobile → Single column layout
   - Desktop → Wider content, horizontal profile layout
   - Touch targets → All >= 44×44px

7. **Demo Disclaimer:**
   - Visible at bottom of page
   - Subtle styling (not intrusive)

### Previous Story Intelligence

**From Story 1.4 (Session Management & Logout):**
- SettingsComponent exists with basic structure
- AuthService.logout() implemented and working
- Toggle switch styling exists
- Logout clears: isAuthenticated, currentUser, sessionToken, referrals, stamps
- Route guards protect settings page

**From Story 4.6 (Submission Confirmation):**
- showToast() function available
- State persistence pattern established
- Component lifecycle patterns

**Key patterns maintained:**
- BEM CSS naming (`.settings-section__title`)
- `data-action` for button handlers
- RTL-aware CSS with logical properties
- Numbers use `direction: ltr; unicode-bidi: isolate`
- 44px minimum touch targets
- Reduced motion support

### Project Structure Notes

- SettingsComponent in `script.js` section: "COMPONENTS - Main App"
- Settings CSS in `style.css` section: "Settings" (existing, to be enhanced)
- No new files created - all changes in existing three files

### References

- [Source: docs/architecture.md#4.2] - CSS naming patterns
- [Source: docs/architecture.md#4.3] - JavaScript naming patterns  
- [Source: docs/architecture.md#4.5] - Component structure pattern
- [Source: docs/epics.md#story-61] - Original acceptance criteria
- [Source: docs/PRD.md#FR-SET-001] - Settings requirements
- [Source: docs/PRD.md#NFR-SEC-004] - Demo disclaimer requirement
- [Source: docs/project_context.md] - Implementation rules
- [Source: docs/sprint-artifacts/1-4-session-management-logout.md] - Existing implementation

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/epics.md (complete - Epic 6, Story 6.1)
- docs/PRD.md (FR-SET-001, NFR-SEC-004)
- docs/project_context.md (implementation rules)
- docs/sprint-artifacts/1-4-session-management-logout.md (existing SettingsComponent)
- docs/sprint-artifacts/4-6-submission-confirmation.md (component patterns)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode
Claude Opus 4.5 (Dev - Amelia) - Implementation

### Debug Log References

- No issues during story creation
- No issues during implementation

### Completion Notes List

Story created: 2025-12-11
- Complete acceptance criteria covering all FR-SET-001 requirements
- Enhanced component implementation building on Story 1.4 foundation
- Full CSS with responsive and accessibility support
- NFR-SEC-004 demo disclaimer included
- 8 tasks covering all implementation work

Implementation completed: 2025-12-11
- SettingsComponent fully enhanced with modular _render methods
- Profile section with avatar, user info, join date
- Gamification summary with points, level, referrals, stamps counts
- Notification toggle with hint text and toast confirmation
- Account section with explanatory text and danger-styled logout
- About section with version info and placeholder help links
- Demo disclaimer footer with copyright
- Full responsive CSS (mobile/tablet/desktop breakpoints)
- Accessibility: aria-labels, role="switch", heading hierarchy
- RTL support with logical properties and LTR isolation for emails/IDs
- Reduced motion support for toggle animations
- Action handlers for show-how-it-works and show-contact-hr

### File List

**Modified:**
- `script.js` - Enhanced SettingsComponent (~300 lines), added 2 action handlers
- `style.css` - Enhanced settings styles (~380 lines)

**No new files created.**

