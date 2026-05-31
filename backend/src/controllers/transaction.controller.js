const mongoose=require("mongoose");
const transactionModel=require("../models/transaction.model")

const accountModel=require("../models/account.model")

const ledgerModel=require("../models/ledger.model")
const emailService=require('../services/email.service');

const userModel=require("../models/user.model")




/**
 The 10 Step Transaction Flow
 1)Validate Request
 2)Validate idempotency key
 3)check account status
 4)Derive sender balance from ledger
 5)create transaction (Pending)
 6)create Debit ledger entry
 7)create Credit ledger entry
 8)Mark transaction Completed
 9)Commit MongoDb Session
 10)send email notification
 */

async function createTransaction(req,res){

  //1
  const {fromAccount,toAccount,amount,idempotencyKey}=req.body;

  if(!fromAccount || !toAccount || !amount || !idempotencyKey){
    res.status(400).json({
      message:"Data is unsufficient"
    })
  }


  
  const fromUserAccount=await accountModel.findOne({_id:fromAccount})

  const toUserAccount=await accountModel.findOne({_id:toAccount})

  const receiver=await userModel.findOne({_id:toUserAccount.user.toString()})


  if(!fromUserAccount || !toUserAccount){
    return res.status(400).json({
      message:"Accounts not found"
    })
  }
   
  //2
  const isTransactionAlreadyExist=await transactionModel.findOne({idempotencyKey});

  if(isTransactionAlreadyExist){
    if(isTransactionAlreadyExist.status==="COMPLETED"){
      return res.status(200).json({
        message:"Transaction already processed",
        transaction:isTransactionAlreadyExist
      })
    }

    if(isTransactionAlreadyExist.status==="PENDING"){
     return res.status(200).json({
        message:"Transaction is still processing"
      })
    }

    if(isTransactionAlreadyExist.status==="FAILED"){
      return res.status(500).json({
        message:"Transaction Failed"
      })
    }

    if(isTransactionAlreadyExist.status==="REVERSED"){
      return res.status(500).json({
        message:"Transaction ,Please retry!"
      })
    }
  }

  //3

  if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
    return res.status(500).json({
      message:"Account not active"
    })

  }

  //4

  const balance= await fromUserAccount.getBalance();

  if(balance < amount){
    return res.status(400).json({
      message:`Insufficient Balance. Current balance : ${balance}`
    })

  }

  //5
  let session;
  try{

    const session=await mongoose.startSession();
    session.startTransaction();
    
    const transaction=(await transactionModel.create([{
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status:"PENDING"
    }],{session}))[0]

      //6

      const creditLedgerEntry=await ledgerModel.create([{
      account:fromAccount,
      amount:amount,
      transaction:transaction._id,
      type:"DEBIT"
    }],{session})

      



    //7
    const debitLedgerEntry=await ledgerModel.create([{
      account:toAccount,
      amount:amount,
      transaction:transaction._id,
      type:"CREDIT"
    }],{session})
  
    
    //8
    transaction.status="COMPLETED"

    //9
    await transaction.save({session});
    await session.commitTransaction();
    session.endSession();

    //10
   await emailService.sendTransactionEmail(req.user.email , req.user.name ,amount , receiver.name);

   return res.status(201).json({
    message:"Transaction completed succesfully",
    transaction
   })

  }

  catch(error){
   return res.status(400).json({
    message:"Transaction is pending due to some internal server error"
   })

  
  }

  
   
  

   
  

}

async function createInitialFundsTransaction(req,res){

  const {toAccount,amount,idempotencyKey}=req.body;

  if(!toAccount || !amount ||!idempotencyKey){
    return res.status(400).json({
      message:"toAccount , amount and idempotency key are required"
    })

  }

  const toUserAccount=await accountModel.findById(toAccount);

  if(!toUserAccount){
    return res.status(400).json({
      message:"Invalid"
    })

  }

  const fromUserAccount=await accountModel.findOne({
    user:req.user._id
  })

  if(!fromUserAccount){
    return res.status(400).json({
      message:'Account not found'
    })
  }

  const session=await mongoose.startSession();
  session.startTransaction();

  const transaction=new transactionModel({
    fromAccount:fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"

  })


  const debitLedgerEntry=await ledgerModel.create([{
    account:fromUserAccount._id,
    amount,
    transaction:transaction._id,
    type:"DEBIT"

  }],{session})

  const creditLedgerEntry=await ledgerModel.create([{
    account:toAccount,
    amount,
    transaction:transaction._id,
    type:"CREDIT"

  }],{session})
   
  transaction.status="COMPLETED"
  await transaction.save({session})
  
  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message:"Initial funds transaction completed"
  })






}



async function getTransactionHistory(req, res) {
  try {
    const userId = req.user._id;

    const userAccounts = await accountModel.find({ user: userId }).select("_id");

    const accountIds = userAccounts.map((account) => account._id);

    const transactions = await transactionModel
      .find({
        $or: [
          { fromAccount: { $in: accountIds } },
          { toAccount: { $in: accountIds } },
        ],
      })
      .populate({
        path: "fromAccount",
        select: "user",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "toAccount",
        select: "user",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    const formattedTransactions = transactions.map((transaction) => {
      const fromAccountId = transaction.fromAccount?._id?.toString();
      const toAccountId = transaction.toAccount?._id?.toString();

      const isDebit = accountIds.some(
        (accountId) => accountId.toString() === fromAccountId
      );

      const isCredit = accountIds.some(
        (accountId) => accountId.toString() === toAccountId
      );

      return {
        _id: transaction._id,
        amount: transaction.amount,
        status: transaction.status,
        idempotencyKey: transaction.idempotencyKey,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,

        type: isDebit ? "DEBIT" : "CREDIT",

        fromUser: {
          name: transaction.fromAccount?.user?.name || "Unknown user",
          email: transaction.fromAccount?.user?.email || "",
        },

        toUser: {
          name: transaction.toAccount?.user?.name || "Unknown user",
          email: transaction.toAccount?.user?.email || "",
        },

        directionText: isDebit
          ? `Sent to ${transaction.toAccount?.user?.name || "Unknown user"}`
          : `Received from ${
              transaction.fromAccount?.user?.name || "Unknown user"
            }`,
      };
    });

    return res.status(200).json({
      message: "Transaction history fetched successfully",
      transactions: formattedTransactions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports={createTransaction,createInitialFundsTransaction,getTransactionHistory};