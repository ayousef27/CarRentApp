const Car = require('../models/car')

const isCarOwner = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id)
    if (car && car.user.equals(req.session.user._id)) {
      return next()
    }
    res.status(403).send('Forbidden')
  } catch (error) {
    console.error('Authorization Error:', error)
    res.status(500).send('Internal Server Error')
  }
}

module.exports = isCarOwner
