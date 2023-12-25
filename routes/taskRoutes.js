const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');
const pdfMiddleware = require('../controllers/pdfMiddleware');

const router = express.Router();

// router.use(authController.protect);
router
  .route('/')
  .get(taskController.getAllTasks)
  .post(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD'),
    taskController.checkCreateTask,
    taskController.createTask
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD'),
    taskController.checkTaskOfLecturer,
    taskController.getTask
  )
  .patch(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD'),
    taskController.checkTaskOfLecturer,
    pdfMiddleware.upload.array('report', 5),
    taskController.setPDF,
    taskController.updateTask
  )
  .delete(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD'),
    taskController.checkTaskOfLecturer,
    taskController.deleteTask
  );

// MANAGE TASK - STUDENT
router
  .route('/:id/taskByStudent')
  .patch(
    authController.protect,
    authController.restrictTo('student'),
    taskController.checkTaskOfStudent,
    pdfMiddleware.upload.array('report', 5),
    taskController.setPDF,
    taskController.updateTaskStudent
  );

module.exports = router;
