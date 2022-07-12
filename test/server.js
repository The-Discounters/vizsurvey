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
