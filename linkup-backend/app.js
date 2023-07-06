const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const http = require("http");
const { MongoClient } = require("mongodb");
const { Server } = require("socket.io");
const socketEvents = require('./socketEvents.js')
require("dotenv").config(); 

const server = http.createServer(app);
app.use(bodyParser.json());
const corsOptions = {
  origin: ["http://localhost:3000", "https://getlinkup.vercel.app"],
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
  next();
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://getlinkup.vercel.app"],
    methods: ["GET", "POST"],
  },
});
socketEvents(io);

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
let db;

MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
 .then((client) => {
   console.log("Connected to MongoDB Atlas");
   db = client.db(DB_NAME);

  const authController = require('./controllers/authController')(db);
   const authRoutes = require('./routes/authRoutes')(authController);
   app.use('/auth', authRoutes);

  const userController = require('./controllers/userController')(db);
   const userRoutes = require('./routes/userRoutes')(userController);
   app.use('/user', userRoutes);

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
 })
 .catch((err) => {
   console.error(err);
 });
