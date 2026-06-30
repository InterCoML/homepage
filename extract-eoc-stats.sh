#!/bin/bash
# Extracts aggregate Equal Opportunity statistics from the WG members CSV into
# _data/eoc_dashboard.yml, via the Docker container (so no local Ruby is needed).
#
# Usage: ./extract-eoc-stats.sh [path/to/members.csv]

CSV="${1:-CA24136-WG-members.csv}"

if [ ! -f "$CSV" ]; then
  echo "Error: CSV file '$CSV' not found"
  echo "Usage: ./extract-eoc-stats.sh [path/to/members.csv]"
  exit 1
fi

docker compose run --rm intercoml-homepage ruby scripts/extract-eoc-stats.rb "$CSV"
