$ErrorActionPreference = "Stop"
$src = "C:\Users\karesuvartharaju\.cursor\projects\x-deva-safety-nets\assets\c__Users_karesuvartharaju_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-acde20b5-ecc7-4e61-941d-734459917e1d.png"
$outDir = Join-Path $PSScriptRoot "..\public\images"
$dest = Join-Path $outDir "deva-logo.jpg"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
if (-not (Test-Path $src)) {
  Write-Error "Source logo not found: $src"
}

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($src)
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92L)
$img.Save($dest, $encoder, $params)
$img.Dispose()

Write-Output "Saved $dest ($((Get-Item $dest).Length) bytes)"
