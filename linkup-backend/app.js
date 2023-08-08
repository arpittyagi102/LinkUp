require('dotenv').config(); 
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const socketEvents = require('./startup/socketEvents.js')
const server = http.createServer(app);
const { connectAndSetUpRoutes, getDbInstance } = require('./startup/db.js');

if (process.env.NODE_ENV === 'test') {
  require("dotenv").config({ path: ".env.test" });
} else {
  require("dotenv").config();
}
app.use(bodyParser.json());

require('./startup/cors.js')(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://getlinkup.vercel.app"],
    methods: ["GET", "POST"],
  },
});


// Connect to the database and set up routes
connectAndSetUpRoutes(app)
  .then(() => {
    const db = getDbInstance();
    socketEvents(io, db);

    const PORT = process.env.PORT || 3001;

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error setting up routes:", error);
  });

module.exports = server;