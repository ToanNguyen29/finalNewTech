const express = require('express');
const majorController = require('../controllers/majorController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(majorController.getAllMajors)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    majorController.createMajor
  );

router
  .route('/:id')
  .get(majorController.getMajor)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    majorController.updateMajor
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    majorController.deleteMajor
  );

module.exports = router;
