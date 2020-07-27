const express = require('express');
const {
  register,
  fetchEmployee,
  trainEmployee,
  recognize
} = require('../controllers/employee');

// const checkPatientHealthStatus = require('../controllers/QuarantineStatus');

const router = express.Router();

const { protect } = require('../middleware/auth');

// router.post('/register', register);

router
  .route('/register')
  .post(protect, register)

  router
  .route('/:empId')
  .get(protect, fetchEmployee)

  router
  .route('/train')
  .post(protect, trainEmployee)

  router
  .route('/recognize')
  .post(protect, recognize)

module.exports = router;