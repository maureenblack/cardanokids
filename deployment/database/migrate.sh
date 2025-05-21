#!/bin/bash
# Database migration script for Cardano Kids

set -e

# Default database connection parameters
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${DB_NAME:-"cardanokids"}
DB_USER=${DB_USER:-"cardanokids_user"}
DB_PASSWORD=${DB_PASSWORD:-"your_secure_password"}

# Directory containing migration files
MIGRATIONS_DIR="./migrations"
SCHEMA_FILE="./schema.sql"

# Function to display usage
usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -h, --host HOST       Database host (default: localhost)"
  echo "  -p, --port PORT       Database port (default: 5432)"
  echo "  -d, --database DB     Database name (default: cardanokids)"
  echo "  -u, --user USER       Database user (default: cardanokids_user)"
  echo "  -w, --password PWD    Database password"
  echo "  -i, --init            Initialize database schema"
  echo "  -m, --migrate         Run migrations"
  echo "  --help                Display this help message"
  exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--host)
      DB_HOST="$2"
      shift 2
      ;;
    -p|--port)
      DB_PORT="$2"
      shift 2
      ;;
    -d|--database)
      DB_NAME="$2"
      shift 2
      ;;
    -u|--user)
      DB_USER="$2"
      shift 2
      ;;
    -w|--password)
      DB_PASSWORD="$2"
      shift 2
      ;;
    -i|--init)
      INIT_DB=true
      shift
      ;;
    -m|--migrate)
      RUN_MIGRATIONS=true
      shift
      ;;
    --help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# Function to run SQL file
run_sql_file() {
  echo "Running SQL file: $1"
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -f "$1"
}

# Function to create migrations table if it doesn't exist
create_migrations_table() {
  echo "Creating migrations table if it doesn't exist..."
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER << EOF
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
EOF
}

# Check if database exists, create if it doesn't
check_database() {
  echo "Checking if database exists: $DB_NAME"
  if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "Database $DB_NAME does not exist. Creating..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"
  else
    echo "Database $DB_NAME already exists."
  fi
}

# Initialize database schema
init_schema() {
  echo "Initializing database schema..."
  if [ -f "$SCHEMA_FILE" ]; then
    run_sql_file "$SCHEMA_FILE"
    echo "Schema initialized successfully."
  else
    echo "Error: Schema file not found: $SCHEMA_FILE"
    exit 1
  fi
}

# Run migrations
run_migrations() {
  echo "Running migrations..."
  create_migrations_table
  
  # Get list of applied migrations
  APPLIED_MIGRATIONS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -t -c "SELECT version FROM schema_migrations ORDER BY version;")
  
  # Run each migration file in order if not already applied
  for migration in $(find "$MIGRATIONS_DIR" -name "*.sql" | sort); do
    # Extract version number from filename (e.g., 001_add_users.sql -> 001)
    VERSION=$(basename "$migration" | cut -d_ -f1)
    
    # Check if migration has already been applied
    if echo "$APPLIED_MIGRATIONS" | grep -q "$VERSION"; then
      echo "Migration $VERSION already applied, skipping."
    else
      echo "Applying migration: $migration (version: $VERSION)"
      run_sql_file "$migration"
      
      # Record migration in schema_migrations table
      PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -c "INSERT INTO schema_migrations (version) VALUES ('$VERSION');"
      echo "Migration $VERSION applied successfully."
    fi
  done
  
  echo "All migrations completed."
}

# Main execution
echo "Cardano Kids Database Migration Tool"
echo "===================================="

# Check database connection
echo "Testing database connection..."
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c '\q'; then
  echo "Error: Could not connect to PostgreSQL server."
  exit 1
fi

# Create database if it doesn't exist
check_database

# Initialize schema if requested
if [ "$INIT_DB" = true ]; then
  init_schema
fi

# Run migrations if requested
if [ "$RUN_MIGRATIONS" = true ]; then
  run_migrations
fi

# If no specific action was requested, show usage
if [ "$INIT_DB" != true ] && [ "$RUN_MIGRATIONS" != true ]; then
  usage
fi

echo "Database operations completed successfully."
