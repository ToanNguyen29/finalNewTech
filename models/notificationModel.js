const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },
    content: {
      type: String
    },
    file: [
      {
        filename: {
          type: String,
          default: ''
        }
      }
    ]
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
