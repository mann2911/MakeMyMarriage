# MakeMyMarriage — Version 1 Product Requirements Document

**Status:** Approved for version 1; explicitly marked review items remain open  
**Version:** 1.1 — revised authentication, permissions, membership, and Kankotri scope  
**Date:** 30 September 2026  
**Basis:** Requirements agreed with the product owner in this conversation. MakeMyMarriage is the working product name.

## 1. Product summary

MakeMyMarriage is a web application that helps couples, their families, and organisers coordinate a wedding in one shared workspace. Its primary value is simplifying family guest management and digital invitations, the two most difficult parts of the founder’s own wedding planning experience.

Couples enter wedding and event information once, invite families to selected events, generate personalised multi-page Kankotri PDFs, and collect attendance responses without requiring guests to create accounts. Tasks, vendor payments, a wedding website, email reminders, and a shared photo gallery support the same wedding workflow.

Version 1 is free to users. The application interface is English. Kankotri invitations are also English only.

## 2. Goals and success measures

### Goals

1. Reduce repeated entry of wedding, event, and invitation information.
2. Make it easy to invite different families to different sets of events.
3. Collect useful attendance counts with minimal effort for guests.
4. Give couples and collaborators a shared view of tasks, spending, and payments.
5. Collect photos taken by guests in one wedding gallery.

### Measurement plan

Numeric business targets will be agreed before the pilot; these are proposed measures, not validated outcomes.

| Measure | Definition |
|---|---|
| Wedding activation | Share of created weddings that add an event, a family, and generate an invitation |
| Invitation preparation time | Time from starting a family invitation to a successful PDF generation, measured alongside setup time |
| RSVP completion | Families responding to every invited event divided by families invited, measured by the RSVP deadline |
| Guest journey completion | Share of invitation visits that lead to a submitted RSVP |
| Planning usefulness | Pilot feedback on whether the application reduces repeated entry and coordination effort |
| Reliability | PDF generation success, email delivery outcomes, and successful photo uploads |

Do not place guest names, email addresses, private invitation tokens, receipts, or photo contents in analytics events.

## 3. Users and access model

| User | Access and responsibilities |
|---|---|
| Owner | Couple member, family member, or organiser who can create, view, and edit wedding content and invite collaborators, but cannot delete anything or remove/demote owners. |
| Viewer | Authenticated collaborator with read-only access to the planning workspace, including tasks, expenses, receipts, and vendor contacts. |
| Guest | Accesses a family invitation without an account; sees relevant guest-facing information, responds for the family, and uploads/views/downloads gallery photos. |

There are exactly two workspace roles: **owner** and **viewer**. Guest access is a separate invitation-based flow, not a third workspace role. All owners follow the same rules; there is no protected-couple distinction.

Each Google account can create or join **one wedding only**, as either an owner or viewer. A wedding can have multiple owner and viewer accounts. Organisers must use a different Google account for each additional wedding and sign out/sign in to change accounts; there is no wedding switcher or self-service wedding transfer.

### Owner safeguards

- Owners can create and edit records but cannot delete wedding content, the wedding itself, or membership records. This includes events, families, tasks, vendors, expenses, payments, receipts, and gallery photos.
- Owners cannot remove or demote any owner, including themselves. Viewers cannot delete or mutate records either.
- Do not add archive, hide, soft-delete, or clear-all actions as deletion workarounds.
- Updating invited-event selections, rotating compromised guest links, and revoking an unaccepted collaborator invitation remain access-management operations; retain their records. Owners may promote viewers to owners, but cannot remove members.
- Account erasure, exceptional support removal, and retention cleanup are separate operational policies to settle before launch; they are not owner features.

## 4. Scope and constraints

- Responsive web application for mobile and desktop browsers.
- Target planning scenario: approximately **500 individual guests across five events per wedding**. These are validation targets, not agreed hard limits.
- Multiple households/families may comprise those guests.
- Free version 1; no billing or paid plans.
- No fixed launch date or development budget has been set.
- One fixed English Kankotri template and two or three wedding website templates.
- No wedding board in version 1.
- Technology choices, vendors, hosting, and operating-cost estimates belong to technical design and feasibility work.

