const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongosanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const xss = require("xss");
const initRoute = require("./routers");
const cors = require("cors");
const dbConnect = require("./config/mongodb.config");
const session = require("cookie-session");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Origin",
      "Accept",
      "X-Custom-Header",
      "X-CSRF-Token",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    proxy: true,
    resave: false,
    saveUninitialized: false,
    secure: false,
    name: "connect.sid",
    cookie: { secure: false },
  })
);

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour.",
});

app.use("/tawk", limiter);
app.use(express.urlencoded({ extended: true }));
app.use(mongosanitize());
app.use(cookieParser());

dbConnect();
xss(app);
initRoute(app);

module.exports = app;