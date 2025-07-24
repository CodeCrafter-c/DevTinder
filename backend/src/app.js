//// dotnev for security
require('dotenv').config()

// npm installed or built in moduels
const express = require("express");// importing express for routing
const cookieParser = require("cookie-parser");
const cors=require("cors")

//  self cretaed modules
// console.log(process.env.DB_CONNECTION_STRING);
const { connection } = require("../config/database"); // importing db connection

const app = express();
const port = 3000;
// used to read the json from the request body
app.use(express.json());
// used to read cookies
app.use(cookieParser());
// cors 
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))


// routers
const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/request");
const {userRouter}=require("./routes/user")

  
app.use("/profile",profileRouter);
app.use("/request",requestRouter)
app.use("/user",userRouter);
app.use("/auth",authRouter);




// making database connection
connection()
  .then(() => {
    console.log("database connection formed");
    app.listen(port, () => {
      console.log("Server is finally succesfully running");
    });
  })
  .catch((err) => {
    console.error("database falied to connect: " + err);
  });
