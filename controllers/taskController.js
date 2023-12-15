const Task = require('../models/taskModel');
const factory = require('./handlerFactory');
const Project = require('../models/projectModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

exports.getAllTasks = factory.getAll(Task);
exports.getTask = factory.getOne(Task);
exports.createTask = factory.createOne(Task);
exports.updateTask = factory.updateOne(Task);
exports.deleteTask = factory.deleteOne(Task);

exports.checkTaskOfUser = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new appError('Do not exist this task', 404));
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return next(new appError('Task does not belong to any project', 404));
  }

  if (project.lecturer.toString() == req.user._id.toString()) {
    next();
  }

  if (req.user.project.toString() === project._id.toString()) {
    next();
  }
});
