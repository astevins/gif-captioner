const express = require('express');
const path = require('path');
const files = require("./src/routers/files");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../client/build')));

console.log("Starting server.js");

if (app.get('env') === 'development'){
  require('dotenv').config();
}

app.use("/files", files)

// Get static
app.get("/*", (req, res) => {
  console.log("GET request: " + req.baseUrl);
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);
