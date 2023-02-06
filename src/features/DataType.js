export const DataType = {
  Answers: { key: "surveyAnswers", filenamePrefix: "answers-merged" },
  Timestamps: {
    key: "answerTimestamps",
    filenamePrefix: "answers-timestamps",
  },
  SurveyExperience: {
    key: "surveyExperienceSurvey",
    filenamePrefix: "survey-experience-survey",
  },
  FinancialSurvey: {
    key: "financialLitSurvey",
    filenamePrefix: "financial-lit-survey",
  },
  PurposeSurvey: {
    key: "purposeSurvey",
    filenamePrefix: "purpose-survey",
  },
  Demographic: {
    key: "demographics",
    filenamePrefix: "demographics",
  },
  Legal: { key: "legal", filenamePrefix: "legal" },
  Feedback: { key: "feedback", filenamePrefix: "feedback.csv" },
  DebriefTimestamps: {
    key: "debriefTimestamps",
    filenamePrefix: "debrief",
  },
};

Object.freeze(DataType);

export const dataTypeFromFilename = (filename) => {
  for (const type in DataType) {
    if (filename.includes(type.filenamePrefix)) return type;
  }
};
