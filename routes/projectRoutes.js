const express = require('express');
const projectController = require('../controllers/projectController');
const pdfMiddleware = require('../controllers/pdfMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

// MANAGE PROJECT - LECTURER AND HOD
router
  .route('/projectByLecturer')
  .get(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD'),
    projectController.setProjectByLecturer,
    projectController.getAllProjects
  )
  .post(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD'),
    projectController.setLecturerRegistration,
    projectController.createProject
  );

router
  .route('/:id/projectByLecturer')
  .patch(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD', 'student'),
    projectController.checkProjectOfUser,
    pdfMiddleware.upload.array('report', 5),
    projectController.setPDF,
    projectController.updateProject
  )
  .delete(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD', 'student'),
    projectController.checkProjectOfUser,
    projectController.deleteProject
  );

// MANAGE PROJECT
router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getDetailProject)
  .patch(
    pdfMiddleware.upload.array('report', 5),
    projectController.setPDF,
    projectController.updateProject
  )
  .delete(projectController.deleteProject);

module.exports = router;
