const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');
const taskRouter = require('./../routes/taskRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:projectId/tasks', taskRouter);

// MANAGE PROJECT
router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.setMajortLecturer, projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
