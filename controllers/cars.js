const router = require('express').Router()
//import model
const User = require('../models/user')
const Car = require('../models/car')
const isCarOwner = require('../middleware/is-car-owner')
const validateCar = require('../middleware/validate-car')
const upload = require('../middleware/upload')

router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().populate('user')
    console.log(cars)
    res.render('cars/index.ejs', { cars })
  } catch (error) {
    console.error(error)
  }
})

router.get('/new', async (req, res) => {
  res.render('cars/new.ejs')
})

router.post('/', upload, validateCar, async (req, res) => {
  try {
    req.body.image = req.file.filename
    req.body.user = req.session.user._id
    req.body.image = req.file.filename
    await Car.create(req.body)
    res.redirect('/cars')
  } catch (error) {
    console.error(error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('user')
    res.render('cars/show', { car })
  } catch (error) {
    console.error(error)
  }
})

// View car details
router.get('/:carId', async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId).populate('user')
    if (!car) {
      return res.status(404).send('Car not found')
    }
    res.render('cars/show', { car })
  } catch (error) {
    console.error(error)
  }
})

router.get('/:carId/edit', isCarOwner, async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId)
    res.render('cars/edit', { car })
  } catch (error) {
    console.error(error)
  }
})

router.put('/:carId', isCarOwner, upload, validateCar, async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.carId,
      {
        ...req.body,
        image: req.file ? req.file.filename : undefined
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!updatedCar) {
      return res.status(404).send('Car not found')
    }

    res.redirect(`/cars/${updatedCar._id}`)
  } catch (error) {
    console.error('Error updating car:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Delete car listing
router.delete('/:carId', isCarOwner, async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId)
    await Car.findByIdAndDelete(req.params.carId)
    res.redirect('/cars')
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
