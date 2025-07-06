#!/bin/bash
# Initialize database using init-db.sql

set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set" >&2
  exit 1
fi

psql "$DATABASE_URL" -f "$(dirname "$0")/init-db.sql"
