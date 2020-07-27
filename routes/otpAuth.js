const express = require('express');
const {
  getOTP,
  verifyOTP
} = require('../controllers/otpAuth');

// const checkPatientHealthStatus = require('../controllers/QuarantineStatus');

const router = express.Router();

const { protect } = require('../middleware/auth');

// router.post('/register', register);

router
  .route('/get/:empId')
  .get(protect, getOTP)



  router
  .route('/verify')
  .get(protect, verifyOTP)

module.exports = router;