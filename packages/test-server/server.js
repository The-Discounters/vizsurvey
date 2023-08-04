const express = require("express");
const fs = require("fs");
const cors = require("cors");
const http = require("http");
const https = require("https");
const luxon = require("luxon");

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
    console.log(err);
    res.send(err);
  }
});

app.post("/test", (req, res) => {
  var dir = "public/";

  console.log(`post to /test received on ${luxon.DateTime.now().toISO()}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(dir + req.body.name, req.body.data, function (err) {
    if (err) throw err;
  });

  console.log(
    `wrote data: req.body.name: ${req.body.name}\nreq.body.data: ${req.body.data}\n`
  );

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
