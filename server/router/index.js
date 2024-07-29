const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const facebookAuth = require('./facebook-auth'); // Додано

router.use('/auth/facebook', (req, res, next) => {
  console.log('Received request to /auth/facebook');
  next();
}, facebookAuth); // Додано

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/profile', authMiddleware, userController.getProfile); 
router.get('/users', authMiddleware, userController.getAllUsers);

module.exports = router;
