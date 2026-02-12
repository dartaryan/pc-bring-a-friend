# Story 4.2: Position Filters & Search

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to filter and search positions,
**So that** I can quickly find relevant roles for my network.

## Acceptance Criteria

### AC1: Filter Bar Display
**Given** I am on the positions page
**When** I view the filter bar
**Then** I see a search input with placeholder "🔍 חיפוש משרה..."
**And** I see a department dropdown filter
**And** I see optional location filter
**And** the filter bar is positioned above the positions list

### AC2: Search Debounce Behavior
**Given** I type in the search field
**When** I enter text
**Then** the list filters after 300ms debounce (not immediately)
**And** positions matching the search term (title Hebrew or English) are shown
**And** non-matching positions are hidden

### AC3: Search Highlight Matching Text
**Given** search results are displayed
**When** I view matching cards
**Then** the matching text is highlighted in the position title
**And** the highlight uses a distinct background color

### AC4: Search No Results State
**Given** I search for something with no results
**When** the list filters
**Then** I see an empty state message with search context
**And** I see a "נקה חיפוש" (Clear Search) option
**And** clicking clear returns all positions

### AC5: Department Filter Selection
**Given** I select a department from the dropdown
**When** I choose "פיתוח" (Development)
**Then** only development positions are shown
**And** the filter shows the selected value
**And** the "All Departments" option is always available

### AC6: Location Filter Selection
**Given** I select a location from the dropdown
**When** I choose "תל אביב"
**Then** only positions in Tel Aviv are shown
**And** the filter shows the selected value

### AC7: Multiple Filters Combined
**Given** I have department "פיתוח" and search "Backend" active
**When** I view results
**Then** only positions matching BOTH criteria are shown
**And** the results count updates accordingly

### AC8: Clear All Filters
**Given** I have multiple filters active
**When** I click "נקה הכל" (Clear All) button
**Then** all filters reset to default
**And** all positions are shown again
**And** search input is cleared

### AC9: Results Count Display
**Given** filters are applied
**When** I view the results
**Then** I see "מציג X משרות" (Showing X positions) count
**And** the count updates in real-time as filters change

### AC10: Filter Persistence During Session
**Given** I have filters applied
**When** I navigate away and return to positions page
**Then** my filters are preserved (within session)
**And** the same results are displayed

### AC11: Accessibility
**Given** I use keyboard navigation
**When** navigating the filter controls
**Then** I can tab through search and dropdowns
**And** dropdown menus are keyboard accessible
**And** filter controls have proper ARIA labels
**And** screen reader announces filter changes

## Tasks / Subtasks

