/**
 * PassportCard Refer - Campaign Components
 * HowToEarnComponent and CampaignsComponent
 */

import { Component } from '../core/component.js';
import { renderIcon } from '../core/utils.js';
import { STAMP_TYPES } from '../data/stamp-types.js';
import { MOCK_CAMPAIGNS } from '../data/mock-campaigns.js';

// These will be set by app.js after initialization
let stateManager = null;

/**
 * Initialize module with app dependencies
 * @param {Object} deps - Dependencies object
 */
export function initCampaignsModule(deps) {
  stateManager = deps.stateManager;
}

/**
 * HowToEarnComponent - How to Earn More Points modal
 * Implements: AC1-AC18 (How to Earn More Section)
 */
export class HowToEarnComponent extends Component {
  constructor(props) {
    super(props);
    this.campaigns = [];
    this._focusTrapHandler = null;
    this._escapeHandler = null;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    return `
      <div class="how-to-earn" role="dialog" aria-modal="true" aria-labelledby="how-to-earn-heading">
        <div class="how-to-earn__backdrop" data-action="close-how-to-earn"></div>
        <div class="how-to-earn__content">
          <header class="how-to-earn__header">
            <h2 class="how-to-earn__title" id="how-to-earn-heading">
              <span class="how-to-earn__icon">${renderIcon('target')}</span>
              איך להרוויח עוד נקודות
            </h2>
            <button class="how-to-earn__close" 
                    data-action="close-how-to-earn"
                    aria-label="סגור">
              <i class="ti ti-x" aria-hidden="true"></i>
            </button>
          </header>
          
          <div class="how-to-earn__body">
            ${this._renderPointsBreakdown()}
            ${this._renderCampaignsSection()}
            ${this._renderTipsSection()}
          </div>
          
          <footer class="how-to-earn__footer">
            ${this._renderCTAs()}
          </footer>
        </div>
      </div>
    `;
  }
  
  /**
   * Renders points breakdown section
   * @returns {string} HTML string
   */
  _renderPointsBreakdown() {
    return `
      <section class="how-to-earn__section" aria-labelledby="points-breakdown-heading">
        <h3 class="how-to-earn__section-title" id="points-breakdown-heading">
          <span class="how-to-earn__section-icon">${renderIcon('coins')}</span>
          נקודות לפי פעולה
        </h3>
        <ul class="points-breakdown" role="list">
          ${this._renderEarningOpportunities()}
        </ul>
      </section>
    `;
  }
  
  /**
   * Renders individual earning opportunity rows
   * @returns {string} HTML string
   */
  _renderEarningOpportunities() {
    // Order: submission flow first, then bonuses
    const opportunities = [
      { type: 'submitted', label: 'קו״ח הוגש', pointsLabel: '+50 נקודות' },
      { type: 'interview', label: 'ראיון נקבע', pointsLabel: '+100 נקודות' },
      { type: 'hired', label: 'גיוס מוצלח!', pointsLabel: '+500 נקודות' },
      { type: 'milestone3m', label: '3 חודשי עבודה', pointsLabel: '+200 נקודות' },
      { type: 'milestone6m', label: '6 חודשי עבודה', pointsLabel: '+400 נקודות' },
      { type: 'first', label: 'הפניה ראשונה (בונוס)', pointsLabel: '+100 נקודות' },
      { type: 'streak', label: 'רצף הפניות (3+)', pointsLabel: '+75 לכל הפניה' }
    ];
    
    return opportunities.map(opp => {
      const stampType = STAMP_TYPES[opp.type];
      return `
        <li class="points-breakdown__item" role="listitem">
          <span class="points-breakdown__icon" style="--stamp-color: ${stampType.color}">
            ${renderIcon(stampType.icon)}
          </span>
          <span class="points-breakdown__label">${opp.label}</span>
          <span class="points-breakdown__points">${opp.pointsLabel}</span>
        </li>
      `;
    }).join('');
  }
  
