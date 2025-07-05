#!/bin/bash
# Simple connectivity check for PostgreSQL and Redis

set -e

pg_isready -d "$DATABASE_URL"
redis-cli -u "$REDIS_URL" ping
