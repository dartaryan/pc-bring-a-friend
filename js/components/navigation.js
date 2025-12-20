/**
 * PassportCard Refer - Navigation Components
 * Bottom navigation bar and sidebar navigation
 */

import { Component } from '../core/component.js';
import { CONFIG } from '../core/config.js';

// These will be set by app.js after initialization
let stateManager = null;

/**
 * Initialize module with app dependencies
 * @param {Object} deps - Dependencies object
 */
export function initNavigationModule(deps) {
  stateManager = deps.stateManager;
}

/**
 * BottomNavComponent - Mobile bottom navigation bar
 * Implements: AC1 (Mobile Bottom Navigation Bar), AC4, AC5, AC8
 */
export class BottomNavComponent extends Component {
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
  
  /**
   * Returns the bottom navigation HTML template
   * @returns {string} HTML string
   */
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
  
  /**
   * Called after component is mounted
   */
  mount() {
    super.mount();
    // Subscribe to route changes for re-render
    this.subscribe('currentView', () => {
      this._updateActiveState();
    });
  }
  
  /**
   * Updates the active state of navigation items
   */
  _updateActiveState() {
    const currentView = stateManager.getState('currentView');
    const navContainer = document.getElementById('nav-container');
    const items = navContainer?.querySelectorAll('.bottom-nav__item') || [];
    
    items.forEach(item => {
      const route = item.dataset.navigate;
      const isActive = route === currentView;
      
      item.classList.toggle('bottom-nav__item--active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
}

/**
 * SidebarNavComponent - Desktop sidebar navigation
 * Implements: AC2 (Desktop Sidebar Navigation), AC4, AC5, AC8
 */
export class SidebarNavComponent extends Component {
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
  
  /**
   * Returns the sidebar navigation HTML template
   * @returns {string} HTML string
   */
  template() {
    const currentView = stateManager.getState('currentView');
    const user = stateManager.getState('currentUser');
    
    return `
      <aside class="sidebar-nav" aria-label="ניווט ראשי">
        <div class="sidebar-nav__brand">
          <div class="sidebar-nav__logo" data-navigate="dashboard" role="button" tabindex="0" aria-label="PassportCard - לדשבורד">
            <img src="${CONFIG.LOGOS.STANDARD}" alt="" aria-hidden="true" class="sidebar-nav__logo-img" />
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
  
  /**
   * Called after component is mounted
   */
  mount() {
    super.mount();
    this.subscribe('currentView', () => {
      this._updateActiveState();
    });
  }
  
  /**
   * Updates the active state of navigation items
   */
  _updateActiveState() {
    const currentView = stateManager.getState('currentView');
    const navContainer = document.getElementById('nav-container');
    const items = navContainer?.querySelectorAll('.sidebar-nav__item') || [];
    
    items.forEach(item => {
      const route = item.dataset.navigate;
      const isActive = route === currentView;
      
      item.classList.toggle('sidebar-nav__item--active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
}
