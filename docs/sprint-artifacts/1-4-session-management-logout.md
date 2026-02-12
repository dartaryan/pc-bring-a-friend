# Story 1.4: Session Management & Logout

**Status:** Ready for Review

## Story

**As an** employee,
**I want** my session to persist across page refreshes and browser sessions,
**So that** I don't have to log in every time I open the app.

## Acceptance Criteria

### AC1: Session Persistence on Page Refresh
**Given** I have successfully logged in
**When** I refresh the page
**Then** I remain logged in
**And** I am taken to `#dashboard` (or last route)
**And** my user data is loaded from LocalStorage
**And** my points, level, and profile information are restored

### AC2: Session Persistence on Browser Close/Reopen
**Given** I am logged in
**When** I close the browser and reopen the app
**Then** my session persists (until explicit logout)
**And** my user profile, points, stamps, referrals are restored
**And** I am navigated to the authenticated default route (`#dashboard`)

### AC3: Session Restoration on Load
**Given** valid session data exists in LocalStorage
**When** the app loads
**Then** `StateManager.loadState()` is called during initialization
**And** persisted state keys are restored (isAuthenticated, currentUser, sessionToken, referrals, stamps)
**And** the Router navigates to appropriate route based on auth state

### AC4: Corrupted/Invalid Session Handling
**Given** the session data in LocalStorage is corrupted or invalid
**When** the app loads
**Then** the app gracefully handles the error (try-catch)
**And** LocalStorage is cleared of invalid data
**And** State is reset to initial values
**And** I am redirected to `#auth` to log in again
**And** No console errors are thrown to the user

### AC5: Expired/Missing Session Token
**Given** session data exists but `sessionToken` is missing or null
**When** the app loads
**Then** the session is treated as invalid
**And** `isAuthenticated` is set to `false`
**And** I am redirected to `#auth`

### AC6: Logout from User Menu
**Given** I am logged in
**When** I click "התנתק" (Logout) from the user dropdown menu in the header
**Then** all session data is cleared from LocalStorage
**And** StateManager is reset to initial state
**And** I am redirected to `#auth` login screen
**And** a brief success toast "התנתקת בהצלחה" is shown (optional)

### AC7: Logout Button in Settings
**Given** I am logged in and on the Settings page
**When** I click "התנתק" (Logout) button
**Then** the logout flow executes (same as AC6)
**And** all session data is cleared
**And** I am redirected to `#auth`

### AC8: Post-Logout State Cleanup
**Given** I have just logged out
**When** I inspect the application state
**Then** `isAuthenticated` is `false`
**And** `currentUser` is `null`
**And** `sessionToken` is `null`
**And** `referrals` array is empty
**And** `stamps` array is empty
**And** `pendingEmail` is `null`
**And** LocalStorage key `passportcard_refer_state` is cleared

### AC9: Protected Route Guard
**Given** I am not authenticated (or session expired)
**When** I try to navigate to a protected route (dashboard, passport, positions, referrals, settings)
**Then** I am redirected to `#auth` instead
**And** the original route is not rendered

### AC10: Auth Route Guard (Reverse)
**Given** I am authenticated
**When** I try to navigate to `#auth`
**Then** I am redirected to `#dashboard` instead
**And** the login form is not shown

## Tasks / Subtasks

