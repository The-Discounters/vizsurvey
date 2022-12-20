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
        textShort: "q15vs30", // TODO
      },
      options: [
        {
          textFull: "Rs. 640",
          textShort: "v640", // TODO
        },
        {
          textFull: "Rs. 1300",
          textShort: "v1300", // TODO
        },
        {
          textFull: "Rs. 1360",
          textShort: "v1360", // ANSWER
        },
        {
          textFull: "Rs. 1600",
          textShort: "v1600", // TODO
        },
      ],
    },
    {
      question: {
        textFull:
          "Suppose you owe $50,000 on a mortgage at an Annual Percentage Rate of 6%. If you didn’t make any payments on this mortgage how much would you owe in total after one year?",
        textShort: "q50k6p",
      },
      options: [
        {
          textFull: "Less than $50,000",
          textShort: "v<50k",
        },
        {
          textFull: "$50,000 – $54,999",
          textShort: "v50kto55k",
        },
        {
          textFull: "$55,000 – $59,999",
          textShort: "v55kto60k",
        },
        {
          textFull: "$60,000 – $64,999",
          textShort: "v60kto65k",
        },
        {
          textFull: "More than $65,000",
          textShort: "v65k+",
        },
      ],
    },
    {
      question: {
        textFull:
          "Suppose you owe $100,000 on a mortgage at an Annual Percentage Rate of 5%. If you didn’t make any payments on this mortgage how much would you owe in total after five years?",
        textShort: "q100k5p",
      },
      options: [
        {
          textFull: "Less than $120,000",
          textShort: "v<120k",
        },
        {
          textFull: "Between $120,000 and $125,000",
          textShort: "v120kto125k",
        },
        {
          textFull: "More than $125,000",
          textShort: "v125k+",
        },
      ],
    },
    {
      question: {
        textFull:
          "Suppose you owe $200,000 on a mortgage with at an Annual Percentage Rate of 5%. If you made annual payments of $10,000 per year how long would it take to repay the whole mortgage?",
        textShort: "q200k5p",
      },
      options: [
        {
          textFull: "Less than 20 years",
          textShort: "v<20y",
        },
        {
          textFull: "Between 20 and 30 years",
          textShort: "v20yto30y",
        },
        {
          textFull: "Between 30 and 40 years",
          textShort: "v30yto40y",
        },
        {
          textFull: "The mortgage would never be repaid",
          textShort: "vnever",
        },
      ],
    },
  ],
};
