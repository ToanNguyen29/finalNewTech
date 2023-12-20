const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.setPDF = (req, res, next) => {
  if (req.files) {
    const media = req.files.map((file) => ({ filename: file.filename }));
    req.body.report = media;
  } else if (req.file) {
    const media = { filename: req.file.filename };
    req.body.report = media;
  }
  next();
};

exports.setLecturerRegistration = (req, res, next) => {
  if (!req.body.lecturer) {
    req.body.lecturer = req.user._id;
  }
  if (!req.body.status) {
    req.body.status = 'no browse';
  }
  next();
};

exports.setProjectByLecturer = (req, res, next) => {
  if (!req.query.lecturer) {
    req.query.lecturer = req.user._id;
  }
  next();
};

exports.setMajorHoD = catchAsync(async (req, res, next) => {
  const majorOfHoD = await Major.find({ HoD: req.user._id });
  if (!majorOfHoD) {
    return next(new AppError('This major does not exist HoD', 404));
  }

  req.query.major = majorOfHoD._id;
  next();
});

exports.checkProjectOfLecturer = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new AppError('This project does not exist', 404));
  }

  if (
    (project.lecturer &&
      project.lecturer.toString() === req.user._id.toString()) ||
    (project.feedbackLecturer &&
      project.feedbackLecturer.toString() === req.user._id.toString())
  ) {
    next();
  } else {
    return next(
      new AppError('You are not authorized to access this project', 403)
    );
  }
});

exports.checkFeedbackLecturer = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  const studentOfProject = await User.find({ project: project._id });

  if (!studentOfProject) {
    return next(new AppError('Does not exist this project', 404));
  }

  if (studentOfProject.length === 0) {
    return next(new AppError('This project does not have any student', 404));
  }
  if (
    studentOfProject.status === 'no browse' ||
    studentOfProject.status === 'cancel'
  ) {
    return next(new AppError('Project is cancel or no browse', 403));
  }
  next();
});

exports.checkProjectOfStudent = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.project && user.project.toString() === req.params._id.toString()) {
    next();
  } else {
    return next(
      new AppError('You are not authorized to access this project', 403)
    );
  }
  next();
});

exports.getAllProjects = factory.getAll(Project, { path: 'lecturer major' });
exports.getProject = factory.getOne(Project, { path: 'lecturer major' });
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);

// Lecturer
exports.updateProjectLecturer = factory.updateOne(Project, [
  'report',
  'review',
  'score',
  'startDate',
  'endDate',
  'description'
]);

// HoD
exports.browseProject = factory.updateOne(Project, ['status']);
exports.assignFeedBackLecturer = factory.updateOne(Project, [
  'feedbackLecturer'
]);

// Student
exports.registrationProjectStudent = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user.projectWaiting || user.project) {
    return next(new AppError('Can not register more than 1 project', 403));
  }
  const userInProject = await User.find({ project: req.params._id });
  if (!userInProject) {
    return next(new AppError('Do not exist this user in poject', 404));
  }

  if (userInProject.length >= 2) {
    return next(new AppError('This project had enough member', 404));
  } else if (userInProject.length === 1) {
    user.projectWaiting = req.params._id;
  } else {
    user.project = req.params._id;
  }

  await user.save();
  const project = await Project.findById(req.params._id);
  if (!project) {
    return next(new AppError('Do not this project', 404));
  }
  res.status(200).json({
    status: 'success',
    data: project
  });
});

exports.updateProjectStudent = factory.updateOne(Project, ['report']);
