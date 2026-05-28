$ErrorActionPreference = "Stop"

$scripts = @(
  "seedHumanEnergyFieldClass5Project.js",
  "seedVoiceAssistantLearningProject.js",
  "seedHandTrackingPainterProject.js",
  "seedHandGestureDjProject.js",
  "seedHandGesturePlatformerProject.js",
  "import-hand-gesture-projects.js"
)

$backendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

if (-not $env:DATABASE_URL) {
  throw "DATABASE_URL is not set. Set it to the full Neon connection string before running this script."
}

$databaseUrl = $env:DATABASE_URL.Trim()
if ($databaseUrl -match "YOUR_NEON_PASSWORD") {
  throw "DATABASE_URL still contains the YOUR_NEON_PASSWORD placeholder. Paste the real password from Neon."
}

if ($databaseUrl -match "\s") {
  throw "DATABASE_URL contains whitespace. Paste the full Neon URL again with no spaces or line breaks."
}

$env:DATABASE_URL = $databaseUrl

$failedScripts = @()

foreach ($script in $scripts) {
  $scriptPath = Join-Path $backendRoot "scripts\$script"
  Write-Host ""
  Write-Host "==> Running $script"
  & node $scriptPath
  if ($LASTEXITCODE -ne 0) {
    $failedScripts += "$script (exit $LASTEXITCODE)"
    Write-Host "WARNING: $script failed with exit code $LASTEXITCODE. Continuing..." -ForegroundColor Yellow
  }
}

Write-Host ""
if ($failedScripts.Count -gt 0) {
  Write-Host "Seed scripts completed with warnings:" -ForegroundColor Yellow
  $failedScripts | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
  exit 1
}

Write-Host "All learning project seed scripts completed."
