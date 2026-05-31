const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const emailService=require('../services/email.service');
const bcrypt=require('bcryptjs');

const tokenBlackListModel=require("../models/blackList.model")


async function registerUser(req,res){

  try{
    const {name,email,password}=req.body;

    const isExist=await userModel.findOne({
      email:email
    })

    if(isExist){
      return res.status(422).json({message:"User already exists"});
    }

    const user=await userModel.create({
      email,
      name,
      password
    })

    const token=jwt.sign({
      userId:user._id,
    },process.env.JWT_SECRET)

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    res.status(201).json({message:"User registered successfully",
      user:{
        _id:user._id,
        email:user.email,
        name:user.name
      },
      token
    });

    await emailService.sendRegistrationEmail(user.email,user.name);

    
    
  }

  catch(error){
    console.error(error);
    return res.status(500).json({message:"Server error"});
  }
}

async function loginUser(req,res){
  try{
    const {email,password}=req.body;

    const user=await userModel.findOne({
      email:email
    }).select('+password');

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password or Email" });
    } 

    const token = jwt.sign({
      userId: user._id,
    }, process.env.JWT_SECRET);

    res.cookie('token', token,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
  

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      },
      token
    });
  }
  catch(error){
    console.error(error);
    return res.status(500).json({message:"Server error"});
  }
}

async function logoutUser(req,res){

  const token=req.cookies.token

  if(!token){
    return res.status(400).json({
      message:"User Logged out succesfully"
    })
  }

  res.cookie("token","");

  await tokenBlackListModel.create({
    token:token
  })

  res.status(200).json({
    message:"user logged out succesfully"
  })

  

}

async function forgotPassword(req,res){

  try{
    const {email}=req.body;
    const user=await userModel.findOne({
      email
    })

    if(!user){
      return res.status(404).json({message:"If user exists, a password reset link will be sent to the email"});
    }

    const resetToken=crypto.randomBytes(32).toString("hex");

   

    user.resetPasswordToken=resetToken;
     user.resetPasswordExpires=Date.now()+10*60*1000;

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetLink
    );

    return res.status(200).json({
      message:"Mail Sent Successfully",
      resetToken
    });

  

  }

  catch(error){
    console.error(error);
    return res.status(500).json({message:"Server error"});
  }
}

async function resetPassword(req,res){

  try{
    const {token,password}=req.body;

    console.log(password);



    const user=await userModel.findOne({
      resetPasswordToken:token,
      resetPasswordExpires:{$gt:Date.now()}
    }).select('+password')



    if(!user){
      return res.status(400).json({message:"Invalid or expired token"});
    }

    user.password=password;
    
    user.resetPasswordToken=undefined;
    user.resetPasswordExpires=undefined;
    await user.save();
    return res.status(200).json({message:"Password reset successfully"});
  }
  catch(error){
    console.error(error);
    return res.status(500).json({message:"Server error"});
  }
}





module.exports={
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword
}

