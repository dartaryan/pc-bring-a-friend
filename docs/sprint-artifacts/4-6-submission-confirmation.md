# Story 4.6: Submission Confirmation

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to see a clear confirmation after submitting a referral,
**So that** I know my referral was received and see my reward.

## Acceptance Criteria

### AC1: Success Screen Display
**Given** I submitted a valid referral (from Story 4.5)
**When** the submission completes and navigation happens
**Then** I see a success screen/page at route `#referral-confirmation`
**And** the page shows celebration-focused design

### AC2: Success Message
**Given** the success screen is displayed
**When** I view the content
**Then** I see "🎉 ההפניה נשלחה בהצלחה!" (Referral sent successfully!)
**And** I see the candidate name I referred
**And** I see the position title

### AC3: Stamp Animation
**Given** I earn a stamp for submitting
**When** the success screen loads
**Then** I see the "קו״ח הוגש" stamp with animation (stampSlam)
**And** the stamp displays prominently
**And** I see "+50 נקודות" near the stamp

### AC4: First Referral Bonus
**Given** this is my first ever referral (Story 4.5 sets this)
**When** the success screen shows
**Then** I ALSO see the "הפניה ראשונה" stamp with animation (+100 bonus)
**And** I see both stamps displayed
**And** extra celebration effect fires (enhanced confetti)
**And** I see total "+150 נקודות" prominently

### AC5: Points Animation
**Given** the success screen loads
**When** I view the points earned section
**Then** I see an animated counter showing points earned
**And** the counter animates from 0 to total points (50 or 150)
**And** the animation duration is ~1 second
**And** the display uses gold color styling

