const express = require('express');
const notificationController = require('../controllers/notificationController');
const pdfMiddleware = require('../controllers/pdfMiddleware');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(notificationController.getAllNotifications)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    pdfMiddleware.upload.array('file', 5),
    notificationController.setPDF,
    notificationController.createNotification
  );

router
  .route('/:id')
  .get(notificationController.getNotification)
  .patch(
    pdfMiddleware.upload.array('file', 5),
    notificationController.setPDF,
    notificationController.updateNotification
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    notificationController.deleteNotification
  );

module.exports = router;
