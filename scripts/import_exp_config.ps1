$ErrorActionPreference = "Stop"
# import the experiment configuration documents
Write-Output "Start import of configurations."
Write-Output "Importing experiments"
dsc -q import -s $PSScriptRoot/fire_exp_prod.csv -c experiments
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "Importing questions"
dsc -q import -s $PSScriptRoot/fire_ques_prod.csv -c questions
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "Importing treatments"
dsc -q import -s $PSScriptRoot/fire_treat_prod.csv -c treatments
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "Importing treatmentQuestions"
dsc -q import -s $PSScriptRoot/fire_treat_ques_prod.csv -c treatmentQuestions
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "Import of configurations ran succesfully!"