## 5. Core user journeys

### 5.1 Create a wedding and collaborate

1. A user signs in with Google and, if not already assigned to a wedding, creates a wedding workspace.
2. They enter couple details and invite their partner by email.
3. They invite family members or organisers as owners, or collaborators as viewers.
4. Recipients accept using the matching Google account, provided it is not assigned to another wedding.
5. On later sign-ins, each account opens its single wedding workspace.

### 5.2 Prepare events and invitations

1. An owner creates events with dates, locations, descriptions, and images.
2. They add or import families, contact information, and invited family sizes.
3. They choose which events each family is invited to.
4. They preview the event pages generated using the single English Kankotri template; there is no introductory page.
5. They download the complete master PDF or a family-specific PDF and share the family invitation link/PDF.

### 5.3 Respond as a family

1. A guest opens the personal family invitation link without registering.
2. They see only the events their family is invited to.
3. They provide a single attendance total for each event, without an adult/child breakdown.
4. They submit the response and can revisit the link to update it under the RSVP editing rules.
5. Owners see updated event totals and can record responses received by phone or in person.

### 5.4 Coordinate planning and payments

1. Owners create and assign tasks, and record vendor contacts and agreed costs.
2. They record payments against expenses and attach receipt images.
3. The dashboard shows outstanding work, attendance, budget use, and remaining payments.

### 5.5 Share memories and watch remotely

1. Guests open the wedding gallery through their invitation access.
2. They upload photos, which appear immediately after successful processing.
3. Wedding participants with gallery access view and download shared photos.
4. Guests can open the relevant YouTube live link or embed where configured.

## 6. Functional requirements and acceptance criteria

### FR-01 — Authentication and wedding setup

**Requirements:** Google-only sign-in and logout, wedding creation, couple details, and email-based collaborator invitations. First Google sign-in creates the application account. No passwords or email magic-link login; Google handles recovery of the Google account.

**Acceptance criteria:**

- An authenticated Google user without a wedding can create one and return to its saved information. A user already assigned to a wedding cannot create or join a second.
- The partner can join the same workspace through an email invitation.
- An invitation cannot be accepted into an unrelated email account.
- Expired, revoked, or already-used collaborator invitations have clear outcomes and can be reissued by an owner where appropriate.
- A user without membership cannot access the planning workspace.

### FR-02 — Roles and single-wedding membership

**Requirements:** Owner/viewer permissions, email collaborator invitations, one wedding per Google account, and no deletion permissions. No protected-owner marker or wedding selector.

**Acceptance criteria:**

- Owners can create and edit wedding records; viewers can read but cannot mutate them, including through direct requests. Deletion requests fail for both roles.
- A guest cannot access budgets, receipts, internal tasks, contact lists, or membership management.
- A second wedding creation or invitation acceptance using an already-assigned Google account is rejected without changing the original membership.
- Concurrent create/join attempts cannot assign an account to two weddings. Multiple accounts can join the same wedding.
- Attempts to remove or demote an owner fail regardless of which owner initiated them. Whole-wedding deletion and member removal are unavailable.

### FR-03 — Event management

**Fields:** Name, date, start time, optional end time, description, cover image/theme, venue name, address, latitude, longitude, and Google Maps link. Store a wedding timezone for schedules and reminders; the interface must make event times unambiguous.

**Acceptance criteria:**

- Owners can create, edit, and list events; they cannot delete events.
- Coordinates are validated and a supplied or generated map link opens the intended location.
- Event details are reused in the website and newly generated invitations.
- Updating an event updates live pages; previously downloaded PDFs remain static and must be regenerated.
- Editing event timing updates pending reminders; no event deletion action is offered.

### FR-04 — Family and guest management

**Requirements:** Family/household name, contact name, optional email and phone, invited family size, bride/groom/shared grouping, and selected invited events. Support spreadsheet import/export with a defined template, validation, and duplicate review. Individual named guest records are optional in the proposed V1 model; family counts are sufficient for RSVP.

