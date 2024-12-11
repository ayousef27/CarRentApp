const router = require('express').Router()
const Rental = require('../models/rental')
const Car = require('../models/car')
const isSignedIn = require('../middleware/is-signed-in')
const validateRental = require('../middleware/validate-rental')
//showing the rental form
router.get('/rent/:carId', isSignedIn, async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId)
    if (!car || !car.availability) {
      return res.status(400).send('Car is not available! Sorry.')
    }
    res.render('rentals/rent', { car })
  } catch (error) {
    console.error(error)
  }
})
//posting the renting form to the database
router.post('/rent/:carId', isSignedIn, validateRental, async (req, res) => {
  try {
    const { startDate, endDate } = req.body
    const userId = req.session.user._id
    const car = await Car.findById(req.params.carId)
    if (!car || !car.availability) {
      return res.status(400).send('Car not available')
    }
    //Cannot rent the car if the current user and the car owner is same
    if (String(car.user) === String(userId)) {
      return res.status(400).send('You cannot rent your own car.')
    }
    const rentalDays =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    const totalCost = car.price * rentalDays
    const rental = new Rental({
      user: userId,
      car: req.params.carId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalCost: totalCost
    })
    await rental.save()
    car.availability = false
    await car.save()
    res.redirect('/rentals')
  } catch (error) {
    console.error('Error creating rental:', error)
  }
})
//get all the current user rented cars
router.get('/', isSignedIn, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.session.user._id }).populate(
      'car'
    )
    console.log('rentals', rentals)
    res.render('rentals/index', { rentals })
  } catch (error) {
    console.error(error)
  }
})
//Canceling a rental
router.delete('/:id', isSignedIn, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id).populate('car')
    if (!rental) {
      return res.status(404).send('No rental found')
    }
    if (!rental.user.equals(req.session.user._id)) {
      return res.status(403).send('Forbidden')
    }
    const car = await Car.findById(rental.car._id)
    car.availability = true
    //before saving we are changing the availability status
    await car.save()
    await Rental.findByIdAndDelete(req.params.id)
    res.redirect('/rentals')
  } catch (error) {
    console.error('Error cancelling rental:', error)
  }
})
module.exports = router
