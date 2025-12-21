/**
 * PassportCard Refer - Login Components
 * Authentication components: LoginComponent, OTPModalComponent
 */

import { Component } from '../core/component.js';
import { CONFIG } from '../core/config.js';
import { generatePhoneNumber, maskPhoneNumber } from '../core/utils.js';
import { generateUserFromEmail } from '../data/user-generator.js';

// These will be set by app.js after initialization
let stateManager = null;
let router = null;

/**
 * Initialize module with app dependencies
 * @param {Object} deps - Dependencies object
 */
export function initLoginModule(deps) {
  stateManager = deps.stateManager;
  router = deps.router;
}

/**
 * LoginComponent - Email login form with auto-suggestion and validation
 * Implements: AC1 (Login Screen Display), AC7 (Accessibility)
 */
export class LoginComponent extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      emailSuggestion: '@passportcard.co.il',
      isValid: false,
      errorMessage: '',
      isSubmitting: false,
      showSuggestion: false
    };
    this._boundHandleInput = this._handleEmailInput.bind(this);
    this._boundHandleKeydown = this._handleKeydown.bind(this);
  }

  /**
   * Returns the login screen HTML template
   * @returns {string} HTML string
   */
  template() {
    const { isValid, errorMessage, isSubmitting, email, showSuggestion } = this.state;
    
    const inputClasses = [
      'form-input',
      isValid ? 'input--valid' : '',
      errorMessage ? 'input--error' : ''
    ].filter(Boolean).join(' ');

    const buttonClasses = [
      'btn',
      'btn--primary',
      'btn--full',
      isSubmitting ? 'btn--loading' : ''
    ].filter(Boolean).join(' ');

    const buttonDisabled = !isValid || isSubmitting ? 'disabled' : '';
    const inputDisabled = isSubmitting ? 'disabled' : '';

    return `
      <div class="login-screen">
        <div class="login-card">
          <div class="login-hero">
            <div class="login-logo" role="img" aria-label="PassportCard">
              <img src="${CONFIG.LOGOS.STANDARD}" alt="" aria-hidden="true" class="login-logo__img" />
            </div>
            <h1 class="login-title">ברוכים הבאים</h1>
            <p class="login-subtitle">מערכת ההפניות של PassportCard</p>
          </div>
          
          <form class="login-form" data-action="submit-login">
            <div class="form-group">
              <label for="email-input" class="form-label">אימייל חברה</label>
              <div class="email-input-wrapper">
                <input 
                  type="text" 
                  id="email-input"
                  class="${inputClasses}"
                  placeholder="firstname.lastname@passportcard.co.il"
                  aria-label="הזינו את כתובת האימייל שלכם"
                  aria-describedby="email-error email-suggestion-hint"
                  aria-invalid="${errorMessage ? 'true' : 'false'}"
                  autocomplete="email"
                  autocapitalize="off"
                  autocorrect="off"
                  spellcheck="false"
                  value="${email}"
                  ${inputDisabled}
                >
                <div 
                  class="email-suggestion ${showSuggestion && email && !email.includes('@') ? 'email-suggestion--visible' : ''}" 
                  id="email-suggestion-hint"
                  role="button"
                  tabindex="${showSuggestion && email && !email.includes('@') ? '0' : '-1'}"
                  aria-label="לחץ להשלמת האימייל"
                >
                  <span class="email-suggestion__hint">לחץ Tab להשלמה:</span>
                  <span class="email-suggestion__text">${email}@passportcard.co.il</span>
                </div>
              </div>
              <div id="email-error" class="form-error" aria-live="polite" role="alert">
                ${errorMessage}
              </div>
            </div>
            
            <button 
              type="submit" 
              class="${buttonClasses}"
              ${buttonDisabled}
              aria-busy="${isSubmitting}"
            >
              ${isSubmitting ? '<span class="spinner" aria-hidden="true"></span> שולח...' : '<i class="ti ti-send" style="margin-left: 8px;"></i> שלח קוד אימות'}
            </button>
          </form>
          
          <div class="login-footer">
            <p class="login-footer__text">
              <i class="ti ti-shield-check" style="color: var(--color-success); margin-left: 4px;"></i>
              התחברות מאובטחת למערכת <strong>PassportCard</strong>
            </p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Called after component is mounted to DOM
   */
  mount() {
    super.mount();
    this._bindEvents();
    // Focus email input on mount
    const emailInput = this.$('#email-input');
    if (emailInput) {
      emailInput.focus();
    }
  }

  /**
   * Called before component is removed from DOM
   */
  unmount() {
    this._unbindEvents();
    super.unmount();
  }

  /**
   * Binds event listeners for the component
   */
  _bindEvents() {
    const emailInput = this.$('#email-input');
    if (emailInput) {
      emailInput.addEventListener('input', this._boundHandleInput);
      emailInput.addEventListener('keydown', this._boundHandleKeydown);
    }
    
    // Bind click and keyboard on suggestion
    const suggestion = this.$('.email-suggestion');
    if (suggestion) {
      suggestion.addEventListener('click', this._handleSuggestionClick.bind(this));
      suggestion.addEventListener('keydown', this._handleSuggestionKeydown.bind(this));
    }
  }

  /**
   * Unbinds event listeners
   */
  _unbindEvents() {
    const emailInput = this.$('#email-input');
    if (emailInput) {
      emailInput.removeEventListener('input', this._boundHandleInput);
      emailInput.removeEventListener('keydown', this._boundHandleKeydown);
    }
  }

  /**
   * Handles click on email suggestion to accept it
   */
  _handleSuggestionClick() {
    this._acceptSuggestion();
  }

  /**
   * Handles keyboard activation on email suggestion (Enter/Space)
   * @param {KeyboardEvent} e - Keydown event
   */
  _handleSuggestionKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._acceptSuggestion();
    }
  }

  /**
   * Accepts the email suggestion and updates the input
   */
  _acceptSuggestion() {
    if (this.state.showSuggestion && !this.state.email.includes('@') && this.state.email.length > 0) {
      const fullEmail = this.state.email + '@passportcard.co.il';
      this._updateEmailState(fullEmail);
      const emailInput = this.$('#email-input');
      if (emailInput) {
        emailInput.value = fullEmail;
        emailInput.focus();
      }
    }
  }

  /**
   * Handles email input changes
   * @param {Event} e - Input event
   */
  _handleEmailInput(e) {
    const value = e.target.value.trim().toLowerCase();
    this._updateEmailState(value);
  }

  /**
   * Handles keydown events on email input
   * @param {KeyboardEvent} e - Keydown event
   */
  _handleKeydown(e) {
    // Tab to accept suggestion
    if (e.key === 'Tab' && this.state.showSuggestion && !this.state.email.includes('@')) {
      e.preventDefault();
      const fullEmail = this.state.email + '@passportcard.co.il';
      this._updateEmailState(fullEmail);
      // Update input value directly
      const emailInput = this.$('#email-input');
      if (emailInput) {
        emailInput.value = fullEmail;
      }
    }
  }

  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  _validateEmail(email) {
    const fullEmail = email.includes('@') ? email : `${email}@passportcard.co.il`;
    const pattern = /^[a-zA-Z]+\.[a-zA-Z]+@passportcard\.co\.il$/;
    return pattern.test(fullEmail);
  }

  /**
   * Updates component state based on email value
   * @param {string} value - Current email value
   */
  _updateEmailState(value) {
    const isValid = value.length > 0 && this._validateEmail(value);
    let errorMessage = '';

    // Show error when:
    // 1. User has typed something AND
    // 2. Email is not valid AND
    // 3. User has attempted to complete the email (has @ or .) OR typed more than 3 characters
    const hasAttemptedCompletion = value.includes('@') || value.includes('.');
    const hasTypedEnough = value.length > 3;
    
    if (value.length > 0 && !isValid && (hasAttemptedCompletion || hasTypedEnough)) {
      errorMessage = 'פורמט אימייל לא תקין';
    }

    // Show suggestion when typing without @
    const showSuggestion = value.length > 0 && !value.includes('@');

    this.state = {
      ...this.state,
      email: value,
      isValid,
      errorMessage,
      showSuggestion
    };

    // Update DOM elements without full re-render
    this._updateDOM();
  }

  /**
   * Updates specific DOM elements without full re-render
   * This prevents the flash/refresh effect on each keystroke
   */
  _updateDOM() {
    const { isValid, errorMessage, showSuggestion, email } = this.state;
    
    // Update input classes
    const emailInput = this.$('#email-input');
    if (emailInput) {
      emailInput.classList.toggle('input--valid', isValid);
      emailInput.classList.toggle('input--error', !!errorMessage);
      emailInput.setAttribute('aria-invalid', errorMessage ? 'true' : 'false');
    }
    
    // Update error message
    const errorEl = this.$('#email-error');
    if (errorEl) {
      errorEl.textContent = errorMessage;
    }
    
    // Update suggestion visibility and text
    const suggestionEl = this.$('.email-suggestion');
    if (suggestionEl) {
      const shouldShow = showSuggestion && email && !email.includes('@');
      suggestionEl.classList.toggle('email-suggestion--visible', shouldShow);
      suggestionEl.setAttribute('tabindex', shouldShow ? '0' : '-1');
      
      // Update suggestion text
      const suggestionText = suggestionEl.querySelector('.email-suggestion__text');
      if (suggestionText) {
        suggestionText.textContent = `${email}@passportcard.co.il`;
      }
    }
    
    // Update submit button state
    const submitBtn = this.$('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = !isValid || this.state.isSubmitting;
    }
  }

  /**
   * Re-renders the component by updating the DOM (full re-render)
   * Only used for major state changes like submitting
   */
  _rerender() {
    const appContainer = document.getElementById('main-content');
    if (appContainer) {
      const currentEmail = this.state.email;
      const cursorPosition = this.$('#email-input')?.selectionStart || currentEmail.length;
      
      appContainer.innerHTML = this.template();
      
      // Restore focus and cursor position
      const emailInput = this.$('#email-input');
      if (emailInput && !this.state.isSubmitting) {
        emailInput.focus();
        emailInput.setSelectionRange(cursorPosition, cursorPosition);
      }
      
      // Rebind events after re-render
      this._bindEvents();
    }
  }

  /**
   * Handles form submission
   * @param {Event} e - Submit event
   */
  handleSubmit(e) {
    if (e) e.preventDefault();
    
    if (!this.state.isValid || this.state.isSubmitting) return;

    const fullEmail = this.state.email.includes('@')
      ? this.state.email
      : `${this.state.email}@passportcard.co.il`;

    this.state.isSubmitting = true;
    this._rerender();

    // Store email for OTP step
    stateManager.setState({ pendingEmail: fullEmail });

    // Trigger OTP modal after delay
    setTimeout(() => {
      stateManager.setState({ activeModal: 'otp' });
    }, 300);
  }
}

/**
 * OTPModalComponent - OTP verification modal
 * Implements: AC2 (OTP Entry), AC3 (Verification)
 */
export class OTPModalComponent extends Component {
  constructor() {
    super();
    this._otpValues = ['', '', '', '', '', ''];
    this._isVerifying = false;
    this._hasError = false;
    this._errorMessage = '';
    this._resendCountdown = 0;
    this._resendTimer = null;
    this._isSuccess = false;
    this._boundKeyHandler = null;
  }

  /**
   * Returns the OTP modal HTML template
   * @returns {string} HTML string
   */
  template() {
    const email = stateManager.getState('pendingEmail') || '';
    const maskedEmail = this._maskEmail(email);
    // Story 7.4: Generate deterministic phone number from email
    const phoneNumber = generatePhoneNumber(email);
    const maskedPhone = maskPhoneNumber(phoneNumber);

    return `
      <div class="otp-modal-overlay" data-action="close-otp-overlay">
        <div class="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">
          <button class="otp-modal__close" data-action="close-otp" aria-label="סגור">
            <i class="ti ti-x"></i>
          </button>
          
          <div class="otp-modal__header">
            <div class="otp-modal__icon ${this._isSuccess ? 'otp-modal__icon--success' : ''}">
              <i class="ti ${this._isSuccess ? 'ti-check otp-success-icon' : 'ti-device-mobile'}"></i>
            </div>
            <h2 id="otp-title" class="otp-modal__title">${this._isSuccess ? 'אימות הצליח!' : 'אימות קוד'}</h2>
            <p class="otp-modal__subtitle">
              ${this._isSuccess 
                ? 'מעביר אותך לדשבורד...' 
                : `קוד אימות נשלח לנייד שלך`}
            </p>
            ${!this._isSuccess ? `
            <p class="otp-modal__phone" dir="ltr">${maskedPhone}</p>
            ` : ''}
          </div>
          
          ${!this._isSuccess ? `
          <div class="otp-inputs ${this._hasError ? 'otp-inputs--error' : ''}" dir="ltr">
            ${this._renderOTPInputs()}
          </div>
          
          <div class="otp-error" aria-live="polite" role="alert">
            ${this._errorMessage}
          </div>
          
          <button 
            type="button"
            class="btn btn--primary btn--full otp-verify-btn ${this._isVerifying ? 'btn--loading' : ''}"
            data-action="verify-otp"
            ${!this._isOTPComplete() || this._isVerifying ? 'disabled' : ''}
          >
            ${this._isVerifying 
              ? '<span class="spinner" aria-hidden="true"></span> מאמת...' 
              : 'אימות'}
          </button>
          
          <div class="otp-resend">
            ${this._resendCountdown > 0 
              ? `<span class="otp-resend--disabled">שלח שוב (${this._resendCountdown})</span>`
              : '<a href="#" data-action="resend-otp" class="otp-resend__link">שלח שוב</a>'}
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Renders the 6 OTP input boxes
   * @returns {string} HTML string for inputs
   */
  _renderOTPInputs() {
    return this._otpValues.map((value, index) => `
      <input
        type="text"
        inputmode="numeric"
        pattern="[0-9]"
        maxlength="1"
        class="otp-input ${this._isSuccess ? 'otp-input--success' : ''}"
        data-index="${index}"
        data-otp-input="true"
        value="${value}"
        aria-label="ספרה ${index + 1} מתוך 6"
        autocomplete="one-time-code"
        ${this._isVerifying ? 'disabled' : ''}
      >
    `).join('');
  }

  /**
   * Masks email for display (e.g., y***@passportcard...)
   * @param {string} email - Full email
   * @returns {string} Masked email
   */
  _maskEmail(email) {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    const firstChar = localPart[0];
    return `${firstChar}***@${domain.substring(0, 12)}...`;
  }

  /**
   * Checks if all 6 OTP digits are entered
   * @returns {boolean} True if complete
   */
  _isOTPComplete() {
    return this._otpValues.every(v => v !== '');
  }

  /**
   * Called after component is mounted to DOM
   */
  mount() {
    super.mount();
    this._setupInputHandlers();
    this._focusFirstInput();
    this._startResendCountdown();
    this._setupKeyboardHandlers();
  }

  /**
   * Called before component is removed from DOM
   */
  unmount() {
    if (this._resendTimer) {
      clearInterval(this._resendTimer);
      this._resendTimer = null;
    }
    if (this._boundKeyHandler) {
      document.removeEventListener('keydown', this._boundKeyHandler);
      this._boundKeyHandler = null;
    }
    super.unmount();
  }

  /**
   * Sets up input handlers for OTP boxes
   */
  _setupInputHandlers() {
    const inputs = this._getOTPInputs();
    
    inputs.forEach((input, index) => {
      // Handle input
      input.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length > 0) {
          this._otpValues[index] = value[0];
          e.target.value = value[0];
          
          // Auto-advance to next
          if (index < 5) {
            inputs[index + 1].focus();
          }
        } else {
          this._otpValues[index] = '';
        }
        
        this._updateVerifyButton();
      });
      
      // Handle keydown for backspace navigation
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          this._otpValues[index - 1] = '';
          inputs[index - 1].value = '';
          inputs[index - 1].focus();
        }
      });
      
      // Handle paste
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData)
          .getData('text')
          .replace(/[^0-9]/g, '')
          .slice(0, 6);
        
        if (pastedData.length === 6) {
          pastedData.split('').forEach((digit, i) => {
            this._otpValues[i] = digit;
            if (inputs[i]) {
              inputs[i].value = digit;
            }
          });
          inputs[5].focus();
          this._updateVerifyButton();
        }
      });
    });
  }

  /**
   * Gets all OTP input elements
   * @returns {NodeList} OTP input elements
   */
  _getOTPInputs() {
    const modalContainer = document.getElementById('modal-container');
    return modalContainer?.querySelectorAll('.otp-input') || [];
  }

  /**
   * Gets a single element from modal container
   * @param {string} selector - CSS selector
   * @returns {Element|null} Element or null
   */
  _$(selector) {
    const modalContainer = document.getElementById('modal-container');
    return modalContainer?.querySelector(selector) || null;
  }

  /**
   * Focuses the first OTP input
   */
  _focusFirstInput() {
    const firstInput = this._$('.otp-input[data-index="0"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  /**
   * Updates verify button disabled state
   */
  _updateVerifyButton() {
    const verifyBtn = this._$('.otp-verify-btn');
    if (verifyBtn) {
      verifyBtn.disabled = !this._isOTPComplete() || this._isVerifying;
    }
  }

  /**
   * Starts the resend countdown timer (45 seconds)
   */
  _startResendCountdown() {
    this._resendCountdown = 45;
    this._updateResendDisplay();
    
    this._resendTimer = setInterval(() => {
      this._resendCountdown--;
      this._updateResendDisplay();
      
      if (this._resendCountdown <= 0) {
        clearInterval(this._resendTimer);
        this._resendTimer = null;
      }
    }, 1000);
  }

  /**
   * Updates the resend link display
   */
  _updateResendDisplay() {
    const resendContainer = this._$('.otp-resend');
    if (resendContainer) {
      resendContainer.innerHTML = this._resendCountdown > 0
        ? `<span class="otp-resend--disabled">שלח שוב (${this._resendCountdown})</span>`
        : '<a href="#" data-action="resend-otp" class="otp-resend__link">שלח שוב</a>';
    }
  }

  /**
   * Sets up keyboard handlers (ESC to close, Tab trap)
   */
  _setupKeyboardHandlers() {
    this._boundKeyHandler = this._handleKeydown.bind(this);
    document.addEventListener('keydown', this._boundKeyHandler);
  }

  /**
   * Handles keydown events
   * @param {KeyboardEvent} e - Keydown event
   */
  _handleKeydown(e) {
    // ESC to close
    if (e.key === 'Escape') {
      this._closeModal();
      return;
    }
    
    // Tab focus trap
    if (e.key === 'Tab') {
      const modalContainer = document.getElementById('modal-container');
      const focusableElements = modalContainer?.querySelectorAll(
        'button:not([disabled]), input:not([disabled])'
      ) || [];
      
      if (focusableElements.length === 0) return;
      
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
  }

  /**
   * Verifies the entered OTP code
   */
  async verifyOTP() {
    if (!this._isOTPComplete() || this._isVerifying) return;
    
    this._isVerifying = true;
    this._hasError = false;
    this._errorMessage = '';
    this._updateUI();
    
    // Simulate verification delay (1.5-2 seconds)
    const delay = 1500 + Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const enteredOTP = this._otpValues.join('');
    
    if (enteredOTP === CONFIG.OTP_CODE) {
      await this._handleSuccess();
    } else {
      this._handleError();
    }
  }

  /**
   * Handles successful OTP verification
   */
  async _handleSuccess() {
    // Show success state
    this._isSuccess = true;
    this._isVerifying = false;
    this._updateUI();
    
    // Generate user from email
    const email = stateManager.getState('pendingEmail');
    const user = generateUserFromEmail(email);
    
    // Update state - include referrals, stamps, activities, and campaigns from generated user (Story 6.5)
    stateManager.setState({
      currentUser: user,
      isAuthenticated: true,
      sessionToken: `session_${Date.now()}`,
      referrals: user.referrals,
      stamps: user.stamps,
      activities: user.activities,
      campaigns: user.campaigns,
      pendingEmail: null
    });
    
    // Brief delay to show success, then redirect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Close modal and navigate
    stateManager.setState({ activeModal: null });
    router.navigate('passport');
  }

  /**
   * Handles incorrect OTP entry
   */
  _handleError() {
    this._isVerifying = false;
    this._hasError = true;
    this._errorMessage = 'קוד שגוי, נסה שוב';
    this._updateUI();
    
    // Remove error state after animation
    setTimeout(() => {
      this._hasError = false;
      // Clear inputs
      this._otpValues = ['', '', '', '', '', ''];
      this._updateUI();
      this._focusFirstInput();
    }, 400);
  }

  /**
   * Handles resend OTP action
   */
  handleResend() {
    if (this._resendCountdown > 0) return;
    
    // Restart countdown
    this._startResendCountdown();
    
    // In a real app, this would trigger OTP resend API
    console.log('OTP resent to:', stateManager.getState('pendingEmail'));
  }

  /**
   * Closes the OTP modal
   */
  _closeModal() {
    // Clear the modal but preserve pendingEmail for retry
    stateManager.setState({ activeModal: null });
  }

  /**
   * Re-renders the modal UI
   */
  _updateUI() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.innerHTML = this.template();
      
      if (!this._isSuccess) {
        this._setupInputHandlers();
        
        // Restore OTP values in inputs
        const inputs = this._getOTPInputs();
        this._otpValues.forEach((value, index) => {
          if (inputs[index]) {
            inputs[index].value = value;
          }
        });
      }
    }
  }
}
