const Notification = require('../models/notificationModel');
const factory = require('./handlerFactory');

exports.getAllNotifications = factory.getAll(Notification);
exports.getNotification = factory.getOne(Notification);
exports.createNotification = factory.createOne(Notification);
exports.updateNotification = factory.updateOne(Notification);
exports.deleteNotification = factory.deleteOne(Notification);

exports.setPDF = (req, res, next) => {
  if (req.files) {
    const media = req.files.map((file) => ({ filename: file.filename }));
    req.body.file = media;
  } else if (req.file) {
    const media = { filename: req.file.filename };
    req.body.file = media;
  }
  next();
};
