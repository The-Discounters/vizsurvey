export const POST_SURVEY_QUESTIONS = {
  promptShort: "fincanialLit", // TODO
  prompt:
    "The following questions try to assess your discount literacy. Please answer these to the best of your knowledge.",
  questionsType: "multiple choice",
  questions: [
    /*
      https://www.tutorialride.com/discount/discount-aptitude-questions-and-answers.htm
      Discount - Aptitude Questions and Answers
*/
    {
      question: {
        textFull:
          "The marked price on an item was Rs 2000/- but the shopkeeper offered a double discount of 20% and 15%. How much did he finally sell the item for?",
        textShort: "qdoublediscount",
      },
      options: [
        {
          textFull: "Rs. 640",
          textShort: "v640",
        },
        {
          textFull: "Rs. 1300",
          textShort: "v1300",
        },
        {
          textFull: "Rs. 1360",
          textShort: "v1360", // ANSWER
        },
        {
          textFull: "Rs. 1600",
          textShort: "v1600",
        },
      ],
    },
  ],
};
