Write-Output "Start conversion of ids to reference links."
Write-Output "...Creating links for treatments"
# convert id fields to reference type for treatments collection
dsc -q link -f treatments.instruction_question_id=>questions.id
if (!($?)) {
    Write-Output "dsc failed with return result $LASTEXITCODE!"
    exit
}
# convert id fields to reference type for treatmentQuestionVisualizations collection
dsc -q link -f treatmentQuestionVisualizations.exp_id=>experiments.id
if (!($?)) {
    Write-Output "dsc failed with return result $LASTEXITCODE!"
    exit
}
dsc -q link -f treatmentQuestionVisualizations.treatment_id=>treatments.id
if (!($?)) {
    Write-Output "dsc failed with return result $LASTEXITCODE!"
    exit
}
dsc -q link -f treatmentQuestionVisualizations.question_id=>questions.id
if (!($?)) {
    Write-Output "dsc failed with return result $LASTEXITCODE!"
    exit
}
dsc -q link -f treatmentQuestionVisualizations.vis_id=>visualizations.id
if (!($?)) {
    Write-Output "dsc failed with return result $LASTEXITCODE!"
    exit
}
Write-Output "Script ran succesfully!"