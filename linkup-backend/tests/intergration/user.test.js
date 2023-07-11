const request = require('supertest')
const { MongoClient } = require('mongodb');
require("dotenv").config({ path: "../../.env.test" });
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;