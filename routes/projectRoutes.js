const express = require('express');
const projectController = require('../controllers/projectController');
const pdfMiddleware = require('../controllers/pdfMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

// MANAGE PROJECT - LECTURER
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
    authController.restrictTo('lecturer', 'HoD'),
    projectController.checkProjectOfLecturer,
    pdfMiddleware.upload.array('report', 5),
    projectController.setPDF,
    projectController.updateProjectLecturer
  );

// MANAGE PROJECT - HoD
router
  .route('/projectByHoD')
  .get(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD'),
    projectController.setMajorHoD,
    projectController.getAllProjects
  );

router
  .route('/:id/browseProject')
  .patch(
    authController.protect,
    authController.restrictTo('HoD'),
    projectController.browseProject
  )
  .delete(
    authController.protect,
    authController.restrictTo('lecturer', 'HoD'),
    projectController.deleteProject
  );

router
  .route('/:id/feedBackLecturer')
  .patch(
    authController.protect,
    authController.restrictTo('HoD'),
    projectController.checkFeedbackLecturer,
    projectController.assignFeedBackLecturer
  );

// MANAGE PROJECT - Admin
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
