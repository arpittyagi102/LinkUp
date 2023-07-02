const { on } = require("nodemon");

module.exports = (io) => {
  let onlinePeople = [];

  io.on('connection', (socket) => {
    let userData;

    socket.on("initialData", (userDatacame) => {
      userData = userDatacame;      
      if(!onlinePeople.includes(userData.email)){
        onlinePeople.push(userData.email);
        console.log(userData.name+" is online");
      }
      io.emit("online-people", onlinePeople);
    });

    socket.on("disconnect", () => {
      if (userData) {
        if(onlinePeople.includes(userData.email)){
          console.log(userData.name+" is offline");
          const temp=[...onlinePeople];
          temp.splice(userData.email,1);
          onlinePeople=temp;
        }
       io.emit("online-people", onlinePeople);
      }
    });
  });
};
