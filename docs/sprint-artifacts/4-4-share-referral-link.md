# Story 4.4: Share Referral Link

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to share a referral link with my contact,
**So that** they can apply directly with my referral attached.

## Acceptance Criteria

### AC1: Share Panel Display
**Given** I am referring for a specific position
**When** I initiate the share flow (from position card or detail modal)
**Then** I see a "שתף קישור הפניה" (Share Referral Link) panel/section
**And** the panel shows the position title
**And** the panel contains share options

### AC2: Unique Referral Link Generation
**Given** the share panel is displayed
**When** I view the generated link
**Then** I see a unique URL containing position ID and my employee ID
**And** the link format is readable (e.g., `?ref=usr-001&pos=pos-001`)
**And** the link is displayed in a copyable text field

### AC3: Copy to Clipboard
**Given** I want to copy the link
**When** I click "העתק" (Copy) button
**Then** the link is copied to clipboard
**And** I see a toast "הועתק!" (Copied!)
**And** the button shows a checkmark icon briefly (2 seconds)
**And** the button returns to normal state after

### AC4: WhatsApp Share
**Given** I want to share via WhatsApp
**When** I click the WhatsApp button
**Then** WhatsApp Web opens (or app on mobile)
**And** a pre-filled message contains:
  - Position title in Hebrew
  - Brief invitation text
  - My referral link
**And** the message uses the format: "היי! יש משרה מעולה ב-PassportCard: {title}. אשמח להמליץ עליך! {link}"

### AC5: Email Share
**Given** I want to share via email
**When** I click the email button
**Then** my default email client opens (mailto:)
**And** the subject is pre-filled with: "הזדמנות קריירה ב-PassportCard - {title}"
**And** the body contains:
  - Hebrew greeting
  - Position description
  - My referral link
  - Invitation to apply

### AC6: Share Tracking
**Given** I share the link successfully (any method)
**When** the share action completes
**Then** I can continue to upload resume or fill form
**And** the share counts as "link shared" for tracking

### AC7: Share Panel Close
**Given** the share panel is open
**When** I click the X close button or "המשך" (Continue) button
**Then** the share panel closes
**And** I can proceed to the referral form

### AC8: Mobile Native Share
**Given** I am on a mobile device with Web Share API support
**When** I click the main share button
**Then** the native OS share sheet appears
**And** I can share to any installed app (WhatsApp, Telegram, SMS, etc.)

### AC9: Link Preview Text
**Given** the link will be shared on social/messaging platforms
**When** the recipient sees the link
**Then** appropriate meta tags exist for basic preview (handled in HTML)

### AC10: Accessibility
**Given** I use keyboard or screen reader
**When** interacting with the share panel
**Then** all buttons have proper aria-labels in Hebrew
**And** focus is managed properly (trapped in panel when modal)
**And** copy success is announced to screen readers

## Tasks / Subtasks

