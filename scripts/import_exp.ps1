# import the experiment configuration documents
dis import -s ../doc/fire_exp_prod.csv -c experiments
dis import -s ../doc/fire_ques_prod.csv -c questions
dis import -s ../doc/fire_vis_prod.csv -c visualizations
dis import -s ../doc/fire_treat_prod.csv -c treatments
dis import -s ../doc/fire_treat_ques_vis_prod.csv -c expTreatments
dis import -s ../doc/fire_seven_square_prod.csv -c expSevenSquares
# convert id fields to reference type for fire_treat_ques_vis_prod.csv
dis link -f expTreatments.exp_id=>experiments.id
dis link -f expTreatments.treatment_id=>treatments.id
dis link -f expTreatments.question_id=>questions.id
dis link -f expTreatments.vis_id=>visualizations.id
# convert id fields to reference type for fire_treat_prod.csv
dis link -f treatments.instruction_question_id=>questions.id
# convert id fields to reference type for fire_seven_square_prod.csv
dis link -f expSevenSquares.exp_id=>experiments.id
dis link -f expSevenSquares.treatment_id=>treatments.id








