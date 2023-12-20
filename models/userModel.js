const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    mssv: {
      type: String,
      trim: true
    },
    schoolYear: {
      type: String
    },
    major: { type: Schema.Types.ObjectId, ref: 'Major' },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    projectWaiting: { type: Schema.Types.ObjectId, ref: 'Project' },
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true
    },
    role: {
      type: String,
      enum: ['student', 'guest', 'lecturer', 'admin', 'HoD'],
      default: 'guest'
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      select: false
    },
    authGoogleId: {
      type: String,
      default: null
    },
    authType: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (value) {
          const phoneRegex = /^0\d{9}$/;
          return phoneRegex.test(value);
        },
        message: 'Invalid phone number format'
      }
    },
    address: {
      type: String
    },
    birthday: {
      type: Date,
      required: [true, 'Please provide birthday']
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords are not the same'
      }
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    DateChangePass: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.authType.toString() !== 'local') {
    next();
  }
  // Kiểm tra xem mật khẩu có thay đổi không nếu không thì không cần mã hóa
  if (!this.isModified('password')) return next();

  // Có thay đổi thì mã hóa bằng bcrypt with cost 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (this.authType.toString() !== 'local') {
    next();
  }
  // Nếu không có thay đổi mật khẩu trong đối tượng hoặc đối tượng này là đối tượng mới thì next()
  if (!this.isModified('password') || this.isNew) return next();
  // Nếu không thỏa điều trên có nghĩa là đối tượng vừa thay đổi password nên ta sẽ update thời gian đổi password
  this.DateChangePass = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPass = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkChangePassword = function (JWTTimeStampo) {
  if (this.DateChangePass) {
    const changedTimeStamp = parseInt(this.DateChangePass.getTime() / 1000);
    return JWTTimeStampo < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPassResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
