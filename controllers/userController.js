const User = require('./../models/userModel');
const Project = require('./../models/projectModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const { filterObj } = require('./handlerFactory');

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
    const studentFinal = await User.findOne({
      role: 'student',
      mssv: { $regex: `^${twoCharFirst}` }
    })
      .sort({ createdAt: -1 })
      .exec();

    if (studentFinal) {
      const fourdigitLast = studentFinal.mssv.slice(-4);
      const fourdigitLastInt = parseInt(fourdigitLast, 10);
      fourCharLast = (fourdigitLastInt + 1).toString().padStart(4, '0');
    }

    req.body.mssv = `${twoCharFirst}11${fourCharLast}`;
  }
  next();
});

exports.browseProjectMember = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('Do not exist this user', 404));
  }

  if (!user.projectWaiting) {
    return next(new AppError('This user is not waiting to join project', 404));
  }

  user.project = user.projectWaiting;
  user.projectWaiting = '';
  await user.save();

  const project = await Project.findById(user.project);
  if (!project) {
    return next(new AppError('Do not exist this project', 404));
  }
  res.status(204).json({
    status: 'success',
    data: project
  });
});

exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User, { path: 'class' });
exports.updateUser = factory.updateOne(User);

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false }); //1

  res.status(204).json({
    status: 'success',
    data: null
  }); //2
});
