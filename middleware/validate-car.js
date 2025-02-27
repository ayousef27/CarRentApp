const { body, validationResult } = require('express-validator');

const validateCar = [
  body('manufacturer').notEmpty().withMessage('Manufacturer is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 2000 }).withMessage('Year must be 2000 or later'),
  body('plate').notEmpty().withMessage('License plate is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateCar;
