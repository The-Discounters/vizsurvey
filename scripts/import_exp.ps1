$ErrorActionPreference = "Stop"
# import the experiment configuration documents
Write-Output "Start import of configurations."
Write-Output "...Importing experiments"
dsc -q import -s ../doc/fire_exp_prod.csv -c experiments
if (!($?)) {
    Write-Output "dsc failed!"
    exit
}
Write-Output "...Importing questions"
dsc -q import -s ../doc/fire_ques_prod.csv -c questions
if (!($?)) {
    Write-Output "dsc failed!"
    exit
}
Write-Output "....Importing visualizations"
dsc -q import -s ../doc/fire_vis_prod.csv -c visualizations
if (!($?)) {
    Write-Output "dsc failed!"
    exit
}
Write-Output "...Importing treatments"
dsc -q import -s ../doc/fire_treat_prod.csv -c treatments
if (!($?)) {
    Write-Output "dsc failed!"
    exit
}
Write-Output "...Importing treatment-question-visualizations"
dsc -q import -s ../doc/fire_treat_ques_vis_prod.csv -c treatmentQuestionVisualizations
if (!($?)) {
    Write-Output "dsc failed!"
    exit
}
Write-Output "Script ran succesfully!"







