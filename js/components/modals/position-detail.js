/**
 * Position Detail Modal Component
 * 
 * Story 4.3: Displays full position details in a modal with sharing and referral actions
 * 
 * @module components/modals/position-detail
 */

import { Component } from '../../core/component.js';
import { MOCK_POSITIONS } from '../../data/mock-positions.js';
import { renderIcon } from '../../services/icon-service.js';
import { stateManager } from '../../core/state.js';

/* ============================================================================
   POSITION DETAIL MODAL (Story 4.3)
   ============================================================================
   Displays full position details in a modal with sharing and referral actions
   ========================================================================== */

export class PositionDetailModal extends Component {
  constructor() {
    super();
    this._position = null;
    this._previousActiveElement = null;
    this._boundKeyHandler = null;
    this._boundOverlayClick = null;
    
    // Touch tracking for swipe-to-close
    this._touchStartY = 0;
    this._touchCurrentY = 0;
    this._isDragging = false;
    this._boundTouchStart = null;
    this._boundTouchMove = null;
    this._boundTouchEnd = null;
  }

  /**
   * Returns the position detail modal HTML template
   * @returns {string} HTML string
   */
  template() {
    const position = this._position;
    if (!position) return '';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return `
      <div class="modal-overlay modal--position-detail ${reducedMotion ? 'modal--no-animation' : ''}"
           data-action="close-position-modal-overlay"
           role="dialog"
           aria-modal="true"
           aria-labelledby="position-modal-title">
        
        <div class="position-detail-modal" onclick="event.stopPropagation()">
          <!-- Drag Handle (Mobile) -->
          <div class="modal__drag-handle" aria-hidden="true">
            <span class="modal__drag-bar"></span>
          </div>
          
          ${this._renderHeader()}
          
          <div class="modal__content">
            ${this._renderDetails()}
          </div>
          
          ${this._renderFooter()}
        </div>
      </div>
    `;
  }

  /**
   * Renders modal header with title, close, and share buttons
   * @returns {string} HTML string
   */
  _renderHeader() {
    const position = this._position;
    
    return `
      <header class="modal__header">
        <button class="modal__close-btn"
                data-action="close-position-modal"
                aria-label="סגור חלון">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
        
        <h2 class="modal__title" id="position-modal-title">
          ${this._escapeHtml(position.title)}
        </h2>
        
        <div class="modal__header-actions">
          <button class="modal__share-btn"
                  data-action="share-position-modal"
                  data-position-id="${position.id}"
                  aria-label="שתף משרה"
                  aria-haspopup="true">
            <i class="ti ti-share" aria-hidden="true"></i>
          </button>
        </div>
      </header>
    `;
  }

  /**
   * Renders full position details content
   * @returns {string} HTML string
   */
  _renderDetails() {
    return `
      <div class="position-detail">
        ${this._renderMetaInfo()}
        ${this._renderBadges()}
        ${this._renderDescription()}
        ${this._renderRequirements()}
        ${this._renderTeamInfo()}
        ${this._renderBonusBreakdown()}
      </div>
    `;
  }

  /**
   * Renders position meta information (department, location, type)
   * @returns {string} HTML string
   */
  _renderMetaInfo() {
    const position = this._position;
    const typeLabel = position.type === 'full-time' ? 'משרה מלאה' : 'משרה חלקית';
    
    return `
      <div class="position-detail__meta">
        <div class="position-detail__meta-item">
          <i class="ti ti-building" aria-hidden="true"></i>
          <span>${this._escapeHtml(position.department)}</span>
        </div>
        <div class="position-detail__meta-item">
          <i class="ti ti-map-pin" aria-hidden="true"></i>
          <span>${this._escapeHtml(position.location)}</span>
        </div>
        <div class="position-detail__meta-item">
          <i class="ti ti-clock" aria-hidden="true"></i>
          <span>${typeLabel}</span>
        </div>
      </div>
    `;
  }

