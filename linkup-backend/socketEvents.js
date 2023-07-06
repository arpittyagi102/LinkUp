const { on } = require("nodemon");

module.exports = (io) => {
  let onlinePeople = [];
  const emailToSocketIdMap = new Map();

  io.on('connection', (socket) => {
    let userData;

    socket.on("initialData", (userDatacame) => {
      userData = userDatacame;
      if (!userData) return;
      if (!onlinePeople.includes(userData.email)) {
        onlinePeople.push(userData.email);
        console.log(userData.name + " is online");
      }
      emailToSocketIdMap.set(userData.email, socket.id);
      io.emit("online-people", onlinePeople);
    });

    socket.on("disconnect", () => {
      if (userData) {
        if (onlinePeople.includes(userData.email)) {
          console.log(userData.name + " is offline");
          const temp = [...onlinePeople];
          temp.splice(userData.email, 1);
          onlinePeople = temp;
          emailToSocketIdMap.delete(userData.email);
        }
        io.emit("online-people", onlinePeople);
      }
    });

    socket.on("send-message", (messageData) => {
      const recipientEmail = messageData.sendto.email;
      const recipientSocketID = emailToSocketIdMap.get(recipientEmail);
      console.log(messageData);
      socket.emit("recieve-message", messageData);
      io.to(recipientSocketID).emit("recieve-message", messageData);
    });

  });
};
