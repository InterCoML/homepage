#!/usr/bin/env ruby
#
# Imports approved working group members from a CSV file into _data/members/.
#
# Usage: ruby scripts/import-wg-members.rb [path/to/members.csv]
#   (defaults to CA24136-WG-members.csv in the project root)
#
# For each row with Application Status = "approved":
#   - If a member YAML file with the matching slug exists: only update the
#     "wgs" field, preserving all other fields.
#   - Otherwise: create a new member YAML file with name, mail, address, wgs.
#
# Naming scheme:
#   - Default: lastname slug (e.g. "kleikamp")
#   - On collision (multiple people with same last name): firstname-lastname
#     slug (e.g. "dilek-erdogan", "esref-erdogan")
#
# The CSV should not be committed to the repository (see .gitignore).

require 'csv'
require 'yaml'
require 'fileutils'

CSV_PATH = ARGV[0] || 'CA24136-WG-members.csv'
MEMBERS_DIR = '_data/members'

def slugify(text)
  text.to_s
      .unicode_normalize(:nfkd)
      .gsub(/[^\x00-\x7F]/, '')
      .downcase
      .gsub(/[^a-z0-9]+/, '-')
      .gsub(/^-+|-+$/, '')
end

def parse_wgs(wg_string)
  return [] if wg_string.nil? || wg_string.strip.empty?
  return [] if wg_string.strip.downcase == 'n/a'
  wg_string.scan(/WG(\d+)/).flatten.map(&:to_i).uniq.sort
end

def parse_country(country_str)
  # "Serbia (RS)" -> "Serbia"
  country_str.to_s.sub(/\s*\([^)]*\)\s*$/, '').strip
end

unless File.exist?(CSV_PATH)
  STDERR.puts "Error: CSV file '#{CSV_PATH}' not found"
  STDERR.puts "Usage: ruby scripts/import-wg-members.rb [path/to/members.csv]"
  exit 1
end

FileUtils.mkdir_p(MEMBERS_DIR)

# First pass: collect approved rows and find lastname-slug collisions
approved_rows = []
lastname_to_names = Hash.new { |h, k| h[k] = [] }

CSV.foreach(CSV_PATH, headers: true, col_sep: ';', encoding: 'bom|utf-8') do |row|
  status = row['Application Status'].to_s.strip.downcase
  next unless status == 'approved'

  first = row['First Name'].to_s.strip
  last = row['Last Name'].to_s.strip
  next if first.empty? || last.empty?

  full_name = "#{first} #{last}"
  last_slug = slugify(last)

  approved_rows << {
    first: first,
    last: last,
    full_name: full_name,
    last_slug: last_slug,
    email: row['Email'].to_s.strip,
    affiliation: row['Affiliation'].to_s.strip,
    country: parse_country(row['Country']),
    wgs: parse_wgs(row['Assigned Working Groups']),
  }
  lastname_to_names[last_slug] << full_name unless lastname_to_names[last_slug].include?(full_name)
end

# Second pass: determine final slug for each row, write YAML files
new_count = 0
update_count = 0
warnings = []

approved_rows.each do |r|
  if lastname_to_names[r[:last_slug]].size > 1
    # Collision: use firstname-lastname slug
    member_id = "#{slugify(r[:first])}-#{r[:last_slug]}"
    # Warn if a lastname-only file exists (might already belong to one of these people)
    legacy_path = File.join(MEMBERS_DIR, "#{r[:last_slug]}.yml")
    if File.exist?(legacy_path)
      warnings << "  '#{r[:last_slug]}.yml' exists but '#{r[:last_slug]}' now collides between: #{lastname_to_names[r[:last_slug]].join(', ')}. Consider renaming it manually (e.g. to '<firstname>-#{r[:last_slug]}.yml') and updating references in mc_members.yml / cg_members.yml / leadership_roles.yml."
    end
  else
    member_id = r[:last_slug]
  end

  yaml_path = File.join(MEMBERS_DIR, "#{member_id}.yml")

  if File.exist?(yaml_path)
    # Update existing file: only modify the wgs field, keep everything else
    existing = YAML.load_file(yaml_path) || {}
    if existing['wgs'] != r[:wgs]
      lines = File.readlines(yaml_path)
      lines.reject! { |l| l =~ /^wgs:/ }
      lines << "\n" unless lines.empty? || lines.last.end_with?("\n")
      lines << "wgs: [#{r[:wgs].join(', ')}]\n"
      File.write(yaml_path, lines.join)
      update_count += 1
      puts "  Updated wgs for #{member_id}: [#{r[:wgs].join(', ')}]"
    end
  else
    # Create new member YAML
    address_parts = [r[:affiliation], r[:country]].reject(&:empty?)
    File.open(yaml_path, 'w') do |f|
      f.puts %Q(name: "#{r[:full_name]}")
      f.puts %Q(mail: "#{r[:email]}") unless r[:email].empty?
      f.puts %Q(address: "#{address_parts.join(', ')}") unless address_parts.empty?
      f.puts "wgs: [#{r[:wgs].join(', ')}]"
    end
    new_count += 1
    puts "  Created #{member_id}.yml (#{r[:full_name]})"
  end
end

puts ""
puts "Summary: #{new_count} new members created, #{update_count} existing members updated"

unless warnings.empty?
  puts ""
  puts "WARNINGS:"
  puts warnings.uniq
end
