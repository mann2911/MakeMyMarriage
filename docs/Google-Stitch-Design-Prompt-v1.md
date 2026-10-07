# MakeMyMarriage — Google Stitch design prompt

Approved direction: MakeMyMarriage wordmark and abstract linked M monogram; ivory, plum, sage, and blush palette. Initial scope: brand foundation, Google login, and dashboard. Copy the prompt below into Google Stitch. The product context is included, so the design tool does not need access to this repository.

---

Act as a senior product designer and brand designer. Design the first screens of **MakeMyMarriage**, a modern wedding-planning web application. Create an elegant, warm, contemporary interface with a distinctive brand identity, concise copy, and clear navigation. Produce one cohesive design direction with reusable components and responsive layouts.

## 1. Product context

MakeMyMarriage helps couples, their families, and organisers plan a wedding together. The main problems it solves are managing family guest lists, inviting different families to different events, and creating digital invitations.

The full application includes:
- Wedding and couple details.
- Events with dates, venue details, images, Google Maps links, and optional YouTube streams.
- Family-based guest lists and event-specific invitations.
- Digital Kankotri: one fixed English PDF template, exactly one page per included event, with no cover page. A master PDF includes every event; a family's PDF includes only its invited events.
- Per-event family RSVPs with attendance totals.
- Automatic email reminders.
- Tasks, assignees, and due dates.
- Vendor contacts, budget, expenses, payment records, and receipt images.
- A wedding website with two or three templates.
- A shared photo gallery where guests upload and download photos without creating an account.

The interface and invitations are English. Version 1 is free. Design for weddings with around 500 guests and five events. These are representative sizes, not advertised hard limits.

Design only the brand foundation, login, and dashboard in this first pass. Use the other features to inform navigation and future reusable components; do not generate all their pages yet.

## 2. Confirmed product rules

- Google is the only sign-in method for owners and viewers. One Google account belongs to one wedding; one wedding can have multiple owners/viewers. Do not add a wedding switcher.
- Owners create and edit content. They cannot delete anything, remove members, or demote owners. No trash, archive, hide, or deletion controls.
- Viewers see planning information, including finances, but cannot edit. All owners have the same role; no special super-owner or protected-couple role.
- Guests access family invitations, RSVP, and photos through private invitation links, without Google login. The login page is for planners, not guests.
- RSVP numbers are per event. Do not add attendance across events and present it as unique people.
- Expenses represent committed costs; payments are separate. Budget, committed amount, paid amount, outstanding amount, and budget remaining must be distinguished.
- Photos appear after processing without an approval queue. No owner or guest photo-removal controls.
- Reminders use email, not automated WhatsApp/SMS.
- No paid upgrade banners, subscriptions, marketplace, gift registry, chat, AI assistant, or wedding inspiration board.

## 3. Visual direction

Aim for contemporary editorial elegance combined with a practical planning interface. Make it feel personal and calm, with subtle wedding character and strong product usability.

Use this palette:
- Warm ivory background: #FAF8F5
- White surfaces: #FFFFFF
- Deep plum primary actions/active navigation: #695078
- Charcoal main text: #26232B
- Soft sage accent backgrounds: #DDE7DF
- Pale blush accent backgrounds: #F1E2DE

Choose complementary border, secondary-text, hover, focus, and semantic-status colours. Keep pale sage and blush as surface/decorative colours with readable dark text. Verify contrast; never rely on colour alone for status.

Typography: a clean, readable sans-serif for navigation, controls, and data; a restrained contemporary serif for selected large headings. Use at most two font families. Maintain readable body text and financial figures.

Use generous spacing, refined alignment, subtle borders, restrained shadows, and moderate corner radii. Prefer a few purposeful surfaces over a dense grid of tiny cards. Use consistent line icons with labels. Decoration should frame the content and never compete with data.

Avoid ornate mandalas, ceremonial clip art, heavy gold effects, dominant red-and-gold styling, stock bride-and-groom hero photographs, excessive hearts/rings, glassmorphism, neon gradients, and exaggerated pill-shaped containers. The result should feel like a distinctive modern wedding product.

Keep copy short: brief headings, meaningful buttons, and one-line help only where useful. Do not replace necessary labels with ambiguous icons.

## 4. Logo and brand foundation

Create a simple abstract linked **M monogram** suggesting two people coming together. Pair it with the exact wordmark **MakeMyMarriage**. It should be recognisable at small sizes and avoid the appearance of a dating-app logo.

Show:
- Primary horizontal logo: symbol plus wordmark.
- Symbol-only app icon/favicon treatment, checked at 24px and 32px.
- Monochrome and reversed versions.
- The chosen logo applied consistently to login and dashboard.

Keep the mark geometrically simple enough to reproduce as vector artwork. Provide editable/vector artwork if supported; otherwise provide a clear standalone reference. Do not promise export formats unavailable in the tool.

## 5. Google login screen

Create desktop and mobile versions.

Desktop may use an airy two-panel composition: a quiet brand illustration or abstract linked forms on one side, and a focused login area on the other. On mobile, reduce decorative content and prioritise the sign-in action.

Suggested copy:
- Heading: “Your wedding, beautifully organised.”
- Supporting line: “Bring your plans, people, and celebrations together.”
- Primary action: “Continue with Google”
- Small helper text: “For couples and their planning team.”

Use the recognisable Google G accurately within its sign-in button. Do not recolour or distort it to match the plum branding.

Do not add email/password fields, separate signup, forgot-password links, unrelated social providers, pricing, or a long marketing section. First-time account creation happens through the same Google action.

