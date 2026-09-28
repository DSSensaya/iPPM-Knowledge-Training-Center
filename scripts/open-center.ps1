$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$url = 'http://127.0.0.1:4173/'

function Show-StartError([string] $message) {
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.MessageBox]::Show(
    $message,
    'iPPM Knowledge & Training Center',
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Error
  ) | Out-Null
}

function Test-Center {
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
  } catch [System.Net.WebException] {
    return $false
  }

  if ($response.Content -notmatch '<title>iPPM Knowledge & Training Center</title>') {
    throw 'Port 4173 wird bereits von einer anderen Anwendung verwendet.'
  }

  return $true
}

try {
  if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'dist\index.html'))) {
    throw 'Der Produktionsstand fehlt. Bitte im Projektordner einmal npm.cmd run build ausführen.'
  }

  if (-not (Test-Center)) {
    $node = (Get-Command node.exe -ErrorAction Stop).Source
    $vite = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'
    if (-not (Test-Path -LiteralPath $vite)) {
      throw 'Die lokalen Abhängigkeiten fehlen. Bitte im Projektordner einmal npm.cmd ci ausführen.'
    }

    $server = Start-Process -FilePath $node `
      -ArgumentList @("`"$vite`"", 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort') `
      -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru

    $ready = $false
    for ($attempt = 0; $attempt -lt 40; $attempt++) {
      Start-Sleep -Milliseconds 250
      if (Test-Center) {
        $ready = $true
        break
      }
      if ($server.HasExited) { break }
    }
    if (-not $ready) {
      throw 'Der lokale Server konnte nicht gestartet werden. Bitte prüfen, ob Port 4173 frei ist.'
    }
  }

  Start-Process $url
} catch {
  Show-StartError $_.Exception.Message
  exit 1
}
