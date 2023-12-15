const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.protect);
router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router.use(
  authController.protect,
  authController.restrictTo('student', 'lecturer', 'HoD')
);
router
  .route('/:id')
  .get(taskController.checkTaskOfUser, taskController.getTask)
  .patch(taskController.checkTaskOfUser, taskController.updateTask)
  .delete(taskController.checkTaskOfUser, taskController.deleteTask);

module.exports = router;
