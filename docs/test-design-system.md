# System-Level Test Design
# PassportCard Refer - Testability Review

**Date:** 2025-12-10  
**Author:** Ben.akiva (with TEA Agent)  
**Project Phase:** Phase 3 - Solutioning  
**Status:** Ready for Implementation Gate Check

---

## Executive Summary

This document provides a system-level testability assessment for PassportCard Refer, a client-side SPA with a unique three-file architecture constraint. The assessment confirms the architecture **supports testability** with no critical blockers.

**Key Findings:**
- ✅ Architecture is testable (StateManager, semantic selectors, deterministic data)
- ✅ E2E-heavy test strategy recommended (60% E2E, 25% Component, 15% Unit)
- ⚠️ 5 high-risk ASRs identified (Score ≥6) requiring focused test coverage
- ⚠️ 5 concerns identified (not blockers) with mitigations provided

---

## 1. Testability Assessment

### 1.1 Controllability

**Rating: ✅ PASS**

| Aspect | Assessment | Evidence |
|--------|------------|----------|
| State Control | ✅ PASS | `stateManager.setState()` allows direct state injection |
| Data Seeding | ✅ PASS | Seeded random from email produces deterministic mock data |
| Environment Config | ⚠️ Limited | Client-side only, no env switching (acceptable for demo) |
| Mock Dependencies | ✅ PASS | Zero external APIs - fully self-contained |
| Error Triggering | ⚠️ Limited | All data client-side; limited error scenarios |

**Test Implications:**
- Tests can inject any state via `stateManager.setState()`
- Same email always produces identical user data (deterministic)
- localStorage can be pre-populated or cleared for test scenarios
- No API mocking infrastructure needed

### 1.2 Observability

**Rating: ✅ PASS**

| Aspect | Assessment | Evidence |
|--------|------------|----------|
| State Inspection | ✅ PASS | `stateManager.getState()` exposes full state |
| DOM Selectors | ✅ PASS | `data-action`, `data-navigate`, `data-{type}-id` attributes |
| Animation States | ✅ PASS | CSS classes: `.passport--opening`, `.stamp--new`, `.btn--loading` |
| Error Reporting | ⚠️ Console only | Errors logged but not surfaced in UI |
| Determinism | ✅ PASS | Seeded random eliminates non-determinism |

**Test Implications:**
- Playwright can use stable `[data-action="..."]` selectors
- Animation completion detectable via class changes
- State assertions possible via `page.evaluate(() => stateManager.getState())`

### 1.3 Reliability

**Rating: ✅ PASS**

| Aspect | Assessment | Evidence |
|--------|------------|----------|
| Test Isolation | ✅ PASS | localStorage clearable between tests |
| Parallel Safety | ✅ PASS | No shared backend state |
| Reproducibility | ✅ PASS | Deterministic mock data |
| Loose Coupling | ✅ PASS | Component-based with props injection |
| Animation Safety | ⚠️ Requires handling | `prefers-reduced-motion` must be enabled in tests |

**Test Implications:**
- Each test starts fresh with `localStorage.clear()`
- Tests can run in parallel across browsers
- AnimationService respects reduced motion (use for faster tests)

---

## 2. Architecturally Significant Requirements (ASRs)

### 2.1 High-Risk ASRs (Score ≥6) - IMMEDIATE MITIGATION REQUIRED

| ID | Requirement | Category | P×I | Score | Mitigation |
|----|-------------|----------|-----|-------|------------|
| ASR-001 | 60fps animations (NFR-PERF-003) | PERF | 2×3 | **6** | Playwright tracing, performance timeline analysis |
| ASR-002 | FCP < 2s (NFR-PERF-001) | PERF | 2×3 | **6** | Lighthouse CI integration with budget enforcement |
| ASR-003 | Full RTL support (NFR-USE-004) | BUS | 2×3 | **6** | RTL-specific E2E tests, CSS logical property validation |
| ASR-004 | Reduced motion support (NFR-ACC-005) | BUS | 3×2 | **6** | Dual test paths: with/without reduced motion |
| ASR-005 | Cross-browser compatibility | TECH | 2×3 | **6** | Browser matrix in CI (Chrome, Firefox, Safari, Edge) |

### 2.2 Medium-Risk ASRs (Score 3-5)

