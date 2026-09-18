# Karnataka VAO Exam Practice

A responsive, full-stack practice desk for the Karnataka Village Administrative Officer exam. Candidates can enter a name and Gmail-based student ID, choose a 25/50/75/100-question mixed set, work against a one-minute-per-question timer, navigate with the question palette, flag questions, and review explanations and source references after submission.

## Included features

- Candidate quick entry with name and Gmail student ID.
- Randomized mixed practice sets across Village Administration, Indian Polity, Karnataka History, Aptitude, and General Knowledge.
- Countdown timer, progress tracking, question palette, clear answer, and flag-for-review controls.
- Results with score, accuracy, time taken, correct/incorrect/unanswered counts, explanations, and source metadata.
- Protected administrator sign-in backed by server-side environment secrets.
- Admin overview with question and attempt metrics.
- PDF source selector and structured MCQ paste/extraction workflow.
- Searchable and filterable question bank explorer.
- Candidate results table with CSV export.
- Managed database schema for question sets, questions, quiz attempts, and answer snapshots.
- Original Karnataka-focused sample bank seeded for immediate practice.

## Admin access

The admin ID and password are provisioned as `VAO_ADMIN_ID` and `VAO_ADMIN_PASSWORD` server-side secrets. They are intentionally not hardcoded in the React bundle, source code, README, or Git history. Rotate the values through the WebDev project secret manager when needed.

Candidate Gmail entry is an identifier for tracking attempts; it does not read the inbox or perform Google OAuth verification.

## Question ingestion

Use the admin workspace at `/admin`. A PDF can be selected as the source reference, while text-based MCQs can be pasted for an extraction preview. The recommended format is:

```text
Q1: Which body works at village level?
A) Zilla Panchayat
B) Gram Panchayat
C) Municipality
D) Taluk Panchayat
Answer: B
Explanation: Gram Panchayat is the village-level body.
```

Scanned or image-only PDFs should be reviewed manually. The app does not invent an answer when an extraction is incomplete.

## Development commands

```bash
pnpm install
pnpm check
pnpm test
pnpm build
pnpm dev
```

The application uses the Manus WebDev full-stack scaffold: React 19, Vite, Tailwind CSS, Express, tRPC, Drizzle, MySQL/TiDB, and managed object storage. Database migrations are generated with Drizzle and applied through the managed WebDev database tooling.

## GitHub push workflow

Run these commands from the completed project directory. Inspect any existing remote history before pushing and never commit `.env` files or secrets.

```bash
git init
git remote add origin https://github.com/srijee31/Quiz-Exam-Website.git
git add .
git commit -m "Feat: Complete VAO practice quiz app with PDF question bank & results dashboard"
git branch -M main
git push -u origin main
```

## Important scope note

The initial browser experience keeps a lightweight local attempt mirror so it remains usable even while a preview database is cold. The server has the typed tRPC procedures and normalized database tables for production persistence; the next hardening step for a multi-device deployment is to connect the candidate UI submission and admin tables directly to those procedures for cross-browser synchronization.
