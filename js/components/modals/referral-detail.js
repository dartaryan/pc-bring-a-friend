/**
 * Referral Detail Modal Component
 * 
 * Story 5.3: Displays detailed referral information with timeline and points breakdown
 * 
 * @module components/modals/referral-detail
 */

import { Component } from '../../core/component.js';
import { REFERRAL_STATUS_CONFIG } from '../../data/status-config.js';
import { renderIcon } from '../../services/icon-service.js';
import { renderStatusPipeline } from '../referrals.js';
import { stateManager } from '../../core/state.js';

/* ============================================================================
   REFERRAL DETAIL MODAL (Story 5.3)
   ============================================================================
   Displays detailed referral information with timeline and points breakdown
   ========================================================================== */

export class ReferralDetailModal extends Component {
  constructor() {
    super();
    this._referral = null;
    this._previousActiveElement = null;
    this._boundKeyHandler = null;
    
    // Touch tracking for swipe-to-close
    this._touchStartY = 0;
    this._touchCurrentY = 0;
    this._isDragging = false;
    this._boundTouchStart = null;
    this._boundTouchMove = null;
    this._boundTouchEnd = null;
  }

  /**
   * Returns the referral detail modal HTML template
   * @returns {string} HTML string
   */
  template() {
    const referral = this._referral;
    if (!referral) return '';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return `
      <div class="modal-overlay modal--referral-detail ${reducedMotion ? 'modal--no-animation' : ''}"
           data-action="close-referral-modal-overlay"
           role="dialog"
           aria-modal="true"
           aria-labelledby="referral-modal-title">
        
        <div class="referral-detail-modal">
          <!-- Drag Handle (Mobile) -->
          <div class="modal__drag-handle" aria-hidden="true">
            <span class="modal__drag-bar"></span>
          </div>
          
          ${this._renderHeader()}
          
          <div class="modal__content referral-detail-modal__content">
            ${this._renderStatusPipeline()}
            ${this._renderTimeline()}
            ${this._renderPointsBreakdown()}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renders modal header with candidate info and close button
   * @returns {string} HTML string
   */
  _renderHeader() {
    const referral = this._referral;
    const initials = this._getInitials(referral.candidateName);
    const statusInfo = REFERRAL_STATUS_CONFIG[referral.status] || REFERRAL_STATUS_CONFIG.submitted;
    
    return `
      <header class="referral-detail-modal__header">
        <div class="referral-detail-modal__candidate">
          <div class="referral-detail-modal__avatar" style="--avatar-color: ${statusInfo.color}">
            ${initials}
          </div>
          <div class="referral-detail-modal__info">
            <h2 class="referral-detail-modal__name" id="referral-modal-title">
              ${this._escapeHtml(referral.candidateName)}
            </h2>
            <p class="referral-detail-modal__position">
              ${this._escapeHtml(referral.positionTitle)}
            </p>
          </div>
        </div>
        <button class="referral-detail-modal__close"
                data-action="close-referral-modal"
                aria-label="סגור">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </header>
    `;
  }

  /**
   * Renders full-size status pipeline
   * @returns {string} HTML string
   */
  _renderStatusPipeline() {
    return `
      <section class="referral-detail-modal__section">
        <h3 class="referral-detail-modal__section-title">
          <i class="ti ti-progress" aria-hidden="true"></i>
          סטטוס ההפניה
        </h3>
        ${renderStatusPipeline(this._referral, 'full')}
      </section>
    `;
  }

  /**
   * Renders vertical timeline section
   * @returns {string} HTML string
   */
  _renderTimeline() {
    const timeline = this._referral.timeline || [];
    
    // Ensure at least submission entry exists
    if (timeline.length === 0) {
      const submissionTimeline = [{
        status: 'submitted',
        date: this._referral.submittedAt || new Date().toISOString(),
        points: 50
      }];
      return this._renderTimelineContent(submissionTimeline);
    }
    
    return this._renderTimelineContent(timeline);
  }

  /**
   * Renders timeline content
   * @param {Array} timeline - Timeline entries
   * @returns {string} HTML string
   */
  _renderTimelineContent(timeline) {
    return `
      <section class="referral-detail-modal__section">
        <h3 class="referral-detail-modal__section-title">
          <i class="ti ti-history" aria-hidden="true"></i>
          ציר זמן
        </h3>
        <div class="referral-timeline">
          ${timeline.map((entry, index) => this._renderTimelineEntry(entry, index, timeline.length)).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Renders a single timeline entry
   * @param {Object} entry - Timeline entry
   * @param {number} index - Entry index
   * @param {number} total - Total entries
   * @returns {string} HTML string
   */
  _renderTimelineEntry(entry, index, total) {
    const statusInfo = REFERRAL_STATUS_CONFIG[entry.status] || REFERRAL_STATUS_CONFIG.submitted;
    const isLatest = index === total - 1;
    const isRejected = entry.status === 'rejected';
    const formattedDate = this._formatHebrewDate(entry.date);
    
    let entryClass = 'referral-timeline__entry';
    if (isLatest) entryClass += ' referral-timeline__entry--current';
    if (isRejected) entryClass += ' referral-timeline__entry--rejected';
    
    return `
      <div class="${entryClass}">
        <div class="referral-timeline__marker" style="--marker-color: ${statusInfo.color}">
          <i class="ti ${this._getStatusIcon(entry.status)}" aria-hidden="true"></i>
        </div>
        <div class="referral-timeline__content">
          <div class="referral-timeline__status">
            <span class="referral-timeline__status-text">${statusInfo.hebrew}</span>
            ${entry.points > 0 ? `
              <span class="referral-timeline__points">+${entry.points} נקודות</span>
            ` : ''}
          </div>
          <time class="referral-timeline__date">${formattedDate}</time>
        </div>
      </div>
    `;
  }

  /**
   * Gets icon class for status
   * @param {string} status - Status key
   * @returns {string} Tabler icon class
   */
  _getStatusIcon(status) {
    const icons = {
      submitted: 'ti-send',
      review: 'ti-eye',
      interview: 'ti-phone',
      offer: 'ti-file-text',
      hired: 'ti-confetti',
      rejected: 'ti-x'
    };
    return icons[status] || 'ti-circle';
  }

  /**
   * Renders points breakdown section
   * @returns {string} HTML string
   */
  _renderPointsBreakdown() {
    const isHired = this._referral.status === 'hired';
    const isRejected = this._referral.status === 'rejected';
    
    return `
      <section class="referral-detail-modal__section">
        <h3 class="referral-detail-modal__section-title">
          <i class="ti ti-trophy" aria-hidden="true"></i>
          נקודות
        </h3>
        
        <div class="points-breakdown">
          <!-- Points Earned -->
          <div class="points-breakdown__row points-breakdown__row--total">
            <span class="points-breakdown__label">נקודות שהושגו</span>
            <span class="points-breakdown__value points-breakdown__value--earned">
              ${this._formatNumber(this._referral.pointsEarned || 0)}
            </span>
          </div>
          
          <!-- Stage Breakdown -->
          <div class="points-breakdown__details">
            ${this._renderStageBreakdown()}
          </div>
          
          ${!isRejected ? `
            <!-- Potential Points -->
            <div class="points-breakdown__row points-breakdown__row--potential">
              <span class="points-breakdown__label">נקודות פוטנציאליות</span>
              <span class="points-breakdown__value points-breakdown__value--potential">
                ${this._formatNumber(this._referral.potentialPoints || 0)}
              </span>
            </div>
          ` : ''}
          
          ${isHired ? this._renderMilestones() : ''}
          ${!isHired && !isRejected ? this._renderPotentialMilestones() : ''}
        </div>
      </section>
    `;
  }

  /**
   * Renders breakdown by stage
   * @returns {string} HTML string
   */
  _renderStageBreakdown() {
    const timeline = this._referral.timeline || [];
    const earnedStages = timeline.filter(t => t.points > 0);
    
    if (earnedStages.length === 0) {
      return '';
    }
    
    return earnedStages.map(entry => {
      const statusInfo = REFERRAL_STATUS_CONFIG[entry.status] || {};
      return `
        <div class="points-breakdown__stage">
          <span>${statusInfo.hebrew || entry.status}</span>
          <span>+${entry.points}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Renders milestone bonuses for hired referrals
   * @returns {string} HTML string
   */
  _renderMilestones() {
    const milestones = this._referral.milestones || {};
    const today = new Date();
    
    const milestoneData = [
      { 
        key: 'threeMonth', 
        label: 'בונוס 3 חודשים', 
        points: 200,
        date: milestones.threeMonth 
      },
      { 
        key: 'sixMonth', 
        label: 'בונוס 6 חודשים', 
        points: 400,
        date: milestones.sixMonth 
      }
    ];
    
    return `
      <div class="points-breakdown__milestones">
        <h4 class="points-breakdown__milestones-title">
          <i class="ti ti-calendar-event" aria-hidden="true"></i>
          בונוסים צפויים
        </h4>
        ${milestoneData.map(m => {
          const milestoneDate = m.date ? new Date(m.date) : null;
          const isPast = milestoneDate && milestoneDate < today;
          const formattedDate = m.date ? this._formatHebrewDate(m.date) : 'לא ידוע';
          
          return `
            <div class="points-breakdown__milestone ${isPast ? 'points-breakdown__milestone--earned' : ''}">
              <span class="points-breakdown__milestone-label">
                ${m.label}: +${m.points} נקודות
              </span>
              <span class="points-breakdown__milestone-date">
                ${isPast ? `${renderIcon('check')} הושג` : `צפוי: ${formattedDate}`}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Renders potential milestones for in-progress referrals
   * @returns {string} HTML string
   */
  _renderPotentialMilestones() {
    return `
      <div class="points-breakdown__milestones points-breakdown__milestones--potential">
        <h4 class="points-breakdown__milestones-title">
          <i class="ti ti-sparkles" aria-hidden="true"></i>
          אם יגויס
        </h4>
        <div class="points-breakdown__milestone">
          <span>בונוס גיוס: +500 נקודות</span>
        </div>
        <div class="points-breakdown__milestone">
          <span>בונוס 3 חודשים: +200 נקודות</span>
        </div>
        <div class="points-breakdown__milestone">
          <span>בונוס 6 חודשים: +400 נקודות</span>
        </div>
      </div>
    `;
  }

  /**
   * Gets initials from name
   * @param {string} name - Full name
   * @returns {string} Initials
   */
  _getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0);
    }
    return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
  }

  /**
   * Formats date in Hebrew
   * @param {string} dateStr - Date string
   * @returns {string} Hebrew formatted date
   */
  _formatHebrewDate(dateStr) {
    if (!dateStr) return 'לא ידוע';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'לא ידוע';
    
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
   * Formats number with locale
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return new Intl.NumberFormat('he-IL').format(num || 0);
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
   * @param {Object} referral - Referral data to display
   */
  open(referral) {
    if (!referral) return;
    
    this._referral = referral;
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
      const overlay = container.querySelector('.modal--referral-detail');
      if (overlay) {
        overlay.classList.add('modal--visible');
        
        // Focus on close button for accessibility
        const closeBtn = overlay.querySelector('.referral-detail-modal__close');
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
    
    const overlay = container.querySelector('.modal--referral-detail');
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
      this._referral = null;
      
      // Update app state
      stateManager.setState({
        activeModal: null,
        selectedReferral: null
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
    const modal = document.querySelector('.referral-detail-modal');
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
    
    const modal = document.querySelector('.referral-detail-modal');
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
    const modal = document.querySelector('.referral-detail-modal');
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
    const modal = document.querySelector('.referral-detail-modal');
    const dragHandle = modal?.querySelector('.modal__drag-handle');
    const header = modal?.querySelector('.referral-detail-modal__header');
    
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
      const modal = document.querySelector('.referral-detail-modal');
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
    
    const modal = document.querySelector('.referral-detail-modal');
    
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
   * Component unmount lifecycle
   */
  unmount() {
    this._unbindEvents();
    super.unmount();
  }
}

// Global referral detail modal instance
export const referralDetailModal = new ReferralDetailModal();

/**
 * Initializes the referral detail modal module
 */
export function initReferralDetailModule() {
  // Module initialization if needed
  console.log('[Module] Referral Detail Modal initialized');
}
