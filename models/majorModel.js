const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A major must have a name'],
      unique: true,
      trim: true
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    HoP: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeRegistrationProjectStart: Date,
    timeRegistrationProjectEnd: Date
  },
  { timestamps: true }
);

const Major = mongoose.model('Major', majorSchema);

module.exports = Major;
