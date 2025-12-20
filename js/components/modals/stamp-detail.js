/**
 * PassportCard Refer - Stamp Detail Modal
 * Modal for displaying stamp details with celebration effects (Story 3.5)
 */

import { Component } from '../../core/component.js';
import { STAMP_TYPES } from '../../data/stamp-types.js';
import { renderIcon } from '../../core/utils.js';

/* ============================================================================
   STAMP DETAIL MODAL (Story 3.5)
   ============================================================================
   Modal for displaying stamp details with celebration effects
   ========================================================================== */

export class StampDetailModal extends Component {
  constructor() {
    super();
    this._stamp = null;
    this._previousActiveElement = null;
    this._boundKeyHandler = null;
  }

  /**
   * Returns the stamp detail modal HTML template
   * @returns {string} HTML string
   */
  template() {
    const stamp = this._stamp;
    if (!stamp) return '';

    const config = STAMP_TYPES[stamp.type] || STAMP_TYPES.submitted;
    const formattedDate = this._formatStampDate(stamp.earnedDate);

    return `
      <div class="modal-overlay modal--stamp-detail"
           data-action="close-stamp-modal-overlay"
           role="dialog"
           aria-modal="true"
           aria-labelledby="stamp-modal-title"
           aria-describedby="stamp-modal-desc">
        <div class="modal-content stamp-modal" onclick="event.stopPropagation()">
          <button class="modal-close"
                  data-action="close-stamp-modal"
                  aria-label="סגור">
            <i class="ti ti-x" aria-hidden="true"></i>
          </button>
          
          <div class="stamp-modal__stamp">
            ${this._renderEnlargedStamp(stamp, config)}
          </div>
          
          <div class="stamp-modal__details">
            <h2 id="stamp-modal-title" class="stamp-modal__title">
              ${renderIcon(config.icon)} ${config.label}
            </h2>
            
            <div class="stamp-modal__points">
              <span class="stamp-modal__points-value">+${config.points}</span>
              <span class="stamp-modal__points-label">נקודות</span>
            </div>
            
            <p id="stamp-modal-desc" class="stamp-modal__description">
              ${config.description || ''}
            </p>
            
            <div class="stamp-modal__meta">
              <div class="stamp-modal__meta-item">
                <i class="ti ti-calendar" aria-hidden="true"></i>
                <span>נצבר: ${formattedDate}</span>
              </div>
              ${stamp.candidateName ? `
                <div class="stamp-modal__meta-item">
                  <i class="ti ti-user" aria-hidden="true"></i>
                  <span>מועמד: ${stamp.candidateName}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renders enlarged stamp for modal display
   * @param {Object} stamp - Stamp data
   * @param {Object} config - Stamp type config
   * @returns {string} HTML string
   */
  _renderEnlargedStamp(stamp, config) {
    return `
      <div class="stamp stamp--large stamp--${config.shape} stamp--${stamp.type}"
           style="--stamp-color: ${config.color}; --stamp-rotation: 0deg"
           aria-hidden="true">
        <div class="stamp__shape">
          <div class="stamp__inner">
            <span class="stamp__icon">
              <i class="ti ti-${config.icon}"></i>
            </span>
            <span class="stamp__label">${config.label}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Formats stamp date in Hebrew
   * @param {Date|string} date - Earned date
   * @returns {string}
   */
  _formatStampDate(date) {
    const months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  /**
   * Opens modal with stamp data
   * @param {Object} stamp - Stamp to display
   */
  open(stamp) {
    this._stamp = stamp;
    this._previousActiveElement = document.activeElement;

    const container = document.getElementById('modal-container');
    if (!container) return;

    container.classList.add('active');
    container.innerHTML = this.render();
    this._element = container.querySelector('.modal--stamp-detail');

    // Animate in
    requestAnimationFrame(() => {
      this._element?.classList.add('modal--visible');
    });

    // Set up keyboard handling
    this._boundKeyHandler = this._handleKeydown.bind(this);
    document.addEventListener('keydown', this._boundKeyHandler);

    // Trap focus
    this._trapFocus();

    this.mount();
  }

  /**
   * Closes the modal
   */
  close() {
    if (!this._element) return;

    this._element.classList.remove('modal--visible');
    this._element.classList.add('modal--closing');

    // Wait for animation
    setTimeout(() => {
      const container = document.getElementById('modal-container');
      if (container) {
        container.classList.remove('active');
        container.innerHTML = '';
      }

      // Return focus
      if (this._previousActiveElement) {
        this._previousActiveElement.focus();
      }

      // Clear state
      stateManager.setState({
        selectedStamp: null,
        activeModal: null
      });
    }, 300);

    // Remove keydown listener
    if (this._boundKeyHandler) {
      document.removeEventListener('keydown', this._boundKeyHandler);
      this._boundKeyHandler = null;
    }

    this.unmount();
  }

  /**
   * Handles keydown for Escape to close and Tab trapping
   * @param {KeyboardEvent} e
   */
  _handleKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }

    // Tab trapping
    if (e.key === 'Tab') {
      this._handleTabKey(e);
    }
  }

  /**
   * Traps focus within modal
   */
  _trapFocus() {
    const focusableElements = this._element?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  /**
   * Handles Tab key for focus trapping
   * @param {KeyboardEvent} e
   */
  _handleTabKey(e) {
    const focusableElements = this._element?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Component mount lifecycle
   */
  mount() {
    super.mount();
    // Handle swipe down on mobile
    this._setupSwipeToClose();
  }

  /**
   * Sets up swipe-to-close gesture
   */
  _setupSwipeToClose() {
    const content = this._element?.querySelector('.modal-content');
    if (!content) return;

    let startY = 0;
    let currentY = 0;

    content.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    content.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // Only track downward swipes
      if (deltaY > 0) {
        content.style.transform = `translateY(${deltaY}px)`;
      }
    }, { passive: true });

    content.addEventListener('touchend', () => {
      const deltaY = currentY - startY;

      if (deltaY > 100) {
        // Close if swiped down enough
        this.close();
      } else {
        // Reset position
        content.style.transform = '';
      }

      startY = 0;
      currentY = 0;
    }, { passive: true });
  }

  /**
   * Component unmount lifecycle
   */
  unmount() {
    super.unmount();
  }
}

// Global stamp detail modal instance
export const stampDetailModal = new StampDetailModal();

/**
 * Initialize module - exposes components to global scope for backward compatibility
 */
export function initStampDetailModule() {
  window.StampDetailModal = StampDetailModal;
  window.stampDetailModal = stampDetailModal;
}
