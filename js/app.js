/**
 * PassportCard Refer - Main Application Entry Point
 * 
 * This is the main entry point for the modular application.
 * It imports all modules and initializes the application.
 * 
 * @module app
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Core imports
import { CONFIG, ACTIVITY_TYPES } from './core/config.js';
import { StateManager, stateManager } from './core/state.js';
import { Router, router } from './core/router.js';
import { Component } from './core/component.js';
import { renderIcon, debounce, setViewportHeight, showCSSCelebration } from './core/utils.js';

// Services
import { AnimationService, animationService } from './services/animation.js';
import { AuthService } from './services/auth.js';
import { NavigationManager, navigationManager } from './services/navigation.js';
import { ModalManager, modalManager } from './services/modal.js';

// Data
import { STAMP_TYPES } from './data/stamp-types.js';
import { REFERRAL_STATUS_CONFIG, PIPELINE_STAGES, STAGE_INDEX } from './data/status-config.js';
import { MOCK_POSITIONS } from './data/mock-positions.js';
import { MOCK_REFERRALS } from './data/mock-referrals.js';
import { MOCK_CAMPAIGNS } from './data/mock-campaigns.js';
import { generateUserFromEmail, generateDemoStamps, generateReferralStats, generateActivityFeed, formatPoints, formatPointsRTL, formatPointsDelta, formatDate, timeAgo, getHebrewMonthName } from './data/user-generator.js';

// Components
import { LoginComponent, OTPModalComponent, initLoginModule } from './components/login.js';
import { HeaderComponent, initHeaderModule } from './components/header.js';
import { BottomNavComponent, SidebarNavComponent, initNavigationModule } from './components/navigation.js';
import { SMSToastComponent, showSMSToast, dismissSMSToast, initSMSToastModule } from './components/sms-toast.js';
import { DashboardComponent, initDashboardModule } from './components/dashboard.js';
import { PassportComponent, initPassportModule } from './components/passport.js';
import { PositionsComponent, initPositionsModule } from './components/positions.js';
import { SettingsComponent, initSettingsModule } from './components/settings.js';
import { HowToEarnComponent, CampaignsComponent, initCampaignsModule } from './components/campaigns.js';
import { ReferralsComponent, StatusPipeline, renderStatusPipeline, initReferralsModule } from './components/referrals.js';
import { ReferralFormComponent, ReferralConfirmationComponent, initReferralFormModule } from './components/referral-form.js';

// Modals
import { StampDetailModal, stampDetailModal, initStampDetailModule } from './components/modals/stamp-detail.js';
import { PositionDetailModal, positionDetailModal, initPositionDetailModule } from './components/modals/position-detail.js';
import { ReferralDetailModal, referralDetailModal, initReferralDetailModule } from './components/modals/referral-detail.js';
import { SharePanel, openSharePanel, generateReferralLink, initSharePanelModule } from './components/modals/share-panel.js';

// ============================================================================
// MAKE GLOBALS AVAILABLE (for backward compatibility)
// ============================================================================

window.CONFIG = CONFIG;
window.ACTIVITY_TYPES = ACTIVITY_TYPES;
window.stateManager = stateManager;
window.router = router;
window.animationService = animationService;
window.navigationManager = navigationManager;
window.modalManager = modalManager;
window.renderIcon = renderIcon;

// Data exports
window.STAMP_TYPES = STAMP_TYPES;
window.REFERRAL_STATUS_CONFIG = REFERRAL_STATUS_CONFIG;
window.PIPELINE_STAGES = PIPELINE_STAGES;
window.STAGE_INDEX = STAGE_INDEX;
window.MOCK_POSITIONS = MOCK_POSITIONS;
window.MOCK_REFERRALS = MOCK_REFERRALS;
window.MOCK_CAMPAIGNS = MOCK_CAMPAIGNS;

// User generator functions
window.generateUserFromEmail = generateUserFromEmail;
window.generateDemoStamps = generateDemoStamps;
window.generateReferralStats = generateReferralStats;
window.generateActivityFeed = generateActivityFeed;

// Component classes
window.Component = Component;
window.LoginComponent = LoginComponent;
window.OTPModalComponent = OTPModalComponent;
window.HeaderComponent = HeaderComponent;
window.BottomNavComponent = BottomNavComponent;
window.SidebarNavComponent = SidebarNavComponent;
window.SMSToastComponent = SMSToastComponent;
window.DashboardComponent = DashboardComponent;
window.PassportComponent = PassportComponent;
window.PositionsComponent = PositionsComponent;
window.SettingsComponent = SettingsComponent;
window.HowToEarnComponent = HowToEarnComponent;
window.CampaignsComponent = CampaignsComponent;
window.ReferralsComponent = ReferralsComponent;
window.StatusPipeline = StatusPipeline;
window.ReferralFormComponent = ReferralFormComponent;
window.ReferralConfirmationComponent = ReferralConfirmationComponent;

// Modal classes and instances
window.StampDetailModal = StampDetailModal;
window.stampDetailModal = stampDetailModal;
window.PositionDetailModal = PositionDetailModal;
window.positionDetailModal = positionDetailModal;
window.ReferralDetailModal = ReferralDetailModal;
window.referralDetailModal = referralDetailModal;
window.SharePanel = SharePanel;
window.openSharePanel = openSharePanel;
window.generateReferralLink = generateReferralLink;
window.renderStatusPipeline = renderStatusPipeline;

// Utility functions
window.showSMSToast = showSMSToast;
window.dismissSMSToast = dismissSMSToast;
window.showCSSCelebration = showCSSCelebration;

// Services
window.AuthService = AuthService;
window.AnimationService = AnimationService;
window.NavigationManager = NavigationManager;
window.ModalManager = ModalManager;

/* ============================================================================
   APP CLASS
   ============================================================================
   Main application controller
   ========================================================================== */

