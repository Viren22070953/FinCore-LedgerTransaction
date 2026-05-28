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

module.exports={createAccount};