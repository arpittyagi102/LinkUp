const request = require('supertest')
const { MongoClient } = require('mongodb');
require("dotenv").config({ path: "../../.env.test" });
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
describe('/auth', () => {
    let server;
    let db;
    let connection;


    beforeEach(async () => {
        connection = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
        db = connection.db(DB_NAME);
        server = require('../../app');
    })

    afterEach(async () => {
        server.close()
        await connection.close();

    })
    describe("/getuser/:email", () => {
        let fname;
        let email;
        let usercollection;

        beforeEach(async () => {
            fname = "joe";
            email = "hello@gmail.com";
            usercollection = db.collection('users');


            const dummyUser = {
                fname: "Dummy",
                lname: "dummy",
                email: "email@gmail.com",
                hashedPassword: "dummy"
            }
            await usercollection.insertOne(dummyUser);
        })


        afterEach(async () => {
            await usercollection.deleteMany({});
        })

        const exec = async () => {
            return await request(server)
                .post('/getuser/' + email)
                .send()
        }
        it('should return 404 if the user is not found', async () => {
            email = 'invalid@gmail.com';

            const res = await exec();
            expect(res.status).toBe(404)

        })








    })




})
