const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:3000", "https://getlinkup.vercel.app", "https://sendgrid.api-docs.io"],
};

module.exports = function (app) {

    console.log(cors(corsOptions))

    app.use(cors(corsOptions));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
        next();
    });

} 