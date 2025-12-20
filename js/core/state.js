/**
 * PassportCard Refer - State Manager
 * Centralized state management with pub/sub pattern and localStorage persistence
 */

import { CONFIG } from './config.js';

/* ============================================================================
   STATE MANAGER
   ============================================================================
   Centralized state management with pub/sub pattern and localStorage persistence
   ========================================================================== */

export class StateManager {
  constructor() {
    this._state = this._getInitialState();
    this._listeners = new Map();
    this._loadState();
  }
  
  /**
   * Returns the initial state structure
   * @returns {Object} Initial state object
   */
  _getInitialState() {
    return {
      // Authentication (persisted)
      isAuthenticated: false,
      currentUser: null,
      sessionToken: null,
      
      // Navigation (not persisted)
      currentView: 'auth',
      previousView: null,
      
      // UI State (not persisted)
      isLoading: false,
      activeModal: null,
      toasts: [],
      
      // Data (persisted)
      positions: [],
      referrals: [],
      stamps: [],
      activities: [],
      
      // Filters (not persisted)
      positionFilters: {
        department: 'all',
        location: 'all',
        search: ''
      },
      
      // Referral list state (Story 5.1)
      referralFilter: 'all',
      selectedReferral: null
    };
  }
  
  /**
   * Gets state value(s)
   * @param {string} [key] - Specific key to retrieve, or undefined for full state
   * @returns {*} The state value(s)
   */
  getState(key) {
    if (key === undefined) {
      return { ...this._state };
    }
    
    // Support dot notation for nested keys
    if (key.includes('.')) {
      return key.split('.').reduce((obj, k) => obj?.[k], this._state);
    }
    
    return this._state[key];
  }
  
  /**
   * Updates state and notifies listeners
   * @param {Object} updates - Key-value pairs to update
   */
  setState(updates) {
    const previousState = { ...this._state };
    
    // Merge updates into state
    Object.keys(updates).forEach(key => {
      const value = updates[key];
      // Only deep merge plain objects (not class instances, arrays, or null)
      const isPlainObject = value !== null && 
                            typeof value === 'object' && 
                            !Array.isArray(value) && 
                            value.constructor === Object;
      
      if (isPlainObject && this._state[key] && typeof this._state[key] === 'object') {
        // Deep merge for plain objects only
        this._state[key] = { ...this._state[key], ...value };
      } else {
        // Direct assignment for primitives, arrays, null, and class instances
        this._state[key] = value;
      }
    });
    
    // Notify listeners for changed keys
    Object.keys(updates).forEach(key => {
      if (this._listeners.has(key)) {
        const callbacks = this._listeners.get(key);
        callbacks.forEach(callback => {
          try {
            callback(this._state[key], previousState[key]);
          } catch (error) {
            console.error(`StateManager: Error in listener for "${key}"`, error);
          }
        });
      }
    });
    
    // Notify wildcard listeners
    if (this._listeners.has('*')) {
      this._listeners.get('*').forEach(callback => {
        try {
          callback(this._state, previousState);
        } catch (error) {
          console.error('StateManager: Error in wildcard listener', error);
        }
      });
    }
    
    // Persist relevant keys
    this.persistState();
  }
  
  /**
   * Subscribes to state changes
   * @param {string} key - State key to watch (or '*' for all changes)
   * @param {Function} callback - Called with (newValue, oldValue)
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    
    this._listeners.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this._listeners.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this._listeners.delete(key);
        }
      }
    };
  }
  
  /**
   * Persists specified state keys to localStorage (debounced for performance)
   * Uses lazy initialization since debounce is defined later in the file
   */
  persistState() {
    // Lazy initialize debounced persist function
    if (!this._debouncedPersist) {
      this._debouncedPersist = this._createDebouncedPersist();
    }
    this._debouncedPersist();
  }
  
  /**
   * Creates debounced persist function (100ms debounce for batching rapid updates)
   * @private
   */
  _createDebouncedPersist() {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this._persistStateImmediate();
      }, 100);
    };
  }
  
  /**
   * Immediately persists state to localStorage (called by debounced function)
   * @private
   */
  _persistStateImmediate() {
    try {
      const stateToPersist = {};
      CONFIG.PERSIST_KEYS.forEach(key => {
        stateToPersist[key] = this._state[key];
      });
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (error) {
      console.warn('StateManager: Failed to persist state', error);
    }
  }
  
  /**
   * Loads persisted state from localStorage
   */
  _loadState() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!stored) return;
      
      const parsed = JSON.parse(stored);
      
      // Only restore persisted keys
      CONFIG.PERSIST_KEYS.forEach(key => {
        if (parsed.hasOwnProperty(key)) {
          this._state[key] = parsed[key];
        }
      });
      
      // Validate the restored session
      if (!this._validateSession()) {
        console.warn('StateManager: Invalid session detected, clearing...');
        this._clearSession();
      }
    } catch (error) {
      console.warn('StateManager: Failed to load state, clearing session:', error);
      this._clearSession();
    }
  }
  
  /**
   * Validates the current session state
   * @returns {boolean} True if session is valid
   */
  _validateSession() {
    const state = this._state;
    
    // If not marked as authenticated, no validation needed
    if (!state.isAuthenticated) {
      return true; // Not authenticated is a valid state
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
  
  /**
   * Clears all session-related state
   */
  _clearSession() {
    // Reset auth-related state
    this._state.isAuthenticated = false;
    this._state.currentUser = null;
    this._state.sessionToken = null;
    this._state.referrals = [];
    this._state.stamps = [];
    this._state.pendingEmail = null;
    
    // Clear localStorage
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (error) {
      console.warn('StateManager: Failed to clear localStorage', error);
    }
  }
  
  /**
   * Clears all persisted state (for logout)
   */
  clearPersistedState() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      // Reset persisted keys to initial values
      const initial = this._getInitialState();
      const updates = {};
      CONFIG.PERSIST_KEYS.forEach(key => {
        updates[key] = initial[key];
      });
      this.setState(updates);
    } catch (error) {
      console.warn('StateManager: Failed to clear persisted state', error);
    }
  }
}

// Global StateManager singleton instance
export const stateManager = new StateManager();