  /**
   * Renders campaigns section
   * @returns {string} HTML string
   */
  _renderCampaignsSection() {
    this.campaigns = this._getActiveCampaigns();
    
    return `
      <section class="how-to-earn__section" aria-labelledby="campaigns-section-heading">
        <h3 class="how-to-earn__section-title" id="campaigns-section-heading">
          <span class="how-to-earn__section-icon">${renderIcon('bolt')}</span>
          קמפיינים מיוחדים
        </h3>
        ${this.campaigns.length > 0 
          ? this._renderCampaignsList()
          : this._renderNoCampaigns()}
      </section>
    `;
  }
  
  /**
   * Gets active campaigns from mock data
   * @returns {Array} Active campaigns
   */
  _getActiveCampaigns() {
    const now = new Date();
    return MOCK_CAMPAIGNS.filter(campaign => {
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      return campaign.isActive && now >= start && now <= end;
    });
  }
  
  /**
   * Renders campaigns list
   * @returns {string} HTML string
   */
  _renderCampaignsList() {
    return `
      <ul class="campaigns-list" role="list">
        ${this.campaigns.map(campaign => `
          <li class="campaigns-list__item" 
              role="listitem"
              tabindex="0"
              data-action="view-campaign-positions-from-earn"
              data-campaign-id="${campaign.id}">
            <span class="campaigns-list__icon">${campaign.icon}</span>
            <span class="campaigns-list__title">${this._escapeHtml(campaign.title)}</span>
            <span class="campaigns-list__multiplier" style="--campaign-color: ${campaign.accentColor}">
              x${campaign.multiplier}
            </span>
            <i class="ti ti-chevron-left campaigns-list__arrow" aria-hidden="true"></i>
          </li>
        `).join('')}
      </ul>
    `;
  }
  
  /**
   * Renders empty campaigns state
   * @returns {string} HTML string
   */
  _renderNoCampaigns() {
    return `
      <div class="campaigns-empty-state">
        <p class="campaigns-empty-state__text">אין קמפיינים פעילים כרגע</p>
        <p class="campaigns-empty-state__subtext">עקבו אחר עדכונים בדשבורד</p>
      </div>
    `;
  }
  
  /**
   * Renders tips section
   * @returns {string} HTML string
   */
  _renderTipsSection() {
    const tips = [
      'הפנו מועמדים שאתם מכירים אישית',
      'ודאו שקורות החיים מעודכנים',
      'עקבו אחרי ההפניות שלכם',
      'נצלו קמפיינים מיוחדים'
    ];
    
    return `
      <section class="how-to-earn__section" aria-labelledby="tips-section-heading">
        <h3 class="how-to-earn__section-title" id="tips-section-heading">
          <span class="how-to-earn__section-icon">${renderIcon('bulb')}</span>
          טיפים להצלחה
        </h3>
        <ul class="tips-list" role="list">
          ${tips.map(tip => `
            <li class="tips-list__item" role="listitem">
              <i class="ti ti-check tips-list__check" aria-hidden="true"></i>
              <span class="tips-list__text">${tip}</span>
            </li>
          `).join('')}
        </ul>
      </section>
    `;
  }
  
  /**
   * Renders CTAs
   * @returns {string} HTML string
   */
  _renderCTAs() {
    return `
      <div class="how-to-earn__ctas">
        <button class="btn btn--primary btn--lg how-to-earn__cta-primary"
                data-action="navigate-to-positions-from-earn">
          צפה במשרות פתוחות
          <i class="ti ti-arrow-left" aria-hidden="true"></i>
        </button>
        ${this.campaigns.length > 0 ? `
          <button class="btn btn--ghost how-to-earn__cta-secondary"
                  data-action="navigate-to-campaigns">
            צפה בקמפיינים פעילים
          </button>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Escapes HTML entities for security
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
   * Lifecycle: Mount component
   */
  mount() {
    // Trap focus within modal
    this._trapFocus();
    
    // Bind keyboard events
    this._bindKeyboardEvents();
    
    // Bind campaign item keyboard events
    this._bindCampaignKeyboard();
  }
  
  /**
   * Traps focus within the modal
   */
  _trapFocus() {
    const modal = document.querySelector('.how-to-earn__content');
    if (!modal) return;
    
    const focusableEls = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableEls.length === 0) return;
    
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    
    // Focus first element
    firstEl.focus();
    
    // Store reference for cleanup
    this._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    
    document.addEventListener('keydown', this._focusTrapHandler);
  }
  
