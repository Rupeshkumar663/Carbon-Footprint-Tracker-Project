import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/connectDB.js';
dotenv.config();
const port=process.env.PORT

const app = express();

app.get("/",(req,res)=>{
  res.send("hello from server");
});

app.listen(port,()=>{
  console.log(`Server Started on port ${port}`);
  connectDb()
});