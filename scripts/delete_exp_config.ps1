$ErrorActionPreference = "Stop"
# import the experiment configuration documents
Write-Output "Start delete of configurations."
Write-Output "...Deleting experiments"
dsc -q delete -c experiments
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "...Deleting questions"
dsc -q delete -c questions
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "....Deleting visualizations"
dsc -q delete -c visualizations
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "...Deleting treatments"
dsc -q delete -c treatments
if (!($?)) {
    Throw "dsc failed! See above for error."
}
Write-Output "Delete of configurations ran succesfully!"







