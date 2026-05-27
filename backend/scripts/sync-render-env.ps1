param(
  [string]$EnvPath = (Join-Path $PSScriptRoot "..\.env"),
  [string]$ServiceId = "srv-d8bd6077f7vs73bvslcg",
  [switch]$NoDeploy
)

$ErrorActionPreference = "Stop"

$skipKeys = @(
  "PORT",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "NODE_ENV",
  "FCM_SERVICE_ACCOUNT_PATH"
)

function ConvertFrom-SecureStringPlainText {
  param([securestring]$Secure)

  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
  try {
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

function Get-ResponseBody {
  param($ErrorRecord)

  $response = $ErrorRecord.Exception.Response
  if (-not $response) {
    return $ErrorRecord.Exception.Message
  }

  try {
    $stream = $response.GetResponseStream()
    if (-not $stream) {
      return $ErrorRecord.Exception.Message
    }

    $reader = [System.IO.StreamReader]::new($stream)
    return $reader.ReadToEnd()
  } catch {
    return $ErrorRecord.Exception.Message
  }
}

function Invoke-RenderApi {
  param(
    [string]$Method,
    [string]$Uri,
    [hashtable]$Headers,
    [string]$Body
  )

  try {
    if ($Body) {
      return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers -Body $Body
    }

    return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers
  } catch {
    $status = $null
    if ($_.Exception.Response) {
      $status = [int]$_.Exception.Response.StatusCode
    }

    $bodyText = Get-ResponseBody $_
    throw "Render API request failed ($Method $Uri) status=$status body=$bodyText"
  }
}

if (-not (Test-Path -LiteralPath $EnvPath)) {
  throw "Env file not found: $EnvPath"
}

$dbUrl = [string]$env:DATABASE_URL
$dbUrl = $dbUrl.Trim()
if (-not $dbUrl) {
  throw "DATABASE_URL is not set in this PowerShell session."
}

if ($dbUrl -notmatch "^postgres(ql)?://") {
  throw "DATABASE_URL must be the full PostgreSQL URL, not just the Neon password."
}

if ($dbUrl -notmatch "@") {
  throw "DATABASE_URL is missing the '@host/database' part."
}

if ($dbUrl -match "\s") {
  throw "DATABASE_URL contains whitespace. Set it again without trailing spaces."
}

$secureRenderKey = Read-Host "Paste Render API key" -AsSecureString
$renderKey = (ConvertFrom-SecureStringPlainText $secureRenderKey).Trim()

if ($renderKey -match "postgres(ql)?://|neon\.tech|^npg_") {
  throw "That looks like a Neon database value. Paste the Render API key from Render Account Settings > API Keys."
}

if ($renderKey.Length -lt 20) {
  throw "That Render API key looks too short."
}

$envVarsByKey = [ordered]@{}

Get-Content -LiteralPath $EnvPath | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) {
    return
  }

  $idx = $line.IndexOf("=")
  $key = $line.Substring(0, $idx).Trim()
  $value = $line.Substring($idx + 1).Trim().Trim('"').Trim("'")

  if (-not $key -or -not $value) {
    return
  }

  if ($skipKeys -contains $key) {
    return
  }

  if ($value -match "your_.*_here|your-key|replace_with") {
    return
  }

  $envVarsByKey[$key] = $value
}

$envVarsByKey["DATABASE_URL"] = $dbUrl
$envVarsByKey["NODE_ENV"] = "production"
$envVarsByKey["PORT"] = "10000"
$envVarsByKey["AI_DAILY_CAP"] = "30"

Write-Host ""
Write-Host "Will update $($envVarsByKey.Count) Render env vars for service ${ServiceId}:"
foreach ($key in $envVarsByKey.Keys) {
  $value = [string]$envVarsByKey[$key]
  $preview = if ($value.Length -gt 4) { $value.Substring(0, 4) + "***" } else { "***" }
  Write-Host "  $key = $preview"
}

Write-Host ""
Write-Host "Important: this updates service-level variables one by one; it does not delete other Render variables."
$confirm = Read-Host "Send? (yes/no)"
if ($confirm -ne "yes") {
  Write-Host "Aborted."
  exit 0
}

$headers = @{
  "Authorization" = "Bearer $renderKey"
  "Content-Type"  = "application/json"
  "Accept"        = "application/json"
}

# Quick auth check gives a clearer error before sending secrets.
Invoke-RenderApi `
  -Method "GET" `
  -Uri "https://api.render.com/v1/services/$ServiceId/env-vars?limit=1" `
  -Headers $headers | Out-Null

foreach ($key in $envVarsByKey.Keys) {
  $encodedKey = [uri]::EscapeDataString($key)
  $body = @{ value = [string]$envVarsByKey[$key] } | ConvertTo-Json -Compress
  Invoke-RenderApi `
    -Method "PUT" `
    -Uri "https://api.render.com/v1/services/$ServiceId/env-vars/$encodedKey" `
    -Headers $headers `
    -Body $body | Out-Null

  Write-Host "Updated $key"
}

if ($NoDeploy) {
  Write-Host "Env vars updated. Skipped deploy because -NoDeploy was set."
  exit 0
}

$deployBody = @{ clearCache = "do_not_clear" } | ConvertTo-Json -Compress
$deploy = Invoke-RenderApi `
  -Method "POST" `
  -Uri "https://api.render.com/v1/services/$ServiceId/deploys" `
  -Headers $headers `
  -Body $deployBody

Write-Host "Env vars updated."
Write-Host "Deploy: $($deploy.id)"
