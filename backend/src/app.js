// npm installed or built in moduels
const express = require("express"); // importing express for routing
const cookieParser = require("cookie-parser");

//  self cretaed modules
const { connection } = require("../config/database"); // importing db connection

const app = express();
const port = 3000;

// used to read the json from the request body
app.use(express.json());
// used to read cookies
app.use(cookieParser());

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