**Acceptance criteria:**

- An owner can invite one family to a subset of events without affecting other families.
- A family without email can still receive a manually shared link and respond.
- Imports report invalid rows and potential duplicates instead of silently creating incorrect records.
- Owners can review imported records and export family and RSVP information.
- Expected and confirmed attendance totals derive consistently from family records and event responses.

### FR-05 — Kankotri PDF generation

**Requirements:** One fixed English template with controlled text/image fields. Each included event receives exactly one page with couple names, event details, and appropriate imagery. No introductory/cover page, template selector, or Gujarati content. Couple/family details remain in wedding setup and can be used on the wedding website.

**Acceptance criteria:**

- Owners can preview and download a multi-page PDF.
- A master PDF includes all events; a family PDF includes only that family’s invited events.
- Four included events produce exactly four pages; a family invited to two events receives exactly two pages.
- English text and images render without clipping. Validate field lengths to preserve one page per event; zero included events produces an explanation instead of an empty PDF.
- Template fields are validated and optional empty fields do not leave broken layouts.
- Regeneration uses current saved wedding information.
- The downloadable PDF and the invitation link can be shared manually. Whether guest emails attach PDFs or link to downloads is an implementation decision.

### FR-06 — Guest links and RSVP

**Requirements:** Private, difficult-to-guess family access links; no guest account. Attendance status and a single numeric total per invited event, plus an RSVP deadline. Owners can record and correct responses.

**Acceptance criteria:**

- A family sees and responds only to invited events, including when attempting to access another event directly.
- An attending response requires a positive whole-number count; a declined response has a count of zero. No response remains distinct from a decline.
- The response count cannot exceed the configured invited family size; owners may change that size first.
- Submitting an updated response replaces the previous count rather than adding another response.
- The family can review its saved response after submission.
- Owners can distinguish pending responses from completed responses per event.
- Owners can revoke or replace a compromised family link; the old link then stops granting access.
- A shared family link grants access to that family’s guest view, so the sharing interface explains this plainly.

**Proposed default requiring review:** Guests may edit until the RSVP deadline; owners may edit afterward. Exact deadline behaviour is not yet confirmed.

### FR-07 — Automatic email reminders

**Requirements:** Automatic reminders for pending RSVP responses and upcoming invited events, using a family contact email. No WhatsApp automation in V1.

**Acceptance criteria:**

- A family without email is visibly marked as ineligible for email reminders but retains guest access.
- RSVP reminders are sent only where invited-event responses remain pending.
- Event reminders contain only relevant invited events and do not send to families that declined that event.
- Changing invited-event selections or event schedules updates pending reminders accordingly, while retaining the underlying records.
- A retry does not cause duplicate logical reminders.
- Owners can see pending/sent/failed delivery status as available from the email provider; “sent” must not be presented as proof the message was read.
- Guests can opt out of guest reminder emails, without losing invitation access.

**Proposed defaults requiring review:** One RSVP reminder two days before the deadline; one event reminder 24 hours before the event. Skip reminders whose scheduled time has already passed. Final policy must cover late invitations, rescheduled events, and whether unanswered families receive event reminders.

### FR-08 — Task planner

**Requirements:** Starter checklist and custom tasks with title, optional description, assignee, due date, event association, and completion status.

**Acceptance criteria:**

- Owners can create, assign, edit, and complete tasks, but cannot delete them.
- Assignment does not grant additional permissions: viewers cannot update assigned tasks.
- Owners can filter tasks by status, assignee, and event and identify overdue work.
- Completing a task updates dashboard counts.

### FR-09 — Vendor directory

**Requirements:** Vendor name, category/service, contact person, phone/email, notes, and links to relevant expenses or events.

**Acceptance criteria:**

- Owners can maintain vendor contacts and associate them with costs without re-entering the contact record.
- Vendor information is accessible to workspace members, not guests.
- Vendor details can be corrected; vendor deletion and archiving are unavailable.