- [x] Task 1: Enhance StateManager session persistence (AC: #1, #2, #3)
  - [x] Verify `_loadState()` correctly restores all `PERSIST_KEYS`
  - [x] Add validation for loaded state structure
  - [x] Handle JSON parse errors gracefully
  - [x] Ensure `_persistState()` is called on every `setState()`

- [x] Task 2: Add session validation on app load (AC: #4, #5)
  - [x] Create `_validateSession()` method in StateManager
  - [x] Check for required fields: `isAuthenticated`, `currentUser`, `sessionToken`
  - [x] Validate `currentUser` has required properties (id, email, fullName)
  - [x] Clear state and redirect if validation fails

- [x] Task 3: Create AuthService with logout method (AC: #6, #7, #8)
  - [x] Create `AuthService` class if not exists
  - [x] Implement `logout()` method
  - [x] Clear LocalStorage
  - [x] Reset StateManager to initial state
  - [x] Trigger navigation to `#auth`
  - [x] Show logout toast notification (optional)

- [x] Task 4: Add logout UI to Header component (AC: #6)
  - [x] Create HeaderComponent with user dropdown
  - [x] Add user avatar/initial display
  - [x] Add dropdown with "התנתק" option
  - [x] Wire up `data-action="logout"` handler

- [x] Task 5: Add logout button to Settings screen (AC: #7)
  - [x] Create SettingsComponent placeholder
  - [x] Add "התנתק" button with danger styling
  - [x] Wire up logout action

- [x] Task 6: Implement route guards in Router (AC: #9, #10)
  - [x] Add `_checkAuth()` method to Router
  - [x] Before navigating, check route's `requiresAuth` flag
  - [x] Redirect unauthenticated users to `#auth`
  - [x] Redirect authenticated users away from `#auth`
  - [x] Ensure route guards run before component rendering

- [x] Task 7: Update App initialization (AC: #1, #3)
  - [x] Load state before initializing router
  - [x] Validate session before determining initial route
  - [x] Set up hashchange listener for route guards

- [x] Task 8: Add action handlers for logout (AC: #6, #7)
  - [x] Register `logout` action handler with App
  - [x] Ensure handler calls `AuthService.logout()`

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**StateManager Session Validation:**
```javascript
// Add to StateManager class
_validateSession() {
  const state = this._state;
  
  // Check if marked as authenticated
  if (!state.isAuthenticated) {
    return false;
  }
  
  // Validate session token exists
  if (!state.sessionToken) {
    console.warn('Session validation failed: missing sessionToken');
    return false;
  }
  
  // Validate user object structure
  if (!state.currentUser || 
      !state.currentUser.id || 
      !state.currentUser.email || 
      !state.currentUser.fullName) {
    console.warn('Session validation failed: invalid user object');
    return false;
  }
  
  return true;
}

// Enhanced _loadState with validation
_loadState() {
  try {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!saved) return;
    
    const parsed = JSON.parse(saved);
    
    // Only restore persisted keys
    CONFIG.PERSIST_KEYS.forEach(key => {
      if (parsed.hasOwnProperty(key)) {
        this._state[key] = parsed[key];
      }
    });
    
    // Validate the restored session
    if (!this._validateSession()) {
      this._clearSession();
    }
    
  } catch (error) {
    console.warn('Failed to load state, clearing session:', error);
    this._clearSession();
  }
}

_clearSession() {
  // Reset auth-related state
  this._state.isAuthenticated = false;
  this._state.currentUser = null;
  this._state.sessionToken = null;
  this._state.referrals = [];
  this._state.stamps = [];
  
  // Clear localStorage
  localStorage.removeItem(CONFIG.STORAGE_KEY);
}
```

**AuthService Class:**
```javascript
class AuthService {
  /**
   * Clears all session data and redirects to login
   */
  static logout() {
    // Clear state
    stateManager.setState({
      isAuthenticated: false,
      currentUser: null,
      sessionToken: null,
      referrals: [],
      stamps: [],
      pendingEmail: null,
      activeModal: null
    });
    
    // Clear localStorage
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    
    // Show logout toast (optional)
    app.showToast('התנתקת בהצלחה', 'success');
    
    // Navigate to auth
    router.navigate('auth');
  }
  
  /**
   * Checks if current session is valid
   * @returns {boolean}
   */
  static isAuthenticated() {
    return stateManager.getState('isAuthenticated') === true && 
           stateManager.getState('sessionToken') !== null;
  }
}
```

**Router Route Guards:**
```javascript
// Add to Router class
_checkAuth(routeName) {
  const routeConfig = CONFIG.ROUTES[routeName];
  const isAuthenticated = stateManager.getState('isAuthenticated');
  
  // Protected route accessed without auth
  if (routeConfig && routeConfig.requiresAuth && !isAuthenticated) {
    console.log(`Route guard: redirecting unauthenticated user from ${routeName} to auth`);
    return 'auth';
  }
  
  // Auth route accessed while authenticated
  if (routeName === 'auth' && isAuthenticated) {
    console.log('Route guard: redirecting authenticated user from auth to dashboard');
    return CONFIG.AUTH_DEFAULT_ROUTE;
  }
  
  return routeName; // No redirect needed
}

// Update navigate method
navigate(routeName, params = {}) {
  // Apply route guards
  const targetRoute = this._checkAuth(routeName);
  
  if (targetRoute !== routeName) {
    // Route was redirected by guard
    this.navigate(targetRoute, params);
    return;
  }
  
  // Continue with normal navigation...
  const prevView = stateManager.getState('currentView');
  stateManager.setState({
    currentView: routeName,
    previousView: prevView
  });
  
  // Update URL hash
  window.location.hash = routeName;
  
  // Render the route component
  this._renderRoute(routeName);
}
```

**HeaderComponent with User Menu:**
```javascript
class HeaderComponent extends Component {
  constructor() {
    super();
    this._menuOpen = false;
  }
  
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return '';
    
    return `
      <header class="header">
        <div class="header__logo" data-navigate="dashboard">
          <img src="assets/logo-white.svg" alt="PassportCard" class="header__logo-img" onerror="this.style.display='none'">
          <span class="header__logo-text">PassportCard Refer</span>
        </div>
        
        <h1 class="header__title">${this._getPageTitle()}</h1>
        
        <div class="header__user">
          <button 
            class="header__user-btn" 
            data-action="toggle-user-menu"
            aria-expanded="${this._menuOpen}"
            aria-haspopup="true"
          >
            <span class="header__avatar">${user.avatarInitial || user.fullName[0]}</span>
            <i class="ti ti-chevron-down"></i>
          </button>
          
          ${this._menuOpen ? `
            <div class="header__dropdown" role="menu">
              <div class="header__dropdown-info">
                <span class="header__dropdown-name">${user.fullName}</span>
                <span class="header__dropdown-email">${user.email}</span>
              </div>
              <hr class="header__dropdown-divider">
              <button 
                class="header__dropdown-item header__dropdown-item--danger" 
                data-action="logout"
                role="menuitem"
              >
                <i class="ti ti-logout"></i>
                התנתק
              </button>
            </div>
          ` : ''}
        </div>
      </header>
    `;
  }
  
  _getPageTitle() {
    const titles = {
      dashboard: 'דשבורד',
      passport: 'הדרכון שלי',
      positions: 'משרות פתוחות',
      referrals: 'ההפניות שלי',
      settings: 'הגדרות'
    };
    return titles[stateManager.getState('currentView')] || '';
  }
  
  mount() {
    // Close dropdown when clicking outside
    this._boundClickHandler = this._handleOutsideClick.bind(this);
    document.addEventListener('click', this._boundClickHandler);
  }
  
  unmount() {
    super.unmount();
    document.removeEventListener('click', this._boundClickHandler);
  }
  
  _handleOutsideClick(e) {
    if (this._menuOpen && !e.target.closest('.header__user')) {
      this._menuOpen = false;
      this._updateUI();
    }
  }
  
  toggleMenu() {
    this._menuOpen = !this._menuOpen;
    this._updateUI();
  }
}
```

**Header CSS Styles:**
```css
/* Header - Add to §9 Navigation section in style.css */

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 60px;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  z-index: var(--z-header);
}

.header__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.header__logo-img {
  height: 28px;
  width: auto;
}

.header__logo-text {
  font-weight: var(--font-bold);
  font-size: var(--text-base);
}

.header__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header__user {
  position: relative;
}

.header__user-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: var(--radius-full);
  padding: var(--space-1) var(--space-3) var(--space-1) var(--space-1);
  color: var(--color-white);
  cursor: pointer;
  transition: background-color 0.2s;
}

.header__user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header__avatar {
  width: 32px;
  height: 32px;
  background: var(--color-white);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
}

.header__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: var(--space-2);
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  overflow: hidden;
  animation: fadeIn 0.15s ease;
}

.header__dropdown-info {
  padding: var(--space-3) var(--space-4);
  background: var(--color-gray-50);
}

.header__dropdown-name {
  display: block;
  font-weight: var(--font-semibold);
  color: var(--color-gray-900);
}

.header__dropdown-email {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  direction: ltr;
  unicode-bidi: isolate;
}

.header__dropdown-divider {
  border: none;
  border-top: 1px solid var(--color-gray-200);
  margin: 0;
}

.header__dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: none;
  background: none;
  color: var(--color-gray-700);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background-color 0.15s;
}

.header__dropdown-item:hover {
  background: var(--color-gray-100);
}

.header__dropdown-item--danger {
  color: var(--color-error);
}

.header__dropdown-item--danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Desktop: show logo text */
@media (min-width: 1024px) {
  .header {
    padding: 0 var(--space-6);
  }
}

/* Mobile: hide logo text, show just logo */
@media (max-width: 599px) {
  .header__logo-text {
    display: none;
  }
  
  .header__title {
    font-size: var(--text-base);
  }
}
```

**SettingsComponent with Logout:**
```javascript
class SettingsComponent extends Component {
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return '';
    
    return `
      <div class="settings-page">
        <section class="settings-section">
          <h2 class="settings-section__title">
            <i class="ti ti-user"></i>
            פרטי פרופיל
          </h2>
          <div class="settings-card">
            <div class="settings-card__avatar">
              ${user.avatarInitial || user.fullName[0]}
            </div>
            <div class="settings-card__info">
              <div class="settings-field">
                <label class="settings-field__label">שם מלא</label>
                <div class="settings-field__value">${user.fullName}</div>
              </div>
              <div class="settings-field">
                <label class="settings-field__label">אימייל</label>
                <div class="settings-field__value" dir="ltr">${user.email}</div>
              </div>
              <div class="settings-field">
                <label class="settings-field__label">מחלקה</label>
                <div class="settings-field__value">${user.department}</div>
              </div>
              <div class="settings-field">
                <label class="settings-field__label">מזהה עובד</label>
                <div class="settings-field__value" dir="ltr">${user.id}</div>
              </div>
            </div>
          </div>
        </section>
        
        <section class="settings-section">
          <h2 class="settings-section__title">
            <i class="ti ti-bell"></i>
            העדפות התראות
          </h2>
          <div class="settings-card">
            <div class="settings-toggle">
              <label class="settings-toggle__label">
                <span>התראות באימייל</span>
                <span class="settings-toggle__hint">קבל עדכונים על סטטוס הפניות</span>
              </label>
              <button 
                class="toggle ${stateManager.getState('emailNotifications') !== false ? 'toggle--on' : ''}"
                data-action="toggle-notifications"
                role="switch"
                aria-checked="${stateManager.getState('emailNotifications') !== false}"
              >
                <span class="toggle__track"></span>
                <span class="toggle__thumb"></span>
              </button>
            </div>
          </div>
        </section>
        
        <section class="settings-section">
          <h2 class="settings-section__title">
            <i class="ti ti-logout"></i>
            חשבון
          </h2>
          <div class="settings-card settings-card--danger">
            <p class="settings-card__text">
              התנתקות תסגור את החיבור לחשבונך. תוכל להתחבר מחדש בכל עת.
            </p>
            <button 
              class="btn btn--danger btn--full"
              data-action="logout"
            >
              <i class="ti ti-logout"></i>
              התנתק
            </button>
          </div>
        </section>
        
        <footer class="settings-footer">
          <p class="settings-disclaimer">
            <i class="ti ti-info-circle"></i>
            זו גרסת דמו - הנתונים אינם אמיתיים
          </p>
        </footer>
      </div>
    `;
  }
}
```

**Settings CSS:**
```css
/* Settings - Add to new §18 Settings section in style.css */

.settings-page {
  padding: var(--space-4);
  max-width: 600px;
  margin: 0 auto;
}

.settings-section {
  margin-bottom: var(--space-6);
}

.settings-section__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-gray-900);
  margin-bottom: var(--space-3);
}

.settings-section__title i {
  color: var(--color-primary);
}

.settings-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.settings-card--danger {
  border: 1px solid var(--color-error);
  border-color: rgba(239, 68, 68, 0.2);
}

.settings-card__avatar {
  width: 64px;
  height: 64px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
}

.settings-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.settings-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.settings-field__label {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
}

.settings-field__value {
  font-size: var(--text-base);
  color: var(--color-gray-900);
}

.settings-card__text {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  margin-bottom: var(--space-4);
}

.settings-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.settings-toggle__label {
  display: flex;
  flex-direction: column;
}

.settings-toggle__hint {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
}

/* Toggle switch */
.toggle {
  position: relative;
  width: 48px;
  height: 28px;
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle--on {
  background: var(--color-primary);
}

.toggle__track {
  display: none;
}

.toggle__thumb {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 24px;
  height: 24px;
  background: var(--color-white);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;
}

.toggle--on .toggle__thumb {
  transform: translateX(-20px);
}

.settings-footer {
  margin-top: var(--space-8);
  text-align: center;
}

.settings-disclaimer {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-gray-400);
  padding: var(--space-2) var(--space-4);
  background: var(--color-gray-50);
  border-radius: var(--radius-full);
}

/* Danger button */
.btn--danger {
  background: var(--color-error);
  color: var(--color-white);
}

.btn--danger:hover {
  background: #DC2626;
}
```

**App Initialization with Session Check:**
```javascript
// In App class init() method
init() {
  // Load persisted state first
  stateManager._loadState();
  
  // Validate session before setting up router
  if (stateManager.getState('isAuthenticated')) {
    if (!stateManager._validateSession()) {
      console.log('Invalid session detected, clearing...');
      stateManager._clearSession();
    }
  }
  
  // Set up event delegation
  this._setupEventDelegation();
  
  // Initialize router
  this._initRouter();
  
  // Register action handlers
  this._registerActions();
  
  // Render initial route with guards
  const hash = window.location.hash.slice(1) || 'auth';
  router.navigate(hash);
}

_registerActions() {
  // ... other actions ...
  
  this.registerAction('logout', () => {
    AuthService.logout();
  });
  
  this.registerAction('toggle-user-menu', (target) => {
    const header = this._getComponentInstance('HeaderComponent');
    if (header) {
      header.toggleMenu();
    }
  });
  
  this.registerAction('toggle-notifications', (target) => {
    const current = stateManager.getState('emailNotifications') !== false;
    stateManager.setState({ emailNotifications: !current });
    this.showToast('ההגדרות נשמרו', 'success');
  });
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #E10514 | Header background, avatar bg |
| `--color-error` | #EF4444 | Danger button, logout items |
| `--color-white` | #FFFFFF | Header text, button text |
| `--color-gray-900` | #111827 | User name, field values |
| `--color-gray-500` | #6B7280 | Labels, hints |
| `--color-gray-50` | #F9FAFB | Card backgrounds |
| `--z-header` | 100 | Header z-index |
| `--shadow-lg` | 0 10px 15px -3px rgba(0,0,0,0.1) | Dropdown shadow |

### Event Delegation Actions

This component uses the following `data-action` values:
- `logout` - Trigger logout flow (from header dropdown or settings)
- `toggle-user-menu` - Toggle header dropdown visibility
- `toggle-notifications` - Toggle email notifications preference

### State Management

```javascript
// Session check on load
const isValid = stateManager._validateSession();

// On logout
stateManager.setState({
  isAuthenticated: false,
  currentUser: null,
  sessionToken: null,
  referrals: [],
  stamps: [],
  pendingEmail: null,
  activeModal: null
});
localStorage.removeItem(CONFIG.STORAGE_KEY);

// Toggle notification preference
stateManager.setState({ 
  emailNotifications: !current 
});
```

### Route Guard Integration

The Router must check authentication state before rendering any route:

```javascript
// In Router.navigate()
navigate(routeName) {
  const targetRoute = this._checkAuth(routeName);
  if (targetRoute !== routeName) {
    this.navigate(targetRoute);
    return;
  }
  // ... continue with navigation
}

// In Router._handleHashChange()
_handleHashChange() {
  const hash = window.location.hash.slice(1) || 'auth';
  this.navigate(hash);
}
```

### Hashchange Listener Setup

```javascript
// In Router constructor or init
constructor() {
  this._setupHashListener();
}

_setupHashListener() {
  window.addEventListener('hashchange', () => {
    this._handleHashChange();
  });
}
```

### Testing Scenarios

1. **Fresh Load (no session):**
   - Navigate to any protected route → Redirected to `#auth`
   
2. **Valid Session:**
   - Refresh page → Stay logged in, restore state
   - Close browser, reopen → Stay logged in
   
3. **Corrupted Session:**
   - Manually edit localStorage to invalid JSON → Graceful recovery, redirect to login
   - Remove `currentUser` from localStorage → Session cleared, redirect to login
   
4. **Logout:**
   - Click logout → State cleared, redirect to `#auth`
   - Try to navigate back → Cannot access protected routes

### Accessibility Notes

- Header dropdown has `aria-expanded` and `aria-haspopup`
- Dropdown items have `role="menuitem"`
- Toggle switch has `role="switch"` and `aria-checked`
- Logout button in settings has clear visual indication (danger styling)
- All interactive elements are keyboard accessible

### Integration Points

**Dependencies:**
- `Component` base class (from Story 1.1)
- `StateManager` instance with `_loadState()`, `_persistState()` (from Story 1.1)
- `Router` class (from Story 1.1)
- `CONFIG` constants (from Story 1.1)
- User object created by OTPModalComponent (from Story 1.3)

**Creates:**
- `AuthService` class (new)
- `HeaderComponent` class (new - will be expanded in Story 1.5)
- `SettingsComponent` class (new - placeholder, full in Story 6.1)
- Route guards in Router

**Used By:**
- All protected screens (Dashboard, Passport, Positions, Referrals, Settings)
- Header component (displayed on all authenticated screens)

### Project Structure Notes

- `AuthService` class goes in `script.js` section: "SERVICES" (after DataService if exists)
- `HeaderComponent` goes in `script.js` section: "COMPONENTS - Shared"
- `SettingsComponent` goes in `script.js` section: "COMPONENTS - Main App"
- Header CSS goes in `style.css` section: "§9 Navigation"
- Settings CSS goes in `style.css` section: "§18 Settings" (new section)

### References

- [Source: docs/architecture.md#3.2-state-management] - StateManager with persistence
- [Source: docs/architecture.md#3.7-error-handling] - Silent degradation pattern
- [Source: docs/architecture.md#4.7-route-patterns] - Route configuration
- [Source: docs/PRD.md#6.1-authentication-flow] - FR-AUTH-003 Session Management
- [Source: docs/PRD.md#6.8-navigation-settings] - FR-NAV-002 Header, FR-SET-001 Settings
- [Source: docs/epics.md#story-14] - Original story definition

### Previous Story Learnings

From Story 1.1 (Project Setup):
- `StateManager` has `_loadState()` and `_persistState()` methods already implemented
- `CONFIG.PERSIST_KEYS` defines what to save to LocalStorage
- `CONFIG.STORAGE_KEY` is `'passportcard_refer_state'`
- App uses event delegation pattern with `data-action` attributes

From Story 1.2 (Email Login Form):
- Login sets `pendingEmail` state before OTP modal

From Story 1.3 (OTP Verification):
- Successful verification sets: `isAuthenticated: true`, `currentUser: {...}`, `sessionToken: "session_..."`
- User object structure: `{ id, email, firstName, lastName, fullName, department, points, level, joinDate, avatarInitial }`
- `pendingEmail` is cleared on successful auth

### Critical Implementation Notes

1. **Session validation MUST run before route rendering** - Otherwise protected content could flash before redirect

2. **LocalStorage clearing MUST use exact key** - `localStorage.removeItem(CONFIG.STORAGE_KEY)`

3. **Route guards MUST prevent loops** - Check to avoid infinite redirects between `auth` ↔ `dashboard`

4. **Header dropdown MUST close on outside click** - Use document click listener with proper cleanup

5. **Logout MUST clear ALL auth state** - Not just isAuthenticated, but also user, token, referrals, stamps

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete)
- script.js (current implementation)
- style.css (current implementation)
- docs/sprint-artifacts/1-3-otp-verification-modal.md (previous story)

### Agent Model Used

Claude Opus 4.5

### Debug Log References

No errors encountered during implementation.

### Completion Notes List

1. **Task 1**: Enhanced `_loadState()` with try-catch, added `_validateSession()` and `_clearSession()` methods to StateManager
2. **Task 2**: Session validation integrated into load process - invalid sessions are automatically cleared
3. **Task 3**: Created `AuthService` class with static `logout()` and `isAuthenticated()` methods. Added `showToast()` to App class
4. **Task 4**: Created `HeaderComponent` with user dropdown, avatar display, and logout menu item
5. **Task 5**: Created `SettingsComponent` with profile info, notification toggle, and danger-styled logout button
6. **Task 6**: Refactored Router with `_checkAuth()` method for cleaner route guard logic
7. **Task 7**: Updated initialization to validate session before app renders
8. **Task 8**: Registered action handlers for `logout`, `toggle-user-menu`, and `toggle-notifications`

### File List

Files modified:
- `script.js` - Added AuthService class, enhanced StateManager with _validateSession() and _clearSession(), added HeaderComponent, added SettingsComponent, refactored Router with _checkAuth(), added showToast() to App, updated initialization with action handlers (~300 new lines)
- `style.css` - Added header styles, settings page styles, toggle switch styles, toast notification styles (~200 new lines)

Files unchanged:
- `index.html` - No changes needed (toast-container already exists)

### Change Log

| Date | Change |
|------|--------|
| 2024-12-10 | Implemented session persistence validation (AC #1-5) |
| 2024-12-10 | Created AuthService with logout functionality (AC #6-8) |
| 2024-12-10 | Added HeaderComponent with user dropdown (AC #6) |
| 2024-12-10 | Added SettingsComponent with logout button (AC #7) |
| 2024-12-10 | Implemented route guards in Router (AC #9, #10) |
| 2024-12-10 | Registered all action handlers for logout flow |

