const mongoose=require("mongoose")

const transactionSchema=new mongoose.Schema({

  fromAccount:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"account",
    required:[true,"transaction must be associated with from account"],
    index:true
  },

  toAccount:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"account",
    required:[true,"transaction must be associated with to account"],
    index:true

  },

  status:{
    type:String,
    enums:{
      values:["PENDING","COMPLETED","FAILED","REVERSED"],
      message:"Status can be either pending ,completed, failed , reversed"
    },

    default:"PENDING"
  },

  amount:{
    type:Number,
    required:true,
    min:0

  },

  idempotencyKey:{
    type:String,
    required:true,
    index:true,
    unique:true
  },



},{timestamps:true})

const transactionModel=mongoose.model("transaction",transactionSchema);

module.exports=transactionModel;