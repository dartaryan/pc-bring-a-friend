/**
 * PassportCard Refer - Status Configuration
 * Referral status configuration and pipeline stages
 */

/* ============================================================================
   REFERRAL STATUS CONFIGURATION (Story 5.1)
   ============================================================================
   Full status configuration for referral filtering and display
   ========================================================================== */

export const REFERRAL_STATUS_CONFIG = {
  submitted: { 
    hebrew: 'הוגש', 
    icon: 'mail', 
    color: '#0984E3',
    filterGroup: 'in-progress'
  },
  review: { 
    hebrew: 'בבדיקה', 
    icon: 'eye', 
    color: '#F39C12',
    filterGroup: 'in-progress'
  },
  interview: { 
    hebrew: 'בראיון', 
    icon: 'phone-call', 
    color: '#6C5CE7',
    filterGroup: 'in-progress'
  },
  offer: { 
    hebrew: 'הצעה', 
    icon: 'file-description', 
    color: '#00B894',
    filterGroup: 'in-progress'
  },
  hired: { 
    hebrew: 'גויס!', 
    icon: 'confetti', 
    color: '#22C55E',
    filterGroup: 'hired'
  },
  rejected: { 
    hebrew: 'לא נבחר', 
    icon: 'x', 
    color: '#95A5A6',
    filterGroup: 'rejected'
  }
};

/* ============================================================================
   CONSTANTS - Pipeline Stages (Story 5.2)
   ============================================================================
   Configuration for the visual pipeline showing referral progress
   ========================================================================== */

export const PIPELINE_STAGES = [
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
export const STAGE_INDEX = PIPELINE_STAGES.reduce((acc, stage, index) => {
  acc[stage.key] = index;
  return acc;
}, {});
