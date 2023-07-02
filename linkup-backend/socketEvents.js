module.exports = (io) => {
    io.on('connection', (socket) => {
      let userData;
      let onlinePeople=[];
  
      socket.on("initialData", (userDatacame) => {
        userData = userDatacame;
        console.log(userData.name, "is online");
        onlinePeople=[...onlinePeople,userData.email];
        socket.emit("initialdata",onlinePeople);
        io.emit("online", userData);
      });
  
      socket.on("disconnect", () => {
        if (userData) {
          console.log(userData.name, "is offline");
          io.emit("offline", userData);
        }
      });
    });
  };
  