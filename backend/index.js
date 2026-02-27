const express = require("express");

const corsHandler = require('./middleware/cors');

const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const experienceRouter = require("./routes/experienceRouter");


const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(corsHandler)

app.use("/api", userRouter);
app.use("/api", adminRouter);
app.use("/api", experienceRouter);


app.listen(3005, () => {
  console.log("👍 | http://localhost:3005");
  console.log("📘 | Swagger docs at http://localhost:3005/api-docs");
});

module.exports = app