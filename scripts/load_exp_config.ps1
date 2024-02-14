#!/usr/bin/env pwsh
invoke-expression -Command $PSScriptRoot/import_exp_config.ps1
invoke-expression -Command $PSScriptRoot/create_links.ps1