const express = require('express');
const majorController = require('../controllers/majorController');
const authController = require('../controllers/authController');
const projectRoute = require('./projectRoutes');

const router = express.Router();

router.use('/:majorId/projects', projectRoute);

// router.use(authController.protect);

router
  .route('/')
  .get(majorController.getAllMajors)
  .post(majorController.createMajor);

router
  .route('/:id')
  .get(majorController.getMajor)
  .patch(majorController.updateMajor)
  .delete(majorController.deleteMajor);

module.exports = router;
