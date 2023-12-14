const mongoose = require('mongoose');
const validator = require('validator');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A project must have a name'],
      unique: true,
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
      enum: ['no browse', 'browsed', 'process', 'done'],
      default: 'no browse'
    },
    report: [
      {
        filename: {
          type: String,
          require: true
        }
      }
    ],
    score: {
      type: Number,
      default: 0
    },
    startDate: Date,
    endDate: Date
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
