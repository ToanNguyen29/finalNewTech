const express = require('express');
const ClassController = require('../controllers/classController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(ClassController.getAllClasses)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    ClassController.createClass
  );

router
  .route('/:id')
  .get(ClassController.getClass)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    ClassController.updateClass
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    ClassController.deleteClass
  );

module.exports = router;
