const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const User = require('../models/user-model');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const facebookAuth = require('./facebook-auth');
const reminderService = require('../services/reminder-service'); 
const adminController = require('../controllers/admin-controller');
const roleMiddleware = require('../middlewares/role-middleware');


router.use('/auth/facebook', (req, res, next) => {
  console.log('Received request to /auth/facebook');
  next();
}, facebookAuth);


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.post('/refresh', userController.refresh);
router.get('/profile', authMiddleware, userController.getProfile); 
router.get('/users', authMiddleware, userController.getAllUsers);
router.post('/set-study-date', authMiddleware, userController.setStudyDate);
router.get('/admin/students', authMiddleware, roleMiddleware('admin'), adminController.getStudents);
router.put('/admin/students/:id', authMiddleware, roleMiddleware('admin'), adminController.updateStudent);


router.post('/test-send-reminder', async (req, res) => {
  try {
      console.log('Received request:', req.body);
      const user = await User.findById('66aa1a1c29362b32002b651c'); 
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      console.log('User found:', user.email);
      await reminderService.sendReminderEmail(user, req.body.daysBefore);
      res.status(200).json({ message: 'Test reminder sent' });
  } catch (err) {
      console.error('Error in /test-send-reminder:', err);
      res.status(500).json({ message: 'Error sending test reminder' });
  }
});

module.exports = router;
