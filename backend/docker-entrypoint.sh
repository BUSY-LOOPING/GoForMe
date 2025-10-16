#!/bin/sh
set -e

echo "🚀 Starting GoForMe Backend..."

# Wait for MySQL to be ready
echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
max_attempts=60
attempt=0

until nc -z -v -w30 "$DB_HOST" "$DB_PORT" 2>/dev/null || [ $attempt -eq $max_attempts ]
do
  attempt=$((attempt+1))
  echo "   Attempt $attempt/$max_attempts..."
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "Failed to connect to MySQL"
  exit 1
fi

echo "MySQL is ready!"
echo "Starting application (migrations will run automatically)..."

exec "$@"
