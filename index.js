const express = require('express')                    
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()
const port = 3000

app.use(cors({'origin':'*'}));

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

const contactApi=require('./routes/contactApi')
app.use('/contact',contactApi)

const userApi=require('./routes/userApi')
app.use('/user',userApi)

const adminApi=require('./routes/adminApi')
app.use('/admin',adminApi)

const blogApi=require('./routes/blogApi')
app.use('/blog',blogApi)

app.get('/', (req,res)=> {
    res.send('App Works !!');
})





app.listen(port,()=>{
    console.log(`My Mean Project is listening at http://localhost:${port}`)
})