  /**
   * Binds keyboard event handlers
   */
  _bindKeyboardEvents() {
    this._escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this._closeModal();
      }
    };
    
    document.addEventListener('keydown', this._escapeHandler);
  }
  
  /**
   * Binds keyboard events for campaign items
   */
  _bindCampaignKeyboard() {
    document.querySelectorAll('.campaigns-list__item').forEach(item => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }
  
  /**
   * Closes the modal
   */
  _closeModal() {
    const modal = document.querySelector('.how-to-earn');
    if (!modal) return;
    
    modal.classList.remove('how-to-earn--open');
    modal.classList.add('how-to-earn--closing');
    
    // Check reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) {
      modal.remove();
    } else {
      setTimeout(() => {
        modal.remove();
      }, 300); // Match CSS transition duration
    }
  }
  
  /**
   * Lifecycle: Unmount component
   */
  unmount() {
    // Remove event listeners
    if (this._focusTrapHandler) {
      document.removeEventListener('keydown', this._focusTrapHandler);
    }
    if (this._escapeHandler) {
      document.removeEventListener('keydown', this._escapeHandler);
    }
    
    super.unmount();
  }
}

/**
 * CampaignsComponent - Active campaigns section with countdown timers
 * Implements: AC1-AC21 (Active Campaigns Section)
 */
export class CampaignsComponent extends Component {
  constructor(props) {
    super(props);
    this.campaigns = [];
    this.countdownInterval = null;
  }
  
  /**
   * Main template for campaigns section
   * @returns {string} HTML string
   */
  template() {
    return `
      <section class="campaigns-section" aria-labelledby="campaigns-heading">
        <header class="campaigns-section__header">
          <h2 class="campaigns-section__title" id="campaigns-heading">
            <span class="campaigns-section__icon">${renderIcon('target')}</span>
            קמפיינים פעילים
          </h2>
        </header>
        <div class="campaigns-section__content">
          ${this.campaigns.length > 0 
            ? this._renderCampaignCards()
            : this._renderEmptyState()}
        </div>
      </section>
    `;
  }
  
  /**
   * Renders all campaign cards
   * @returns {string} HTML string
   */
  _renderCampaignCards() {
    // Sort by end date (soonest first)
    const sorted = [...this.campaigns].sort((a, b) => 
      new Date(a.endDate) - new Date(b.endDate)
    );
    
    return `
      <div class="campaigns-scroll" role="list">
        ${sorted.map(campaign => this._renderCampaignCard(campaign)).join('')}
      </div>
    `;
  }
  
  /**
   * Renders a single campaign card
   * @param {Object} campaign - Campaign data
   * @returns {string} HTML string
   */
  _renderCampaignCard(campaign) {
    const countdown = this._calculateCountdown(campaign.endDate);
    const urgencyClass = this._getUrgencyClass(countdown);
    
    return `
      <article class="campaign-card" 
               role="listitem"
               data-campaign-id="${campaign.id}"
               style="--campaign-accent: ${campaign.accentColor}"
               tabindex="0"
               data-action="view-campaign-positions">
        <div class="campaign-card__badge">
          <span class="campaign-card__multiplier">x${campaign.multiplier}</span>
        </div>
        
        <div class="campaign-card__icon">${campaign.icon}</div>
        
        <h3 class="campaign-card__title">${this._escapeHtml(campaign.title)}</h3>
        
        <p class="campaign-card__description">
          ${this._escapeHtml(campaign.description)}
        </p>
        
        <div class="campaign-card__eligibility">
          ${this._renderEligibility(campaign)}
        </div>
        
        <div class="campaign-card__countdown ${urgencyClass}" 
             data-countdown="${campaign.endDate}"
             aria-label="זמן נותר: ${countdown.display}">
          <i class="ti ti-clock" aria-hidden="true"></i>
          <span class="campaign-card__countdown-text">${countdown.display}</span>
        </div>
        
        <button class="campaign-card__cta btn btn--primary btn--sm"
                data-action="view-campaign-positions"
                data-campaign-id="${campaign.id}">
          הפנה עכשיו
          <i class="ti ti-arrow-left" aria-hidden="true"></i>
        </button>
      </article>
    `;
  }
  
