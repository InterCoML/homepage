#!/usr/bin/env ruby
#
# Extracts aggregate Equal Opportunity statistics from the WG members CSV and
# writes them to _data/eoc_dashboard.yml.
#
# Usage: ruby scripts/extract-eoc-stats.rb [path/to/members.csv]
#   (defaults to CA24136-WG-members.csv in the project root)
#
# Only the `meta`, `members` and `mc` keys at the top of the output file are
# owned by this script. Everything below the MANUAL SECTION marker (the
# hand-maintained conference/STSM entries) is preserved verbatim on re-run.
#
# Privacy: only aggregate counts/percentages are written — no names, emails or
# any per-person data leave the CSV. The CSV itself is not committed (.gitignore).

require 'csv'
require 'date'

CSV_PATH = ARGV[0] || 'CA24136-WG-members.csv'
OUT_PATH = '_data/eoc_dashboard.yml'
MARKER = '# === MANUAL SECTION (edited by hand — preserved when this script re-runs) ==='

unless File.exist?(CSV_PATH)
  STDERR.puts "Error: CSV file '#{CSV_PATH}' not found"
  STDERR.puts "Usage: ruby scripts/extract-eoc-stats.rb [path/to/members.csv]"
  exit 1
end

def parse_country(country_str)
  # "Serbia (RS)" -> "Serbia"
  country_str.to_s.sub(/\s*\([^)]*\)\s*$/, '').strip
end

def compute_box(rows, title, subtitle, members_word)
  n = rows.size
  women = rows.count { |r| r['Gender'].to_s.strip == 'Female' }
  men   = rows.count { |r| r['Gender'].to_s.strip == 'Male' }
  other = n - women - men
  itc   = rows.count { |r| r['ITC'].to_s.strip == 'y' }
  yr    = rows.count { |r| r['Young Researcher'].to_s.strip == 'y' }
  countries = rows.map { |r| parse_country(r['Country']) }.reject(&:empty?).uniq.size

  pct = ->(x) { n.zero? ? 0.0 : (100.0 * x / n).round(1) }

  note = "Men: #{men} (#{pct.call(men)}%)"
  note += " · Other / prefer not to say: #{other} (#{pct.call(other)}%)" if other.positive?

  {
    title: title,
    subtitle: subtitle,
    headline: n.to_s,
    headline_label: "#{members_word} across #{countries} countries",
    stats: [
      ['Women', "#{pct.call(women)}%", women, n],
      ['ITC', "#{pct.call(itc)}%", itc, n],
      ['Young Researchers', "#{pct.call(yr)}%", yr, n],
    ],
    note: note,
  }
end

def box_to_yaml(key, box)
  lines = ["#{key}:"]
  lines << %Q(  title: "#{box[:title]}")
  lines << %Q(  subtitle: "#{box[:subtitle]}")
  lines << %Q(  headline: "#{box[:headline]}")
  lines << %Q(  headline_label: "#{box[:headline_label]}")
  lines << '  stats:'
  box[:stats].each do |label, value, num, den|
    lines << %Q(    - label: "#{label}")
    lines << %Q(      value: "#{value}")
    lines << "      fraction: [#{num}, #{den}]"
  end
  lines << %Q(  note: "#{box[:note]}")
  lines.join("\n")
end

SEED_MANUAL = <<~'YAML'

  # Each entry below renders as its own summary box on the dashboard.
  # Add as many entries as you like; provide `fraction: [count, total]` on a stat
  # to draw a bar. These figures are gathered by hand (not available in the CSV).

  conference:
    - title: "Inaugural Conference: NextGen Synergy"
      subtitle: "Inclusiveness in scientific visibility"
      headline: "90+"
      headline_label: "participants across 21 countries"
      stats:
        - label: "ITC countries"
          value: "17/21"
          fraction: [17, 21]
        - label: "Women keynote speakers"
          value: "1/8"
          fraction: [1, 8]
      note: "Hosted in Prague · local chair: Tatiana Valentine Guy · ~5 women session chairs"

  stsm:
    - title: "STSM Participation"
      subtitle: "Mobility and career development"
      headline: "5"
      headline_label: "STSM applications (1 call)"
      stats:
        - label: "ITC countries involved"
          value: "4/6"
          fraction: [4, 6]
        - label: "Women applicants"
          value: "2/5"
          fraction: [2, 5]
      note: "2 ITC ↔ ITC missions · broader participation to encourage"
YAML

rows = CSV.read(CSV_PATH, headers: true, col_sep: ';', encoding: 'bom|utf-8')

members = rows.select { |r| r['Application Status'].to_s.strip.downcase == 'approved' }
mc      = rows.select { |r| r['MC Membership Status'].to_s.strip == 'Member' }

members_box = compute_box(members, 'Action Members', 'Composition of the Action', 'members')
mc_box      = compute_box(mc, 'Management Committee', 'Governance representation', 'MC members')

auto = []
auto << '# Equal Opportunity Dashboard data.'
auto << '#'
auto << '# The `meta`, `members` and `mc` keys below are AUTO-GENERATED from'
auto << '# CA24136-WG-members.csv by scripts/extract-eoc-stats.rb — do not edit'
auto << '# them by hand; re-run the script to refresh. Aggregate counts only;'
auto << '# no personal data is stored here.'
auto << ''
auto << 'meta:'
auto << %Q(  generated: "#{Date.today.iso8601}")
auto << '  source: "CA24136-WG-members.csv"'
auto << ''
auto << box_to_yaml('members', members_box)
auto << ''
auto << box_to_yaml('mc', mc_box)
auto << ''
auto_text = auto.join("\n") + "\n"

# Preserve the manual section if the file already exists.
manual =
  if File.exist?(OUT_PATH) && File.read(OUT_PATH).include?(MARKER)
    File.read(OUT_PATH).split(MARKER, 2)[1]
  else
    "\n" + SEED_MANUAL
  end

File.write(OUT_PATH, auto_text + MARKER + manual)

puts "Wrote #{OUT_PATH}"
puts "  Action Members:       #{members_box[:headline]} (#{members_box[:headline_label]})"
puts "  Management Committee: #{mc_box[:headline]} (#{mc_box[:headline_label]})"