export class App {
  constructor() {
    this._components = new Map();
    this._currentComponent = null;
  }
  
  /**
   * Initializes the application
   */
  init() {
    // Set up event delegation
    this._setupEventDelegation();
    
    // Initialize navigation manager
    navigationManager.init();
    
    // Subscribe to view changes
    stateManager.subscribe('currentView', (view) => {
      this._renderView(view);
    });
    
    // Initial render
    this._renderView(stateManager.getState('currentView'));
  }
  
  /**
   * Sets up event delegation on app, header, nav, and modal containers
   */
  _setupEventDelegation() {
    const appContainer = document.getElementById('main-content');
    const headerContainer = document.getElementById('header-container');
    const navContainer = document.getElementById('nav-container');
    const modalContainer = document.getElementById('modal-container');
    
    if (!appContainer) {
      console.error('App: #main-content container not found');
      return;
    }
    
    // Common click handler
    const handleClick = (event) => {
      const target = event.target.closest('[data-action], [data-navigate]');
      
      if (!target) return;
      
      // Handle navigation
      const navigateTo = target.dataset.navigate;
      if (navigateTo) {
        event.preventDefault();
        router.navigate(navigateTo);
        return;
      }
      
      // Handle actions
      const action = target.dataset.action;
      if (action) {
        event.preventDefault();
        this._handleAction(action, target, event);
      }
    };
    
    // Click event delegation on all containers
    appContainer.addEventListener('click', handleClick);
    
    if (headerContainer) {
      headerContainer.addEventListener('click', handleClick);
    }
    
    if (navContainer) {
      navContainer.addEventListener('click', handleClick);
      
      // Handle keyboard navigation on nav items
      navContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          const target = event.target.closest('[data-navigate]');
          if (target) {
            event.preventDefault();
            router.navigate(target.dataset.navigate);
          }
        }
      });
    }
    
    // Modal container - needed for share panel and other modal actions
    if (modalContainer) {
      modalContainer.addEventListener('click', handleClick);
    }
    
    // Form submission delegation
    appContainer.addEventListener('submit', (event) => {
      const form = event.target;
      const action = form.dataset.action;
      
      if (action) {
        event.preventDefault();
        this._handleAction(action, form, event);
      }
    });
    
    // Input event delegation (for real-time validation, search, etc.)
    appContainer.addEventListener('input', (event) => {
      const target = event.target;
      const action = target.dataset.inputAction;
      
      if (action) {
        this._handleAction(action, target, event);
      }
    });
  }
  
  /**
   * Handles delegated actions
   * @param {string} action - Action name
   * @param {Element} target - Trigger element
   * @param {Event} event - Original event
   */
  _handleAction(action, target, event) {
    // Action handlers will be registered by components
    // This is a placeholder for the action dispatch system
    const handlers = this._actionHandlers || {};
    
    if (handlers[action]) {
      handlers[action](target, event);
    } else {
      console.warn(`App: No handler for action "${action}"`);
    }
  }
  
  /**
   * Registers an action handler
   * @param {string} action - Action name
   * @param {Function} handler - Handler function
   */
  registerAction(action, handler) {
    if (!this._actionHandlers) {
      this._actionHandlers = {};
    }
    this._actionHandlers[action] = handler;
  }
  
  /**
   * Unregisters an action handler
   * @param {string} action - Action name
   */
  unregisterAction(action) {
    if (this._actionHandlers) {
      delete this._actionHandlers[action];
    }
  }
  
  /**
   * Renders the view for a route
   * @param {string} view - View/route name
   */
  _renderView(view) {
    const appContainer = document.getElementById('main-content');
    
    if (!appContainer) {
      console.error('App: #main-content container not found');
      return;
    }
    
    // Unmount current component
    if (this._currentComponent) {
      this._currentComponent.unmount();
      this._currentComponent = null;
    }
    
    // Get component class for route
    const routeConfig = CONFIG.ROUTES[view];
    
    if (!routeConfig) {
      console.error(`App: No route config for "${view}"`);
      appContainer.innerHTML = '<div class="error">Page not found</div>';
      return;
    }
    
    // For now, render a placeholder - components will be implemented in later stories
    const componentName = routeConfig.component;
    const ComponentClass = this._components.get(componentName);
    
    if (ComponentClass) {
      this._currentComponent = new ComponentClass();
      appContainer.innerHTML = this._currentComponent.render();
      this._currentComponent.mount();
      
      // Announce page change to screen readers (Story 6.3 - Accessibility)
      animationService.announcePageChange(view);
    } else {
      // Placeholder for unimplemented components
      appContainer.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--space-4);
          text-align: center;
        ">
          <i class="ti ti-loader" style="font-size: 3rem; color: var(--color-gray-400);"></i>
          <p style="margin-top: var(--space-4); color: var(--color-gray-500);">
            טוען...
          </p>
        </div>
      `;
    }
  }
  
  /**
   * Registers a component class
   * @param {string} name - Component name
   * @param {Function} ComponentClass - Component constructor
   */
  registerComponent(name, ComponentClass) {
    this._components.set(name, ComponentClass);
  }
  
  /**
   * Gets the current component instance by name
   * @param {string} name - Component name to find
   * @returns {Component|null} The current component if it matches, null otherwise
   */
  getComponent(name) {
    // Check if current component matches the requested name
    if (this._currentComponent && this._currentComponent.constructor === this._components.get(name)) {
      return this._currentComponent;
    }
    return null;
  }
  
  /**
   * Gets the current component instance
   * @returns {Component|null} The current component instance
   */
  get currentComponent() {
    return this._currentComponent;
  }
  
  /**
   * Shows a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in ms (default 3000)
   */
  showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const icons = {
      success: 'ti-check',
      error: 'ti-x',
      warning: 'ti-alert-triangle',
      info: 'ti-info-circle'
    };
    
    toast.innerHTML = `
      <i class="ti ${icons[type] || icons.info} toast__icon"></i>
      <span class="toast__message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast--visible');
    });
    
    // Auto-remove after duration
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      }, { once: true });
      // Fallback removal
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

