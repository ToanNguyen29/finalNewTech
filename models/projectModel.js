const mongoose = require('mongoose');
const validator = require('validator');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A project must have a name'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    schoolYear: {
      type: String,
      required: [true, 'A project must have school year']
    },
    major: { type: mongoose.Schema.Types.ObjectId, ref: 'Major' },
    lecturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    feedbackLecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: function (value) {
          return value !== this.lecturer;
        },
        message: 'Lecturer and feedback lecturer are the same'
      }
    },
    status: {
      type: String,
      enum: ['no browse', 'browsed', 'process', 'done', 'cancel'],
      default: 'browsed'
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
    score: {
      type: Number,
      default: -1,
      validate: {
        validator: function (value) {
          return value === -1 || (value >= 0 && value <= 10);
        },
        message: 'Invalid score value'
      }
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

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
