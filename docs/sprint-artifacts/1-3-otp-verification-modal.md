# Story 1.3: OTP Verification Modal

**Status:** review

## Story

**As an** employee,
**I want** to verify my identity with a 6-digit code,
**So that** I can access my account securely.

## Acceptance Criteria

### AC1: OTP Modal Display
**Given** I have submitted a valid email
**When** the OTP modal appears
**Then** I see my masked email (e.g., "y***@passportcard...")
**And** I see 6 individual digit input boxes
**And** the first input box is auto-focused
**And** the digits are displayed LTR (direction: ltr)

### AC2: Auto-Advance Between Inputs
**Given** I am entering the OTP
**When** I type a digit in one box
**Then** focus automatically moves to the next box
**And** I can only enter numbers (0-9)

### AC3: Backspace Navigation
**Given** I am entering the OTP
**When** I press backspace on an empty input
**Then** focus moves to the previous input
**And** the previous input's value is cleared

### AC4: Verify Button States
**Given** I have entered 6 digits
**When** I click "אימות" (Verify) button
**Then** I see a loading spinner with "מאמת..." message
**And** the system waits 1.5-2 seconds (simulated verification)
**And** all inputs are disabled during verification

### AC5: Correct OTP Success Flow
**Given** I have entered the correct OTP "000000"
**When** verification completes
**Then** I see a success animation (green checkmark)
**And** a mock User object is generated from my email (using seeded random)
**And** the user is stored in StateManager
**And** `isAuthenticated` is set to `true`
**And** I am redirected to `#passport` route after brief success display (500ms)

### AC6: Incorrect OTP Error Flow
**Given** I have entered an incorrect OTP
**When** verification completes
**Then** I see an error message "קוד שגוי, נסה שוב"
**And** the input fields shake (error animation)
**And** the fields are cleared for retry
**And** focus returns to first input

### AC7: Resend OTP Functionality
**Given** I haven't received the code
**When** I click "שלח שוב" (Resend)
**Then** I see a countdown timer (45 seconds)
**And** the resend link is disabled during countdown
**And** after countdown, link becomes clickable again

### AC8: Modal Close Behavior
**Given** the OTP modal is open
**When** I click the close button (X) or outside the modal
**Then** the modal closes
**And** I return to the login form
**And** the pending email state is preserved

### AC9: Accessibility Requirements
**Given** the OTP modal is displayed
**When** I use keyboard navigation
**Then** focus is trapped within the modal
**And** ESC key closes the modal
**And** all inputs have proper `aria-label` attributes
**And** error messages are announced by screen readers

## Tasks / Subtasks

