# Story 4.5: Referral Form & Resume Upload

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to submit a candidate's information and resume,
**So that** HR can process my referral.

## Acceptance Criteria

### AC1: Form Display
**Given** I am on the referral form for a position
**When** I view the form
**Then** I see the position title at the top
**And** I see the form fields below
**And** I see the resume upload zone
**And** I see the submit button

### AC2: Required Form Fields
**Given** the form fields are displayed
**When** I view required fields (marked with *)
**Then** I see:
  - שם מלא של המועמד * (Full Name) - text input
  - אימייל * (Email) - email input
  - טלפון (Phone) - tel input (optional)
  - איך את/ה מכיר/ה את המועמד? * (Relationship) - dropdown
  - הערות נוספות (Notes) - textarea (optional, 500 char max)

### AC3: Relationship Dropdown Options
**Given** I view the relationship dropdown
**When** I click to open options
**Then** I see:
  - חבר/ה קרוב/ה (Close friend)
  - קולגה מעבודה קודמת (Former colleague)
  - מכר/ה מקצועי/ת (Professional acquaintance)
  - אחר (Other)

### AC4: Real-Time Validation
**Given** I enter form data
**When** I type in fields
**Then** validation runs in real-time (on blur or after 500ms debounce)
**And** invalid fields show inline error messages in Hebrew
**And** valid fields show green checkmark icon
**And** error styling uses red border

### AC5: Name Validation
**Given** I enter a name
**When** the name has < 2 characters
**Then** I see error: "נא להזין שם מלא"

### AC6: Email Validation
**Given** I enter an email
**When** the email format is invalid
**Then** I see error: "נא להזין כתובת אימייל תקינה"

### AC7: Phone Validation (Optional)
**Given** I enter a phone number
**When** the format is invalid (not matching Israeli patterns)
**Then** I see error: "נא להזין מספר טלפון תקין"
**And** empty phone is valid (optional field)

### AC8: Notes Character Limit
**Given** I type in the notes field
**When** I approach 500 characters
**Then** I see character counter showing "{current}/500"
**And** counter turns red at 450+ characters
**When** I exceed 500 characters
**Then** additional characters are not accepted

### AC9: Resume Upload Zone Display
**Given** I view the resume upload zone
**When** looking at the drag-and-drop area
**Then** I see: "📄 גררו קובץ לכאן או לחצו לבחירה"
**And** I see accepted formats: "PDF, DOC, DOCX"
**And** I see max size: "עד 5MB"

### AC10: Resume Drag Hover State
**Given** I drag a file over the upload zone
**When** the file hovers over the zone
**Then** the zone shows visual feedback (highlighted border, background change)
**And** text changes to "שחררו כדי להעלות"

### AC11: Valid Resume Upload
**Given** I drop or select a valid file (PDF/DOC/DOCX, ≤5MB)
**When** the file is processed
**Then** I see the filename displayed
**And** I see file size (formatted: e.g., "2.3 MB")
**And** I see a remove (X) button
**And** the drag-drop zone is replaced by file preview

### AC12: Invalid File Type
**Given** I drop or select an invalid file type
**When** validation fails
**Then** I see error: "פורמט לא נתמך. נא להעלות PDF, DOC או DOCX"
**And** the file is not accepted
**And** I can try again

### AC13: File Too Large
**Given** I drop or select a file larger than 5MB
**When** validation fails
**Then** I see error: "הקובץ גדול מדי. גודל מקסימלי: 5MB"
**And** the file is not accepted

### AC14: Remove Uploaded File
**Given** I have uploaded a resume
**When** I click the remove (X) button
**Then** the file is removed
**And** the drag-drop zone is restored
**And** I can upload a different file

### AC15: Submit Button State
**Given** the form is incomplete (missing required fields or invalid)
**When** I view the submit button
**Then** the button is disabled (grayed out)
**And** the button shows "📤 שליחת ההפניה"

### AC16: Submit Button Ready
**Given** the form is valid (all required fields filled and valid)
**When** I view the submit button
**Then** the button is enabled
**And** the button shows: "📤 שליחת ההפניה (+50 נקודות יתווספו לחשבונך)"

### AC17: Form Submission Loading
**Given** the form is valid
**When** I click the submit button
**Then** the button shows loading state with spinner
**And** all form fields become disabled
**And** I cannot submit again

