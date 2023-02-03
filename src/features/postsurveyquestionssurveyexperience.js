export const POST_SURVEY_QUESTIONS = {
  promptShort: "surveyExperience",
  prompt:
    "We would like to know what you thought of this survey. Please indicate your agreement or disagreement with the following statements.",
  questionsType: "multiple choice auto",
  questions: [
    {
      question: {
        textFull: "Did you enjoy completing the survey questions?",
        textShort: "enjsvy",
        disabled: false,
      },
    },
    {
      question: {
        textFull: "Did you find the instructions clear?",
        textShort: "insclr",
        disabled: false,
      },
    },
    {
      question: {
        textFull:
          "Did you understand what the questions were asking you to consider?",
        textShort: "undclr",
        disabled: false,
      },
    },
    {
      question: {
        textFull: "Were the questions presented clearly?",
        textShort: "qstclr",
        disabled: false,
      },
    },
    {
      question: {
        textFull: "Were you able to imagine these money choices as real?",
        textShort: "imgreal",
        disabled: false,
      },
    },
    {
      question: {
        textFull: "On average, were the money choice decisions easy to make?",
        textShort: "esymke",
        disabled: false,
      },
    },
    {
      question: {
        textFull:
          "Would you like real life money decisions to be presented to you in this format?",
        textShort: "realfmt",
        disabled: false,
      },
    },
  ],
};
