# Product Requirements Document (PRD)
# PassportCard Refer - Employee Referral Gamification Platform

---

**Document Version:** 1.0  
**Status:** Approved for Development  
**Last Updated:** December 10, 2025  
**Product Owner:** Ben.akiva  
**Target Release:** Q1 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Personas](#4-user-personas)
5. [Product Scope](#5-product-scope)
6. [Feature Requirements](#6-feature-requirements)
7. [User Flows](#7-user-flows)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Technical Constraints](#9-technical-constraints)
10. [Out of Scope](#10-out-of-scope)
11. [Dependencies & Risks](#11-dependencies--risks)
12. [Release Criteria](#12-release-criteria)

---

## 1. Executive Summary

### 1.1 Product Overview

**Product Name:** PassportCard Refer  
**Internal Codename:** "Stamps"  
**Type:** Web Application (SPA)  
**Platform:** Mobile-first responsive web

PassportCard Refer is an innovative employee referral gamification platform that transforms the traditional "refer-a-friend" hiring process into an engaging, passport-themed experience. Employees collect digital "stamps" in their personal passport as they progress through referral milestones.

### 1.2 Vision Statement

> *"Make employee referrals as exciting as collecting passport stamps from around the world."*

### 1.3 Product Context

This release serves dual purposes:
1. **Competition Entry:** Demo/prototype to showcase innovation to management
2. **Production Foundation:** Architecture designed for future backend integration

### 1.4 Key Differentiators

| Differentiator | Description |
|----------------|-------------|
| **Passport Metaphor** | Unique gamification through travel/passport theme |
| **Visual Excellence** | Premium animations, micro-interactions, tactile feel |
| **Technical Elegance** | Three-file vanilla JS architecture (no frameworks) |
| **RTL-Native** | Built from ground-up for Hebrew speakers |
| **Brand Harmony** | Extends PassportCard's established visual identity |

---

## 2. Problem Statement

### 2.1 Current State

Employee referrals at PassportCard currently happen through:
- Scattered channels (email, WhatsApp, Excel spreadsheets)
- No centralized tracking or visibility
- Manual bonus calculations
- Low employee engagement

### 2.2 Pain Points

| Stakeholder | Pain Point | Impact |
|-------------|------------|--------|
| **Employees** | Don't know which positions are open | Missed referral opportunities |
| **Employees** | No visibility into referral status | Frustration, lack of engagement |
| **Employees** | Unclear bonus rules and timelines | Reduced motivation to refer |
| **HR** | Manual tracking across multiple systems | Time waste, errors |
| **HR** | Difficult to measure ROI | Cannot justify program investment |
| **Leadership** | No clear metrics on referral program | Unable to optimize hiring strategy |

### 2.3 Opportunity

Transform the referral experience by:
- Centralizing all referral activities in one engaging platform
- Gamifying the process to increase participation
- Providing real-time visibility for all stakeholders
- Creating measurable, trackable outcomes

---

## 3. Goals & Success Metrics

### 3.1 Business Goals

| Goal | Target | Measurement |
|------|--------|-------------|
| Increase referral submissions | +200% | Monthly referral count vs baseline |
| Reduce cost-per-hire | -40% | Referral hires vs agency hires |
| Decrease time-to-fill | -30% | Days from posting to hire |
| Improve quality-of-hire | +25% | 6-month retention rate |

### 3.2 User Goals

| User | Goal | Success Indicator |
|------|------|-------------------|
| Employees | Make referrals quickly | < 2 minutes per referral |
| Employees | Track referral status | Real-time status visibility |
| Employees | Understand rewards | Clear bonus breakdown |
| HR | Monitor program health | Dashboard with KPIs |

### 3.3 Demo/Competition Goals

| Goal | Indicator |
|------|-----------|
| "Wow" Factor | Positive management reactions |
| Technical Excellence | Zero console errors, 60fps animations |
| Business Case | Clear ROI visualization |
| Adoption Interest | "When can we use this?" questions |

### 3.4 Key Performance Indicators (KPIs)

**Primary KPIs:**
- Daily Active Users (DAU)
- Referrals submitted per employee per month
- Conversion rate (referral → hire)
- Employee Net Promoter Score (eNPS)

**Secondary KPIs:**
- Average session duration
- Passport pages viewed per session
- Share link click-through rate
- Feature adoption rates

---

## 4. User Personas

### 4.1 Primary Persona: "Active Referrer Rachel"

| Attribute | Details |
|-----------|---------|
| **Role** | Senior Software Engineer |
| **Age** | 32 |
| **Department** | R&D |
| **Tech Savvy** | High |
| **Motivation** | Help friends join, earn extra income, build team |
| **Frustrations** | Forgets about open positions, unsure about referral status |
| **Goals** | Quick referral process, clear bonus tracking |
| **Quote** | *"I know great people but by the time I remember to refer them, the position is filled."* |

**Jobs to be Done:**
1. Quickly see which positions match my network
2. Share job opportunities with minimal friction
3. Track what's happening with my referrals
4. Understand exactly how much I'll earn

### 4.2 Secondary Persona: "Occasional Referrer Omer"

| Attribute | Details |
|-----------|---------|
| **Role** | Marketing Manager |
| **Age** | 28 |
| **Department** | Marketing |
| **Tech Savvy** | Medium |
| **Motivation** | Occasionally knows someone perfect for a role |
| **Frustrations** | Complex forms, too many steps |
| **Goals** | One-click sharing, minimal effort |
| **Quote** | *"I'd refer more if it didn't feel like filling out a tax form."* |

**Jobs to be Done:**
1. Quickly share a position link via WhatsApp
2. Get notified if my referral moves forward
3. Not worry about the details

### 4.3 Tertiary Persona: "Manager Maya" (HR/Leadership)

| Attribute | Details |
|-----------|---------|
| **Role** | VP of People |
| **Age** | 45 |
| **Department** | HR |
| **Tech Savvy** | Medium |
| **Motivation** | Prove referral program ROI to leadership |
| **Frustrations** | Manual tracking, unclear metrics |
| **Goals** | Dashboard with clear KPIs, export capabilities |
| **Quote** | *"I need to show the board that our referral program is worth the investment."* |

**Jobs to be Done:**
1. See program health at a glance
2. Identify top referrers
3. Export data for reporting
4. Track bonuses owed

---

## 5. Product Scope

### 5.1 In Scope (MVP v1.0)

| Category | Features |
|----------|----------|
| **Authentication** | Email-based login, OTP verification (mock), session management |
| **Passport Experience** | Animated passport, collectible stamps, achievement tracking |
| **Dashboard** | Points summary, stats cards, activity feed, quick actions |
| **Positions** | Position listing, filters, search, position details |
| **Referral Submission** | Share links, upload resume, candidate form, confirmation |
| **Referral Tracking** | Status list, timeline visualization, detail view |
| **Gamification** | Points system, stamps, campaigns, milestones |
| **Settings** | Basic preferences, profile view |

### 5.2 Out of Scope (MVP v1.0)

| Feature | Reason | Future Phase |
|---------|--------|--------------|
| Real authentication | Demo/prototype phase | v2.0 |
| Backend API | Demo uses mock data | v2.0 |
| Admin dashboard | HR features later | v2.0 |
| Real file uploads | Client-side only for demo | v2.0 |
| Push notifications | Requires backend | v2.0 |
| Multi-language | Hebrew only for MVP | v2.0 |
| Native mobile apps | Web-responsive only | v3.0 |
| Social media integration | Beyond WhatsApp | v3.0 |

### 5.3 MVP Definition

The MVP must include:
- ✅ Complete authentication flow (mock)
- ✅ Fully animated passport experience
- ✅ Dashboard with mock data
- ✅ Position listing with filters
- ✅ Referral submission flow
- ✅ Referral tracking
- ✅ Points/stamps gamification
- ✅ Responsive design (mobile + desktop)
- ✅ RTL Hebrew support

---

## 6. Feature Requirements

### 6.1 Authentication Flow

#### FR-AUTH-001: Email-Based Login
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | User enters company email to initiate login |
| **Input** | Email in format: `firstname.lastname@passportcard.co.il` |
| **Behavior** | Auto-complete domain suffix, validate format |
| **Output** | Trigger OTP flow or show validation error |

**Acceptance Criteria:**
- [ ] Email field auto-suggests `@passportcard.co.il` domain
- [ ] Validation accepts only `firstname.lastname@passportcard.co.il` format
- [ ] Invalid format shows inline error message
- [ ] Submit button disabled until valid email

#### FR-AUTH-002: OTP Verification
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | 6-digit OTP verification modal |
| **Mock Behavior** | Accept `000000` as valid OTP always |
| **Animation** | 1.5-2 second loading state after submission |
| **Success** | Redirect to passport animation |

**Acceptance Criteria:**
- [ ] 6-digit input with auto-focus next digit
- [ ] Numbers display LTR (left-to-right)
- [ ] Loading spinner during "verification"
- [ ] Success animation before redirect
- [ ] "Resend OTP" with countdown timer (mock)

#### FR-AUTH-003: Session Management
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Persist user session across page refreshes |
| **Storage** | LocalStorage |
| **Data** | User profile, authentication state, preferences |

**Acceptance Criteria:**
- [ ] Session persists on page refresh
- [ ] Logout clears all session data
- [ ] Expired session redirects to login

---

### 6.2 Passport Experience

#### FR-PASS-001: Passport Cover
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Animated passport cover with PassportCard branding |
| **Design** | Deep navy with gold embossing, leather texture |
| **Content** | Logo, "דרכון הפניות", employee name, ID number |

**Acceptance Criteria:**
- [ ] Passport displays employee name from session
- [ ] Gold PassportCard logo centered
- [ ] Realistic leather texture effect
- [ ] Shadow creates depth illusion

#### FR-PASS-002: Passport Opening Animation
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Cover opens to reveal first page |
| **Duration** | 800ms |
| **Direction** | Opens right-to-left (RTL) |
| **Trigger** | Click/tap on passport or CTA button |

**Acceptance Criteria:**
- [ ] 3D perspective flip animation
- [ ] Smooth 60fps performance
- [ ] Respects `prefers-reduced-motion`

#### FR-PASS-003: Passport Pages
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Multiple pages with stamps and profile |
| **Page 1** | Profile info, total stats |
| **Pages 2+** | Stamps grid (achievements) |
| **Navigation** | Swipe or arrow buttons |

**Acceptance Criteria:**
- [ ] Page 1 shows employee profile and stats
- [ ] Subsequent pages show stamp grid (4-6 stamps per page)
- [ ] Page flip animation (600ms)
- [ ] Swipe left = next page, swipe right = previous (RTL)
- [ ] Page indicator shows current/total

#### FR-PASS-004: Stamp Collection
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Collectible stamps for achievements |
| **Types** | 8 unique stamp designs (see Design System) |
| **Interaction** | Tap stamp to see details modal |

**Stamp Types:**
| Type | Points | Color | Trigger |
|------|--------|-------|---------|
| Resume Submitted | +50 | Blue | Referral submitted |
| Interview Scheduled | +100 | Orange | Candidate gets interview |
| Candidate Hired | +500 | Green | Successful hire |
| 3-Month Milestone | +200 | Silver | Hire reaches 3 months |
| 6-Month Milestone | +400 | Gold | Hire reaches 6 months |
| Special Campaign | +150 | Purple | Campaign participation |
| Referral Streak | +75 | Red | Consecutive referrals |
| First Referral | +100 | Pink | First ever referral |

**Acceptance Criteria:**
- [ ] Each stamp type has unique SVG design
- [ ] Stamps appear with "slam" animation when earned
- [ ] Tap/click opens detail modal with date, points, context
- [ ] Stamps slightly rotated for authentic feel

#### FR-PASS-005: Celebration Effects
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Confetti/celebration on major achievements |
| **Triggers** | First referral, successful hire, milestones |
| **Effects** | Confetti burst, falling PassportCards |

**Acceptance Criteria:**
- [ ] Confetti uses brand colors
- [ ] Effects last 3 seconds max
- [ ] Can be dismissed by interaction
- [ ] Respects `prefers-reduced-motion`

---

### 6.3 Dashboard

#### FR-DASH-001: Points Summary Card
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Display total points with progress indicator |
| **Components** | Points count, level/rank, progress to next milestone |

**Acceptance Criteria:**
- [ ] Animated number counter on load
- [ ] Circular progress shows progress to next level
- [ ] Level name displayed (e.g., "מומחה הפניות")

#### FR-DASH-002: Stats Cards
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Quick stats at a glance |
| **Cards** | Total referrals, Active referrals, Successful hires |

**Acceptance Criteria:**
- [ ] Three cards in responsive grid
- [ ] Each shows count and trend indicator
- [ ] Tap navigates to relevant section

#### FR-DASH-003: Activity Feed
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Recent activity timeline |
| **Items** | Status updates, stamps earned, announcements |
| **Limit** | Last 10 items |

**Acceptance Criteria:**
- [ ] Chronological order (newest first)
- [ ] Each item shows icon, description, points (if applicable), time
- [ ] Relative timestamps ("2 שעות", "אתמול")

#### FR-DASH-004: Quick Actions
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Primary CTAs for key actions |
| **Buttons** | "הפנה מועמד", "צפה במשרות", "הדרכון שלי" |

**Acceptance Criteria:**
- [ ] Primary CTA is most prominent
- [ ] Buttons are easily tappable (min 44px)
- [ ] Navigate to correct sections

#### FR-DASH-005: Campaign Banner
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Highlight active campaigns |
| **Content** | Campaign name, bonus multiplier, deadline |

**Acceptance Criteria:**
- [ ] Eye-catching design with campaign badge
- [ ] Shows end date countdown
- [ ] Tap navigates to filtered positions

---

### 6.4 Open Positions

#### FR-POS-001: Position List View
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Scrollable list of open positions |
| **Card Content** | Title, department, location, bonus amount, hot badge |
| **Data** | 8-12 mock positions |

**Acceptance Criteria:**
- [ ] Cards have left border accent (RTL: right border)
- [ ] "Hot" positions show fire badge
- [ ] Campaign positions show multiplier badge
- [ ] Each card has "הפנה מועמד" button

#### FR-POS-002: Position Filters
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Filter positions by criteria |
| **Filters** | Department, Location, Type (full-time, part-time) |

**Acceptance Criteria:**
- [ ] Filter dropdowns update list instantly
- [ ] "Clear filters" option
- [ ] Show count of filtered results

#### FR-POS-003: Position Search
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Text search for positions |
| **Searchable** | Title (Hebrew + English), department |

**Acceptance Criteria:**
- [ ] Search as you type (debounced 300ms)
- [ ] Highlight matching text
- [ ] Show "no results" state

#### FR-POS-004: Position Details Modal
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Full position information |
| **Content** | Full description, requirements, team info, bonus breakdown |

**Acceptance Criteria:**
- [ ] Modal slides up from bottom (mobile)
- [ ] Scroll for long content
- [ ] "הפנה עכשיו" CTA prominently displayed
- [ ] Share position link option

---

### 6.5 Referral Submission

#### FR-REF-001: Share Referral Link
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Generate and share unique referral link |
| **Channels** | Copy to clipboard, WhatsApp, Email |

**Acceptance Criteria:**
- [ ] Generate unique link with position ID and employee ID
- [ ] Copy button shows "הועתק!" confirmation
- [ ] WhatsApp opens with pre-filled message
- [ ] Email opens default client with subject/body

#### FR-REF-002: Upload Resume
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Drag-and-drop file upload |
| **Accepted** | PDF, DOC, DOCX |
| **Max Size** | 5MB |

**Acceptance Criteria:**
- [ ] Drag-and-drop zone with visual feedback
- [ ] Click to browse option
- [ ] Show file name after selection
- [ ] Validate file type and size
- [ ] Remove file option

#### FR-REF-003: Candidate Form
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Candidate information form |
| **Fields** | Name*, Email*, Phone, Relationship*, Notes |

**Form Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | Text | Yes | Min 2 characters |
| Email | Email | Yes | Valid email format |
| Phone | Tel | No | Valid phone format |
| Relationship | Select | Yes | Predefined options |
| Notes | Textarea | No | Max 500 characters |

**Relationship Options:**
- חבר/ה קרוב/ה (Close friend)
- קולגה מעבודה קודמת (Former colleague)
- מכר/ה מקצועי/ת (Professional acquaintance)
- אחר (Other)

**Acceptance Criteria:**
- [ ] Real-time validation with inline errors
- [ ] Submit disabled until valid
- [ ] Clear error states on input
- [ ] Phone field accepts Israeli formats

#### FR-REF-004: Submission Confirmation
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Success state after submission |
| **Content** | Confirmation message, stamp earned, points added |
| **Actions** | View passport, refer another |

**Acceptance Criteria:**
- [ ] Stamp animation plays
- [ ] Points counter animates
- [ ] Confetti celebration
- [ ] Clear CTAs for next actions

---

### 6.6 Referral Tracking

#### FR-TRACK-001: Referral List
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | All submitted referrals with status |
| **Sorting** | Newest first |
| **Filters** | All, In Progress, Hired, Rejected |

**Acceptance Criteria:**
- [ ] Tab navigation for filters
- [ ] Each card shows candidate, position, date, status
- [ ] Status badge with appropriate color
- [ ] Progress indicator on active referrals

#### FR-TRACK-002: Status Visualization
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Visual pipeline for referral status |
| **Stages** | Submitted → Review → Interview → Offer → Hired |

**Acceptance Criteria:**
- [ ] Horizontal milestone path
- [ ] Completed stages filled
- [ ] Current stage highlighted/pulsing
- [ ] Future stages grayed

#### FR-TRACK-003: Referral Detail Modal
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Detailed view of single referral |
| **Content** | Timeline, points breakdown, expected bonus dates |

**Acceptance Criteria:**
- [ ] Full status history with dates
- [ ] Points earned at each stage
- [ ] Potential points remaining
- [ ] Expected payment date (if hired)

---

### 6.7 Gamification Elements

#### FR-GAME-001: Points System
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Core points economy |
| **Earning** | Actions earn points |
| **Display** | Total, recent, potential |

**Points Table:**
| Action | Base Points | Campaign Multiplier |
|--------|-------------|---------------------|
| Resume Submitted | 50 | 1.5x - 2x |
| Interview Scheduled | 100 | 1.5x - 2x |
| Candidate Hired | 500 | 1.5x - 2x |
| 3-Month Milestone | 200 | N/A |
| 6-Month Milestone | 400 | N/A |
| First Referral | 100 (bonus) | N/A |
| Referral Streak (3+) | 75/each | N/A |

#### FR-GAME-002: Levels/Ranks
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Tiered ranking based on points |

**Levels:**
| Level | Name | Points Required |
|-------|------|-----------------|
| 1 | מתחיל | 0 |
| 2 | פעיל | 250 |
| 3 | מומחה | 750 |
| 4 | אלוף | 2000 |
| 5 | אגדה | 5000 |

#### FR-GAME-003: Active Campaigns
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Time-limited bonus opportunities |
| **Display** | Campaign cards with multiplier, deadline |

**Acceptance Criteria:**
- [ ] Campaign badges on eligible positions
- [ ] Countdown timer to campaign end
- [ ] Multiplier clearly displayed (e.g., "x2 נקודות!")

#### FR-GAME-004: How to Earn Section
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P1 - Should Have |
| **Description** | Educational content about earning |
| **Content** | Points breakdown, tips, campaigns |

**Acceptance Criteria:**
- [ ] Clear visual breakdown of point values
- [ ] Tips for successful referrals
- [ ] Link to active campaigns

---

### 6.8 Navigation & Settings

#### FR-NAV-001: Primary Navigation
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | Main app navigation |
| **Mobile** | Bottom tab bar |
| **Desktop** | Sidebar navigation |

**Navigation Items:**
| Icon | Label | Route |
|------|-------|-------|
| 📊 | דשבורד | /dashboard |
| 📕 | הדרכון שלי | /passport |
| 💼 | משרות | /positions |
| 👥 | ההפניות שלי | /referrals |
| ⚙️ | הגדרות | /settings |

#### FR-NAV-002: Header
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P0 - Must Have |
| **Description** | App header with branding and user |
| **Content** | Logo, page title, user menu |

**Acceptance Criteria:**
- [ ] PassportCard logo links to dashboard
- [ ] Current page title displayed
- [ ] User avatar/initial with dropdown
- [ ] Logout option in dropdown

#### FR-SET-001: Basic Settings
| Attribute | Specification |
|-----------|---------------|
| **Priority** | P2 - Nice to Have |
| **Description** | User preferences |
| **Options** | Notifications toggle, profile view |

**Acceptance Criteria:**
- [ ] Toggle for email notifications (mock)
- [ ] Display employee info (read-only)
- [ ] Logout button

---

## 7. User Flows

### 7.1 First-Time User Flow

```
[Landing Page] 
    → Enter Email 
    → [OTP Modal] Enter 000000 
    → [Loading] "מאמת..." 
    → [Passport Animation] Cover opens 
    → [First Page] "ברוכים הבאים!" 
    → [Dashboard]
```

### 7.2 Submit Referral Flow

```
[Dashboard] 
    → Click "הפנה מועמד" 
    → [Positions List] 
    → Select position 
    → [Referral Form] 
        → Fill candidate details 
        → Upload resume 
        → Submit 
    → [Success] 
        → Stamp animation 
        → Points awarded 
        → [Options: View Passport | Refer Another]
```

### 7.3 Track Referral Flow

```
[Dashboard] 
    → "ההפניות שלי" 
    → [Referrals List] 
    → Select referral 
    → [Detail Modal] 
        → View timeline 
        → See points breakdown
```

### 7.4 View Passport Flow

```
[Any Screen] 
    → "הדרכון שלי" 
    → [Passport Cover] 
    → Tap/Click to open 
    → [Page 1: Profile] 
    → Swipe/Arrow for more pages 
    → Tap stamp 
    → [Stamp Detail Modal]
```

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| **NFR-PERF-001** | Initial load < 2s | First Contentful Paint |
| **NFR-PERF-002** | Time to Interactive < 2.5s | TTI metric |
| **NFR-PERF-003** | Animations at 60fps | Chrome DevTools |
| **NFR-PERF-004** | Bundle size < 500KB | Uncompressed total |
| **NFR-PERF-005** | Interaction response < 100ms | User-perceived latency |

### 8.2 Usability

| Requirement | Specification |
|-------------|---------------|
| **NFR-USE-001** | Mobile-first design approach |
| **NFR-USE-002** | Minimum touch target: 44×44px |
| **NFR-USE-003** | Visual feedback for all interactions |
| **NFR-USE-004** | Full RTL support for Hebrew |
| **NFR-USE-005** | Consistent with PassportCard brand |

### 8.3 Accessibility

| Requirement | Specification |
|-------------|---------------|
| **NFR-ACC-001** | Semantic HTML5 elements |
| **NFR-ACC-002** | ARIA labels where needed |
| **NFR-ACC-003** | Keyboard navigation support |
| **NFR-ACC-004** | Minimum contrast ratio 4.5:1 |
| **NFR-ACC-005** | `prefers-reduced-motion` support |
| **NFR-ACC-006** | Screen reader compatibility |

### 8.4 Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Safari | 14+ |
| Firefox | 88+ |
| Edge | 90+ |
| Mobile Safari | iOS 14+ |
| Chrome Mobile | Android 10+ |

### 8.5 Security (Demo Phase)

| Requirement | Specification |
|-------------|---------------|
| **NFR-SEC-001** | No real authentication (demo only) |
| **NFR-SEC-002** | No sensitive data storage |
| **NFR-SEC-003** | Client-side only, no backend calls |
| **NFR-SEC-004** | Clear "DEMO" disclaimer |

---

## 9. Technical Constraints

### 9.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Markup** | HTML5 | Semantic, accessible |
| **Styling** | CSS3 | Custom properties, no preprocessors |
| **Logic** | Vanilla JavaScript | No frameworks, demo elegance |
| **Storage** | LocalStorage | Client-side persistence |
| **Hosting** | GitHub Pages | Free, simple deployment |

### 9.2 Architecture Constraints

- **Three-file architecture:** `index.html`, `style.css`, `script.js`
- **No build step:** Files served as-is
- **No external dependencies:** Except Google Fonts and icon CDN
- **Mock data only:** All data generated/stored client-side

### 9.3 Design Constraints

- **Brand compliance:** Must use PassportCard colors, fonts, logo
- **RTL-first:** Hebrew as primary language
- **Mobile-first:** Base styles for mobile, enhance for desktop
- **Design system:** Must follow provided UX specification

---

## 10. Out of Scope

### 10.1 Explicitly Excluded (MVP)

| Feature | Reason |
|---------|--------|
| Real authentication | Demo phase - mock OTP only |
| Backend API integration | Client-side demo |
| Database storage | Using LocalStorage |
| Admin/HR dashboard | Employee-facing only |
| Real file storage | Files not actually uploaded |
| Push notifications | Requires backend |
| Email notifications | Requires backend |
| English language | Hebrew-only MVP |
| Native mobile apps | Web-responsive only |
| Social sharing beyond WhatsApp | Limited scope |
| Leaderboard | Future gamification feature |
| Rewards redemption | Points are demonstrative |

### 10.2 Future Phases

**Phase 2 (Production):**
- Real authentication (SSO/OAuth)
- Backend API (Node.js/Python)
- Database integration
- Real file uploads
- Email notifications
- Admin dashboard

**Phase 3 (Enhancement):**
- Multi-language support
- Advanced analytics
- Leaderboards
- Rewards marketplace
- Native mobile apps

---

## 11. Dependencies & Risks

### 11.1 Dependencies

| Dependency | Type | Impact | Mitigation |
|------------|------|--------|------------|
| PassportCard logo | Asset | Blocking | Use SVG from website |
| Google Fonts (Rubik) | External | Low | Fallback fonts defined |
| Tabler Icons | External | Low | Can use emoji fallbacks |
| GitHub Pages | Hosting | Medium | Can deploy elsewhere |

### 11.2 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Animation performance on low-end devices | Medium | High | Test early, provide fallbacks |
| RTL layout issues | Medium | Medium | Test extensively, use logical properties |
| Scope creep | High | High | Strict MVP definition |
| Design changes mid-development | Medium | Medium | Freeze design before dev |
| Browser compatibility issues | Low | Medium | Progressive enhancement |

---

## 12. Release Criteria

### 12.1 MVP Definition of Done

**Functional:**
- [ ] All P0 features implemented and working
- [ ] All P1 features implemented
- [ ] All user flows completable end-to-end
- [ ] Mock data realistic and comprehensive

**Quality:**
- [ ] Zero console errors
- [ ] Animations smooth (60fps)
- [ ] Performance targets met
- [ ] Responsive on all breakpoints
- [ ] RTL layout correct

**Testing:**
- [ ] Cross-browser testing complete
- [ ] Mobile device testing complete
- [ ] Accessibility audit passed
- [ ] Demo script rehearsed

**Deployment:**
- [ ] Deployed to GitHub Pages
- [ ] Live URL accessible
- [ ] README documentation complete

### 12.2 Demo Readiness Checklist

- [ ] Full demo flow works without errors
- [ ] Compelling mock data (realistic names, positions)
- [ ] All animations polished
- [ ] Presentation talking points prepared
- [ ] Backup plan if live demo fails

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Stamp** | Digital badge earned for achievements |
| **Passport** | User's collection of stamps and stats |
| **Referral** | Candidate submitted by an employee |
| **Points** | Currency earned through referral activities |
| **Campaign** | Time-limited bonus opportunity |
| **Milestone** | Tenure-based achievement (3mo, 6mo) |

---

## Appendix B: Mock Data Requirements

### Positions (8-12 items)
- Mix of departments: R&D, Product, Marketing, HR, Finance
- Mix of locations: Tel Aviv, Ramat Gan
- Mix of types: Full-time, Part-time
- Include 2-3 "hot" positions
- Include 1-2 campaign positions with multipliers

### Referrals (5-8 items per user)
- Various statuses across the pipeline
- Mix of recent and older submissions
- Include at least one successful hire
- Include at least one rejected

### Stamps (8-15 per user)
- Cover all stamp types
- Appropriate dates
- Linked to referral IDs where applicable

---

## Appendix C: Related Documents

| Document | Location | Description |
|----------|----------|-------------|
| UX Design Specification | `ux-design-specification.md` | Complete design system |
| User Brief | `user-data/user-brief.md` | Original project brief |
| Design Request | `user-data/ux-design-request.md` | UX requirements sent |

---

**Document Approval**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | Ben.akiva | 2025-12-10 | ✓ |
| UX Designer | Sally | 2025-12-10 | ✓ |
| Tech Lead | TBD | | |

---

*End of PRD*

