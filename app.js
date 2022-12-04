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
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const {createServer} = require('http')
const {Server}  = require('socket.io')
const httpServer = createServer(app);
const io =  new Server(httpServer, {
  cors: corsOptions
})

io.on("connection", (socket)=>{
  console.log('socket id is' + socket.id)

})

// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

// handling cookies
app.use(cookieParser());

// handling cors
app.use(cors(corsOptions));

// signup and login routes
app.use("/api/v1/househub", userRouter);
app.use("/api/v1/househub", houseRouter);


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
