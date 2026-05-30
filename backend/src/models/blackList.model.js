const mongoose=require("mongoose");

const tokenBlacklistSchema= new mongoose.Schema({

  token:{
    type:"String",
    reqiured:[true,"TOken is required to blacklist"],
    unique:[true,"Token is Already Blacklisted"]
  }


},{timestamps:true})

tokenBlacklistSchema.index({createdAt:1},{
  expireAfterSeconds:60*60*24*3
})

const tokenBlackListModel=mongoose.model("tokenBlackList",tokenBlacklistSchema)

module.exports=tokenBlackListModel