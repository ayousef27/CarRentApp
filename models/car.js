const mongoose = require('mongoose')
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
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    type: Boolean,
    required: true
  },
  user: [userSchema]
})

const Car = mongoose.model('Car', carSchema)
module.exports = Car
