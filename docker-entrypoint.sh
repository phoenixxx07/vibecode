#!/bin/sh
set -e

UPLOAD_DIR="/app/public/uploads/screenshots"

echo "Ensuring upload directory exists..."
mkdir -p "$UPLOAD_DIR"
chown -R nextjs:nodejs /app/public/uploads
file_count="$(ls -1 "$UPLOAD_DIR" 2>/dev/null | wc -l | tr -d ' ')"
echo "Upload directory ready: $UPLOAD_DIR ($file_count files)"

if [ -z "${POSTGRES_PASSWORD:-}" ]; then
  echo "ERROR: POSTGRES_PASSWORD is required in .env" >&2
  exit 1
fi

# Build DATABASE_URL with URL-encoded credentials (password may contain / @ ' etc.)
export DATABASE_URL="$(node <<'NODE'
const user = encodeURIComponent(process.env.POSTGRES_USER || "postgres");
const pass = encodeURIComponent(process.env.POSTGRES_PASSWORD || "");
const host = process.env.POSTGRES_HOST || "postgres";
const port = process.env.POSTGRES_PORT || "5432";
const db = process.env.POSTGRES_DB || "vibecatalog";
process.stdout.write(`postgresql://${user}:${pass}@${host}:${port}/${db}?schema=public`);
NODE
)"

echo "Running database migrations..."
su-exec nextjs npx prisma migrate deploy

if [ "${RUN_DB_SEED:-false}" = "true" ]; then
  echo "Seeding database..."
  su-exec nextjs npx prisma db seed
fi

echo "Starting VibeCatalog server..."
exec su-exec nextjs npx tsx server.ts
