const request = require('supertest')
const { MongoClient } = require('mongodb');
require("dotenv").config({ path: "../../.env.test" });

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

describe("/auth", () => {
    let server;
    let db;
    let connection;

  
    beforeEach(async() => {
        connection = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
        db = connection.db(DB_NAME);
        server = require('../../app');
    })

    afterEach( async() => {
        server.close()
 await connection.close();
    })
    describe('/auth/signup', () => {
        it("should return the dummy user we entered", async () => {
            const dummyUser = await usercollection.findOne({fname:"Dummy"})

            expect(dummyUser).toMatchObject({
                fname: "Dummy",
                lname: "EVes",
                email: "email@gmail.com",
                password: "12345"
            })

        })
            const res = await exec()

        it('should return 409 if user with that email already exists', async () => {
            email = "email@gmail.com";

            const res = await exec();

            expect(res.body).toBe(409)

        })
        })