- [x] Task 1: Create SharePanel component (AC: #1, #2, #7)
  - [x] Create SharePanel class extending Component
  - [x] Implement template() with panel structure
  - [x] Add position title display
  - [x] Add link display field (read-only input)
  - [x] Add close/continue buttons

- [x] Task 2: Implement link generation (AC: #2)
  - [x] Create generateReferralLink() utility function
  - [x] Include currentUser.id and position.id in URL
  - [x] Use clean URL format with query params
  - [x] Handle base URL detection

- [x] Task 3: Implement copy to clipboard (AC: #3)
  - [x] Add copy button with click handler
  - [x] Use navigator.clipboard.writeText API
  - [x] Show success state (checkmark icon)
  - [x] Show toast notification
  - [x] Reset button state after timeout

- [x] Task 4: Implement WhatsApp share (AC: #4)
  - [x] Add WhatsApp button with icon
  - [x] Create pre-filled message template
  - [x] Use WhatsApp Web/App intent URL
  - [x] Encode message properly (encodeURIComponent)

- [x] Task 5: Implement email share (AC: #5)
  - [x] Add email button with icon
  - [x] Create mailto: URL with subject and body
  - [x] Format body with line breaks
  - [x] Encode all URL components properly

- [x] Task 6: Implement native share (AC: #8)
  - [x] Detect Web Share API support
  - [x] Add main share button that triggers native share
  - [x] Fallback to showing share options if not supported
  - [x] Handle share promise (success/cancel)

- [x] Task 7: Wire to referral flow (AC: #6, #7)
  - [x] Update share-referral action in positions/modal
  - [x] Add referralLink to state for tracking
  - [x] Add continue handler to proceed to form
  - [x] Track share event in activity (optional)

- [x] Task 8: Add accessibility and polish (AC: #10)
  - [x] Add aria-labels to all buttons
  - [x] Implement focus management
  - [x] Add aria-live for copy success
  - [x] Test keyboard navigation

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story builds on the share-position action foundation from Story 4.3 and expands it into a dedicated SharePanel component for the referral submission flow.**

**SharePanel Component:**

```javascript
// ============================================
// COMPONENTS - Share Panel (Story 4.4)
// ============================================

class SharePanel extends Component {
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
      <div class="share-panel" id="share-panel" role="dialog" aria-labelledby="share-panel-title">
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
          <button class="btn btn--secondary"
                  data-action="close-share-panel">
            המשך להפניה
            <i class="ti ti-arrow-left" aria-hidden="true"></i>
          </button>
        </footer>
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
    if (!navigator.share) {
      return '';
    }
    
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
    return `היי! 👋\n\nיש משרה מעולה ב-PassportCard:\n${this.position.title}\n\nאשמח להמליץ עליך! 🌟\n\n${this.referralLink}`;
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
      showToast('הועתק!', 'success');
      
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
      showToast('שגיאה בהעתקה', 'error');
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
    
    stateManager.setState({
      sharePanel: null
    });
  }
  
  // Lifecycle methods
  mount() {
    this.bindEvents();
  }
  
  unmount() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
    super.unmount();
  }
}
```

**Action Handlers (add/update in action handlers section):**

```javascript
// ============================================
// ACTION HANDLERS - Share Panel (Story 4.4)
// ============================================

// Copy referral link to clipboard
app.registerAction('copy-referral-link', async () => {
  const sharePanel = stateManager.getState('sharePanelInstance');
  if (sharePanel) {
    await sharePanel.handleCopyLink();
  }
});

// Native share via Web Share API
app.registerAction('native-share-referral', async (target) => {
  const sharePanel = stateManager.getState('sharePanelInstance');
  if (sharePanel) {
    await sharePanel.handleNativeShare();
  }
});

// Close share panel
app.registerAction('close-share-panel', () => {
  const sharePanel = stateManager.getState('sharePanelInstance');
  if (sharePanel) {
    sharePanel.close();
  }
  
  // Optionally navigate to referral form
  const referringPosition = stateManager.getState('referringPosition');
  if (referringPosition) {
    router.navigate('refer', { positionId: referringPosition.id });
  }
});

// Open share panel for a position (update existing or add new)
app.registerAction('open-share-panel', (target) => {
  const positionId = target.dataset.positionId;
  if (!positionId) return;
  
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  if (!position) return;
  
  // Create and mount share panel
  const sharePanel = new SharePanel({ position });
  
  // Store instance for action handlers
  stateManager.setState({
    sharePanelInstance: sharePanel,
    sharePanel: position.id
  });
  
  // Render to appropriate container
  const container = document.getElementById('share-panel-container') || 
                    document.getElementById('modal-container');
  if (container) {
    container.innerHTML = sharePanel.template();
    sharePanel.element = container.firstElementChild;
    sharePanel.mount();
  }
});
```

**Utility Function (add to utilities section):**

```javascript
// ============================================
// UTILITY FUNCTIONS - Referral Link Generation
// ============================================

/**
 * Generates a unique referral link for a position
 * @param {string} positionId - Position ID (e.g., 'pos-001')
 * @param {string} [userId] - User ID, defaults to current user
 * @returns {string} Complete referral URL
 */
function generateReferralLink(positionId, userId = null) {
  const currentUser = stateManager.getState('currentUser');
  const uid = userId || currentUser?.id || 'unknown';
  
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?ref=${uid}&pos=${positionId}`;
}
```

**Integration with Position Card/Modal:**

The share panel can be triggered from:
1. Position card's share button (if added)
2. Position detail modal's share button (Story 4.3)
3. Referral flow entry point

**Update to share-position action (from Story 4.3):**

```javascript
// Enhanced share-position action - opens share panel instead of direct share
app.registerAction('share-position', (target) => {
  const positionId = target.dataset.positionId;
  if (!positionId) return;
  
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  if (!position) return;
  
  // Set referring position
  stateManager.setState({
    referringPosition: position
  });
  
  // Open share panel
  const openShareEvent = new CustomEvent('action', { 
    detail: { action: 'open-share-panel', target } 
  });
  // Or directly call the action
  app.executeAction('open-share-panel', target);
});
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   SHARE PANEL (Story 4.4)
   ========================================================================= */

.share-panel {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 400px;
  width: 100%;
  margin: var(--space-4);
}

/* Share Panel Header */
.share-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.share-panel__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.share-panel__title .ti {
  color: var(--color-primary);
}

.share-panel__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.share-panel__close:hover {
  background: var(--color-surface-hover);
  color: var(--text-primary);
}

.share-panel__close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Share Panel Content */
.share-panel__content {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.share-panel__position {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}

.share-panel__position strong {
  color: var(--text-primary);
}

/* Link Field */
.share-panel__link-field {
  display: flex;
  gap: var(--space-2);
  align-items: stretch;
}

.share-panel__link-input {
  flex: 1;
  padding: var(--space-3);
  font-size: var(--text-sm);
  font-family: monospace;
  direction: ltr;
  text-align: left;
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
}

.share-panel__link-input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.share-panel__copy-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  white-space: nowrap;
}

.share-panel__copy-btn:hover {
  background: var(--color-primary-hover);
}

.share-panel__copy-btn:active {
  transform: scale(0.98);
}

.share-panel__copy-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.share-panel__copy-btn--copied {
  background: var(--color-success);
}

.share-panel__copy-btn--copied:hover {
  background: var(--color-success);
}

.share-panel__copy-btn .ti {
  font-size: 1.125rem;
}

/* Share Buttons Row */
.share-panel__buttons {
  display: flex;
  gap: var(--space-3);
}

.share-panel__btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  text-decoration: none;
  transition: background 0.2s ease, transform 0.1s ease;
  min-height: 48px;
}

.share-panel__btn:active {
  transform: scale(0.98);
}

.share-panel__btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.share-panel__btn .ti {
  font-size: 1.25rem;
}

/* WhatsApp Button */
.share-panel__btn--whatsapp {
  background: #25D366;
  color: white;
}

.share-panel__btn--whatsapp:hover {
  background: #1DA851;
}

/* Email Button */
.share-panel__btn--email {
  background: var(--color-surface-secondary);
  color: var(--text-primary);
  border: 1px solid var(--color-border);
}

.share-panel__btn--email:hover {
  background: var(--color-surface-hover);
}

/* Native Share Section */
.share-panel__native {
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border);
}

/* Share Panel Footer */
.share-panel__footer {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
}

/* When used as modal overlay */
.share-panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.share-panel-overlay--visible {
  opacity: 1;
  visibility: visible;
}

/* =========================================================================
   VISUALLY HIDDEN (for screen readers)
   ========================================================================= */

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* =========================================================================
   RESPONSIVE - Share Panel
   ========================================================================= */

@media (max-width: 599px) {
  .share-panel {
    max-width: none;
    margin: 0;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  
  .share-panel__buttons {
    flex-direction: column;
  }
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .share-panel__copy-btn,
  .share-panel__btn,
  .share-panel-overlay {
    transition: none;
  }
}
```

### State Keys Used

| Key | Type | Description |
|-----|------|-------------|
| `sharePanelInstance` | SharePanel | Component instance for action handlers |
| `sharePanel` | String | Position ID when share panel is open, null otherwise |
| `referringPosition` | Object | Position being referred for (set before share) |
| `currentUser` | Object | User object with id for link generation |

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#22C55E` | Copied state button |
| `--color-primary` | `#E10514` | Copy button, icons |
| `#25D366` | WhatsApp green | WhatsApp button |
| `--radius-md` | `8px` | Button corners |
| `--radius-xl` | `24px` | Panel corners |
| Copy reset timeout | `2000ms` | Button state reset |
| Touch targets | `48px` minimum | Share buttons |

### Dependencies

**From Previous Stories:**
- StateManager with currentUser (Story 1.1, 1.3)
- MOCK_POSITIONS data structure (Story 4.1)
- Component base class (Story 1.1)
- Button styles (.btn, .btn--secondary, .btn--outline-primary) (Story 1.2)
- Toast notification showToast() function (Story 4.3)
- Router with navigate() (Story 1.1)

**From Story 4.3:**
- share-position action handler (will be updated)
- Position detail modal share functionality

**Creates Foundation For:**
- Story 4.5: Referral Form & Resume Upload (share panel leads to form)
- Story 4.6: Submission Confirmation (can include share again option)

### Integration Points

**Files to Modify:**
- `script.js`:
  - Add SharePanel class (~180 lines)
  - Add generateReferralLink() utility (~10 lines)
  - Add/update action handlers (~50 lines)
  - Update share-position action from Story 4.3
- `style.css`:
  - Add share panel styles (~200 lines)
  - Add .visually-hidden utility if not exists (~15 lines)
  - Add responsive and reduced motion styles (~30 lines)
- `index.html`:
  - Add `#share-panel-container` element if needed (optional, can use modal-container)

### URL Parameter Handling

The referral link uses query parameters for tracking:
- `ref`: User/referrer ID (e.g., `usr-001`)
- `pos`: Position ID (e.g., `pos-001`)

**Future Enhancement Note:** The app could parse these parameters on load to:
1. Pre-select the position in the positions list
2. Track the referrer for the hiring process
3. Show a "You were referred by..." message

This is not required for the demo but the URL structure supports it.

### Testing Scenarios

1. **Open Share Panel:**
   - Click share button on position card/modal → Panel opens
   - Panel shows position title
   - Link field shows generated URL

2. **Link Generation:**
   - Link includes ?ref=usr-XXX&pos=pos-XXX
   - Link uses current origin correctly
   - User ID comes from current user state

3. **Copy to Clipboard:**
   - Click copy button → Link copied
   - Button shows checkmark icon
   - Toast shows "הועתק!"
   - Button resets after 2 seconds
   - Screen reader announces copy success

4. **WhatsApp Share:**
   - Click WhatsApp button → Opens wa.me URL
   - Message includes position title
   - Message includes referral link
   - Message is properly URL encoded
   - Hebrew text displays correctly

5. **Email Share:**
   - Click email button → Opens mailto:
   - Subject includes position title
   - Body includes formatted message
   - Body includes referral link
   - Line breaks work correctly

6. **Native Share (Mobile):**
   - On supported device → Shows native share sheet
   - Cancelled share doesn't show error
   - Successful share completes normally

7. **Close Panel:**
   - Click X → Panel closes
   - Click "המשך להפניה" → Panel closes, navigates to form

8. **Accessibility:**
   - All buttons have aria-labels
   - Copy success announced via aria-live
   - Keyboard navigation works
   - Focus visible on all interactive elements

9. **Responsive:**
   - Desktop: Centered panel
   - Mobile: Bottom sheet style
   - Touch targets ≥ 48px

### Previous Story Intelligence

**From Story 4.3:**
- share-position action exists - should be updated to open share panel
- PositionDetailModal has share button in header
- showToast() function exists for notifications
- _escapeHtml() pattern for safe rendering

**Key patterns to maintain:**
- Use `data-action` attributes for button handlers
- Use StateManager for all state changes
- RTL-aware CSS with logical properties
- BEM naming convention
- Numbers/links use `direction: ltr`
- 44-48px minimum touch targets
- Hebrew text throughout UI

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- Share panel can render to `#modal-container` or dedicated container
- SharePanel is instantiated per-share (not singleton like modal)
- Uses event delegation via data-action for buttons

### References

- [Source: docs/architecture.md#3.5] - Animation/interaction architecture
- [Source: docs/architecture.md#4.2] - CSS naming patterns
- [Source: docs/architecture.md#4.3] - JavaScript naming patterns
- [Source: docs/epics.md#story-44] - Original acceptance criteria
- [Source: docs/PRD.md#FR-REF-001] - Share referral link requirements
- [Source: docs/project_context.md] - Implementation rules
- [Source: docs/sprint-artifacts/4-3-position-details-modal.md] - Previous story patterns, share-position action

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete - state management, component patterns)
- docs/epics.md (complete - Epic 4, Story 4.4 full acceptance criteria)
- docs/PRD.md (FR-REF-001 share requirements)
- docs/project_context.md (implementation rules, naming conventions)
- docs/sprint-artifacts/4-3-position-details-modal.md (share-position foundation)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode

### Debug Log References

- No issues encountered during implementation

### Completion Notes List

**Implementation completed by Claude Opus 4.5 (Dev Agent - Amelia) on 2025-12-10**

✅ **Task 1: SharePanel Component**
- Created SharePanel class extending Component base class (~300 lines)
- Implemented complete template with header, content, and footer sections
- Position title displays dynamically from position object
- Read-only link input field with LTR direction for URL display
- Close (X) button and "המשך להפניה" continue button

✅ **Task 2: Link Generation**
- Created `_generateReferralLink()` method in SharePanel
- Created standalone `generateReferralLink()` utility function
- Uses `?ref={userId}&pos={positionId}` format
- Automatically detects base URL from `window.location.origin`

✅ **Task 3: Copy to Clipboard**
- Uses `navigator.clipboard.writeText()` API
- Copy button transitions to success state (green, checkmark icon)
- Shows "הועתק!" toast notification
- Auto-resets after 2 seconds with `setTimeout`
- aria-live region announces copy success to screen readers

✅ **Task 4: WhatsApp Share**
- WhatsApp button with brand green (#25D366)
- Opens `wa.me/?text=` URL with pre-filled Hebrew message
- Message includes emoji, position title, and referral link
- Properly URL-encoded with `encodeURIComponent`

✅ **Task 5: Email Share**
- Email button with mailto: URL
- Subject: "הזדמנות קריירה ב-PassportCard - {title}"
- Body includes formatted Hebrew message with position details
- Line breaks preserved in email body

✅ **Task 6: Native Share**
- Detects Web Share API with `navigator.share` check
- Shows "שתף באפליקציה אחרת..." button only when supported
- Handles AbortError gracefully (user cancelled)
- Fallback to WhatsApp/Email buttons on desktop

✅ **Task 7: Referral Flow Integration**
- Updated `share-position-modal` action in ModalManager to open SharePanel
- Created `open-share-panel` action handler
- Created `continue-to-referral` action that closes panel and sets referral state
- `sharePanelInstance` and `sharePanel` state keys for tracking

✅ **Task 8: Accessibility**
- All buttons have descriptive Hebrew `aria-label` attributes
- `role="dialog"` and `aria-modal="true"` on panel
- `aria-live="polite"` region for copy status announcements
- Focus trapped to panel when open (auto-focuses first button)
- Visible focus indicators on all interactive elements
- Reduced motion support with `@media (prefers-reduced-motion: reduce)`

---

Ultimate context engine analysis completed - comprehensive developer guide created with:
- Full SharePanel component implementation
- Referral link generation with user/position tracking
- Copy to clipboard with visual feedback and accessibility
- WhatsApp share with Hebrew pre-filled message
- Email share with mailto: and formatted body
- Native Web Share API support with fallback
- Complete CSS styling (panel, buttons, responsive, reduced motion)
- State management integration
- Updated action handlers
- Accessibility features (aria-labels, aria-live, focus management)
- Integration with existing share-position action from Story 4.3

### File List

**Files Modified:**

- `script.js`:
  - Added SharePanel class (lines ~6598-6897, ~300 lines)
  - Added `openSharePanel()` helper function
  - Added `generateReferralLink()` utility function
  - Added action handlers: `open-share-panel`, `copy-referral-link`, `native-share-referral`, `close-share-panel`, `close-share-panel-overlay`, `continue-to-referral`
  - Updated `share-position-modal` action in ModalManager to open SharePanel
  - Total: ~370 lines added

- `style.css`:
  - Added `.share-panel-overlay` styles (overlay backdrop)
  - Added `.share-panel` container styles
  - Added `.share-panel__header`, `__title`, `__close` styles
  - Added `.share-panel__content`, `__position` styles
  - Added `.share-panel__link-field`, `__link-input`, `__copy-btn` styles
  - Added `.share-panel__buttons`, `__btn`, `__btn--whatsapp`, `__btn--email` styles
  - Added `.share-panel__native`, `__footer` styles
  - Added responsive styles for mobile (bottom sheet pattern)
  - Added reduced motion support
  - Total: ~280 lines added

- `docs/sprint-artifacts/sprint-status.yaml`:
  - Updated story status: ready-for-dev → in-progress → review

No new files created. Uses existing `#modal-container` for rendering.

Extends:
- Story 4.3: Position Details Modal (share-position action, showToast)

Creates foundation for:
- Story 4.5: Referral Form & Resume Upload (SharePanel leads to form via close action)
- Story 4.6: Submission Confirmation (could offer share again option)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-10 | Story implemented - SharePanel component, link generation, copy/WhatsApp/email/native share, accessibility | Claude Opus 4.5 (Dev Agent) |

