const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const tokenBlackListModel=require("../models/blackList.model")

async function authMiddleware(req,res,next){

  const token=req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlackListed=await tokenBlackListModel.findOne({
      token
    })

    if(isBlackListed){
      return res.status(401).json({
        message:"Unauthorized token is unvalid"

      })
    }

  try{
    

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    //decoded ke andr vhi data hota hai jo ham register krte samay pass krte hai jwt.sign() function me, jaise ki user id, email, etc.

    const user=await userModel.findById(decoded.userId);

    req.user=user;
    return next();

  }

  catch(err){
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
}

async function authSystemUserMiddleware(req,res,next){
  const token=req.cookies.token || req.headers.authorization?.split(' ')[1];

  if(!token){
      return res.status(401).json({ message: 'Unauthorized' });
  }

  const isBlackListed=await tokenBlackistedModel.findOne({
      token
    })

    if(isBlackListed){
      return res.status(401).json({
        message:"Unauthorized token is unvalid"

      })
    }

    
    

  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    const user=await userModel.findById(decoded.userId).select("+systemUser")

    if(!user.systemUser){
      return res.status(403).json({
        message:"Forbidden Access"
      })
    }
    req.user=user;

    return next();



    
  }
  catch(error){
    return res.status(401).json({
      message:"Unauthorized Access, token is invalid"
    })
  }
}

module.exports={authMiddleware,authSystemUserMiddleware};