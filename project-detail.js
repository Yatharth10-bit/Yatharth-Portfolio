const commonProof = [
    "Clean README with screenshots, setup steps, architecture diagram, and tradeoffs.",
    "Automated tests for core logic and one end-to-end happy path.",
    ".env.example, sample data, and clear local run instructions.",
    "Short demo video or deployed demo where possible.",
    "Resume bullet with measurable result: latency, records processed, tests passed, bugs caught, or workflow time saved."
];

const projects = {
    "c-file-backup": {
        track: "Foundation / C / Systems basics",
        title: "C File Backup + Duplicate Finder",
        summary: "A command-line utility that backs up folders, detects duplicate files, verifies file integrity with hashes, and creates restore logs.",
        difficulty: "Beginner to intermediate",
        timing: "2026 foundation project",
        stack: "C, file I/O, CLI args, hashing, Make/CMake, basic tests",
        problem: "Students and normal users often copy folders manually, lose track of duplicate files, and do not know whether a backup actually preserved the original data. This project solves a simple real problem while forcing you to learn low-level file handling.",
        signal: "This is not flashy, but it proves fundamentals many web-only students skip: files, memory, errors, paths, hashing, command-line design, and disciplined C programming.",
        features: [
            "Scan a source folder recursively and list all files with size, path, and last modified time.",
            "Copy files into a timestamped backup directory while preserving folder structure.",
            "Generate SHA-256 or simpler hash checksums for copied files.",
            "Detect duplicate files by size plus hash and write a duplicate report.",
            "Create a restore manifest that maps original paths to backup paths.",
            "Add dry-run mode, verbose mode, and error logs for skipped files."
        ],
        architecture: [
            "CLI parser handles commands such as scan, backup, duplicates, verify, and restore.",
            "File walker module recursively traverses directories.",
            "Hash module computes file fingerprints in chunks.",
            "Manifest module writes CSV or JSON-style plain text logs.",
            "Verification module compares current file hashes with stored manifest hashes."
        ],
        milestones: [
            "Week 1: build recursive scanner and print file metadata.",
            "Week 2: add backup copy and error handling.",
            "Week 3: add hashing, duplicate detection, and manifest file.",
            "Week 4: add verify/restore commands, tests, and README."
        ],
        skills: ["C programming", "File systems", "Memory discipline", "CLI design", "Hashing", "Error handling", "Testing small programs"],
        resume: "Built a C-based backup and duplicate-detection CLI with recursive folder scanning, file hashing, restore manifests, and verification reports for reliable local backups.",
        pitfalls: [
            "Do not hardcode Windows-only paths; handle path separators carefully.",
            "Do not read huge files fully into memory; hash files in chunks.",
            "Do not delete files automatically in version 1.",
            "Do not ignore permission errors; report them clearly."
        ],
        upgrades: ["Add compression", "Add incremental backups", "Add config file support", "Add cross-platform tests", "Add a small TUI dashboard"],
        next: "After this, build the Full-Stack Inventory or Appointment System so you move from systems basics into web, SQL, and product workflows."
    },
    "inventory-appointment": {
        track: "Foundation / Full-stack / SQL",
        title: "Full-Stack Inventory or Appointment System",
        summary: "A real CRUD product for inventory, appointments, lab slots, or small-shop stock management with auth, roles, reports, and tests.",
        difficulty: "Beginner to intermediate",
        timing: "Late 2026 or early 2027",
        stack: "TypeScript, React/Next.js, PostgreSQL or SQLite, Node/FastAPI, Bootstrap or plain CSS",
        problem: "Small teams, student clubs, labs, and shops still track stock, slots, or appointments using messages and spreadsheets. A simple system with roles and reports creates immediate practical value.",
        signal: "This is the universal internship project: it proves you can build a product with auth, database tables, forms, validation, search, admin workflows, and deployment.",
        features: [
            "User login with admin and normal-user roles.",
            "Create, edit, delete, search, and filter records.",
            "Inventory mode: stock levels, suppliers, low-stock alerts, CSV import/export.",
            "Appointment mode: available slots, bookings, cancellations, queue status, daily reports.",
            "Admin dashboard with counts, recent activity, and export buttons.",
            "Input validation, friendly errors, and audit history for important changes."
        ],
        architecture: [
            "Frontend pages for dashboard, records, reports, and admin settings.",
            "Backend API routes for auth, CRUD, search, reports, and exports.",
            "Database tables for users, roles, items or slots, events, and audit logs.",
            "Service layer keeps business rules separate from route handlers.",
            "Test layer covers validation, permissions, and report calculations."
        ],
        milestones: [
            "Week 1: design schema and build basic CRUD.",
            "Week 2: add auth, roles, validation, and search.",
            "Week 3: add reports, CSV export, and admin dashboard.",
            "Week 4: add tests, seed data, deployment, and README."
        ],
        skills: ["Full-stack development", "SQL schema design", "Authentication", "Authorization", "Forms", "Reports", "Testing", "Deployment"],
        resume: "Built a full-stack appointment/inventory system with role-based access, SQL-backed workflows, admin reporting, CSV exports, validation, and automated tests.",
        pitfalls: [
            "Do not make it only a pretty frontend without a real database.",
            "Do not skip role permissions; admin and user behavior must differ.",
            "Do not store passwords manually; use a proven auth pattern.",
            "Do not leave empty states, errors, and mobile views unpolished."
        ],
        upgrades: ["Add email reminders", "Add QR check-in", "Add audit trail", "Add pagination", "Add Docker setup", "Add analytics charts"],
        next: "After this, build the Data Pipeline + Quality Dashboard or Distributed Task Scheduler depending on whether you prefer data or backend."
    },
    "data-quality-dashboard": {
        track: "Foundation / Data engineering / Observability",
        title: "Data Pipeline + Quality Dashboard",
        summary: "A pipeline that ingests public data, validates it, stores it, and shows freshness, missing values, trends, failures, and data-quality scores.",
        difficulty: "Intermediate",
        timing: "2027 foundation or data branch",
        stack: "Python, SQL, PostgreSQL/DuckDB, Pandas, Streamlit/Plotly, Prefect optional, Docker",
        problem: "Companies cannot use AI, analytics, or dashboards if their data is missing, stale, duplicated, or silently broken. This project teaches you to build data systems that can be trusted.",
        signal: "It proves practical data engineering: ingestion, validation, scheduling, storage, SQL, dashboards, and failure visibility. This maps directly to data platform and backend roles.",
        features: [
            "Ingest data from a public API or CSV source such as air quality, transport, weather, or government data.",
            "Store raw data and cleaned data separately.",
            "Validate required columns, missing values, duplicate rows, ranges, and freshness.",
            "Show pipeline run history: success, failure, row count, duration, and error message.",
            "Create dashboard filters, charts, and quality scorecards.",
            "Export cleaned data and validation reports."
        ],
        architecture: [
            "Ingestion module fetches data and saves raw snapshots.",
            "Transform module cleans and normalizes fields.",
            "Validation module produces quality checks and issue lists.",
            "SQL database stores runs, raw records, clean records, and check results.",
            "Dashboard reads from database and visualizes trends plus pipeline health."
        ],
        milestones: [
            "Week 1: pick dataset and build ingestion script.",
            "Week 2: add database tables and cleaning logic.",
            "Week 3: add quality checks and run history.",
            "Week 4: add dashboard, Docker, tests, and README."
        ],
        skills: ["Python", "SQL", "ETL", "Data validation", "Dashboards", "Scheduling", "Data quality", "Docker"],
        resume: "Built a Python data pipeline dashboard that ingests public data, validates freshness and quality, stores clean records in SQL, and visualizes pipeline health and trends.",
        pitfalls: [
            "Do not make it just charts over a CSV.",
            "Do not ignore failed runs; failures are part of the product.",
            "Do not overwrite raw data; keep raw and cleaned layers separate.",
            "Do not overclaim insights unless the data supports them."
        ],
        upgrades: ["Add Prefect/Airflow scheduling", "Add email alerts", "Add dbt-style transformations", "Add API endpoint for clean data", "Add anomaly checks"],
        next: "After this, build Observability + Incident Dashboard or Eval & AI Observability Dashboard."
    },
    "distributed-task-scheduler": {
        track: "Trend 1 / Backend + platform engineering",
        title: "Distributed Task Scheduler",
        summary: "A backend system that accepts background jobs, runs them through workers, retries failures, logs progress, and exposes operational status.",
        difficulty: "Intermediate to advanced",
        timing: "2028 internship project",
        stack: "Go or Java, PostgreSQL, Redis, Docker Compose, REST API, GitHub Actions",
        problem: "Real apps need work to happen outside request-response flows: emails, reports, imports, cleanup jobs, notifications, retries, and long-running tasks.",
        signal: "This is one of the strongest backend/platform projects because it proves queues, workers, retries, reliability, failure handling, logs, APIs, and Docker.",
        features: [
            "API to submit jobs with type, payload, priority, and schedule time.",
            "Worker process that claims jobs, runs them, updates state, and releases locks.",
            "Job states: queued, running, succeeded, failed, retrying, dead-lettered.",
            "Retry policy with exponential backoff and max attempts.",
            "Dashboard for queue depth, success rate, failed jobs, and worker health.",
            "Admin actions to retry, cancel, pause, or inspect jobs."
        ],
        architecture: [
            "API service receives job requests and writes to PostgreSQL.",
            "Redis handles fast queues or locking in the advanced version.",
            "Worker service polls or consumes jobs and writes status updates.",
            "Scheduler handles delayed jobs and recurring jobs.",
            "Dashboard reads metrics and job history from database."
        ],
        milestones: [
            "Week 1: implement job table and submit/list APIs.",
            "Week 2: build worker process and job state transitions.",
            "Week 3: add retries, dead-letter queue, and locking.",
            "Week 4: add dashboard, Docker Compose, tests, and docs."
        ],
        skills: ["Backend architecture", "Queues", "Workers", "Reliability", "Redis", "PostgreSQL", "Docker", "System design"],
        resume: "Built a distributed task scheduler with job submission APIs, worker processing, retries, dead-letter handling, queue metrics, Docker Compose, and automated tests.",
        pitfalls: [
            "Do not fake the worker with only frontend status changes.",
            "Do not skip race conditions; two workers must not run the same job.",
            "Do not ignore retry and failure visibility.",
            "Do not make every job type hardcoded in the controller."
        ],
        upgrades: ["Add cron-style recurring jobs", "Add worker autoscaling simulation", "Add OpenTelemetry traces", "Add priority queues", "Add webhook callbacks"],
        next: "After this, build API Gateway With Analytics or Cost-Routing Model Gateway."
    },
    "api-gateway-analytics": {
        track: "Trend 1 / Backend + platform engineering",
        title: "API Gateway With Analytics",
        summary: "A gateway that sits before backend services and handles routing, API keys, rate limits, request logs, latency metrics, and error analytics.",
        difficulty: "Intermediate",
        timing: "2028 backend/platform project",
        stack: "Node/TypeScript or Go, PostgreSQL, Redis, Docker, REST APIs, charts",
        problem: "Teams need one controlled entry point for APIs so they can manage authentication, rate limits, monitoring, and routing instead of scattering this logic across services.",
        signal: "This proves platform engineering and backend architecture. It shows you understand reliability, security, observability, and developer-facing infrastructure.",
        features: [
            "Register upstream services and route paths to them.",
            "Generate API keys and associate them with users or apps.",
            "Enforce per-key rate limits using Redis.",
            "Log request method, path, status, latency, API key, and timestamp.",
            "Dashboard for traffic, error rate, slow endpoints, and top consumers.",
            "Admin controls to revoke keys and update limits."
        ],
        architecture: [
            "Gateway service receives all incoming requests.",
            "Routing layer forwards requests to configured upstream services.",
            "Rate-limit layer checks Redis before forwarding.",
            "Logging layer stores request summaries in PostgreSQL.",
            "Analytics dashboard queries aggregate metrics."
        ],
        milestones: [
            "Week 1: proxy requests to one upstream service.",
            "Week 2: add API keys and rate limits.",
            "Week 3: add request logging and analytics views.",
            "Week 4: add admin controls, tests, Docker, and README."
        ],
        skills: ["API design", "Reverse proxy basics", "Rate limiting", "Redis", "Analytics", "Security", "Backend testing"],
        resume: "Built an API gateway with upstream routing, API-key management, Redis rate limiting, request logging, latency analytics, and admin controls.",
        pitfalls: [
            "Do not build only a dashboard; the gateway must actually forward requests.",
            "Do not log sensitive request bodies by default.",
            "Do not rate-limit globally only; support per-key limits.",
            "Do not ignore timeout and upstream failure behavior."
        ],
        upgrades: ["Add circuit breaker", "Add request replay for debugging", "Add OpenAPI import", "Add multi-service routing", "Add alert rules"],
        next: "After this, build Cost-Routing Model Gateway as the AI-infra version of this project."
    },
    "observability-incident-dashboard": {
        track: "Trend 1 / DevEx + observability",
        title: "Observability + Incident Dashboard",
        summary: "A dashboard that collects logs, metrics, traces, uptime checks, and incident notes so a developer can understand system health quickly.",
        difficulty: "Intermediate",
        timing: "2027 or 2028 platform project",
        stack: "Python/TypeScript, PostgreSQL, OpenTelemetry concepts, charts, Docker",
        problem: "When systems fail, teams need to know what changed, which endpoint slowed down, what errors spiked, and what actions were taken. Observability is what turns production chaos into debugging evidence.",
        signal: "Observability is durable because it applies to backend, cloud, security, and AI systems. This project proves you care about operating software, not just writing it.",
        features: [
            "Ingest structured logs from a sample app.",
            "Track metrics such as latency, error rate, request count, and uptime.",
            "Show endpoint-level charts and slow-request lists.",
            "Create incidents with severity, owner, timeline, and resolution notes.",
            "Attach logs and metrics to incidents.",
            "Generate post-incident summary from structured fields without AI."
        ],
        architecture: [
            "Sample app emits structured logs and metrics.",
            "Collector script or API receives telemetry events.",
            "Database stores events, metrics, uptime checks, and incidents.",
            "Dashboard visualizes service health and incident timelines.",
            "Alert rules detect threshold breaches."
        ],
        milestones: [
            "Week 1: build sample app and log ingestion.",
            "Week 2: add metrics, charts, and uptime checks.",
            "Week 3: add incident management workflow.",
            "Week 4: add alerts, Docker, tests, and demo incident data."
        ],
        skills: ["Observability", "Logging", "Metrics", "Incident response", "Dashboards", "Backend APIs", "Operational thinking"],
        resume: "Built an observability dashboard that ingests structured logs and metrics, tracks endpoint health, manages incidents, and links failures to operational evidence.",
        pitfalls: [
            "Do not make fake charts with static data only.",
            "Do not store unstructured logs only; use structured fields.",
            "Do not ignore time ranges and filters.",
            "Do not confuse monitoring with observability; include context and incident workflow."
        ],
        upgrades: ["Add OpenTelemetry SDK instrumentation", "Add alert webhooks", "Add service dependency map", "Add SLO tracking", "Add log search syntax"],
        next: "After this, build Eval & AI Observability Dashboard."
    },
    "secure-banking-ledger": {
        track: "Trend 2 / Cybersecurity + backend",
        title: "Secure Mini-Banking Ledger",
        summary: "A transaction-safe backend that simulates accounts, transfers, audit logs, idempotency, role permissions, and suspicious activity checks.",
        difficulty: "Intermediate to advanced",
        timing: "2028 internship project",
        stack: "Java Spring Boot or FastAPI, PostgreSQL, Redis optional, Docker, pytest/JUnit",
        problem: "Money systems require correctness, security, traceability, and reliable failure handling. Even a simulation teaches real backend principles: transactions, constraints, audit logs, and access control.",
        signal: "This is a top-tier backend/security project because it is concrete, universal, and easy for interviewers to evaluate.",
        features: [
            "Create users, accounts, balances, and transaction records.",
            "Transfer money using database transactions and row locking.",
            "Support idempotency keys so retries do not double-charge.",
            "Add role-based access for customer, support, and admin.",
            "Write immutable audit logs for account and transfer actions.",
            "Flag suspicious patterns such as rapid repeated transfers or unusual amounts."
        ],
        architecture: [
            "API layer exposes account, transfer, audit, and admin endpoints.",
            "Service layer handles transaction rules and idempotency.",
            "Database layer uses constraints and transactions for correctness.",
            "Security layer handles auth, roles, and permission checks.",
            "Audit layer records important events append-only."
        ],
        milestones: [
            "Week 1: accounts, balances, and basic transfers.",
            "Week 2: database transactions, idempotency, and validation.",
            "Week 3: auth, RBAC, audit logs, and suspicious rules.",
            "Week 4: tests, Docker, API docs, and architecture write-up."
        ],
        skills: ["Transactions", "Security", "RBAC", "Audit logs", "Idempotency", "SQL constraints", "Backend testing", "API design"],
        resume: "Built a secure banking ledger API with transaction-safe transfers, idempotency keys, role-based access, immutable audit logs, suspicious activity rules, and integration tests.",
        pitfalls: [
            "Do not update balances without database transactions.",
            "Do not allow users to access other users' accounts.",
            "Do not make audit logs editable.",
            "Do not claim it is a real banking system; present it as a secure simulation."
        ],
        upgrades: ["Add reconciliation report", "Add ledger double-entry model", "Add Redis rate limits", "Add admin review queue", "Add threat model document"],
        next: "After this, build Web Security Lab + Scanner or AI Red-Team Harness."
    },
    "web-security-lab": {
        track: "Trend 2 / AppSec",
        title: "Web Security Lab + Scanner",
        summary: "A safe local lab with intentionally vulnerable endpoints and a scanner that detects common application-security mistakes.",
        difficulty: "Intermediate",
        timing: "2027 or 2028 security project",
        stack: "Python/FastAPI or Node, OWASP ZAP optional, Docker, PostgreSQL, pytest",
        problem: "Security is hard to learn safely because attacking real websites is unethical and illegal. A local lab lets you demonstrate AppSec knowledge responsibly.",
        signal: "This shows maturity: you can build vulnerable examples, detect them, explain risk, and recommend mitigations without doing anything harmful.",
        features: [
            "Local vulnerable app with broken auth, missing validation, insecure headers, weak rate limits, and unsafe file upload examples.",
            "Scanner checks target endpoints and reports issue severity.",
            "Each finding includes explanation, evidence, and recommended fix.",
            "Dashboard groups findings by OWASP category.",
            "Safe mode prevents scanning public websites unless explicitly allowed in config.",
            "Tests confirm scanner catches the intended vulnerable examples."
        ],
        architecture: [
            "Vulnerable demo app runs locally in Docker.",
            "Scanner module sends controlled requests and checks responses.",
            "Rules engine maps patterns to findings and severity.",
            "Report generator outputs HTML/JSON/CSV.",
            "Dashboard displays history and remediation checklist."
        ],
        milestones: [
            "Week 1: build vulnerable demo app.",
            "Week 2: create scanner rules for 4-5 safe checks.",
            "Week 3: add reports, dashboard, and severity labels.",
            "Week 4: add Docker Compose, tests, and responsible-use notice."
        ],
        skills: ["OWASP basics", "Secure coding", "HTTP", "Auth testing", "Docker", "Rule-based scanners", "Responsible security"],
        resume: "Built a local AppSec lab and scanner that detects broken auth, missing validation, insecure headers, weak rate limits, and unsafe uploads with remediation reports.",
        pitfalls: [
            "Do not scan real websites without permission.",
            "Do not include exploit code that causes harm.",
            "Do not make vague findings; include evidence and fix guidance.",
            "Do not ignore ethics and safe-use documentation."
        ],
        upgrades: ["Add OWASP ZAP integration", "Add CI security checks", "Add authentication test cases", "Add threat model templates", "Add SARIF export"],
        next: "After this, build AI Red-Team Harness for AI-specific security."
    },
    "ai-red-team-harness": {
        track: "Trend 2 + 3 / AI security",
        title: "AI Red-Team Harness",
        summary: "A safe evaluation tool for testing AI apps against prompt injection, data leakage, insecure output handling, excessive agency, and unsafe tool permissions.",
        difficulty: "Advanced",
        timing: "2028 or 2029 specialization project",
        stack: "Python/TypeScript, FastAPI, SQLite/PostgreSQL, pytest, OWASP LLM Top 10, local/mock models first",
        problem: "AI apps can leak data, misuse tools, follow malicious instructions, or produce unsafe output. Companies need repeatable tests before trusting AI systems in real workflows.",
        signal: "This is a strong AI-security project because it is about evaluation, controls, and reporting, not just calling a model API.",
        features: [
            "Test suites mapped to OWASP LLM risks such as prompt injection and insecure output handling.",
            "Safe prompt cases and synthetic secrets for leakage tests.",
            "Tool-permission simulation with allow/deny decisions.",
            "Scoring system for pass, fail, severity, and regression.",
            "Report page with failed cases, reproduction steps, and mitigations.",
            "Mock model mode so the project can run without paid APIs."
        ],
        architecture: [
            "Test case library defines attack scenario, expected safe behavior, and severity.",
            "Runner executes tests against a target AI app or mock adapter.",
            "Policy layer defines blocked tools, secret patterns, and output rules.",
            "Results database stores runs, failures, model/app version, and notes.",
            "Dashboard compares runs over time."
        ],
        milestones: [
            "Week 1: build test case format and mock runner.",
            "Week 2: add prompt injection, leakage, and unsafe output tests.",
            "Week 3: add tool permission simulation and reports.",
            "Week 4: add dashboard, regression comparison, tests, and docs."
        ],
        skills: ["AI security", "Evals", "Threat modeling", "Test harnesses", "Policy checks", "Reporting", "Backend design"],
        resume: "Built an AI red-team harness with OWASP-mapped test cases, synthetic leakage checks, tool-permission simulation, regression scoring, and mitigation reports.",
        pitfalls: [
            "Do not publish harmful attack payloads.",
            "Do not depend entirely on paid model APIs.",
            "Do not present jailbreak success as the product; the product is safe evaluation.",
            "Do not skip mitigation guidance."
        ],
        upgrades: ["Add CI integration", "Add promptfoo-style config import", "Add MCP tool testing", "Add policy-as-code", "Add model comparison"],
        next: "After this, build Eval & AI Observability Dashboard or MCP Server for Developer Tools."
    },
    "mcp-server-devtools": {
        track: "Trend 3 / AI infrastructure",
        title: "MCP Server for Developer Tools",
        summary: "A Model Context Protocol server that exposes safe developer tools such as notes, tasks, file search, repo summaries, or public datasets.",
        difficulty: "Advanced",
        timing: "2028 or 2029 AI-infra project",
        stack: "TypeScript or Python, MCP SDK, JSON schema, SQLite/PostgreSQL, auth, logs",
        problem: "AI tools need structured, permissioned access to external tools and context. MCP is a protocol for connecting AI apps to data sources and tools in a standardized way.",
        signal: "This proves protocol thinking, schema design, tool boundaries, security, and AI-infra awareness. It is stronger than a chatbot because it plugs AI into real workflows.",
        features: [
            "Expose tools such as search_notes, create_task, summarize_repo, read_public_dataset, or list_todos.",
            "Define clear input/output schemas for every tool.",
            "Add permission checks and read-only mode.",
            "Log every tool call with timestamp, input summary, result status, and user/app identity.",
            "Provide demo client and example prompts.",
            "Add tests for schema validation and denied permissions."
        ],
        architecture: [
            "MCP server defines tool registry and schemas.",
            "Tool handlers call local services or database functions.",
            "Permission layer validates allowed operations.",
            "Storage layer keeps notes/tasks/logs if needed.",
            "Demo client shows how a host would call the server."
        ],
        milestones: [
            "Week 1: build one read-only MCP tool.",
            "Week 2: add multiple tools and schema validation.",
            "Week 3: add permissions, logs, and storage.",
            "Week 4: add demo client, tests, docs, and security notes."
        ],
        skills: ["MCP", "Protocol design", "Tool schemas", "Security boundaries", "Logging", "TypeScript/Python", "API design"],
        resume: "Built an MCP server exposing permissioned developer tools with typed schemas, safe tool execution, call logging, demo client integration, and automated validation tests.",
        pitfalls: [
            "Do not give unrestricted file-system access.",
            "Do not skip schemas; vague tool inputs look immature.",
            "Do not hide tool failures; log them clearly.",
            "Do not depend on a single AI host to demonstrate value."
        ],
        upgrades: ["Add OAuth-style auth", "Add workspace-scoped permissions", "Add UI dashboard", "Add red-team tests for tool calls", "Add remote deployment"],
        next: "After this, build Cost-Routing Model Gateway or AI Red-Team Harness."
    },
    "eval-ai-observability": {
        track: "Trend 3 / AI evaluation + observability",
        title: "Eval & AI Observability Dashboard",
        summary: "A dashboard for tracking AI runs, prompts, outputs, latency, cost, pass/fail evals, regressions, model versions, and traces.",
        difficulty: "Advanced",
        timing: "2028 or 2029 AI-infra project",
        stack: "Python/TypeScript, FastAPI/Next.js, PostgreSQL, OpenTelemetry concepts, charts, pytest",
        problem: "AI demos often work once but fail silently later. Teams need repeatable evaluation, cost tracking, latency visibility, and regression detection before using AI in production.",
        signal: "This is one of the best AI-infra portfolio projects because it focuses on production reliability instead of model hype.",
        features: [
            "Log every AI run with prompt, output summary, model, latency, token/cost estimate, and status.",
            "Create eval datasets with expected behavior and scoring rules.",
            "Run evaluations and compare pass rates across versions.",
            "Track regressions when a prompt, model, or retrieval setting changes.",
            "Dashboard for cost, latency, failures, pass rate, and model comparison.",
            "Support mock model mode for free local demos."
        ],
        architecture: [
            "AI app or test runner sends run events to observability API.",
            "Database stores runs, eval cases, eval results, and versions.",
            "Scoring engine computes pass/fail and custom metrics.",
            "Dashboard visualizes quality, cost, latency, and regressions.",
            "Export layer creates CSV or JSON reports for README evidence."
        ],
        milestones: [
            "Week 1: build run logging API and dashboard table.",
            "Week 2: add eval case format and scoring engine.",
            "Week 3: add model/version comparison and regression view.",
            "Week 4: add charts, tests, mock mode, and demo data."
        ],
        skills: ["AI evals", "Observability", "Metrics", "Dashboards", "Backend APIs", "SQL", "Testing", "Cost tracking"],
        resume: "Built an AI observability dashboard that logs model runs, tracks latency and cost, runs eval suites, detects regressions, and compares prompt/model versions.",
        pitfalls: [
            "Do not store private prompts or secrets in logs.",
            "Do not make evals subjective only; define expected behavior clearly.",
            "Do not require paid APIs to run the demo.",
            "Do not show charts without explaining what decisions they support."
        ],
        upgrades: ["Add trace spans", "Add RAG retrieval metrics", "Add alert thresholds", "Add dataset versioning", "Add CI eval gate"],
        next: "After this, build Cost-Routing Model Gateway."
    },
    "cost-routing-gateway": {
        track: "Trend 3 / AI platform engineering",
        title: "Cost-Routing Model Gateway",
        summary: "An API gateway for AI/model requests that routes by cost, latency, fallback rules, cache hits, rate limits, and provider health.",
        difficulty: "Advanced",
        timing: "2028 or 2029 capstone",
        stack: "Go/TypeScript/Python, PostgreSQL, Redis, Docker, REST APIs, dashboards",
        problem: "AI systems can become expensive and unreliable if every request goes directly to one model/provider. A gateway centralizes routing, limits, fallback, caching, and cost visibility.",
        signal: "This is a strong bridge between backend/platform engineering and AI infrastructure. It proves you can design systems around cost, reliability, and operational control.",
        features: [
            "Single API endpoint for model requests.",
            "Provider registry with model name, cost estimate, latency, status, and limits.",
            "Routing policies: cheapest, fastest, fallback, high-quality, cache-first.",
            "Per-user or per-key budgets and rate limits.",
            "Response cache for repeated deterministic requests.",
            "Dashboard for spend, latency, failures, cache hit rate, and provider health."
        ],
        architecture: [
            "Gateway receives requests and authenticates API key.",
            "Policy engine chooses provider/model based on routing rules.",
            "Adapter layer calls real or mock providers.",
            "Redis handles cache and rate limits.",
            "PostgreSQL stores request logs, budgets, providers, and analytics."
        ],
        milestones: [
            "Week 1: build API-key gateway and mock provider adapters.",
            "Week 2: add routing policies, rate limits, and request logs.",
            "Week 3: add budgets, caching, and fallback behavior.",
            "Week 4: add dashboard, tests, Docker, and architecture docs."
        ],
        skills: ["API gateways", "Routing policies", "Caching", "Rate limiting", "Cost tracking", "Reliability", "AI platform design", "Dashboards"],
        resume: "Built a cost-routing model gateway with API-key auth, provider adapters, budget limits, Redis caching, fallback routing, request analytics, and operational dashboards.",
        pitfalls: [
            "Do not require real paid providers for the main demo; support mocks.",
            "Do not route randomly; make routing policies explicit.",
            "Do not ignore abuse limits and budgets.",
            "Do not log full sensitive prompts by default."
        ],
        upgrades: ["Add streaming support", "Add provider health checks", "Add OpenTelemetry traces", "Add tenant-level budgets", "Add eval-aware routing"],
        next: "After this, you have a serious AI-platform capstone. Pair it with the Distributed Task Scheduler and Secure Banking Ledger on your resume."
    }
};

