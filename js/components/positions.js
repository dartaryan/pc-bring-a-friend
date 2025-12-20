/**
 * PassportCard Refer - Positions Component (Story 4.1)
 * Displays list of open positions with filtering and actions
 */

import { Component } from '../core/component.js';
import { renderIcon, debounce } from '../core/utils.js';
import { MOCK_POSITIONS } from '../data/mock-positions.js';
import { MOCK_CAMPAIGNS } from '../data/mock-campaigns.js';

// These will be set by app.js after initialization
let stateManager = null;

/**
 * Initialize module with app dependencies
 * @param {Object} deps - Dependencies object
 */
export function initPositionsModule(deps) {
  stateManager = deps.stateManager;
}

/**
 * PositionsComponent - Displays list of open positions with filtering
 * Implements: Story 4.1 (Positions List)
 */
export class PositionsComponent extends Component {
  constructor(props) {
    super(props);
    this.positions = [];
    this.filteredPositions = [];
    this.isLoading = true;
    
    // Initialize filter state from StateManager
    this.filters = stateManager?.getState('positionFilters') || {
      search: '',
      department: 'all',
      location: 'all'
    };
    
    // Create debounced search handler
    this._debouncedSearch = debounce(this._handleSearchChange.bind(this), 300);
  }
  
  /**
   * Main template for positions page
   * @returns {string} HTML string
   */
  template() {
    return `
      <div class="app-layout">
        <main class="positions-page" role="main">
          <header class="positions-header">
            <h1 class="positions-title">${renderIcon('briefcase')} משרות פתוחות</h1>
            <p class="positions-subtitle">מצאו משרה מתאימה והפנו מועמדים מהרשת שלכם</p>
          </header>
          
          ${this._renderCampaignFilterIndicator()}
          
          ${this._renderFilterBar()}
          
          <div class="positions-results-count" aria-live="polite">
            ${this._renderResultsCount()}
          </div>
          
          <div class="positions-list" id="positions-list" role="list" aria-label="רשימת משרות פתוחות">
            ${this.isLoading ? this._renderSkeletons() : this._renderPositions()}
          </div>
        </main>
      </div>
    `;
  }
  
