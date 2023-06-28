const mongoose = require('mongoose');
const { Schema } = mongoose

const UserDB = mongoose.model(
  'UserDB',
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
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    funcao: {
      type: String,
      required: true,
    }
    
  }, {timestamps: true}),
)

module.exports = UserDB