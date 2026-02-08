import express from"express";
import {signup,login,sendotp,verifyotp, resetpassword} from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/sendotp",sendotp);
router.post("/verifiedotp",verifyotp);
router.post("/resetpassword",resetpassword);
export default router;
