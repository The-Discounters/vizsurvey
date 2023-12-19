#!/usr/bin/env pwsh
Write-Output "Start conversion of ids to reference links."
Write-Output "...Creating links for experiments/treatmentQuestions."
# need the "" around the path with the / or it gets interpreted as redirecting output to a file called treatments.id
dsc -q link -f "experiments/treatmentQuestions.treatmentId=>treatments.treatmentId"
if (!($?)) {
   Throw "link failed! See above for error."
}
dsc -q link -f "experiments/treatmentQuestions.questionId=>questions.questionId"
if (!($?)) {
   Throw "link failed! See above for error."
}