require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connectDb = require("./database/db");
const userRouter = require("./routes/users");
const houseRouter = require("./routes/house");
const cookieParser = require("cookie-parser");
const corsOptions = require('./config/corsOptions')

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handling cookies
app.use(cookieParser());


// handling cors

// const whiteList = ["http://localhost:5173"];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whiteList.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Request not allowed: " + origin));
//     }
//   },
//   optionsSuccessStatus: 200,
// };
app.use(cors(
  // {credentials: true, 
  //   origin: 'http://localhost:5173', 
  //   exposedHeaders: ["Set-Cookie"]
  // }
  corsOptions
  ));


// signup and login routes
app.use("/api/v1/househub", userRouter);
app.use("/api/v1/househub", houseRouter);
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
