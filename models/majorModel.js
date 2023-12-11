const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A major must have a name'],
      unique: true,
      trim: true
    },
    HoP: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeRegistrationProjectStart: Date,
    timeRegistrationProjectEnd: Date
  },
  { timestamps: true }
);

const Major = mongoose.model('Major', majorSchema);

module.exports = Major;
