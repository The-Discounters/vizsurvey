const express = require("express");
const app = express();
const fs = require("fs");

const cors = require("cors");

const http = require("http");
const https = require("https");

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "File server up and running on ports (HTTP: " +
      portHTTP +
      ", HTTPS: " +
      portHTTPS
  );
});
/*
app.get("/answers-1.csv", (req, res) => {
                setTimeout(() => {
 res.send(
`
treatment_id,position,view_type,interaction,variable_amount,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,vertical_pixels,horizontal_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,width_in,height_in,choice,shown_timestamp,choice_timestamp,highup,lowdown,participant_code
1,1,word,none,none,500,2,,1000,5,,undefined,10,undefined,undefined,undefined,undefined,undefined,undefined,4,4,earlierAmount,,1970-01-01T00:00:04.400Z,1000,undefined,undefined
1,2,word,none,none,50,2,,300,7,,undefined,10,undefined,undefined,undefined,undefined,undefined,undefined,8,8,earlierAmount,,1970-01-01T00:00:05.400Z,undefined,undefined,undefined
1,3,word,none,none,250,2,,1000,3,,undefined,10,undefined,undefined,undefined,undefined,undefined,undefined,8,8,earlierAmount,,1970-01-01T00:00:07.400Z,undefined,undefined,undefined
`
);
                }, 10000);
});

app.get("/post-survey-answers-1.json", (req, res) => {
                setTimeout(() => {
 res.send(
JSON.stringify({
  "demographics": {
    "countryOfResidence": "usa",
    "vizFamiliarity": "3",
    "age": "26",
    "gender": "male",
    "selfDescribeGender": "",
    "profession": "Software Developer"
  },
  "attentioncheck": null,
  "timestamps": {
    "consentShownTimestamp": 1000,
    "introductionShowTimestamp": 2000,
    "introductionCompletedTimestamp": 3000,
    "instructionsShownTimestamp": 3000,
    "instructionsCompletedTimestamp": 4000,
    "financialLitSurveyQuestionsShownTimestamp": 8000,
    "debriefShownTimestamp": null,
    "debriefCompleted": null,
    "theEndShownTimestamp": null
  },
  "fincanialLit": {
    "q15vs30": "v15+",
    "q50k6p": "v<50k",
    "q100k5p": "v<120k",
    "q200k5p": "v<20y"
  },
  "senseOfPurpose": {
    "posdiff": "strongly-disagree",
    "carbetplac": "strongly-disagree",
    "servsoc": "strongly-disagree",
    "thinkach": "strongly-disagree",
    "descrpurp": "strongly-disagree",
    "effort": "strongly-disagree"
  }
})
);
                }, 10000);
});
*/
app.post("/test", (req, res) => {
  var dir = "public/";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  console.log("req.body.data: " + req.body.data);

  fs.writeFile(dir + req.body.name, req.body.data, function (err) {
    if (err) throw err;
  });
  res.send(JSON.stringify({ test: 123 }, null, 2));
});

const serverHTTP = http.createServer(app);
const serverHTTPS = https.createServer(options, app);

const portHTTP = 3001;
const portHTTPS = 3002;

serverHTTP.listen(portHTTP);
serverHTTPS.listen(portHTTPS);

console.log("HTTP listening on " + portHTTP);
console.log("HTTPS listening on " + portHTTPS);
