const mongoose=require("mongoose");

const connectionRequestSchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"     
    },
    status:{
        type:String,
        enum:{
            values:["accepted","rejected","intersted","ignored"],
            message:`{value} is incoorect`
        }
    }
},{
    timestamps:true
});

connectionRequestSchema.index({fromUserId:1,toUserId:1});

const ConnectionRequest= mongoose.model("ConnectionRequest",connectionRequestSchema);



module.exports={
    ConnectionRequest
}