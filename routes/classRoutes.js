const express = require('express');
const ClassController = require('../controllers/classController');

const router = express.Router();

router
  .route('/')
  .get(ClassController.getAllClasses)
  .post(ClassController.createClass);

router
  .route('/:id')
  .get(ClassController.getClass)
  .patch(ClassController.updateClass)
  .delete(ClassController.deleteClass);

module.exports = router;
