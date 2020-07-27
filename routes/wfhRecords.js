const express = require('express');
const {
  getWfhStatus,
  enableWfh,
  sendEmail,
  getWfhRecords,
  update,
  deleteRecords,
  approveDeny
} = require('../controllers/wfhRecords');

// const checkPatientHealthStatus = require('../controllers/QuarantineStatus');

const router = express.Router();

const { protect } = require('../middleware/auth');

// router.post('/register', register);

router
  .route('/')
  .get(protect, getWfhRecords)

router
  .route('/status/:deviceName')
  .get(protect, getWfhStatus)



  router
  .route('/enable')
  .post(protect, enableWfh)

  router
  .route('/sendemail')
  .post(protect, sendEmail)

  router
  .route('/update')
  .put(protect, update)

  router
  .route('/')
  .delete(protect, deleteRecords)

  router
  .route('/approvedeny')
  .put(protect, approveDeny)



module.exports = router;