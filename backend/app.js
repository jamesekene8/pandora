const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const usersRoute = require("./routes/usersRoute");

dotenv.config({ path: "./config.env" });

const xss = require("xss-clean");
// const restify = require("restify").plugins;

const app = express();

app.use(cors());

app.use(compression());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(morgan("tiny"));

// app.use(restify.bodyParser());

app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Require static assets from public folder
app.use(express.static(path.join(__dirname, "public")));

// Set 'views' directory for any views
// being rendered res.render()
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/users", usersRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
