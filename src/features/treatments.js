export const TREATMENTS_DEV_CSV = `treatment_id,position,view_type,interaction,variable_amount,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,horizontal_pixels,vertical_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,width_in,height_in,show_minor_ticks,instruction_gif_prefix,comment
1,1,word,none,none,500,2,,1000,5,,,10,,,,,,,4,4,,,Worded with no interaction and Read 2001 example values.
1,2,word,none,none,50,2,,300,7,,,10,,,,,,,8,8,,,Worded with no interaction and Read 2001 example values.
1,3,word,none,none,250,2,,1000,3,,,10,,,,,,,8,8,,,Worded with no interaction and Read 2001 example values.
1,instructions,word,none,none,300,2,,700,7,,1000,,,,,,,,,,,introduction-word,Worded MEL question experiment 3 of date/delay paper instructions.
2,1,barchart,none,none,300,2,,700,5,,1100,10,,,1,1,7,7,8.5,8.5,yes,,Barchart MEL question with no interaction inches and minor tick marks.
2,2,barchart,none,none,500,2,,800,7,,1100,15,,,1,1,7,7,8.5,8.5,yes,,Barchart with no interaction inches and minor tick marks.
2,3,barchart,none,none,300,2,,1000,7,,1100,15,,,1,1,3.5,3.5,4.5,4.5,yes,,Barchart with no interaction inches and minor tick marks.
2,instructions,barchart,none,none,300,2,,700,7,,1000,15,,,1,1,3.5,3.5,4.5,4.5,yes,introduction-barchart-ticks-right,Barchart with no interaction inches and minor tick marks instructions.
3,1,barchart,none,none,300,2,,700,5,,1100,10,800,300,,,,,,,no,,Barchart MEL question with no interaction pixels.
3,2,barchart,none,none,300,2,,700,5,,1100,6,800,300,,,,,,,no,,Barchart MEL question with no interaction pixels.
3,3,barchart,none,none,500,2,,800,7,,1100,15,800,300,,,,,,,no,,Barchart with no interaction pixels.
3,4,barchart,none,none,500,2,,800,7,,1100,8,800,300,,,,,,,no,,Barchart with no interaction pixels.
3,5,barchart,none,none,300,2,,1000,7,,1100,15,800,300,,,,,,,no,,Barchart with no interaction pixels.
3,instructions,barchart,none,none,300,2,,700,7,,1000,15,800,300,,,,,,,no,introduction-barchart-ticks-right,Barchart with no interaction pixels instructions.
4,1,calendarBar,none,none,300,,2/1/2022,700,,2/22/2022,1100,,100,100,,,,,8,8,,,Calendar month view with barchart and no interaction.
4,2,calendarBar,none,none,500,,3/1/2022,800,,3/12/2022,1100,,100,100,,,,,8,8,,,Calendar month view with barchart and no interaction.
4,3,calendarBar,none,none,300,,4/1/2022,1000,,4/15/2022,1100,,100,100,,,,,8,8,,,Calendar month view with barchart and no interaction.
4,instructions,calendarBar,none,none,300,,4/1/2022,1000,,4/15/2022,1100,,100,100,,,,,8,8,,introduction-calendarBar,Calendar month view with barchart and no interaction instructions.
5,1,calendarWord,none,none,300,,2/1/2022,700,,2/22/2022,1100,,100,100,,,,,8,8,,,Calendar month view with word and no interaction.
5,2,calendarWord,none,none,500,,3/1/2022,800,,3/12/2022,1100,,100,100,,,,,8,8,,,Calendar month view with word and no interaction.
5,3,calendarWord,none,none,300,,4/1/2022,1000,,4/15/2022,1100,,100,100,,,,,8,8,,,Calendar month view with word and no interaction.
5,instructions,calendarWord,none,none,300,,4/1/2022,1000,,4/15/2022,1100,,100,100,,,,,8,8,,introduction-calendarWord,Calendar month view with word and no interaction.
6,1,barchart,drag,laterAmount,500,2,,1000,10,,1500,10,100,100,0.5,0.5,8,8,8.5,8.5,,,Barchart with drag interaction.
6,instructions,barchart,drag,laterAmount,500,2,,1000,10,,1500,10,100,100,0.5,0.5,8,8,8.5,8.5,no,introduction-barchart-no-ticks-none-right,Barchart with drag interaction.
7,1,calendar,drag,laterAmount,500,,2/1/2022,1000,,2/22/2022,1100,,100,100,,,,,8,8,,,"Read 2001 example, absolute size"
7,instructions,calendarBar,drag,laterAmount,500,,2/1/2022,1000,,2/22/2022,1100,,100,100,,,,,8,8,,introduction-calendarBar,"Read 2001 example, absolute size"
8,1,word,titration,laterAmount,500,2,,1000,3,,,10,,,,,,,8,8,,,Word with titration interaction.
8,instructions,word,titration,laterAmount,500,2,,1000,3,,,10,,,,,,,8,8,,introduction-word,Word with titration interaction.
9,1,barchart,titration,laterAmount,500,2,,1000,10,,1500,10,100,100,0.5,0.5,8,8,8.5,8.5,,,Barchat with titration interaction.
9,instructions,barchart,titration,laterAmount,500,2,,1000,10,,1500,10,100,100,0.5,0.5,8,8,8.5,8.5,no,introduction-barchart-no-ticks-none-right,Barchat with titration interaction.
10,1,calendarBar,titration,laterAmount,500,,2/1/2022,1000,,2/22/2022,1100,,100,100,,,,,8,8,,,Calendar month view with barchart and titration interaction.
10,instructions,calendarBar,titration,laterAmount,500,,2/1/2022,1000,,2/22/2022,1100,,100,100,,,,,8,8,,introduction-calendarBar,Calendar month view with barchart and titration interaction.
11,1,calendarWord,titration,laterAmount,500,,2/1/2022,1000,,2/22/2022,1100,,100,100,,,,,8,8,,,Calendar month view with word and titration interaction.
11,instructions,calendarWord,titration,laterAmount,500,,2/1/2022,1000,,2/22/2022,1100,,100,100,,,,,8,8,,introduction-calendarWord,Calendar month view with word and titration interaction.
12,1,calendarBar,drag,laterAmount,500,,2/1/2022,1000,,2/22/2022,1100,,100,100,,,,,8,8,,,Calendar month view with barchart and drag interaction.
12,instructions,calendarBar,drag,laterAmount,500,,2/1/2022,1000,,2/22/2022,1100,,100,100,,,,,8,8,,introduction-calendarBar,Calendar month view with barchart and drag interaction.
13,1,calendarWord,titration,laterAmount,500,,2/1/2022,1000,,10/1/2022,1100,,100,100,,,,,10,8,,,Calendar year view with word and titration interaction.
13,instructions,calendarWord,titration,laterAmount,500,,2/1/2022,1000,,10/1/2022,1100,,100,100,,,,,10,8,,introduction-calendarWord,Calendar year view with word and titration interaction.
14,1,calendarBar,drag,laterAmount,500,,2/1/2022,1000,,10/1/2022,1100,,100,100,,,,,10,8,,,Calendar year view with barchart and drag interaction.
14,1,calendarBar,drag,laterAmount,500,,2/1/2022,1000,,10/1/2022,1100,,100,100,,,,,10,8,,,Calendar year view with barchart and drag interaction.
15,1,calendarWord,none,none,300,,2/1/2022,700,,5/22/2022,1100,,100,100,,,,,10,8,,,Calendar year view with word and no interaction.
15,2,calendarWord,none,none,500,,3/1/2022,800,,6/12/2022,1100,,100,100,,,,,10,8,,,Calendar year view with word and no interaction.
15,3,calendarWord,none,none,300,,4/1/2022,1000,,7/15/2022,1100,,100,100,,,,,10,8,,,Calendar year view with word and no interaction.
15,instructions,calendarWord,none,none,300,,4/1/2022,1000,,7/15/2022,1100,,100,100,,,,,10,8,,introduction-calendarWord,Calendar year view with word and no interaction.
16,1,calendarBar,none,none,300,,2/1/2022,700,,5/22/2022,1100,,100,100,,,,,10,8,,,Calendar year view with bar and no interaction.
16,2,calendarBar,none,none,500,,3/1/2022,800,,6/12/2022,1100,,100,100,,,,,10,8,,,Calendar year view with bar and no interaction.
16,3,calendarBar,none,none,300,,4/1/2022,1000,,7/15/2022,1100,,100,100,,,,,10,8,,,Calendar year view with bar and no interaction.
16,instructions,calendarBar,none,none,300,,4/1/2022,1000,,7/15/2022,1100,,100,100,,,,,10,8,,introduction-calendarBar,Calendar year view with bar and no interaction.
17,1,calendarIcon,none,none,300,,2/1/2022,700,,5/22/2022,1100,,100,100,,,,,10,8,,,Calendar year view with icon and no interaction.
17,2,calendarIcon,none,none,500,,3/1/2022,800,,6/12/2022,1100,,100,100,,,,,10,8,,,Calendar year view with icon and no interaction.
17,3,calendarIcon,none,none,300,,4/1/2022,1000,,7/15/2022,1100,,100,100,,,,,10,8,,,Calendar year view with icon and no interaction.
17,instructions,calendarIcon,none,none,300,,4/1/2022,1000,,7/15/2022,1100,,100,100,,,,,10,8,,introduction-calendarIcon,Calendar year view with icon and no interaction.
18,1,calendarIcon,none,none,300,,2/1/2022,700,,2/22/2022,1100,,100,100,,,,,8,8,,,Calendar month view with icon and no interaction.
18,2,calendarIcon,none,none,500,,3/1/2022,800,,3/12/2022,1100,,100,100,,,,,8,8,,,Calendar month view with icon and no interaction.
18,3,calendarIcon,none,none,300,,4/1/2022,1000,,4/15/2022,1100,,100,100,,,,,8,8,,,Calendar month view with icon and no interaction.
18,instructions,calendarIcon,none,none,300,,4/1/2022,1000,,4/15/2022,1100,,100,100,,,,,8,8,,introduction-calendarIcon,Calendar month view with icon and no interaction.
19,1,calendarIcon,titration,laterAmount,300,,2/1/2022,700,,2/22/2022,1100,,100,100,,,,,8,8,,,Calendar month view with icon and titration interaction.
19,2,calendarIcon,titration,laterAmount,500,,3/1/2022,800,,3/12/2022,1100,,100,100,,,,,8,8,,,Calendar month view with icon and titration interaction.
19,3,calendarIcon,titration,laterAmount,300,,4/1/2022,1000,,4/15/2022,1100,,100,100,,,,,8,8,,,Calendar month view with icon and titration interaction.
19,instructions,calendarIcon,titration,laterAmount,300,,4/1/2022,1000,,4/15/2022,1100,,100,100,,,,,8,8,,introduction-calendarIcon,Calendar month view with icon and titration interaction.
20,1,word,none,none,350,4,,430,13,,430,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
20,2,word,none,none,490,2,,700,18,,700,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
20,3,word,none,none,720,6,,1390,24,,1390,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
20,4,word,none,none,840,3,,1120,16,,1120,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
20,5,word,none,none,32,4,,39,13,,40,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
20,6,word,none,none,45,2,,70,18,,70,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
20,7,word,none,none,66,6,,110,24,,110,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
20,8,word,none,none,77,3,,118,16,,120,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
20,instructions,word,none,none,300,2,,700,7,,1000,,,,,,,,,,,introduction-word,Worded MEL question experiment 3 of date/delay paper.
21,1,barchart,none,none,350,4,,430,13,,430,14,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
21,2,barchart,none,none,490,2,,700,18,,700,19,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
21,3,barchart,none,none,720,6,,1390,24,,1390,25,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
21,4,barchart,none,none,840,3,,1120,16,,1120,17,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
21,5,barchart,none,none,32,4,,39,13,,40,14,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper half the screen.
21,6,barchart,none,none,45,2,,70,18,,70,19,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper half the screen.
21,7,barchart,none,none,66,6,,110,24,,110,25,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper.
21,8,barchart,none,none,77,3,,118,16,,120,17,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper half the screen.
21,instructions,barchart,none,none,300,2,,700,7,,1000,8,600,300,,,,,,,no,introduction-barchart-no-ticks-none-right,Barchart MEL question experiment 3 of date/delay paper half the screen.
22,1,barchart,none,none,350,4,,430,13,,430,27,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
22,2,barchart,none,none,490,2,,700,18,,700,37,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
22,3,barchart,none,none,720,6,,1390,24,,1390,49,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
22,4,barchart,none,none,840,3,,1120,16,,1120,33,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
22,5,barchart,none,none,32,4,,39,13,,40,27,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
22,6,barchart,none,none,45,2,,70,18,,70,37,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
22,7,barchart,none,none,66,6,,110,24,,110,49,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
22,8,barchart,none,none,77,3,,118,16,,120,33,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
22,instructions,barchart,none,none,300,2,,700,7,,1000,15,1200,300,,,,,,,no,introduction-barchart-no-ticks-right,Barchart MEL question experiment 3 of date/delay paper full screen.
23,random,word,none,none,350,4,,430,13,,430,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
23,random,word,none,none,490,2,,700,18,,700,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
23,random,word,none,none,720,6,,1390,24,,1390,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
23,random,word,none,none,840,3,,1120,16,,1120,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
23,random,word,none,none,32,4,,39,13,,40,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
23,random,word,none,none,45,2,,70,18,,70,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
23,random,word,none,none,66,6,,110,24,,110,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
23,random,word,none,none,77,3,,118,16,,120,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
23,instructions,word,none,none,300,2,,700,7,,1000,,,,,,,,,,,introduction-word,Worded MEL question experiment 3 of date/delay paper.
24,random,barchart,none,none,350,4,,430,13,,430,14,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
24,random,barchart,none,none,490,2,,700,18,,700,19,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
24,random,barchart,none,none,720,6,,1390,24,,1390,25,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
24,random,barchart,none,none,840,3,,1120,16,,1120,17,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
24,random,barchart,none,none,32,4,,39,13,,40,14,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper half the screen.
24,random,barchart,none,none,45,2,,70,18,,70,19,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper half the screen.
24,random,barchart,none,none,66,6,,110,24,,110,25,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper.
24,random,barchart,none,none,77,3,,118,16,,120,17,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper half the screen.
24,instructions,barchart,none,none,300,2,,700,7,,1000,8,600,300,,,,,,,no,introduction-barchart-no-ticks-none-right,Barchart MEL question experiment 3 of date/delay paper half the screen.
25,random,barchart,none,none,350,4,,430,13,,430,27,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
25,random,barchart,none,none,490,2,,700,18,,700,37,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
25,random,barchart,none,none,720,6,,1390,24,,1390,49,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
25,random,barchart,none,none,840,3,,1120,16,,1120,33,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
25,random,barchart,none,none,32,4,,39,13,,40,27,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
25,random,barchart,none,none,45,2,,70,18,,70,37,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
25,random,barchart,none,none,66,6,,110,24,,110,49,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
25,random,barchart,none,none,77,3,,118,16,,120,33,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
25,instructions,barchart,none,none,300,2,,700,7,,1000,15,1200,300,,,,,,,no,introduction-barchart-no-ticks-right,Barchart MEL question experiment 3 of date/delay paper full screen.
`;

