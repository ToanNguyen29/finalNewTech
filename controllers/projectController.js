const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
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

exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project, { path: 'tasks' });
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);

exports.checkProjectOfUser = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new AppError('Do not exist this task', 404));
  }

  if (project.lecturer.toString() == req.user._id.toString()) {
    next();
  }

  if (req.user.project.toString() === project._id.toString()) {
    next();
  }
});
