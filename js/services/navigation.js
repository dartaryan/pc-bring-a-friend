/**
 * PassportCard Refer - Navigation Manager
 * Orchestrates navigation components based on auth state and viewport
 */

import { router } from '../core/router.js';

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
      
      // Remove sidebar container
      const sidebarContainer = document.getElementById('sidebar-container');
      if (sidebarContainer) {
        sidebarContainer.remove();
      }
      
      document.body.classList.remove('has-nav', 'has-sidebar', 'sidebar-collapsed', 'has-header');
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
      // Add has-header class for fixed header padding
      document.body.classList.add('has-header');
    }
    
    // Always render sidebar (for both desktop and mobile drawer)
    this._sidebarNavComponent = new this._SidebarNavComponent();
    if (this._stateManager) {
      this._sidebarNavComponent.setStateManager(this._stateManager);
    }
    
    // Create a container for sidebar that's separate from nav container
    let sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) {
      sidebarContainer = document.createElement('div');
      sidebarContainer.id = 'sidebar-container';
      document.body.appendChild(sidebarContainer);
      
      // Add click handler for navigation items in sidebar
      sidebarContainer.addEventListener('click', (event) => {
        const target = event.target.closest('[data-navigate]');
        if (target) {
          event.preventDefault();
          const route = target.dataset.navigate;
          
          // Close mobile drawer if open
          const sidebar = sidebarContainer.querySelector('.sidebar-nav');
          if (sidebar?.classList.contains('sidebar-nav--mobile-open')) {
            sidebar.classList.remove('sidebar-nav--mobile-open');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
              overlay.classList.remove('sidebar-overlay--visible');
              setTimeout(() => overlay.remove(), 300);
            }
          }
          
          // Navigate using router
          router.navigate(route);
        }
      });
    }
    sidebarContainer.innerHTML = this._sidebarNavComponent.render();
    this._sidebarNavComponent.setElement(sidebarContainer.firstElementChild);
    this._sidebarNavComponent.mount();
    
    // Apply collapsed state if saved (desktop only)
    if (this._isDesktop) {
      const sidebarCollapsed = this._stateManager?.getState('sidebarCollapsed') || false;
      if (sidebarCollapsed) {
        const sidebar = sidebarContainer.querySelector('.sidebar-nav');
        if (sidebar) {
          sidebar.classList.add('sidebar-nav--collapsed');
        }
        document.body.classList.add('sidebar-collapsed');
      }
    }
    
    // Render appropriate nav based on viewport
    if (this._isDesktop) {
      document.body.classList.add('has-sidebar');
      document.body.classList.remove('has-nav');
      this._bottomNavComponent = null;
      
      if (navContainer) {
        navContainer.innerHTML = '';
      }
    } else {
      document.body.classList.add('has-nav');
      document.body.classList.remove('has-sidebar');
      
      this._bottomNavComponent = new this._BottomNavComponent();
      if (this._stateManager) {
        this._bottomNavComponent.setStateManager(this._stateManager);
      }
      
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
    
    // Clean up sidebar container
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
      sidebarContainer.innerHTML = '';
    }
    
    // Clean up overlay
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
      overlay.remove();
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
