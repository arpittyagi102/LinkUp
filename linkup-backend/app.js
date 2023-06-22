const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { MongoClient } = require('mongodb');
require('dotenv').config();

app.use(cors()); // Add cors middleware

const server = http.createServer(app);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://getlinkup.vercel.app');
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

io.on("connection",(socket)=>{
    console.log("A user connected")
    socket.emit("CTS")
})

server.listen(PORT, () => {
    console.log("SERVER IS RUNNING..");
    console.log("listening on port https://localhost:%d",3001);
});



