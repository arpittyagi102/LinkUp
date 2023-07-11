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
        it('should return 400 if the fields are not specified', async () => {
            fname ='';
            const res = await exec()

            expect(res.status).toBe(400 )
        })