  /**
   * Renders eligibility info
   * @param {Object} campaign - Campaign data
   * @returns {string} HTML string
   */
  _renderEligibility(campaign) {
    if (!campaign.eligibleDepartments || campaign.eligibleDepartments.length === 0) {
      return '<span class="campaign-card__eligibility-text">כל המשרות</span>';
    }
    
    const departments = campaign.eligibleDepartments.slice(0, 2);
    const more = campaign.eligibleDepartments.length > 2 
      ? ` +${campaign.eligibleDepartments.length - 2}` 
      : '';
    
    return `
      <span class="campaign-card__eligibility-text">
        ${departments.join(', ')}${more}
      </span>
    `;
  }
  
  /**
   * Calculates countdown display
   * @param {string} endDate - ISO date string
   * @returns {Object} Countdown info with display string and values
   */
  _calculateCountdown(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) {
      return { display: 'הסתיים', days: 0, hours: 0, minutes: 0, isExpired: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    let display;
    
    if (days > 0) {
      // More than 24 hours
      display = `${days} ימים, ${hours} שעות`;
    } else if (hours > 0) {
      // Less than 24 hours but more than 1 hour
      display = `${hours}:${String(minutes).padStart(2, '0')}`;
    } else {
      // Less than 1 hour
      display = `${minutes} דקות`;
    }
    
    return { display, days, hours, minutes, isExpired: false };
  }
  
  /**
   * Gets urgency CSS class based on countdown
   * @param {Object} countdown - Countdown object
   * @returns {string} CSS class
   */
  _getUrgencyClass(countdown) {
    if (countdown.isExpired) return 'campaign-card__countdown--expired';
    if (countdown.days === 0 && countdown.hours === 0) return 'campaign-card__countdown--critical';
    if (countdown.days === 0) return 'campaign-card__countdown--urgent';
    return '';
  }
  
  /**
   * Renders empty state when no campaigns active
   * @returns {string} HTML string
   */
  _renderEmptyState() {
    return `
      <div class="campaigns-empty">
        <div class="campaigns-empty__icon">${renderIcon('calendar-event', { size: 'xl' })}</div>
        <p class="campaigns-empty__text">אין קמפיינים פעילים כרגע</p>
        <p class="campaigns-empty__subtext">בקרוב...</p>
      </div>
    `;
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
   * Starts countdown timer interval
   */
  _startCountdownTimer() {
    // Update every minute
    this.countdownInterval = setInterval(() => {
      this._updateCountdowns();
    }, 60000);
  }
  
  /**
   * Updates all countdown displays
   */
  _updateCountdowns() {
    const countdownEls = document.querySelectorAll('[data-countdown]');
    countdownEls.forEach(el => {
      const endDate = el.dataset.countdown;
      const countdown = this._calculateCountdown(endDate);
      const textEl = el.querySelector('.campaign-card__countdown-text');
      
      if (textEl) {
        textEl.textContent = countdown.display;
      }
      
      // Update urgency class
      el.className = `campaign-card__countdown ${this._getUrgencyClass(countdown)}`;
    });
  }
  
  /**
   * Gets active campaigns from mock data
   * @returns {Array} Active campaigns
   */
  _getActiveCampaigns() {
    const now = new Date();
    return MOCK_CAMPAIGNS.filter(campaign => {
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      return campaign.isActive && now >= start && now <= end;
    });
  }
  
  /**
   * Lifecycle: Mount component
   */
  mount() {
    // Get active campaigns
    this.campaigns = this._getActiveCampaigns();
    
    // Subscribe to campaign state changes
    this.subscribe('activeCampaigns', (campaigns) => {
      if (campaigns) {
        this.campaigns = campaigns;
        this.render();
      }
    });
    
    // Start countdown timer
    this._startCountdownTimer();
    
    // Bind keyboard events for campaign cards
    this._bindKeyboardEvents();
  }
  
  /**
   * Bind keyboard event handlers
   */
  _bindKeyboardEvents() {
    this._keydownHandler = (e) => {
      if (e.target.matches('.campaign-card') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
      }
    };
    document.addEventListener('keydown', this._keydownHandler);
  }
  
  /**
   * Lifecycle: Unmount component
   */
  unmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
    }
    super.unmount();
  }
}
