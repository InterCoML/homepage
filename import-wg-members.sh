#!/bin/bash
# Imports approved working group members from a CSV file into _data/members/
# via the Docker container (so no local Ruby installation is needed).
#
# Usage: ./import-wg-members.sh [path/to/members.csv]

CSV="${1:-CA24136-WG-members.csv}"

if [ ! -f "$CSV" ]; then
  echo "Error: CSV file '$CSV' not found"
  echo "Usage: ./import-wg-members.sh [path/to/members.csv]"
  exit 1
fi

docker compose run --rm intercoml-homepage ruby scripts/import-wg-members.rb "$CSV"
