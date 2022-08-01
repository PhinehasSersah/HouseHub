require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express(); 
const bodyParser = require("body-parser");
const connectDb = require("./database/db");
const userRouter = require("./routes/users");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// signup and login routes
app.use("/api/v1/househub", userRouter);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log("Server listening on port " + port);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
