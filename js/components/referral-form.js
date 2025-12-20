/**
 * PassportCard Refer - Referral Form Components
 * Form for submitting candidate referrals with resume upload (Story 4.5)
 * Success screen after referral submission with stamps, points, and celebration (Story 4.6)
 */

import { Component } from '../core/component.js';
import { STAMP_TYPES } from '../data/stamp-types.js';
import { MOCK_POSITIONS } from '../data/mock-positions.js';
import { renderIcon } from '../core/utils.js';

/* ============================================================================
   REFERRAL FORM COMPONENT (Story 4.5)
   ============================================================================
   Form for submitting candidate referrals with resume upload
   ========================================================================== */

export class ReferralFormComponent extends Component {
  constructor(props) {
    super(props);
    this.position = null;
    this.formData = {
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      relationship: '',
      notes: ''
    };
    this.errors = {};
    this.touched = {};
    this.uploadedFile = null;
    this.isSubmitting = false;
    
    // Bind methods
    this._handleInput = this._handleInput.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleDragOver = this._handleDragOver.bind(this);
    this._handleDragLeave = this._handleDragLeave.bind(this);
    this._handleDrop = this._handleDrop.bind(this);
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    // Get position from state or props
    this.position = stateManager.getState('referringPosition') || 
                    MOCK_POSITIONS.find(p => p.id === this.props.positionId);
    
    if (!this.position) {
      return `
        <div class="app-layout">
          <main class="referral-form-error">
            <i class="ti ti-alert-circle" style="font-size: 3rem; color: var(--text-muted);" aria-hidden="true"></i>
            <p>לא נמצאה משרה להפניה</p>
            <button class="btn btn--primary" data-action="navigate-positions">
              <i class="ti ti-arrow-right" aria-hidden="true"></i>
              חזרה למשרות
            </button>
          </main>
        </div>
      `;
    }
    
    // Store instance in state for action handlers
    stateManager.setState({ referralFormInstance: this });
    
    return `
      <div class="app-layout">
        <main class="referral-form" id="referral-form">
          ${this._renderHeader()}
          
          <form class="referral-form__form" novalidate>
            ${this._renderPositionSummary()}
            ${this._renderFormFields()}
            ${this._renderUploadZone()}
            ${this._renderSubmitSection()}
          </form>
        </main>
      </div>
    `;
  }
  
  /**
   * Renders page header with back button
   * @returns {string} HTML string
   */
  _renderHeader() {
    return `
      <header class="referral-form__header">
        <button class="referral-form__back-btn"
                type="button"
                data-action="back-from-referral"
                aria-label="חזרה">
          <i class="ti ti-arrow-right" aria-hidden="true"></i>
        </button>
        <h1 class="referral-form__title">הפניית מועמד</h1>
      </header>
    `;
  }
  
  /**
   * Renders position summary card
   * @returns {string} HTML string
   */
  _renderPositionSummary() {
    const p = this.position;
    const multiplier = p.campaign?.multiplier || 1;
    const basePoints = 50 + 100 + (p.bonus || 0);
    const totalPoints = Math.round(basePoints * multiplier);
    
    return `
      <div class="referral-form__position-card">
        <div class="referral-form__position-info">
          <h2 class="referral-form__position-title">${this._escapeHtml(p.title)}</h2>
          <p class="referral-form__position-meta">
            <span><i class="ti ti-building" aria-hidden="true"></i> ${this._escapeHtml(p.department)}</span>
            <span><i class="ti ti-map-pin" aria-hidden="true"></i> ${this._escapeHtml(p.location)}</span>
          </p>
        </div>
        <div class="referral-form__position-bonus">
          <span class="referral-form__bonus-label">בונוס פוטנציאלי</span>
          <span class="referral-form__bonus-value">+${totalPoints} נקודות</span>
        </div>
      </div>
    `;
  }
  
  /**
   * Renders all form fields
   * @returns {string} HTML string
   */
  _renderFormFields() {
    return `
      <div class="referral-form__fields">
        ${this._renderTextField('candidateName', 'שם מלא של המועמד', 'text', true)}
        ${this._renderTextField('candidateEmail', 'אימייל', 'email', true)}
        ${this._renderTextField('candidatePhone', 'טלפון', 'tel', false, 'לדוגמה: 050-1234567')}
        ${this._renderSelectField()}
        ${this._renderTextareaField()}
      </div>
    `;
  }
  
