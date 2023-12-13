const express = require('express');
const NotificationController = require('../controllers/notificationController');
const pdfMiddleware = require('../controllers/pdfMiddleware');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(NotificationController.getAllNotifications)
  .post(
    pdfMiddleware.upload.array('file', 5),
    NotificationController.setPDF,
    NotificationController.createNotification
  );

router
  .route('/:id')
  .get(NotificationController.getNotification)
  .patch(NotificationController.updateNotification)
  .delete(NotificationController.deleteNotification);

module.exports = router;
