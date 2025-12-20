/**
 * PassportCard Refer - Referrals Components
 * Status Pipeline and Referrals listing (Story 5.1, 5.2)
 */

import { Component } from '../core/component.js';
import { REFERRAL_STATUS_CONFIG, PIPELINE_STAGES, STAGE_INDEX } from '../data/status-config.js';
import { MOCK_REFERRALS } from '../data/mock-referrals.js';
import { renderIcon } from '../core/utils.js';

/* ============================================================================
   STATUS PIPELINE COMPONENT (Story 5.2)
   ============================================================================
   Reusable pipeline visualization component for referral progress.
   Supports 'mini' (for cards) and 'full' (for modals) size variants.
   ========================================================================== */

/**
 * StatusPipeline - Reusable pipeline visualization component
 * 
 * @param {Object} props
 * @param {string} props.status - Current referral status
 * @param {string} props.size - 'mini' | 'full' (default: 'mini')
 * @param {boolean} props.isRejected - Whether the referral was rejected
 * @param {number} props.rejectionStage - Stage index where rejection occurred
 */
export class StatusPipeline {
  constructor(props = {}) {
    this.status = props.status || 'submitted';
    this.size = props.size || 'mini';
    this.isRejected = props.isRejected || this.status === 'rejected';
    this.rejectionStage = props.rejectionStage;
  }
  
  /**
   * Main render method
   * @returns {string} HTML string
   */
  render() {
    const currentIndex = this._getCurrentStageIndex();
    const stages = PIPELINE_STAGES;
    const sizeClass = `status-pipeline--${this.size}`;
    
    // Calculate progress percentage for accessibility
    const progressText = this.isRejected 
      ? `נדחה בשלב ${currentIndex + 1} מתוך ${stages.length}` 
      : `שלב ${currentIndex + 1} מתוך ${stages.length}, ${stages[currentIndex]?.label || stages[0].label}`;
    
    return `
      <div class="status-pipeline ${sizeClass} ${this.isRejected ? 'status-pipeline--rejected' : ''}"
           role="progressbar"
           aria-valuenow="${currentIndex + 1}"
           aria-valuemin="1"
           aria-valuemax="${stages.length}"
           aria-label="${progressText}"
           aria-valuetext="${progressText}">
        <div class="status-pipeline__track">
          ${stages.map((stage, index) => this._renderStage(stage, index, currentIndex)).join('')}
        </div>
        ${this.size === 'full' ? this._renderLabels(stages, currentIndex) : ''}
      </div>
    `;
  }
  
  /**
   * Gets the current stage index from status
   * @returns {number} Stage index
   */
  _getCurrentStageIndex() {
    // If rejected, find where in the pipeline it stopped
    if (this.isRejected && this.rejectionStage !== undefined) {
      return Math.min(this.rejectionStage, PIPELINE_STAGES.length - 1);
    }
    
    // Handle rejected status - default to review if no specific stage
    if (this.status === 'rejected') {
      return 1; // Default rejection after review
    }
    
    const index = STAGE_INDEX[this.status];
    return index !== undefined ? index : 0;
  }
  
  /**
   * Renders a single pipeline stage
   * @param {Object} stage - Stage configuration
   * @param {number} index - Stage index
   * @param {number} currentIndex - Current progress index
   * @returns {string} HTML string
   */
  _renderStage(stage, index, currentIndex) {
    const stateClass = this._getStageStateClass(index, currentIndex);
    const isFirst = index === 0;
    
    // Determine icon to display
    let iconHtml;
    if (this.isRejected && index === currentIndex) {
      iconHtml = '<i class="ti ti-x" aria-hidden="true"></i>';
    } else if (index < currentIndex || (index === currentIndex && this.status === 'hired')) {
      iconHtml = '<i class="ti ti-check" aria-hidden="true"></i>';
    } else if (this.size === 'full' && index === currentIndex && !this.isRejected) {
      iconHtml = `<i class="ti ${stage.icon}" aria-hidden="true"></i>`;
    } else {
      iconHtml = '';
    }
    
    return `
      ${!isFirst ? this._renderConnector(index, currentIndex) : ''}
      <div class="status-pipeline__stage ${stateClass}"
           ${index === currentIndex ? 'aria-current="step"' : ''}>
        <div class="status-pipeline__circle">
          ${iconHtml}
        </div>
      </div>
    `;
  }
  
  /**
   * Gets the CSS class for stage state
   * @param {number} index - Stage index
   * @param {number} currentIndex - Current progress index
   * @returns {string} CSS class
   */
  _getStageStateClass(index, currentIndex) {
    if (this.isRejected) {
      if (index < currentIndex) {
        return 'status-pipeline__stage--completed';
      } else if (index === currentIndex) {
        return 'status-pipeline__stage--rejected';
      }
      return 'status-pipeline__stage--pending';
    }
    
    if (index < currentIndex) {
      return 'status-pipeline__stage--completed';
    } else if (index === currentIndex) {
      return 'status-pipeline__stage--current';
    }
    return 'status-pipeline__stage--pending';
  }
  
