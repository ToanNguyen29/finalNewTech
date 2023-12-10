const Major = require('../models/majorModel');
const factory = require('./handlerFactory');

exports.getAllMajors = factory.getAll(Major);
exports.getMajor = factory.getOne(Major, { path: 'projects students' });
exports.createMajor = factory.createOne(Major);
exports.updateMajor = factory.updateOne(Major);
exports.deleteMajor = factory.deleteOne(Major);
