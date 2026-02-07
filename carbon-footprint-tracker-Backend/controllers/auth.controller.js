import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../config/token.js";

//signup---------------------------------------
export const signup=async(req,res)=>{
  try {
    const {name,email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(existingUser){
      return res.status(400).json({ message:"User already exists"});
    }
    const hash=await bcrypt.hash(password,10);
    const user= await User.create({
      name,
      email,
      password:hash,
    });
    const token=generateToken(user._id);
    res.status(201).json({
      success:true,
      token,
    });
  } catch(error){
    res.status(500).json({message:"Server error"});
  }
};

//Login---------------------------------------
 export const login=async(req,res)=>{
  try{
    const{email,password}=req.body;

    const user=await User.findOne({email}).select("+password");
    if(!user)
      return res.status(404).json({message:"User not found"});

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch)
      return res.status(401).json({message:"Invalid password" });

    const token= generateToken(user._id);
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ message:"Server error" });
  }
};

import transporter from "../config/email.js";

// Send OTP (Forget Password)---------------------------------
export const sendOtp=async(req,res)=>{
  try {
    const {email}=req.body;

    if(!email){
      return res.status(400).json({message:"Email is required"});
    }

    const user=await User.findOne({email});
    if(!user){
      return res.status(404).json({message:"User not found" });
    }

    const otp=Math.floor(100000 + Math.random() * 900000);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });


    return res.status(200).json({success: true,message: "OTP sent successfully",});
  } catch (error) {
    res.status(500).json({ message:"Server error"});
  }
};



// Verify OTP ------------------
export const verifyOtp=async(req,res)=>{
  try{
    const {email,otp}=req.body;

    if(!email || !otp){
      return res.status(400).json({ message:"Email and OTP are required"});
    }

    const user=await User.findOne({email});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
