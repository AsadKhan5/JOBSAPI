require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// connectDB
const connectDB = require("./db/connect");
// some extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// Routers
const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// authentication Handler
const authenticationHandler = require("./middleware/authentication");
app.use(express.json());
// extra packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
// routes
app.get("/", (req, res) => {
  res.send("Jobs API.");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", authenticationHandler, jobsRoutes);

app.use(notFoundMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  connectDB(process.env.MONGO_URI)
    .then(() => {
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    })
    .catch((err) => console.log("error is ::", err));
};

start();
app.use(errorHandlerMiddleware);