- [x] Task 1: Add filter bar HTML to PositionsComponent (AC: #1)
  - [x] Add search input with magnifying glass icon
  - [x] Add department dropdown with all unique departments
  - [x] Add location dropdown with all unique locations
  - [x] Add clear all button (hidden when no filters active)
  - [x] Add results count display

- [x] Task 2: Implement search with debounce (AC: #2, #3)
  - [x] Add debounce utility function (300ms)
  - [x] Implement search filter logic for title (Hebrew + English)
  - [x] Add text highlighting function for matched terms
  - [x] Update _renderPositionCard to apply highlights

- [x] Task 3: Implement dropdown filters (AC: #5, #6)
  - [x] Extract unique departments from MOCK_POSITIONS
  - [x] Extract unique locations from MOCK_POSITIONS
  - [x] Implement department filter logic
  - [x] Implement location filter logic

- [x] Task 4: Combine filters and update results (AC: #7, #9)
  - [x] Create filterPositions() method combining all filters
  - [x] Update _renderPositions to use filtered list
  - [x] Add real-time results count update
  - [x] Handle combined filter logic (AND operation)

- [x] Task 5: Implement clear functionality (AC: #4, #8)
  - [x] Add clearSearch() method
  - [x] Add clearAllFilters() method
  - [x] Update filter state management
  - [x] Show/hide clear buttons based on state

- [x] Task 6: Handle no results state (AC: #4)
  - [x] Create _renderNoSearchResults() method
  - [x] Display search context in empty message
  - [x] Add clear search CTA button

- [x] Task 7: Wire events and state (AC: #10)
  - [x] Bind input events to filter handlers
  - [x] Store filter state in StateManager
  - [x] Restore filters on mount

- [x] Task 8: Add CSS styles for filters (AC: all)
  - [x] Style filter bar container
  - [x] Style search input with icon
  - [x] Style dropdown selects
  - [x] Style results count
  - [x] Style text highlight
  - [x] Style clear buttons
  - [x] Add responsive layout for filters

- [x] Task 9: Add accessibility features (AC: #11)
  - [x] Add ARIA labels to all filter controls
  - [x] Ensure keyboard navigation works
  - [x] Add aria-live for results count updates
  - [x] Test with screen reader

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story extends Story 4.1's PositionsComponent - do NOT create a new component.**

**Filter State Structure (add to StateManager):**

```javascript
// ============================================
// STATE MANAGEMENT - Position Filters (update initialState)
// ============================================

const initialState = {
  // ... existing state ...
  
  // Position filters - add these
  positionFilters: {
    search: '',
    department: 'all',  // 'all' means no filter
    location: 'all'     // 'all' means no filter
  }
};
```

**Debounce Utility (if not already exists):**

```javascript
// ============================================
// UTILITY FUNCTIONS - Add debounce
// ============================================

/**
 * Creates a debounced version of a function
 * @param {Function} fn - Function to debounce
 * @param {number} ms - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(fn, ms) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}
```

**Updated PositionsComponent with Filters:**

```javascript
// ============================================
// COMPONENTS - Positions (update existing)
// ============================================

class PositionsComponent extends Component {
  constructor(props) {
    super(props);
    this.positions = [];
    this.filteredPositions = [];
    this.isLoading = true;
    
    // Initialize filter state from StateManager
    this.filters = stateManager.getState('positionFilters') || {
      search: '',
      department: 'all',
      location: 'all'
    };
    
    // Create debounced search handler
    this._debouncedSearch = debounce(this._handleSearchChange.bind(this), 300);
  }
  
  template() {
    return `
      <main class="positions-page">
        <header class="positions-header">
          <h1 class="positions-title">💼 משרות פתוחות</h1>
          <p class="positions-subtitle">מצאו משרה מתאימה והפנו מועמדים מהרשת שלכם</p>
        </header>
        
        ${this._renderFilterBar()}
        
        <div class="positions-results-count" aria-live="polite">
          ${this._renderResultsCount()}
        </div>
        
        <div class="positions-list" id="positions-list">
          ${this.isLoading ? this._renderSkeletons() : this._renderPositions()}
        </div>
      </main>
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
      <div class="filter-bar">
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
                <option value="${dept}" ${this.filters.department === dept ? 'selected' : ''}>
                  ${dept}
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
                <option value="${loc}" ${this.filters.location === loc ? 'selected' : ''}>
                  ${loc}
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
    return (
      this.filters.search.trim() !== '' ||
      this.filters.department !== 'all' ||
      this.filters.location !== 'all'
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
   * Renders a position card with optional search highlighting
   * @param {Object} position - Position data
   * @returns {string} HTML string
   */
  _renderPositionCard(position) {
    const effectiveBonus = position.campaign 
      ? Math.round(position.bonus * position.campaign.multiplier) 
      : position.bonus;
    
    // Apply search highlighting to title if search is active
    const displayTitle = this.filters.search.trim()
      ? this._highlightMatch(position.title, this.filters.search)
      : this._escapeHtml(position.title);
    
    return `
      <article class="position-card ${position.isHot ? 'position-card--hot' : ''}"
               data-action="view-position-details"
               data-position-id="${position.id}"
               tabindex="0"
               role="button"
               aria-label="${position.title} - ${position.department}">
        
        <div class="position-card__badges">
          ${position.isHot ? `
            <span class="badge badge--hot" aria-label="משרה חמה">
              🔥 חם!
            </span>
          ` : ''}
          ${position.campaign ? `
            <span class="badge badge--campaign" aria-label="קמפיין פעיל">
              🎁 x${position.campaign.multiplier} נקודות!
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
            <span class="position-card__bonus-icon" aria-hidden="true">💰</span>
            <span class="position-card__bonus-text">
              +${effectiveBonus} לגיוס מוצלח
            </span>
          </div>
        </div>
        
        <div class="position-card__actions">
          <button class="btn btn--primary btn--sm position-card__refer-btn"
                  data-action="refer-position"
                  data-position-id="${position.id}"
                  onclick="event.stopPropagation()">
            <i class="ti ti-user-plus" aria-hidden="true"></i>
            הפנה מועמד
          </button>
        </div>
      </article>
    `;
  }
  
  /**
   * Renders no results state when filters return empty
   * @returns {string} HTML string
   */
  _renderNoSearchResults() {
    const filters = [];
    if (this.filters.search.trim()) {
      filters.push(`"${this.filters.search}"`);
    }
    if (this.filters.department !== 'all') {
      filters.push(this.filters.department);
    }
    if (this.filters.location !== 'all') {
      filters.push(this.filters.location);
    }
    
    const filterText = filters.join(', ');
    
    return `
      <div class="positions-empty positions-empty--filtered">
        <div class="positions-empty__icon" aria-hidden="true">
          <i class="ti ti-search-off"></i>
        </div>
        <h2 class="positions-empty__title">לא נמצאו משרות</h2>
        <p class="positions-empty__text">
          לא נמצאו משרות התואמות לחיפוש: ${this._escapeHtml(filterText)}
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
  _clearSearch() {
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
  _clearAllFilters() {
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
    stateManager.setState({
      positionFilters: { ...this.filters }
    });
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
   * Loads positions and applies stored filters
   */
  async _loadPositions() {
    this.isLoading = true;
    this._updateList();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Load positions from mock data
    this.positions = MOCK_POSITIONS;
    
    // Restore filters from state
    const storedFilters = stateManager.getState('positionFilters');
    if (storedFilters) {
      this.filters = { ...storedFilters };
    }
    
    this.isLoading = false;
    this._filterPositions();
    
    // Re-render entire component to show filter bar with correct values
    const app = document.getElementById('app');
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
  
  mount() {
    this._bindFilterEvents();
    this.bindEvents();
    
    // Only load if not already loaded
    if (this.positions.length === 0) {
      this._loadPositions();
    }
  }
  
  bindEvents() {
    // Handle card keyboard interaction
    const container = document.getElementById('positions-list');
    if (container) {
      container.addEventListener('keydown', (e) => {
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
      });
    }
  }
  
  _openPositionDetails(positionId) {
    const position = this.positions.find(p => p.id === positionId);
    if (position) {
      stateManager.setState({
        selectedPosition: position,
        activeModal: 'position-details'
      });
    }
  }
  
  unmount() {
    // Clean up debounce timer
    if (this._debouncedSearch && this._debouncedSearch.cancel) {
      this._debouncedSearch.cancel();
    }
    super.unmount();
  }
}
```

**Action Handlers (add to existing):**

```javascript
// ============================================
// ACTION HANDLERS - Position Filters (add to existing)
// ============================================

// Clear position search
app.registerAction('clear-position-search', () => {
  const component = app.currentComponent;
  if (component && typeof component._clearSearch === 'function') {
    component._clearSearch();
  }
});

// Clear all position filters
app.registerAction('clear-all-position-filters', () => {
  const component = app.currentComponent;
  if (component && typeof component._clearAllFilters === 'function') {
    component._clearAllFilters();
  }
});
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   FILTER BAR (Story 4.2)
   ========================================================================= */

.filter-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* Search Input */
.filter-bar__search {
  position: relative;
  flex: 1;
}

.filter-bar__search-icon {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 1.25rem;
  pointer-events: none;
}

.filter-bar__search-input {
  width: 100%;
  padding: var(--space-3) var(--space-10);
  padding-right: var(--space-10);
  font-size: var(--text-base);
  font-family: inherit;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--text-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filter-bar__search-input::placeholder {
  color: var(--text-muted);
}

.filter-bar__search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(225, 5, 20, 0.15);
}

.filter-bar__clear-search {
  position: absolute;
  left: var(--space-2);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.filter-bar__clear-search:hover {
  background: var(--color-surface-hover);
  color: var(--text-primary);
}

.filter-bar__clear-search:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Dropdowns */
.filter-bar__dropdowns {
  display: flex;
  gap: var(--space-3);
}

.filter-bar__select-wrapper {
  flex: 1;
  min-width: 0;
}

.filter-bar__select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-family: inherit;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2.5 4.5L6 8l3.5-3.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left var(--space-3) center;
  padding-left: var(--space-8);
}

.filter-bar__select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.filter-bar__select:focus-visible {
  box-shadow: 0 0 0 3px rgba(225, 5, 20, 0.15);
}

/* Clear All Button */
.filter-bar__clear-all {
  align-self: flex-start;
  white-space: nowrap;
}

/* Tablet: Horizontal layout */
@media (min-width: 600px) {
  .filter-bar {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .filter-bar__search {
    flex: 2;
    min-width: 200px;
  }
  
  .filter-bar__dropdowns {
    flex: 1;
    min-width: 300px;
  }
}

/* Desktop: Single row */
@media (min-width: 1024px) {
  .filter-bar {
    flex-wrap: nowrap;
  }
  
  .filter-bar__search {
    flex: 2;
    max-width: 400px;
  }
  
  .filter-bar__dropdowns {
    flex: 1;
  }
}

/* =========================================================================
   RESULTS COUNT
   ========================================================================= */

.positions-results-count {
  margin-bottom: var(--space-4);
  padding: 0 var(--space-1);
}

.results-count {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  direction: rtl;
}

/* =========================================================================
   SEARCH HIGHLIGHT
   ========================================================================= */

.search-highlight {
  background: linear-gradient(
    135deg,
    rgba(241, 196, 15, 0.4) 0%,
    rgba(241, 196, 15, 0.2) 100%
  );
  color: inherit;
  padding: 0 2px;
  border-radius: 2px;
}

/* =========================================================================
   NO RESULTS STATE (Filtered)
   ========================================================================= */

.positions-empty--filtered .positions-empty__icon {
  color: var(--color-primary);
}

.positions-empty__clear-btn {
  margin-top: var(--space-4);
}

/* =========================================================================
   VISUALLY HIDDEN (Accessibility)
   ========================================================================= */

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* =========================================================================
   REDUCED MOTION - Filter Transitions
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .filter-bar__search-input,
  .filter-bar__select,
  .filter-bar__clear-search {
    transition: none;
  }
}
```

### State Keys Used

| Key | Type | Description |
|-----|------|-------------|
| `positionFilters` | Object | `{ search, department, location }` filter state |
| `positionFilters.search` | String | Current search term |
| `positionFilters.department` | String | Selected department or 'all' |
| `positionFilters.location` | String | Selected location or 'all' |

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border` | `#E5E7EB` | Input borders |
| `--color-primary` | `#E10514` | Focus states |
| `--radius-md` | `8px` | Input corners |
| `--space-3` | `12px` | Input padding |
| `--space-4` | `16px` | Filter bar padding |
| Debounce delay | `300ms` | Search typing delay |
| Highlight color | `#F1C40F` (gold) | Search text highlight |

### Dependencies

**From Previous Stories:**
- PositionsComponent (Story 4.1) - **extending this component**
- Component base class (Story 1.1)
- StateManager with subscribe/setState (Story 1.1)
- Action handler pattern (Story 1.1)
- debounce utility (may need to add if not exists)
- MOCK_POSITIONS constant (Story 4.1)
- Button styles (.btn, .btn--ghost) (Story 1.2)

**Creates Foundation For:**
- Story 4.3: Position Details Modal (uses filtered positions)
- Story 4.4: Share Referral Link (uses position data)
- Story 4.5: Referral Form (uses referringPosition state)

### Integration Points

**Files to Modify:**
- `script.js`:
  - Add/verify `debounce()` utility function (~10 lines)
  - Update `initialState` to include `positionFilters` (~5 lines)
  - **Replace** PositionsComponent class with updated version (~300 lines changed/added)
  - Add filter action handlers (~15 lines)
- `style.css`:
  - Add filter bar styles (~150 lines)
  - Add search highlight styles (~15 lines)
  - Add results count styles (~15 lines)
  - Add visually-hidden utility (~15 lines)

**No new files created.**

### Testing Scenarios

1. **Filter Bar Display:**
   - Navigate to `#positions` → Filter bar visible above cards
   - Search input has placeholder
   - Department dropdown has all unique departments
   - Location dropdown has all unique locations

2. **Search Functionality:**
   - Type "Full" → Wait 300ms → Only matching positions shown
   - Type "מפתח" → Hebrew search works
   - Matching text is highlighted in yellow
   - Clear icon appears when search has text
   - Click clear icon → Search cleared, all positions shown

3. **Department Filter:**
   - Select "פיתוח" → Only development positions shown
   - Select "כל המחלקות" → Filter removed
   - Dropdown shows selected value

4. **Location Filter:**
   - Select "תל אביב" → Only Tel Aviv positions shown
   - Works in combination with other filters

5. **Combined Filters:**
   - Search "Backend" + Department "פיתוח" → Only matching both
   - Results count updates correctly
   - Clear All removes all filters at once

6. **No Results State:**
   - Search for "xyz123" → Shows "לא נמצאו משרות"
   - Shows the search/filter context
   - Clear button visible and works

7. **Results Count:**
   - Shows "מציג X משרות" when no filters
   - Shows "מציג X מתוך Y משרות" when filtered

8. **Filter Persistence:**
   - Apply filters → Navigate to dashboard → Return to positions
   - Filters should be preserved (same session)

9. **Keyboard Navigation:**
   - Tab to search → Can type
   - Tab to dropdowns → Can select with arrow keys
   - Tab to clear button → Enter activates

10. **Accessibility:**
    - Screen reader announces filter controls
    - Results count has aria-live for updates
    - All controls have proper labels

### Previous Story Intelligence

**From Story 4.1:**
- PositionsComponent structure established
- MOCK_POSITIONS data structure with `title`, `titleEn`, `department`, `location`
- Position card rendering pattern
- Skeleton loading pattern
- Empty state pattern
- Uses event delegation with `data-action` attributes

**Key patterns to maintain:**
- Use `_escapeHtml()` for all user-facing text
- Use `data-action` attributes for button actions
- Maintain RTL-aware CSS (logical properties)
- Follow BEM naming convention for CSS classes
- Numbers use `direction: ltr; unicode-bidi: isolate;`

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- This story modifies existing PositionsComponent (no new component)
- Filter state persisted in StateManager (session-only, not LocalStorage)
- Debounce utility may be shared by other components later

### References

- [Source: docs/architecture.md#3.3] - State management pattern
- [Source: docs/architecture.md#4.2] - CSS naming patterns
- [Source: docs/architecture.md#4.6] - State update patterns
- [Source: docs/epics.md#story-42] - Original acceptance criteria
- [Source: docs/PRD.md#FR-POS-002] - Position filter requirements
- [Source: docs/PRD.md#FR-POS-003] - Position search requirements
- [Source: docs/project_context.md] - Implementation rules
- [Source: docs/sprint-artifacts/4-1-position-list-view.md] - Previous story patterns

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/epics.md (complete - Epic 4, Story 4.2)
- docs/PRD.md (FR-POS-002, FR-POS-003 requirements)
- docs/project_context.md (implementation rules)
- docs/sprint-status.yaml (current status)
- docs/sprint-artifacts/4-1-position-list-view.md (previous story patterns)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created with:
- Complete filter bar implementation pattern
- Debounce search functionality
- Text highlighting for search matches
- Multi-filter combination logic
- State persistence during session
- Full accessibility support
- Responsive CSS for all breakpoints

**Implementation Completed (2025-12-10):**
- Added `debounce()` utility function with cancel support
- Extended PositionsComponent with filteredPositions array and filter state
- Implemented `_renderFilterBar()` with search input, department/location dropdowns
- Added `_getUniqueDepartments()` and `_getUniqueLocations()` to extract filter options
- Implemented `_filterPositions()` combining search, department, and location filters
- Added `_highlightMatch()` for search term highlighting in position titles
- Created `_renderNoSearchResults()` for empty filtered state
- Implemented filter change handlers with debounced search (300ms)
- Added `clearSearch()` and `clearAllFilters()` methods
- State persistence via StateManager `positionFilters` key
- Registered `clear-position-search` and `clear-all-position-filters` action handlers
- Full accessibility: ARIA labels, visually-hidden labels, aria-live for results count
- Responsive CSS: mobile column layout → tablet horizontal → desktop single row
- Reduced motion support for filter transitions

### File List

Files modified:
- `script.js`:
  - Added debounce utility function (16 lines, line ~2227)
  - Extended PositionsComponent class (~400 lines added/modified, lines 4730-5300)
  - Added 2 action handlers for clear filters (12 lines, lines 6314-6326)
- `style.css`:
  - Added filter bar styles (~120 lines)
  - Added results count styles (~12 lines)
  - Added search highlight styles (~12 lines)
  - Added visually-hidden utility (~12 lines)
  - Added reduced motion support (~8 lines)
  - Total: ~165 lines added after positions header section

No new files created.

Extends:
- Story 4.1: Position List View (PositionsComponent)

Creates foundation for:
- Story 4.3: Position Details Modal
- Story 4.4: Share Referral Link
- Story 4.5: Referral Form & Resume Upload

### Change Log

- 2025-12-10: Story implementation complete - all 9 tasks completed, all 11 ACs satisfied

