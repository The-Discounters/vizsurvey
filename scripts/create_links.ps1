Write-Output "Start conversion of ids to reference links."
Write-Output "...Creating links for treatments."
dsc -q link -f treatments.instruction_question_id=>questions.id
if (!($?)) {
    Throw "link failed! See above for error."
}
Write-Output "...Creating links for treatmentQuestions."
dsc -q link -f treatmentQuestions.exp_id=>experiments.id
if (!($?)) {
    Throw "link failed! See above for error."
}
dsc -q link -f treatmentQuestions.treatment_id=>treatments.id
if (!($?)) {
    Throw "link failed! See above for error."
}
dsc -q link -f treatmentQuestions.question_id=>questions.id
if (!($?)) {
    Throw "link failed! See above for error."
}
Write-Output "Linking ran succesfully!"