| ID | Requirement | Category | P×I | Score | Notes |
|----|-------------|----------|-----|-------|-------|
| ASR-006 | Bundle < 500KB (NFR-PERF-004) | PERF | 1×3 | **3** | Three-file architecture naturally constrains |
| ASR-007 | 44×44px touch targets (NFR-USE-002) | BUS | 2×2 | **4** | Bounding box assertions in E2E |
| ASR-008 | Keyboard navigation (NFR-ACC-003) | BUS | 2×2 | **4** | Tab order tests, modal focus trap |
| ASR-009 | Contrast 4.5:1 (NFR-ACC-004) | BUS | 1×2 | **2** | axe-core automated checks |
| ASR-010 | Session persistence (FR-AUTH-003) | DATA | 2×2 | **4** | localStorage corruption recovery tests |

### 2.3 Low-Risk ASRs (Score 1-2)

| ID | Requirement | Category | P×I | Score | Notes |
|----|-------------|----------|-----|-------|-------|
| ASR-011 | Semantic HTML (NFR-ACC-001) | BUS | 1×2 | **2** | axe-core validation |
| ASR-012 | ARIA labels (NFR-ACC-002) | BUS | 1×2 | **2** | axe-core validation |
| ASR-013 | Zero console errors | OPS | 1×2 | **2** | Console monitoring in E2E |

---

## 3. Test Levels Strategy

### 3.1 Recommended Distribution

```
┌─────────────────────────────────────────┐
│           E2E (Playwright)              │  60%
│         User journeys, animations,      │
│         cross-browser, RTL, a11y        │
├─────────────────────────────────────────┤
│         Component Tests                 │  25%
│    Isolated UI components (optional)    │
├─────────────────────────────────────────┤
│         Unit Tests (Vitest)             │  15%
│   StateManager, utilities, validators   │
└─────────────────────────────────────────┘
```

### 3.2 Rationale for E2E-Heavy Strategy

| Factor | Impact |
|--------|--------|
| No backend | No API integration tests needed |
| Animation-centric | Requires real browser rendering |
| RTL validation | CSS logical properties need DOM |
| Cross-browser NFRs | Only E2E validates browser compat |
| Demo quality focus | Visual polish is primary value |

### 3.3 Test Level Assignment by Epic

| Epic | E2E | Component | Unit |
|------|-----|-----------|------|
| **1: Foundation & Auth** | Login flow, OTP, session | Nav component | Router, validators |
| **2: Dashboard** | Full dashboard, stats click | Stats cards | Point calculations |
| **3: Passport & Stamps** | Animations, navigation, stamps | Passport, Stamp | - |
| **4: Positions & Referrals** | Full referral flow | Form, cards | Filter logic, validation |
| **5: Tracking** | Pipeline visualization | Timeline | - |
| **6: Polish** | Cross-browser, a11y, perf | - | - |

### 3.4 What NOT to Test

| Area | Reason |
|------|--------|
| CSS animations in unit tests | Requires browser |
| Third-party CDNs (fonts, icons) | External dependency |
| localStorage internals | Browser-provided |
| canvas-confetti library | Third-party |

---

## 4. NFR Testing Approach

### 4.1 Performance (NFR-PERF)

| NFR | Metric | Target | Tool | Automation |
|-----|--------|--------|------|------------|
| NFR-PERF-001 | First Contentful Paint | < 2000ms | Lighthouse CI | CI gate |
| NFR-PERF-002 | Time to Interactive | < 2500ms | Lighthouse CI | CI gate |
| NFR-PERF-003 | Animation FPS | 60fps | Playwright trace | Manual review |
| NFR-PERF-004 | Bundle size | < 500KB | File size script | CI gate |
| NFR-PERF-005 | Interaction response | < 100ms | Playwright timing | E2E assertion |

**Lighthouse Budget (lighthouse-budget.json):**
```json
{
  "performance": {
    "first-contentful-paint": 2000,
    "interactive": 2500,
    "speed-index": 3000
  },
  "resourceSizes": [
    { "resourceType": "total", "budget": 500000 }
  ]
}
```

### 4.2 Usability (NFR-USE)

| NFR | Test Approach | Tool |
|-----|---------------|------|
| NFR-USE-001: Mobile-first | Viewport tests (375px, 768px, 1024px, 1440px) | Playwright |
| NFR-USE-002: Touch targets | Bounding box assertions (width ≥ 44, height ≥ 44) | Playwright |
| NFR-USE-003: Visual feedback | Hover/active/focus state screenshots | Playwright |
| NFR-USE-004: RTL support | Direction assertions, logical property validation | Playwright |
| NFR-USE-005: Brand consistency | Visual regression vs baselines | Playwright |

**Viewport Configuration:**
```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'wide', width: 1440, height: 900 },
];
```

### 4.3 Accessibility (NFR-ACC)

