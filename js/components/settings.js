/**
 * PassportCard Refer - Settings Component
 * User settings with logout functionality
 */

import { Component } from '../core/component.js';
import { CONFIG } from '../core/config.js';

// These will be set by app.js after initialization
let stateManager = null;

/**
 * Initialize module with app dependencies
 * @param {Object} deps - Dependencies object
 */
export function initSettingsModule(deps) {
  stateManager = deps.stateManager;
}

/**
 * SettingsComponent - User settings with logout functionality
 * Implements: AC7 (Logout button in Settings)
 */
export class SettingsComponent extends Component {
  /**
   * Returns the settings screen HTML template
   * @returns {string} HTML string
   */
  template() {
    const user = stateManager.getState('currentUser');
    if (!user) return this._renderNoUser();
    
    return `
      <main class="settings-page" role="main">
        <div class="settings-container">
          ${this._renderProfileSection(user)}
          ${this._renderGamificationSummary(user)}
          ${this._renderNotificationSection()}
          ${this._renderAccountSection()}
          ${this._renderAboutSection()}
          ${this._renderFooter()}
        </div>
      </main>
    `;
  }
  
  /**
   * Renders profile section with user info
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderProfileSection(user) {
    return `
      <section class="settings-section" aria-labelledby="profile-heading">
        <h2 class="settings-section__title" id="profile-heading">
          <i class="ti ti-user" aria-hidden="true"></i>
          פרטי פרופיל
        </h2>
        <div class="settings-card settings-card--profile">
          <div class="settings-profile">
            <div class="settings-profile__avatar" aria-hidden="true">
              ${user.avatarInitial || user.fullName?.charAt(0) || '?'}
            </div>
            <div class="settings-profile__info">
              <h3 class="settings-profile__name">${this._escapeHtml(user.fullName)}</h3>
              <p class="settings-profile__department">${this._escapeHtml(user.department)}</p>
            </div>
          </div>
          
          <div class="settings-fields">
            <div class="settings-field">
              <span class="settings-field__label" id="field-email-label">אימייל</span>
              <span class="settings-field__value settings-field__value--ltr" 
                    aria-labelledby="field-email-label">
                ${this._escapeHtml(user.email)}
              </span>
            </div>
            
            <div class="settings-field">
              <span class="settings-field__label" id="field-dept-label">מחלקה</span>
              <span class="settings-field__value" aria-labelledby="field-dept-label">
                ${this._escapeHtml(user.department)}
              </span>
            </div>
            
            <div class="settings-field">
              <span class="settings-field__label" id="field-id-label">מזהה עובד</span>
              <span class="settings-field__value settings-field__value--ltr" 
                    aria-labelledby="field-id-label">
                ${this._escapeHtml(user.id)}
              </span>
            </div>
            
            <div class="settings-field">
              <span class="settings-field__label" id="field-join-label">תאריך הצטרפות</span>
              <span class="settings-field__value" aria-labelledby="field-join-label">
                ${this._formatJoinDate(user.joinDate)}
              </span>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders gamification summary section
   * @param {Object} user - Current user object
   * @returns {string} HTML string
   */
  _renderGamificationSummary(user) {
    const stamps = stateManager.getState('stamps') || [];
    const referrals = stateManager.getState('referrals') || [];
    const levelInfo = this._getLevelInfo(user.points || 0);
    
    return `
      <section class="settings-section" aria-labelledby="stats-heading">
        <h2 class="settings-section__title" id="stats-heading">
          <i class="ti ti-trophy" aria-hidden="true"></i>
          סיכום פעילות
        </h2>
        <div class="settings-card">
          <div class="settings-stats">
            <div class="settings-stat">
              <span class="settings-stat__value settings-stat__value--gold">
                ${this._formatNumber(user.points || 0)}
              </span>
              <span class="settings-stat__label">נקודות</span>
            </div>
            
            <div class="settings-stat">
              <span class="settings-stat__value">${levelInfo.name}</span>
              <span class="settings-stat__label">רמה</span>
            </div>
            
            <div class="settings-stat">
              <span class="settings-stat__value">${referrals.length}</span>
              <span class="settings-stat__label">הפניות</span>
            </div>
            
            <div class="settings-stat">
              <span class="settings-stat__value">${stamps.length}</span>
              <span class="settings-stat__label">חותמות</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders notification preferences section
   * @returns {string} HTML string
   */
  _renderNotificationSection() {
    const emailNotifications = stateManager.getState('emailNotifications') !== false;
    
    return `
      <section class="settings-section" aria-labelledby="notifications-heading">
        <h2 class="settings-section__title" id="notifications-heading">
          <i class="ti ti-bell" aria-hidden="true"></i>
          העדפות התראות
        </h2>
        <div class="settings-card">
          <div class="settings-toggle">
            <div class="settings-toggle__content">
              <label class="settings-toggle__label" for="email-notifications-toggle">
                התראות באימייל
              </label>
              <span class="settings-toggle__hint">
                קבל עדכונים על סטטוס ההפניות שלך
              </span>
            </div>
            <button 
              id="email-notifications-toggle"
              class="toggle ${emailNotifications ? 'toggle--on' : ''}"
              data-action="toggle-notifications"
              role="switch"
              aria-checked="${emailNotifications}"
              aria-describedby="toggle-hint"
            >
              <span class="toggle__track"></span>
              <span class="toggle__thumb"></span>
            </button>
          </div>
          <p class="settings-hint" id="toggle-hint">
            במצב דמו, התראות לא נשלחות בפועל
          </p>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders account/logout section
   * @returns {string} HTML string
   */
  _renderAccountSection() {
    return `
      <section class="settings-section" aria-labelledby="account-heading">
        <h2 class="settings-section__title" id="account-heading">
          <i class="ti ti-logout" aria-hidden="true"></i>
          חשבון
        </h2>
        <div class="settings-card settings-card--danger">
          <p class="settings-card__description">
            התנתקות תסגור את החיבור לחשבונך. תוכל להתחבר מחדש בכל עת עם אימייל וקוד חד-פעמי.
          </p>
          <button 
            class="btn btn--danger btn--full"
            data-action="logout"
            aria-label="התנתק מהמערכת"
          >
            <i class="ti ti-logout" aria-hidden="true"></i>
            התנתק
          </button>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders about/info section
   * @returns {string} HTML string
   */
  _renderAboutSection() {
    return `
      <section class="settings-section" aria-labelledby="about-heading">
        <h2 class="settings-section__title" id="about-heading">
          <i class="ti ti-info-circle" aria-hidden="true"></i>
          אודות
        </h2>
        <div class="settings-card">
          <div class="settings-about">
            <div class="settings-about__logo" role="img" aria-label="PassportCard Refer v1.0">
              <img src="${CONFIG.LOGOS.STANDARD}" alt="" aria-hidden="true" class="settings-about__logo-img" />
              <span class="settings-about__version">Refer v1.0</span>
            </div>
            <p class="settings-about__description">
              מערכת הפניות עובדים של PassportCard. הפנו חברים לעבודה והרוויחו נקודות וחותמות!
            </p>
            <div class="settings-about__links">
              <button 
                class="btn btn--text btn--sm"
                data-action="show-how-it-works"
                aria-label="איך זה עובד"
              >
                <i class="ti ti-help" aria-hidden="true"></i>
                איך זה עובד?
              </button>
              <button 
                class="btn btn--text btn--sm"
                data-action="show-contact-hr"
                aria-label="צור קשר עם HR"
              >
                <i class="ti ti-mail" aria-hidden="true"></i>
                צור קשר עם HR
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders footer with demo disclaimer
   * @returns {string} HTML string
   */
  _renderFooter() {
    return `
      <footer class="settings-footer">
        <p class="settings-disclaimer">
          <i class="ti ti-info-circle" aria-hidden="true"></i>
          <span>זו גרסת דמו - הנתונים אינם אמיתיים</span>
        </p>
        <p class="settings-copyright">
          © ${new Date().getFullYear()} PassportCard. כל הזכויות שמורות.
        </p>
      </footer>
    `;
  }
  
  /**
   * Renders no user state
   * @returns {string} HTML string
   */
  _renderNoUser() {
    return `
      <div class="settings-error">
        <p>אנא התחבר כדי לצפות בהגדרות</p>
        <button class="btn btn--primary" data-navigate="auth">
          התחברות
        </button>
      </div>
    `;
  }
  
  // ========================
  // UTILITY METHODS
  // ========================
  
  /**
   * Gets level info based on points
   * @param {number} points - User's total points
   * @returns {Object} Level info with name and threshold
   */
  _getLevelInfo(points) {
    const levels = [
      { name: 'מתחיל', threshold: 0 },
      { name: 'פעיל', threshold: 250 },
      { name: 'מומחה', threshold: 750 },
      { name: 'אלוף', threshold: 2000 },
      { name: 'אגדה', threshold: 5000 }
    ];
    
    let currentLevel = levels[0];
    for (const level of levels) {
      if (points >= level.threshold) {
        currentLevel = level;
      }
    }
    return currentLevel;
  }
  
  /**
   * Formats number with thousands separator
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return num.toLocaleString('he-IL');
  }
  
  /**
   * Formats join date
   * @param {string|Date} date - Join date
   * @returns {string} Formatted date in Hebrew
   */
  _formatJoinDate(date) {
    if (!date) return '---';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('he-IL', { 
        year: 'numeric', 
        month: 'long'
      });
    } catch (e) {
      return date.toString();
    }
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
}
