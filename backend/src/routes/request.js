const express=require("express");

// auth middleware
const {userAuth}=require("../middlewares/auth")

// model
const {ConnectionRequest}=require("../models/connectionRequest")
const {User}=require("../models/user")
// router
const requestRouter=express.Router()


requestRouter.post("/send/:status/:userId",userAuth,async(req,res)=>{
    const status=req.params?.status;
    const toUserId=req.params?.userId;
    const fromUserId=req.user._id;

    try{
        // checking status correct or not
        if(!["ignored","intersted"].includes(status)){
            throw new Error("invalid status: "+status)
        }

        // The user to whom the request is to be sent exists or not.
        const RequestedUser= await User.findOne({_id:toUserId});
        if(!RequestedUser){
            throw new Error("The user you are trying to send request to, does not exist")
        }

        // check user do not send it to himself
        if(fromUserId.equals(toUserId)){
            throw new Error("You cannot send connection request to yourself");
        }

        // existing connection does not exist between them
        const existingConnection=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(existingConnection){
            // check prev status              
            if(existingConnection.status=="intersted" && status=="intersted"){
                existingConnection.status="accepted";
                const data=await existingConnection.save()
                return res.status(200).json({
                    "message":"its a match",
                    "data":data,
                    "match":true,
                })
            }
            else{
                existingConnection.status=status;
                const data= await existingConnection.save();
                return res.json({
                    "message":"connection status updated",
                    "data":data
                })
            }
        }   

        const requestData= new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data= await requestData.save();

        res.json({
            message:"Connection request sent succesfully",
            data
        })
    }
    catch(err){
        res.json({
            message:"errror",
            error:`${err.message}`
        })
    }
})


 requestRouter.post("/review/:status/:requestId",userAuth,async(req,res)=>{
    const loggedInUser=req.user;
    const {status,requestId}=req.params ;   
    const allowewdStatus=["accepted","rejected"]
            // console.log(requestId)
        try{
            // checking if status valid or not
            if(!allowewdStatus.includes(status)){
                throw new Error(`Invalid status: `+status)
            }

            const connectionRequest= await ConnectionRequest.findOne({
                fromUserId:requestId,
                toUserId:loggedInUser._id,
                status:"intersted"
            })
            // console.log(connectionRequest);
            if(!connectionRequest){
                throw new Error("No pending 'intersted' connection request from this user")
            }

            connectionRequest.status=status;
            const data=await connectionRequest.save()
            res.json({
                "message":`connection request ${status} successfully`,
                data
            })
        }
        catch(err){
            res.json({
                "error":`${err.message}`,
            })
        }

    } )


module.exports={
    requestRouter
}