| NFR | Test Approach | Tool | Automation |
|-----|---------------|------|------------|
| NFR-ACC-001: Semantic HTML | axe-core scan | @axe-core/playwright | CI gate |
| NFR-ACC-002: ARIA labels | axe-core scan | @axe-core/playwright | CI gate |
| NFR-ACC-003: Keyboard nav | Tab order tests | Playwright keyboard | E2E |
| NFR-ACC-004: Contrast | axe-core scan | @axe-core/playwright | CI gate |
| NFR-ACC-005: Reduced motion | Dual test mode | Playwright emulation | E2E |
| NFR-ACC-006: Screen reader | Manual testing | VoiceOver/NVDA | Pre-release |

**axe-core Integration:**
```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('dashboard meets WCAG AA', async ({ page }) => {
  await page.goto('#dashboard');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
});
```

### 4.4 Security (NFR-SEC) - Demo Phase

| NFR | Test Approach | Expected Outcome |
|-----|---------------|------------------|
| NFR-SEC-001: No real auth | E2E: OTP "000000" always succeeds | Login completes |
| NFR-SEC-002: No sensitive data | E2E: Inspect localStorage | No PII stored |
| NFR-SEC-003: Client-side only | Network monitor | Zero external requests |
| NFR-SEC-004: DEMO disclaimer | E2E: Check settings page | Disclaimer visible |

### 4.5 Browser Support (NFR-BROW)

| Browser | Version | CI Matrix |
|---------|---------|-----------|
| Chrome | 90+ | ✅ Primary |
| Firefox | 88+ | ✅ Secondary |
| Safari | 14+ | ✅ Secondary |
| Edge | 90+ | ⚠️ Spot check |
| Mobile Safari | iOS 14+ | ⚠️ Spot check |
| Chrome Mobile | Android 10+ | ⚠️ Spot check |

**Playwright Config:**
```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
]
```

---

## 5. Test Environment Requirements

### 5.1 Local Development

| Component | Tool | Purpose |
|-----------|------|---------|
| Server | `npx serve` or Python `http.server` | Serve static files |
| Test Runner | Playwright | E2E execution |
| Unit Runner | Vitest | Unit test execution |
| Browser | Chrome (headed) | Visual debugging |

### 5.2 CI Pipeline (GitHub Actions)

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit

  e2e-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npx playwright test --project=${{ matrix.browser }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: ./lighthouserc.json
          budgetPath: ./lighthouse-budget.json

  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check bundle size
        run: |
          TOTAL=$(stat -f%z index.html style.css script.js | awk '{s+=$1} END {print s}')
          echo "Total bundle size: $TOTAL bytes"
          if [ $TOTAL -gt 500000 ]; then
            echo "❌ Bundle exceeds 500KB limit"
            exit 1
          fi
          echo "✅ Bundle within 500KB limit"
```

### 5.3 Visual Regression

| Tool | Purpose | When |
|------|---------|------|
| Playwright screenshots | Baseline comparison | PR checks |
| Percy/Chromatic | Cloud visual diff | Optional |

---

## 6. Testability Concerns

### 6.1 Concerns with Mitigations

| # | Concern | Risk | Mitigation |
|---|---------|------|------------|
| 1 | **Animation timing slows tests** | Tests take longer due to CSS animations | Enable `prefers-reduced-motion` in Playwright context |
| 2 | **Three-file constraint** | 3000+ lines in script.js harder to unit test | Focus on E2E; unit test only pure functions via imports |
| 3 | **No test framework in app** | Vanilla JS has no built-in test utilities | Use Playwright's `page.evaluate()` to inject helpers |
| 4 | **CDN dependencies** | Google Fonts/Tabler Icons may cause flaky FCP | Use `waitForLoadState('networkidle')` or mock CDN |
| 5 | **localStorage schema** | No validation on localStorage shape | Create test helper to validate expected keys |

### 6.2 Mitigation Implementation

**Animation Speed-Up:**
```typescript
// playwright.config.ts
use: {
  // Disable animations for faster tests
  launchOptions: {
    args: ['--force-prefers-reduced-motion'],
  },
}

// Or per-test:
test('passport opens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Animations skip instantly
});
```

**State Injection Helper:**
```typescript
// In test setup
await page.evaluate((mockState) => {
  localStorage.setItem('appState', JSON.stringify(mockState));
  window.location.reload();
}, {
  isAuthenticated: true,
  currentUser: { id: 'usr-001', name: 'Test User', ... },
  stamps: [...],
  referrals: [...],
});
```

### 6.3 No Blockers Identified

The architecture supports testability with no critical issues:

- ✅ Deterministic mock data (seeded random)
- ✅ Observable state (StateManager.getState())
- ✅ Stable selectors (data-* attributes)
- ✅ Component lifecycle (mount/unmount)
- ✅ Hash-based routing (direct navigation)
- ✅ Reduced motion support (AnimationService)

---

## 7. Recommendations for Sprint 0

### 7.1 Test Infrastructure Setup

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Initialize Playwright project | P0 | 2h | Dev |
| Configure browser matrix (Chrome, Firefox, Safari) | P0 | 1h | Dev |
| Set up Vitest for unit tests | P1 | 1h | Dev |
| Integrate axe-core for accessibility | P0 | 1h | Dev |
| Configure Lighthouse CI | P1 | 2h | Dev |
| Create test data factories | P0 | 2h | Dev |
| Set up GitHub Actions workflow | P0 | 2h | Dev |

### 7.2 Recommended Project Structure

```
passportcard-refer/
├── index.html
├── style.css
├── script.js
├── README.md
├── package.json              # Dev dependencies only
├── playwright.config.ts
├── vitest.config.ts
├── lighthouserc.json
├── lighthouse-budget.json
├── .github/
│   └── workflows/
│       └── test.yml
└── tests/
    ├── e2e/
    │   ├── auth/
    │   │   ├── login.spec.ts
    │   │   └── session.spec.ts
    │   ├── passport/
    │   │   ├── cover.spec.ts
    │   │   ├── pages.spec.ts
    │   │   └── stamps.spec.ts
    │   ├── dashboard/
    │   │   └── dashboard.spec.ts
    │   ├── positions/
    │   │   ├── list.spec.ts
    │   │   └── filters.spec.ts
    │   ├── referrals/
    │   │   ├── form.spec.ts
    │   │   └── tracking.spec.ts
    │   ├── accessibility/
    │   │   └── wcag.spec.ts
    │   └── visual/
    │       └── snapshots.spec.ts
    ├── unit/
    │   ├── state-manager.test.ts
    │   ├── router.test.ts
    │   ├── validators.test.ts
    │   └── utilities.test.ts
    └── fixtures/
        ├── test-data.ts
        └── page-objects.ts
