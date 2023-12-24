const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

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

router.use(
  authController.protect,
  authController.restrictTo('lecturer', 'HoD')
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
    taskController.updateTaskStudent
  );

module.exports = router;
