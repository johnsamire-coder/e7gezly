# Fails when apps/web/src/lib/database.types.ts no longer describes the tables the
# migrations create. database.types.ts is generated output (supabase gen types), so a
# migration that lands without a regenerate leaves the portal's row types - and every
# useList<T> built on them - lying about the live schema.
# Requires only Windows PowerShell + .NET (no network, no npm, no supabase CLI).
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/check-schema-drift.ps1
# Scope: table and column names. It cannot see a type change, and it cannot see a
# dashboard edit that never became a migration file - those are the limits of
# comparing files against files.
param(
    [string]$MigrationsDir,
    [string]$TypesPath
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
if (-not $MigrationsDir) { $MigrationsDir = Join-Path $root "supabase/migrations" }
if (-not $TypesPath) { $TypesPath = Join-Path $root "apps/web/src/lib/database.types.ts" }
if (-not (Test-Path $MigrationsDir)) { throw "no migrations directory at $MigrationsDir" }
if (-not (Test-Path $TypesPath)) { throw "no generated types at $TypesPath" }

# Table name -> column names, in the order the migration lists them.
$tables = @{}

function Add-Columns([string]$name, $columns) {
    if (-not $tables.ContainsKey($name)) { $tables[$name] = @() }
    $tables[$name] = $tables[$name] + @($columns)
}

# A create table body is one entry per line, but a line only ends an entry when it
# carries the comma, so a wrapped definition stays one entry instead of becoming a
# fake column named "null".
function Get-Entries([string]$body) {
    $entries = @()
    $current = ""
    foreach ($raw in ($body -split "`r`n|`n")) {
        $line = ($raw -replace '\s*--.*$', '').Trim()
        if ($line -eq "") { continue }
        if ($current -ne "") { $current += " " }
        $current += $line
        if ($line.EndsWith(",")) {
            $entries += $current.TrimEnd(",").Trim()
            $current = ""
        }
    }
    if ($current.Trim() -ne "") { $entries += $current.TrimEnd(",").Trim() }
    return , $entries
}

function Get-Columns($entries) {
    $columns = @()
    foreach ($entry in $entries) {
        # Table-level constraints are not columns.
        if ($entry -match '^(constraint|unique|check|primary\s+key|foreign\s+key|exclude|like)\b') { continue }
        $name = (($entry -split '\s+')[0] -replace '["`\[\]]', '')
        if ($name -notmatch '^[A-Za-z_][A-Za-z0-9_]*$') { continue }
        $columns += $name
    }
    return $columns
}

foreach ($file in (Get-ChildItem $MigrationsDir -Filter "*.sql" | Sort-Object Name)) {
    $sql = Get-Content -Raw -Encoding UTF8 $file.FullName

    foreach ($m in [regex]::Matches($sql, '(?is)create\s+table\s+(?:if\s+not\s+exists\s+)?public\.([a-z_][a-z0-9_]*)\s*\((.*?)\n\s*\);')) {
        Add-Columns $m.Groups[1].Value (Get-Columns (Get-Entries $m.Groups[2].Value))
    }
    foreach ($m in [regex]::Matches($sql, '(?im)alter\s+table\s+(?:if\s+exists\s+)?public\.([a-z_][a-z0-9_]*)\s+add\s+column\s+(?:if\s+not\s+exists\s+)?([a-z_][a-z0-9_]*)')) {
        Add-Columns $m.Groups[1].Value @($m.Groups[2].Value)
    }
    foreach ($m in [regex]::Matches($sql, '(?im)^\s*drop\s+table\s+(?:if\s+exists\s+)?public\.([a-z_][a-z0-9_]*)')) {
        $tables.Remove($m.Groups[1].Value)
    }
}

# The generated file keeps every Row block on one line: "col": type,"col2": type
$text = Get-Content -Raw -Encoding UTF8 $TypesPath
$public = [regex]::Match($text, '(?is)"public"\s*:\s*\{\s*Tables\s*:\s*\{(.*?)Views\s*:\s*\{')
if (-not $public.Success) { throw "no public Tables block found in $TypesPath - is this a supabase gen types file?" }

$generated = @{}
foreach ($m in [regex]::Matches($public.Groups[1].Value, '(?is)"([a-z_][a-z0-9_]*)"\s*:\s*\{\s*Row\s*:\s*\{([^}]*)\}')) {
    $columns = @([regex]::Matches($m.Groups[2].Value, '"([a-z_][a-z0-9_]*)"\s*:') | ForEach-Object { $_.Groups[1].Value })
    $generated[$m.Groups[1].Value] = $columns
}

$problems = @()

foreach ($name in ($tables.Keys | Sort-Object)) {
    if (-not $generated.ContainsKey($name)) {
        $problems += "table '$name' is created by a migration but missing from the generated types"
        continue
    }
    $missing = @($tables[$name] | Sort-Object -Unique) | Where-Object { $generated[$name] -notcontains $_ }
    $extra = @($generated[$name] | Sort-Object -Unique) | Where-Object { $tables[$name] -notcontains $_ }
    if ($missing.Count -gt 0) {
        $problems += "table '$name': columns in the migrations but not in the types -> $($missing -join ', ')"
    }
    if ($extra.Count -gt 0) {
        $problems += "table '$name': columns in the types but not in the migrations -> $($extra -join ', ')"
    }
}
foreach ($name in ($generated.Keys | Sort-Object)) {
    if (-not $tables.ContainsKey($name)) {
        $problems += "table '$name' is in the generated types but no migration creates it"
    }
}

if ($problems.Count -gt 0) {
    Write-Output "database.types.ts has drifted from supabase/migrations:"
    foreach ($problem in $problems) { Write-Output "  - $problem" }
    Write-Output ""
    Write-Output "Regenerate it against the project those migrations were applied to:"
    Write-Output "  supabase gen types typescript --project-id <ref> --schema public > apps/web/src/lib/database.types.ts"
    exit 1
}

$count = ($tables.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
Write-Output "database.types.ts matches supabase/migrations ($($tables.Keys.Count) tables, $count columns)"