### AC18: Successful Submission
**Given** the form submits successfully
**When** submission completes (after 1-2s mock delay)
**Then** a new referral is created in state
**And** the "קו״ח הוגש" stamp is added to user's stamps
**And** +50 points are added to user's total
**Then** navigation to confirmation screen (Story 4.6)

### AC19: First Referral Bonus
**Given** this is my first ever referral
**When** submission completes
**Then** I also receive the "הפניה ראשונה" stamp (+100 bonus)
**And** total +150 points for first referral

### AC20: Accessibility
**Given** I use keyboard or screen reader
**When** interacting with the form
**Then** all fields have associated labels
**And** error messages are linked via aria-describedby
**And** required fields marked with aria-required="true"
**And** file upload has proper aria-label
**And** submit button state communicated to screen readers

### AC21: Back Navigation
**Given** I am on the referral form
**When** I click the back button
**Then** I return to the positions page
**And** I see confirmation dialog if form has data: "האם לבטל את ההפניה?"

## Tasks / Subtasks

- [x] Task 1: Create ReferralFormComponent (AC: #1, #2, #3)
  - [x] Create ReferralFormComponent class extending Component
  - [x] Implement template() with form structure
  - [x] Add position title header display
  - [x] Create all form fields with labels
  - [x] Create relationship dropdown with options

- [x] Task 2: Implement field validation (AC: #4-8)
  - [x] Add _validateName() method
  - [x] Add _validateEmail() method
  - [x] Add _validatePhone() method
  - [x] Add real-time validation on blur/input
  - [x] Add character counter for notes field
  - [x] Add visual feedback (checkmarks, error styling)

- [x] Task 3: Implement resume upload zone (AC: #9-14)
  - [x] Create drag-and-drop zone HTML
  - [x] Add dragover/dragleave handlers for visual feedback
  - [x] Add drop handler for file processing
  - [x] Add click handler for file browse
  - [x] Create hidden file input element
  - [x] Implement file validation (type, size)
  - [x] Create file preview display
  - [x] Add remove file functionality

- [x] Task 4: Implement form submission (AC: #15-19)
  - [x] Track form validity state
  - [x] Toggle submit button enabled/disabled
  - [x] Add loading state during submission
  - [x] Create referral data object
  - [x] Add referral to state
  - [x] Add stamp(s) to user
  - [x] Update user points
  - [x] Navigate to confirmation

- [x] Task 5: Wire to router and state (AC: #1, #21)
  - [x] Add route handler for 'refer' route with positionId param
  - [x] Load position from referringPosition state or MOCK_POSITIONS
  - [x] Add back navigation with confirmation dialog
  - [x] Clean up state on unmount

- [x] Task 6: Add accessibility features (AC: #20)
  - [x] Add proper labels and aria attributes
  - [x] Link error messages to fields
  - [x] Mark required fields
  - [x] Test keyboard navigation

- [x] Task 7: Add CSS styles
  - [x] Style form container and layout
  - [x] Style input fields (default, focus, error, valid)
  - [x] Style upload zone (default, hover, has-file)
  - [x] Style file preview display
  - [x] Style submit button states
  - [x] Add responsive styles
  - [x] Add reduced motion support

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story creates the ReferralFormComponent that connects the share flow (4.4) to confirmation (4.6).**

**Route:** `#refer/:positionId` or `#refer` (with referringPosition in state)

**State Keys Used:**

| Key | Type | Description |
|-----|------|-------------|
| `referringPosition` | Object | Position being referred for (set by 4.3/4.4) |
| `referrals` | Array | User's referral submissions |
| `stamps` | Array | User's earned stamps |
| `currentUser` | Object | User data including points |

### ReferralFormComponent Implementation

```javascript
// ============================================
// COMPONENTS - Referral Form (Story 4.5)
// ============================================

class ReferralFormComponent extends Component {
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
        <div class="referral-form-error">
          <p>לא נמצאה משרה להפניה</p>
          <button class="btn btn--primary" data-action="navigate-positions">
            חזרה למשרות
          </button>
        </div>
      `;
    }
    
    return `
      <div class="referral-form" id="referral-form">
        ${this._renderHeader()}
        
        <form class="referral-form__form" novalidate>
          ${this._renderPositionSummary()}
          ${this._renderFormFields()}
          ${this._renderUploadZone()}
          ${this._renderSubmitSection()}
        </form>
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
    const totalPoints = Math.round((50 + 100 + p.bonus) * multiplier);
    
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
            <span class="upload-zone__text-primary">📄 גררו קובץ לכאן או לחצו לבחירה</span>
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
    const icon = file.name.endsWith('.pdf') ? 'ti-file-type-pdf' : 'ti-file-type-doc';
    
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
          ${isFirstReferral ? '🎉 הפניה ראשונה! ' : ''}
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
            <i class="ti ti-send" aria-hidden="true"></i>
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
  }
  
  /**
   * Updates upload zone display
   */
  _updateUploadZone() {
    const container = document.getElementById('upload-zone')?.parentElement;
    if (!container) return;
    
    // Find the upload zone and error containers
    const uploadZone = container.querySelector('#upload-zone, #file-preview');
    const errorDiv = container.querySelector('#upload-error');
    
    if (uploadZone) {
      // Replace with new content
      const newContent = this.uploadedFile ? this._renderFilePreview() : this._renderUploadZoneContent();
      uploadZone.outerHTML = newContent;
    }
  }
  
  /**
   * Renders just the upload zone content (for updates)
   * @returns {string} HTML string
   */
  _renderUploadZoneContent() {
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
            <span class="upload-zone__text-primary">📄 גררו קובץ לכאן או לחצו לבחירה</span>
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
    }
    
    // Update state
    stateManager.setState({
      referrals: [...referrals, newReferral],
      stamps: newStamps,
      currentUser: {
        ...currentUser,
        points: (currentUser.points || 0) + pointsAdded
      },
      lastSubmittedReferral: newReferral,
      pointsEarnedFromSubmission: pointsAdded,
      earnedStamps: isFirstReferral ? [submissionStamp, newStamps[newStamps.length - 1]] : [submissionStamp]
    });
    
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
    
    // Validate on input (debounced in real impl)
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
    
    // Update error message
    const errorEl = container.querySelector('.form-field__error');
    if (error && !errorEl) {
      const errorP = document.createElement('p');
      errorP.className = 'form-field__error';
      errorP.role = 'alert';
      errorP.textContent = error;
      container.appendChild(errorP);
    } else if (!error && errorEl) {
      errorEl.remove();
    } else if (error && errorEl) {
      errorEl.textContent = error;
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
    if (zone) {
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
  
  // ========================
  // LIFECYCLE
  // ========================
  
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
    
    // File upload zone events
    const zone = document.getElementById('upload-zone');
    if (zone) {
      zone.addEventListener('dragover', this._handleDragOver);
      zone.addEventListener('dragleave', this._handleDragLeave);
      zone.addEventListener('drop', this._handleDrop);
      
      // Click to browse
      zone.addEventListener('click', () => {
        const input = document.getElementById('resume-input');
        if (input) input.click();
      });
    }
    
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
    
    // Prevent form default submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }
  
  mount() {
    this.bindEvents();
  }
  
  unmount() {
    super.unmount();
  }
}
```

### Action Handlers (add/update in action handlers section)

```javascript
// ============================================
// ACTION HANDLERS - Referral Form (Story 4.5)
// ============================================

// Submit referral form
app.registerAction('submit-referral', async () => {
  const formComponent = stateManager.getState('referralFormInstance');
  if (formComponent) {
    await formComponent.handleSubmit();
  }
});

// Remove uploaded resume
app.registerAction('remove-resume', () => {
  const formComponent = stateManager.getState('referralFormInstance');
  if (formComponent) {
    formComponent.uploadedFile = null;
    formComponent._updateUploadZone();
  }
});

// Back from referral form
app.registerAction('back-from-referral', () => {
  const formComponent = stateManager.getState('referralFormInstance');
  const hasData = formComponent && (
    formComponent.formData.candidateName ||
    formComponent.formData.candidateEmail ||
    formComponent.uploadedFile
  );
  
  if (hasData) {
    // Show confirmation dialog
    const confirmed = window.confirm('האם לבטל את ההפניה?');
    if (!confirmed) return;
  }
  
  // Clear state and navigate back
  stateManager.setState({
    referringPosition: null,
    referralFormInstance: null
  });
  router.navigate('positions');
});

// Navigate to positions (fallback)
app.registerAction('navigate-positions', () => {
  router.navigate('positions');
});
```

### Router Update (add refer route)

```javascript
// ============================================
// ROUTER - Add refer route
// ============================================

// In Router routes configuration:
{
  path: 'refer',
  component: 'ReferralFormComponent',
  requiresAuth: true
}

// Route handler:
case 'refer':
  const positionId = params.positionId || window.location.hash.split('/')[1];
  const referralForm = new ReferralFormComponent({ positionId });
  stateManager.setState({ referralFormInstance: referralForm });
  renderComponent(referralForm);
  break;
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   REFERRAL FORM (Story 4.5)
   ========================================================================= */

.referral-form {
  min-height: 100vh;
  background: var(--color-background);
}

/* -------------------------------------------------------------------------
   Referral Form Header
   ------------------------------------------------------------------------- */

.referral-form__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.referral-form__back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.referral-form__back-btn:hover {
  background: var(--color-surface-hover);
  color: var(--text-primary);
}

.referral-form__back-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.referral-form__back-btn .ti {
  font-size: 1.5rem;
}

.referral-form__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

/* -------------------------------------------------------------------------
   Referral Form Content
   ------------------------------------------------------------------------- */

.referral-form__form {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  max-width: 600px;
  margin: 0 auto;
}

/* -------------------------------------------------------------------------
   Position Summary Card
   ------------------------------------------------------------------------- */

.referral-form__position-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border-right: 4px solid var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.referral-form__position-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
}

.referral-form__position-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}

.referral-form__position-meta span {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.referral-form__position-meta .ti {
  font-size: 1rem;
}

.referral-form__position-bonus {
  text-align: left;
  flex-shrink: 0;
}

.referral-form__bonus-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: var(--space-1);
}

.referral-form__bonus-value {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-gold);
  direction: ltr;
  unicode-bidi: isolate;
}

/* -------------------------------------------------------------------------
   Form Fields Container
   ------------------------------------------------------------------------- */

.referral-form__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* -------------------------------------------------------------------------
   Form Field Styles
   ------------------------------------------------------------------------- */

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-field__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.form-field__required {
  color: var(--color-error);
  margin-inline-start: var(--space-1);
}

.form-field__optional {
  font-weight: var(--font-normal);
  color: var(--text-muted);
  font-size: var(--text-xs);
}

.form-field__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-field__input {
  width: 100%;
  padding: var(--space-3);
  font-size: var(--text-base);
  font-family: inherit;
  color: var(--text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-field__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(225, 5, 20, 0.1);
}

.form-field__input::placeholder {
  color: var(--text-muted);
}

/* Select field */
.form-field__input--select {
  appearance: none;
  padding-inline-end: var(--space-10);
  cursor: pointer;
}

.form-field__select-icon {
  position: absolute;
  left: var(--space-3);
  pointer-events: none;
  color: var(--text-muted);
  font-size: 1.25rem;
}

/* Textarea field */
.form-field__input--textarea {
  min-height: 100px;
  resize: vertical;
}

/* Character counter */
.form-field__counter {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-align: left;
  direction: ltr;
  margin: 0;
}

.form-field__counter--warning {
  color: var(--color-warning);
}

/* Field icons */
.form-field__icon {
  position: absolute;
  left: var(--space-3);
  font-size: 1.25rem;
  pointer-events: none;
}

.form-field__icon--valid {
  color: var(--color-success);
}

.form-field__icon--error {
  color: var(--color-error);
}

/* Error state */
.form-field--error .form-field__input {
  border-color: var(--color-error);
}

.form-field--error .form-field__input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-field__error {
  font-size: var(--text-xs);
  color: var(--color-error);
  margin: 0;
}

/* Valid state */
.form-field--valid .form-field__input {
  border-color: var(--color-success);
}

.form-field--valid .form-field__input:focus {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* -------------------------------------------------------------------------
   Upload Zone
   ------------------------------------------------------------------------- */

.upload-zone {
  position: relative;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8) var(--space-4);
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.upload-zone:hover {
  border-color: var(--color-primary);
  background: rgba(225, 5, 20, 0.02);
}

.upload-zone:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(225, 5, 20, 0.1);
}

.upload-zone__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.upload-zone__icon {
  font-size: 3rem;
  color: var(--text-muted);
  margin-bottom: var(--space-3);
}

.upload-zone__text {
  margin: 0 0 var(--space-2);
  font-size: var(--text-base);
  color: var(--text-primary);
}

.upload-zone__text-primary {
  font-weight: var(--font-medium);
}

.upload-zone__formats {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-1);
}

.upload-zone__size {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: 0;
}

/* Hover state content */
.upload-zone__hover-content {
  display: none;
}

.upload-zone--hover {
  border-color: var(--color-primary);
  border-style: solid;
  background: rgba(225, 5, 20, 0.05);
}

.upload-zone--hover .upload-zone__content {
  display: none;
}

.upload-zone--hover .upload-zone__hover-content {
  display: block;
}

.upload-zone--hover .upload-zone__icon {
  color: var(--color-primary);
}

/* Upload error */
.upload-zone__error {
  display: none;
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
}

/* -------------------------------------------------------------------------
   File Preview
   ------------------------------------------------------------------------- */

.file-preview {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.file-preview__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.file-preview__icon .ti {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.file-preview__info {
  flex: 1;
  min-width: 0;
}

.file-preview__name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin: 0 0 var(--space-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-preview__size {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: 0;
  direction: ltr;
  unicode-bidi: isolate;
}

.file-preview__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.file-preview__remove:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.file-preview__remove:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* -------------------------------------------------------------------------
   Submit Section
   ------------------------------------------------------------------------- */

.referral-form__submit-section {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.referral-form__points-hint {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-4);
}

.referral-form__points-hint strong {
  color: var(--color-gold);
  direction: ltr;
  unicode-bidi: isolate;
}

.referral-form__submit-btn {
  width: 100%;
}

/* Button spinner */
.btn__spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-inline-end: var(--space-2);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error page */
.referral-form-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: var(--space-4);
}

.referral-form-error p {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

/* -------------------------------------------------------------------------
   Responsive - Desktop
   ------------------------------------------------------------------------- */

@media (min-width: 1024px) {
  .referral-form__form {
    padding: var(--space-6);
  }
  
  .referral-form__position-card {
    padding: var(--space-5);
  }
}

/* -------------------------------------------------------------------------
   Reduced Motion
   ------------------------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .form-field__input,
  .upload-zone,
  .file-preview__remove,
  .referral-form__back-btn,
  .btn__spinner {
    transition: none;
  }
  
  .btn__spinner {
    animation: none;
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-error` | `#EF4444` | Error states, validation |
| `--color-success` | `#22C55E` | Valid state checkmarks |
| `--color-warning` | `#F59E0B` | Character limit warning |
| `--color-gold` | `#F1C40F` | Bonus points display |
| `--radius-lg` | `16px` | Card and upload zone corners |
| `--radius-md` | `8px` | Input field corners |
| Max file size | `5MB` (5 * 1024 * 1024) | Resume upload limit |
| Character limit | `500` | Notes field maximum |
| Validation debounce | `500ms` | Input field validation delay |

### Dependencies

**From Previous Stories:**
- StateManager with referringPosition, referrals, stamps keys (Stories 1.1, 4.3, 4.4)
- MOCK_POSITIONS data structure (Story 4.1)
- Component base class (Story 1.1)
- Router with navigate() (Story 1.1)
- Button styles (.btn, .btn--primary, .btn--lg, .btn--full) (Story 1.2)
- showToast() function (Story 4.3)

**From Story 4.4:**
- referringPosition state is set when user initiates referral
- SharePanel may have already been displayed
- Navigation flow: Share Panel → Continue → Referral Form

**Creates Foundation For:**
- Story 4.6: Submission Confirmation (receives lastSubmittedReferral, earnedStamps, pointsEarnedFromSubmission)

### Integration Points

**Files to Modify:**
- `script.js`:
  - Add ReferralFormComponent class (~450 lines)
  - Add action handlers: submit-referral, remove-resume, back-from-referral (~40 lines)
  - Add route handler for 'refer' route (~15 lines)
  - Total: ~505 lines JS
- `style.css`:
  - Add referral form header styles (~50 lines)
  - Add position card styles (~40 lines)
  - Add form field styles (~120 lines)
  - Add upload zone styles (~80 lines)
  - Add file preview styles (~50 lines)
  - Add submit section styles (~40 lines)
  - Add responsive and reduced motion (~30 lines)
  - Total: ~410 lines CSS

**No new files created.**

### State Flow

```
[Story 4.3: Position Details Modal]
    ↓ (click "הפנה עכשיו")
    ↓ Sets: referringPosition = position
    ↓ 
[Story 4.4: Share Panel] (optional)
    ↓ (click "המשך להפניה")
    ↓
[Story 4.5: Referral Form] ← YOU ARE HERE
    ↓ User fills form
    ↓ User uploads resume (optional)
    ↓ Click submit
    ↓
    ↓ Updates:
    ↓   - referrals: [...referrals, newReferral]
    ↓   - stamps: [...stamps, submissionStamp, ?firstReferralStamp]
    ↓   - currentUser.points += earnedPoints
    ↓   - lastSubmittedReferral = newReferral
    ↓   - pointsEarnedFromSubmission = 50 or 150
    ↓   - earnedStamps = [stamps earned]
    ↓
[Story 4.6: Submission Confirmation]
```

### Testing Scenarios

1. **Form Display:**
   - Navigate to referral form → Form displays with position info
   - Position card shows title, department, location, bonus

2. **Field Validation:**
   - Enter < 2 chars in name → Shows error
   - Enter invalid email → Shows error
   - Enter invalid phone → Shows error
   - Leave required field empty → Shows error on blur
   - Enter valid data → Shows green checkmark

3. **Character Counter:**
   - Type in notes → Counter updates
   - Approach 500 chars → Counter turns red at 450
   - Try to exceed 500 → Additional chars blocked

4. **Resume Upload - Valid:**
   - Drag PDF over zone → Shows hover state
   - Drop valid file → Shows file preview
   - Click to browse → File picker opens
   - Select valid file → Shows file preview

5. **Resume Upload - Invalid:**
   - Drop .exe file → Shows format error
   - Drop 10MB file → Shows size error
   - Error doesn't persist after retry

6. **Remove File:**
   - Click X on file preview → File removed
   - Upload zone restored

7. **Submit Button State:**
   - Form incomplete → Button disabled
   - All required fields valid → Button enabled
   - Missing relationship → Button disabled

8. **Form Submission:**
   - Click submit → Loading state shows
   - Wait 1.5s → Success
   - New referral added to state
   - "קו״ח הוגש" stamp added
   - Points increased by 50

9. **First Referral Bonus:**
   - User has no referrals → Submit
   - Both stamps added (submission + first)
   - Points increased by 150

10. **Back Navigation:**
    - Form empty → Navigate back immediately
    - Form has data → Show confirmation dialog
    - Confirm cancel → Navigate back
    - Cancel cancel → Stay on form

11. **Accessibility:**
    - All labels linked to inputs
    - Error messages announced via aria-live
    - Required fields have aria-required
    - Keyboard navigation works

### Previous Story Intelligence

**From Story 4.4:**
- SharePanel sets referringPosition state before navigation
- close-share-panel action can navigate to 'refer' route
- User may skip share panel and go directly to form

**From Story 4.3:**
- refer-from-modal action sets referringPosition
- Position data structure includes: id, title, department, location, bonus, campaign
- _escapeHtml() pattern for safe rendering

**Key patterns to maintain:**
- Use `data-action` attributes for button handlers
- Use `data-field` attributes for form field identification
- Use StateManager for all state changes
- RTL-aware CSS with logical properties (margin-inline-start, padding-inline-end)
- Numbers/points use `direction: ltr; unicode-bidi: isolate;`
- BEM naming convention for CSS
- 44px minimum touch targets
- Hebrew text throughout UI
- Debounce validation for better UX

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- ReferralFormComponent is instantiated per route visit
- Form state managed locally in component instance
- Global state updated only on successful submission
- Component stored in state as `referralFormInstance` for action handler access

### References

- [Source: docs/architecture.md#3.4] - Component architecture pattern
- [Source: docs/architecture.md#3.6] - Error handling approach
- [Source: docs/architecture.md#4.2] - CSS naming patterns
- [Source: docs/architecture.md#4.3] - JavaScript naming patterns
- [Source: docs/epics.md#story-45] - Original acceptance criteria
- [Source: docs/PRD.md#FR-REF-002] - Resume upload requirements
- [Source: docs/PRD.md#FR-REF-003] - Candidate form requirements
- [Source: docs/project_context.md] - Implementation rules
- [Source: docs/sprint-artifacts/4-3-position-details-modal.md] - Modal patterns, _escapeHtml
- [Source: docs/sprint-artifacts/4-4-share-referral-link.md] - Share flow, referringPosition state

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete - state management, component patterns, file organization)
- docs/epics.md (complete - Epic 4, Story 4.5 full acceptance criteria)
- docs/PRD.md (FR-REF-002 resume requirements, FR-REF-003 form requirements)
- docs/project_context.md (implementation rules, naming conventions)
- docs/sprint-artifacts/4-3-position-details-modal.md (position data, refer-from-modal action)
- docs/sprint-artifacts/4-4-share-referral-link.md (share flow, referringPosition state)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode

### Debug Log References

- No issues encountered during implementation

### Implementation Notes (Dev Session - 2025-12-10)

**Completed:**
1. Created ReferralFormComponent class (~800 lines) with:
   - Full form structure with position summary card
   - All form fields: name, email, phone, relationship dropdown, notes textarea
   - Real-time field validation with Hebrew error messages
   - Character counter for notes (500 char max, warning at 450+)
   - Drag-and-drop resume upload with file type/size validation
   - File preview with remove functionality
   - Submit button state management (disabled until valid)
   - Loading state during submission
   - First referral bonus detection (+150 points vs +50 points)

2. Integrated with router and state management:
   - Added 'refer' route to CONFIG.ROUTES
   - Registered ReferralFormComponent
   - Updated refer-position, refer-from-modal, continue-to-referral actions
   - Added new action handlers: submit-referral, remove-resume, back-from-referral, navigate-positions

3. State updates on submission:
   - Creates new referral object with full timeline
   - Adds "קו״ח הוגש" stamp (+50 points)
   - Adds "הפניה ראשונה" stamp for first referral (+100 bonus)
   - Updates currentUser.points
   - Sets lastSubmittedReferral for confirmation screen

4. CSS styles (~400 lines):
   - Form header with sticky positioning
   - Position summary card with bonus display
   - Form field styles (default, focus, error, valid states)
   - Upload zone with drag hover state
   - File preview with remove button
   - Submit section with points hint
   - Responsive styles for desktop
   - Reduced motion support

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created with:
- Full ReferralFormComponent implementation (~450 lines)
- Real-time field validation with inline error messages
- Resume drag-and-drop upload with file validation (type, size)
- File preview with remove functionality
- Character counter for notes field
- Submit button state management
- First referral bonus detection and handling
- Integration with referringPosition state from Story 4.4
- State updates for referrals, stamps, and user points
- Navigation to confirmation screen (Story 4.6)
- Back navigation with confirmation dialog
- Complete CSS styling (~410 lines)
- Accessibility features (aria-labels, aria-describedby, aria-required)
- Responsive and reduced motion support

### File List

**Files Modified:**
- `script.js`:
  - Added 'refer' route to CONFIG.ROUTES (line 24)
  - Added ReferralFormComponent class (~800 lines, after PositionsComponent)
  - Registered ReferralFormComponent in DOMContentLoaded
  - Added action handlers: submit-referral, remove-resume, back-from-referral, navigate-positions
  - Updated refer-position, refer-from-modal, continue-to-referral actions to navigate to 'refer' route
  
- `style.css`:
  - Added referral form styles (~400 lines at end of file):
    - Form header styles
    - Position summary card styles
    - Form field styles (default, focus, error, valid)
    - Upload zone styles (default, hover, drag)
    - File preview styles
    - Submit section styles
    - Responsive and reduced motion support

- `docs/sprint-artifacts/sprint-status.yaml`:
  - Updated 4-5-referral-form-resume-upload status: ready-for-dev → in-progress → review

**No new files created.**

Extends:
- Story 4.3: Position Details Modal (refer-from-modal action, referringPosition)
- Story 4.4: Share Referral Link (share flow leads to form)

Creates foundation for:
- Story 4.6: Submission Confirmation (receives lastSubmittedReferral, earnedStamps, pointsEarnedFromSubmission)

