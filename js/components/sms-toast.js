/**
 * PassportCard Refer - SMS Toast Component (Story 7.4)
 * Top-positioned toast notification that simulates receiving an SMS with OTP code.
 * Slides down from top, auto-dismisses after 10 seconds, respects reduced motion.
 */

import { Component } from '../core/component.js';
import { CONFIG } from '../core/config.js';

/**
 * SMSToastComponent - SMS-style notification showing OTP code (Story 7.4 AC#2)
 * Displays a top-positioned toast that looks like a phone SMS notification
 */
export class SMSToastComponent extends Component {
  constructor(props = {}) {
    super(props);
    this.otpCode = props.otpCode || CONFIG.OTP_CODE;
    this.autoCloseDelay = props.autoCloseDelay || 10000;
    this._dismissTimer = null;
    this._animationTimer = null;
  }

  /**
   * Returns the SMS toast HTML template
   * @returns {string} HTML string
   */
  template() {
    return `
      <div class="sms-toast sms-toast--entering" role="alert" aria-live="polite">
        <div class="sms-toast__icon">
          <i class="ti ti-message-2" aria-hidden="true"></i>
        </div>
        <div class="sms-toast__content">
          <p class="sms-toast__title">קוד אימות נשלח</p>
          <p class="sms-toast__code sms-toast__code--pulse" dir="ltr">${this.otpCode}</p>
        </div>
        <button class="sms-toast__close" data-action="close-sms-toast" aria-label="סגור הודעה">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }

  /**
   * Mount lifecycle - starts auto-dismiss timer
   */
  mount() {
    super.mount();
    
    // Remove entering class after animation completes
    this._animationTimer = setTimeout(() => {
      const toast = this.element?.querySelector('.sms-toast');
      if (toast) {
        toast.classList.remove('sms-toast--entering');
      }
    }, 300);
    
    // Start auto-dismiss timer
    this._dismissTimer = setTimeout(() => {
      this.dismiss();
    }, this.autoCloseDelay);
  }

  /**
   * Unmount lifecycle - clears timers
   */
  unmount() {
    if (this._dismissTimer) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }
    if (this._animationTimer) {
      clearTimeout(this._animationTimer);
      this._animationTimer = null;
    }
    super.unmount();
  }

  /**
   * Dismiss the toast with slide-up animation
   */
  dismiss() {
    const toast = this.element?.querySelector('.sms-toast');
    if (toast) {
      toast.classList.add('sms-toast--leaving');
      
      // Wait for animation, then remove from DOM
      setTimeout(() => {
        if (this.element) {
          this.element.remove();
        }
      }, 200);
    }
    
    // Clear timers
    if (this._dismissTimer) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }
  }
}

// Global reference for SMS toast instance
let _currentSMSToast = null;

/**
 * Shows the SMS toast notification (Story 7.4 AC#2)
 * Creates toast container if needed and mounts the component
 */
export function showSMSToast() {
  // Remove existing toast if present
  if (_currentSMSToast) {
    _currentSMSToast.dismiss();
    _currentSMSToast = null;
  }
  
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('sms-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'sms-toast-container';
    document.body.appendChild(toastContainer);
    
    // Add event delegation for toast actions
    toastContainer.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (target && target.dataset.action === 'close-sms-toast') {
        e.preventDefault();
        dismissSMSToast();
      }
    });
  }
  
  // Create and mount the SMS toast
  _currentSMSToast = new SMSToastComponent({
    otpCode: CONFIG.OTP_CODE,
    autoCloseDelay: 10000
  });
  
  toastContainer.innerHTML = _currentSMSToast.render();
  _currentSMSToast.element = toastContainer.firstElementChild?.parentElement || toastContainer;
  _currentSMSToast.mount();
}

/**
 * Dismisses the current SMS toast if visible
 */
export function dismissSMSToast() {
  if (_currentSMSToast) {
    _currentSMSToast.dismiss();
    _currentSMSToast = null;
  }
}

/**
 * Initializes the SMS toast module
 */
export function initSMSToastModule() {
  console.log('[Module] SMS Toast initialized');
}
