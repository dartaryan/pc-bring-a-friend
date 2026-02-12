# Story 5.2: Status Visualization Pipeline

**Status:** Ready for Review

## Story

**As an** employee,
**I want** to see a visual pipeline showing referral progress,
**So that** I can quickly understand how far along each referral is in the hiring process.

## Acceptance Criteria

### AC1: Pipeline Display on Referral Card
**Given** I view a referral card on the `#referrals` page
**When** I see the progress indicator
**Then** I see a horizontal milestone path with 5 stages:
  - הוגש (Submitted)
  - בדיקה (Review)
  - ראיון (Interview)
  - הצעה (Offer)
  - גיוס (Hired)

### AC2: Completed Stage Styling
**Given** the milestone path is displayed
**When** I view completed stages (before current)
**Then** completed stages show filled/solid circles with green color (#22C55E)
**And** a checkmark icon or visual indication is visible
**And** connecting lines to completed stages are filled (green)

### AC3: Current Stage Styling
**Given** a referral is at a specific stage
**When** I view the current stage
**Then** the current stage circle is highlighted with brand primary color (#E10514)
**And** a subtle pulsing animation indicates active status
**And** the current stage may have a larger size or ring effect

### AC4: Future Stage Styling
**Given** the pipeline displays future stages
**When** I view stages after the current one
**Then** future stages show empty/grayed circles
**And** connecting lines to future stages are dashed or light gray
**And** the styling clearly distinguishes pending vs completed

### AC5: Pipeline at "בראיון" (Interview) Stage
**Given** a referral is at "ראיון" stage
**When** I view its pipeline
**Then** "הוגש" and "בדיקה" circles are filled (green checkmarks)
**And** "ראיון" circle is highlighted (current, pulsing)
**And** "הצעה" and "גיוס" circles are empty/gray
**And** connecting lines reflect the progress appropriately

### AC6: Pipeline at "גויס" (Hired) Stage
**Given** a referral was successfully hired
**When** I view its pipeline
**Then** all 5 circles are filled green with checkmarks
**And** the entire connecting line is filled green
**And** a subtle celebration styling or glow may appear
**And** the success state is clearly communicated

### AC7: Pipeline for Rejected Referral
**Given** a referral was rejected (status "נדחה")
**When** I view its pipeline
**Then** the pipeline shows progress up to where rejection occurred
**And** an X mark or red indicator shows at the rejection point
**And** styling after rejection point is muted/gray
**And** the card maintains the rejected visual style

### AC8: Rejection at Different Stages
**Given** a referral could be rejected at various stages
**When** rejection occurs after review
**Then** "הוגש" shows green checkmark
**And** rejection point shows red X
**And** remaining stages are grayed out
**And** user understands where the process stopped

### AC9: Mobile Responsive Layout
**Given** I am on mobile (< 600px)
**When** I view the pipeline
**Then** the milestone path fits within the card width
**And** labels may be abbreviated or shown on tap
**And** the visualization is readable and touch-friendly

### AC10: Desktop Enhanced View
**Given** I am on desktop (≥ 1024px)
**When** I view the pipeline
**Then** stage labels are visible alongside circles
**And** more detailed progress information may be shown
**And** the pipeline has appropriate visual weight

### AC11: Pipeline in Referral Detail Modal (Preparation)
**Given** the pipeline component is reusable
**When** Story 5.3 implements the referral detail modal
**Then** a larger version of the pipeline can be rendered
**And** the component supports different size variants (mini, full)

### AC12: Accessibility - Screen Readers
**Given** I use a screen reader
**When** navigating the pipeline
**Then** the current progress is announced (e.g., "שלב 3 מתוך 5, ראיון")
**And** completed/pending stages are clearly identified
**And** aria-labels provide meaningful context

### AC13: Accessibility - Keyboard Navigation
**Given** I use keyboard navigation
**When** focus is on a referral card
**Then** I can understand the status without relying solely on color
**And** icon shapes (checkmark, dot, X) differentiate states

### AC14: Reduced Motion Support
**Given** I have `prefers-reduced-motion: reduce` enabled
**When** viewing the pipeline
**Then** the pulsing animation on current stage is disabled
**And** any transition animations are instant
**And** the visual states are still clearly distinguishable

### AC15: RTL Layout Compatibility
**Given** the app uses RTL layout
**When** I view the pipeline
**Then** the stages flow correctly for RTL (right-to-left reading)
**And** the first stage (הוגש) appears on the right
**And** progress moves from right to left

### AC16: Integration with Referral Card
**Given** the pipeline component exists
**When** it renders in a referral card (Story 5.1)
**Then** it replaces/enhances the mini-pipeline preview
**And** the card layout accommodates the pipeline size
**And** the styling is consistent with the card design

### AC17: Empty/Loading State Handling
**Given** referral data is loading or malformed
**When** the pipeline attempts to render
**Then** it gracefully handles missing status
**And** defaults to a valid initial state (submitted)
**And** no JavaScript errors occur

## Tasks / Subtasks

- [x] Task 1: Create StatusPipeline component class (AC: #11, #17)
  - [x] Create reusable component with size variants ('mini', 'full')
  - [x] Accept status prop to determine current stage
  - [x] Handle edge cases (invalid status, null data)
  - [x] Set up component structure following architecture patterns

- [x] Task 2: Implement stage rendering logic (AC: #1-6)
  - [x] Define PIPELINE_STAGES constant with stage configurations
  - [x] Create _renderStage() method for individual stages
  - [x] Calculate stage state (completed/current/pending)
  - [x] Render connecting lines between stages

- [x] Task 3: Implement completed stage styling (AC: #2)
  - [x] Add CSS for filled circles with checkmark icon
  - [x] Style completed connecting lines (green)
  - [x] Use Tabler Icons for checkmark (ti-check)
  - [x] Ensure proper color contrast

- [x] Task 4: Implement current stage styling (AC: #3)
  - [x] Add CSS for highlighted current stage
  - [x] Create pulsing animation (respects reduced-motion)
  - [x] Add ring effect or size increase
  - [x] Ensure visibility against background

- [x] Task 5: Implement future stage styling (AC: #4)
  - [x] Add CSS for empty/gray circles
  - [x] Style pending connecting lines (dashed or light)
  - [x] Ensure clear visual distinction from completed

- [x] Task 6: Implement rejection state handling (AC: #7-8)
  - [x] Detect rejected status
  - [x] Find rejection point in timeline
  - [x] Render X mark at rejection stage
  - [x] Apply muted styling after rejection

- [x] Task 7: Create CSS for all pipeline states (AC: #2-6)
  - [x] Define pipeline container styles
  - [x] Define stage circle styles (completed, current, pending, rejected)
  - [x] Define connecting line styles
  - [x] Add animation keyframes for pulsing

- [x] Task 8: Add responsive styles (AC: #9-10)
  - [x] Mobile: compact size, abbreviated labels
  - [x] Tablet: medium size
  - [x] Desktop: full labels visible
  - [x] Ensure touch targets meet 44px minimum

- [x] Task 9: Integrate with ReferralsComponent (AC: #16)
  - [x] Replace _renderMiniPipeline() with StatusPipeline component
  - [x] Update referral card layout for new pipeline
  - [x] Test with all referral statuses

- [x] Task 10: Add accessibility features (AC: #12-13)
  - [x] Add aria-label to pipeline container
  - [x] Add aria-current for current stage
  - [x] Add aria-hidden for decorative elements
  - [x] Ensure color-independent status identification

- [x] Task 11: Add reduced motion support (AC: #14)
  - [x] Disable pulse animation for prefers-reduced-motion
  - [x] Test with motion preferences enabled

- [x] Task 12: Verify RTL layout (AC: #15)
  - [x] Ensure stages flow right-to-left
  - [x] Test with RTL browser settings
  - [x] Verify CSS logical properties used

## Dev Notes

### Architecture Patterns (CRITICAL - Must Follow)

**This story creates a reusable StatusPipeline component that visualizes referral progress through the hiring pipeline. It enhances the mini-pipeline in Story 5.1 and prepares for the detailed view in Story 5.3.**

**Component Design Pattern:**

The StatusPipeline is designed as a stateless presentational component:
- Receives `status` and `size` as props
- Determines stage states internally based on status
- Renders appropriate visual representation
- Supports 'mini' (for cards) and 'full' (for modals) variants

**Pipeline Stages Constant:**

```javascript
// ============================================
// CONSTANTS - Pipeline Stages (Story 5.2)
// ============================================

const PIPELINE_STAGES = [
  { 
    key: 'submitted', 
    label: 'הוגש',
    labelShort: 'הוגש',
    icon: 'ti-send'
  },
  { 
    key: 'review', 
    label: 'בדיקה',
    labelShort: 'בדיקה',
    icon: 'ti-eye'
  },
  { 
    key: 'interview', 
    label: 'ראיון',
    labelShort: 'ראיון',
    icon: 'ti-phone'
  },
  { 
    key: 'offer', 
    label: 'הצעה',
    labelShort: 'הצעה',
    icon: 'ti-file-text'
  },
  { 
    key: 'hired', 
    label: 'גיוס',
    labelShort: 'גויס',
    icon: 'ti-confetti'
  }
];

// Stage index lookup for quick access
const STAGE_INDEX = PIPELINE_STAGES.reduce((acc, stage, index) => {
  acc[stage.key] = index;
  return acc;
}, {});
```

**StatusPipeline Component Implementation:**

```javascript
// ============================================
// COMPONENTS - Status Pipeline (Story 5.2)
// ============================================

/**
 * StatusPipeline - Reusable pipeline visualization component
 * 
 * @param {Object} props
 * @param {string} props.status - Current referral status
 * @param {string} props.size - 'mini' | 'full' (default: 'mini')
 * @param {boolean} props.isRejected - Whether the referral was rejected
 * @param {number} props.rejectionStage - Stage index where rejection occurred
 */
class StatusPipeline {
  constructor(props = {}) {
    this.status = props.status || 'submitted';
    this.size = props.size || 'mini';
    this.isRejected = props.isRejected || this.status === 'rejected';
    this.rejectionStage = props.rejectionStage;
  }
  
  /**
   * Main render method
   * @returns {string} HTML string
   */
  render() {
    const currentIndex = this._getCurrentStageIndex();
    const stages = PIPELINE_STAGES;
    const sizeClass = `status-pipeline--${this.size}`;
    
    // Calculate progress percentage for accessibility
    const progressPercent = Math.round(((currentIndex + 1) / stages.length) * 100);
    const progressText = this.isRejected 
      ? `נדחה בשלב ${currentIndex + 1} מתוך ${stages.length}` 
      : `שלב ${currentIndex + 1} מתוך ${stages.length}, ${stages[currentIndex].label}`;
    
    return `
      <div class="status-pipeline ${sizeClass} ${this.isRejected ? 'status-pipeline--rejected' : ''}"
           role="progressbar"
           aria-valuenow="${currentIndex + 1}"
           aria-valuemin="1"
           aria-valuemax="${stages.length}"
           aria-label="${progressText}"
           aria-valuetext="${progressText}">
        <div class="status-pipeline__track">
          ${stages.map((stage, index) => this._renderStage(stage, index, currentIndex)).join('')}
        </div>
        ${this.size === 'full' ? this._renderLabels(stages, currentIndex) : ''}
      </div>
    `;
  }
  
  /**
   * Gets the current stage index from status
   * @returns {number} Stage index
   */
  _getCurrentStageIndex() {
    // If rejected, find where in the pipeline it stopped
    if (this.isRejected && this.rejectionStage !== undefined) {
      return Math.min(this.rejectionStage, PIPELINE_STAGES.length - 1);
    }
    
    // Handle rejected status - default to review if no specific stage
    if (this.status === 'rejected') {
      return 1; // Default rejection after review
    }
    
    const index = STAGE_INDEX[this.status];
    return index !== undefined ? index : 0;
  }
  
  /**
   * Renders a single pipeline stage
   * @param {Object} stage - Stage configuration
   * @param {number} index - Stage index
   * @param {number} currentIndex - Current progress index
   * @returns {string} HTML string
   */
  _renderStage(stage, index, currentIndex) {
    const stateClass = this._getStageStateClass(index, currentIndex);
    const isFirst = index === 0;
    const isLast = index === PIPELINE_STAGES.length - 1;
    
    // Determine icon to display
    let iconHtml;
    if (this.isRejected && index === currentIndex) {
      iconHtml = '<i class="ti ti-x" aria-hidden="true"></i>';
    } else if (index < currentIndex || (index === currentIndex && this.status === 'hired')) {
      iconHtml = '<i class="ti ti-check" aria-hidden="true"></i>';
    } else if (this.size === 'full' && index === currentIndex && !this.isRejected) {
      iconHtml = `<i class="ti ${stage.icon}" aria-hidden="true"></i>`;
    } else {
      iconHtml = '';
    }
    
    return `
      ${!isFirst ? this._renderConnector(index, currentIndex) : ''}
      <div class="status-pipeline__stage ${stateClass}"
           ${index === currentIndex ? 'aria-current="step"' : ''}>
        <div class="status-pipeline__circle">
          ${iconHtml}
        </div>
      </div>
    `;
  }
  
  /**
   * Gets the CSS class for stage state
   * @param {number} index - Stage index
   * @param {number} currentIndex - Current progress index
   * @returns {string} CSS class
   */
  _getStageStateClass(index, currentIndex) {
    if (this.isRejected) {
      if (index < currentIndex) {
        return 'status-pipeline__stage--completed';
      } else if (index === currentIndex) {
        return 'status-pipeline__stage--rejected';
      }
      return 'status-pipeline__stage--pending';
    }
    
    if (index < currentIndex) {
      return 'status-pipeline__stage--completed';
    } else if (index === currentIndex) {
      return 'status-pipeline__stage--current';
    }
    return 'status-pipeline__stage--pending';
  }
  
  /**
   * Renders connector line between stages
   * @param {number} index - Stage index (after connector)
   * @param {number} currentIndex - Current progress index
   * @returns {string} HTML string
   */
  _renderConnector(index, currentIndex) {
    let connectorClass = 'status-pipeline__connector';
    
    if (this.isRejected) {
      if (index <= currentIndex) {
        connectorClass += ' status-pipeline__connector--completed';
      }
    } else {
      if (index <= currentIndex) {
        connectorClass += ' status-pipeline__connector--completed';
      }
    }
    
    return `<div class="${connectorClass}" aria-hidden="true"></div>`;
  }
  
  /**
   * Renders stage labels for full size variant
   * @param {Array} stages - Pipeline stages
   * @param {number} currentIndex - Current progress index
   * @returns {string} HTML string
   */
  _renderLabels(stages, currentIndex) {
    return `
      <div class="status-pipeline__labels" aria-hidden="true">
        ${stages.map((stage, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex || (this.status === 'hired' && index === currentIndex);
          const isRejectedStage = this.isRejected && index === currentIndex;
          
          let labelClass = 'status-pipeline__label';
          if (isActive) labelClass += ' status-pipeline__label--active';
          if (isCompleted) labelClass += ' status-pipeline__label--completed';
          if (isRejectedStage) labelClass += ' status-pipeline__label--rejected';
          
          return `<span class="${labelClass}">${stage.label}</span>`;
        }).join('')}
      </div>
    `;
  }
}

/**
 * Helper function to render pipeline in templates
 * @param {Object} referral - Referral object with status
 * @param {string} size - 'mini' | 'full'
 * @returns {string} HTML string
 */
function renderStatusPipeline(referral, size = 'mini') {
  const isRejected = referral.status === 'rejected';
  
  // Determine rejection stage from timeline if available
  let rejectionStage;
  if (isRejected && referral.timeline) {
    const rejectionEntry = referral.timeline.find(t => t.status === 'rejected');
    if (rejectionEntry) {
      // Find the last non-rejected stage
      const timeline = referral.timeline.filter(t => t.status !== 'rejected');
      const lastStage = timeline[timeline.length - 1];
      if (lastStage) {
        rejectionStage = STAGE_INDEX[lastStage.status] !== undefined 
          ? STAGE_INDEX[lastStage.status] + 1 
          : 1;
      }
    }
  }
  
  const pipeline = new StatusPipeline({
    status: isRejected ? (referral.timeline?.[referral.timeline.length - 2]?.status || 'review') : referral.status,
    size: size,
    isRejected: isRejected,
    rejectionStage: rejectionStage
  });
  
  return pipeline.render();
}
```

**Updated ReferralsComponent Integration:**

```javascript
// In ReferralsComponent, replace _renderMiniPipeline() usage:

/**
 * Renders a single referral card
 * Updated for Story 5.2 - StatusPipeline integration
 */
_renderReferralCard(referral) {
  const statusInfo = REFERRAL_STATUSES[referral.status] || REFERRAL_STATUSES.submitted;
  const initials = this._getInitials(referral.candidateName);
  const formattedDate = this._formatHebrewDate(referral.submittedAt);
  
  return `
    <article class="referral-card referral-card--${referral.status}"
             role="listitem"
             data-action="view-referral-details"
             data-referral-id="${referral.id}"
             tabindex="0"
             aria-label="הפניה של ${this._escapeHtml(referral.candidateName)} למשרת ${this._escapeHtml(referral.positionTitle)}">
      
      <div class="referral-card__avatar" 
           style="--avatar-color: ${statusInfo.color}"
           aria-hidden="true">
        ${initials}
      </div>
      
      <div class="referral-card__content">
        <h3 class="referral-card__candidate-name">
          ${this._escapeHtml(referral.candidateName)}
        </h3>
        <p class="referral-card__position">
          ${this._escapeHtml(referral.positionTitle)}
        </p>
        <p class="referral-card__date">
          <i class="ti ti-calendar" aria-hidden="true"></i>
          ${formattedDate}
        </p>
      </div>
      
      <div class="referral-card__status">
        ${this._renderStatusBadge(referral.status)}
        ${renderStatusPipeline(referral, 'mini')}
      </div>
      
      <i class="ti ti-chevron-left referral-card__chevron" aria-hidden="true"></i>
    </article>
  `;
}

// Remove the old _renderMiniPipeline() method - replaced by StatusPipeline component
```

### CSS Styles (Add to style.css)

```css
/* =========================================================================
   STATUS PIPELINE - Story 5.2
   Reusable pipeline visualization component for referral progress
   ========================================================================= */

.status-pipeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.status-pipeline__track {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

/* =========================================================================
   PIPELINE STAGE
   ========================================================================= */

.status-pipeline__stage {
  position: relative;
  z-index: 1;
}

.status-pipeline__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  transition: all 0.3s ease;
}

/* Completed stage */
.status-pipeline__stage--completed .status-pipeline__circle {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

/* Current stage */
.status-pipeline__stage--current .status-pipeline__circle {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 0 0 4px rgba(225, 5, 20, 0.2);
  animation: pipeline-pulse 2s ease-in-out infinite;
}

/* Pending stage */
.status-pipeline__stage--pending .status-pipeline__circle {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--text-muted);
}

/* Rejected stage */
.status-pipeline__stage--rejected .status-pipeline__circle {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: white;
}

/* =========================================================================
   CONNECTOR LINES
   ========================================================================= */

.status-pipeline__connector {
  flex: 1;
  height: 2px;
  background: var(--color-border);
  margin: 0 -1px;
  z-index: 0;
}

.status-pipeline__connector--completed {
  background: var(--color-success);
}

/* =========================================================================
   LABELS (Full size only)
   ========================================================================= */

.status-pipeline__labels {
  display: flex;
  justify-content: space-between;
}

.status-pipeline__label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-align: center;
  transition: color 0.2s ease;
}

.status-pipeline__label--active {
  color: var(--color-primary);
  font-weight: var(--font-semibold);
}

.status-pipeline__label--completed {
  color: var(--color-success);
}

.status-pipeline__label--rejected {
  color: var(--color-danger);
}

/* =========================================================================
   SIZE VARIANTS
   ========================================================================= */

/* Mini size (for cards) */
.status-pipeline--mini {
  width: 100%;
  max-width: 100px;
}

.status-pipeline--mini .status-pipeline__circle {
  width: 12px;
  height: 12px;
  border-width: 2px;
}

.status-pipeline--mini .status-pipeline__circle .ti {
  font-size: 0.5rem;
}

.status-pipeline--mini .status-pipeline__connector {
  height: 2px;
}

.status-pipeline--mini .status-pipeline__labels {
  display: none;
}

/* Full size (for modals/detailed views) */
.status-pipeline--full {
  width: 100%;
  padding: var(--space-4) 0;
}

.status-pipeline--full .status-pipeline__track {
  padding: 0 var(--space-2);
}

.status-pipeline--full .status-pipeline__circle {
  width: 36px;
  height: 36px;
  border-width: 3px;
}

.status-pipeline--full .status-pipeline__circle .ti {
  font-size: 1rem;
}

.status-pipeline--full .status-pipeline__connector {
  height: 3px;
}

.status-pipeline--full .status-pipeline__labels {
  padding: var(--space-2) var(--space-2) 0;
}

.status-pipeline--full .status-pipeline__label {
  font-size: var(--text-sm);
  min-width: 36px;
}

/* =========================================================================
   REJECTED STATE STYLING
   ========================================================================= */

.status-pipeline--rejected .status-pipeline__connector {
  background: var(--color-border);
}

.status-pipeline--rejected .status-pipeline__stage--completed + .status-pipeline__connector {
  background: var(--color-success);
}

/* =========================================================================
   ANIMATIONS
   ========================================================================= */

@keyframes pipeline-pulse {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(225, 5, 20, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(225, 5, 20, 0.1);
  }
}

/* =========================================================================
   RESPONSIVE - Tablet (600px+)
   ========================================================================= */

@media (min-width: 600px) {
  .status-pipeline--mini {
    max-width: 120px;
  }
  
  .status-pipeline--mini .status-pipeline__circle {
    width: 14px;
    height: 14px;
  }
  
  .status-pipeline--full .status-pipeline__circle {
    width: 40px;
    height: 40px;
  }
  
  .status-pipeline--full .status-pipeline__circle .ti {
    font-size: 1.125rem;
  }
}

/* =========================================================================
   RESPONSIVE - Desktop (1024px+)
   ========================================================================= */

@media (min-width: 1024px) {
  .status-pipeline--mini {
    max-width: 140px;
  }
  
  .status-pipeline--mini .status-pipeline__circle {
    width: 16px;
    height: 16px;
  }
  
  .status-pipeline--full .status-pipeline__circle {
    width: 48px;
    height: 48px;
  }
  
  .status-pipeline--full .status-pipeline__circle .ti {
    font-size: 1.25rem;
  }
  
  .status-pipeline--full .status-pipeline__label {
    min-width: 48px;
  }
}

/* =========================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .status-pipeline__stage--current .status-pipeline__circle {
    animation: none;
    box-shadow: 0 0 0 4px rgba(225, 5, 20, 0.2);
  }
  
  .status-pipeline__circle,
  .status-pipeline__label {
    transition: none;
  }
}

/* =========================================================================
   RTL ADJUSTMENTS
   ========================================================================= */

/* Pipeline flows right-to-left in RTL context */
[dir="rtl"] .status-pipeline__track {
  flex-direction: row;
}

/* Ensure connector margins work in RTL */
[dir="rtl"] .status-pipeline__connector {
  margin-inline: -1px;
}
```

### Project Structure Notes

- All code in three files: `index.html`, `style.css`, `script.js`
- StatusPipeline is a standalone presentational component
- Component can be instantiated with `new StatusPipeline(props)` or via helper `renderStatusPipeline()`
- CSS uses BEM naming convention consistent with codebase
- Full size variant prepared for Story 5.3 (Referral Detail Modal)

### References

- [Source: docs/architecture.md#3.4] - Component architecture patterns
- [Source: docs/architecture.md#4.2] - CSS naming conventions (BEM-kebab)
- [Source: docs/architecture.md#4.8] - Animation patterns
- [Source: docs/epics.md#story-52] - Original acceptance criteria
- [Source: docs/PRD.md#FR-TRACK-002] - Status visualization requirements
- [Source: docs/project_context.md] - Implementation rules, RTL support
- [Source: docs/sprint-artifacts/5-1-referral-list-with-filters.md] - ReferralsComponent integration point

### Dependencies

**From Previous Stories:**
- Component base class patterns (Story 1.1)
- REFERRAL_STATUSES constant (Story 5.1)
- ReferralsComponent with referral cards (Story 5.1)
- CSS variables for colors (--color-success, --color-primary, --color-danger)
- Tabler Icons CDN (ti-check, ti-x icons)

**Creates Foundation For:**
- Story 5.3: Referral Detail Modal (will use full-size pipeline)
- Future gamification visualizations

### Testing Scenarios

1. **Basic Pipeline States:**
   - Submitted status → First circle highlighted, rest pending
   - Review status → First complete, second highlighted
   - Interview status → First two complete, third highlighted
   - Offer status → First three complete, fourth highlighted
   - Hired status → All five complete with checkmarks

2. **Rejection Handling:**
   - Rejected after review → First complete, second has X, rest gray
   - Rejected after interview → First two complete, third has X
   - Rejected card maintains muted styling

3. **Size Variants:**
   - Mini variant renders compact (no labels)
   - Full variant shows labels below circles
   - Both sizes maintain proportional spacing

4. **Responsive Behavior:**
   - Mobile: Pipeline fits within card
   - Desktop: Pipeline has more visual weight
   - Labels scale appropriately

5. **Accessibility:**
   - Screen reader announces progress (e.g., "שלב 3 מתוך 5")
   - Icons differentiate states (checkmark vs X vs empty)
   - Color is not sole indicator of state

6. **RTL Layout:**
   - Stages flow right-to-left
   - First stage (הוגש) on right side
   - Progress moves leftward

7. **Reduced Motion:**
   - Pulse animation disabled
   - Transitions are instant
   - States remain visually distinct

8. **Integration:**
   - Pipeline renders correctly in referral cards
   - Replaces mini-pipeline from Story 5.1
   - No layout shifts or visual issues

## Dev Agent Record

### Context Reference

Project context loaded from:
- docs/architecture.md (complete - component patterns, CSS naming, animation patterns)
- docs/epics.md (complete - Epic 5, Story 5.2 full acceptance criteria)
- docs/PRD.md (FR-TRACK-002 requirements)
- docs/project_context.md (implementation rules, RTL support)
- docs/sprint-artifacts/5-1-referral-list-with-filters.md (ReferralsComponent to integrate with)

### Agent Model Used

Claude Opus 4.5 (Scrum Master - Bob) - YOLO Mode

### Debug Log References

No issues encountered during implementation.

### Completion Notes List

✅ **Implementation Complete (2025-12-11)**

1. **PIPELINE_STAGES Constant Added** - Added after REFERRAL_STATUS_CONFIG with 5 stages: submitted, review, interview, offer, hired. Each stage has key, label, labelShort, and icon properties.

2. **STAGE_INDEX Lookup Created** - Efficient O(1) lookup for stage indices from status keys.

3. **StatusPipeline Class Implemented** - Stateless presentational component with:
   - Constructor accepting status, size, isRejected, rejectionStage props
   - render() method returning full HTML with accessibility attributes
   - _getCurrentStageIndex() for determining position
   - _renderStage() for individual stage circles with icons
   - _getStageStateClass() for CSS class determination
   - _renderConnector() for lines between stages
   - _renderLabels() for full-size variant labels

4. **renderStatusPipeline() Helper** - Convenience function that handles referral object or plain status string, determines rejection stage from timeline if available.

5. **ReferralsComponent Integration** - Replaced _renderMiniPipeline() call with renderStatusPipeline(referral, 'mini') in _renderReferralCard() method.

6. **CSS Implementation** - All styles added including:
   - Container and track layout
   - Stage states (completed, current, pending, rejected)
   - Connector line states
   - Mini and full size variants
   - pipeline-pulse animation
   - Responsive breakpoints (600px, 1024px)
   - prefers-reduced-motion support
   - RTL layout adjustments

### File List

**Files Created:**
- None

**Files Modified:**
- `script.js`:
  - Lines 205-252: Added PIPELINE_STAGES constant and STAGE_INDEX lookup
  - Lines 7063-7253: Added StatusPipeline class and renderStatusPipeline() helper
  - Line 7485: Updated _renderReferralCard() to use renderStatusPipeline()
  - Lines 7511-7514: Removed old _renderMiniPipeline() method (replaced with comment)

- `style.css`:
  - Lines 6783-7040: Added complete StatusPipeline styles (~258 lines)
    - Pipeline container and track
    - Stage circle states (completed, current, pending, rejected)
    - Connector line styles
    - Labels for full-size variant
    - Size variants (mini, full)
    - pipeline-pulse animation keyframes
    - Responsive styles for tablet and desktop
    - Reduced motion support
    - RTL adjustments

**Files Unchanged:**
- `index.html` - No changes needed

