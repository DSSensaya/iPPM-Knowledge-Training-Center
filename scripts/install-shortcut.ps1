[CmdletBinding(SupportsShouldProcess)]
param()

$ErrorActionPreference = 'Stop'
$launcher = Join-Path $PSScriptRoot 'open-center.ps1'
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'iPPM Knowledge & Training Center.lnk'
$powershell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$launcher`""

if (-not (Test-Path -LiteralPath $launcher -PathType Leaf)) {
  throw "Startskript fehlt: $launcher"
}
if (-not (Test-Path -LiteralPath $desktop -PathType Container)) {
  throw 'Der Windows-Desktopordner ist nicht verfügbar.'
}

Write-Output "Ziel: $shortcutPath`nProgramm: $powershell`nArgumente: $arguments"
if (-not $PSCmdlet.ShouldProcess($shortcutPath, 'Desktop-Verknüpfung erstellen oder aktualisieren')) {
  return
}

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
if ((Test-Path -LiteralPath $shortcutPath) -and
    ($shortcut.TargetPath -ne $powershell -or $shortcut.Arguments -ne $arguments)) {
  throw 'Eine abweichende Verknüpfung gleichen Namens existiert bereits. Sie bleibt unverändert; bitte vor einer Ersetzung prüfen.'
}
$shortcut.TargetPath = $powershell
$shortcut.Arguments = $arguments
$shortcut.WorkingDirectory = Split-Path -Parent $PSScriptRoot
$shortcut.Description = 'iPPM Knowledge & Training Center lokal öffnen'
$shortcut.IconLocation = "$powershell,0"
$shortcut.Save()

Write-Output "Desktop-Verknüpfung erstellt: $shortcutPath"
