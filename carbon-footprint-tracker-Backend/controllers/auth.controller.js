import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../config/token.js";
import sendMail from "../config/sendMail.js";
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


// Send OTP (Forget Password)---------------------------------
export const sendotp=async(req,res)=>{
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
        user.resetOtp=otp,
        user.otpExpires=Date.now()+5*60*1000,
        user.isotpVerified=false
    
      await user.save()
      await sendMail(email,otp);

    return res.status(200).json({message: "OTP sent successfully"});
  } catch (error) {
    res.status(500).json({ message:`Send otp error ${error}`});
  }
};



// Verify OTP ------------------
export const verifyotp=async(req,res)=>{
  try{
    const {email,otp}=req.body;
    const user=await User.findOne({email})
    if(!user || user.resetOtp!==otp|| user.otpExpires<Date.now()){
      return res.status(404).json({ message:"Invalid OTP"});
    }
      user.isotpVerified=true,
      user.resetOtp=undefined,
      user.otpExpires=undefined
      
      await user.save()
    
    return res.status(200).json({message: "OTP verified successfully"});
  } catch (error) {
    return res.status(500).json({ message:"verify otp error"});
  }
};

//Reset Password------------------------------------------
export const resetpassword=async(req,res)=>{
   try{
     const {email,password}=req.body
     const user=await User.findOne({email})
    if(!user || !user.isotpVerified){
       return res.status(404).json({message: "OTP verification  is required "});
    }
    const hashPassword=await bcrypt.hash(password,10)
    user.password=hashPassword,
    user.isotpVerified=false,
    await user.save()
      return res.status(200).json({message:"Reset Password Successfully"})
   } catch(error){
      return res.status(404).json({message: "Reset password error"});
   }
}