  /**
   * Renders a text input field
   * @param {string} name - Field name
   * @param {string} label - Field label
   * @param {string} type - Input type
   * @param {boolean} required - Is required
   * @param {string} placeholder - Placeholder text
   * @returns {string} HTML string
   */
  _renderTextField(name, label, type, required, placeholder = '') {
    const value = this.formData[name] || '';
    const error = this.errors[name];
    const touched = this.touched[name];
    const isValid = touched && !error && value;
    
    const inputId = `referral-${name}`;
    const errorId = `${inputId}-error`;
    
    return `
      <div class="form-field ${error ? 'form-field--error' : ''} ${isValid ? 'form-field--valid' : ''}">
        <label for="${inputId}" class="form-field__label">
          ${label}
          ${required ? '<span class="form-field__required" aria-hidden="true">*</span>' : ''}
        </label>
        <div class="form-field__input-wrapper">
          <input type="${type}"
                 id="${inputId}"
                 name="${name}"
                 class="form-field__input"
                 value="${this._escapeHtml(value)}"
                 ${placeholder ? `placeholder="${placeholder}"` : ''}
                 ${required ? 'aria-required="true"' : ''}
                 ${error ? `aria-describedby="${errorId}" aria-invalid="true"` : ''}
                 data-field="${name}">
          ${isValid ? '<i class="ti ti-check form-field__icon form-field__icon--valid" aria-hidden="true"></i>' : ''}
          ${error ? '<i class="ti ti-alert-circle form-field__icon form-field__icon--error" aria-hidden="true"></i>' : ''}
        </div>
        ${error ? `<p id="${errorId}" class="form-field__error" role="alert">${error}</p>` : ''}
      </div>
    `;
  }
  
  /**
   * Renders relationship select field
   * @returns {string} HTML string
   */
  _renderSelectField() {
    const value = this.formData.relationship || '';
    const error = this.errors.relationship;
    const touched = this.touched.relationship;
    const isValid = touched && !error && value;
    
    const options = [
      { value: '', label: 'בחר/י...' },
      { value: 'close-friend', label: 'חבר/ה קרוב/ה' },
      { value: 'former-colleague', label: 'קולגה מעבודה קודמת' },
      { value: 'professional', label: 'מכר/ה מקצועי/ת' },
      { value: 'other', label: 'אחר' }
    ];
    
    return `
      <div class="form-field ${error ? 'form-field--error' : ''} ${isValid ? 'form-field--valid' : ''}">
        <label for="referral-relationship" class="form-field__label">
          איך את/ה מכיר/ה את המועמד?
          <span class="form-field__required" aria-hidden="true">*</span>
        </label>
        <div class="form-field__input-wrapper">
          <select id="referral-relationship"
                  name="relationship"
                  class="form-field__input form-field__input--select"
                  aria-required="true"
                  ${error ? 'aria-describedby="referral-relationship-error" aria-invalid="true"' : ''}
                  data-field="relationship">
            ${options.map(opt => `
              <option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>
                ${opt.label}
              </option>
            `).join('')}
          </select>
          <i class="ti ti-chevron-down form-field__select-icon" aria-hidden="true"></i>
        </div>
        ${error ? `<p id="referral-relationship-error" class="form-field__error" role="alert">${error}</p>` : ''}
      </div>
    `;
  }
  
  /**
   * Renders notes textarea with character counter
   * @returns {string} HTML string
   */
  _renderTextareaField() {
    const value = this.formData.notes || '';
    const charCount = value.length;
    const maxChars = 500;
    const isNearLimit = charCount >= 450;
    
    return `
      <div class="form-field">
        <label for="referral-notes" class="form-field__label">
          הערות נוספות
          <span class="form-field__optional">(אופציונלי)</span>
        </label>
        <textarea id="referral-notes"
                  name="notes"
                  class="form-field__input form-field__input--textarea"
                  rows="3"
                  maxlength="${maxChars}"
                  data-field="notes">${this._escapeHtml(value)}</textarea>
        <p class="form-field__counter ${isNearLimit ? 'form-field__counter--warning' : ''}" aria-live="polite">
          <span class="form-field__counter-current">${charCount}</span>/${maxChars}
        </p>
      </div>
    `;
  }
  
  /**
   * Renders file upload zone
   * @returns {string} HTML string
   */
  _renderUploadZone() {
    if (this.uploadedFile) {
      return this._renderFilePreview();
    }
    
    return `
      <div class="upload-zone" id="upload-zone" role="region" aria-label="העלאת קורות חיים">
        <input type="file"
               id="resume-input"
               class="upload-zone__input"
               accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
               aria-label="בחר קובץ קורות חיים">
        
        <div class="upload-zone__content">
          <i class="ti ti-file-upload upload-zone__icon" aria-hidden="true"></i>
          <p class="upload-zone__text">
            <span class="upload-zone__text-primary">${renderIcon('file-text')} גררו קובץ לכאן או לחצו לבחירה</span>
          </p>
          <p class="upload-zone__formats">PDF, DOC, DOCX</p>
          <p class="upload-zone__size">עד 5MB</p>
        </div>
        
        <div class="upload-zone__hover-content" aria-hidden="true">
          <i class="ti ti-file-download upload-zone__icon" aria-hidden="true"></i>
          <p class="upload-zone__text">שחררו כדי להעלות</p>
        </div>
      </div>
      
      <div id="upload-error" class="upload-zone__error" role="alert" aria-live="assertive"></div>
    `;
  }
  
