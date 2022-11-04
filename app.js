var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var test = "test";
const cors = require("cors");
// const middlewareLogIn = require("./middleware/")
// let cors = require("cors")

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let parcoursRouter = require("./routes/parcours");
let reservationsRouter = require("./routes/reservations");

var app = express();

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/public/uploads")));

// Création de route ici

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/parcours", parcoursRouter);
app.use("/reservations", reservationsRouter);

module.exports = app;
