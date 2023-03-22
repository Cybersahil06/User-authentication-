const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const Contact=require('../models/contact');
const nodemailer=require("nodemailer");
const adminverify=require('./adminverifytoken');

dotenv.config();
mongoose.connect(process.env.DBCONNECT,{useNewUrlParser:true,useUnifiedTopology:true});
router.get('/',adminverify,(req,res)=>{
    Contact.find(function (err, data) {
            if (!err)
                res.send(data);

            else
                res.send(err);
        });
})

router.post('/',(req,res)=>{
  console.log(req.body);  
  const name=req.body.name;
    const emailId=req.body.emailId;
    const phoneNo=req.body.phoneNo;
    const message=req.body.message;
    const contactData={name:name,emailId:emailId};
    const data={name:name,emailId:emailId,phoneNo:phoneNo,message:message};

    const newData=new Contact(data);
    newData.save(function(err){
        if(!err){
            sendMail(contactData,info=>{
            console.log(`The mail has been sent. Id is ${info.messageId}`) });
        res.send({'message':'Thank You For Reaching Out To Us','st':1});
        }
        else
        res.send(({'message':err,'st':0}));
    });
});

async function sendMail(contact, callback) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: "sahiljain6322@gmail.com",
        pass: "345car678"
      }
    });
  
    let mailOptions = {
      from: '" Mail from Sahil"<sahiljain6322@gmail.com>',
      to: contact.emailId,
      subject: "Thanks For reaching Us",
      html: `<h1>Hi ${contact.name}</h1>
      <p> Our Team will respond to Your Query </p><br>
      <h4>Thanks for Message </h4>`
    };
    let info = await transporter.sendMail(mailOptions);
    callback(info);
}


module.exports=router;
