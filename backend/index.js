const express = require("express");

const userRouter = require("./routes/userRouter");

const corsHandler = require('./middleware/cors');
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(corsHandler)

app.use("/api", userRouter);


app.listen(3005, () => {
  console.log("👍 | http://localhost:3005");
  console.log("📘 | Swagger docs at http://localhost:3005/api-docs");
});

module.exports = app