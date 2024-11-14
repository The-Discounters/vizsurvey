#!/usr/bin/env pwsh
Write-Output "FIRESTORE_EMULATOR_HOST=$env:FIRESTORE_EMULATOR_HOST" 
$DeleteDecision = Read-Host "I am about to delete all firestore data.  Type delete to continue"
if ($DeleteDecision -ne "delete") {
    Write-Output "!!!delete not typed.  Exiting without making changes!!!"
    exit
}
invoke-expression -Command $PSScriptRoot/delete_exp_config.ps1
invoke-expression -Command $PSScriptRoot/import_exp_config.ps1
invoke-expression -Command $PSScriptRoot/create_links.ps1