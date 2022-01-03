const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");


dotenv.config();
// setup server

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server started on port:${PORT}`));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000"],
    credentials: true,
}));

// conncet mongoose

mongoose.connect(process.env.MDB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
},(err)=>{
    if(err) return console.error(err);
    console.log("connected to mongo");

});



// setup routes

app.use("/auth", require("./routers/userRouter")); 
 