  /**
   * Renders campaign filter indicator when a campaign filter is active
   * @returns {string} HTML string
   */
  _renderCampaignFilterIndicator() {
    const campaignId = stateManager?.getState('campaignFilter');
    if (!campaignId) return '';
    
    const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
    if (!campaign) return '';
    
    return `
      <div class="positions-filter-indicator">
        <span class="positions-filter-indicator__icon">${campaign.icon}</span>
        <span class="positions-filter-indicator__text">
          מציג משרות מקמפיין: ${campaign.title}
        </span>
        <span class="positions-filter-indicator__multiplier">x${campaign.multiplier} נקודות!</span>
        <button class="positions-filter-indicator__clear"
                data-action="clear-campaign-filter"
                aria-label="נקה סינון קמפיין">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }
  
  /**
   * Renders the filter bar with search and dropdowns
   * @returns {string} HTML string
   */
  _renderFilterBar() {
    const departments = this._getUniqueDepartments();
    const locations = this._getUniqueLocations();
    const hasActiveFilters = this._hasActiveFilters();
    
    return `
      <div class="filter-bar" role="search" aria-label="סינון משרות">
        <div class="filter-bar__search">
          <i class="ti ti-search filter-bar__search-icon" aria-hidden="true"></i>
          <input
            type="text"
            id="position-search"
            class="filter-bar__search-input"
            placeholder="🔍 חיפוש משרה..."
            value="${this._escapeHtml(this.filters.search)}"
            aria-label="חיפוש משרות"
          />
          ${this.filters.search ? `
            <button
              class="filter-bar__clear-search"
              data-action="clear-position-search"
              aria-label="נקה חיפוש"
            >
              <i class="ti ti-x" aria-hidden="true"></i>
            </button>
          ` : ''}
        </div>
        
        <div class="filter-bar__dropdowns">
          <div class="filter-bar__select-wrapper">
            <label for="department-filter" class="visually-hidden">סינון לפי מחלקה</label>
            <select
              id="department-filter"
              class="filter-bar__select"
              aria-label="סינון לפי מחלקה"
            >
              <option value="all">כל המחלקות</option>
              ${departments.map(dept => `
                <option value="${this._escapeHtml(dept)}" ${this.filters.department === dept ? 'selected' : ''}>
                  ${this._escapeHtml(dept)}
                </option>
              `).join('')}
            </select>
          </div>
          
          <div class="filter-bar__select-wrapper">
            <label for="location-filter" class="visually-hidden">סינון לפי מיקום</label>
            <select
              id="location-filter"
              class="filter-bar__select"
              aria-label="סינון לפי מיקום"
            >
              <option value="all">כל המיקומים</option>
              ${locations.map(loc => `
                <option value="${this._escapeHtml(loc)}" ${this.filters.location === loc ? 'selected' : ''}>
                  ${this._escapeHtml(loc)}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
        
        ${hasActiveFilters ? `
          <button
            class="filter-bar__clear-all btn btn--ghost btn--sm"
            data-action="clear-all-position-filters"
            aria-label="נקה את כל הסינונים"
          >
            <i class="ti ti-filter-off" aria-hidden="true"></i>
            נקה הכל
          </button>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Gets unique departments from positions
   * @returns {string[]} Array of unique department names
   */
  _getUniqueDepartments() {
    const depts = new Set(MOCK_POSITIONS.map(p => p.department));
    return Array.from(depts).sort();
  }
  
  /**
   * Gets unique locations from positions
   * @returns {string[]} Array of unique location names
   */
  _getUniqueLocations() {
    const locs = new Set(MOCK_POSITIONS.map(p => p.location));
    return Array.from(locs).sort();
  }
  
  /**
   * Checks if any filters are active
   * @returns {boolean} True if filters are active
   */
  _hasActiveFilters() {
    const hasCampaignFilter = !!stateManager?.getState('campaignFilter');
    return (
      this.filters.search.trim() !== '' ||
      this.filters.department !== 'all' ||
      this.filters.location !== 'all' ||
      hasCampaignFilter
    );
  }
  
  /**
   * Renders the results count
   * @returns {string} HTML string
   */
  _renderResultsCount() {
    if (this.isLoading) return '';
    
    const total = this.positions.length;
    const filtered = this.filteredPositions.length;
    
    if (!this._hasActiveFilters()) {
      return `<span class="results-count">מציג ${total} משרות</span>`;
    }
    
    return `<span class="results-count">מציג ${filtered} מתוך ${total} משרות</span>`;
  }
  
  /**
   * Filters positions based on current filter state
   */
  _filterPositions() {
    let filtered = [...this.positions];
    
    // Filter by campaign (Story 5.4)
    const campaignId = stateManager?.getState('campaignFilter');
    if (campaignId) {
      const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaignId);
      if (campaign) {
        filtered = filtered.filter(position => {
          // If no department restrictions, all positions eligible
          if (!campaign.eligibleDepartments || campaign.eligibleDepartments.length === 0) {
            return true;
          }
          // Check if position's department is eligible
          if (campaign.eligibleDepartments.includes(position.department)) {
            return true;
          }
          // Check specific position IDs
          if (campaign.eligiblePositionIds && campaign.eligiblePositionIds.includes(position.id)) {
            return true;
          }
          return false;
        });
      }
    }
    
    // Filter by search term (title Hebrew + English)
    if (this.filters.search.trim()) {
      const searchLower = this.filters.search.trim().toLowerCase();
      filtered = filtered.filter(position =>
        position.title.toLowerCase().includes(searchLower) ||
        position.titleEn.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by department
    if (this.filters.department !== 'all') {
      filtered = filtered.filter(position =>
        position.department === this.filters.department
      );
    }
    
    // Filter by location
    if (this.filters.location !== 'all') {
      filtered = filtered.filter(position =>
        position.location === this.filters.location
      );
    }
    
    this.filteredPositions = filtered;
  }
  
  /**
   * Gets campaign for a position (if any active)
   * @param {Object} position - Position object
   * @returns {Object|null} Campaign or null
   */
  _getCampaignForPosition(position) {
    const now = new Date();
    return MOCK_CAMPAIGNS.find(campaign => {
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      if (!campaign.isActive || now < start || now > end) return false;
      
      // If no department restrictions, all positions eligible
      if (!campaign.eligibleDepartments || campaign.eligibleDepartments.length === 0) {
        return true;
      }
      // Check if position's department is eligible
      if (campaign.eligibleDepartments.includes(position.department)) {
        return true;
      }
      // Check specific position IDs
      if (campaign.eligiblePositionIds && campaign.eligiblePositionIds.includes(position.id)) {
        return true;
      }
      return false;
    }) || null;
  }
  
  /**
   * Calculates points with campaign multiplier
   * @param {number} basePoints - Base points
   * @param {Object|null} campaign - Campaign object
   * @returns {Object} Points info { base, multiplier, total, hasCampaign }
   */
  _calculatePointsWithCampaign(basePoints, campaign) {
    const multiplier = campaign ? campaign.multiplier : 1;
    return {
      base: basePoints,
      multiplier: multiplier,
      total: Math.floor(basePoints * multiplier),
      hasCampaign: campaign !== null
    };
  }
  
  /**
   * Highlights matching text in a string
   * @param {string} text - Original text
   * @param {string} searchTerm - Term to highlight
   * @returns {string} HTML string with highlights
   */
  _highlightMatch(text, searchTerm) {
    if (!searchTerm.trim()) return this._escapeHtml(text);
    
    const escapedText = this._escapeHtml(text);
    const escapedTerm = this._escapeHtml(searchTerm.trim());
    const regex = new RegExp(`(${this._escapeRegex(escapedTerm)})`, 'gi');
    
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  }
  
  /**
   * Escapes special regex characters
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  /**
   * Renders skeleton placeholders during loading
   * @returns {string} HTML string
   */
  _renderSkeletons() {
    const skeletons = Array(6).fill(0).map(() => `
      <div class="position-card position-card--skeleton" aria-hidden="true">
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text skeleton--short"></div>
        <div class="skeleton skeleton--button"></div>
      </div>
    `).join('');
    
    return skeletons;
  }
  
  /**
   * Renders positions or appropriate empty state
   * @returns {string} HTML string
   */
  _renderPositions() {
    this._filterPositions();
    
    if (this.filteredPositions.length === 0) {
      if (this._hasActiveFilters()) {
        return this._renderNoSearchResults();
      }
      return this._renderEmptyState();
    }
    
    return this.filteredPositions.map(position => 
      this._renderPositionCard(position)
    ).join('');
  }
  
  /**
   * Renders a single position card with optional search highlighting
   * @param {Object} position - Position data
   * @returns {string} HTML string
   */
  _renderPositionCard(position) {
    // Check for active campaign from MOCK_CAMPAIGNS (Story 5.4)
    const activeCampaign = this._getCampaignForPosition(position);
    const pointsInfo = this._calculatePointsWithCampaign(position.bonus, activeCampaign);
    
    // Apply search highlighting to title if search is active
    const displayTitle = this.filters.search.trim()
      ? this._highlightMatch(position.title, this.filters.search)
      : this._escapeHtml(position.title);
    
    return `
      <article class="position-card ${position.isHot ? 'position-card--hot' : ''}"
               data-action="view-position-details"
               data-position-id="${position.id}"
               tabindex="0"
               role="listitem"
               aria-label="${this._escapeHtml(position.title)} - ${this._escapeHtml(position.department)}">
        
        <div class="position-card__badges">
          ${position.isHot ? `
            <span class="badge badge--hot" aria-label="משרה חמה">
              ${renderIcon('flame')} חם!
            </span>
          ` : ''}
          ${activeCampaign ? `
            <span class="badge badge--campaign" 
                  style="--badge-color: ${activeCampaign.accentColor}"
                  aria-label="קמפיין פעיל: ${activeCampaign.title}"
                  title="${activeCampaign.title}">
              ${renderIcon('gift')} x${activeCampaign.multiplier} נקודות!
            </span>
          ` : ''}
        </div>
        
        <div class="position-card__content">
          <h2 class="position-card__title">${displayTitle}</h2>
          
          <div class="position-card__meta">
            <span class="position-card__department">
              <i class="ti ti-building" aria-hidden="true"></i>
              ${this._escapeHtml(position.department)}
            </span>
            <span class="position-card__location">
              <i class="ti ti-map-pin" aria-hidden="true"></i>
              ${this._escapeHtml(position.location)}
            </span>
            ${position.type === 'part-time' ? `
              <span class="position-card__type">
                <i class="ti ti-clock" aria-hidden="true"></i>
                חלקית
              </span>
            ` : ''}
          </div>
          
          <div class="position-card__bonus">
            <span class="position-card__bonus-icon">${renderIcon('coins')}</span>
            ${pointsInfo.hasCampaign ? `
              <span class="position-card__bonus-text points-with-multiplier">
                <span class="points-with-multiplier__base">${pointsInfo.base}</span>
                <span class="points-with-multiplier__multiplier">x${pointsInfo.multiplier}</span>
                <span class="points-with-multiplier__total">= ${pointsInfo.total}</span>
              </span>
            ` : `
              <span class="position-card__bonus-text">
                +${pointsInfo.base} לגיוס מוצלח
              </span>
            `}
          </div>
        </div>
        
        <div class="position-card__actions">
          <button class="btn btn--primary btn--sm position-card__refer-btn"
                  data-action="refer-position"
                  data-position-id="${position.id}"
                  aria-label="הפנה מועמד למשרת ${this._escapeHtml(position.title)}">
            <i class="ti ti-user-plus" aria-hidden="true"></i>
            הפנה מועמד
          </button>
        </div>
      </article>
    `;
  }
  
  /**
   * Renders empty state when no positions available
   * @returns {string} HTML string
   */
  _renderEmptyState() {
    return `
      <div class="positions-empty" role="status">
        <div class="positions-empty__icon" aria-hidden="true">
          <i class="ti ti-briefcase-off"></i>
        </div>
        <h2 class="positions-empty__title">אין משרות פתוחות כרגע</h2>
        <p class="positions-empty__text">בקרוב נוסיף משרות חדשות. חזרו בקרוב!</p>
      </div>
    `;
  }
  
  /**
   * Renders no results state when filters return empty
   * @returns {string} HTML string
   */
  _renderNoSearchResults() {
    const filters = [];
    if (this.filters.search.trim()) {
      filters.push(`"${this._escapeHtml(this.filters.search)}"`);
    }
    if (this.filters.department !== 'all') {
      filters.push(this._escapeHtml(this.filters.department));
    }
    if (this.filters.location !== 'all') {
      filters.push(this._escapeHtml(this.filters.location));
    }
    
    const filterText = filters.join(', ');
    
    return `
      <div class="positions-empty positions-empty--filtered" role="status">
        <div class="positions-empty__icon" aria-hidden="true">
          <i class="ti ti-search-off"></i>
        </div>
        <h2 class="positions-empty__title">לא נמצאו משרות</h2>
        <p class="positions-empty__text">
          לא נמצאו משרות התואמות לחיפוש: ${filterText}
        </p>
        <button
          class="btn btn--secondary positions-empty__clear-btn"
          data-action="clear-all-position-filters"
        >
          <i class="ti ti-filter-off" aria-hidden="true"></i>
          נקה חיפוש
        </button>
      </div>
    `;
  }
  
  /**
   * Handles search input changes (called after debounce)
   * @param {string} value - Search input value
   */
  _handleSearchChange(value) {
    this.filters.search = value;
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Handles department filter changes
   * @param {string} value - Selected department
   */
  _handleDepartmentChange(value) {
    this.filters.department = value;
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Handles location filter changes
   * @param {string} value - Selected location
   */
  _handleLocationChange(value) {
    this.filters.location = value;
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Clears only the search filter
   */
  clearSearch() {
    const searchInput = document.getElementById('position-search');
    if (searchInput) {
      searchInput.value = '';
    }
    this.filters.search = '';
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Clears all filters
   */
  clearAllFilters() {
    const searchInput = document.getElementById('position-search');
    const deptSelect = document.getElementById('department-filter');
    const locSelect = document.getElementById('location-filter');
    
    if (searchInput) searchInput.value = '';
    if (deptSelect) deptSelect.value = 'all';
    if (locSelect) locSelect.value = 'all';
    
    this.filters = {
      search: '',
      department: 'all',
      location: 'all'
    };
    
    this._persistFilters();
    this._updateUI();
  }
  
  /**
   * Persists filter state to StateManager
   */
  _persistFilters() {
    if (stateManager) {
      stateManager.setState({
        positionFilters: { ...this.filters }
      });
    }
  }
  
  /**
   * Updates UI after filter changes
   */
  _updateUI() {
    // Update results count
    const countEl = document.querySelector('.positions-results-count');
    if (countEl) {
      countEl.innerHTML = this._renderResultsCount();
    }
    
    // Update positions list
    const listEl = document.getElementById('positions-list');
    if (listEl) {
      listEl.innerHTML = this._renderPositions();
    }
    
    // Update filter bar (for clear buttons visibility)
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
      filterBar.outerHTML = this._renderFilterBar();
      this._bindFilterEvents();
    }
  }
  
  /**
   * Binds filter-specific events
   */
  _bindFilterEvents() {
    // Search input with debounce
    const searchInput = document.getElementById('position-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this._debouncedSearch(e.target.value);
      });
      
      // Also handle Enter key for immediate search
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this._handleSearchChange(e.target.value);
        }
      });
    }
    
    // Department dropdown
    const deptSelect = document.getElementById('department-filter');
    if (deptSelect) {
      deptSelect.addEventListener('change', (e) => {
        this._handleDepartmentChange(e.target.value);
      });
    }
    
    // Location dropdown
    const locSelect = document.getElementById('location-filter');
    if (locSelect) {
      locSelect.addEventListener('change', (e) => {
        this._handleLocationChange(e.target.value);
      });
    }
  }
  
  /**
   * Loads positions from mock data
   * @returns {Promise<void>}
   */
  async _loadPositions() {
    this.isLoading = true;
    this._updateList();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Load positions from mock data
    this.positions = MOCK_POSITIONS;
    
    // Restore filters from state
    const storedFilters = stateManager?.getState('positionFilters');
    if (storedFilters) {
      this.filters = { ...storedFilters };
    }
    
    this.isLoading = false;
    this._filterPositions();
    
    // Re-render entire component to show filter bar with correct values
    const app = document.getElementById('main-content');
    if (app) {
      app.innerHTML = this.template();
      this.mount();
    }
  }
  
  /**
   * Updates the positions list in DOM
   */
  _updateList() {
    const listEl = document.getElementById('positions-list');
    if (listEl) {
      listEl.innerHTML = this.isLoading ? this._renderSkeletons() : this._renderPositions();
    }
  }
  
  /**
   * Mounts component and loads data
   */
  mount() {
    super.mount();
    this._bindFilterEvents();
    this._setupEventHandlers();
    
    // Only load if not already loaded
    if (this.positions.length === 0) {
      this._loadPositions();
    }
  }
  
  /**
   * Sets up event handlers for card interactions
   */
  _setupEventHandlers() {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const container = document.getElementById('positions-list');
      if (container) {
        // Handle card keyboard interaction
        container.addEventListener('keydown', this._handleCardKeydown.bind(this));
        
        // Handle card click (for non-button areas)
        container.addEventListener('click', this._handleCardClick.bind(this));
      }
    }, 0);
  }
  
