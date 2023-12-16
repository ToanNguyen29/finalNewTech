const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const Class = require('../models/classModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'mssv',
    'email'
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// exports.deleteMe = catchAsync(async (req, res, next) => {
//   await User.findByIdAndUpdate(req.user.id, { active: false });

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

exports.setMSSV = catchAsync(async (req, res, next) => {
  if (req.body.role === 'student' && !req.body.mssv) {
    if (!req.body.class) {
      return next(new AppError('Please select class', 400));
    }

    if (!req.body.schoolYear) {
      return next(new AppError('Please select schoo year', 400));
    }

    const twoCharFirst = req.body.schoolYear.slice(-2);

    let fourCharLast = '0001';
    const studentFinal = await User.findOne({ role: 'student' })
      .sort({
        createdAt: -1
      })
      .exec();

    if (studentFinal.mssv) {
      const fourdigitLast = studentFinal.mssv.slice(-4);
      const fourdigitLastInt = parseInt(fourdigitLast, 10);
      fourCharLast = (fourdigitLastInt + 1).toString().padStart(4, '0');
    }

    req.body.mssv = `${twoCharFirst}11${fourCharLast}`;
  }

  next();
});

exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User, { path: 'class' });
exports.updateUser = factory.updateOne(User);
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
