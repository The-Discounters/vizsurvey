export const POST_SURVEY_QUESTIONS = {
  promptShort: "fincanialLit",
  prompt:
    "The following questions try to assess your financial literacy. Please answer these to the best of your knowledge.",
  questionsType: "multiple choice",
  questions: [
    /*
      https://www.sciencedirect.com/science/article/pii/S0378426617300316?casa_token=5v9mS3YD8twAAAAA:Bw8be0MPJq7r-pS-HcC23y-JMFMMKQ_sNM_ANNNLJP0-W-Gp3INZjY2Y22s7od6YVu_ntp07
      Financial literacy, present bias and alternative mortgage products
*/
    {
      question: {
        textFull:
          "Suppose a 15 year mortgage and a 30 year mortgage have the same Annual Percentage Rate and the same amount borrowed. The total amount repaid will be:",
        textShort: "q15vs30",
      },
      options: [
        {
          textFull: "Higher for the 15 year mortgage",
          textShort: "v15+",
        },
        {
          textFull: "Higher for the 30 year mortgage",
          textShort: "v30+",
        },
        {
          textFull: "The total amount repaid will be the same",
          textShort: "v15=30",
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