  /**
   * Renders connector line between stages
   * @param {number} index - Stage index (after connector)
   * @param {number} currentIndex - Current progress index
   * @returns {string} HTML string
   */
  _renderConnector(index, currentIndex) {
    let connectorClass = 'status-pipeline__connector';
    
    if (index <= currentIndex) {
      connectorClass += ' status-pipeline__connector--completed';
    }
    
    return `<div class="${connectorClass}" aria-hidden="true"></div>`;
  }
  
  /**
   * Renders stage labels for full size variant
   * @param {Array} stages - Pipeline stages
   * @param {number} currentIndex - Current progress index
   * @returns {string} HTML string
   */
  _renderLabels(stages, currentIndex) {
    return `
      <div class="status-pipeline__labels" aria-hidden="true">
        ${stages.map((stage, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex || (this.status === 'hired' && index === currentIndex);
          const isRejectedStage = this.isRejected && index === currentIndex;
          
          let labelClass = 'status-pipeline__label';
          if (isActive) labelClass += ' status-pipeline__label--active';
          if (isCompleted) labelClass += ' status-pipeline__label--completed';
          if (isRejectedStage) labelClass += ' status-pipeline__label--rejected';
          
          return `<span class="${labelClass}">${stage.label}</span>`;
        }).join('')}
      </div>
    `;
  }
}

/**
 * Helper function to render pipeline in templates
 * @param {Object} referral - Referral object with status
 * @param {string} size - 'mini' | 'full'
 * @returns {string} HTML string
 */
export function renderStatusPipeline(referral, size = 'mini') {
  // Handle both referral object and plain status string
  const status = typeof referral === 'string' ? referral : referral.status;
  const isRejected = status === 'rejected';
  
  // Determine rejection stage from timeline if available
  let rejectionStage;
  if (isRejected && referral.timeline) {
    // Find the last non-rejected stage to determine where rejection occurred
    const timeline = referral.timeline.filter(t => t.status !== 'rejected');
    const lastStage = timeline[timeline.length - 1];
    if (lastStage && STAGE_INDEX[lastStage.status] !== undefined) {
      rejectionStage = STAGE_INDEX[lastStage.status] + 1;
    }
  }
  
  // For rejected referrals, use the stage before rejection for display
  const displayStatus = isRejected 
    ? (referral.timeline?.[referral.timeline.length - 2]?.status || 'review') 
    : status;
  
  const pipeline = new StatusPipeline({
    status: displayStatus,
    size: size,
    isRejected: isRejected,
    rejectionStage: rejectionStage
  });
  
  return pipeline.render();
}

/* ============================================================================
   REFERRALS COMPONENT (Story 5.1)
   ============================================================================
   Displays user's referrals with filtering capability
   ========================================================================== */

export class ReferralsComponent extends Component {
  constructor(props) {
    super(props);
    this.referrals = [];
    this.filter = 'all';
    this.isLoading = true;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    return `
      <div class="app-layout">
        <main class="referrals-page" id="referrals-page" role="main">
          ${this._renderHeader()}
          ${this._renderTabFilters()}
          ${this._renderContent()}
        </main>
      </div>
    `;
  }
  
  /**
   * Renders page header
   * @returns {string} HTML string
   */
  _renderHeader() {
    return `
      <header class="referrals-header">
        <h1 class="referrals-header__title">${renderIcon('clipboard-list')} ההפניות שלי</h1>
      </header>
    `;
  }
  
  /**
   * Renders tab filter navigation
   * @returns {string} HTML string
   */
  _renderTabFilters() {
    if (this.isLoading) {
      return `
        <nav class="referral-tabs" role="tablist" aria-label="סינון הפניות">
          <div class="referral-tab skeleton skeleton--tab"></div>
          <div class="referral-tab skeleton skeleton--tab"></div>
          <div class="referral-tab skeleton skeleton--tab"></div>
          <div class="referral-tab skeleton skeleton--tab"></div>
        </nav>
      `;
    }
    
    const counts = this._calculateFilterCounts();
    const tabs = [
      { key: 'all', label: 'הכל', count: counts.all },
      { key: 'in-progress', label: 'בתהליך', count: counts.inProgress },
      { key: 'hired', label: 'גויסו', icon: 'check', count: counts.hired, className: 'referral-tab--success' },
      { key: 'rejected', label: 'נדחו', count: counts.rejected, className: 'referral-tab--muted' }
    ];
    
    return `
      <nav class="referral-tabs" role="tablist" aria-label="סינון הפניות">
        ${tabs.map(tab => `
          <button class="referral-tab ${this.filter === tab.key ? 'referral-tab--active' : ''} ${tab.className || ''}"
                  role="tab"
                  aria-selected="${this.filter === tab.key}"
                  data-action="filter-referrals"
                  data-filter="${tab.key}">
            <span class="referral-tab__label">${tab.label}${tab.icon ? ` ${renderIcon(tab.icon)}` : ''}</span>
            <span class="referral-tab__count">${tab.count}</span>
          </button>
        `).join('')}
      </nav>
    `;
  }
  
