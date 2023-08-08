const { on } = require("nodemon");

module.exports = (io, db) => {
  const allusers = db.collection('users');
  console.log("fdrom socker", allusers)
  let onlinePeople = [];
  const emailToSocketIdMap = new Map();

  io.on('connection', (socket) => {
    let userData;

    socket.on("initialData", async(userDatacame) => {
      userData = userDatacame;
      if (!userData) return;
      if (!userData.lastSeen) {
        userData.lastSeen = new Date();
        // Update the lastSeen field in the database
        try {
          await db.collection("users").updateOne(
            { email: userData.email },
            { $set: { lastSeen: userData.lastSeen } }
          );
        } catch (error) {
          console.error("Error updating last seen:", error);
        }
      }
      if (!onlinePeople.includes(userData.email)) {
        onlinePeople.push(userData.email);
        console.log(userData.name + " is online");
        console.log(emailToSocketIdMap);
      }
      emailToSocketIdMap.set(userData.email, socket.id);
      io.emit("online-people", onlinePeople);
    });

    socket.on("disconnect", async () => {
      if (userData) {
        if (onlinePeople.includes(userData.email)) {
          //last seen
          try {
            await db.collection("users").updateOne(
              { email: userData.email },
              { $set: { lastSeen: new Date() } }
            );
            console.log(userData.email + " is offline");
          } catch (error) {
            console.error("Error updating last seen:", error);
          }
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
      //console.log(messageData);
      socket.emit("recieve-message", messageData);
      io.to(recipientSocketID).emit("recieve-message", messageData);
    });

  });
};
