<#
Install a Scheduled Task to run the Node server on system startup.
Usage (run as Administrator):
  PowerShell -ExecutionPolicy Bypass -File .\install-windows-service.ps1

This creates a Scheduled Task named 'ARS-Fuel-Server' which runs node server.js
from the project directory on system startup with highest privileges.
#>

param(
  [string]$Name = 'ARS-Fuel-Server',
  [string]$NodePath = '',
  [string]$WorkingDir = ''
)

if (-not $WorkingDir) { $WorkingDir = Split-Path -Path $PSScriptRoot -Parent }
if (-not $NodePath) {
  $node = (Get-Command node -ErrorAction SilentlyContinue)
  if ($node) { $NodePath = $node.Source } else { Write-Error "Node.js not found in PATH. Install Node or provide -NodePath."; exit 1 }
}

$action = "cmd.exe"
$args = "/c cd /d `"$WorkingDir`" & `"$NodePath`" server.js ^> `"$WorkingDir\server.log`" 2^>^&1"

Write-Output "Creating scheduled task '$Name' -> Action: $action $args"

# remove existing task if present
schtasks /Query /TN $Name > $null 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Output "Task exists — deleting existing task first"
  schtasks /Delete /TN $Name /F
}

schtasks /Create /SC ONSTART /RL HIGHEST /TN $Name /TR "$action $args" /F

if ($LASTEXITCODE -eq 0) { Write-Output "Task created: $Name" } else { Write-Error "Failed to create scheduled task (exit $LASTEXITCODE)" }
