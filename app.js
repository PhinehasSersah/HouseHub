require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const connectDb = require("./database/db");
const userRouter = require("./routes/users");
const houseRouter = require("./routes/house");
const messageRouter = require("./routes/messages");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const socket  =  require('./socket/connect')
const {createServer} = require('http')
const httpServer = createServer(app);



// socket io configurations 
socket.socketIo(httpServer)

// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

// handling cookies
app.use(cookieParser());

// handling cors
app.use(cors(corsOptions));

// routes
app.use("/api/v1/househub", userRouter);
app.use("/api/v1/househub", houseRouter);
app.use("/api/v1/househub", messageRouter);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    httpServer.listen(port, () => {
      console.log("Server listening on port " + port);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