// Global app instance
export const app = new App();
window.app = app;

/* ============================================================================
   INITIALIZATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Multi-page entry point handler (Story 7.0)
  // If on index.html, redirect to appropriate page based on auth state
  const currentPage = document.body?.dataset?.page || 'index';
  
  if (currentPage === 'index') {
    // State is loaded by StateManager constructor
    const isAuthenticated = stateManager.getState('isAuthenticated');
    
    // Validate session if authenticated
    if (isAuthenticated && !stateManager._validateSession()) {
      console.log('Invalid session on entry, clearing...');
      stateManager._clearSession();
    }
    
    // Redirect to appropriate page
    const targetPage = stateManager.getState('isAuthenticated') ? 'dashboard' : 'login';
    const hash = window.location.hash.slice(1);
    
    // If hash specifies a valid route, respect it (for bookmarked URLs)
    if (hash && CONFIG.ROUTES[hash]) {
      const routeConfig = CONFIG.ROUTES[hash];
      const routePage = routeConfig.page;
      
      // Check auth requirements
      if (routeConfig.requiresAuth && !stateManager.getState('isAuthenticated')) {
        // Needs auth but not logged in - go to login
        window.location.replace('login.html');
        return;
      } else if (!routeConfig.requiresAuth && hash === 'auth' && stateManager.getState('isAuthenticated')) {
        // Already authenticated, skip login
        window.location.replace('dashboard.html');
        return;
      } else {
        // Navigate to the route's page
        window.location.replace(`${routePage}.html#${hash}`);
        return;
      }
    }
    
    // No valid hash - go to default page
    window.location.replace(`${targetPage}.html`);
    return;
  }
  
  // State is already loaded and validated by StateManager constructor
  // Validate session state before app renders
  if (stateManager.getState('isAuthenticated')) {
    if (!stateManager._validateSession()) {
      console.log('Invalid session detected during initialization, clearing...');
      stateManager._clearSession();
    }
  }
  
  // Initialize module dependencies
  initLoginModule({
    stateManager,
    router
  });
  
  initHeaderModule({
    stateManager
  });
  
  initNavigationModule({
    stateManager
  });
  
  initDashboardModule({
    stateManager,
    animationService
  });
  
  initPassportModule({
    stateManager,
    animationService
  });
  
  initPositionsModule({
    stateManager
  });
  
  initSettingsModule({
    stateManager
  });
  
  initCampaignsModule({
    stateManager
  });
  
  initReferralsModule();
  initReferralFormModule();
  initStampDetailModule();
  initPositionDetailModule();
  initReferralDetailModule();
  initSharePanelModule();
  initSMSToastModule();
  
  // Set NavigationManager dependencies
  navigationManager.setDependencies({
    stateManager,
    HeaderComponent,
    BottomNavComponent,
    SidebarNavComponent
  });
  
  // Set ModalManager dependencies
  modalManager.setDependencies({
    stateManager,
    router,
    OTPModalComponent,
    stampDetailModal,
    positionDetailModal,
    referralDetailModal,
    showSMSToast,
    dismissSMSToast,
    MOCK_POSITIONS
  });
  
  // Register components
  app.registerComponent('LoginComponent', LoginComponent);
  app.registerComponent('DashboardComponent', DashboardComponent);
  app.registerComponent('SettingsComponent', SettingsComponent);
  app.registerComponent('PassportComponent', PassportComponent);
  app.registerComponent('PositionsComponent', PositionsComponent);
  app.registerComponent('ReferralFormComponent', ReferralFormComponent);
  app.registerComponent('ReferralConfirmationComponent', ReferralConfirmationComponent);
  app.registerComponent('ReferralsComponent', ReferralsComponent);
  
  // Register action handlers
  app.registerAction('submit-login', (target, event) => {
    if (app._currentComponent && app._currentComponent instanceof LoginComponent) {
      app._currentComponent.handleSubmit(event);
    }
  });
  
  // Register logout action handler
  app.registerAction('logout', () => {
    AuthService.logout();
  });
  
  // Register toggle user menu action handler
  app.registerAction('toggle-user-menu', () => {
    const headerComponent = navigationManager.getHeaderComponent();
    if (headerComponent) {
      headerComponent.toggleMenu();
    }
  });
  
  // Register toggle sidebar action handler
  app.registerAction('toggle-sidebar', () => {
    const headerComponent = navigationManager.getHeaderComponent();
    if (headerComponent) {
      headerComponent.toggleSidebar();
    }
  });
  
  // Register toggle notifications action handler
  app.registerAction('toggle-notifications', (target) => {
    const current = stateManager.getState('emailNotifications') !== false;
    stateManager.setState({ emailNotifications: !current });
    
    // Update toggle UI
    target.classList.toggle('toggle--on', !current);
    target.setAttribute('aria-checked', String(!current));
    
    app.showToast('ההגדרות נשמרו', 'success');
  });
  
  // Register show-how-it-works action handler (Story 6.1 - Settings About)
  app.registerAction('show-how-it-works', () => {
    app.showToast('בקרוב - מדריך שימוש מלא', 'info');
  });
  
  // Register show-contact-hr action handler (Story 6.1 - Settings About)
  app.registerAction('show-contact-hr', () => {
    app.showToast('ליצירת קשר: hr@passportcard.co.il', 'info');
  });
  
  // Register navigate-referrals action handler (Story 2.2 - Stats Cards)
  app.registerAction('navigate-referrals', (target) => {
    const filter = target.dataset.filter || 'all';
    
    // Store filter in state for ReferralsComponent to read
    stateManager.setState({
      positionFilters: {
        ...stateManager.getState('positionFilters'),
        referralFilter: filter
      }
    });
    
    router.navigate('referrals');
  });
  
  // Register navigate-referral-detail action handler (Story 2.3 - Activity Feed)
  app.registerAction('navigate-referral-detail', (target) => {
    const referralId = target.dataset.referralId;
    
    if (referralId) {
      // Store selected referral for detail view
      stateManager.setState({
        selectedReferralId: referralId
      });
      
      router.navigate('referrals');
    }
  });
  
  // Register navigate-campaign-positions action handler (Story 2.4 - Campaign Banner)
  app.registerAction('navigate-campaign-positions', (target) => {
    const campaignId = target.dataset.campaignId;
    
    if (campaignId) {
      // Use MOCK_CAMPAIGNS directly (Story 5.4)
      const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
      
      if (campaign) {
        // Store campaign filter for positions page
        stateManager.setState({
          campaignFilter: campaignId,
          positionFilters: {
            ...stateManager.getState('positionFilters'),
            campaignId: campaignId,
            eligibleDepartments: campaign.eligibleDepartments || [],
            eligiblePositionIds: campaign.eligiblePositionIds || []
          }
        });
      }
    }
    
    router.navigate('positions');
  });
  
  // Register view-campaign-positions action handler (Story 5.4 - Campaigns Section)
  app.registerAction('view-campaign-positions', (target) => {
    const campaignId = target.dataset.campaignId || 
                       target.closest('[data-campaign-id]')?.dataset.campaignId;
    
    if (campaignId) {
      const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
      
      if (campaign) {
        // Store campaign filter for positions page
        stateManager.setState({
          campaignFilter: campaignId,
          positionFilters: {
            ...stateManager.getState('positionFilters'),
            campaignId: campaignId,
            eligibleDepartments: campaign.eligibleDepartments || [],
            eligiblePositionIds: campaign.eligiblePositionIds || []
          }
        });
      }
    }
    
    router.navigate('positions');
  });
  
  // Register clear-campaign-filter action handler (Story 5.4)
  app.registerAction('clear-campaign-filter', () => {
    stateManager.setState({
      campaignFilter: null,
      positionFilters: {
        ...stateManager.getState('positionFilters'),
        campaignId: null,
        eligibleDepartments: [],
        eligiblePositionIds: []
      }
    });
    
    // Re-render positions if on positions page
    if (router.getCurrentRoute() === 'positions') {
      const positionsComponent = app.currentComponent;
      if (positionsComponent && positionsComponent._filterPositions) {
        positionsComponent._filterPositions();
        positionsComponent.render();
      }
    }
  });
  
  // Register open-passport action handler (Story 3.1 - Passport Cover Design)
  // Open passport action - triggers 3D flip animation
  app.registerAction('open-passport', async (target, event) => {
    if (event) event.stopPropagation();
    
    const passportEl = document.querySelector('.passport');
    if (!passportEl) return;
    
    // Don't open if already open or animating
    if (passportEl.classList.contains('passport--open') ||
        passportEl.classList.contains('passport--opening') ||
        passportEl.classList.contains('passport--closing')) {
      return;
    }
    
    // Use AnimationService for the animation
    await animationService.animatePassportOpen(passportEl);
    
    // Update state
    stateManager.setState({ passportOpen: true });
    
    // Update component state
    const passportComponent = app.getComponent('PassportComponent');
    if (passportComponent && passportComponent.updatePassportState) {
      passportComponent.updatePassportState(true);
    }
  });

  // Close passport action - triggers reverse 3D flip animation
  app.registerAction('close-passport', async (target, event) => {
    if (event) event.stopPropagation();
    
    const passportEl = document.querySelector('.passport');
    if (!passportEl) return;
    
    // Don't close if already closed or animating
    if (passportEl.classList.contains('passport--closed') ||
        passportEl.classList.contains('passport--opening') ||
        passportEl.classList.contains('passport--closing')) {
      return;
    }
    
    // Use AnimationService for the animation
    await animationService.animatePassportClose(passportEl);
    
    // Update state
    stateManager.setState({ passportOpen: false });
    
    // Update component state
    const passportComponent = app.getComponent('PassportComponent');
    if (passportComponent && passportComponent.updatePassportState) {
      passportComponent.updatePassportState(false);
    }
  });

  // Passport page navigation - Next page (Story 3.3)
  // Opens passport if closed, navigates forward, or closes on last page
  app.registerAction('passport-next', async (target, event) => {
    if (event) event.stopPropagation();
    
    const passportEl = document.querySelector('.passport');
    const passportComponent = app.getComponent('PassportComponent');
    
    // If passport is closed, open it
    if (passportEl && !passportEl.classList.contains('passport--open')) {
      await animationService.animatePassportOpen(passportEl);
      stateManager.setState({ passportOpen: true });
      if (passportComponent && passportComponent.updatePassportState) {
        passportComponent.updatePassportState(true);
      }
      return;
    }
    
    // If on last page, close the passport
    if (passportComponent) {
      const { currentPage, totalPages } = passportComponent.passportState;
      const stamps = stateManager?.getState('stamps') || [];
      const actualTotalPages = passportComponent._getTotalPagesForViewport(stamps);
      
      if (currentPage >= actualTotalPages - 1) {
        // Close passport
        if (passportEl) {
          await animationService.animatePassportClose(passportEl);
          stateManager.setState({ passportOpen: false });
          passportComponent.updatePassportState(false);
        }
        return;
      }
      
      // Navigate to next page
      if (passportComponent.navigateNext) {
        await passportComponent.navigateNext();
      }
    }
  });

  // Passport page navigation - Previous page (Story 3.3)
  // Opens passport if closed, navigates backward, or closes on first page
  app.registerAction('passport-prev', async (target, event) => {
    if (event) event.stopPropagation();
    
    const passportEl = document.querySelector('.passport');
    const passportComponent = app.getComponent('PassportComponent');
    
    // If passport is closed, open it
    if (passportEl && !passportEl.classList.contains('passport--open')) {
      await animationService.animatePassportOpen(passportEl);
      stateManager.setState({ passportOpen: true });
      if (passportComponent && passportComponent.updatePassportState) {
        passportComponent.updatePassportState(true);
      }
      return;
    }
    
    // If on first page, close the passport
    if (passportComponent) {
      const { currentPage } = passportComponent.passportState;
      
      if (currentPage === 0) {
        // Close passport
        if (passportEl) {
          await animationService.animatePassportClose(passportEl);
          stateManager.setState({ passportOpen: false });
          passportComponent.updatePassportState(false);
        }
        return;
      }
      
      // Navigate to previous page
      if (passportComponent.navigatePrev) {
        await passportComponent.navigatePrev();
      }
    }
  });
  
  // View stamp details - Opens stamp detail modal (Story 3.4, 3.5)
  // FIX Story 7.6: Added event parameter and stopPropagation to prevent bubbling
  app.registerAction('view-stamp-details', (target, event) => {
    if (event) event.stopPropagation();
    const stampId = target.dataset.stampId;
    if (!stampId) return;
    
    // Get stamp data
    const stamps = stateManager.getState('stamps') || [];
    const stamp = stamps.find(s => s.id === stampId);
    
    if (stamp) {
      // Store selected stamp in state and trigger modal
      stateManager.setState({
        selectedStamp: stamp,
        activeModal: 'stamp-details'
      });
    }
  });
  
  // Dismiss celebration - stops confetti and removes messages (Story 3.5)
  app.registerAction('dismiss-celebration', () => {
    animationService.dismissCelebration();
  });
  
  // Open position details modal (Story 4.1, implemented in Story 4.3)
  app.registerAction('view-position-details', (target) => {
    const positionId = target.dataset.positionId || target.closest('[data-position-id]')?.dataset.positionId;
    if (!positionId) return;
    
    const position = MOCK_POSITIONS.find(p => p.id === positionId);
    if (position) {
      stateManager.setState({
        selectedPosition: position,
        activeModal: 'position-details'
      });
      // Modal opens via ModalManager subscription to activeModal state
    }
  });
  
  // Navigate to referral form for a position (Story 4.1)
  app.registerAction('refer-position', (target) => {
    const positionId = target.dataset.positionId;
    if (!positionId) return;
    
    const position = MOCK_POSITIONS.find(p => p.id === positionId);
    if (position) {
      stateManager.setState({
        referringPosition: position
      });
      // Navigate to referral form (Story 4.5)
      router.navigate('refer');
    }
  });
  
  // Clear position search (Story 4.2)
  app.registerAction('clear-position-search', () => {
    const component = app.currentComponent;
    if (component && typeof component.clearSearch === 'function') {
      component.clearSearch();
    }
  });
  
  // Clear all position filters (Story 4.2)
  app.registerAction('clear-all-position-filters', () => {
    const component = app.currentComponent;
    if (component && typeof component.clearAllFilters === 'function') {
      component.clearAllFilters();
    }
  });
  
  // ============================================
  // ACTION HANDLERS - Share Panel (Story 4.4)
  // ============================================
  
  // Open share panel for a position
  app.registerAction('open-share-panel', (target) => {
    const positionId = target.dataset.positionId;
    if (!positionId) return;

    openSharePanel(positionId);
  });
  
  // Share position from modal (alternative action name used in position-detail modal)
  app.registerAction('share-position-modal', (target) => {
    const positionId = target.dataset.positionId;
    if (!positionId) return;

    openSharePanel(positionId);
  });

  // Copy referral link to clipboard
  app.registerAction('copy-referral-link', async () => {
    const sharePanel = stateManager.getState('sharePanelInstance');
    if (sharePanel) {
      await sharePanel.handleCopyLink();
    }
  });
  
  // Native share via Web Share API
  app.registerAction('native-share-referral', async () => {
    const sharePanel = stateManager.getState('sharePanelInstance');
    if (sharePanel) {
      await sharePanel.handleNativeShare();
    }
  });
  
  // Close share panel
  app.registerAction('close-share-panel', () => {
    const sharePanel = stateManager.getState('sharePanelInstance');
    if (sharePanel) {
      sharePanel.close();
    }
  });
  
  // Close share panel when clicking overlay
  app.registerAction('close-share-panel-overlay', (target, event) => {
    // Only close if clicking directly on overlay, not panel content
    if (event.target === target || event.target.classList.contains('share-panel-overlay')) {
      const sharePanel = stateManager.getState('sharePanelInstance');
      if (sharePanel) {
        sharePanel.close();
      }
    }
  });
  
  // Continue to referral form after sharing
  app.registerAction('continue-to-referral', (target) => {
    const positionId = target.dataset.positionId;
    if (!positionId) return;
    
    // Close share panel
    const sharePanel = stateManager.getState('sharePanelInstance');
    if (sharePanel) {
      sharePanel.close();
    }
    
    // Set referral state
    const position = MOCK_POSITIONS.find(p => p.id === positionId);
    if (position) {
      stateManager.setState({
        referringPosition: position
      });
      
      // Navigate to referral form (Story 4.5)
      router.navigate('refer');
    }
  });
  
  // ============================================
  // ACTION HANDLERS - Referral Form (Story 4.5)
  // ============================================
  
  // Submit referral form
  app.registerAction('submit-referral', async () => {
    const formComponent = stateManager.getState('referralFormInstance');
    if (formComponent) {
      await formComponent.handleSubmit();
    }
  });
  
  // Remove uploaded resume
  app.registerAction('remove-resume', () => {
    const formComponent = stateManager.getState('referralFormInstance');
    if (formComponent) {
      formComponent.uploadedFile = null;
      formComponent._updateUploadZone();
      formComponent._updateSubmitButtonState();
    }
  });
  
  // Back from referral form
  app.registerAction('back-from-referral', () => {
    const formComponent = stateManager.getState('referralFormInstance');
    const hasData = formComponent && formComponent.hasFormData();
    
    if (hasData) {
      // Show confirmation dialog
      const confirmed = window.confirm('האם לבטל את ההפניה?');
      if (!confirmed) return;
    }
    
    // Clear state and navigate back
    stateManager.setState({
      referringPosition: null,
      referralFormInstance: null
    });
    router.navigate('positions');
  });
  
  // Navigate to positions (fallback)
  app.registerAction('navigate-positions', () => {
    stateManager.setState({
      referringPosition: null,
      referralFormInstance: null
    });
    router.navigate('positions');
  });
  
  // ============================================
  // ACTION HANDLERS - Referral Confirmation (Story 4.6)
  // ============================================
  
  // Navigate to passport from confirmation
  app.registerAction('view-passport-from-confirmation', () => {
    // Set flag to highlight new stamps
    stateManager.setState({
      highlightNewStamps: true
    });
    
    router.navigate('passport');
  });
  
  // Refer another candidate
  app.registerAction('refer-another', () => {
    // Clear referral-specific state
    stateManager.setState({
      referringPosition: null,
      lastSubmittedReferral: null,
      pointsEarnedFromSubmission: null,
      earnedStamps: null
    });
    
    router.navigate('positions');
  });
  
  // Share referral success
  app.registerAction('share-referral-success', async () => {
    const currentUser = stateManager.getState('currentUser');
    const userName = currentUser?.firstName || 'מישהו';
    
    const shareText = `${userName} הפנה/ה מועמד/ת חדש/ה ל-PassportCard!\n\nגם אתם יכולים להרוויח נקודות על ידי הפניית חברים.`;
    
    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'הפניה מוצלחת!',
          text: shareText
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share failed:', err);
        }
      }
    }
    
    // Fallback: copy generic message
    try {
      await navigator.clipboard.writeText(shareText);
      app.showToast('הועתק!', 'success');
    } catch (err) {
      console.error('Copy failed:', err);
      app.showToast('שגיאה בהעתקה', 'error');
    }
  });
  
  // Navigate to dashboard (error fallback)
  app.registerAction('navigate-dashboard', () => {
    router.navigate('dashboard');
  });
  
  // ============================================
  // ACTION HANDLERS - How to Earn (Story 5.5)
  // ============================================
  
  // Store reference to HowToEarnComponent instance for cleanup
  let howToEarnInstance = null;
  
  // Open How to Earn modal
  app.registerAction('open-how-to-earn', () => {
    // Clean up previous instance if exists
    if (howToEarnInstance) {
      howToEarnInstance.unmount();
      howToEarnInstance = null;
    }
    
    howToEarnInstance = new HowToEarnComponent();
    const html = howToEarnInstance.render();
    
    // Insert into modal container
    const container = document.getElementById('modal-container');
    container.innerHTML = html;
    
    // Trigger open animation
    requestAnimationFrame(() => {
      const modal = container.querySelector('.how-to-earn');
      if (modal) {
        modal.classList.add('how-to-earn--open');
      }
    });
    
    // Mount component (focus trap, keyboard handling)
    howToEarnInstance.mount();
  });
  
  // Close How to Earn modal
  app.registerAction('close-how-to-earn', () => {
    const modal = document.querySelector('.how-to-earn');
    if (!modal) return;
    
    modal.classList.remove('how-to-earn--open');
    modal.classList.add('how-to-earn--closing');
    
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const cleanup = () => {
      modal.remove();
      if (howToEarnInstance) {
        howToEarnInstance.unmount();
        howToEarnInstance = null;
      }
    };
    
    if (reducedMotion) {
      cleanup();
    } else {
      setTimeout(cleanup, 300);
    }
  });
  
  // Navigate to positions from How to Earn
  app.registerAction('navigate-to-positions-from-earn', () => {
    // Close modal first
    const modal = document.querySelector('.how-to-earn');
    if (modal) {
      modal.remove();
      if (howToEarnInstance) {
        howToEarnInstance.unmount();
        howToEarnInstance = null;
      }
    }
    
    // Navigate to positions
    router.navigate('positions');
  });
  
  // Navigate to campaigns section on dashboard
  app.registerAction('navigate-to-campaigns', () => {
    // Close modal first
    const modal = document.querySelector('.how-to-earn');
    if (modal) {
      modal.remove();
      if (howToEarnInstance) {
        howToEarnInstance.unmount();
        howToEarnInstance = null;
      }
    }
    
    // Navigate to dashboard
    router.navigate('dashboard');
    
    // Scroll to campaigns section after navigation
    requestAnimationFrame(() => {
      setTimeout(() => {
        const campaignsSection = document.querySelector('.campaigns-section');
        if (campaignsSection) {
          campaignsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    });
  });
  
  // View campaign positions from How to Earn modal
  app.registerAction('view-campaign-positions-from-earn', (target) => {
    const campaignId = target.dataset.campaignId || 
                       target.closest('[data-campaign-id]')?.dataset.campaignId;
    if (!campaignId) return;
    
    // Close modal first
    const modal = document.querySelector('.how-to-earn');
    if (modal) {
      modal.remove();
      if (howToEarnInstance) {
        howToEarnInstance.unmount();
        howToEarnInstance = null;
      }
    }
    
    // Set campaign filter in state
    stateManager.setState({ activeCampaignFilter: campaignId });
    
    // Navigate to positions with campaign filter
    router.navigate('positions');
  });
  
  // ============================================
  // ACTION HANDLERS - Referrals (Story 5.1)
  // ============================================
  
  // Filter referrals by tab
  app.registerAction('filter-referrals', (target) => {
    const filter = target.dataset.filter;
    if (filter) {
      stateManager.setState({ referralFilter: filter });
    }
  });
  
  // View referral details (opens modal - Story 5.3)
  app.registerAction('view-referral-details', (target) => {
    const referralId = target.dataset.referralId || 
                       target.closest('[data-referral-id]')?.dataset.referralId;
    if (!referralId) return;
    
    const referrals = stateManager.getState('referrals') || [];
    const referral = referrals.find(r => r.id === referralId);
    
    if (referral) {
      stateManager.setState({
        selectedReferral: referral,
        activeModal: 'referral-details'
      });
      // Modal will open via state subscription (Story 5.3)
    }
  });
  
  // Initialize the app
  app.init();
  
  // Initialize modal manager
  modalManager.init();
  
  console.log('[App] PassportCard Refer initialized (modular version)');
});

// ============================================================================
// MODULE EXPORTS
// ============================================================================

export {
  // Core
  CONFIG,
  ACTIVITY_TYPES,
  stateManager,
  router,
  Component,
  renderIcon,
  debounce,
  
  // Services
  animationService,
  navigationManager,
  modalManager,
  AuthService,
  
  // Data
  STAMP_TYPES,
  REFERRAL_STATUS_CONFIG,
  PIPELINE_STAGES,
  STAGE_INDEX,
  MOCK_POSITIONS,
  MOCK_REFERRALS,
  MOCK_CAMPAIGNS,
  generateUserFromEmail,
  generateDemoStamps,
  generateReferralStats,
  generateActivityFeed,
  
  // Components
  LoginComponent,
  OTPModalComponent,
  HeaderComponent,
  BottomNavComponent,
  SidebarNavComponent,
  SMSToastComponent,
  showSMSToast,
  dismissSMSToast,
  DashboardComponent,
  PassportComponent,
  PositionsComponent,
  SettingsComponent,
  HowToEarnComponent,
  CampaignsComponent,
  ReferralsComponent,
  StatusPipeline,
  renderStatusPipeline,
  ReferralFormComponent,
  ReferralConfirmationComponent,
  
  // Modals
  StampDetailModal,
  stampDetailModal,
  PositionDetailModal,
  positionDetailModal,
  ReferralDetailModal,
  referralDetailModal,
  SharePanel,
  openSharePanel,
  generateReferralLink
};