- [x] Task 1: Create OTPModalComponent class (AC: #1, #9)
  - [x] Create `OTPModalComponent` class extending `Component`
  - [x] Implement `template()` with modal structure
  - [x] Add masked email display logic
  - [x] Create 6 individual OTP input boxes with LTR direction
  - [x] Add verify button with loading state support
  - [x] Add resend link with countdown display
  - [x] Add close button (X)
  - [x] Implement focus trap within modal

- [x] Task 2: Create OTP modal styles (AC: #1)
  - [x] Style `.otp-modal-overlay` backdrop
  - [x] Style `.otp-modal` container with slide-up animation
  - [x] Style `.otp-inputs` container with 6 boxes
  - [x] Style `.otp-input` individual boxes (LTR, numeric)
  - [x] Add focus, error, and success states
  - [x] Add shake animation for error state
  - [x] Style resend countdown timer

- [x] Task 3: Implement OTP input behavior (AC: #2, #3)
  - [x] Handle numeric input only (filter non-digits)
  - [x] Auto-advance to next input on digit entry
  - [x] Handle backspace to go to previous input
  - [x] Handle paste of 6-digit code
  - [x] Ensure inputs maintain LTR direction

- [x] Task 4: Implement verification logic (AC: #4, #5, #6)
  - [x] Create `_verifyOTP()` private method
  - [x] Add 1.5-2 second simulated delay
  - [x] Check against `CONFIG.OTP_CODE` ('000000')
  - [x] On success: generate user, update state, redirect
  - [x] On failure: show error, shake inputs, clear and refocus

- [x] Task 5: Implement user generation (AC: #5)
  - [x] Create `_generateUserFromEmail(email)` method
  - [x] Use seeded random based on email
  - [x] Generate: id, firstName, lastName (Hebrew), department, points, stamps
  - [x] Store user in StateManager
  - [x] Set `isAuthenticated: true`

- [x] Task 6: Implement resend functionality (AC: #7)
  - [x] Create `_startResendCountdown()` method
  - [x] 45 second countdown timer
  - [x] Disable/enable resend link based on timer
  - [x] Show countdown in "שלח שוב (XX)" format

- [x] Task 7: Add modal interactions (AC: #8, #9)
  - [x] Handle close button click
  - [x] Handle click outside modal to close
  - [x] Handle ESC key to close
  - [x] Implement focus trap
  - [x] Preserve `pendingEmail` in state on close

- [x] Task 8: Register OTP modal with App (AC: all)
  - [x] Subscribe to `activeModal` state changes
  - [x] Show/hide modal based on `activeModal === 'otp'`
  - [x] Register action handlers with app

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**Component Class Structure:**
```javascript
class OTPModalComponent extends Component {
  constructor() {
    super();
    this._otpValues = ['', '', '', '', '', ''];
    this._isVerifying = false;
    this._hasError = false;
    this._errorMessage = '';
    this._resendCountdown = 0;
    this._resendTimer = null;
  }
  
  template() {
    const email = stateManager.getState('pendingEmail') || '';
    const maskedEmail = this._maskEmail(email);
    
    return `
      <div class="otp-modal-overlay" data-action="close-otp-overlay">
        <div class="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">
          <button class="otp-modal__close" data-action="close-otp" aria-label="סגור">
            <i class="ti ti-x"></i>
          </button>
          
          <div class="otp-modal__header">
            <div class="otp-modal__icon">
              <i class="ti ti-mail-check"></i>
            </div>
            <h2 id="otp-title" class="otp-modal__title">אימות קוד</h2>
            <p class="otp-modal__subtitle">
              שלחנו קוד בן 6 ספרות אל<br>
              <strong dir="ltr">${maskedEmail}</strong>
            </p>
          </div>
          
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
              ? '<span class="spinner"></span> מאמת...' 
              : 'אימות'}
          </button>
          
          <div class="otp-resend">
            ${this._resendCountdown > 0 
              ? `<span class="otp-resend--disabled">שלח שוב (${this._resendCountdown})</span>`
              : '<a href="#" data-action="resend-otp" class="otp-resend__link">שלח שוב</a>'}
          </div>
        </div>
      </div>
    `;
  }
  
  _renderOTPInputs() {
    return this._otpValues.map((value, index) => `
      <input
        type="text"
        inputmode="numeric"
        pattern="[0-9]"
        maxlength="1"
        class="otp-input"
        data-index="${index}"
        value="${value}"
        aria-label="ספרה ${index + 1} מתוך 6"
        autocomplete="one-time-code"
        ${this._isVerifying ? 'disabled' : ''}
      >
    `).join('');
  }
  
  _maskEmail(email) {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    const firstChar = localPart[0];
    return `${firstChar}***@${domain.substring(0, 12)}...`;
  }
  
  _isOTPComplete() {
    return this._otpValues.every(v => v !== '');
  }
  
  mount() {
    this._setupInputHandlers();
    this._focusFirstInput();
    this._startResendCountdown();
    this._setupKeyboardHandlers();
  }
  
  unmount() {
    super.unmount();
    if (this._resendTimer) {
      clearInterval(this._resendTimer);
    }
  }
  
  // ... additional methods below
}
```

**CSS Structure:**
```css
/* OTP Modal - Add to §10 Modals section in style.css */

.otp-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: var(--z-modal);
  animation: fadeIn 0.2s ease;
}

.otp-modal {
  width: 100%;
  max-width: 400px;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  position: relative;
  animation: slideUp 0.3s var(--ease-default);
}

.otp-modal__close {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4); /* RTL: left side for X button */
  background: none;
  border: none;
  font-size: var(--text-xl);
  color: var(--color-gray-400);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-full);
  transition: background-color 0.2s, color 0.2s;
}

.otp-modal__close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.otp-modal__header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.otp-modal__icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  background: var(--color-primary-light);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.otp-modal__icon i {
  font-size: 32px;
  color: var(--color-primary);
}

.otp-modal__title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.otp-modal__subtitle {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  line-height: 1.5;
}

/* OTP Inputs - LTR for numbers */
.otp-inputs {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-4);
}

.otp-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  font-family: var(--font-family);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  transition: border-color 0.2s, box-shadow 0.2s;
  direction: ltr;
  unicode-bidi: isolate;
}

.otp-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(225, 5, 20, 0.1);
}

.otp-input:disabled {
  background: var(--color-gray-50);
  cursor: not-allowed;
}

/* Error state with shake animation */
.otp-inputs--error .otp-input {
  border-color: var(--color-error);
  animation: shake 0.4s ease;
}

.otp-error {
  min-height: 24px;
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-error);
  margin-bottom: var(--space-4);
}

/* Success state */
.otp-input--success {
  border-color: var(--color-success);
  background: rgba(34, 197, 94, 0.05);
}

/* Verify button */
.otp-verify-btn {
  margin-bottom: var(--space-4);
}

/* Resend */
.otp-resend {
  text-align: center;
  font-size: var(--text-sm);
}

.otp-resend__link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-medium);
}

.otp-resend__link:hover {
  text-decoration: underline;
}

.otp-resend--disabled {
  color: var(--color-gray-400);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

/* Success checkmark animation */
@keyframes checkmark {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.otp-success-icon {
  animation: checkmark 0.5s var(--ease-bounce);
}
```

**User Generation from Email:**
```javascript
// Seeded random number generator
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  let state = Math.abs(hash) || 1;
  return function() {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// Hebrew names for user generation
const HEBREW_FIRST_NAMES = ['יוסי', 'דנה', 'אבי', 'מיכל', 'רון', 'נועה', 'גיא', 'שירה', 'עומר', 'תמר'];
const HEBREW_LAST_NAMES = ['כהן', 'לוי', 'מזרחי', 'פרץ', 'ביטון', 'אברהם', 'דוד', 'יוסף', 'שלום', 'חיים'];
const DEPARTMENTS = ['פיתוח', 'מוצר', 'שיווק', 'משאבי אנוש', 'כספים', 'תפעול'];

function generateUserFromEmail(email) {
  const random = seededRandom(email);
  const [localPart] = email.split('@');
  const [firstName, lastName] = localPart.split('.');
  
  // Generate Hebrew name from English name parts
  const hebrewFirstName = HEBREW_FIRST_NAMES[Math.floor(random() * HEBREW_FIRST_NAMES.length)];
  const hebrewLastName = HEBREW_LAST_NAMES[Math.floor(random() * HEBREW_LAST_NAMES.length)];
  
  // Generate points (100-3000 range)
  const points = Math.floor(random() * 2900) + 100;
  
  // Determine level based on points
  let level = 'מתחיל';
  if (points >= 5000) level = 'אגדה';
  else if (points >= 2000) level = 'אלוף';
  else if (points >= 750) level = 'מומחה';
  else if (points >= 250) level = 'פעיל';
  
  return {
    id: `usr-${Math.floor(random() * 10000).toString().padStart(4, '0')}`,
    email: email,
    firstName: hebrewFirstName,
    lastName: hebrewLastName,
    fullName: `${hebrewFirstName} ${hebrewLastName}`,
    department: DEPARTMENTS[Math.floor(random() * DEPARTMENTS.length)],
    points: points,
    level: level,
    joinDate: generateJoinDate(random),
    avatarInitial: hebrewFirstName[0]
  };
}

function generateJoinDate(random) {
  // Random date in past 2 years
  const now = Date.now();
  const twoYearsAgo = now - (2 * 365 * 24 * 60 * 60 * 1000);
  const randomDate = new Date(twoYearsAgo + random() * (now - twoYearsAgo));
  return randomDate.toISOString().split('T')[0];
}
```

**Input Handler Implementation:**
```javascript
_setupInputHandlers() {
  const inputs = this.$$('.otp-input');
  
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
      }
      
      this._updateUI();
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
          inputs[i].value = digit;
        });
        inputs[5].focus();
        this._updateUI();
      }
    });
  });
}

_focusFirstInput() {
  const firstInput = this.$('.otp-input[data-index="0"]');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}
```

**Verification Flow:**
```javascript
async _verifyOTP() {
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
    // Success
    await this._handleSuccess();
  } else {
    // Failure
    this._handleError();
  }
}

async _handleSuccess() {
  // Show success state briefly
  this._showSuccessAnimation();
  
  // Generate user from email
  const email = stateManager.getState('pendingEmail');
  const user = generateUserFromEmail(email);
  
  // Update state
  stateManager.setState({
    currentUser: user,
    isAuthenticated: true,
    sessionToken: `session_${Date.now()}`,
    pendingEmail: null,
    activeModal: null
  });
  
  // Brief delay to show success, then redirect
  await new Promise(resolve => setTimeout(resolve, 500));
  
  router.navigate('passport');
}

_handleError() {
  this._isVerifying = false;
  this._hasError = true;
  this._errorMessage = 'קוד שגוי, נסה שוב';
  
  // Clear inputs
  this._otpValues = ['', '', '', '', '', ''];
  
  this._updateUI();
  
  // Remove error state after animation
  setTimeout(() => {
    this._hasError = false;
    this._updateUI();
    this._focusFirstInput();
  }, 400);
}

_showSuccessAnimation() {
  const inputs = this.$$('.otp-input');
  inputs.forEach(input => {
    input.classList.add('otp-input--success');
  });
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #E10514 | Focus ring, verify button |
| `--color-primary-light` | #FFF5F5 | Icon background |
| `--color-success` | #22C55E | Success state |
| `--color-error` | #EF4444 | Error state, shake |
| `--color-gray-200` | #E5E7EB | Input border default |
| `--color-gray-400` | #9CA3AF | Disabled text, close icon |
| `--z-modal` | 300 | Modal z-index layer |
| `--ease-bounce` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Success animation |

### Event Delegation Actions

This component uses the following `data-action` values:
- `verify-otp` - Verify button click
- `resend-otp` - Resend link click
- `close-otp` - Close button click
- `close-otp-overlay` - Overlay click (closes modal)

### State Management

```javascript
// Read pending email
const email = stateManager.getState('pendingEmail');

// On successful verification
stateManager.setState({
  currentUser: generatedUser,
  isAuthenticated: true,
  sessionToken: `session_${Date.now()}`,
  pendingEmail: null,
  activeModal: null
});

// On close without verify
stateManager.setState({ activeModal: null });
// Note: pendingEmail is preserved for retry
```

### Modal Rendering Integration

The OTP modal should be rendered in `#modal-container` (not `#app`):

```javascript
// In App class or separate modal manager
stateManager.subscribe('activeModal', (modalName) => {
  const modalContainer = document.getElementById('modal-container');
  
  if (modalName === 'otp') {
    const otpModal = new OTPModalComponent();
    modalContainer.innerHTML = otpModal.render();
    otpModal.mount();
  } else {
    // Clear modal container
    modalContainer.innerHTML = '';
  }
});
```

### Focus Trap Implementation

```javascript
_setupKeyboardHandlers() {
  this._boundKeyHandler = this._handleKeydown.bind(this);
  document.addEventListener('keydown', this._boundKeyHandler);
}

_handleKeydown(e) {
  // ESC to close
  if (e.key === 'Escape') {
    this._closeModal();
    return;
  }
  
  // Tab focus trap
  if (e.key === 'Tab') {
    const focusableElements = this.$$('button, input:not([disabled])');
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

unmount() {
  super.unmount();
  document.removeEventListener('keydown', this._boundKeyHandler);
}
```

### Accessibility Notes

- Modal has `role="dialog"` and `aria-modal="true"`
- Title linked via `aria-labelledby`
- Each OTP input has `aria-label="ספרה X מתוך 6"`
- Error message container has `aria-live="polite"` and `role="alert"`
- Focus trapped within modal
- ESC key closes modal
- Close button has `aria-label="סגור"`

### Integration Points

**Dependencies:**
- `Component` base class (from Story 1.1)
- `StateManager` instance (from Story 1.1)
- `Router` class (from Story 1.1)
- `CONFIG.OTP_CODE` (from Story 1.1)
- `pendingEmail` state (set by Story 1.2 LoginComponent)

**Triggers:**
- Opened by: LoginComponent sets `activeModal: 'otp'` (Story 1.2)
- On success: Redirects to `#passport` route (Story 3.1+)
- On close: Returns to login form

### Project Structure Notes

- Component code goes in `script.js` section: "COMPONENTS - Authentication" (after LoginComponent)
- CSS goes in `style.css` section: "§10 Modals"
- Modal renders in `#modal-container` (not `#app`)
- Utility functions (seededRandom, generateUserFromEmail) go in "UTILITY FUNCTIONS" section

### References

- [Source: docs/architecture.md#3-core-architectural-decisions] - State management pattern
- [Source: docs/architecture.md#4-implementation-patterns] - Component structure pattern
- [Source: docs/architecture.md#3.7-mock-data-strategy] - Seeded random generation
- [Source: docs/PRD.md#6.1-authentication-flow] - FR-AUTH-002 requirements
- [Source: docs/epics.md#story-13] - Original story definition
- [Source: docs/project_context.md] - Quick reference rules

### Previous Story Learnings

From Story 1.1 (Project Setup):
- `StateManager` is initialized as global `stateManager`
- `Router` is initialized as global `router`
- `AnimationService` is initialized as global `animationService`
- App uses `app.registerComponent()` for component registration
- Action handlers registered via `app.registerAction()`

From Story 1.2 (Email Login Form):
- Login component sets `pendingEmail` in state before opening OTP modal
- Modal triggered by setting `activeModal: 'otp'`
- RTL layout considerations for input placement

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/project_context.md (complete)
- docs/PRD.md (complete)
- docs/epics.md (complete)
- docs/sprint-artifacts/1-1-project-setup-app-shell.md (previous story - completed)
- docs/sprint-artifacts/1-2-email-login-form.md (previous story - ready-for-dev)

### Agent Model Used

Claude Opus 4.5 (Amelia - Dev Agent)

### Debug Log References

- No errors encountered during implementation

### Completion Notes List

- **Task 1:** Created `OTPModalComponent` class extending `Component` with full template() method, modal structure, masked email display (_maskEmail), 6 OTP input boxes with LTR direction, verify button with loading state, resend link with countdown, and close button
- **Task 2:** Added complete OTP modal CSS (~180 lines): overlay with fadeIn animation, modal container with slideUp animation, input boxes (48x56px), focus/error/success states, shake animation, resend timer styles, checkmark success animation
- **Task 3:** Implemented _setupInputHandlers() with numeric-only filtering, auto-advance on digit entry, backspace navigation to previous input, paste handler for 6-digit codes, LTR direction maintained via CSS
- **Task 4:** Implemented verifyOTP() async method with 1.5-2s simulated delay, check against CONFIG.OTP_CODE ('000000'), _handleSuccess() for auth flow, _handleError() with shake animation + clear + refocus
- **Task 5:** Created global generateUserFromEmail(email) function with seededRandom(), Hebrew name arrays, generates: id (usr-XXXX), firstName/lastName (Hebrew), department, points (100-3000), level, joinDate, avatarInitial
- **Task 6:** Implemented _startResendCountdown() with 45s timer, _updateResendDisplay() for real-time countdown, handleResend() to restart countdown
- **Task 7:** Added _setupKeyboardHandlers() for ESC close, Tab focus trap implementation, _closeModal() preserves pendingEmail, close-otp-overlay action only closes when clicking overlay directly
- **Task 8:** Created ModalManager class with init(), activeModal subscription, action delegation for verify-otp/resend-otp/close-otp/close-otp-overlay, integrated in DOMContentLoaded

### File List

Files modified:
- `script.js` - Added OTPModalComponent class, seededRandom(), generateUserFromEmail(), ModalManager class (~350 lines added)
- `style.css` - Added OTP modal styles section (~180 lines added)

Dependencies from previous stories (unchanged):
- `index.html` - App shell with `#app` and `#modal-container`
- `script.js` - Component base class, StateManager, Router, App, CONFIG
- `style.css` - CSS variables, base styles, button styles