Include a compact loading state and a failed/cancelled sign-in state with a retry path. Keep primary sign-in visible at typical mobile heights. Do not invent testimonials, customer counts, or security-certification badges.

## 6. Owner dashboard

Create a populated desktop dashboard and its mobile equivalent.

Header:
- Wedding identity: “Aarav & Meera”.
- A concise greeting such as “Your celebration is taking shape.”
- Wedding date and a subtle countdown.
- Profile/avatar and a small Owner label.
- No wedding selector, generic global search, or unexplained notification bell.

Suggested navigation grouping:
- Planning: Overview, Events, Guests, Tasks.
- Budget: Expenses, Vendors.
- Sharing: Invitations, Wedding website, Photos.
- Settings near the bottom for Wedding details and Collaborators.
- Email reminders are available within Guests; do not make them an unrelated top-level destination.

Keep navigation visible and labelled on desktop. Use a simple labelled navigation drawer on mobile. Indicate the active page clearly. “Invitations” leads to Kankotri; distinguish it from “Wedding website”.

Use a clear content hierarchy:
1. Wedding identity and the next useful action.
2. Compact RSVP and task summaries with a small upcoming-event summary.
3. Upcoming events and tasks needing attention.
4. Budget overview, category breakdown, and next payments.

Prioritise “Add family”, “Add event”, and “Create invitation”. Make one visually primary and the others quieter; avoid repeating the same buttons across every section.

Show upcoming event names, date/time, and venue, with small restrained image accents if helpful. Show a short task list with assignee, due date, and completion state. Owners can mark tasks done. Distinguish overdue items without overwhelming the page.

For RSVP, include a selected-event label or lightweight event selector. Distinguish family responses from people attending. No misleading overall guest total across multiple events.

For money, use labelled figures and one compact category chart. Prefer a useful chart with readable values and an accessible textual summary over decorative charts. Clearly distinguish payments already made from costs committed and unpaid balances. Include upcoming vendor payments below or beside the chart.

### Consistent fictional demo data

Treat the mock screen date as **15 January 2027**:
- Couple: Aarav & Meera.
- Wedding: 14 February 2027 — 30 days to go.
- Events: Mehndi on 11 February, Garba on 12 February, Haldi on 13 February, Wedding on 14 February, Reception on 15 February.
- Use plausible fictional venues and consistent times.
- Wedding-event invitations: 160 families, representing 500 invited people.
- 120 families responded: 110 attending and 10 declined; 40 families still pending.
- Those 110 attending families have confirmed 360 people.
- Therefore RSVP response progress is 75% of families. Do not label 360/500 as the response rate.
- Tasks: 18 of 30 completed; 2 of the 12 remaining tasks are overdue.
- Budget: ₹15,00,000.
- Committed expenses: ₹12,00,000.
- Paid: ₹8,00,000.
- Outstanding: ₹4,00,000.
- Budget remaining: ₹3,00,000.
- Committed category totals: Venue ₹4,00,000; Catering ₹3,50,000; Decor ₹1,80,000; Photography ₹1,50,000; Outfits ₹1,20,000.

Use only the sample data needed to make the screen useful. Do not cram every number into the first viewport. Any additional payment examples must remain consistent with the totals.

## 7. Essential dashboard variants

A. First-time owner dashboard:
- Wedding has been created but there are no events, guests, or expenses.
- Show a calm setup sequence: Add events → Add families → Create invitations.
- Include secondary guidance for inviting the planning team.
- Show true zero/empty states. Do not label unset budgets as zero or show fabricated progress/charts.

B. Read-only viewer dashboard:
- Same visual system and access to planning/financial summaries.
- Show a subtle Viewer/read-only indicator.
- Omit creation, editing, uploading, and task-completion controls.
- Do not fill the page with disabled controls or lock icons.
- Existing navigation and permitted viewing/downloading remain available.

Also show a representative loading state and a section-level data error with Retry. Keep internal implementation terminology out of user-facing copy.

## 8. Reusable components and responsive behaviour

Provide a compact component/style sheet covering:
- Logo usage, colour roles, typography, spacing, borders, and corner radii.
- Primary/secondary/text buttons; Google sign-in button.
- Navigation items, status badges, summary blocks, event cards, task rows, financial figures, and a chart legend.
- Inputs, selectors, empty states, focus/hover/loading/error states.

Use consistent components and editable text. If available, use reusable styles/variables and layout constraints suitable for later Figma handoff. Clearly organise named screens rather than delivering one flattened collage.

Reference widths: 1440px desktop and 390px mobile. Mobile should prioritise the next action, current event/RSVP status, and urgent tasks, with finances lower down. Avoid horizontal overflow, tiny table text, icon-only navigation, and charts that depend on hover. Aim for comfortable touch targets and visible keyboard focus.

## 9. Implementation context and deliverables

The eventual application uses Next.js, a modular monolithic backend, MongoDB, and AWS S3. PDFs, uploads, and email delivery may finish asynchronously, so use meaningful progress/success/error patterns. These technologies should not appear in product copy. Prefer layouts and components that can be implemented responsively in React/CSS without elaborate animation or rasterised UI text.

Deliver:
1. Logo/brand sheet.
2. Desktop and mobile Google login.
3. Desktop and mobile populated owner dashboard.
4. First-time owner dashboard, including mobile adaptation.
5. Read-only viewer dashboard, including mobile adaptation.
6. Compact reusable component/style sheet and representative interaction states.

For this pass, concentrate on these deliverables. Use future-feature context to make the navigation coherent, without generating the full application. Provide polished designs with minimal explanatory commentary.
