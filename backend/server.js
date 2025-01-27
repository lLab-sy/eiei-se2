const express = require('express')
const dotenv = require('dotenv')
const connectDB= require('./config/db') //เรียกใช้ db

//Load env vars
dotenv.config({path:'./config/config.env'})
connectDB(); //use db

const app=express()
const cors = require("cors");
//Routes files
const posts =require('./routes/posts')
const users =require('./routes/auth')

app.use(cors({
    origin: process.env.FRONT_END, //frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],  
    credentials: true,  
}));
//Mount Path
app.use(express.json({ limit: '50mb' })); // Increase the limit to 50MB //body parser มาก่อน use api นะ!!!
app.use('/api/v1/posts',posts)
// app.use('/api/v1/auth',users)
const PORT=process.env.PORT || 5001;
const server= app.listen(PORT,console.log('Server running in',process.env.NODE_ENV,'mode on port',PORT));

//Handle unhandler promise rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error Message: ${err.message}`)
    server.close(()=>process.exit())
})
