const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, 'Task can not be empty!']
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'Task must be belong to a project!']
    },
    status: {
      type: String,
      enum: ['assigned', 'process', 'done'],
      default: 'assigned'
    },
    descriptionOfStudent: {
      type: String,
      default: ''
    },
    report: [
      {
        filename: {
          type: String,
          default: ''
        }
      }
    ],
    review: {
      type: String,
      default: ''
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
