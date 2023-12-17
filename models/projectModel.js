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
          return value === this.lecturer;
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
          default: '1702448079104.pdf'
        }
      }
    ],
    review: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      default: -1
    },
    startDate: Date,
    endDate: Date,
    waiting: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