export const TREATMENTS_PROD_CSV = `treatment_id,position,view_type,interaction,variable_amount,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,horizontal_pixels,vertical_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,width_in,height_in,show_minor_ticks,instruction_gif_prefix,comment
1,random,word,none,none,350,4,,430,13,,430,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
1,random,word,none,none,490,2,,700,18,,700,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
1,random,word,none,none,720,6,,1390,24,,1390,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
1,random,word,none,none,840,3,,1120,16,,1120,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
1,random,word,none,none,32,4,,39,13,,40,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
1,random,word,none,none,45,2,,70,18,,70,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
1,random,word,none,none,66,6,,110,24,,110,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
1,random,word,none,none,77,3,,118,16,,120,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
1,instructions,word,none,none,300,2,,700,7,,1000,,,,,,,,,,,introduction-word,Worded MEL question experiment 3 of date/delay paper.
2,random,barchart,none,none,350,4,,430,13,,430,14,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
2,random,barchart,none,none,490,2,,700,18,,700,19,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
2,random,barchart,none,none,720,6,,1390,24,,1390,25,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
2,random,barchart,none,none,840,3,,1120,16,,1120,17,600,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper half the screen.
2,random,barchart,none,none,32,4,,39,13,,40,14,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper half the screen.
2,random,barchart,none,none,45,2,,70,18,,70,19,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper half the screen.
2,random,barchart,none,none,66,6,,110,24,,110,25,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper.
2,random,barchart,none,none,77,3,,118,16,,120,17,600,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper half the screen.
2,instructions,barchart,none,none,300,2,,700,7,,1000,8,600,300,,,,,,,no,introduction-barchart-no-ticks-none-right,Barchart MEL question experiment 3 of date/delay paper half the screen.
3,random,barchart,none,none,350,4,,430,13,,430,27,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
3,random,barchart,none,none,490,2,,700,18,,700,37,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
3,random,barchart,none,none,720,6,,1390,24,,1390,49,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
3,random,barchart,none,none,840,3,,1120,16,,1120,33,1200,300,,,,,,,no,,Barchart MEL question experiment 1 date/delay paper full screen.
3,random,barchart,none,none,32,4,,39,13,,40,27,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
3,random,barchart,none,none,45,2,,70,18,,70,37,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
3,random,barchart,none,none,66,6,,110,24,,110,49,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
3,random,barchart,none,none,77,3,,118,16,,120,33,1200,300,,,,,,,no,,Barchart MEL question experiment 3 of date/delay paper full screen.
3,instructions,barchart,none,none,300,2,,700,7,,1000,15,1200,300,,,,,,,no,introduction-barchart-no-ticks-right,Barchart MEL question experiment 3 of date/delay paper full screen.
4,1,calendarWord,none,none,350,,1/4/2023,430,,1/13/2023,430,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper TODO fix dates here so that it represent weeks to match up with MEL Word version.
4,2,calendarWord,none,none,490,,1/2/2023,700,,1/18/2023,700,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
4,3,calendarWord,none,none,720,,1/6/2023,1390,,1/24/2023,1390,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
4,4,calendarWord,none,none,840,,1/3/2023,1120,,1/16/2023,1120,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
4,5,calendarWord,none,none,32,,1/4/2023,39,13,1/13/2023,40,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
4,6,calendarWord,none,none,45,,1/2/2023,70,,1/18/2023,70,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
4,7,calendarWord,none,none,66,,1/6/2023,110,,1/24/2023,110,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
4,8,calendarWord,none,none,77,,1/3/2023,118,,1/16/2023,120,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
4,instructions,calendarWord,none,none,300,,1/2/2023,700,,1/7/2023,1000,,750,650,,,,,,,,introduction-calendarWord,TODO use width and height during regular drawCalendar calls Worded MEL question experiment 3 of date/delay paper.
5,1,calendarWordYear,none,none,350,,4/10/2023,430,,9/8/2023,430,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper TODO fix dates here so that it represent weeks to match up with MEL Word version.
5,2,calendarWordYear,none,none,490,,7/24/2023,700,,12/6/2023,700,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
5,3,calendarWordYear,none,none,720,,5/21/2023,1390,,7/29/2023,1390,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
5,4,calendarWordYear,none,none,840,,6/15/2023,1120,,9/26/2023,1120,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
5,5,calendarWordYear,none,none,32,,8/6/2023,39,13,11/14/2023,40,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
5,6,calendarWordYear,none,none,45,,5/29/2023,70,,9/17/2023,70,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
5,7,calendarWordYear,none,none,66,,9/12/2023,110,,11/8/2023,110,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
5,8,calendarWordYear,none,none,77,,7/30/2023,118,,10/15/2023,120,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
5,instructions,calendarWordYear,none,none,300,,5/7/2023,700,,10/2/2023,1000,,600,510,,,,,,,,introduction-calendarWordYear,TODO use width and height during regular drawCalendar calls Worded MEL question experiment 3 of date/delay paper.
6,1,calendarWordYearDual,none,none,350,,1/4/2023,430,,2/13/2023,430,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper TODO fix dates here so that it represent weeks to match up with MEL Word version.
6,2,calendarWordYearDual,none,none,490,,1/2/2023,700,,3/18/2023,700,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
6,3,calendarWordYearDual,none,none,720,,1/6/2023,1390,,4/24/2023,1390,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
6,4,calendarWordYearDual,none,none,840,,1/3/2023,1120,,5/16/2023,1120,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
6,5,calendarWordYearDual,none,none,32,,1/4/2023,39,13,6/13/2023,40,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
6,6,calendarWordYearDual,none,none,45,,1/2/2023,70,,7/18/2023,70,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
6,7,calendarWordYearDual,none,none,66,,1/6/2023,110,,8/24/2023,110,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
6,8,calendarWordYearDual,none,none,77,,1/3/2023,118,,9/16/2023,120,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
6,instructions,calendarWordYearDual,none,none,300,,10/2/2023,700,,1/7/2023,1000,,750,650,,,,,,,,introduction-calendarWord,TODO use width and height during regular drawCalendar calls Worded MEL question experiment 3 of date/delay paper.
7,1,word,none,none,350,,4/10/2023,430,,9/8/2023,430,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper TODO fix dates here so that it represent weeks to match up with MEL Word version.
7,2,word,none,none,490,,7/24/2023,700,,12/6/2023,700,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
7,3,word,none,none,720,,5/21/2023,1390,,7/29/2023,1390,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
7,4,word,none,none,840,,6/15/2023,1120,,9/26/2023,1120,,,,,,,,,,,,Worded MEL question experiment 1 date/delay paper.
7,5,word,none,none,32,,8/6/2023,39,13,11/14/2023,40,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
7,6,word,none,none,45,,5/29/2023,70,,9/17/2023,70,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
7,7,word,none,none,66,,9/12/2023,110,,11/8/2023,110,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
7,8,word,none,none,77,,7/30/2023,118,,10/15/2023,120,,,,,,,,,,,,Worded MEL question experiment 3 of date/delay paper.
7,instructions,word,none,none,300,,5/7/2023,700,,10/2/2023,1000,,1135,120,,,,,,,,introduction-wordDate,TODO use width and height during regular drawCalendar calls Worded MEL question experiment 3 of date/delay paper.
`;

// define your latin square.  I used https://cs.uwaterloo.ca/~dmasson/tools/latin_square/
export const LATIN_SQUARE_PROD = [
  [1, 2, 3],
  [1, 3, 2],
  [3, 1, 2],
  [3, 2, 1],
  [2, 3, 1],
  [2, 1, 3],
];

export const LATIN_SQUARE_DEV = [
  [23, 24, 25],
  [23, 25, 24],
  [25, 23, 24],
  [25, 24, 23],
  [24, 25, 23],
  [24, 23, 25],
];
