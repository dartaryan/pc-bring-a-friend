# Story 1.2: Email Login Form

**Status:** review

## Story

**As an** employee,
**I want** to enter my PassportCard email address,
**So that** I can start the login process.

## Acceptance Criteria

### AC1: Login Screen Display
**Given** I am on the login screen (`#auth` route)
**When** I view the page
**Then** I see the PassportCard logo (white version on red gradient background)
**And** I see a welcome message "ברוכים הבאים ל-PassportCard Refer"
**And** I see an email input field with placeholder "אימייל חברה"
**And** I see a submit button "שלח קוד אימות"

### AC2: Email Domain Auto-Suggestion
**Given** I am typing in the email field
**When** I type "yossi.cohen"
**Then** the system auto-suggests "@passportcard.co.il" domain suffix
**And** I can tab or click to accept the suggestion
**And** the suggestion appears as grayed-out text after my input

### AC3: Email Validation - Invalid Format
**Given** I have entered an email
**When** the email format is NOT `firstname.lastname@passportcard.co.il`
**Then** the submit button remains disabled
**And** I see an inline validation error in Hebrew: "פורמט אימייל לא תקין"
**And** the input field shows error styling (red border)

### AC4: Email Validation - Valid Format
**Given** I have entered a valid email "yossi.cohen@passportcard.co.il"
**When** the email validates successfully
**Then** the submit button becomes enabled
**And** the input field shows success styling (green checkmark)
**And** no validation error is displayed

### AC5: Submit Behavior
**Given** I have entered a valid email "yossi.cohen@passportcard.co.il"
**When** I click the submit button
**Then** the button shows a loading spinner
**And** the button text changes to "שולח..."
**And** the input field becomes disabled
**And** the OTP modal opens after a brief delay (300ms)
**And** the email is stored in StateManager for the OTP step

### AC6: Enter Key Submission
**Given** I have entered a valid email
**When** I press Enter key
**Then** the form submits (same behavior as clicking button)

### AC7: Accessibility Requirements
**Given** the login form is displayed
**When** I use keyboard navigation
**Then** all elements are focusable in logical order (RTL)
**And** focus indicators are clearly visible
**And** form fields have proper `aria-label` attributes
**And** error messages are announced by screen readers (`aria-live`)

## Tasks / Subtasks

