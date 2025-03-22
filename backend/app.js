const express = require('express');
const app = express();
const mongoose = require("mongoose");
const  router = require('./routes/userRoutes');
const Blogrouter = require('./routes/blogRoutes');
const cors=require('cors')

//middleware
app.use(cors())
app.use(express.json());
app.use("/api/user",router)
app.use("/api/blog",Blogrouter)  

//connection
mongoose.connect("mongodb+srv://amavarapuakshaykumar:akshay_321@cluster0.8dx6fht.mongodb.net/Blog?retryWrites=true&w=majority&appName=Cluster0"

).then(()=>{
    app.listen(5000)
}).then(()=>console.log("Database connected and server running at port 5000"))
.catch((err)=>console.log(err));



  
