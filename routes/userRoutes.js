const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const passport = require('passport');

const passportMiddleware = require('../controllers/passportMiddleware');

const router = express.Router();

router.post(
  '/auth/google',
  passport.authenticate('google-plus-token', { session: false }),
  authController.authGoogle
);
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPass);
router.patch('/resetPassword/:token', authController.resetPass);
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// MANAGE LECTURERS
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/lecturers/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// MANAGE STUDENTS
router
  .route('/students')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/students/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
