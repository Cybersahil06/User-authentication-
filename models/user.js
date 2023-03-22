const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{type:String,required:[true,"Full Name Required *"]},
    emailId:{type:String,required:[true,"Email Id is Required *"]},
    phoneNo:{type:String,default:null,minlength:[10,'Min limit 10'],maxlength:[10,'Max limit 10']},
    password:{type:String,required:[true,"Password is Required"]},
    regDate:{type:Date,default:Date.now},
});

module.exports=mongoose.model("user",userSchema, "user");