const mongoose = require('mongoose')
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
     image: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)
module.exports = User