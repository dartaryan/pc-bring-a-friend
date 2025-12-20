/**
 * Share Panel Component
 * 
 * Story 4.4: Panel for sharing referral links via copy, WhatsApp, email, or native share
 * 
 * @module components/modals/share-panel
 */

import { Component } from '../../core/component.js';
import { MOCK_POSITIONS } from '../../data/mock-positions.js';
import { stateManager } from '../../core/state.js';

/* ============================================================================
   SHARE PANEL COMPONENT (Story 4.4)
   ============================================================================
   Panel for sharing referral links via copy, WhatsApp, email, or native share
   ========================================================================== */

export class SharePanel extends Component {
  constructor(props) {
    super(props);
    this.position = props.position || null;
    this.referralLink = '';
    this.isCopied = false;
    this.copyTimeout = null;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    if (!this.position) return '';
    
    this.referralLink = this._generateReferralLink();
    
    return `
      <div class="share-panel-overlay share-panel-overlay--visible" 
           data-action="close-share-panel-overlay"
           role="presentation">
        <div class="share-panel" 
             id="share-panel" 
             role="dialog" 
             aria-labelledby="share-panel-title"
             aria-modal="true">
          <header class="share-panel__header">
            <h3 class="share-panel__title" id="share-panel-title">
              <i class="ti ti-share" aria-hidden="true"></i>
              שתף קישור הפניה
            </h3>
            <button class="share-panel__close"
                    data-action="close-share-panel"
                    aria-label="סגור פאנל שיתוף">
              <i class="ti ti-x" aria-hidden="true"></i>
            </button>
          </header>
          
          <div class="share-panel__content">
            <p class="share-panel__position">
              משרה: <strong>${this._escapeHtml(this.position.title)}</strong>
            </p>
            
            ${this._renderLinkField()}
            ${this._renderShareButtons()}
            ${this._renderNativeShare()}
          </div>
          
          <footer class="share-panel__footer">
            <button class="btn btn--secondary btn--full"
                    data-action="continue-to-referral"
                    data-position-id="${this.position.id}">
              המשך להפניה
              <i class="ti ti-arrow-left" aria-hidden="true"></i>
            </button>
          </footer>
        </div>
      </div>
    `;
  }
  
  /**
   * Renders the link display field with copy button
   * @returns {string} HTML string
   */
  _renderLinkField() {
    return `
      <div class="share-panel__link-field">
        <label for="referral-link-input" class="visually-hidden">קישור הפניה</label>
        <input type="text"
               id="referral-link-input"
               class="share-panel__link-input"
               value="${this._escapeHtml(this.referralLink)}"
               readonly
               dir="ltr"
               aria-describedby="link-copy-status">
        
        <button class="share-panel__copy-btn ${this.isCopied ? 'share-panel__copy-btn--copied' : ''}"
                data-action="copy-referral-link"
                aria-label="העתק קישור"
                aria-describedby="link-copy-status">
          <i class="ti ${this.isCopied ? 'ti-check' : 'ti-copy'}" aria-hidden="true"></i>
          <span>${this.isCopied ? 'הועתק!' : 'העתק'}</span>
        </button>
        
        <span id="link-copy-status" class="visually-hidden" aria-live="polite">
          ${this.isCopied ? 'הקישור הועתק ללוח' : ''}
        </span>
      </div>
    `;
  }
  
  /**
   * Renders WhatsApp and Email share buttons
   * @returns {string} HTML string
   */
  _renderShareButtons() {
    const whatsappUrl = this._getWhatsAppUrl();
    const emailUrl = this._getEmailUrl();
    
    return `
      <div class="share-panel__buttons">
        <a href="${whatsappUrl}"
           class="share-panel__btn share-panel__btn--whatsapp"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="שתף בוואטסאפ">
          <i class="ti ti-brand-whatsapp" aria-hidden="true"></i>
          <span>WhatsApp</span>
        </a>
        
        <a href="${emailUrl}"
           class="share-panel__btn share-panel__btn--email"
           aria-label="שתף באימייל">
          <i class="ti ti-mail" aria-hidden="true"></i>
          <span>אימייל</span>
        </a>
      </div>
    `;
  }
  
  /**
   * Renders native share button if supported
   * @returns {string} HTML string
   */
  _renderNativeShare() {
    // Only show if Web Share API is supported
    if (typeof navigator !== 'undefined' && navigator.share) {
      return `
        <div class="share-panel__native">
          <button class="btn btn--outline-primary btn--full"
                  data-action="native-share-referral"
                  data-position-id="${this.position.id}">
            <i class="ti ti-share" aria-hidden="true"></i>
            שתף באפליקציה אחרת...
          </button>
        </div>
      `;
    }
    
    return '';
  }
  
  /**
   * Generates unique referral link
   * @returns {string} Referral URL
   */
  _generateReferralLink() {
    const currentUser = stateManager.getState('currentUser');
    const userId = currentUser?.id || 'unknown';
    const positionId = this.position.id;
    
    // Use current origin + pathname for base URL
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    
    // Add referral tracking params
    return `${baseUrl}?ref=${userId}&pos=${positionId}`;
  }
  
  /**
   * Generates WhatsApp share URL
   * @returns {string} WhatsApp intent URL
   */
  _getWhatsAppUrl() {
    const message = this._getShareMessage();
    const encoded = encodeURIComponent(message);
    return `https://wa.me/?text=${encoded}`;
  }
  
