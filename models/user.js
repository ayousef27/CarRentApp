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
    }
  },
  {
    timestamps: true
  }
)

const carSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2000
  },
  plate: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isAvailabile: {
    type: Boolean,
    required: true
  },
  user: [userSchema]
})
const User = mongoose.model('User', userSchema)
module.exports = User
const Car = mongoose.model('Car', carSchema)
module.exports = Car
