const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const socketEvents = require('./socketEvents.js')
const server = http.createServer(app);
require("dotenv").config();

app.use(bodyParser.json());

require('./startup/cors.js')(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://getlinkup.vercel.app"],
    methods: ["GET", "POST"],
  },
});
socketEvents(io);

require('./startup/db')(app);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});