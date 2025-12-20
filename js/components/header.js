/**
 * PassportCard Refer - Header Component
 * App header with user dropdown menu
 */

import { Component } from '../core/component.js';
import { CONFIG } from '../core/config.js';

// These will be set by app.js after initialization
let stateManager = null;

/**
 * Initialize module with app dependencies
 * @param {Object} deps - Dependencies object
 */
export function initHeaderModule(deps) {
  stateManager = deps.stateManager;
}

/**
 * HeaderComponent - App header with user dropdown menu
 * Implements: AC3 (Header Component), AC9 (Logo Navigation)
 */
export class HeaderComponent extends Component {
  constructor() {
    super();
    this._menuOpen = false;
    this._boundClickHandler = null;
    this._pageTitles = {
      dashboard: 'דשבורד',
      passport: 'הדרכון שלי',
      positions: 'משרות פתוחות',
      referrals: 'ההפניות שלי',
      settings: 'הגדרות'
    };
  }
  
  /**
   * Returns the header HTML template
   * @returns {string} HTML string
   */
  template() {
    const user = stateManager.getState('currentUser');
    const currentView = stateManager.getState('currentView');
    
    if (!user) return '';
    
    return `
      <header class="header">
        <div class="header__logo" data-navigate="dashboard" role="button" tabindex="0" aria-label="PassportCard - חזור לדשבורד">
          <img src="${CONFIG.LOGOS.WHITE}" alt="" aria-hidden="true" class="header__logo-img" />
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
            <i class="ti ti-chevron-down header__chevron ${this._menuOpen ? 'header__chevron--open' : ''}"></i>
          </button>
          
          ${this._menuOpen ? this._renderDropdown(user) : ''}
        </div>
      </header>
    `;
  }
  
  /**
   * Renders the dropdown menu
   * @param {Object} user - User object
   * @returns {string} HTML string for dropdown
   */
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
  
  /**
   * Gets the current page title based on view
   * @returns {string} Page title in Hebrew
   */
  _getPageTitle() {
    return this._pageTitles[stateManager.getState('currentView')] || '';
  }
  
  /**
   * Called after component is mounted
   */
  mount() {
    super.mount();
    // Subscribe to view changes to update title
    this.subscribe('currentView', () => {
      this._updateTitle();
    });
    
    // Close dropdown when clicking outside
    this._boundClickHandler = this._handleOutsideClick.bind(this);
    document.addEventListener('click', this._boundClickHandler);
  }
  
  /**
   * Called before component is unmounted
   */
  unmount() {
    if (this._boundClickHandler) {
      document.removeEventListener('click', this._boundClickHandler);
      this._boundClickHandler = null;
    }
    super.unmount();
  }
  
  /**
   * Updates the page title based on current view
   */
  _updateTitle() {
    const currentView = stateManager.getState('currentView');
    const titleEl = document.querySelector('.header__title');
    if (titleEl) {
      titleEl.textContent = this._pageTitles[currentView] || '';
    }
  }
  
  /**
   * Handles clicks outside the dropdown to close it
   * @param {Event} e - Click event
   */
  _handleOutsideClick(e) {
    if (this._menuOpen && !e.target.closest('.header__user')) {
      this._menuOpen = false;
      this._updateDropdown();
    }
  }
  
  /**
   * Toggles the user dropdown menu
   */
  toggleMenu() {
    this._menuOpen = !this._menuOpen;
    this._updateDropdown();
  }
  
  /**
   * Updates the dropdown visibility
   */
  _updateDropdown() {
    const userContainer = document.querySelector('.header__user');
    const btn = document.querySelector('.header__user-btn');
    const existingDropdown = document.querySelector('.header__dropdown');
    
    if (btn) {
      btn.setAttribute('aria-expanded', this._menuOpen.toString());
      const chevron = btn.querySelector('.header__chevron');
      if (chevron) {
        chevron.classList.toggle('header__chevron--open', this._menuOpen);
      }
    }
    
    if (this._menuOpen && !existingDropdown) {
      const user = stateManager.getState('currentUser');
      if (user && userContainer) {
        const dropdownHTML = this._renderDropdown(user);
        userContainer.insertAdjacentHTML('beforeend', dropdownHTML);
      }
    } else if (!this._menuOpen && existingDropdown) {
      existingDropdown.remove();
    }
  }
}
