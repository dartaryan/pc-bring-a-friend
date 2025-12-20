/**
 * PassportCard Refer - Component Base Class
 * Base class for all UI components with lifecycle methods
 */

/* ============================================================================
   COMPONENT BASE CLASS
   ============================================================================
   Base class for all UI components with lifecycle methods
   ========================================================================== */

export class Component {
  constructor(props = {}) {
    this.props = props;
    this._subscriptions = [];
    this._mounted = false;
    this._element = null;
    this._stateManager = null;
  }
  
  /**
   * Sets the state manager reference
   * @param {StateManager} stateManager - State manager instance
   */
  setStateManager(stateManager) {
    this._stateManager = stateManager;
  }
  
  /**
   * Returns the HTML template string
   * Must be implemented by subclasses
   * @returns {string} HTML string
   */
  template() {
    return '';
  }
  
  /**
   * Renders the component and returns HTML
   * @returns {string} Rendered HTML
   */
  render() {
    return this.template();
  }
  
  /**
   * Called after component is inserted into DOM
   * Override to add event listeners or fetch data
   */
  mount() {
    this._mounted = true;
  }
  
  /**
   * Called before component is removed from DOM
   * Cleans up subscriptions and event listeners
   */
  unmount() {
    this._mounted = false;
    
    // Unsubscribe all state listeners
    this._subscriptions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Component: Error unsubscribing', error);
      }
    });
    this._subscriptions = [];
  }
  
  /**
   * Subscribes to state changes with automatic cleanup
   * @param {string} key - State key to watch
   * @param {Function} callback - Called on change
   */
  subscribe(key, callback) {
    if (!this._stateManager) {
      console.warn('Component: No state manager set');
      return () => {};
    }
    const unsubscribe = this._stateManager.subscribe(key, callback);
    this._subscriptions.push(unsubscribe);
    return unsubscribe;
  }
  
  /**
   * Query selector helper scoped to component
   * @param {string} selector - CSS selector
   * @returns {Element|null} Matching element
   */
  $(selector) {
    const container = document.getElementById('main-content');
    return container?.querySelector(selector) || null;
  }
  
  /**
   * Query selector all helper scoped to component
   * @param {string} selector - CSS selector
   * @returns {NodeList} Matching elements
   */
  $$(selector) {
    const container = document.getElementById('main-content');
    return container?.querySelectorAll(selector) || [];
  }
  
  /**
   * Sets the component's root element reference
   * @param {Element} element - DOM element
   */
  setElement(element) {
    this._element = element;
  }
  
  /**
   * Gets the component's root element
   * @returns {Element|null} DOM element
   */
  getElement() {
    return this._element;
  }
  
  /**
   * Checks if component is currently mounted
   * @returns {boolean} Mounted status
   */
  isMounted() {
    return this._mounted;
  }
}
