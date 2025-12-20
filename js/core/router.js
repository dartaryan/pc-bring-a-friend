/**
 * PassportCard Refer - Router
 * Hash-based routing with authentication guards
 */

import { CONFIG } from './config.js';
import { stateManager } from './state.js';

/* ============================================================================
   ROUTER
   ============================================================================
   Hash-based routing with authentication guards
   ========================================================================== */

export class Router {
  constructor(stateManager) {
    this._stateManager = stateManager;
    this._routes = CONFIG.ROUTES;
    this._currentRoute = null;
    this._currentPage = this._detectCurrentPage();
    this._init();
  }
  
  /**
   * Detects the current page from data-page attribute or URL
   * @returns {string} Current page name
   */
  _detectCurrentPage() {
    // First try data-page attribute on body
    const bodyPage = document.body?.dataset?.page;
    if (bodyPage) {
      return bodyPage;
    }
    
    // Fallback to URL path parsing
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '') || 'index';
  }
  
  /**
   * Gets the page HTML file for a route
   * @param {string} routeName - Route name
   * @returns {string} Page filename (without .html)
   */
  _getPageForRoute(routeName) {
    const routeConfig = this._routes[routeName];
    return routeConfig?.page || 'index';
  }
  
  /**
   * Initializes the router
   */
  _init() {
    // Listen to hash changes
    window.addEventListener('hashchange', () => this._handleHashChange());
    
    // Handle initial route
    this._handleHashChange();
  }
  
  /**
   * Gets the current route from URL hash
   * @returns {string} Route name
   */
  _parseHash() {
    const hash = window.location.hash.slice(1);
    
    // If no hash, get default route for current page
    if (!hash) {
      const pageRoute = CONFIG.PAGE_ROUTES[this._currentPage];
      return pageRoute || CONFIG.DEFAULT_ROUTE;
    }
    
    return hash.split('?')[0]; // Remove query params if any
  }
  
  /**
   * Checks authentication state and determines redirect if needed
   * @param {string} routeName - Requested route
   * @returns {string} Target route (may differ from routeName if redirect needed)
   */
  _checkAuth(routeName) {
    const routeConfig = this._routes[routeName];
    const isAuthenticated = this._stateManager.getState('isAuthenticated');
    
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
  
  /**
   * Handles hash change events
   */
  _handleHashChange() {
    const route = this._parseHash();
    
    // Check if route exists
    if (!this._routes[route]) {
      this.navigate(CONFIG.DEFAULT_ROUTE, { replace: true });
      return;
    }
    
    // Apply route guards (auth checks)
    const targetRoute = this._checkAuth(route);
    
    if (targetRoute !== route) {
      // Route was redirected by guard - navigate to target
      this.navigate(targetRoute, { replace: true });
      return;
    }
    
    // Check if route requires page navigation
    const targetPage = this._getPageForRoute(targetRoute);
    if (targetPage !== this._currentPage && this._currentPage !== 'index') {
      // Need to navigate to different page
      this._navigateToPage(targetPage, targetRoute);
      return;
    }
    
    // Same page navigation - update state
    const previousView = this._stateManager.getState('currentView');
    this._currentRoute = targetRoute;
    
    this._stateManager.setState({
      currentView: targetRoute,
      previousView: previousView
    });
  }
  
  /**
   * Navigates to a different HTML page
   * @param {string} page - Target page name
   * @param {string} route - Route to set on target page
   */
  _navigateToPage(page, route) {
    // Build URL with hash for the route
    const pageUrl = `${page}.html#${route}`;
    window.location.href = pageUrl;
  }
  
  /**
   * Navigates to a route with route guards applied
   * Handles cross-page navigation automatically
   * @param {string} route - Route name
   * @param {Object} [options] - Navigation options
   */
  navigate(route, options = {}) {
    const { replace = false } = options;
    
    // Check if route exists
    if (!this._routes[route]) {
      console.warn(`Router: Unknown route "${route}", redirecting to default`);
      route = CONFIG.DEFAULT_ROUTE;
    }
    
    // Check if we need to go to a different page
    const targetPage = this._getPageForRoute(route);
    
    if (targetPage !== this._currentPage && this._currentPage !== 'index') {
      // Cross-page navigation
      this._navigateToPage(targetPage, route);
      return;
    }
    
    // Same page navigation - use hash
    if (replace) {
      window.location.replace(`#${route}`);
    } else {
      window.location.hash = route;
    }
  }
  
  /**
   * Gets current route name
   * @returns {string} Current route
   */
  getCurrentRoute() {
    return this._currentRoute || this._parseHash();
  }
  
  /**
   * Gets route configuration
   * @param {string} route - Route name
   * @returns {Object|null} Route config or null
   */
  getRouteConfig(route) {
    return this._routes[route] || null;
  }
  
  /**
   * Gets current page name
   * @returns {string} Current page
   */
  getCurrentPage() {
    return this._currentPage;
  }
}

// Global Router singleton instance
export const router = new Router(stateManager);
