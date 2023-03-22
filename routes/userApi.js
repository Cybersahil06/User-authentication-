const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const User=require('../models/user');
const nodemailer=require("nodemailer");
const bcrypt=require('bcryptjs');
const jwt=require ('jsonwebtoken');
const adminverify=require('./adminverifytoken');
const userverify=require('./userverifytoken');

dotenv.config();
mongoose.connect(process.env.DBCONNECT,{useNewUrlParser:true,useUnifiedTopology:true});

//all user show krata hai
router.get('/',adminverify,(req,res)=>{
    User.find(function (err, data) {
            if (!err)
                res.send(data);     

            else
                res.send(err);
        });
})

// view user profile 
router.get('/:id',userverify,(req,res)=>{
  let id= req.params.id;
  User.findById(id,function (err, data) {
          if (!err)
              res.send(data);     

          else
              res.send(err);
      });
})


// profile update
router.patch('/:id',userverify,(req,res)=>{
  let id=req.params.id;
  const name=req.body.name;
  const emailId=req.body.emailId;
  const phoneNo=req.body.phoneNo;
  const data={name:name,emailId:emailId,phoneNo:phoneNo};
  User.findByIdAndUpdate(id,data,(err)=>{
  if(!err){
  res.send({'message':'Profile Updated','st':1});
  }
  else
  res.send(({'message':err,'st':0}));
  });
})

// change password
router.patch('/pwd/:id',userverify,async(req,res)=>{
  let id=req.params.id;
  const salt=await bcrypt.genSalt(10);
  const hashedPassword=await bcrypt.hash(req.body.password,salt);
  const data={password:hashedPassword};
  User.findByIdAndUpdate(id,data,(err)=>{
  if(!err){
  res.send({'message':'Password Changed Successfully','st':1});
  }
  else
  res.send(({'message':err,'st':0}));
  });
})

// sign in
router.post('/signin',async(req,res)=>{
  console.log(req.body);

  const user=await User.findOne({emailId:req.body.emailId})
  if (!user) return res.send({'message':'Incorrect EmailId','st':0})
  const validPwd=await bcrypt.compare(req.body.password,user.password);
  if (!validPwd) return res.send({'message':'Incorrect Password','st':0})
 // res.send('login successfull')
  const token=await jwt.sign({_id:user._id},process.env.UTOKEN_STRING);
  res.header("user_auth_token",token).send({message:'Welcome User !',token:token,user_id:user._id,'st':1});

});

// new user register karne ke liye
router.post('/',async(req,res)=>{
  console.log(req.body);
  const user=await User.findOne({emailId:req.body.emailId})
  if(user) return res.send({'message': 'Email Already exist', 'st':0});
  
    const name=req.body.name;
    const emailId=req.body.emailId;
    const phoneNo=req.body.phoneNo;
    // const password=req.body.password;
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);
    const userData={name:name,emailId:emailId};
    const data={name:name,emailId:emailId,phoneNo:phoneNo,password:hashedPassword};
    const newData=new User(data);
    newData.save(function(err){
        if(!err){
            sendMail(userData,info=>{
            console.log(`The mail has been sent. Id is ${info.messageId}`) });
        res.send({'message':'User Registered','st':1});
        }
        else
        res.send(({'message':err,'st':0}));
    });
});

//forget password
router.post('/forgot',async(req,res)=> {
  console.log(req.body);
  const user=await User.findOne({emailId:req.body.emailId})
  if (!user) return res.send({'message':'Email Address not exist','st':0});
  const code=req.body.code;
  const emailId=req.body.emailId;
  const contactData={emailId:emailId,code:code};
  fgsendMail(contactData, info =>{
    console.log(`The mail has been sent Id is ${info.messageId}`)    
    res.send({'message':`An email With Verification code has been sent to  ${emailId}`,'st':1 });

  });

});

// reset password
router.patch('/reset/password',async(req,res)=>{
  const emailId=req.body.emailId;
  const salt=await bcrypt.genSalt(10);
  const hashedPassword=await bcrypt.hash(req.body.password,salt);
  const formdata={password:hashedPassword}
   User.findOneAndUpdate({emailId:emailId},{$set:formdata},function(err){
        if(!err)
        res.send({ 'message' : 'Password Changed Successfully','st':1});
        else
        res.send({'error' : err,'st':0});
      });
    });


//mail send karne ke liye
async function sendMail(contact, callback) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: "sahiljain6322@gmail.com",
        pass: "2017s@in"
      }
    });
  
    let mailOptions = {
      from: '"From #***#"<sahiljain6322@gmail.com>',
      to: contact.emailId,
      subject: "Thanks For Joining Us",
      html: `<h1>Hi ${contact.name}</h1>
      <p> Your Account Was Created successfully. We look forward to your creations.</h4>`
    };
    let info = await transporter.sendMail(mailOptions);
    callback(info);
}
async function fgsendMail(contact, callback) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: "sahiljain6322@gmail.com",
        pass: "2017s@in"
      }
    });
  
    let mailOptions = {
      from: '"From Sahil"<sahiljain6322@gmail.com>',
      to: contact.emailId,
      subject: "Password Recovery",
      html: `<h2>Hi </h2> 
       <p>You have just requested a password reset for the account associated with this email address.To reset your password
      Use the code given below .If this is a mistake just ignore this email - your password will not be changed.</p>
      <h3>Your Verification code is ${contact.code}.</h3><br>
     <h5>Regards </h5>`

    };
    let info = await transporter.sendMail(mailOptions);
    callback(info);
}


module.exports=router;
