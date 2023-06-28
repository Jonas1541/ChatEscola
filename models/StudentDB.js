const mongoose = require('mongoose');
const { Schema } = mongoose

const StudentDB = mongoose.model(
  'StudentDB',
  new Schema({
    id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
    },

    parent:{
        type:String,
        required: true,
    }
  }, {timestamps: true}),
)

module.exports = StudentDB