  /**
   * Calculates counts for each filter tab
   * @returns {Object} Filter counts
   */
  _calculateFilterCounts() {
    const referrals = this.referrals || [];
    return {
      all: referrals.length,
      inProgress: referrals.filter(r => 
        ['submitted', 'review', 'interview', 'offer'].includes(r.status)
      ).length,
      hired: referrals.filter(r => r.status === 'hired').length,
      rejected: referrals.filter(r => r.status === 'rejected').length
    };
  }
  
  /**
   * Renders main content area (list or empty state)
   * @returns {string} HTML string
   */
  _renderContent() {
    if (this.isLoading) {
      return `
        <div class="referral-list" role="list" aria-label="רשימת הפניות">
          ${this._renderSkeletons()}
        </div>
      `;
    }
    
    if (this.referrals.length === 0) {
      return this._renderEmptyState('no-referrals');
    }
    
    const filteredReferrals = this._getFilteredReferrals();
    
    if (filteredReferrals.length === 0) {
      return this._renderEmptyState('no-results');
    }
    
    return `
      <div class="referral-list" role="list" aria-label="רשימת הפניות">
        ${filteredReferrals.map(referral => this._renderReferralCard(referral)).join('')}
      </div>
    `;
  }
  
  /**
   * Renders skeleton loading cards
   * @returns {string} HTML string
   */
  _renderSkeletons() {
    return Array(3).fill(0).map(() => `
      <article class="referral-card referral-card--skeleton">
        <div class="referral-card__avatar skeleton skeleton--avatar"></div>
        <div class="referral-card__content">
          <div class="skeleton skeleton--text" style="width: 60%"></div>
          <div class="skeleton skeleton--text-sm" style="width: 80%"></div>
          <div class="skeleton skeleton--text-sm" style="width: 40%"></div>
        </div>
        <div class="referral-card__status">
          <div class="skeleton skeleton--badge"></div>
        </div>
      </article>
    `).join('');
  }
  
