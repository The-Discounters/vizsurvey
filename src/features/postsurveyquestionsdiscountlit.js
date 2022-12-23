export const POST_SURVEY_QUESTIONS = {
  promptShort: "discountLit",
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
    /*
chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.mathinenglish.com/PWP/Grade6Discount.pdf
Grade 6 Discount Word Problems
*/
    {
      question: {
        textFull:
          "The price of a motorbike is 1,500$. How much do you need to pay if you get a 10% discount?",
        textShort: "qsinglediscount",
      },
      options: [
        {
          textFull: "1350",
          textShort: "v1350", // ANSWER
        },
        {
          textFull: "Rs. 1000",
          textShort: "v1000",
        },
        {
          textFull: "Rs. 1400",
          textShort: "v1400",
        },
        {
          textFull: "Rs. 1250",
          textShort: "v1250",
        },
      ],
    },
    {
      question: {
        textFull:
          "Mike and Mandy bought the same item. Mike paid 15,000$. Mandy got discount and paid 3,000$ less than Mike. How much discount did Mandy get?",
        textShort: "qfinddiscount",
      },
      options: [
        {
          textFull: "33%",
          textShort: "v33p",
        },
        {
          textFull: "30%",
          textShort: "v30p",
        },
        {
          textFull: "15%",
          textShort: "v15p",
        },
        {
          textFull: "20%",
          textShort: "v20p", // ANSWER
        },
      ],
    },
  ],
};
