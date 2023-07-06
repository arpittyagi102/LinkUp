
module.exports = function (db,app) {
    const authController = require('../controllers/authController')(db);
    const authRoutes = require('../routes/authRoutes')(authController);

    const userController = require('../controllers/userController')(db);
    const userRoutes = require('../routes/userRoutes')(userController);

    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);

}