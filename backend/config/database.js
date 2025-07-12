const mongoose=require("mongoose");

const connection= async function(){
    const connect=await mongoose.connect("mongodb+srv://admin:MongoConnect123hehe@cluster0.t1i2qst.mongodb.net/DevTinder");
    return connect;
}

module.exports={
    connection
}