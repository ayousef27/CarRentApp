const router = require('express').Router()
// const express = require('express')
//import model
const User = require('../models/user')
const Car = require('../models/car')

router.get('/', async (req, res) => {
  const cars = await Car.find().populate('user')
  console.log(cars)
  res.render('cars/index.ejs', { cars })
})

router.get('/new', async (req, res) => {
  res.render('cars/new.ejs')
})

router.post('/', async (req, res) => {
  req.body.owner = req.session.user._id
  if (req.body.isAvailabile === 'on') {
    req.body.isAvailabile = true
  } else {
    req.body.isAvailabile = false
  }
  await Car.create(req.body)
  res.redirect('/cars')
})

router.get('/:carId', async (req, res) => {
  try {
    console.log('carId: ', req.params.carId)
    res.send(`cars show page`)
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})
// router.post('/cars', async (req, res) => {

// })

module.exports = router
