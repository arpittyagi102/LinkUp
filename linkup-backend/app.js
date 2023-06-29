  const http = require("http");
  const express = require("express");
  const bodyParser = require('body-parser');
  const app = express();
  const cors = require("cors");
  const { Server } = require("socket.io");
  const { MongoClient } = require("mongodb");
  const bcrypt = require('bcrypt');

  require("dotenv").config();

  app.use(bodyParser.json());
  const corsOptions = {
    origin: ["http://localhost:3000", "http://getlinkup.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  };

  app.use(cors(corsOptions));

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000/signup",
      methods: ["GET", "POST"],
    },
  });

  const MONGO_URI = process.env.MONGO_URI;
  const DB_NAME = process.env.DB_NAME;
  const PORT = process.env.PORT || 3001;
  let db;

  MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB Atlas");
    db = client.db(DB_NAME);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

  app.post('/signup', async (req, res) => {
    const { fname, lname, email, password } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { fname, lname, email, hashedPassword };

      const allusers = db.collection('users');
      const user = await allusers.findOne({ email: newUser.email });

      if (user && user.email) {
        res.status(422).json({ message: "User with the provided email already exists" });
        return;
      }

      await allusers.insertOne(newUser);
      res.status(200).json({ message: "User successfully created", ...newUser });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to insert user into the database" });
    }
  });


  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Data is not found" });
      return;
    }

    const allusers = db.collection('users');
    const user = await allusers.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Could not find a user with this email' });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
      if (isPasswordValid) {
        res.status(200).json({ message: 'Successfully logged in' });
      } else {
        res.status(401).json({ message: 'Wrong password' });
      }
    }
  });





  /*
  app.get("/userslist", async (req, res) => {
    try {
      const users = db.collection("users");
      const usersdata = await users.find().toArray();
      const usersdatatosend = usersdata.map(({ fname, lname, email }) => ({
        name: `${fname} ${lname}`,
        email: email,
      }));
      res.json(usersdatatosend);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  io.on("connection", (socket) => {
    console.log(`A user connected with socket id : ${socket.id}`);
    socket.emit("CTS");

    // Store the socket in userSockets object
    let userEmail;

    socket.on("signup-attempt", async (userdata) =>{
      console.log("A Sign up attempt is made with data :",userdata)
      const users = db.collection('users');
      const checkuser = await users.findOne({email:userdata.email})
      
      if(checkuser){
        console.log("User Already exists");
        socket.emit("signup-attempt-response","USERALREADYEXISTS");
      } 
      else {
        await users.insertOne(userdata).then(()=>{
          console.log(`A user registered with email: ${userdata.email}`);
          socket.emit("signup-attempt-response","SUCCESSFULL");
        }).catch((err) => {
          console.error(err);
          socket.emit("signup-attempt-response","UNSUCCESSFULL")
        });
      }
    }) 

    socket.on("login-attempt",async (userdata) =>{
      console.log("A login attempt is made with ",userdata);
      const users = db.collection('users');
      const user = await users.findOne({email:userdata.email})
      if(!user)
        socket.emit("login-attempt-response",{status:"WRONGEMAIL"})
      if (user.email === userdata.email && user.password === userdata.password) {
        socket.emit("login-attempt-response", {
          status: "SUCCESSFULL",
          email: userdata.email,
        });
      }
      else if(user.email===userdata.email && user.password!==userdata.password)
        socket.emit("login-attempt-response",{status:"WRONGPASSWORD"})
      else
        socket.emit("login-attempt-response",{status:"UNSUCCESSFULL"})
    })

    socket.on("send-message", (data) => {
      const { sendby, sendto, message, time } = data;
      console.log("A message is received", data);

      // Get sender's socket
      const senderSocket = socket;

      // Get recipient's socket from userSockets object
      const recipientSocket = userSockets[sendto];
      if (recipientSocket) {
        // Emit the event to the sender and the recipient
        senderSocket.emit("receive-message", data);
        recipientSocket.emit("receive-message", data);
      } else {
        console.log("recipientSocket not found");
      }
    });

    socket.on("disconnect", () => {
      // Remove the socket from userSockets object
      if (userEmail) {
        delete userSockets[userEmail];
      }

      console.log("A user disconnected");
    }); 
  });*/
