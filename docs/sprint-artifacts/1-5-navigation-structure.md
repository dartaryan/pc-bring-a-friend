# Story 1.5: Navigation Structure

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to navigate between different sections of the app using a consistent navigation interface,
**So that** I can access all features easily from any screen.

## Acceptance Criteria

### AC1: Mobile Bottom Navigation Bar (< 1024px)
**Given** I am logged in on a mobile device (< 1024px viewport)
**When** I view any authenticated screen
**Then** I see a bottom navigation bar with 5 items:
  - 📊 דשבורד (Dashboard)
  - 📕 הדרכון שלי (My Passport)
  - 💼 משרות (Positions)
  - 👥 ההפניות שלי (My Referrals)
  - ⚙️ הגדרות (Settings)
**And** the current route's nav item is highlighted with primary color
**And** touch targets are minimum 44×44px
**And** the bottom nav is fixed at the bottom of the screen

### AC2: Desktop Sidebar Navigation (≥ 1024px)
**Given** I am logged in on desktop (≥ 1024px viewport)
**When** I view any authenticated screen
**Then** I see a sidebar navigation on the right side (RTL) with the same 5 items
**And** the bottom nav is hidden
**And** each item shows icon + label
**And** the sidebar has PassportCard branding at the top
**And** the current route's nav item is highlighted

### AC3: Header Component
**Given** I am on any authenticated screen
**When** I view the header
**Then** I see the PassportCard logo (links to dashboard when clicked)
**And** I see the current page title in Hebrew
**And** I see my avatar/initial with dropdown menu
**And** the dropdown contains "התנתק" (Logout)
**And** the header is fixed at the top

### AC4: Route Navigation
**Given** I click a navigation item
**When** the route changes
**Then** the URL hash updates (e.g., `#dashboard`, `#passport`)
**And** the correct component renders in `#app`
**And** the previous component is properly unmounted
**And** the new route's nav item becomes highlighted
**And** the header title updates to match the current page

### AC5: Route Highlight Synchronization
**Given** I navigate to any authenticated route
**When** the page renders
**Then** the corresponding nav item is visually highlighted
**And** other nav items are in their default state
**And** highlight persists on page refresh

### AC6: Navigation on Unauthenticated State
**Given** I am not authenticated
**When** I am on the `#auth` route
**Then** the navigation bar is NOT displayed
**And** the header is NOT displayed
**And** only the login content is shown

### AC7: Responsive Transition
**Given** I resize the browser window
**When** I cross the 1024px breakpoint
**Then** the navigation smoothly transitions between bottom nav and sidebar
**And** no layout shift or jank occurs
**And** the current route highlight is preserved

### AC8: Navigation Accessibility
**Given** I use keyboard navigation
**When** I navigate using Tab/Arrow keys
**Then** I can reach all navigation items
**And** focus indicators are clearly visible
**And** all nav items have proper `aria-label` attributes
**And** the current page has `aria-current="page"` attribute

### AC9: Logo Navigation
**Given** I am on any authenticated screen (not dashboard)
**When** I click the PassportCard logo in the header
**Then** I am navigated to `#dashboard`
**And** the dashboard nav item becomes highlighted

## Tasks / Subtasks

