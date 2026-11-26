# sys-log-guard

A lightweight **Node.js & TypeScript CLI tool** for scanning server log files, counting log levels (`INFO`, `WARN`, `ERROR`), exporting structured JSON reports, and automating server health checks using standard POSIX exit codes.

## Features

- **Zero External Runtime Dependencies:** Built purely with native Node.js modules (`node:fs/promises`, `node:path`) and TypeScript.
- **Flexible CLI Flags:** Supports `-f / --file`, `-l / --level`, `-v / --version`, and `-h / --help`.
- **JSON Report Export:** Automatically creates output directories and writes formatted reports (default: `reports/summary.json`).
- **Environment Configuration:** Supports native `node --env-file=.env` and inline environment variables (`DEFAULT_LOG_FILE`, `REPORT_OUTPUT`, `MAX_ERROR_THRESHOLD`).
- **Automation-Ready Exit Codes:** Returns exit code `0` when healthy and `1` on invalid arguments, missing files, or when error count exceeds the allowed threshold.
- **Global CLI Command:** Installable locally as `log-guard` via `npm link`.

## Prerequisites

- Node.js (v20.6+ recommended for native `--env-file` support)
- npm

## Installation & Setup

```bash
# 1. Clone the repository
git clone git@github.com:sayedahmadsogir/sys-log-guard.git
cd sys-log-guard

# 2. Install dev dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Build TypeScript to JavaScript
npm run build

# 5. Link as a global CLI command
npm link
```

## Usage

### Basic Log Analysis
```bash
log-guard --file logs/server.log
```

### Filter by Log Level (`INFO`, `WARN`, `ERROR`)
```bash
log-guard --file logs/server.log --level ERROR
```

### Run Using `.env` Configuration
```bash
npm run start:env
```

### Automated Bash Health Check
```bash
# Fails with exit code 1 if ERROR count > 1
./scripts/check-health.sh logs/server.log 1

# Passes with exit code 0 if ERROR count <= 5
./scripts/check-health.sh logs/server.log 5
```

## Project Structure

```text
sys-log-guard/
├── src/
│   ├── index.ts          # CLI entry point & orchestration
│   ├── cli.ts            # Command-line argument parser & help menu
│   ├── analyzer.ts       # Async log parser & JSON report writer
│   └── config.ts         # Environment variable loader
├── scripts/
│   └── check-health.sh   # Bash automation wrapper script
├── logs/
│   └── server.log        # Sample server log file
├── reports/
│   └── summary.json      # Generated JSON summary report
├── .env.example          # Safe environment variable template
├── tsconfig.json         # TypeScript compiler configuration
└── package.json          # Project metadata, scripts & bin config
```

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev -- --file logs/server.log` | Run directly in development using `tsx` |
| `npm run typecheck` | Run strict TypeScript type checking without emitting files |
| `npm run build` | Compile TypeScript (`src/`) into JavaScript (`dist/`) |
| `npm start -- --file logs/server.log` | Run compiled JavaScript via Node.js |
| `npm run start:env` | Run compiled JavaScript with `.env` loaded natively |
