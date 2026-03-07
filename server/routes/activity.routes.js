const express = require('express');
const {
  createActivity,
  getActivitiesByTripAndDay,
  getActivityById,
  updateActivity,
  deleteActivity
} = require('../controllers/activity.controller');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.use(verifyToken);

router.get('/:tripId/:day', checkRole(['owner', 'editor', 'viewer'], 'tripId'), getActivitiesByTripAndDay);
router.post('/:tripId/:day', checkRole(['owner', 'editor'], 'tripId'), createActivity);
router.get('/:id', getActivityById);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;

