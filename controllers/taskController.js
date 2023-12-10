const Task = require('../models/taskModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.setProjectLecturer = (req, res, next) => {
  if (!req.body.project) req.body.project = req.params.projectId;
  if (!req.body.lecturer) req.body.lecturer = req.user.id;
  next();
};

exports.getAllTasks = factory.getAll(Task);
exports.getTask = factory.getOne(Task);
exports.createTask = factory.createOne(Task);
exports.updateTask = factory.updateOne(Task);
exports.deleteTask = factory.deleteOne(Task);
