const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, 'Task can not be empty!']
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project'
    },
    lecturer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['assigned', 'process', 'done'],
      default: 'assigned'
    },
    startDate: Date,
    endDate: Date
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