- [x] Task 1: Create LoginComponent class (AC: #1, #7)
  - [x] Create `LoginComponent` class extending `Component` base class
  - [x] Implement `template()` method returning login screen HTML
  - [x] Add RTL-aware layout with centered content
  - [x] Include PassportCard logo (SVG or CDN link)
  - [x] Add welcome text "ברוכים הבאים ל-PassportCard Refer"
  - [x] Implement `mount()` and `unmount()` lifecycle methods
  - [x] Set up state subscription for `isLoading`

- [x] Task 2: Create login screen styles (AC: #1)
  - [x] Create `.login-screen` container with red gradient background
  - [x] Style `.login-logo` for white PassportCard logo
  - [x] Style `.login-title` and `.login-subtitle` typography
  - [x] Create `.login-form` card with white background and shadow
  - [x] Ensure responsive design (mobile-first)

- [x] Task 3: Create email input with auto-suggestion (AC: #2)
  - [x] Create `.email-input-wrapper` container for input + suggestion
  - [x] Implement domain auto-suggestion logic in JavaScript
  - [x] Show suggestion as grayed text after user input
  - [x] Handle Tab key to accept suggestion
  - [x] Handle click on suggestion to accept
  - [x] Store full email value when suggestion accepted

- [x] Task 4: Implement email validation (AC: #3, #4)
  - [x] Create `_validateEmail(email)` private method
  - [x] Regex pattern: `/^[a-zA-Z]+\.[a-zA-Z]+@passportcard\.co\.il$/`
  - [x] Show validation error with `.input--error` class
  - [x] Show success state with `.input--valid` class
  - [x] Display inline error message "פורמט אימייל לא תקין"
  - [x] Enable/disable submit button based on validity

- [x] Task 5: Implement submit behavior (AC: #5, #6)
  - [x] Create `handleSubmit(e)` event handler
  - [x] Prevent default form submission
  - [x] Add loading state to button (spinner + "שולח...")
  - [x] Disable input during submission
  - [x] Store email in StateManager: `stateManager.setState({ pendingEmail: email })`
  - [x] After 300ms delay, trigger OTP modal
  - [x] Handle Enter key submission on email input

- [x] Task 6: Add accessibility features (AC: #7)
  - [x] Add `aria-label` to email input
  - [x] Add `aria-describedby` linking to error message
  - [x] Add `aria-live="polite"` to error container
  - [x] Ensure logical focus order (RTL)
  - [x] Add `role="alert"` to error messages
  - [x] Test with keyboard-only navigation

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**Component Class Structure:**
```javascript
class LoginComponent extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      emailSuggestion: '',
      isValid: false,
      errorMessage: '',
      isSubmitting: false
    };
  }
  
  template() {
    return `
      <div class="login-screen">
        <div class="login-hero">
          <div class="login-logo">
            <!-- PassportCard logo SVG -->
          </div>
          <h1 class="login-title">ברוכים הבאים ל-PassportCard Refer</h1>
          <p class="login-subtitle">מערכת ההפניות שלך</p>
        </div>
        
        <form class="login-form" data-action="submit-login">
          <div class="form-group">
            <label for="email-input" class="form-label">אימייל חברה</label>
            <div class="email-input-wrapper">
              <input 
                type="email" 
                id="email-input"
                class="form-input ${this.state.isValid ? 'input--valid' : ''} ${this.state.errorMessage ? 'input--error' : ''}"
                placeholder="firstname.lastname"
                aria-label="הזינו את כתובת האימייל שלכם"
                aria-describedby="email-error"
                autocomplete="email"
                data-action="email-input"
              >
              <span class="email-suggestion">@passportcard.co.il</span>
            </div>
            <div id="email-error" class="form-error" aria-live="polite" role="alert">
              ${this.state.errorMessage}
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn--primary btn--full ${this.state.isSubmitting ? 'btn--loading' : ''}"
            ${!this.state.isValid || this.state.isSubmitting ? 'disabled' : ''}
          >
            ${this.state.isSubmitting ? '<span class="spinner"></span> שולח...' : 'שלח קוד אימות'}
          </button>
        </form>
      </div>
    `;
  }
  
  mount() {
    this.bindEvents();
    this.$('#email-input')?.focus();
  }
  
  handleEmailInput(e) {
    const value = e.target.value.trim().toLowerCase();
    this._updateEmailState(value);
  }
  
  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.isValid || this.state.isSubmitting) return;
    
    const fullEmail = this.state.email.includes('@') 
      ? this.state.email 
      : `${this.state.email}@passportcard.co.il`;
    
    this.state.isSubmitting = true;
    this.render();
    
    stateManager.setState({ pendingEmail: fullEmail });
    
    setTimeout(() => {
      // Trigger OTP modal
      stateManager.setState({ activeModal: 'otp' });
    }, 300);
  }
  
  _validateEmail(email) {
    const fullEmail = email.includes('@') ? email : `${email}@passportcard.co.il`;
    const pattern = /^[a-zA-Z]+\.[a-zA-Z]+@passportcard\.co\.il$/;
    return pattern.test(fullEmail);
  }
  
  _updateEmailState(value) {
    const isValid = value.length > 0 && this._validateEmail(value);
    let errorMessage = '';
    
    if (value.length > 0 && !isValid) {
      errorMessage = 'פורמט אימייל לא תקין';
    }
    
    this.state = {
      ...this.state,
      email: value,
      isValid,
      errorMessage
    };
    this.render();
  }
}
```

**CSS Structure:**
```css
/* Login Screen - §15 in style.css */

.login-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--color-primary) 0%, #B50411 100%);
}

.login-hero {
  text-align: center;
  margin-bottom: var(--space-8);
}

.login-logo {
  width: 120px;
  height: auto;
  margin-bottom: var(--space-4);
}

.login-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-white);
  margin-bottom: var(--space-2);
}

.login-subtitle {
  font-size: var(--text-base);
  color: rgba(255, 255, 255, 0.9);
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: var(--space-6);
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.email-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.email-suggestion {
  position: absolute;
  left: var(--space-4); /* RTL: right side */
  color: var(--color-gray-400);
  pointer-events: none;
  font-size: var(--text-base);
}

.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  font-family: var(--font-family);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-input.input--valid {
  border-color: var(--color-success);
}

.form-input.input--error {
  border-color: var(--color-error);
}

.form-error {
  min-height: 20px;
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-error);
}
```

**Email Validation Regex:**
```javascript
// Must match: firstname.lastname@passportcard.co.il
// Examples: yossi.cohen@passportcard.co.il, dana.levi@passportcard.co.il
const EMAIL_PATTERN = /^[a-zA-Z]+\.[a-zA-Z]+@passportcard\.co\.il$/;
```

**State Updates:**
```javascript
// Store email for OTP step
stateManager.setState({ pendingEmail: email });

// Trigger OTP modal
stateManager.setState({ activeModal: 'otp' });
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #E10514 | Red gradient base |
| `--color-white` | #FFFFFF | Form background, text |
| `--color-gray-200` | #E5E7EB | Input border default |
| `--color-gray-400` | #9CA3AF | Placeholder, suggestion |
| `--color-success` | #22C55E | Valid input border |
| `--color-error` | #EF4444 | Error state |
| `--radius-xl` | 16px | Form card radius |
| `--shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Form card shadow |

### Event Delegation Actions

This component uses the following `data-action` values:
- `submit-login` - Form submission
- `email-input` - Input change handler (may need direct binding)

### Accessibility Notes

- Input must have visible focus indicator
- Error messages use `aria-live="polite"` for screen reader announcement
- Form elements in logical RTL order
- Minimum touch target 44x44px for submit button
- Color is not only indicator (use icons + text for states)

### Integration Points

**Dependencies:**
- `Component` base class (from Story 1.1)
- `StateManager` instance (from Story 1.1)
- `Router` class (from Story 1.1)

**Triggers:**
- On valid email submit → Opens OTP modal (Story 1.3)
- Stores `pendingEmail` in state for OTP verification

### Project Structure Notes

- Component code goes in `script.js` section: "COMPONENTS - Authentication"
- CSS goes in `style.css` section: "§15 Login Screen"
- HTML structure rendered dynamically via `template()` method

### References

- [Source: docs/architecture.md#3-core-architectural-decisions] - State management pattern
- [Source: docs/architecture.md#4-implementation-patterns] - Component structure pattern
- [Source: docs/architecture.md#4.2-css-naming-patterns] - CSS class naming rules
- [Source: docs/PRD.md#6.1-authentication-flow] - FR-AUTH-001 requirements
- [Source: docs/epics.md#story-12] - Original story definition
- [Source: docs/project_context.md] - Quick reference rules

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/project_context.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete)
- docs/sprint-artifacts/1-1-project-setup-app-shell.md (previous story)

### Agent Model Used

Claude Opus 4.5 (Amelia - Dev Agent)

### Debug Log References

- No errors encountered during implementation

### Completion Notes List

- **Task 1:** Created `LoginComponent` class extending `Component` base class with full template, mount/unmount lifecycle, and state management for email, validation, and submission states
- **Task 2:** Added complete login screen CSS with red gradient background, centered hero section, white form card, responsive design using CSS custom properties
- **Task 3:** Implemented email auto-suggestion with Tab key and click-to-accept behavior; suggestion shows grayed out domain suffix that becomes clickable when visible
- **Task 4:** Email validation via regex pattern `firstname.lastname@passportcard.co.il`; error/success states with visual indicators (red border + error message or green border + checkmark)
- **Task 5:** Submit handler stores email in StateManager, shows loading spinner with "שולח..." text, disables input, triggers OTP modal after 300ms; Enter key works via native form submission
- **Task 6:** Full accessibility: aria-label, aria-describedby, aria-invalid, aria-live="polite", role="alert", focus-visible indicators, logical RTL focus order

### File List

Files modified:
- `script.js` - Added LoginComponent class (~170 lines), registered component and action handler in initialization
- `style.css` - Added authentication component styles (~170 lines): login screen, form elements, buttons, input states, spinner animation, focus indicators

Dependencies from Story 1.1 (unchanged):
- `index.html` - App shell with `#app` container
- `script.js` - Component base class, StateManager, Router, App class
- `style.css` - CSS variables, base styles, reset

