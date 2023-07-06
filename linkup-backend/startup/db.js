const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
let db;

module.exports = function (app) {
    MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
        .then((client) => {
            console.log("Connected to MongoDB Atlas");
            db = client.db(DB_NAME);

            require('./routes')(db,app)
        })
        .catch((err) => {
            console.error(err);
        });
}