  /**
   * Renders badges (hot, campaign)
   * @returns {string} HTML string
   */
  _renderBadges() {
    const position = this._position;
    
    if (!position.isHot && !position.campaign) {
      return '';
    }
    
    return `
      <div class="position-detail__badges">
        ${position.isHot ? `
          <span class="badge badge--hot badge--lg">
            ${renderIcon('flame')} משרה חמה - דרושים בדחיפות!
          </span>
        ` : ''}
        ${position.campaign ? `
          <span class="badge badge--campaign badge--lg">
            ${renderIcon('gift')} קמפיין ${this._escapeHtml(position.campaign.name)} - x${position.campaign.multiplier} נקודות!
          </span>
        ` : ''}
      </div>
    `;
  }

  /**
   * Renders job description section
   * @returns {string} HTML string
   */
  _renderDescription() {
    return `
      <section class="position-detail__section">
        <h3 class="position-detail__section-title">
          <i class="ti ti-file-description" aria-hidden="true"></i>
          תיאור המשרה
        </h3>
        <p class="position-detail__description">
          ${this._escapeHtml(this._position.description)}
        </p>
      </section>
    `;
  }

  /**
   * Renders requirements list
   * @returns {string} HTML string
   */
  _renderRequirements() {
    const requirements = this._position.requirements || [];
    
    if (requirements.length === 0) {
      return '';
    }
    
    return `
      <section class="position-detail__section">
        <h3 class="position-detail__section-title">
          <i class="ti ti-list-check" aria-hidden="true"></i>
          דרישות התפקיד
        </h3>
        <ul class="position-detail__requirements">
          ${requirements.map(req => `
            <li class="position-detail__requirement">
              <i class="ti ti-check" aria-hidden="true"></i>
              <span>${this._escapeHtml(req)}</span>
            </li>
          `).join('')}
        </ul>
      </section>
    `;
  }

  /**
   * Renders team/company info section
   * @returns {string} HTML string
   */
  _renderTeamInfo() {
    const position = this._position;
    
    return `
      <section class="position-detail__section">
        <h3 class="position-detail__section-title">
          <i class="ti ti-users" aria-hidden="true"></i>
          על הצוות
        </h3>
        <p class="position-detail__team-info">
          הצטרפו למחלקת ${this._escapeHtml(position.department)} של PassportCard!
          אנחנו צוות דינמי ומקצועי שמחפש אנשים מוכשרים להצטרף אלינו.
          סביבת עבודה מעולה, אפשרויות קידום, והזדמנות להשפיע.
        </p>
      </section>
    `;
  }

  /**
   * Renders bonus breakdown table
   * @returns {string} HTML string
   */
  _renderBonusBreakdown() {
    const position = this._position;
    const multiplier = position.campaign?.multiplier || 1;
    
    const stages = [
      { label: 'קו״ח הוגש', basePoints: 50, icon: 'file-text' },
      { label: 'ראיון נקבע', basePoints: 100, icon: 'calendar-event' },
      { label: 'גיוס מוצלח!', basePoints: position.bonus, icon: 'confetti' }
    ];
    
    const totalBase = stages.reduce((sum, s) => sum + s.basePoints, 0);
    const totalWithMultiplier = Math.round(totalBase * multiplier);
    
    return `
      <section class="position-detail__section position-detail__section--bonus">
        <h3 class="position-detail__section-title">
          <i class="ti ti-coins" aria-hidden="true"></i>
          פירוט בונוסים
        </h3>
        
        <div class="bonus-breakdown">
          ${stages.map(stage => {
            const points = Math.round(stage.basePoints * multiplier);
            return `
              <div class="bonus-breakdown__row">
                <span class="bonus-breakdown__icon">${renderIcon(stage.icon)}</span>
                <span class="bonus-breakdown__label">${stage.label}</span>
                <span class="bonus-breakdown__points ${multiplier > 1 ? 'bonus-breakdown__points--multiplied' : ''}">
                  +${points}
                  ${multiplier > 1 ? `<span class="bonus-breakdown__multiplier">(x${multiplier})</span>` : ''}
                </span>
              </div>
            `;
          }).join('')}
          
          <div class="bonus-breakdown__divider"></div>
          
          <div class="bonus-breakdown__row bonus-breakdown__row--total">
            <span class="bonus-breakdown__icon">${renderIcon('coins')}</span>
            <span class="bonus-breakdown__label">סה״כ פוטנציאלי</span>
            <span class="bonus-breakdown__points bonus-breakdown__points--total">
              +${totalWithMultiplier} נקודות
            </span>
          </div>
        </div>
        
        ${multiplier > 1 ? `
          <p class="bonus-breakdown__campaign-note">
            ${renderIcon('target')} קמפיין "${this._escapeHtml(position.campaign.name)}" פעיל - נקודות כפולות!
          </p>
        ` : ''}
      </section>
    `;
  }