```

### 7.3 Framework Workflow Integration

| Workflow | When to Run |
|----------|-------------|
| `*framework` | Sprint 0 - Initialize test infrastructure |
| `*atdd` | Per Epic - Generate E2E tests before implementation |
| `*automate` | Per Story - Expand test coverage |
| `*trace` | Pre-release - Validate coverage and gate decision |
| `*ci` | Sprint 0 - Set up CI pipeline |

---

## 8. Quality Gate Criteria

### 8.1 Implementation Gate (Pre-Sprint 1)

| Criterion | Threshold | Evidence |
|-----------|-----------|----------|
| Test infrastructure ready | Complete | Playwright + Vitest configured |
| CI pipeline running | Passing | GitHub Actions green |
| axe-core integrated | Complete | Accessibility tests executable |
| Lighthouse baseline | Captured | Initial performance metrics |

### 8.2 Release Gate (Pre-Demo)

| Criterion | Threshold | Evidence |
|-----------|-----------|----------|
| P0 test pass rate | 100% | All critical path tests green |
| P1 test pass rate | ≥95% | Important features covered |
| Accessibility score | ≥90 | axe-core report |
| Lighthouse Performance | ≥90 | Lighthouse CI report |
| Cross-browser validation | All pass | Chrome, Firefox, Safari green |
| Zero console errors | 0 errors | E2E console monitoring |

---

## 9. Summary

### 9.1 Testability Verdict

| Area | Rating | Notes |
|------|--------|-------|
| **Controllability** | ✅ PASS | StateManager enables full control |
| **Observability** | ✅ PASS | Semantic selectors, state inspection |
| **Reliability** | ✅ PASS | Deterministic, isolated |
| **Overall** | ✅ READY | No blockers identified |

### 9.2 Risk Summary

| Risk Level | Count | Action |
|------------|-------|--------|
| Critical (Score 9) | 0 | - |
| High (Score 6-8) | 5 | Focused test coverage |
| Medium (Score 3-5) | 5 | Standard coverage |
| Low (Score 1-2) | 3 | Automated tools |

### 9.3 Next Steps

1. ✅ **This document** - System-level test design complete
2. ➡️ **Implementation readiness check** - Validate architecture is ready
3. ➡️ **Sprint 0** - Set up test infrastructure (`*framework`, `*ci`)
4. ➡️ **Epic 1 implementation** - Begin with ATDD approach (`*atdd`)

---

**Generated by:** BMad TEA Agent - Test Architect Module  
**Workflow:** `.bmad/bmm/testarch/test-design`  
**Version:** 4.0 (BMad v6)  
**Mode:** System-Level (Phase 3)

