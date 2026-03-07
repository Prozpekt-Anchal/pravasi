const express = require('express');
const {
  createChecklist,
  getChecklistsByTrip,
  getChecklistById,
  updateChecklist,
  deleteChecklist,
  toggleChecklistItem
} = require('../controllers/checklist.controller');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.use(verifyToken);

router.post('/', createChecklist);
router.get('/trip/:tripId', checkRole(['owner', 'editor', 'viewer'], 'tripId'), getChecklistsByTrip);
router.get('/:id', getChecklistById);
router.put('/:id', updateChecklist);
router.delete('/:id', deleteChecklist);
router.patch('/:id/items/:itemId/toggle', toggleChecklistItem);

module.exports = router;