  /**
   * Renders fixed footer with CTA
   * @returns {string} HTML string
   */
  _renderFooter() {
    const position = this._position;
    const multiplier = position.campaign?.multiplier || 1;
    const totalPoints = Math.round((50 + 100 + position.bonus) * multiplier);
    
    return `
      <footer class="modal__footer">
        <div class="modal__footer-info">
          <span class="modal__footer-bonus">עד +${totalPoints} נקודות</span>
        </div>
        <button class="btn btn--primary btn--lg modal__cta"
                data-action="refer-from-modal"
                data-position-id="${position.id}">
          <i class="ti ti-user-plus" aria-hidden="true"></i>
          הפנה עכשיו
        </button>
      </footer>
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
   * Opens the modal with animation
   * @param {Object} position - Position data to display
   */
  open(position) {
    if (!position) return;
    
    this._position = position;
    this._previousActiveElement = document.activeElement;
    
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    // Render modal to container
    container.innerHTML = this.template();
    container.classList.add('active');
    
    // Prevent body scroll
    document.body.classList.add('modal-open');
    
    // Add event listeners
    this._bindEvents();
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      const overlay = container.querySelector('.modal--position-detail');
      if (overlay) {
        overlay.classList.add('modal--visible');
        
        // Focus on close button for accessibility
        const closeBtn = overlay.querySelector('.modal__close-btn');
        if (closeBtn) {
          closeBtn.focus();
        }
      }
    });
  }

  /**
   * Closes the modal with animation
   */
  close() {
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    const overlay = container.querySelector('.modal--position-detail');
    if (overlay) {
      overlay.classList.remove('modal--visible');
      overlay.classList.add('modal--closing');
    }
    
    // Wait for animation to complete
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationDuration = reducedMotion ? 0 : 300;
    
    setTimeout(() => {
      // Clean up
      this._unbindEvents();
      container.innerHTML = '';
      container.classList.remove('active');
      
      // Restore body scroll
      document.body.classList.remove('modal-open');
      
      // Restore focus
      if (this._previousActiveElement) {
        this._previousActiveElement.focus();
        this._previousActiveElement = null;
      }
      
      // Reset state
      this._position = null;
      
      // Update app state
      stateManager.setState({
        activeModal: null,
        selectedPosition: null
      });
    }, animationDuration);
  }

  /**
   * Binds modal-specific event listeners
   */
  _bindEvents() {
    // Escape key handler
    this._boundKeyHandler = this._handleKeyDown.bind(this);
    document.addEventListener('keydown', this._boundKeyHandler);
    
    // Touch events for swipe-to-close (mobile)
    const modal = document.querySelector('.position-detail-modal');
    if (modal) {
      this._boundTouchStart = this._handleTouchStart.bind(this);
      this._boundTouchMove = this._handleTouchMove.bind(this);
      this._boundTouchEnd = this._handleTouchEnd.bind(this);
      
      modal.addEventListener('touchstart', this._boundTouchStart, { passive: true });
      modal.addEventListener('touchmove', this._boundTouchMove, { passive: false });
      modal.addEventListener('touchend', this._boundTouchEnd);
    }
  }

  /**
   * Unbinds modal-specific event listeners
   */
  _unbindEvents() {
    if (this._boundKeyHandler) {
      document.removeEventListener('keydown', this._boundKeyHandler);
      this._boundKeyHandler = null;
    }
    
    const modal = document.querySelector('.position-detail-modal');
    if (modal) {
      if (this._boundTouchStart) {
        modal.removeEventListener('touchstart', this._boundTouchStart);
      }
      if (this._boundTouchMove) {
        modal.removeEventListener('touchmove', this._boundTouchMove);
      }
      if (this._boundTouchEnd) {
        modal.removeEventListener('touchend', this._boundTouchEnd);
      }
    }
    
    this._boundTouchStart = null;
    this._boundTouchMove = null;
    this._boundTouchEnd = null;
  }

  /**
   * Handles keydown events for modal
   * @param {KeyboardEvent} e - Keyboard event
   */
  _handleKeyDown(e) {
    // Escape key closes modal
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }
    
    // Focus trap with Tab key
    if (e.key === 'Tab') {
      this._handleFocusTrap(e);
    }
  }

  /**
   * Traps focus within modal
   * @param {KeyboardEvent} e - Tab key event
   */
  _handleFocusTrap(e) {
    const modal = document.querySelector('.position-detail-modal');
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      // Shift + Tab: moving backward
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab: moving forward
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  /**
   * Handles touch start for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchStart(e) {
    // Only track touch on drag handle or header area
    const target = e.target;
    const modal = document.querySelector('.position-detail-modal');
    const dragHandle = modal?.querySelector('.modal__drag-handle');
    const header = modal?.querySelector('.modal__header');
    
    if (target === dragHandle || dragHandle?.contains(target) || 
        target === header || header?.contains(target)) {
      this._touchStartY = e.touches[0].clientY;
      this._isDragging = true;
    }
  }

  /**
   * Handles touch move for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchMove(e) {
    if (!this._isDragging) return;
    
    this._touchCurrentY = e.touches[0].clientY;
    const deltaY = this._touchCurrentY - this._touchStartY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      const modal = document.querySelector('.position-detail-modal');
      if (modal) {
        modal.style.transform = `translateY(${deltaY}px)`;
        e.preventDefault();
      }
    }
  }

  /**
   * Handles touch end for swipe gesture
   * @param {TouchEvent} e - Touch event
   */
  _handleTouchEnd(e) {
    if (!this._isDragging) return;
    
    const deltaY = this._touchCurrentY - this._touchStartY;
    const threshold = 100; // Minimum swipe distance to close
    
    const modal = document.querySelector('.position-detail-modal');
    
    if (deltaY > threshold) {
      // Close modal
      this.close();
    } else {
      // Reset position
      if (modal) {
        modal.style.transform = '';
      }
    }
    
    this._isDragging = false;
    this._touchStartY = 0;
    this._touchCurrentY = 0;
  }

  /**
   * Shares the position via Web Share API or clipboard
   * @param {string} positionId - Position ID to share
   */
  async sharePosition(positionId) {
    const position = MOCK_POSITIONS.find(p => p.id === positionId);
    if (!position) return;
    
    // Generate share URL
    const currentUser = stateManager.getState('currentUser');
    const userId = currentUser?.id || 'user';
    const shareUrl = `${window.location.origin}${window.location.pathname}?ref=${userId}&pos=${positionId}`;
    const shareText = `משרה מעולה ב-PassportCard: ${position.title}`;
    
    // Try Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: position.title,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or not supported, fall through to clipboard
        if (err.name === 'AbortError') return;
        console.warn('Share failed:', err);
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      app.showToast('הקישור הועתק!', 'success');
    } catch (err) {
      console.error('Copy failed:', err);
      app.showToast('שגיאה בהעתקה', 'error');
    }
  }

  /**
   * Component unmount lifecycle
   */
  unmount() {
    this._unbindEvents();
    super.unmount();
  }
}

// Global position detail modal instance
export const positionDetailModal = new PositionDetailModal();

/**
 * Initializes the position detail modal module
 */
export function initPositionDetailModule() {
  // Module initialization if needed
  console.log('[Module] Position Detail Modal initialized');
}
