export const POST_SURVEY_QUESTIONS = {
  promptShort: "fincanialLit",
  prompt: "Please answer these questions to the best of your ability.",
  questionsType: "multiple choice",
  questions: [
    /*
      A. Lusardi and O. S. Mitchell, “Planning and Financial Literacy: How Do Women Fare?,” The American Economic Review, vol. 98, no. 2, pp. 413–417, 2008.
    */
    {
      question: {
        textFull:
          "Suppose you had $100 in a savings account and the interest rate was 2% per year. After 5 years, how much do you think you would have in the account if you left the money to grow?",
        textShort: "qNumeracy",
      },
      options: [
        {
          textFull: "more than $102",
          textShort: ">$102",
        },
        {
          textFull: "exactly $102",
          textShort: "=$102",
        },
        {
          textFull: "less than $102",
          textShort: "<$102",
        },
        {
          textFull: "do not know",
          textShort: "dont-know",
        },
        {
          textFull: "refuse to answer",
          textShort: "refuse-to-answer",
        },
      ],
    },
    {
      question: {
        textFull:
          "Imagine that the interest rate on your savings account was 1% per year and inflation was 2% per year. After 1 year, would you be able to buy more than, exactly the same as, or less than today with the money in this account?",
        textShort: "qInflation",
      },
      options: [
        {
          textFull: "more than",
          textShort: "more-than",
        },
        {
          textFull: "exactly the same",
          textShort: "exactly-same",
        },
        {
          textFull: "less than",
          textShort: "less-than",
        },
        {
          textFull: "do not know",
          textShort: "dont-know",
        },
        {
          textFull: "refuse to answer",
          textShort: "refuse-to-answer",
        },
      ],
    },
    {
      question: {
        textFull:
          "Do you think that the following statement is true or false? ‘Buying a single company stock usually provides a safer return than a stock mutual fund.’",
        textShort: "qRiskDiversification",
      },
      options: [
        {
          textFull: "true",
          textShort: "true",
        },
        {
          textFull: "false",
          textShort: "false",
        },
        {
          textFull: "do not know",
          textShort: "dont-know",
        },
        {
          textFull: "refuse to answer",
          textShort: "refuse-to-answer",
        },
      ],
    },
  ],
};
