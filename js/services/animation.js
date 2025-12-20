/**
 * PassportCard Refer - Animation Service
 * Manages animations with reduced-motion support
 */

import { renderIcon } from '../core/utils.js';

/* ============================================================================
   ANIMATION SERVICE
   ============================================================================
   Manages animations with reduced-motion support
   ========================================================================== */

export class AnimationService {
  constructor() {
    this._reducedMotion = this._checkReducedMotion();
    this._gsapAvailable = this._checkGsapAvailable();
    this._setupMotionListener();
    this._stampTypes = null; // Will be set via setStampTypes
  }
  
  /**
   * Sets the stamp types reference (for themed celebrations)
   * @param {Object} stampTypes - STAMP_TYPES object
   */
  setStampTypes(stampTypes) {
    this._stampTypes = stampTypes;
  }
  
  /**
   * Checks if GSAP is available
   * @returns {boolean} True if GSAP is loaded
   */
  _checkGsapAvailable() {
    const available = typeof gsap !== 'undefined';
    if (!available) {
      console.warn('AnimationService: GSAP not loaded, falling back to CSS animations');
    }
    return available;
  }
  
  /**
   * Checks if user prefers reduced motion
   * @returns {boolean} True if reduced motion preferred
   */
  _checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Sets up listener for motion preference changes
   */
  _setupMotionListener() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this._reducedMotion = e.matches;
    });
  }
  
  /**
   * Gets current reduced motion preference
   * @returns {boolean} True if reduced motion preferred
   */
  get reducedMotion() {
    return this._reducedMotion;
  }
  
  /**
   * Initializes passport to its current state
   * Called when passport component renders to ensure proper visual state
   * @param {HTMLElement} passportEl - The passport container element
   */
  initializePassport(passportEl) {
    if (!passportEl) return;
    
    const coverEl = passportEl.querySelector('.passport-cover');
    const pagesEl = passportEl.querySelector('.passport-pages');
    const isOpen = passportEl.classList.contains('passport--open');
    
    // Clear any previous GSAP inline styles to let CSS control state
    if (this._gsapAvailable && coverEl) {
      gsap.set(coverEl, { clearProps: 'all' });
    }
    
    // Let CSS handle the visual state based on class
    if (pagesEl) {
      if (isOpen) {
        pagesEl.style.opacity = '1';
        pagesEl.style.pointerEvents = 'auto';
      } else {
        pagesEl.style.opacity = '0';
        pagesEl.style.pointerEvents = 'none';
      }
    }
  }
  
  /**
   * Animates passport opening with 3D flip effect using GSAP
   * @param {HTMLElement} passportEl - The passport container element
   * @returns {Promise<void>} Resolves when animation completes
   */
  async animatePassportOpen(passportEl) {
    if (!passportEl) return;
    
    const coverEl = passportEl.querySelector('.passport-cover');
    const pagesEl = passportEl.querySelector('.passport-pages');
    if (!coverEl) return;
    
    // Skip animation for reduced motion preference
    if (this._reducedMotion) {
      passportEl.classList.remove('passport--closed');
      passportEl.classList.add('passport--open');
      if (pagesEl) {
        pagesEl.style.opacity = '1';
        pagesEl.style.pointerEvents = 'auto';
      }
      if (this._gsapAvailable) {
        gsap.set(coverEl, { rotateY: -160 });
      } else {
        coverEl.style.transform = 'rotateY(-160deg)';
      }
      return;
    }
    
    // Update state classes
    passportEl.classList.remove('passport--closed');
    passportEl.classList.add('passport--opening');
    
    // Show pages immediately
    if (pagesEl) {
      if (this._gsapAvailable) {
        gsap.set(pagesEl, { opacity: 1, pointerEvents: 'auto' });
      } else {
        pagesEl.style.opacity = '1';
        pagesEl.style.pointerEvents = 'auto';
      }
    }
    
    // Use GSAP for reliable cross-browser animation
    if (this._gsapAvailable) {
      return new Promise((resolve) => {
        gsap.fromTo(coverEl, 
          { rotateY: 0 },
          { 
            rotateY: -160,
            duration: 0.8,
            ease: 'power2.inOut',
            force3D: true, // Better mobile performance
            onComplete: () => {
              // Clear GSAP inline styles so CSS class can take over
              gsap.set(coverEl, { clearProps: 'transform' });
              passportEl.classList.remove('passport--opening');
              passportEl.classList.add('passport--open');
              resolve();
            }
          }
        );
      });
    } else {
      // Fallback: use CSS transition
      coverEl.style.transition = 'transform 0.8s ease-in-out';
      coverEl.style.transform = 'rotateY(-160deg)';
      return new Promise((resolve) => {
        setTimeout(() => {
          passportEl.classList.remove('passport--opening');
          passportEl.classList.add('passport--open');
          resolve();
        }, 800);
      });
    }
  }
  
  /**
   * Animates passport closing with reverse 3D flip using GSAP
   * @param {HTMLElement} passportEl - The passport container element
   * @returns {Promise<void>} Resolves when animation completes
   */
  async animatePassportClose(passportEl) {
    if (!passportEl) return;
    
    const coverEl = passportEl.querySelector('.passport-cover');
    const pagesEl = passportEl.querySelector('.passport-pages');
    if (!coverEl) return;
    
    // Skip animation for reduced motion preference
    if (this._reducedMotion) {
      passportEl.classList.remove('passport--open');
      passportEl.classList.add('passport--closed');
      if (pagesEl) {
        pagesEl.style.opacity = '0';
        pagesEl.style.pointerEvents = 'none';
      }
      if (this._gsapAvailable) {
        gsap.set(coverEl, { rotateY: 0 });
      } else {
        coverEl.style.transform = 'rotateY(0deg)';
      }
      return;
    }
    
    // Update state classes
    passportEl.classList.remove('passport--open');
    passportEl.classList.add('passport--closing');
    
    // Use GSAP for reliable cross-browser animation
    if (this._gsapAvailable) {
      return new Promise((resolve) => {
        gsap.fromTo(coverEl, 
          { rotateY: -160 },
          { 
            rotateY: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            force3D: true, // Better mobile performance
            onComplete: () => {
              // Clear GSAP inline styles so CSS class can take over
              gsap.set(coverEl, { clearProps: 'transform' });
              passportEl.classList.remove('passport--closing');
              passportEl.classList.add('passport--closed');
              // Hide pages after animation completes
              if (pagesEl) {
                pagesEl.style.opacity = '0';
                pagesEl.style.pointerEvents = 'none';
              }
              resolve();
            }
          }
        );
      });
    } else {
      // Fallback: use CSS transition
      coverEl.style.transition = 'transform 0.8s ease-in-out';
      coverEl.style.transform = 'rotateY(0deg)';
      return new Promise((resolve) => {
        setTimeout(() => {
          passportEl.classList.remove('passport--closing');
          passportEl.classList.add('passport--closed');
          if (pagesEl) {
            pagesEl.style.opacity = '0';
            pagesEl.style.pointerEvents = 'none';
          }
          resolve();
        }, 800);
      });
    }
  }
  
  /**
   * Waits for a specific CSS animation to complete
   * @param {HTMLElement} el - Element being animated
   * @param {string} animationName - Specific animation name to wait for
   * @returns {Promise<void>}
   */
  waitForAnimationByName(el, animationName) {
    return new Promise(resolve => {
      const handleAnimationEnd = (e) => {
        // Only resolve for the specified animation
        if (animationName && e.animationName !== animationName) return;
        
        el.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };
      
      el.addEventListener('animationend', handleAnimationEnd);
      
      // Fallback timeout in case animation doesn't fire (800ms animation + 200ms buffer)
      setTimeout(() => {
        el.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      }, 1000);
    });
  }
  
  /**
   * Animates stamp slam effect (drops in with bounce)
   * @param {HTMLElement} stampEl - The stamp element
   * @returns {Promise<void>}
   */
  async animateStampSlam(stampEl) {
    if (!stampEl) return;
    
    // Announce to screen readers
    this.announceToScreenReader('חותמת חדשה נוספה לדרכון!');
    
    // Skip animation for reduced motion
    if (this._reducedMotion) {
      stampEl.classList.remove('stamp--new');
      stampEl.classList.add('stamp--visible');
      return;
    }
    
    // Ensure stamp has animation class
    if (!stampEl.classList.contains('stamp--new')) {
      stampEl.classList.add('stamp--new');
    }
    
    // Wait for animation to complete
    await this.waitForAnimationByName(stampEl, 'stampSlam');
    
    // Set final state
    stampEl.classList.remove('stamp--new');
    stampEl.classList.add('stamp--visible');
  }
  
  /**
   * Animates page flip to next page using GSAP
   * @param {HTMLElement} pagesEl - The passport-pages container
   * @returns {Promise<void>}
   */
  async animatePageFlipNext(pagesEl) {
    if (!pagesEl) return Promise.resolve();
    
    if (this._reducedMotion) {
      // Instant transition for reduced motion
      return Promise.resolve();
    }
    
    if (!this._gsapAvailable) {
      // Simple CSS fallback
      return Promise.resolve();
    }
    
    // Use GSAP for smooth page flip animation
    return new Promise((resolve) => {
      gsap.fromTo(pagesEl,
        { opacity: 1 },
        {
          opacity: 0.7,
          duration: 0.15,
          ease: 'power1.in',
          yoyo: true,
          repeat: 1,
          onComplete: resolve
        }
      );
    });
  }
  
  /**
   * Animates page flip to previous page using GSAP
   * @param {HTMLElement} pagesEl - The passport-pages container
   * @returns {Promise<void>}
   */
  async animatePageFlipPrev(pagesEl) {
    if (!pagesEl) return Promise.resolve();
    
    if (this._reducedMotion) {
      return Promise.resolve();
    }
    
    if (!this._gsapAvailable) {
      // Simple CSS fallback
      return Promise.resolve();
    }
    
    // Use GSAP for smooth page flip animation
    return new Promise((resolve) => {
      gsap.fromTo(pagesEl,
        { opacity: 1 },
        {
          opacity: 0.7,
          duration: 0.15,
          ease: 'power1.in',
          yoyo: true,
          repeat: 1,
          onComplete: resolve
        }
      );
    });
  }
  
  /**
   * Triggers confetti celebration
   * @param {Object} options - Confetti configuration
   * @returns {Promise} Resolves when animation completes
   */
  async celebrateWithConfetti(options = {}) {
    if (this._reducedMotion) {
      return Promise.resolve();
    }
    
    // Check if confetti library is loaded
    if (typeof confetti !== 'function') {
      console.warn('AnimationService: confetti library not loaded');
      return Promise.resolve();
    }
    
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    };
    
    try {
      await confetti({ ...defaults, ...options });
    } catch (error) {
      console.warn('AnimationService: confetti error', error);
    }
  }
  
  /**
   * Waits for CSS animation/transition to complete
   * @param {Element} element - Animated element
   * @returns {Promise} Resolves when animation ends
   */
  waitForAnimation(element) {
    return new Promise(resolve => {
      if (!element || this._reducedMotion) {
        resolve();
        return;
      }
      
      const handleEnd = () => {
        element.removeEventListener('animationend', handleEnd);
        element.removeEventListener('transitionend', handleEnd);
        resolve();
      };
      
      element.addEventListener('animationend', handleEnd, { once: true });
      element.addEventListener('transitionend', handleEnd, { once: true });
      
      // Fallback timeout (3s max)
      setTimeout(resolve, 3000);
    });
  }
  
  /**
   * Animates a number counter from 0 to target
   * @param {Element} element - Element to update with count
   * @param {number} target - Target number
   * @param {number} duration - Animation duration in ms (default 1000)
   */
  animateCounter(element, target, duration = 1000) {
    if (this._reducedMotion || !element) {
      // Show final value immediately
      element.textContent = target.toLocaleString('he-IL');
      return;
    }
    
    const start = performance.now();
    const startValue = 0;
    
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      const currentValue = Math.round(startValue + (target - startValue) * easedProgress);
      element.textContent = currentValue.toLocaleString('he-IL');
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // =========================================================================
  // CELEBRATION METHODS (Story 3.5)
  // =========================================================================

  /**
   * Checks if confetti library is available
   * @returns {boolean}
   */
  _hasConfetti() {
    return typeof confetti === 'function';
  }

  /**
   * Fires celebration confetti for hired stamp
   * Uses PassportCard brand colors
   */
  celebrateHiredStamp() {
    // Announce to screen readers
    this.announceToScreenReader('מזל טוב! גיוס מוצלח!');
    
    if (this._reducedMotion) {
      this._showStaticCelebration('מזל טוב! גיוס מוצלח!');
      return;
    }

    if (!this._hasConfetti()) {
      this._showFallbackCelebration('hired');
      return;
    }

    // Brand colors confetti
    const colors = ['#E10514', '#F1C40F', '#22C55E', '#0984E3'];

    // Main burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });

    // Side bursts for extra celebration
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
    }, 200);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      if (typeof confetti.reset === 'function') {
        confetti.reset();
      }
    }, 3000);
  }

  /**
   * Fires celebration for first referral stamp
   * Uses hearts and special pink particles
   */
  celebrateFirstReferral() {
    // Announce to screen readers
    this.announceToScreenReader('ברכות על ההפניה הראשונה!');
    
    if (this._reducedMotion) {
      this._showStaticCelebration('ברכות על ההפניה הראשונה!');
      return;
    }

    if (!this._hasConfetti()) {
      this._showFallbackCelebration('first');
      return;
    }

    // Pink/red heart celebration
    const heartColors = ['#FD79A8', '#E10514', '#FF6B81', '#F1C40F'];

    // Heart-shaped confetti burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: heartColors,
      shapes: ['circle', 'circle', 'square'],
      scalar: 1.2
    });

    // Show congratulatory message
    this._showCelebrationMessage('ברכות על ההפניה הראשונה!');

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      if (typeof confetti.reset === 'function') {
        confetti.reset();
      }
    }, 3000);
  }

  /**
   * Generic celebration for other achievements
   * @param {string} stampType - Type of stamp earned
   */
  celebrateAchievement(stampType) {
    // Announce to screen readers
    const config = this._stampTypes?.[stampType];
    const srMessage = config ? `${config.label}! הישג חדש נוסף!` : 'הישג חדש!';
    this.announceToScreenReader(srMessage);
    
    if (this._reducedMotion) {
      const message = config ? `${config.label}!` : 'הישג חדש!';
      this._showStaticCelebration(message);
      return;
    }

    if (!this._hasConfetti()) {
      this._showFallbackCelebration(stampType);
      return;
    }

    // Get stamp color for themed celebration
    const stampColor = config?.color || '#E10514';

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: [stampColor, '#F1C40F', '#ffffff']
    });

    setTimeout(() => {
      if (typeof confetti.reset === 'function') {
        confetti.reset();
      }
    }, 2500);
  }

  /**
   * Shows static celebration message (for reduced motion)
   * @param {string} message - Celebration message
   */
  _showStaticCelebration(message) {
    this._showToast(message, 'success', 3000);
  }

  /**
   * Shows fallback CSS-based celebration when confetti unavailable
   * @param {string} stampType - Type of stamp
   */
  _showFallbackCelebration(stampType) {
    const config = this._stampTypes?.[stampType] || {};
    const message = config.label ? `${config.label}!` : 'הישג חדש!';

    // Show special toast with animation
    this._showAnimatedToast(message, config.color || '#00B894');
  }

  /**
   * Shows celebration message overlay
   * @param {string} message - Message to display
   */
  _showCelebrationMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'celebration-message';
    messageEl.innerHTML = `<span class="celebration-message__text">${message}</span>`;
    messageEl.setAttribute('role', 'alert');
    messageEl.setAttribute('aria-live', 'polite');

    document.body.appendChild(messageEl);

    // Animate in
    requestAnimationFrame(() => {
      messageEl.classList.add('celebration-message--visible');
    });

    // Remove after animation
    setTimeout(() => {
      messageEl.classList.remove('celebration-message--visible');
      setTimeout(() => {
        messageEl.remove();
      }, 500);
    }, 2500);
  }

  /**
   * Shows toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, info, warning, error)
   * @param {number} duration - Duration in ms
   */
  _showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <i class="ti ti-${type === 'success' ? 'check' : type === 'error' ? 'x' : 'info-circle'} toast__icon"></i>
      <span class="toast__message">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('toast--visible');
    });

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  /**
   * Shows animated toast with custom color
   * @param {string} message - Toast message
   * @param {string} color - Accent color
   */
  _showAnimatedToast(message, color) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast toast--celebration';
    toast.style.setProperty('--celebration-color', color);
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast__message">${message}</span>
      <span class="toast__sparkle" aria-hidden="true">${renderIcon('sparkles')}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('toast--visible');
    });

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Dismisses any active celebration
   */
  dismissCelebration() {
    // Reset confetti if available
    if (this._hasConfetti() && typeof confetti.reset === 'function') {
      confetti.reset();
    }

    // Remove any celebration messages
    const messages = document.querySelectorAll('.celebration-message');
    messages.forEach(msg => msg.remove());
  }

  // =========================================================================
  // ACCESSIBILITY METHODS (Story 6.3)
  // =========================================================================

  /**
   * Announces message to screen readers using live region
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' (default) or 'assertive'
   */
  announceToScreenReader(message, priority = 'polite') {
    const announcer = document.getElementById('sr-announcer');
    if (!announcer) {
      console.warn('AnimationService: sr-announcer element not found');
      return;
    }

    // Set priority level
    announcer.setAttribute('aria-live', priority);
    
    // Clear previous announcement
    announcer.textContent = '';
    
    // Small delay to ensure screen reader picks up the change
    requestAnimationFrame(() => {
      announcer.textContent = message;
    });
  }

  /**
   * Announces page navigation to screen readers
   * @param {string} pageName - Name of the page navigated to
   */
  announcePageChange(pageName) {
    const pageNames = {
      'dashboard': 'דף הבית',
      'passport': 'הדרכון שלי',
      'positions': 'משרות פתוחות',
      'referrals': 'ההפניות שלי',
      'settings': 'הגדרות',
      'refer': 'טופס הפניה'
    };
    
    const hebrewName = pageNames[pageName] || pageName;
    this.announceToScreenReader(`עברת לעמוד ${hebrewName}`);
  }

  /**
   * Announces form validation error to screen readers
   * @param {string} fieldName - Name of the field with error
   * @param {string} errorMessage - Error message
   */
  announceValidationError(fieldName, errorMessage) {
    this.announceToScreenReader(`שגיאה בשדה ${fieldName}: ${errorMessage}`, 'assertive');
  }

  /**
   * Announces success message to screen readers
   * @param {string} message - Success message
   */
  announceSuccess(message) {
    this.announceToScreenReader(message, 'polite');
  }
}

// Global AnimationService singleton instance
export const animationService = new AnimationService();