- [x] Task 1: Create BottomNavComponent class (AC: #1, #4, #5, #8)
  - [x] Create `BottomNavComponent` class extending `Component`
  - [x] Implement `template()` with 5 nav items
  - [x] Add Tabler icons for each item
  - [x] Implement route highlight logic using `currentView` state
  - [x] Add `data-navigate` attributes for navigation
  - [x] Subscribe to `currentView` state changes

- [x] Task 2: Create SidebarNavComponent class (AC: #2, #4, #5, #8)
  - [x] Create `SidebarNavComponent` class extending `Component`
  - [x] Implement `template()` with branding + 5 nav items
  - [x] Add vertical layout with icons + labels
  - [x] Implement route highlight logic
  - [x] Add `data-navigate` attributes for navigation

- [x] Task 3: Enhance HeaderComponent (AC: #3, #9)
  - [x] Update existing `HeaderComponent` from Story 1.4
  - [x] Add `data-navigate="dashboard"` to logo
  - [x] Ensure page title updates based on `currentView`
  - [x] Keep user dropdown with logout functionality
  - [x] Add responsive adjustments for mobile

- [x] Task 4: Create NavigationManager class (AC: #4, #6, #7)
  - [x] Create `NavigationManager` to orchestrate nav components
  - [x] Show/hide navigation based on `isAuthenticated` state
  - [x] Render BottomNav or Sidebar based on viewport
  - [x] Handle viewport resize events
  - [x] Set up media query listener for responsive switching

- [x] Task 5: Add navigation CSS styles (AC: #1, #2, #7)
  - [x] Style `.bottom-nav` fixed at bottom
  - [x] Style `.bottom-nav__item` with 44px min touch target
  - [x] Style `.bottom-nav__item--active` highlight state
  - [x] Style `.sidebar-nav` fixed on right side (RTL)
  - [x] Style `.sidebar-nav__item--active` highlight state
  - [x] Add responsive media queries
  - [x] Ensure smooth transitions

- [x] Task 6: Update App layout structure (AC: #1, #2, #3)
  - [x] Add `.app-layout` container with proper spacing
  - [x] Account for fixed header height (60px)
  - [x] Account for fixed bottom nav height (60px) on mobile
  - [x] Account for sidebar width (240px) on desktop
  - [x] Ensure main content scrolls properly

- [x] Task 7: Wire up navigation actions (AC: #4, #9)
  - [x] Register `navigate` actions in App
  - [x] Handle `data-navigate` clicks through event delegation
  - [x] Trigger `router.navigate()` on nav item click
  - [x] Update `currentView` state on navigation

- [x] Task 8: Add accessibility attributes (AC: #8)
  - [x] Add `nav` role to navigation containers
  - [x] Add `aria-label` to navigation regions
  - [x] Add `aria-current="page"` to active items
  - [x] Ensure proper focus management
  - [x] Test keyboard navigation

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**BottomNavComponent Class:**
```javascript
class BottomNavComponent extends Component {
  constructor() {
    super();
    this._navItems = [
      { route: 'dashboard', icon: 'ti-chart-dots-2', label: 'דשבורד' },
      { route: 'passport', icon: 'ti-book', label: 'הדרכון שלי' },
      { route: 'positions', icon: 'ti-briefcase', label: 'משרות' },
      { route: 'referrals', icon: 'ti-users', label: 'ההפניות שלי' },
      { route: 'settings', icon: 'ti-settings', label: 'הגדרות' }
    ];
  }
  
  template() {
    const currentView = stateManager.getState('currentView');
    
    return `
      <nav class="bottom-nav" aria-label="ניווט ראשי">
        ${this._navItems.map(item => `
          <button 
            class="bottom-nav__item ${currentView === item.route ? 'bottom-nav__item--active' : ''}"
            data-navigate="${item.route}"
            aria-current="${currentView === item.route ? 'page' : 'false'}"
            aria-label="${item.label}"
          >
            <i class="ti ${item.icon} bottom-nav__icon"></i>
            <span class="bottom-nav__label">${item.label}</span>
          </button>
        `).join('')}
      </nav>
    `;
  }
  
  mount() {
    // Subscribe to route changes for re-render
    this.subscribe('currentView', () => {
      this._updateActiveState();
    });
  }
  
  _updateActiveState() {
    const currentView = stateManager.getState('currentView');
    const items = this.$$('.bottom-nav__item');
    
    items.forEach(item => {
      const route = item.dataset.navigate;
      const isActive = route === currentView;
      
      item.classList.toggle('bottom-nav__item--active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
}
```

**SidebarNavComponent Class:**
```javascript
class SidebarNavComponent extends Component {
  constructor() {
    super();
    this._navItems = [
      { route: 'dashboard', icon: 'ti-chart-dots-2', label: 'דשבורד' },
      { route: 'passport', icon: 'ti-book', label: 'הדרכון שלי' },
      { route: 'positions', icon: 'ti-briefcase', label: 'משרות' },
      { route: 'referrals', icon: 'ti-users', label: 'ההפניות שלי' },
      { route: 'settings', icon: 'ti-settings', label: 'הגדרות' }
    ];
  }
  
  template() {
    const currentView = stateManager.getState('currentView');
    const user = stateManager.getState('currentUser');
    
    return `
      <aside class="sidebar-nav" aria-label="ניווט ראשי">
        <div class="sidebar-nav__brand">
          <div class="sidebar-nav__logo" data-navigate="dashboard">
            <span class="sidebar-nav__logo-icon">✈️</span>
            <span class="sidebar-nav__logo-text">PassportCard Refer</span>
          </div>
        </div>
        
        <nav class="sidebar-nav__menu">
          ${this._navItems.map(item => `
            <button 
              class="sidebar-nav__item ${currentView === item.route ? 'sidebar-nav__item--active' : ''}"
              data-navigate="${item.route}"
              aria-current="${currentView === item.route ? 'page' : 'false'}"
            >
              <i class="ti ${item.icon} sidebar-nav__icon"></i>
              <span class="sidebar-nav__label">${item.label}</span>
            </button>
          `).join('')}
        </nav>
        
        ${user ? `
          <div class="sidebar-nav__user">
            <div class="sidebar-nav__user-avatar">${user.avatarInitial || user.fullName[0]}</div>
            <div class="sidebar-nav__user-info">
              <span class="sidebar-nav__user-name">${user.fullName}</span>
              <span class="sidebar-nav__user-dept">${user.department}</span>
            </div>
          </div>
        ` : ''}
      </aside>
    `;
  }
  
  mount() {
    this.subscribe('currentView', () => {
      this._updateActiveState();
    });
  }
  
  _updateActiveState() {
    const currentView = stateManager.getState('currentView');
    const items = this.$$('.sidebar-nav__item');
    
    items.forEach(item => {
      const route = item.dataset.navigate;
      const isActive = route === currentView;
      
      item.classList.toggle('sidebar-nav__item--active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
}
```

**NavigationManager Class:**
```javascript
class NavigationManager {
  constructor() {
    this._headerComponent = null;
    this._bottomNavComponent = null;
    this._sidebarNavComponent = null;
    this._isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    this._mediaQuery = window.matchMedia('(min-width: 1024px)');
  }
  
  init() {
    // Listen for auth state changes
    stateManager.subscribe('isAuthenticated', (isAuth) => {
      this._updateNavigation(isAuth);
    });
    
    // Listen for viewport changes
    this._mediaQuery.addEventListener('change', (e) => {
      this._isDesktop = e.matches;
      if (stateManager.getState('isAuthenticated')) {
        this._renderNavigation();
      }
    });
    
    // Initial render if authenticated
    if (stateManager.getState('isAuthenticated')) {
      this._renderNavigation();
    }
  }
  
  _updateNavigation(isAuthenticated) {
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('nav-container');
    
    if (isAuthenticated) {
      this._renderNavigation();
    } else {
      // Clear navigation when logged out
      if (headerContainer) headerContainer.innerHTML = '';
      if (navContainer) navContainer.innerHTML = '';
      document.body.classList.remove('has-nav', 'has-sidebar');
    }
  }
  
  _renderNavigation() {
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('nav-container');
    
    // Render header
    this._headerComponent = new HeaderComponent();
    if (headerContainer) {
      headerContainer.innerHTML = this._headerComponent.render();
      this._headerComponent.element = headerContainer.firstElementChild;
      this._headerComponent.mount();
    }
    
    // Render appropriate nav based on viewport
    if (this._isDesktop) {
      document.body.classList.add('has-sidebar');
      document.body.classList.remove('has-nav');
      
      this._sidebarNavComponent = new SidebarNavComponent();
      if (navContainer) {
        navContainer.innerHTML = this._sidebarNavComponent.render();
        this._sidebarNavComponent.element = navContainer.firstElementChild;
        this._sidebarNavComponent.mount();
      }
    } else {
      document.body.classList.add('has-nav');
      document.body.classList.remove('has-sidebar');
      
      this._bottomNavComponent = new BottomNavComponent();
      if (navContainer) {
        navContainer.innerHTML = this._bottomNavComponent.render();
        this._bottomNavComponent.element = navContainer.firstElementChild;
        this._bottomNavComponent.mount();
      }
    }
  }
}
```

**Updated HeaderComponent (enhanced from Story 1.4):**
```javascript
class HeaderComponent extends Component {
  constructor() {
    super();
    this._menuOpen = false;
    this._pageTitles = {
      dashboard: 'דשבורד',
      passport: 'הדרכון שלי',
      positions: 'משרות פתוחות',
      referrals: 'ההפניות שלי',
      settings: 'הגדרות'
    };
  }
  
  template() {
    const user = stateManager.getState('currentUser');
    const currentView = stateManager.getState('currentView');
    
    if (!user) return '';
    
    return `
      <header class="header">
        <div class="header__logo" data-navigate="dashboard" role="button" tabindex="0" aria-label="חזור לדשבורד">
          <span class="header__logo-icon">✈️</span>
          <span class="header__logo-text">PassportCard Refer</span>
        </div>
        
        <h1 class="header__title">${this._pageTitles[currentView] || ''}</h1>
        
        <div class="header__user">
          <button 
            class="header__user-btn" 
            data-action="toggle-user-menu"
            aria-expanded="${this._menuOpen}"
            aria-haspopup="true"
            aria-label="תפריט משתמש"
          >
            <span class="header__avatar">${user.avatarInitial || user.fullName[0]}</span>
            <i class="ti ti-chevron-down header__chevron"></i>
          </button>
          
          ${this._menuOpen ? this._renderDropdown(user) : ''}
        </div>
      </header>
    `;
  }
  
  _renderDropdown(user) {
    return `
      <div class="header__dropdown" role="menu">
        <div class="header__dropdown-info">
          <span class="header__dropdown-name">${user.fullName}</span>
          <span class="header__dropdown-email" dir="ltr">${user.email}</span>
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
    `;
  }
  
  mount() {
    // Subscribe to view changes to update title
    this.subscribe('currentView', () => {
      this._updateTitle();
    });
    
    // Close dropdown when clicking outside
    this._boundClickHandler = this._handleOutsideClick.bind(this);
    document.addEventListener('click', this._boundClickHandler);
  }
  
  unmount() {
    super.unmount();
    document.removeEventListener('click', this._boundClickHandler);
  }
  
  _updateTitle() {
    const currentView = stateManager.getState('currentView');
    const titleEl = this.$('.header__title');
    if (titleEl) {
      titleEl.textContent = this._pageTitles[currentView] || '';
    }
  }
  
  _handleOutsideClick(e) {
    if (this._menuOpen && !e.target.closest('.header__user')) {
      this._menuOpen = false;
      this._updateDropdown();
    }
  }
  
  toggleMenu() {
    this._menuOpen = !this._menuOpen;
    this._updateDropdown();
  }
  
  _updateDropdown() {
    const userContainer = this.$('.header__user');
    const btn = this.$('.header__user-btn');
    const existingDropdown = this.$('.header__dropdown');
    
    if (btn) {
      btn.setAttribute('aria-expanded', this._menuOpen.toString());
    }
    
    if (this._menuOpen && !existingDropdown) {
      const user = stateManager.getState('currentUser');
      const dropdownHTML = this._renderDropdown(user);
      userContainer.insertAdjacentHTML('beforeend', dropdownHTML);
    } else if (!this._menuOpen && existingDropdown) {
      existingDropdown.remove();
    }
  }
}
```

### CSS Styles

**Bottom Navigation:**
```css
/* Bottom Navigation - Add to §9 Navigation section in style.css */

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--color-white);
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: var(--z-nav);
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  min-height: 44px;
  padding: var(--space-1) var(--space-2);
  background: none;
  border: none;
  color: var(--color-gray-500);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: color 0.2s;
  gap: 2px;
}

.bottom-nav__item:hover {
  color: var(--color-gray-700);
}

.bottom-nav__item--active {
  color: var(--color-primary);
}

.bottom-nav__item--active .bottom-nav__icon {
  color: var(--color-primary);
}

.bottom-nav__icon {
  font-size: 24px;
}

.bottom-nav__label {
  font-weight: var(--font-medium);
  white-space: nowrap;
}

/* Hide on desktop */
@media (min-width: 1024px) {
  .bottom-nav {
    display: none;
  }
}
```

**Sidebar Navigation:**
```css
/* Sidebar Navigation - Add to §9 Navigation section in style.css */

.sidebar-nav {
  position: fixed;
  top: 0;
  right: 0; /* RTL: sidebar on right */
  width: 240px;
  height: 100vh;
  background: var(--color-white);
  border-inline-start: 1px solid var(--color-gray-200); /* RTL: left border */
  display: none;
  flex-direction: column;
  z-index: var(--z-nav);
}

@media (min-width: 1024px) {
  .sidebar-nav {
    display: flex;
  }
}

.sidebar-nav__brand {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-gray-100);
}

.sidebar-nav__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.sidebar-nav__logo:hover {
  background: var(--color-gray-50);
}

.sidebar-nav__logo-icon {
  font-size: 24px;
}

.sidebar-nav__logo-text {
  font-weight: var(--font-bold);
  font-size: var(--text-base);
  color: var(--color-gray-900);
}

.sidebar-nav__menu {
  flex: 1;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-nav__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-3);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-gray-600);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  text-align: right; /* RTL alignment */
}

.sidebar-nav__item:hover {
  background: var(--color-gray-50);
  color: var(--color-gray-900);
}

.sidebar-nav__item--active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.sidebar-nav__item--active .sidebar-nav__icon {
  color: var(--color-primary);
}

.sidebar-nav__icon {
  font-size: 20px;
  flex-shrink: 0;
}

.sidebar-nav__label {
  flex: 1;
}

.sidebar-nav__user {
  padding: var(--space-4);
  border-top: 1px solid var(--color-gray-100);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.sidebar-nav__user-avatar {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.sidebar-nav__user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-nav__user-name {
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  color: var(--color-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav__user-dept {
  font-size: var(--text-xs);
  color: var(--color-gray-500);
}
```

**App Layout Adjustments:**
```css
/* App Layout - Add to §4 Layout section in style.css */

/* Body layout helpers */
body.has-nav {
  padding-bottom: 60px; /* Space for bottom nav */
}

body.has-sidebar {
  padding-right: 240px; /* RTL: space for sidebar on right */
}

/* Main content area with header spacing */
.app-layout {
  padding-top: 60px; /* Space for fixed header */
  min-height: 100vh;
}

/* Content wrapper for pages */
.page-content {
  padding: var(--space-4);
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .page-content {
    padding: var(--space-6);
  }
}

/* Header container - fixed at top */
#header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
}

/* Desktop: header adjusts for sidebar */
@media (min-width: 1024px) {
  #header-container {
    right: 240px; /* RTL: leave space for sidebar */
  }
}
```

**Updated Header CSS (complement to Story 1.4):**
```css
/* Header enhancements - Update §9 Navigation section */

.header {
  position: relative; /* Changed from fixed - container handles positioning */
  height: 60px;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
}

.header__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  padding: var(--space-2);
  margin: calc(var(--space-2) * -1);
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.header__logo:hover {
  background: rgba(255, 255, 255, 0.1);
}

.header__logo:focus {
  outline: 2px solid var(--color-white);
  outline-offset: 2px;
}

.header__logo-icon {
  font-size: 24px;
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

/* Mobile: smaller title, hide logo text */
@media (max-width: 599px) {
  .header__logo-text {
    display: none;
  }
  
  .header__title {
    font-size: var(--text-base);
  }
}

/* Desktop adjustments */
@media (min-width: 1024px) {
  .header {
    padding: 0 var(--space-6);
  }
}
```

### HTML Structure Update

**Update index.html to include navigation containers:**
```html
<body>
  <!-- Header container (fixed) -->
  <div id="header-container"></div>
  
  <!-- Navigation container (fixed - bottom nav or sidebar) -->
  <div id="nav-container"></div>
  
  <!-- Main app container -->
  <div id="app" class="app-layout"></div>
  
  <!-- Toast notifications container -->
  <div id="toast-container" aria-live="polite"></div>
  
  <!-- Modal overlay container -->
  <div id="modal-container"></div>
  
  <!-- External scripts -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script src="script.js"></script>
</body>
```

### App Initialization Updates

**Update App class to initialize NavigationManager:**
```javascript
class App {
  constructor() {
    this._navigationManager = null;
  }
  
  init() {
    // Load persisted state first
    stateManager._loadState();
    
    // Validate session
    if (stateManager.getState('isAuthenticated')) {
      if (!stateManager._validateSession()) {
        console.log('Invalid session detected, clearing...');
        stateManager._clearSession();
      }
    }
    
    // Set up event delegation
    this._setupEventDelegation();
    
    // Initialize navigation manager
    this._navigationManager = new NavigationManager();
    this._navigationManager.init();
    
    // Initialize router
    this._initRouter();
    
    // Register action handlers
    this._registerActions();
    
    // Render initial route with guards
    const hash = window.location.hash.slice(1) || 'auth';
    router.navigate(hash);
  }
  
  _setupEventDelegation() {
    // Handle clicks on main app container
    document.getElementById('app').addEventListener('click', (e) => {
      this._handleClick(e);
    });
    
    // Handle clicks on header
    document.getElementById('header-container')?.addEventListener('click', (e) => {
      this._handleClick(e);
    });
    
    // Handle clicks on nav
    document.getElementById('nav-container')?.addEventListener('click', (e) => {
      this._handleClick(e);
    });
  }
  
  _handleClick(e) {
    // Handle navigation
    const navTarget = e.target.closest('[data-navigate]');
    if (navTarget) {
      e.preventDefault();
      const route = navTarget.dataset.navigate;
      router.navigate(route);
      return;
    }
    
    // Handle actions
    const actionTarget = e.target.closest('[data-action]');
    if (actionTarget) {
      e.preventDefault();
      const action = actionTarget.dataset.action;
      this._handleAction(action, actionTarget);
    }
  }
  
  _registerActions() {
    // Logout action
    this.registerAction('logout', () => {
      AuthService.logout();
    });
    
    // Toggle user menu
    this.registerAction('toggle-user-menu', (target) => {
      if (this._navigationManager?._headerComponent) {
        this._navigationManager._headerComponent.toggleMenu();
      }
    });
    
    // Toggle notifications (for settings)
    this.registerAction('toggle-notifications', (target) => {
      const current = stateManager.getState('emailNotifications') !== false;
      stateManager.setState({ emailNotifications: !current });
      this.showToast('ההגדרות נשמרו', 'success');
    });
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #E10514 | Active nav item, header bg |
| `--color-primary-light` | #FFF5F5 | Active sidebar item bg |
| `--color-white` | #FFFFFF | Header text, nav bg |
| `--color-gray-500` | #6B7280 | Inactive nav text |
| `--color-gray-600` | #4B5563 | Sidebar item text |
| `--color-gray-900` | #111827 | Active nav text (hover) |
| `--color-gray-100` | #F3F4F6 | Dividers, hover bg |
| `--color-gray-200` | #E5E7EB | Border color |
| `--z-nav` | 90 | Navigation z-index |
| `--z-header` | 100 | Header z-index |

### Z-Index Layering

```css
/* Add to CSS variables section */
:root {
  --z-nav: 90;
  --z-header: 100;
  --z-modal-backdrop: 200;
  --z-modal: 300;
  --z-toast: 400;
}
```

### Event Delegation Actions

This story uses the following `data-navigate` values:
- `dashboard` - Navigate to dashboard
- `passport` - Navigate to passport
- `positions` - Navigate to positions
- `referrals` - Navigate to referrals
- `settings` - Navigate to settings

And `data-action` values:
- `toggle-user-menu` - Toggle header dropdown (from Story 1.4)
- `logout` - Trigger logout flow (from Story 1.4)

### State Management

```javascript
// Subscribe to auth state for showing/hiding nav
stateManager.subscribe('isAuthenticated', (isAuth) => {
  // NavigationManager handles showing/hiding
});

// Subscribe to currentView for highlighting
stateManager.subscribe('currentView', (view) => {
  // Nav components update their active states
});

// No new state keys needed - uses existing:
// - isAuthenticated
// - currentView
// - currentUser
```

### Accessibility Notes

- Navigation containers have `aria-label="ניווט ראשי"`
- Active nav item has `aria-current="page"`
- All buttons have proper `aria-label` attributes
- Focus indicators are clearly visible (outline)
- Logo is keyboard accessible with `tabindex="0"` and keyboard event handlers
- Header dropdown has `aria-expanded` and `aria-haspopup`
- Touch targets meet 44×44px minimum on mobile

### Testing Scenarios

1. **Mobile Navigation:**
   - View on mobile viewport → Bottom nav visible at bottom
   - Tap nav item → Route changes, item highlights
   - Refresh page → Correct item still highlighted
   
2. **Desktop Navigation:**
   - View on desktop viewport → Sidebar visible on right (RTL)
   - Bottom nav hidden
   - Click nav item → Route changes, item highlights
   
3. **Responsive Transition:**
   - Resize from mobile to desktop → Sidebar appears, bottom nav hides
   - Resize from desktop to mobile → Bottom nav appears, sidebar hides
   - Highlight preserved during transition
   
4. **Authentication State:**
   - Not authenticated → No nav visible
   - Login → Nav appears after auth
   - Logout → Nav disappears
   
5. **Logo Navigation:**
   - Click logo from any page → Navigate to dashboard
   - Logo hover state shows feedback

### Integration Points

**Dependencies:**
- `Component` base class (from Story 1.1)
- `StateManager` instance (from Story 1.1)
- `Router` class (from Story 1.1)
- `AuthService` class (from Story 1.4)
- `HeaderComponent` base implementation (from Story 1.4)

**Extends/Enhances:**
- `HeaderComponent` - Adds navigation support, logo click handler
- `index.html` - Adds navigation containers

**Used By:**
- All authenticated screens (Dashboard, Passport, Positions, Referrals, Settings)
- App initialization

### Project Structure Notes

- `BottomNavComponent` goes in `script.js` section: "COMPONENTS - Shared"
- `SidebarNavComponent` goes in `script.js` section: "COMPONENTS - Shared"
- `NavigationManager` goes in `script.js` section: "SERVICES" (after AnimationService)
- `HeaderComponent` updates in `script.js` section: "COMPONENTS - Shared"
- Navigation CSS goes in `style.css` section: "§9 Navigation"
- Layout CSS goes in `style.css` section: "§4 Layout"

### References

- [Source: docs/architecture.md#5-project-structure-boundaries] - Component hierarchy
- [Source: docs/architecture.md#4-implementation-patterns] - Naming conventions
- [Source: docs/PRD.md#6.8-navigation-settings] - FR-NAV-001, FR-NAV-002 requirements
- [Source: docs/epics.md#story-15] - Original story definition
- [Source: docs/project_context.md] - Quick reference rules

### Previous Story Learnings

From Story 1.1 (Project Setup):
- `StateManager` has subscribe method for reactive updates
- Event delegation pattern with `data-action` and `data-navigate`
- Component base class with `template()`, `mount()`, `unmount()`

From Story 1.3 (OTP Verification):
- User object has: `fullName`, `avatarInitial`, `department`, `email`
- Modal rendering pattern with separate container

From Story 1.4 (Session Management):
- `HeaderComponent` exists with user dropdown
- `AuthService.logout()` clears session
- Route guards in Router prevent unauthorized access
- `isAuthenticated` state controls auth flow

### Critical Implementation Notes

1. **RTL Layout:** Sidebar is on the RIGHT side (not left) for RTL. Use `right: 0` not `left: 0`.

2. **Body Padding:** Must add padding to body when nav is present to prevent content overlap:
   - `body.has-nav { padding-bottom: 60px; }` for mobile
   - `body.has-sidebar { padding-right: 240px; }` for desktop (RTL)

3. **Header Container Positioning:** On desktop, header container needs `right: 240px` to account for sidebar width.

4. **Media Query Listener:** Use `addEventListener('change', ...)` not deprecated `addListener()`.

5. **Highlight Sync:** Both nav components must subscribe to `currentView` to stay in sync with URL changes.

6. **Safe Area Insets:** Include `env(safe-area-inset-bottom)` for iPhone notch/home indicator.

7. **Focus Management:** Logo needs `tabindex="0"` and keyboard event handler for Enter/Space.

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete)
- docs/project_context.md (complete)
- docs/sprint-artifacts/1-4-session-management-logout.md (previous story - ready-for-dev)
- docs/sprint-artifacts/1-3-otp-verification-modal.md (previous story - review)

### Agent Model Used

Claude Opus 4.5 (via Cursor)

### Debug Log References

No debug issues encountered during implementation.

### Completion Notes List

- **BottomNavComponent**: Created mobile bottom navigation with 5 nav items (Dashboard, Passport, Positions, Referrals, Settings), Tabler icons, active state highlighting via `currentView` subscription, 44px minimum touch targets, `aria-current="page"` for accessibility.

- **SidebarNavComponent**: Created desktop sidebar navigation with branding section, 5 nav items with icons and labels, user info section showing avatar/name/department, active state highlighting, positioned on right side for RTL layout.

- **HeaderComponent Enhancement**: Updated to include `data-navigate="dashboard"` on logo, `_pageTitles` map for dynamic title updates based on `currentView`, proper `aria-label` attributes, keyboard-accessible logo with `tabindex="0"`, refactored dropdown management via `_updateDropdown()` method.

- **NavigationManager**: Created orchestration class that initializes on app startup, subscribes to `isAuthenticated` state to show/hide navigation, listens to viewport changes via `matchMedia('(min-width: 1024px)')`, renders appropriate navigation component based on viewport, manages body classes (`has-nav`, `has-sidebar`) for layout adjustments.

- **CSS Implementation**: Added bottom nav styles with `position: fixed`, `bottom: 0`, safe-area-inset support for iPhone notch. Added sidebar styles with `position: fixed`, `right: 0` for RTL, 240px width. Added body layout helpers for padding adjustments, header container adjustments for desktop sidebar.

- **Event Delegation**: Extended App's `_setupEventDelegation()` to handle clicks on `#header-container` and `#nav-container` in addition to `#app`, added keyboard navigation support for Enter/Space on nav items.

- **SettingsComponent**: Refactored to use `page-content` wrapper instead of rendering its own header, since NavigationManager now handles header globally.

### File List

Files modified:
- `index.html` - Added `#header-container`, `#nav-container` divs, added `class="app-layout"` to `#app`, added `aria-live="polite"` to toast container
- `script.js` - Added BottomNavComponent class, SidebarNavComponent class, NavigationManager class, enhanced HeaderComponent, updated App._setupEventDelegation(), simplified toggle-user-menu action handler, refactored SettingsComponent
- `style.css` - Added #header-container styles, bottom-nav styles (~60 lines), sidebar-nav styles (~100 lines), body layout helpers, page-content wrapper

### Change Log

- 2025-12-10: Implemented Story 1.5 Navigation Structure - Added responsive bottom nav (mobile) and sidebar nav (desktop), enhanced header with navigation support, created NavigationManager for orchestration

