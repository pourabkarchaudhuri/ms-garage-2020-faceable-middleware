const express = require('express');
const {
  register
} = require('../controllers/employee');

// const checkPatientHealthStatus = require('../controllers/QuarantineStatus');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/register', register);
// router.post('/login', login);

module.exports = router;