### AC6: Confetti Celebration
**Given** the success screen loads
**When** I'm not a first-time referrer
**Then** confetti celebration fires automatically
**And** confetti uses brand colors (#E10514, #F1C40F, #22C55E, #0984E3)
**And** the effect lasts ~3 seconds
**And** I can dismiss by tapping anywhere (optional early dismiss)

### AC7: Enhanced Celebration for First Referral
**Given** this is my first ever referral
**When** the celebration triggers
**Then** confetti fires with extra particles
**And** a special congratulatory message appears briefly
**And** hearts/special particles may be included

### AC8: Primary CTAs
**Given** I see the success screen
**When** I view the CTAs
**Then** I see "צפה בדרכון" (View Passport) button as primary
**And** I see "הפנה עוד" (Refer Another) button as secondary

### AC9: View Passport Navigation
**Given** I click "צפה בדרכון"
**When** the action triggers
**Then** I navigate to `#passport`
**And** my new stamp is highlighted/animated on the passport page

### AC10: Refer Another Navigation
**Given** I click "הפנה עוד"
**When** the action triggers
**Then** I navigate back to `#positions`
**And** I can start another referral

### AC11: State Update Verification
**Given** the referral was added to my data (in Story 4.5)
**When** I later view my referrals
**Then** the new referral appears with "הוגש" (Submitted) status
**And** my points total is updated
**And** my stamps collection includes the new stamp(s)

### AC12: Reduced Motion Support
**Given** I have `prefers-reduced-motion: reduce` enabled
**When** the success screen loads
**Then** stamp animations are instant appearance (no slam)
**And** confetti is replaced with static success message/badge
**And** points counter shows final value immediately

### AC13: Confetti Graceful Degradation
**Given** canvas-confetti library is not loaded or fails
**When** a celebration would trigger
**Then** the app gracefully degrades
**And** a CSS-based celebration or toast appears instead
**And** no console errors occur

### AC14: Accessibility
**Given** I use keyboard or screen reader
**When** the success screen loads
**Then** success message is announced via aria-live
**And** points earned is clearly communicated
**And** CTA buttons have proper aria-labels
**And** focus is placed on meaningful element (success heading or primary CTA)

### AC15: Share Success (Optional)
**Given** I see the success screen
**When** I want to share my success
**Then** I see an optional "share" action
**And** I can share that I made a referral (generic, no candidate data)

## Tasks / Subtasks

- [x] Task 1: Create ReferralConfirmationComponent (AC: #1, #2)
  - [x] Create ReferralConfirmationComponent class extending Component
  - [x] Implement template() with success screen structure
  - [x] Add route handler for 'referral-confirmation'
  - [x] Display success message with candidate and position info

- [x] Task 2: Render stamp display (AC: #3, #4)
  - [x] Create stamp display section in template
  - [x] Render earned stamps from state (earnedStamps)
  - [x] Apply stamp animation classes
  - [x] Handle single stamp vs multiple stamps layout

- [x] Task 3: Implement points animation (AC: #5)
  - [x] Create animated counter component/function
  - [x] Animate from 0 to pointsEarnedFromSubmission
  - [x] Use requestAnimationFrame for smooth counting
  - [x] Add gold styling to points display

- [x] Task 4: Implement confetti celebrations (AC: #6, #7, #13)
  - [x] Check if confetti library is loaded
  - [x] Fire standard confetti on mount
  - [x] Enhanced confetti for first referral
  - [x] Graceful fallback if confetti unavailable
  - [x] Brand colors for particles

- [x] Task 5: Add CTA buttons and navigation (AC: #8, #9, #10)
  - [x] Add "צפה בדרכון" primary button
  - [x] Add "הפנה עוד" secondary button
  - [x] Wire navigation actions
  - [x] Set highlightNewStamp state for passport page

- [x] Task 6: Add reduced motion support (AC: #12)
  - [x] Check prefers-reduced-motion
  - [x] Skip animations when enabled
  - [x] Show static content instead

- [x] Task 7: Add accessibility features (AC: #14)
  - [x] Add aria-live for announcements
  - [x] Set proper focus on load
  - [x] Add aria-labels to buttons
  - [x] Ensure screen reader compatibility

- [x] Task 8: Add CSS styles
  - [x] Style success screen container
  - [x] Style stamp display section
  - [x] Style points counter
  - [x] Style CTA buttons section
  - [x] Add responsive styles
  - [x] Add reduced motion styles
  - [x] Add celebration/success visual effects

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story creates the ReferralConfirmationComponent that displays after successful referral submission from Story 4.5.**

**Route:** `#referral-confirmation`

**State Keys Used (from Story 4.5 submission):**

| Key | Type | Description |
|-----|------|-------------|
| `lastSubmittedReferral` | Object | The referral just submitted |
| `pointsEarnedFromSubmission` | Number | 50 for normal, 150 for first referral |
| `earnedStamps` | Array | Stamps earned from this submission |
| `currentUser` | Object | User data with updated points |
| `stamps` | Array | All user stamps (including new ones) |
| `referrals` | Array | All user referrals (including new one) |

### ReferralConfirmationComponent Implementation

```javascript
// ============================================
// COMPONENTS - Referral Confirmation (Story 4.6)
// ============================================

class ReferralConfirmationComponent extends Component {
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
      // No submission data, redirect to dashboard
      return `
        <div class="confirmation-error">
          <p>אין נתוני הפניה להציג</p>
          <button class="btn btn--primary" data-action="navigate-dashboard">
            חזרה לדשבורד
          </button>
        </div>
      `;
    }
    
    return `
      <div class="confirmation" id="confirmation-screen" role="main">
        <div class="confirmation__content">
          ${this._renderSuccessHeader()}
          ${this._renderReferralInfo()}
          ${this._renderStampSection()}
          ${this._renderPointsSection()}
          ${this._renderCTAs()}
        </div>
      </div>
    `;
  }
  
  /**
   * Renders success header with celebration message
   * @returns {string} HTML string
   */
  _renderSuccessHeader() {
    const firstReferralMessage = this.isFirstReferral 
      ? '<p class="confirmation__first-badge">🌟 הפניה ראשונה - מעולה!</p>'
      : '';
    
    return `
      <header class="confirmation__header">
        <div class="confirmation__success-icon" aria-hidden="true">
          <span class="confirmation__checkmark">✓</span>
        </div>
        
        <h1 class="confirmation__title" id="confirmation-title" tabindex="-1">
          🎉 ההפניה נשלחה בהצלחה!
        </h1>
        
        ${firstReferralMessage}
        
        <div class="confirmation__announcement visually-hidden" aria-live="assertive">
          ההפניה נשלחה בהצלחה! ${this.isFirstReferral ? 'זו ההפניה הראשונה שלך!' : ''} 
          הרווחת ${this.pointsEarned} נקודות.
        </div>
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
    const animationClass = this.reducedMotion ? 'stamp--visible' : 'stamp--animate';
    
    return `
      <div class="confirmation__stamp ${animationClass}"
           style="--animation-delay: ${delay}ms; --stamp-color: ${stampConfig.color};"
           role="img"
           aria-label="${stamp.title}: +${stamp.points} נקודות">
        <div class="confirmation__stamp-inner">
          <span class="confirmation__stamp-icon" aria-hidden="true">
            ${stampConfig.icon}
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
            ? '🎉 כולל בונוס הפניה ראשונה!' 
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
          <i class="ti ti-passport" aria-hidden="true"></i>
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
      // Just show static content, announce to screen reader
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
        
        // Hearts/stars for first referral
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
    if (typeof showToast === 'function') {
      showToast(this.isFirstReferral ? '🌟 כל הכבוד על ההפניה הראשונה!' : '✨ ההפניה נשלחה!', 'success');
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
        stamp.classList.remove('stamp--animate');
        stamp.classList.add('stamp--slam');
        
        // After slam animation, set to visible
        setTimeout(() => {
          stamp.classList.remove('stamp--slam');
          stamp.classList.add('stamp--visible');
        }, 500);
      }, delay);
    });
  }
  
  /**
   * Announces success to screen readers
   */
  _announceSuccess() {
    const announcement = document.querySelector('.confirmation__announcement');
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
```

### STAMP_TYPES Configuration (add to constants if not exists)

```javascript
// ============================================
// CONSTANTS - Stamp Types
// ============================================

const STAMP_TYPES = {
  submitted: {
    type: 'submitted',
    title: 'קו״ח הוגש',
    icon: '📄',
    color: '#0984E3',
    shape: 'circle'
  },
  'first-referral': {
    type: 'first-referral',
    title: 'הפניה ראשונה',
    icon: '💖',
    color: '#FD79A8',
    shape: 'heart'
  },
  interview: {
    type: 'interview',
    title: 'ראיון נקבע',
    icon: '📅',
    color: '#F39C12',
    shape: 'rectangle'
  },
  hired: {
    type: 'hired',
    title: 'גיוס מוצלח!',
    icon: '✓',
    color: '#00B894',
    shape: 'star'
  },
  'milestone-3m': {
    type: 'milestone-3m',
    title: '3 חודשים',
    icon: '🏅',
    color: '#95A5A6',
    shape: 'badge'
  },
  'milestone-6m': {
    type: 'milestone-6m',
    title: '6 חודשים',
    icon: '🏆',
    color: '#F1C40F',
    shape: 'badge'
  },
  campaign: {
    type: 'campaign',
    title: 'קמפיין מיוחד',
    icon: '⚡',
    color: '#6C5CE7',
    shape: 'diamond'
  },
  streak: {
    type: 'streak',
    title: 'רצף הפניות',
    icon: '🔥',
    color: '#E10514',
    shape: 'flame'
  }
};
```

### Action Handlers (add to action handlers section)

```javascript
// ============================================
// ACTION HANDLERS - Referral Confirmation (Story 4.6)
// ============================================

// Navigate to passport from confirmation
app.registerAction('view-passport-from-confirmation', () => {
  // Set flag to highlight new stamps
  stateManager.setState({
    highlightNewStamps: true
  });
  
  router.navigate('passport');
});

// Refer another candidate
app.registerAction('refer-another', () => {
  // Clear referral-specific state
  stateManager.setState({
    referringPosition: null,
    lastSubmittedReferral: null,
    pointsEarnedFromSubmission: null,
    earnedStamps: null
  });
  
  router.navigate('positions');
});

// Share referral success
app.registerAction('share-referral-success', async () => {
  const currentUser = stateManager.getState('currentUser');
  const userName = currentUser?.firstName || 'מישהו';
  
  const shareText = `${userName} הפנה/ה מועמד/ת חדש/ה ל-PassportCard! 🎉\n\nגם אתם יכולים להרוויח נקודות על ידי הפניית חברים.`;
  
  // Try Web Share API first
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'הפניה מוצלחת!',
        text: shareText
      });
      return;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Share failed:', err);
      }
    }
  }
  
  // Fallback: copy generic message
  try {
    await navigator.clipboard.writeText(shareText);
    showToast('הועתק!', 'success');
  } catch (err) {
    console.error('Copy failed:', err);
    showToast('שגיאה בהעתקה', 'error');
  }
});

// Navigate to dashboard (error fallback)
app.registerAction('navigate-dashboard', () => {
  router.navigate('dashboard');
});
```

### Router Update (add referral-confirmation route)

```javascript
// ============================================
// ROUTER - Add referral-confirmation route
// ============================================

// In Router routes configuration:
{
  path: 'referral-confirmation',
  component: 'ReferralConfirmationComponent',
  requiresAuth: true
}

// Route handler:
case 'referral-confirmation':
  const confirmation = new ReferralConfirmationComponent();
  renderComponent(confirmation);
  break;
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   REFERRAL CONFIRMATION (Story 4.6)
   ========================================================================= */

.confirmation {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-surface) 0%, #FDF8F0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.confirmation__content {
  width: 100%;
  max-width: 480px;
  text-align: center;
}

/* -------------------------------------------------------------------------
   Success Header
   ------------------------------------------------------------------------- */

.confirmation__header {
  margin-bottom: var(--space-6);
}

.confirmation__success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-4);
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: successPop 0.5s var(--ease-bounce);
}

.confirmation__checkmark {
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
}

.confirmation__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
  line-height: 1.3;
}

.confirmation__first-badge {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  background: linear-gradient(135deg, rgba(253, 121, 168, 0.15) 0%, rgba(253, 121, 168, 0.05) 100%);
  border: 1px solid rgba(253, 121, 168, 0.3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: #DB2777;
  margin: 0;
}

@keyframes successPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* -------------------------------------------------------------------------
   Referral Info Card
   ------------------------------------------------------------------------- */

.confirmation__referral-info {
  margin-bottom: var(--space-5);
}

.confirmation__referral-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  text-align: right;
}

.confirmation__referral-avatar {
  width: 48px;
  height: 48px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.confirmation__referral-details {
  flex: 1;
  min-width: 0;
}

.confirmation__candidate-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-1);
}

.confirmation__position-title {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}

.confirmation__position-title .ti {
  font-size: 1rem;
  flex-shrink: 0;
}

/* -------------------------------------------------------------------------
   Stamps Section
   ------------------------------------------------------------------------- */

.confirmation__stamps {
  margin-bottom: var(--space-5);
}

.confirmation__section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 var(--space-3);
}

.confirmation__stamps-grid {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.confirmation__stamp {
  width: 100px;
  height: 100px;
  position: relative;
}

.confirmation__stamp--animate {
  opacity: 0;
  transform: scale(0) rotate(-15deg);
}

.confirmation__stamp--slam {
  animation: stampSlam 0.5s var(--ease-bounce) forwards;
  animation-delay: var(--animation-delay, 0ms);
}

.confirmation__stamp--visible {
  opacity: 1;
  transform: scale(1) rotate(var(--stamp-rotation, -3deg));
}

.confirmation__stamp-inner {
  width: 100%;
  height: 100%;
  background: var(--stamp-color, #0984E3);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transform: rotate(var(--stamp-rotation, -3deg));
  opacity: 0.9;
}

.confirmation__stamp-icon {
  font-size: 1.75rem;
  line-height: 1;
  margin-bottom: var(--space-1);
}

.confirmation__stamp-title {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: white;
  text-align: center;
  line-height: 1.1;
}

.confirmation__stamp-points {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: rgba(255, 255, 255, 0.9);
  direction: ltr;
  unicode-bidi: isolate;
}

@keyframes stampSlam {
  0% {
    opacity: 0;
    transform: scale(2.5) rotate(15deg);
  }
  40% {
    opacity: 1;
    transform: scale(0.85) rotate(-5deg);
  }
  60% {
    transform: scale(1.1) rotate(2deg);
  }
  80% {
    transform: scale(0.95) rotate(-2deg);
  }
  100% {
    opacity: 0.9;
    transform: scale(1) rotate(var(--stamp-rotation, -3deg));
  }
}

/* -------------------------------------------------------------------------
   Points Section
   ------------------------------------------------------------------------- */

.confirmation__points {
  margin-bottom: var(--space-6);
  padding: var(--space-5);
  background: linear-gradient(135deg, rgba(241, 196, 15, 0.12) 0%, rgba(241, 196, 15, 0.03) 100%);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(241, 196, 15, 0.25);
}

.confirmation__points-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.confirmation__points-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.confirmation__points-value {
  font-size: 3rem;
  font-weight: var(--font-bold);
  color: var(--color-gold);
  direction: ltr;
  unicode-bidi: isolate;
  text-shadow: 0 2px 4px rgba(241, 196, 15, 0.3);
  line-height: 1;
}

.confirmation__points-message {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: var(--space-3) 0 0;
}

/* -------------------------------------------------------------------------
   CTA Buttons
   ------------------------------------------------------------------------- */

.confirmation__ctas {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.confirmation__cta-primary,
.confirmation__cta-secondary {
  width: 100%;
}

.confirmation__cta-primary {
  background: var(--color-primary);
}

.confirmation__share-btn {
  margin-top: var(--space-2);
}

/* -------------------------------------------------------------------------
   Error State
   ------------------------------------------------------------------------- */

.confirmation-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: var(--space-4);
}

.confirmation-error p {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

/* -------------------------------------------------------------------------
   Fallback Celebration (when confetti unavailable)
   ------------------------------------------------------------------------- */

.confirmation--fallback-celebration {
  position: relative;
  overflow: hidden;
}

.confirmation--fallback-celebration::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(circle, rgba(225, 5, 20, 0.05) 0%, transparent 60%),
    radial-gradient(circle at 20% 80%, rgba(241, 196, 15, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.05) 0%, transparent 50%);
  animation: celebrationGlow 3s ease-out forwards;
  pointer-events: none;
}

@keyframes celebrationGlow {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}

/* -------------------------------------------------------------------------
   Responsive - Desktop
   ------------------------------------------------------------------------- */

@media (min-width: 1024px) {
  .confirmation__title {
    font-size: var(--text-3xl);
  }
  
  .confirmation__stamps-grid {
    gap: var(--space-6);
  }
  
  .confirmation__stamp {
    width: 120px;
    height: 120px;
  }
  
  .confirmation__stamp-icon {
    font-size: 2rem;
  }
  
  .confirmation__stamp-title {
    font-size: var(--text-sm);
  }
  
  .confirmation__points-value {
    font-size: 4rem;
  }
  
  .confirmation__ctas {
    flex-direction: row;
    justify-content: center;
    gap: var(--space-4);
  }
  
  .confirmation__cta-primary,
  .confirmation__cta-secondary {
    width: auto;
    min-width: 200px;
  }
  
  .confirmation__share-btn {
    position: absolute;
    bottom: var(--space-6);
  }
}

/* -------------------------------------------------------------------------
   Reduced Motion
   ------------------------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .confirmation__success-icon {
    animation: none;
  }
  
  .confirmation__stamp--slam,
  .confirmation__stamp--animate {
    animation: none;
  }
  
  .confirmation__stamp {
    opacity: 1;
    transform: scale(1) rotate(var(--stamp-rotation, -3deg));
  }
  
  .confirmation--fallback-celebration::before {
    animation: none;
    opacity: 0.5;
  }
}

/* -------------------------------------------------------------------------
   Visually Hidden (accessibility)
   ------------------------------------------------------------------------- */

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
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gold` | `#F1C40F` | Points display, highlights |
| `--color-success` | `#22C55E` | Success icon background |
| `--color-primary` | `#E10514` | Primary CTA, brand color |
| `#FD79A8` | Pink | First referral badge |
| `#DB2777` | Dark pink | First referral badge text |
| `--radius-xl` | `24px` | Points container corners |
| `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Stamp slam animation |
| Stamp size | `100px` mobile, `120px` desktop | Stamp display |
| Points counter duration | `1000ms` | Counter animation |
| Confetti duration | `~3 seconds` | Celebration effect |

### Dependencies

**From Previous Stories:**
- StateManager with all required keys (Story 1.1)
- Component base class (Story 1.1)
- Router with navigate() (Story 1.1)
- AnimationService reducedMotion check pattern (Story 1.1, 3.2)
- Button styles (.btn, .btn--primary, .btn--secondary, .btn--lg, .btn--text) (Story 1.2)
- showToast() function (Story 4.3)
- canvas-confetti library (loaded in index.html from Story 1.1)

**From Story 4.5:**
- Submission sets: `lastSubmittedReferral`, `pointsEarnedFromSubmission`, `earnedStamps`
- Submission navigates to: `router.navigate('referral-confirmation')`
- First referral detection: checks if referrals array was empty before submission

**Creates Foundation For:**
- Passport page can read `highlightNewStamps` state to animate new stamps (Epic 3)
- User can share success and refer more candidates

### Integration Points

**Files to Modify:**
- `script.js`:
  - Add STAMP_TYPES constant if not exists (~50 lines)
  - Add ReferralConfirmationComponent class (~300 lines)
  - Add action handlers: view-passport-from-confirmation, refer-another, share-referral-success, navigate-dashboard (~50 lines)
  - Add route handler for 'referral-confirmation' (~10 lines)
  - Total: ~410 lines JS
- `style.css`:
  - Add confirmation container styles (~30 lines)
  - Add success header styles (~50 lines)
  - Add referral info card styles (~40 lines)
  - Add stamps section styles (~80 lines)
  - Add points section styles (~40 lines)
  - Add CTA styles (~30 lines)
  - Add fallback celebration styles (~30 lines)
  - Add responsive and reduced motion (~50 lines)
  - Add visually-hidden if not exists (~15 lines)
  - Total: ~365 lines CSS

**No new files created.**

### State Flow

```
[Story 4.5: Referral Form & Resume Upload]
    ↓ (successful submission)
    ↓ Updates:
    ↓   - referrals: [...referrals, newReferral]
    ↓   - stamps: [...stamps, submissionStamp, ?firstReferralStamp]
    ↓   - currentUser.points += earnedPoints
    ↓   - lastSubmittedReferral = newReferral
    ↓   - pointsEarnedFromSubmission = 50 or 150
    ↓   - earnedStamps = [stamps earned]
    ↓
    ↓ Navigates: router.navigate('referral-confirmation')
    ↓
[Story 4.6: Submission Confirmation] ← YOU ARE HERE
    ↓ Reads state, displays celebration
    ↓ User clicks CTA
    ↓
    ├─→ "צפה בדרכון" → Sets highlightNewStamps = true → #passport
    │
    └─→ "הפנה עוד" → Clears referral state → #positions
```

### Testing Scenarios

1. **Success Screen Display:**
   - Complete referral submission in 4.5 → Navigate to confirmation
   - Screen shows success message with candidate name
   - Position title displayed correctly

2. **Stamp Display - Single:**
   - Normal submission (not first) → Shows "קו״ח הוגש" stamp only
   - Stamp has animation (slam effect)
   - Shows +50 points on stamp

3. **Stamp Display - First Referral:**
   - First ever submission → Shows both stamps
   - "קו״ח הוגש" (+50) and "הפניה ראשונה" (+100)
   - Enhanced celebration effect

4. **Points Animation:**
   - Counter animates from 0 to total (50 or 150)
   - Animation smooth over ~1 second
   - Gold color styling visible

5. **Confetti Celebration:**
   - On load → Confetti fires automatically
   - Brand colors used (#E10514, #F1C40F, #22C55E, #0984E3)
   - Lasts ~3 seconds

6. **First Referral Enhanced Celebration:**
   - First referral → Extra confetti bursts
   - Side bursts from edges
   - Special particles (stars)

7. **CTA - View Passport:**
   - Click "צפה בדרכון" → Navigates to #passport
   - highlightNewStamps state set
   - New stamp highlighted on passport page

8. **CTA - Refer Another:**
   - Click "הפנה עוד" → Navigates to #positions
   - Referral state cleared
   - Ready for new submission

9. **Reduced Motion:**
   - With prefers-reduced-motion → No animations
   - Stamps appear instantly
   - Points show final value immediately
   - No confetti (fallback celebration instead)

10. **Confetti Fallback:**
    - If confetti library fails → CSS celebration shown
    - Toast notification appears
    - No console errors

11. **Accessibility:**
    - Success announced via aria-live
    - Focus set to title on load
    - Buttons have aria-labels
    - Screen reader can navigate content

12. **Error State:**
    - Direct navigation to confirmation without submission → Error shown
    - CTA to return to dashboard

13. **Share Success:**
    - Click share → Web Share API (mobile) or clipboard copy
    - Generic message (no candidate data)
    - Toast shows "הועתק!" on copy

### Previous Story Intelligence

**From Story 4.5:**
- Submission creates new referral with: id, positionId, positionTitle, candidateName, status, timeline, pointsEarned
- Creates submission stamp with: type: 'submitted', title: 'קו״ח הוגש', points: 50
- For first referral, also creates: type: 'first-referral', title: 'הפניה ראשונה', points: 100
- State keys set: lastSubmittedReferral, pointsEarnedFromSubmission, earnedStamps
- Navigates to 'referral-confirmation' route

**From Story 3.4/3.5:**
- Stamp animation patterns (stampSlam)
- Confetti celebration patterns with brand colors
- Stamp visual design (circular with icon, title, points)
- Reduced motion handling

**Key patterns to maintain:**
- Use `data-action` attributes for button handlers
- Use StateManager for all state changes
- RTL-aware CSS with logical properties (margin-inline-start, etc.)
- Numbers/points use `direction: ltr; unicode-bidi: isolate;`
- BEM naming convention for CSS
- 44px minimum touch targets
- Hebrew text throughout UI
- Check prefers-reduced-motion for animations
- Graceful degradation if confetti unavailable

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- ReferralConfirmationComponent is instantiated per route visit
- Component cleans up submission state on unmount
- Confetti library already loaded in index.html from Story 1.1

### References

- [Source: docs/architecture.md#3.5] - Animation architecture
- [Source: docs/architecture.md#4.2] - CSS naming patterns
- [Source: docs/architecture.md#4.3] - JavaScript naming patterns
- [Source: docs/epics.md#story-46] - Original acceptance criteria
- [Source: docs/PRD.md#FR-REF-004] - Submission confirmation requirements
- [Source: docs/PRD.md#FR-PASS-005] - Celebration effects requirements
- [Source: docs/project_context.md] - Implementation rules
- [Source: docs/sprint-artifacts/4-5-referral-form-resume-upload.md] - Previous story, state keys set
- [Source: docs/sprint-artifacts/3-4-stamp-collection-display.md] - Stamp animation patterns (if available)

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete - state management, component patterns, animation approach)
- docs/epics.md (complete - Epic 4, Story 4.6 full acceptance criteria)
- docs/PRD.md (FR-REF-004 confirmation requirements, FR-PASS-005 celebrations)
- docs/project_context.md (implementation rules, naming conventions)
- docs/sprint-artifacts/4-5-referral-form-resume-upload.md (state keys, submission flow)
- docs/sprint-artifacts/4-4-share-referral-link.md (share patterns)
- docs/sprint-artifacts/4-3-position-details-modal.md (component patterns, _escapeHtml)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode

### Debug Log References

- No issues encountered during implementation

### Completion Notes List

**Implementation Summary (2025-12-10):**

✅ **Task 1: ReferralConfirmationComponent** - Created component class with template() method rendering success screen with candidate/position info. Added route 'referral-confirmation' to CONFIG.ROUTES. Updated Story 4.5 to navigate to confirmation instead of dashboard.

✅ **Task 2: Stamp Display** - Implemented `_renderStampSection()` and `_renderStamp()` methods. Stamps render from `earnedStamps` state array. Supports single stamp (normal referral) and multiple stamps (first referral bonus). Animation delay stagger applied.

✅ **Task 3: Points Animation** - Created `_animatePointsCounter()` using requestAnimationFrame with ease-out cubic easing. Animates from 0 to target over 1 second. Gold color styling via CSS custom property.

✅ **Task 4: Confetti Celebrations** - `_fireConfetti()` checks for confetti library availability. Standard celebration: 100 particles with brand colors. First referral: 150 particles + side bursts + star shapes. `_showFallbackCelebration()` adds CSS glow effect + toast when confetti unavailable.

✅ **Task 5: CTAs and Navigation** - Added "צפה בדרכון" (primary), "הפנה עוד" (secondary), "שתף" (text) buttons. Action handlers: `view-passport-from-confirmation` sets `highlightNewStamps` state, `refer-another` clears referral state, `share-referral-success` uses Web Share API with clipboard fallback.

✅ **Task 6: Reduced Motion** - Component checks `prefers-reduced-motion` on construct. Animations skipped when enabled. Points show final value immediately. Stamps appear without slam animation. CSS @media query disables keyframe animations.

✅ **Task 7: Accessibility** - aria-live region announces success message. Focus set to title on mount (`tabindex="-1"`). All buttons have aria-labels. role="img" with aria-label on stamps. visually-hidden class for screen reader announcements.

✅ **Task 8: CSS Styles** - ~365 lines added. Success icon with pop animation. Referral info card with avatar. Stamp grid with slam keyframes. Gold points section. Responsive desktop layout (flex-row CTAs, larger stamps). Reduced motion media query.

### File List

**Modified:**
- `script.js`:
  - Added route 'referral-confirmation' to CONFIG.ROUTES (line 25)
  - Updated ReferralFormComponent.handleSubmit() to navigate to confirmation (line 6062)
  - Added ReferralConfirmationComponent class (~350 lines, after ReferralFormComponent)
  - Added action handlers (lines 8479-8537): view-passport-from-confirmation, refer-another, share-referral-success, navigate-dashboard

- `style.css`:
  - Added REFERRAL CONFIRMATION section (~400 lines at end of file)
  - Includes: .confirmation, .confirmation__header, .confirmation__referral-card, .confirmation__stamps, .confirmation__points, .confirmation__ctas, reduced motion, fallback celebration, visually-hidden

### Change Log

- 2025-12-10: Implemented Story 4.6 - Submission Confirmation Screen (all 8 tasks complete)

