const mongoose=require('mongoose');

const contactSchema=new mongoose.Schema({
    name:{type:String,required:[true,"Full Name Required *"]},
    emailId:{type:String,required:[true,"Email Id is Required *"]},
    phoneNo:{type:String,default:null,minlength:[10,'Min limit 10'],maxlength:[10,'Max limit 10']},
    message:{type:String,maxlength:[1000,'Max char limit Exceeds']},
    msgDate:{type:Date,default:Date.now},
});

module.exports=mongoose.model("contact",contactSchema, "contact");