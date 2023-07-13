const request = require('supertest')
const { MongoClient } = require('mongodb');
require("dotenv").config({ path: "../../.env.test" });
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
describe('/user', () => {
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
    describe("GET /user/:email", () => {
        let fname;
        let email;
        let usercollection;

        beforeEach(async () => {
            fname = "joe";
            email = "email@gmail.com";
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
                .get('/user/getuser/' + email)
                .send()
        }
        it('should return 404 if the user is not found', async () => {
            email = 'invalid@gmail.com';

            const res = await exec();
            expect(res.status).toBe(404)

        })

        it('should return 200 is the user with the email was found', async () => {

            const res = await exec();
            expect(res.status).toBe(200)
        })

    })

    describe("GET /user/getallusers", () => {

        let usercollection;
        let users;

        beforeEach(async () => {

            usercollection = db.collection('users');

            users = [
                {
                    name: "Dummy",
                    email: "email@gmail.com",
                    hashedPassword: "dummy"
                },
                {
                    name: "DummyOne",
                    email: "email1@gmail.com",
                    hashedPassword: "dummy"
                },
                {
                    name: "DummyTwo",
                    email: "email2@gmail.com",
                    hashedPassword: "dummy"
                },
                {
                    name: "DummyThree",
                    email: "email3@gmail.com",
                    hashedPassword: "dummy"
                }
            ]

            await usercollection.insertMany(users);
        })


        afterEach(async () => {
            await usercollection.deleteMany({});
        })

        const exec = async () => {
            return await request(server)
                .get('/user/getallusers/')
                .send()
        }

        it("should return all the users", async () => {
            const res = await exec();
            const body = res.body;


            let isValid = true;
            let i = 0;
            for (i = 0; i < 4; i++) {
                if (users[i]['name'] !== body[i]['name']
                    && users[i]['email'] !== body[i]['email']
                    ){
                    isValid = false;
                    break;
                }
            }

            expect(isValid).toBe(true)


        })

    })



})
