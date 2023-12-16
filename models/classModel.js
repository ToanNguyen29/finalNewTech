const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A class must have a name']
  },
  start_year: {
    type: String,
    required: [true, 'A class must have start year']
  }
});
const Class = mongoose.model('Class', classSchema);

module.exports = Class;
