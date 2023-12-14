const express = require('express');
const projectController = require('../controllers/projectController');
const pdfMiddleware = require('../controllers/pdfMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

// MANAGE PROJECT
router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(
    pdfMiddleware.upload.array('report', 5),
    projectController.setPDF,
    projectController.updateProject
  )
  .delete(projectController.deleteProject);

module.exports = router;
