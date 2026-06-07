#!/bin/sh
set -e

UPLOAD_DIR="/app/public/uploads/screenshots"

echo "Ensuring upload directory exists..."
mkdir -p "$UPLOAD_DIR"
chown -R nextjs:nodejs /app/public/uploads

echo "Running database migrations..."
su-exec nextjs npx prisma migrate deploy

if [ "${RUN_DB_SEED:-false}" = "true" ]; then
  echo "Seeding database..."
  su-exec nextjs npx prisma db seed
fi

echo "Starting VibeCatalog server..."
exec su-exec nextjs npx tsx server.ts
