const mongoose=require('mongoose');

const adminSchema=new mongoose.Schema({
    username:{type:String,required:[true,"User Name Required *"]},
    password:{type:String,required:[true,"Password is Required"]},
});

module.exports=mongoose.model("admin",adminSchema, "admin");