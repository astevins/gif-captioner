import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import files from "./src/routers/files";

const MongoDbStore = require("connect-mongodb-session")(session);

console.log("Starting server.js");

const app = express();
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
    + "@cluster0.jtqg1.mongodb.net/data?retryWrites=true&w=majority";
const mongoDbStore = new MongoDbStore({
    uri: mongo_uri,
    collection: "sessions"
});

// Catch store errors
mongoDbStore.on("error", function (error: any) {
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

app.get("/", (req: express.Request, res: express.Response) => {
    console.log("GET request /");
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

app.listen(process.env.PORT || 8080);

console.log("Server ready");
