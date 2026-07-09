# Create a ZIP ready to upload to Hostinger VPS (excludes heavy/local-only folders).
# Run from project root in PowerShell:
#   .\scripts\package-for-vps.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$out = Join-Path $root "deva-vps-deploy.zip"

if (Test-Path $out) { Remove-Item $out -Force }

$excludeDirs = @(
  "node_modules", ".next", ".git", ".vercel", "coverage",
  ".pglite", ".pglite-backup-*", ".git-rewrite",
  "FINIALIZED PHOTOS", "FINIALIZED PHOTOS - 1", "FINIALIZED PHOTOS - 2",
  "FINIALIZED PHOTOS - 3", "FINIALIZED PHOTOS - 4"
)

$items = Get-ChildItem -Path $root -Force | Where-Object {
  $name = $_.Name
  if ($name -eq "deva-vps-deploy.zip") { return $false }
  foreach ($pat in $excludeDirs) {
    if ($name -like $pat) { return $false }
  }
  if ($name -eq ".env") { return $false }
  return $true
}

Compress-Archive -Path ($items | ForEach-Object { $_.FullName }) -DestinationPath $out -CompressionLevel Optimal
Write-Host "Created: $out"
Write-Host "Upload this ZIP to your VPS, then:"
Write-Host "  cd /opt/deva && unzip -o deva-vps-deploy.zip && bash deploy/deploy.sh"