### FR-10 — Budget, expenses, payments, and receipts

**Requirements:** Overall budget, expense categories, committed expense amount, optional event/vendor association, payment due date, individual payment records, payer, payment date, and receipt image attachment. Allow multiple payments against an expense.

**Financial definitions:**

- Committed spending = sum of expense amounts.
- Paid amount = sum of recorded payments, without counting receipt uploads as additional payments.
- Outstanding amount = committed amount minus recorded payments.
- Budget remaining = wedding budget minus committed spending; overspending is shown explicitly.

**Acceptance criteria:**

- An expense of 80,000 with a payment of 20,000 displays 60,000 outstanding in the selected currency.
- Owners can add and correct payment records and attach/view receipt images, but cannot delete payments or receipts.
- Updating a payment updates the related balance and dashboard totals.
- Receipts are private to owners/viewers and cannot be opened through guest access.
- Invalid amounts are rejected and rounding is consistent.

**Proposed defaults requiring review:** One currency per wedding, initially INR; no currency conversion, refund workflow, or payment collection. Reject payments that exceed an expense until its amount is corrected. The app records payments; it does not move money.

### FR-11 — Dashboard

**Requirements:** Upcoming events, task completion and overdue tasks, invited/confirmed/pending attendance, budget/committed/paid/outstanding figures, category spending chart, and upcoming payments.

**Acceptance criteria:**

- Summary figures match underlying records and update after edits.
- Event attendance is reported per event; adding event attendance totals must not be labelled as unique wedding guests.
- Charts have clear labels and equivalent numeric summaries.
- Empty states direct owners to add the missing information.

### FR-12 — Wedding website

**Requirements:** Two or three templates using saved couple details, photos, welcome text, and appropriate event information, with invitation/RSVP, gallery, and optional stream access.

**Acceptance criteria:**

- Owners can choose a template, preview, publish, and update their wedding site.
- Template changes preserve the wedding’s saved data.
- Generic site visitors cannot retrieve private event information, family responses, guest lists, or planning records.
- Personal invitation access reveals only the family’s invited events.
- Gallery access remains restricted to people with wedding guest access or workspace membership.

**Proposed default requiring review:** A public couple landing page with private event details available through invitation links. Custom domains are outside V1.

### FR-13 — Guest photo gallery

**Requirements:** Guests upload photos without accounts through wedding invitation access. Successful uploads appear immediately to others with that wedding’s gallery access, with no owner approval queue. Guests may view and download shared photos. Owners cannot remove photos, and V1 does not expose guest self-deletion.

**Acceptance criteria:**

- A guest can select and upload supported photos on mobile and see upload progress, success, and failures.
- Successfully processed photos appear in the correct wedding gallery without approval.
- Invalid files and files exceeding published limits are rejected with a clear message.
- Guests cannot access another wedding’s gallery by changing a URL or record identifier.
- Owners and guests have no photo removal, hiding, or deletion action.
- Interrupted uploads can be retried without requiring all successful uploads to be repeated.
- Gallery views load in batches rather than downloading every original photo at once.

**Decisions needed during technical design:** Supported formats, per-file and per-wedding limits, compression, storage costs, retention, and an operational process for exceptional removal requests. Unlimited storage is not promised.

### FR-14 — YouTube live stream

**Requirements:** An optional YouTube URL configured by an owner and displayed as an embed or link for the relevant wedding/event.

**Acceptance criteria:**

- Supported links render correctly; an open-on-YouTube fallback is available if embedding fails.
- Event-specific stream links follow event invitation visibility.
- The product does not promise to override YouTube’s access restrictions or host the stream itself.

## 7. Shared product rules

1. Wedding and event records are the source for the website and regenerated PDFs.
2. Invitation eligibility and RSVP response are separate: inviting a family does not imply attendance.
3. One family may respond differently for each event.
4. Workspace permissions and guest access are enforced for data requests, not only hidden controls.
5. A wedding’s contacts, payments, receipts, and internal tasks never appear on guest-facing pages.
6. Viewers intentionally have access to sensitive planning information, including finances; owners should see that explanation when inviting one.
7. Downloaded PDFs and photos cannot be recalled after sharing or downloading.
8. Edits must update scheduled reminders and financial/dashboard totals consistently. No owner-facing deletion or archival shortcuts are included.

