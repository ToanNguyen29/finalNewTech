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
  .get(taskController.checkTaskOfLecturer, taskController.getTask)
  .patch(taskController.checkTaskOfLecturer, taskController.updateTask)
  .delete(taskController.checkTaskOfLecturer, taskController.deleteTask);

module.exports = router;
