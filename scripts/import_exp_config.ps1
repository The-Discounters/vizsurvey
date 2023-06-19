$ErrorActionPreference = "Stop"
# import the experiment configuration documents
Write-Output "Start import of configurations."
Write-Output "...Importing experiments"
dsc -q import -s ./fire_exp_prod.csv -c experiments
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "...Importing questions"
dsc -q import -s ./fire_ques_prod.csv -c questions
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "....Importing visualizations"
dsc -q import -s ./fire_vis_prod.csv -c visualizations
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "...Importing treatments"
dsc -q import -s ./fire_treat_prod.csv -c treatments
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "...Importing treatment-question-visualizations"
dsc -q import -s ./fire_treat_ques_vis_prod.csv -c treatmentQuestionVisualizations
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "Import of configurations ran succesfully!"