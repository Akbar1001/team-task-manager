const { body, validationResult } = require('express-validator');

// Validation middleware to catch errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation error',
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }
  next();
};

// Signup validation
const validateSignup = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  handleValidationErrors,
];

// Login validation
const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

module.exports = { validateSignup, validateLogin };