  /**
   * Renders uploaded file preview
   * @returns {string} HTML string
   */
  _renderFilePreview() {
    const file = this.uploadedFile;
    const sizeStr = this._formatFileSize(file.size);
    const icon = file.name.toLowerCase().endsWith('.pdf') ? 'ti-file-type-pdf' : 'ti-file-type-doc';
    
    return `
      <div class="file-preview" id="file-preview" role="region" aria-label="קובץ שהועלה">
        <div class="file-preview__icon">
          <i class="ti ${icon}" aria-hidden="true"></i>
        </div>
        <div class="file-preview__info">
          <p class="file-preview__name">${this._escapeHtml(file.name)}</p>
          <p class="file-preview__size">${sizeStr}</p>
        </div>
        <button type="button"
                class="file-preview__remove"
                data-action="remove-resume"
                aria-label="הסר קובץ">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }
  
  /**
   * Renders submit section
   * @returns {string} HTML string
   */
  _renderSubmitSection() {
    const isValid = this._isFormValid();
    const isFirstReferral = this._isFirstReferral();
    const points = isFirstReferral ? 150 : 50;
    
    return `
      <div class="referral-form__submit-section">
        <p class="referral-form__points-hint">
          ${isFirstReferral ? `${renderIcon('confetti')} הפניה ראשונה! ` : ''}
          <strong>+${points} נקודות</strong> יתווספו לחשבונך
        </p>
        
        <button type="submit"
                class="btn btn--primary btn--lg btn--full referral-form__submit-btn"
                ${!isValid || this.isSubmitting ? 'disabled' : ''}
                data-action="submit-referral">
          ${this.isSubmitting ? `
            <span class="btn__spinner" aria-hidden="true"></span>
            שולח...
          ` : `
            📤 שליחת ההפניה
          `}
        </button>
      </div>
    `;
  }
  
  // ========================
  // VALIDATION METHODS
  // ========================
  
  /**
   * Validates a single field
   * @param {string} field - Field name
   * @param {string} value - Field value
   * @returns {string|null} Error message or null
   */
  _validateField(field, value) {
    switch (field) {
      case 'candidateName':
        if (!value || value.trim().length < 2) {
          return 'נא להזין שם מלא';
        }
        return null;
        
      case 'candidateEmail':
        if (!value) {
          return 'נא להזין כתובת אימייל';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'נא להזין כתובת אימייל תקינה';
        }
        return null;
        
      case 'candidatePhone':
        if (!value) return null; // Optional field
        // Israeli phone patterns
        const phoneRegex = /^(\+972|972|0)?([23489]|5[0-9]|7[0-9])[0-9]{7}$/;
        const cleaned = value.replace(/[-\s]/g, '');
        if (!phoneRegex.test(cleaned)) {
          return 'נא להזין מספר טלפון תקין';
        }
        return null;
        
      case 'relationship':
        if (!value) {
          return 'נא לבחור את סוג ההיכרות';
        }
        return null;
        
      default:
        return null;
    }
  }
  
  /**
   * Validates all required fields
   * @returns {boolean} True if form is valid
   */
  _isFormValid() {
    const requiredFields = ['candidateName', 'candidateEmail', 'relationship'];
    
    for (const field of requiredFields) {
      const error = this._validateField(field, this.formData[field]);
      if (error) return false;
    }
    
    // Phone validation if provided
    if (this.formData.candidatePhone) {
      const phoneError = this._validateField('candidatePhone', this.formData.candidatePhone);
      if (phoneError) return false;
    }
    
    return true;
  }
  
  /**
   * Validates all fields and updates errors
   */
  _validateAllFields() {
    const fields = ['candidateName', 'candidateEmail', 'candidatePhone', 'relationship'];
    
    this.errors = {};
    fields.forEach(field => {
      const error = this._validateField(field, this.formData[field]);
      if (error) {
        this.errors[field] = error;
      }
    });
  }
  
  // ========================
  // FILE HANDLING METHODS
  // ========================
  
  /**
   * Validates uploaded file
   * @param {File} file - File to validate
   * @returns {string|null} Error message or null
   */
  _validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    
    // Check file type
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      return 'פורמט לא נתמך. נא להעלות PDF, DOC או DOCX';
    }
    
    // Check file size
    if (file.size > maxSize) {
      return 'הקובץ גדול מדי. גודל מקסימלי: 5MB';
    }
    
    return null;
  }
  
  /**
   * Handles file selection/drop
   * @param {File} file - Selected file
   */
  _handleFile(file) {
    const error = this._validateFile(file);
    const errorEl = document.getElementById('upload-error');
    
    if (error) {
      if (errorEl) {
        errorEl.textContent = error;
        errorEl.style.display = 'block';
      }
      return;
    }
    
    // Clear any previous error
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
    
    this.uploadedFile = file;
    this._updateUploadZone();
    this._updateSubmitButtonState();
  }
  
  /**
   * Updates upload zone display
   */
  _updateUploadZone() {
    const uploadZone = document.getElementById('upload-zone');
    const filePreview = document.getElementById('file-preview');
    const targetEl = uploadZone || filePreview;
    
    if (!targetEl) return;
    
    // Create new content
    const newContent = this.uploadedFile ? this._renderFilePreview() : this._renderUploadZoneOnly();
    
    // Replace element
    const temp = document.createElement('div');
    temp.innerHTML = newContent;
    targetEl.replaceWith(temp.firstElementChild);
    
    // Rebind upload zone events if restored
    if (!this.uploadedFile) {
      this._bindUploadZoneEvents();
    }
  }
  
  /**
   * Renders just the upload zone without error container
   * @returns {string} HTML string
   */
  _renderUploadZoneOnly() {
    return `
      <div class="upload-zone" id="upload-zone" role="region" aria-label="העלאת קורות חיים">
        <input type="file"
               id="resume-input"
               class="upload-zone__input"
               accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
               aria-label="בחר קובץ קורות חיים">
        
        <div class="upload-zone__content">
          <i class="ti ti-file-upload upload-zone__icon" aria-hidden="true"></i>
          <p class="upload-zone__text">
            <span class="upload-zone__text-primary">${renderIcon('file-text')} גררו קובץ לכאן או לחצו לבחירה</span>
          </p>
          <p class="upload-zone__formats">PDF, DOC, DOCX</p>
          <p class="upload-zone__size">עד 5MB</p>
        </div>
        
        <div class="upload-zone__hover-content" aria-hidden="true">
          <i class="ti ti-file-download upload-zone__icon" aria-hidden="true"></i>
          <p class="upload-zone__text">שחררו כדי להעלות</p>
        </div>
      </div>
    `;
  }
  
  /**
   * Formats file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size string
   */
  _formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  
  // ========================
  // SUBMISSION METHODS
  // ========================
  
  /**
   * Checks if this is user's first referral
   * @returns {boolean}
   */
  _isFirstReferral() {
    const referrals = stateManager.getState('referrals') || [];
    return referrals.length === 0;
  }
  
  /**
   * Handles form submission
   */
  async handleSubmit() {
    if (!this._isFormValid() || this.isSubmitting) return;
    
    this.isSubmitting = true;
    this._updateSubmitButton();
    this._disableFormFields();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const currentUser = stateManager.getState('currentUser');
    const referrals = stateManager.getState('referrals') || [];
    const stamps = stateManager.getState('stamps') || [];
    const isFirstReferral = referrals.length === 0;
    
    // Create new referral
    const newReferral = {
      id: `ref-${Date.now()}`,
      positionId: this.position.id,
      positionTitle: this.position.title,
      candidateName: this.formData.candidateName,
      candidateEmail: this.formData.candidateEmail,
      candidatePhone: this.formData.candidatePhone || null,
      relationship: this.formData.relationship,
      notes: this.formData.notes || null,
      resumeFileName: this.uploadedFile?.name || null,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'submitted',
          date: new Date().toISOString(),
          points: 50
        }
      ],
      pointsEarned: 50
    };
    
    // Create submission stamp
    const submissionStamp = {
      id: `stmp-${Date.now()}`,
      type: 'submitted',
      title: 'קו״ח הוגש',
      points: 50,
      earnedAt: new Date().toISOString(),
      referralId: newReferral.id,
      positionTitle: this.position.title
    };
    
    const newStamps = [...stamps, submissionStamp];
    let pointsAdded = 50;
    const earnedStampsArray = [submissionStamp];
    
    // First referral bonus
    if (isFirstReferral) {
      const firstReferralStamp = {
        id: `stmp-${Date.now()}-first`,
        type: 'first-referral',
        title: 'הפניה ראשונה',
        points: 100,
        earnedAt: new Date().toISOString(),
        referralId: newReferral.id
      };
      newStamps.push(firstReferralStamp);
      pointsAdded += 100;
      earnedStampsArray.push(firstReferralStamp);
    }
    
    // Update state
    stateManager.setState({
      referrals: [...referrals, newReferral],
      stamps: newStamps,
      currentUser: {
        ...currentUser,
        points: (currentUser?.points || 0) + pointsAdded
      },
      lastSubmittedReferral: newReferral,
      pointsEarnedFromSubmission: pointsAdded,
      earnedStamps: earnedStampsArray,
      referringPosition: null, // Clear after submission
      referralFormInstance: null
    });
    
    // Show success message
    app.showToast('ההפניה נשלחה בהצלחה!', 'success');
    
    // Navigate to confirmation (Story 4.6)
    router.navigate('referral-confirmation');
  }
  
  /**
   * Updates submit button state
   */
  _updateSubmitButton() {
    const btn = document.querySelector('.referral-form__submit-btn');
    if (!btn) return;
    
    if (this.isSubmitting) {
      btn.disabled = true;
      btn.innerHTML = `
        <span class="btn__spinner" aria-hidden="true"></span>
        שולח...
      `;
    }
  }
  
  /**
   * Disables all form fields during submission
   */
  _disableFormFields() {
    const form = document.querySelector('.referral-form__form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
      input.disabled = true;
    });
  }
  
  // ========================
  // UTILITY METHODS
  // ========================
  
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
  
  // ========================
  // EVENT HANDLERS
  // ========================
  
  /**
   * Handles input changes
   * @param {Event} e - Input event
   */
  _handleInput(e) {
    const field = e.target.dataset.field;
    if (!field) return;
    
    this.formData[field] = e.target.value;
    
    // Update character counter for notes
    if (field === 'notes') {
      this._updateCharCounter();
    }
    
    // Validate on input if field has been touched
    if (this.touched[field]) {
      this.errors[field] = this._validateField(field, this.formData[field]);
      this._updateFieldState(field);
    }
    
    // Update submit button
    this._updateSubmitButtonState();
  }
  
  /**
   * Handles field blur
   * @param {Event} e - Blur event
   */
  _handleBlur(e) {
    const field = e.target.dataset.field;
    if (!field) return;
    
    this.touched[field] = true;
    this.errors[field] = this._validateField(field, this.formData[field]);
    this._updateFieldState(field);
    this._updateSubmitButtonState();
  }
  
  /**
   * Updates individual field visual state
   * @param {string} field - Field name
   */
  _updateFieldState(field) {
    const container = document.querySelector(`[data-field="${field}"]`)?.closest('.form-field');
    if (!container) return;
    
    const error = this.errors[field];
    const value = this.formData[field];
    const isValid = !error && value;
    
    container.classList.toggle('form-field--error', !!error);
    container.classList.toggle('form-field--valid', isValid);
    
    // Update icons
    const wrapper = container.querySelector('.form-field__input-wrapper');
    if (wrapper) {
      // Remove existing icons
      wrapper.querySelectorAll('.form-field__icon').forEach(icon => icon.remove());
      
      // Add appropriate icon
      if (isValid) {
        wrapper.insertAdjacentHTML('beforeend', '<i class="ti ti-check form-field__icon form-field__icon--valid" aria-hidden="true"></i>');
      } else if (error) {
        wrapper.insertAdjacentHTML('beforeend', '<i class="ti ti-alert-circle form-field__icon form-field__icon--error" aria-hidden="true"></i>');
      }
    }
    
    // Update error message
    const existingError = container.querySelector('.form-field__error');
    const inputEl = container.querySelector(`[data-field="${field}"]`);
    const errorId = `referral-${field}-error`;
    
    if (error && !existingError) {
      const errorP = document.createElement('p');
      errorP.id = errorId;
      errorP.className = 'form-field__error';
      errorP.role = 'alert';
      errorP.textContent = error;
      container.appendChild(errorP);
      if (inputEl) {
        inputEl.setAttribute('aria-describedby', errorId);
        inputEl.setAttribute('aria-invalid', 'true');
      }
    } else if (!error && existingError) {
      existingError.remove();
      if (inputEl) {
        inputEl.removeAttribute('aria-describedby');
        inputEl.removeAttribute('aria-invalid');
      }
    } else if (error && existingError) {
      existingError.textContent = error;
    }
  }
  
  /**
   * Updates character counter for notes
   */
  _updateCharCounter() {
    const counter = document.querySelector('.form-field__counter-current');
    const counterContainer = document.querySelector('.form-field__counter');
    if (!counter || !counterContainer) return;
    
    const count = (this.formData.notes || '').length;
    counter.textContent = count;
    counterContainer.classList.toggle('form-field__counter--warning', count >= 450);
  }
  
  /**
   * Updates submit button enabled/disabled state
   */
  _updateSubmitButtonState() {
    const btn = document.querySelector('.referral-form__submit-btn');
    if (!btn || this.isSubmitting) return;
    
    btn.disabled = !this._isFormValid();
  }
  
  /**
   * Handles dragover event
   * @param {DragEvent} e - Drag event
   */
  _handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('upload-zone');
    if (zone) {
      zone.classList.add('upload-zone--hover');
    }
  }
  
  /**
   * Handles dragleave event
   * @param {DragEvent} e - Drag event
   */
  _handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('upload-zone');
    if (zone && !zone.contains(e.relatedTarget)) {
      zone.classList.remove('upload-zone--hover');
    }
  }
  
  /**
   * Handles file drop
   * @param {DragEvent} e - Drop event
   */
  _handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const zone = document.getElementById('upload-zone');
    if (zone) {
      zone.classList.remove('upload-zone--hover');
    }
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this._handleFile(files[0]);
    }
  }
  
  /**
   * Checks if form has any data entered
   * @returns {boolean}
   */
  hasFormData() {
    return !!(
      this.formData.candidateName ||
      this.formData.candidateEmail ||
      this.formData.candidatePhone ||
      this.formData.relationship ||
      this.formData.notes ||
      this.uploadedFile
    );
  }
  
  // ========================
  // LIFECYCLE
  // ========================
  
  /**
   * Binds event listeners for upload zone
   */
  _bindUploadZoneEvents() {
    const zone = document.getElementById('upload-zone');
    if (!zone) return;
    
    zone.addEventListener('dragover', this._handleDragOver);
    zone.addEventListener('dragleave', this._handleDragLeave);
    zone.addEventListener('drop', this._handleDrop);
    
    // Click to browse
    zone.addEventListener('click', () => {
      const input = document.getElementById('resume-input');
      if (input) input.click();
    });
    
    // File input change
    const fileInput = document.getElementById('resume-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          this._handleFile(files[0]);
        }
      });
    }
  }
  
  /**
   * Binds event listeners after mount
   */
  bindEvents() {
    const form = document.querySelector('.referral-form__form');
    if (!form) return;
    
    // Form field events (using event delegation)
    form.addEventListener('input', this._handleInput);
    form.addEventListener('blur', this._handleBlur, true);
    form.addEventListener('change', this._handleBlur); // For select
    
    // Prevent form default submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
    
    // Bind upload zone events
    this._bindUploadZoneEvents();
  }
  
  mount() {
    super.mount();
    this.bindEvents();
  }
  
  unmount() {
    // Clear instance from state
    stateManager.setState({ referralFormInstance: null });
    super.unmount();
  }
}

/* ============================================================================
   REFERRAL CONFIRMATION COMPONENT (Story 4.6)
   ============================================================================
   Success screen after referral submission with stamps, points, and celebration
   ========================================================================== */

export class ReferralConfirmationComponent extends Component {
  constructor(props) {
    super(props);
    this.referral = null;
    this.pointsEarned = 0;
    this.earnedStamps = [];
    this.isFirstReferral = false;
    this.animationStarted = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Main template
   * @returns {string} HTML string
   */
  template() {
    // Get submission data from state
    this.referral = stateManager.getState('lastSubmittedReferral');
    this.pointsEarned = stateManager.getState('pointsEarnedFromSubmission') || 50;
    this.earnedStamps = stateManager.getState('earnedStamps') || [];
    this.isFirstReferral = this.pointsEarned >= 150;
    
    if (!this.referral) {
      // No submission data, show error state
      return `
        <div class="app-layout">
          <main class="confirmation-error">
            <i class="ti ti-alert-circle" style="font-size: 3rem; color: var(--text-muted);" aria-hidden="true"></i>
            <p>אין נתוני הפניה להציג</p>
            <button class="btn btn--primary" data-action="navigate-dashboard">
              <i class="ti ti-arrow-right" aria-hidden="true"></i>
              חזרה לדשבורד
            </button>
          </main>
        </div>
      `;
    }
    
    return `
      <div class="app-layout">
        <main class="confirmation" id="confirmation-screen" role="main">
          <div class="confirmation__content">
            ${this._renderSuccessHeader()}
            ${this._renderReferralInfo()}
            ${this._renderStampSection()}
            ${this._renderPointsSection()}
            ${this._renderCTAs()}
          </div>
          
          <!-- Hidden announcement for screen readers -->
          <div class="visually-hidden" aria-live="assertive" id="confirmation-announcement">
            ההפניה נשלחה בהצלחה! ${this.isFirstReferral ? 'זו ההפניה הראשונה שלך!' : ''} 
            הרווחת ${this.pointsEarned} נקודות.
          </div>
        </main>
      </div>
    `;
  }
  
  /**
   * Renders success header with celebration message
   * @returns {string} HTML string
   */
  _renderSuccessHeader() {
    const firstReferralMessage = this.isFirstReferral 
      ? `<p class="confirmation__first-badge">${renderIcon('star-filled')} הפניה ראשונה - מעולה!</p>`
      : '';
    
    return `
      <header class="confirmation__header">
        <div class="confirmation__success-icon" aria-hidden="true">
          <span class="confirmation__checkmark">${renderIcon('check', { size: 'xl' })}</span>
        </div>
        
        <h1 class="confirmation__title" id="confirmation-title" tabindex="-1">
          ${renderIcon('confetti')} ההפניה נשלחה בהצלחה!
        </h1>
        
        ${firstReferralMessage}
      </header>
    `;
  }
  
  /**
   * Renders referral information summary
   * @returns {string} HTML string
   */
  _renderReferralInfo() {
    return `
      <section class="confirmation__referral-info" aria-label="פרטי ההפניה">
        <div class="confirmation__referral-card">
          <div class="confirmation__referral-avatar" aria-hidden="true">
            ${this._getInitials(this.referral.candidateName)}
          </div>
          <div class="confirmation__referral-details">
            <p class="confirmation__candidate-name">
              ${this._escapeHtml(this.referral.candidateName)}
            </p>
            <p class="confirmation__position-title">
              <i class="ti ti-briefcase" aria-hidden="true"></i>
              ${this._escapeHtml(this.referral.positionTitle)}
            </p>
          </div>
        </div>
      </section>
    `;
  }
  
  /**
   * Renders earned stamps section
   * @returns {string} HTML string
   */
  _renderStampSection() {
    if (this.earnedStamps.length === 0) {
      return '';
    }
    
    const stampsHtml = this.earnedStamps.map((stamp, index) => {
      const animationDelay = this.reducedMotion ? 0 : index * 300;
      return this._renderStamp(stamp, animationDelay);
    }).join('');
    
    return `
      <section class="confirmation__stamps" aria-label="חותמות שהושגו">
        <h2 class="confirmation__section-title">חותמות חדשות!</h2>
        <div class="confirmation__stamps-grid">
          ${stampsHtml}
        </div>
      </section>
    `;
  }
  
  /**
   * Renders individual stamp
   * @param {Object} stamp - Stamp data
   * @param {number} delay - Animation delay in ms
   * @returns {string} HTML string
   */
  _renderStamp(stamp, delay) {
    const stampType = stamp.type || 'submitted';
    const stampConfig = STAMP_TYPES[stampType] || STAMP_TYPES.submitted;
    const animationClass = this.reducedMotion ? 'confirmation__stamp--visible' : 'confirmation__stamp--animate';
    
    return `
      <div class="confirmation__stamp ${animationClass}"
           style="--animation-delay: ${delay}ms; --stamp-color: ${stampConfig.color};"
           role="img"
           aria-label="${stamp.title}: +${stamp.points} נקודות">
        <div class="confirmation__stamp-inner">
          <span class="confirmation__stamp-icon" aria-hidden="true">
            ${renderIcon(stampConfig.icon)}
          </span>
          <span class="confirmation__stamp-title">${stamp.title}</span>
          <span class="confirmation__stamp-points">+${stamp.points}</span>
        </div>
      </div>
    `;
  }
  
  /**
   * Renders points earned section with animated counter
   * @returns {string} HTML string
   */
  _renderPointsSection() {
    const displayValue = this.reducedMotion ? this.pointsEarned : 0;
    
    return `
      <section class="confirmation__points" aria-label="נקודות שהושגו">
        <div class="confirmation__points-display">
          <span class="confirmation__points-label">נקודות שהושגו</span>
          <span class="confirmation__points-value" id="points-counter" data-target="${this.pointsEarned}">
            +${displayValue}
          </span>
        </div>
        
        <p class="confirmation__points-message">
          ${this.isFirstReferral 
            ? `${renderIcon('confetti')} כולל בונוס הפניה ראשונה!` 
            : 'הנקודות נוספו לחשבונך'}
        </p>
      </section>
    `;
  }
  
  /**
   * Renders CTA buttons
   * @returns {string} HTML string
   */
  _renderCTAs() {
    return `
      <section class="confirmation__ctas">
        <button class="btn btn--primary btn--lg confirmation__cta-primary"
                data-action="view-passport-from-confirmation"
                aria-label="צפה בדרכון שלי">
          <i class="ti ti-book" aria-hidden="true"></i>
          צפה בדרכון
        </button>
        
        <button class="btn btn--secondary btn--lg confirmation__cta-secondary"
                data-action="refer-another"
                aria-label="הפנה מועמד נוסף">
          <i class="ti ti-user-plus" aria-hidden="true"></i>
          הפנה עוד
        </button>
        
        <button class="btn btn--text confirmation__share-btn"
                data-action="share-referral-success"
                aria-label="שתף הצלחה">
          <i class="ti ti-share" aria-hidden="true"></i>
          שתף את ההצלחה שלך
        </button>
      </section>
    `;
  }
  
  // ========================
  // ANIMATION METHODS
  // ========================
  
  /**
   * Starts all animations and celebrations
   */
  startCelebrations() {
    if (this.animationStarted) return;
    this.animationStarted = true;
    
    if (this.reducedMotion) {
      // Just announce to screen reader
      this._announceSuccess();
      return;
    }
    
    // Fire confetti
    this._fireConfetti();
    
    // Animate points counter
    this._animatePointsCounter();
    
    // Trigger stamp animations
    this._animateStamps();
  }
  
  /**
   * Fires confetti celebration
   */
  _fireConfetti() {
    // Check if confetti library is available
    if (typeof confetti !== 'function') {
      console.warn('Confetti library not loaded, skipping celebration');
      this._showFallbackCelebration();
      return;
    }
    
    const colors = ['#E10514', '#F1C40F', '#22C55E', '#0984E3'];
    
    try {
      if (this.isFirstReferral) {
        // Enhanced celebration for first referral
        // First burst
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: colors
        });
        
        // Side bursts
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });
        }, 500);
        
        // Stars for first referral
        setTimeout(() => {
          confetti({
            particleCount: 30,
            spread: 120,
            shapes: ['star'],
            colors: ['#FD79A8', '#E10514', '#F1C40F'],
            origin: { y: 0.6 }
          });
        }, 1000);
        
      } else {
        // Standard celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors
        });
      }
    } catch (err) {
      console.warn('Confetti failed:', err);
      this._showFallbackCelebration();
    }
  }
  
  /**
   * Shows fallback celebration when confetti unavailable
   */
  _showFallbackCelebration() {
    // Add a CSS-based celebration class
    const screen = document.getElementById('confirmation-screen');
    if (screen) {
      screen.classList.add('confirmation--fallback-celebration');
    }
    
    // Show toast as alternative
    if (app && typeof app.showToast === 'function') {
      app.showToast(this.isFirstReferral ? 'כל הכבוד על ההפניה הראשונה!' : 'ההפניה נשלחה!', 'success');
    }
  }
  
  /**
   * Animates the points counter from 0 to target
   */
  _animatePointsCounter() {
    const counter = document.getElementById('points-counter');
    if (!counter) return;
    
    const target = parseInt(counter.dataset.target) || this.pointsEarned;
    const duration = 1000; // 1 second
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * easeOut);
      
      counter.textContent = `+${current}`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * Triggers stamp animations
   */
  _animateStamps() {
    const stamps = document.querySelectorAll('.confirmation__stamp');
    
    stamps.forEach((stamp, index) => {
      const delay = index * 300;
      
      setTimeout(() => {
        stamp.classList.remove('confirmation__stamp--animate');
        stamp.classList.add('confirmation__stamp--slam');
        
        // After slam animation, set to visible
        setTimeout(() => {
          stamp.classList.remove('confirmation__stamp--slam');
          stamp.classList.add('confirmation__stamp--visible');
        }, 500);
      }, delay);
    });
  }
  
  /**
   * Announces success to screen readers
   */
  _announceSuccess() {
    const announcement = document.getElementById('confirmation-announcement');
    if (announcement) {
      // Force announcement by toggling content
      const text = announcement.textContent;
      announcement.textContent = '';
      setTimeout(() => {
        announcement.textContent = text;
      }, 100);
    }
  }
  
  // ========================
  // UTILITY METHODS
  // ========================
  
  /**
   * Gets initials from name
   * @param {string} name - Full name
   * @returns {string} Initials
   */
  _getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
    return name.charAt(0);
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
  
  // ========================
  // LIFECYCLE
  // ========================
  
  /**
   * Called after component is mounted to DOM
   */
  mount() {
    super.mount();
    
    // Focus on title for accessibility
    const title = document.getElementById('confirmation-title');
    if (title) {
      title.focus();
    }
    
    // Start celebrations after a brief delay for page render
    setTimeout(() => {
      this.startCelebrations();
    }, 300);
  }
  
  /**
   * Called before component is removed
   */
  unmount() {
    // Clean up submission state when leaving
    stateManager.setState({
      lastSubmittedReferral: null,
      pointsEarnedFromSubmission: null,
      earnedStamps: null
    });
    
    super.unmount();
  }
}

/**
 * Initialize module - exposes components to global scope for backward compatibility
 */
export function initReferralFormModule() {
  window.ReferralFormComponent = ReferralFormComponent;
  window.ReferralConfirmationComponent = ReferralConfirmationComponent;
}
