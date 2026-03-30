const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");

require("dotenv").config();

const corsHandler = require('./middleware/cors');

const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const experienceRouter = require("./routes/experienceRouter");
const categoryRouter = require("./routes/categoryRouter");
const reflectionRouter = require("./routes/reflectionRouter");
const statisticsRouter = require("./routes/statisticsRouter");

const app = express();

const path = require("path");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(corsHandler)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

app.use("/api", userRouter);
app.use("/api", adminRouter);
app.use("/api", experienceRouter);
app.use("/api", categoryRouter);
app.use("/api", reflectionRouter);
app.use("/api", statisticsRouter);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error.",
  });
});


app.listen(3005, () => {
  console.log("👍 | http://localhost:3005");
  console.log("📘 | Swagger docs at http://localhost:3005/api-docs");
});

module.exports = app