# MakeMyMarriage — API Specification, Version 1

**Status:** Draft API contract for review; endpoints are not implemented  
**Version:** 1.0  
**Date:** 3 October 2026  
**Baselines:** [PRD 1.1](PRD-v1.md), [approved Database Design 1.0](Database-Design-v1.md), [architecture 1.2](System-Architecture-v1.md), [screen map 1.0](User-Flows-and-Screen-Map-v1.md)

**Machine-readable contract:** [OpenAPI document](api/openapi-v1.json). It uses OpenAPI 3.1.1, a deliberate compatibility target rather than a claim about the latest release. The file contains typed request/response schemas, security declarations, examples, endpoint permissions, and links to PRD requirements. [OpenAPI 3.1.1 specification](https://spec.openapis.org/oas/v3.1.1.html)

## 1. API boundary

The same-origin base path is `/api/v1`. Next.js Route Handlers invoke shared domain services; rendered server pages may call the same services directly, with identical authorization. Nothing in this document provisions infrastructure or builds a live endpoint.

Workspace, guest, and public projections are separate:

- **Workspace:** Google-authenticated owner/viewer; scoped to that account's single wedding.
- **Guest:** HttpOnly session derived from a private family invitation; no Google account required. Family/wedding is taken from the session, not supplied in request bodies.
- **Public:** Limited published couple website, if public visibility is approved.
- **Purpose-scoped email preference link:** Can read/change one family's reminder preference only. It cannot create a guest or workspace session.

No delete, member-removal, owner-demotion, archive, photo-hiding, account-transfer, or wedding-switching endpoint is present. Invite revocation and family event-eligibility changes retain records and follow the already agreed access-management exceptions.

## 2. Google authentication and request security

The selected authentication library owns Google OAuth initiation/callback routes under its adapter namespace, proposed `/api/auth/*`. Do not reimplement provider OAuth in the versioned domain API. There is no password registration/reset or email magic-link login. Exact adapter cookie names, callback paths, and provider setup are finalized during the authentication milestone; OpenAPI cookie names identify logical session boundaries.

`GET /me` returns account plus its one membership or null. Google login alone does not create a wedding. Creation or invitation acceptance is explicit and transactional. Changing Google display/email fields does not create another identity or reset the membership limit.

Every request checks current access. A path wedding ID is not authorization. Unknown/cross-wedding/cross-family records return 404 without leaking whether they exist. A viewer trying to edit an accessible wedding gets 403. Guest photo uploads have their own routes; a viewer cannot use member endpoints to gain upload rights.

All POST/PUT/PATCH requests validate same-origin Origin and an `X-CSRF-Token`. `GET /csrf` supplies the application middleware's token bound to a secure same-site context; it is not a login or an authorization credential. This includes anonymous invitation exchanges to prevent replacing a browser's guest context through cross-site requests. Do not add permissive credentialed CORS. Auth adapter OAuth state/PKCE safeguards remain the adapter's responsibility.

`WorkspaceSession` and `GuestSession` are separate cookies. Responses containing personal data, tokens, preferences, or signed download URLs use private/no-store caching. Revoke the current workspace session on logout without deleting the account or membership. No secrets appear in URLs except the originally shared browser invitation link, which is exchanged through a POST body and removed from browser navigation afterward. Bodies containing tokens and responses containing private share links must be redacted from logs.

## 3. Payload conventions

- JSON uses camelCase. IDs are ObjectId strings; times use RFC 3339 with offsets and return in UTC. Date-only fields use real `YYYY-MM-DD` calendar dates.
- Money is a decimal string of **minor units**; e.g. `"2000000"` means ₹20,000 if configured currency is INR with scale 2. Server enforces integer range and currency policy. Never send float rupee amounts as minor units.
- A single-resource success returns `{ "data": ... }`. A list returns `{ "items": [...], "nextCursor": null | "..." }`. Limits default to 25 and max 100; cursors bind to scope, filters, and sort.
- Requests reject unknown fields. Clients cannot set actor, paid totals, object keys, role outside allowed actions, publication internals, or operational state.
- PATCH updates only explicitly supplied fields. Nested objects such as contact/couple/venue are complete replacements for that field and must satisfy their schema. Omitted top-level fields remain unchanged. Only explicitly nullable fields may be cleared; null does not mean delete a record.
- Clearing optional task assignment/event association or end time is an ordinary edit. No receipt-detach, member removal, photo hiding, or record deletion is implied.
- Lookup registries and actual upload/import limits come from `/configuration` (workspace) or `/guest/upload-limits`. Servers still enforce them; clients cannot submit arbitrary policy configuration.
- Optional currency configuration is initialized from approved deployment/product policy. Until configured, financial writes return `POLICY_UNRESOLVED`; this contract does not invent a currency-change interface.

## 4. Version checks and idempotency

Mutable reads include a version. Changes require `expectedVersion` or the named parent version in their schema. Family RSVP submits the family version plus each changed invitation version. Payments include the expense version, and edits include the payment version. Stale values return 409 `VERSION_CONFLICT`; the caller reloads and reviews rather than automatically overwriting.

Every domain-changing operation marked with `Idempotency-Key` requires one key per intended mutation. Same actor/operation/key with the same canonical input returns the authorized stored result; changing input under a completed key returns 409 `IDEMPOTENCY_KEY_REUSED`. Fingerprints include path identifiers and the body, so a payment key cannot be replayed against another expense.

Transaction failures that never commit effects do not claim success. A corrected form is a new intended mutation and uses a new key. Existing mutation results are reauthorized on retry. Download/preview/token-resolution operations do not persist mutations just because they use POST to protect sensitive bodies or generate short-lived access grants.

For expired upload grants, do not replay an obsolete presigned URL as usable. Return `UPLOAD_GRANT_EXPIRED`; the client requests a new upload intent with a new key after the old reservation is released/expired. Successful uploaded assets are finalized/reused rather than uploaded twice. Token rotation replay must never rotate twice.

## 5. Error contract

```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "This record changed. Review the latest values before saving.",
    "requestId": "example-request-1",
    "currentVersion": 4
  }
}
```

Optional `fields` contains `{path,code,message}` entries. Do not return stack traces, database filters, tokens, other families' records, or storage credentials in errors.

| HTTP | Representative codes / meaning |
|---|---|
| 400 | `INVALID_JSON`, `INVALID_CURSOR`, `MALFORMED_REQUEST` |
| 401 | `SESSION_REQUIRED`, `SESSION_EXPIRED`, `GUEST_ACCESS_REVOKED` |
| 403 | `FORBIDDEN`, `CSRF_FAILED`, `INVITED_EMAIL_MISMATCH` (no private wedding details) |
| 404 | `NOT_FOUND`, `INVITATION_UNAVAILABLE` for unavailable or out-of-scope resources |
| 409 | `VERSION_CONFLICT`, `WEDDING_ALREADY_ASSIGNED`, `IDEMPOTENCY_KEY_REUSED`, `INVITE_ALREADY_ACCEPTED`, `DOCUMENT_STALE`, `DOCUMENT_NOT_READY`, `UPLOAD_GRANT_EXPIRED`, `STORAGE_LIMIT_REACHED`, `POLICY_UNRESOLVED`, `RSVP_CLOSED`, `OVERPAYMENT_NOT_ALLOWED` |
| 413 | `UPLOAD_TOO_LARGE`, `IMPORT_TOO_LARGE`, `REQUEST_TOO_LARGE` |
| 422 | `VALIDATION_FAILED`, `NO_INVITED_EVENTS`, `PDF_CONTENT_OVERFLOW`, `INVALID_REFERENCE`, `UNSUPPORTED_FILE_TYPE`, `ATTENDANCE_EXCEEDS_FAMILY_SIZE` |
| 429 | `RATE_LIMITED`; include Retry-After seconds |
| 503 | `DEPENDENCY_UNAVAILABLE`; committed async jobs remain discoverable through status endpoints |

Known authenticated-scope state failures may return detailed safe codes. Invalid public tokens return a generic unavailable message. A request to a nonexistent deletion route does not trigger deletion through another HTTP verb.

## 6. Endpoint inventory

Access labels: **account** requires Google login (including unassigned accounts); **member** allows owner/viewer in the named wedding; **owner** allows only that wedding's owners; **guest** requires the family session; **public** means no session requirement but token/origin checks still apply where specified. POST download operations are read capabilities, not viewer mutations.

| Method | Path (under `/api/v1`) | Access | Operation |
|---|---|---|---|
| GET | `/csrf` | public | Obtain same-site CSRF token |
| GET | `/me` | account | Read Google account and its single membership |
| POST | `/session/logout` | account | Revoke current workspace session |
| GET | `/configuration` | account | Read current registries and configured limits |
| POST | `/weddings` | account | Create first and only wedding for this account |
| GET | `/weddings/{weddingId}` | member | Read wedding details |
| PATCH | `/weddings/{weddingId}` | owner | Edit wedding details |
| GET | `/weddings/{weddingId}/dashboard` | member | Read planning and finance summaries |
| GET | `/weddings/{weddingId}/members` | member | List workspace members |
| POST | `/weddings/{weddingId}/members/{memberId}/promote` | owner | Promote viewer to owner |
| GET | `/weddings/{weddingId}/collaborator-invites` | member | List collaborator invitation metadata |
| POST | `/weddings/{weddingId}/collaborator-invites` | owner | Create invitation and queue email |
| POST | `/weddings/{weddingId}/collaborator-invites/{inviteId}/revoke` | owner | Revoke unaccepted invitation |
| POST | `/weddings/{weddingId}/collaborator-invites/{inviteId}/reissue` | owner | Reissue unaccepted invitation |
| POST | `/collaborator-invites/preview` | account | Preview invitation after Google email verification |
| POST | `/collaborator-invites/accept` | account | Join invited wedding with matching Google account |
| GET | `/weddings/{weddingId}/events` | member | List events |
| POST | `/weddings/{weddingId}/events` | owner | Create event |
| GET | `/weddings/{weddingId}/events/{eventId}` | member | Read event |
| PATCH | `/weddings/{weddingId}/events/{eventId}` | owner | Edit event |
| GET | `/weddings/{weddingId}/families` | member | List families |
| POST | `/weddings/{weddingId}/families` | owner | Create family |
| GET | `/weddings/{weddingId}/families/{familyId}` | member | Read family |
| PATCH | `/weddings/{weddingId}/families/{familyId}` | owner | Edit family |
| GET | `/weddings/{weddingId}/families/{familyId}/details` | member | Read family and event eligibility/RSVP |
| PUT | `/weddings/{weddingId}/families/{familyId}/event-invitations` | owner | Replace invited event selection while retaining history |
| PUT | `/weddings/{weddingId}/families/{familyId}/rsvp` | owner | Record owner correction or offline RSVP |
| POST | `/weddings/{weddingId}/families/{familyId}/invitation-link` | owner | Create or retrieve current private family invitation link |
| POST | `/weddings/{weddingId}/families/{familyId}/invitation-link/rotate` | owner | Replace compromised family link |
| GET | `/weddings/{weddingId}/tasks` | member | List tasks |
| POST | `/weddings/{weddingId}/tasks` | owner | Create task |
| GET | `/weddings/{weddingId}/tasks/{taskId}` | member | Read task |
| PATCH | `/weddings/{weddingId}/tasks/{taskId}` | owner | Edit task |
| POST | `/weddings/{weddingId}/tasks/starter-checklist` | owner | Insert missing starter checklist tasks |
| GET | `/weddings/{weddingId}/vendors` | member | List vendors |
| POST | `/weddings/{weddingId}/vendors` | owner | Create vendor |
| GET | `/weddings/{weddingId}/vendors/{vendorId}` | member | Read vendor |
| PATCH | `/weddings/{weddingId}/vendors/{vendorId}` | owner | Edit vendor |
| GET | `/weddings/{weddingId}/expenses` | member | List expenses |
| POST | `/weddings/{weddingId}/expenses` | owner | Create expense |
| GET | `/weddings/{weddingId}/expenses/{expenseId}` | member | Read expense |
| PATCH | `/weddings/{weddingId}/expenses/{expenseId}` | owner | Edit expense |
| GET | `/weddings/{weddingId}/finance` | member | Read budget and derived spending totals |
| PUT | `/weddings/{weddingId}/finance/budget` | owner | Set wedding budget |
| GET | `/weddings/{weddingId}/expenses/{expenseId}/payments` | member | List recorded payments |
| POST | `/weddings/{weddingId}/expenses/{expenseId}/payments` | owner | Record payment once |
| PATCH | `/weddings/{weddingId}/expenses/{expenseId}/payments/{paymentId}` | owner | Correct recorded payment without deletion |
| GET | `/weddings/{weddingId}/expenses/{expenseId}/payments/{paymentId}/receipts` | member | List payment receipt assets |
| POST | `/weddings/{weddingId}/upload-intents` | owner | Reserve upload and issue short-lived S3 POST grant |
| GET | `/weddings/{weddingId}/assets/{assetId}` | member | Read safe asset metadata |
| POST | `/weddings/{weddingId}/assets/{assetId}/finalize` | owner | Verify upload and queue safe processing |
| POST | `/weddings/{weddingId}/assets/{assetId}/download` | member | Authorize private file download |
| GET | `/weddings/{weddingId}/gallery` | member | List ready wedding gallery photos |
| POST | `/weddings/{weddingId}/documents/preview` | owner | Read fixed-template page preview |
| POST | `/weddings/{weddingId}/documents` | owner | Generate current master or family PDF |
| GET | `/weddings/{weddingId}/documents` | member | List generated-document metadata |
| GET | `/weddings/{weddingId}/documents/{documentId}` | member | Read generation status and current freshness |
| POST | `/weddings/{weddingId}/documents/{documentId}/download` | member | Authorize current PDF download |
| GET | `/weddings/{weddingId}/jobs/{jobId}` | member | Read sanitized job status |
| GET | `/weddings/{weddingId}/family-import-template` | owner | Download data-only family import template |
| POST | `/weddings/{weddingId}/family-imports` | owner | Validate uploaded spreadsheet and prepare preview |
| GET | `/weddings/{weddingId}/family-imports/{importId}` | owner | Read import progress |
| GET | `/weddings/{weddingId}/family-imports/{importId}/rows` | owner | Review validated rows and duplicate candidates |
| POST | `/weddings/{weddingId}/family-imports/{importId}/commit` | owner | Commit selected valid preview rows |
| POST | `/weddings/{weddingId}/family-exports` | owner | Prepare family/RSVP spreadsheet export |
| GET | `/weddings/{weddingId}/website` | member | Read website configuration |
| PATCH | `/weddings/{weddingId}/website` | owner | Select website template and slug |
| GET | `/weddings/{weddingId}/website/preview` | member | Read safe public-page preview |
| POST | `/weddings/{weddingId}/website/publish` | owner | Publish current safe website projection |
| GET | `/public/weddings/{slug}` | public | Read published public couple page |
| GET | `/weddings/{weddingId}/reminders` | member | Read automatic reminder schedule |
| GET | `/weddings/{weddingId}/email-deliveries` | member | Read delivery outcomes without read-receipt claims |
| POST | `/guest/exchange` | public | Exchange valid invitation token for guest session |
| GET | `/guest` | guest | Read personal family invitation |
| GET | `/guest/events/{eventId}` | guest | Read one currently invited event |
| GET | `/guest/rsvp` | guest | Read current family RSVP |
| PUT | `/guest/rsvp` | guest | Save family responses atomically |
| POST | `/guest/kankotri/download` | guest | Download current family-specific PDF |
| GET | `/guest/gallery` | guest | List ready photos in this wedding |
| POST | `/guest/gallery/{assetId}/download` | guest | Authorize shared gallery photo download |
| GET | `/guest/upload-limits` | guest | Read actual guest photo limits |
| POST | `/guest/upload-intents` | guest | Reserve guest photo upload |
| GET | `/guest/uploads/{assetId}` | guest | Read own-family upload progress |
| POST | `/guest/uploads/{assetId}/finalize` | guest | Verify own-family upload and queue processing |
| GET | `/guest/reminder-preference` | guest | Read own-family reminder preference |
| PATCH | `/guest/reminder-preference` | guest | Change own-family reminder preference |
| POST | `/reminder-preferences/resolve` | public | Read preference using purpose-scoped email link |
| POST | `/reminder-preferences/update` | public | Change preference using purpose-scoped email link |

## 7. Important request flows

### Create/join and collaborators

1. Google sign-in → `GET /me`.
2. Unassigned account creates a wedding or previews/accepts its matching-email collaborator invitation.
3. Create/join transactions enforce unique membership. A second wedding fails without orphaning a newly created wedding.
4. Pending invitations can be revoked/reissued; accepted members cannot be removed. Only viewer-to-owner promotion exists.
5. Organisers use a different Google account and matching invitation for each additional wedding.

### Family invitations and RSVP

Create family with invited event IDs. Use the dedicated event-selection endpoint to change eligibility, preserving old rows and invalidating affected PDFs/reminders. Family GET returns internal contact details only to members; guest endpoints return a separate projection.

Owner share-link retrieval creates/reuses the active link; rotation is a separate confirmed action. Guest exchange accepts an invitation-purpose token only, then sets the family-scoped cookie. Guest RSVP requires unique currently invited event IDs and validates counts within the saved invited size. All submitted changes commit together. Omitted events remain unchanged; pending is distinct from declined. Resetting an answered response to pending and deadline behavior remain subject to final policy.

### Payment and receipt

Record payment → response includes saved payment and new expense balance → create receipt upload intent with existing payment ID → upload to S3 → finalize → poll asset status. An attachment failure does not re-create the payment. Edits transactionally apply the amount delta; `expenseId` cannot be changed. No delete/void/archive fallback is added for mistaken records.

### Photos and files

Owner upload accepts only galleryPhoto, receipt, eventCover, couplePhoto, or importSource. Guest upload forces galleryPhoto and derives family/wedding from the session. Generated PDFs, exports, and public copies are worker-created only.

S3 grant upload is followed by finalize; 202 means processing accepted, not that unsafe bytes have been published. Poll the asset (or workspace job) until ready/failed. Processed guest photos appear immediately in the wedding gallery. Pending upload metadata is limited to the uploading family; ready gallery photos are wedding-wide. No file deletion controls exist.

Gallery download only authorizes ready galleryPhoto assets. Workspace generic download refuses generatedPdf so PDF freshness checks cannot be bypassed. Family PDF download never accepts a master document ID. Signed grants remain usable until expiry; already downloaded files cannot be recalled.

### Kankotri and background work

Owner previews master/family scope with one fixed English event template, then starts generation. A background response provides a job and document. Page count must equal included events. Repeated generation at the same data version deduplicates. A ready document can become stale after changes; freshness checks apply even before status reconciliation finishes.

Guests and viewers cannot trigger generation. Guest download returns not-ready/stale guidance rather than issuing a file with obsolete event eligibility. A generic job endpoint exposes sanitized metadata only to workspace members; guest upload progress has its own scoped endpoint.

### Imports, exports and reminders

Import uses ready uploaded source → asynchronous validation → preview rows → explicit commit of selected valid rows. Imported families are deduplicated by source row per import; semantic duplicates across new imports require review. Owner-only export is the conservative contract while viewer bulk export remains undecided. Job result points to a scoped export asset.

Guest reminders are scheduled internally, not through a public “send all” API. Members inspect reminders and email outcomes. Purpose-scoped preference tokens never grant gallery or RSVP access. Feedback is consumed through the architecture's authenticated queue path, so no unauthenticated provider webhook is introduced in this API. Unknown provider outcomes require reconciliation, not a blindly replayable send endpoint.

## 8. Open product policies and implementation gates

OpenAPI's `x-open-policy` marks relevant operations. Supported shape is not approval of the underlying policy. Use `POLICY_UNRESOLVED` for dependent writes until their policy is configured; retain unaffected read/planning features.

| Policy | Dependent behavior |
|---|---|
| Auth adapter | Cookie names, provider callbacks, physical session mapping, CSRF integration |
| Money policies | Currency, expense zero values, overpayments, zero correction, wrong-expense correction |
| RSVP policy | Guest cutoff, owner override, partial response UX, pending reset/reinvitation |
| Email policy | Timing, nonresponder event reminders, late invites, ambiguous send outcomes |
| Storage policy | Formats, size limits, per-wedding capacity, retention, exceptional operational removal |
| Publication policy | Public fields, publishing/unpublishing and slug changes; public route is conditional |
| Viewer export | Export remains owner-only until explicitly broadened |

No initial guest invitation email sender, owner deletion route, membership transfer, Google password recovery, custom Kankotri templates, or infrastructure admin API is added.

## 9. Validation and implementation sequence

Before adopting this contract, review screen coverage, money/status naming, and unresolved policies. Structural checks should cover local references, unique operation IDs, path parameters, request/response schemas, role declarations, no deletion methods, and FR-01 through FR-14 coverage. Example requests should be checked against their schemas. This is contract checking, not runtime/integration verification.

Draft verification on 3 October 2026: checked 88 operations, 89 schemas, internal references, path parameters, role/CSRF declarations, all 14 PRD requirements, four schema examples, and eight invalid-input boundary cases. No full standards-compliance OpenAPI validator or live endpoint tests have run; the application is not implemented yet.

Implement in complete feature slices:

1. Google auth adapter, schema/index migrations, create/join wedding, and owner/viewer authorization.
2. Events, families, RSVP, and the fixed Kankotri PDF flow.
3. Tasks, vendors, expenses, payments, receipts, and dashboard.
4. Website, gallery, and automatic reminder delivery.

Each slice includes UI, domain service, database operations, API conformance checks, and relevant access/concurrency tests. Finalize auth library/runtime/dependency choices during the first slice; no deployment or cloud resources have been created by this specification.