  /**
   * Generates email mailto URL
   * @returns {string} mailto URL
   */
  _getEmailUrl() {
    const subject = `הזדמנות קריירה ב-PassportCard - ${this.position.title}`;
    const body = this._getEmailBody();
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
  }
  
  /**
   * Generates share message for WhatsApp
   * @returns {string} Share message
   */
  _getShareMessage() {
    return `היי!\n\nיש משרה מעולה ב-PassportCard:\n${this.position.title}\n\nאשמח להמליץ עליך!\n\n${this.referralLink}`;
  }
  
  /**
   * Generates email body
   * @returns {string} Email body text
   */
  _getEmailBody() {
    return `שלום,

רציתי לשתף איתך הזדמנות קריירה מעניינת ב-PassportCard:

${this.position.title}
מחלקה: ${this.position.department}
מיקום: ${this.position.location}

אני חושב/ת שאת/ה יכול/ה להתאים למשרה הזו ואשמח להמליץ עליך!

להגשת מועמדות דרך ההמלצה שלי:
${this.referralLink}

בהצלחה!`;
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
   * Handles copy to clipboard
   */
  async handleCopyLink() {
    try {
      await navigator.clipboard.writeText(this.referralLink);
      
      // Update copied state
      this.isCopied = true;
      this._updateCopyButton();
      
      // Show toast
      app.showToast('הועתק!', 'success');
      
      // Reset after 2 seconds
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }
      this.copyTimeout = setTimeout(() => {
        this.isCopied = false;
        this._updateCopyButton();
      }, 2000);
      
    } catch (err) {
      console.error('Copy failed:', err);
      app.showToast('שגיאה בהעתקה', 'error');
    }
  }
  
  /**
   * Updates copy button visual state
   */
  _updateCopyButton() {
    const btn = document.querySelector('.share-panel__copy-btn');
    const icon = btn?.querySelector('.ti');
    const text = btn?.querySelector('span');
    const status = document.getElementById('link-copy-status');
    
    if (btn && icon && text) {
      btn.classList.toggle('share-panel__copy-btn--copied', this.isCopied);
      icon.className = `ti ${this.isCopied ? 'ti-check' : 'ti-copy'}`;
      text.textContent = this.isCopied ? 'הועתק!' : 'העתק';
    }
    
    if (status) {
      status.textContent = this.isCopied ? 'הקישור הועתק ללוח' : '';
    }
  }
  
  /**
   * Handles native share
   */
  async handleNativeShare() {
    if (!navigator.share) return;
    
    try {
      await navigator.share({
        title: this.position.title,
        text: `משרה מעולה ב-PassportCard: ${this.position.title}`,
        url: this.referralLink
      });
    } catch (err) {
      // User cancelled share - not an error
      if (err.name !== 'AbortError') {
        console.warn('Share failed:', err);
      }
    }
  }
  
  /**
   * Closes the share panel
   */
  close() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
    
    // Clear instance from state
    stateManager.setState({
      sharePanelInstance: null,
      sharePanel: null
    });
    
    // Remove from DOM
    const container = document.getElementById('modal-container');
    const overlay = container?.querySelector('.share-panel-overlay');
    if (overlay) {
      overlay.classList.remove('share-panel-overlay--visible');
      setTimeout(() => {
        if (container.contains(overlay)) {
          container.removeChild(overlay);
        }
      }, 200);
    }
  }
  
  /**
   * Opens the share panel
   */
  open() {
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    // Store instance in state
    stateManager.setState({
      sharePanelInstance: this,
      sharePanel: this.position.id
    });
    
    // Render to container
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template();
    container.appendChild(wrapper.firstElementChild);
    
    this._element = container.querySelector('.share-panel');
    this.mount();
    
    // Focus the panel for accessibility
    setTimeout(() => {
      const firstButton = this._element?.querySelector('button, [href]');
      firstButton?.focus();
    }, 100);
  }
  
  /**
   * Bind events
   */
  bindEvents() {
    // Event delegation handled by ModalManager/App
  }
  
  // Lifecycle methods
  mount() {
    this._mounted = true;
    this.bindEvents();
  }
  
  unmount() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
    this._mounted = false;
  }
}

/**
 * Opens the share panel for a position
 * @param {string} positionId - Position ID to share
 */
export function openSharePanel(positionId) {
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  if (!position) return;
  
  // Close any existing share panel
  const existingInstance = stateManager.getState('sharePanelInstance');
  if (existingInstance) {
    existingInstance.close();
  }
  
  // Create and open new share panel
  const sharePanel = new SharePanel({ position });
  sharePanel.open();
}

/**
 * Generates a unique referral link for a position
 * @param {string} positionId - Position ID (e.g., 'pos-001')
 * @param {string} [userId] - User ID, defaults to current user
 * @returns {string} Complete referral URL
 */
export function generateReferralLink(positionId, userId = null) {
  const currentUser = stateManager.getState('currentUser');
  const uid = userId || currentUser?.id || 'unknown';
  
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?ref=${uid}&pos=${positionId}`;
}

/**
 * Initializes the share panel module
 */
export function initSharePanelModule() {
  // Module initialization if needed
  console.log('[Module] Share Panel initialized');
}
