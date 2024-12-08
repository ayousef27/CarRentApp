const router = require('express').Router()
const { application } = require('express')
//import model
const User = require('../models/user')
const Car = require('../models/car')
router.get('/', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  res.render('cars/index.ejs', {
    cars: currentUser.cars
  })
})

//async because we will do database operation here
router.get('/new', async (req, res) => {
  res.render('cars/new.ejs')
})
module.exports = router