## 8. Non-functional requirements

| Area | Requirement / release evidence |
|---|---|
| Mobile usability | Invitation viewing, RSVP, map access, PDF download, and photo uploads work on common mobile browsers; the owner workspace is responsive. |
| Accessibility | Labelled inputs, keyboard access, visible focus, readable contrast, and understandable validation; use WCAG 2.2 AA as a proposed design target. |
| Isolation and privacy | Verify access across different weddings, families, roles, private media, and invitation links, including direct requests. |
| Security | Secure authentication/session handling, validated uploads, protected storage, rate limits on public guest operations, and no secrets in client code. |
| Reliability | Durable saved records, safe retries for submissions/jobs, visible errors, and recoverable upload/PDF failures. |
| Capacity | Test representative data of 500 people distributed across families and five events. Define concurrent-user and media-load targets before load testing. |
| Performance | Paginated guest/gallery lists and background handling for slow operations. Set measurable page, RSVP, and PDF time targets during technical design before release. |
| Backups and recovery | Production backups and a verified restore procedure before launch; agree retention and recovery objectives during technical design. |
| Operations | Track failed email/PDF/upload jobs and application errors without logging sensitive payloads or guest access tokens. |
| Data lifecycle | Document export, operational erasure requests, media retention, and backup expiry behaviour before production use; no owner-facing wedding deletion. |

## 9. Conceptual product data

This is a product-level model, not a database schema.

- **Account:** An authenticated person.
- **Wedding:** Shared workspace, couple details, timezone, budget, template choices, and website state.
- **Membership:** Account, its single wedding, and owner/viewer role; no special couple marker.
- **Collaborator invitation:** Email, wedding, proposed role, and acceptance state.
- **Event:** Wedding occasion with time, venue, coordinates, and image.
- **Family:** Household contact details and invited size.
- **Event invitation:** Family-to-event eligibility.
- **RSVP:** Family/event response and attendance count.
- **Guest access link:** Revocable access to one family’s guest experience.
- **Task:** Assigned wedding work with status and due date.
- **Vendor:** Wedding-specific contact record.
- **Expense / payment / receipt:** Commitment, recorded settlement, and evidence respectively.
- **Photo:** Wedding gallery media and upload context.
- **Reminder:** Scheduled guest message and delivery state.

## 10. Out of scope for version 1

- Wedding/inspiration board.
- More granular workspace roles or custom permissions.
- Gujarati interface or invitation content, multiple Kankotri templates, introductory Kankotri pages, and automatic translation.
- Password/email-link login, multiple weddings per account, a wedding switcher, and special protected-owner roles.
- Owner-facing deletion/archival, member removal, owner demotion, and guest photo deletion.
- Automatic WhatsApp/SMS messaging.
- Guest registration requirements.
- Adult/child RSVP breakdown or mandatory named individual responses.
- Guest-photo approval queue.
- Custom live-stream hosting.
- Freeform invitation/page design editor, video invitations, or custom website domains.
- Vendor marketplace, booking, payment processing, or refunds.
- Native mobile apps, seating charts, travel/accommodation management, gift registry, and AI planning features.
- Paid subscriptions or premium-feature billing.

## 11. Dependencies and product risks

| Dependency / risk | Planned response |
|---|---|
| Email provider and sender setup | Select a provider, configure sender identity, and expose failures. Free user access does not mean zero delivery costs. |
| Guest media volume | Agree storage limits, compression, and retention before implementation; estimate realistic wedding costs. |
| Fixed event-page layout | Validate long English text and images against the one-page-per-event rule. |
| Invitation link forwarding | Use private revocable links and communicate that possession grants family-level guest access. |
| Owner permissions | Explain create/edit access and the inability to remove owners or delete records. |
| Immediate photo publication without removal controls | Upload validation remains; define an exceptional operational removal process before launch without adding an owner approval queue. |
| Maps and YouTube availability | Provide usable external links/fallbacks; do not depend on embedded content alone. |
| Broad V1 scope | Deliver in tested milestones while keeping the complete agreed scope visible. |

