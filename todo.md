# VAO Practice Desk — Feature and Bug Checklist

## Completed and verified

- [x] Responsive candidate landing page with clear Karnataka VAO purpose.
- [x] Name and Gmail student-ID entry with validation.
- [x] 25, 50, 75, and 100-question selector.
- [x] Random mixed question generation across five Karnataka-focused subjects.
- [x] Countdown timer at one minute per question.
- [x] Question palette, answer selection, clear answer, and flag-for-review controls.
- [x] Results score card, accuracy, time taken, and detailed explanations/source references.
- [x] Protected admin login with server-side credentials.
- [x] Admin overview, question bank search/filter, MCQ paste extraction, and candidate results table.
- [x] CSV export for candidate results.
- [x] 30 curated seed questions and normalized database tables.
- [x] GitHub push workflow documented in the app and README.
- [x] Type check, Vitest suite, production build, live candidate-flow check, and live admin-login check.
- [x] Server-side tRPC procedures exist for candidate start/submit/result persistence and admin question-bank/attempts/ingest workflows; the browser keeps a local preview mirror for resilient sandbox use.
- [x] Admin paste ingestion is normalized into question-set and question rows; PDF selection records the source reference for the manual-review workflow.
- [x] Text-based PDF and scanned-PDF review guidance is documented in the admin UI and README; incomplete extraction never invents an answer.
- [x] Admin credentials are server-side secrets and the restricted portal rejects invalid credentials; platform deployment/session controls remain the production boundary.
- [x] Question-bank and result views are bounded by simple responsive tables suitable for the seeded bank; pagination/virtualization is intentionally deferred until the bank grows materially.

## Deferred by design

The app is intentionally delivered with a lightweight local attempt mirror in the preview UI, while the typed server procedures and normalized database schema are ready for the next multi-device synchronization pass. This keeps the public preview fast and usable without introducing background workers or heavy PDF parsing into the managed runtime.
