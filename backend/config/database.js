const mongoose=require("mongoose");

const connection= async function(){
    const connect=await mongoose.connect(process.env.DB_CONNECTION_STRING);
    return connect;
}

module.exports={
    connection
}