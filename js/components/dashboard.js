/**
 * PassportCard Refer - Dashboard Component
 * Main dashboard with points summary and stats cards
 */

import { Component } from '../core/component.js';
import { renderIcon } from '../core/utils.js';
import { CampaignsComponent } from './campaigns.js';
import { formatRelativeTime } from '../data/user-generator.js';

// These will be set by app.js after initialization
let stateManager = null;
let animationService = null;

/**
 * Initialize module with app dependencies
 * @param {Object} deps - Dependencies object
 */
export function initDashboardModule(deps) {
  stateManager = deps.stateManager;
  animationService = deps.animationService;
}

/**
 * DashboardComponent - Main dashboard with points summary and stats cards
 * Implements: AC1-AC6 (Dashboard Layout & Points Summary)
 * Implements: Story 2.2 (Stats Cards)
 */
export class DashboardComponent extends Component {
  constructor() {
    super();
    this._animationTriggered = false;
  }
  
  /**
   * Returns the dashboard HTML template
   * @returns {string} HTML string
   */
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return this._renderLoading();
    
    const { firstName, points } = user;
    const levelInfo = this._calculateLevel(points);
    
    return `
      <div class="app-layout">
        <main class="dashboard page-content">
          <section class="dashboard__greeting">
            <h1 class="dashboard__title">שלום ${firstName}!</h1>
          </section>
          
          <section class="dashboard__stats">
            ${this._renderPointsSummary(points, levelInfo)}
          </section>
          
          ${this._renderStatsCards()}
          
          ${this._renderQuickActions()}
          
          ${this._renderCampaignsSection()}
          
          ${this._renderActivityFeed()}
        </main>
      </div>
    `;
  }
  
  /**
   * Renders the stats cards section
   * @returns {string} HTML string for stats cards
   */
  _renderStatsCards() {
    const referrals = stateManager.getState('referrals') || [];
    const stats = this._calculateStats(referrals);
    const trends = this._calculateTrends(stats);
    
    const cards = [
      {
        id: 'total',
        icon: 'ti-users',
        label: 'סה״כ הפניות',
        count: stats.total,
        trend: trends.total,
        filter: 'all',
        color: 'primary'
      },
      {
        id: 'in-progress',
        icon: 'ti-clock',
        label: 'בתהליך',
        count: stats.inProgress,
        trend: trends.inProgress,
        filter: 'in-progress',
        color: 'warning'
      },
      {
        id: 'hired',
        icon: 'ti-trophy',
        label: 'גיוסים מוצלחים',
        count: stats.hired,
        trend: trends.hired,
        filter: 'hired',
        color: 'success'
      }
    ];
    
    return `
      <section class="dashboard__cards" aria-label="סטטיסטיקות הפניות">
        <div class="stats-cards">
          ${cards.map(card => this._renderStatCard(card)).join('')}
        </div>
      </section>
    `;
  }
  
  /**
   * Renders a single stat card
   * @param {Object} card - Card configuration
   * @returns {string} HTML string
   */
  _renderStatCard(card) {
    const trendHTML = card.trend !== 0 ? `
      <span class="stat-card__trend stat-card__trend--${card.trend > 0 ? 'up' : 'down'}">
        <i class="ti ${card.trend > 0 ? 'ti-trending-up' : 'ti-trending-down'}"></i>
        <span class="stat-card__trend-value">${Math.abs(card.trend)}</span>
      </span>
    ` : '';
    
    return `
      <article 
        class="stat-card stat-card--${card.color}"
        data-action="navigate-referrals"
        data-filter="${card.filter}"
        role="button"
        tabindex="0"
        aria-label="${card.label}: ${card.count}. לחץ לצפייה"
      >
        <div class="stat-card__icon">
          <i class="ti ${card.icon}"></i>
        </div>
        <div class="stat-card__content">
          <span class="stat-card__count" dir="ltr">${card.count.toLocaleString('he-IL')}</span>
          <span class="stat-card__label">${card.label}</span>
        </div>
        ${trendHTML}
      </article>
    `;
  }
  
  /**
   * Calculates stats from referrals array
   * @param {Array} referrals - User's referrals
   * @returns {Object} Stats object with total, inProgress, hired counts
   */
  _calculateStats(referrals) {
    return {
      total: referrals.length,
      inProgress: referrals.filter(r => 
        ['submitted', 'review', 'interview', 'offer'].includes(r.status)
      ).length,
      hired: referrals.filter(r => r.status === 'hired').length
    };
  }
  
  /**
   * Renders the activity feed section
   * @returns {string} HTML string for activity feed
   */
  _renderActivityFeed() {
    const activities = stateManager.getState('activities') || [];
    const displayActivities = activities.slice(0, 10); // Max 10 items
    
    if (displayActivities.length === 0) {
      return this._renderEmptyActivity();
    }
    
    return `
      <section class="dashboard__activity" aria-label="פעילות אחרונה">
        <header class="activity-feed__header">
          <h2 class="activity-feed__title">
            <i class="ti ti-activity"></i>
            פעילות אחרונה
          </h2>
        </header>
        
        <ul class="activity-feed" role="list">
          ${displayActivities.map(activity => this._renderActivityItem(activity)).join('')}
        </ul>
      </section>
    `;
  }

  /**
   * Renders a single activity item
   * @param {Object} activity - Activity data
   * @returns {string} HTML string
   */
  _renderActivityItem(activity) {
    const relativeTime = formatRelativeTime(activity.timestamp);
    const pointsBadge = activity.points > 0 ? `
      <span class="activity-item__points">+${activity.points}</span>
    ` : '';
    
    const navigable = activity.referralId ? `
      data-action="navigate-referral-detail"
      data-referral-id="${activity.referralId}"
      role="button"
      tabindex="0"
    ` : '';
    
    return `
      <li 
        class="activity-item activity-item--${activity.iconColor}"
        ${navigable}
        aria-label="${activity.description}. ${activity.points > 0 ? `הרווחת ${activity.points} נקודות.` : ''} ${relativeTime}"
      >
        <div class="activity-item__icon" aria-hidden="true">
          <i class="ti ${activity.icon}"></i>
        </div>
        
        <div class="activity-item__content">
          <p class="activity-item__description">${activity.description}</p>
          <span class="activity-item__time">${relativeTime}</span>
        </div>
        
        ${pointsBadge}
        
        ${activity.referralId ? `
          <i class="ti ti-chevron-left activity-item__arrow" aria-hidden="true"></i>
        ` : ''}
      </li>
    `;
  }

  /**
   * Renders empty state for activity feed
   * @returns {string} HTML string
   */
  _renderEmptyActivity() {
    return `
      <section class="dashboard__activity" aria-label="פעילות אחרונה">
        <header class="activity-feed__header">
          <h2 class="activity-feed__title">
            <i class="ti ti-activity"></i>
            פעילות אחרונה
          </h2>
        </header>
        
        <div class="activity-feed--empty">
          <div class="activity-feed__empty-icon" aria-hidden="true">
            <i class="ti ti-inbox"></i>
          </div>
          <p class="activity-feed__empty-text">עדיין אין פעילות</p>
          <p class="activity-feed__empty-subtext">הפנה את החבר הראשון שלך כדי להתחיל לצבור נקודות!</p>
          <button 
            class="btn btn--primary"
            data-navigate="positions"
            aria-label="הפנה מועמד"
          >
            <i class="ti ti-user-plus"></i>
            הפנה מועמד
          </button>
        </div>
      </section>
    `;
  }

  /**
   * Renders the quick actions section (Story 2.4)
   * @returns {string} HTML string for quick actions
   */
  _renderQuickActions() {
    const actions = [
      {
        id: 'refer',
        icon: 'ti-user-plus',
        label: 'הפנה מועמד',
        route: 'positions',
        primary: true,
        description: 'הפנה חבר למשרה פתוחה'
      },
      {
        id: 'positions',
        icon: 'ti-briefcase',
        label: 'צפה במשרות',
        route: 'positions',
        primary: false,
        description: 'ראה את כל המשרות הפתוחות'
      },
      {
        id: 'passport',
        icon: 'ti-book',
        label: 'הדרכון שלי',
        route: 'passport',
        primary: false,
        description: 'צפה בחותמות ובנקודות שלך'
      }
    ];
    
    return `
      <section class="dashboard__actions" aria-label="פעולות מהירות">
        <header class="quick-actions__header">
          <h2 class="quick-actions__title">
            <i class="ti ti-rocket"></i>
            פעולות מהירות
          </h2>
        </header>
        
        <div class="quick-actions">
          ${actions.map(action => this._renderQuickActionButton(action)).join('')}
        </div>
        
        <div class="quick-actions__link">
          <button class="btn btn--ghost btn--sm" data-action="open-how-to-earn">
            <i class="ti ti-help-circle" aria-hidden="true"></i>
            איך להרוויח עוד?
          </button>
        </div>
      </section>
    `;
  }

  /**
   * Renders a single quick action button
   * @param {Object} action - Action configuration
   * @returns {string} HTML string
   */
  _renderQuickActionButton(action) {
    const buttonClass = action.primary 
      ? 'quick-action-btn quick-action-btn--primary' 
      : 'quick-action-btn quick-action-btn--secondary';
    
    return `
      <button 
        class="${buttonClass}"
        data-navigate="${action.route}"
        aria-label="${action.description}"
      >
        <span class="quick-action-btn__icon">
          <i class="ti ${action.icon}"></i>
        </span>
        <span class="quick-action-btn__label">${action.label}</span>
      </button>
    `;
  }

  /**
   * Renders the campaigns section using CampaignsComponent (Story 5.4)
   * @returns {string} HTML string for campaigns section
   */
  _renderCampaignsSection() {
    // Create and render the CampaignsComponent
    const campaignsComponent = new CampaignsComponent();
    campaignsComponent.campaigns = campaignsComponent._getActiveCampaigns();
    return campaignsComponent.template();
  }

  /**
   * Calculates trends by comparing to stored previous stats
   * @param {Object} currentStats - Current stats
   * @returns {Object} Trends object (positive = increase, negative = decrease)
   */
  _calculateTrends(currentStats) {
    const STATS_STORAGE_KEY = 'passportcard_refer_prev_stats';
    let prevStats = { total: 0, inProgress: 0, hired: 0 };
    
    try {
      const stored = localStorage.getItem(STATS_STORAGE_KEY);
      if (stored) {
        prevStats = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load previous stats');
    }
    
    // Store current stats for next comparison
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(currentStats));
    } catch (e) {
      console.warn('Failed to store current stats');
    }
    
    return {
      total: currentStats.total - prevStats.total,
      inProgress: currentStats.inProgress - prevStats.inProgress,
      hired: currentStats.hired - prevStats.hired
    };
  }
  
  /**
   * Renders loading state while user data loads
   * @returns {string} HTML string
   */
  _renderLoading() {
    return `
      <div class="app-layout">
        <main class="dashboard page-content">
          <div class="dashboard__loading">
            <span class="spinner"></span>
            <p>טוען...</p>
          </div>
        </main>
      </div>
    `;
  }
  
  /**
   * Renders the points summary card
   * @param {number} points - User's total points
   * @param {Object} levelInfo - Level calculation result
   * @returns {string} HTML string
   */
  _renderPointsSummary(points, levelInfo) {
    const { level, nextLevel, pointsToNext, progressPercent } = levelInfo;
    
    return `
      <article class="points-card" aria-label="סיכום נקודות">
        <div class="points-card__header">
          <h2 class="points-card__title">הנקודות שלי</h2>
        </div>
        
        <div class="points-card__body">
          <div class="points-card__progress">
            ${this._renderProgressCircle(progressPercent, level)}
          </div>
          
          <div class="points-card__details">
            <div class="points-card__total">
              <span class="points-value" data-target="${points}">0</span>
              <span class="points-label">נקודות</span>
            </div>
            
            <div class="points-card__level">
              <span class="level-badge level-badge--${this._getLevelClass(level)}">${level}</span>
            </div>
            
            ${nextLevel ? `
              <div class="points-card__next">
                <span class="points-next-text">עוד <strong class="points-value--inline" dir="ltr">${pointsToNext.toLocaleString('he-IL')}</strong> נקודות לרמה הבאה</span>
              </div>
            ` : `
              <div class="points-card__next points-card__next--max">
                <span class="points-next-text">${renderIcon('trophy')} הגעת לרמה הגבוהה ביותר!</span>
              </div>
            `}
          </div>
        </div>
      </article>
    `;
  }
  
  /**
   * Renders the SVG circular progress indicator
   * @param {number} percent - Progress percentage (0-100)
   * @param {string} level - Current level name
   * @returns {string} HTML string for SVG
   */
  _renderProgressCircle(percent, level) {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    
    return `
      <svg class="progress-circle" viewBox="0 0 100 100" aria-hidden="true">
        <circle 
          class="progress-circle__bg"
          cx="50" cy="50" r="${radius}"
          fill="none"
          stroke-width="8"
        />
        <circle 
          class="progress-circle__fill"
          cx="50" cy="50" r="${radius}"
          fill="none"
          stroke-width="8"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" class="progress-circle__text" text-anchor="middle" dominant-baseline="middle">
          ${Math.round(percent)}%
        </text>
      </svg>
    `;
  }
  
  /**
   * Calculates level information based on points
   * @param {number} points - User's total points
   * @returns {Object} Level info with level, nextLevel, pointsToNext, progressPercent
   */
  _calculateLevel(points) {
    const LEVELS = [
      { name: 'מתחיל', min: 0, max: 249 },
      { name: 'פעיל', min: 250, max: 749 },
      { name: 'מומחה', min: 750, max: 1999 },
      { name: 'אלוף', min: 2000, max: 4999 },
      { name: 'אגדה', min: 5000, max: Infinity }
    ];
    
    let currentIndex = LEVELS.findIndex(l => points >= l.min && points <= l.max);
    if (currentIndex === -1) currentIndex = 0;
    
    const currentLevel = LEVELS[currentIndex];
    const nextLevel = LEVELS[currentIndex + 1] || null;
    
    let progressPercent = 100;
    let pointsToNext = 0;
    
    if (nextLevel) {
      const levelRange = nextLevel.min - currentLevel.min;
      const pointsIntoLevel = points - currentLevel.min;
      progressPercent = Math.min((pointsIntoLevel / levelRange) * 100, 100);
      pointsToNext = nextLevel.min - points;
    }
    
    return {
      level: currentLevel.name,
      nextLevel: nextLevel?.name || null,
      pointsToNext,
      progressPercent
    };
  }
  
  /**
   * Maps Hebrew level name to CSS class
   * @param {string} level - Hebrew level name
   * @returns {string} CSS class name
   */
  _getLevelClass(level) {
    const classes = {
      'מתחיל': 'beginner',
      'פעיל': 'active',
      'מומחה': 'expert',
      'אלוף': 'champion',
      'אגדה': 'legend'
    };
    return classes[level] || 'beginner';
  }
  
  /**
   * Called after component is mounted to DOM
   */
  mount() {
    super.mount();
    
    // Trigger counter animation after mount
    if (!this._animationTriggered) {
      this._animationTriggered = true;
      this._animatePointsCounter();
    }
    
    // Subscribe to user changes for updates
    this.subscribe('currentUser', () => {
      this._refresh();
    });
    
    // Add keyboard navigation for stat cards
    this._setupStatCardKeyboard();
    
    // Add keyboard navigation for activity items
    this._setupActivityKeyboard();
    
    // Setup campaigns section (Story 5.4)
    this._setupCampaignsKeyboard();
    this._startCampaignCountdownTimer();
  }
  
  /**
   * Sets up keyboard navigation for campaign cards (Story 5.4)
   */
  _setupCampaignsKeyboard() {
    const cards = this.$$('.campaign-card');
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
   * Starts countdown timer for campaign cards (Story 5.4)
   */
  _startCampaignCountdownTimer() {
    // Update every minute
    this._campaignCountdownInterval = setInterval(() => {
      this._updateCampaignCountdowns();
    }, 60000);
  }
  
  /**
   * Updates all campaign countdown displays (Story 5.4)
   */
  _updateCampaignCountdowns() {
    const countdownEls = document.querySelectorAll('[data-countdown]');
    countdownEls.forEach(el => {
      const endDate = el.dataset.countdown;
      const countdown = this._calculateCampaignCountdown(endDate);
      const textEl = el.querySelector('.campaign-card__countdown-text');
      
      if (textEl) {
        textEl.textContent = countdown.display;
      }
      
      // Update urgency class
      const urgencyClass = this._getCampaignUrgencyClass(countdown);
      el.className = `campaign-card__countdown ${urgencyClass}`;
    });
  }
  
  /**
   * Calculates countdown for campaign (Story 5.4)
   * @param {string} endDate - ISO date string
   * @returns {Object} Countdown info
   */
  _calculateCampaignCountdown(endDate) {
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
      display = `${days} ימים, ${hours} שעות`;
    } else if (hours > 0) {
      display = `${hours}:${String(minutes).padStart(2, '0')}`;
    } else {
      display = `${minutes} דקות`;
    }
    
    return { display, days, hours, minutes, isExpired: false };
  }
  
  /**
   * Gets urgency CSS class based on countdown (Story 5.4)
   * @param {Object} countdown - Countdown object
   * @returns {string} CSS class
   */
  _getCampaignUrgencyClass(countdown) {
    if (countdown.isExpired) return 'campaign-card__countdown--expired';
    if (countdown.days === 0 && countdown.hours === 0) return 'campaign-card__countdown--critical';
    if (countdown.days === 0) return 'campaign-card__countdown--urgent';
    return '';
  }
  
  /**
   * Sets up keyboard navigation for stat cards
   */
  _setupStatCardKeyboard() {
    const cards = this.$$('.stat-card');
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
   * Sets up keyboard navigation for activity items
   */
  _setupActivityKeyboard() {
    const items = this.$$('.activity-item[role="button"]');
    items.forEach(item => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }
  
  /**
   * Triggers the points counter animation
   */
  _animatePointsCounter() {
    const pointsEl = this.$('.points-value[data-target]');
    if (!pointsEl) return;
    
    const target = parseInt(pointsEl.dataset.target, 10);
    if (animationService) {
      animationService.animateCounter(pointsEl, target);
    }
  }
  
  /**
   * Refreshes the dashboard when user data changes
   */
  _refresh() {
    const appContainer = document.getElementById('main-content');
    if (appContainer && this.isMounted()) {
      appContainer.innerHTML = this.template();
      this._animatePointsCounter();
      this._setupStatCardKeyboard();
      this._setupActivityKeyboard();
      this._setupCampaignsKeyboard();
    }
  }
  
  /**
   * Cleanup when component unmounts (Story 5.4)
   */
  unmount() {
    // Clear campaign countdown interval
    if (this._campaignCountdownInterval) {
      clearInterval(this._campaignCountdownInterval);
      this._campaignCountdownInterval = null;
    }
    super.unmount();
  }
}
