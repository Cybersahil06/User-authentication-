const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const Blog=require('../models/blog');
const multer=require('multer'); 
const adminverify=require('./adminverifytoken');
const DIR = './public/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});
// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
 

dotenv.config();
mongoose.connect(process.env.DBCONNECT,{useNewUrlParser:true,useUnifiedTopology:true});
router.get('/',(req,res)=>{
    Blog.find(function (err, data) {
            if (!err)
                res.send(data);

            else
                res.send(err);
        }).sort({'postDate':-1})
})

router.get('/recent',(req,res)=>{
    Blog.find(function (err, data) {
            if (!err)
                res.send(data);

            else
                res.send(err);
        }).limit(3).sort({'postDate':-1})
})

router.get('/:id',(req,res)=>{
    const id=req.params.id;
    Blog.findById(id,function (err, data) {
            if (!err)
                res.send(data);

            else
                res.send(err);
        })
})

router.delete('/:id',adminverify,(req,res)=>{
    const id=req.params.id;
    Blog.findByIdAndDelete(id,(err)=>{
        if(!err)
        res.send({'message':'Article Deleted','st':1});
        else
        res.send(({'message':err,'st':0}));
    })
})

router.patch('/data/:id',adminverify,(req,res)=>{
    const id=req.params.id;
    const title=req.body.title;
    const subtitle=req.body.subtitle;
    const content=req.body.content;
    const data={title:title,subtitle:subtitle,content:content};
    
    Blog.findByIdAndUpdate(id,data,(err)=>{
        if(!err)
        res.send({'message':'Article Is Saved','st':1});
        else
        res.send(({'message':err,'st':0}));
    })
})

router.patch('/:id',adminverify,upload.single('imageurl'),(req,res)=>{
  const id=req.params.id;
  const title=req.body.title;
  const subtitle=req.body.subtitle;
  const url="http://localhost:3000/public/";
    const imageurl=url+req.file.filename;
  const content=req.body.content;
  const data={title:title,subtitle:subtitle,imageurl:imageurl,content:content};
  
  Blog.findByIdAndUpdate(id,data,(err)=>{
      if(!err)
      res.send({'message':'Article Is Saved','st':1});
      else
      res.send(({'message':err,'st':0}));
  })
})

router.post('/',adminverify,upload.single('imageurl'),(req,res)=>{
    const title=req.body.title;
    const subtitle=req.body.subtitle;
  //  const imageurl=req.body.imageurl;
    const url="http://localhost:3000/public/";
    const imageurl=url+req.file.filename;
    const content=req.body.content;
    const data={title:title,subtitle:subtitle,imageurl:imageurl,content:content};
    const newData=new Blog(data);
    newData.save(function(err){
        if(!err)
        res.send({'message':'Article Is Saved','st':1});
        else
        res.send(({'message':err,'st':0}));
    });
});

module.exports=router;
