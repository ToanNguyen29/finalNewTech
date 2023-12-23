const mongoose = require('mongoose');
const validator = require('validator');

const majorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A major must have a name'],
      trim: true
    },
    description: {
      type: String
    },
    HoD: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeRegistrationProjectStart: {
      type: Date,
      default: Date.now
    },
    timeRegistrationProjectEnd: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value) {
          return (
            value.format('%Y-%m-%d %H:%M:%').toString() >
            this.timeRegistrationProjectStart
              .format('%Y-%m-%d %H:%M:%')
              .toString()
          );
        },
        message: 'Time end must greater than or equal time start'
      }
    }
  },
  { timestamps: true }
);

const Major = mongoose.model('Major', majorSchema);

module.exports = Major;
