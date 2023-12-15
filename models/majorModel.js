const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A major must have a name'],
      unique: true,
      trim: true
    },
    description: {
      type: String
    },
    HoP: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeRegistrationProjectStart: {
      type: Date,
      default: Date.now
    },
    timeRegistrationProjectEnd: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Major = mongoose.model('Major', majorSchema);

module.exports = Major;
