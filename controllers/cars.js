const router = require('express').Router()
// const express = require('express')
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
    req.body.owner = req.session.user._id
    await Car.create(req.body)
    res.redirect('/cars')
  } catch (error) {
    console.error(error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('user')
    if (!car) {
      res.send('There is no car available for rent')
    }
    res.render('cars/show', { car })
  } catch (error) {
    console.error(error)
  }
})

// View car details
router.get('/:carId', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('user')
    if (!car) {
      return res.status(404).send('Car not found')
    }
    res.render('cars/show', { car })
  } catch (error) {
    console.error(error)
  }
})

// router.post('/', async (req, res) => {
//   req.body.owner = req.session.user._id
//   if (req.body.isAvailabile === 'on') {
//     req.body.isAvailabile = true
//   } else {
//     req.body.isAvailabile = false
//   }
//   await Car.create(req.body)
//   res.redirect('/cars')
// })

// router.get('/:carId', async (req, res) => {
//   try {
//     console.log('carId: ', req.params.carId)
//     res.send(`cars show page`)
//   } catch (error) {
//     console.log(error)
//     res.redirect('/')
//   }
// })

module.exports = router
