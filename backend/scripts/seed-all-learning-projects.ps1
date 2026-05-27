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

foreach ($script in $scripts) {
  $scriptPath = Join-Path $backendRoot "scripts\$script"
  Write-Host ""
  Write-Host "==> Running $script"
  & node $scriptPath
  if ($LASTEXITCODE -ne 0) {
    throw "$script failed with exit code $LASTEXITCODE"
  }
}

Write-Host ""
Write-Host "All learning project seed scripts completed."
