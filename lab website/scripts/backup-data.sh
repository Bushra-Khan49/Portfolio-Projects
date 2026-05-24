#!/bin/bash

# 🛡️ Nexus Genomics Institute - Data Backup Script
# -----------------------------------------------
# This script creates a timestamped backup of the lab's JSON data.
# Run this via cron or before manual deployments.

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$PROJECT_ROOT/data"
BACKUP_BASE="$PROJECT_ROOT/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_BASE/backup_$TIMESTAMP"

echo "🚀 Starting backup for Nexus Genomics Institute..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_BASE"

if [ ! -d "$DATA_DIR" ]; then
    echo "❌ Error: Data directory not found at $DATA_DIR"
    exit 1
fi

# Create timestamped copy
cp -r "$DATA_DIR" "$BACKUP_PATH"

# Compress the backup
tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_BASE" "backup_$TIMESTAMP"

# Remove the uncompressed directory
rm -rf "$BACKUP_PATH"

echo "✅ Backup completed: $BACKUP_PATH.tar.gz"

# Keep only the last 10 backups to save space
ls -t "$BACKUP_BASE"/*.tar.gz | tail -n +11 | xargs rm -f 2>/dev/null

echo "🧹 Old backups cleaned (kept latest 10)."