function fillList(selector, values) {
    const container = document.querySelector(selector);
    container.innerHTML = "";
    values.forEach((value) => {
        const li = document.createElement("li");
        li.textContent = value;
        container.appendChild(li);
    });
}

function setText(selector, value) {
    document.querySelector(selector).textContent = value;
}

const params = new URLSearchParams(window.location.search);
const slug = params.get("project") || "distributed-task-scheduler";
const project = projects[slug] || projects["distributed-task-scheduler"];

document.title = `${project.title} - Project Detail`;
setText("[data-detail-track]", project.track);
setText("[data-detail-title]", project.title);
setText("[data-detail-summary]", project.summary);
setText("[data-detail-difficulty]", project.difficulty);
setText("[data-detail-timing]", project.timing);
setText("[data-detail-stack]", project.stack);
setText("[data-detail-problem]", project.problem);
setText("[data-detail-signal]", project.signal);
setText("[data-detail-resume]", project.resume);
setText("[data-detail-next]", project.next);

fillList("[data-detail-features]", project.features);
fillList("[data-detail-architecture]", project.architecture);
fillList("[data-detail-milestones]", project.milestones);
fillList("[data-detail-skills]", project.skills);
fillList("[data-detail-proof]", commonProof);
fillList("[data-detail-pitfalls]", project.pitfalls);
fillList("[data-detail-upgrades]", project.upgrades);
