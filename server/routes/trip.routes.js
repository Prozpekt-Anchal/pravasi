const express = require('express');
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  inviteMember
} = require('../controllers/trip.controller');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.use(verifyToken);

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.put('/:id', checkRole(['owner', 'editor']), updateTrip);
router.delete('/:id', checkRole(['owner']), deleteTrip);
router.post('/:id/invite', checkRole(['owner']), inviteMember);

module.exports = router;

