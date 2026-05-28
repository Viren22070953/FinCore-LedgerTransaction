const mongoose=require("mongoose")

const ledgerSchema=new mongoose.Schema({
  account:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"account",
    required:true,
    index:true,
    immutable:true, // apn isko modify nhi kr skte 
  },

  amount:{
    type:Number,
    required:true,
    immutable:true
  },

  transaction:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"transaction",
    required:true,
    index:true,
    immutable:true
  },

  type:{
    type:String,
    enums:{
      values:["CREDIT","DEBIT"],
    },
    required:true,
    immutable:true
  }


})

function preventLedgerModification(){
  throw new error("Ledger entries are immutable, they can not be modify or delete");
}
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification)

ledgerSchema.pre('updateOne',preventLedgerModification)

ledgerSchema.pre('deleteOnre',preventLedgerModification)

ledgerSchema.pre('remove',preventLedgerModification)

ledgerSchema.pre('updateMany',preventLedgerModification)

ledgerSchema.pre('findOneAndDelete',preventLedgerModification)

ledgerSchema.pre('findOneAndreplace',preventLedgerModification)

const ledgerModel=mongoose.model("ledger",ledgerSchema);

module.exports=ledgerModel