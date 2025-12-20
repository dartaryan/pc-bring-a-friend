/**
 * PassportCard Refer - Navigation Manager
 * Orchestrates navigation components based on auth state and viewport
 */

/* ============================================================================
   NAVIGATION MANAGER
   ============================================================================
   Orchestrates navigation components based on auth state and viewport
   ========================================================================== */

export class NavigationManager {
  constructor() {
    this._headerComponent = null;
    this._bottomNavComponent = null;
    this._sidebarNavComponent = null;
    this._isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    this._mediaQuery = window.matchMedia('(min-width: 1024px)');
    this._boundMediaHandler = null;
    this._stateManager = null;
    this._HeaderComponent = null;
    this._BottomNavComponent = null;
    this._SidebarNavComponent = null;
  }
  
  /**
   * Sets dependencies for the navigation manager
   * @param {Object} deps - Dependencies object
   * @param {StateManager} deps.stateManager - State manager instance
   * @param {Function} deps.HeaderComponent - HeaderComponent class
   * @param {Function} deps.BottomNavComponent - BottomNavComponent class
   * @param {Function} deps.SidebarNavComponent - SidebarNavComponent class
   */
  setDependencies(deps) {
    this._stateManager = deps.stateManager;
    this._HeaderComponent = deps.HeaderComponent;
    this._BottomNavComponent = deps.BottomNavComponent;
    this._SidebarNavComponent = deps.SidebarNavComponent;
  }
  
  /**
   * Initializes the navigation manager
   */
  init() {
    if (!this._stateManager) {
      console.warn('NavigationManager: stateManager not set');
      return;
    }
    
    // Listen for auth state changes
    this._stateManager.subscribe('isAuthenticated', (isAuth) => {
      this._updateNavigation(isAuth);
    });
    
    // Listen for viewport changes
    this._boundMediaHandler = (e) => {
      this._isDesktop = e.matches;
      if (this._stateManager.getState('isAuthenticated')) {
        this._renderNavigation();
      }
    };
    this._mediaQuery.addEventListener('change', this._boundMediaHandler);
    
    // Initial render if authenticated
    if (this._stateManager.getState('isAuthenticated')) {
      this._renderNavigation();
    }
  }
  
  /**
   * Updates navigation based on authentication state
   * @param {boolean} isAuthenticated - Whether user is authenticated
   */
  _updateNavigation(isAuthenticated) {
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('nav-container');
    
    if (isAuthenticated) {
      this._renderNavigation();
    } else {
      // Clear navigation when logged out
      this._unmountComponents();
      if (headerContainer) headerContainer.innerHTML = '';
      if (navContainer) navContainer.innerHTML = '';
      document.body.classList.remove('has-nav', 'has-sidebar');
    }
  }
  
  /**
   * Renders the appropriate navigation components
   */
  _renderNavigation() {
    if (!this._HeaderComponent) {
      console.warn('NavigationManager: Component classes not set');
      return;
    }
    
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('nav-container');
    
    // Unmount existing components
    this._unmountComponents();
    
    // Render header
    this._headerComponent = new this._HeaderComponent();
    if (this._stateManager) {
      this._headerComponent.setStateManager(this._stateManager);
    }
    if (headerContainer) {
      headerContainer.innerHTML = this._headerComponent.render();
      this._headerComponent.setElement(headerContainer.firstElementChild);
      this._headerComponent.mount();
    }
    
    // Render appropriate nav based on viewport
    if (this._isDesktop) {
      document.body.classList.add('has-sidebar');
      document.body.classList.remove('has-nav');
      
      this._sidebarNavComponent = new this._SidebarNavComponent();
      if (this._stateManager) {
        this._sidebarNavComponent.setStateManager(this._stateManager);
      }
      this._bottomNavComponent = null;
      
      if (navContainer) {
        navContainer.innerHTML = this._sidebarNavComponent.render();
        this._sidebarNavComponent.setElement(navContainer.firstElementChild);
        this._sidebarNavComponent.mount();
      }
    } else {
      document.body.classList.add('has-nav');
      document.body.classList.remove('has-sidebar');
      
      this._bottomNavComponent = new this._BottomNavComponent();
      if (this._stateManager) {
        this._bottomNavComponent.setStateManager(this._stateManager);
      }
      this._sidebarNavComponent = null;
      
      if (navContainer) {
        navContainer.innerHTML = this._bottomNavComponent.render();
        this._bottomNavComponent.setElement(navContainer.firstElementChild);
        this._bottomNavComponent.mount();
      }
    }
  }
  
  /**
   * Unmounts all navigation components
   */
  _unmountComponents() {
    if (this._headerComponent) {
      this._headerComponent.unmount();
      this._headerComponent = null;
    }
    if (this._bottomNavComponent) {
      this._bottomNavComponent.unmount();
      this._bottomNavComponent = null;
    }
    if (this._sidebarNavComponent) {
      this._sidebarNavComponent.unmount();
      this._sidebarNavComponent = null;
    }
  }
  
  /**
   * Gets the current header component instance
   * @returns {HeaderComponent|null}
   */
  getHeaderComponent() {
    return this._headerComponent;
  }
}

// Global NavigationManager singleton instance
export const navigationManager = new NavigationManager();
