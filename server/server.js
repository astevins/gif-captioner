const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const path = require("path");
const files = require("./src/routers/files");
const app = express();

console.log("Starting server.js");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

require("dotenv").config({path:__dirname + "../../.env"});

// SESSIONS
if (!process.env.ATLAS_USER_PASSWORD) {
    throw new Error("Missing variable in .env: ATLAS_USER_PASSWORD for mongodb");
}
const mongo_uri = "mongodb+srv://nodejs:"
    + process.env.ATLAS_USER_PASSWORD
    + "@cluster0.jtqg1.mongodb.net/sessions?retryWrites=true&w=majority";
const mongoDbStore = new MongoDbStore({
    uri: mongo_uri,
    collection: 'mySessions'
});

// Catch store errors
mongoDbStore.on("error", function(error) {
    console.log(error);
});

app.use(session({
    secret: "f+u(IoO_9_r5{pR",
    resave: true,
    saveUninitialized: true,
    store: mongoDbStore,
}));

// STATIC
app.use(express.static(path.join(__dirname, "../client/build")));

// API ENDPOINTS
app.use("/api/files", files);

app.get("/", (req, res) => {
    console.log("GET request /");
    if (req.session.data) {

    }
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

app.listen(process.env.PORT || 8080);

console.log("Server ready");