  /**
   * Handles keydown events on position cards
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handleCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.position-card');
      if (card && !e.target.matches('button')) {
        e.preventDefault();
        const positionId = card.dataset.positionId;
        if (positionId) {
          this._openPositionDetails(positionId);
        }
      }
    }
  }
  
  /**
   * Handles click events on position cards (but not buttons)
   * @param {MouseEvent} e - Mouse event
   */
  _handleCardClick(e) {
    // Let buttons handle their own clicks via data-action
    if (e.target.matches('button') || e.target.closest('button')) {
      return;
    }
    
    const card = e.target.closest('.position-card');
    if (card && !card.classList.contains('position-card--skeleton')) {
      const positionId = card.dataset.positionId;
      if (positionId) {
        this._openPositionDetails(positionId);
      }
    }
  }
  
  /**
   * Opens position details modal
   * @param {string} positionId - Position ID
   */
  _openPositionDetails(positionId) {
    const position = this.positions.find(p => p.id === positionId);
    if (position && stateManager) {
      stateManager.setState({
        selectedPosition: position,
        activeModal: 'position-details'
      });
      console.log('Position selected:', position.title);
    }
  }
  
  /**
   * Cleanup when component unmounts
   */
  unmount() {
    // Clean up debounce timer
    if (this._debouncedSearch && this._debouncedSearch.cancel) {
      this._debouncedSearch.cancel();
    }
    super.unmount();
  }
}
