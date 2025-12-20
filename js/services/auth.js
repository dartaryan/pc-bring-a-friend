/**
 * PassportCard Refer - Auth Service
 * Authentication service for session management
 */

import { CONFIG } from '../core/config.js';

/* ============================================================================
   AUTH SERVICE
   ============================================================================
   Authentication service for session management
   ========================================================================== */

export class AuthService {
  constructor(stateManager) {
    this._stateManager = stateManager;
  }
  
  /**
   * Sets the state manager (for static-like usage)
   * @param {StateManager} stateManager
   */
  setStateManager(stateManager) {
    this._stateManager = stateManager;
  }
  
  /**
   * Clears all session data and redirects to login
   */
  logout() {
    if (!this._stateManager) {
      console.warn('AuthService: stateManager not set');
      return;
    }
    
    // Clear state
    this._stateManager.setState({
      isAuthenticated: false,
      currentUser: null,
      sessionToken: null,
      referrals: [],
      stamps: [],
      pendingEmail: null,
      activeModal: null
    });
    
    // Clear localStorage
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (error) {
      console.warn('AuthService: Failed to clear localStorage', error);
    }
    
    // Show logout toast (optional per AC)
    if (typeof window.app !== 'undefined' && window.app.showToast) {
      window.app.showToast('התנתקת בהצלחה', 'success');
    }
    
    // Navigate to auth - use direct redirect for multi-page architecture (Story 7.0)
    // Small delay to allow toast to show before page redirect
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 300);
  }
  
  /**
   * Checks if current session is valid
   * @returns {boolean} True if authenticated with valid session
   */
  isAuthenticated() {
    if (!this._stateManager) {
      return false;
    }
    return this._stateManager.getState('isAuthenticated') === true && 
           this._stateManager.getState('sessionToken') !== null;
  }
  
  /**
   * Static logout method for backward compatibility
   * Requires stateManager to be set on window
   */
  static logout() {
    const stateManager = window.stateManager;
    if (!stateManager) {
      console.warn('AuthService.logout: window.stateManager not set');
      return;
    }
    
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
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (error) {
      console.warn('AuthService: Failed to clear localStorage', error);
    }
    
    // Show logout toast (optional per AC)
    if (typeof window.app !== 'undefined' && window.app.showToast) {
      window.app.showToast('התנתקת בהצלחה', 'success');
    }
    
    // Navigate to auth - use direct redirect for multi-page architecture (Story 7.0)
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 300);
  }
  
  /**
   * Static method to check if authenticated
   * @returns {boolean}
   */
  static isAuthenticated() {
    const stateManager = window.stateManager;
    if (!stateManager) {
      return false;
    }
    return stateManager.getState('isAuthenticated') === true && 
           stateManager.getState('sessionToken') !== null;
  }
}
