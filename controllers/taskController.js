const Task = require('../models/taskModel');
const factory = require('./handlerFactory');
const Project = require('../models/projectModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.checkTaskOfLecturer = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new AppError('This task does not exist', 404));
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return next(new AppError('This task does not belong to any project', 404));
  }

  if (
    !project.lecturer ||
    project.lecturer.toString() === req.user._id.toString()
  ) {
    next();
  } else {
    return next(
      new AppError('You are not authorized to access this task', 403)
    );
  }
});

exports.checkTaskOfStudent = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new AppError('This task does not exist', 404));
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return next(new AppError('This task does not belong to any project', 404));
  }

  if (
    !req.user.project ||
    req.user.project.toString() === project._id.toString()
  ) {
    next();
  } else {
    return next(
      new AppError('You are not authorized to access this task', 403)
    );
  }
});

exports.checkCreateTask = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.body.project);
  if (!project) {
    return next(new AppError('Do not exist this project', 404));
  }

  if (
    !project.lecturer ||
    project.lecturer.toString() === req.user._id.toString()
  ) {
    next();
  } else {
    return next(
      new AppError('You are not authorized to access this task', 403)
    );
  }
});

// MANAGE TASK - LECTURER AND HOD
exports.getAllTasks = factory.getAll(Task);
exports.getTask = factory.getOne(Task);
exports.createTask = factory.createOne(Task);
exports.updateTask = factory.updateOne(Task);
exports.deleteTask = factory.deleteOne(Task);

// MANAGE TASK - STUDENT
exports.updateTaskStudent = factory.updateOne(Task, [
  'report',
  'descriptionOfStudent'
]);
