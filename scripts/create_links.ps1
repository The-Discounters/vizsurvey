#!/usr/bin/env pwsh
Write-Output "Start conversion of ids to reference links."
#Write-Output "...Creating links for treatmentQuestions."
# dsc -q link -f treatmentQuestions.exp_id=>experiments.id -p experiments
#if (!($?)) {
#    Throw "link failed! See above for error."
#}
# dsc -q link -f treatmentQuestions.treatment_id=>treatments.id -p experiments
#if (!($?)) {
#    Throw "link failed! See above for error."
#}
# dsc -q link -f treatmentQuestions.question_id=>questions.id -p experiments
# if (!($?)) {
#    Throw "link failed! See above for error."
#}