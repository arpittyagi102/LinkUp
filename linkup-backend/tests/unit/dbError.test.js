const userController = require('../../controllers/userController');
const { signup, login, googleLogin } = require('../../controllers/authController');


describe('/user/', () => {
    let res;
    let db;
    let req;
    let controller;

    beforeEach(() => {
        res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        db = {
            collection: () => { throw new Error("Database error") }
        };

        req = {
            params: jest.fn(() => { email: 'email' })
        }

        controller = userController(db);
    })

    describe('GET /user/getuser/:email', () => {
        it('should return 500 if there is a database error', async () => {
            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };
    describe("POST /auth/signup", () => {
        let res;
        let db;
        let req;


        beforeEach(() => {
            res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            db = {
                collection: jest.fn().mockReturnValue(
                    { findOne: () => { throw new Error("Database error") } }
                )
            };

            req = {
                body: {
                    fname: 'fname',
                    lname: 'lname',
                    email: 'email',
                    password: 'password'
                }
            }

        })

        it('should return 500 if there is a database error', async () => {
            const controller = authController(db);
            await controller.signup(req, res);
            expect(res.status).toHaveBeenCalledWith(500)
        }
        )
    })


        })




    })
})