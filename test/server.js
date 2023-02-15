import express from "express";
import fs from "fs";
import cors from "cors";
import http from "http";
import https from "https";
import chalk from "chalk";
import { DateTime } from "luxon";

const app = express();

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

app.get("/files", (req, res) => {
  const filter = req.query.filter;
  console.log("/files request for files matching filter=" + filter);
  const result = [];
  try {
    fs.readdir("public/", (err, files) => {
      if (err) res.send(err);
      else {
        const re = /answer-timestamps-\d+-\d+-\d+\.csv/;
        files.forEach((file) => {
          console.log("considering file " + file);
          if (re.test(file)) {
            console.log("match found!");
            result.push(file);
          } else {
            console.log("match not found.");
          }
        });
      }
    });
    console.log("Returning result " + result);
    res.send(JSON.stringify(result));
  } catch (err) {
    console.log(chalk.red(err));
    res.send(err);
  }
});

app.post("/test", (req, res) => {
  var dir = "public/";

  console.log("post to /test received on " + DateTime.now().toISO());

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(dir + req.body.name, req.body.data, function (err) {
    if (err) throw err;
  });

  console.log(
    "req.body.name: " + req.body.name + ", " + "req.body.data: " + req.body.data
  );

  const data = JSON.parse(req.body.data);

  if (data.name && data.answer) {
    console.log("data.name: " + data.name + ", " + "data.data: " + data.data);
    fs.writeFile(dir + data.name, data.data, function (err) {
      if (err) {
        console.log(err);
        throw err;
      }
    });
  } else {
    if (data.surveyAnswers) {
      console.log(
        "data.surveyAnswers.filename: " +
          data.surveyAnswers.filename +
          ", " +
          "data.surveyAnswers.data: " +
          data.surveyAnswers.data
      );
      fs.writeFile(
        dir + data.surveyAnswers.filename,
        data.surveyAnswers.data,
        function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        }
      );
    }
    if (data.answerTimestamps) {
      console.log(
        "data.answerTimestamps.filename: " +
          data.answerTimestamps.filename +
          ", " +
          "data.answerTimestamps.data: " +
          data.answerTimestamps.data
      );
      fs.writeFile(
        dir + data.answerTimestamps.filename,
        data.answerTimestamps.data,
        function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        }
      );
    }
    if (data.financialLitSurvey) {
      console.log(
        "data.financialLitSurvey.filename: " +
          data.financialLitSurvey.filename +
          ", " +
          "data.financialLitSurvey.data: " +
          data.financialLitSurvey.data
      );
      fs.writeFile(
        dir + data.financialLitSurvey.filename,
        data.financialLitSurvey.data,
        function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        }
      );
    }
    if (data.purposeSurvey) {
      console.log(
        "data.purposeSurvey.filename: " +
          data.purposeSurvey.filename +
          ", " +
          "data.purposeSurvey.data: " +
          data.purposeSurvey.data
      );
      fs.writeFile(
        dir + data.purposeSurvey.filename,
        data.purposeSurvey.data,
        function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        }
      );
    }
    if (data.demographics) {
      console.log(
        "data.demographic.filename: " +
          data.demographics.filename +
          ", " +
          "data.demographic.data: " +
          data.demographics.data
      );
      fs.writeFile(
        dir + data.demographics.filename,
        data.demographics.data,
        function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        }
      );
    }
    if (data.legal) {
      console.log(
        "req.body.data.legal.filename: " +
          data.legal.filename +
          ", " +
          "req.body.data.legal.data: " +
          data.legal.data
      );
      fs.writeFile(dir + data.legal.filename, data.legal.data, function (err) {
        if (err) {
          console.log(err);
          throw err;
        }
      });
    }
    if (data.feedback) {
      console.log(
        "req.body.data.feedback.filename: " +
          data.feedback.filename +
          ", " +
          "req.body.data.feedback.data: " +
          data.feedback.data
      );
      fs.writeFile(
        dir + data.feedback.filename,
        data.feedback.data,
        function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        }
      );
    }
    if (data.debriefTimestamps) {
      console.log(
        "req.body.data.debriefTimestamps.filename: " +
          data.debriefTimestamps.filename +
          ", " +
          "req.body.data.debriefTimestamps.data: " +
          data.debriefTimestamps.data
      );
      fs.writeFile(
        dir + data.debriefTimestamps.filename,
        data.debriefTimestamps.data,
        function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        }
      );
    }
  }
  res.send(JSON.stringify({ status: "server wrote file" }, null, 2));
});

console.log("server starting...");

const serverHTTP = http.createServer(app);
const serverHTTPS = https.createServer(options, app);

const portHTTP = 3001;
const portHTTPS = 3002;

serverHTTP.listen(portHTTP);
serverHTTPS.listen(portHTTPS);

console.log("HTTP listening on " + portHTTP);
console.log("HTTPS listening on " + portHTTPS);