  /**
   * Gets filtered referrals based on active filter
   * @returns {Array} Filtered referrals
   */
  _getFilteredReferrals() {
    const referrals = this.referrals || [];
    
    // Sort by submission date (newest first)
    const sorted = [...referrals].sort((a, b) => 
      new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    
    switch (this.filter) {
      case 'in-progress':
        return sorted.filter(r => 
          ['submitted', 'review', 'interview', 'offer'].includes(r.status)
        );
      case 'hired':
        return sorted.filter(r => r.status === 'hired');
      case 'rejected':
        return sorted.filter(r => r.status === 'rejected');
      default:
        return sorted;
    }
  }
  
  /**
   * Renders a single referral card
   * @param {Object} referral - Referral data
   * @returns {string} HTML string
   */
  _renderReferralCard(referral) {
    const statusInfo = REFERRAL_STATUS_CONFIG[referral.status] || REFERRAL_STATUS_CONFIG.submitted;
    const initials = this._getInitials(referral.candidateName);
    const formattedDate = this._formatHebrewDate(referral.submittedAt);
    
    return `
      <article class="referral-card referral-card--${referral.status}"
               role="listitem"
               data-action="view-referral-details"
               data-referral-id="${referral.id}"
               tabindex="0"
               aria-label="הפניה של ${this._escapeHtml(referral.candidateName)} למשרת ${this._escapeHtml(referral.positionTitle)}">
        
        <div class="referral-card__avatar" 
             style="--avatar-color: ${statusInfo.color}"
             aria-hidden="true">
          ${initials}
        </div>
        
        <div class="referral-card__content">
          <h3 class="referral-card__candidate-name">
            ${this._escapeHtml(referral.candidateName)}
          </h3>
          <p class="referral-card__position">
            ${this._escapeHtml(referral.positionTitle)}
          </p>
          <p class="referral-card__date">
            <i class="ti ti-calendar" aria-hidden="true"></i>
            ${formattedDate}
          </p>
        </div>
        
        <div class="referral-card__status">
          ${this._renderStatusBadge(referral.status)}
          ${renderStatusPipeline(referral, 'mini')}
        </div>
        
        <i class="ti ti-chevron-left referral-card__chevron" aria-hidden="true"></i>
      </article>
    `;
  }
  
  /**
   * Renders status badge
   * @param {string} status - Referral status
   * @returns {string} HTML string
   */
  _renderStatusBadge(status) {
    const statusInfo = REFERRAL_STATUS_CONFIG[status] || REFERRAL_STATUS_CONFIG.submitted;
    
    return `
      <span class="referral-badge referral-badge--${status}"
            style="--badge-color: ${statusInfo.color}"
            role="status">
        ${renderIcon(statusInfo.icon)}
        <span>${statusInfo.hebrew}</span>
      </span>
    `;
  }
  
  /**
   * Renders empty state
   * @param {string} type - 'no-referrals' or 'no-results'
   * @returns {string} HTML string
   */
  _renderEmptyState(type) {
    if (type === 'no-referrals') {
      return `
        <div class="empty-state">
          <div class="empty-state__icon">
            <i class="ti ti-users-group" aria-hidden="true"></i>
          </div>
          <h2 class="empty-state__title">עדיין לא הפנית אף מועמד</h2>
          <p class="empty-state__description">
            התחל להפנות חברים ולצבור נקודות וחותמות בדרכון שלך!
          </p>
          <button class="btn btn--primary btn--lg"
                  data-action="navigate-positions">
            <i class="ti ti-user-plus" aria-hidden="true"></i>
            הפנה את המועמד הראשון שלך
          </button>
        </div>
      `;
    }
    
    // No filter results
    const filterMessages = {
      'in-progress': 'אין הפניות בתהליך כרגע',
      'hired': 'אין גיוסים מוצלחים עדיין',
      'rejected': 'אין הפניות שנדחו'
    };
    
    return `
      <div class="empty-state empty-state--filter">
        <div class="empty-state__icon empty-state__icon--small">
          <i class="ti ti-filter-off" aria-hidden="true"></i>
        </div>
        <p class="empty-state__description">
          ${filterMessages[this.filter] || 'אין תוצאות'}
        </p>
        <button class="btn btn--secondary"
                data-action="filter-referrals"
                data-filter="all">
          צפה בכל ההפניות
        </button>
      </div>
    `;
  }
  
  /**
   * Gets initials from name
   * @param {string} name - Full name
   * @returns {string} Initials (1-2 characters)
   */
  _getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0);
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0));
  }
  
  /**
   * Formats date in Hebrew
   * @param {string} dateStr - ISO date string
   * @returns {string} Hebrew formatted date
   */
  _formatHebrewDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
  /**
   * Escapes HTML entities
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  /**
   * Re-renders component
   */
  _rerender() {
    const container = document.getElementById('referrals-page');
    if (container) {
      const parent = container.parentElement;
      if (parent) {
        parent.innerHTML = this.template();
        this._bindCardEvents();
      }
    }
  }
  
  /**
   * Binds keyboard events to cards for accessibility
   */
  _bindCardEvents() {
    const cards = document.querySelectorAll('.referral-card:not(.referral-card--skeleton)');
    cards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }
  
  /**
   * Loads referrals data
   */
  _loadReferrals() {
    // Get referrals from state or use mock data
    let referrals = stateManager.getState('referrals') || [];
    
    // If no referrals in state, use mock data for demo
    if (referrals.length === 0) {
      referrals = MOCK_REFERRALS;
      stateManager.setState({ referrals: MOCK_REFERRALS });
    }
    
    this.referrals = referrals;
  }
  
  /**
   * Lifecycle: Mount component
   */
  mount() {
    super.mount();
    
    // Simulate loading delay for UX
    this.isLoading = true;
    
    // Load filter from state
    this.filter = stateManager.getState('referralFilter') || 'all';
    
    // Subscribe to state changes
    this.subscribe('referrals', (referrals) => {
      this.referrals = referrals || [];
      if (!this.isLoading) {
        this._rerender();
      }
    });
    
    this.subscribe('referralFilter', (filter) => {
      this.filter = filter || 'all';
      if (!this.isLoading) {
        this._rerender();
      }
    });
    
    // Load data and finish loading
    setTimeout(() => {
      this._loadReferrals();
      this.isLoading = false;
      this._rerender();
    }, 500);
  }
  
  /**
   * Lifecycle: Unmount component
   */
  unmount() {
    super.unmount();
  }
}

/**
 * Initialize module - exposes components to global scope for backward compatibility
 */
export function initReferralsModule() {
  window.StatusPipeline = StatusPipeline;
  window.renderStatusPipeline = renderStatusPipeline;
  window.ReferralsComponent = ReferralsComponent;
}