## 12. Delivery sequence within the SDLC

1. **Requirements review:** Approve this PRD and resolve the proposed defaults relevant to design.
2. **User flows and UI design:** Map owner, viewer, and guest journeys; review responsive screens and template samples.
3. **Technical design and feasibility:** Select infrastructure, estimate costs, define schema/API/access rules, and set operational limits. Add an SRS only where more detail is needed, avoiding duplicate requirements.
4. **Implementation milestones:**
   - A: Accounts, wedding setup, collaborators, and permissions.
   - B: Events, families, invitations/PDFs, and RSVP.
   - C: Tasks, vendors, payments/receipts, and dashboard.
   - D: Wedding website, shared gallery, email reminders, and YouTube integration.
5. **Verification throughout development:** Automated checks for important business rules and access boundaries, plus manual mobile and visual review.
6. **Pilot and release:** End-to-end checks, a limited real-couple pilot, fixes, and production readiness review.
7. **Maintenance:** Monitor reliability, gather feedback, and prioritise subsequent releases.

These milestones organise delivery; they do not remove agreed features from V1.

## 13. Version 1 release acceptance

- Core journeys work from wedding creation to a family invitation, RSVP, and guest photo upload.
- Master and family PDFs use the single English template and contain exactly one page per included event with no cover page.
- Google-only authentication, single-wedding membership, owner/viewer/guest boundaries, cross-wedding isolation, no-deletion rules, and owner-demotion rejection checks pass.
- A representative wedding with 500 guests and five events produces consistent attendance and financial totals.
- Email reminders respect invitations, RSVP status, schedule changes, and opt-outs, with safe retry behaviour.
- Receipts remain private; gallery uploads appear immediately to authorised wedding participants.
- Mobile workflows and error/empty states are reviewed.
- Backup restoration, monitoring, storage limits, and deletion/retention behaviour are verified or documented as required.
- No unresolved defect prevents core use, exposes private data, corrupts records, or misstates financial totals.
- Pilot feedback and success-measure baselines are recorded before wider rollout.

## 14. Review items — not yet final decisions

The feature scope is agreed. The following details are proposed or intentionally deferred and must not be presented as user-approved requirements:

| Item | Proposed direction / point to settle | Resolve by |
|---|---|---|
| RSVP cutoff | Guest edits until deadline; owner edits afterward | User-flow approval |
| Reminder timing | Two days before RSVP deadline; 24 hours before each event | User-flow approval |
| Unanswered event reminders | Decide whether to include families with no RSVP | User-flow approval |
| Initial invitation email | Manual sharing is included; decide whether initial guest email sending is also required | User-flow approval |
| Site visibility | Public couple introduction, invitation-only private event details | User-flow approval |
| Currency and overpayments | Single currency, initially INR; proposed overpayment rejection | Finance design |
| Guest records | Family counts sufficient; named individuals optional | Guest-management design |
| Gallery lifecycle | Formats, limits, retention, and exceptional operational removal process | Technical design |
| Operational erasure and recovery | Confirm retention, recovery window, and support handling of account/data erasure; no owner deletion feature | Technical design |
| Performance and costs | Set latency/concurrency targets and estimate monthly/per-wedding costs | Technical design |
| Success thresholds | Agree pilot targets after establishing baseline measures | Before pilot |

## 15. Revision 1.1 decisions

Google sign-in is final. Each account belongs to at most one wedding; each wedding may have many accounts. All owners have the same create/edit permissions, cannot remove/demote owners, and cannot delete records. Kankotri uses one English template, one page per included event, and no introductory page. Wedding website templates remain two or three. Earlier requirements for multiple memberships, protected-couple roles, owner deletion, and Gujarati/multiple Kankotri templates are superseded.
