# Story 3.4: Stamp Collection Display

**Status:** review

## Story

**As an** employee,
**I want** to see my earned stamps displayed in the passport,
**So that** I can visualize my achievements.

## Acceptance Criteria

### AC1: Stamps Grid Layout
**Given** I have earned stamps
**When** I view a passport page with stamps
**Then** stamps are displayed in a grid layout (2-3 columns)
**And** each stamp is slightly rotated for authentic look (±5 degrees)
**And** stamps have an ink-pressed visual effect (opacity: 0.85)

### AC2: Eight Unique Stamp Designs
**Given** the 8 stamp types exist
**When** I view different stamps
**Then** each type has a unique design:
  - "קו״ח הוגש" (Resume Submitted): Blue (#0984E3), circle shape, 📄 icon
  - "ראיון נקבע" (Interview Scheduled): Orange (#F39C12), rectangle, 📅 icon
  - "גיוס מוצלח!" (Candidate Hired): Green (#00B894), star burst, ✓ icon
  - "3 חודשים" (3-Month Milestone): Silver (#95A5A6), badge shape, 🏅 icon
  - "6 חודשים" (6-Month Milestone): Gold (#F1C40F), badge shape, 🏆 icon
  - "קמפיין מיוחד" (Special Campaign): Purple (#6C5CE7), diamond, ⚡ icon
  - "רצף הפניות" (Referral Streak): Red (#E10514), flame shape, 🔥 icon
  - "הפניה ראשונה" (First Referral): Pink (#FD79A8), heart shape, 💖 icon

### AC3: Stamp Content Elements
**Given** I view a stamp
**When** I look at its content
**Then** I see the stamp type icon
**And** I see the Hebrew title curved or positioned
**And** I see a points badge (+50, +100, etc.) in gold
**And** I see the date earned (e.g., "דצמבר 2025")

### AC4: New Stamp Animation
**Given** a stamp was recently earned
**When** the page loads with that stamp
**Then** the stamp plays a "slam" animation (stampSlam)
**And** the animation shows the stamp dropping in with bounce
**And** duration is 500ms with ease-bounce

### AC5: Empty Stamp Slots
**Given** I have empty stamp slots
**When** I view the passport page
**Then** I see faded/ghost placeholder stamps
**And** each shows what achievement is needed to earn it

### AC6: Stamp Hover/Focus State
**Given** I hover over or focus on a stamp
**When** the interaction occurs
**Then** the stamp scales up slightly (1.05)
**And** a subtle glow or highlight appears
**And** this indicates the stamp is tappable for details

### AC7: Stamps Sorted by Date
**Given** I have multiple stamps
**When** they are displayed on pages
**Then** stamps are sorted by date earned (newest first)
**And** grouped appropriately across page spreads

### AC8: Accessibility
**Given** I use a screen reader
**When** I navigate to a stamp
**Then** the stamp type and date are announced
**And** it's clear the stamp is interactive (button role)
**And** focus indicator is visible

## Tasks / Subtasks

- [x] Task 1: Define stamp types and data structure (AC: #2)
  - [x] Create STAMP_TYPES constant with all 8 stamp configurations
  - [x] Define shape, color, icon, and label for each type
  - [x] Add points values for each stamp type

- [x] Task 2: Create Stamp component render method (AC: #1, #2, #3)
  - [x] Create `_renderStamp(stamp)` method in PassportComponent
  - [x] Render stamp container with type-specific class
  - [x] Include icon, title, points badge, and date
  - [x] Apply random rotation (±5 degrees) using CSS variable

- [x] Task 3: Update stamps page render (AC: #1, #5, #7)
  - [x] Replace placeholder `_renderStampsPage()` with full implementation
  - [x] Sort stamps by date (newest first)
  - [x] Calculate empty slots and render placeholders
  - [x] Use 2-3 column grid based on viewport

- [x] Task 4: Create CSS for stamp shapes (AC: #2)
  - [x] Style `.stamp--submitted` (blue circle)
  - [x] Style `.stamp--interview` (orange rectangle)
  - [x] Style `.stamp--hired` (green star burst)
  - [x] Style `.stamp--milestone-3m` (silver badge)
  - [x] Style `.stamp--milestone-6m` (gold badge)
  - [x] Style `.stamp--campaign` (purple diamond)
  - [x] Style `.stamp--streak` (red flame)
  - [x] Style `.stamp--first` (pink heart)

- [x] Task 5: Style stamp content (AC: #3)
  - [x] Style stamp icon in center
  - [x] Style Hebrew title with curve/positioning
  - [x] Style points badge with gold background
  - [x] Style date at bottom of stamp
  - [x] Add ink-pressed effect (opacity, texture)

- [x] Task 6: Add stamp slam animation (AC: #4)
  - [x] Create `@keyframes stampSlam` animation
  - [x] Define bounce easing for drop effect
  - [x] Add `.stamp--new` class for animation trigger
  - [x] Implement `animateStampSlam()` in AnimationService

- [x] Task 7: Style empty stamp placeholders (AC: #5)
  - [x] Create `.stamp--placeholder` variant
  - [x] Show faded outline of stamp shape
  - [x] Display achievement text to earn stamp
  - [x] Low opacity (0.3) for ghost effect

- [x] Task 8: Add hover/focus interactions (AC: #6)
  - [x] Add hover scale transform (1.05)
  - [x] Add focus-visible outline
  - [x] Add subtle glow effect on hover
  - [x] Transition all properties smoothly

- [x] Task 9: Add accessibility attributes (AC: #8)
  - [x] Add `role="button"` to interactive stamps
  - [x] Add `aria-label` with stamp type and date
  - [x] Ensure keyboard focusability (tabindex)
  - [x] Add screen reader only text for context

- [x] Task 10: Register stamp tap action (AC: #6)
  - [x] Register `view-stamp-details` action
  - [x] Pass stamp ID to action handler
  - [x] Prepare state for Story 3.5 modal

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**Stamp Types Configuration:**

```javascript
// ============================================
// CONSTANTS - Stamp Types (add to CONSTANTS section)
// ============================================

const STAMP_TYPES = {
  submitted: {
    id: 'submitted',
    label: 'קו״ח הוגש',
    labelEn: 'Resume Submitted',
    icon: 'file-text',
    emoji: '📄',
    color: '#0984E3',
    shape: 'circle',
    points: 50
  },
  interview: {
    id: 'interview',
    label: 'ראיון נקבע',
    labelEn: 'Interview Scheduled',
    icon: 'calendar-event',
    emoji: '📅',
    color: '#F39C12',
    shape: 'rectangle',
    points: 100
  },
  hired: {
    id: 'hired',
    label: 'גיוס מוצלח!',
    labelEn: 'Candidate Hired',
    icon: 'check',
    emoji: '✓',
    color: '#00B894',
    shape: 'star',
    points: 500
  },
  milestone3m: {
    id: 'milestone3m',
    label: '3 חודשים',
    labelEn: '3-Month Milestone',
    icon: 'medal',
    emoji: '🏅',
    color: '#95A5A6',
    shape: 'badge',
    points: 200
  },
  milestone6m: {
    id: 'milestone6m',
    label: '6 חודשים',
    labelEn: '6-Month Milestone',
    icon: 'trophy',
    emoji: '🏆',
    color: '#F1C40F',
    shape: 'badge',
    points: 400
  },
  campaign: {
    id: 'campaign',
    label: 'קמפיין מיוחד',
    labelEn: 'Special Campaign',
    icon: 'bolt',
    emoji: '⚡',
    color: '#6C5CE7',
    shape: 'diamond',
    points: 75
  },
  streak: {
    id: 'streak',
    label: 'רצף הפניות',
    labelEn: 'Referral Streak',
    icon: 'flame',
    emoji: '🔥',
    color: '#E10514',
    shape: 'flame',
    points: 75
  },
  first: {
    id: 'first',
    label: 'הפניה ראשונה',
    labelEn: 'First Referral',
    icon: 'heart',
    emoji: '💖',
    color: '#FD79A8',
    shape: 'heart',
    points: 100
  }
};

// Stamps per page constant (from Story 3.3)
const STAMPS_PER_PAGE = 6;
```

**Stamp Data Model:**

```javascript
// ============================================
// MODELS - Stamp (add/update in MODELS section)
// ============================================

/**
 * Stamp model representing an earned achievement
 * @typedef {Object} Stamp
 * @property {string} id - Unique identifier (e.g., 'stmp-001')
 * @property {string} type - Stamp type key from STAMP_TYPES
 * @property {Date|string} earnedDate - Date the stamp was earned
 * @property {string} referralId - Related referral ID (if applicable)
 * @property {string} candidateName - Related candidate name (if applicable)
 * @property {boolean} isNew - Whether stamp was recently earned (for animation)
 */
class Stamp {
  constructor(data) {
    this.id = data.id || `stmp-${Date.now()}`;
    this.type = data.type;
    this.earnedDate = data.earnedDate || new Date();
    this.referralId = data.referralId || null;
    this.candidateName = data.candidateName || null;
    this.isNew = data.isNew || false;
  }
  
  /**
   * Gets the stamp type configuration
   * @returns {Object} Stamp type from STAMP_TYPES
   */
  getTypeConfig() {
    return STAMP_TYPES[this.type] || STAMP_TYPES.submitted;
  }
  
  /**
   * Gets the points value for this stamp
   * @returns {number}
   */
  getPoints() {
    return this.getTypeConfig().points;
  }
  
  /**
   * Formats the earned date in Hebrew
   * @returns {string}
   */
  getFormattedDate() {
    const months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const d = new Date(this.earnedDate);
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
}
```

**PassportComponent - Stamp Rendering:**

```javascript
// ============================================
// COMPONENTS - Passport (extend existing)
// ============================================

class PassportComponent extends Component {
  // ... existing code from Story 3.3 ...
  
  /**
   * Renders a single stamps page with actual stamp content
   * @param {number} pageIndex - Index within stamps array (0-based)
   * @param {Array} stamps - All user stamps sorted by date
   * @returns {string} HTML string
   */
  _renderStampsPage(pageIndex, stamps) {
    const startIdx = pageIndex * STAMPS_PER_PAGE;
    const pageStamps = stamps.slice(startIdx, startIdx + STAMPS_PER_PAGE);
    
    // Calculate empty slots for this page
    const emptySlots = STAMPS_PER_PAGE - pageStamps.length;
    const placeholderTypes = this._getPlaceholderTypes(stamps, emptySlots);
    
    return `
      <div class="stamps-page">
        <div class="stamps-grid">
          ${pageStamps.map(stamp => this._renderStamp(stamp)).join('')}
          ${placeholderTypes.map(type => this._renderStampPlaceholder(type)).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * Renders a single stamp with full design
   * @param {Stamp|Object} stamp - Stamp data
   * @returns {string} HTML string
   */
  _renderStamp(stamp) {
    const config = STAMP_TYPES[stamp.type] || STAMP_TYPES.submitted;
    const rotation = this._getStampRotation(stamp.id);
    const formattedDate = this._formatStampDate(stamp.earnedDate);
    const isNew = stamp.isNew;
    
    return `
      <button class="stamp stamp--${config.shape} stamp--${stamp.type} ${isNew ? 'stamp--new' : ''}"
              style="--stamp-rotation: ${rotation}deg; --stamp-color: ${config.color}"
              data-action="view-stamp-details"
              data-stamp-id="${stamp.id}"
              role="button"
              aria-label="${config.label}, ${formattedDate}, +${config.points} נקודות"
              tabindex="0">
        <div class="stamp__shape">
          <div class="stamp__inner">
            <span class="stamp__icon" aria-hidden="true">
              <i class="ti ti-${config.icon}"></i>
            </span>
            <span class="stamp__label">${config.label}</span>
            <span class="stamp__points">+${config.points}</span>
          </div>
        </div>
        <span class="stamp__date">${formattedDate}</span>
      </button>
    `;
  }
  
  /**
   * Renders a placeholder for unearned stamp
   * @param {string} stampType - Type key from STAMP_TYPES
   * @returns {string} HTML string
   */
  _renderStampPlaceholder(stampType) {
    const config = STAMP_TYPES[stampType];
    if (!config) return '';
    
    return `
      <div class="stamp stamp--placeholder stamp--${config.shape}"
           style="--stamp-color: ${config.color}"
           aria-hidden="true">
        <div class="stamp__shape">
          <div class="stamp__inner">
            <span class="stamp__icon">
              <i class="ti ti-${config.icon}"></i>
            </span>
            <span class="stamp__label">${config.label}</span>
          </div>
        </div>
        <span class="stamp__hint">הפנה כדי להרוויח</span>
      </div>
    `;
  }
  
  /**
   * Gets deterministic rotation for stamp based on ID
   * @param {string} stampId - Stamp ID
   * @returns {number} Rotation in degrees (-5 to +5)
   */
  _getStampRotation(stampId) {
    // Use stamp ID to generate consistent rotation
    const hash = stampId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return (Math.abs(hash) % 11) - 5; // -5 to +5 degrees
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
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  
  /**
   * Gets placeholder stamp types that user hasn't earned yet
   * @param {Array} stamps - User's earned stamps
   * @param {number} count - Number of placeholders needed
   * @returns {Array} Array of stamp type keys
   */
  _getPlaceholderTypes(stamps, count) {
    if (count <= 0) return [];
    
    const earnedTypes = new Set(stamps.map(s => s.type));
    const unearnedTypes = Object.keys(STAMP_TYPES).filter(type => !earnedTypes.has(type));
    
    // Return up to 'count' unearned types, or repeat if needed
    const placeholders = [];
    for (let i = 0; i < count && i < unearnedTypes.length; i++) {
      placeholders.push(unearnedTypes[i]);
    }
    return placeholders;
  }
  
  /**
   * Sorts stamps by earned date (newest first)
   * @param {Array} stamps - Unsorted stamps
   * @returns {Array} Sorted stamps
   */
  _sortStampsByDate(stamps) {
    return [...stamps].sort((a, b) => {
      const dateA = new Date(a.earnedDate);
      const dateB = new Date(b.earnedDate);
      return dateB - dateA; // Newest first
    });
  }
  
  /**
   * Updated render method to sort stamps
   */
  _renderAllPages(user, stamps) {
    const sortedStamps = this._sortStampsByDate(stamps);
    const pages = [];
    
    // Page spread 0: Profile (right) + First stamps (left)
    pages.push(`
      <div class="passport-spread passport-spread--active" data-spread="0">
        <div class="passport-page passport-page--stamps">
          ${this._renderStampsPage(0, sortedStamps)}
        </div>
        <div class="passport-page passport-page--profile">
          ${this._renderProfilePage(user)}
        </div>
      </div>
    `);
    
    // Additional stamp page spreads
    const totalStampPages = Math.ceil(sortedStamps.length / STAMPS_PER_PAGE);
    for (let i = 1; i < totalStampPages; i++) {
      const leftPageIdx = i * 2;
      const rightPageIdx = i * 2 - 1;
      
      pages.push(`
        <div class="passport-spread" data-spread="${i}">
          <div class="passport-page passport-page--stamps">
            ${this._renderStampsPage(leftPageIdx, sortedStamps)}
          </div>
          <div class="passport-page passport-page--stamps">
            ${this._renderStampsPage(rightPageIdx, sortedStamps)}
          </div>
        </div>
      `);
    }
    
    return pages.join('');
  }
  
  mount() {
    // ... existing mount code ...
    
    // Trigger stamp slam animations for new stamps
    this._animateNewStamps();
  }
  
  /**
   * Animates newly earned stamps
   */
  async _animateNewStamps() {
    const newStamps = this.element?.querySelectorAll('.stamp--new');
    if (!newStamps || newStamps.length === 0) return;
    
    for (const stampEl of newStamps) {
      await animationService.animateStampSlam(stampEl);
      
      // Mark as no longer new in state
      const stampId = stampEl.dataset.stampId;
      this._markStampAsViewed(stampId);
    }
  }
  
  /**
   * Marks stamp as viewed (removes isNew flag)
   * @param {string} stampId - Stamp ID
   */
  _markStampAsViewed(stampId) {
    const stamps = stateManager.getState('stamps') || [];
    const updatedStamps = stamps.map(s => 
      s.id === stampId ? { ...s, isNew: false } : s
    );
    stateManager.setState({ stamps: updatedStamps });
  }
}
```

**AnimationService - Stamp Slam:**

```javascript
// ============================================
// SERVICES - Animation (extend existing)
// ============================================

class AnimationService {
  // ... existing code from Story 3.2/3.3 ...
  
  /**
   * Animates stamp slam effect (drops in with bounce)
   * @param {HTMLElement} stampEl - The stamp element
   * @returns {Promise<void>}
   */
  async animateStampSlam(stampEl) {
    if (!stampEl) return;
    
    // Skip animation for reduced motion
    if (this.reducedMotion) {
      stampEl.classList.remove('stamp--new');
      stampEl.classList.add('stamp--visible');
      return;
    }
    
    // Ensure stamp has animation class
    if (!stampEl.classList.contains('stamp--new')) {
      stampEl.classList.add('stamp--new');
    }
    
    // Wait for animation to complete
    await this.waitForAnimation(stampEl, 'stampSlam');
    
    // Set final state
    stampEl.classList.remove('stamp--new');
    stampEl.classList.add('stamp--visible');
  }
}
```

**Action Handler:**

```javascript
// ============================================
// ACTION HANDLERS (add new action)
// ============================================

app.registerAction('view-stamp-details', (target) => {
  const stampId = target.dataset.stampId;
  if (!stampId) return;
  
  // Get stamp data
  const stamps = stateManager.getState('stamps') || [];
  const stamp = stamps.find(s => s.id === stampId);
  
  if (stamp) {
    // Store selected stamp in state for modal (Story 3.5)
    stateManager.setState({
      selectedStamp: stamp,
      activeModal: 'stamp-details'
    });
    
    console.log('View stamp details:', stamp);
    // Modal implementation in Story 3.5
  }
});
```

### CSS Styles (Add to style.css - Stamps section)

```css
/* =========================================================================
   STAMPS - Collection Display (Story 3.4)
   ========================================================================= */

/* Stamps Grid */
.stamps-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  padding: var(--space-2);
  width: 100%;
}

@media (min-width: 600px) {
  .stamps-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* =========================================================================
   STAMP BASE STYLES
   ========================================================================= */

.stamp {
  --stamp-rotation: 0deg;
  --stamp-color: #0984E3;
  
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transform: rotate(var(--stamp-rotation));
  transition: transform 0.2s ease, filter 0.2s ease;
  
  /* Remove default button styles */
  font-family: inherit;
  font-size: inherit;
}

.stamp:hover:not(.stamp--placeholder) {
  transform: rotate(var(--stamp-rotation)) scale(1.05);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  z-index: 10;
}

.stamp:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
}

/* Stamp Shape Container */
.stamp__shape {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  /* Ink-pressed effect */
  opacity: 0.85;
  filter: saturate(0.9);
}

/* Stamp Inner Content */
.stamp__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  height: 100%;
  padding: var(--space-2);
  border-radius: inherit;
  background: var(--stamp-color);
  color: white;
  text-align: center;
  
  /* Ink texture overlay */
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ink'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23ink)' opacity='0.1'/%3E%3C/svg%3E");
  background-blend-mode: overlay;
}

.stamp__icon {
  font-size: 1.5rem;
  line-height: 1;
}

.stamp__icon .ti {
  color: white;
}

.stamp__label {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stamp__points {
  position: absolute;
  bottom: -4px;
  right: -4px;
  padding: 2px 6px;
  background: linear-gradient(135deg, #F1C40F 0%, #F39C12 100%);
  color: #5D4E37;
  font-size: 0.625rem;
  font-weight: var(--font-bold);
  border-radius: var(--radius-full);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  direction: ltr;
  unicode-bidi: isolate;
}

.stamp__date {
  font-size: var(--text-xs);
  color: var(--passport-page-muted, #636E72);
  white-space: nowrap;
}

/* =========================================================================
   STAMP SHAPES
   ========================================================================= */

/* Circle Shape - Resume Submitted */
.stamp--circle .stamp__shape {
  border-radius: 50%;
}

.stamp--circle .stamp__inner {
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

/* Rectangle Shape - Interview Scheduled */
.stamp--rectangle .stamp__shape {
  border-radius: var(--radius-sm);
}

.stamp--rectangle .stamp__inner {
  border-radius: var(--radius-sm);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

/* Star Shape - Candidate Hired */
.stamp--star .stamp__shape {
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 
    50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
}

.stamp--star .stamp__inner {
  clip-path: polygon(
    50% 5%, 59% 36%, 95% 36%, 67% 56%, 77% 88%, 
    50% 68%, 23% 88%, 33% 56%, 5% 36%, 41% 36%
  );
}

/* Badge Shape - Milestones */
.stamp--badge .stamp__shape {
  clip-path: polygon(
    50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%
  );
}

.stamp--badge .stamp__inner {
  clip-path: polygon(
    50% 5%, 95% 27%, 95% 73%, 50% 95%, 5% 73%, 5% 27%
  );
}

/* Diamond Shape - Campaign */
.stamp--diamond .stamp__shape {
  transform: rotate(45deg);
}

.stamp--diamond .stamp__inner {
  transform: rotate(-45deg);
  border-radius: var(--radius-sm);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

/* Flame Shape - Streak */
.stamp--flame .stamp__shape {
  clip-path: path('M35 70 Q0 45 15 20 Q25 0 35 15 Q45 0 55 20 Q70 45 35 70');
  transform: scale(2);
}

.stamp--flame .stamp__inner {
  display: flex;
  padding-top: var(--space-4);
}

/* Heart Shape - First Referral */
.stamp--heart .stamp__shape {
  clip-path: path('M35 65 Q0 35 17.5 17.5 Q35 0 35 20 Q35 0 52.5 17.5 Q70 35 35 65');
  transform: scale(2);
}

.stamp--heart .stamp__inner {
  display: flex;
  padding-top: var(--space-3);
}

/* =========================================================================
   STAMP TYPE SPECIFIC COLORS
   ========================================================================= */

.stamp--submitted { --stamp-color: #0984E3; }
.stamp--interview { --stamp-color: #F39C12; }
.stamp--hired { --stamp-color: #00B894; }
.stamp--milestone3m { --stamp-color: #95A5A6; }
.stamp--milestone6m { --stamp-color: #F1C40F; }
.stamp--campaign { --stamp-color: #6C5CE7; }
.stamp--streak { --stamp-color: #E10514; }
.stamp--first { --stamp-color: #FD79A8; }

/* =========================================================================
   STAMP PLACEHOLDER
   ========================================================================= */

.stamp--placeholder {
  cursor: default;
  pointer-events: none;
}

.stamp--placeholder .stamp__shape {
  opacity: 0.2;
  filter: grayscale(1);
}

.stamp--placeholder .stamp__inner {
  background: transparent;
  border: 2px dashed var(--stamp-color);
  color: var(--stamp-color);
}

.stamp--placeholder .stamp__icon {
  opacity: 0.5;
}

.stamp--placeholder .stamp__icon .ti {
  color: var(--stamp-color);
}

.stamp--placeholder .stamp__label {
  color: var(--stamp-color);
  opacity: 0.7;
}

.stamp--placeholder .stamp__points {
  display: none;
}

.stamp__hint {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-style: italic;
  opacity: 0.6;
}

/* =========================================================================
   STAMP SLAM ANIMATION
   ========================================================================= */

@keyframes stampSlam {
  0% {
    transform: rotate(var(--stamp-rotation)) scale(2.5) translateY(-50px);
    opacity: 0;
  }
  40% {
    transform: rotate(var(--stamp-rotation)) scale(0.9) translateY(0);
    opacity: 1;
  }
  60% {
    transform: rotate(var(--stamp-rotation)) scale(1.1) translateY(0);
  }
  80% {
    transform: rotate(var(--stamp-rotation)) scale(0.95) translateY(0);
  }
  100% {
    transform: rotate(var(--stamp-rotation)) scale(1) translateY(0);
    opacity: 0.85;
  }
}

.stamp--new {
  animation: stampSlam 500ms var(--ease-bounce) forwards;
}

.stamp--visible {
  opacity: 0.85;
}

/* =========================================================================
   RESPONSIVE ADJUSTMENTS
   ========================================================================= */

@media (min-width: 600px) {
  .stamp__shape {
    width: 80px;
    height: 80px;
  }
  
  .stamp__icon {
    font-size: 1.75rem;
  }
  
  .stamp__label {
    font-size: 0.7rem;
  }
  
  .stamp__points {
    font-size: 0.7rem;
    padding: 3px 8px;
  }
}

@media (min-width: 1024px) {
  .stamp__shape {
    width: 90px;
    height: 90px;
  }
  
  .stamp__icon {
    font-size: 2rem;
  }
  
  .stamp__label {
    font-size: var(--text-xs);
  }
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .stamp {
    transition: none;
  }
  
  .stamp--new {
    animation: none;
    opacity: 0.85;
  }
  
  .stamp:hover:not(.stamp--placeholder) {
    transform: rotate(var(--stamp-rotation));
  }
}
```

### Design Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--stamp-color` | Per stamp type | Dynamic stamp color |
| `--stamp-rotation` | `-5deg` to `+5deg` | Authentic tilted look |
| `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Slam bounce |
| Animation duration | `500ms` | Stamp slam |
| Stamp opacity | `0.85` | Ink-pressed effect |
| Placeholder opacity | `0.2` | Ghost stamps |

### Stamp Types Visual Reference

| Type | Hebrew | Color | Shape | Icon | Points |
|------|--------|-------|-------|------|--------|
| `submitted` | קו״ח הוגש | #0984E3 Blue | Circle | 📄 file-text | 50 |
| `interview` | ראיון נקבע | #F39C12 Orange | Rectangle | 📅 calendar-event | 100 |
| `hired` | גיוס מוצלח! | #00B894 Green | Star | ✓ check | 500 |
| `milestone3m` | 3 חודשים | #95A5A6 Silver | Badge | 🏅 medal | 200 |
| `milestone6m` | 6 חודשים | #F1C40F Gold | Badge | 🏆 trophy | 400 |
| `campaign` | קמפיין מיוחד | #6C5CE7 Purple | Diamond | ⚡ bolt | 75 |
| `streak` | רצף הפניות | #E10514 Red | Flame | 🔥 flame | 75 |
| `first` | הפניה ראשונה | #FD79A8 Pink | Heart | 💖 heart | 100 |

### Mock Data Example

```javascript
// Example stamps for testing
const MOCK_STAMPS = [
  {
    id: 'stmp-001',
    type: 'first',
    earnedDate: '2024-01-15',
    referralId: 'ref-001',
    candidateName: 'דנה כהן',
    isNew: false
  },
  {
    id: 'stmp-002',
    type: 'submitted',
    earnedDate: '2024-02-20',
    referralId: 'ref-002',
    candidateName: 'יוסי לוי',
    isNew: false
  },
  {
    id: 'stmp-003',
    type: 'interview',
    earnedDate: '2024-03-10',
    referralId: 'ref-002',
    candidateName: 'יוסי לוי',
    isNew: false
  },
  {
    id: 'stmp-004',
    type: 'hired',
    earnedDate: '2024-04-05',
    referralId: 'ref-002',
    candidateName: 'יוסי לוי',
    isNew: true
  }
];
```

### Integration Points

**Dependencies from Story 3.3:**
- `_renderStampsPage()` method structure (to be replaced)
- `.stamps-grid` CSS class
- `.stamps-page` container
- `STAMPS_PER_PAGE` constant
- Page spread navigation system

**Extends:**
- PassportComponent with full stamp rendering
- AnimationService with `animateStampSlam()`
- STAMP_TYPES configuration constant

**Prepares for:**
- Story 3.5: Stamp Details Modal & Celebrations
  - `view-stamp-details` action registered
  - `selectedStamp` state key prepared
  - Modal trigger point established

**Files to Modify:**
- `script.js` - Add STAMP_TYPES, update PassportComponent, extend AnimationService, add action handler (~350 lines)
- `style.css` - Add stamp shapes, colors, animations (~300 lines)

### Testing Scenarios

1. **Stamps Grid Display:**
   - Open passport → See stamps in 2-3 column grid
   - Each stamp has unique shape and color
   - Stamps are slightly rotated (±5 degrees)
   - Ink-pressed opacity visible

2. **8 Stamp Types:**
   - Test all 8 stamp types render correctly
   - Circle, rectangle, star, badge, diamond, flame, heart shapes
   - Correct colors for each type
   - Correct icons display

3. **Stamp Content:**
   - Hebrew label visible
   - Points badge shows correct value
   - Date formatted in Hebrew
   - Icon centered in stamp

4. **Stamp Slam Animation:**
   - Set stamp `isNew: true`
   - Open passport → Stamp drops in with bounce
   - Animation is 500ms with bounce easing
   - After animation, stamp marked as viewed

5. **Empty Placeholders:**
   - User with fewer stamps sees ghost placeholders
   - Placeholders show unearned stamp types
   - Low opacity, dashed border
   - "הפנה כדי להרוויח" hint text

6. **Hover/Focus Interaction:**
   - Hover stamp → Scales to 1.05
   - Shadow/glow appears
   - Focus → Outline visible
   - Indicates tappable

7. **Sorting:**
   - Stamps sorted newest first
   - Across pages, order maintained

8. **Accessibility:**
   - Tab through stamps
   - Screen reader announces type + date
   - Focus indicator visible
   - Role="button" present

9. **Reduced Motion:**
   - Slam animation skipped
   - Hover scale disabled
   - Stamps appear instantly

10. **Responsive:**
    - Mobile: 2-column grid, 70px stamps
    - Tablet: 3-column grid, 80px stamps
    - Desktop: 3-column grid, 90px stamps

### Previous Story Patterns (From Story 3.3)

- `_renderStampsPage()` placeholder method (now replaced)
- `.stamps-grid` CSS layout
- Page spread system
- AnimationService async pattern
- Data attribute action pattern

### Project Context Quick Reference

**Naming Conventions:**
- CSS: BEM-kebab (`stamp--hired`, `stamp__icon`)
- JS: camelCase methods (`_renderStamp`, `_getStampRotation`)
- Data attributes: `data-action="view-stamp-details"`, `data-stamp-id`
- Constants: SCREAMING_SNAKE (`STAMP_TYPES`, `STAMPS_PER_PAGE`)

**State Management:**
- Stamps stored in `stateManager.getState('stamps')`
- New stamps marked with `isNew: true`
- Selected stamp stored for modal: `selectedStamp`

**Animation:**
- Use AnimationService for stamp slam
- Check reducedMotion preference
- CSS @keyframes for visual effect

### References

- [Source: docs/architecture.md#4.9-mock-data-patterns] - ID format (stmp-)
- [Source: docs/architecture.md#3.5-animation-architecture] - Animation patterns
- [Source: docs/epics.md#story-34] - Original acceptance criteria
- [Source: docs/epics.md#stamp-designs] - 8 stamp type specifications
- [Source: docs/project_context.md] - Implementation rules
- [Source: docs/sprint-artifacts/3-3-passport-pages-navigation.md] - Page structure patterns

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete)
- docs/epics.md (complete - Epic 3, Story 3.4)
- docs/project_context.md (complete)
- docs/sprint-artifacts/3-1-passport-cover-design.md
- docs/sprint-artifacts/3-2-passport-opening-animation.md
- docs/sprint-artifacts/3-3-passport-pages-navigation.md

### Agent Model Used

Claude Opus 4.5 (Dev Agent - Amelia)

### Debug Log References

No errors encountered during implementation.

### Completion Notes List

- STAMP_TYPES constant added with all 8 stamp configurations (submitted, interview, hired, milestone3m, milestone6m, campaign, streak, first)
- PassportComponent extended with: `_renderStamp()`, `_renderStampPlaceholder()`, `_getStampRotation()`, `_formatStampDate()`, `_getPlaceholderTypes()`, `_sortStampsByDate()`, `_animateNewStamps()`, `_markStampAsViewed()`
- AnimationService `animateStampSlam()` fully implemented with reduced motion support
- All 8 stamp shapes styled: circle, rectangle, star, badge, diamond, flame, heart
- Stamp slam @keyframes animation with bounce easing (500ms)
- Placeholder stamps with ghost effect (opacity 0.2, dashed border)
- Hover/focus interactions (scale 1.05, glow, focus-visible outline)
- Accessibility: role="button", aria-label, tabindex, keyboard navigation
- `view-stamp-details` action handler registered, stores selectedStamp in state
- Reduced motion support for all stamp animations

### File List

Files modified:
- `script.js` - Added STAMP_TYPES constant (~80 lines), updated PassportComponent with stamp rendering methods (~150 lines), extended AnimationService animateStampSlam(), registered view-stamp-details action handler
- `style.css` - Added stamp base styles, 8 shape variants, stamp type colors, slam animation, placeholder styles, responsive adjustments, reduced motion (~280 lines)

No new files created.

Depends on from Story 3.3:
- PassportComponent class with page navigation
- `_renderStampsPage()` placeholder method (replaced)
- `.stamps-grid` CSS class
- Page spread structure
- AnimationService base class

Prepares for:
- Story 3.5: Stamp Details Modal & Celebrations
  - `view-stamp-details` action handler ready
  - `selectedStamp` state management prepared
  - All stamp data accessible for modal display

