const express = require('express');
const {
  register,
  getEvents,
  chartData
} = require('../controllers/events');

// const checkPatientHealthStatus = require('../controllers/QuarantineStatus');

const router = express.Router();

const { protect } = require('../middleware/auth');

// router.post('/register', register);

router
  .route('/register')
  .post(protect, register)

  router
  .route('/')
  .get(protect, getEvents)

  router
  .route('/chartdata')
  .get(protect, chartData)

module.exports = router;