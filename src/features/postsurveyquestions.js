export const POST_SURVEY_QUESTIONS = [
  {
    prompt: "The following questions try to assess your financial literacy. Please answer thes to the best of your knowledge.",
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
  },
  {
    prompt:
      "The following questions try to assess how strong your sense of purpose is. Please indicate your agreement or disagreement with the following statements.",
    questionsType: "multiple choice auto",
    questions: [
      {
        question: {
          textFull: "My purpose in life is clear.",
          textShort: "clrpurp",
          disabled: true,
        },
      },
      {
        question: {
          textFull:
            "I have begun to contemplate what I ultimately wish to achieve.",
          textShort: "ultach",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I am striving to make a positive difference in society.",
          textShort: "posdiff",
          disabled: false,
        },
      },
      {
        question: {
          textFull: "I am moving towards fulfillment of my life's purpose.",
          textShort: "towpurp",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I am in the process of formulating my long-term goals.",
          textShort: "formgoal",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "Through my career I aim to make the world a better place.",
          textShort: "carbetplac",
          disabled: false,
        },
      },
      {
        question: {
          textFull: "I have no idea where my life is going (R).",
          textShort: "noidea",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "Recent experiences made me aware of my purpose.",
          textShort: "recexp",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "My life's purpose has nothing to do with common good (R).",
          textShort: "nocomgood",
          disabled: true,
        },
      },
      {
        question: {
          textFull:
            "The important decisions I make are in line with my purpose.",
          textShort: "impdec",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I have become more certain about my future goals.",
          textShort: "certfutgol",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I seek to serve society in many ways, large and small.",
          textShort: "servsoc",
          disabled: false,
        },
      },
      {
        question: {
          textFull: "My current aims match with my future aspirations.",
          textShort: "curaimsmatch",
          disabled: true,
        },
      },
      {
        question: {
          textFull:
            "My current activities have helped me to develop clear aims.",
          textShort: "clearaims",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I seek to learn so that I can help others.",
          textShort: "helpothers",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I do not see any purpose in what I am doing (R).",
          textShort: "nopurp",
          disabled: true,
        },
      },
      {
        question: {
          textFull:
            "I have become interested in search for my purpose in life.",
          textShort: "intsearch",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "My goals extend beyond benefits for myself.",
          textShort: "extbeyond",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "My life lacks purpose (R).",
          textShort: "lackpurp",
          disabled: true,
        },
      },
      {
        question: {
          textFull:
            "I have started thinking about what I truly want to achieve.",
          textShort: "thinkach",
          disabled: false,
        },
      },
      {
        question: {
          textFull:
            "I have often volunteered to contribute to welfare of others.",
          textShort: "volunt",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I feel aimless (R).",
          textShort: "aimless",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I am not interested in search for purpose in life (R).",
          textShort: "notinter",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I am engaged in activities to help others.",
          textShort: "engaged",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I feel confident about my life's purpose.",
          textShort: "confpurp",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I don't think of purpose in life (R).",
          textShort: "dontthinkpurp",
          disabled: true,
        },
      },
      {
        question: {
          textFull:
            "My current pursuits will help me to contribute to society.",
          textShort: "pursuits",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I can describe my life's purpose.",
          textShort: "descrpurp",
          disabled: false,
        },
      },
      {
        question: {
          textFull:
            "I have become concerned about how I can contribute to society.",
          textShort: "concerned",
          disabled: true,
        },
      },
      {
        question: {
          textFull: "I make efforts to promote other people's wellbeing.",
          textShort: "effort",
          disabled: false,
        },
      },
      /*
      https://www.tandfonline.com/doi/full/10.1080/10888691.2016.1262262?casa_token=adXryoxRxekAAAAA%3AXIcD64PGvjoEb8tlf0sGjid6f-IqVhNYS06YEK9_mw9lnwPncq-lO9NVgYoxOCxfIhqfT_AvwPcK
      Sense of Purpose Scale: Development and initial validation
*/
    ],
  },
];
