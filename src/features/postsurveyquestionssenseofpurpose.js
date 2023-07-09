export const POST_SURVEY_AWARE_CONTENT = {
  promptShort: "senseOfPurposeAware",
  prompt:
    "The following questions ask you generally about your life. Please indicate your agreement or disagreement with the following statements.",
  questionsType: "multiple choice auto",
  questions: [
    {
      question: {
        textFull: "My purpose in life is clear.",
        textShort: "purpose_survey_aware_clear",
        disabled: false,
      },
    },
    {
      question: {
        textFull: "I am certain about my life’s purpose.",
        textShort: "purpose_survey_aware_certain",
        disabled: false,
      },
    },
    {
      question: {
        textFull: "I can describe my life’s purpose.",
        textShort: "purpose_survey_aware_describe",
        disabled: false,
      },
    },
    {
      question: {
        textFull: "I feel confident about my life’s purpose.",
        textShort: "purpose_survey_aware_confident",
        disabled: false,
      },
    },
    {
      question: {
        textFull: "I have a good understanding of my life’s purpose.",
        textShort: "purpose_survey_aware_understand",
        disabled: false,
      },
    },
    /*
      Yukhymenko-Lescroart, M. A., & Sharma, G. (2020). Examining the factor structure of the revised sense of purpose scale (SOPS-2) with adults. Applied Research in Quality of Life, 15, 1203-1222.
    */
  ],
};

export const POST_SURVEY_WORTH_CONTENT = {
  promptShort: "senseOfPurposeWorth",
  prompt:
    "The following questions ask you generally about your life. Please indicate your agreement or disagreement with the following statements.",
  questionsType: "multiple choice auto",
  questions: [
    {
      question: {
        textFull:
          "Some people wander aimlessly through life, but I am not one of them.",
        textShort: "purpose_survey_worth_wander",
        disabled: false,
      },
    },
    {
      question: {
        textFull:
          "I live life one day at a time and don’t really think about the future.",
        textShort: "purpose_survey_worth_dayatatime",
        disabled: false,
      },
    },
    {
      question: {
        textFull:
          "I sometimes feel as if I’ve done all there is to do in life.",
        textShort: "purpose_survey_worth_doneall",
        disabled: false,
      },
    },
    /*
      Hill, P. L., Turiano, N. A., Mroczek, D. K., & Burrow, A. L. (2016). The value of a purposeful life: Sense of purpose predicts greater income and net worth. Journal of research in personality, 65, 38-42.
    */
  ],
};
