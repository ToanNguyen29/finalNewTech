const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.setMajortLecturer = (req, res, next) => {
  if (!req.body.project) req.body.major = req.params.majorId;
  if (!req.body.lecturer) req.body.lecturer = req.user.id;
  next();
};

exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project, { path: 'tasks' });
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);
