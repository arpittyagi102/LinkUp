const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { MongoClient } = require('mongodb');
const { disconnect } = require("process");
require('dotenv').config();

app.use(cors()); // Add cors middleware

const server = http.createServer(app);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://getlinkup.vercel.app');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get("/", (req, res) => {
  res.send("LinkUp-backend is deployed successfully");
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://getlinkup.vercel.app"],
    methods: ["GET", "POST"],
  },
});

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT || 3001;

let db; 

MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB Atlas');
    db = client.db(DB_NAME);
    server.listen(3001, () => {
      console.log("SERVER IS RUNNING..");
      console.log("listening on port %d", server.address().port);
    });
  })
  .catch((err) => {
    console.error(err);
});

io.on("connection",(socket)=>{
    console.log("A user connected")
    socket.emit("CTS");

    socket.on("signup-attempt", async (userdata) =>{
      console.log("A Sign up attempt is made with data :",userdata)
      const users = db.collection('users');
      const checkuser = await users.findOne({email:userdata.email})
       
      if(checkuser){
        console.log("User Already exitst");
        socket.emit("signup-attempt-response","USERALREADYEXISTS");
      } 
      else {
      await users.insertOne(userdata).then(()=>{
        console.log(`A user registerend with email :${userdata.email}`);
        socket.emit("signup-attempt-response","SUCCESSFULL");
      }).catch((err) => {
        console.error(err);
        socket.emit("signup-attempt-response","UNSUCCESSFULL")
      })}
    }) 

    socket.on("login-attempt",async (userdata) =>{
      console.log("A login attempt is made with ",userdata);
      const users = db.collection('users');
      const user = await users.findOne({email:userdata.email})
      if(!user)
        socket.emit("login-attempt-response","WRONGEMAIL")
      else if(user.email===userdata.email && user.password===userdata.password)
        socket.emit("login-attempt-response","SUCCESSFULL")
      else if(user.email===userdata.email && user.password!==userdata.password)
        socket.emit("login-attempt-response","WRONGPASSWORD")
      else
        socket.emit("login-attempt-response","UNSUCCESSFULL")
    })
    
    socket.on("disconnect",()=>{
      console.log("A user disconnected")
    })
})





