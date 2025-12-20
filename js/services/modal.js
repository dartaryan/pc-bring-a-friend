/**
 * PassportCard Refer - Modal Manager
 * Handles modal rendering and lifecycle
 */

/* ============================================================================
   MODAL MANAGER
   ============================================================================
   Handles modal rendering and lifecycle
   ========================================================================== */

export class ModalManager {
  constructor() {
    this._currentModal = null;
    this._modalContainer = null;
    this._stateManager = null;
    this._router = null;
    
    // Modal components (to be set via setDependencies)
    this._OTPModalComponent = null;
    this._stampDetailModal = null;
    this._positionDetailModal = null;
    this._referralDetailModal = null;
    this._showSMSToast = null;
    this._dismissSMSToast = null;
    this._MOCK_POSITIONS = null;
  }
  
  /**
   * Sets dependencies for the modal manager
   * @param {Object} deps - Dependencies object
   */
  setDependencies(deps) {
    this._stateManager = deps.stateManager;
    this._router = deps.router;
    this._OTPModalComponent = deps.OTPModalComponent;
    this._stampDetailModal = deps.stampDetailModal;
    this._positionDetailModal = deps.positionDetailModal;
    this._referralDetailModal = deps.referralDetailModal;
    this._showSMSToast = deps.showSMSToast;
    this._dismissSMSToast = deps.dismissSMSToast;
    this._MOCK_POSITIONS = deps.MOCK_POSITIONS;
  }

  /**
   * Initializes the modal manager
   */
  init() {
    this._modalContainer = document.getElementById('modal-container');
    
    if (!this._stateManager) {
      console.warn('ModalManager: stateManager not set');
      return;
    }
    
    // Subscribe to activeModal state changes
    this._stateManager.subscribe('activeModal', (modalName) => {
      this._handleModalChange(modalName);
    });
    
    // Set up event delegation for modal container
    if (this._modalContainer) {
      this._modalContainer.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (target) {
          e.preventDefault();
          this._handleAction(target.dataset.action, target, e);
        }
      });
    }
  }

  /**
   * Handles modal state changes
   * @param {string|null} modalName - Name of modal to show, or null to close
   */
  _handleModalChange(modalName) {
    // Unmount current modal if exists
    if (this._currentModal) {
      this._currentModal.unmount();
      this._currentModal = null;
    }

    if (!this._modalContainer) return;

    if (modalName === 'otp') {
      // Show OTP modal
      this._modalContainer.classList.add('active');
      if (this._OTPModalComponent) {
        this._currentModal = new this._OTPModalComponent();
        if (this._stateManager) {
          this._currentModal.setStateManager(this._stateManager);
        }
        this._modalContainer.innerHTML = this._currentModal.render();
        this._currentModal.mount();
      }
      
      // Story 7.4: Trigger SMS toast 500ms after modal opens (simulating SMS delivery)
      if (this._showSMSToast) {
        setTimeout(() => {
          this._showSMSToast();
        }, 500);
      }
    } else if (modalName === 'stamp-details') {
      // Show stamp detail modal (Story 3.5)
      const stamp = this._stateManager.getState('selectedStamp');
      if (stamp && this._stampDetailModal) {
        this._currentModal = this._stampDetailModal;
        this._stampDetailModal.open(stamp);
      }
    } else if (modalName === 'position-details') {
      // Show position detail modal (Story 4.3)
      const position = this._stateManager.getState('selectedPosition');
      if (position && this._positionDetailModal) {
        this._currentModal = this._positionDetailModal;
        this._positionDetailModal.open(position);
      }
    } else if (modalName === 'referral-details') {
      // Show referral detail modal (Story 5.3)
      const referral = this._stateManager.getState('selectedReferral');
      if (referral && this._referralDetailModal) {
        this._currentModal = this._referralDetailModal;
        this._referralDetailModal.open(referral);
      }
    } else {
      // Hide modal container
      this._modalContainer.classList.remove('active');
      this._modalContainer.innerHTML = '';
    }
  }

  /**
   * Handles modal actions via event delegation
   * @param {string} action - Action name
   * @param {Element} target - Trigger element
   * @param {Event} event - Original event
   */
  _handleAction(action, target, event) {
    switch (action) {
      case 'verify-otp':
        if (this._currentModal && this._currentModal.verifyOTP) {
          this._currentModal.verifyOTP();
        }
        break;
        
      case 'resend-otp':
        if (this._currentModal && this._currentModal.handleResend) {
          this._currentModal.handleResend();
          // Story 7.4: Show SMS toast again when resending
          if (this._showSMSToast) {
            setTimeout(() => {
              this._showSMSToast();
            }, 500);
          }
        }
        break;
      
      // Story 7.4: SMS Toast dismiss action
      case 'close-sms-toast':
        if (this._dismissSMSToast) {
          this._dismissSMSToast();
        }
        break;
        
      case 'close-otp':
        this._stateManager.setState({ activeModal: null });
        break;
        
      case 'close-otp-overlay':
        // Only close if clicking directly on overlay, not modal content
        if (event.target === target) {
          this._stateManager.setState({ activeModal: null });
        }
        break;
        
      // Stamp Detail Modal actions (Story 3.5)
      case 'close-stamp-modal':
        if (this._currentModal === this._stampDetailModal) {
          this._stampDetailModal.close();
        }
        break;
        
      case 'close-stamp-modal-overlay':
        // Only close if clicking directly on overlay, not modal content
        if (event.target === target && this._currentModal === this._stampDetailModal) {
          this._stampDetailModal.close();
        }
        break;
        
      // Position Detail Modal actions (Story 4.3)
      case 'close-position-modal':
        if (this._currentModal === this._positionDetailModal) {
          this._positionDetailModal.close();
        }
        break;
        
      case 'close-position-modal-overlay':
        // Only close if clicking directly on overlay, not modal content
        if (event.target === target && this._currentModal === this._positionDetailModal) {
          this._positionDetailModal.close();
        }
        break;
        
      case 'share-position-modal':
        if (this._currentModal === this._positionDetailModal) {
          const positionId = target.dataset.positionId;
          if (positionId && window.openSharePanel) {
            // Open share panel instead of direct share (Story 4.4)
            window.openSharePanel(positionId);
          }
        }
        break;
        
      case 'refer-from-modal':
        if (this._currentModal === this._positionDetailModal) {
          const positionId = target.dataset.positionId;
          if (positionId && this._MOCK_POSITIONS) {
            const position = this._MOCK_POSITIONS.find(p => p.id === positionId);
            if (position) {
              // Close modal first
              this._positionDetailModal.close();
              
              // Set referral state
              this._stateManager.setState({
                referringPosition: position
              });
              
              // Navigate to referral form (Story 4.5)
              if (this._router) {
                this._router.navigate('refer');
              }
            }
          }
        }
        break;
        
      // Referral Detail Modal actions (Story 5.3)
      case 'close-referral-modal':
        if (this._currentModal === this._referralDetailModal) {
          this._referralDetailModal.close();
        }
        break;
        
      case 'close-referral-modal-overlay':
        // Only close if clicking directly on overlay, not modal content
        if (event.target === target && this._currentModal === this._referralDetailModal) {
          this._referralDetailModal.close();
        }
        break;
        
      default:
        console.warn(`ModalManager: Unknown action "${action}"`);
    }
  }
}

// Global ModalManager singleton instance
export const modalManager = new ModalManager();
