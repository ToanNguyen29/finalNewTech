const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const appError = require('../utils/appError');
const User = require('../models/userModel');

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

exports.getAllProjects = factory.getAll(Project, { path: 'lecturer major' });
exports.getProject = factory.getOne(Project, { path: 'lecturer major' });
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);

exports.checkProjectOfUser = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id); //1
  if (!project) {
    //2
    return next(new AppError('This task does not exist', 404)); //3
  }

  if (
    project.lecturer.toString() === req.user._id.toString() ||
    req.user.project.toString() === project._id.toString()
  ) {
    //4
    next(); //5
  } else {
    return next(
      new AppError('You are not authorized to access this task', 403)
    ); //6
  }
});
