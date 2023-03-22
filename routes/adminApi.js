const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const Admin=require('../models/admin');
const bcrypt=require('bcryptjs');

const jwt=require ('jsonwebtoken');

dotenv.config();
mongoose.connect(process.env.DBCONNECT,{useNewUrlParser:true,useUnifiedTopology:true});

// sign in
router.post('/login',async(req,res)=>{
  const admin=await Admin.findOne({username:req.body.username})
  if (!admin) return res.send({'message':'Incorrect username','st':0})
  const validPwd=await bcrypt.compare(req.body.password,admin.password);
  if (!validPwd) return res.send({'message':'Incorrect Password','st':0})
 // res.send('login successfull')
const token=await jwt.sign({_id:admin._id},process.env.ATOKEN_STRING);
res.header("admin_auth_token",token).send({message:'Welcome Admin !',token:token,admin_id:admin._id,'st':1});

});

// new user register karne ke liye
router.post('/',async(req,res)=>{
    const username=req.body.username;
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);
    const data={username:username,password:hashedPassword};
    const newData=new Admin(data);
    newData.save(function(err){
        if(!err){
        res.send({'message':'Admin Registered','st':1});
        }
        else
        res.send(({'message':err,'st':0}));
    });
});
module.exports=router;