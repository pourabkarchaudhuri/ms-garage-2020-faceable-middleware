const express = require('express');
const {
  register
} = require('../controllers/assetManagement');

// const checkPatientHealthStatus = require('../controllers/QuarantineStatus');

const router = express.Router();

const { protect } = require('../middleware/auth');

// router.post('/register', register);

router
  .route('/register')
  .post(protect, register)

//   router
//   .route('/:empId')
//   .get(protect, fetchEmployee)

module.exports = router;