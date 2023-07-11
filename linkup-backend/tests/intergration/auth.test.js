const request = require('supertest')
const { MongoClient } = require('mongodb');
require("dotenv").config({ path: "../../.env.test" });
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

describe("/auth", () => {
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


    describe('/auth/signup', () => {
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
            return await request(server).post('/auth/signup').send({
                fname: fname,
                lname: "Doe",
                email: email,
                password: "12345"
            })
        }

        
        



        it('should return 400 if all the fields are not specified', async () => {
            fname = '';
            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 409 if user with that email already exists', async () => {
            email = "email@gmail.com";

            const res = await exec();

            expect(res.status).toBe(409)

        })
        it('should return the dummy user if email already exists', async () => {
            email = "email@gmail.com";

            const res = await exec();
            const user = await usercollection.findOne({ email: email })

            expect(user).toHaveProperty('fname', "Dummy")
            expect(user).toHaveProperty('lname', "dummy")
            expect(user).toHaveProperty('email', "email@gmail.com")
        })

        it("should return 200 if the user is inserted into the database", async () => {
            const res = await exec()
            const newUser = await usercollection.findOne({ email: email })
            expect(res.status).toBe(200);
            expect(newUser.email).toBe(email)
        })


    })

    describe('/auth/login', () => {
        let email;
        let password;

       
        beforeEach(async () => {
      
            email = "hello@gmail.com";
            password = 'dummy';
            usercollection = db.collection('users');

            const hashedPassword = await bcrypt.hash("dummy", 10)
            const dummyUser = {
                fname: "Dummy",
                lname: "dummy",
                email: "email@gmail.com",
                hashedPassword: hashedPassword
            }
            await usercollection.insertOne(dummyUser);
        })
        
        
        afterEach(async () => {
            await usercollection.deleteMany({});
        })

        const exec = async () => {
             return await request(server)
             .post('/auth/login')
             .send({
                email:email,
                password:password
             })
        }

        it('should return 400 if email is not specified' , async () => {
            email =''

            const res = await exec();

            expect(res.status).toBe(400)
        })

        it('should return 400 if password is not specified' , async () => {
            password =''

            const res = await exec();
            expect(res.status).toBe(400)
        
        })

        


    })
})