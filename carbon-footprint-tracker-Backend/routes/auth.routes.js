import express from"express";
import {signup,login,sendOtp,verifyOtp} from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/sendOtp",sendOtp);
router.post("/verifiedotp",verifyOtp);
export default router;
