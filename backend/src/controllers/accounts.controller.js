const accountModel=require('../models/account.model');

async function createAccount(req,res){

  try{
    const user=req.user;

    const account=await accountModel.create({
      user:user._id
      

    })

    res.status(201).json({
      message:"Account Created Succesfully",
      account
    })


  }

  catch(error){
    
    res.status(401).json({
      message:"Something went wrong"
      
    })

  }
}

async function getAllAccounts(req,res){

  const allAccounts=await accountModel.find({user:req.user._id});

  res.status(201).json({
    message:"Fetched All Accounts",
    allAccounts
  })

}


async function getBalance(req,res){

  const {accountId}=req.params;

  try{

    const account=await accountModel.findOne({
      _id:accountId,
      user:req.user._id
    });

    if(!account){
      return res.status(403).json({
        message:"Account not found"
      })
    }

    const  balance=await account.getBalance();

    res.status(200).json({
      message:"Balance",
      accountId:account._id,
      Balance:balance
    })

  }

  catch(error){
    res.status(403).json({
      message:"Unauthorized"
    })
  }



}
module.exports={createAccount,getAllAccounts,getBalance};