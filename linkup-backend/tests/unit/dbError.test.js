const userController = require('../../controllers/userController');
const { signup, login, googleLogin } = require('../../controllers/authController');


describe('/user/', () => {



    describe('GET /user/getuser/:email', () => {
        it('should return 500 if there is a database error', async () => {
            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };
            const db = {
                collection: () => ({
                    findOne: () => {
                        throw new Error('db error');
                    },
                })
            };
            const req = {
                params: jest.fn(() =>{email:'email'})
            }

            const controller = userController(db); // Create an instance of the controller using the exported factory function
            await controller.getuser(req, res);
            expect(res.status).toHaveBeenCalledWith(500)


        })




    })
})