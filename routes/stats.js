const express = require('express');
const {
    getStats
} = require('../controllers/stats');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
    .route('/')
    .get(protect, getStats)



module.exports = router;