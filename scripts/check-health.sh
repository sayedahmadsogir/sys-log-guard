#!/usr/bin/env bash
# ব্যবহারের নিয়ম: ./scripts/check-health.sh <log_file> <max_error_limit>

LOG_FILE="${1:-logs/server.log}"
LIMIT="${2:-1}"

echo ">>> Automated Health Check started on: $LOG_FILE (Max Errors Allowed: $LIMIT)"

if MAX_ERROR_THRESHOLD="$LIMIT" log-guard --file "$LOG_FILE"; then
  echo ">>> [BASH RESULT] Server is HEALTHY!"
  exit 0
else
  echo ">>> [BASH RESULT] ALERT! Server error limit exceeded!"
  exit 1
fi
